import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  NativeModules,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

interface Gasto {
  id: string;
  valor: number;
  titulo: string;
  descricao: string;
  pacoteOrigem: string;
  dataHora: number;
  status: string;
}

interface HistoricoScreenProps {
  onVoltar: () => void;
}

const {GastoModule} = NativeModules;

function HistoricoScreen({onVoltar}: HistoricoScreenProps) {
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const carregarGastos = useCallback(async () => {
    try {
      setCarregando(true);
      setErro('');

      if (!GastoModule) {
        throw new Error('GastoModule não está disponível.');
      }

      const resultado: Gasto[] =
        await GastoModule.listarGastos();

      const gastosOrdenados = [...resultado].sort(
        (a, b) => b.dataHora - a.dataHora,
      );

      setGastos(gastosOrdenados);
    } catch (error) {
      console.error(
        'Erro ao carregar gastos:',
        error,
      );

      setErro(
        'Não foi possível carregar o histórico de gastos.',
      );
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarGastos();
  }, [carregarGastos]);

  function formatarValor(valor: number) {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  function formatarData(dataHora: number) {
    const data = new Date(dataHora);

    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  function formatarHora(dataHora: number) {
    const data = new Date(dataHora);

    return data.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={onVoltar}>
          <Text style={styles.backButtonText}>
            ← Voltar
          </Text>
        </Pressable>

        <Text style={styles.title}>
          Histórico de Gastos
        </Text>

        <View style={styles.headerSpace} />
      </View>

      {carregando ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>
            Carregando gastos...
          </Text>
        </View>
      ) : erro ? (
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>
            {erro}
          </Text>

          <Pressable
            style={styles.retryButton}
            onPress={carregarGastos}>
            <Text style={styles.retryButtonText}>
              Tentar novamente
            </Text>
          </Pressable>
        </View>
      ) : gastos.length === 0 ? (
        <View style={styles.centerContent}>
          <Text style={styles.emptyTitle}>
            Nenhum gasto registrado
          </Text>

          <Text style={styles.emptyText}>
            Os gastos identificados pelas notificações
            aparecerão aqui.
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.listContent}>
          <Text style={styles.totalRecords}>
            {gastos.length}{' '}
            {gastos.length === 1
              ? 'gasto registrado'
              : 'gastos registrados'}
          </Text>

          {gastos.map(gasto => (
            <View
              key={gasto.id}
              style={styles.expenseCard}>
              <View style={styles.expenseHeader}>
                <Text style={styles.expenseTitle}>
                  {gasto.titulo.trim() ||
                    'Gasto registrado'}
                </Text>

                <Text style={styles.expenseValue}>
                  {formatarValor(gasto.valor)}
                </Text>
              </View>

              <Text style={styles.expenseDescription}>
                {gasto.descricao}
              </Text>

              <View style={styles.expenseFooter}>
                <Text style={styles.expenseDate}>
                  {formatarData(gasto.dataHora)} às{' '}
                  {formatarHora(gasto.dataHora)}
                </Text>

                <Text style={styles.expenseStatus}>
                  {gasto.status}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  header: {
    minHeight: 70,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },

  backButton: {
    width: 80,
    paddingVertical: 12,
  },

  backButtonText: {
    color: '#3F6B3A',
    fontSize: 12,
    fontWeight: 'bold',
  },

  title: {
    flex: 1,
    textAlign: 'center',
    color: '#222222',
    fontSize: 16,
    fontWeight: 'bold',
  },

  headerSpace: {
    width: 80,
  },

  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },

  loadingText: {
    color: '#777777',
    fontSize: 12,
    marginTop: 12,
  },

  errorText: {
    color: '#555555',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 18,
  },

  retryButton: {
    backgroundColor: '#3F6B3A',
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 11,
  },

  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },

  emptyTitle: {
    color: '#222222',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  emptyText: {
    color: '#777777',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },

  listContent: {
    padding: 16,
    paddingBottom: 30,
  },

  totalRecords: {
    color: '#777777',
    fontSize: 11,
    marginBottom: 12,
  },

  expenseCard: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
  },

  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  expenseTitle: {
    flex: 1,
    color: '#3F6B3A',
    fontSize: 13,
    fontWeight: 'bold',
    marginRight: 12,
  },

  expenseValue: {
    color: '#222222',
    fontSize: 14,
    fontWeight: 'bold',
  },

  expenseDescription: {
    color: '#555555',
    fontSize: 11,
    marginTop: 8,
    lineHeight: 16,
  },

  expenseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },

  expenseDate: {
    color: '#888888',
    fontSize: 10,
  },

  expenseStatus: {
    color: '#3F6B3A',
    backgroundColor: '#BDEBB9',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    fontSize: 9,
    fontWeight: 'bold',
  },
});

export default HistoricoScreen;
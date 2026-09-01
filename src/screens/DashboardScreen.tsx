import React, {useCallback, useEffect, useState} from 'react';
import {
  NativeModules,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

interface DashboardScreenProps {
  onAbrirHistorico: () => void;
}

interface Gasto {
  id: string;
  valor: number;
  titulo: string;
  descricao: string;
  pacoteOrigem: string;
  dataHora: number;
  status: string;
}

const {GastoModule} = NativeModules;

function DashboardScreen({
  onAbrirHistorico,
}: DashboardScreenProps) {
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [carregando, setCarregando] = useState(true);

  const carregarGastos = useCallback(async () => {
    try {
      setCarregando(true);

      if (!GastoModule) {
        console.error(
          'GastoModule não está disponível.',
        );
        return;
      }

      const resultado: Gasto[] =
        await GastoModule.listarGastos();

      const gastosAtivos = resultado
        .filter(gasto => gasto.status === 'ATIVO')
        .sort((a, b) => b.dataHora - a.dataHora);

      setGastos(gastosAtivos);
    } catch (error) {
      console.error(
        'Erro ao carregar gastos no Dashboard:',
        error,
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

  function obterNomeMes() {
    const agora = new Date();

    const mes = agora.toLocaleDateString(
      'pt-BR',
      {
        month: 'long',
        year: 'numeric',
      },
    );

    return (
      mes.charAt(0).toUpperCase() +
      mes.slice(1)
    );
  }

  function calcularTotalMes() {
    const agora = new Date();

    const mesAtual = agora.getMonth();
    const anoAtual = agora.getFullYear();

    return gastos
      .filter(gasto => {
        const data = new Date(gasto.dataHora);

        return (
          data.getMonth() === mesAtual &&
          data.getFullYear() === anoAtual
        );
      })
      .reduce(
        (total, gasto) =>
          total + gasto.valor,
        0,
      );
  }

  function formatarData(dataHora: number) {
    const data = new Date(dataHora);

    const hoje = new Date();

    const inicioHoje = new Date(
      hoje.getFullYear(),
      hoje.getMonth(),
      hoje.getDate(),
    );

    const inicioData = new Date(
      data.getFullYear(),
      data.getMonth(),
      data.getDate(),
    );

    const diferencaDias = Math.round(
      (inicioHoje.getTime() -
        inicioData.getTime()) /
        (1000 * 60 * 60 * 24),
    );

    if (diferencaDias === 0) {
      return 'Hoje';
    }

    if (diferencaDias === 1) {
      return 'Ontem';
    }

    return data.toLocaleDateString(
      'pt-BR',
      {
        day: '2-digit',
        month: 'short',
      },
    );
  }

  const totalMes = calcularTotalMes();

  const ultimosGastos =
    gastos.slice(0, 4);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Text style={styles.greeting}>
            Olá, Pedro
          </Text>

          <Text style={styles.month}>
            {obterNomeMes()}
          </Text>
        </View>

        {/* Total do mês */}
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>
            Total do Mês
          </Text>

          <Text style={styles.totalValue}>
            {carregando
              ? 'Carregando...'
              : formatarValor(totalMes)}
          </Text>
        </View>

        {/* Últimos gastos */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Últimos Gastos
          </Text>

          <Pressable
            onPress={onAbrirHistorico}
            style={styles.historyButton}>
            <Text style={styles.historyButtonText}>
              Ver histórico
            </Text>
          </Pressable>
        </View>

        <View style={styles.expensesContainer}>
          {carregando ? (
            <View style={styles.messageRow}>
              <Text style={styles.messageText}>
                Carregando gastos...
              </Text>
            </View>
          ) : ultimosGastos.length === 0 ? (
            <View style={styles.messageRow}>
              <Text style={styles.messageText}>
                Nenhum gasto registrado
              </Text>
            </View>
          ) : (
            ultimosGastos.map(
              (gasto, index) => (
                <React.Fragment key={gasto.id}>
                  <View style={styles.expenseRow}>
                    <View>
                      <Text style={styles.expenseDate}>
                        {formatarData(
                          gasto.dataHora,
                        )}
                      </Text>

                      <Text style={styles.expenseTitle}>
                        {gasto.titulo.trim()}
                      </Text>
                    </View>

                    <Text style={styles.expenseValue}>
                      {formatarValor(
                        gasto.valor,
                      )}
                    </Text>
                  </View>

                  {index <
                    ultimosGastos.length -
                      1 && (
                    <View
                      style={styles.separator}
                    />
                  )}
                </React.Fragment>
              ),
            )
          )}
        </View>
      </View>

      {/* Menu inferior */}
      <View style={styles.bottomNavigation}>
        <View style={styles.navigationItem}>
          <View style={styles.navigationIcon} />
          <Text style={styles.navigationText}>
            Dashboard
          </Text>
        </View>

        <View style={styles.navigationItem}>
          <View style={styles.navigationIcon} />
          <Text style={styles.navigationText}>
            Relatórios
          </Text>
        </View>

        <View style={styles.navigationItem}>
          <View style={styles.navigationIcon} />
          <Text style={styles.navigationText}>
            Configurações
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 18,
  },

  header: {
    marginBottom: 24,
  },

  greeting: {
    color: '#3F6B3A',
    fontSize: 14,
    fontWeight: 'bold',
  },

  month: {
    color: '#777777',
    fontSize: 10,
    marginTop: 2,
  },

  totalCard: {
    width: '100%',
    height: 85,
    backgroundColor: '#BDEBB9',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingTop: 14,
    marginBottom: 32,
  },

  totalLabel: {
    color: '#3F6B3A',
    fontSize: 12,
    fontWeight: 'bold',
  },

  totalValue: {
    color: '#222222',
    fontSize: 16,
    marginTop: 5,
  },

  sectionHeader: {
    marginBottom: 14,
  },

  sectionTitle: {
    alignSelf: 'center',
    width: '85%',
    backgroundColor: '#F3F3F3',
    color: '#222222',
    textAlign: 'center',
    paddingVertical: 9,
    fontSize: 13,
  },

  historyButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
    paddingVertical: 4,
  },

  historyButtonText: {
    color: '#3F6B3A',
    fontSize: 10,
    fontWeight: 'bold',
  },

  expensesContainer: {
    borderWidth: 1,
    borderColor: '#555555',
    borderRadius: 18,
    overflow: 'hidden',
  },

  expenseRow: {
    minHeight: 50,
    paddingHorizontal: 18,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  expenseDate: {
    color: '#222222',
    fontSize: 11,
  },

  expenseTitle: {
    color: '#777777',
    fontSize: 9,
    marginTop: 2,
  },

  expenseValue: {
    color: '#222222',
    fontSize: 11,
  },

  separator: {
    height: 1,
    backgroundColor: '#DDDDDD',
  },

  messageRow: {
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },

  messageText: {
    color: '#777777',
    fontSize: 11,
  },

  bottomNavigation: {
    height: 82,
    backgroundColor: '#BDEBB9',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 5,
  },

  navigationItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 90,
  },

  navigationIcon: {
    width: 27,
    height: 27,
    borderRadius: 8,
    backgroundColor: '#3F6B3A',
    marginBottom: 5,
  },

  navigationText: {
    color: '#222222',
    fontSize: 9,
  },
});

export default DashboardScreen;
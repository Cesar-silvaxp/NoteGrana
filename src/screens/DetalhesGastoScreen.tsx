import React from 'react';
import {
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

interface DetalhesGastoScreenProps {
  gasto: Gasto;
  onVoltar: () => void;
}

function DetalhesGastoScreen({
  gasto,
  onVoltar,
}: DetalhesGastoScreenProps) {
  function formatarValor(valor: number) {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  function formatarDataHora(dataHora: number) {
    const data = new Date(dataHora);

    return data.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
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

        <Text style={styles.headerTitle}>
          Detalhes do Gasto
        </Text>

        <View style={styles.headerSpace} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}>
        <View style={styles.valueCard}>
          <Text style={styles.valueLabel}>
            Valor
          </Text>

          <Text style={styles.value}>
            {formatarValor(gasto.valor)}
          </Text>
        </View>

        <View style={styles.detailsCard}>
          <View style={styles.detailItem}>
            <Text style={styles.label}>
              Tipo
            </Text>

            <Text style={styles.text}>
              {gasto.titulo.trim() ||
                'Gasto registrado'}
            </Text>
          </View>

          <View style={styles.separator} />

          <View style={styles.detailItem}>
            <Text style={styles.label}>
              Data e hora
            </Text>

            <Text style={styles.text}>
              {formatarDataHora(gasto.dataHora)}
            </Text>
          </View>

          <View style={styles.separator} />

          <View style={styles.detailItem}>
            <Text style={styles.label}>
              Descrição
            </Text>

            <Text style={styles.text}>
              {gasto.descricao ||
                'Sem descrição'}
            </Text>
          </View>

          <View style={styles.separator} />

          <View style={styles.detailItem}>
            <Text style={styles.label}>
              Aplicativo de origem
            </Text>

            <Text style={styles.text}>
              {gasto.pacoteOrigem}
            </Text>
          </View>

          <View style={styles.separator} />

          <View style={styles.detailItem}>
            <Text style={styles.label}>
              Status
            </Text>

            <View style={styles.statusContainer}>
              <Text style={styles.statusText}>
                {gasto.status}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.idContainer}>
          <Text style={styles.idLabel}>
            Identificador do gasto
          </Text>

          <Text style={styles.idText}>
            {gasto.id}
          </Text>
        </View>
      </ScrollView>
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

  headerTitle: {
    flex: 1,
    color: '#222222',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  headerSpace: {
    width: 80,
  },

  content: {
    padding: 16,
    paddingBottom: 40,
  },

  valueCard: {
    backgroundColor: '#BDEBB9',
    borderRadius: 14,
    padding: 18,
    marginBottom: 20,
  },

  valueLabel: {
    color: '#3F6B3A',
    fontSize: 12,
    fontWeight: 'bold',
  },

  value: {
    color: '#222222',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 6,
  },

  detailsCard: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 16,
    overflow: 'hidden',
  },

  detailItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },

  label: {
    color: '#777777',
    fontSize: 10,
    marginBottom: 5,
  },

  text: {
    color: '#222222',
    fontSize: 12,
    lineHeight: 18,
  },

  separator: {
    height: 1,
    backgroundColor: '#EEEEEE',
  },

  statusContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#BDEBB9',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  statusText: {
    color: '#3F6B3A',
    fontSize: 10,
    fontWeight: 'bold',
  },

  idContainer: {
    marginTop: 20,
    paddingHorizontal: 4,
  },

  idLabel: {
    color: '#888888',
    fontSize: 9,
    marginBottom: 4,
  },

  idText: {
    color: '#AAAAAA',
    fontSize: 8,
  },
});

export default DetalhesGastoScreen;
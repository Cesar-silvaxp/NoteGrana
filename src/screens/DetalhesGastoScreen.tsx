import React, {useState} from 'react';
import {
  Alert,
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

interface DetalhesGastoScreenProps {
  gasto: Gasto;
  onVoltar: () => void;
}

const {GastoModule} = NativeModules;

function DetalhesGastoScreen({
  gasto,
  onVoltar,
}: DetalhesGastoScreenProps) {
  const [status, setStatus] =
    useState(gasto.status);

  const [alterandoStatus, setAlterandoStatus] =
    useState(false);

  function formatarValor(valor: number) {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  function formatarDataHora(
    dataHora: number,
  ) {
    const data = new Date(dataHora);

    return data.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  async function atualizarStatus(
    novoStatus: 'ATIVO' | 'IGNORADO',
  ) {
    try {
      setAlterandoStatus(true);

      if (!GastoModule) {
        Alert.alert(
          'Erro',
          'O módulo de gastos não está disponível.',
        );
        return;
      }

      await GastoModule.atualizarStatusGasto(
        gasto.id,
        novoStatus,
      );

      setStatus(novoStatus);

      if (novoStatus === 'IGNORADO') {
        Alert.alert(
          'Gasto ignorado',
          'Este gasto não será mais considerado nos totais do Dashboard e dos relatórios.',
        );
      } else {
        Alert.alert(
          'Gasto reativado',
          'Este gasto voltará a ser considerado nos totais do NoteGrana.',
        );
      }
    } catch (error) {
      console.error(
        'Erro ao atualizar status do gasto:',
        error,
      );

      Alert.alert(
        'Erro',
        'Não foi possível atualizar o gasto.',
      );
    } finally {
      setAlterandoStatus(false);
    }
  }

  function confirmarIgnorarGasto() {
    Alert.alert(
      'Ignorar gasto?',
      'O registro continuará no histórico, mas não será considerado nos totais do Dashboard e dos relatórios.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Ignorar gasto',
          style: 'destructive',
          onPress: () =>
            atualizarStatus('IGNORADO'),
        },
      ],
    );
  }

  function confirmarReativarGasto() {
    Alert.alert(
      'Reativar gasto?',
      'Este gasto voltará a ser considerado nos totais do Dashboard e dos relatórios.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Reativar',
          onPress: () =>
            atualizarStatus('ATIVO'),
        },
      ],
    );
  }

  const gastoIgnorado =
    status === 'IGNORADO';

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
        contentContainerStyle={
          styles.content
        }>
        <View
          style={[
            styles.valueCard,
            gastoIgnorado &&
              styles.valueCardIgnored,
          ]}>
          <Text style={styles.valueLabel}>
            Valor
          </Text>

          <Text style={styles.value}>
            {formatarValor(gasto.valor)}
          </Text>

          {gastoIgnorado && (
            <Text style={styles.ignoredNotice}>
              Este gasto está sendo ignorado
              nos totais.
            </Text>
          )}
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
              {formatarDataHora(
                gasto.dataHora,
              )}
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

            <View
              style={[
                styles.statusContainer,
                gastoIgnorado &&
                  styles.statusContainerIgnored,
              ]}>
              <Text
                style={[
                  styles.statusText,
                  gastoIgnorado &&
                    styles.statusTextIgnored,
                ]}>
                {status}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.actionContainer}>
          {gastoIgnorado ? (
            <>
              <Text
                style={
                  styles.actionDescription
                }>
                Este gasto continua salvo no
                histórico, mas não entra nos
                totais.
              </Text>

              <Pressable
                disabled={alterandoStatus}
                onPress={
                  confirmarReativarGasto
                }
                style={({pressed}) => [
                  styles.reactivateButton,
                  pressed &&
                    styles.buttonPressed,
                  alterandoStatus &&
                    styles.buttonDisabled,
                ]}>
                <Text
                  style={
                    styles.reactivateButtonText
                  }>
                  {alterandoStatus
                    ? 'Atualizando...'
                    : 'Reativar gasto'}
                </Text>
              </Pressable>
            </>
          ) : (
            <>
              <Text
                style={
                  styles.actionDescription
                }>
                Caso este lançamento não deva
                entrar nos seus relatórios,
                você pode ignorá-lo.
              </Text>

              <Pressable
                disabled={alterandoStatus}
                onPress={
                  confirmarIgnorarGasto
                }
                style={({pressed}) => [
                  styles.ignoreButton,
                  pressed &&
                    styles.buttonPressed,
                  alterandoStatus &&
                    styles.buttonDisabled,
                ]}>
                <Text
                  style={
                    styles.ignoreButtonText
                  }>
                  {alterandoStatus
                    ? 'Atualizando...'
                    : 'Ignorar gasto'}
                </Text>
              </Pressable>
            </>
          )}
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

  valueCardIgnored: {
    backgroundColor: '#F3F3F3',
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

  ignoredNotice: {
    color: '#777777',
    fontSize: 10,
    marginTop: 8,
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

  statusContainerIgnored: {
    backgroundColor: '#E5E5E5',
  },

  statusText: {
    color: '#3F6B3A',
    fontSize: 10,
    fontWeight: 'bold',
  },

  statusTextIgnored: {
    color: '#777777',
  },

  actionContainer: {
    marginTop: 24,
  },

  actionDescription: {
    color: '#777777',
    fontSize: 10,
    lineHeight: 16,
    textAlign: 'center',
    marginBottom: 12,
    paddingHorizontal: 16,
  },

  ignoreButton: {
    height: 50,
    borderWidth: 1,
    borderColor: '#B3261E',
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },

  ignoreButtonText: {
    color: '#B3261E',
    fontSize: 13,
    fontWeight: 'bold',
  },

  reactivateButton: {
    height: 50,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4E83F',
  },

  reactivateButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },

  buttonPressed: {
    opacity: 0.6,
  },

  buttonDisabled: {
    opacity: 0.5,
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
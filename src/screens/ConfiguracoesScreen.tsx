import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  AppState,
  NativeModules,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

interface ConfiguracoesScreenProps {
  onAbrirDashboard: () => void;
  onAbrirRelatorios: () => void;
  onSair: () => void;
}

const {NotificationAccessModule} = NativeModules;

function ConfiguracoesScreen({
  onAbrirDashboard,
  onAbrirRelatorios,
  onSair,
}: ConfiguracoesScreenProps) {
  const [
    acessoNotificacoes,
    setAcessoNotificacoes,
  ] = useState<boolean | null>(null);

  const verificarAcesso =
    useCallback(async () => {
      try {
        if (!NotificationAccessModule) {
          setAcessoNotificacoes(false);
          return;
        }

        const habilitado: boolean =
          await NotificationAccessModule.verificarAcesso();

        setAcessoNotificacoes(habilitado);
      } catch (error) {
        console.error(
          'Erro ao verificar notificações:',
          error,
        );

        setAcessoNotificacoes(false);
      }
    }, []);

  useEffect(() => {
    verificarAcesso();
  }, [verificarAcesso]);

  useEffect(() => {
    const subscription =
      AppState.addEventListener(
        'change',
        estado => {
          if (estado === 'active') {
            verificarAcesso();
          }
        },
      );

    return () => {
      subscription.remove();
    };
  }, [verificarAcesso]);

  async function gerenciarNotificacoes() {
    try {
      if (!NotificationAccessModule) {
        return;
      }

      await NotificationAccessModule
        .abrirConfiguracoes();
    } catch (error) {
      console.error(
        'Erro ao abrir configurações:',
        error,
      );
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          Configurações
        </Text>

        <Text style={styles.sectionLabel}>
          Notificações
        </Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowContent}>
              <Text style={styles.rowTitle}>
                Acesso às notificações
              </Text>

              <Text style={styles.rowDescription}>
                Necessário para identificar
                seus gastos automaticamente.
              </Text>
            </View>

            <View
              style={[
                styles.statusBadge,
                acessoNotificacoes === false &&
                  styles.statusBadgeDisabled,
              ]}>
              <Text
                style={[
                  styles.statusText,
                  acessoNotificacoes === false &&
                    styles.statusTextDisabled,
                ]}>
                {acessoNotificacoes === null
                  ? '...'
                  : acessoNotificacoes
                    ? 'Ativado'
                    : 'Desativado'}
              </Text>
            </View>
          </View>

          <View style={styles.separator} />

          <Pressable
            style={({pressed}) => [
              styles.actionRow,
              pressed && styles.pressed,
            ]}
            onPress={gerenciarNotificacoes}>
            <Text style={styles.actionText}>
              Gerenciar acesso
            </Text>

            <Text style={styles.arrow}>
              ›
            </Text>
          </Pressable>
        </View>

        <Text style={styles.sectionLabel}>
          Segurança
        </Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowContent}>
              <Text style={styles.rowTitle}>
                Alterar senha
              </Text>

              <Text style={styles.rowDescription}>
                Atualize a senha da sua conta.
              </Text>
            </View>

            <View style={styles.soonBadge}>
              <Text style={styles.soonText}>
                Em breve
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionLabel}>
          Conta
        </Text>

        <View style={styles.card}>
          <Pressable
            style={({pressed}) => [
              styles.logoutRow,
              pressed && styles.pressed,
            ]}
            onPress={onSair}>
            <Text style={styles.logoutText}>
              Sair da conta
            </Text>
          </Pressable>
        </View>

        <Text style={styles.versionText}>
          NoteGrana
        </Text>
      </View>

      <View style={styles.bottomNavigation}>
        <Pressable
          style={styles.navigationItem}
          onPress={onAbrirDashboard}>
          <View style={styles.navigationIcon} />
          <Text style={styles.navigationText}>
            Dashboard
          </Text>
        </Pressable>

        <Pressable
          style={styles.navigationItem}
          onPress={onAbrirRelatorios}>
          <View style={styles.navigationIcon} />
          <Text style={styles.navigationText}>
            Relatórios
          </Text>
        </Pressable>

        <View style={styles.navigationItem}>
          <View
            style={[
              styles.navigationIcon,
              styles.navigationIconActive,
            ]}
          />

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
    paddingHorizontal: 18,
    paddingTop: 30,
  },

  title: {
    color: '#3F6B3A',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 34,
  },

  sectionLabel: {
    color: '#777777',
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 8,
    marginLeft: 4,
  },

  card: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    marginBottom: 26,
  },

  row: {
    minHeight: 74,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },

  rowContent: {
    flex: 1,
    paddingRight: 12,
  },

  rowTitle: {
    color: '#222222',
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 4,
  },

  rowDescription: {
    color: '#777777',
    fontSize: 10,
    lineHeight: 15,
  },

  separator: {
    height: 1,
    backgroundColor: '#EEEEEE',
  },

  actionRow: {
    height: 48,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  actionText: {
    color: '#3F6B3A',
    fontSize: 11,
    fontWeight: 'bold',
  },

  arrow: {
    color: '#3F6B3A',
    fontSize: 22,
  },

  statusBadge: {
    backgroundColor: '#BDEBB9',
    borderRadius: 12,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },

  statusBadgeDisabled: {
    backgroundColor: '#F3F3F3',
  },

  statusText: {
    color: '#3F6B3A',
    fontSize: 9,
    fontWeight: 'bold',
  },

  statusTextDisabled: {
    color: '#777777',
  },

  soonBadge: {
    backgroundColor: '#F3F3F3',
    borderRadius: 12,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },

  soonText: {
    color: '#777777',
    fontSize: 9,
  },

  logoutRow: {
    height: 52,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },

  logoutText: {
    color: '#B3261E',
    fontSize: 12,
    fontWeight: 'bold',
  },

  pressed: {
    opacity: 0.6,
  },

  versionText: {
    color: '#BBBBBB',
    fontSize: 9,
    textAlign: 'center',
    marginTop: 2,
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

  navigationIconActive: {
    borderWidth: 2,
    borderColor: '#222222',
  },

  navigationText: {
    color: '#222222',
    fontSize: 9,
  },
});

export default ConfiguracoesScreen;
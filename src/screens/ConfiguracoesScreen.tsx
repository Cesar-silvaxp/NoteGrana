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

import BottomNavigation from '../components/BottomNavigation';

interface ConfiguracoesScreenProps {
  nomeUsuario: string;
  emailUsuario: string;
  onEditarPerfil: () => void;
  onAbrirDashboard: () => void;
  onAbrirRelatorios: () => void;
  onAlterarSenha: () => void;
  onSair: () => void;
}

const {NotificationAccessModule} =
  NativeModules;

function ConfiguracoesScreen({
  nomeUsuario,
  emailUsuario,
  onEditarPerfil,
  onAbrirDashboard,
  onAbrirRelatorios,
  onAlterarSenha,
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
          await NotificationAccessModule
            .verificarAcesso();

        setAcessoNotificacoes(
          habilitado,
        );
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
          Perfil
        </Text>

        <View style={styles.card}>
          <Pressable
            style={({pressed}) => [
              styles.profileRow,
              pressed && styles.pressed,
            ]}
            onPress={onEditarPerfil}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {nomeUsuario
                  ? nomeUsuario[0].toUpperCase()
                  : '?'}
              </Text>
            </View>

            <View style={styles.rowContent}>
              <Text style={styles.rowTitle}>
                {nomeUsuario}
              </Text>

              <Text
                style={styles.rowDescription}>
                {emailUsuario}
              </Text>
            </View>

            <Text style={styles.arrow}>
              ›
            </Text>
          </Pressable>
        </View>

        <Text style={styles.sectionLabel}>
          Notificações
        </Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowContent}>
              <Text style={styles.rowTitle}>
                Acesso às notificações
              </Text>

              <Text
                style={styles.rowDescription}>
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
          <Pressable
            style={({pressed}) => [
              styles.securityRow,
              pressed && styles.pressed,
            ]}
            onPress={onAlterarSenha}>
            <View style={styles.rowContent}>
              <Text style={styles.rowTitle}>
                Alterar senha
              </Text>

              <Text
                style={styles.rowDescription}>
                Atualize a senha da sua conta.
              </Text>
            </View>

            <Text style={styles.arrow}>
              ›
            </Text>
          </Pressable>
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
      </View>

      <BottomNavigation
        active="configuracoes"
        onDashboard={onAbrirDashboard}
        onRelatorios={onAbrirRelatorios}
        onConfiguracoes={() => {}}
      />
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
    paddingTop: 24,
  },

  title: {
    color: '#3F6B3A',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },

  sectionLabel: {
    color: '#777777',
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 7,
    marginLeft: 4,
  },

  card: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    marginBottom: 18,
  },

  profileRow: {
    minHeight: 72,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#BDEBB9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  avatarText: {
    color: '#3F6B3A',
    fontSize: 18,
    fontWeight: 'bold',
  },

  row: {
    minHeight: 74,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },

  securityRow: {
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
});

export default ConfiguracoesScreen;
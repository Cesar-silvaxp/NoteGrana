import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  AppState,
  NativeModules,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

interface NotificationPermissionScreenProps {
  onPermissaoConcedida: () => void;
}

const {NotificationAccessModule} = NativeModules;

function NotificationPermissionScreen({
  onPermissaoConcedida,
}: NotificationPermissionScreenProps) {
  const [verificando, setVerificando] =
    useState(true);

  const verificarPermissao =
    useCallback(async () => {
      try {
        setVerificando(true);

        if (!NotificationAccessModule) {
          console.error(
            'NotificationAccessModule não está disponível.',
          );
          return;
        }

        const habilitado: boolean =
          await NotificationAccessModule.verificarAcesso();

        if (habilitado) {
          onPermissaoConcedida();
        }
      } catch (error) {
        console.error(
          'Erro ao verificar acesso às notificações:',
          error,
        );
      } finally {
        setVerificando(false);
      }
    }, [onPermissaoConcedida]);

  useEffect(() => {
    verificarPermissao();
  }, [verificarPermissao]);

  useEffect(() => {
    const subscription =
      AppState.addEventListener(
        'change',
        estado => {
          if (estado === 'active') {
            verificarPermissao();
          }
        },
      );

    return () => {
      subscription.remove();
    };
  }, [verificarPermissao]);

  async function abrirConfiguracoes() {
    try {
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
        <Text style={styles.logo}>
          NoteGrana
        </Text>

        <View style={styles.iconContainer}>
          <View style={styles.notificationIcon}>
            <View style={styles.notificationTop} />
            <View style={styles.notificationBody} />
            <View style={styles.notificationBottom} />
          </View>
        </View>

        <Text style={styles.title}>
          Acesso às notificações
        </Text>

        <Text style={styles.description}>
          Para identificar seus gastos
          automaticamente, o NoteGrana precisa
          acessar as notificações financeiras
          recebidas no celular.
        </Text>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>
            Como funciona?
          </Text>

          <Text style={styles.infoText}>
            O NoteGrana analisa notificações
            relacionadas a pagamentos, compras e
            transferências para registrar seus
            gastos automaticamente.
          </Text>

          <Text style={styles.infoText}>
            Aplicativos comuns, como mensageiros e
            redes sociais, são ignorados pelo
            sistema.
          </Text>
        </View>

        {verificando ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" />

            <Text style={styles.loadingText}>
              Verificando permissão...
            </Text>
          </View>
        ) : (
          <Pressable
            style={({pressed}) => [
              styles.allowButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={abrirConfiguracoes}>
            <Text style={styles.allowButtonText}>
              Permitir acesso
            </Text>
          </Pressable>
        )}

        <Text style={styles.footerText}>
          Você pode alterar essa permissão a qualquer
          momento nas configurações do Android.
        </Text>
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
    paddingHorizontal: 24,
    paddingTop: 34,
    alignItems: 'center',
  },

  logo: {
    color: '#3F6B3A',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 42,
  },

  iconContainer: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: '#BDEBB9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 26,
  },

  notificationIcon: {
    alignItems: 'center',
  },

  notificationTop: {
    width: 12,
    height: 7,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    backgroundColor: '#3F6B3A',
  },

  notificationBody: {
    width: 34,
    height: 30,
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: '#3F6B3A',
  },

  notificationBottom: {
    width: 12,
    height: 5,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    backgroundColor: '#3F6B3A',
    marginTop: 3,
  },

  title: {
    color: '#222222',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 14,
  },

  description: {
    color: '#666666',
    fontSize: 12,
    lineHeight: 19,
    textAlign: 'center',
    marginBottom: 28,
    paddingHorizontal: 10,
  },

  infoCard: {
    width: '100%',
    backgroundColor: '#F3F3F3',
    borderRadius: 14,
    padding: 18,
    marginBottom: 30,
  },

  infoTitle: {
    color: '#3F6B3A',
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  infoText: {
    color: '#555555',
    fontSize: 11,
    lineHeight: 17,
    marginBottom: 8,
  },

  loadingContainer: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
  },

  loadingText: {
    color: '#777777',
    fontSize: 11,
    marginLeft: 10,
  },

  allowButton: {
    width: '100%',
    height: 48,
    backgroundColor: '#3F6B3A',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  allowButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },

  buttonPressed: {
    opacity: 0.8,
  },

  footerText: {
    color: '#999999',
    fontSize: 9,
    lineHeight: 14,
    textAlign: 'center',
    marginTop: 18,
    paddingHorizontal: 20,
  },
});

export default NotificationPermissionScreen;
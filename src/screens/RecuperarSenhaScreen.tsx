import React, {useState} from 'react';

import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const API_URL = 'http://192.168.2.11:8080';

interface RecuperacaoResponse {
  mensagem: string;
  tokenTeste: string | null;
}

interface ErroApi {
  status?: number;
  mensagem?: string;
  campos?: Record<string, string> | null;
}

interface RecuperarSenhaScreenProps {
  onVoltar: () => void;
  onEnviar: (token: string) => void;
}

function RecuperarSenhaScreen({
  onVoltar,
  onEnviar,
}: RecuperarSenhaScreenProps) {
  const [email, setEmail] =
    useState('');

  const [erro, setErro] =
    useState('');

  const [
    carregando,
    setCarregando,
  ] = useState(false);

  async function enviarRecuperacao() {
    const emailLimpo =
      email
        .trim()
        .toLowerCase();

    if (!emailLimpo) {
      setErro(
        'Informe seu e-mail.',
      );
      return;
    }

    const emailValido =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        emailLimpo,
      );

    if (!emailValido) {
      setErro(
        'Informe um e-mail válido.',
      );
      return;
    }

    try {
      setCarregando(true);
      setErro('');

      const response = await fetch(
        `${API_URL}/api/recuperacao-senha/solicitar`,
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            email: emailLimpo,
          }),
        },
      );

      if (!response.ok) {
        let erroApi: ErroApi | null =
          null;

        try {
          erroApi =
            await response.json();
        } catch {
          // Mantém mensagem padrão.
        }

        if (
          erroApi?.campos &&
          Object.keys(
            erroApi.campos,
          ).length > 0
        ) {
          const primeiraMensagem =
            Object.values(
              erroApi.campos,
            )[0];

          setErro(
            primeiraMensagem,
          );

          return;
        }

        setErro(
          erroApi?.mensagem ??
            'Não foi possível solicitar a recuperação de senha.',
        );

        return;
      }

      const dados:
        RecuperacaoResponse =
        await response.json();

      /*
       * tokenTeste existe somente
       * durante o desenvolvimento.
       *
       * Quando houver envio real de
       * e-mail, ele será removido da
       * resposta da API.
       */
      if (!dados.tokenTeste) {
        setErro(
          'Não foi possível continuar a recuperação de senha.',
        );
        return;
      }

      onEnviar(
        dados.tokenTeste,
      );
    } catch (error) {
      console.log(
        'Erro ao solicitar recuperação de senha:',
        error,
      );

      setErro(
        'Não foi possível conectar à API do NoteGrana.',
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <SafeAreaView
      style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.backButton}
          disabled={carregando}
          onPress={onVoltar}>
          <Text
            style={
              styles.backButtonText
            }>
            ← Voltar
          </Text>
        </TouchableOpacity>

        <View style={styles.logo}>
          <Text
            style={styles.logoIcon}>
            ▰
          </Text>
        </View>

        <Text style={styles.appName}>
          NoteGrana
        </Text>

        <Text style={styles.title}>
          Recuperar senha
        </Text>

        <Text
          style={styles.description}>
          Informe o e-mail cadastrado
          na sua conta para iniciar a
          recuperação da senha.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Seu e-mail"
          placeholderTextColor="#666666"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          editable={!carregando}
          onChangeText={texto => {
            setEmail(texto);

            if (erro) {
              setErro('');
            }
          }}
          onSubmitEditing={
            enviarRecuperacao
          }
        />

        {erro ? (
          <Text
            style={
              styles.errorText
            }>
            {erro}
          </Text>
        ) : null}

        <TouchableOpacity
          style={[
            styles.sendButton,
            carregando &&
              styles.sendButtonDisabled,
          ]}
          disabled={carregando}
          onPress={enviarRecuperacao}>
          {carregando ? (
            <ActivityIndicator
              color="#FFFFFF"
            />
          ) : (
            <Text
              style={
                styles.sendButtonText
              }>
              Continuar
            </Text>
          )}
        </TouchableOpacity>

        <Text style={styles.helpText}>
          Se existir uma conta vinculada
          ao e-mail informado, o processo
          de recuperação será iniciado.
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
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 24,
  },

  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 10,
    marginBottom: 28,
  },

  backButtonText: {
    color: '#3F6B3A',
    fontSize: 12,
    fontWeight: 'bold',
  },

  logo: {
    width: 52,
    height: 42,
    backgroundColor: '#3F6B3A',
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },

  logoIcon: {
    color: '#172816',
    fontSize: 24,
  },

  appName: {
    color: '#3F6B3A',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
  },

  title: {
    color: '#222222',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 14,
  },

  description: {
    color: '#777777',
    fontSize: 12,
    lineHeight: 19,
    textAlign: 'center',
    marginBottom: 30,
  },

  input: {
    width: '100%',
    height: 52,
    backgroundColor: '#F3F3F3',
    borderRadius: 13,
    paddingHorizontal: 18,
    color: '#222222',
    fontWeight: '600',
    elevation: 3,
  },

  errorText: {
    width: '100%',
    color: '#B3261E',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 12,
  },

  sendButton: {
    width: '100%',
    height: 52,
    backgroundColor: '#F4E83F',
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    marginTop: 24,
  },

  sendButtonDisabled: {
    opacity: 0.7,
  },

  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },

  helpText: {
    color: '#999999',
    fontSize: 10,
    lineHeight: 15,
    textAlign: 'center',
    marginTop: 26,
    paddingHorizontal: 12,
  },
});

export default RecuperarSenhaScreen;
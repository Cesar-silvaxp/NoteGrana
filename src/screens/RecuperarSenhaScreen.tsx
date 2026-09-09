import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface RecuperarSenhaScreenProps {
  onVoltar: () => void;
  onEnviar: () => void;
}

function RecuperarSenhaScreen({
  onVoltar,
  onEnviar,
}: RecuperarSenhaScreenProps) {
  const [email, setEmail] = useState('');
  const [erro, setErro] = useState('');

  function enviarRecuperacao() {
    const emailLimpo = email.trim();

    if (!emailLimpo) {
      setErro('Informe seu e-mail.');
      return;
    }

    const emailValido =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        emailLimpo,
      );

    if (!emailValido) {
      setErro('Informe um e-mail válido.');
      return;
    }

    setErro('');
    onEnviar();
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onVoltar}>
          <Text style={styles.backButtonText}>
            ← Voltar
          </Text>
        </TouchableOpacity>

        <View style={styles.logo}>
          <Text style={styles.logoIcon}>
            ▰
          </Text>
        </View>

        <Text style={styles.appName}>
          NoteGrana
        </Text>

        <Text style={styles.title}>
          Recuperar senha
        </Text>

        <Text style={styles.description}>
          Informe o e-mail cadastrado na sua conta.
          Enviaremos as instruções para você criar
          uma nova senha.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Seu e-mail"
          placeholderTextColor="#666666"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={texto => {
            setEmail(texto);

            if (erro) {
              setErro('');
            }
          }}
        />

        {erro ? (
          <Text style={styles.errorText}>
            {erro}
          </Text>
        ) : null}

        <TouchableOpacity
          style={styles.sendButton}
          onPress={enviarRecuperacao}>
          <Text style={styles.sendButtonText}>
            Enviar
          </Text>
        </TouchableOpacity>

        <Text style={styles.helpText}>
          Verifique também a pasta de spam ou lixo
          eletrônico caso não encontre a mensagem.
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
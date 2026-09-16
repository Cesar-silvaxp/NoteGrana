import React, {useState} from 'react';

import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const API_URL = 'http://192.168.2.11:8080';

interface CadastroScreenProps {
  onVoltar: () => void;
  onCadastrar: () => void;
}

type ErroApi = {
  status?: number;
  mensagem?: string;
  campos?: Record<string, string> | null;
};

function CadastroScreen({
  onVoltar,
  onCadastrar,
}: CadastroScreenProps) {
  const [nome, setNome] =
    useState('');

  const [email, setEmail] =
    useState('');

  const [senha, setSenha] =
    useState('');

  const [
    confirmarSenha,
    setConfirmarSenha,
  ] = useState('');

  const [
    mostrarSenha,
    setMostrarSenha,
  ] = useState(false);

  const [erro, setErro] =
    useState('');

  const [
    carregando,
    setCarregando,
  ] = useState(false);

  async function cadastrar() {
    const nomeLimpo =
      nome.trim();

    const emailLimpo =
      email
        .trim()
        .toLowerCase();

    if (
      !nomeLimpo ||
      !emailLimpo ||
      !senha ||
      !confirmarSenha
    ) {
      setErro(
        'Preencha todos os campos para continuar.',
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

    if (nomeLimpo.length < 2) {
      setErro(
        'O nome deve possuir pelo menos 2 caracteres.',
      );
      return;
    }

    if (senha.length < 6) {
      setErro(
        'A senha deve possuir pelo menos 6 caracteres.',
      );
      return;
    }

    if (senha !== confirmarSenha) {
      setErro(
        'As senhas não são iguais.',
      );
      return;
    }

    try {
      setCarregando(true);
      setErro('');

      const response = await fetch(
        `${API_URL}/api/usuarios`,
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            nome: nomeLimpo,
            email: emailLimpo,
            senha,
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
          // Mantém tratamento padrão.
        }

        if (response.status === 409) {
          setErro(
            erroApi?.mensagem ??
              'Já existe uma conta cadastrada com este e-mail.',
          );
          return;
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
            'Não foi possível criar a conta.',
        );

        return;
      }

      onCadastrar();
    } catch (error) {
      console.log(
        'Erro ao cadastrar usuário:',
        error,
      );

      setErro(
        'Não foi possível conectar à API do NoteGrana. Verifique se o computador e o celular estão na mesma rede Wi-Fi e se a API está em execução.',
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <SafeAreaView
      style={styles.container}>
      <ScrollView
        contentContainerStyle={
          styles.content
        }
        keyboardShouldPersistTaps="handled">
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

        <Text style={styles.title}>
          Criar conta
        </Text>

        <Text style={styles.subtitle}>
          Comece a controlar seus gastos
          com o NoteGrana
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Seu nome"
          placeholderTextColor="#666666"
          value={nome}
          onChangeText={setNome}
          autoCorrect={false}
          editable={!carregando}
        />

        <TextInput
          style={styles.input}
          placeholder="Seu e-mail"
          placeholderTextColor="#666666"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!carregando}
        />

        <View
          style={
            styles.passwordContainer
          }>
          <TextInput
            style={
              styles.passwordInput
            }
            placeholder="Crie uma senha"
            placeholderTextColor="#666666"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry={
              !mostrarSenha
            }
            editable={!carregando}
          />

          <TouchableOpacity
            disabled={carregando}
            onPress={() =>
              setMostrarSenha(
                !mostrarSenha,
              )
            }>
            <Text style={styles.eye}>
              {mostrarSenha
                ? '●'
                : '◉'}
            </Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Confirme sua senha"
          placeholderTextColor="#666666"
          value={confirmarSenha}
          onChangeText={
            setConfirmarSenha
          }
          secureTextEntry={
            !mostrarSenha
          }
          editable={!carregando}
          onSubmitEditing={cadastrar}
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
            styles.registerButton,
            carregando &&
              styles.registerButtonDisabled,
          ]}
          disabled={carregando}
          onPress={cadastrar}>
          {carregando ? (
            <ActivityIndicator
              color="#FFFFFF"
            />
          ) : (
            <Text
              style={
                styles.registerButtonText
              }>
              Criar conta
            </Text>
          )}
        </TouchableOpacity>

        <View
          style={
            styles.loginContainer
          }>
          <Text
            style={
              styles.loginQuestion
            }>
            Já possui uma conta?{' '}
          </Text>

          <TouchableOpacity
            disabled={carregando}
            onPress={onVoltar}>
            <Text
              style={styles.loginLink}>
              Entrar
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },

    content: {
      flexGrow: 1,
      alignItems: 'center',
      paddingHorizontal: 32,
      paddingTop: 24,
      paddingBottom: 30,
    },

    backButton: {
      alignSelf: 'flex-start',
      paddingVertical: 10,
      marginBottom: 20,
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

    title: {
      color: '#3F6B3A',
      fontSize: 28,
      fontWeight: 'bold',
      marginTop: 4,
      marginBottom: 12,
    },

    subtitle: {
      color: '#777777',
      fontSize: 14,
      fontWeight: '600',
      textAlign: 'center',
      lineHeight: 19,
      marginBottom: 28,
    },

    input: {
      width: '100%',
      height: 52,
      backgroundColor: '#F3F3F3',
      borderRadius: 13,
      paddingHorizontal: 18,
      color: '#222222',
      fontWeight: '600',
      marginBottom: 18,
      elevation: 3,
    },

    passwordContainer: {
      width: '100%',
      height: 52,
      backgroundColor: '#F3F3F3',
      borderRadius: 13,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 18,
      marginBottom: 18,
      elevation: 3,
    },

    passwordInput: {
      flex: 1,
      color: '#222222',
      fontWeight: '600',
    },

    eye: {
      color: '#333333',
      fontSize: 16,
    },

    errorText: {
      width: '100%',
      color: '#B3261E',
      fontSize: 11,
      marginBottom: 14,
      textAlign: 'center',
    },

    registerButton: {
      width: '100%',
      height: 52,
      backgroundColor: '#F4E83F',
      borderRadius: 13,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 3,
    },

    registerButtonDisabled: {
      opacity: 0.7,
    },

    registerButtonText: {
      color: '#FFFFFF',
      fontSize: 15,
      fontWeight: 'bold',
    },

    loginContainer: {
      flexDirection: 'row',
      marginTop: 30,
    },

    loginQuestion: {
      color: '#7C9B76',
      fontSize: 12,
    },

    loginLink: {
      color: '#3F6B3A',
      fontSize: 12,
      fontWeight: 'bold',
    },
  });

export default CadastroScreen;
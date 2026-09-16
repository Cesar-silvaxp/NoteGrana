import React, {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const API_URL = 'http://192.168.2.11:8080';

export type UsuarioLogado = {
  id: number;
  nome: string;
  email: string;
  criadoEm: string;
};

type LoginResponse = {
  token: string;
  tipo: string;
  expiraEm: string;
  usuario: UsuarioLogado;
};

type LoginScreenProps = {
  onLogin: (
    token: string,
    usuario: UsuarioLogado,
  ) => void;
  onCriarConta: () => void;
  onRecuperarSenha: () => void;
};

function LoginScreen({
  onLogin,
  onCriarConta,
  onRecuperarSenha,
}: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] =
    useState(false);
  const [carregando, setCarregando] =
    useState(false);

  async function entrar() {
    const emailNormalizado =
      email.trim().toLowerCase();

    if (!emailNormalizado || !senha) {
      Alert.alert(
        'Atenção',
        'Informe seu e-mail e sua senha.',
      );
      return;
    }

    try {
      setCarregando(true);

      const response = await fetch(
        `${API_URL}/api/usuarios/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            email: emailNormalizado,
            senha,
          }),
        },
      );

      if (!response.ok) {
        if (response.status === 401) {
          Alert.alert(
            'Não foi possível entrar',
            'E-mail ou senha inválidos.',
          );
          return;
        }

        let mensagem =
          'Não foi possível realizar o login.';

        try {
          const erro = await response.json();

          if (erro?.mensagem) {
            mensagem = erro.mensagem;
          }
        } catch {
          // Mantém a mensagem padrão.
        }

        Alert.alert(
          'Erro',
          mensagem,
        );

        return;
      }

      const dados: LoginResponse =
        await response.json();

      if (
        !dados.token ||
        !dados.usuario
      ) {
        Alert.alert(
          'Erro',
          'A resposta da API não é válida.',
        );
        return;
      }

      onLogin(
        dados.token,
        dados.usuario,
      );
    } catch (error) {
      console.log(
        'Erro ao conectar com a API:',
        error,
      );

      Alert.alert(
        'Erro de conexão',
        'Não foi possível conectar à API do NoteGrana. Verifique se o computador e o celular estão na mesma rede Wi-Fi e se a API está em execução.',
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logo}>
          <Text style={styles.logoIcon}>▰</Text>
        </View>

        <Text style={styles.title}>
          NoteGrana
        </Text>

        <Text style={styles.subtitle}>
          Controle seus gastos de{'\n'}
          forma inteligente
        </Text>

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

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Sua senha"
            placeholderTextColor="#666666"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry={!mostrarSenha}
            editable={!carregando}
            onSubmitEditing={entrar}
          />

          <TouchableOpacity
            disabled={carregando}
            onPress={() =>
              setMostrarSenha(
                !mostrarSenha,
              )
            }>
            <Text style={styles.eye}>
              {mostrarSenha ? '●' : '◉'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.loginButton,
            carregando &&
              styles.loginButtonDisabled,
          ]}
          disabled={carregando}
          onPress={entrar}>
          {carregando ? (
            <ActivityIndicator
              color="#FFFFFF"
            />
          ) : (
            <Text
              style={
                styles.loginButtonText
              }>
              Entrar
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          disabled={carregando}
          onPress={onRecuperarSenha}>
          <Text style={styles.forgotPassword}>
            Esqueci minha senha
          </Text>
        </TouchableOpacity>

        <View
          style={
            styles.createAccountContainer
          }>
          <Text style={styles.newHere}>
            Novo por aqui?{' '}
          </Text>

          <TouchableOpacity
            disabled={carregando}
            onPress={onCriarConta}>
            <Text style={styles.createAccount}>
              Criar conta
            </Text>
          </TouchableOpacity>
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
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 65,
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
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 18,
  },

  subtitle: {
    color: '#777777',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 19,
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
    marginBottom: 20,
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
    marginBottom: 22,
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

  loginButton: {
    width: '100%',
    height: 52,
    backgroundColor: '#F4E83F',
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },

  loginButtonDisabled: {
    opacity: 0.7,
  },

  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },

  forgotPassword: {
    color: '#66885F',
    fontSize: 12,
    marginTop: 24,
  },

  createAccountContainer: {
    flexDirection: 'row',
    marginTop: 135,
  },

  newHere: {
    color: '#7C9B76',
    fontSize: 12,
  },

  createAccount: {
    color: '#3F6B3A',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
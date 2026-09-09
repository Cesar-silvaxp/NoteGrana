import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface CadastroScreenProps {
  onVoltar: () => void;
  onCadastrar: () => void;
}

function CadastroScreen({
  onVoltar,
  onCadastrar,
}: CadastroScreenProps) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] =
    useState('');

  const [mostrarSenha, setMostrarSenha] =
    useState(false);

  const [erro, setErro] = useState('');

  function validarCadastro() {
    const nomeLimpo = nome.trim();
    const emailLimpo = email.trim();

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
      setErro('Informe um e-mail válido.');
      return;
    }

    if (senha.length < 6) {
      setErro(
        'A senha deve possuir pelo menos 6 caracteres.',
      );
      return;
    }

    if (senha !== confirmarSenha) {
      setErro('As senhas não são iguais.');
      return;
    }

    setErro('');
    onCadastrar();
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
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
        />

        <TextInput
          style={styles.input}
          placeholder="Seu e-mail"
          placeholderTextColor="#666666"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Crie uma senha"
            placeholderTextColor="#666666"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry={!mostrarSenha}
          />

          <TouchableOpacity
            onPress={() =>
              setMostrarSenha(!mostrarSenha)
            }>
            <Text style={styles.eye}>
              {mostrarSenha ? '●' : '◉'}
            </Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Confirme sua senha"
          placeholderTextColor="#666666"
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          secureTextEntry={!mostrarSenha}
        />

        {erro ? (
          <Text style={styles.errorText}>
            {erro}
          </Text>
        ) : null}

        <TouchableOpacity
          style={styles.registerButton}
          onPress={validarCadastro}>
          <Text style={styles.registerButtonText}>
            Criar conta
          </Text>
        </TouchableOpacity>

        <View style={styles.loginContainer}>
          <Text style={styles.loginQuestion}>
            Já possui uma conta?{' '}
          </Text>

          <TouchableOpacity onPress={onVoltar}>
            <Text style={styles.loginLink}>
              Entrar
            </Text>
          </TouchableOpacity>
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
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

interface ErroApi {
  status?: number;
  mensagem?: string;
  campos?: Record<string, string> | null;
}

interface RedefinirSenhaScreenProps {
  token: string;
  onVoltar: () => void;
  onSenhaRedefinida: () => void;
}

function RedefinirSenhaScreen({
  token,
  onVoltar,
  onSenhaRedefinida,
}: RedefinirSenhaScreenProps) {
  const [novaSenha, setNovaSenha] =
    useState('');

  const [
    confirmarNovaSenha,
    setConfirmirmarNovaSenha,
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

  async function redefinirSenha() {
    if (
      !novaSenha ||
      !confirmarNovaSenha
    ) {
      setErro(
        'Preencha todos os campos para continuar.',
      );
      return;
    }

    if (novaSenha.length < 6) {
      setErro(
        'A nova senha deve possuir pelo menos 6 caracteres.',
      );
      return;
    }

    if (
      novaSenha !== confirmarNovaSenha
    ) {
      setErro(
        'A confirmação da nova senha não corresponde.',
      );
      return;
    }

    try {
      setCarregando(true);
      setErro('');

      const response = await fetch(
        `${API_URL}/api/recuperacao-senha/redefinir`,
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            token,
            novaSenha,
            confirmacaoNovaSenha:
              confirmarNovaSenha,
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
            'Não foi possível redefinir a senha.',
        );

        return;
      }

      onSenhaRedefinida();
    } catch (error) {
      console.log(
        'Erro ao redefinir senha:',
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

        <View
          style={styles.iconContainer}>
          <Text style={styles.icon}>
            ●
          </Text>
        </View>

        <Text style={styles.title}>
          Criar nova senha
        </Text>

        <Text
          style={styles.description}>
          Escolha uma nova senha para
          acessar sua conta do NoteGrana.
        </Text>

        <Text style={styles.label}>
          Nova senha
        </Text>

        <View
          style={
            styles.passwordContainer
          }>
          <TextInput
            style={
              styles.passwordInput
            }
            placeholder="Digite a nova senha"
            placeholderTextColor="#777777"
            value={novaSenha}
            onChangeText={texto => {
              setNovaSenha(texto);

              if (erro) {
                setErro('');
              }
            }}
            secureTextEntry={!mostrarSenha}
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

        <Text style={styles.label}>
          Confirmar nova senha
        </Text>

        <View
          style={
            styles.passwordContainer
          }>
          <TextInput
            style={
              styles.passwordInput
            }
            placeholder="Digite novamente a nova senha"
            placeholderTextColor="#777777"
            value={confirmarNovaSenha}
            onChangeText={texto => {
              setConfirmirmarNovaSenha(
                texto,
              );

              if (erro) {
                setErro('');
              }
            }}
            secureTextEntry={!mostrarSenha}
            editable={!carregando}
            onSubmitEditing={
              redefinirSenha
            }
          />
        </View>

        <Text
          style={styles.passwordHint}>
          Use pelo menos 6 caracteres.
        </Text>

        {erro ? (
          <Text
            style={styles.errorText}>
            {erro}
          </Text>
        ) : null}

        <TouchableOpacity
          style={[
            styles.saveButton,
            carregando &&
              styles.saveButtonDisabled,
          ]}
          disabled={carregando}
          onPress={redefinirSenha}>
          {carregando ? (
            <ActivityIndicator
              color="#FFFFFF"
            />
          ) : (
            <Text
              style={
                styles.saveButtonText
              }>
              Salvar nova senha
            </Text>
          )}
        </TouchableOpacity>
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
    paddingHorizontal: 32,
    paddingTop: 24,
    paddingBottom: 40,
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

  iconContainer: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: '#BDEBB9',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },

  icon: {
    color: '#3F6B3A',
    fontSize: 30,
  },

  title: {
    color: '#3F6B3A',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },

  description: {
    color: '#777777',
    fontSize: 12,
    lineHeight: 19,
    textAlign: 'center',
    marginBottom: 30,
  },

  label: {
    color: '#3F6B3A',
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 7,
    marginLeft: 3,
  },

  passwordContainer: {
    width: '100%',
    height: 52,
    backgroundColor: '#F3F3F3',
    borderRadius: 13,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginBottom: 20,
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

  passwordHint: {
    color: '#999999',
    fontSize: 9,
    marginTop: -8,
    marginBottom: 18,
  },

  errorText: {
    color: '#B3261E',
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'center',
    marginBottom: 16,
  },

  saveButton: {
    width: '100%',
    height: 52,
    backgroundColor: '#F4E83F',
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },

  saveButtonDisabled: {
    opacity: 0.7,
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default RedefinirSenhaScreen;
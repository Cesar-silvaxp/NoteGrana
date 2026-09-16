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

interface AlterarSenhaScreenProps {
  usuarioId: number;
  token: string;
  onVoltar: () => void;
  onSalvar: () => void;
}

function AlterarSenhaScreen({
  usuarioId,
  token,
  onVoltar,
  onSalvar,
}: AlterarSenhaScreenProps) {
  const [senhaAtual, setSenhaAtual] =
    useState('');

  const [novaSenha, setNovaSenha] =
    useState('');

  const [
    confirmarNovaSenha,
    setConfirmarNovaSenha,
  ] = useState('');

  const [
    mostrarSenhaAtual,
    setMostrarSenhaAtual,
  ] = useState(false);

  const [
    mostrarNovaSenha,
    setMostrarNovaSenha,
  ] = useState(false);

  const [erro, setErro] =
    useState('');

  const [
    carregando,
    setCarregando,
  ] = useState(false);

  async function salvarNovaSenha() {
    if (
      !senhaAtual ||
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

    if (novaSenha === senhaAtual) {
      setErro(
        'A nova senha deve ser diferente da senha atual.',
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
        `${API_URL}/api/usuarios/${usuarioId}/senha`,
        {
          method: 'PUT',
          headers: {
            'Content-Type':
              'application/json',
            Authorization:
              `Bearer ${token}`,
          },
          body: JSON.stringify({
            senhaAtual,
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
          // Mantém a mensagem padrão.
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
            'Não foi possível alterar a senha.',
        );

        return;
      }

      onSalvar();
    } catch (error) {
      console.log(
        'Erro ao alterar senha:',
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
          style={
            styles.iconContainer
          }>
          <Text
            style={styles.lockIcon}>
            ●
          </Text>
        </View>

        <Text style={styles.title}>
          Alterar senha
        </Text>

        <Text
          style={styles.description}>
          Para sua segurança, informe sua
          senha atual e escolha uma nova
          senha.
        </Text>

        <Text style={styles.label}>
          Senha atual
        </Text>

        <View
          style={
            styles.passwordContainer
          }>
          <TextInput
            style={
              styles.passwordInput
            }
            placeholder="Digite sua senha atual"
            placeholderTextColor="#777777"
            secureTextEntry={
              !mostrarSenhaAtual
            }
            value={senhaAtual}
            editable={!carregando}
            onChangeText={texto => {
              setSenhaAtual(texto);

              if (erro) {
                setErro('');
              }
            }}
          />

          <TouchableOpacity
            disabled={carregando}
            onPress={() =>
              setMostrarSenhaAtual(
                !mostrarSenhaAtual,
              )
            }>
            <Text style={styles.eye}>
              {mostrarSenhaAtual
                ? '●'
                : '◉'}
            </Text>
          </TouchableOpacity>
        </View>

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
            secureTextEntry={
              !mostrarNovaSenha
            }
            value={novaSenha}
            editable={!carregando}
            onChangeText={texto => {
              setNovaSenha(texto);

              if (erro) {
                setErro('');
              }
            }}
          />

          <TouchableOpacity
            disabled={carregando}
            onPress={() =>
              setMostrarNovaSenha(
                !mostrarNovaSenha,
              )
            }>
            <Text style={styles.eye}>
              {mostrarNovaSenha
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
            secureTextEntry={
              !mostrarNovaSenha
            }
            value={
              confirmarNovaSenha
            }
            editable={!carregando}
            onChangeText={texto => {
              setConfirmarNovaSenha(
                texto,
              );

              if (erro) {
                setErro('');
              }
            }}
            onSubmitEditing={
              salvarNovaSenha
            }
          />
        </View>

        <Text
          style={
            styles.passwordHint
          }>
          Use pelo menos 6 caracteres.
        </Text>

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
            styles.saveButton,
            carregando &&
              styles.saveButtonDisabled,
          ]}
          disabled={carregando}
          onPress={salvarNovaSenha}>
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

  lockIcon: {
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

export default AlterarSenhaScreen;
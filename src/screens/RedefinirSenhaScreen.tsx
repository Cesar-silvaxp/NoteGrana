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

const API_URL = 'https://notegrana-api.onrender.com';

interface ErroApi {
  status?: number;
  mensagem?: string;
  campos?: Record<string, string> | null;
}

interface RedefinirSenhaScreenProps {
  onVoltar: () => void;
  onSenhaRedefinida: () => void;
}

function RedefinirSenhaScreen({
  onVoltar,
  onSenhaRedefinida,
}: RedefinirSenhaScreenProps) {
  const [codigo, setCodigo] =
    useState('');

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

  function atualizarCodigo(
    texto: string,
  ) {
    const codigoNormalizado =
      texto
        .replace(/\s/g, '')
        .toUpperCase()
        .slice(0, 10);

    setCodigo(
      codigoNormalizado,
    );

    if (erro) {
      setErro('');
    }
  }

  async function redefinirSenha() {
    const codigoNormalizado =
      codigo
        .trim()
        .toUpperCase();

    if (
      !codigoNormalizado ||
      !novaSenha ||
      !confirmarNovaSenha
    ) {
      setErro(
        'Preencha todos os campos para continuar.',
      );
      return;
    }

    if (
      codigoNormalizado.length !== 10
    ) {
      setErro(
        'Digite o código de recuperação de 10 caracteres enviado por e-mail.',
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
            token:
              codigoNormalizado,
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
            'Código inválido ou expirado. Solicite um novo código e tente novamente.',
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
          Digite o código de recuperação enviado
          para seu e-mail e escolha uma nova senha.
        </Text>

        <View style={styles.emailNotice}>
          <Text
            style={
              styles.emailNoticeText
            }>
            O código é válido por 15 minutos.
            Se não encontrou o e-mail, verifique
            também a pasta Spam ou Lixo eletrônico.
          </Text>
        </View>

        <Text style={styles.label}>
          Código de recuperação
        </Text>

        <TextInput
          style={styles.codeInput}
          placeholder="Ex.: ABCD234XYZ"
          placeholderTextColor="#999999"
          value={codigo}
          onChangeText={
            atualizarCodigo
          }
          autoCapitalize="characters"
          autoCorrect={false}
          maxLength={10}
          editable={!carregando}
          textContentType="oneTimeCode"
        />

        <Text
          style={styles.codeHint}>
          Digite os 10 caracteres recebidos por e-mail.
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
            value={
              confirmarNovaSenha
            }
            onChangeText={texto => {
              setConfirmirmarNovaSenha(
                texto,
              );

              if (erro) {
                setErro('');
              }
            }}
            secureTextEntry={
              !mostrarSenha
            }
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
    marginBottom: 18,
  },

  emailNotice: {
    width: '100%',
    backgroundColor: '#F0F8EF',
    borderRadius: 13,
    paddingHorizontal: 16,
    paddingVertical: 13,
    marginBottom: 24,
  },

  emailNoticeText: {
    color: '#4F6F4B',
    fontSize: 10,
    lineHeight: 16,
    textAlign: 'center',
  },

  label: {
    color: '#3F6B3A',
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 7,
    marginLeft: 3,
  },

  codeInput: {
    width: '100%',
    height: 52,
    backgroundColor: '#F3F3F3',
    borderRadius: 13,
    paddingHorizontal: 18,
    color: '#222222',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 3,
    textAlign: 'center',
    marginBottom: 10,
    elevation: 3,
  },

  codeHint: {
    color: '#999999',
    fontSize: 9,
    marginBottom: 20,
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
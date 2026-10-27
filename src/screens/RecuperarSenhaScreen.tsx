import React, {useState} from 'react';

import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const API_URL =
  'https://notegrana-api.onrender.com';

interface RecuperarSenhaScreenProps {
  onVoltar: () => void;
  onEnviar: () => void;
}

function RecuperarSenhaScreen({
  onVoltar,
  onEnviar,
}: RecuperarSenhaScreenProps) {
  const [email, setEmail] =
    useState('');

  const [
    carregando,
    setCarregando,
  ] = useState(false);

  const [
    solicitado,
    setSolicitado,
  ] = useState(false);

  async function solicitarRecuperacao() {
    const emailNormalizado =
      email
        .trim()
        .toLowerCase();

    if (!emailNormalizado) {
      Alert.alert(
        'E-mail obrigatório',
        'Informe o e-mail cadastrado no NoteGrana.',
      );

      return;
    }

    try {
      setCarregando(true);

      const response = await fetch(
        `${API_URL}/api/recuperacao-senha/solicitar`,
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            email:
              emailNormalizado,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(
          'Não foi possível solicitar a recuperação de senha.',
        );
      }

      setSolicitado(true);
    } catch (error) {
      console.log(
        'Erro ao solicitar recuperação:',
        error,
      );

      Alert.alert(
        'Erro',
        'Não foi possível solicitar a recuperação de senha. Verifique sua conexão e tente novamente.',
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <SafeAreaView
      style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }>
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

          <View
            style={
              styles.iconContainer
            }>
            <Text style={styles.icon}>
              ●
            </Text>
          </View>

          <Text style={styles.title}>
            Recuperar senha
          </Text>

          {!solicitado ? (
            <>
              <Text
                style={
                  styles.description
                }>
                Informe o e-mail cadastrado
                no NoteGrana. Enviaremos um
                código para você redefinir
                sua senha.
              </Text>

              <Text style={styles.label}>
                E-mail
              </Text>

              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="seuemail@exemplo.com"
                placeholderTextColor="#777777"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!carregando}
                returnKeyType="send"
                onSubmitEditing={
                  solicitarRecuperacao
                }
              />

              <TouchableOpacity
                style={[
                  styles.sendButton,
                  carregando &&
                    styles.buttonDisabled,
                ]}
                disabled={carregando}
                onPress={
                  solicitarRecuperacao
                }>
                {carregando ? (
                  <ActivityIndicator
                    color="#FFFFFF"
                  />
                ) : (
                  <Text
                    style={
                      styles.sendButtonText
                    }>
                    Enviar código
                  </Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View
                style={
                  styles.noticeContainer
                }>
                <Text
                  style={
                    styles.noticeTitle
                  }>
                  Verifique seu e-mail
                </Text>

                <Text
                  style={
                    styles.noticeText
                  }>
                  Se o e-mail estiver
                  cadastrado, enviaremos um
                  código de recuperação.
                </Text>

                <Text
                  style={
                    styles.noticeText
                  }>
                  O código é válido por
                  15 minutos.
                </Text>

                <Text
                  style={
                    styles.spamText
                  }>
                  Não encontrou o e-mail?
                  Verifique também a pasta
                  Spam ou Lixo eletrônico.
                </Text>
              </View>

              <TouchableOpacity
                style={styles.sendButton}
                onPress={onEnviar}>
                <Text
                  style={
                    styles.sendButtonText
                  }>
                  Digitar código
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={
                  styles.secondaryButton
                }
                disabled={carregando}
                onPress={() =>
                  setSolicitado(false)
                }>
                <Text
                  style={
                    styles.secondaryButtonText
                  }>
                  Solicitar novo código
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
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
    justifyContent: 'center',
    paddingHorizontal: 32,
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

  input: {
    width: '100%',
    height: 52,
    backgroundColor: '#F3F3F3',
    borderRadius: 13,
    paddingHorizontal: 18,
    color: '#222222',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 20,
    elevation: 3,
  },

  sendButton: {
    width: '100%',
    height: 52,
    backgroundColor: '#F4E83F',
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },

  noticeContainer: {
    width: '100%',
    backgroundColor: '#F0F8EF',
    borderRadius: 13,
    paddingHorizontal: 18,
    paddingVertical: 18,
    marginBottom: 24,
  },

  noticeTitle: {
    color: '#3F6B3A',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },

  noticeText: {
    color: '#555555',
    fontSize: 11,
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: 8,
  },

  spamText: {
    color: '#3F6B3A',
    fontSize: 11,
    lineHeight: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 4,
  },

  secondaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    marginTop: 4,
  },

  secondaryButtonText: {
    color: '#3F6B3A',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default RecuperarSenhaScreen;
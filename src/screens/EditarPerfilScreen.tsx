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

interface Perfil {
  nome: string;
  email: string;
}

interface UsuarioAtualizado {
  id: number;
  nome: string;
  email: string;
  criadoEm: string;
}

interface ErroApi {
  status?: number;
  mensagem?: string;
  campos?: Record<string, string> | null;
}

interface EditarPerfilScreenProps {
  perfil: Perfil;
  usuarioId: number;
  token: string;
  onVoltar: () => void;
  onSalvar: (perfil: Perfil) => void;
}

function EditarPerfilScreen({
  perfil,
  usuarioId,
  token,
  onVoltar,
  onSalvar,
}: EditarPerfilScreenProps) {
  const [nome, setNome] =
    useState(perfil.nome);

  const [email, setEmail] =
    useState(perfil.email);

  const [erro, setErro] =
    useState('');

  const [
    carregando,
    setCarregando,
  ] = useState(false);

  async function salvarPerfil() {
    const nomeLimpo =
      nome.trim();

    const emailLimpo =
      email
        .trim()
        .toLowerCase();

    if (!nomeLimpo || !emailLimpo) {
      setErro(
        'Preencha nome e e-mail para continuar.',
      );
      return;
    }

    if (nomeLimpo.length < 2) {
      setErro(
        'Informe um nome válido.',
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
        `${API_URL}/api/usuarios/${usuarioId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type':
              'application/json',
            Authorization:
              `Bearer ${token}`,
          },
          body: JSON.stringify({
            nome: nomeLimpo,
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
          // Mantém o tratamento padrão.
        }

        if (response.status === 409) {
          setErro(
            erroApi?.mensagem ??
              'Este e-mail já está sendo utilizado.',
          );
          return;
        }

        if (response.status === 401) {
          setErro(
            'Sua sessão não é mais válida. Entre novamente.',
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
            'Não foi possível atualizar o perfil.',
        );

        return;
      }

      const usuario:
        UsuarioAtualizado =
        await response.json();

      onSalvar({
        nome: usuario.nome,
        email: usuario.email,
      });
    } catch (error) {
      console.log(
        'Erro ao atualizar perfil:',
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

        <View style={styles.avatar}>
          <Text
            style={styles.avatarText}>
            {nome.trim()
              ? nome
                  .trim()[0]
                  .toUpperCase()
              : '?'}
          </Text>
        </View>

        <Text style={styles.title}>
          Editar perfil
        </Text>

        <Text
          style={styles.description}>
          Atualize seus dados pessoais do
          NoteGrana.
        </Text>

        <Text style={styles.label}>
          Nome
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Seu nome"
          placeholderTextColor="#777777"
          value={nome}
          editable={!carregando}
          onChangeText={texto => {
            setNome(texto);

            if (erro) {
              setErro('');
            }
          }}
        />

        <Text style={styles.label}>
          E-mail
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Seu e-mail"
          placeholderTextColor="#777777"
          value={email}
          editable={!carregando}
          onChangeText={texto => {
            setEmail(texto);

            if (erro) {
              setErro('');
            }
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          onSubmitEditing={salvarPerfil}
        />

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
          onPress={salvarPerfil}>
          {carregando ? (
            <ActivityIndicator
              color="#FFFFFF"
            />
          ) : (
            <Text
              style={
                styles.saveButtonText
              }>
              Salvar alterações
            </Text>
          )}
        </TouchableOpacity>

        <Text style={styles.helpText}>
          As alterações serão salvas
          diretamente na sua conta do
          NoteGrana.
        </Text>
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
    marginBottom: 26,
  },

  backButtonText: {
    color: '#3F6B3A',
    fontSize: 12,
    fontWeight: 'bold',
  },

  avatar: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: '#BDEBB9',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },

  avatarText: {
    color: '#3F6B3A',
    fontSize: 32,
    fontWeight: 'bold',
  },

  title: {
    color: '#3F6B3A',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },

  description: {
    color: '#777777',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
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
    fontWeight: '600',
    marginBottom: 20,
    elevation: 3,
  },

  errorText: {
    color: '#B3261E',
    fontSize: 11,
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

  helpText: {
    color: '#999999',
    fontSize: 9,
    lineHeight: 14,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default EditarPerfilScreen;
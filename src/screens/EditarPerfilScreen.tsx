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

interface Perfil {
  nome: string;
  email: string;
}

interface EditarPerfilScreenProps {
  perfil: Perfil;
  onVoltar: () => void;
  onSalvar: (perfil: Perfil) => void;
}

function EditarPerfilScreen({
  perfil,
  onVoltar,
  onSalvar,
}: EditarPerfilScreenProps) {
  const [nome, setNome] = useState(perfil.nome);
  const [email, setEmail] = useState(perfil.email);
  const [erro, setErro] = useState('');

  function validarPerfil() {
    const nomeLimpo = nome.trim();
    const emailLimpo = email.trim();

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

    setErro('');

    onSalvar({
      nome: nomeLimpo,
      email: emailLimpo,
    });
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

        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {nome.trim()
              ? nome.trim()[0].toUpperCase()
              : '?'}
          </Text>
        </View>

        <Text style={styles.title}>
          Editar perfil
        </Text>

        <Text style={styles.description}>
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
          onChangeText={texto => {
            setEmail(texto);

            if (erro) {
              setErro('');
            }
          }}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {erro ? (
          <Text style={styles.errorText}>
            {erro}
          </Text>
        ) : null}

        <TouchableOpacity
          style={styles.saveButton}
          onPress={validarPerfil}>
          <Text style={styles.saveButtonText}>
            Salvar alterações
          </Text>
        </TouchableOpacity>

        <Text style={styles.helpText}>
          A alteração será salva definitivamente
          quando o perfil estiver integrado à API.
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
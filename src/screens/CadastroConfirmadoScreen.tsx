import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface CadastroConfirmadoScreenProps {
  onVoltarLogin: () => void;
}

function CadastroConfirmadoScreen({
  onVoltarLogin,
}: CadastroConfirmadoScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.successCircle}>
          <Text style={styles.successIcon}>
            ✓
          </Text>
        </View>

        <Text style={styles.title}>
          Cadastro realizado!
        </Text>

        <Text style={styles.description}>
          Sua conta foi criada com sucesso.
          Agora você já pode entrar no NoteGrana.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={onVoltarLogin}>
          <Text style={styles.buttonText}>
            Ir para o login
          </Text>
        </TouchableOpacity>
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
    justifyContent: 'center',
    paddingHorizontal: 32,
  },

  successCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#BDEBB9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },

  successIcon: {
    color: '#3F6B3A',
    fontSize: 42,
    fontWeight: 'bold',
  },

  title: {
    color: '#3F6B3A',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 14,
    textAlign: 'center',
  },

  description: {
    color: '#777777',
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 34,
  },

  button: {
    width: '100%',
    height: 52,
    backgroundColor: '#F4E83F',
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default CadastroConfirmadoScreen;
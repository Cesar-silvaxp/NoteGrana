import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface RecuperacaoConfirmadaScreenProps {
  onVoltarLogin: () => void;
}

function RecuperacaoConfirmadaScreen({
  onVoltarLogin,
}: RecuperacaoConfirmadaScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Text style={styles.icon}>
            ✓
          </Text>
        </View>

        <Text style={styles.title}>
          Solicitação enviada!
        </Text>

        <Text style={styles.description}>
          Se o e-mail estiver cadastrado no
          NoteGrana, você receberá as instruções
          para redefinir sua senha.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={onVoltarLogin}>
          <Text style={styles.buttonText}>
            Voltar para o login
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

  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#BDEBB9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },

  icon: {
    color: '#3F6B3A',
    fontSize: 42,
    fontWeight: 'bold',
  },

  title: {
    color: '#3F6B3A',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 14,
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

export default RecuperacaoConfirmadaScreen;
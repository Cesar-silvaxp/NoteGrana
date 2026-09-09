import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface SenhaAlteradaScreenProps {
  onContinuar: () => void;
}

function SenhaAlteradaScreen({
  onContinuar,
}: SenhaAlteradaScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.successCircle}>
          <Text style={styles.successIcon}>
            ✓
          </Text>
        </View>

        <Text style={styles.title}>
          Senha alterada!
        </Text>

        <Text style={styles.description}>
          Sua senha foi atualizada com sucesso.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={onContinuar}>
          <Text style={styles.buttonText}>
            Voltar para Configurações
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

export default SenhaAlteradaScreen;
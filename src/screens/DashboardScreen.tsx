import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

function DashboardScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Olá, Pedro</Text>
          <Text style={styles.month}>Março, 2026</Text>
        </View>

        {/* Total do mês */}
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total do Mês</Text>
          <Text style={styles.totalValue}>R$ 1.300,00</Text>
        </View>

        {/* Últimos gastos */}
        <Text style={styles.sectionTitle}>Últimos Gastos</Text>

        <View style={styles.expensesContainer}>
          <View style={styles.expenseRow}>
            <Text style={styles.expenseDate}>Hoje</Text>
            <Text style={styles.expenseValue}>R$ 500,00</Text>
          </View>

          <View style={styles.separator} />

          <View style={styles.expenseRow}>
            <Text style={styles.expenseDate}>Ontem</Text>
            <Text style={styles.expenseValue}>R$ 200,00</Text>
          </View>

          <View style={styles.separator} />

          <View style={styles.expenseRow}>
            <Text style={styles.expenseDate}>10 Mar</Text>
            <Text style={styles.expenseValue}>R$ 500,00</Text>
          </View>

          <View style={styles.separator} />

          <View style={styles.expenseRow}>
            <Text style={styles.expenseDate}>2 Mar</Text>
            <Text style={styles.expenseValue}>R$ 100,00</Text>
          </View>
        </View>
      </View>

      {/* Menu inferior */}
      <View style={styles.bottomNavigation}>
        <View style={styles.navigationItem}>
          <View style={styles.navigationIcon} />
          <Text style={styles.navigationText}>Dashboard</Text>
        </View>

        <View style={styles.navigationItem}>
          <View style={styles.navigationIcon} />
          <Text style={styles.navigationText}>Relatórios</Text>
        </View>

        <View style={styles.navigationItem}>
          <View style={styles.navigationIcon} />
          <Text style={styles.navigationText}>Configurações</Text>
        </View>
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
    paddingHorizontal: 16,
    paddingTop: 18,
  },

  header: {
    marginBottom: 24,
  },

  greeting: {
    color: '#3F6B3A',
    fontSize: 14,
    fontWeight: 'bold',
  },

  month: {
    color: '#777777',
    fontSize: 10,
    marginTop: 2,
  },

  totalCard: {
    width: '100%',
    height: 85,
    backgroundColor: '#BDEBB9',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingTop: 14,
    marginBottom: 32,
  },

  totalLabel: {
    color: '#3F6B3A',
    fontSize: 12,
    fontWeight: 'bold',
  },

  totalValue: {
    color: '#222222',
    fontSize: 16,
    marginTop: 5,
  },

  sectionTitle: {
    alignSelf: 'center',
    width: '85%',
    backgroundColor: '#F3F3F3',
    color: '#222222',
    textAlign: 'center',
    paddingVertical: 9,
    fontSize: 13,
    marginBottom: 14,
  },

  expensesContainer: {
    borderWidth: 1,
    borderColor: '#555555',
    borderRadius: 18,
    overflow: 'hidden',
  },

  expenseRow: {
    height: 50,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  expenseDate: {
    color: '#222222',
    fontSize: 11,
  },

  expenseValue: {
    color: '#222222',
    fontSize: 11,
  },

  separator: {
    height: 1,
    backgroundColor: '#DDDDDD',
  },

  bottomNavigation: {
    height: 82,
    backgroundColor: '#BDEBB9',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 5,
  },

  navigationItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 90,
  },

  navigationIcon: {
    width: 27,
    height: 27,
    borderRadius: 8,
    backgroundColor: '#3F6B3A',
    marginBottom: 5,
  },

  navigationText: {
    color: '#222222',
    fontSize: 9,
  },
});

export default DashboardScreen;
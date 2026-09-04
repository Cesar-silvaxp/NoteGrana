import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Modal,
  NativeModules,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

interface Gasto {
  id: string;
  valor: number;
  titulo: string;
  descricao: string;
  pacoteOrigem: string;
  dataHora: number;
  status: string;
}

interface RelatorioScreenProps {
  onAbrirDashboard: () => void;
}

interface MesSelecionado {
  ano: number;
  mes: number;
}

const {GastoModule} = NativeModules;

const nomesMeses = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const mesesCurtos = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
];

function RelatorioScreen({
  onAbrirDashboard,
}: RelatorioScreenProps) {
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);

  const agora = new Date();

  const [mesSelecionado, setMesSelecionado] =
    useState<MesSelecionado>({
      ano: agora.getFullYear(),
      mes: agora.getMonth(),
    });

  const carregarGastos = useCallback(async () => {
    try {
      setCarregando(true);

      if (!GastoModule) {
        throw new Error(
          'GastoModule não está disponível.',
        );
      }

      const resultado: Gasto[] =
        await GastoModule.listarGastos();

      const ativos = resultado
        .filter(gasto => gasto.status === 'ATIVO')
        .sort((a, b) => b.dataHora - a.dataHora);

      setGastos(ativos);

      if (ativos.length > 0) {
        const dataMaisRecente =
          new Date(ativos[0].dataHora);

        setMesSelecionado({
          ano: dataMaisRecente.getFullYear(),
          mes: dataMaisRecente.getMonth(),
        });
      }
    } catch (error) {
      console.error(
        'Erro ao carregar relatório:',
        error,
      );
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarGastos();
  }, [carregarGastos]);

  const gastosMes = useMemo(() => {
    return gastos.filter(gasto => {
      const data = new Date(gasto.dataHora);

      return (
        data.getFullYear() === mesSelecionado.ano &&
        data.getMonth() === mesSelecionado.mes
      );
    });
  }, [gastos, mesSelecionado]);

  const totalMes = useMemo(() => {
    return gastosMes.reduce(
      (total, gasto) => total + gasto.valor,
      0,
    );
  }, [gastosMes]);

  const mesesGrafico = useMemo(() => {
    const resultado = [];

    for (
      let deslocamento = -2;
      deslocamento <= 1;
      deslocamento++
    ) {
      const data = new Date(
        mesSelecionado.ano,
        mesSelecionado.mes + deslocamento,
        1,
      );

      const ano = data.getFullYear();
      const mes = data.getMonth();

      const total = gastos
        .filter(gasto => {
          const dataGasto =
            new Date(gasto.dataHora);

          return (
            dataGasto.getFullYear() === ano &&
            dataGasto.getMonth() === mes
          );
        })
        .reduce(
          (soma, gasto) =>
            soma + gasto.valor,
          0,
        );

      resultado.push({
        ano,
        mes,
        total,
        selecionado:
          ano === mesSelecionado.ano &&
          mes === mesSelecionado.mes,
      });
    }

    return resultado;
  }, [gastos, mesSelecionado]);

  const maiorValorGrafico = Math.max(
    ...mesesGrafico.map(item => item.total),
    1,
  );

  const opcoesMes = useMemo(() => {
    const opcoes: MesSelecionado[] = [];

    const centro = new Date(
      mesSelecionado.ano,
      mesSelecionado.mes,
      1,
    );

    for (let i = -12; i <= 12; i++) {
      const data = new Date(
        centro.getFullYear(),
        centro.getMonth() + i,
        1,
      );

      opcoes.push({
        ano: data.getFullYear(),
        mes: data.getMonth(),
      });
    }

    return opcoes.reverse();
  }, [
    mesSelecionado.ano,
    mesSelecionado.mes,
  ]);

  function formatarValor(valor: number) {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  function formatarData(dataHora: number) {
    return new Date(
      dataHora,
    ).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  function nomeMes(
    mes: number,
    ano: number,
  ) {
    return `${nomesMeses[mes]} ${ano}`;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}>
        <Text style={styles.title}>
          Relatórios
        </Text>

        <Pressable
          style={styles.monthSelector}
          onPress={() => setModalAberto(true)}>
          <Text
            style={styles.monthSelectorText}>
            {nomeMes(
              mesSelecionado.mes,
              mesSelecionado.ano,
            )}
          </Text>

          <Text style={styles.arrow}>
            ▼
          </Text>
        </Pressable>

        <View style={styles.sectionTitle}>
          <Text
            style={styles.sectionTitleText}>
            Despesas mensais
          </Text>
        </View>

        {carregando ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <>
            <View style={styles.chartCard}>
              <View style={styles.chartArea}>
                {mesesGrafico.map(item => {
                  const altura =
                    item.total === 0
                      ? 2
                      : Math.max(
                          4,
                          (item.total /
                            maiorValorGrafico) *
                            85,
                        );

                  return (
                    <View
                      key={`${item.ano}-${item.mes}`}
                      style={
                        styles.chartColumn
                      }>
                      <View style={styles.barArea}>
                        {item.selecionado &&
                          item.total > 0 && (
                            <Text
                              style={
                                styles.chartValue
                              }>
                              {formatarValor(
                                item.total,
                              )}
                            </Text>
                          )}

                        <View
                          style={[
                            styles.bar,
                            {
                              height: altura,
                            },
                            item.selecionado
                              ? styles.selectedBar
                              : styles.normalBar,
                          ]}
                        />
                      </View>

                      <Text
                        style={
                          styles.chartMonth
                        }>
                        {mesesCurtos[item.mes]}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>

            <View style={styles.totalCard}>
              <Text style={styles.totalLabel}>
                Total do Mês
              </Text>

              <Text style={styles.totalValue}>
                {formatarValor(totalMes)}
              </Text>

              <View
                style={styles.totalSeparator}
              />

              {gastosMes.length === 0 ? (
                <View
                  style={
                    styles.emptyContainer
                  }>
                  <Text
                    style={styles.emptyText}>
                    Nenhum gasto neste mês
                  </Text>
                </View>
              ) : (
                gastosMes.map(gasto => (
                  <View
                    key={gasto.id}
                    style={styles.expenseRow}>
                    <Text
                      style={
                        styles.expenseDate
                      }>
                      {formatarData(
                        gasto.dataHora,
                      )}
                    </Text>

                    <Text
                      style={
                        styles.expenseValue
                      }>
                      {formatarValor(
                        gasto.valor,
                      )}
                    </Text>
                  </View>
                ))
              )}
            </View>
          </>
        )}
      </ScrollView>

      <View style={styles.bottomNavigation}>
        <Pressable
          style={styles.navigationItem}
          onPress={onAbrirDashboard}>
          <View
            style={styles.navigationIcon}
          />

          <Text
            style={styles.navigationText}>
            Dashboard
          </Text>
        </Pressable>

        <View style={styles.navigationItem}>
          <View
            style={[
              styles.navigationIcon,
              styles.navigationIconActive,
            ]}
          />

          <Text
            style={styles.navigationText}>
            Relatórios
          </Text>
        </View>

        <View style={styles.navigationItem}>
          <View
            style={styles.navigationIcon}
          />

          <Text
            style={styles.navigationText}>
            Configurações
          </Text>
        </View>
      </View>

      <Modal
        visible={modalAberto}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setModalAberto(false)
        }>
        <Pressable
          style={styles.modalOverlay}
          onPress={() =>
            setModalAberto(false)
          }>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Selecionar mês
            </Text>

            <ScrollView
              style={styles.monthList}>
              {opcoesMes.map(opcao => (
                <Pressable
                  key={`${opcao.ano}-${opcao.mes}`}
                  style={styles.monthOption}
                  onPress={() => {
                    setMesSelecionado(opcao);
                    setModalAberto(false);
                  }}>
                  <Text
                    style={
                      styles.monthOptionText
                    }>
                    {nomeMes(
                      opcao.mes,
                      opcao.ano,
                    )}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  content: {
    paddingHorizontal: 18,
    paddingTop: 30,
    paddingBottom: 100,
  },

  title: {
    color: '#3F6B3A',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 28,
  },

  monthSelector: {
    height: 42,
    backgroundColor: '#BDEBB9',
    borderRadius: 12,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 42,
  },

  monthSelectorText: {
    color: '#222222',
    fontSize: 12,
  },

  arrow: {
    color: '#3F6B3A',
    fontSize: 11,
  },

  sectionTitle: {
    width: '84%',
    alignSelf: 'center',
    backgroundColor: '#F3F3F3',
    paddingVertical: 9,
    borderRadius: 2,
    marginBottom: 52,
  },

  sectionTitleText: {
    color: '#222222',
    fontSize: 17,
    textAlign: 'center',
  },

  loading: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },

  chartCard: {
    height: 205,
    borderWidth: 1,
    borderColor: '#555555',
    borderRadius: 25,
    paddingHorizontal: 18,
    paddingTop: 25,
    paddingBottom: 15,
    marginBottom: 34,
  },

  chartArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },

  chartColumn: {
    flex: 1,
    alignItems: 'center',
  },

  barArea: {
    height: 115,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  bar: {
    width: 21,
  },

  normalBar: {
    backgroundColor: '#BDEBB9',
  },

  selectedBar: {
    backgroundColor: '#3F6B3A',
  },

  chartValue: {
    color: '#222222',
    fontSize: 9,
    marginBottom: 5,
  },

  chartMonth: {
    color: '#222222',
    fontSize: 10,
    marginTop: 8,
    marginBottom: -20,
  },

  totalCard: {
    borderWidth: 1,
    borderColor: '#555555',
    borderRadius: 22,
    overflow: 'hidden',
    paddingTop: 12,
  },

  totalLabel: {
    color: '#222222',
    fontSize: 18,
    marginHorizontal: 20,
  },

  totalValue: {
    color: '#111111',
    fontSize: 22,
    marginHorizontal: 20,
    marginTop: 2,
    marginBottom: 12,
  },

  totalSeparator: {
    height: 1,
    backgroundColor: '#DDDDDD',
  },

  expenseRow: {
    minHeight: 30,
    paddingHorizontal: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#DDDDDD',
  },

  expenseDate: {
    color: '#222222',
    fontSize: 10,
  },

  expenseValue: {
    color: '#222222',
    fontSize: 10,
  },

  emptyContainer: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyText: {
    color: '#777777',
    fontSize: 11,
  },

  bottomNavigation: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,

    // Mesma altura do Dashboard
    height: 82,

    backgroundColor: '#BDEBB9',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',

    // Mesmo espaçamento do Dashboard
    paddingBottom: 5,
  },

  navigationItem: {
    alignItems: 'center',
    justifyContent: 'center',

    // Mesmo tamanho do Dashboard
    width: 90,
  },

  navigationIcon: {
    // Mesmo tamanho do Dashboard
    width: 27,
    height: 27,
    borderRadius: 8,

    backgroundColor: '#3F6B3A',
    marginBottom: 5,
  },

  navigationIconActive: {
    borderWidth: 2,
    borderColor: '#222222',
  },

  navigationText: {
    color: '#222222',
    fontSize: 9,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },

  modalContent: {
    maxHeight: '70%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
  },

  modalTitle: {
    color: '#3F6B3A',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },

  monthList: {
    maxHeight: 380,
  },

  monthOption: {
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },

  monthOptionText: {
    color: '#222222',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default RelatorioScreen;
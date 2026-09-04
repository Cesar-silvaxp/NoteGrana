import React, {useState} from 'react';
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import HistoricoScreen from './src/screens/HistoricoScreen';
import DetalhesGastoScreen from './src/screens/DetalhesGastoScreen';
import RelatorioScreen from './src/screens/RelatorioScreen';

interface Gasto {
  id: string;
  valor: number;
  titulo: string;
  descricao: string;
  pacoteOrigem: string;
  dataHora: number;
  status: string;
}

type Tela =
  | 'dashboard'
  | 'historico'
  | 'detalhes'
  | 'relatorios';

function App() {
  const [logado, setLogado] =
    useState(false);

  const [tela, setTela] =
    useState<Tela>('dashboard');

  const [
    gastoSelecionado,
    setGastoSelecionado,
  ] = useState<Gasto | null>(null);

  if (!logado) {
    return (
      <LoginScreen
        onLogin={() => {
          setLogado(true);
          setTela('dashboard');
        }}
      />
    );
  }

  if (
    tela === 'detalhes' &&
    gastoSelecionado
  ) {
    return (
      <DetalhesGastoScreen
        gasto={gastoSelecionado}
        onVoltar={() =>
          setTela('historico')
        }
      />
    );
  }

  if (tela === 'historico') {
    return (
      <HistoricoScreen
        onVoltar={() =>
          setTela('dashboard')
        }
        onSelecionarGasto={gasto => {
          setGastoSelecionado(gasto);
          setTela('detalhes');
        }}
      />
    );
  }

  if (tela === 'relatorios') {
    return (
      <RelatorioScreen
        onAbrirDashboard={() =>
          setTela('dashboard')
        }
      />
    );
  }

  return (
    <DashboardScreen
      onAbrirHistorico={() =>
        setTela('historico')
      }
      onAbrirRelatorios={() =>
        setTela('relatorios')
      }
    />
  );
}

export default App;
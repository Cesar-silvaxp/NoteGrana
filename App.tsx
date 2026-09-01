import React, {useState} from 'react';
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import HistoricoScreen from './src/screens/HistoricoScreen';

type Tela = 'dashboard' | 'historico';

function App() {
  const [logado, setLogado] = useState(false);
  const [tela, setTela] =
    useState<Tela>('dashboard');

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

  if (tela === 'historico') {
    return (
      <HistoricoScreen
        onVoltar={() => setTela('dashboard')}
      />
    );
  }

  return (
    <DashboardScreen
      onAbrirHistorico={() =>
        setTela('historico')
      }
    />
  );
}

export default App;
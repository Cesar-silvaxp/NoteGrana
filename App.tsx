import React, {useState} from 'react';
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';

function App() {
  const [logado, setLogado] = useState(false);

  if (logado) {
    return <DashboardScreen />;
  }

  return <LoginScreen onLogin={() => setLogado(true)} />;
}

export default App;
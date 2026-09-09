import React, {
  useCallback,
  useState,
} from 'react';

import LoginScreen from './src/screens/LoginScreen';
import CadastroScreen from './src/screens/CadastroScreen';
import CadastroConfirmadoScreen from './src/screens/CadastroConfirmadoScreen';
import RecuperarSenhaScreen from './src/screens/RecuperarSenhaScreen';
import RecuperacaoConfirmadaScreen from './src/screens/RecuperacaoConfirmadaScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import HistoricoScreen from './src/screens/HistoricoScreen';
import DetalhesGastoScreen from './src/screens/DetalhesGastoScreen';
import RelatorioScreen from './src/screens/RelatorioScreen';
import ConfiguracoesScreen from './src/screens/ConfiguracoesScreen';
import AlterarSenhaScreen from './src/screens/AlterarSenhaScreen';
import SenhaAlteradaScreen from './src/screens/SenhaAlteradaScreen';
import NotificationPermissionScreen from './src/screens/NotificationPermissionScreen';

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
  | 'login'
  | 'cadastro'
  | 'cadastroConfirmado'
  | 'recuperarSenha'
  | 'recuperacaoConfirmada'
  | 'permissao'
  | 'dashboard'
  | 'historico'
  | 'detalhes'
  | 'relatorios'
  | 'configuracoes'
  | 'alterarSenha'
  | 'senhaAlterada';

function App() {
  const [tela, setTela] =
    useState<Tela>('login');

  const [
    gastoSelecionado,
    setGastoSelecionado,
  ] = useState<Gasto | null>(null);

  const abrirDashboard =
    useCallback(() => {
      setTela('dashboard');
    }, []);

  if (tela === 'login') {
    return (
      <LoginScreen
        onLogin={() =>
          setTela('permissao')
        }
        onCriarConta={() =>
          setTela('cadastro')
        }
        onRecuperarSenha={() =>
          setTela('recuperarSenha')
        }
      />
    );
  }

  if (tela === 'cadastro') {
    return (
      <CadastroScreen
        onVoltar={() =>
          setTela('login')
        }
        onCadastrar={() =>
          setTela(
            'cadastroConfirmado',
          )
        }
      />
    );
  }

  if (
    tela ===
    'cadastroConfirmado'
  ) {
    return (
      <CadastroConfirmadoScreen
        onVoltarLogin={() =>
          setTela('login')
        }
      />
    );
  }

  if (tela === 'recuperarSenha') {
    return (
      <RecuperarSenhaScreen
        onVoltar={() =>
          setTela('login')
        }
        onEnviar={() =>
          setTela(
            'recuperacaoConfirmada',
          )
        }
      />
    );
  }

  if (
    tela ===
    'recuperacaoConfirmada'
  ) {
    return (
      <RecuperacaoConfirmadaScreen
        onVoltarLogin={() =>
          setTela('login')
        }
      />
    );
  }

  if (tela === 'permissao') {
    return (
      <NotificationPermissionScreen
        onPermissaoConcedida={
          abrirDashboard
        }
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
        onAbrirConfiguracoes={() =>
          setTela('configuracoes')
        }
      />
    );
  }

  if (tela === 'alterarSenha') {
    return (
      <AlterarSenhaScreen
        onVoltar={() =>
          setTela('configuracoes')
        }
        onSalvar={() =>
          setTela('senhaAlterada')
        }
      />
    );
  }

  if (tela === 'senhaAlterada') {
    return (
      <SenhaAlteradaScreen
        onContinuar={() =>
          setTela('configuracoes')
        }
      />
    );
  }

  if (tela === 'configuracoes') {
    return (
      <ConfiguracoesScreen
        onAbrirDashboard={() =>
          setTela('dashboard')
        }
        onAbrirRelatorios={() =>
          setTela('relatorios')
        }
        onAlterarSenha={() =>
          setTela('alterarSenha')
        }
        onSair={() => {
          setGastoSelecionado(null);
          setTela('login');
        }}
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
      onAbrirConfiguracoes={() =>
        setTela('configuracoes')
      }
    />
  );
}

export default App;
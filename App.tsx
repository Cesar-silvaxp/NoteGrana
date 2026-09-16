import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  BackHandler,
} from 'react-native';

import LoginScreen from './src/screens/LoginScreen';
import type {
  UsuarioLogado,
} from './src/screens/LoginScreen';

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
import EditarPerfilScreen from './src/screens/EditarPerfilScreen';
import PerfilAtualizadoScreen from './src/screens/PerfilAtualizadoScreen';
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
  | 'senhaAlterada'
  | 'editarPerfil'
  | 'perfilAtualizado';

function App() {
  const [tela, setTela] =
    useState<Tela>('login');

  const [
    gastoSelecionado,
    setGastoSelecionado,
  ] = useState<Gasto | null>(null);

  const [token, setToken] =
    useState<string | null>(null);

  const [perfil, setPerfil] =
    useState<UsuarioLogado | null>(null);

  const abrirDashboard =
    useCallback(() => {
      setTela('dashboard');
    }, []);

  const realizarLogin =
    useCallback(
      (
        novoToken: string,
        usuario: UsuarioLogado,
      ) => {
        setToken(novoToken);
        setPerfil(usuario);
        setTela('permissao');
      },
      [],
    );

  const sair =
    useCallback(() => {
      setToken(null);
      setPerfil(null);
      setGastoSelecionado(null);
      setTela('login');
    }, []);

  useEffect(() => {
    const voltarAndroid = () => {
      switch (tela) {
        case 'cadastro':
        case 'cadastroConfirmado':
        case 'recuperarSenha':
        case 'recuperacaoConfirmada':
        case 'permissao':
          setTela('login');
          return true;

        case 'historico':
          setTela('dashboard');
          return true;

        case 'detalhes':
          setTela('historico');
          return true;

        case 'relatorios':
          setTela('dashboard');
          return true;

        case 'configuracoes':
          setTela('dashboard');
          return true;

        case 'alterarSenha':
          setTela('configuracoes');
          return true;

        case 'senhaAlterada':
          setTela('configuracoes');
          return true;

        case 'editarPerfil':
          setTela('configuracoes');
          return true;

        case 'perfilAtualizado':
          setTela('configuracoes');
          return true;

        case 'login':
        case 'dashboard':
          return false;

        default:
          return false;
      }
    };

    const subscription =
      BackHandler.addEventListener(
        'hardwareBackPress',
        voltarAndroid,
      );

    return () => {
      subscription.remove();
    };
  }, [tela]);

  if (tela === 'login') {
    return (
      <LoginScreen
        onLogin={realizarLogin}
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
          setTela('cadastroConfirmado')
        }
      />
    );
  }

  if (tela === 'cadastroConfirmado') {
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

  if (
    tela === 'alterarSenha' &&
    perfil &&
    token
  ) {
    return (
      <AlterarSenhaScreen
        usuarioId={perfil.id}
        token={token}
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

  if (
    tela === 'editarPerfil' &&
    perfil &&
    token
  ) {
    return (
      <EditarPerfilScreen
        perfil={perfil}
        usuarioId={perfil.id}
        token={token}
        onVoltar={() =>
          setTela('configuracoes')
        }
        onSalvar={novoPerfil => {
          setPerfil(perfilAtual => {
            if (!perfilAtual) {
              return perfilAtual;
            }

            return {
              ...perfilAtual,
              nome: novoPerfil.nome,
              email: novoPerfil.email,
            };
          });

          setTela(
            'perfilAtualizado',
          );
        }}
      />
    );
  }

  if (
    tela === 'perfilAtualizado'
  ) {
    return (
      <PerfilAtualizadoScreen
        onContinuar={() =>
          setTela('configuracoes')
        }
      />
    );
  }

  if (
    tela === 'configuracoes' &&
    perfil
  ) {
    return (
      <ConfiguracoesScreen
        nomeUsuario={perfil.nome}
        emailUsuario={perfil.email}
        onEditarPerfil={() =>
          setTela('editarPerfil')
        }
        onAbrirDashboard={() =>
          setTela('dashboard')
        }
        onAbrirRelatorios={() =>
          setTela('relatorios')
        }
        onAlterarSenha={() =>
          setTela('alterarSenha')
        }
        onSair={sair}
      />
    );
  }

  if (!perfil || !token) {
    return (
      <LoginScreen
        onLogin={realizarLogin}
        onCriarConta={() =>
          setTela('cadastro')
        }
        onRecuperarSenha={() =>
          setTela('recuperarSenha')
        }
      />
    );
  }

  return (
    <DashboardScreen
      nomeUsuario={perfil.nome}
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
import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  Alert,
  BackHandler,
  NativeModules,
} from 'react-native';

import LoginScreen from './src/screens/LoginScreen';
import type {
  UsuarioLogado,
} from './src/screens/LoginScreen';

import CadastroScreen from './src/screens/CadastroScreen';
import CadastroConfirmadoScreen from './src/screens/CadastroConfirmadoScreen';
import RecuperarSenhaScreen from './src/screens/RecuperarSenhaScreen';
import RedefinirSenhaScreen from './src/screens/RedefinirSenhaScreen';
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

import {
  sincronizarGastos,
} from './src/services/GastoSyncService';

interface Gasto {
  id: string;
  valor: number;
  titulo: string;
  descricao: string;
  pacoteOrigem: string;
  dataHora: number;
  status: string;
}

interface GastoModuleType {
  definirUsuarioAtivo:
    (
      usuarioId: number,
    ) => Promise<boolean>;

  limparUsuarioAtivo:
    () => Promise<boolean>;
}

const GastoModule:
  GastoModuleType | undefined =
    NativeModules.GastoModule;

type Tela =
  | 'login'
  | 'cadastro'
  | 'cadastroConfirmado'
  | 'recuperarSenha'
  | 'redefinirSenha'
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
    useState<UsuarioLogado | null>(
      null,
    );

  const [
    sessaoNativaPronta,
    setSessaoNativaPronta,
  ] = useState(false);

  const abrirDashboard =
    useCallback(() => {
      setTela('dashboard');
    }, []);

  /*
   * O app ainda não restaura JWT e
   * perfil automaticamente ao abrir.
   *
   * Antes de permitir qualquer login,
   * removemos uma possível sessão
   * nativa antiga.
   */
  useEffect(() => {
    let ativo = true;

    async function prepararSessaoNativa() {
      try {
        if (!GastoModule) {
          console.log(
            'GastoModule não está disponível.',
          );

          return;
        }

        await GastoModule
          .limparUsuarioAtivo();

      } catch (error) {
        console.log(
          'Não foi possível limpar a sessão nativa inicial:',
          error,
        );

      } finally {
        if (ativo) {
          setSessaoNativaPronta(
            true,
          );
        }
      }
    }

    prepararSessaoNativa();

    return () => {
      ativo = false;
    };
  }, []);

  const realizarLogin =
    useCallback(
      async (
        novoToken: string,
        usuario: UsuarioLogado,
      ) => {
        if (!sessaoNativaPronta) {
          return;
        }

        if (!GastoModule) {
          Alert.alert(
            'Erro',
            'Não foi possível iniciar a sessão no dispositivo.',
          );

          return;
        }

        try {
          /*
           * Primeiro registramos o usuário
           * no Android.
           *
           * Só depois consideramos o login
           * concluído no React.
           */
          await GastoModule
            .definirUsuarioAtivo(
              usuario.id,
            );

          setToken(novoToken);
          setPerfil(usuario);
          setGastoSelecionado(null);
          setTela('permissao');

        } catch (error) {
          console.log(
            'Não foi possível definir o usuário ativo:',
            error,
          );

          Alert.alert(
            'Erro',
            'Não foi possível iniciar sua sessão no dispositivo. Tente novamente.',
          );
        }
      },
      [
        sessaoNativaPronta,
      ],
    );

  const sair =
    useCallback(
      async () => {
        if (!GastoModule) {
          Alert.alert(
            'Erro',
            'Não foi possível encerrar a sessão no dispositivo.',
          );

          return;
        }

        try {
          /*
           * Removemos primeiro o usuário
           * ativo no Android.
           *
           * Assim o listener deixa de
           * atribuir novos gastos à conta.
           */
          await GastoModule
            .limparUsuarioAtivo();

          setToken(null);
          setPerfil(null);
          setGastoSelecionado(null);
          setTela('login');

        } catch (error) {
          console.log(
            'Não foi possível limpar o usuário ativo:',
            error,
          );

          Alert.alert(
            'Erro',
            'Não foi possível encerrar sua sessão com segurança. Tente novamente.',
          );
        }
      },
      [],
    );

  /*
   * A sincronização só começa quando
   * token e usuário existem.
   *
   * O GastoModule filtra os registros
   * pelo usuario_id ativo.
   */
  useEffect(() => {
    if (
      !token ||
      !perfil ||
      !sessaoNativaPronta
    ) {
      return;
    }

    let ativo = true;

    async function executarSincronizacao() {
      try {
        const total =
          await sincronizarGastos(
            token as string,
          );

        if (ativo) {
          console.log(
            `Sincronização concluída. ${total} gasto(s) sincronizado(s).`,
          );
        }

      } catch (error) {
        if (ativo) {
          console.log(
            'Não foi possível executar a sincronização de gastos:',
            error,
          );
        }
      }
    }

    executarSincronizacao();

    return () => {
      ativo = false;
    };
  }, [
    token,
    perfil?.id,
    sessaoNativaPronta,
  ]);

  useEffect(() => {
    const voltarAndroid = () => {
      switch (tela) {
        case 'cadastro':
        case 'cadastroConfirmado':
        case 'recuperarSenha':
        case 'recuperacaoConfirmada':
          setTela('login');
          return true;

        case 'permissao':
          void sair();
          return true;

        case 'redefinirSenha':
          setTela(
            'recuperarSenha',
          );
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
        case 'senhaAlterada':
        case 'editarPerfil':
        case 'perfilAtualizado':
          setTela(
            'configuracoes',
          );
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
  }, [
    tela,
    sair,
  ]);

  /*
   * Não mostramos o login enquanto
   * a sessão nativa antiga ainda
   * estiver sendo limpa.
   *
   * Isso elimina a possibilidade de
   * um login ocorrer antes da limpeza
   * inicial terminar.
   */
  if (!sessaoNativaPronta) {
    return null;
  }

  if (tela === 'login') {
    return (
      <LoginScreen
        onLogin={realizarLogin}
        onCriarConta={() =>
          setTela('cadastro')
        }
        onRecuperarSenha={() =>
          setTela(
            'recuperarSenha',
          )
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

  if (
    tela ===
    'recuperarSenha'
  ) {
    return (
      <RecuperarSenhaScreen
        onVoltar={() =>
          setTela('login')
        }
        onEnviar={() =>
          setTela(
            'redefinirSenha',
          )
        }
      />
    );
  }

  if (
    tela ===
    'redefinirSenha'
  ) {
    return (
      <RedefinirSenhaScreen
        onVoltar={() =>
          setTela(
            'recuperarSenha',
          )
        }
        onSenhaRedefinida={() =>
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
        gasto={
          gastoSelecionado
        }
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
        onSelecionarGasto={
          gasto => {
            setGastoSelecionado(
              gasto,
            );

            setTela(
              'detalhes',
            );
          }
        }
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
          setTela(
            'configuracoes',
          )
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
          setTela(
            'configuracoes',
          )
        }
        onSalvar={() =>
          setTela(
            'senhaAlterada',
          )
        }
      />
    );
  }

  if (
    tela ===
    'senhaAlterada'
  ) {
    return (
      <SenhaAlteradaScreen
        onContinuar={() =>
          setTela(
            'configuracoes',
          )
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
          setTela(
            'configuracoes',
          )
        }
        onSalvar={
          novoPerfil => {
            setPerfil(
              perfilAtual => {
                if (!perfilAtual) {
                  return perfilAtual;
                }

                return {
                  ...perfilAtual,
                  nome:
                    novoPerfil.nome,
                  email:
                    novoPerfil.email,
                };
              },
            );

            setTela(
              'perfilAtualizado',
            );
          }
        }
      />
    );
  }

  if (
    tela ===
    'perfilAtualizado'
  ) {
    return (
      <PerfilAtualizadoScreen
        onContinuar={() =>
          setTela(
            'configuracoes',
          )
        }
      />
    );
  }

  if (
    tela ===
      'configuracoes' &&
    perfil
  ) {
    return (
      <ConfiguracoesScreen
        nomeUsuario={
          perfil.nome
        }
        emailUsuario={
          perfil.email
        }
        onEditarPerfil={() =>
          setTela(
            'editarPerfil',
          )
        }
        onAbrirDashboard={() =>
          setTela('dashboard')
        }
        onAbrirRelatorios={() =>
          setTela(
            'relatorios',
          )
        }
        onAlterarSenha={() =>
          setTela(
            'alterarSenha',
          )
        }
        onSair={() => {
          void sair();
        }}
      />
    );
  }

  if (
    !perfil ||
    !token
  ) {
    return (
      <LoginScreen
        onLogin={realizarLogin}
        onCriarConta={() =>
          setTela('cadastro')
        }
        onRecuperarSenha={() =>
          setTela(
            'recuperarSenha',
          )
        }
      />
    );
  }

  return (
    <DashboardScreen
      nomeUsuario={
        perfil.nome
      }
      onAbrirHistorico={() =>
        setTela('historico')
      }
      onAbrirRelatorios={() =>
        setTela(
          'relatorios',
        )
      }
      onAbrirConfiguracoes={() =>
        setTela(
          'configuracoes',
        )
      }
    />
  );
}

export default App;
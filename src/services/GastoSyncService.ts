import {
  NativeModules,
} from 'react-native';

const API_URL =
  'http://192.168.2.11:8080';

type StatusGasto =
  | 'ATIVO'
  | 'IGNORADO';

interface GastoPendente {
  id: string;
  valor: number;
  titulo: string;
  descricao: string;
  pacoteOrigem: string;
  dataHora: number;
  status: StatusGasto;
  apiId: number | null;
  sincronizado: boolean;
}

interface GastoApiResponse {
  id: number;
  valor: number;
  titulo: string;
  descricao: string | null;
  dataHora: string;
  status: StatusGasto;
  idOrigem: string | null;
  pacoteOrigem: string | null;
}

interface GastoModuleType {
  listarGastosPendentes:
    () => Promise<GastoPendente[]>;

  marcarGastoSincronizado:
    (
      idLocal: string,
      apiId: number,
    ) => Promise<boolean>;
}

const GastoModule:
  GastoModuleType =
    NativeModules.GastoModule;

function formatarDataHora(
  timestamp: number,
): string {
  const data =
    new Date(timestamp);

  const ano =
    data.getFullYear();

  const mes =
    String(
      data.getMonth() + 1,
    ).padStart(2, '0');

  const dia =
    String(
      data.getDate(),
    ).padStart(2, '0');

  const hora =
    String(
      data.getHours(),
    ).padStart(2, '0');

  const minuto =
    String(
      data.getMinutes(),
    ).padStart(2, '0');

  const segundo =
    String(
      data.getSeconds(),
    ).padStart(2, '0');

  return (
    `${ano}-${mes}-${dia}` +
    `T${hora}:${minuto}:${segundo}`
  );
}

async function criarGastoNaApi(
  gasto: GastoPendente,
  token: string,
): Promise<GastoApiResponse> {
  const response =
    await fetch(
      `${API_URL}/api/gastos`,
      {
        method: 'POST',
        headers: {
          'Content-Type':
            'application/json',
          Authorization:
            `Bearer ${token}`,
        },
        body: JSON.stringify({
          valor:
            gasto.valor,

          titulo:
            gasto.titulo,

          descricao:
            gasto.descricao,

          dataHora:
            formatarDataHora(
              gasto.dataHora,
            ),

          idOrigem:
            gasto.id,

          pacoteOrigem:
            gasto.pacoteOrigem,
        }),
      },
    );

  if (!response.ok) {
    throw new Error(
      `Falha ao criar gasto na API: ${response.status}`,
    );
  }

  return response.json();
}

async function atualizarStatusNaApi(
  apiId: number,
  status: StatusGasto,
  token: string,
): Promise<void> {
  const acao =
    status === 'IGNORADO'
      ? 'ignorar'
      : 'reativar';

  const response =
    await fetch(
      `${API_URL}/api/gastos/${apiId}/${acao}`,
      {
        method: 'PATCH',
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      },
    );

  if (!response.ok) {
    throw new Error(
      `Falha ao atualizar status do gasto: ${response.status}`,
    );
  }
}

async function sincronizarGastoNovo(
  gasto: GastoPendente,
  token: string,
): Promise<void> {
  const gastoApi =
    await criarGastoNaApi(
      gasto,
      token,
    );

  /*
   * A API cria gastos novos como ATIVO.
   * Se o registro local já estiver
   * IGNORADO, sincronizamos o status
   * antes de marcá-lo como concluído.
   */
  if (
    gasto.status === 'IGNORADO'
  ) {
    await atualizarStatusNaApi(
      gastoApi.id,
      'IGNORADO',
      token,
    );
  }

  await GastoModule
    .marcarGastoSincronizado(
      gasto.id,
      gastoApi.id,
    );
}

async function sincronizarGastoExistente(
  gasto: GastoPendente,
  token: string,
): Promise<void> {
  if (gasto.apiId === null) {
    return;
  }

  await atualizarStatusNaApi(
    gasto.apiId,
    gasto.status,
    token,
  );

  await GastoModule
    .marcarGastoSincronizado(
      gasto.id,
      gasto.apiId,
    );
}

export async function sincronizarGastos(
  token: string,
): Promise<number> {
  if (!GastoModule) {
    throw new Error(
      'GastoModule não está disponível.',
    );
  }

  const gastos =
    await GastoModule
      .listarGastosPendentes();

  let totalSincronizados = 0;

  /*
   * Fazemos um por vez para evitar
   * concorrência no SQLite e para que
   * uma falha em um gasto não impeça
   * os demais de serem enviados.
   */
  for (const gasto of gastos) {
    try {
      if (gasto.apiId === null) {
        await sincronizarGastoNovo(
          gasto,
          token,
        );
      } else {
        await sincronizarGastoExistente(
          gasto,
          token,
        );
      }

      totalSincronizados += 1;
    } catch (error) {
      console.log(
        `Não foi possível sincronizar o gasto ${gasto.id}:`,
        error,
      );

      /*
       * O gasto continua com
       * sincronizado = false.
       *
       * Portanto poderá ser tentado
       * novamente mais tarde.
       */
    }
  }

  return totalSincronizados;
}
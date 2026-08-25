import {
  NextRequest,
  NextResponse,
} from "next/server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

import {
  sincronizarEnvioMelhorEnvio,
} from "@/lib/melhorEnvioEnvio";

import {
  obterConfiguracaoMelhorEnvio,
} from "@/lib/melhorEnvio";

type PedidoCron = {
  id: number;
  melhor_envio_order_id?: string | null;
  melhor_envio_status?: string | null;
  melhor_envio_ambiente?: "sandbox" | "producao" | null;
};

type ResultadoPedidoCron = {
  pedidoId: number;
  sucesso: boolean;
  status?: string;
  codigoRastreio?: string | null;
  mensagem: string;
};

const LIMITE_PEDIDOS_POR_EXECUCAO = 25;

const STATUS_FINALIZADOS = new Set([
  "entregue",
  "cancelado",
]);

function normalizarStatus(
  status?: string | null,
) {
  return String(status || "")
    .trim()
    .toLowerCase();
}

function validarAutorizacaoCron(
  request: NextRequest,
) {
  const cronSecret =
    process.env.CRON_SECRET;

  if (!cronSecret) {
    throw new Error(
      "CRON_SECRET não está configurado.",
    );
  }

  const authorization =
    request.headers.get("authorization");

  return (
    authorization ===
    `Bearer ${cronSecret}`
  );
}

export async function GET(
  request: NextRequest,
) {
  const inicio = Date.now();

  try {
    /*
     * =========================================================
     * 1. PROTEGER A ROTA
     * =========================================================
     */

    let autorizado = false;

    try {
      autorizado =
        validarAutorizacaoCron(
          request,
        );
    } catch (error) {
      console.error(
        "Erro de configuração do cron do Melhor Envio:",
        error,
      );

      return NextResponse.json(
        {
          sucesso: false,
          erro:
            "Configuração do cron ausente.",
        },
        {
          status: 500,
        },
      );
    }

    if (!autorizado) {
      console.warn(
        "Tentativa não autorizada de executar o cron do Melhor Envio.",
      );

      return NextResponse.json(
        {
          sucesso: false,
          erro:
            "Não autorizado.",
        },
        {
          status: 401,
        },
      );
    }

    /*
     * =========================================================
     * 2. IDENTIFICAR AMBIENTE ATUAL
     * =========================================================
     */

    const { ambiente } =
      obterConfiguracaoMelhorEnvio();

    /*
     * =========================================================
     * 3. BUSCAR PEDIDOS COM ENVIO NO AMBIENTE ATUAL
     * =========================================================
     */

    const {
      data: pedidosData,
      error: erroPedidos,
    } = await supabaseAdmin
      .from("pedidos")
      .select(`
        id,
        melhor_envio_order_id,
        melhor_envio_status,
        melhor_envio_ambiente
      `)
      .not(
        "melhor_envio_order_id",
        "is",
        null,
      )
      .eq(
        "melhor_envio_ambiente",
        ambiente,
      )
      .order(
        "id",
        {
          ascending: false,
        },
      )
      .limit(
        LIMITE_PEDIDOS_POR_EXECUCAO * 2,
      );

    if (erroPedidos) {
      console.error(
        "Erro ao buscar pedidos para sincronização automática do Melhor Envio:",
        erroPedidos,
      );

      return NextResponse.json(
        {
          sucesso: false,
          ambiente,
          erro:
            "Não foi possível consultar os pedidos.",
        },
        {
          status: 500,
        },
      );
    }

    const pedidos =
      (pedidosData || []) as PedidoCron[];

    /*
     * =========================================================
     * 4. IGNORAR ENVIOS FINALIZADOS
     * =========================================================
     */

    const pedidosPendentes =
      pedidos
        .filter(
          (pedido) =>
            !STATUS_FINALIZADOS.has(
              normalizarStatus(
                pedido.melhor_envio_status,
              ),
            ),
        )
        .slice(
          0,
          LIMITE_PEDIDOS_POR_EXECUCAO,
        );

    /*
     * =========================================================
     * 5. SINCRONIZAR UM PEDIDO POR VEZ
     * =========================================================
     */

    const resultados:
      ResultadoPedidoCron[] = [];

    for (
      const pedido
      of pedidosPendentes
    ) {
      try {
        const resultado =
          await sincronizarEnvioMelhorEnvio(
            pedido.id,
          );

        resultados.push({
          pedidoId:
            pedido.id,
          sucesso:
            true,
          status:
            resultado.status,
          codigoRastreio:
            resultado.codigoRastreio,
          mensagem:
            resultado.mensagem,
        });
      } catch (error) {
        const mensagem =
          error instanceof Error
            ? error.message
            : "Erro desconhecido ao sincronizar envio.";

        console.error(
          `Erro ao sincronizar automaticamente o pedido ${pedido.id}:`,
          error,
        );

        resultados.push({
          pedidoId:
            pedido.id,
          sucesso:
            false,
          mensagem,
        });
      }
    }

    /*
     * =========================================================
     * 6. RESUMO DA EXECUÇÃO
     * =========================================================
     */

    const atualizados =
      resultados.filter(
        (resultado) =>
          resultado.sucesso,
      ).length;

    const erros =
      resultados.length -
      atualizados;

    const duracaoMs =
      Date.now() - inicio;

    console.log(
      "✅ Cron do Melhor Envio concluído.",
      {
        ambiente,
        encontrados:
          pedidos.length,
        processados:
          resultados.length,
        atualizados,
        erros,
        duracaoMs,
      },
    );

    return NextResponse.json({
      sucesso: true,
      ambiente,
      encontrados:
        pedidos.length,
      ignoradosFinalizados:
        pedidos.length -
        pedidosPendentes.length,
      processados:
        resultados.length,
      atualizados,
      erros,
      duracaoMs,
      resultados,
    });
  } catch (error) {
    console.error(
      "Erro inesperado no cron do Melhor Envio:",
      error,
    );

    return NextResponse.json(
      {
        sucesso: false,
        erro:
          "Erro interno ao sincronizar os envios.",
      },
      {
        status: 500,
      },
    );
  }
}
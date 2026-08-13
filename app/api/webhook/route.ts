import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import {
  InvalidWebhookSignatureError,
  WebhookSignatureValidator,
} from "mercadopago";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

type MercadoPagoPayment = {
  id?: number;
  status?: string;
  external_reference?: string | null;
};

type ProdutoPedido = {
  id?: number | string;
  nome?: string;
  tipo_produto?: string;
  arquivo_digital?: string | null;
  formato_arquivo?: string | null;
};

type PedidoBanco = {
  id: number;
  status?: string | null;
  produtos?: ProdutoPedido[] | null;
  download_liberado?: boolean | null;
};

type ResultadoConsultaPagamento = {
  payment: MercadoPagoPayment;
  ambiente: "producao" | "teste";
};

/*
 * =========================================================
 * CONSULTAR PAGAMENTO NO MERCADO PAGO
 * =========================================================
 *
 * Primeiro tentamos a credencial de produção.
 *
 * Se o pagamento não existir nesse ambiente e houver uma
 * credencial de teste disponível, tentamos novamente usando
 * MP_ACCESS_TOKEN_TESTE.
 *
 * Isso permite:
 *
 * PRODUÇÃO
 * → pagamentos reais com MP_ACCESS_TOKEN
 *
 * TESTES
 * → pagamentos criados com MP_ACCESS_TOKEN_TESTE
 */
async function consultarPagamentoMercadoPago(
  paymentId: string,
): Promise<ResultadoConsultaPagamento> {
  const tokens: Array<{
    token: string;
    ambiente: "producao" | "teste";
  }> = [];

  if (process.env.MP_ACCESS_TOKEN) {
    tokens.push({
      token: process.env.MP_ACCESS_TOKEN,
      ambiente: "producao",
    });
  }

  if (
    process.env.MP_ACCESS_TOKEN_TESTE &&
    process.env.MP_ACCESS_TOKEN_TESTE !==
      process.env.MP_ACCESS_TOKEN
  ) {
    tokens.push({
      token: process.env.MP_ACCESS_TOKEN_TESTE,
      ambiente: "teste",
    });
  }

  if (tokens.length === 0) {
    throw new Error(
      "Nenhum Access Token do Mercado Pago está configurado.",
    );
  }

  let ultimoStatus = 0;
  let ultimoErro = "";

  for (const configuracao of tokens) {
    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        method: "GET",

        headers: {
          Authorization: `Bearer ${configuracao.token}`,
          Accept: "application/json",
        },

        cache: "no-store",
      },
    );

    if (response.ok) {
      const payment =
        (await response.json()) as MercadoPagoPayment;

      console.log(
        "PAGAMENTO LOCALIZADO NO MERCADO PAGO:",
        {
          paymentId,
          ambiente: configuracao.ambiente,
          status: payment.status,
          external_reference:
            payment.external_reference,
        },
      );

      return {
        payment,
        ambiente: configuracao.ambiente,
      };
    }

    ultimoStatus = response.status;
    ultimoErro = await response.text();

    /*
     * Se for 404, pode simplesmente significar
     * que estamos consultando o ambiente errado.
     *
     * Nesse caso tentamos a próxima credencial.
     */
    if (response.status === 404) {
      console.log(
        `Pagamento ${paymentId} não encontrado no ambiente ${configuracao.ambiente}.`,
      );

      continue;
    }

    /*
     * Para outros erros, registramos e seguimos
     * para a próxima credencial caso exista.
     */
    console.error(
      `Erro ao consultar pagamento no ambiente ${configuracao.ambiente}:`,
      response.status,
      ultimoErro,
    );
  }

  console.error(
    "Pagamento não pôde ser consultado no Mercado Pago:",
    {
      paymentId,
      ultimoStatus,
      ultimoErro,
    },
  );

  throw new Error(
    `Não foi possível consultar o pagamento ${paymentId} no Mercado Pago.`,
  );
}

/*
 * =========================================================
 * VERIFICAR SE O PEDIDO POSSUI PRODUTO DIGITAL
 * =========================================================
 */
function possuiProdutoDigital(
  produtos: ProdutoPedido[] | null | undefined,
) {
  if (!Array.isArray(produtos)) {
    return false;
  }

  return produtos.some((produto) => {
    const tipoProduto = String(
      produto?.tipo_produto || "",
    ).toLowerCase();

    return (
      tipoProduto === "digital" ||
      Boolean(produto?.arquivo_digital)
    );
  });
}

/*
 * =========================================================
 * CONVERTER STATUS MERCADO PAGO → STATUS DA LOJA
 * =========================================================
 */
function converterStatusPagamento(
  statusPagamento?: string,
) {
  switch (statusPagamento) {
    case "approved":
      return "aprovado";

    case "pending":
    case "in_process":
    case "in_mediation":
      return "pendente";

    case "rejected":
      return "recusado";

    case "cancelled":
      return "cancelado";

    case "refunded":
      return "reembolsado";

    case "charged_back":
      return "estornado";

    default:
      return null;
  }
}

export async function POST(req: Request) {
  try {
    /*
     * =========================================================
     * 1. VALIDAR ASSINATURA DO WEBHOOK
     * =========================================================
     */

    const webhookSecret =
      process.env.MP_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error(
        "MP_WEBHOOK_SECRET não está configurada.",
      );

      return NextResponse.json(
        {
          error:
            "Configuração de segurança do webhook ausente.",
        },
        {
          status: 500,
        },
      );
    }

    const xSignature =
      req.headers.get("x-signature");

    const xRequestId =
      req.headers.get("x-request-id");

    const url = new URL(req.url);

    const dataId =
      url.searchParams.get("data.id");

    if (
      !xSignature ||
      !xRequestId ||
      !dataId
    ) {
      console.error(
        "Webhook recebido sem dados necessários para validar assinatura.",
        {
          possuiSignature:
            Boolean(xSignature),

          possuiRequestId:
            Boolean(xRequestId),

          possuiDataId:
            Boolean(dataId),
        },
      );

      return NextResponse.json(
        {
          error:
            "Notificação sem assinatura válida.",
        },
        {
          status: 401,
        },
      );
    }

    try {
      WebhookSignatureValidator.validate({
        xSignature,
        xRequestId,
        dataId,
        secret: webhookSecret,
      });
    } catch (error) {
      if (
        error instanceof
        InvalidWebhookSignatureError
      ) {
        console.error(
          "Assinatura inválida no webhook do Mercado Pago.",
        );

        return NextResponse.json(
          {
            error:
              "Assinatura do webhook inválida.",
          },
          {
            status: 401,
          },
        );
      }

      throw error;
    }

    /*
     * =========================================================
     * 2. LER NOTIFICAÇÃO
     * =========================================================
     */

    const body = await req.json();

    console.log(
      "WEBHOOK MERCADO PAGO VALIDADO:",
      {
        type: body?.type,
        action: body?.action,
        dataId,
      },
    );

    /*
     * Nosso webhook atual é destinado a pagamentos.
     *
     * Caso futuramente outros eventos sejam habilitados,
     * simplesmente reconhecemos a notificação.
     */
    if (
      body?.type &&
      body.type !== "payment"
    ) {
      console.log(
        "Webhook ignorado por não ser evento de pagamento:",
        body.type,
      );

      return NextResponse.json({
        success: true,
        ignored: true,
        type: body.type,
      });
    }

    const paymentId = dataId;

    /*
     * =========================================================
     * 3. CONSULTAR PAGAMENTO DIRETAMENTE NO MERCADO PAGO
     * =========================================================
     */

    let resultadoConsulta: ResultadoConsultaPagamento;

    try {
      resultadoConsulta =
        await consultarPagamentoMercadoPago(
          paymentId,
        );
    } catch (error) {
      console.error(
        "Erro ao consultar pagamento no Mercado Pago:",
        error,
      );

      return NextResponse.json(
        {
          error:
            "Não foi possível consultar o pagamento.",
        },
        {
          status: 502,
        },
      );
    }

    const payment =
      resultadoConsulta.payment;

    const ambientePagamento =
      resultadoConsulta.ambiente;

    console.log(
      "PAGAMENTO CONSULTADO:",
      {
        id: payment.id,
        status: payment.status,
        external_reference:
          payment.external_reference,
        ambiente:
          ambientePagamento,
      },
    );

    const statusPagamento =
      payment.status;

    const pedidoId = Number(
      payment.external_reference,
    );

    if (
      !Number.isInteger(pedidoId) ||
      pedidoId <= 0
    ) {
      console.error(
        "External reference inválida:",
        payment.external_reference,
      );

      return NextResponse.json(
        {
          error:
            "Pedido não encontrado para este pagamento.",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * =========================================================
     * 4. CONSULTAR PEDIDO NO SUPABASE
     * =========================================================
     */

    const {
      data: pedido,
      error: erroPedido,
    } = await supabase
      .from("pedidos")
      .select(
        `
          id,
          status,
          produtos,
          download_liberado
        `,
      )
      .eq("id", pedidoId)
      .maybeSingle();

    if (erroPedido) {
      console.error(
        "Erro ao consultar pedido:",
        erroPedido,
      );

      return NextResponse.json(
        {
          error:
            "Erro ao consultar pedido.",
        },
        {
          status: 500,
        },
      );
    }

    if (!pedido) {
      console.error(
        `Pedido ${pedidoId} não encontrado.`,
      );

      return NextResponse.json(
        {
          error:
            "Pedido não encontrado.",
        },
        {
          status: 404,
        },
      );
    }

    const pedidoAtual =
      pedido as PedidoBanco;

    const pedidoPossuiProdutoDigital =
      possuiProdutoDigital(
        pedidoAtual.produtos,
      );

    /*
     * =========================================================
     * 5. DEFINIR STATUS INTERNO
     * =========================================================
     */

    const statusInterno =
      converterStatusPagamento(
        statusPagamento,
      );

    /*
     * Caso o Mercado Pago envie algum status
     * ainda não mapeado, não alteramos o pedido.
     */
    if (!statusInterno) {
      console.log(
        "Status do Mercado Pago ainda não mapeado:",
        {
          paymentId,
          statusPagamento,
          pedidoId,
        },
      );

      return NextResponse.json({
        success: true,
        pedidoId,
        statusPagamento,
        ignored: true,
      });
    }

    /*
     * =========================================================
     * 6. DEFINIR LIBERAÇÃO DE DOWNLOAD
     * =========================================================
     *
     * Somente:
     *
     * pagamento aprovado
     * +
     * pedido contendo produto digital
     *
     * libera downloads.
     */

    const downloadLiberado =
      statusPagamento === "approved" &&
      pedidoPossuiProdutoDigital;

    /*
     * =========================================================
     * 7. ATUALIZAR PEDIDO
     * =========================================================
     *
     * Operação idempotente.
     *
     * Se a mesma notificação chegar novamente,
     * os dados permanecerão no mesmo estado.
     */

    const {
      data: pedidoAtualizado,
      error: erroAtualizacao,
    } = await supabase
      .from("pedidos")
      .update({
        status: statusInterno,
        download_liberado:
          downloadLiberado,
      })
      .eq("id", pedidoId)
      .select(
        `
          id,
          status,
          download_liberado
        `,
      )
      .maybeSingle();

    if (erroAtualizacao) {
      console.error(
        "Erro ao atualizar pedido:",
        erroAtualizacao,
      );

      return NextResponse.json(
        {
          error:
            "Erro ao atualizar pedido.",
        },
        {
          status: 500,
        },
      );
    }

    if (!pedidoAtualizado) {
      console.error(
        `Pedido ${pedidoId} não pôde ser atualizado.`,
      );

      return NextResponse.json(
        {
          error:
            "Pedido não pôde ser atualizado.",
        },
        {
          status: 404,
        },
      );
    }

    /*
     * =========================================================
     * 8. LOG FINAL
     * =========================================================
     */

    if (
      statusPagamento === "approved"
    ) {
      console.log(
        `✅ Pedido ${pedidoId} aprovado pelo Mercado Pago.`,
        {
          ambiente:
            ambientePagamento,

          possuiProdutoDigital:
            pedidoPossuiProdutoDigital,

          downloadLiberado,
        },
      );
    } else {
      console.log(
        `Pedido ${pedidoId} atualizado.`,
        {
          paymentId,
          statusPagamento,
          statusInterno,
          ambiente:
            ambientePagamento,
        },
      );
    }

    return NextResponse.json({
      success: true,

      pedidoId,

      paymentId,

      ambiente:
        ambientePagamento,

      statusPagamento,

      statusPedido:
        statusInterno,

      downloadLiberado,
    });
  } catch (error) {
    console.error(
      "Erro no webhook do Mercado Pago:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Erro interno no webhook.",
      },
      {
        status: 500,
      },
    );
  }
}
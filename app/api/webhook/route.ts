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

export async function POST(req: Request) {
  try {
    /*
     * =========================================================
     * 1. VALIDAR ASSINATURA DO WEBHOOK
     * =========================================================
     *
     * Antes de consultar ou alterar qualquer pedido,
     * confirmamos que a notificação realmente foi enviada
     * pelo Mercado Pago.
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
     * A partir deste ponto, a origem da notificação
     * já foi validada.
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
     * Utilizamos o ID que participou da validação
     * da assinatura como identificador do pagamento.
     */
    const paymentId = dataId;

    if (!paymentId) {
      return NextResponse.json({
        success: true,
        ignored: true,
      });
    }

    /*
     * =========================================================
     * 2. CONSULTAR PAGAMENTO DIRETAMENTE NO MERCADO PAGO
     * =========================================================
     *
     * Mesmo com o webhook autenticado, nunca confiamos apenas
     * no status enviado na notificação.
     *
     * Consultamos novamente o recurso no Mercado Pago.
     */

    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        method: "GET",

        headers: {
          Authorization:
            `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        },

        cache: "no-store",
      },
    );

    if (!response.ok) {
      const erroMercadoPago =
        await response.text();

      console.error(
        "Erro ao consultar pagamento no Mercado Pago:",
        response.status,
        erroMercadoPago,
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
      (await response.json()) as MercadoPagoPayment;

    console.log(
      "PAGAMENTO CONSULTADO:",
      {
        id: payment.id,
        status: payment.status,
        external_reference:
          payment.external_reference,
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
     * 3. PAGAMENTO APROVADO
     * =========================================================
     *
     * A operação é idempotente.
     *
     * Caso o Mercado Pago envie a mesma notificação
     * novamente, o pedido continuará aprovado.
     */

    if (
      statusPagamento === "approved"
    ) {
      const {
        data: pedidoAtualizado,
        error,
      } = await supabase
        .from("pedidos")
        .update({
          status: "aprovado",
          download_liberado: true,
        })
        .eq("id", pedidoId)
        .select("id")
        .maybeSingle();

      if (error) {
        console.error(
          "Erro ao atualizar pedido:",
          error,
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

      console.log(
        `✅ Pedido ${pedidoId} aprovado pelo Mercado Pago.`,
      );

      return NextResponse.json({
        success: true,
        pedidoId,
        status: "aprovado",
      });
    }

    /*
     * =========================================================
     * 4. OUTROS STATUS
     * =========================================================
     *
     * Nesta etapa ainda mantemos o comportamento anterior.
     *
     * Pending, rejected, cancelled etc. não liberam
     * o pedido nem os downloads.
     */

    console.log(
      `Pagamento ${paymentId} com status: ${statusPagamento}`,
    );

    return NextResponse.json({
      success: true,
      pedidoId,
      statusPagamento,
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
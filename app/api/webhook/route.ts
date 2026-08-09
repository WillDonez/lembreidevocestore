import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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
    const body = await req.json();

    console.log(
      "WEBHOOK MERCADO PAGO:",
      body,
    );

    const paymentId =
      body?.data?.id;

    /*
     * O Mercado Pago pode enviar notificações
     * de outros tipos.
     *
     * Se não houver ID de pagamento,
     * simplesmente reconhecemos o webhook
     * para evitar reenvios desnecessários.
     */
    if (!paymentId) {
      return NextResponse.json({
        success: true,
        ignored: true,
      });
    }

    /*
     * Nunca confiamos apenas nos dados recebidos
     * pelo webhook.
     *
     * Consultamos o pagamento diretamente
     * no Mercado Pago.
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
      payment,
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
     * PAGAMENTO APROVADO
     *
     * Essa operação é idempotente:
     * se o Mercado Pago enviar o mesmo webhook
     * novamente, o pedido continuará aprovado.
     */
    if (statusPagamento === "approved") {
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
     * Outros estados ainda não liberam
     * produtos digitais.
     *
     * Nesta versão 1.0, mantemos o pedido
     * aguardando a confirmação definitiva.
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
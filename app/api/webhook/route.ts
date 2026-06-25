import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("WEBHOOK MERCADO PAGO:", body);

    const paymentId = body?.data?.id;

    if (!paymentId) {
      return NextResponse.json({
        error: "Pagamento não encontrado",
      });
    }

    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        },
      }
    );

    const payment = await response.json();

    console.log("PAGAMENTO:", payment);

    const statusPagamento = payment.status;
    const pedidoId = payment.external_reference;

    if (!pedidoId) {
      return NextResponse.json({
        error: "Pedido não encontrado",
      });
    }

    if (statusPagamento === "approved") {
      await supabase
        .from("pedidos")
        .update({
          status: "aprovado",
        })
        .eq("id", Number(pedidoId));
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        error: "Erro webhook",
      },
      {
        status: 500,
      }
    );
  }
}
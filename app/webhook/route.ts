import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {

  try {

    const body = await req.json();

    console.log("WEBHOOK:", body);

    // ID do pagamento
    const paymentId = body?.data?.id;

    if (!paymentId) {
      return NextResponse.json({
        error: "Pagamento não encontrado",
      });
    }

    // Atualiza último pedido para pago
    const { error } = await supabase
      .from("pedidos")
      .update({
        status: "pago",
      })
      .eq("status", "pendente");

    if (error) {
      console.log(error);
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
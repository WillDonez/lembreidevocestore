import { MercadoPagoConfig, Preference } from "mercadopago";
import { NextResponse } from "next/server";

import { createClient } from "@supabase/supabase-js";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {

  try {

    const produtos = await req.json();

    const items = produtos.map((produto: any) => ({
      id: String(produto.id),
      title: produto.nome,
      quantity: 1,
      currency_id: "BRL",
      unit_price: Number(produto.preco),
    }));

    const total = produtos.reduce(
      (acc: number, item: any) => acc + Number(item.preco),
      0
    );

    await supabase
      .from("pedidos")
      .insert([
        {
          cliente: "Cliente Site",
          produtos: produtos,
          total: total,
          status: "pendente",
        },
      ]);

    const preference = new Preference(client);

    const response = await preference.create({
  body: {

    items: items,

    back_urls: {
      success: "https://lembreidevocestore.com.br/sucesso",
      failure: "https://lembreidevocestore.com.br/erro",
      pending: "https://lembreidevocestore.com.br/pendente",
    },

    auto_return: "approved",

  },
});

    return NextResponse.json({
      id: response.id,
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        error: "Erro Mercado Pago",
      },
      {
        status: 500,
      }
    );
  }
}
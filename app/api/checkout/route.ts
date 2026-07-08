import { enviarWhatsapp } from "@/lib/whatsapp";
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
    const body = await req.json();

    console.log(body);

    const produtos = body.produtos;
const nomeCliente = body.nomeCliente;
const whatsappCliente = body.whatsappCliente;
const emailCliente = body.emailCliente;
const cpfCnpj = body.cpfCnpj;
const cep = body.cep;
const endereco = body.endereco;
const numero = body.numero;
const complemento = body.complemento;
const bairro = body.bairro;
const cidade = body.cidade;
const estado = body.estado;

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

    const nomesProdutos = produtos
  .map(
    (produto: any) =>
      `• ${produto.nome} - R$ ${Number(produto.preco).toFixed(2)}`
  )
  .join("\n");

    const { data: pedidoCriado, error: erroPedido } = await supabase
  .from("pedidos")
  .insert([
  
     {
  cliente: nomeCliente,
  nome_cliente: nomeCliente,
  whatsapp_cliente: whatsappCliente,
  email_cliente: emailCliente,
  cpf_cnpj: cpfCnpj,
  cep,
  endereco,
  numero,
  complemento,
  bairro,
  cidade,
  estado,
  dados_fiscais_completos: Boolean(
    nomeCliente &&
      whatsappCliente &&
      emailCliente &&
      cpfCnpj &&
      cep &&
      endereco &&
      numero &&
      bairro &&
      cidade &&
      estado
  ),
  produtos: produtos,
  total: total,
  status: "pendente",
},
  ])
  .select()
  .single();

if (erroPedido) {
  console.log(erroPedido);

  return NextResponse.json(
    {
      error: "Erro ao criar pedido",
    },
    {
      status: 500,
    }
  );
}

 console.log("ENVIANDO WHATSAPP...");

await enviarWhatsapp(
  "3399958593",
  `🛍️ NOVO PEDIDO NA LOJA

👤 Cliente: ${nomeCliente}
📱 WhatsApp: ${whatsappCliente}

📦 Produtos:
${nomesProdutos}

💰 Total: R$ ${total.toFixed(2)}

✅ Pedido recebido com sucesso!`
);

console.log("WHATSAPP ENVIADO");

    const preference = new Preference(client);

    const response = await preference.create({
      body: {
        items: items,

        external_reference: String(pedidoCriado.id),

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
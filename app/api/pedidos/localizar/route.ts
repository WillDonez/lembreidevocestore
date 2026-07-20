import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

function normalizarEmail(valor: unknown) {
  return String(valor || "")
    .trim()
    .toLowerCase();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const pedidoId = String(body.pedidoId || "").trim();
    const email = normalizarEmail(body.email);

    if (!pedidoId || !email) {
      return NextResponse.json(
        {
          encontrado: false,
          error: "Número do pedido e e-mail são obrigatórios.",
        },
        {
          status: 400,
        }
      );
    }

    /*
      Evita valores estranhos no ID do pedido.
      Como a coluna id da tabela pedidos é int8,
      aceitamos somente números inteiros positivos.
    */
    if (!/^\d+$/.test(pedidoId)) {
      return NextResponse.json(
        {
          encontrado: false,
          error: "Número do pedido inválido.",
        },
        {
          status: 400,
        }
      );
    }

    const { data: pedido, error } = await supabaseAdmin
      .from("pedidos")
      .select(
        `
          id,
          nome_cliente,
          email_cliente,
          status,
          created_at
        `
      )
      .eq("id", pedidoId)
      .ilike("email_cliente", email)
      .maybeSingle();

    if (error) {
      console.error("Erro ao localizar pedido:", error);

      return NextResponse.json(
        {
          encontrado: false,
          error: "Não foi possível consultar o pedido.",
        },
        {
          status: 500,
        }
      );
    }

    if (!pedido) {
      return NextResponse.json(
        {
          encontrado: false,
          error:
            "Nenhum pedido foi localizado com este número e e-mail.",
        },
        {
          status: 404,
        }
      );
    }

    const emailPedido = normalizarEmail(
      pedido.email_cliente
    );

    /*
      Segunda confirmação do e-mail, mesmo após o filtro
      da consulta ao banco.
    */
    if (emailPedido !== email) {
      return NextResponse.json(
        {
          encontrado: false,
          error:
            "O e-mail informado não pertence a este pedido.",
        },
        {
          status: 403,
        }
      );
    }

    return NextResponse.json({
      encontrado: true,
      pedido: {
        id: pedido.id,
        nome: String(
          pedido.nome_cliente || ""
        ).trim(),
        email: emailPedido,
        status: pedido.status,
        createdAt: pedido.created_at,
      },
    });
  } catch (error) {
    console.error(
      "Erro inesperado ao localizar pedido:",
      error
    );

    return NextResponse.json(
      {
        encontrado: false,
        error: "Erro interno ao consultar o pedido.",
      },
      {
        status: 500,
      }
    );
  }
}
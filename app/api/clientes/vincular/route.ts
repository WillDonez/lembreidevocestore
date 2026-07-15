import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const nome = String(body.nome || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const authUserId = String(body.authUserId || "").trim();

    if (!nome || !email || !authUserId) {
      return NextResponse.json(
        {
          error: "Nome, e-mail e usuário autenticado são obrigatórios.",
        },
        {
          status: 400,
        }
      );
    }

    const { data: clienteExistente, error: erroBusca } =
      await supabaseAdmin
        .from("clientes")
        .select("id")
        .eq("email", email)
        .maybeSingle();

    if (erroBusca) {
      console.log("Erro ao localizar cliente:", erroBusca);

      return NextResponse.json(
        {
          error: "Não foi possível localizar o cliente.",
        },
        {
          status: 500,
        }
      );
    }

    if (clienteExistente) {
      const { error: erroAtualizacao } = await supabaseAdmin
        .from("clientes")
        .update({
          nome,
          auth_user_id: authUserId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", clienteExistente.id);

      if (erroAtualizacao) {
        console.log("Erro ao vincular cliente:", erroAtualizacao);

        return NextResponse.json(
          {
            error: "Não foi possível vincular o cliente.",
          },
          {
            status: 500,
          }
        );
      }

      return NextResponse.json({
        success: true,
        clienteCriado: false,
      });
    }

    const { error: erroCriacao } = await supabaseAdmin
      .from("clientes")
      .insert({
        nome,
        email,
        auth_user_id: authUserId,
      });

    if (erroCriacao) {
      console.log("Erro ao criar cliente:", erroCriacao);

      return NextResponse.json(
        {
          error: "Não foi possível criar o cliente.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
      clienteCriado: true,
    });
  } catch (error) {
    console.log("Erro na API de vinculação:", error);

    return NextResponse.json(
      {
        error: "Erro interno ao vincular o cliente.",
      },
      {
        status: 500,
      }
    );
  }
}
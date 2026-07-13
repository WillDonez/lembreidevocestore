import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = String(body.email || "")
      .trim()
      .toLowerCase();

    const cpfCnpj = String(body.cpfCnpj || "").trim();

    if (!email || !cpfCnpj) {
      return NextResponse.json(
        {
          error: "Informe o e-mail e o CPF/CNPJ.",
        },
        {
          status: 400,
        }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("clientes")
      .select(
        `
          id,
          nome,
          email,
          whatsapp,
          cpf_cnpj,
          cep,
          endereco,
          numero,
          complemento,
          bairro,
          cidade,
          estado
        `
      )
      .eq("email", email)
      .eq("cpf_cnpj", cpfCnpj)
      .order("id", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Erro ao buscar cliente:", error);

      return NextResponse.json(
        {
          error: "Não foi possível buscar o cliente.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      cliente: data || null,
    });
  } catch (error) {
    console.error("Erro na API de clientes:", error);

    return NextResponse.json(
      {
        error: "Erro interno ao buscar cliente.",
      },
      {
        status: 500,
      }
    );
  }
}
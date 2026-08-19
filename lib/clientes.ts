import "server-only";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

type ClientePayload = {
  nome: string;
  email: string;
  whatsapp: string;
  cpf_cnpj: string;
  cep: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
};

export async function buscarClientePorEmail(
  email: string,
) {
  const emailNormalizado = email
    .trim()
    .toLowerCase();

  if (!emailNormalizado) {
    return null;
  }

  const { data, error } = await supabaseAdmin
    .from("clientes")
    .select("*")
    .ilike("email", emailNormalizado)
    .order("id", { ascending: false })
    .limit(1);

  if (error) {
    console.error(
      "Erro ao buscar cliente:",
      error,
    );

    return null;
  }

  return data?.[0] || null;
}

export async function salvarOuAtualizarCliente(
  cliente: ClientePayload,
) {
  const clienteNormalizado = {
    ...cliente,
    nome: String(cliente.nome || "").trim(),
    email: String(cliente.email || "")
      .trim()
      .toLowerCase(),
    whatsapp: String(
      cliente.whatsapp || "",
    ).trim(),
  };

  if (
    !clienteNormalizado.email &&
    !clienteNormalizado.whatsapp
  ) {
    return null;
  }

  let clienteExistente: {
    id: number;
  } | null = null;

  if (clienteNormalizado.cpf_cnpj) {
    const { data, error } = await supabaseAdmin
      .from("clientes")
      .select("id")
      .eq(
        "cpf_cnpj",
        clienteNormalizado.cpf_cnpj,
      )
      .order("id", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error(
        "Erro ao procurar cliente por CPF/CNPJ:",
        error,
      );
    }

    clienteExistente = data;
  }

  if (
    !clienteExistente &&
    clienteNormalizado.email
  ) {
    const { data, error } = await supabaseAdmin
      .from("clientes")
      .select("id")
      .eq("email", clienteNormalizado.email)
      .order("id", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error(
        "Erro ao procurar cliente por e-mail:",
        error,
      );
    }

    clienteExistente = data;
  }

  if (
    !clienteExistente &&
    clienteNormalizado.whatsapp
  ) {
    const { data, error } = await supabaseAdmin
      .from("clientes")
      .select("id")
      .eq(
        "whatsapp",
        clienteNormalizado.whatsapp,
      )
      .order("id", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error(
        "Erro ao procurar cliente por WhatsApp:",
        error,
      );
    }

    clienteExistente = data;
  }

  if (clienteExistente) {
    const { data, error } = await supabaseAdmin
      .from("clientes")
      .update({
        ...clienteNormalizado,
        updated_at: new Date().toISOString(),
      })
      .eq("id", clienteExistente.id)
      .select()
      .single();

    if (error) {
      console.error(
        "Erro ao atualizar cliente:",
        error,
      );

      return null;
    }

    return data;
  }

  const { data, error } = await supabaseAdmin
    .from("clientes")
    .insert([clienteNormalizado])
    .select()
    .single();

  if (error) {
    console.error(
      "Erro ao criar cliente:",
      error,
    );

    return null;
  }

  return data;
}
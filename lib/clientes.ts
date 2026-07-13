import { supabase } from "@/lib/supabase";

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

export async function buscarClientePorEmail(email: string) {
  const emailNormalizado = email.trim().toLowerCase();

  if (!emailNormalizado) return null;

  const { data, error } = await supabase
    .from("clientes")
    .select("*")
    .ilike("email", emailNormalizado)
    .order("id", { ascending: false })
    .limit(1);

  if (error) {
    console.log("Erro ao buscar cliente:", error);
    return null;
  }

  if (!data || data.length === 0) {
    console.log("Nenhum cliente encontrado para:", emailNormalizado);
    return null;
  }

  console.log("Cliente encontrado no Supabase:", data[0]);

  return data[0];
}

export async function salvarOuAtualizarCliente(
  cliente: ClientePayload
) {
  const clienteNormalizado = {
    ...cliente,
    nome: cliente.nome.trim(),
    email: cliente.email.trim().toLowerCase(),
    whatsapp: cliente.whatsapp.trim(),
  };

  console.log("SALVAR CLIENTE:", clienteNormalizado);

  if (
    !clienteNormalizado.email &&
    !clienteNormalizado.whatsapp
  ) {
    return null;
  }

  let clienteExistente = null;

// 1. Primeiro procura pelo CPF/CNPJ
if (clienteNormalizado.cpf_cnpj) {
  const { data, error } = await supabase
    .from("clientes")
    .select("*")
    .eq("cpf_cnpj", clienteNormalizado.cpf_cnpj)
    .order("id", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.log("Erro ao procurar cliente por CPF/CNPJ:", error);
  }

  clienteExistente = data;
}

// 2. Se não encontrou, procura pelo e-mail
if (!clienteExistente && clienteNormalizado.email) {
  const { data, error } = await supabase
    .from("clientes")
    .select("*")
    .eq("email", clienteNormalizado.email)
    .order("id", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.log("Erro ao procurar cliente por e-mail:", error);
  }

  clienteExistente = data;
}

// 3. Se ainda não encontrou, procura pelo WhatsApp
if (!clienteExistente && clienteNormalizado.whatsapp) {
  const { data, error } = await supabase
    .from("clientes")
    .select("*")
    .eq("whatsapp", clienteNormalizado.whatsapp)
    .order("id", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.log("Erro ao procurar cliente por WhatsApp:", error);
  }

  clienteExistente = data;
}

  // Atualiza o registro mais recente encontrado
  if (clienteExistente) {
    const { data, error } = await supabase
      .from("clientes")
      .update({
        ...clienteNormalizado,
        updated_at: new Date().toISOString(),
      })
      .eq("id", clienteExistente.id)
      .select()
      .single();

    if (error) {
      console.log("Erro ao atualizar cliente:", error);
      return null;
    }

    console.log("Cliente atualizado:", data);

    return data;
  }

  // Cria apenas quando realmente não existir cliente
  const { data, error } = await supabase
    .from("clientes")
    .insert([clienteNormalizado])
    .select()
    .single();

  if (error) {
    console.log("Erro ao criar cliente:", error);
    return null;
  }

  console.log("Cliente criado:", data);

  return data;
}
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
  if (!email) return null;

  const { data, error } = await supabase
    .from("clientes")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    console.log("Erro ao buscar cliente:", error);
    return null;
  }

  return data;
}

export async function salvarOuAtualizarCliente(cliente: ClientePayload) {

console.log("SALVAR CLIENTE:", cliente);

  if (!cliente.email && !cliente.whatsapp) return null;

  const { data: clienteExistente } = await supabase
    .from("clientes")
    .select("*")
    .or(`email.eq.${cliente.email},whatsapp.eq.${cliente.whatsapp}`)
    .maybeSingle();

  if (clienteExistente) {
    const { data, error } = await supabase
      .from("clientes")
      .update({
        ...cliente,
        updated_at: new Date().toISOString(),
      })
      .eq("id", clienteExistente.id)
      .select()
      .single();

    if (error) {
      console.log("Erro ao atualizar cliente:", error);
      return null;
    }

    return data;
  }

  const { data, error } = await supabase
    .from("clientes")
    .insert([cliente])
    .select()
    .single();

  if (error) {
    console.log("Erro ao criar cliente:", error);
    return null;
  }

  return data;
}
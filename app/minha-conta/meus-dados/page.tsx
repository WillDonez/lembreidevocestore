"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function MeusDadosPage() {
  const router = useRouter();

  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState("");

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");

  useEffect(() => {
    async function carregarCliente() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      console.log("Usuário logado:", user);

if (user) {
  console.log("ID do usuário:", user.id);
}

      if (!user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("clientes")
        .select("*")
        .eq("auth_user_id", user.id)
        .maybeSingle();

        console.log("Resultado da consulta:", data);
console.log("Erro:", error);

      if (error) {
        console.log("Erro ao carregar cliente:", error);
        setMensagem("Não foi possível carregar seus dados.");
        setCarregando(false);
        return;
      }

      if (!data) {
        setMensagem("Cadastro do cliente não encontrado.");
        setCarregando(false);
        return;
      }

      setNome(data.nome || "");
      setEmail(data.email || user.email || "");
      setWhatsapp(data.whatsapp || "");
      setCpfCnpj(data.cpf_cnpj || "");
      setCep(data.cep || "");
      setEndereco(data.endereco || "");
      setNumero(data.numero || "");
      setComplemento(data.complemento || "");
      setBairro(data.bairro || "");
      setCidade(data.cidade || "");
      setEstado(data.estado || "");

      setCarregando(false);
    }

    carregarCliente();
  }, [router]);

  async function salvarDados() {
  setMensagem("");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    router.push("/login");
    return;
  }

  const { error } = await supabase
    .from("clientes")
    .update({
      nome,
      whatsapp,
      cpf_cnpj: cpfCnpj,
      cep,
      endereco,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
      updated_at: new Date().toISOString(),
    })
    .eq("auth_user_id", user.id);

  if (error) {
    console.log("Erro ao salvar dados:", error);
    setMensagem("Não foi possível atualizar seus dados.");
    return;
  }

  setMensagem("✅ Dados atualizados com sucesso!");
}

  if (carregando) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-pink-50 p-6">
        <p className="text-xl font-bold text-pink-500">
          Carregando seus dados...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-pink-50 px-4 py-8">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-6 shadow-xl md:p-8">
        <h1 className="text-4xl font-bold text-pink-500">
          👤 Meus Dados
        </h1>

        <p className="mt-2 text-gray-500">
          Consulte e atualize suas informações cadastrais.
        </p>

        <button
        type="button"
        onClick={() => router.push("/minha-conta")}
        className="mt-4 inline-flex items-center gap-2 font-bold text-pink-500 transition hover:text-pink-600"
         >
        ← Voltar para Minha Conta
        </button>

        {mensagem && (
          <div className="mt-6 rounded-2xl bg-yellow-50 p-4 font-bold text-yellow-700">
            {mensagem}
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          <input
            type="text"
            placeholder="Nome completo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full rounded-xl border p-4"
          />

          <input
            type="email"
            placeholder="E-mail"
            value={email}
            disabled
            className="w-full cursor-not-allowed rounded-xl border bg-gray-100 p-4 text-gray-500"
          />

          <input
            type="text"
            placeholder="WhatsApp"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            className="w-full rounded-xl border p-4"
          />

          <input
            type="text"
            placeholder="CPF ou CNPJ"
            value={cpfCnpj}
            onChange={(e) => setCpfCnpj(e.target.value)}
            className="w-full rounded-xl border p-4"
          />

          <input
            type="text"
            placeholder="CEP"
            value={cep}
            onChange={(e) => setCep(e.target.value)}
            className="w-full rounded-xl border p-4"
          />

          <input
            type="text"
            placeholder="Número"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            className="w-full rounded-xl border p-4"
          />

          <input
            type="text"
            placeholder="Endereço"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            className="w-full rounded-xl border p-4 md:col-span-2"
          />

          <input
            type="text"
            placeholder="Complemento"
            value={complemento}
            onChange={(e) => setComplemento(e.target.value)}
            className="w-full rounded-xl border p-4"
          />

          <input
            type="text"
            placeholder="Bairro"
            value={bairro}
            onChange={(e) => setBairro(e.target.value)}
            className="w-full rounded-xl border p-4"
          />

          <input
            type="text"
            placeholder="Cidade"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            className="w-full rounded-xl border p-4"
          />

          <input
            type="text"
            placeholder="UF"
            value={estado}
            onChange={(e) =>
              setEstado(
                e.target.value
                  .replace(/[^a-zA-Z]/g, "")
                  .toUpperCase()
                  .slice(0, 2)
              )
            }
            maxLength={2}
            className="w-full rounded-xl border p-4 uppercase"
          />

          <div className="mt-8 flex justify-center md:col-span-2">
  <button
    type="button"
    onClick={salvarDados}
    className="w-80 rounded-2xl bg-pink-500 py-4 text-xl font-bold text-white transition hover:bg-pink-600 hover:scale-[1.02] active:scale-[0.98]"
  >
    💾 Salvar Alterações
  </button>
</div>
        </div>
      </div>
    </main>
  );
}
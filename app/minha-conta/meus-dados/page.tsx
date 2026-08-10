"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

export default function MeusDadosPage() {
  const router = useRouter();

  const [carregando, setCarregando] =
    useState(true);

  const [mensagem, setMensagem] =
    useState("");

  const [nome, setNome] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [whatsapp, setWhatsapp] =
    useState("");

  const [cpfCnpj, setCpfCnpj] =
    useState("");

  const [cep, setCep] =
    useState("");

  const [endereco, setEndereco] =
    useState("");

  const [numero, setNumero] =
    useState("");

  const [complemento, setComplemento] =
    useState("");

  const [bairro, setBairro] =
    useState("");

  const [cidade, setCidade] =
    useState("");

  const [estado, setEstado] =
    useState("");

  useEffect(() => {
    async function carregarCliente() {
      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      console.log(
        "Usuário logado:",
        user,
      );

      if (user) {
        console.log(
          "ID do usuário:",
          user.id,
        );
      }

      if (!user) {
        router.push(
          "/login",
        );

        return;
      }

      const {
        data,
        error,
      } = await supabase
        .from("clientes")
        .select("*")
        .eq(
          "auth_user_id",
          user.id,
        )
        .maybeSingle();

      console.log(
        "Resultado da consulta:",
        data,
      );

      console.log(
        "Erro:",
        error,
      );

      if (error) {
        console.log(
          "Erro ao carregar cliente:",
          error,
        );

        setMensagem(
          "Não foi possível carregar seus dados.",
        );

        setCarregando(
          false,
        );

        return;
      }

      if (!data) {
        setMensagem(
          "Cadastro do cliente não encontrado.",
        );

        setCarregando(
          false,
        );

        return;
      }

      setNome(
        data.nome || "",
      );

      setEmail(
        data.email ||
          user.email ||
          "",
      );

      setWhatsapp(
        data.whatsapp || "",
      );

      setCpfCnpj(
        data.cpf_cnpj || "",
      );

      setCep(
        data.cep || "",
      );

      setEndereco(
        data.endereco || "",
      );

      setNumero(
        data.numero || "",
      );

      setComplemento(
        data.complemento || "",
      );

      setBairro(
        data.bairro || "",
      );

      setCidade(
        data.cidade || "",
      );

      setEstado(
        data.estado || "",
      );

      setCarregando(
        false,
      );
    }

    carregarCliente();
  }, [router]);

  async function salvarDados() {
    setMensagem("");

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {
      router.push(
        "/login",
      );

      return;
    }

    const {
      error,
    } = await supabase
      .from("clientes")
      .update({
        nome,
        whatsapp,
        cpf_cnpj:
          cpfCnpj,
        cep,
        endereco,
        numero,
        complemento,
        bairro,
        cidade,
        estado,
        updated_at:
          new Date().toISOString(),
      })
      .eq(
        "auth_user_id",
        user.id,
      );

    if (error) {
      console.log(
        "Erro ao salvar dados:",
        error,
      );

      setMensagem(
        "Não foi possível atualizar seus dados.",
      );

      return;
    }

    setMensagem(
      "✅ Dados atualizados com sucesso!",
    );
  }

  const inputClass =
    "w-full rounded-xl border border-border bg-card p-4 text-text outline-none transition placeholder:text-text-light focus:border-primary focus:ring-2 focus:ring-[color-mix(in_srgb,var(--primary)_15%,transparent)]";

  if (carregando) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-border border-t-primary" />

          <p className="mt-4 font-bold text-primary">
            Carregando seus dados...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background p-6 md:p-10">
      <div className="mx-auto max-w-5xl">
        <section className="rounded-3xl border border-border bg-card p-6 shadow-xl md:p-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-secondary">
                Minha Conta
              </p>

              <h1 className="mt-2 text-4xl font-black text-primary md:text-5xl">
                👤 Meus Dados
              </h1>

              <p className="mt-2 text-text-light">
                Consulte e atualize suas informações cadastrais.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/minha-conta",
                )
              }
              className="inline-flex items-center gap-2 self-start rounded-xl border border-border bg-background px-4 py-3 font-bold text-primary transition hover:border-primary hover:bg-[color-mix(in_srgb,var(--primary)_8%,white)]"
            >
              ← Voltar para Minha Conta
            </button>
          </div>

          {mensagem && (
            <div
              className={`mt-6 rounded-2xl border p-4 font-bold ${
                mensagem.startsWith(
                  "✅",
                )
                  ? "border-success/30 bg-[color-mix(in_srgb,var(--success)_8%,white)] text-success"
                  : "border-warning/30 bg-[color-mix(in_srgb,var(--warning)_8%,white)] text-warning"
              }`}
            >
              {mensagem}
            </div>
          )}

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              type="text"
              placeholder="Nome completo"
              value={nome}
              onChange={(e) =>
                setNome(
                  e.target.value,
                )
              }
              className={inputClass}
            />

            <input
              type="email"
              placeholder="E-mail"
              value={email}
              disabled
              className="w-full cursor-not-allowed rounded-xl border border-border bg-background p-4 text-text-light"
            />

            <input
              type="text"
              placeholder="WhatsApp"
              value={whatsapp}
              onChange={(e) =>
                setWhatsapp(
                  e.target.value,
                )
              }
              className={inputClass}
            />

            <input
              type="text"
              placeholder="CPF ou CNPJ"
              value={cpfCnpj}
              onChange={(e) =>
                setCpfCnpj(
                  e.target.value,
                )
              }
              className={inputClass}
            />

            <input
              type="text"
              placeholder="CEP"
              value={cep}
              onChange={(e) =>
                setCep(
                  e.target.value,
                )
              }
              className={inputClass}
            />

            <input
              type="text"
              placeholder="Número"
              value={numero}
              onChange={(e) =>
                setNumero(
                  e.target.value,
                )
              }
              className={inputClass}
            />

            <input
              type="text"
              placeholder="Endereço"
              value={endereco}
              onChange={(e) =>
                setEndereco(
                  e.target.value,
                )
              }
              className={`${inputClass} md:col-span-2`}
            />

            <input
              type="text"
              placeholder="Complemento"
              value={
                complemento
              }
              onChange={(e) =>
                setComplemento(
                  e.target.value,
                )
              }
              className={inputClass}
            />

            <input
              type="text"
              placeholder="Bairro"
              value={bairro}
              onChange={(e) =>
                setBairro(
                  e.target.value,
                )
              }
              className={inputClass}
            />

            <input
              type="text"
              placeholder="Cidade"
              value={cidade}
              onChange={(e) =>
                setCidade(
                  e.target.value,
                )
              }
              className={inputClass}
            />

            <input
              type="text"
              placeholder="UF"
              value={estado}
              onChange={(e) =>
                setEstado(
                  e.target.value
                    .replace(
                      /[^a-zA-Z]/g,
                      "",
                    )
                    .toUpperCase()
                    .slice(
                      0,
                      2,
                    ),
                )
              }
              maxLength={2}
              className={`${inputClass} uppercase`}
            />
          </div>

          <div className="mt-8 flex justify-center border-t border-border pt-8">
            <button
              type="button"
              onClick={
                salvarDados
              }
              className="w-full max-w-sm rounded-2xl bg-accent py-4 text-xl font-bold text-white shadow-md transition hover:scale-[1.02] hover:brightness-95 active:scale-[0.98]"
            >
              💾 Salvar Alterações
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
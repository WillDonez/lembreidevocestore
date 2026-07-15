"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type Modo = "login" | "cadastro" | "recuperar";

export default function LoginPage() {
  const router = useRouter();

  const [modo, setModo] = useState<Modo>("login");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [visualizarSenha, setVisualizarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [contaCriada, setContaCriada] = useState(false);

  const senhaTemMinimo = senha.length >= 7;
const senhaTemMaiuscula = /[A-Z]/.test(senha);
const senhaTemMinuscula = /[a-z]/.test(senha);
const senhaTemNumero = /[0-9]/.test(senha);
const senhaTemEspecial = /[^A-Za-z0-9]/.test(senha);

const senhaValida =
  senhaTemMinimo &&
  senhaTemMaiuscula &&
  senhaTemMinuscula &&
  senhaTemNumero &&
  senhaTemEspecial;

const confirmacaoPreenchida = confirmarSenha.length > 0;
const senhasIguais = senha === confirmarSenha;

  async function entrar() {
    setMensagem("");

    if (!email || !senha) {
      setMensagem("Preencha o e-mail e a senha.");
      return;
    }

    setCarregando(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: senha,
    });

    setCarregando(false);

    if (error) {
      console.log(error);
      setMensagem("E-mail ou senha incorretos.");
      return;
    }

    router.push("/minha-conta");
  }

  async function criarConta() {
    setMensagem("");

    if (!nome || !email || !senha || !confirmarSenha) {
      setMensagem("Preencha todos os campos.");
      return;
    }

    if (!senhaValida) {
  setMensagem(
    "A senha precisa ter pelo menos 7 caracteres, incluindo letra maiúscula, letra minúscula, número e caractere especial."
  );
  return;
}

    if (senha !== confirmarSenha) {
      setMensagem("As senhas não coincidem.");
      return;
    }

    setCarregando(true);

    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password: senha,
      options: {
        data: {
          nome,
        },
      },
    });

    if (error) {
      setCarregando(false);
      console.log(error);
      setMensagem(error.message);
      return;
    }

    if (data.user) {
  const emailNormalizado = email.trim().toLowerCase();

  const response = await fetch("/api/clientes/vincular", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nome,
      email: emailNormalizado,
      authUserId: data.user.id,
    }),
  });

  const resultado = await response.json();

  if (!response.ok) {
    console.log("Erro ao vincular cliente:", resultado);
    setCarregando(false);
    setMensagem(
      resultado.error ||
        "A conta foi criada, mas não foi possível vincular o cadastro."
    );
    return;
  }
}
    setCarregando(false);
setContaCriada(true);
setMensagem("");
  }

  async function recuperarSenha() {
    setMensagem("");

    if (!email) {
      setMensagem("Digite seu e-mail.");
      return;
    }

    setCarregando(true);

    const { error } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      {
        redirectTo: `${window.location.origin}/redefinir-senha`,
      }
    );

    setCarregando(false);

    if (error) {
      console.log(error);
      setMensagem("Não foi possível enviar o e-mail de recuperação.");
      return;
    }

    setMensagem("Enviamos um link de recuperação para o seu e-mail.");
  }

  if (contaCriada) {
  return (
    <main className="min-h-screen bg-pink-50 px-4 py-10">
      <div className="mx-auto max-w-md rounded-3xl bg-white p-8 text-center shadow-xl">
        <img
          src="/logo.png"
          alt="Lembrei de Você Store"
          className="mx-auto h-24 w-auto"
        />

        <div className="mt-6 text-6xl">
          🎉
        </div>

        <h1 className="mt-4 text-3xl font-bold text-green-700">
          Que bom ter você aqui!
        </h1>

        <p className="mt-4 text-gray-600">
          Sua conta na
          <strong> Lembrei de Você Store </strong>
          foi criada com sucesso.
        </p>

        <div className="mt-6 rounded-2xl bg-green-50 p-5 text-green-800">
          <p className="font-bold">
            ✅ Agora confirme seu e-mail
          </p>

          <p className="mt-2 text-sm">
            Enviamos uma mensagem de confirmação para:
          </p>

          <p className="mt-2 break-all font-bold">
            {email}
          </p>

          <p className="mt-3 text-sm">
            Clique no link recebido para ativar sua conta.
          </p>
        </div>

        <div className="mt-6 rounded-2xl bg-pink-50 p-5 text-left text-sm text-gray-700">
          <p className="font-bold text-pink-600">
            Depois da confirmação você poderá:
          </p>

          <p className="mt-3">✅ Acompanhar seus pedidos</p>
          <p className="mt-2">✅ Baixar seus arquivos digitais</p>
          <p className="mt-2">✅ Atualizar seus dados</p>
          <p className="mt-2">✅ Salvar seus produtos favoritos</p>
        </div>

        <button
          type="button"
          onClick={() => {
            setModo("login");
            setContaCriada(false);
            setSenha("");
            setConfirmarSenha("");
            setVisualizarSenha(false);
          }}
          className="mt-6 w-full rounded-2xl bg-green-600 py-4 text-xl font-bold text-white transition hover:bg-green-700"
        >
          Ir para o Login →
        </button>

        <p className="mt-4 text-sm text-gray-500">
          Não encontrou a mensagem? Verifique também a pasta de spam.
        </p>
      </div>
    </main>
  );
}

  return (
    <main className="min-h-screen bg-pink-50 px-4 py-10">
      <div className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <div className="text-center">
          <img
            src="/logo.png"
            alt="Lembrei de Você Store"
            className="mx-auto h-24 w-auto"
          />

          <h1 className="mt-4 text-4xl font-bold text-pink-500">
            {modo === "login" && "Entrar"}
            {modo === "cadastro" && "Criar Conta"}
            {modo === "recuperar" && "Recuperar Senha"}
          </h1>

          <p className="mt-2 text-gray-500">
            {modo === "login" && "Acesse sua conta para ver pedidos e downloads."}
            {modo === "cadastro" && "Crie sua conta para acompanhar suas compras."}
            {modo === "recuperar" && "Informe seu e-mail para recuperar o acesso."}
          </p>
        </div>

        <div className="mt-8 space-y-4">
          {modo === "cadastro" && (
            <input
              type="text"
              placeholder="Nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full rounded-xl border p-4"
            />
          )}

          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value.trimStart().toLowerCase())}
            className="w-full rounded-xl border p-4"
          />

          {modo !== "recuperar" && (
  <div>
    <input
      type={visualizarSenha ? "text" : "password"}
      placeholder="Senha"
      value={senha}
      onChange={(e) => setSenha(e.target.value)}
      autoComplete={
        modo === "login"
          ? "current-password"
          : "new-password"
      }
      className="w-full rounded-xl border p-4"
    />

    {modo === "cadastro" && senha.length > 0 && (
      <div className="mt-3 space-y-1 rounded-xl bg-gray-50 p-3 text-sm">
        <p
          className={
            senhaTemMinimo
              ? "font-bold text-green-600"
              : "text-gray-500"
          }
        >
          {senhaTemMinimo ? "✅" : "○"} Pelo menos 7 caracteres
        </p>

        <p
          className={
            senhaTemMaiuscula
              ? "font-bold text-green-600"
              : "text-gray-500"
          }
        >
          {senhaTemMaiuscula ? "✅" : "○"} Uma letra maiúscula
        </p>

        <p
          className={
            senhaTemMinuscula
              ? "font-bold text-green-600"
              : "text-gray-500"
          }
        >
          {senhaTemMinuscula ? "✅" : "○"} Uma letra minúscula
        </p>

        <p
          className={
            senhaTemNumero
              ? "font-bold text-green-600"
              : "text-gray-500"
          }
        >
          {senhaTemNumero ? "✅" : "○"} Um número
        </p>

        <p
          className={
            senhaTemEspecial
              ? "font-bold text-green-600"
              : "text-gray-500"
          }
        >
          {senhaTemEspecial ? "✅" : "○"} Um caractere especial
        </p>
      </div>
    )}
  </div>
)}

          {modo === "cadastro" && (
  <div>
    <input
      type={visualizarSenha ? "text" : "password"}
      placeholder="Confirmar senha"
      value={confirmarSenha}
      onChange={(e) => setConfirmarSenha(e.target.value)}
      autoComplete="new-password"
      className={`w-full rounded-xl border p-4 ${
        confirmacaoPreenchida
          ? senhasIguais
            ? "border-green-500"
            : "border-red-500"
          : ""
      }`}
    />

    {confirmacaoPreenchida && (
      <p
        className={`mt-2 text-sm font-bold ${
          senhasIguais
            ? "text-green-600"
            : "text-red-600"
        }`}
      >
        {senhasIguais
          ? "✅ As senhas coincidem."
          : "⚠️ As senhas não coincidem."}
      </p>
    )}
  </div>
)}

{modo !== "recuperar" && (
  <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
    <input
      type="checkbox"
      checked={visualizarSenha}
      onChange={(e) => setVisualizarSenha(e.target.checked)}
      className="h-4 w-4"
    />

    Visualizar senha
  </label>
)}

          {mensagem && (
            <div className="rounded-xl bg-pink-50 p-4 text-center font-bold text-pink-600">
              {mensagem}
            </div>
          )}

          {modo === "login" && (
            <button
              type="button"
              onClick={entrar}
              disabled={carregando}
              className="w-full rounded-2xl bg-pink-500 py-4 text-xl font-bold text-white hover:bg-pink-600 disabled:bg-gray-300"
            >
              {carregando ? "Entrando..." : "Entrar"}
            </button>
          )}

          {modo === "cadastro" && (
            <button
              type="button"
              onClick={criarConta}
              disabled={carregando}
              className="w-full rounded-2xl bg-pink-500 py-4 text-xl font-bold text-white hover:bg-pink-600 disabled:bg-gray-300"
            >
              {carregando ? "Criando conta..." : "Criar Conta"}
            </button>
          )}

          {modo === "recuperar" && (
            <button
              type="button"
              onClick={recuperarSenha}
              disabled={carregando}
              className="w-full rounded-2xl bg-pink-500 py-4 text-xl font-bold text-white hover:bg-pink-600 disabled:bg-gray-300"
            >
              {carregando ? "Enviando..." : "Enviar link de recuperação"}
            </button>
          )}
        </div>

        <div className="mt-6 space-y-3 text-center">
          {modo === "login" && (
            <>
              <button
                type="button"
                onClick={() => {
                  setMensagem("");
                  setModo("cadastro");
                }}
                className="font-bold text-pink-500 hover:underline"
              >
                Não possui conta? Criar conta
              </button>

              <button
                type="button"
                onClick={() => {
                  setMensagem("");
                  setModo("recuperar");
                }}
                className="block w-full text-gray-500 hover:text-pink-500"
              >
                Esqueci minha senha
              </button>
            </>
          )}

          {modo !== "login" && (
            <button
              type="button"
              onClick={() => {
                setMensagem("");
                setModo("login");
              }}
              className="font-bold text-pink-500 hover:underline"
            >
              Voltar para o login
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
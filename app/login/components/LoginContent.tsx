"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import CompraEncontrada from "./CompraEncontrada";
import ContaCriada from "./ContaCriada";
import RequisitosSenha from "./RequisitosSenha";

type Modo = "login" | "cadastro" | "recuperar";

type UltimoPedido = {
  pedidoId?: string | number;
  id?: string | number;
  email?: string;
  nome?: string;
};

function normalizarEmail(valor: string) {
  return valor.trim().toLowerCase();
}

function obterDestinoSeguro(valor: string | null) {
  if (!valor || !valor.startsWith("/") || valor.startsWith("//")) {
    return "/minha-conta";
  }

  return valor;
}

function traduzirErroCadastro(mensagemOriginal: string) {
  const mensagem = mensagemOriginal.toLowerCase();

  if (
    mensagem.includes("already registered") ||
    mensagem.includes("already been registered") ||
    mensagem.includes("user already")
  ) {
    return "Já existe uma conta com este e-mail. Tente entrar ou recuperar sua senha.";
  }

  if (mensagem.includes("password")) {
    return "A senha não foi aceita. Confira os requisitos e tente novamente.";
  }

  if (mensagem.includes("email")) {
    return "Não foi possível usar este e-mail. Confira o endereço informado.";
  }

  return "Não foi possível criar a conta agora. Tente novamente em alguns instantes.";
}

export default function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [modo, setModo] = useState<Modo>("login");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [visualizarSenha, setVisualizarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState<"erro" | "sucesso">("erro");

  const [contaCriada, setContaCriada] = useState(false);
  const [sessaoCriada, setSessaoCriada] = useState(false);
  const [pedidoEncontrado, setPedidoEncontrado] = useState(false);
  const [pedidoId, setPedidoId] = useState("");
  const [validandoPedido, setValidandoPedido] = useState(false);

  const destinoAposLogin = useMemo(
    () => obterDestinoSeguro(searchParams.get("redirect")),
    [searchParams]
  );

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

  useEffect(() => {
  let componenteAtivo = true;

  async function prepararPagina() {
    const cadastroUrl = searchParams.get("cadastro");
    const modoUrl = searchParams.get("modo");
    const emailUrl = searchParams.get("email");
    const nomeUrl = searchParams.get("nome");
    const pedidoUrl = searchParams.get("pedido");

    let dadosSalvos: UltimoPedido | null = null;

    try {
      const ultimoPedido =
        window.sessionStorage.getItem("ultimoPedido");

      if (ultimoPedido) {
        dadosSalvos = JSON.parse(
          ultimoPedido
        ) as UltimoPedido;
      }
    } catch (error) {
      console.warn(
        "Não foi possível ler ultimoPedido:",
        error
      );
    }

    const emailInicial = normalizarEmail(
      emailUrl || dadosSalvos?.email || ""
    );

    const nomeInicial = String(
      nomeUrl || dadosSalvos?.nome || ""
    ).trim();

    const pedidoInicial = String(
      pedidoUrl ||
        dadosSalvos?.pedidoId ||
        dadosSalvos?.id ||
        ""
    ).trim();

    if (cadastroUrl === "1" || modoUrl === "cadastro") {
      setModo("cadastro");
    } else if (modoUrl === "recuperar") {
      setModo("recuperar");
    } else {
      setModo("login");
    }

    setPedidoEncontrado(false);
    setPedidoId("");

    /*
      Quando não existe pedido, o formulário funciona
      como cadastro comum.
    */
    if (!pedidoInicial) {
      if (emailInicial) {
        setEmail(emailInicial);
      }

      if (nomeInicial) {
        setNome(nomeInicial);
      }

      return;
    }

    /*
      Para validar uma compra, precisamos do número
      do pedido e do e-mail utilizado no checkout.
    */
    if (!emailInicial) {
      setMensagem(
        "Não foi possível validar a compra porque o e-mail do pedido não foi informado."
      );
      setTipoMensagem("erro");
      return;
    }

    setValidandoPedido(true);
    setMensagem("");

    try {
      const response = await fetch(
        "/api/pedidos/localizar",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pedidoId: pedidoInicial,
            email: emailInicial,
          }),
        }
      );

      const resultado = await response
        .json()
        .catch(() => ({}));

      if (!componenteAtivo) {
        return;
      }

      if (!response.ok || !resultado.encontrado) {
        setPedidoEncontrado(false);
        setPedidoId("");

        setEmail(emailInicial);

        setMensagem(
          resultado.error ||
            "Não foi possível localizar esta compra."
        );

        setTipoMensagem("erro");
        return;
      }

      /*
        Nome, e-mail e número agora vêm do Supabase,
        e não são mais aceitos diretamente pela URL.
      */
      setNome(resultado.pedido.nome || "");
      setEmail(resultado.pedido.email || "");
      setPedidoId(String(resultado.pedido.id));
      setPedidoEncontrado(true);
      setMensagem("");
    } catch (error) {
      console.error(
        "Erro ao validar pedido:",
        error
      );

      if (!componenteAtivo) {
        return;
      }

      setPedidoEncontrado(false);
      setPedidoId("");
      setMensagem(
        "Não foi possível validar a compra agora. Tente novamente."
      );
      setTipoMensagem("erro");
    } finally {
      if (componenteAtivo) {
        setValidandoPedido(false);
      }
    }
  }

  prepararPagina();

  return () => {
    componenteAtivo = false;
  };
}, [searchParams]);

  function limparAvisos() {
    setMensagem("");
    setTipoMensagem("erro");
  }

  function trocarModo(novoModo: Modo) {
    limparAvisos();
    setModo(novoModo);
    setSenha("");
    setConfirmarSenha("");
    setVisualizarSenha(false);
  }

  async function entrar(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    limparAvisos();

    const emailNormalizado = normalizarEmail(email);

    if (!emailNormalizado || !senha) {
      setMensagem("Preencha o e-mail e a senha.");
      return;
    }

    setCarregando(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailNormalizado,
        password: senha,
      });

      if (error) {
        console.error("Erro no login:", error);
        setMensagem("E-mail ou senha incorretos.");
        return;
      }

      const { data: cliente, error: erroCliente } = await supabase
        .from("clientes")
        .select("role")
        .eq("auth_user_id", data.user.id)
        .single();

      if (erroCliente) {
        console.error("Erro ao consultar perfil do usuário:", erroCliente);
      }

      const destinoFinal =
        cliente?.role === "admin"
          ? "/admin"
          : destinoAposLogin;

      router.replace(destinoFinal);
      router.refresh();
    } catch (error) {
      console.error("Falha inesperada no login:", error);
      setMensagem("Não foi possível entrar agora. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  async function criarConta(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    limparAvisos();

    const nomeNormalizado = nome.trim();
    const emailNormalizado = normalizarEmail(email);

    if (!nomeNormalizado || !emailNormalizado || !senha || !confirmarSenha) {
      setMensagem("Preencha todos os campos.");
      return;
    }

    if (!senhaValida) {
      setMensagem(
        "A senha precisa ter pelo menos 7 caracteres, incluindo letra maiúscula, letra minúscula, número e caractere especial."
      );
      return;
    }

    if (!senhasIguais) {
      setMensagem("As senhas não coincidem.");
      return;
    }

    setCarregando(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: emailNormalizado,
        password: senha,
        options: {
          data: {
            nome: nomeNormalizado,
          },
          emailRedirectTo: `${window.location.origin}/minha-conta`,
        },
      });

      if (error) {
        console.error("Erro ao criar conta:", error);
        setMensagem(traduzirErroCadastro(error.message));
        return;
      }

      if (!data.user) {
        setMensagem("A conta não pôde ser concluída. Tente novamente.");
        return;
      }

      const response = await fetch("/api/clientes/vincular", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: nomeNormalizado,
          email: emailNormalizado,
          authUserId: data.user.id,
        }),
      });

      const resultado = await response.json().catch(() => ({}));

      if (!response.ok) {
        console.error("Erro ao vincular cliente:", resultado);
        setMensagem(
          resultado.error ||
            "A conta foi criada, mas não foi possível vincular o cadastro."
        );
        return;
      }

      window.sessionStorage.removeItem("ultimoPedido");

      setNome(nomeNormalizado);
      setEmail(emailNormalizado);
      setSessaoCriada(Boolean(data.session));
      setContaCriada(true);
      setMensagem("");
      setSenha("");
      setConfirmarSenha("");
      setVisualizarSenha(false);
    } catch (error) {
      console.error("Falha inesperada ao criar conta:", error);
      setMensagem("Não foi possível criar a conta agora. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  async function recuperarSenha(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    limparAvisos();

    const emailNormalizado = normalizarEmail(email);

    if (!emailNormalizado) {
      setMensagem("Digite seu e-mail.");
      return;
    }

    setCarregando(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        emailNormalizado,
        {
          redirectTo: `${window.location.origin}/redefinir-senha`,
        }
      );

      if (error) {
        console.error("Erro ao recuperar senha:", error);
        setMensagem("Não foi possível enviar o e-mail de recuperação.");
        return;
      }

      setTipoMensagem("sucesso");
      setMensagem("Enviamos um link de recuperação para o seu e-mail.");
    } catch (error) {
      console.error("Falha inesperada ao recuperar senha:", error);
      setMensagem("Não foi possível enviar o e-mail de recuperação.");
    } finally {
      setCarregando(false);
    }
  }

  if (contaCriada) {
    return (
      <ContaCriada
        nome={nome}
        email={email}
        pedidoId={pedidoId}
        pedidoEncontrado={pedidoEncontrado}
        sessaoCriada={sessaoCriada}
        onAcessarConta={() => {
          router.replace(destinoAposLogin);
          router.refresh();
        }}
        onIrParaLogin={() => {
          trocarModo("login");
          setContaCriada(false);
        }}
      />
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-50 px-4 py-8 sm:py-12">
      <section className="mx-auto max-w-lg overflow-hidden rounded-3xl border border-white bg-white shadow-2xl shadow-pink-100/70">
        <div className="px-6 pb-8 pt-7 sm:px-9">
          <div className="text-center">
            <img
              src="/logo.png"
              alt="Lembrei de Você Store"
              className="mx-auto h-24 w-auto"
            />

            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-pink-500">
              {modo === "login" && "Bem-vindo!"}
              {modo === "cadastro" && "Criar Conta"}
              {modo === "recuperar" && "Recuperar Senha"}
            </h1>

            <p className="mx-auto mt-3 max-w-sm leading-relaxed text-gray-500">
              {modo === "login" &&
                "Entre para acompanhar seus pedidos, dados e downloads."}
              {modo === "cadastro" &&
                "Crie sua conta para acompanhar suas compras com facilidade."}
              {modo === "recuperar" &&
                "Informe seu e-mail para receber o link de recuperação."}
            </p>
          </div>

          {pedidoEncontrado && modo !== "recuperar" && (
            <CompraEncontrada pedidoId={pedidoId} />
          )}

          {modo !== "recuperar" && (
            <div className="mt-7 grid grid-cols-2 rounded-2xl bg-pink-50 p-1">
              <button
                type="button"
                onClick={() => trocarModo("login")}
                className={`rounded-xl px-4 py-3 text-sm font-bold transition ${
                  modo === "login"
                    ? "bg-white text-pink-600 shadow-sm"
                    : "text-gray-500 hover:text-pink-600"
                }`}
              >
                Entrar
              </button>

              <button
                type="button"
                onClick={() => trocarModo("cadastro")}
                className={`rounded-xl px-4 py-3 text-sm font-bold transition ${
                  modo === "cadastro"
                    ? "bg-white text-pink-600 shadow-sm"
                    : "text-gray-500 hover:text-pink-600"
                }`}
              >
                Criar Conta
              </button>
            </div>
          )}

          <form
            className="mt-7 space-y-4"
            onSubmit={
              modo === "login"
                ? entrar
                : modo === "cadastro"
                  ? criarConta
                  : recuperarSenha
            }
          >
            {modo === "cadastro" && (
              <div>
                <label htmlFor="nome" className="mb-2 block text-sm font-bold text-gray-700">
                  Nome completo
                </label>
                <input
                  id="nome"
                  type="text"
                  value={nome}
                  onChange={(event) => setNome(event.target.value)}
                  autoComplete="name"
                  placeholder="Digite seu nome"
                  className="w-full rounded-xl border border-gray-200 bg-white p-4 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-bold text-gray-700">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value.trimStart().toLowerCase())
                }
                autoComplete="email"
                placeholder="voce@email.com"
                className="w-full rounded-xl border border-gray-200 bg-white p-4 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
              />
            </div>

            {modo !== "recuperar" && (
              <div>
                <label htmlFor="senha" className="mb-2 block text-sm font-bold text-gray-700">
                  Senha
                </label>
                <input
                  id="senha"
                  type={visualizarSenha ? "text" : "password"}
                  value={senha}
                  onChange={(event) => setSenha(event.target.value)}
                  autoComplete={
                    modo === "login" ? "current-password" : "new-password"
                  }
                  placeholder="Digite sua senha"
                  className="w-full rounded-xl border border-gray-200 bg-white p-4 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                />

                {modo === "cadastro" && senha.length > 0 && (
                  <RequisitosSenha
                    minimo={senhaTemMinimo}
                    maiuscula={senhaTemMaiuscula}
                    minuscula={senhaTemMinuscula}
                    numero={senhaTemNumero}
                    especial={senhaTemEspecial}
                  />
                )}
              </div>
            )}

            {modo === "cadastro" && (
              <div>
                <label
                  htmlFor="confirmarSenha"
                  className="mb-2 block text-sm font-bold text-gray-700"
                >
                  Confirmar senha
                </label>
                <input
                  id="confirmarSenha"
                  type={visualizarSenha ? "text" : "password"}
                  value={confirmarSenha}
                  onChange={(event) => setConfirmarSenha(event.target.value)}
                  autoComplete="new-password"
                  placeholder="Digite a senha novamente"
                  className={`w-full rounded-xl border bg-white p-4 outline-none transition focus:ring-4 ${
                    confirmacaoPreenchida
                      ? senhasIguais
                        ? "border-green-500 focus:ring-green-100"
                        : "border-red-500 focus:ring-red-100"
                      : "border-gray-200 focus:border-pink-400 focus:ring-pink-100"
                  }`}
                />

                {confirmacaoPreenchida && (
                  <p
                    className={`mt-2 text-sm font-bold ${
                      senhasIguais ? "text-green-600" : "text-red-600"
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
                  onChange={(event) => setVisualizarSenha(event.target.checked)}
                  className="h-4 w-4 accent-pink-500"
                />
                Visualizar senha
              </label>
            )}

            {mensagem && (
              <div
                role="alert"
                className={`rounded-xl border p-4 text-center text-sm font-bold ${
                  tipoMensagem === "sucesso"
                    ? "border-green-200 bg-green-50 text-green-700"
                    : "border-pink-200 bg-pink-50 text-pink-600"
                }`}
              >
                {mensagem}
              </div>
            )}

            <button
              type="submit"
              disabled={carregando || validandoPedido}
              className="w-full rounded-2xl bg-pink-500 px-5 py-4 text-lg font-bold text-white transition hover:bg-pink-600 focus:outline-none focus:ring-4 focus:ring-pink-200 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {validandoPedido
  ? "Validando compra..."
  : modo === "login"
    ? carregando
      ? "Entrando..."
      : "Entrar"
    : modo === "cadastro"
      ? carregando
        ? "Criando conta..."
        : "Criar Conta"
      : carregando
        ? "Enviando..."
        : "Enviar link de recuperação"}
            </button>
          </form>

          <div className="mt-6 space-y-3 text-center">
            {modo === "login" && (
              <button
                type="button"
                onClick={() => trocarModo("recuperar")}
                className="text-sm font-medium text-gray-500 transition hover:text-pink-500"
              >
                Esqueci minha senha
              </button>
            )}

            {modo === "recuperar" && (
              <button
                type="button"
                onClick={() => trocarModo("login")}
                className="font-bold text-pink-500 hover:underline"
              >
                Voltar para o login
              </button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
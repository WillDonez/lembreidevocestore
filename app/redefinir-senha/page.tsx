"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function RedefinirSenhaPage() {
  const router = useRouter();

  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [visualizarSenha, setVisualizarSenha] = useState(false);

  const [linkValido, setLinkValido] = useState(false);
  const [verificando, setVerificando] = useState(true);
  const [carregando, setCarregando] = useState(false);
  const [senhaAlterada, setSenhaAlterada] = useState(false);
  const [mensagem, setMensagem] = useState("");

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
    async function verificarSessao() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setLinkValido(true);
      }

      setVerificando(false);
    }

    verificarSessao();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((evento, session) => {
      if (
        evento === "PASSWORD_RECOVERY" ||
        (evento === "SIGNED_IN" && session)
      ) {
        setLinkValido(true);
        setVerificando(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function atualizarSenha() {
    setMensagem("");

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

    const { error } = await supabase.auth.updateUser({
      password: senha,
    });

    setCarregando(false);

    if (error) {
      console.log("Erro ao alterar senha:", error);
      setMensagem(
        "Não foi possível alterar a senha. Solicite um novo link de recuperação."
      );
      return;
    }

    setSenhaAlterada(true);
    setMensagem("");
  }

  if (verificando) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-pink-50 p-6">
        <p className="text-xl font-bold text-pink-500">
          Verificando link de recuperação...
        </p>
      </main>
    );
  }

  if (!linkValido) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-pink-50 p-6">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl">
          <div className="text-6xl">⚠️</div>

          <h1 className="mt-4 text-3xl font-bold text-red-600">
            Link inválido ou expirado
          </h1>

          <p className="mt-4 text-gray-600">
            Solicite um novo link para redefinir sua senha.
          </p>

          <button
            type="button"
            onClick={() => router.push("/login")}
            className="mt-6 w-full rounded-2xl bg-pink-500 py-4 text-xl font-bold text-white hover:bg-pink-600"
          >
            Voltar para o Login
          </button>
        </div>
      </main>
    );
  }

  if (senhaAlterada) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-pink-50 p-6">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl">
          <div className="text-6xl">✅</div>

          <h1 className="mt-4 text-3xl font-bold text-green-700">
            Senha alterada com sucesso!
          </h1>

          <p className="mt-4 text-gray-600">
            Sua nova senha já está pronta para uso.
          </p>

          <button
            type="button"
            onClick={async () => {
              await supabase.auth.signOut();
              router.push("/login");
            }}
            className="mt-6 w-full rounded-2xl bg-green-600 py-4 text-xl font-bold text-white hover:bg-green-700"
          >
            Ir para o Login →
          </button>
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
            Criar nova senha
          </h1>

          <p className="mt-2 text-gray-500">
            Digite e confirme sua nova senha de acesso.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <input
            type={visualizarSenha ? "text" : "password"}
            placeholder="Nova senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            autoComplete="new-password"
            className="w-full rounded-xl border p-4"
          />

          {senha.length > 0 && (
            <div className="rounded-xl bg-gray-50 p-3 text-sm">
              <p className="mb-2 font-bold text-gray-700">
                Sua senha precisa conter:
              </p>

              <p className={senhaTemMinimo ? "font-bold text-green-600" : "text-gray-500"}>
                {senhaTemMinimo ? "✅" : "○"} Pelo menos 7 caracteres
              </p>

              <p className={senhaTemMaiuscula ? "font-bold text-green-600" : "text-gray-500"}>
                {senhaTemMaiuscula ? "✅" : "○"} Uma letra maiúscula
              </p>

              <p className={senhaTemMinuscula ? "font-bold text-green-600" : "text-gray-500"}>
                {senhaTemMinuscula ? "✅" : "○"} Uma letra minúscula
              </p>

              <p className={senhaTemNumero ? "font-bold text-green-600" : "text-gray-500"}>
                {senhaTemNumero ? "✅" : "○"} Um número
              </p>

              <p className={senhaTemEspecial ? "font-bold text-green-600" : "text-gray-500"}>
                {senhaTemEspecial ? "✅" : "○"} Um caractere especial
              </p>
            </div>
          )}

          <input
            type={visualizarSenha ? "text" : "password"}
            placeholder="Confirmar nova senha"
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
              className={`text-sm font-bold ${
                senhasIguais ? "text-green-600" : "text-red-600"
              }`}
            >
              {senhasIguais
                ? "✅ As senhas coincidem."
                : "⚠️ As senhas não coincidem."}
            </p>
          )}

          <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={visualizarSenha}
              onChange={(e) => setVisualizarSenha(e.target.checked)}
              className="h-4 w-4"
            />

            Visualizar senha
          </label>

          {mensagem && (
            <div className="rounded-xl bg-red-50 p-4 text-center font-bold text-red-600">
              {mensagem}
            </div>
          )}

          <button
            type="button"
            onClick={atualizarSenha}
            disabled={carregando}
            className="w-full rounded-2xl bg-pink-500 py-4 text-xl font-bold text-white hover:bg-pink-600 disabled:bg-gray-300"
          >
            {carregando ? "Alterando senha..." : "Salvar Nova Senha"}
          </button>
        </div>
      </div>
    </main>
  );
}
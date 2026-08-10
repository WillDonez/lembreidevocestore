"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

export default function RedefinirSenhaPage() {
  const router = useRouter();

  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] =
    useState("");
  const [visualizarSenha, setVisualizarSenha] =
    useState(false);

  const [linkValido, setLinkValido] =
    useState(false);
  const [verificando, setVerificando] =
    useState(true);
  const [carregando, setCarregando] =
    useState(false);
  const [senhaAlterada, setSenhaAlterada] =
    useState(false);
  const [mensagem, setMensagem] =
    useState("");

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

  const confirmacaoPreenchida =
    confirmarSenha.length > 0;

  const senhasIguais =
    senha === confirmarSenha;

  useEffect(() => {
    async function verificarSessao() {
      const {
        data: { session },
      } =
        await supabase.auth.getSession();

      if (session) {
        setLinkValido(true);
      }

      setVerificando(false);
    }

    verificarSessao();

    const {
      data: { subscription },
    } =
      supabase.auth.onAuthStateChange(
        (evento, session) => {
          if (
            evento === "PASSWORD_RECOVERY" ||
            (evento === "SIGNED_IN" && session)
          ) {
            setLinkValido(true);
            setVerificando(false);
          }
        }
      );

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

    const { error } =
      await supabase.auth.updateUser({
        password: senha,
      });

    setCarregando(false);

    if (error) {
      console.log(
        "Erro ao alterar senha:",
        error
      );

      setMensagem(
        "Não foi possível alterar a senha. Solicite um novo link de recuperação."
      );

      return;
    }

    setSenhaAlterada(true);
    setMensagem("");
  }

  const inputClass =
    "w-full rounded-xl border border-border bg-card p-4 text-text outline-none transition placeholder:text-text-light focus:border-primary focus:ring-2 focus:ring-[color-mix(in_srgb,var(--primary)_15%,transparent)]";

  if (verificando) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-border border-t-primary" />

          <p className="mt-4 font-bold text-primary">
            Verificando link de recuperação...
          </p>
        </div>
      </main>
    );
  }

  if (!linkValido) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <section className="w-full max-w-lg rounded-3xl border border-border bg-card p-8 text-center shadow-xl">
          <div className="text-6xl">
            ⚠️
          </div>

          <h1 className="mt-4 text-3xl font-bold text-danger">
            Link inválido ou expirado
          </h1>

          <p className="mt-4 text-text-light">
            Solicite um novo link para redefinir sua senha.
          </p>

          <button
            type="button"
            onClick={() =>
              router.push("/login")
            }
            className="mt-6 w-full rounded-2xl bg-primary py-4 text-xl font-bold text-white transition hover:opacity-90"
          >
            Voltar para o Login
          </button>
        </section>
      </main>
    );
  }

  if (senhaAlterada) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <section className="w-full max-w-lg rounded-3xl border border-success/30 bg-card p-8 text-center shadow-xl">
          <div className="text-6xl">
            ✅
          </div>

          <h1 className="mt-4 text-3xl font-bold text-success">
            Senha alterada com sucesso!
          </h1>

          <p className="mt-4 text-text-light">
            Sua nova senha já está pronta para uso.
          </p>

          <button
            type="button"
            onClick={async () => {
              await supabase.auth.signOut();
              router.push("/login");
            }}
            className="mt-6 w-full rounded-2xl bg-success py-4 text-xl font-bold text-white transition hover:opacity-90"
          >
            Ir para o Login →
          </button>
        </section>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen px-4 py-8 sm:py-12"
      style={{
        background:
          "linear-gradient(to bottom, color-mix(in srgb, var(--primary) 7%, white), var(--background), color-mix(in srgb, var(--primary) 7%, white))",
      }}
    >
      <section className="mx-auto max-w-lg rounded-3xl border border-border bg-card p-7 shadow-2xl sm:p-9">
        <div className="text-center">
          <img
            src="/logo.png"
            alt="Lembrei de Você Store"
            className="mx-auto h-20 w-auto"
          />

          <h1 className="mt-4 text-4xl font-bold text-primary">
            Criar nova senha
          </h1>

          <p className="mt-2 text-text-light">
            Digite e confirme sua nova senha de acesso.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <input
            type={
              visualizarSenha
                ? "text"
                : "password"
            }
            placeholder="Nova senha"
            value={senha}
            onChange={(e) =>
              setSenha(e.target.value)
            }
            autoComplete="new-password"
            className={inputClass}
          />

          {senha.length > 0 && (
            <div className="rounded-xl border border-border bg-background p-4 text-sm">
              <p className="mb-2 font-bold text-text">
                Sua senha precisa conter:
              </p>

              <p
                className={
                  senhaTemMinimo
                    ? "font-bold text-success"
                    : "text-text-light"
                }
              >
                {senhaTemMinimo
                  ? "✅"
                  : "○"}{" "}
                Pelo menos 7 caracteres
              </p>

              <p
                className={
                  senhaTemMaiuscula
                    ? "font-bold text-success"
                    : "text-text-light"
                }
              >
                {senhaTemMaiuscula
                  ? "✅"
                  : "○"}{" "}
                Uma letra maiúscula
              </p>

              <p
                className={
                  senhaTemMinuscula
                    ? "font-bold text-success"
                    : "text-text-light"
                }
              >
                {senhaTemMinuscula
                  ? "✅"
                  : "○"}{" "}
                Uma letra minúscula
              </p>

              <p
                className={
                  senhaTemNumero
                    ? "font-bold text-success"
                    : "text-text-light"
                }
              >
                {senhaTemNumero
                  ? "✅"
                  : "○"}{" "}
                Um número
              </p>

              <p
                className={
                  senhaTemEspecial
                    ? "font-bold text-success"
                    : "text-text-light"
                }
              >
                {senhaTemEspecial
                  ? "✅"
                  : "○"}{" "}
                Um caractere especial
              </p>
            </div>
          )}

          <input
            type={
              visualizarSenha
                ? "text"
                : "password"
            }
            placeholder="Confirmar nova senha"
            value={confirmarSenha}
            onChange={(e) =>
              setConfirmarSenha(
                e.target.value
              )
            }
            autoComplete="new-password"
            className={`w-full rounded-xl border bg-card p-4 text-text outline-none transition placeholder:text-text-light focus:ring-2 ${
              confirmacaoPreenchida
                ? senhasIguais
                  ? "border-success focus:ring-[color-mix(in_srgb,var(--success)_15%,transparent)]"
                  : "border-danger focus:ring-[color-mix(in_srgb,var(--danger)_15%,transparent)]"
                : "border-border focus:border-primary focus:ring-[color-mix(in_srgb,var(--primary)_15%,transparent)]"
            }`}
          />

          {confirmacaoPreenchida && (
            <p
              className={`text-sm font-bold ${
                senhasIguais
                  ? "text-success"
                  : "text-danger"
              }`}
            >
              {senhasIguais
                ? "✅ As senhas coincidem."
                : "⚠️ As senhas não coincidem."}
            </p>
          )}

          <label className="flex cursor-pointer items-center gap-2 text-sm text-text-light">
            <input
              type="checkbox"
              checked={visualizarSenha}
              onChange={(e) =>
                setVisualizarSenha(
                  e.target.checked
                )
              }
              className="h-4 w-4 accent-[var(--primary)]"
            />

            Visualizar senha
          </label>

          {mensagem && (
            <div className="rounded-xl border border-danger/30 bg-[color-mix(in_srgb,var(--danger)_8%,white)] p-4 text-center font-bold text-danger">
              {mensagem}
            </div>
          )}

          <button
            type="button"
            onClick={atualizarSenha}
            disabled={carregando}
            className="w-full rounded-2xl bg-primary py-4 text-xl font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {carregando
              ? "Alterando senha..."
              : "Salvar Nova Senha"}
          </button>
        </div>
      </section>
    </main>
  );
}
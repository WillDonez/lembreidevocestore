"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { useCarrinho } from "@/app/context/CarrinhoContext";

type UltimoPedido = {
  pedidoId: string | number;
  email: string;
  nome: string;
};

export default function Sucesso() {
  const { limparCarrinho } = useCarrinho();

  const [ultimoPedido, setUltimoPedido] =
    useState<UltimoPedido | null>(null);

  const [carregando, setCarregando] =
    useState(true);

  useEffect(() => {
    /*
      Primeiro recuperamos os dados da compra.
      Eles serão usados nos botões de login e cadastro.
    */
    try {
      const pedidoSalvo =
        sessionStorage.getItem("ultimoPedido");

      if (pedidoSalvo) {
        const pedidoConvertido =
          JSON.parse(
            pedidoSalvo,
          ) as UltimoPedido;

        setUltimoPedido(
          pedidoConvertido,
        );
      }
    } catch (error) {
      console.error(
        "Não foi possível recuperar o último pedido:",
        error,
      );
    } finally {
      setCarregando(false);
    }

    /*
      Limpa somente o carrinho e o frete.

      Não removemos "ultimoPedido" neste momento,
      porque ele ainda será útil durante a criação da conta.
    */
    limparCarrinho();

    sessionStorage.removeItem(
      "freteSelecionado",
    );
  }, [limparCarrinho]);

  const primeiroNome = useMemo(() => {
    const nome =
      ultimoPedido?.nome?.trim();

    if (!nome) {
      return "";
    }

    return nome.split(/\s+/)[0];
  }, [ultimoPedido]);

  const numeroPedido = useMemo(() => {
    if (!ultimoPedido?.pedidoId) {
      return "";
    }

    return String(
      ultimoPedido.pedidoId,
    );
  }, [ultimoPedido]);

  const linkCadastro = useMemo(() => {
    const parametros =
      new URLSearchParams();

    parametros.set(
      "cadastro",
      "1",
    );

    if (ultimoPedido?.email) {
      parametros.set(
        "email",
        ultimoPedido.email,
      );
    }

    if (ultimoPedido?.nome) {
      parametros.set(
        "nome",
        ultimoPedido.nome,
      );
    }

    if (ultimoPedido?.pedidoId) {
      parametros.set(
        "pedido",
        String(
          ultimoPedido.pedidoId,
        ),
      );
    }

    return `/login?${parametros.toString()}`;
  }, [ultimoPedido]);

  const linkEntrar = useMemo(() => {
    const parametros =
      new URLSearchParams();

    if (ultimoPedido?.email) {
      parametros.set(
        "email",
        ultimoPedido.email,
      );
    }

    if (ultimoPedido?.pedidoId) {
      parametros.set(
        "pedido",
        String(
          ultimoPedido.pedidoId,
        ),
      );
    }

    const query =
      parametros.toString();

    return query
      ? `/login?${query}`
      : "/login";
  }, [ultimoPedido]);

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:py-12">
      <section className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
        <div
          className="px-6 py-10 text-center text-white md:px-10"
          style={{
            background:
              "linear-gradient(135deg, var(--success), color-mix(in srgb, var(--success) 72%, black))",
          }}
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-white/20 text-5xl backdrop-blur">
            ✅
          </div>

          <h1 className="mt-6 text-4xl font-bold md:text-5xl">
            Pagamento aprovado!
          </h1>

          <p className="mt-4 text-lg text-white/85 md:text-xl">
            {primeiroNome
              ? `Obrigado pela sua compra, ${primeiroNome}!`
              : "Obrigado pela sua compra!"}
          </p>

          <p className="mt-2 text-white/80">
            Seu pedido foi recebido com sucesso.
          </p>
        </div>

        <div className="p-6 md:p-10">
          {!carregando &&
            numeroPedido && (
              <div className="mx-auto mb-8 max-w-xl rounded-2xl border border-success/30 bg-[color-mix(in_srgb,var(--success)_8%,white)] p-5 text-center">
                <p className="text-sm font-semibold uppercase tracking-wide text-success">
                  Número do pedido
                </p>

                <p className="mt-2 break-all text-xl font-bold text-text">
                  #{numeroPedido}
                </p>

                {ultimoPedido?.email && (
                  <p className="mt-2 break-all text-sm text-text-light">
                    Compra realizada com o e-mail{" "}
                    <strong className="text-text">
                      {ultimoPedido.email}
                    </strong>
                  </p>
                )}
              </div>
            )}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <article className="flex flex-col rounded-3xl border border-primary/25 bg-[color-mix(in_srgb,var(--primary)_7%,white)] p-6 md:p-8">
              <div className="text-4xl">
                👤
              </div>

              <p className="mt-4 text-sm font-bold uppercase tracking-wide text-primary">
                Primeira compra?
              </p>

              <h2 className="mt-2 text-2xl font-bold text-text">
                Crie sua conta
              </h2>

              <p className="mt-3 flex-1 leading-relaxed text-text-light">
                Acompanhe seus pedidos, consulte suas compras
                e acesse os arquivos digitais liberados.
              </p>

              {primeiroNome && (
                <div className="mt-5 rounded-2xl border border-border bg-card p-4 text-sm leading-relaxed text-text-light shadow-sm">
                  Olá,{" "}
                  <strong className="text-text">
                    {primeiroNome}
                  </strong>
                  ! Encontramos sua compra. Crie sua senha para
                  vincular automaticamente sua conta ao pedido.
                </div>
              )}

              <Link
                href={linkCadastro}
                className="mt-6 rounded-2xl bg-primary px-6 py-4 text-center font-bold text-white transition hover:opacity-90"
              >
                Criar minha conta
              </Link>
            </article>

            <article className="flex flex-col rounded-3xl border border-secondary/25 bg-[color-mix(in_srgb,var(--secondary)_8%,white)] p-6 md:p-8">
              <div className="text-4xl">
                🔑
              </div>

              <p className="mt-4 text-sm font-bold uppercase tracking-wide text-secondary">
                Já possui cadastro?
              </p>

              <h2 className="mt-2 text-2xl font-bold text-text">
                Entre na sua conta
              </h2>

              <p className="mt-3 flex-1 leading-relaxed text-text-light">
                Acesse sua área do cliente para acompanhar
                este pedido, verificar o andamento da entrega
                e consultar seus downloads.
              </p>

              <Link
                href={linkEntrar}
                className="mt-6 rounded-2xl bg-secondary px-6 py-4 text-center font-bold text-white transition hover:opacity-90"
              >
                Entrar na minha conta
              </Link>
            </article>
          </div>

          <div className="mt-8 rounded-2xl border border-border bg-background p-5">
            <p className="font-bold text-text">
              O que acontece agora?
            </p>

            <div className="mt-3 grid grid-cols-1 gap-3 text-text-light md:grid-cols-3">
              <p>
                📦 Seu pedido será preparado.
              </p>

              <p>
                🚚 O envio seguirá a opção escolhida.
              </p>

              <p>
                📄 Arquivos digitais serão liberados após a
                confirmação.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/"
              className="w-full rounded-2xl bg-text px-7 py-4 text-center font-bold text-white transition hover:opacity-90 sm:w-auto"
            >
              🛍 Continuar comprando
            </Link>

            <Link
              href="/minha-conta"
              className="w-full rounded-2xl border border-border bg-card px-7 py-4 text-center font-bold text-text transition hover:border-primary hover:text-primary sm:w-auto"
            >
              Minha Conta
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
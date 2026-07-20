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
          JSON.parse(pedidoSalvo) as UltimoPedido;

        setUltimoPedido(pedidoConvertido);
      }
    } catch (error) {
      console.error(
        "Não foi possível recuperar o último pedido:",
        error
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
    sessionStorage.removeItem("freteSelecionado");
  }, [limparCarrinho]);

  const primeiroNome = useMemo(() => {
    const nome = ultimoPedido?.nome?.trim();

    if (!nome) {
      return "";
    }

    return nome.split(/\s+/)[0];
  }, [ultimoPedido]);

  const numeroPedido = useMemo(() => {
    if (!ultimoPedido?.pedidoId) {
      return "";
    }

    return String(ultimoPedido.pedidoId);
  }, [ultimoPedido]);

  const linkCadastro = useMemo(() => {
    const parametros = new URLSearchParams();

    parametros.set("cadastro", "1");

    if (ultimoPedido?.email) {
      parametros.set(
        "email",
        ultimoPedido.email
      );
    }

    if (ultimoPedido?.nome) {
      parametros.set(
        "nome",
        ultimoPedido.nome
      );
    }

    if (ultimoPedido?.pedidoId) {
      parametros.set(
        "pedido",
        String(ultimoPedido.pedidoId)
      );
    }

    return `/login?${parametros.toString()}`;
  }, [ultimoPedido]);

  const linkEntrar = useMemo(() => {
    const parametros = new URLSearchParams();

    if (ultimoPedido?.email) {
      parametros.set(
        "email",
        ultimoPedido.email
      );
    }

    if (ultimoPedido?.pedidoId) {
      parametros.set(
        "pedido",
        String(ultimoPedido.pedidoId)
      );
    }

    const query = parametros.toString();

    return query
      ? `/login?${query}`
      : "/login";
  }, [ultimoPedido]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 via-white to-pink-50 px-5 py-10">
      <div className="mx-auto w-full max-w-5xl">
        <section className="overflow-hidden rounded-3xl border border-green-100 bg-white shadow-xl">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-10 text-center text-white md:px-12">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white/20 text-5xl shadow-inner">
              ✅
            </div>

            <h1 className="mt-6 text-4xl font-bold md:text-5xl">
              Pagamento aprovado!
            </h1>

            <p className="mt-4 text-lg text-green-50 md:text-xl">
              {primeiroNome
                ? `Obrigado pela sua compra, ${primeiroNome}!`
                : "Obrigado pela sua compra!"}
            </p>

            <p className="mt-2 text-green-50">
              Seu pedido foi recebido com sucesso.
            </p>
          </div>

          <div className="p-6 md:p-10">
            {!carregando && numeroPedido && (
              <div className="mx-auto mb-8 max-w-xl rounded-2xl border border-green-200 bg-green-50 p-5 text-center">
                <p className="text-sm font-semibold uppercase tracking-wide text-green-700">
                  Número do pedido
                </p>

                <p className="mt-2 break-all text-xl font-bold text-gray-800">
                  #{numeroPedido}
                </p>

                {ultimoPedido?.email && (
                  <p className="mt-2 break-all text-sm text-gray-500">
                    Compra realizada com o e-mail{" "}
                    <strong>
                      {ultimoPedido.email}
                    </strong>
                  </p>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <article className="flex flex-col rounded-3xl border border-pink-200 bg-pink-50 p-6 md:p-8">
                <div className="text-4xl">
                  👤
                </div>

                <p className="mt-4 text-sm font-bold uppercase tracking-wide text-pink-600">
                  Primeira compra?
                </p>

                <h2 className="mt-2 text-2xl font-bold text-gray-800">
                  Crie sua conta
                </h2>

                <p className="mt-3 flex-1 leading-relaxed text-gray-600">
                  Acompanhe seus pedidos, consulte suas
                  compras e acesse os arquivos digitais
                  liberados.
                </p>

                {primeiroNome && (
                  <div className="mt-5 rounded-2xl bg-white p-4 text-sm leading-relaxed text-gray-600 shadow-sm">
                    Olá,{" "}
                    <strong>{primeiroNome}</strong>! Encontramos
                    sua compra. Crie sua senha para vincular
                    automaticamente sua conta ao pedido.
                  </div>
                )}

                <Link
                  href={linkCadastro}
                  className="mt-6 rounded-2xl bg-pink-500 px-6 py-4 text-center font-bold text-white transition hover:bg-pink-600"
                >
                  Criar minha conta
                </Link>
              </article>

              <article className="flex flex-col rounded-3xl border border-blue-200 bg-blue-50 p-6 md:p-8">
                <div className="text-4xl">
                  🔑
                </div>

                <p className="mt-4 text-sm font-bold uppercase tracking-wide text-blue-600">
                  Já possui cadastro?
                </p>

                <h2 className="mt-2 text-2xl font-bold text-gray-800">
                  Entre na sua conta
                </h2>

                <p className="mt-3 flex-1 leading-relaxed text-gray-600">
                  Acesse sua área do cliente para acompanhar
                  este pedido, verificar o andamento da entrega
                  e consultar seus downloads.
                </p>

                <Link
                  href={linkEntrar}
                  className="mt-6 rounded-2xl bg-blue-500 px-6 py-4 text-center font-bold text-white transition hover:bg-blue-600"
                >
                  Entrar na minha conta
                </Link>
              </article>
            </div>

            <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-5">
              <p className="font-bold text-gray-800">
                O que acontece agora?
              </p>

              <div className="mt-3 grid grid-cols-1 gap-3 text-gray-600 md:grid-cols-3">
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
                className="w-full rounded-2xl bg-gray-900 px-7 py-4 text-center font-bold text-white transition hover:bg-gray-800 sm:w-auto"
              >
                🛍 Continuar comprando
              </Link>

              <Link
                href="/minha-conta"
                className="w-full rounded-2xl border border-gray-300 bg-white px-7 py-4 text-center font-bold text-gray-700 transition hover:bg-gray-50 sm:w-auto"
              >
                Minha Conta
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
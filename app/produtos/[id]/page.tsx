"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Download,
  PackageCheck,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Truck,
} from "lucide-react";

import { useCarrinho } from "@/app/context/CarrinhoContext";
import Header from "@/components/Header";
import ProdutoCard from "@/components/ProdutoCard";
import FavoriteButton from "@/components/product/FavoriteButton";
import ProductBadges from "@/components/product/ProductBadges";
import ProductPrice from "@/components/product/ProductPrice";
import ProductTypeBadge from "@/components/product/ProductTypeBadge";
import Footer from "@/components/storefront/Footer";
import SectionHeader from "@/components/storefront/SectionHeader";
import { supabase } from "@/lib/supabase";

export default function ProdutoDetalhe() {
  const params = useParams();
  const router = useRouter();

  const id = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const [produto, setProduto] = useState<any>(null);
  const [relacionados, setRelacionados] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const {
    carrinho,
    limparCarrinho,
    adicionarCarrinho,
  } = useCarrinho();

  useEffect(() => {
    if (!id) return;

    buscarProduto();
  }, [id]);

  async function buscarProduto() {
    setCarregando(true);
    setErro("");

    const { data, error } = await supabase
      .from("produtos")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      console.error("Erro ao buscar produto:", error);
      setErro("Não foi possível carregar este produto.");
      setCarregando(false);
      return;
    }

    setProduto(data);

    if (data.categoria) {
      const { data: relacionadosData, error: relacionadosError } =
        await supabase
          .from("produtos")
          .select("*")
          .eq("categoria", data.categoria)
          .neq("id", data.id)
          .limit(4);

      if (relacionadosError) {
        console.error(
          "Erro ao buscar produtos relacionados:",
          relacionadosError,
        );
      }

      setRelacionados(relacionadosData ?? []);
    }

    setCarregando(false);
  }

  const produtoDigital =
    Boolean(produto?.arquivo_digital) ||
    produto?.tipo_produto === "digital" ||
    produto?.tipo_produto === "pdf" ||
    produto?.tipo_produto === "kit";

  const preco = Number(produto?.preco || 0);
  const precoAnterior = Number(
    produto?.preco_anterior || 0,
  );

  const possuiDesconto =
    precoAnterior > 0 &&
    preco > 0 &&
    precoAnterior > preco;

  const percentualDesconto = possuiDesconto
    ? Math.round(
        ((precoAnterior - preco) / precoAnterior) * 100,
      )
    : 0;

  function comprarAgora() {
    if (!produto) return;

    limparCarrinho();
    adicionarCarrinho(produto);

    /*
      Produtos físicos precisam passar pelo carrinho
      para o cliente calcular e escolher o frete.
    */
    if (!produtoDigital) {
      router.push("/carrinho");
      return;
    }

    /*
      Produtos digitais não precisam de frete.
    */
    router.push("/checkout");
  }

  if (carregando) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-pink-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-pink-200 border-t-pink-500" />

          <p className="mt-5 text-lg font-bold text-pink-500">
            Carregando produto...
          </p>
        </div>
      </main>
    );
  }

  if (erro || !produto) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-pink-50 px-6">
        <div className="max-w-lg rounded-3xl bg-white p-10 text-center shadow-xl">
          <h1 className="text-2xl font-black text-gray-900">
            Produto não encontrado
          </h1>

          <p className="mt-3 text-gray-500">
            {erro ||
              "O produto informado não está disponível."}
          </p>

          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-pink-500 px-6 py-3 font-black text-white transition hover:bg-pink-600"
          >
            <ArrowLeft className="h-5 w-5" />
            Voltar para a loja
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-pink-50">
      <Header
        quantidadeCarrinho={carrinho.length}
        abrirCarrinho={() => {
          router.push("/carrinho");
        }}
      />

      <section className="px-6 py-8 sm:px-10 sm:py-12">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 transition hover:text-pink-500"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para a loja
          </Link>

          <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:items-start">
            <div className="relative overflow-hidden rounded-[2rem] border border-pink-100 bg-white p-4 shadow-xl shadow-pink-100/50 sm:p-6">
              <ProductBadges
                destaque={produto.destaque}
                produtoDigital={produtoDigital}
                possuiDesconto={possuiDesconto}
                percentualDesconto={percentualDesconto}
              />

              <div className="absolute right-6 top-20 z-20">
                <FavoriteButton
                  nomeProduto={produto.nome}
                />
              </div>

              {produto.imagem ? (
                <img
                  src={produto.imagem}
                  alt={produto.nome}
                  className="aspect-square w-full rounded-[1.5rem] object-contain"
                />
              ) : (
                <div className="flex aspect-square w-full items-center justify-center rounded-[1.5rem] bg-gray-50 px-6 text-center font-medium text-gray-400">
                  Imagem não disponível
                </div>
              )}

              <p className="mt-4 text-center text-xs font-medium text-gray-400">
                Em breve: galeria com miniaturas e ampliação
                da imagem
              </p>
            </div>

            <div className="rounded-[2rem] border border-pink-100 bg-white p-6 shadow-xl shadow-pink-100/50 sm:p-8 lg:p-10">
              {produto.categoria && (
                <p className="text-xs font-black uppercase tracking-[0.18em] text-pink-500">
                  {produto.categoria}
                </p>
              )}

              <h1 className="mt-3 text-3xl font-black leading-tight text-gray-900 sm:text-4xl lg:text-5xl">
                {produto.nome}
              </h1>

              {produto.descricao && (
                <p className="mt-5 text-base leading-8 text-gray-600 sm:text-lg">
                  {produto.descricao}
                </p>
              )}

              <ProductPrice
                preco={preco}
                precoAnterior={precoAnterior}
                parcelas={produto.parcelas}
                produtoDigital={produtoDigital}
              />

              <ProductTypeBadge
                produtoDigital={produtoDigital}
              />

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                  {produtoDigital ? (
                    <Download className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <Truck className="h-5 w-5 text-blue-600" />
                  )}

                  <p className="mt-3 text-sm font-black text-gray-900">
                    {produtoDigital
                      ? "Entrega digital"
                      : "Envio rastreado"}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    {produtoDigital
                      ? "Acesso liberado após o pagamento."
                      : "Acompanhe o envio do seu pedido."}
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                  <ShieldCheck className="h-5 w-5 text-pink-500" />

                  <p className="mt-3 text-sm font-black text-gray-900">
                    Compra segura
                  </p>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Pagamento processado em ambiente
                    protegido.
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                  <PackageCheck className="h-5 w-5 text-amber-500" />

                  <p className="mt-3 text-sm font-black text-gray-900">
                    Feito com carinho
                  </p>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Produtos preparados para momentos
                    especiais.
                  </p>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <button
                  type="button"
                  onClick={() =>
                    adicionarCarrinho(produto)
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-pink-500 px-6 py-4 text-base font-black text-white shadow-lg shadow-pink-200/70 transition hover:-translate-y-0.5 hover:bg-pink-600 hover:shadow-xl active:scale-[0.99]"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Adicionar ao carrinho
                </button>

                <button
                  type="button"
                  onClick={comprarAgora}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-pink-500 px-6 py-4 text-base font-black text-pink-500 transition hover:bg-pink-50 active:scale-[0.99]"
                >
                  <Sparkles className="h-5 w-5" />
                  Comprar agora
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {relacionados.length > 0 && (
        <section className="bg-white px-6 py-14 sm:px-10 sm:py-16">
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              etiqueta="Você também pode gostar"
              titulo="Produtos relacionados"
              descricao="Outras opções da mesma categoria que podem combinar com o que você procura."
              alinhamento="centro"
            />

            <div className="mt-10 grid grid-cols-1 justify-center gap-5 sm:grid-cols-[repeat(auto-fit,minmax(220px,260px))]">
              {relacionados.map((item) => (
                <ProdutoCard
                  key={item.id}
                  produto={item}
                  adicionarCarrinho={
                    adicionarCarrinho
                  }
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
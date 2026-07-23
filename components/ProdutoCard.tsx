"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  Download,
  Heart,
  ShoppingCart,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";

import { useCarrinho } from "@/app/context/CarrinhoContext";
import { formatarMoeda } from "@/lib/formatadores";

interface ProdutoCardProps {
  produto: any;
  adicionarCarrinho: (produto: any) => void;
}

export default function ProdutoCard({
  produto,
  adicionarCarrinho,
}: ProdutoCardProps) {
  const router = useRouter();
  const { limparCarrinho } = useCarrinho();

  const produtoDigital =
    Boolean(produto.arquivo_digital) ||
    produto.tipo_produto === "digital" ||
    produto.tipo_produto === "pdf" ||
    produto.tipo_produto === "kit";

  const preco = Number(produto.preco || 0);
  const precoAnterior = Number(produto.preco_anterior || 0);

  const possuiDesconto =
    precoAnterior > 0 &&
    preco > 0 &&
    precoAnterior > preco;

  const percentualDesconto = possuiDesconto
    ? Math.round(((precoAnterior - preco) / precoAnterior) * 100)
    : 0;

  function comprarAgora() {
    limparCarrinho();
    adicionarCarrinho(produto);

    /*
      Produto físico precisa passar pelo carrinho
      para calcular e selecionar o frete.
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

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-pink-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-pink-200 hover:shadow-2xl hover:shadow-pink-100/70">
      <div className="relative overflow-hidden bg-gradient-to-br from-pink-50 to-white">
        <div className="absolute left-3 top-3 z-20 flex flex-col items-start gap-2">
          {produto.destaque && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-3 py-1.5 text-xs font-black text-white shadow-lg">
              <Star className="h-3.5 w-3.5 fill-current" />
              Destaque
            </span>
          )}

          {possuiDesconto && (
            <span className="rounded-full bg-red-500 px-3 py-1.5 text-xs font-black text-white shadow-lg">
              -{percentualDesconto}%
            </span>
          )}
        </div>

        <div className="absolute right-3 top-3 z-20 flex flex-col items-end gap-2">
          {produtoDigital && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-pink-500 px-3 py-1.5 text-xs font-black text-white shadow-lg">
              <Download className="h-3.5 w-3.5" />
              Digital
            </span>
          )}

          <button
            type="button"
            aria-label={`Adicionar ${produto.nome} aos favoritos`}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/80 bg-white/90 text-gray-500 shadow-md backdrop-blur transition hover:scale-105 hover:text-pink-500"
          >
            <Heart className="h-5 w-5" strokeWidth={1.8} />
          </button>
        </div>

        <Link
          href={`/produtos/${produto.id}`}
          aria-label={`Ver detalhes de ${produto.nome}`}
          className="block"
        >
          {produto.imagem ? (
            <img
              src={produto.imagem}
              alt={produto.nome}
              className="aspect-[4/5] w-full cursor-pointer object-cover transition duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex aspect-[4/5] w-full items-center justify-center px-6 text-center text-sm font-medium text-gray-400">
              Imagem não disponível
            </div>
          )}
        </Link>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition group-hover:opacity-100" />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-3">
          {produto.categoria ? (
            <p className="truncate text-xs font-bold uppercase tracking-[0.14em] text-pink-500">
              {produto.categoria}
            </p>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-1 text-amber-500">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-xs font-bold text-gray-600">
              {produto.avaliacao || "5,0"}
            </span>
          </div>
        </div>

        <Link href={`/produtos/${produto.id}`}>
          <h2 className="mt-3 line-clamp-2 min-h-[3.25rem] text-lg font-black leading-snug text-gray-900 transition hover:text-pink-500">
            {produto.nome}
          </h2>
        </Link>

        {produto.descricao && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-500">
            {produto.descricao}
          </p>
        )}

        <div className="mt-5">
          {possuiDesconto && (
            <p className="text-sm font-medium text-gray-400 line-through">
              {formatarMoeda(precoAnterior)}
            </p>
          )}

          <div className="flex flex-wrap items-end gap-x-2 gap-y-1">
            <p className="text-3xl font-black tracking-tight text-pink-500">
              {formatarMoeda(preco)}
            </p>

            {produto.parcelas && !produtoDigital && (
              <span className="pb-1 text-xs font-medium text-gray-500">
                em até {produto.parcelas}x
              </span>
            )}
          </div>

          {!produtoDigital && (
            <p className="mt-1 text-xs font-medium text-gray-500">
              Frete calculado no carrinho
            </p>
          )}
        </div>

        {produtoDigital ? (
          <div className="mt-4 flex items-start gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 px-3.5 py-3 text-emerald-700">
            <Zap className="mt-0.5 h-4 w-4 shrink-0" />
            <p className="text-xs font-bold leading-snug">
              Liberado após a confirmação do pagamento
            </p>
          </div>
        ) : (
          <div className="mt-4 flex items-start gap-2 rounded-2xl border border-blue-100 bg-blue-50 px-3.5 py-3 text-blue-700">
            <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0" />
            <p className="text-xs font-bold leading-snug">
              Produto físico enviado com rastreamento
            </p>
          </div>
        )}

        <div className="mt-auto pt-5">
          <button
            type="button"
            onClick={() => adicionarCarrinho(produto)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-pink-500 px-4 py-3.5 text-sm font-black text-white shadow-lg shadow-pink-200/60 transition hover:-translate-y-0.5 hover:bg-pink-600 hover:shadow-xl active:scale-[0.98]"
          >
            <ShoppingCart className="h-5 w-5" />
            Adicionar ao carrinho
          </button>

          <button
            type="button"
            onClick={comprarAgora}
            className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-pink-500 px-4 py-3 text-sm font-black text-pink-500 transition hover:bg-pink-50 active:scale-[0.98]"
          >
            <Sparkles className="h-5 w-5" />
            Comprar agora
          </button>

          <Link
            href={`/produtos/${produto.id}`}
            className="group/link mt-4 flex items-center justify-center gap-2 text-sm font-bold text-gray-600 transition hover:text-pink-500"
          >
            Ver detalhes
            <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
}
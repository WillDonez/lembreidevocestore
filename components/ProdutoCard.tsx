"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ShoppingCart,
  Sparkles,
  Star,
} from "lucide-react";

import { useCarrinho } from "@/app/context/CarrinhoContext";
import FavoriteButton from "@/components/product/FavoriteButton";
import ProductBadges from "@/components/product/ProductBadges";
import ProductPrice from "@/components/product/ProductPrice";
import ProductTypeBadge from "@/components/product/ProductTypeBadge";

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
    ? Math.round(
        ((precoAnterior - preco) / precoAnterior) * 100,
      )
    : 0;

  function comprarAgora() {
    limparCarrinho();
    adicionarCarrinho(produto);

    if (!produtoDigital) {
      router.push("/carrinho");
      return;
    }

    router.push("/checkout");
  }

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-pink-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-pink-200 hover:shadow-xl hover:shadow-pink-100/70">
      <div className="relative overflow-hidden bg-gradient-to-br from-pink-50 to-white">
        <ProductBadges
          destaque={produto.destaque}
          produtoDigital={produtoDigital}
          possuiDesconto={possuiDesconto}
          percentualDesconto={percentualDesconto}
        />

        <div className="absolute right-3 top-14 z-20">
          <FavoriteButton nomeProduto={produto.nome} />
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
              className="aspect-[4/4.35] w-full cursor-pointer object-cover transition duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex aspect-[4/4.35] w-full items-center justify-center px-6 text-center text-sm font-medium text-gray-400">
              Imagem não disponível
            </div>
          )}
        </Link>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/15 to-transparent opacity-0 transition group-hover:opacity-100" />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-3">
          {produto.categoria ? (
            <p className="truncate text-[11px] font-bold uppercase tracking-[0.13em] text-pink-500">
              {produto.categoria}
            </p>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-1 text-amber-500">
            <Star className="h-3.5 w-3.5 fill-current" />

            <span className="text-[11px] font-bold text-gray-600">
              {produto.avaliacao || "5,0"}
            </span>
          </div>
        </div>

        <Link href={`/produtos/${produto.id}`}>
          <h2 className="mt-2.5 line-clamp-2 min-h-[2.9rem] text-base font-black leading-snug text-gray-900 transition hover:text-pink-500">
            {produto.nome}
          </h2>
        </Link>

        {produto.descricao && (
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-gray-500">
            {produto.descricao}
          </p>
        )}

        <ProductPrice
          preco={preco}
          precoAnterior={precoAnterior}
          parcelas={produto.parcelas}
          produtoDigital={produtoDigital}
        />

        <ProductTypeBadge produtoDigital={produtoDigital} />

        <div className="mt-auto pt-4">
          <button
            type="button"
            onClick={() => adicionarCarrinho(produto)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-pink-500 px-4 py-3 text-sm font-black text-white shadow-md shadow-pink-200/60 transition hover:-translate-y-0.5 hover:bg-pink-600 hover:shadow-lg active:scale-[0.98]"
          >
            <ShoppingCart className="h-4.5 w-4.5" />
            Adicionar ao carrinho
          </button>

          <button
            type="button"
            onClick={comprarAgora}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-pink-500 px-4 py-2.5 text-sm font-black text-pink-500 transition hover:bg-pink-50 active:scale-[0.98]"
          >
            <Sparkles className="h-4.5 w-4.5" />
            Comprar agora
          </button>

          <Link
            href={`/produtos/${produto.id}`}
            className="group/link mt-3 flex items-center justify-center gap-2 text-xs font-bold text-gray-600 transition hover:text-pink-500"
          >
            Ver detalhes

            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
}
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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
      PDF e ZIP não precisam de frete.
    */
    router.push("/checkout");
  }

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative overflow-hidden bg-pink-50">
        {produto.destaque && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-yellow-500 px-3 py-1.5 text-xs font-bold text-white shadow">
            ⭐ Destaque
          </span>
        )}

        {produtoDigital && (
          <span className="absolute right-3 top-3 z-10 rounded-full bg-pink-500 px-3 py-1.5 text-xs font-bold text-white shadow">
            📄 Digital
          </span>
        )}

        <Link href={`/produtos/${produto.id}`}>
          {produto.imagem ? (
            <img
              src={produto.imagem}
              alt={produto.nome}
              className="aspect-[4/5] w-full cursor-pointer object-cover transition duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex aspect-[4/5] w-full items-center justify-center text-sm text-gray-400">
              Imagem não disponível
            </div>
          )}
        </Link>
      </div>

      <div className="flex flex-1 flex-col p-4">
        {produto.categoria && (
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            {produto.categoria}
          </p>
        )}

        <Link href={`/produtos/${produto.id}`}>
          <h2 className="mt-2 line-clamp-2 text-lg font-bold leading-snug text-gray-800 transition hover:text-pink-500">
            {produto.nome}
          </h2>
        </Link>

        <div className="mt-4">
          <p className="text-3xl font-bold text-pink-500">
            {formatarMoeda(produto.preco)}
          </p>
        </div>

        {produtoDigital && (
          <div className="mt-3 rounded-xl bg-green-50 px-3 py-2 text-xs font-bold leading-snug text-green-700">
            ⚡ Liberado após a confirmação do pagamento
          </div>
        )}

        <div className="mt-auto pt-5">
          <button
            type="button"
            onClick={() => adicionarCarrinho(produto)}
            className="w-full rounded-xl bg-pink-500 px-2 py-3 text-sm font-bold text-white transition hover:bg-pink-600 active:scale-[0.98]"
          >
            🛒 Adicionar ao Carrinho
          </button>

          <button
            type="button"
            onClick={comprarAgora}
            className="mt-2 w-full rounded-xl border-2 border-pink-500 px-2 py-2.5 text-sm font-bold text-pink-500 transition hover:bg-pink-50 active:scale-[0.98]"
          >
            ⚡ Comprar agora
          </button>

          <Link
            href={`/produtos/${produto.id}`}
            className="mt-3 block text-center text-sm font-bold text-gray-600 underline-offset-4 hover:text-pink-500 hover:underline"
          >
            Ver detalhes do produto
          </Link>
        </div>
      </div>
    </article>
  );
}
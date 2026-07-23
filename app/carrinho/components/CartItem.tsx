import {
  obterQuantidadeMaxima,
  type CarrinhoItem as CarrinhoItemType,
} from "@/app/context/CarrinhoContext";

import QuantitySelector from "@/components/ui/QuantitySelector";
import { formatarMoeda } from "@/lib/formatadores";
import ProductTypeBadge from "@/components/ui/ProductTypeBadge";

type CartItemProps = {
  item: CarrinhoItemType;
  onAlternarSelecionado: (idCarrinho: string) => void;
  onAumentarQuantidade: (idCarrinho: string) => void;
  onDiminuirQuantidade: (idCarrinho: string) => void;
  onRemover: (idCarrinho: string) => void;
};

export default function CartItem({
  item,
  onAlternarSelecionado,
  onAumentarQuantidade,
  onDiminuirQuantidade,
  onRemover,
}: CartItemProps) {
  const {
    produto,
    quantidade,
    selecionado,
    idCarrinho,
  } = item;

  const subtotal =
    Number(produto.preco || 0) * quantidade;

  const quantidadeMaxima =
    obterQuantidadeMaxima(produto);

  const atingiuQuantidadeMaxima =
    quantidade >= quantidadeMaxima;

  const permiteMaisDeUmaUnidade =
    quantidadeMaxima > 1;

  return (
    <article
      className={`rounded-2xl border-2 p-5 transition ${
        selecionado
          ? "border-pink-200 bg-white shadow-sm"
          : "border-gray-200 bg-gray-50 opacity-80"
      }`}
    >
      <div className="flex flex-col gap-5 sm:flex-row">
        <div className="flex items-start gap-4">
          <input
            type="checkbox"
            checked={selecionado}
            onChange={() =>
              onAlternarSelecionado(idCarrinho)
            }
            aria-label={`Selecionar ${produto.nome}`}
            className="mt-2 h-5 w-5 cursor-pointer accent-pink-500"
          />

          {produto.imagem ? (
            <img
              src={produto.imagem}
              alt={produto.nome}
              className="h-28 w-28 rounded-xl object-cover"
            />
          ) : (
            <div className="flex h-28 w-28 items-center justify-center rounded-xl bg-gray-100 text-4xl">
              🛍️
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="text-xl font-bold text-gray-800 md:text-2xl">
                {produto.nome}
              </h2>

              {produto.descricao && (
                <p className="mt-2 text-gray-500">
                  {produto.descricao}
                </p>
              )}

              <div className="mt-3 flex flex-wrap gap-2">
  <ProductTypeBadge
    tipoProduto={produto.tipo_produto}
  />
</div>
            </div>

            <div className="grid gap-5 border-t pt-5 sm:grid-cols-3">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Preço unitário
                </p>

                <p className="mt-1 text-xl font-bold text-pink-500">
                  {formatarMoeda(produto.preco)}
                </p>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-gray-500">
                  Quantidade
                </p>

                <QuantitySelector
                  quantidade={quantidade}
                  nomeProduto={produto.nome}
                  aoDiminuir={() =>
                    onDiminuirQuantidade(idCarrinho)
                  }
                  aoAumentar={() =>
                    onAumentarQuantidade(idCarrinho)
                  }
                  desabilitarAumento={
                    atingiuQuantidadeMaxima
                  }
                  quantidadeMaxima={quantidadeMaxima}
                />

                {!permiteMaisDeUmaUnidade ? (
                  <p className="mt-2 text-xs font-medium text-green-700">
                    ✓ Máximo de 1 unidade por pedido
                  </p>
                ) : atingiuQuantidadeMaxima ? (
                  <p className="mt-2 text-xs font-medium text-orange-600">
                    Quantidade máxima: {quantidadeMaxima}
                  </p>
                ) : null}
              </div>

              <div className="sm:text-right">
                <p className="text-sm font-medium text-gray-500">
                  Subtotal
                </p>

                <p className="mt-1 text-2xl font-bold text-gray-800">
                  {formatarMoeda(subtotal)}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 flex justify-end border-t pt-4">
            <button
              type="button"
              onClick={() => onRemover(idCarrinho)}
              className="rounded-xl px-4 py-2 font-bold text-red-500 transition hover:bg-red-50 hover:text-red-600"
            >
              🗑 Remover produto
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
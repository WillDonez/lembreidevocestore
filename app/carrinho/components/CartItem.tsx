import {
  obterQuantidadeMaxima,
  type CarrinhoItem as CarrinhoItemType,
} from "@/app/context/CarrinhoContext";

import ProductPrice from "@/components/ui/ProductPrice";
import ProductTypeBadge from "@/components/ui/ProductTypeBadge";
import QuantitySelector from "@/components/ui/QuantitySelector";

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
          ? "border-primary/30 bg-card shadow-sm"
          : "border-border bg-background opacity-80"
      }`}
    >
      <div className="flex flex-col gap-5 sm:flex-row">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={selecionado}
            onChange={() =>
              onAlternarSelecionado(idCarrinho)
            }
            aria-label={`Selecionar ${produto.nome}`}
            className="mt-2 h-5 w-5 cursor-pointer accent-[var(--primary)]"
          />

          {produto.imagem ? (
            <img
              src={produto.imagem}
              alt={produto.nome}
              className="h-28 w-28 rounded-xl border border-border object-cover"
            />
          ) : (
            <div className="flex h-28 w-28 items-center justify-center rounded-xl bg-background text-4xl">
              🛍️
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="text-xl font-bold text-text md:text-2xl">
                {produto.nome}
              </h2>

              {produto.descricao && (
                <p className="mt-2 text-text-light">
                  {produto.descricao}
                </p>
              )}

              <div className="mt-3 flex flex-wrap gap-2">
                <ProductTypeBadge
                  tipoProduto={produto.tipo_produto}
                />
              </div>
            </div>

            <div className="grid gap-5 border-t border-border pt-5 sm:grid-cols-3">
              <div>
                <p className="text-sm font-medium text-text-light">
                  Preço unitário
                </p>

                <ProductPrice
                  value={Number(produto.preco)}
                  className="mt-1"
                />
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-text-light">
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
                  <p className="mt-2 text-xs font-medium text-success">
                    ✓ Máximo de 1 unidade por pedido
                  </p>
                ) : atingiuQuantidadeMaxima ? (
                  <p className="mt-2 text-xs font-medium text-warning">
                    Quantidade máxima: {quantidadeMaxima}
                  </p>
                ) : null}
              </div>

              <div className="sm:text-right">
                <p className="text-sm font-medium text-text-light">
                  Subtotal
                </p>

                <ProductPrice
                  value={subtotal}
                  size="xl"
                  color="default"
                  align="right"
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          <div className="mt-5 flex justify-end border-t border-border pt-4">
            <button
              type="button"
              onClick={() =>
                onRemover(idCarrinho)
              }
              className="rounded-xl px-4 py-2 font-bold text-danger transition hover:bg-[color-mix(in_srgb,var(--danger)_8%,white)]"
            >
              🗑 Remover produto
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
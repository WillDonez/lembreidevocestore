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
      className={`relative rounded-2xl border-2 p-3 transition ${
        selecionado
          ? "border-primary/30 bg-background shadow-sm"
          : "border-border bg-background opacity-75"
      }`}
    >
      <div className="flex min-w-0 gap-3">
        <div className="flex shrink-0 items-start gap-2">
          <input
            type="checkbox"
            checked={selecionado}
            onChange={() =>
              onAlternarSelecionado(idCarrinho)
            }
            aria-label={`Selecionar ${produto.nome}`}
            className="mt-8 h-4 w-4 cursor-pointer accent-[var(--primary)]"
          />

          {produto.imagem ? (
            <img
              src={produto.imagem}
              alt={produto.nome}
              className="h-20 w-20 rounded-xl border border-border object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-card text-3xl">
              🛍️
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h2 className="truncate text-base font-black text-text">
                {produto.nome}
              </h2>

              {produto.descricao && (
                <p className="mt-0.5 line-clamp-1 text-[11px] text-text-light">
                  {produto.descricao}
                </p>
              )}

              <div className="mt-1.5 flex flex-wrap gap-1.5">
                <ProductTypeBadge
                  tipoProduto={produto.tipo_produto}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                onRemover(idCarrinho)
              }
              className="shrink-0 rounded-lg px-2 py-1 text-[11px] font-bold text-danger transition hover:bg-[color-mix(in_srgb,var(--danger)_8%,white)]"
              aria-label={`Remover ${produto.nome}`}
            >
              🗑
              <span className="hidden 2xl:inline">
                {" "}Remover
              </span>
            </button>
          </div>

          <div className="mt-2.5 grid grid-cols-[1fr_auto] items-end gap-3 border-t border-border pt-2.5">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wide text-text-light">
                Preço
              </p>

              <ProductPrice
                value={Number(produto.preco)}
                className="mt-0.5"
              />
            </div>

            <div>
              <p className="mb-1 text-right text-[10px] font-medium uppercase tracking-wide text-text-light">
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
            </div>
          </div>

          <div className="mt-2 flex items-end justify-between border-t border-border pt-2">
            <div className="min-h-4">
              {!permiteMaisDeUmaUnidade ? (
                <p className="text-[10px] font-medium text-success">
                  ✓ Máx. 1 unidade
                </p>
              ) : atingiuQuantidadeMaxima ? (
                <p className="text-[10px] font-medium text-warning">
                  Máx.: {quantidadeMaxima}
                </p>
              ) : null}
            </div>

            <div className="text-right">
              <p className="text-[10px] font-medium uppercase tracking-wide text-text-light">
                Subtotal
              </p>

              <ProductPrice
                value={subtotal}
                size="lg"
                color="default"
                align="right"
                className="mt-0.5"
              />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

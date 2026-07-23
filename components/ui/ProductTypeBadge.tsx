type TipoProduto =
  | "fisico"
  | "pdf"
  | "digital"
  | "kit"
  | string
  | null
  | undefined;

type ProductTypeBadgeProps = {
  tipoProduto: TipoProduto;
};

export default function ProductTypeBadge({
  tipoProduto,
}: ProductTypeBadgeProps) {
  const tipoNormalizado = String(
    tipoProduto || ""
  ).toLowerCase();

  if (
    tipoNormalizado === "pdf" ||
    tipoNormalizado === "digital"
  ) {
    return (
      <span className="rounded-full bg-green-100 px-2.5 py-1 text-sm font-bold text-green-700">
        📄 Produto digital
      </span>
    );
  }

  if (tipoNormalizado === "kit") {
    return (
      <span className="rounded-full bg-purple-100 px-2.5 py-1 text-sm font-bold text-purple-700">
        🎁 Kit
      </span>
    );
  }

  return (
    <span className="rounded-full bg-blue-100 px-2.5 py-1 text-sm font-bold text-blue-700">
      🛍 Produto físico
    </span>
  );
}
import { formatarMoeda } from "@/lib/formatadores";

type ProductPriceProps = {
  preco: number;
  precoAnterior?: number;
  parcelas?: number;
  produtoDigital: boolean;
};

export default function ProductPrice({
  preco,
  precoAnterior = 0,
  parcelas,
  produtoDigital,
}: ProductPriceProps) {
  const possuiDesconto =
    precoAnterior > 0 &&
    preco > 0 &&
    precoAnterior > preco;

  return (
    <div className="mt-4">
      {possuiDesconto && (
        <p className="text-sm font-medium text-text-light line-through">
          {formatarMoeda(precoAnterior)}
        </p>
      )}

      <div className="flex flex-wrap items-end gap-x-2 gap-y-1">
        <p className="text-2xl font-black tracking-tight text-primary">
          {formatarMoeda(preco)}
        </p>

        {parcelas && !produtoDigital && (
          <span className="pb-0.5 text-[11px] font-medium text-text-light">
            em até {parcelas}x
          </span>
        )}
      </div>

      {!produtoDigital && (
        <p className="mt-1 text-[11px] font-medium text-text-light">
          Frete calculado no carrinho
        </p>
      )}
    </div>
  );
}
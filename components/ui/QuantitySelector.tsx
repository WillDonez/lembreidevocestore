type QuantitySelectorProps = {
  quantidade: number;
  nomeProduto: string;

  aoDiminuir: () => void;
  aoAumentar: () => void;

  desabilitarAumento?: boolean;
  quantidadeMaxima?: number;
};

export default function QuantitySelector({
  quantidade,
  nomeProduto,
  aoDiminuir,
  aoAumentar,
  desabilitarAumento = false,
  quantidadeMaxima,
}: QuantitySelectorProps) {
  const tituloBotaoAumentar = desabilitarAumento
    ? quantidadeMaxima
      ? `Quantidade máxima: ${quantidadeMaxima}`
      : "Quantidade máxima atingida"
    : `Aumentar quantidade de ${nomeProduto}`;

  return (
    <div className="flex w-fit items-center overflow-hidden rounded-xl border border-gray-300 bg-white">
      <button
        type="button"
        onClick={aoDiminuir}
        aria-label={`Diminuir quantidade de ${nomeProduto}`}
        className="h-10 w-10 text-lg font-bold text-gray-600 transition hover:bg-pink-50 hover:text-pink-500"
      >
        −
      </button>

      <span
        aria-label={`Quantidade atual: ${quantidade}`}
        className="flex h-10 min-w-11 items-center justify-center border-x border-gray-300 px-3 font-bold text-gray-800"
      >
        {quantidade}
      </span>

      <button
        type="button"
        onClick={aoAumentar}
        disabled={desabilitarAumento}
        aria-label={`Aumentar quantidade de ${nomeProduto}`}
        title={tituloBotaoAumentar}
        className="h-10 w-10 text-lg font-bold text-gray-600 transition hover:bg-pink-50 hover:text-pink-500 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-300 disabled:hover:bg-gray-100"
      >
        +
      </button>
    </div>
  );
}
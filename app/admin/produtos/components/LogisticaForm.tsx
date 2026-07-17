"use client";

export type DadosLogisticaForm = {
  peso: string;
  largura: string;
  altura: string;
  comprimento: string;
  valorDeclarado: string;
  estoqueFisico: string;
  embalagem: string;
  freteAtivo: boolean;
};

interface LogisticaFormProps {
  dados: DadosLogisticaForm;
  onChange: (dados: DadosLogisticaForm) => void;
}

export default function LogisticaForm({
  dados,
  onChange,
}: LogisticaFormProps) {
  function atualizarCampo(
    campo: keyof DadosLogisticaForm,
    valor: string | boolean
  ) {
    onChange({
      ...dados,
      [campo]: valor,
    });
  }

  return (
    <section className="rounded-3xl border border-pink-100 bg-pink-50 p-6">
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-wide text-pink-500">
          Envio e estoque
        </p>

        <h2 className="mt-1 text-2xl font-bold text-gray-800">
          📦 Logística do produto
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Informe o peso e as dimensões do produto já embalado.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block font-bold text-gray-700">
            Peso total (kg)
          </label>

          <input
            type="number"
            min="0"
            step="0.001"
            placeholder="Ex.: 0.500"
            value={dados.peso}
            onChange={(e) => atualizarCampo("peso", e.target.value)}
            className="w-full rounded-xl border bg-white p-4"
          />
        </div>

        <div>
          <label className="mb-2 block font-bold text-gray-700">
            Estoque físico
          </label>

          <input
            type="number"
            min="0"
            step="1"
            placeholder="Ex.: 10"
            value={dados.estoqueFisico}
            onChange={(e) =>
              atualizarCampo("estoqueFisico", e.target.value)
            }
            className="w-full rounded-xl border bg-white p-4"
          />
        </div>

        <div>
          <label className="mb-2 block font-bold text-gray-700">
            Largura (cm)
          </label>

          <input
            type="number"
            min="0"
            step="1"
            placeholder="Ex.: 12"
            value={dados.largura}
            onChange={(e) => atualizarCampo("largura", e.target.value)}
            className="w-full rounded-xl border bg-white p-4"
          />
        </div>

        <div>
          <label className="mb-2 block font-bold text-gray-700">
            Altura (cm)
          </label>

          <input
            type="number"
            min="0"
            step="1"
            placeholder="Ex.: 11"
            value={dados.altura}
            onChange={(e) => atualizarCampo("altura", e.target.value)}
            className="w-full rounded-xl border bg-white p-4"
          />
        </div>

        <div>
          <label className="mb-2 block font-bold text-gray-700">
            Comprimento (cm)
          </label>

          <input
            type="number"
            min="0"
            step="1"
            placeholder="Ex.: 12"
            value={dados.comprimento}
            onChange={(e) =>
              atualizarCampo("comprimento", e.target.value)
            }
            className="w-full rounded-xl border bg-white p-4"
          />
        </div>

        <div>
          <label className="mb-2 block font-bold text-gray-700">
            Valor declarado (R$)
          </label>

          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Ex.: 39.90"
            value={dados.valorDeclarado}
            onChange={(e) =>
              atualizarCampo("valorDeclarado", e.target.value)
            }
            className="w-full rounded-xl border bg-white p-4"
          />
        </div>
      </div>

      <div className="mt-5">
        <label className="mb-2 block font-bold text-gray-700">
          Embalagem
        </label>

        <input
          type="text"
          placeholder="Ex.: Caixa individual para caneca"
          value={dados.embalagem}
          onChange={(e) => atualizarCampo("embalagem", e.target.value)}
          className="w-full rounded-xl border bg-white p-4"
        />
      </div>

      <label className="mt-6 flex cursor-pointer items-center gap-3 rounded-2xl bg-white p-4 font-bold text-gray-700">
        <input
          type="checkbox"
          checked={dados.freteAtivo}
          onChange={(e) =>
            atualizarCampo("freteAtivo", e.target.checked)
          }
          className="h-5 w-5"
        />

        🚚 Permitir cálculo de frete para este produto
      </label>
    </section>
  );
}
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
    valor: string | boolean,
  ) {
    onChange({
      ...dados,
      [campo]: valor,
    });
  }

  const inputClass =
    "w-full rounded-xl border border-border bg-card p-4 text-text outline-none transition placeholder:text-text-light focus:border-primary focus:ring-2 focus:ring-[color-mix(in_srgb,var(--primary)_15%,transparent)]";

  return (
    <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-6">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-secondary">
          Envio e estoque
        </p>

        <h2 className="mt-1 text-2xl font-bold text-text">
          📦 Logística do produto
        </h2>

        <p className="mt-2 text-sm text-text-light">
          Informe o peso e as dimensões do produto já embalado.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block font-bold text-text">
            Peso total (kg)
          </label>

          <input
            type="number"
            min="0"
            step="0.001"
            placeholder="Ex.: 0.500"
            value={dados.peso}
            onChange={(e) =>
              atualizarCampo("peso", e.target.value)
            }
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-2 block font-bold text-text">
            Estoque físico
          </label>

          <input
            type="number"
            min="0"
            step="1"
            placeholder="Ex.: 10"
            value={dados.estoqueFisico}
            onChange={(e) =>
              atualizarCampo(
                "estoqueFisico",
                e.target.value,
              )
            }
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-2 block font-bold text-text">
            Largura (cm)
          </label>

          <input
            type="number"
            min="0"
            step="1"
            placeholder="Ex.: 12"
            value={dados.largura}
            onChange={(e) =>
              atualizarCampo(
                "largura",
                e.target.value,
              )
            }
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-2 block font-bold text-text">
            Altura (cm)
          </label>

          <input
            type="number"
            min="0"
            step="1"
            placeholder="Ex.: 11"
            value={dados.altura}
            onChange={(e) =>
              atualizarCampo(
                "altura",
                e.target.value,
              )
            }
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-2 block font-bold text-text">
            Comprimento (cm)
          </label>

          <input
            type="number"
            min="0"
            step="1"
            placeholder="Ex.: 12"
            value={dados.comprimento}
            onChange={(e) =>
              atualizarCampo(
                "comprimento",
                e.target.value,
              )
            }
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-2 block font-bold text-text">
            Valor declarado (R$)
          </label>

          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Ex.: 39.90"
            value={dados.valorDeclarado}
            onChange={(e) =>
              atualizarCampo(
                "valorDeclarado",
                e.target.value,
              )
            }
            className={inputClass}
          />
        </div>
      </div>

      <div className="mt-5">
        <label className="mb-2 block font-bold text-text">
          Embalagem
        </label>

        <input
          type="text"
          placeholder="Ex.: Caixa individual para caneca"
          value={dados.embalagem}
          onChange={(e) =>
            atualizarCampo(
              "embalagem",
              e.target.value,
            )
          }
          className={inputClass}
        />
      </div>

      <label className="mt-6 flex cursor-pointer items-center gap-3 rounded-2xl border border-border bg-background p-4 font-bold text-text transition hover:border-primary">
        <input
          type="checkbox"
          checked={dados.freteAtivo}
          onChange={(e) =>
            atualizarCampo(
              "freteAtivo",
              e.target.checked,
            )
          }
          className="h-5 w-5 accent-[var(--primary)]"
        />

        🚚 Permitir cálculo de frete para este produto
      </label>
    </section>
  );
}
type Props = {
  status: string;
};

export default function StatusBadge({
  status,
}: Props) {
  const statusNormalizado =
    status.toLowerCase();

  const estilos: Record<
    string,
    string
  > = {
    pendente:
      "bg-[color-mix(in_srgb,var(--warning)_12%,white)] text-warning",

    aprovado:
      "bg-[color-mix(in_srgb,var(--success)_12%,white)] text-success",

    producao:
      "bg-[color-mix(in_srgb,var(--warning)_12%,white)] text-warning",

    produção:
      "bg-[color-mix(in_srgb,var(--warning)_12%,white)] text-warning",

    enviado:
      "bg-[color-mix(in_srgb,var(--primary)_12%,white)] text-primary",

    finalizado:
      "bg-[color-mix(in_srgb,var(--secondary)_14%,white)] text-secondary",

    cancelado:
      "bg-[color-mix(in_srgb,var(--danger)_12%,white)] text-danger",
  };

  const icones: Record<
    string,
    string
  > = {
    pendente: "🟡",
    aprovado: "🟢",
    producao: "🟠",
    produção: "🟠",
    enviado: "🔵",
    finalizado: "🟣",
    cancelado: "🔴",
  };

  const estiloPadrao =
    "bg-background text-text-light";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 font-bold ${
        estilos[
          statusNormalizado
        ] || estiloPadrao
      }`}
    >
      {icones[
        statusNormalizado
      ] || "⚪"}

      {status}
    </span>
  );
}
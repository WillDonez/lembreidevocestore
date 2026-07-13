type Props = {
  status: string;
};

export default function StatusBadge({ status }: Props) {
  const statusNormalizado = status.toLowerCase();

  const estilos: Record<string, string> = {
    pendente: "bg-yellow-100 text-yellow-700",
    aprovado: "bg-green-100 text-green-700",
    producao: "bg-orange-100 text-orange-700",
    produção: "bg-orange-100 text-orange-700",
    enviado: "bg-blue-100 text-blue-700",
    finalizado: "bg-purple-100 text-purple-700",
    cancelado: "bg-red-100 text-red-700",
  };

  const icones: Record<string, string> = {
    pendente: "🟡",
    aprovado: "🟢",
    producao: "🟠",
    produção: "🟠",
    enviado: "🔵",
    finalizado: "🟣",
    cancelado: "🔴",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold ${
        estilos[statusNormalizado] ||
        "bg-gray-100 text-gray-700"
      }`}
    >
      {icones[statusNormalizado] || "⚪"}

      {status}
    </span>
  );
}
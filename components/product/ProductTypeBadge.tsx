import {
  BadgeCheck,
  Zap,
} from "lucide-react";

type ProductTypeBadgeProps = {
  produtoDigital: boolean;
};

export default function ProductTypeBadge({
  produtoDigital,
}: ProductTypeBadgeProps) {
  if (produtoDigital) {
    return (
      <div className="mt-3 flex items-start gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2.5 text-emerald-700">
        <Zap className="mt-0.5 h-3.5 w-3.5 shrink-0" />

        <p className="text-[11px] font-bold leading-snug">
          Liberado após a confirmação do pagamento
        </p>
      </div>
    );
  }

  return (
    <div className="mt-3 flex items-start gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2.5 text-blue-700">
      <BadgeCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />

      <p className="text-[11px] font-bold leading-snug">
        Produto físico enviado com rastreamento
      </p>
    </div>
  );
}
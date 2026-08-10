import {
  Download,
  Star,
} from "lucide-react";

type ProductBadgesProps = {
  destaque?: boolean;
  produtoDigital?: boolean;
  possuiDesconto?: boolean;
  percentualDesconto?: number;
};

export default function ProductBadges({
  destaque = false,
  produtoDigital = false,
  possuiDesconto = false,
  percentualDesconto = 0,
}: ProductBadgesProps) {
  return (
    <>
      <div className="absolute left-3 top-3 z-20 flex flex-col items-start gap-2">
        {destaque && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-400 px-2.5 py-1 text-[11px] font-black text-yellow-900 shadow-md">
            <Star className="h-3.5 w-3.5 fill-current" />
            Destaque
          </span>
        )}

        {possuiDesconto && (
          <span className="rounded-full bg-red-500 px-2.5 py-1 text-[11px] font-black text-white shadow-md">
            -{percentualDesconto}%
          </span>
        )}
      </div>

      {produtoDigital && (
        <div className="absolute right-3 top-3 z-20">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-2.5 py-1 text-[11px] font-black text-white shadow-md">
            <Download className="h-3.5 w-3.5" />
            Digital
          </span>
        </div>
      )}
    </>
  );
}
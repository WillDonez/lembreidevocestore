import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";

type SectionHeaderProps = {
  titulo: string;
  descricao?: string;
  etiqueta?: string;
  icone?: LucideIcon;
  linkTexto?: string;
  linkHref?: string;
  alinhamento?: "esquerda" | "centro";
};

export default function SectionHeader({
  titulo,
  descricao,
  etiqueta,
  icone: Icone,
  linkTexto = "Ver todos",
  linkHref,
  alinhamento = "esquerda",
}: SectionHeaderProps) {
  const centralizado = alinhamento === "centro";

  return (
    <header
      className={`mb-8 flex flex-col gap-5 ${
        centralizado
          ? "items-center text-center"
          : "sm:flex-row sm:items-end sm:justify-between"
      }`}
    >
      <div className={centralizado ? "max-w-2xl" : "max-w-2xl"}>
        {etiqueta && (
          <span className="mb-3 inline-flex rounded-full bg-pink-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-pink-600">
            {etiqueta}
          </span>
        )}

        <div
          className={`flex gap-3 ${
            centralizado
              ? "justify-center"
              : "items-center"
          }`}
        >
          {Icone && (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-pink-100 text-pink-600">
              <Icone className="h-6 w-6" strokeWidth={1.8} />
            </div>
          )}

          <h2 className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
            {titulo}
          </h2>
        </div>

        {descricao && (
          <p className="mt-3 text-base leading-relaxed text-gray-500 sm:text-lg">
            {descricao}
          </p>
        )}
      </div>

      {linkHref && (
        <Link
          href={linkHref}
          className="group inline-flex shrink-0 items-center gap-2 font-bold text-pink-600 transition hover:text-pink-700"
        >
          {linkTexto}

          <ArrowRight
            className="h-5 w-5 transition-transform group-hover:translate-x-1"
            strokeWidth={2}
          />
        </Link>
      )}
    </header>
  );
}
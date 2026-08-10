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
  const centralizado =
    alinhamento === "centro";

  return (
    <header
      className={`mb-8 flex flex-col gap-5 ${
        centralizado
          ? "items-center text-center"
          : "sm:flex-row sm:items-end sm:justify-between"
      }`}
    >
      <div className="max-w-2xl">
        {etiqueta && (
          <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-secondary">
            {etiqueta}
          </p>
        )}

        <div
          className={`flex gap-3 ${
            centralizado
              ? "justify-center"
              : "items-center"
          }`}
        >
          {Icone && (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[color-mix(in_srgb,var(--primary)_10%,white)] text-primary">
              <Icone
                className="h-6 w-6"
                strokeWidth={1.8}
              />
            </div>
          )}

          <h2 className="text-2xl font-black tracking-tight text-text sm:text-3xl">
            {titulo}
          </h2>
        </div>

        {descricao && (
          <p className="mt-3 text-base leading-relaxed text-text-light sm:text-lg">
            {descricao}
          </p>
        )}
      </div>

      {linkHref && (
        <Link
          href={linkHref}
          className="group inline-flex shrink-0 items-center gap-2 font-bold text-primary transition hover:text-primary-light"
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
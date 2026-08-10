"use client";

import {
  ImageIcon,
  Play,
  Rotate3D,
  Sparkles,
} from "lucide-react";

import type {
  MidiaProduto,
} from "@/components/product/media/MediaTypes";

type MediaThumbnailProps = {
  midia: MidiaProduto;
  selecionada: boolean;
  indice: number;
  nomeProduto: string;
  onSelecionar: () => void;
};

export default function MediaThumbnail({
  midia,
  selecionada,
  indice,
  nomeProduto,
  onSelecionar,
}: MediaThumbnailProps) {
  const imagemMiniatura =
    midia.miniatura ||
    (midia.tipo === "imagem" ? midia.url : "");

  const ehVideo = midia.tipo === "video";
  const ehMidia360 = midia.tipo === "360";

  return (
    <button
      type="button"
      onClick={onSelecionar}
      aria-label={`Selecionar mídia ${indice + 1} de ${nomeProduto}`}
      aria-pressed={selecionada}
      className={`group relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-2 bg-card p-1 transition duration-300 ${
        selecionada
          ? "border-primary shadow-lg shadow-[color-mix(in_srgb,var(--primary)_15%,transparent)]"
          : "border-border hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
      }`}
    >
      {imagemMiniatura ? (
        <img
          src={imagemMiniatura}
          alt={`${nomeProduto} - mídia ${indice + 1}`}
          className="h-full w-full rounded-xl object-cover"
        />
      ) : (
        <div
          className={`flex h-full w-full items-center justify-center rounded-xl ${
            ehVideo
              ? "bg-gradient-to-br from-gray-950 via-gray-900 to-[color-mix(in_srgb,var(--primary)_35%,black)] text-white"
              : ehMidia360
                ? "bg-gradient-to-br from-gray-900 to-gray-700 text-white"
                : "bg-background text-text-light"
          }`}
        >
          {ehVideo ? (
            <Play className="h-7 w-7 fill-current" />
          ) : ehMidia360 ? (
            <Rotate3D className="h-7 w-7" />
          ) : (
            <ImageIcon className="h-7 w-7" />
          )}
        </div>
      )}

      {ehVideo && (
        <>
          <div className="absolute inset-1 flex items-center justify-center rounded-xl bg-gradient-to-t from-black/80 via-black/25 to-black/10">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-primary shadow-lg transition duration-300 group-hover:scale-110">
              <Play className="ml-0.5 h-4.5 w-4.5 fill-current" />
            </div>
          </div>

          <div className="absolute inset-x-2 bottom-2 flex items-center justify-center gap-1 rounded-full bg-primary/95 px-2 py-1 text-[9px] font-black uppercase tracking-wide text-white shadow-md backdrop-blur">
            <Sparkles className="h-3 w-3" />
            Veja demonstração
          </div>
        </>
      )}

      {ehMidia360 && (
        <>
          <div className="absolute inset-1 flex items-center justify-center rounded-xl bg-black/25">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-900 shadow-lg transition duration-300 group-hover:rotate-12 group-hover:scale-110">
              <Rotate3D className="h-5 w-5" />
            </div>
          </div>

          <div className="absolute inset-x-2 bottom-2 rounded-full bg-gray-950/80 px-2 py-1 text-[9px] font-black uppercase tracking-wide text-white backdrop-blur">
            Visualização 360°
          </div>
        </>
      )}

      {selecionada && (
        <span className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-primary ring-offset-1" />
      )}
    </button>
  );
}
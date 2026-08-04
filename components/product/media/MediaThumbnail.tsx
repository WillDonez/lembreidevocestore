"use client";

import {
  ImageIcon,
  Play,
  Rotate3D,
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

  return (
    <button
      type="button"
      onClick={onSelecionar}
      aria-label={`Selecionar mídia ${indice + 1} de ${nomeProduto}`}
      aria-pressed={selecionada}
      className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 bg-white p-1 transition ${
        selecionada
          ? "border-pink-500 shadow-md shadow-pink-100"
          : "border-gray-100 hover:border-pink-200"
      }`}
    >
      {imagemMiniatura ? (
        <img
          src={imagemMiniatura}
          alt=""
          className="h-full w-full rounded-xl object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-xl bg-gray-100 text-gray-500">
          {midia.tipo === "video" ? (
            <Play className="h-7 w-7 fill-current" />
          ) : midia.tipo === "360" ? (
            <Rotate3D className="h-7 w-7" />
          ) : (
            <ImageIcon className="h-7 w-7" />
          )}
        </div>
      )}

      {midia.tipo === "video" && (
        <div className="absolute inset-1 flex items-center justify-center rounded-xl bg-black/35">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-pink-500 shadow">
            <Play className="ml-0.5 h-4 w-4 fill-current" />
          </div>
        </div>
      )}

      {midia.tipo === "360" && (
        <div className="absolute inset-x-2 bottom-2 rounded-full bg-gray-950/75 px-2 py-1 text-[9px] font-black uppercase tracking-wide text-white">
          360°
        </div>
      )}
    </button>
  );
}
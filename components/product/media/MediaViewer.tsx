"use client";

import { ImageIcon } from "lucide-react";

import type {
  MidiaProduto,
} from "@/components/product/media/MediaTypes";

type MediaViewerProps = {
  midia: MidiaProduto | null;
  nomeProduto: string;
};

export default function MediaViewer({
  midia,
  nomeProduto,
}: MediaViewerProps) {
  if (!midia) {
    return (
      <div className="flex aspect-square w-full flex-col items-center justify-center rounded-[1.5rem] bg-gray-50 px-6 text-center text-gray-400">
        <ImageIcon className="h-12 w-12" />

        <p className="mt-4 font-bold">
          Mídia não disponível
        </p>
      </div>
    );
  }

  if (midia.tipo === "video") {
    return (
      <div className="relative aspect-square overflow-hidden rounded-[1.5rem] bg-black">
        <video
          src={midia.url}
          poster={midia.miniatura}
          controls
          playsInline
          preload="metadata"
          className="h-full w-full object-contain"
        >
          Seu navegador não oferece suporte à reprodução de vídeos.
        </video>
      </div>
    );
  }

  if (midia.tipo === "360") {
    return (
      <div className="flex aspect-square w-full flex-col items-center justify-center rounded-[1.5rem] bg-gray-950 px-6 text-center text-white">
        <p className="text-lg font-black">
          Visualização 360°
        </p>

        <p className="mt-2 max-w-sm text-sm leading-6 text-white/70">
          O visualizador interativo será conectado nesta área em uma próxima etapa.
        </p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-[1.5rem] bg-gray-50">
      <img
        src={midia.url}
        alt={
          midia.alt ||
          `${nomeProduto} - imagem do produto`
        }
        className="aspect-square w-full object-contain"
      />
    </div>
  );
}
"use client";

import { ImageIcon } from "lucide-react";

import ImageZoomViewer from "@/components/product/media/ImageZoomViewer";
import WatermarkOverlay from "@/components/product/media/WatermarkOverlay";

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
          key={midia.url}
          src={midia.url}
          poster={midia.miniatura}
          autoPlay
          muted
          controls
          playsInline
          preload="metadata"
          className="relative z-0 h-full w-full object-contain"
        >
          Seu navegador não oferece suporte à reprodução de vídeos.
        </video>

        <WatermarkOverlay
          texto="Lembrei de Você Store"
          opacidade={0.1}
        />
      </div>
    );
  }

  if (midia.tipo === "360") {
    return (
      <div className="relative flex aspect-square w-full flex-col items-center justify-center overflow-hidden rounded-[1.5rem] bg-gray-950 px-6 text-center text-white">
        <p className="text-lg font-black">
          Visualização 360°
        </p>

        <p className="mt-2 max-w-sm text-sm leading-6 text-white/70">
          O visualizador interativo será conectado nesta área em uma próxima etapa.
        </p>

        <WatermarkOverlay
          texto="Lembrei de Você Store"
          opacidade={0.08}
        />
      </div>
    );
  }

  return (
    <ImageZoomViewer
      src={midia.url}
      alt={
        midia.alt ||
        `${nomeProduto} - imagem do produto`
      }
    />
  );
}
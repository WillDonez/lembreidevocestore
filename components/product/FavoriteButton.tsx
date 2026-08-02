"use client";

import { Heart } from "lucide-react";

type FavoriteButtonProps = {
  nomeProduto: string;
};

export default function FavoriteButton({
  nomeProduto,
}: FavoriteButtonProps) {
  return (
    <button
      type="button"
      aria-label={`Adicionar ${nomeProduto} aos favoritos`}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/80 bg-white/90 text-gray-500 shadow-md backdrop-blur transition hover:scale-105 hover:text-pink-500"
    >
      <Heart
        className="h-[18px] w-[18px]"
        strokeWidth={1.8}
      />
    </button>
  );
}
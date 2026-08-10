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
      className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card/90 text-text-light shadow-md backdrop-blur transition hover:scale-105 hover:text-primary"
    >
      <Heart className="h-4 w-4" />
    </button>
  );
}
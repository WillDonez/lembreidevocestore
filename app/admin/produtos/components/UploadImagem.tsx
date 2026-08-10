"use client";

import { useRef } from "react";

interface Props {
  imagem: File | null;
  onSelecionar: (arquivo: File | null) => void;
}

export default function UploadImagem({
  imagem,
  onSelecionar,
}: Props) {
  const inputRef =
    useRef<HTMLInputElement | null>(null);

  function abrirSeletor() {
    inputRef.current?.click();
  }

  function selecionarArquivo(
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const arquivo =
      e.target.files?.[0];

    if (arquivo) {
      onSelecionar(arquivo);
    }
  }

  return (
    <div>
      <label className="mb-3 block font-bold text-text">
        Imagem do Produto
      </label>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={selecionarArquivo}
      />

      <div
        onClick={abrirSeletor}
        className="cursor-pointer rounded-3xl border-2 border-dashed border-border bg-background p-12 text-center transition hover:border-primary hover:bg-[color-mix(in_srgb,var(--primary)_6%,white)]"
      >
        {!imagem ? (
          <>
            <div className="mb-4 text-6xl">
              📷
            </div>

            <h3 className="text-xl font-bold text-primary">
              Clique para selecionar uma imagem
            </h3>

            <p className="mt-3 text-text-light">
              PNG, JPG ou WEBP
            </p>
          </>
        ) : (
          <>
            <img
              src={URL.createObjectURL(imagem)}
              alt="Prévia da imagem do produto"
              className="mx-auto w-56 rounded-2xl border border-border shadow-lg"
            />

            <p className="mt-5 font-bold text-text">
              {imagem.name}
            </p>

            <p className="mt-3 font-bold text-primary">
              Clique para alterar
            </p>
          </>
        )}
      </div>
    </div>
  );
}
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

  const inputRef = useRef<HTMLInputElement>(null);

  function abrirSeletor() {
    inputRef.current?.click();
  }

  function selecionarArquivo(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const arquivo = e.target.files?.[0];

    if (arquivo) {
      onSelecionar(arquivo);
    }
  }

  return (
    <div>

      <label className="font-bold text-gray-700 block mb-3">
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
        className="cursor-pointer border-2 border-dashed border-pink-300 rounded-3xl bg-pink-50 hover:bg-pink-100 transition p-12 text-center"
      >
        {!imagem ? (
          <>
            <div className="text-6xl mb-4">
                📷
            </div>

            <h3 className="font-bold text-xl text-pink-600">
              Clique para selecionar uma imagem
            </h3>

            <p className="text-gray-500 mt-3">
              PNG, JPG ou WEBP
            </p>
          </>
        ) : (
          <>
            <img
              src={URL.createObjectURL(imagem)}
              alt=""
              className="mx-auto w-56 rounded-2xl shadow-lg"
            />

            <p className="mt-5 font-bold">
              {imagem.name}
            </p>

            <p className="text-pink-500 mt-3">
              Clique para alterar
            </p>
          </>
        )}
      </div>

    </div>
  );
}
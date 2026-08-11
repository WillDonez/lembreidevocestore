"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  CONFIGURACOES_IMAGENS,
  legendaImagem,
} from "@/lib/config/imagens";

interface Props {
  imagem: File | null;
  onSelecionar: (
    arquivo: File | null,
  ) => void;
}

export default function UploadImagem({
  imagem,
  onSelecionar,
}: Props) {
  const inputRef =
    useRef<HTMLInputElement | null>(
      null,
    );

  const [
    imagemPreview,
    setImagemPreview,
  ] = useState("");

  useEffect(() => {
    if (!imagem) {
      setImagemPreview("");

      return;
    }

    const urlTemporaria =
      URL.createObjectURL(
        imagem,
      );

    setImagemPreview(
      urlTemporaria,
    );

    return () => {
      URL.revokeObjectURL(
        urlTemporaria,
      );
    };
  }, [imagem]);

  function abrirSeletor() {
    inputRef.current?.click();
  }

  function selecionarArquivo(
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const arquivo =
      e.target.files?.[0];

    if (arquivo) {
      onSelecionar(
        arquivo,
      );
    }

    e.target.value = "";
  }

  return (
    <div>
      <label className="mb-2 block font-bold text-text">
        Imagem do Produto
      </label>

      <p className="mb-4 text-sm leading-relaxed text-text-light">
        {legendaImagem(
          CONFIGURACOES_IMAGENS.produto,
        )}
      </p>

      <input
        ref={inputRef}
        type="file"
        accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
        hidden
        onChange={
          selecionarArquivo
        }
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

            <p className="mt-3 text-sm font-medium text-text-light">
              Recomendado:{" "}
              {
                CONFIGURACOES_IMAGENS
                  .produto.largura
              }{" "}
              ×{" "}
              {
                CONFIGURACOES_IMAGENS
                  .produto.altura
              }{" "}
              px
            </p>

            <p className="mt-1 text-sm text-text-light">
              Proporção{" "}
              {
                CONFIGURACOES_IMAGENS
                  .produto
                  .proporcao
              }{" "}
              •{" "}
              {
                CONFIGURACOES_IMAGENS
                  .produto
                  .formatos
              }
            </p>
          </>
        ) : (
          <>
            {imagemPreview && (
              <img
                src={
                  imagemPreview
                }
                alt="Prévia da imagem do produto"
                className="mx-auto aspect-square w-56 rounded-2xl border border-border object-cover shadow-lg"
              />
            )}

            <p className="mt-5 break-all font-bold text-text">
              {imagem.name}
            </p>

            <p className="mt-2 text-sm text-text-light">
              Recomendado:{" "}
              {
                CONFIGURACOES_IMAGENS
                  .produto.largura
              }{" "}
              ×{" "}
              {
                CONFIGURACOES_IMAGENS
                  .produto.altura
              }{" "}
              px • Proporção{" "}
              {
                CONFIGURACOES_IMAGENS
                  .produto
                  .proporcao
              }
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
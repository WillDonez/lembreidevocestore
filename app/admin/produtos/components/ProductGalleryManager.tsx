"use client";

import {
  ChangeEvent,
  useMemo,
  useRef,
} from "react";

import {
  GripVertical,
  ImagePlus,
  Images,
  Trash2,
} from "lucide-react";

import type { ImagemGaleria } from "../hooks/useProdutoForm";

type ProductGalleryManagerProps = {
  imagens: ImagemGaleria[];
  onChange: (imagens: ImagemGaleria[]) => void;
  limite?: number;
};

export default function ProductGalleryManager({
  imagens,
  onChange,
  limite = 10,
}: ProductGalleryManagerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const quantidadeDisponivel =
    limite - imagens.length;

  const atingiuLimite =
    quantidadeDisponivel <= 0;

  const imagensOrdenadas = useMemo(
    () =>
      [...imagens].sort(
        (a, b) => a.ordem - b.ordem,
      ),
    [imagens],
  );

  function abrirSeletorDeArquivos() {
    if (atingiuLimite) {
      return;
    }

    inputRef.current?.click();
  }

  function selecionarImagens(
    evento: ChangeEvent<HTMLInputElement>,
  ) {
    const arquivosSelecionados = Array.from(
      evento.target.files ?? [],
    );

    if (arquivosSelecionados.length === 0) {
      return;
    }

    const arquivosValidos =
      arquivosSelecionados.filter((arquivo) =>
        arquivo.type.startsWith("image/"),
      );

    const arquivosDentroDoLimite =
      arquivosValidos.slice(
        0,
        quantidadeDisponivel,
      );

    const novasImagens: ImagemGaleria[] =
      arquivosDentroDoLimite.map(
        (arquivo, indice) => ({
          id: `${arquivo.name}-${arquivo.lastModified}-${crypto.randomUUID()}`,
          url: URL.createObjectURL(arquivo),
          ordem: imagens.length + indice + 1,
          arquivo,
          temporaria: true,
        }),
      );

    onChange([
      ...imagens,
      ...novasImagens,
    ]);

    evento.target.value = "";
  }

  function excluirImagem(id: string) {
    const imagemExcluida = imagens.find(
      (imagem) => imagem.id === id,
    );

    if (
      imagemExcluida?.temporaria &&
      imagemExcluida.url.startsWith("blob:")
    ) {
      URL.revokeObjectURL(
        imagemExcluida.url,
      );
    }

    const imagensAtualizadas = imagens
      .filter((imagem) => imagem.id !== id)
      .map((imagem, indice) => ({
        ...imagem,
        ordem: indice + 1,
      }));

    onChange(imagensAtualizadas);
  }

  return (
    <section className="rounded-3xl border border-pink-100 bg-white p-6 shadow-xl sm:p-8">
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        multiple
        onChange={selecionarImagens}
        className="hidden"
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100 text-pink-600">
              <Images className="h-6 w-6" />
            </div>

            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-pink-500">
                Galeria do produto
              </p>

              <h3 className="mt-1 text-2xl font-black text-gray-800">
                Imagens adicionais
              </h3>
            </div>
          </div>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-500">
            Adicione outros ângulos, detalhes, aplicações,
            páginas internas ou variações do produto.
          </p>
        </div>

        <div className="rounded-2xl bg-pink-50 px-4 py-3 text-sm font-bold text-pink-600">
          {imagens.length} de {limite} imagens
        </div>
      </div>

      {imagens.length === 0 ? (
        <div className="mt-8 rounded-3xl border-2 border-dashed border-pink-200 bg-pink-50/50 px-6 py-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-pink-500 shadow-sm">
            <ImagePlus className="h-8 w-8" />
          </div>

          <h4 className="mt-5 text-lg font-black text-gray-800">
            Nenhuma imagem adicional cadastrada
          </h4>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
            A imagem principal continuará sendo exibida normalmente.
            Você poderá adicionar até {limite} imagens extras nesta
            galeria.
          </p>

          <button
            type="button"
            onClick={abrirSeletorDeArquivos}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-pink-500 px-6 py-3 text-sm font-black text-white shadow-md shadow-pink-200/60 transition hover:-translate-y-0.5 hover:bg-pink-600"
          >
            <ImagePlus className="h-5 w-5" />
            Adicionar imagens
          </button>
        </div>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {imagensOrdenadas.map((imagem) => (
              <article
                key={imagem.id}
                className="group overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-sm"
              >
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                  <img
                    src={imagem.url}
                    alt={`Imagem adicional ${imagem.ordem}`}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />

                  <button
                    type="button"
                    aria-label="Reordenar imagem"
                    title="A ordenação por arrastar será adicionada futuramente"
                    className="absolute left-2 top-2 flex h-9 w-9 cursor-grab items-center justify-center rounded-xl bg-white/90 text-gray-500 shadow-md backdrop-blur"
                  >
                    <GripVertical className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      excluirImagem(imagem.id)
                    }
                    aria-label="Excluir imagem"
                    className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-xl bg-white/90 text-red-500 shadow-md backdrop-blur transition hover:bg-red-500 hover:text-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between px-3 py-3">
                  <span className="text-xs font-bold text-gray-500">
                    Posição {imagem.ordem}
                  </span>

                  <span className="rounded-full bg-pink-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-pink-500">
                    Preview
                  </span>
                </div>
              </article>
            ))}

            {!atingiuLimite && (
              <button
                type="button"
                onClick={abrirSeletorDeArquivos}
                className="flex aspect-square flex-col items-center justify-center rounded-2xl border-2 border-dashed border-pink-200 bg-pink-50/40 px-4 text-center transition hover:border-pink-400 hover:bg-pink-50"
              >
                <ImagePlus className="h-8 w-8 text-pink-500" />

                <span className="mt-3 text-sm font-black text-gray-800">
                  Adicionar imagem
                </span>

                <span className="mt-1 text-xs text-gray-500">
                  Restam {quantidadeDisponivel}
                </span>
              </button>
            )}
          </div>

          {atingiuLimite && (
            <p className="mt-5 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700">
              Limite de {limite} imagens atingido.
            </p>
          )}
        </>
      )}

      <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-4">
        <p className="text-sm font-bold text-blue-800">
          Pré-visualização local
        </p>

        <p className="mt-1 text-sm leading-6 text-blue-700">
          As imagens selecionadas aparecem imediatamente,
          mas ainda não são enviadas ao Supabase. Na próxima
          etapa, conectaremos o upload ao Storage e à tabela{" "}
          <strong>produto_imagens</strong>.
        </p>
      </div>
    </section>
  );
}
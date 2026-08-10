"use client";

import { useEffect, useState } from "react";

import { formatarMoeda } from "@/lib/formatadores";
import { obterFormato } from "@/lib/config/produtos";
import { DadosLogisticaForm } from "./LogisticaForm";

interface ProdutoPreviewProps {
  nome: string;
  preco: string;
  categoria: string;
  tipoProduto: string;
  formatoArquivo: string;
  imagem: File | null;
  destaque: boolean;
  logistica: DadosLogisticaForm;
}

export default function ProdutoPreview({
  nome,
  preco,
  categoria,
  tipoProduto,
  formatoArquivo,
  imagem,
  destaque,
  logistica,
}: ProdutoPreviewProps) {
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
      URL.createObjectURL(imagem);

    setImagemPreview(
      urlTemporaria,
    );

    return () => {
      URL.revokeObjectURL(
        urlTemporaria,
      );
    };
  }, [imagem]);

  const produtoFisico =
    tipoProduto === "fisico";

  const precoNumero =
    Number(preco || 0);

  function nomeTipoProduto() {
    if (produtoFisico) {
      return "🛍 Produto físico";
    }

    const configuracaoFormato =
      obterFormato(
        formatoArquivo,
      );

    if (
      configuracaoFormato
    ) {
      return `${configuracaoFormato.icone} ${configuracaoFormato.label}`;
    }

    return "💻 Produto digital";
  }

  return (
    <aside className="xl:sticky xl:top-8 xl:self-start">
      <div className="mb-4">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-secondary">
          Pré-visualização
        </p>

        <h2 className="mt-1 text-2xl font-bold text-text">
          Como aparecerá na loja
        </h2>
      </div>

      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow">
        <div className="relative flex aspect-square items-center justify-center bg-background">
          {imagemPreview ? (
            <img
              src={imagemPreview}
              alt={
                nome ||
                "Prévia do produto"
              }
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="text-center text-text-light">
              <p className="text-6xl">
                🖼️
              </p>

              <p className="mt-3 font-bold">
                Selecione uma imagem
              </p>
            </div>
          )}

          {destaque && (
            <span className="absolute left-4 top-4 rounded-full bg-secondary px-4 py-2 text-sm font-bold text-white shadow">
              ⭐ Destaque
            </span>
          )}
        </div>

        <div className="p-5">
          <p className="text-sm font-bold text-primary">
            {categoria ||
              "Sem categoria"}
          </p>

          <h3 className="mt-2 min-h-14 text-2xl font-bold text-text">
            {nome.trim() ||
              "Nome do produto"}
          </h3>

          <p className="mt-3 text-3xl font-bold text-primary">
            {formatarMoeda(
              Number.isFinite(
                precoNumero,
              )
                ? precoNumero
                : 0,
            )}
          </p>

          <div className="mt-4">
            <span
              className={`inline-block rounded-full px-3 py-2 text-sm font-bold ${
                produtoFisico
                  ? "bg-[color-mix(in_srgb,var(--primary)_10%,white)] text-primary"
                  : "bg-[color-mix(in_srgb,var(--success)_10%,white)] text-success"
              }`}
            >
              {nomeTipoProduto()}
            </span>
          </div>

          {produtoFisico ? (
            <div className="mt-5 space-y-2 rounded-2xl border border-border bg-background p-4 text-sm text-text-light">
              <p>
                Estoque:{" "}
                <strong className="text-text">
                  {logistica.estoqueFisico ||
                    "0"}{" "}
                  unidade(s)
                </strong>
              </p>

              <p>
                Frete:{" "}
                <strong
                  className={
                    logistica.freteAtivo
                      ? "text-success"
                      : "text-danger"
                  }
                >
                  {logistica.freteAtivo
                    ? "Ativo"
                    : "Inativo"}
                </strong>
              </p>

              {logistica.peso && (
                <p>
                  Peso embalado:{" "}
                  <strong className="text-text">
                    {logistica.peso} kg
                  </strong>
                </p>
              )}
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-success/30 bg-[color-mix(in_srgb,var(--success)_8%,white)] p-4 text-sm text-success">
              <p>
                Entrega:{" "}
                <strong>
                  Download após a confirmação do pagamento
                </strong>
              </p>

              <p className="mt-2">
                Formato:{" "}
                <strong>
                  {obterFormato(
                    formatoArquivo,
                  )?.label ||
                    "Digital"}
                </strong>
              </p>
            </div>
          )}

          <button
            type="button"
            disabled
            className="mt-5 w-full cursor-not-allowed rounded-2xl bg-accent px-5 py-4 font-bold text-white opacity-80"
          >
            Adicionar ao carrinho
          </button>
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-text-light">
        Esta visualização é apenas uma simulação do produto.
      </p>
    </aside>
  );
}
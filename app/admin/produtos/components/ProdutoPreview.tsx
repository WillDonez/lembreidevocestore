"use client";

import { useEffect, useState } from "react";
import { formatarMoeda } from "@/lib/formatadores";
import { DadosLogisticaForm } from "./LogisticaForm";

interface ProdutoPreviewProps {
  nome: string;
  preco: string;
  categoria: string;
  tipoProduto: string;
  imagem: File | null;
  destaque: boolean;
  logistica: DadosLogisticaForm;
}

export default function ProdutoPreview({
  nome,
  preco,
  categoria,
  tipoProduto,
  imagem,
  destaque,
  logistica,
}: ProdutoPreviewProps) {
  const [imagemPreview, setImagemPreview] = useState("");

  useEffect(() => {
    if (!imagem) {
      setImagemPreview("");
      return;
    }

    const urlTemporaria = URL.createObjectURL(imagem);
    setImagemPreview(urlTemporaria);

    return () => {
      URL.revokeObjectURL(urlTemporaria);
    };
  }, [imagem]);

  const produtoFisico = tipoProduto === "fisico";
  const precoNumero = Number(preco || 0);

  function nomeTipoProduto() {
    if (tipoProduto === "pdf") {
      return "📄 Arquivo PDF";
    }

    if (tipoProduto === "kit") {
      return "📦 Kit digital";
    }

    return "🛍 Produto físico";
  }

  return (
    <aside className="sticky top-28 rounded-3xl bg-white p-6 shadow-xl">
      <div className="mb-5">
        <p className="text-sm font-bold uppercase tracking-wide text-pink-500">
          Pré-visualização
        </p>

        <h2 className="mt-1 text-2xl font-bold text-gray-800">
          Como aparecerá na loja
        </h2>
      </div>

      <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow">
        <div className="relative flex aspect-square items-center justify-center bg-pink-50">
          {imagemPreview ? (
            <img
              src={imagemPreview}
              alt={nome || "Prévia do produto"}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="text-center text-gray-400">
              <p className="text-6xl">🖼️</p>

              <p className="mt-3 font-bold">
                Selecione uma imagem
              </p>
            </div>
          )}

          {destaque && (
            <span className="absolute left-4 top-4 rounded-full bg-yellow-400 px-4 py-2 text-sm font-bold text-yellow-900 shadow">
              ⭐ Destaque
            </span>
          )}
        </div>

        <div className="p-5">
          <p className="text-sm font-bold text-pink-500">
            {categoria || "Sem categoria"}
          </p>

          <h3 className="mt-2 min-h-14 text-2xl font-bold text-gray-800">
            {nome.trim() || "Nome do produto"}
          </h3>

          <p className="mt-3 text-3xl font-bold text-pink-500">
            {formatarMoeda(
              Number.isFinite(precoNumero) ? precoNumero : 0
            )}
          </p>

          <div className="mt-4">
            <span
              className={`inline-block rounded-full px-3 py-2 text-sm font-bold ${
                produtoFisico
                  ? "bg-blue-100 text-blue-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {nomeTipoProduto()}
            </span>
          </div>

          {produtoFisico && (
            <div className="mt-5 space-y-2 rounded-2xl bg-gray-50 p-4 text-sm text-gray-600">
              <p>
                Estoque:{" "}
                <strong>
                  {logistica.estoqueFisico || "0"} unidade(s)
                </strong>
              </p>

              <p>
                Frete:{" "}
                <strong
                  className={
                    logistica.freteAtivo
                      ? "text-green-600"
                      : "text-red-500"
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
                  <strong>{logistica.peso} kg</strong>
                </p>
              )}
            </div>
          )}

          <button
            type="button"
            disabled
            className="mt-5 w-full cursor-not-allowed rounded-2xl bg-pink-500 px-5 py-4 font-bold text-white opacity-80"
          >
            Adicionar ao carrinho
          </button>
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-gray-400">
        Esta visualização é apenas uma simulação do produto.
      </p>
    </aside>
  );
}
"use client";

import { useState } from "react";

import StatusBadge from "@/components/StatusBadge";
import { formatarMoeda } from "@/lib/formatadores";

type PedidoCardProps = {
  pedido: any;
};

export default function PedidoCard({
  pedido,
}: PedidoCardProps) {
  const [aberto, setAberto] =
    useState(false);

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-lg transition hover:shadow-xl">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          {pedido.produtos?.[0]
            ?.imagem && (
            <img
              src={
                pedido.produtos[0]
                  .imagem
              }
              alt={
                pedido.produtos[0]
                  .nome ||
                "Produto"
              }
              className="h-20 w-20 shrink-0 rounded-2xl border border-border object-cover"
            />
          )}

          <div>
            <h3 className="text-2xl font-bold text-text">
              Pedido LVS-
              {String(
                pedido.id,
              ).padStart(
                6,
                "0",
              )}
            </h3>

            <p className="mt-1 text-text-light">
              {new Date(
                pedido.created_at,
              ).toLocaleDateString(
                "pt-BR",
              )}
            </p>

            <p className="mt-1 text-text-light">
              🛍{" "}
              {pedido.produtos
                ?.length || 0}{" "}
              produto(s)
            </p>
          </div>
        </div>

        <div className="md:text-right">
          <StatusBadge
            status={
              pedido.status
            }
          />

          <p className="mt-4 text-3xl font-bold text-primary">
            {formatarMoeda(
              pedido.total,
            )}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() =>
          setAberto(
            (valorAtual) =>
              !valorAtual,
          )
        }
        className="mt-6 w-full border-t border-border pt-4 font-bold text-primary transition hover:text-primary-light"
      >
        {aberto
          ? "▲ Ocultar detalhes"
          : "▼ Ver detalhes"}
      </button>

      {aberto && (
        <div className="mt-6 space-y-4 border-t border-border pt-6">
          {pedido.produtos?.map(
            (
              produto: any,
              index: number,
            ) => (
              <div
                key={index}
                className="flex items-center gap-4 rounded-2xl border border-border bg-background p-4"
              >
                {produto.imagem && (
                  <img
                    src={
                      produto.imagem
                    }
                    alt={
                      produto.nome
                    }
                    className="h-20 w-20 rounded-xl border border-border object-cover"
                  />
                )}

                <div className="flex-1">
                  <h4 className="text-xl font-bold text-text">
                    {
                      produto.nome
                    }
                  </h4>

                  <p className="mt-1 text-text-light">
                    Quantidade:{" "}
                    {produto.quantidade ||
                      1}
                  </p>

                  <p className="mt-1 font-bold text-primary">
                    {formatarMoeda(
                      produto.preco,
                    )}
                  </p>

                  {pedido.download_liberado &&
                    produto.arquivo_digital && (
                      <a
                        href={
                          produto.arquivo_digital
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-block rounded-xl bg-success px-4 py-2 font-bold text-white transition hover:opacity-90"
                      >
                        ⬇ Baixar
                        Arquivo
                      </a>
                    )}
                </div>
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
}
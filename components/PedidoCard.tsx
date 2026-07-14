"use client";

import { useState } from "react";
import StatusBadge from "@/components/StatusBadge";
import { formatarMoeda } from "@/lib/formatadores";

type PedidoCardProps = {
  pedido: any;
};

export default function PedidoCard({ pedido }: PedidoCardProps) {
  const [aberto, setAberto] = useState(false);

  return (
    <div className="border rounded-2xl p-6 hover:shadow-lg transition">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div className="flex items-center gap-4">
          {pedido.produtos?.[0]?.imagem && (
            <img
              src={pedido.produtos[0].imagem}
              alt={pedido.produtos[0].nome}
              className="w-20 h-20 rounded-xl object-cover border"
            />
          )}

          <div>
            <h3 className="text-2xl font-bold">
              Pedido LVS-{String(pedido.id).padStart(6, "0")}
            </h3>

            <p className="text-gray-500 mt-1">
              {new Date(pedido.created_at).toLocaleDateString("pt-BR")}
            </p>

            <p className="text-gray-500 mt-1">
              🛍 {pedido.produtos?.length || 0} produto(s)
            </p>
          </div>
        </div>

        <div className="md:text-right">
          <StatusBadge status={pedido.status} />

          <p className="text-3xl font-bold text-pink-500 mt-4">
  {formatarMoeda(pedido.total)}
</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setAberto(!aberto)}
        className="w-full mt-6 border-t pt-4 text-pink-500 font-bold hover:text-pink-600"
      >
        {aberto ? "▲ Ocultar detalhes" : "▼ Ver detalhes"}
      </button>

      {aberto && (
        <div className="mt-6 border-t pt-6 space-y-4">
          {pedido.produtos?.map((produto: any, index: number) => (
            <div
              key={index}
              className="flex items-center gap-4 bg-pink-50 p-4 rounded-2xl"
            >
              {produto.imagem && (
                <img
                  src={produto.imagem}
                  alt={produto.nome}
                  className="w-20 h-20 rounded-xl object-cover border"
                />
              )}

              <div className="flex-1">
                <h4 className="text-xl font-bold">
                  {produto.nome}
                </h4>

                <p className="text-gray-500 mt-1">
                  Quantidade: {produto.quantidade || 1}
                </p>

                <p className="text-pink-500 font-bold mt-1">
                  {formatarMoeda(produto.preco)}
                </p>

                {pedido.download_liberado &&
                  produto.arquivo_digital && (
                    <a
                      href={produto.arquivo_digital}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-3 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-bold"
                    >
                      ⬇ Baixar Arquivo
                    </a>
                  )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
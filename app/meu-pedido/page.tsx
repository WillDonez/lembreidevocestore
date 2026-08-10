"use client";

import { useState } from "react";

import { supabase } from "@/lib/supabase";
import { formatarMoeda } from "@/lib/formatadores";

export default function MeuPedido() {
  const [busca, setBusca] = useState("");
  const [pedidos, setPedidos] = useState<any[]>([]);

  async function buscarPedido() {
    const { data, error } = await supabase
      .from("pedidos")
      .select("*")
      .or(`id.eq.${busca},whatsapp_cliente.eq.${busca}`);

    if (error) {
      alert("Pedido não encontrado");
      console.log(error);
      return;
    }

    if (data) {
      setPedidos(data);
    }
  }

  return (
    <main className="min-h-screen bg-background p-6 md:p-10">
      <div className="mx-auto max-w-3xl">
        <section className="rounded-3xl border border-border bg-card p-6 shadow-xl md:p-8">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-secondary">
            Rastreamento
          </p>

          <h1 className="mt-2 text-4xl font-black text-primary md:text-5xl">
            📦 Acompanhar Pedido
          </h1>

          <p className="mt-3 text-text-light">
            Digite o número do pedido ou WhatsApp usado na compra.
          </p>

          <div className="mt-6">
            <input
              type="text"
              placeholder="Ex: 20 ou 33984292167"
              value={busca}
              onChange={(e) =>
                setBusca(e.target.value)
              }
              className="w-full rounded-xl border border-border bg-card p-4 text-text outline-none transition placeholder:text-text-light focus:border-primary focus:ring-2 focus:ring-[color-mix(in_srgb,var(--primary)_15%,transparent)]"
            />

            <button
              type="button"
              onClick={buscarPedido}
              className="mt-4 w-full rounded-2xl bg-primary px-6 py-4 font-bold text-white transition hover:opacity-90"
            >
              Buscar Pedido
            </button>
          </div>
        </section>

        <div className="mt-10 space-y-6">
          {pedidos.map((pedido) => (
            <section
              key={pedido.id}
              className="rounded-3xl border border-border bg-card p-6 shadow-lg"
            >
              <h2 className="text-3xl font-bold text-text">
                Pedido LVS-
                {String(pedido.id).padStart(6, "0")}
              </h2>

              <p className="mt-2 text-text-light">
                Cliente:{" "}
                {pedido.nome_cliente ||
                  pedido.cliente}
              </p>

              <p className="mt-1 text-text-light">
                Total:{" "}
                <strong className="text-primary">
                  {formatarMoeda(pedido.total)}
                </strong>
              </p>

              <p className="mt-1 text-text-light">
                Data:{" "}
                {new Date(
                  pedido.created_at,
                ).toLocaleString("pt-BR")}
              </p>

              <div className="mt-8 space-y-3">
                {pedido.produtos?.map(
                  (
                    produto: any,
                    index: number,
                  ) => (
                    <div
                      key={index}
                      className="flex flex-col gap-4 rounded-2xl border border-border bg-background p-4 sm:flex-row sm:items-center"
                    >
                      {produto.imagem && (
                        <img
                          src={produto.imagem}
                          alt={produto.nome}
                          className="h-24 w-24 rounded-xl border border-border object-cover"
                        />
                      )}

                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-text">
                          {produto.nome}
                        </h4>

                        <p className="mt-1 text-text-light">
                          Quantidade:{" "}
                          {produto.quantidade || 1}
                        </p>

                        <p className="mt-1 text-lg font-bold text-primary">
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
                              className="mt-4 inline-block rounded-xl bg-success px-5 py-3 font-bold text-white transition hover:opacity-90"
                            >
                              ⬇ Baixar Arquivo
                            </a>
                          )}
                      </div>
                    </div>
                  ),
                )}
              </div>

              <div className="mt-8">
                <p className="mb-6 text-xl font-bold text-text">
                  Acompanhamento:
                </p>

                <div className="flex items-start justify-between">
                  {[
                    {
                      nome: "Recebido",
                      icone: "📦",
                      ativo: true,
                    },
                    {
                      nome: "Aprovado",
                      icone: "💳",
                      ativo: [
                        "aprovado",
                        "pago",
                        "em_producao",
                        "pronto",
                        "enviado",
                        "finalizado",
                      ].includes(
                        pedido.status,
                      ),
                    },
                    {
                      nome: "Produção",
                      icone: "🎨",
                      ativo: [
                        "em_producao",
                        "pronto",
                        "enviado",
                        "finalizado",
                      ].includes(
                        pedido.status,
                      ),
                    },
                    {
                      nome: "Enviado",
                      icone: "🚚",
                      ativo: [
                        "enviado",
                        "finalizado",
                      ].includes(
                        pedido.status,
                      ),
                    },
                  ].map(
                    (
                      etapa,
                      index,
                      array,
                    ) => (
                      <div
                        key={etapa.nome}
                        className="flex flex-1 items-center"
                      >
                        <div className="flex flex-col items-center">
                          <div
                            className={`flex h-14 w-14 items-center justify-center rounded-full text-2xl font-bold ${
                              etapa.ativo
                                ? "bg-success text-white"
                                : "bg-background text-text-light"
                            }`}
                          >
                            {etapa.icone}
                          </div>

                          <p className="mt-2 text-center text-sm font-bold text-text">
                            {etapa.nome}
                          </p>
                        </div>

                        {index <
                          array.length -
                            1 && (
                          <div
                            className={`mx-2 h-1 flex-1 ${
                              etapa.ativo
                                ? "bg-success"
                                : "bg-border"
                            }`}
                          />
                        )}
                      </div>
                    ),
                  )}
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
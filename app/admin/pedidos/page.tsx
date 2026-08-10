"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";
import { formatarMoeda } from "@/lib/formatadores";

export default function PedidosPage() {
  const [pedidos, setPedidos] =
    useState<any[]>([]);

  useEffect(() => {
    buscarPedidos();
  }, []);

  async function buscarPedidos() {
    const {
      data,
      error,
    } = await supabase
      .from("pedidos")
      .select("*")
      .order("id", {
        ascending: false,
      });

    if (error) {
      console.log(error);
      return;
    }

    if (data) {
      setPedidos(data);
    }
  }

  async function atualizarStatusPedido(
    pedidoId: number,
    novoStatus: string,
  ) {
    const statusLiberaDownload =
      novoStatus === "aprovado" ||
      novoStatus === "pago";

    const atualizacao: {
      status: string;
      download_liberado?: boolean;
    } = {
      status: novoStatus,
    };

    if (statusLiberaDownload) {
      atualizacao.download_liberado =
        true;
    }

    const {
      error,
    } = await supabase
      .from("pedidos")
      .update(
        atualizacao,
      )
      .eq(
        "id",
        pedidoId,
      );

    if (error) {
      console.log(
        "Erro ao atualizar status:",
        error,
      );

      alert(
        "Não foi possível atualizar o status do pedido.",
      );

      return;
    }

    setPedidos(
      (
        pedidosAtuais,
      ) =>
        pedidosAtuais.map(
          (
            pedido,
          ) =>
            pedido.id ===
            pedidoId
              ? {
                  ...pedido,
                  status:
                    novoStatus,
                  download_liberado:
                    statusLiberaDownload
                      ? true
                      : pedido.download_liberado,
                }
              : pedido,
        ),
    );
  }

  function obterEstiloStatus(
    status: string,
  ) {
    switch (
      String(
        status || "",
      )
        .trim()
        .toLowerCase()
    ) {
      case "aprovado":
      case "pago":
        return {
          texto:
            "Aprovado",
          classe:
            "bg-success",
        };

      case "cancelado":
        return {
          texto:
            "Cancelado",
          classe:
            "bg-danger",
        };

      case "em_producao":
        return {
          texto:
            "Em produção",
          classe:
            "bg-warning",
        };

      case "pronto":
        return {
          texto:
            "Pronto",
          classe:
            "bg-primary",
        };

      case "enviado":
        return {
          texto:
            "Enviado",
          classe:
            "bg-primary-light",
        };

      case "finalizado":
        return {
          texto:
            "Finalizado",
          classe:
            "bg-secondary",
        };

      default:
        return {
          texto:
            "Pendente",
          classe:
            "bg-warning",
        };
    }
  }

  return (
    <main className="min-h-screen bg-background p-6 md:p-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-secondary">
            Administração
          </p>

          <h1 className="mt-2 text-4xl font-black text-primary md:text-5xl">
            🛒 Painel de Pedidos
          </h1>

          <p className="mt-2 text-text-light">
            Acompanhe pedidos, atualize status e consulte os dados das compras.
          </p>
        </div>

        <div className="space-y-6">
          {pedidos.length ===
            0 && (
            <div className="rounded-3xl border border-border bg-card p-10 text-center text-text-light shadow-sm">
              Nenhum pedido encontrado.
            </div>
          )}

          {pedidos.map(
            (
              pedido,
            ) => {
              const status =
                obterEstiloStatus(
                  pedido.status,
                );

              return (
                <section
                  key={
                    pedido.id
                  }
                  className="rounded-3xl border border-border bg-card p-6 shadow-lg"
                >
                  <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-sm font-black uppercase tracking-[0.16em] text-secondary">
                        Pedido
                      </p>

                      <h2 className="mt-1 text-2xl font-bold text-text">
                        Pedido #
                        {
                          pedido.id
                        }
                      </h2>
                    </div>

                    <div className="flex flex-col items-start gap-3 md:items-end">
                      <span
                        className={`rounded-xl px-4 py-2 font-bold text-white ${status.classe}`}
                      >
                        {
                          status.texto
                        }
                      </span>

                      <select
                        value={
                          pedido.status
                        }
                        onChange={(
                          e,
                        ) =>
                          atualizarStatusPedido(
                            pedido.id,
                            e.target
                              .value,
                          )
                        }
                        className="rounded-xl border border-border bg-card p-3 font-bold text-text outline-none transition focus:border-primary"
                      >
                        <option value="pendente">
                          Pendente
                        </option>

                        <option value="aprovado">
                          Aprovado
                        </option>

                        <option value="pago">
                          Pago
                        </option>

                        <option value="em_producao">
                          Em produção
                        </option>

                        <option value="pronto">
                          Pronto
                        </option>

                        <option value="enviado">
                          Enviado
                        </option>

                        <option value="finalizado">
                          Finalizado
                        </option>

                        <option value="cancelado">
                          Cancelado
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 rounded-2xl border border-border bg-background p-5 text-sm sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <p className="font-bold text-text">
                        Cliente
                      </p>

                      <p className="mt-1 text-text-light">
                        {pedido.nome_cliente ||
                          pedido.cliente ||
                          "Cliente não informado"}
                      </p>
                    </div>

                    {pedido.email_cliente && (
                      <div>
                        <p className="font-bold text-text">
                          E-mail
                        </p>

                        <p className="mt-1 break-all text-text-light">
                          {
                            pedido.email_cliente
                          }
                        </p>
                      </div>
                    )}

                    {pedido.whatsapp_cliente && (
                      <div>
                        <p className="font-bold text-text">
                          WhatsApp
                        </p>

                        <p className="mt-1 text-text-light">
                          {
                            pedido.whatsapp_cliente
                          }
                        </p>
                      </div>
                    )}

                    {pedido.cpf_cnpj && (
                      <div>
                        <p className="font-bold text-text">
                          CPF/CNPJ
                        </p>

                        <p className="mt-1 text-text-light">
                          {
                            pedido.cpf_cnpj
                          }
                        </p>
                      </div>
                    )}

                    {pedido.endereco && (
                      <div className="sm:col-span-2">
                        <p className="font-bold text-text">
                          Endereço
                        </p>

                        <p className="mt-1 text-text-light">
                          {
                            pedido.endereco
                          }
                          {pedido.numero
                            ? `, ${pedido.numero}`
                            : ""}
                          {pedido.complemento
                            ? ` - ${pedido.complemento}`
                            : ""}
                        </p>
                      </div>
                    )}

                    {pedido.bairro && (
                      <div>
                        <p className="font-bold text-text">
                          Bairro
                        </p>

                        <p className="mt-1 text-text-light">
                          {
                            pedido.bairro
                          }
                        </p>
                      </div>
                    )}

                    {pedido.cidade && (
                      <div>
                        <p className="font-bold text-text">
                          Cidade
                        </p>

                        <p className="mt-1 text-text-light">
                          {
                            pedido.cidade
                          }
                          {pedido.estado
                            ? ` - ${pedido.estado}`
                            : ""}
                        </p>
                      </div>
                    )}

                    {pedido.cep && (
                      <div>
                        <p className="font-bold text-text">
                          CEP
                        </p>

                        <p className="mt-1 text-text-light">
                          {
                            pedido.cep
                          }
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-6">
                    <h3 className="mb-3 text-xl font-bold text-text">
                      Produtos
                    </h3>

                    <div className="space-y-3">
                      {pedido.produtos?.map(
                        (
                          produto: any,
                          index: number,
                        ) => (
                          <div
                            key={
                              index
                            }
                            className="flex flex-col gap-4 rounded-2xl border border-border bg-background p-4 sm:flex-row sm:items-center"
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

                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-text">
                                {
                                  produto.nome
                                }
                              </p>

                              <p className="mt-1 text-sm text-text-light">
                                Quantidade:{" "}
                                {produto.quantidade ||
                                  1}
                              </p>
                            </div>

                            <p className="font-bold text-primary">
                              {formatarMoeda(
                                produto.preco,
                              )}
                            </p>
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-sm font-bold text-text-light">
                        Total do pedido
                      </p>

                      <h3 className="mt-1 text-3xl font-bold text-primary">
                        {formatarMoeda(
                          pedido.total,
                        )}
                      </h3>
                    </div>

                    <p className="text-sm text-text-light">
                      {pedido.created_at
                        ? new Date(
                            pedido.created_at,
                          ).toLocaleString(
                            "pt-BR",
                          )
                        : "Data não informada"}
                    </p>
                  </div>
                </section>
              );
            },
          )}
        </div>
      </div>
    </main>
  );
}
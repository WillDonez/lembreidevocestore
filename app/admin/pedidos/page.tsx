"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";
import { formatarMoeda } from "@/lib/formatadores";

type ProdutoPedido = {
  id?: number | string;
  nome?: string;
  preco?: number | string;
  quantidade?: number;
  imagem?: string;
  descricao?: string;
  tipo_produto?: string;
  arquivo_digital?: string;
  formato_arquivo?: string;
};

type Pedido = {
  id: number;
  status?: string;
  produtos?: ProdutoPedido[] | null;
  download_liberado?: boolean;

  nome_cliente?: string;
  cliente?: string;
  email_cliente?: string;
  whatsapp_cliente?: string;
  cpf_cnpj?: string;

  endereco?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;

  total?: number | string;
  created_at?: string;

  nota_fiscal_chave?: string | null;
  nota_fiscal_status?: string | null;

  melhor_envio_order_id?: string | null;
  melhor_envio_status?: string | null;
  melhor_envio_ambiente?: "sandbox" | "producao" | null;
  codigo_rastreio?: string | null;
  url_etiqueta?: string | null;
  etiqueta_gerada?: boolean;
};

function normalizarTipoProduto(tipo?: string) {
  return String(tipo || "")
    .trim()
    .toLowerCase();
}

function pedidoPossuiProdutoFisico(
  pedido: Pedido,
) {
  return Boolean(
    pedido.produtos?.some(
      (produto) =>
        normalizarTipoProduto(
          produto.tipo_produto,
        ) === "fisico",
    ),
  );
}

function pedidoPossuiProdutoDigital(
  pedido: Pedido,
) {
  return Boolean(
    pedido.produtos?.some(
      (produto) =>
        normalizarTipoProduto(
          produto.tipo_produto,
        ) === "digital",
    ),
  );
}

function obterTipoPedido(
  pedido: Pedido,
) {
  const possuiFisico =
    pedidoPossuiProdutoFisico(
      pedido,
    );

  const possuiDigital =
    pedidoPossuiProdutoDigital(
      pedido,
    );

  if (
    possuiFisico &&
    possuiDigital
  ) {
    return {
      texto: "Pedido misto",
      icone: "📦📄",
      classe:
        "border-secondary/30 bg-secondary/10 text-secondary",
    };
  }

  if (possuiFisico) {
    return {
      texto: "Pedido físico",
      icone: "📦",
      classe:
        "border-primary/30 bg-primary/10 text-primary",
    };
  }

  if (possuiDigital) {
    return {
      texto: "Pedido digital",
      icone: "📄",
      classe:
        "border-success/30 bg-success/10 text-success",
    };
  }

  return {
    texto: "Tipo não identificado",
    icone: "❔",
    classe:
      "border-border bg-background text-text-light",
  };
}

export default function PedidosPage() {
  const [pedidos, setPedidos] =
    useState<Pedido[]>([]);

  const [
    salvandoNFePedidoId,
    setSalvandoNFePedidoId,
  ] = useState<number | null>(null);

  const [
    criandoEnvioPedidoId,
    setCriandoEnvioPedidoId,
  ] = useState<number | null>(null);

  const [
    atualizandoEnvioPedidoId,
    setAtualizandoEnvioPedidoId,
  ] = useState<number | null>(null);

  const [
    ambienteAtual,
    setAmbienteAtual,
  ] = useState<"sandbox" | "producao" | null>(null);

  useEffect(() => {
    const hostname =
      window.location.hostname.toLowerCase();

    const hostsProducao = [
      "lembreidevocestore.com.br",
      "www.lembreidevocestore.com.br",
      "lembreidevocestore.vercel.app",
    ];

    setAmbienteAtual(
      hostsProducao.includes(hostname)
        ? "producao"
        : "sandbox",
    );

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
      console.log(
        "Erro ao buscar pedidos:",
        error,
      );

      return;
    }

    if (data) {
      setPedidos(
        data as Pedido[],
      );
    }
  }

  async function atualizarStatusPedido(
    pedidoId: number,
    novoStatus: string,
  ) {
    const pedidoAtual =
      pedidos.find(
        (pedido) =>
          pedido.id === pedidoId,
      );

    if (!pedidoAtual) {
      alert(
        "Pedido não encontrado.",
      );

      return;
    }

    /*
     * =====================================================
     * REGRA DE DOWNLOAD
     * =====================================================
     *
     * Somente pedidos que possuem produto DIGITAL
     * podem ter download liberado.
     *
     * Produto físico:
     * aprovado/pago -> download FALSE
     *
     * Produto digital:
     * aprovado/pago -> download TRUE
     *
     * Pedido misto:
     * aprovado/pago -> download TRUE
     * porque existem arquivos digitais no pedido.
     */

    const possuiProdutoDigital =
      pedidoPossuiProdutoDigital(
        pedidoAtual,
      );

    const statusLiberaDownload =
      novoStatus === "aprovado" ||
      novoStatus === "pago";

    const downloadLiberado =
      statusLiberaDownload &&
      possuiProdutoDigital;

    const atualizacao = {
      status: novoStatus,
      download_liberado:
        downloadLiberado,
    };

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
                    downloadLiberado,
                }
              : pedido,
        ),
    );
  }

  function limparSomenteNumeros(
    valor?: string | null,
  ) {
    return String(valor || "")
      .replace(/\D/g, "");
  }

  function atualizarChaveNFeLocal(
    pedidoId: number,
    valor: string,
  ) {
    const chave =
      limparSomenteNumeros(
        valor,
      ).slice(0, 44);

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
                  nota_fiscal_chave:
                    chave,
                }
              : pedido,
        ),
    );
  }

  async function salvarNotaFiscal(
    pedido: Pedido,
  ) {
    if (
      !pedidoPossuiProdutoFisico(
        pedido,
      )
    ) {
      alert(
        "Este pedido não possui produto físico.",
      );

      return;
    }

    const chaveNFe =
      limparSomenteNumeros(
        pedido.nota_fiscal_chave,
      );

    if (
      chaveNFe.length !== 44
    ) {
      alert(
        "A chave da NF-e deve possuir exatamente 44 números.",
      );

      return;
    }

    setSalvandoNFePedidoId(
      pedido.id,
    );

    try {
      const {
        error,
      } = await supabase
        .from("pedidos")
        .update({
          nota_fiscal_chave:
            chaveNFe,
          nota_fiscal_status:
            "emitida",
        })
        .eq(
          "id",
          pedido.id,
        );

      if (error) {
        console.log(
          "Erro ao salvar NF-e:",
          error,
        );

        alert(
          "Não foi possível salvar os dados da NF-e.",
        );

        return;
      }

      setPedidos(
        (
          pedidosAtuais,
        ) =>
          pedidosAtuais.map(
            (
              item,
            ) =>
              item.id ===
              pedido.id
                ? {
                    ...item,
                    nota_fiscal_chave:
                      chaveNFe,
                    nota_fiscal_status:
                      "emitida",
                  }
                : item,
          ),
      );

      alert(
        "NF-e registrada no pedido com sucesso.",
      );
    } finally {
      setSalvandoNFePedidoId(
        null,
      );
    }
  }

  async function criarEnvio(
    pedido: Pedido,
  ) {
    if (
      !pedidoPossuiProdutoFisico(
        pedido,
      )
    ) {
      alert(
        "Este pedido não possui produto físico.",
      );

      return;
    }

    const statusPedido =
      String(
        pedido.status || "",
      )
        .trim()
        .toLowerCase();

    if (
      statusPedido !==
        "aprovado" &&
      statusPedido !==
        "pago"
    ) {
      alert(
        "O pedido precisa estar aprovado ou pago antes de criar o envio.",
      );

      return;
    }

    const chaveNFe =
      limparSomenteNumeros(
        pedido.nota_fiscal_chave,
      );

    if (
      chaveNFe.length !== 44
    ) {
      alert(
        "Registre primeiro uma chave de NF-e válida com 44 números.",
      );

      return;
    }

    if (
      pedido.melhor_envio_order_id
    ) {
      alert(
        "Este pedido já possui um envio criado no Melhor Envio.",
      );

      return;
    }

    setCriandoEnvioPedidoId(
      pedido.id,
    );

    try {
      const resposta =
        await fetch(
          "/api/admin/pedidos/melhor-envio",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body:
              JSON.stringify({
                pedidoId:
                  pedido.id,
              }),
          },
        );

      let dados: {
        sucesso?: boolean;
        erro?: string;
        mensagem?: string;
        melhorEnvioOrderId?: string;
        ambiente?: "sandbox" | "producao";
      } = {};

      try {
        dados =
          await resposta.json();
      } catch {
        dados = {};
      }

      if (
        !resposta.ok
      ) {
        throw new Error(
          dados.erro ||
            "Não foi possível criar o envio no Melhor Envio.",
        );
      }

      const melhorEnvioOrderId =
        String(
          dados.melhorEnvioOrderId ||
          "",
        );

      setPedidos(
        (
          pedidosAtuais,
        ) =>
          pedidosAtuais.map(
            (
              item,
            ) =>
              item.id ===
              pedido.id
                ? {
                    ...item,
                    melhor_envio_order_id:
                      melhorEnvioOrderId ||
                      item.melhor_envio_order_id,
                    melhor_envio_status:
                      "carrinho",
                    melhor_envio_ambiente:
                      dados.ambiente ||
                      item.melhor_envio_ambiente,
                  }
                : item,
          ),
      );

      alert(
        dados.mensagem ||
          "Envio criado no Melhor Envio com sucesso.",
      );
    } catch (error) {
      console.error(
        "Erro ao criar envio no Melhor Envio:",
        error,
      );

      alert(
        error instanceof Error
          ? error.message
          : "Não foi possível criar o envio no Melhor Envio.",
      );
    } finally {
      setCriandoEnvioPedidoId(
        null,
      );
    }
  }

  async function atualizarEnvioMelhorEnvio(
    pedido: Pedido,
  ) {
    if (!pedido.melhor_envio_order_id) {
      alert(
        "Este pedido ainda não possui um envio no Melhor Envio.",
      );

      return;
    }

    if (
      pedido.melhor_envio_ambiente &&
      ambienteAtual &&
      pedido.melhor_envio_ambiente !== ambienteAtual
    ) {
      alert(
        `Este envio pertence ao ambiente ${pedido.melhor_envio_ambiente} e não pode ser atualizado no ambiente ${ambienteAtual}.`,
      );

      return;
    }

    setAtualizandoEnvioPedidoId(
      pedido.id,
    );

    try {
      const resposta = await fetch(
        `/api/admin/pedidos/melhor-envio?pedidoId=${pedido.id}`,
        {
          method: "GET",
          cache: "no-store",
        },
      );

      let dados: {
        sucesso?: boolean;
        erro?: string;
        mensagem?: string;
        status?: string;
        codigoRastreio?: string | null;
        urlEtiqueta?: string | null;
        etiquetaGerada?: boolean;
      } = {};

      try {
        dados = await resposta.json();
      } catch {
        dados = {};
      }

      if (!resposta.ok) {
        throw new Error(
          dados.erro ||
            "Não foi possível atualizar o envio.",
        );
      }

      setPedidos((pedidosAtuais) =>
        pedidosAtuais.map((item) =>
          item.id === pedido.id
            ? {
                ...item,
                melhor_envio_status:
                  dados.status ||
                  item.melhor_envio_status,
                codigo_rastreio:
                  dados.codigoRastreio ??
                  item.codigo_rastreio,
                url_etiqueta:
                  dados.urlEtiqueta ??
                  item.url_etiqueta,
                etiqueta_gerada:
                  dados.etiquetaGerada ??
                  item.etiqueta_gerada,
              }
            : item,
        ),
      );

      alert(
        dados.mensagem ||
          "Dados do envio atualizados com sucesso.",
      );
    } catch (error) {
      console.error(
        "Erro ao atualizar envio do Melhor Envio:",
        error,
      );

      alert(
        error instanceof Error
          ? error.message
          : "Não foi possível atualizar o envio.",
      );
    } finally {
      setAtualizandoEnvioPedidoId(null);
    }
  }

  function obterEstiloStatus(
    status?: string,
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
            Acompanhe pedidos,
            atualize status e consulte
            os dados das compras.
          </p>
        </div>

        <div className="space-y-6">
          {pedidos.length ===
            0 && (
            <div className="rounded-3xl border border-border bg-card p-10 text-center text-text-light shadow-sm">
              Nenhum pedido
              encontrado.
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

              const tipoPedido =
                obterTipoPedido(
                  pedido,
                );

              const possuiFisico =
                pedidoPossuiProdutoFisico(
                  pedido,
                );

              const possuiDigital =
                pedidoPossuiProdutoDigital(
                  pedido,
                );

              const ambienteIncompativel = Boolean(
                pedido.melhor_envio_ambiente &&
                  ambienteAtual &&
                  pedido.melhor_envio_ambiente !== ambienteAtual,
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

                      <div className="mt-3">
                        <span
                          className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-bold ${tipoPedido.classe}`}
                        >
                          <span>
                            {
                              tipoPedido.icone
                            }
                          </span>

                          {
                            tipoPedido.texto
                          }
                        </span>
                      </div>
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
                          pedido.status ||
                          "pendente"
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

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    {possuiFisico && (
                      <div className="rounded-2xl border border-primary/25 bg-primary/5 p-5">
                        <div className="flex items-start gap-3">
                          <div className="text-2xl">
                            📦
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-text">
                              Parte física
                            </p>

                            <p className="mt-1 text-sm leading-relaxed text-text-light">
                              Registre a NF-e
                              emitida e, após
                              o pagamento estar
                              aprovado, crie o
                              envio no Melhor
                              Envio.
                            </p>

                            <div className="mt-5 rounded-2xl border border-border bg-card p-4">
                              <div className="flex flex-col gap-2">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <label
                                    htmlFor={`nfe-${pedido.id}`}
                                    className="text-sm font-bold text-text"
                                  >
                                    Chave da NF-e
                                  </label>

                                  <span className="text-xs font-medium text-text-light">
                                    {limparSomenteNumeros(
                                      pedido.nota_fiscal_chave,
                                    ).length}
                                    /44
                                  </span>
                                </div>

                                <input
                                  id={`nfe-${pedido.id}`}
                                  type="text"
                                  inputMode="numeric"
                                  autoComplete="off"
                                  maxLength={44}
                                  value={
                                    pedido.nota_fiscal_chave ||
                                    ""
                                  }
                                  onChange={(
                                    e,
                                  ) =>
                                    atualizarChaveNFeLocal(
                                      pedido.id,
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Digite ou cole os 44 números da chave da NF-e"
                                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-text outline-none transition focus:border-primary"
                                />

                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                  <p className="text-xs text-text-light">
                                    Status fiscal:{" "}
                                    <strong className="text-text">
                                      {pedido.nota_fiscal_status ===
                                      "emitida"
                                        ? "NF-e registrada"
                                        : "Aguardando NF-e"}
                                    </strong>
                                  </p>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      salvarNotaFiscal(
                                        pedido,
                                      )
                                    }
                                    disabled={
                                      salvandoNFePedidoId ===
                                      pedido.id
                                    }
                                    className="rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                                  >
                                    {salvandoNFePedidoId ===
                                    pedido.id
                                      ? "Salvando..."
                                      : "💾 Salvar NF-e"}
                                  </button>
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 rounded-2xl border border-border bg-card p-4">
                              {pedido.melhor_envio_order_id ? (
                                <div>
                                  <p className="text-sm font-bold text-success">
                                    ✅ Envio criado no Melhor Envio
                                  </p>

                                  <p className="mt-2 break-all text-xs text-text-light">
                                    ID do envio:{" "}
                                    <strong className="text-text">
                                      {
                                        pedido.melhor_envio_order_id
                                      }
                                    </strong>
                                  </p>

                                  <p className="mt-1 text-xs text-text-light">
                                    Status:{" "}
                                    <strong className="text-text">
                                      {pedido.melhor_envio_status ||
                                        "carrinho"}
                                    </strong>
                                  </p>

                                  {pedido.codigo_rastreio && (
                                    <p className="mt-1 text-xs text-text-light">
                                      Rastreio:{" "}
                                      <strong className="text-text">
                                        {
                                          pedido.codigo_rastreio
                                        }
                                      </strong>
                                    </p>
                                  )}

                                  <p className="mt-1 text-xs text-text-light">
                                    Etiqueta: {" "}
                                    <strong className="text-text">
                                      {pedido.etiqueta_gerada
                                        ? "Gerada"
                                        : "Ainda não sincronizada"}
                                    </strong>
                                  </p>

                                  <p className="mt-1 text-xs text-text-light">
                                    Ambiente:{" "}
                                    <strong className="text-text">
                                      {pedido.melhor_envio_ambiente ||
                                        "não identificado"}
                                    </strong>
                                  </p>

                                  {ambienteIncompativel && (
                                    <p className="mt-3 rounded-xl border border-warning/40 bg-warning/10 p-3 text-xs font-bold text-warning">
                                      Este envio pertence ao ambiente {pedido.melhor_envio_ambiente} e está bloqueado no ambiente {ambienteAtual}.
                                    </p>
                                  )}

                                  {pedido.url_etiqueta &&
                                    !ambienteIncompativel && (
                                    <a
                                      href={
                                        pedido.url_etiqueta
                                      }
                                      target="_blank"
                                      rel="noreferrer"
                                      className="mt-3 inline-flex rounded-xl border border-primary px-4 py-2 text-sm font-bold text-primary transition hover:bg-primary/5"
                                    >
                                      🏷 Abrir etiqueta
                                    </a>
                                  )}

                                  <button
                                    type="button"
                                    onClick={() =>
                                      atualizarEnvioMelhorEnvio(
                                        pedido,
                                      )
                                    }
                                    disabled={
                                      atualizandoEnvioPedidoId ===
                                        pedido.id ||
                                      ambienteIncompativel
                                    }
                                    className="mt-3 inline-flex rounded-xl bg-secondary px-4 py-2 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                                  >
                                    {atualizandoEnvioPedidoId ===
                                    pedido.id
                                      ? "Atualizando..."
                                      : "🔄 Atualizar envio"}
                                  </button>
                                </div>
                              ) : (
                                <div>
                                  <p className="text-sm font-bold text-text">
                                    Melhor Envio
                                  </p>

                                  <p className="mt-1 text-xs leading-relaxed text-text-light">
                                    O envio só
                                    pode ser
                                    criado após
                                    o pagamento
                                    estar
                                    aprovado e
                                    a chave da
                                    NF-e possuir
                                    44 números.
                                  </p>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      criarEnvio(
                                        pedido,
                                      )
                                    }
                                    disabled={
                                      criandoEnvioPedidoId ===
                                        pedido.id ||
                                      !(
                                        pedido.status ===
                                          "aprovado" ||
                                        pedido.status ===
                                          "pago"
                                      ) ||
                                      limparSomenteNumeros(
                                        pedido.nota_fiscal_chave,
                                      ).length !==
                                        44
                                    }
                                    className="mt-4 w-full rounded-xl bg-secondary px-4 py-3 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                                  >
                                    {criandoEnvioPedidoId ===
                                    pedido.id
                                      ? "Criando envio..."
                                      : "📦 Criar envio no Melhor Envio"}
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {possuiDigital && (
                      <div className="rounded-2xl border border-success/25 bg-success/5 p-5">
                        <div className="flex items-start gap-3">
                          <div className="text-2xl">
                            📄
                          </div>

                          <div>
                            <p className="font-bold text-text">
                              Parte digital
                            </p>

                            <p className="mt-1 text-sm leading-relaxed text-text-light">
                              Este pedido
                              possui produto
                              digital. O
                              download será
                              liberado quando
                              o pagamento
                              estiver aprovado.
                            </p>

                            <p className="mt-3 text-sm font-bold text-text">
                              Download:{" "}
                              <span
                                className={
                                  pedido.download_liberado
                                    ? "text-success"
                                    : "text-text-light"
                                }
                              >
                                {pedido.download_liberado
                                  ? "Liberado"
                                  : "Não liberado"}
                              </span>
                            </p>
                          </div>
                        </div>
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
                          produto,
                          index,
                        ) => {
                          const tipo =
                            normalizarTipoProduto(
                              produto.tipo_produto,
                            );

                          const produtoFisico =
                            tipo ===
                            "fisico";

                          const produtoDigital =
                            tipo ===
                            "digital";

                          return (
                            <div
                              key={
                                produto.id ??
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
                                    produto.nome ||
                                    "Produto"
                                  }
                                  className="h-20 w-20 rounded-xl border border-border object-cover"
                                />
                              )}

                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="font-bold text-text">
                                    {produto.nome ||
                                      "Produto"}
                                  </p>

                                  {produtoFisico && (
                                    <span className="rounded-lg border border-primary/25 bg-primary/10 px-2 py-1 text-xs font-bold text-primary">
                                      📦 Físico
                                    </span>
                                  )}

                                  {produtoDigital && (
                                    <span className="rounded-lg border border-success/25 bg-success/10 px-2 py-1 text-xs font-bold text-success">
                                      📄 Digital
                                    </span>
                                  )}

                                  {!produtoFisico &&
                                    !produtoDigital && (
                                      <span className="rounded-lg border border-border bg-card px-2 py-1 text-xs font-bold text-text-light">
                                        ❔ Tipo não
                                        identificado
                                      </span>
                                    )}
                                </div>

                                <p className="mt-1 text-sm text-text-light">
                                  Quantidade:{" "}
                                  {produto.quantidade ||
                                    1}
                                </p>

                                {produtoDigital &&
                                  produto.formato_arquivo && (
                                    <p className="mt-1 text-sm text-text-light">
                                      Formato:{" "}
                                      {
                                        produto.formato_arquivo
                                      }
                                    </p>
                                  )}
                              </div>

                              <p className="font-bold text-primary">
                                {formatarMoeda(
                                 produto.preco ?? 0,
                                )}
                              </p>
                            </div>
                          );
                        },
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
                          pedido.total ?? 0,
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
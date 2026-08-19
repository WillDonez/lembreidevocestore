"use client";

import { useState } from "react";

import StatusBadge from "@/components/StatusBadge";
import { formatarMoeda } from "@/lib/formatadores";
import { supabase } from "@/lib/supabase";

type PedidoCardProps = {
  pedido: any;
};

type TipoArquivoFiscal =
  | "pdf"
  | "xml";

function normalizarTipoProduto(
  tipo?: string,
) {
  return String(tipo || "")
    .trim()
    .toLowerCase();
}

function pedidoPossuiProdutoFisico(
  pedido: any,
) {
  return Boolean(
    pedido.produtos?.some(
      (produto: any) =>
        normalizarTipoProduto(
          produto.tipo_produto,
        ) === "fisico",
    ),
  );
}

function formatarStatusEnvio(
  status?: string | null,
) {
  const statusNormalizado =
    String(status || "")
      .trim()
      .toLowerCase();

  switch (statusNormalizado) {
    case "carrinho":
      return "Aguardando compra da etiqueta";

    case "pendente":
      return "Aguardando liberação";

    case "liberado":
      return "Etiqueta liberada";

    case "postado":
      return "Postado";

    case "entregue":
      return "Entregue";

    case "nao_entregue":
      return "Entrega não realizada";

    case "cancelado":
      return "Envio cancelado";

    case "suspenso":
      return "Envio suspenso";

    default:
      return statusNormalizado
        ? statusNormalizado
        : "Aguardando envio";
  }
}

export default function PedidoCard({
  pedido,
}: PedidoCardProps) {
  const [aberto, setAberto] =
    useState(false);

  const [
    baixandoArquivo,
    setBaixandoArquivo,
  ] =
    useState<TipoArquivoFiscal | null>(
      null,
    );

  const [
    atualizandoRastreio,
    setAtualizandoRastreio,
  ] = useState(false);

  const [
    statusRastreioLocal,
    setStatusRastreioLocal,
  ] = useState<string | null>(
    pedido.melhor_envio_status ||
      null,
  );

  const [
    codigoRastreioLocal,
    setCodigoRastreioLocal,
  ] = useState<string | null>(
    pedido.codigo_rastreio ||
      null,
  );

  const [
    etiquetaGeradaLocal,
    setEtiquetaGeradaLocal,
  ] = useState(
    Boolean(
      pedido.etiqueta_gerada,
    ),
  );

  const possuiProdutoFisico =
    pedidoPossuiProdutoFisico(
      pedido,
    );

  const possuiEnvio =
    Boolean(
      pedido.melhor_envio_order_id,
    );

  const possuiRastreio =
    Boolean(
      String(
        codigoRastreioLocal ||
          "",
      ).trim(),
    );

  const statusEnvio =
    formatarStatusEnvio(
      statusRastreioLocal,
    );

  const possuiDanfe =
    Boolean(
      pedido.nota_fiscal_pdf_path,
    );

  const possuiXml =
    Boolean(
      pedido.nota_fiscal_xml_path,
    );

  const possuiArquivosFiscais =
    possuiDanfe ||
    possuiXml;

  async function atualizarRastreamento() {
    if (
      !possuiEnvio
    ) {
      alert(
        "Este pedido ainda não possui envio para rastrear.",
      );

      return;
    }

    setAtualizandoRastreio(
      true,
    );

    try {
      const {
        data: {
          session,
        },
      } =
        await supabase.auth.getSession();

      if (
        !session?.access_token
      ) {
        throw new Error(
          "Sua sessão expirou. Entre novamente para atualizar o rastreamento.",
        );
      }

      const resposta =
        await fetch(
          `/api/minha-conta/pedidos/rastreio?pedidoId=${pedido.id}`,
          {
            method: "GET",
            headers: {
              Authorization:
                `Bearer ${session.access_token}`,
            },
            cache:
              "no-store",
          },
        );

      let dados: {
        sucesso?: boolean;
        erro?: string;
        mensagem?: string;
        status?: string;
        codigoRastreio?: string | null;
        etiquetaGerada?: boolean;
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
            "Não foi possível atualizar o rastreamento.",
        );
      }

      if (
        dados.status
      ) {
        setStatusRastreioLocal(
          dados.status,
        );
      }

      setCodigoRastreioLocal(
        dados.codigoRastreio ??
          codigoRastreioLocal,
      );

      if (
        typeof dados.etiquetaGerada ===
        "boolean"
      ) {
        setEtiquetaGeradaLocal(
          dados.etiquetaGerada,
        );
      }

      alert(
        dados.mensagem ||
          "Rastreamento atualizado com sucesso.",
      );
    } catch (error) {
      console.error(
        "Erro ao atualizar rastreamento:",
        error,
      );

      alert(
        error instanceof Error
          ? error.message
          : "Não foi possível atualizar o rastreamento.",
      );
    } finally {
      setAtualizandoRastreio(
        false,
      );
    }
  }

  async function baixarArquivoFiscal(
    tipo: TipoArquivoFiscal,
  ) {
    setBaixandoArquivo(
      tipo,
    );

    try {
      const {
        data: {
          session,
        },
      } =
        await supabase.auth.getSession();

      if (
        !session?.access_token
      ) {
        throw new Error(
          "Sua sessão expirou. Entre novamente para baixar a nota fiscal.",
        );
      }

      const resposta =
        await fetch(
          `/api/minha-conta/pedidos/nota-fiscal?pedidoId=${pedido.id}&tipo=${tipo}`,
          {
            method: "GET",
            headers: {
              Authorization:
                `Bearer ${session.access_token}`,
            },
            cache:
              "no-store",
          },
        );

      let dados: {
        sucesso?: boolean;
        erro?: string;
        url?: string;
      } = {};

      try {
        dados =
          await resposta.json();
      } catch {
        dados = {};
      }

      if (
        !resposta.ok ||
        !dados.url
      ) {
        throw new Error(
          dados.erro ||
            "Não foi possível liberar o download da nota fiscal.",
        );
      }

      window.open(
        dados.url,
        "_blank",
        "noopener,noreferrer",
      );
    } catch (error) {
      console.error(
        "Erro ao baixar arquivo fiscal:",
        error,
      );

      alert(
        error instanceof Error
          ? error.message
          : "Não foi possível baixar o arquivo fiscal.",
      );
    } finally {
      setBaixandoArquivo(
        null,
      );
    }
  }

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

      {possuiProdutoFisico && (
        <div className="mt-5 rounded-2xl border border-primary/20 bg-primary/5 p-4">
          <p className="font-bold text-text">
            📦 Acompanhamento do envio
          </p>

          <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <p className="text-text-light">
                Status do envio
              </p>

              <p className="mt-1 font-bold text-text">
                {possuiEnvio
                  ? statusEnvio
                  : "Aguardando preparação"}
              </p>
            </div>

            <div>
              <p className="text-text-light">
                Rastreamento
              </p>

              <p className="mt-1 break-all font-bold text-text">
                {possuiRastreio
                  ? codigoRastreioLocal
                  : "Ainda não disponível"}
              </p>
            </div>
          </div>

          {etiquetaGeradaLocal && (
            <p className="mt-3 text-xs font-bold text-success">
              ✅ Etiqueta de envio gerada
            </p>
          )}

          {possuiEnvio &&
            !possuiRastreio && (
              <p className="mt-3 text-xs text-text-light">
                O código de rastreamento aparecerá aqui assim que for disponibilizado pela transportadora.
              </p>
            )}

          {possuiEnvio && (
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={
                  atualizarRastreamento
                }
                disabled={
                  atualizandoRastreio
                }
                className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {atualizandoRastreio
                  ? "Atualizando rastreamento..."
                  : "🔄 Atualizar rastreamento"}
              </button>

              {possuiRastreio && (
                <span className="text-xs text-text-light">
                  Código atual:{" "}
                  <strong className="text-text">
                    {
                      codigoRastreioLocal
                    }
                  </strong>
                </span>
              )}
            </div>
          )}

          {possuiRastreio && (
            <p className="mt-3 text-xs text-text-light">
              Use o botão acima para buscar a situação mais recente do envio.
            </p>
          )}
        </div>
      )}

      {possuiProdutoFisico &&
        possuiArquivosFiscais && (
          <div className="mt-5 rounded-2xl border border-secondary/25 bg-secondary/5 p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-bold text-text">
                  🧾 Nota Fiscal
                </p>

                <p className="mt-1 text-sm text-text-light">
                  Acesse os documentos fiscais deste pedido.
                </p>
              </div>

              {pedido.nota_fiscal_status && (
                <span className="w-fit rounded-lg border border-success/30 bg-success/10 px-2.5 py-1 text-xs font-bold text-success">
                  NF-e disponível
                </span>
              )}
            </div>

            {pedido.nota_fiscal_chave && (
              <div className="mt-3 rounded-xl border border-border bg-background p-3">
                <p className="text-xs font-bold text-text-light">
                  Chave da NF-e
                </p>

                <p className="mt-1 break-all text-xs font-bold text-text">
                  {
                    pedido.nota_fiscal_chave
                  }
                </p>
              </div>
            )}

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              {possuiDanfe && (
                <button
                  type="button"
                  onClick={() =>
                    baixarArquivoFiscal(
                      "pdf",
                    )
                  }
                  disabled={
                    baixandoArquivo !==
                    null
                  }
                  className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {baixandoArquivo ===
                  "pdf"
                    ? "Preparando DANFE..."
                    : "📄 Baixar DANFE"}
                </button>
              )}

              {possuiXml && (
                <button
                  type="button"
                  onClick={() =>
                    baixarArquivoFiscal(
                      "xml",
                    )
                  }
                  disabled={
                    baixandoArquivo !==
                    null
                  }
                  className="inline-flex items-center justify-center rounded-xl bg-secondary px-4 py-3 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {baixandoArquivo ===
                  "xml"
                    ? "Preparando XML..."
                    : "📋 Baixar XML"}
                </button>
              )}
            </div>

            <p className="mt-3 text-xs leading-relaxed text-text-light">
              Por segurança, os arquivos são liberados por um link temporário somente para sua conta.
            </p>
          </div>
        )}

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
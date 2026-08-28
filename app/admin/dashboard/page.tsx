"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  CalendarDays,
  CircleDollarSign,
  Clock3,
  Package,
  ReceiptText,
  ShoppingBag,
  Truck,
  Users,
  XCircle,
} from "lucide-react";

import { supabase } from "@/lib/supabase";
import { formatarMoeda } from "@/lib/formatadores";

type Periodo =
  | "hoje"
  | "semana"
  | "mes"
  | "ano";

type Indicadores = {
  faturamento: number;
  receitaProdutos: number;
  freteArrecadado: number;
  pedidosPagos: number;
  pedidosPendentes: number;
  pedidosCancelados: number;
  ticketMedio: number;
  itensVendidos: number;
};

type Gerais = {
  produtos: number;
  categorias: number;
  clientes: number;
  pedidos: number;
};

type VendaPorTipo = {
  fisicos: number;
  digitais: number;
};

type ProdutoMaisVendido = {
  nome: string;
  quantidade: number;
  faturamento: number;
};

type EvolucaoItem = {
  chave: string;
  label: string;
  faturamento: number;
  pedidos: number;
};

type UltimoPedido = {
  id: number;
  cliente: string;
  email: string;
  total: number;
  status: string;
  created_at?: string;
};

type DashboardResposta = {
  periodo: Periodo;

  gerais: Gerais;

  indicadores: Indicadores;

  vendasPorTipo: VendaPorTipo;

  produtosMaisVendidos: ProdutoMaisVendido[];

  evolucao: EvolucaoItem[];

  ultimosPedidos: UltimoPedido[];
};

const periodos: {
  valor: Periodo;
  titulo: string;
}[] = [
  {
    valor: "hoje",
    titulo: "Hoje",
  },
  {
    valor: "semana",
    titulo: "7 dias",
  },
  {
    valor: "mes",
    titulo: "Mensal",
  },
  {
    valor: "ano",
    titulo: "Anual",
  },
];

function formatarStatus(
  status: string,
) {
  const statusNormalizado =
    String(status || "")
      .trim()
      .toLowerCase();

  switch (statusNormalizado) {
    case "aprovado":
    case "pago":
      return {
        texto: "Aprovado",
        classe:
          "bg-[color-mix(in_srgb,var(--success)_12%,white)] text-success",
      };

    case "em_producao":
      return {
        texto: "Em produção",
        classe:
          "bg-[color-mix(in_srgb,var(--warning)_12%,white)] text-warning",
      };

    case "pronto":
      return {
        texto: "Pronto",
        classe:
          "bg-[color-mix(in_srgb,var(--primary)_12%,white)] text-primary",
      };

    case "enviado":
      return {
        texto: "Enviado",
        classe:
          "bg-[color-mix(in_srgb,var(--primary-light)_12%,white)] text-primary-light",
      };

    case "finalizado":
      return {
        texto: "Finalizado",
        classe:
          "bg-[color-mix(in_srgb,var(--secondary)_14%,white)] text-secondary",
      };

    case "cancelado":
      return {
        texto: "Cancelado",
        classe:
          "bg-[color-mix(in_srgb,var(--danger)_12%,white)] text-danger",
      };

    default:
      return {
        texto: "Pendente",
        classe:
          "bg-[color-mix(in_srgb,var(--warning)_12%,white)] text-warning",
      };
  }
}

export default function DashboardAdmin() {
  const [
    periodo,
    setPeriodo,
  ] = useState<Periodo>(
    "mes",
  );

  const [
    dados,
    setDados,
  ] =
    useState<DashboardResposta | null>(
      null,
    );

  const [
    carregando,
    setCarregando,
  ] =
    useState(true);

  const [
    erro,
    setErro,
  ] =
    useState("");

  const buscarDados =
    useCallback(
      async () => {
        try {
          setCarregando(
            true,
          );

          setErro("");

          const {
            data: {
              session,
            },
          } =
            await supabase.auth.getSession();

          if (!session) {
            setErro(
              "Sua sessão expirou. Entre novamente no painel.",
            );

            return;
          }

          const resposta =
            await fetch(
              `/api/admin/dashboard?periodo=${periodo}`,
              {
                method:
                  "GET",

                headers: {
                  Authorization:
                    `Bearer ${session.access_token}`,
                },

                cache:
                  "no-store",
              },
            );

          const resultado =
            await resposta.json();

          if (
            !resposta.ok
          ) {
            throw new Error(
              resultado.erro ||
                "Não foi possível carregar o dashboard.",
            );
          }

          setDados(
            resultado as DashboardResposta,
          );
        } catch (error) {
          console.error(
            "Erro ao carregar dashboard:",
            error,
          );

          setErro(
            error instanceof
              Error
              ? error.message
              : "Não foi possível carregar o dashboard.",
          );
        } finally {
          setCarregando(
            false,
          );
        }
      },
      [periodo],
    );

  useEffect(() => {
    buscarDados();
  }, [buscarDados]);

  if (
    carregando &&
    !dados
  ) {
    return (
      <main className="min-h-screen bg-background p-5 md:p-10">
        <div className="mx-auto min-w-0 max-w-full">
          <div className="flex min-h-[420px] items-center justify-center rounded-3xl border border-border bg-card shadow">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-border border-t-primary" />

              <p className="mt-4 font-bold text-text-light">
                Carregando
                relatórios...
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (
    erro &&
    !dados
  ) {
    return (
      <main className="min-h-screen bg-background p-5 md:p-10">
        <div className="mx-auto min-w-0 max-w-full">
          <div className="rounded-3xl border border-border bg-card p-8 text-center shadow">
            <XCircle className="mx-auto h-12 w-12 text-danger" />

            <h1 className="mt-4 text-2xl font-black text-text">
              Não foi possível
              carregar o
              dashboard
            </h1>

            <p className="mt-2 text-text-light">
              {erro}
            </p>

            <button
              type="button"
              onClick={
                buscarDados
              }
              className="mt-6 rounded-xl bg-primary px-5 py-3 font-bold text-white transition hover:opacity-90"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!dados) {
    return null;
  }

  const {
    gerais,
    indicadores,
    vendasPorTipo,
    produtosMaisVendidos,
    evolucao,
    ultimosPedidos,
  } = dados;

  const maiorFaturamento =
    Math.max(
      ...evolucao.map(
        (item) =>
          item.faturamento,
      ),
      1,
    );

  const totalTipos =
    vendasPorTipo.fisicos +
    vendasPorTipo.digitais;

  const percentualFisicos =
    totalTipos > 0
      ? Math.round(
          (vendasPorTipo.fisicos /
            totalTipos) *
            100,
        )
      : 0;

  const percentualDigitais =
    totalTipos > 0
      ? 100 -
        percentualFisicos
      : 0;

  return (
    <main className="min-h-screen min-w-0 overflow-x-hidden bg-background p-4 md:p-6 lg:p-8">
      <div className="mx-auto min-w-0 max-w-full">
        <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="font-bold uppercase tracking-[0.16em] text-secondary">
              Lembrei de Você
              Store
            </p>

            <h1 className="mt-1 text-3xl font-black leading-tight text-text md:text-4xl">
              Dashboard
            </h1>

            <p className="mt-1.5 max-w-2xl text-sm text-text-light md:text-base">
              Acompanhe vendas,
              pedidos e
              desempenho da
              loja.
            </p>
          </div>

          <div className="grid w-full max-w-full grid-cols-2 gap-2 rounded-2xl border border-border bg-card p-2 shadow-sm sm:grid-cols-4 xl:w-auto">
            {periodos.map(
              (item) => (
                <button
                  key={
                    item.valor
                  }
                  type="button"
                  onClick={() =>
                    setPeriodo(
                      item.valor,
                    )
                  }
                  className={`min-w-0 rounded-xl px-3 py-2.5 text-sm font-black transition ${
                    periodo ===
                    item.valor
                      ? "bg-primary text-white shadow"
                      : "text-text-light hover:bg-[color-mix(in_srgb,var(--primary)_8%,white)] hover:text-primary"
                  }`}
                >
                  {
                    item.titulo
                  }
                </button>
              ),
            )}
          </div>
        </div>

        {erro && (
          <div className="mt-5 rounded-2xl border border-warning/30 bg-[color-mix(in_srgb,var(--warning)_8%,white)] p-4 text-sm font-bold text-warning">
            {erro}
          </div>
        )}

        <div className="mt-5 grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <CardIndicador
            titulo="Faturamento"
            valor={formatarMoeda(
              indicadores.faturamento,
            )}
            descricao={`${indicadores.pedidosPagos} pedido(s) pago(s)`}
            icone={
              <CircleDollarSign className="h-6 w-6" />
            }
          />

          <CardIndicador
            titulo="Pedidos pagos"
            valor={String(
              indicadores.pedidosPagos,
            )}
            descricao={`${indicadores.itensVendidos} item(ns) vendido(s)`}
            icone={
              <ShoppingBag className="h-6 w-6" />
            }
          />

          <CardIndicador
            titulo="Ticket médio"
            valor={formatarMoeda(
              indicadores.ticketMedio,
            )}
            descricao="Média por pedido pago"
            icone={
              <ReceiptText className="h-6 w-6" />
            }
          />

          <CardIndicador
            titulo="Frete arrecadado"
            valor={formatarMoeda(
              indicadores.freteArrecadado,
            )}
            descricao={`Produtos: ${formatarMoeda(
              indicadores.receitaProdutos,
            )}`}
            icone={
              <Truck className="h-6 w-6" />
            }
          />
        </div>

        <div className="mt-3 grid min-w-0 grid-cols-2 gap-2.5 xl:grid-cols-4">
          <CardResumo
            titulo="Pendentes"
            valor={
              indicadores.pedidosPendentes
            }
            classe="text-warning"
          />

          <CardResumo
            titulo="Cancelados"
            valor={
              indicadores.pedidosCancelados
            }
            classe="text-danger"
          />

          <CardResumo
            titulo="Itens vendidos"
            valor={
              indicadores.itensVendidos
            }
            classe="text-primary"
          />

          <CardResumo
            titulo="Clientes"
            valor={
              gerais.clientes
            }
            classe="text-secondary"
          />
        </div>

        <div className="mt-5 grid min-w-0 grid-cols-1 gap-4 2xl:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.8fr)]">
          <section className="min-w-0 rounded-2xl border border-border bg-card p-4 shadow-sm md:p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-black text-text">
                  Evolução das vendas
                </h2>

                <p className="mt-1 text-sm text-text-light">
                  Faturamento dos
                  pedidos pagos no
                  período.
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm font-bold text-text-light">
                <CalendarDays className="h-4 w-4 text-primary" />

                {
                  periodos.find(
                    (
                      item,
                    ) =>
                      item.valor ===
                      periodo,
                  )?.titulo
                }
              </div>
            </div>

            <div className="mt-5 flex h-52 min-w-0 items-end gap-2 overflow-x-auto border-b border-border pb-1">
              {evolucao.map(
                (item) => {
                  const altura =
                    item.faturamento >
                    0
                      ? Math.max(
                          8,
                          (item.faturamento /
                            maiorFaturamento) *
                            100,
                        )
                      : 2;

                  return (
                    <div
                      key={
                        item.chave
                      }
                      className="group flex min-w-[32px] flex-1 flex-col items-center justify-end"
                    >
                      <div className="relative flex h-44 w-full items-end justify-center">
                        <div
                          title={`${item.label}: ${formatarMoeda(
                            item.faturamento,
                          )} • ${item.pedidos} pedido(s)`}
                          className="w-full max-w-10 rounded-t-xl bg-primary transition hover:brightness-110"
                          style={{
                            height: `${altura}%`,
                          }}
                        />

                        <div className="pointer-events-none absolute bottom-full mb-2 hidden whitespace-nowrap rounded-lg bg-slate-950 px-2 py-1 text-[10px] font-bold text-white shadow group-hover:block">
                          {formatarMoeda(
                            item.faturamento,
                          )}
                        </div>
                      </div>

                      <span className="mt-2 text-[10px] font-bold text-text-light">
                        {
                          item.label
                        }
                      </span>
                    </div>
                  );
                },
              )}
            </div>
          </section>

          <section className="min-w-0 rounded-2xl border border-border bg-card p-4 shadow-sm md:p-5">
            <h2 className="text-xl font-black text-text">
              Vendas por tipo
            </h2>

            <p className="mt-1 text-sm text-text-light">
              Quantidade de itens
              vendidos.
            </p>

            <div className="mt-8 space-y-7">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-text">
                    Produtos
                    físicos
                  </span>

                  <strong className="text-primary">
                    {
                      vendasPorTipo.fisicos
                    }
                  </strong>
                </div>

                <div className="mt-2 h-3 overflow-hidden rounded-full bg-background">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{
                      width: `${percentualFisicos}%`,
                    }}
                  />
                </div>

                <p className="mt-1 text-right text-xs font-bold text-text-light">
                  {
                    percentualFisicos
                  }
                  %
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-text">
                    Produtos
                    digitais
                  </span>

                  <strong className="text-accent">
                    {
                      vendasPorTipo.digitais
                    }
                  </strong>
                </div>

                <div className="mt-2 h-3 overflow-hidden rounded-full bg-background">
                  <div
                    className="h-full rounded-full bg-accent transition-all"
                    style={{
                      width: `${percentualDigitais}%`,
                    }}
                  />
                </div>

                <p className="mt-1 text-right text-xs font-bold text-text-light">
                  {
                    percentualDigitais
                  }
                  %
                </p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 border-t border-border pt-6">
              <div className="rounded-2xl bg-[color-mix(in_srgb,var(--primary)_8%,white)] p-4">
                <Package className="h-5 w-5 text-primary" />

                <p className="mt-2 text-xs font-bold text-text-light">
                  Produtos
                  cadastrados
                </p>

                <strong className="mt-1 block text-2xl text-text">
                  {
                    gerais.produtos
                  }
                </strong>
              </div>

              <div className="rounded-2xl bg-[color-mix(in_srgb,var(--secondary)_10%,white)] p-4">
                <Users className="h-5 w-5 text-secondary" />

                <p className="mt-2 text-xs font-bold text-text-light">
                  Categorias
                </p>

                <strong className="mt-1 block text-2xl text-text">
                  {
                    gerais.categorias
                  }
                </strong>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-5 grid min-w-0 grid-cols-1 gap-5 2xl:grid-cols-2">
          <section className="min-w-0 rounded-2xl border border-border bg-card p-4 shadow-sm md:p-5">
            <div>
              <h2 className="text-xl font-black text-text">
                Produtos mais
                vendidos
              </h2>

              <p className="mt-1 text-sm text-text-light">
                Ranking por
                quantidade no
                período.
              </p>
            </div>

            {produtosMaisVendidos.length ===
            0 ? (
              <div className="mt-6 rounded-2xl bg-background p-8 text-center text-text-light">
                Ainda não existem
                vendas nesse
                período.
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                {produtosMaisVendidos.map(
                  (
                    produto,
                    index,
                  ) => (
                    <div
                      key={`${produto.nome}-${index}`}
                      className="flex items-center gap-4 rounded-2xl border border-border p-4"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--primary)_10%,white)] font-black text-primary">
                        {index +
                          1}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate font-black text-text">
                          {
                            produto.nome
                          }
                        </p>

                        <p className="mt-1 text-sm text-text-light">
                          {
                            produto.quantidade
                          }{" "}
                          unidade(s)
                        </p>
                      </div>

                      <strong className="text-sm text-primary">
                        {formatarMoeda(
                          produto.faturamento,
                        )}
                      </strong>
                    </div>
                  ),
                )}
              </div>
            )}
          </section>

          <section className="min-w-0 rounded-2xl border border-border bg-card p-4 shadow-sm md:p-5">
            <div>
              <h2 className="text-xl font-black text-text">
                Últimos pedidos
              </h2>

              <p className="mt-1 text-sm text-text-light">
                Pedidos registrados
                no período
                selecionado.
              </p>
            </div>

            {ultimosPedidos.length ===
            0 ? (
              <div className="mt-6 rounded-2xl bg-background p-8 text-center text-text-light">
                Nenhum pedido
                encontrado.
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                {ultimosPedidos.map(
                  (pedido) => {
                    const status =
                      formatarStatus(
                        pedido.status,
                      );

                    return (
                      <div
                        key={
                          pedido.id
                        }
                        className="rounded-2xl border border-border p-4"
                      >
                        <div className="flex min-w-0 items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-black text-text">
                              Pedido
                              LVS-
                              {String(
                                pedido.id,
                              ).padStart(
                                6,
                                "0",
                              )}
                            </p>

                            <p className="mt-1 truncate text-sm text-text-light">
                              {
                                pedido.cliente
                              }
                            </p>
                          </div>

                          <span
                            className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-black ${status.classe}`}
                          >
                            {
                              status.texto
                            }
                          </span>
                        </div>

                        <div className="mt-4 flex items-end justify-between gap-4">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-text-light">
                            <Clock3 className="h-3.5 w-3.5" />

                            {pedido.created_at
                              ? new Date(
                                  pedido.created_at,
                                ).toLocaleString(
                                  "pt-BR",
                                )
                              : "Data não informada"}
                          </div>

                          <strong className="text-lg text-primary">
                            {formatarMoeda(
                              pedido.total,
                            )}
                          </strong>
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            )}
          </section>
        </div>

        <div className="mt-5 grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-4">
          <CardGeral
            titulo="Produtos"
            valor={
              gerais.produtos
            }
          />

          <CardGeral
            titulo="Categorias"
            valor={
              gerais.categorias
            }
          />

          <CardGeral
            titulo="Clientes"
            valor={
              gerais.clientes
            }
          />

          <CardGeral
            titulo="Pedidos totais"
            valor={
              gerais.pedidos
            }
          />
        </div>
      </div>
    </main>
  );
}

function CardIndicador({
  titulo,
  valor,
  descricao,
  icone,
}: {
  titulo: string;
  valor: string;
  descricao: string;
  icone: React.ReactNode;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-border bg-card p-3.5 shadow-sm">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-bold text-text-light">
            {titulo}
          </p>

          <strong className="mt-1.5 block break-words text-xl font-black leading-tight text-text md:text-2xl">
            {valor}
          </strong>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--primary)_8%,white)] text-primary">
          {icone}
        </div>
      </div>

      <p className="mt-2 text-xs font-medium text-text-light">
        {descricao}
      </p>
    </div>
  );
}

function CardResumo({
  titulo,
  valor,
  classe,
}: {
  titulo: string;
  valor: number;
  classe: string;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-border bg-card p-3.5 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wide text-text-light">
        {titulo}
      </p>

      <strong
        className={`mt-0.5 block text-xl font-black ${classe}`}
      >
        {valor}
      </strong>
    </div>
  );
}

function CardGeral({
  titulo,
  valor,
}: {
  titulo: string;
  valor: number;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-border bg-card p-4 text-center">
      <p className="text-xs font-bold text-text-light">
        {titulo}
      </p>

      <strong className="mt-1 block text-2xl font-black text-text">
        {valor}
      </strong>
    </div>
  );
}
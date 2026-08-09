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

function formatarStatus(status: string) {
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
          "bg-green-100 text-green-700",
      };

    case "em_producao":
      return {
        texto: "Em produção",
        classe:
          "bg-orange-100 text-orange-700",
      };

    case "pronto":
      return {
        texto: "Pronto",
        classe:
          "bg-blue-100 text-blue-700",
      };

    case "enviado":
      return {
        texto: "Enviado",
        classe:
          "bg-purple-100 text-purple-700",
      };

    case "finalizado":
      return {
        texto: "Finalizado",
        classe:
          "bg-emerald-100 text-emerald-700",
      };

    case "cancelado":
      return {
        texto: "Cancelado",
        classe:
          "bg-red-100 text-red-700",
      };

    default:
      return {
        texto: "Pendente",
        classe:
          "bg-yellow-100 text-yellow-700",
      };
  }
}

export default function DashboardAdmin() {
  const [periodo, setPeriodo] =
    useState<Periodo>("mes");

  const [dados, setDados] =
    useState<DashboardResposta | null>(
      null,
    );

  const [carregando, setCarregando] =
    useState(true);

  const [erro, setErro] =
    useState("");

  const buscarDados =
    useCallback(async () => {
      try {
        setCarregando(true);
        setErro("");

        const {
          data: { session },
        } =
          await supabase.auth.getSession();

        if (!session) {
          setErro(
            "Sua sessão expirou. Entre novamente no painel.",
          );

          return;
        }

        const resposta = await fetch(
          `/api/admin/dashboard?periodo=${periodo}`,
          {
            method: "GET",

            headers: {
              Authorization:
                `Bearer ${session.access_token}`,
            },

            cache: "no-store",
          },
        );

        const resultado =
          await resposta.json();

        if (!resposta.ok) {
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
          error instanceof Error
            ? error.message
            : "Não foi possível carregar o dashboard.",
        );
      } finally {
        setCarregando(false);
      }
    }, [periodo]);

  useEffect(() => {
    buscarDados();
  }, [buscarDados]);

  if (carregando && !dados) {
    return (
      <main className="min-h-screen bg-pink-50 p-5 md:p-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex min-h-[420px] items-center justify-center rounded-3xl bg-white shadow">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-pink-100 border-t-pink-500" />

              <p className="mt-4 font-bold text-gray-600">
                Carregando relatórios...
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (erro && !dados) {
    return (
      <main className="min-h-screen bg-pink-50 p-5 md:p-10">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl bg-white p-8 text-center shadow">
            <XCircle className="mx-auto h-12 w-12 text-red-500" />

            <h1 className="mt-4 text-2xl font-black text-gray-800">
              Não foi possível carregar o dashboard
            </h1>

            <p className="mt-2 text-gray-500">
              {erro}
            </p>

            <button
              type="button"
              onClick={buscarDados}
              className="mt-6 rounded-xl bg-pink-500 px-5 py-3 font-bold text-white transition hover:bg-pink-600"
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
        (item) => item.faturamento,
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
      ? 100 - percentualFisicos
      : 0;

  return (
    <main className="min-h-screen bg-pink-50 p-4 md:p-8 lg:p-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-bold uppercase tracking-[0.16em] text-pink-500">
              Lembrei de Você Store
            </p>

            <h1 className="mt-1 text-3xl font-black text-gray-900 md:text-5xl">
              Dashboard
            </h1>

            <p className="mt-2 max-w-2xl text-gray-500">
              Acompanhe vendas, pedidos e desempenho da loja.
            </p>
          </div>

          <div className="flex max-w-full gap-2 overflow-x-auto rounded-2xl bg-white p-2 shadow-sm">
            {periodos.map((item) => (
              <button
                key={item.valor}
                type="button"
                onClick={() =>
                  setPeriodo(item.valor)
                }
                className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-black transition ${
                  periodo === item.valor
                    ? "bg-pink-500 text-white shadow"
                    : "text-gray-500 hover:bg-pink-50 hover:text-pink-600"
                }`}
              >
                {item.titulo}
              </button>
            ))}
          </div>
        </div>

        {erro && (
          <div className="mt-5 rounded-2xl border border-yellow-200 bg-yellow-50 p-4 text-sm font-bold text-yellow-700">
            {erro}
          </div>
        )}

        <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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

        <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <CardResumo
            titulo="Pendentes"
            valor={
              indicadores.pedidosPendentes
            }
            classe="text-yellow-600"
          />

          <CardResumo
            titulo="Cancelados"
            valor={
              indicadores.pedidosCancelados
            }
            classe="text-red-500"
          />

          <CardResumo
            titulo="Itens vendidos"
            valor={
              indicadores.itensVendidos
            }
            classe="text-pink-500"
          />

          <CardResumo
            titulo="Clientes"
            valor={gerais.clientes}
            classe="text-blue-600"
          />
        </div>

        <div className="mt-7 grid grid-cols-1 gap-6 xl:grid-cols-[1.55fr_0.85fr]">
          <section className="rounded-3xl bg-white p-5 shadow-sm md:p-7">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-black text-gray-800">
                  Evolução das vendas
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Faturamento dos pedidos pagos no período.
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                <CalendarDays className="h-4 w-4 text-pink-500" />
                {periodos.find(
                  (item) =>
                    item.valor === periodo,
                )?.titulo}
              </div>
            </div>

            <div className="mt-8 flex h-64 items-end gap-2 overflow-x-auto border-b border-gray-100 pb-1">
              {evolucao.map(
                (item) => {
                  const altura =
                    item.faturamento > 0
                      ? Math.max(
                          8,
                          (item.faturamento /
                            maiorFaturamento) *
                            100,
                        )
                      : 2;

                  return (
                    <div
                      key={item.chave}
                      className="group flex min-w-[32px] flex-1 flex-col items-center justify-end"
                    >
                      <div className="relative flex h-52 w-full items-end justify-center">
                        <div
                          title={`${item.label}: ${formatarMoeda(
                            item.faturamento,
                          )} • ${item.pedidos} pedido(s)`}
                          className="w-full max-w-10 rounded-t-xl bg-pink-400 transition hover:bg-pink-500"
                          style={{
                            height: `${altura}%`,
                          }}
                        />

                        <div className="pointer-events-none absolute bottom-full mb-2 hidden whitespace-nowrap rounded-lg bg-gray-950 px-2 py-1 text-[10px] font-bold text-white shadow group-hover:block">
                          {formatarMoeda(
                            item.faturamento,
                          )}
                        </div>
                      </div>

                      <span className="mt-2 text-[10px] font-bold text-gray-400">
                        {item.label}
                      </span>
                    </div>
                  );
                },
              )}
            </div>
          </section>

          <section className="rounded-3xl bg-white p-5 shadow-sm md:p-7">
            <h2 className="text-xl font-black text-gray-800">
              Vendas por tipo
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Quantidade de itens vendidos.
            </p>

            <div className="mt-8 space-y-7">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-700">
                    Produtos físicos
                  </span>

                  <strong className="text-pink-500">
                    {vendasPorTipo.fisicos}
                  </strong>
                </div>

                <div className="mt-2 h-3 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-pink-500 transition-all"
                    style={{
                      width: `${percentualFisicos}%`,
                    }}
                  />
                </div>

                <p className="mt-1 text-right text-xs font-bold text-gray-400">
                  {percentualFisicos}%
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-700">
                    Produtos digitais
                  </span>

                  <strong className="text-purple-500">
                    {vendasPorTipo.digitais}
                  </strong>
                </div>

                <div className="mt-2 h-3 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-purple-500 transition-all"
                    style={{
                      width: `${percentualDigitais}%`,
                    }}
                  />
                </div>

                <p className="mt-1 text-right text-xs font-bold text-gray-400">
                  {percentualDigitais}%
                </p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 border-t pt-6">
              <div className="rounded-2xl bg-pink-50 p-4">
                <Package className="h-5 w-5 text-pink-500" />

                <p className="mt-2 text-xs font-bold text-gray-500">
                  Produtos cadastrados
                </p>

                <strong className="mt-1 block text-2xl text-gray-800">
                  {gerais.produtos}
                </strong>
              </div>

              <div className="rounded-2xl bg-purple-50 p-4">
                <Users className="h-5 w-5 text-purple-500" />

                <p className="mt-2 text-xs font-bold text-gray-500">
                  Categorias
                </p>

                <strong className="mt-1 block text-2xl text-gray-800">
                  {gerais.categorias}
                </strong>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
          <section className="rounded-3xl bg-white p-5 shadow-sm md:p-7">
            <div>
              <h2 className="text-xl font-black text-gray-800">
                Produtos mais vendidos
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Ranking por quantidade no período.
              </p>
            </div>

            {produtosMaisVendidos.length ===
            0 ? (
              <div className="mt-6 rounded-2xl bg-gray-50 p-8 text-center text-gray-400">
                Ainda não existem vendas nesse período.
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                {produtosMaisVendidos.map(
                  (produto, index) => (
                    <div
                      key={`${produto.nome}-${index}`}
                      className="flex items-center gap-4 rounded-2xl border border-gray-100 p-4"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pink-50 font-black text-pink-500">
                        {index + 1}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate font-black text-gray-800">
                          {produto.nome}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          {produto.quantidade} unidade(s)
                        </p>
                      </div>

                      <strong className="text-sm text-pink-500">
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

          <section className="rounded-3xl bg-white p-5 shadow-sm md:p-7">
            <div>
              <h2 className="text-xl font-black text-gray-800">
                Últimos pedidos
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Pedidos registrados no período selecionado.
              </p>
            </div>

            {ultimosPedidos.length === 0 ? (
              <div className="mt-6 rounded-2xl bg-gray-50 p-8 text-center text-gray-400">
                Nenhum pedido encontrado.
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
                        key={pedido.id}
                        className="rounded-2xl border border-gray-100 p-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className="font-black text-gray-800">
                              Pedido LVS-
                              {String(
                                pedido.id,
                              ).padStart(
                                6,
                                "0",
                              )}
                            </p>

                            <p className="mt-1 truncate text-sm text-gray-500">
                              {pedido.cliente}
                            </p>
                          </div>

                          <span
                            className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-black ${status.classe}`}
                          >
                            {status.texto}
                          </span>
                        </div>

                        <div className="mt-4 flex items-end justify-between gap-4">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                            <Clock3 className="h-3.5 w-3.5" />

                            {pedido.created_at
                              ? new Date(
                                  pedido.created_at,
                                ).toLocaleString(
                                  "pt-BR",
                                )
                              : "Data não informada"}
                          </div>

                          <strong className="text-lg text-pink-500">
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

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <CardGeral
            titulo="Produtos"
            valor={gerais.produtos}
          />

          <CardGeral
            titulo="Categorias"
            valor={gerais.categorias}
          />

          <CardGeral
            titulo="Clientes"
            valor={gerais.clientes}
          />

          <CardGeral
            titulo="Pedidos totais"
            valor={gerais.pedidos}
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
    <div className="rounded-3xl bg-white p-5 shadow-sm md:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-bold text-gray-500">
            {titulo}
          </p>

          <strong className="mt-2 block text-2xl font-black text-gray-900 md:text-3xl">
            {valor}
          </strong>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-pink-50 text-pink-500">
          {icone}
        </div>
      </div>

      <p className="mt-3 text-xs font-medium text-gray-400">
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
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
        {titulo}
      </p>

      <strong
        className={`mt-1 block text-2xl font-black ${classe}`}
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
    <div className="rounded-2xl border border-pink-100 bg-white p-4 text-center">
      <p className="text-xs font-bold text-gray-400">
        {titulo}
      </p>

      <strong className="mt-1 block text-2xl font-black text-gray-800">
        {valor}
      </strong>
    </div>
  );
}
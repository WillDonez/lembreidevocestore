import {
  NextRequest,
  NextResponse,
} from "next/server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

type PeriodoDashboard =
  | "hoje"
  | "semana"
  | "mes"
  | "ano";

type ProdutoPedido = {
  id?: number;
  nome?: string;
  preco?: number;
  quantidade?: number;
  tipo_produto?: string;
};

type Pedido = {
  id: number;
  total?: number;
  subtotal?: number;
  frete_valor?: number;
  status?: string;
  produtos?: ProdutoPedido[];
  created_at?: string;
  nome_cliente?: string;
  cliente?: string;
  email_cliente?: string;
};

const TIMEZONE =
  "America/Sao_Paulo";

const STATUS_PAGOS = new Set([
  "aprovado",
  "pago",
  "em_producao",
  "pronto",
  "enviado",
  "finalizado",
]);

function normalizarStatus(
  status?: string,
) {
  return String(status || "")
    .trim()
    .toLowerCase();
}

function obterPartesData(
  valor: string | Date,
) {
  const data =
    valor instanceof Date
      ? valor
      : new Date(valor);

  const partes =
    new Intl.DateTimeFormat(
      "en-CA",
      {
        timeZone: TIMEZONE,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        hourCycle: "h23",
      },
    ).formatToParts(data);

  function obter(
    tipo:
      | "year"
      | "month"
      | "day"
      | "hour",
  ) {
    return Number(
      partes.find(
        (parte) =>
          parte.type === tipo,
      )?.value || 0,
    );
  }

  return {
    ano: obter("year"),
    mes: obter("month"),
    dia: obter("day"),
    hora: obter("hour"),
  };
}

function numeroDia(
  ano: number,
  mes: number,
  dia: number,
) {
  return Date.UTC(
    ano,
    mes - 1,
    dia,
  );
}

function pedidoEstaNoPeriodo(
  pedido: Pedido,
  periodo: PeriodoDashboard,
  agora: Date,
) {
  if (!pedido.created_at) {
    return false;
  }

  const pedidoData =
    obterPartesData(
      pedido.created_at,
    );

  const hoje =
    obterPartesData(agora);

  if (periodo === "hoje") {
    return (
      pedidoData.ano === hoje.ano &&
      pedidoData.mes === hoje.mes &&
      pedidoData.dia === hoje.dia
    );
  }

  if (periodo === "semana") {
    const hojeNumero =
      numeroDia(
        hoje.ano,
        hoje.mes,
        hoje.dia,
      );

    const pedidoNumero =
      numeroDia(
        pedidoData.ano,
        pedidoData.mes,
        pedidoData.dia,
      );

    const diferencaDias =
      Math.floor(
        (hojeNumero -
          pedidoNumero) /
          86400000,
      );

    return (
      diferencaDias >= 0 &&
      diferencaDias <= 6
    );
  }

  if (periodo === "mes") {
    return (
      pedidoData.ano === hoje.ano &&
      pedidoData.mes === hoje.mes
    );
  }

  return (
    pedidoData.ano === hoje.ano
  );
}

function criarEvolucao(
  pedidosPagos: Pedido[],
  periodo: PeriodoDashboard,
  agora: Date,
) {
  const hoje =
    obterPartesData(agora);

  if (periodo === "hoje") {
    return Array.from(
      { length: 24 },
      (_, hora) => {
        const pedidosHora =
          pedidosPagos.filter(
            (pedido) => {
              if (
                !pedido.created_at
              ) {
                return false;
              }

              return (
                obterPartesData(
                  pedido.created_at,
                ).hora === hora
              );
            },
          );

        return {
          chave: String(hora),
          label: `${String(
            hora,
          ).padStart(2, "0")}h`,
          faturamento:
            pedidosHora.reduce(
              (total, pedido) =>
                total +
                Number(
                  pedido.total || 0,
                ),
              0,
            ),
          pedidos:
            pedidosHora.length,
        };
      },
    );
  }

  if (periodo === "semana") {
    return Array.from(
      { length: 7 },
      (_, indice) => {
        const dataBase = new Date(
          Date.UTC(
            hoje.ano,
            hoje.mes - 1,
            hoje.dia - (6 - indice),
          ),
        );

        const ano =
          dataBase.getUTCFullYear();

        const mes =
          dataBase.getUTCMonth() +
          1;

        const dia =
          dataBase.getUTCDate();

        const pedidosDia =
          pedidosPagos.filter(
            (pedido) => {
              if (
                !pedido.created_at
              ) {
                return false;
              }

              const partes =
                obterPartesData(
                  pedido.created_at,
                );

              return (
                partes.ano === ano &&
                partes.mes === mes &&
                partes.dia === dia
              );
            },
          );

        return {
          chave:
            `${ano}-${mes}-${dia}`,
          label:
            `${String(dia).padStart(
              2,
              "0",
            )}/${String(
              mes,
            ).padStart(2, "0")}`,
          faturamento:
            pedidosDia.reduce(
              (total, pedido) =>
                total +
                Number(
                  pedido.total || 0,
                ),
              0,
            ),
          pedidos:
            pedidosDia.length,
        };
      },
    );
  }

  if (periodo === "mes") {
    const quantidadeDias =
      new Date(
        Date.UTC(
          hoje.ano,
          hoje.mes,
          0,
        ),
      ).getUTCDate();

    return Array.from(
      {
        length:
          quantidadeDias,
      },
      (_, indice) => {
        const dia =
          indice + 1;

        const pedidosDia =
          pedidosPagos.filter(
            (pedido) => {
              if (
                !pedido.created_at
              ) {
                return false;
              }

              const partes =
                obterPartesData(
                  pedido.created_at,
                );

              return (
                partes.ano ===
                  hoje.ano &&
                partes.mes ===
                  hoje.mes &&
                partes.dia === dia
              );
            },
          );

        return {
          chave:
            String(dia),
          label:
            String(dia).padStart(
              2,
              "0",
            ),
          faturamento:
            pedidosDia.reduce(
              (total, pedido) =>
                total +
                Number(
                  pedido.total || 0,
                ),
              0,
            ),
          pedidos:
            pedidosDia.length,
        };
      },
    );
  }

  const nomesMeses = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];

  return Array.from(
    { length: 12 },
    (_, indice) => {
      const mes =
        indice + 1;

      const pedidosMes =
        pedidosPagos.filter(
          (pedido) => {
            if (
              !pedido.created_at
            ) {
              return false;
            }

            const partes =
              obterPartesData(
                pedido.created_at,
              );

            return (
              partes.ano ===
                hoje.ano &&
              partes.mes === mes
            );
          },
        );

      return {
        chave:
          String(mes),
        label:
          nomesMeses[indice],
        faturamento:
          pedidosMes.reduce(
            (total, pedido) =>
              total +
              Number(
                pedido.total || 0,
              ),
            0,
          ),
        pedidos:
          pedidosMes.length,
      };
    },
  );
}

export async function GET(
  request: NextRequest,
) {
  try {
    const authorization =
      request.headers.get(
        "authorization",
      );

    if (
      !authorization?.startsWith(
        "Bearer ",
      )
    ) {
      return NextResponse.json(
        {
          erro:
            "Usuário não autenticado.",
        },
        {
          status: 401,
        },
      );
    }

    const accessToken =
      authorization
        .replace(
          "Bearer ",
          "",
        )
        .trim();

    const {
      data: { user },
      error: usuarioErro,
    } =
      await supabaseAdmin.auth.getUser(
        accessToken,
      );

    if (
      usuarioErro ||
      !user
    ) {
      return NextResponse.json(
        {
          erro:
            "Sessão inválida ou expirada.",
        },
        {
          status: 401,
        },
      );
    }

    const {
      data: perfil,
      error: perfilErro,
    } = await supabaseAdmin
      .from("clientes")
      .select("role")
      .eq(
        "auth_user_id",
        user.id,
      )
      .single();

    if (
      perfilErro ||
      !perfil ||
      perfil.role !== "admin"
    ) {
      return NextResponse.json(
        {
          erro:
            "Acesso permitido somente para administradores.",
        },
        {
          status: 403,
        },
      );
    }

    const periodoRecebido =
      request.nextUrl.searchParams.get(
        "periodo",
      );

    const periodo:
      PeriodoDashboard =
      periodoRecebido ===
        "hoje" ||
      periodoRecebido ===
        "semana" ||
      periodoRecebido ===
        "mes" ||
      periodoRecebido ===
        "ano"
        ? periodoRecebido
        : "mes";

    const [
      produtosResultado,
      categoriasResultado,
      pedidosResultado,
      clientesResultado,
    ] = await Promise.all([
      supabaseAdmin
        .from("produtos")
        .select("id"),

      supabaseAdmin
        .from("categorias")
        .select("id"),

      supabaseAdmin
        .from("pedidos")
        .select(
          `
            id,
            total,
            subtotal,
            frete_valor,
            status,
            produtos,
            created_at,
            nome_cliente,
            cliente,
            email_cliente
          `,
        )
        .order(
          "created_at",
          {
            ascending: false,
          },
        ),

      supabaseAdmin
        .from("clientes")
        .select("id, role"),
    ]);

    const erro =
      produtosResultado.error ||
      categoriasResultado.error ||
      pedidosResultado.error ||
      clientesResultado.error;

    if (erro) {
      console.error(
        "Erro ao carregar dashboard administrativo:",
        erro,
      );

      return NextResponse.json(
        {
          erro:
            "Não foi possível carregar os dados do painel.",
        },
        {
          status: 500,
        },
      );
    }

    const pedidos =
      (pedidosResultado.data ||
        []) as Pedido[];

    const agora =
      new Date();

    const pedidosPeriodo =
      pedidos.filter((pedido) =>
        pedidoEstaNoPeriodo(
          pedido,
          periodo,
          agora,
        ),
      );

    const pedidosPagos =
      pedidosPeriodo.filter(
        (pedido) =>
          STATUS_PAGOS.has(
            normalizarStatus(
              pedido.status,
            ),
          ),
      );

    const pedidosPendentes =
      pedidosPeriodo.filter(
        (pedido) =>
          normalizarStatus(
            pedido.status,
          ) === "pendente",
      );

    const pedidosCancelados =
      pedidosPeriodo.filter(
        (pedido) =>
          normalizarStatus(
            pedido.status,
          ) === "cancelado",
      );

    const faturamento =
      pedidosPagos.reduce(
        (total, pedido) =>
          total +
          Number(
            pedido.total || 0,
          ),
        0,
      );

    const receitaProdutos =
      pedidosPagos.reduce(
        (total, pedido) =>
          total +
          Number(
            pedido.subtotal || 0,
          ),
        0,
      );

    const freteArrecadado =
      pedidosPagos.reduce(
        (total, pedido) =>
          total +
          Number(
            pedido.frete_valor ||
              0,
          ),
        0,
      );

    const ticketMedio =
      pedidosPagos.length > 0
        ? faturamento /
          pedidosPagos.length
        : 0;

    const itensVendidos =
      pedidosPagos.reduce(
        (total, pedido) => {
          const produtos =
            Array.isArray(
              pedido.produtos,
            )
              ? pedido.produtos
              : [];

          return (
            total +
            produtos.reduce(
              (
                soma,
                produto,
              ) =>
                soma +
                Number(
                  produto.quantidade ||
                    1,
                ),
              0,
            )
          );
        },
        0,
      );

    const rankingProdutos =
      new Map<
        string,
        {
          nome: string;
          quantidade: number;
          faturamento: number;
        }
      >();

    let quantidadeFisicos = 0;
    let quantidadeDigitais = 0;

    pedidosPagos.forEach(
      (pedido) => {
        const produtos =
          Array.isArray(
            pedido.produtos,
          )
            ? pedido.produtos
            : [];

        produtos.forEach(
          (produto) => {
            const quantidade =
              Number(
                produto.quantidade ||
                  1,
              );

            const nome =
              produto.nome ||
              "Produto";

            const chave =
              String(
                produto.id ??
                  nome,
              );

            const atual =
              rankingProdutos.get(
                chave,
              ) || {
                nome,
                quantidade: 0,
                faturamento: 0,
              };

            atual.quantidade +=
              quantidade;

            atual.faturamento +=
              Number(
                produto.preco || 0,
              ) * quantidade;

            rankingProdutos.set(
              chave,
              atual,
            );

            const tipo =
              String(
                produto.tipo_produto ||
                  "",
              ).toLowerCase();

            if (
              tipo === "pdf" ||
              tipo === "digital"
            ) {
              quantidadeDigitais +=
                quantidade;
            } else {
              quantidadeFisicos +=
                quantidade;
            }
          },
        );
      },
    );

    const produtosMaisVendidos =
      Array.from(
        rankingProdutos.values(),
      )
        .sort(
          (a, b) =>
            b.quantidade -
            a.quantidade,
        )
        .slice(0, 5);

    const clientes =
      (
        clientesResultado.data ||
        []
      ).filter(
        (cliente) =>
          cliente.role !== "admin",
      );

    const evolucao =
      criarEvolucao(
        pedidosPagos,
        periodo,
        agora,
      );

    const ultimosPedidos =
      pedidosPeriodo
        .slice(0, 5)
        .map((pedido) => ({
          id: pedido.id,
          cliente:
            pedido.nome_cliente ||
            pedido.cliente ||
            "Cliente",
          email:
            pedido.email_cliente ||
            "",
          total:
            Number(
              pedido.total || 0,
            ),
          status:
            pedido.status ||
            "pendente",
          created_at:
            pedido.created_at,
        }));

    return NextResponse.json({
      periodo,

      gerais: {
        produtos:
          produtosResultado.data
            ?.length || 0,

        categorias:
          categoriasResultado.data
            ?.length || 0,

        clientes:
          clientes.length,

        pedidos:
          pedidos.length,
      },

      indicadores: {
        faturamento,
        receitaProdutos,
        freteArrecadado,
        pedidosPagos:
          pedidosPagos.length,
        pedidosPendentes:
          pedidosPendentes.length,
        pedidosCancelados:
          pedidosCancelados.length,
        ticketMedio,
        itensVendidos,
      },

      vendasPorTipo: {
        fisicos:
          quantidadeFisicos,
        digitais:
          quantidadeDigitais,
      },

      produtosMaisVendidos,

      evolucao,

      ultimosPedidos,
    });
  } catch (error) {
    console.error(
      "Erro interno no dashboard administrativo:",
      error,
    );

    return NextResponse.json(
      {
        erro:
          "Ocorreu um erro interno no painel administrativo.",
      },
      {
        status: 500,
      },
    );
  }
}
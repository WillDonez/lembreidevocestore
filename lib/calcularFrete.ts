import "server-only";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

import {
  obterAccessTokenMelhorEnvio,
  obterConfiguracaoMelhorEnvio,
} from "@/lib/melhorEnvio";

export type ItemCarrinhoFrete = {
  produtoId?: number | string;
  quantidade?: number;
};

export type CalcularFreteBody = {
  cepDestino?: string;
  itens?: ItemCarrinhoFrete[];
};

export type ResultadoCalculoFrete = {
  status: number;
  dados: Record<string, unknown>;
};

type LogisticaProduto = {
  peso?: number | string;
  largura?: number | string;
  altura?: number | string;
  comprimento?: number | string;
  valor_declarado?: number | string;
  frete_ativo?: boolean;
};

type ProdutoBanco = {
  id: number;
  nome?: string;
  preco?: number | string;
  tipo_produto?: string;
  produto_logistica?:
    | LogisticaProduto
    | LogisticaProduto[]
    | null;
};

type ServicoMelhorEnvio = {
  id?: number | string;
  name?: string;
  error?: string | boolean | null;
  custom_price?: number | string;
  price?: number | string;
  custom_delivery_time?: number | string;
  delivery_time?: number | string;
  currency?: string;
  company?: {
    id?: number | string;
    name?: string;
    picture?: string;
  };
};

function limparCep(cep: string): string {
  return cep.replace(/\D/g, "");
}

function obterLogistica(
  produto: ProdutoBanco
): LogisticaProduto | null {
  if (Array.isArray(produto.produto_logistica)) {
    return produto.produto_logistica[0] || null;
  }

  return produto.produto_logistica || null;
}

function normalizarItens(
  itens: ItemCarrinhoFrete[]
): Array<{
  produtoId: number;
  quantidade: number;
}> {
  const quantidadesPorProduto =
    new Map<number, number>();

  for (const item of itens) {
    const produtoId = Number(item.produtoId);
    const quantidade = Number(
      item.quantidade ?? 1
    );

    if (
      !Number.isInteger(produtoId) ||
      produtoId <= 0 ||
      !Number.isInteger(quantidade) ||
      quantidade <= 0
    ) {
      continue;
    }

    const quantidadeAtual =
      quantidadesPorProduto.get(produtoId) || 0;

    quantidadesPorProduto.set(
      produtoId,
      quantidadeAtual + quantidade
    );
  }

  return Array.from(
    quantidadesPorProduto.entries()
  ).map(([produtoId, quantidade]) => ({
    produtoId,
    quantidade,
  }));
}

export async function calcularFrete(
  body: CalcularFreteBody
): Promise<ResultadoCalculoFrete> {
  try {
    const cepOrigem = limparCep(
      process.env.MELHOR_ENVIO_CEP_ORIGEM || ""
    );

    const cepDestino = limparCep(
      body.cepDestino || ""
    );

    const itens = normalizarItens(
      body.itens || []
    );

    if (cepOrigem.length !== 8) {
      return {
        status: 500,
        dados: {
          erro:
            "O CEP de origem não está configurado corretamente.",
        },
      };
    }

    if (cepDestino.length !== 8) {
      return {
        status: 400,
        dados: {
          erro:
            "Informe um CEP válido com 8 números.",
        },
      };
    }

    if (itens.length === 0) {
      return {
        status: 400,
        dados: {
          erro:
            "O carrinho não possui produtos válidos.",
        },
      };
    }

    const idsProdutos = itens.map(
      (item) => item.produtoId
    );

    const { data, error } = await supabaseAdmin
      .from("produtos")
      .select(`
        id,
        nome,
        preco,
        tipo_produto,
        produto_logistica (
          peso,
          largura,
          altura,
          comprimento,
          valor_declarado,
          frete_ativo
        )
      `)
      .in("id", idsProdutos);

    if (error) {
      console.error(
        "Erro ao consultar logística dos produtos:",
        error
      );

      return {
        status: 500,
        dados: {
          erro:
            "Não foi possível consultar os dados de envio.",
        },
      };
    }

    const produtos =
      (data || []) as ProdutoBanco[];

    if (produtos.length !== idsProdutos.length) {
      return {
        status: 400,
        dados: {
          erro:
            "Um ou mais produtos do carrinho não foram encontrados.",
        },
      };
    }

    const produtosFisicos = produtos.filter(
      (produto) =>
        produto.tipo_produto === "fisico"
    );

    if (produtosFisicos.length === 0) {
      return {
        status: 200,
        dados: {
          sucesso: true,
          freteNecessario: false,
          mensagem:
            "O carrinho possui apenas produtos digitais.",
          opcoes: [],
        },
      };
    }

    const produtosMelhorEnvio: Array<{
      id: string;
      width: number;
      height: number;
      length: number;
      weight: number;
      insurance_value: number;
      quantity: number;
    }> = [];

    for (const produto of produtosFisicos) {
      const logistica =
        obterLogistica(produto);

      if (!logistica) {
        return {
          status: 400,
          dados: {
            erro: `O produto "${
              produto.nome || produto.id
            }" não possui informações de logística.`,
          },
        };
      }

      if (!logistica.frete_ativo) {
        return {
          status: 400,
          dados: {
            erro: `O cálculo de frete está desativado para o produto "${
              produto.nome || produto.id
            }".`,
          },
        };
      }

      const peso = Number(logistica.peso);
      const largura = Number(
        logistica.largura
      );
      const altura = Number(logistica.altura);
      const comprimento = Number(
        logistica.comprimento
      );

      const valorDeclarado = Number(
        logistica.valor_declarado ||
          produto.preco ||
          0
      );

      if (
        !Number.isFinite(peso) ||
        peso <= 0 ||
        !Number.isFinite(largura) ||
        largura <= 0 ||
        !Number.isFinite(altura) ||
        altura <= 0 ||
        !Number.isFinite(comprimento) ||
        comprimento <= 0
      ) {
        return {
          status: 400,
          dados: {
            erro: `As medidas de envio do produto "${
              produto.nome || produto.id
            }" estão incompletas.`,
          },
        };
      }

      const itemCarrinho = itens.find(
        (item) =>
          item.produtoId === produto.id
      );

      produtosMelhorEnvio.push({
        id: String(produto.id),
        width: largura,
        height: altura,
        length: comprimento,
        weight: peso,
        insurance_value:
          Number.isFinite(valorDeclarado) &&
          valorDeclarado >= 0
            ? valorDeclarado
            : 0,
        quantity:
          itemCarrinho?.quantidade || 1,
      });
    }

    const accessToken =
      await obterAccessTokenMelhorEnvio();

    const { baseUrl, userAgent } =
      obterConfiguracaoMelhorEnvio();

    const resposta = await fetch(
      `${baseUrl}/api/v2/me/shipment/calculate`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "User-Agent": userAgent,
        },
        body: JSON.stringify({
          from: {
            postal_code: cepOrigem,
          },
          to: {
            postal_code: cepDestino,
          },
          products: produtosMelhorEnvio,
          options: {
            receipt: false,
            own_hand: false,
          },
        }),
        cache: "no-store",
      }
    );

    const dados: unknown =
      await resposta.json();

    if (!resposta.ok) {
      console.error(
        "Erro retornado pelo Melhor Envio:",
        dados
      );

      return {
        status: resposta.status,
        dados: {
          erro:
            "Não foi possível calcular o frete.",
          detalhes: dados,
        },
      };
    }

    const servicos = Array.isArray(dados)
      ? (dados as ServicoMelhorEnvio[])
      : [];

    const opcoes = servicos
      .filter(
        (servico) =>
          !servico.error &&
          (servico.custom_price ||
            servico.price)
      )
      .map((servico) => ({
        id: servico.id,
        nome: servico.name,
        transportadora:
          servico.company?.name ||
          "Transportadora",
        preco: Number(
          servico.custom_price ||
            servico.price
        ),
        prazo: Number(
          servico.custom_delivery_time ||
            servico.delivery_time
        ),
        moeda: servico.currency || "R$",
        empresa: {
          id: servico.company?.id,
          nome: servico.company?.name,
          imagem:
            servico.company?.picture,
        },
      }))
      .sort(
        (a, b) => a.preco - b.preco
      );

    if (opcoes.length === 0) {
      console.error(
        "Nenhum serviço válido retornado:",
        dados
      );

      return {
        status: 404,
        dados: {
          erro:
            "Nenhuma opção de frete foi encontrada para esse CEP.",
          detalhes: dados,
        },
      };
    }

    return {
      status: 200,
      dados: {
        sucesso: true,
        freteNecessario: true,
        cepOrigem,
        cepDestino,
        opcoes,
      },
    };
  } catch (error) {
    console.error(
      "Erro interno ao calcular frete:",
      error
    );

    return {
      status: 500,
      dados: {
        erro:
          "Ocorreu um erro interno ao calcular o frete.",
      },
    };
  }
}
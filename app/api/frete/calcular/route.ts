import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import {
  obterAccessTokenMelhorEnvio,
  obterConfiguracaoMelhorEnvio,
} from "@/lib/melhorEnvio";

type ItemCarrinhoFrete = {
  produtoId?: number | string;
  quantidade?: number;
};

type CalcularFreteBody = {
  cepDestino?: string;
  itens?: ItemCarrinhoFrete[];
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
): Array<{ produtoId: number; quantidade: number }> {
  const quantidadesPorProduto = new Map<number, number>();

  for (const item of itens) {
    const produtoId = Number(item.produtoId);
    const quantidade = Number(item.quantidade ?? 1);

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

  return Array.from(quantidadesPorProduto.entries()).map(
    ([produtoId, quantidade]) => ({
      produtoId,
      quantidade,
    })
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CalcularFreteBody;

    const cepOrigem = limparCep(
      process.env.MELHOR_ENVIO_CEP_ORIGEM || ""
    );

    const cepDestino = limparCep(body.cepDestino || "");
    const itens = normalizarItens(body.itens || []);

    if (cepOrigem.length !== 8) {
      return NextResponse.json(
        {
          erro: "O CEP de origem não está configurado corretamente.",
        },
        { status: 500 }
      );
    }

    if (cepDestino.length !== 8) {
      return NextResponse.json(
        {
          erro: "Informe um CEP válido com 8 números.",
        },
        { status: 400 }
      );
    }

    if (itens.length === 0) {
      return NextResponse.json(
        {
          erro: "O carrinho não possui produtos válidos.",
        },
        { status: 400 }
      );
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

      return NextResponse.json(
        {
          erro: "Não foi possível consultar os dados de envio.",
        },
        { status: 500 }
      );
    }

    const produtos = (data || []) as ProdutoBanco[];

    if (produtos.length !== idsProdutos.length) {
      return NextResponse.json(
        {
          erro: "Um ou mais produtos do carrinho não foram encontrados.",
        },
        { status: 400 }
      );
    }

    const produtosFisicos = produtos.filter(
      (produto) => produto.tipo_produto === "fisico"
    );

    if (produtosFisicos.length === 0) {
      return NextResponse.json({
        sucesso: true,
        freteNecessario: false,
        mensagem:
          "O carrinho possui apenas produtos digitais.",
        opcoes: [],
      });
    }

    const produtosMelhorEnvio = [];

    for (const produto of produtosFisicos) {
      const logistica = obterLogistica(produto);

      if (!logistica) {
        return NextResponse.json(
          {
            erro: `O produto "${produto.nome || produto.id}" não possui informações de logística.`,
          },
          { status: 400 }
        );
      }

      if (!logistica.frete_ativo) {
        return NextResponse.json(
          {
            erro: `O cálculo de frete está desativado para o produto "${produto.nome || produto.id}".`,
          },
          { status: 400 }
        );
      }

      const peso = Number(logistica.peso);
      const largura = Number(logistica.largura);
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
        return NextResponse.json(
          {
            erro: `As medidas de envio do produto "${produto.nome || produto.id}" estão incompletas.`,
          },
          { status: 400 }
        );
      }

      const itemCarrinho = itens.find(
        (item) => item.produtoId === produto.id
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
        quantity: itemCarrinho?.quantidade || 1,
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

    const dados = await resposta.json();

    if (!resposta.ok) {
      console.error(
        "Erro retornado pelo Melhor Envio:",
        dados
      );

      return NextResponse.json(
        {
          erro: "Não foi possível calcular o frete.",
          detalhes: dados,
        },
        { status: resposta.status }
      );
    }

    const opcoes = Array.isArray(dados)
      ? dados
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
              imagem: servico.company?.picture,
            },
          }))
          .sort(
            (a, b) => a.preco - b.preco
          )
      : [];

    if (opcoes.length === 0) {
      console.error(
        "Nenhum serviço válido retornado:",
        dados
      );

      return NextResponse.json(
        {
          erro: "Nenhuma opção de frete foi encontrada para esse CEP.",
          detalhes: dados,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      sucesso: true,
      freteNecessario: true,
      cepOrigem,
      cepDestino,
      opcoes,
    });
  } catch (error) {
    console.error(
      "Erro interno ao calcular frete:",
      error
    );

    return NextResponse.json(
      {
        erro: "Ocorreu um erro interno ao calcular o frete.",
      },
      { status: 500 }
    );
  }
}
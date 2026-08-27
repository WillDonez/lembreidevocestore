import { supabaseAdmin } from "@/lib/supabaseAdmin";

import {
  obterAccessTokenMelhorEnvio,
  obterConfiguracaoMelhorEnvio,
} from "@/lib/melhorEnvio";

type ProdutoPedido = {
  id?: number | string;
  nome?: string;
  preco?: number | string;
  quantidade?: number;
  tipo_produto?: string;
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

  produto_logistica?:
    | LogisticaProduto
    | LogisticaProduto[]
    | null;
};

type PedidoBanco = {
  id: number;

  status?: string | null;

  produtos?: ProdutoPedido[] | null;

  nome_cliente?: string | null;
  email_cliente?: string | null;
  whatsapp_cliente?: string | null;
  cpf_cnpj?: string | null;

  cep?: string | null;
  endereco?: string | null;
  numero?: string | null;
  complemento?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  estado?: string | null;

  frete_servico_id?: string | null;
  frete_valor?: number | string | null;

  nota_fiscal_chave?: string | null;
  nota_fiscal_status?: string | null;

  melhor_envio_order_id?: string | null;
  melhor_envio_status?: string | null;
  melhor_envio_ambiente?: "sandbox" | "producao" | null;
};

type ResultadoCriacaoEnvio = {
  sucesso: boolean;
  pedidoId: number;
  melhorEnvioOrderId?: string;
  ambiente: "sandbox" | "producao";
  mensagem: string;
};

export type ResultadoSincronizacaoEnvio = {
  sucesso: boolean;
  pedidoId: number;
  melhorEnvioOrderId: string;
  status: string;
  codigoRastreio: string | null;
  urlEtiqueta: string | null;
  etiquetaGerada: boolean;
  mensagem: string;
};

function limparSomenteNumeros(
  valor?: string | null,
) {
  return String(valor || "")
    .replace(/\D/g, "");
}

function normalizarTipoProduto(
  tipo?: string,
) {
  return String(tipo || "")
    .trim()
    .toLowerCase();
}

function obterLogistica(
  produto: ProdutoBanco,
): LogisticaProduto | null {
  if (
    Array.isArray(
      produto.produto_logistica,
    )
  ) {
    return (
      produto.produto_logistica[0] ||
      null
    );
  }

  return (
    produto.produto_logistica ||
    null
  );
}

function obterVariaveisRemetente() {
  const nome =
    process.env
      .MELHOR_ENVIO_REMETENTE_NOME;

  const documento =
    process.env
      .MELHOR_ENVIO_REMETENTE_DOCUMENTO;

  const telefone =
    process.env
      .MELHOR_ENVIO_REMETENTE_TELEFONE;

  const email =
    process.env
      .MELHOR_ENVIO_REMETENTE_EMAIL;

  const endereco =
    process.env
      .MELHOR_ENVIO_REMETENTE_ENDERECO;

  const numero =
    process.env
      .MELHOR_ENVIO_REMETENTE_NUMERO;

  const complemento =
    process.env
      .MELHOR_ENVIO_REMETENTE_COMPLEMENTO ||
    "";

  const bairro =
    process.env
      .MELHOR_ENVIO_REMETENTE_BAIRRO;

  const cidade =
    process.env
      .MELHOR_ENVIO_REMETENTE_CIDADE;

  const estado =
    process.env
      .MELHOR_ENVIO_REMETENTE_ESTADO;

  const cep =
    process.env
      .MELHOR_ENVIO_CEP_ORIGEM;

  const inscricaoEstadual =
    process.env
      .MELHOR_ENVIO_REMETENTE_INSCRICAO_ESTADUAL;

  if (
    !nome ||
    !documento ||
    !telefone ||
    !email ||
    !endereco ||
    !numero ||
    !bairro ||
    !cidade ||
    !estado ||
    !cep ||
    !inscricaoEstadual
  ) {
    throw new Error(
      "Os dados do remetente do Melhor Envio estão incompletos.",
    );
  }

  const cnpj =
    limparSomenteNumeros(
      documento,
    );

  if (cnpj.length !== 14) {
    throw new Error(
      "O CNPJ do remetente deve possuir 14 números.",
    );
  }

  const cepLimpo =
    limparSomenteNumeros(
      cep,
    );

  if (cepLimpo.length !== 8) {
    throw new Error(
      "O CEP do remetente está inválido.",
    );
  }

  return {
    nome,
    cnpj,
    telefone:
      limparSomenteNumeros(
        telefone,
      ),
    email,
    endereco,
    numero,
    complemento,
    bairro,
    cidade,
    estado:
      estado
        .trim()
        .toUpperCase(),
    cep: cepLimpo,
    inscricaoEstadual,
  };
}

function validarChaveNFe(
  chave?: string | null,
) {
  const chaveLimpa =
    limparSomenteNumeros(
      chave,
    );

  if (chaveLimpa.length !== 44) {
    throw new Error(
      "A chave da NF-e deve possuir 44 números.",
    );
  }

  return chaveLimpa;
}

export async function criarEnvioMelhorEnvio(
  pedidoId: number,
): Promise<ResultadoCriacaoEnvio> {
  /*
   * =========================================================
   * 1. CONSULTAR PEDIDO
   * =========================================================
   */

  const {
    data: pedidoData,
    error: erroPedido,
  } = await supabaseAdmin
    .from("pedidos")
    .select(`
      id,
      status,
      produtos,
      nome_cliente,
      email_cliente,
      whatsapp_cliente,
      cpf_cnpj,
      cep,
      endereco,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
      frete_servico_id,
      frete_valor,
      nota_fiscal_chave,
      nota_fiscal_status,
      melhor_envio_order_id,
      melhor_envio_status,
      melhor_envio_ambiente
    `)
    .eq(
      "id",
      pedidoId,
    )
    .maybeSingle();

  if (
    erroPedido ||
    !pedidoData
  ) {
    console.error(
      "Erro ao consultar pedido para Melhor Envio:",
      erroPedido,
    );

    throw new Error(
      "Pedido não encontrado.",
    );
  }

  const pedido =
    pedidoData as PedidoBanco;

  const { ambiente } =
    obterConfiguracaoMelhorEnvio();

  /*
   * =========================================================
   * 2. EVITAR ENVIO DUPLICADO
   * =========================================================
   */

  if (
    pedido.melhor_envio_order_id
  ) {
    if (
      pedido.melhor_envio_ambiente &&
      pedido.melhor_envio_ambiente !== ambiente
    ) {
      throw new Error(
        `Este pedido possui um envio do ambiente ${pedido.melhor_envio_ambiente}. O ambiente atual é ${ambiente}.`,
      );
    }

    return {
      sucesso: true,
      pedidoId,
      melhorEnvioOrderId:
        pedido.melhor_envio_order_id,
      ambiente,
      mensagem:
        "O pedido já possui um envio criado no Melhor Envio.",
    };
  }

  /*
   * =========================================================
   * 3. PAGAMENTO PRECISA ESTAR APROVADO
   * =========================================================
   */

  const status =
    String(
      pedido.status || "",
    )
      .trim()
      .toLowerCase();

  if (
    status !== "aprovado" &&
    status !== "pago"
  ) {
    throw new Error(
      "O pedido ainda não possui pagamento aprovado.",
    );
  }

  /*
   * =========================================================
   * 4. PEDIDO PRECISA TER PRODUTO FÍSICO
   * =========================================================
   */

  const produtosFisicos =
    (
      pedido.produtos || []
    ).filter(
      (produto) =>
        normalizarTipoProduto(
          produto.tipo_produto,
        ) === "fisico",
    );

  if (
    produtosFisicos.length === 0
  ) {
    throw new Error(
      "O pedido não possui produtos físicos.",
    );
  }

  /*
   * =========================================================
   * 5. VALIDAR NOTA FISCAL
   * =========================================================
   */

  const chaveNFe =
    validarChaveNFe(
      pedido.nota_fiscal_chave,
    );

  /*
   * =========================================================
   * 6. VALIDAR SERVIÇO DE FRETE
   * =========================================================
   */

  const servicoId =
    Number(
      pedido.frete_servico_id,
    );

  if (
    !Number.isInteger(
      servicoId,
    ) ||
    servicoId <= 0
  ) {
    throw new Error(
      "O pedido não possui um serviço de frete válido.",
    );
  }

  /*
   * =========================================================
   * 7. CONSULTAR LOGÍSTICA DOS PRODUTOS
   * =========================================================
   */

  const idsProdutos =
    produtosFisicos.map(
      (produto) =>
        Number(
          produto.id,
        ),
    );

  const {
    data: produtosBancoData,
    error: erroProdutos,
  } = await supabaseAdmin
    .from("produtos")
    .select(`
      id,
      nome,
      preco,
      produto_logistica (
        peso,
        largura,
        altura,
        comprimento,
        valor_declarado,
        frete_ativo
      )
    `)
    .in(
      "id",
      idsProdutos,
    );

  if (erroProdutos) {
    console.error(
      "Erro ao consultar logística para etiqueta:",
      erroProdutos,
    );

    throw new Error(
      "Não foi possível consultar a logística dos produtos.",
    );
  }

  const produtosBanco =
    (
      produtosBancoData || []
    ) as ProdutoBanco[];

  if (
    produtosBanco.length !==
    idsProdutos.length
  ) {
    throw new Error(
      "Um ou mais produtos físicos não foram encontrados.",
    );
  }

  /*
   * =========================================================
   * 8. MONTAR PRODUTOS E VOLUME
   * =========================================================
   */

  const produtosMelhorEnvio =
    [];

  let pesoTotal = 0;

  let maiorLargura = 0;
  let maiorAltura = 0;
  let maiorComprimento = 0;

  let valorSeguro = 0;

  for (
    const produtoPedido
    of produtosFisicos
  ) {
    const produtoId =
      Number(
        produtoPedido.id,
      );

    const produtoBanco =
      produtosBanco.find(
        (produto) =>
          produto.id ===
          produtoId,
      );

    if (!produtoBanco) {
      throw new Error(
        `Produto ${produtoId} não encontrado.`,
      );
    }

    const logistica =
      obterLogistica(
        produtoBanco,
      );

    if (!logistica) {
      throw new Error(
        `O produto "${produtoPedido.nome || produtoId}" não possui logística cadastrada.`,
      );
    }

    if (
      !logistica.frete_ativo
    ) {
      throw new Error(
        `O frete está desativado para o produto "${produtoPedido.nome || produtoId}".`,
      );
    }

    const quantidade =
      Number(
        produtoPedido.quantidade ||
        1,
      );

    const peso =
      Number(
        logistica.peso,
      );

    const largura =
      Number(
        logistica.largura,
      );

    const altura =
      Number(
        logistica.altura,
      );

    const comprimento =
      Number(
        logistica.comprimento,
      );

    const valorUnitario =
      Number(
        produtoPedido.preco ||
        produtoBanco.preco ||
        0,
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
      throw new Error(
        `As medidas do produto "${produtoPedido.nome || produtoId}" estão incompletas.`,
      );
    }

    produtosMelhorEnvio.push({
      name:
        produtoPedido.nome ||
        produtoBanco.nome ||
        `Produto ${produtoId}`,
      quantity:
        quantidade,
      unitary_value:
        valorUnitario,
    });

    pesoTotal +=
      peso * quantidade;

    maiorLargura =
      Math.max(
        maiorLargura,
        largura,
      );

    maiorAltura =
      Math.max(
        maiorAltura,
        altura,
      );

    maiorComprimento =
      Math.max(
        maiorComprimento,
        comprimento,
      );

    valorSeguro +=
      valorUnitario *
      quantidade;
  }

  /*
   * Nesta primeira versão trabalhamos com
   * um único volume consolidado.
   *
   * Posteriormente podemos evoluir para
   * múltiplos volumes quando necessário.
   */

  const volumes = [
    {
      height:
        maiorAltura,
      width:
        maiorLargura,
      length:
        maiorComprimento,
      weight:
        pesoTotal,
    },
  ];

  /*
   * =========================================================
   * 9. VALIDAR DESTINATÁRIO
   * =========================================================
   */

  const cepDestino =
    limparSomenteNumeros(
      pedido.cep,
    );

  const documentoDestino =
    limparSomenteNumeros(
      pedido.cpf_cnpj,
    );

  const telefoneDestino =
    limparSomenteNumeros(
      pedido.whatsapp_cliente,
    );

  if (
    !pedido.nome_cliente ||
    !pedido.email_cliente ||
    !pedido.endereco ||
    !pedido.numero ||
    !pedido.bairro ||
    !pedido.cidade ||
    !pedido.estado ||
    cepDestino.length !== 8 ||
    !telefoneDestino
  ) {
    throw new Error(
      "Os dados do destinatário estão incompletos.",
    );
  }

  /*
   * =========================================================
   * 10. DADOS DO REMETENTE
   * =========================================================
   */

  const remetente =
    obterVariaveisRemetente();

  /*
   * =========================================================
   * 11. AUTENTICAÇÃO MELHOR ENVIO
   * =========================================================
   */

  const accessToken =
    await obterAccessTokenMelhorEnvio();

  const {
    baseUrl,
    userAgent,
  } =
    obterConfiguracaoMelhorEnvio();

  /*
   * =========================================================
   * 12. MONTAR PAYLOAD
   * =========================================================
   */

  const remetentePayload = {
    name:
      remetente.nome,
    email:
      remetente.email,
    phone:
      remetente.telefone,

    document:
      "",

    company_document:
      remetente.cnpj,

    state_register:
      remetente.inscricaoEstadual,

    address:
      remetente.endereco,
    complement:
      remetente.complemento,
    number:
      remetente.numero,
    district:
      remetente.bairro,
    city:
      remetente.cidade,
    postal_code:
      remetente.cep,
    state_abbr:
      remetente.estado,
  };

  /*
   * Destinatário pessoa física:
   * CPF -> document
   *
   * Destinatário pessoa jurídica:
   * CNPJ -> company_document
   */

  const destinatarioDocumento =
    documentoDestino.length === 14
      ? {
          company_document:
            documentoDestino,
        }
      : {
          document:
            documentoDestino,
        };

  const destinatarioPayload = {
    name:
      pedido.nome_cliente,
    email:
      pedido.email_cliente,
    phone:
      telefoneDestino,

    ...destinatarioDocumento,

    address:
      pedido.endereco,
    complement:
      pedido.complemento ||
      "",
    number:
      pedido.numero,
    district:
      pedido.bairro,
    city:
      pedido.cidade,
    postal_code:
      cepDestino,
    country_id:
      "BR",
    state_abbr:
      String(
        pedido.estado,
      )
        .trim()
        .toUpperCase(),
  };

  const payload = {
    service:
      servicoId,

    from:
      remetentePayload,

    to:
      destinatarioPayload,

    products:
      produtosMelhorEnvio,

    volumes,

    options: {
      platform:
        "Lembrei de Você Store",

      reminder:
        `Pedido #${pedido.id}`,

      insurance_value:
        valorSeguro,

      receipt:
        false,

      own_hand:
        false,

      reverse:
        false,

      invoice: {
        key:
          chaveNFe,
      },

      tags: [
        {
          tag:
            `Pedido ${pedido.id}`,
          url:
            null,
        },
      ],
    },
  };

  /*
   * =========================================================
   * 13. INSERIR ENVIO NO CARRINHO
   * =========================================================
   */

  const resposta =
    await fetch(
      `${baseUrl}/api/v2/me/cart`,
      {
        method: "POST",

        headers: {
          Accept:
            "application/json",

          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${accessToken}`,

          "User-Agent":
            userAgent,
        },

        body:
          JSON.stringify(
            payload,
          ),

        cache:
          "no-store",
      },
    );

  const respostaTexto =
    await resposta.text();

  let dados: any;

  try {
    dados =
      respostaTexto
        ? JSON.parse(
            respostaTexto,
          )
        : {};
  } catch {
    dados = {
      resposta:
        respostaTexto,
    };
  }

  if (
    !resposta.ok
  ) {
    console.error(
      "Erro ao inserir envio no carrinho do Melhor Envio:",
      {
        status:
          resposta.status,
        dados,
      },
    );

    throw new Error(
      "Não foi possível inserir o envio no carrinho do Melhor Envio.",
    );
  }

  const melhorEnvioOrderId =
    String(
      dados?.id ||
      "",
    );

  if (
    !melhorEnvioOrderId
  ) {
    console.error(
      "Melhor Envio não retornou o ID esperado:",
      dados,
    );

    throw new Error(
      "O Melhor Envio não retornou o identificador do envio.",
    );
  }

  /*
   * =========================================================
   * 14. SALVAR ID NO PEDIDO
   * =========================================================
   */

  const {
    error: erroAtualizacao,
  } = await supabaseAdmin
    .from("pedidos")
    .update({
      melhor_envio_order_id:
        melhorEnvioOrderId,

      melhor_envio_status:
        "carrinho",

      melhor_envio_ambiente:
        ambiente,
    })
    .eq(
      "id",
      pedido.id,
    );

  if (erroAtualizacao) {
    console.error(
      "Envio criado, mas não foi possível salvar o ID no pedido:",
      erroAtualizacao,
    );

    throw new Error(
      "O envio foi criado no Melhor Envio, mas não pôde ser salvo no pedido.",
    );
  }

  console.log(
    `✅ Pedido ${pedido.id} inserido no carrinho do Melhor Envio.`,
    {
      melhorEnvioOrderId,
    },
  );

  return {
    sucesso:
      true,

    pedidoId:
      pedido.id,

    melhorEnvioOrderId,

    ambiente,

    mensagem:
      "Envio inserido no carrinho do Melhor Envio com sucesso.",
  };
}

function normalizarStatusMelhorEnvio(
  status?: unknown,
) {
  const statusNormalizado = String(
    status || "",
  )
    .trim()
    .toLowerCase();

  const statusConhecidos: Record<string, string> = {
    pending: "pendente",
    released: "liberado",
    posted: "postado",
    delivered: "entregue",
    canceled: "cancelado",
    cancelled: "cancelado",
    undelivered: "nao_entregue",
    "not delivered": "nao_entregue",
    suspended: "suspenso",
  };

  return (
    statusConhecidos[statusNormalizado] ||
    statusNormalizado ||
    "desconhecido"
  );
}

function obterTextoPrimeiroCampo(
  origem: unknown,
  campos: string[],
): string | null {
  if (!origem || typeof origem !== "object") {
    return null;
  }

  const registro = origem as Record<string, unknown>;

  for (const campo of campos) {
    const valor = registro[campo];

    if (
      typeof valor === "string" &&
      valor.trim()
    ) {
      return valor.trim();
    }

    if (
      typeof valor === "number" &&
      Number.isFinite(valor)
    ) {
      return String(valor);
    }
  }

  return null;
}

function encontrarDadosRastreio(
  origem: unknown,
): {
  status: string | null;
  codigo: string | null;
} {
  const fila: unknown[] = [origem];
  const visitados = new Set<unknown>();
  let primeiroStatus: string | null = null;

  while (fila.length > 0) {
    const atual = fila.shift();

    if (
      !atual ||
      typeof atual !== "object" ||
      visitados.has(atual)
    ) {
      continue;
    }

    visitados.add(atual);

    const status = obterTextoPrimeiroCampo(atual, [
      "status",
      "state",
    ]);

    const codigo = obterTextoPrimeiroCampo(atual, [
      "tracking",
      "tracking_code",
      "tracking_number",
      "codigo_rastreio",
    ]);

    primeiroStatus = primeiroStatus || status;

    if (codigo) {
      return {
        status: status || primeiroStatus,
        codigo,
      };
    }

    const valores = Array.isArray(atual)
      ? atual
      : Object.values(atual as Record<string, unknown>);

    fila.push(...valores);
  }

  return {
    status: primeiroStatus,
    codigo: null,
  };
}

function validarUrlEtiqueta(
  valor?: string | null,
) {
  if (!valor) {
    return null;
  }

  try {
    const url = new URL(valor);

    if (url.protocol !== "https:") {
      return null;
    }

    const host = url.hostname.toLowerCase();

    if (
      host !== "melhorenvio.com.br" &&
      !host.endsWith(".melhorenvio.com.br")
    ) {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}

export async function sincronizarEnvioMelhorEnvio(
  pedidoId: number,
): Promise<ResultadoSincronizacaoEnvio> {
  const { data: pedidoData, error: erroPedido } =
    await supabaseAdmin
      .from("pedidos")
      .select(`
        id,
        melhor_envio_order_id,
        melhor_envio_status,
        codigo_rastreio,
        url_etiqueta,
        etiqueta_gerada,
        melhor_envio_ambiente
      `)
      .eq("id", pedidoId)
      .maybeSingle();

  if (erroPedido || !pedidoData) {
    console.error(
      "Erro ao consultar pedido para sincronizar envio:",
      erroPedido,
    );

    throw new Error("Pedido não encontrado.");
  }

  const melhorEnvioOrderId = String(
    pedidoData.melhor_envio_order_id || "",
  ).trim();

  if (!melhorEnvioOrderId) {
    throw new Error(
      "O pedido ainda não possui um envio no Melhor Envio.",
    );
  }

  const { baseUrl, userAgent, ambiente } =
    obterConfiguracaoMelhorEnvio();

  const ambienteDoPedido = String(
    pedidoData.melhor_envio_ambiente || "",
  ).trim();

  if (!ambienteDoPedido) {
    throw new Error(
      "O ambiente deste envio não foi identificado. Atualize o cadastro do pedido antes de sincronizar.",
    );
  }

  if (ambienteDoPedido !== ambiente) {
    throw new Error(
      `Este envio pertence ao ambiente ${ambienteDoPedido}. Ele não pode ser atualizado no ambiente ${ambiente}.`,
    );
  }

  const accessToken =
    await obterAccessTokenMelhorEnvio();

  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${accessToken}`,
    "User-Agent": userAgent,
  };

  const respostaPedido = await fetch(
    `${baseUrl}/api/v2/me/orders/${encodeURIComponent(
      melhorEnvioOrderId,
    )}`,
    {
      method: "GET",
      headers,
      cache: "no-store",
    },
  );

  const textoPedido = await respostaPedido.text();
  let dadosPedido: Record<string, unknown> = {};

  try {
    dadosPedido = textoPedido
      ? (JSON.parse(textoPedido) as Record<string, unknown>)
      : {};
  } catch {
    dadosPedido = {};
  }

  if (!respostaPedido.ok) {
    console.error(
      "Erro ao consultar envio no Melhor Envio:",
      {
        status: respostaPedido.status,
        dados: dadosPedido,
      },
    );

    throw new Error(
      "Não foi possível consultar o envio no Melhor Envio.",
    );
  }

  let statusExterno = obterTextoPrimeiroCampo(
    dadosPedido,
    ["status", "state"],
  );

  let codigoRastreio = obterTextoPrimeiroCampo(
    dadosPedido,
    [
      "tracking",
      "tracking_code",
      "tracking_number",
      "codigo_rastreio",
    ],
  );

  try {
    const respostaRastreio = await fetch(
      `${baseUrl}/api/v2/me/shipment/tracking`,
      {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orders: [melhorEnvioOrderId],
        }),
        cache: "no-store",
      },
    );

    if (respostaRastreio.ok) {
      const dadosRastreio =
        await respostaRastreio.json();

      const rastreioEncontrado =
        encontrarDadosRastreio(dadosRastreio);

      statusExterno =
        rastreioEncontrado.status || statusExterno;

      codigoRastreio =
        rastreioEncontrado.codigo || codigoRastreio;
    }
  } catch (error) {
    console.warn(
      "Não foi possível consultar o rastreio agora:",
      error,
    );
  }

  const status = normalizarStatusMelhorEnvio(
    statusExterno || pedidoData.melhor_envio_status,
  );

  let geradaEm = obterTextoPrimeiroCampo(
    dadosPedido,
    ["generated_at"],
  );

  let urlEtiqueta = validarUrlEtiqueta(
    typeof pedidoData.url_etiqueta === "string"
      ? pedidoData.url_etiqueta
      : null,
  );

  /*
   * =========================================================
   * GERAR ETIQUETA APÓS A COMPRA
   * =========================================================
   *
   * O status "liberado" significa que o frete foi comprado,
   * mas não significa que o arquivo da etiqueta já foi gerado.
   *
   * A geração precisa ser solicitada explicitamente antes da
   * impressão. Só consideramos a etiqueta realmente gerada
   * quando o Melhor Envio passar a informar "generated_at".
   */

  const statusPermiteGerarEtiqueta = [
    "liberado",
    "postado",
    "entregue",
    "nao_entregue",
  ].includes(status);

  if (
    statusPermiteGerarEtiqueta &&
    !geradaEm
  ) {
    try {
      const respostaGeracao = await fetch(
        `${baseUrl}/api/v2/me/shipment/generate`,
        {
          method: "POST",
          headers: {
            ...headers,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orders: [melhorEnvioOrderId],
          }),
          cache: "no-store",
        },
      );

      if (!respostaGeracao.ok) {
        const textoGeracao =
          await respostaGeracao.text();

        console.warn(
          "O Melhor Envio ainda não confirmou a geração da etiqueta:",
          {
            status: respostaGeracao.status,
            resposta: textoGeracao,
          },
        );
      }

      /*
       * A geração pode ser assíncrona. Por isso consultamos
       * novamente o pedido e só marcamos como gerada quando
       * "generated_at" realmente existir.
       */
      const respostaPedidoAposGeracao = await fetch(
        `${baseUrl}/api/v2/me/orders/${encodeURIComponent(
          melhorEnvioOrderId,
        )}`,
        {
          method: "GET",
          headers,
          cache: "no-store",
        },
      );

      if (respostaPedidoAposGeracao.ok) {
        const textoPedidoAposGeracao =
          await respostaPedidoAposGeracao.text();

        let dadosPedidoAposGeracao:
          Record<string, unknown> = {};

        try {
          dadosPedidoAposGeracao =
            textoPedidoAposGeracao
              ? (JSON.parse(
                  textoPedidoAposGeracao,
                ) as Record<string, unknown>)
              : {};
        } catch {
          dadosPedidoAposGeracao = {};
        }

        geradaEm = obterTextoPrimeiroCampo(
          dadosPedidoAposGeracao,
          ["generated_at"],
        );
      }
    } catch (error) {
      console.warn(
        "Não foi possível solicitar a geração da etiqueta agora:",
        error,
      );
    }
  }

  const etiquetaGerada = Boolean(
    geradaEm,
  );

  /*
   * Somente tenta obter o link de impressão depois de o
   * Melhor Envio confirmar que a etiqueta foi gerada.
   */
  if (etiquetaGerada) {
    try {
      const respostaImpressao = await fetch(
        `${baseUrl}/api/v2/me/shipment/print`,
        {
          method: "POST",
          headers: {
            ...headers,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mode: "public",
            orders: [melhorEnvioOrderId],
          }),
          cache: "no-store",
        },
      );

      if (respostaImpressao.ok) {
        const dadosImpressao =
          (await respostaImpressao.json()) as unknown;

        const urlCandidata =
          typeof dadosImpressao === "string"
            ? dadosImpressao
            : obterTextoPrimeiroCampo(
                dadosImpressao,
                ["url", "link", "print_url"],
              );

        urlEtiqueta = validarUrlEtiqueta(
          urlCandidata,
        );
      } else {
        const textoImpressao =
          await respostaImpressao.text();

        console.warn(
          "A etiqueta foi gerada, mas o link de impressão ainda não está disponível:",
          {
            status: respostaImpressao.status,
            resposta: textoImpressao,
          },
        );

        urlEtiqueta = null;
      }
    } catch (error) {
      console.warn(
        "A etiqueta foi gerada, mas o link de impressão não pôde ser obtido:",
        error,
      );

      urlEtiqueta = null;
    }
  } else {
    /*
     * Remove eventual estado antigo incorreto, como ocorreu no
     * Pedido #19 quando "liberado" foi confundido com "gerada".
     */
    urlEtiqueta = null;
  }

  const atualizacao = {
    melhor_envio_status: status,
    codigo_rastreio: codigoRastreio || null,
    url_etiqueta: urlEtiqueta || null,
    etiqueta_gerada: etiquetaGerada,
  };

  const { error: erroAtualizacao } =
    await supabaseAdmin
      .from("pedidos")
      .update(atualizacao)
      .eq("id", pedidoId);

  if (erroAtualizacao) {
    console.error(
      "Erro ao salvar sincronização do Melhor Envio:",
      erroAtualizacao,
    );

    throw new Error(
      "O envio foi consultado, mas os dados não puderam ser salvos no pedido.",
    );
  }

  return {
    sucesso: true,
    pedidoId,
    melhorEnvioOrderId,
    status,
    codigoRastreio: codigoRastreio || null,
    urlEtiqueta: urlEtiqueta || null,
    etiquetaGerada,
    mensagem:
      "Dados do envio atualizados com sucesso.",
  };
}
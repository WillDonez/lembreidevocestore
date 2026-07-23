"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type Produto = {
  id: number;
  nome: string;
  preco: number;
  imagem?: string;
  descricao?: string;
  tipo_produto?:
  | "fisico"
  | "pdf"
  | "digital"
  | "kit";

  /**
   * Quantidade máxima permitida deste produto por pedido.
   *
   * Quando não estiver definida:
   * - Produto digital: 1
   * - Produto físico: 999
   * - Kit: 999
   */
  quantidade_maxima?: number;
};

export type CarrinhoItem = {
  idCarrinho: string;
  produto: Produto;
  quantidade: number;
  selecionado: boolean;
  dataInclusao: string;
};

type CarrinhoContextType = {
  /**
   * Estrutura oficial do Aurora Cart 2.0.
   */
  itens: CarrinhoItem[];
  itensSelecionados: CarrinhoItem[];

  /**
   * Compatibilidade temporária com as telas antigas.
   * Será removida quando todas as páginas usarem `itens`.
   */
  carrinho: Produto[];

  adicionarCarrinho: (
    produto: Produto,
    quantidade?: number
  ) => void;

  /**
   * Compatibilidade temporária com a tela antiga.
   * Remove uma unidade usando o índice da lista expandida.
   */
  removerCarrinho: (index: number) => void;

  removerItem: (idCarrinho: string) => void;

  alterarQuantidade: (
    idCarrinho: string,
    quantidade: number
  ) => void;

  aumentarQuantidade: (idCarrinho: string) => void;
  diminuirQuantidade: (idCarrinho: string) => void;

  alternarSelecionado: (idCarrinho: string) => void;
  selecionarTodos: (selecionado: boolean) => void;

  limparCarrinho: () => void;
  removerSelecionados: () => void;

  total: number;
  totalSelecionado: number;

  quantidadeTotal: number;
  quantidadeSelecionada: number;

  todosSelecionados: boolean;
  carrinhoCarregado: boolean;
};

const CarrinhoContext =
  createContext<CarrinhoContextType | null>(null);

function criarIdCarrinho() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
}

export function obterQuantidadeMaxima(
  produto: Produto
): number {
  const limiteConfigurado = Number(
    produto.quantidade_maxima
  );

  if (
    Number.isFinite(limiteConfigurado) &&
    limiteConfigurado > 0
  ) {
    return Math.floor(limiteConfigurado);
  }

  const tipoProduto = String(
  produto.tipo_produto || ""
).toLowerCase();

if (
  tipoProduto === "pdf" ||
  tipoProduto === "digital"
) {
  return 1;
}

  return 999;
}

function criarItemCarrinho(
  produto: Produto,
  quantidade = 1
): CarrinhoItem {
  const quantidadeMaxima =
    obterQuantidadeMaxima(produto);

  const quantidadeValida = Math.min(
    quantidadeMaxima,
    Math.max(1, Number(quantidade) || 1)
  );

  return {
    idCarrinho: criarIdCarrinho(),
    produto,
    quantidade: quantidadeValida,
    selecionado: true,
    dataInclusao: new Date().toISOString(),
  };
}

function ehCarrinhoNovo(
  valor: unknown
): valor is CarrinhoItem[] {
  if (!Array.isArray(valor)) {
    return false;
  }

  if (valor.length === 0) {
    return true;
  }

  const primeiroItem = valor[0];

  return Boolean(
    primeiroItem &&
      typeof primeiroItem === "object" &&
      "produto" in primeiroItem &&
      "quantidade" in primeiroItem &&
      "selecionado" in primeiroItem
  );
}

/**
 * Converte o carrinho antigo, que armazenava Produto[],
 * para a nova estrutura CarrinhoItem[].
 *
 * Produtos repetidos são agrupados por ID.
 */
function migrarCarrinhoAntigo(
  produtos: Produto[]
): CarrinhoItem[] {
  const itensAgrupados = new Map<
    number,
    CarrinhoItem
  >();

  produtos.forEach((produto) => {
    const existente = itensAgrupados.get(produto.id);

    if (existente) {
      existente.quantidade += 1;
      return;
    }

    itensAgrupados.set(
      produto.id,
      criarItemCarrinho(produto)
    );
  });

  return Array.from(itensAgrupados.values());
}

export function CarrinhoProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [itens, setItens] = useState<CarrinhoItem[]>(
    []
  );

  const [carrinhoCarregado, setCarrinhoCarregado] =
    useState(false);

  useEffect(() => {
    const carrinhoSalvo =
      localStorage.getItem("carrinho");

    if (!carrinhoSalvo) {
      setCarrinhoCarregado(true);
      return;
    }

    try {
      const carrinhoConvertido: unknown =
        JSON.parse(carrinhoSalvo);

      if (ehCarrinhoNovo(carrinhoConvertido)) {
        const itensValidados = carrinhoConvertido
          .filter(
            (item) =>
              item.produto &&
              typeof item.produto.id === "number"
          )
          .map((item) => ({
            ...item,
            quantidade: Math.max(
              1,
              Number(item.quantidade) || 1
            ),
            selecionado:
              typeof item.selecionado === "boolean"
                ? item.selecionado
                : true,
            dataInclusao:
              item.dataInclusao ||
              new Date().toISOString(),
          }));

        setItens(itensValidados);
      } else if (Array.isArray(carrinhoConvertido)) {
        const produtosAntigos =
          carrinhoConvertido as Produto[];

        setItens(
          migrarCarrinhoAntigo(produtosAntigos)
        );
      } else {
        localStorage.removeItem("carrinho");
      }
    } catch (error) {
      console.error(
        "Não foi possível carregar o carrinho salvo:",
        error
      );

      localStorage.removeItem("carrinho");
    } finally {
      setCarrinhoCarregado(true);
    }
  }, []);

  useEffect(() => {
    if (!carrinhoCarregado) {
      return;
    }

    localStorage.setItem(
      "carrinho",
      JSON.stringify(itens)
    );
  }, [itens, carrinhoCarregado]);

  function adicionarCarrinho(
  produto: Produto,
  quantidade = 1
) {
  const quantidadeSolicitada = Math.max(
    1,
    Number(quantidade) || 1
  );

  const quantidadeMaxima =
    obterQuantidadeMaxima(produto);

  setItens((itensAtuais) => {
    const itemExistente = itensAtuais.find(
      (item) => item.produto.id === produto.id
    );

    if (!itemExistente) {
      return [
        ...itensAtuais,
        criarItemCarrinho(
          produto,
          quantidadeSolicitada
        ),
      ];
    }

    const novaQuantidade = Math.min(
      quantidadeMaxima,
      itemExistente.quantidade +
        quantidadeSolicitada
    );

    return itensAtuais.map((item) =>
      item.idCarrinho === itemExistente.idCarrinho
        ? {
            ...item,
            produto,
            quantidade: novaQuantidade,
            selecionado: true,
          }
        : item
    );
  });
}

  function removerItem(idCarrinho: string) {
    setItens((itensAtuais) =>
      itensAtuais.filter(
        (item) =>
          item.idCarrinho !== idCarrinho
      )
    );
  }

  function alterarQuantidade(
  idCarrinho: string,
  quantidade: number
) {
  const quantidadeSolicitada =
    Number(quantidade) || 0;

  if (quantidadeSolicitada <= 0) {
    removerItem(idCarrinho);
    return;
  }

  setItens((itensAtuais) =>
    itensAtuais.map((item) => {
      if (item.idCarrinho !== idCarrinho) {
        return item;
      }

      const quantidadeMaxima =
        obterQuantidadeMaxima(item.produto);

      return {
        ...item,
        quantidade: Math.min(
          quantidadeMaxima,
          quantidadeSolicitada
        ),
      };
    })
  );
}

  function aumentarQuantidade(
  idCarrinho: string
) {
  setItens((itensAtuais) =>
    itensAtuais.map((item) => {
      if (item.idCarrinho !== idCarrinho) {
        return item;
      }

      const quantidadeMaxima =
        obterQuantidadeMaxima(item.produto);

      if (item.quantidade >= quantidadeMaxima) {
        return item;
      }

      return {
        ...item,
        quantidade: item.quantidade + 1,
      };
    })
  );
}

  function diminuirQuantidade(
    idCarrinho: string
  ) {
    setItens((itensAtuais) =>
      itensAtuais.flatMap((item) => {
        if (item.idCarrinho !== idCarrinho) {
          return [item];
        }

        if (item.quantidade <= 1) {
          return [];
        }

        return [
          {
            ...item,
            quantidade: item.quantidade - 1,
          },
        ];
      })
    );
  }

  function alternarSelecionado(
    idCarrinho: string
  ) {
    setItens((itensAtuais) =>
      itensAtuais.map((item) =>
        item.idCarrinho === idCarrinho
          ? {
              ...item,
              selecionado: !item.selecionado,
            }
          : item
      )
    );

    sessionStorage.removeItem(
      "freteSelecionado"
    );
  }

  function selecionarTodos(
    selecionado: boolean
  ) {
    setItens((itensAtuais) =>
      itensAtuais.map((item) => ({
        ...item,
        selecionado,
      }))
    );

    sessionStorage.removeItem(
      "freteSelecionado"
    );
  }

  function removerSelecionados() {
    setItens((itensAtuais) =>
      itensAtuais.filter(
        (item) => !item.selecionado
      )
    );

    sessionStorage.removeItem(
      "freteSelecionado"
    );
  }

  function limparCarrinho() {
    setItens([]);

    localStorage.removeItem("carrinho");

    sessionStorage.removeItem(
      "freteSelecionado"
    );

    sessionStorage.removeItem(
      "itensCheckout"
    );
  }

  /**
   * Compatibilidade temporária.
   *
   * Transforma:
   *
   * Caneca - quantidade 3
   *
   * em:
   *
   * [Caneca, Caneca, Caneca]
   *
   * Dessa forma, as telas antigas continuam funcionando.
   */
  const carrinho = useMemo(
    () =>
      itens.flatMap((item) =>
        Array.from(
          { length: item.quantidade },
          () => item.produto
        )
      ),
    [itens]
  );

  /**
   * Compatibilidade temporária com:
   *
   * removerCarrinho(index)
   */
  function removerCarrinho(index: number) {
    if (index < 0) {
      return;
    }

    let indiceAtual = 0;
    let idEncontrado: string | null = null;

    for (const item of itens) {
      const ultimoIndiceDoItem =
        indiceAtual + item.quantidade - 1;

      if (index <= ultimoIndiceDoItem) {
        idEncontrado = item.idCarrinho;
        break;
      }

      indiceAtual += item.quantidade;
    }

    if (!idEncontrado) {
      return;
    }

    diminuirQuantidade(idEncontrado);
  }

  const itensSelecionados = useMemo(
    () =>
      itens.filter(
        (item) => item.selecionado
      ),
    [itens]
  );

  const total = useMemo(
    () =>
      itens.reduce(
        (acumulador, item) =>
          acumulador +
          Number(item.produto.preco || 0) *
            item.quantidade,
        0
      ),
    [itens]
  );

  const totalSelecionado = useMemo(
    () =>
      itensSelecionados.reduce(
        (acumulador, item) =>
          acumulador +
          Number(item.produto.preco || 0) *
            item.quantidade,
        0
      ),
    [itensSelecionados]
  );

  const quantidadeTotal = useMemo(
    () =>
      itens.reduce(
        (acumulador, item) =>
          acumulador + item.quantidade,
        0
      ),
    [itens]
  );

  const quantidadeSelecionada = useMemo(
    () =>
      itensSelecionados.reduce(
        (acumulador, item) =>
          acumulador + item.quantidade,
        0
      ),
    [itensSelecionados]
  );

  const todosSelecionados =
    itens.length > 0 &&
    itens.every((item) => item.selecionado);

  return (
    <CarrinhoContext.Provider
      value={{
        itens,
        itensSelecionados,

        carrinho,

        adicionarCarrinho,
        removerCarrinho,
        removerItem,

        alterarQuantidade,
        aumentarQuantidade,
        diminuirQuantidade,

        alternarSelecionado,
        selecionarTodos,

        limparCarrinho,
        removerSelecionados,

        total,
        totalSelecionado,

        quantidadeTotal,
        quantidadeSelecionada,

        todosSelecionados,
        carrinhoCarregado,
      }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
}

export function useCarrinho() {
  const context = useContext(CarrinhoContext);

  if (!context) {
    throw new Error(
      "useCarrinho deve ser usado dentro de CarrinhoProvider"
    );
  }

  return context;
}
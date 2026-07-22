"use client";

import { formatarMoeda } from "@/lib/formatadores";
import { obterFormato } from "@/lib/config/produtos";

interface ListaProdutosProps {
  produtos: any[];
  onEditar: (produto: any) => void;
  onExcluir: (id: number, nome: string) => void;
}

function normalizarTipoProduto(tipo?: string) {
  if (
    tipo === "digital" ||
    tipo === "pdf" ||
    tipo === "kit"
  ) {
    return "digital";
  }

  return "fisico";
}

function obterFormatoProduto(produto: any) {
  if (produto.formato_arquivo) {
    return String(produto.formato_arquivo).toLowerCase();
  }

  if (produto.tipo_produto === "pdf") {
    return "pdf";
  }

  if (produto.tipo_produto === "kit") {
    return "zip";
  }

  return "";
}

function obterIdentificacaoProduto(produto: any) {
  const tipoProduto = normalizarTipoProduto(
    produto.tipo_produto
  );

  if (tipoProduto === "fisico") {
    return "🛍 Produto físico";
  }

  const formatoArquivo = obterFormatoProduto(produto);
  const configuracaoFormato =
    obterFormato(formatoArquivo);

  if (configuracaoFormato) {
    return `${configuracaoFormato.icone} ${configuracaoFormato.label}`;
  }

  return "💻 Produto digital";
}

export default function ListaProdutos({
  produtos,
  onEditar,
  onExcluir,
}: ListaProdutosProps) {
  if (produtos.length === 0) {
    return (
      <section className="mx-auto mt-10 max-w-5xl">
        <div className="rounded-3xl border-2 border-dashed border-pink-200 bg-white p-10 text-center">
          <p className="text-5xl">📦</p>

          <h2 className="mt-4 text-2xl font-bold text-gray-800">
            Nenhum produto cadastrado
          </h2>

          <p className="mt-2 text-gray-500">
            Cadastre o primeiro produto usando o formulário acima.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto mt-10 max-w-5xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-pink-500">
            Catálogo administrativo
          </p>

          <h2 className="mt-1 text-3xl font-bold text-gray-800">
            Produtos cadastrados
          </h2>
        </div>

        <span className="rounded-full bg-pink-100 px-5 py-2 font-bold text-pink-600">
          {produtos.length} produto(s)
        </span>
      </div>

      <div className="space-y-4">
        {produtos.map((produto) => {
          const logistica = Array.isArray(
            produto.produto_logistica
          )
            ? produto.produto_logistica[0]
            : produto.produto_logistica;

          const tipoProduto = normalizarTipoProduto(
            produto.tipo_produto
          );

          const produtoFisico =
            tipoProduto === "fisico";

          const identificacaoProduto =
            obterIdentificacaoProduto(produto);

          return (
            <article
              key={produto.id}
              className="rounded-3xl bg-white p-6 shadow transition hover:shadow-lg"
            >
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                <div className="flex min-w-0 items-center gap-5">
                  <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-pink-50">
                    {produto.imagem ? (
                      <img
                        src={produto.imagem}
                        alt={produto.nome}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl">
                        📦
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate text-2xl font-bold text-gray-800">
                      {produto.nome}
                    </h3>

                    <p className="mt-1 text-xl font-bold text-pink-500">
                      {formatarMoeda(produto.preco)}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2 text-sm font-bold">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-600">
                        {produto.categoria ||
                          "Sem categoria"}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 ${
                          produtoFisico
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {identificacaoProduto}
                      </span>

                      {produto.destaque && (
                        <span className="rounded-full bg-yellow-100 px-3 py-1 text-yellow-700">
                          ⭐ Destaque
                        </span>
                      )}
                    </div>

                    {produtoFisico && (
                      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-gray-500">
                        <span>
                          Estoque:{" "}
                          <strong>
                            {logistica?.estoque_fisico ??
                              0}
                          </strong>
                        </span>

                        <span>
                          Frete:{" "}
                          <strong
                            className={
                              logistica?.frete_ativo
                                ? "text-green-600"
                                : "text-red-500"
                            }
                          >
                            {logistica?.frete_ativo
                              ? "Ativo"
                              : "Inativo"}
                          </strong>
                        </span>

                        {logistica?.peso > 0 && (
                          <span>
                            Peso:{" "}
                            <strong>
                              {logistica.peso} kg
                            </strong>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 md:flex-nowrap">
                  <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl bg-gray-100 px-4 py-3 font-bold text-gray-600 transition hover:bg-gray-200"
                  >
                    👁 Ver loja
                  </a>

                  <button
                    type="button"
                    onClick={() =>
                      onEditar(produto)
                    }
                    className="rounded-xl bg-blue-500 px-4 py-3 font-bold text-white transition hover:bg-blue-600"
                  >
                    ✏️ Editar
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onExcluir(
                        produto.id,
                        produto.nome
                      )
                    }
                    className="rounded-xl bg-red-500 px-4 py-3 font-bold text-white transition hover:bg-red-600"
                  >
                    🗑️ Excluir
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
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
    produto.tipo_produto,
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
      <section className="mt-10 rounded-3xl border border-border bg-card p-10 text-center shadow-sm">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-[color-mix(in_srgb,var(--primary)_8%,white)] text-3xl">
          📦
        </div>

        <h2 className="mt-4 text-2xl font-bold text-text">
          Nenhum produto cadastrado
        </h2>

        <p className="mt-2 text-text-light">
          Cadastre o primeiro produto usando o formulário acima.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-10">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-secondary">
            Catálogo administrativo
          </p>

          <h2 className="mt-1 text-3xl font-bold text-text">
            Produtos cadastrados
          </h2>
        </div>

        <span className="rounded-full bg-[color-mix(in_srgb,var(--primary)_10%,white)] px-5 py-2 font-bold text-primary">
          {produtos.length} produto(s)
        </span>
      </div>

      <div className="space-y-4">
        {produtos.map((produto) => {
          const logistica = Array.isArray(
            produto.produto_logistica,
          )
            ? produto.produto_logistica[0]
            : produto.produto_logistica;

          const tipoProduto = normalizarTipoProduto(
            produto.tipo_produto,
          );

          const produtoFisico =
            tipoProduto === "fisico";

          const identificacaoProduto =
            obterIdentificacaoProduto(produto);

          return (
            <article
              key={produto.id}
              className="rounded-3xl border border-border bg-card p-6 shadow-sm transition hover:shadow-lg"
            >
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                <div className="flex min-w-0 items-center gap-5">
                  <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-background">
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
                    <h3 className="truncate text-2xl font-bold text-text">
                      {produto.nome}
                    </h3>

                    <p className="mt-1 text-xl font-bold text-primary">
                      {formatarMoeda(produto.preco)}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2 text-sm font-bold">
                      <span className="rounded-full bg-background px-3 py-1 text-text-light">
                        {produto.categoria ||
                          "Sem categoria"}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 ${
                          produtoFisico
                            ? "bg-[color-mix(in_srgb,var(--primary)_10%,white)] text-primary"
                            : "bg-[color-mix(in_srgb,var(--success)_10%,white)] text-success"
                        }`}
                      >
                        {identificacaoProduto}
                      </span>

                      {produto.destaque && (
                        <span className="rounded-full bg-[color-mix(in_srgb,var(--secondary)_12%,white)] px-3 py-1 text-secondary">
                          ⭐ Destaque
                        </span>
                      )}
                    </div>

                    {produtoFisico && (
                      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-text-light">
                        <span>
                          Estoque:{" "}
                          <strong className="text-text">
                            {logistica?.estoque_fisico ?? 0}
                          </strong>
                        </span>

                        <span>
                          Frete:{" "}
                          <strong
                            className={
                              logistica?.frete_ativo
                                ? "text-success"
                                : "text-danger"
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
                            <strong className="text-text">
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
                    className="rounded-xl border border-border bg-background px-4 py-3 font-bold text-text-light transition hover:border-primary hover:text-primary"
                  >
                    👁 Ver loja
                  </a>

                  <button
                    type="button"
                    onClick={() =>
                      onEditar(produto)
                    }
                    className="rounded-xl bg-primary px-4 py-3 font-bold text-white transition hover:opacity-90"
                  >
                    ✏️ Editar
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onExcluir(
                        produto.id,
                        produto.nome,
                      )
                    }
                    className="rounded-xl bg-danger px-4 py-3 font-bold text-white transition hover:opacity-90"
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

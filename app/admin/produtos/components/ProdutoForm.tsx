"use client";

import {
  FORMATOS_ARQUIVO,
  TIPOS_PRODUTO,
  obterAcceptDoFormato,
  obterFormato,
} from "@/lib/config/produtos";

import LogisticaForm from "./LogisticaForm";
import UploadImagem from "./UploadImagem";
import ProdutoPreview from "./ProdutoPreview";
import ProductGalleryManager from "./ProductGalleryManager";
import ProductVideoManager from "./ProductVideoManager";

import useProdutoForm, {
  ProdutoAdministrativo,
} from "../hooks/useProdutoForm";

interface ProdutoFormProps {
  produtoEditando?: ProdutoAdministrativo | null;
  onConcluido?: () => void;
  onCancelarEdicao?: () => void;
}

export default function ProdutoForm({
  produtoEditando = null,
  onConcluido,
  onCancelarEdicao,
}: ProdutoFormProps) {
  const {
    nome,
    setNome,

    preco,
    setPreco,

    descricao,
    setDescricao,

    categoria,
    setCategoria,

    tipoProduto,
    alterarTipoProduto,

    formatoArquivo,
    alterarFormatoArquivo,

    destaque,
    setDestaque,

    imagem,
    setImagem,
    imagemAtual,

    imagensGaleria,
    setImagensGaleria,

    videoProduto,
    setVideoProduto,
    videoProdutoAtual,

    arquivoDigital,
    setArquivoDigital,
    arquivoDigitalAtual,
    inputArquivoDigitalRef,

    logistica,
    setLogistica,

    salvando,
    mensagem,
    erro,

    estaEditando,
    salvarProduto,
    cancelarEdicao,
  } = useProdutoForm({
    produtoEditando,
    onConcluido,
    onCancelarEdicao,
  });

  const produtoDigital =
    tipoProduto === "digital";

  const configuracaoFormato =
    obterFormato(formatoArquivo);

  const inputClass =
    "w-full rounded-xl border border-border bg-card p-4 text-text outline-none transition placeholder:text-text-light focus:border-primary focus:ring-2 focus:ring-[color-mix(in_srgb,var(--primary)_15%,transparent)]";

  return (
    <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
      {/* COLUNA ESQUERDA */}
      <div className="space-y-8">
        <section className="rounded-3xl border border-border bg-card p-8 shadow-xl">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-wide text-secondary">
              Painel administrativo
            </p>

            <h2 className="mt-1 text-3xl font-bold text-text">
              {estaEditando
                ? `✏️ Editar produto: ${nome}`
                : "📦 Cadastrar produto"}
            </h2>

            <p className="mt-2 text-text-light">
              {estaEditando
                ? "Atualize os dados do produto selecionado."
                : "Cadastre produtos físicos e digitais."}
            </p>

            {estaEditando && (
              <button
                type="button"
                onClick={cancelarEdicao}
                className="mt-5 rounded-xl border border-border bg-background px-5 py-3 font-bold text-text transition hover:border-primary hover:text-primary"
              >
                Cancelar edição
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block font-bold text-text">
                Nome do produto
              </label>

              <input
                type="text"
                value={nome}
                onChange={(e) =>
                  setNome(e.target.value)
                }
                placeholder="Ex.: Caneca Personalizada"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block font-bold text-text">
                Preço
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={preco}
                onChange={(e) =>
                  setPreco(e.target.value)
                }
                placeholder="Ex.: 39.90"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block font-bold text-text">
                Categoria
              </label>

              <select
                value={categoria}
                onChange={(e) =>
                  setCategoria(e.target.value)
                }
                className={inputClass}
              >
                <option>Canecas</option>
                <option>Topos de Bolo</option>
                <option>Lembrancinhas</option>
                <option>Marcadores</option>
                <option>Papelaria</option>
                <option>Festas</option>
                <option>Outros</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block font-bold text-text">
                Tipo do produto
              </label>

              <select
                value={tipoProduto}
                onChange={(e) =>
                  alterarTipoProduto(
                    e.target.value,
                  )
                }
                className={inputClass}
              >
                {TIPOS_PRODUTO.map(
                  (tipo) => (
                    <option
                      key={
                        tipo.value
                      }
                      value={
                        tipo.value
                      }
                    >
                      {
                        tipo.label
                      }
                    </option>
                  ),
                )}
              </select>

              <p className="mt-2 text-sm text-text-light">
                {produtoDigital
                  ? "O cliente receberá o arquivo para download após a compra."
                  : "O produto utilizará estoque, embalagem e cálculo de frete."}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <label className="mb-2 block font-bold text-text">
              Descrição
            </label>

            <textarea
              value={descricao}
              onChange={(e) =>
                setDescricao(
                  e.target.value,
                )
              }
              placeholder="Descreva as características do produto."
              className={`${inputClass} h-36 resize-y`}
            />
          </div>

          <div className="mt-6">
            <UploadImagem
              imagem={imagem}
              onSelecionar={
                setImagem
              }
            />

            {estaEditando &&
              imagemAtual &&
              !imagem && (
                <div className="mt-4 rounded-2xl border border-border bg-background p-4">
                  <p className="mb-3 font-bold text-text">
                    Imagem atual
                  </p>

                  <img
                    src={
                      imagemAtual
                    }
                    alt={
                      nome ||
                      "Imagem atual do produto"
                    }
                    className="h-32 w-32 rounded-xl border border-border object-cover"
                  />

                  <p className="mt-3 text-sm text-text-light">
                    Selecione uma nova imagem somente
                    para substituir a atual.
                  </p>
                </div>
              )}
          </div>

          <div className="mt-8">
            <ProductGalleryManager
              imagens={
                imagensGaleria
              }
              onChange={
                setImagensGaleria
              }
            />
          </div>

          <div className="mt-8">
            <ProductVideoManager
              video={
                videoProduto
              }
              videoAtual={
                videoProdutoAtual
              }
              onChange={
                setVideoProduto
              }
            />
          </div>

          {produtoDigital && (
            <div className="mt-6 space-y-5 rounded-2xl border border-success/30 bg-[color-mix(in_srgb,var(--success)_8%,white)] p-5">
              <div>
                <p className="font-bold text-success">
                  💻 Configuração do produto digital
                </p>

                <p className="mt-1 text-sm text-text-light">
                  Escolha o formato e envie o arquivo
                  principal que será entregue ao cliente.
                </p>
              </div>

              <div>
                <label className="mb-2 block font-bold text-text">
                  Formato do arquivo
                </label>

                <select
                  value={
                    formatoArquivo
                  }
                  onChange={(e) =>
                    alterarFormatoArquivo(
                      e.target
                        .value,
                    )
                  }
                  className={inputClass}
                >
                  {FORMATOS_ARQUIVO.map(
                    (
                      formato,
                    ) => (
                      <option
                        key={
                          formato.value
                        }
                        value={
                          formato.value
                        }
                      >
                        {
                          formato.icone
                        }{" "}
                        {
                          formato.label
                        }
                      </option>
                    ),
                  )}
                </select>
              </div>

              <div>
                <label className="mb-2 block font-bold text-text">
                  📁 Arquivo principal
                </label>

                <input
                  ref={
                    inputArquivoDigitalRef
                  }
                  type="file"
                  accept={obterAcceptDoFormato(
                    formatoArquivo,
                  )}
                  onChange={(e) =>
                    setArquivoDigital(
                      e.target
                        .files?.[0] ||
                        null,
                    )
                  }
                  className="w-full rounded-xl border border-border bg-card p-4 text-text file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:font-bold file:text-white"
                />

                <p className="mt-2 text-sm text-text-light">
                  Formato selecionado:{" "}
                  <strong className="text-text">
                    {configuracaoFormato?.label ||
                      formatoArquivo}
                  </strong>
                  . Extensões permitidas:{" "}
                  <strong className="text-text">
                    {configuracaoFormato?.accept ||
                      "*"}
                  </strong>
                  .
                </p>
              </div>

              {estaEditando &&
                arquivoDigitalAtual &&
                !arquivoDigital && (
                  <div className="rounded-xl border border-success/20 bg-card p-4">
                    <p className="font-bold text-success">
                      ✅ Arquivo digital atual mantido
                    </p>

                    <p className="mt-1 text-sm text-text-light">
                      Selecione um novo arquivo somente
                      para substituir o arquivo atual.
                    </p>

                    <a
                      href={
                        arquivoDigitalAtual
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-block font-bold text-success transition hover:opacity-80 hover:underline"
                    >
                      Abrir arquivo atual
                    </a>
                  </div>
                )}

              {arquivoDigital && (
                <div className="rounded-xl border border-success/20 bg-card p-4">
                  <p className="font-bold text-success">
                    ✅ Arquivo selecionado
                  </p>

                  <p className="mt-1 break-all text-sm text-text-light">
                    {
                      arquivoDigital.name
                    }
                  </p>
                </div>
              )}
            </div>
          )}

          <label className="mt-6 flex cursor-pointer items-center gap-3 rounded-2xl border border-secondary/30 bg-[color-mix(in_srgb,var(--secondary)_8%,white)] p-4 font-bold text-text">
            <input
              type="checkbox"
              checked={
                destaque
              }
              onChange={(e) =>
                setDestaque(
                  e.target
                    .checked,
                )
              }
              className="h-5 w-5 accent-[var(--secondary)]"
            />

            ⭐ Exibir este produto em destaque
          </label>
        </section>

        {tipoProduto ===
          "fisico" && (
          <LogisticaForm
            dados={
              logistica
            }
            onChange={
              setLogistica
            }
          />
        )}

        {erro && (
          <div className="rounded-2xl border border-danger/30 bg-[color-mix(in_srgb,var(--danger)_8%,white)] p-5 font-bold text-danger">
            ⚠️ {erro}
          </div>
        )}

        {mensagem && (
          <div className="rounded-2xl border border-success/30 bg-[color-mix(in_srgb,var(--success)_8%,white)] p-5 font-bold text-success">
            {mensagem}
          </div>
        )}

        <button
          type="button"
          onClick={
            salvarProduto
          }
          disabled={
            salvando
          }
          className="w-full rounded-2xl bg-primary px-6 py-5 text-xl font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {salvando
            ? estaEditando
              ? "Salvando alterações..."
              : "Salvando produto..."
            : estaEditando
              ? "Salvar alterações"
              : "Cadastrar produto"}
        </button>
      </div>

      {/* COLUNA DIREITA */}
      <ProdutoPreview
        nome={nome}
        preco={preco}
        categoria={
          categoria
        }
        tipoProduto={
          tipoProduto
        }
        formatoArquivo={
          formatoArquivo
        }
        imagem={
          imagem
        }
        destaque={
          destaque
        }
        logistica={
          logistica
        }
      />
    </div>
  );
}
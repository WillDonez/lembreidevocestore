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

  const produtoDigital = tipoProduto === "digital";

  const configuracaoFormato =
    obterFormato(formatoArquivo);

  return (
    <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
      {/* COLUNA ESQUERDA */}
      <div className="space-y-8">
        <section className="rounded-3xl bg-white p-8 shadow-xl">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-wide text-pink-500">
              Painel administrativo
            </p>

            <h2 className="mt-1 text-3xl font-bold text-gray-800">
              {estaEditando
                ? `✏️ Editar produto: ${nome}`
                : "📦 Cadastrar produto"}
            </h2>

            <p className="mt-2 text-gray-500">
              {estaEditando
                ? "Atualize os dados do produto selecionado."
                : "Cadastre produtos físicos e digitais."}
            </p>

            {estaEditando && (
              <button
                type="button"
                onClick={cancelarEdicao}
                className="mt-5 rounded-xl bg-gray-200 px-5 py-3 font-bold text-gray-700 transition hover:bg-gray-300"
              >
                Cancelar edição
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block font-bold text-gray-700">
                Nome do produto
              </label>

              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex.: Caneca Personalizada"
                className="w-full rounded-xl border p-4"
              />
            </div>

            <div>
              <label className="mb-2 block font-bold text-gray-700">
                Preço
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                placeholder="Ex.: 39.90"
                className="w-full rounded-xl border p-4"
              />
            </div>

            <div>
              <label className="mb-2 block font-bold text-gray-700">
                Categoria
              </label>

              <select
                value={categoria}
                onChange={(e) =>
                  setCategoria(e.target.value)
                }
                className="w-full rounded-xl border p-4"
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
              <label className="mb-2 block font-bold text-gray-700">
                Tipo do produto
              </label>

              <select
                value={tipoProduto}
                onChange={(e) =>
                  alterarTipoProduto(e.target.value)
                }
                className="w-full rounded-xl border p-4"
              >
                {TIPOS_PRODUTO.map((tipo) => (
                  <option
                    key={tipo.value}
                    value={tipo.value}
                  >
                    {tipo.label}
                  </option>
                ))}
              </select>

              <p className="mt-2 text-sm text-gray-500">
                {produtoDigital
                  ? "O cliente receberá o arquivo para download após a compra."
                  : "O produto utilizará estoque, embalagem e cálculo de frete."}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <label className="mb-2 block font-bold text-gray-700">
              Descrição
            </label>

            <textarea
              value={descricao}
              onChange={(e) =>
                setDescricao(e.target.value)
              }
              placeholder="Descreva as características do produto."
              className="h-36 w-full rounded-xl border p-4"
            />
          </div>

          <div className="mt-6">
            <UploadImagem
              imagem={imagem}
              onSelecionar={setImagem}
            />

            {estaEditando &&
              imagemAtual &&
              !imagem && (
                <div className="mt-4 rounded-2xl border bg-gray-50 p-4">
                  <p className="mb-3 font-bold text-gray-700">
                    Imagem atual
                  </p>

                  <img
                    src={imagemAtual}
                    alt={
                      nome ||
                      "Imagem atual do produto"
                    }
                    className="h-32 w-32 rounded-xl object-cover"
                  />

                  <p className="mt-3 text-sm text-gray-500">
                    Selecione uma nova imagem somente
                    para substituir a atual.
                  </p>
                </div>
              )}
          </div>

          {produtoDigital && (
            <div className="mt-6 space-y-5 rounded-2xl border border-green-200 bg-green-50 p-5">
              <div>
                <p className="font-bold text-green-900">
                  💻 Configuração do produto digital
                </p>

                <p className="mt-1 text-sm text-green-700">
                  Escolha o formato e envie o arquivo
                  principal que será entregue ao cliente.
                </p>
              </div>

              <div>
                <label className="mb-2 block font-bold text-green-800">
                  Formato do arquivo
                </label>

                <select
                  value={formatoArquivo}
                  onChange={(e) =>
                    alterarFormatoArquivo(
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-green-200 bg-white p-4"
                >
                  {FORMATOS_ARQUIVO.map(
                    (formato) => (
                      <option
                        key={formato.value}
                        value={formato.value}
                      >
                        {formato.icone}{" "}
                        {formato.label}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="mb-2 block font-bold text-green-800">
                  📁 Arquivo principal
                </label>

                <input
                  ref={inputArquivoDigitalRef}
                  type="file"
                  accept={obterAcceptDoFormato(
                    formatoArquivo
                  )}
                  onChange={(e) =>
                    setArquivoDigital(
                      e.target.files?.[0] || null
                    )
                  }
                  className="w-full rounded-xl border border-green-200 bg-white p-4"
                />

                <p className="mt-2 text-sm text-green-700">
                  Formato selecionado:{" "}
                  <strong>
                    {configuracaoFormato?.label ||
                      formatoArquivo}
                  </strong>
                  .
                  {" "}Extensões permitidas:{" "}
                  <strong>
                    {configuracaoFormato?.accept ||
                      "*"}
                  </strong>
                  .
                </p>
              </div>

              {estaEditando &&
                arquivoDigitalAtual &&
                !arquivoDigital && (
                  <div className="rounded-xl bg-white p-4">
                    <p className="font-bold text-green-700">
                      ✅ Arquivo digital atual mantido
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Selecione um novo arquivo somente
                      para substituir o arquivo atual.
                    </p>

                    <a
                      href={arquivoDigitalAtual}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-block font-bold text-green-600 hover:underline"
                    >
                      Abrir arquivo atual
                    </a>
                  </div>
                )}

              {arquivoDigital && (
                <div className="rounded-xl bg-white p-4">
                  <p className="font-bold text-green-700">
                    ✅ Arquivo selecionado
                  </p>

                  <p className="mt-1 break-all text-sm text-gray-600">
                    {arquivoDigital.name}
                  </p>
                </div>
              )}
            </div>
          )}

          <label className="mt-6 flex cursor-pointer items-center gap-3 rounded-2xl bg-yellow-50 p-4 font-bold text-gray-700">
            <input
              type="checkbox"
              checked={destaque}
              onChange={(e) =>
                setDestaque(e.target.checked)
              }
              className="h-5 w-5"
            />

            ⭐ Exibir este produto em destaque
          </label>
        </section>

        {tipoProduto === "fisico" && (
          <LogisticaForm
            dados={logistica}
            onChange={setLogistica}
          />
        )}

        {erro && (
          <div className="rounded-2xl border border-red-300 bg-red-50 p-5 font-bold text-red-700">
            ⚠️ {erro}
          </div>
        )}

        {mensagem && (
          <div className="rounded-2xl border border-green-300 bg-green-50 p-5 font-bold text-green-700">
            {mensagem}
          </div>
        )}

        <button
          type="button"
          onClick={salvarProduto}
          disabled={salvando}
          className="w-full rounded-2xl bg-pink-500 px-6 py-5 text-xl font-bold text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:bg-gray-300"
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
  categoria={categoria}
  tipoProduto={tipoProduto}
  formatoArquivo={formatoArquivo}
  imagem={imagem}
  destaque={destaque}
  logistica={logistica}
/>
    </div>
  );
}
"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  ehProdutoDigital,
  obterFormato,
} from "@/lib/config/produtos";
import type { DadosLogisticaForm } from "../components/LogisticaForm";

export type ProdutoAdministrativo = {
  id: number;
  nome?: string;
  preco?: number;
  imagem?: string;
  descricao?: string;
  categoria?: string;
  tipo_produto?: string;
  arquivo_digital?: string;
  formato_arquivo?: string;
  destaque?: boolean;

  produto_logistica?:
    | {
        peso?: number;
        largura?: number;
        altura?: number;
        comprimento?: number;
        valor_declarado?: number;
        frete_ativo?: boolean;
        estoque_fisico?: number;
        embalagem?: string | null;
      }
    | Array<{
        peso?: number;
        largura?: number;
        altura?: number;
        comprimento?: number;
        valor_declarado?: number;
        frete_ativo?: boolean;
        estoque_fisico?: number;
        embalagem?: string | null;
      }>;
};

interface UseProdutoFormProps {
  produtoEditando?: ProdutoAdministrativo | null;
  onConcluido?: () => void;
  onCancelarEdicao?: () => void;
}

const LOGISTICA_INICIAL: DadosLogisticaForm = {
  peso: "",
  largura: "",
  altura: "",
  comprimento: "",
  valorDeclarado: "",
  estoqueFisico: "",
  embalagem: "",
  freteAtivo: true,
};

/**
 * Converte os tipos antigos para a nova estrutura.
 *
 * Antes:
 * - fisico
 * - pdf
 * - kit
 *
 * Agora:
 * - fisico
 * - digital
 */
function normalizarTipoProduto(tipo?: string) {
  if (tipo === "pdf" || tipo === "kit" || tipo === "digital") {
    return "digital";
  }

  return "fisico";
}

/**
 * Descobre o formato dos produtos antigos.
 */
function normalizarFormatoArquivo(
  tipoProduto?: string,
  formatoArquivo?: string
) {
  if (formatoArquivo) {
    return formatoArquivo.toLowerCase();
  }

  if (tipoProduto === "kit") {
    return "zip";
  }

  if (tipoProduto === "pdf") {
    return "pdf";
  }

  return "pdf";
}

function obterExtensaoArquivo(nomeArquivo: string) {
  const partes = nomeArquivo.toLowerCase().split(".");

  if (partes.length < 2) {
    return "";
  }

  return `.${partes.pop()}`;
}

export default function useProdutoForm({
  produtoEditando = null,
  onConcluido,
  onCancelarEdicao,
}: UseProdutoFormProps = {}) {
  const inputArquivoDigitalRef =
    useRef<HTMLInputElement>(null);

  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("Canecas");

  const [tipoProduto, setTipoProduto] =
    useState("fisico");

  const [formatoArquivo, setFormatoArquivo] =
    useState("pdf");

  const [destaque, setDestaque] = useState(false);

  const [imagem, setImagem] =
    useState<File | null>(null);

  const [arquivoDigital, setArquivoDigital] =
    useState<File | null>(null);

  const [imagemAtual, setImagemAtual] =
    useState("");

  const [
    arquivoDigitalAtual,
    setArquivoDigitalAtual,
  ] = useState("");

  const [logistica, setLogistica] =
    useState<DadosLogisticaForm>(LOGISTICA_INICIAL);

  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  const estaEditando = Boolean(produtoEditando?.id);

  useEffect(() => {
    if (!produtoEditando) {
      return;
    }

    const logisticaProduto = Array.isArray(
      produtoEditando.produto_logistica
    )
      ? produtoEditando.produto_logistica[0]
      : produtoEditando.produto_logistica;

    const tipoNormalizado = normalizarTipoProduto(
      produtoEditando.tipo_produto
    );

    const formatoNormalizado = normalizarFormatoArquivo(
      produtoEditando.tipo_produto,
      produtoEditando.formato_arquivo
    );

    setNome(produtoEditando.nome || "");

    setPreco(
      String(produtoEditando.preco ?? "")
    );

    setDescricao(
      produtoEditando.descricao || ""
    );

    setCategoria(
      produtoEditando.categoria || "Canecas"
    );

    setTipoProduto(tipoNormalizado);
    setFormatoArquivo(formatoNormalizado);

    setDestaque(
      Boolean(produtoEditando.destaque)
    );

    setImagem(null);
    setArquivoDigital(null);

    setImagemAtual(
      produtoEditando.imagem || ""
    );

    setArquivoDigitalAtual(
      produtoEditando.arquivo_digital || ""
    );

    setLogistica({
      peso: String(
        logisticaProduto?.peso ?? ""
      ),

      largura: String(
        logisticaProduto?.largura ?? ""
      ),

      altura: String(
        logisticaProduto?.altura ?? ""
      ),

      comprimento: String(
        logisticaProduto?.comprimento ?? ""
      ),

      valorDeclarado: String(
        logisticaProduto?.valor_declarado ?? ""
      ),

      estoqueFisico: String(
        logisticaProduto?.estoque_fisico ?? ""
      ),

      embalagem:
        logisticaProduto?.embalagem || "",

      freteAtivo:
        logisticaProduto?.frete_ativo ?? true,
    });

    setMensagem("");
    setErro("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [produtoEditando]);

  function limparCampoArquivoDigital() {
    if (inputArquivoDigitalRef.current) {
      inputArquivoDigitalRef.current.value = "";
    }
  }

  function limparFormulario() {
    setNome("");
    setPreco("");
    setDescricao("");
    setCategoria("Canecas");

    setTipoProduto("fisico");
    setFormatoArquivo("pdf");

    setDestaque(false);

    setImagem(null);
    setArquivoDigital(null);

    setImagemAtual("");
    setArquivoDigitalAtual("");

    setLogistica({
      ...LOGISTICA_INICIAL,
    });

    limparCampoArquivoDigital();
  }

  function cancelarEdicao() {
    limparFormulario();
    setMensagem("");
    setErro("");

    onCancelarEdicao?.();
  }

  function alterarTipoProduto(novoTipo: string) {
    const tipoNormalizado =
      novoTipo === "digital"
        ? "digital"
        : "fisico";

    setTipoProduto(tipoNormalizado);
    setArquivoDigital(null);

    if (tipoNormalizado === "fisico") {
      setArquivoDigitalAtual("");
    }

    limparCampoArquivoDigital();
  }

  function alterarFormatoArquivo(
    novoFormato: string
  ) {
    setFormatoArquivo(novoFormato);
    setArquivoDigital(null);
    limparCampoArquivoDigital();
  }

  function nomeSeguro(nomeArquivo: string) {
    return `${Date.now()}-${nomeArquivo
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9.]/g, "-")}`;
  }

  async function uploadImagem(): Promise<string> {
    if (!imagem) {
      return imagemAtual;
    }

    const caminho = nomeSeguro(imagem.name);

    const { error } = await supabase.storage
      .from("produtos")
      .upload(caminho, imagem);

    if (error) {
      console.error(
        "Erro no upload da imagem:",
        error
      );

      throw new Error(
        "Não foi possível enviar a imagem."
      );
    }

    const { data } = supabase.storage
      .from("produtos")
      .getPublicUrl(caminho);

    return data.publicUrl;
  }

  async function uploadDigital(): Promise<string> {
    if (!ehProdutoDigital(tipoProduto)) {
      return "";
    }

    if (!arquivoDigital) {
      return arquivoDigitalAtual;
    }

    const caminho = nomeSeguro(
      arquivoDigital.name
    );

    const { error } = await supabase.storage
      .from("arquivos-digitais")
      .upload(caminho, arquivoDigital);

    if (error) {
      console.error(
        "Erro no upload do arquivo digital:",
        error
      );

      throw new Error(
        "Não foi possível enviar o arquivo digital."
      );
    }

    const { data } = supabase.storage
      .from("arquivos-digitais")
      .getPublicUrl(caminho);

    return data.publicUrl;
  }

  function validarArquivoDigital() {
    if (!ehProdutoDigital(tipoProduto)) {
      return;
    }

    const configuracaoFormato =
      obterFormato(formatoArquivo);

    if (!configuracaoFormato) {
      throw new Error(
        "Selecione um formato de arquivo válido."
      );
    }

    if (
      !arquivoDigital &&
      !arquivoDigitalAtual
    ) {
      throw new Error(
        `Selecione o arquivo principal no formato ${configuracaoFormato.label}.`
      );
    }

    if (!arquivoDigital) {
      return;
    }

    const extensaoSelecionada =
      obterExtensaoArquivo(
        arquivoDigital.name
      );

    const extensoesPermitidas =
      configuracaoFormato.accept
        .split(",")
        .map((extensao) =>
          extensao.trim().toLowerCase()
        );

    if (
      !extensoesPermitidas.includes(
        extensaoSelecionada
      )
    ) {
      throw new Error(
        `O arquivo selecionado não corresponde ao formato ${configuracaoFormato.label}. Formatos permitidos: ${configuracaoFormato.accept}.`
      );
    }
  }

  function validarFormulario() {
    if (!nome.trim()) {
      throw new Error(
        "Informe o nome do produto."
      );
    }

    const precoNumero = Number(preco);

    if (
      !Number.isFinite(precoNumero) ||
      precoNumero < 0
    ) {
      throw new Error(
        "Informe um preço válido."
      );
    }

    validarArquivoDigital();

    if (
      tipoProduto === "fisico" &&
      logistica.freteAtivo
    ) {
      const peso = Number(logistica.peso);
      const largura = Number(logistica.largura);
      const altura = Number(logistica.altura);

      const comprimento = Number(
        logistica.comprimento
      );

      if (
        peso <= 0 ||
        largura <= 0 ||
        altura <= 0 ||
        comprimento <= 0
      ) {
        throw new Error(
          "Para calcular o frete, informe peso, largura, altura e comprimento."
        );
      }
    }
  }

  async function salvarProduto() {
    setMensagem("");
    setErro("");

    try {
      validarFormulario();
      setSalvando(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error(
          "Sua sessão expirou. Entre novamente no painel."
        );
      }

      const imagemUrl =
        await uploadImagem();

      const arquivoDigitalUrl =
        await uploadDigital();

      const metodo = estaEditando
        ? "PUT"
        : "POST";

      const resposta = await fetch(
        "/api/admin/produtos",
        {
          method: metodo,

          headers: {
            "Content-Type": "application/json",

            Authorization:
              `Bearer ${session.access_token}`,
          },

          body: JSON.stringify({
            id: produtoEditando?.id,

            nome: nome.trim(),

            preco: Number(preco),

            imagem: imagemUrl,

            descricao: descricao.trim(),

            categoria,

            tipo_produto: tipoProduto,

            arquivo_digital:
              ehProdutoDigital(tipoProduto)
                ? arquivoDigitalUrl
                : "",

            formato_arquivo:
              ehProdutoDigital(tipoProduto)
                ? formatoArquivo
                : null,

            destaque,

            logistica: {
              peso: Number(
                logistica.peso || 0
              ),

              largura: Number(
                logistica.largura || 0
              ),

              altura: Number(
                logistica.altura || 0
              ),

              comprimento: Number(
                logistica.comprimento || 0
              ),

              valor_declarado: Number(
                logistica.valorDeclarado ||
                  preco ||
                  0
              ),

              frete_ativo:
                tipoProduto === "fisico"
                  ? logistica.freteAtivo
                  : false,

              estoque_fisico:
                tipoProduto === "fisico"
                  ? Number(
                      logistica.estoqueFisico ||
                        0
                    )
                  : 0,

              embalagem:
                tipoProduto === "fisico"
                  ? logistica.embalagem.trim()
                  : "",
            },
          }),
        }
      );

      const resultado =
        await resposta.json();

      if (!resposta.ok) {
        console.error(
          "Erro da API de produtos:",
          resultado
        );

        throw new Error(
          resultado.erro ||
            "Não foi possível salvar o produto."
        );
      }

      setMensagem(
        estaEditando
          ? "✅ Produto atualizado com sucesso!"
          : "✅ Produto cadastrado com sucesso!"
      );

      limparFormulario();

      window.dispatchEvent(
        new CustomEvent("produto-salvo")
      );

      // Compatibilidade temporária
      // com o evento utilizado anteriormente.
      window.dispatchEvent(
        new CustomEvent("produto-cadastrado")
      );

      onConcluido?.();
    } catch (error) {
      console.error(error);

      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível salvar o produto."
      );
    } finally {
      setSalvando(false);
    }
  }

  return {
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
    limparFormulario,
    cancelarEdicao,
  };
}
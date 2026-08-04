"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

import {
  ehProdutoDigital,
  obterFormato,
} from "@/lib/config/produtos";

import { uploadGaleria } from "@/lib/produto/uploadGaleria";
import { salvarGaleria } from "@/lib/produto/salvarGaleria";
import { removerUploadsGaleria } from "@/lib/produto/removerUploadsGaleria";
import {
  obterCaminhoVideoDaUrl,
  removerUploadVideo,
  uploadVideo,
} from "@/lib/produto/uploadVideo";

import type {
  ImagemGaleria,
  ImagemGaleriaUpload,
} from "@/lib/produto/types";

import type {
  DadosLogisticaForm,
} from "../components/LogisticaForm";

/*
  Mantém compatibilidade com o ProductGalleryManager,
  que atualmente importa este tipo pelo hook.
*/
export type {
  ImagemGaleria,
} from "@/lib/produto/types";

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
  video_produto?: string;
  capa_video?: string;
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

type RegistroGaleriaBanco = {
  id: number;
  produto_id: number;
  url: string;
  ordem: number;
  created_at?: string;
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

function normalizarTipoProduto(tipo?: string) {
  if (
    tipo === "pdf" ||
    tipo === "kit" ||
    tipo === "digital"
  ) {
    return "digital";
  }

  return "fisico";
}

function normalizarFormatoArquivo(
  tipoProduto?: string,
  formatoArquivo?: string,
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

function obterExtensaoArquivo(
  nomeArquivo: string,
) {
  const partes = nomeArquivo
    .toLowerCase()
    .split(".");

  if (partes.length < 2) {
    return "";
  }

  return `.${partes.pop()}`;
}

/*
  Obtém o caminho interno de um arquivo a partir
  da URL pública do bucket produto-imagens.
*/
function obterCaminhoDaUrlGaleria(
  url: string,
) {
  const marcador =
    "/storage/v1/object/public/produto-imagens/";

  const indice = url.indexOf(marcador);

  if (indice === -1) {
    return "";
  }

  const caminhoCodificado = url.slice(
    indice + marcador.length,
  );

  try {
    return decodeURIComponent(
      caminhoCodificado,
    );
  } catch {
    return caminhoCodificado;
  }
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
  const [descricao, setDescricao] =
    useState("");

  const [categoria, setCategoria] =
    useState("Canecas");

  const [tipoProduto, setTipoProduto] =
    useState("fisico");

  const [
    formatoArquivo,
    setFormatoArquivo,
  ] = useState("pdf");

  const [destaque, setDestaque] =
    useState(false);

  const [imagem, setImagem] =
    useState<File | null>(null);

  const [
    imagensGaleria,
    setImagensGaleria,
  ] = useState<ImagemGaleria[]>([]);

  const [
    arquivoDigital,
    setArquivoDigital,
  ] = useState<File | null>(null);

  const [
    videoProduto,
    setVideoProduto,
  ] = useState<File | null>(null);

  const [
    imagemAtual,
    setImagemAtual,
  ] = useState("");

  const [
    arquivoDigitalAtual,
    setArquivoDigitalAtual,
  ] = useState("");

  const [
    videoProdutoAtual,
    setVideoProdutoAtual,
  ] = useState("");

  const [
    capaVideoAtual,
    setCapaVideoAtual,
  ] = useState("");

  const [logistica, setLogistica] =
    useState<DadosLogisticaForm>(
      LOGISTICA_INICIAL,
    );

  const [
    carregandoGaleria,
    setCarregandoGaleria,
  ] = useState(false);

  const [salvando, setSalvando] =
    useState(false);

  const [mensagem, setMensagem] =
    useState("");

  const [erro, setErro] =
    useState("");

  const estaEditando = Boolean(
    produtoEditando?.id,
  );

  /*
    Carrega os dados principais quando um produto
    é selecionado para edição.
  */
  useEffect(() => {
    if (!produtoEditando) {
      return;
    }

    const logisticaProduto = Array.isArray(
      produtoEditando.produto_logistica,
    )
      ? produtoEditando.produto_logistica[0]
      : produtoEditando.produto_logistica;

    const tipoNormalizado =
      normalizarTipoProduto(
        produtoEditando.tipo_produto,
      );

    const formatoNormalizado =
      normalizarFormatoArquivo(
        produtoEditando.tipo_produto,
        produtoEditando.formato_arquivo,
      );

    setNome(produtoEditando.nome || "");

    setPreco(
      String(produtoEditando.preco ?? ""),
    );

    setDescricao(
      produtoEditando.descricao || "",
    );

    setCategoria(
      produtoEditando.categoria ||
        "Canecas",
    );

    setTipoProduto(tipoNormalizado);
    setFormatoArquivo(
      formatoNormalizado,
    );

    setDestaque(
      Boolean(produtoEditando.destaque),
    );

    setImagem(null);
    setArquivoDigital(null);
    setVideoProduto(null);

    setImagemAtual(
      produtoEditando.imagem || "",
    );

    setArquivoDigitalAtual(
      produtoEditando.arquivo_digital ||
        "",
    );

    setVideoProdutoAtual(
      produtoEditando.video_produto || "",
    );

    setCapaVideoAtual(
      produtoEditando.capa_video || "",
    );

    setLogistica({
      peso: String(
        logisticaProduto?.peso ?? "",
      ),

      largura: String(
        logisticaProduto?.largura ?? "",
      ),

      altura: String(
        logisticaProduto?.altura ?? "",
      ),

      comprimento: String(
        logisticaProduto?.comprimento ??
          "",
      ),

      valorDeclarado: String(
        logisticaProduto?.valor_declarado ??
          "",
      ),

      estoqueFisico: String(
        logisticaProduto?.estoque_fisico ??
          "",
      ),

      embalagem:
        logisticaProduto?.embalagem || "",

      freteAtivo:
        logisticaProduto?.frete_ativo ??
        true,
    });

    setMensagem("");
    setErro("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [produtoEditando]);

  /*
    Busca a galeria já salva quando o administrador
    abre um produto para edição.
  */
  useEffect(() => {
    let cancelado = false;

    async function carregarGaleriaProduto() {
      const produtoId =
        produtoEditando?.id;

      if (!produtoId) {
        setImagensGaleria([]);
        setCarregandoGaleria(false);
        return;
      }

      setCarregandoGaleria(true);

      const { data, error } = await supabase
        .from("produto_imagens")
        .select(
          "id, produto_id, url, ordem, created_at",
        )
        .eq("produto_id", produtoId)
        .order("ordem", {
          ascending: true,
        });

      if (cancelado) {
        return;
      }

      if (error) {
        console.error(
          "Erro ao carregar galeria:",
          error,
        );

        setErro(
          "O produto foi carregado, mas não foi possível carregar sua galeria.",
        );

        setImagensGaleria([]);
        setCarregandoGaleria(false);
        return;
      }

      const imagensCarregadas: ImagemGaleria[] =
        (data ?? []).map(
          (
            registro: RegistroGaleriaBanco,
          ) => ({
            id: String(registro.id),
            url: registro.url,
            ordem: registro.ordem,
            temporaria: false,
          }),
        );

      setImagensGaleria(
        imagensCarregadas,
      );

      setCarregandoGaleria(false);
    }

    carregarGaleriaProduto();

    return () => {
      cancelado = true;
    };
  }, [produtoEditando?.id]);

  function limparCampoArquivoDigital() {
    if (inputArquivoDigitalRef.current) {
      inputArquivoDigitalRef.current.value =
        "";
    }
  }

  function liberarUrlsTemporariasGaleria() {
    imagensGaleria.forEach(
      (imagemGaleria) => {
        if (
          imagemGaleria.temporaria &&
          imagemGaleria.url.startsWith(
            "blob:",
          )
        ) {
          URL.revokeObjectURL(
            imagemGaleria.url,
          );
        }
      },
    );
  }

  function limparFormulario() {
    liberarUrlsTemporariasGaleria();

    setNome("");
    setPreco("");
    setDescricao("");
    setCategoria("Canecas");

    setTipoProduto("fisico");
    setFormatoArquivo("pdf");

    setDestaque(false);

    setImagem(null);
    setImagensGaleria([]);
    setArquivoDigital(null);
    setVideoProduto(null);

    setImagemAtual("");
    setArquivoDigitalAtual("");
    setVideoProdutoAtual("");
    setCapaVideoAtual("");

    setLogistica({
      ...LOGISTICA_INICIAL,
    });

    setCarregandoGaleria(false);

    limparCampoArquivoDigital();
  }

  function cancelarEdicao() {
    limparFormulario();

    setMensagem("");
    setErro("");

    onCancelarEdicao?.();
  }

  function alterarTipoProduto(
    novoTipo: string,
  ) {
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
    novoFormato: string,
  ) {
    setFormatoArquivo(novoFormato);
    setArquivoDigital(null);

    limparCampoArquivoDigital();
  }

  function nomeSeguro(
    nomeArquivo: string,
  ) {
    return `${Date.now()}-${nomeArquivo
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(
        /[^a-zA-Z0-9.]/g,
        "-",
      )}`;
  }

  async function uploadImagem(): Promise<string> {
    if (!imagem) {
      return imagemAtual;
    }

    const caminho = nomeSeguro(
      imagem.name,
    );

    const { error } = await supabase.storage
      .from("produtos")
      .upload(caminho, imagem);

    if (error) {
      console.error(
        "Erro no upload da imagem:",
        error,
      );

      throw new Error(
        "Não foi possível enviar a imagem.",
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
      arquivoDigital.name,
    );

    const { error } = await supabase.storage
      .from("arquivos-digitais")
      .upload(
        caminho,
        arquivoDigital,
      );

    if (error) {
      console.error(
        "Erro no upload do arquivo digital:",
        error,
      );

      throw new Error(
        "Não foi possível enviar o arquivo digital.",
      );
    }

    const { data } = supabase.storage
      .from("arquivos-digitais")
      .getPublicUrl(caminho);

    return data.publicUrl;
  }

  async function prepararVideoProduto() {
    if (!videoProduto) {
      return {
        url: videoProdutoAtual,
        caminho: "",
      };
    }

    return uploadVideo(videoProduto);
  }

  async function removerVideoAnteriorSeNecessario(
    novaUrl: string,
  ) {
    if (
      !videoProduto ||
      !videoProdutoAtual ||
      videoProdutoAtual === novaUrl
    ) {
      return;
    }

    const caminhoAnterior =
      obterCaminhoVideoDaUrl(
        videoProdutoAtual,
      );

    if (caminhoAnterior) {
      await removerUploadVideo(
        caminhoAnterior,
      );
    }
  }

  function validarArquivoDigital() {
    if (!ehProdutoDigital(tipoProduto)) {
      return;
    }

    const configuracaoFormato =
      obterFormato(formatoArquivo);

    if (!configuracaoFormato) {
      throw new Error(
        "Selecione um formato de arquivo válido.",
      );
    }

    if (
      !arquivoDigital &&
      !arquivoDigitalAtual
    ) {
      throw new Error(
        `Selecione o arquivo principal no formato ${configuracaoFormato.label}.`,
      );
    }

    if (!arquivoDigital) {
      return;
    }

    const extensaoSelecionada =
      obterExtensaoArquivo(
        arquivoDigital.name,
      );

    const extensoesPermitidas =
      configuracaoFormato.accept
        .split(",")
        .map((extensao) =>
          extensao
            .trim()
            .toLowerCase(),
        );

    if (
      !extensoesPermitidas.includes(
        extensaoSelecionada,
      )
    ) {
      throw new Error(
        `O arquivo selecionado não corresponde ao formato ${configuracaoFormato.label}. Formatos permitidos: ${configuracaoFormato.accept}.`,
      );
    }
  }

  function validarFormulario() {
    if (!nome.trim()) {
      throw new Error(
        "Informe o nome do produto.",
      );
    }

    const precoNumero = Number(preco);

    if (
      !Number.isFinite(precoNumero) ||
      precoNumero < 0
    ) {
      throw new Error(
        "Informe um preço válido.",
      );
    }

    if (imagensGaleria.length > 10) {
      throw new Error(
        "A galeria pode ter no máximo 10 imagens.",
      );
    }

    if (
      estaEditando &&
      carregandoGaleria
    ) {
      throw new Error(
        "Aguarde o carregamento da galeria antes de salvar.",
      );
    }

    validarArquivoDigital();

    if (
      tipoProduto === "fisico" &&
      logistica.freteAtivo
    ) {
      const peso = Number(
        logistica.peso,
      );

      const largura = Number(
        logistica.largura,
      );

      const altura = Number(
        logistica.altura,
      );

      const comprimento = Number(
        logistica.comprimento,
      );

      if (
        peso <= 0 ||
        largura <= 0 ||
        altura <= 0 ||
        comprimento <= 0
      ) {
        throw new Error(
          "Para calcular o frete, informe peso, largura, altura e comprimento.",
        );
      }
    }
  }

  /*
    Remove do Storage arquivos antigos que foram
    excluídos pelo administrador.
  */
  async function removerArquivosAntigos(
    registrosAnteriores: RegistroGaleriaBanco[],
    urlsMantidas: Set<string>,
  ) {
    const uploadsParaRemover: ImagemGaleriaUpload[] =
      registrosAnteriores
        .filter(
          (registro) =>
            !urlsMantidas.has(
              registro.url,
            ),
        )
        .map((registro) => ({
          url: registro.url,

          caminho:
            obterCaminhoDaUrlGaleria(
              registro.url,
            ),

          ordem: registro.ordem,
        }))
        .filter(
          (imagem) =>
            Boolean(imagem.caminho),
        );

    if (
      uploadsParaRemover.length > 0
    ) {
      await removerUploadsGaleria(
        uploadsParaRemover,
      );
    }
  }

  /*
    Sincroniza a galeria inteira:
    - preserva imagens já existentes;
    - envia imagens novas;
    - atualiza a ordem;
    - remove imagens excluídas.
  */
  async function sincronizarGaleria(
    produtoId: number,
  ) {
    const {
      data: registrosAnterioresData,
      error: buscaErro,
    } = await supabase
      .from("produto_imagens")
      .select(
        "id, produto_id, url, ordem, created_at",
      )
      .eq("produto_id", produtoId)
      .order("ordem", {
        ascending: true,
      });

    if (buscaErro) {
      console.error(
        "Erro ao consultar galeria anterior:",
        buscaErro,
      );

      throw new Error(
        "Não foi possível consultar a galeria atual do produto.",
      );
    }

    const registrosAnteriores =
      (registrosAnterioresData ??
        []) as RegistroGaleriaBanco[];

    let uploadsNovos:
      ImagemGaleriaUpload[] = [];

    try {
      uploadsNovos = await uploadGaleria(
        imagensGaleria,
      );

      const imagensExistentes =
        imagensGaleria
          .filter(
            (imagemGaleria) =>
              !imagemGaleria.temporaria &&
              !imagemGaleria.url.startsWith(
                "blob:",
              ),
          )
          .map((imagemGaleria) => ({
            url: imagemGaleria.url,

            caminho:
              obterCaminhoDaUrlGaleria(
                imagemGaleria.url,
              ),

            ordem: imagemGaleria.ordem,
          }));

      const imagensFinais = [
        ...imagensExistentes,
        ...uploadsNovos,
      ]
        .sort(
          (a, b) =>
            a.ordem - b.ordem,
        )
        .map((imagem, indice) => ({
          ...imagem,
          ordem: indice + 1,
        }));

      if (imagensFinais.length > 10) {
        throw new Error(
          "A galeria pode ter no máximo 10 imagens.",
        );
      }

      /*
        Remove temporariamente os registros anteriores
        para evitar conflito no índice único de ordem.
      */
      const { error: exclusaoErro } =
        await supabase
          .from("produto_imagens")
          .delete()
          .eq("produto_id", produtoId);

      if (exclusaoErro) {
        console.error(
          "Erro ao preparar atualização da galeria:",
          exclusaoErro,
        );

        throw new Error(
          "Não foi possível preparar a atualização da galeria.",
        );
      }

      try {
        await salvarGaleria({
          produtoId,
          imagens: imagensFinais,
        });
      } catch (salvamentoErro) {
        /*
          Tenta restaurar os registros anteriores
          caso a nova gravação falhe.
        */
        if (
          registrosAnteriores.length > 0
        ) {
          const registrosParaRestaurar =
            registrosAnteriores.map(
              (registro) => ({
                produto_id:
                  registro.produto_id,

                url: registro.url,

                ordem: registro.ordem,
              }),
            );

          const { error: restauracaoErro } =
            await supabase
              .from("produto_imagens")
              .insert(
                registrosParaRestaurar,
              );

          if (restauracaoErro) {
            console.error(
              "Erro ao restaurar galeria anterior:",
              restauracaoErro,
            );
          }
        }

        throw salvamentoErro;
      }

      const urlsMantidas = new Set(
        imagensExistentes.map(
          (imagem) => imagem.url,
        ),
      );

      await removerArquivosAntigos(
        registrosAnteriores,
        urlsMantidas,
      );
    } catch (error) {
      if (uploadsNovos.length > 0) {
        await removerUploadsGaleria(
          uploadsNovos,
        );
      }

      throw error;
    }
  }

  async function excluirProdutoCriado(
    produtoId: number,
    accessToken: string,
  ) {
    try {
      const respostaExclusao =
        await fetch(
          `/api/admin/produtos?id=${produtoId}`,
          {
            method: "DELETE",

            headers: {
              Authorization:
                `Bearer ${accessToken}`,
            },
          },
        );

      if (!respostaExclusao.ok) {
        console.error(
          "Não foi possível desfazer o cadastro do produto após erro na galeria.",
        );
      }
    } catch (error) {
      console.error(
        "Erro ao desfazer cadastro do produto:",
        error,
      );
    }
  }

  async function salvarProduto() {
    setMensagem("");
    setErro("");

    let produtoNovoId:
      number | null = null;

    let caminhoNovoVideo = "";
    let videoFoiPersistido = false;

    try {
      validarFormulario();
      setSalvando(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error(
          "Sua sessão expirou. Entre novamente no painel.",
        );
      }

      const imagemUrl =
        await uploadImagem();

      const arquivoDigitalUrl =
        await uploadDigital();

      const resultadoVideo =
        await prepararVideoProduto();

      caminhoNovoVideo =
        resultadoVideo.caminho;

      const videoProdutoUrl =
        resultadoVideo.url;

      const metodo = estaEditando
        ? "PUT"
        : "POST";

      const resposta = await fetch(
        "/api/admin/produtos",
        {
          method: metodo,

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${session.access_token}`,
          },

          body: JSON.stringify({
            id: produtoEditando?.id,

            nome: nome.trim(),

            preco: Number(preco),

            imagem: imagemUrl,

            descricao:
              descricao.trim(),

            categoria,

            tipo_produto:
              tipoProduto,

            arquivo_digital:
              ehProdutoDigital(
                tipoProduto,
              )
                ? arquivoDigitalUrl
                : "",

            formato_arquivo:
              ehProdutoDigital(
                tipoProduto,
              )
                ? formatoArquivo
                : null,

            video_produto:
              videoProdutoUrl,

            capa_video:
              capaVideoAtual,

            destaque,

            logistica: {
              peso: Number(
                logistica.peso || 0,
              ),

              largura: Number(
                logistica.largura || 0,
              ),

              altura: Number(
                logistica.altura || 0,
              ),

              comprimento: Number(
                logistica.comprimento ||
                  0,
              ),

              valor_declarado: Number(
                logistica.valorDeclarado ||
                  preco ||
                  0,
              ),

              frete_ativo:
                tipoProduto === "fisico"
                  ? logistica.freteAtivo
                  : false,

              estoque_fisico:
                tipoProduto === "fisico"
                  ? Number(
                      logistica.estoqueFisico ||
                        0,
                    )
                  : 0,

              embalagem:
                tipoProduto === "fisico"
                  ? logistica.embalagem.trim()
                  : "",
            },
          }),
        },
      );

      const resultado =
        await resposta.json();

      if (!resposta.ok) {
        console.error(
          "Erro da API de produtos:",
          resultado,
        );

        throw new Error(
          resultado.erro ||
            "Não foi possível salvar o produto.",
        );
      }

      videoFoiPersistido = true;

      const produtoId = estaEditando
        ? Number(produtoEditando?.id)
        : Number(resultado?.produto?.id);

      if (
        !Number.isInteger(produtoId) ||
        produtoId <= 0
      ) {
        throw new Error(
          "O produto foi salvo, mas não foi possível identificar seu código.",
        );
      }

      if (!estaEditando) {
        produtoNovoId = produtoId;
      }

      try {
        await sincronizarGaleria(
          produtoId,
        );
      } catch (galeriaErro) {
        /*
          Em produto novo, desfaz o cadastro para
          evitar produto incompleto.
        */
        if (
          !estaEditando &&
          produtoNovoId
        ) {
          await excluirProdutoCriado(
            produtoNovoId,
            session.access_token,
          );

          videoFoiPersistido = false;
        }

        throw galeriaErro;
      }

      await removerVideoAnteriorSeNecessario(
        videoProdutoUrl,
      );

      setMensagem(
        estaEditando
          ? "✅ Produto, galeria e vídeo atualizados com sucesso!"
          : "✅ Produto, galeria e vídeo cadastrados com sucesso!",
      );

      limparFormulario();

      window.dispatchEvent(
        new CustomEvent(
          "produto-salvo",
        ),
      );

      window.dispatchEvent(
        new CustomEvent(
          "produto-cadastrado",
        ),
      );

      onConcluido?.();
    } catch (error) {
      if (
        caminhoNovoVideo &&
        !videoFoiPersistido
      ) {
        await removerUploadVideo(
          caminhoNovoVideo,
        );
      }

      console.error(error);

      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível salvar o produto.",
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

    imagensGaleria,
    setImagensGaleria,

    arquivoDigital,
    setArquivoDigital,
    arquivoDigitalAtual,
    inputArquivoDigitalRef,

    videoProduto,
    setVideoProduto,
    videoProdutoAtual,
    capaVideoAtual,

    logistica,
    setLogistica,

    carregandoGaleria,

    salvando,
    mensagem,
    erro,

    estaEditando,
    salvarProduto,
    limparFormulario,
    cancelarEdicao,
  };
}
"use client";

import {
  Building2,
  CheckCircle2,
  ImagePlus,
  Loader2,
  Save,
  Store,
  Upload,
} from "lucide-react";

import {
  ChangeEvent,
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  CONFIGURACOES_IMAGENS,
  legendaImagem,
} from "@/lib/config/imagens";

import { supabase } from "@/lib/supabase";

type IdentidadeLoja = {
  id: number;
  nome_loja: string;
  logo_url: string | null;
  favicon_url: string | null;
  ativo: boolean;
  created_at?: string;
  updated_at?: string;
};

const TIPOS_LOGO_PERMITIDOS = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
];

const TAMANHO_MAXIMO_LOGO =
  5 * 1024 * 1024;

const TIPOS_FAVICON_PERMITIDOS = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/x-icon",
  "image/vnd.microsoft.icon",
];

const TAMANHO_MAXIMO_FAVICON =
  2 * 1024 * 1024;

export default function IdentidadeLojaCard() {
  const [
    identidade,
    setIdentidade,
  ] = useState<IdentidadeLoja | null>(
    null,
  );

  const [
    arquivoLogo,
    setArquivoLogo,
  ] = useState<File | null>(
    null,
  );

  const [
    arquivoFavicon,
    setArquivoFavicon,
  ] = useState<File | null>(
    null,
  );

  const [
    previewLogo,
    setPreviewLogo,
  ] = useState("");

  const [
    previewFavicon,
    setPreviewFavicon,
  ] = useState("");

  const [
    carregando,
    setCarregando,
  ] = useState(true);

  const [
    salvando,
    setSalvando,
  ] = useState(false);

  const [
    erro,
    setErro,
  ] = useState("");

  const [
    mensagem,
    setMensagem,
  ] = useState("");

  const buscarIdentidade =
    useCallback(async () => {
      try {
        setCarregando(true);
        setErro("");

        const {
          data: { session },
        } =
          await supabase.auth.getSession();

        if (!session) {
          throw new Error(
            "Sua sessão expirou. Entre novamente no painel.",
          );
        }

        const resposta =
          await fetch(
            "/api/admin/identidade",
            {
              method: "GET",

              headers: {
                Authorization:
                  `Bearer ${session.access_token}`,
              },

              cache: "no-store",
            },
          );

        const resultado =
          await resposta.json();

        if (!resposta.ok) {
          throw new Error(
            resultado.erro ||
              "Não foi possível carregar a identidade da loja.",
          );
        }

        setIdentidade(
          resultado.identidade,
        );
      } catch (error) {
        console.error(
          "Erro ao carregar identidade da loja:",
          error,
        );

        setErro(
          error instanceof Error
            ? error.message
            : "Não foi possível carregar a identidade da loja.",
        );
      } finally {
        setCarregando(false);
      }
    }, []);

  useEffect(() => {
    void buscarIdentidade();
  }, [buscarIdentidade]);

  useEffect(() => {
    if (!arquivoLogo) {
      setPreviewLogo("");

      return;
    }

    const urlTemporaria =
      URL.createObjectURL(
        arquivoLogo,
      );

    setPreviewLogo(
      urlTemporaria,
    );

    return () => {
      URL.revokeObjectURL(
        urlTemporaria,
      );
    };
  }, [arquivoLogo]);

  useEffect(() => {
    if (!arquivoFavicon) {
      setPreviewFavicon("");

      return;
    }

    const urlTemporaria =
      URL.createObjectURL(
        arquivoFavicon,
      );

    setPreviewFavicon(
      urlTemporaria,
    );

    return () => {
      URL.revokeObjectURL(
        urlTemporaria,
      );
    };
  }, [arquivoFavicon]);

  function alterarNome(
    valor: string,
  ) {
    setMensagem("");
    setErro("");

    setIdentidade(
      (identidadeAtual) =>
        identidadeAtual
          ? {
              ...identidadeAtual,
              nome_loja: valor,
            }
          : identidadeAtual,
    );
  }

  function selecionarLogo(
    evento: ChangeEvent<HTMLInputElement>,
  ) {
    const arquivo =
      evento.target.files?.[0];

    setMensagem("");
    setErro("");

    if (!arquivo) {
      return;
    }

    if (
      !TIPOS_LOGO_PERMITIDOS.includes(
        arquivo.type,
      )
    ) {
      setErro(
        "Formato inválido. Envie um logotipo PNG, JPG, WEBP ou SVG.",
      );

      evento.target.value = "";

      return;
    }

    if (
      arquivo.size >
      TAMANHO_MAXIMO_LOGO
    ) {
      setErro(
        "O logotipo deve ter no máximo 5 MB.",
      );

      evento.target.value = "";

      return;
    }

    setArquivoLogo(
      arquivo,
    );

    evento.target.value = "";
  }

  function selecionarFavicon(
    evento: ChangeEvent<HTMLInputElement>,
  ) {
    const arquivo =
      evento.target.files?.[0];

    setMensagem("");
    setErro("");

    if (!arquivo) {
      return;
    }

    if (
      !TIPOS_FAVICON_PERMITIDOS.includes(
        arquivo.type,
      )
    ) {
      setErro(
        "Formato inválido. Envie um favicon PNG, JPG, WEBP ou ICO.",
      );

      evento.target.value = "";

      return;
    }

    if (
      arquivo.size >
      TAMANHO_MAXIMO_FAVICON
    ) {
      setErro(
        "O favicon deve ter no máximo 2 MB.",
      );

      evento.target.value = "";

      return;
    }

    setArquivoFavicon(
      arquivo,
    );

    evento.target.value = "";
  }

  async function enviarLogo(
    accessToken: string,
  ) {
    if (!arquivoLogo) {
      return identidade?.logo_url ?? null;
    }

    const formData =
      new FormData();

    formData.append(
      "arquivo",
      arquivoLogo,
    );

    const resposta =
      await fetch(
        "/api/admin/identidade/logo",
        {
          method: "POST",

          headers: {
            Authorization:
              `Bearer ${accessToken}`,
          },

          body: formData,
        },
      );

    const resultado =
      await resposta.json();

    if (!resposta.ok) {
      throw new Error(
        resultado.erro ||
          "Não foi possível enviar o logotipo.",
      );
    }

    if (!resultado.url) {
      throw new Error(
        "O upload foi concluído, mas a URL do logotipo não foi retornada.",
      );
    }

    return String(
      resultado.url,
    );
  }

  async function enviarFavicon(
    accessToken: string,
  ) {
    if (!arquivoFavicon) {
      return identidade?.favicon_url ?? null;
    }

    const formData =
      new FormData();

    formData.append(
      "arquivo",
      arquivoFavicon,
    );

    const resposta =
      await fetch(
        "/api/admin/identidade/favicon",
        {
          method: "POST",

          headers: {
            Authorization:
              `Bearer ${accessToken}`,
          },

          body: formData,
        },
      );

    const resultado =
      await resposta.json();

    if (!resposta.ok) {
      throw new Error(
        resultado.erro ||
          "Não foi possível enviar o favicon.",
      );
    }

    if (!resultado.url) {
      throw new Error(
        "O upload foi concluído, mas a URL do favicon não foi retornada.",
      );
    }

    return String(
      resultado.url,
    );
  }

  async function salvarIdentidade() {
    if (!identidade) {
      return;
    }

    const nomeLoja =
      identidade.nome_loja.trim();

    if (!nomeLoja) {
      setErro(
        "Informe o nome da loja.",
      );

      return;
    }

    if (
      nomeLoja.length > 120
    ) {
      setErro(
        "O nome da loja deve ter no máximo 120 caracteres.",
      );

      return;
    }

    try {
      setSalvando(true);
      setErro("");
      setMensagem("");

      const {
        data: { session },
      } =
        await supabase.auth.getSession();

      if (!session) {
        throw new Error(
          "Sua sessão expirou. Entre novamente no painel.",
        );
      }

      const logoUrl =
        await enviarLogo(
          session.access_token,
        );

      const faviconUrl =
        await enviarFavicon(
          session.access_token,
        );

      const resposta =
        await fetch(
          "/api/admin/identidade",
          {
            method: "PATCH",

            headers: {
              Authorization:
                `Bearer ${session.access_token}`,

              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              ...identidade,

              nome_loja:
                nomeLoja,

              logo_url:
                logoUrl,

              favicon_url:
                faviconUrl,
            }),
          },
        );

      const resultado =
        await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          resultado.erro ||
            "Não foi possível salvar a identidade da loja.",
        );
      }

      setIdentidade(
        resultado.identidade,
      );

      setArquivoLogo(
        null,
      );

      setArquivoFavicon(
        null,
      );

      setMensagem(
        "Identidade da loja salva com sucesso.",
      );
    } catch (error) {
      console.error(
        "Erro ao salvar identidade da loja:",
        error,
      );

      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível salvar a identidade da loja.",
      );
    } finally {
      setSalvando(false);
    }
  }

  const logoExibido =
    previewLogo ||
    identidade?.logo_url ||
    "";

  const faviconExibido =
    previewFavicon ||
    identidade?.favicon_url ||
    "";

  if (carregando) {
    return (
      <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
        <div className="flex min-h-52 items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-9 w-9 animate-spin text-primary" />

            <p className="mt-4 font-bold text-gray-500">
              Carregando identidade da loja...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (!identidade) {
    return (
      <section className="rounded-3xl border border-red-200 bg-white p-6 shadow-sm sm:p-7">
        <div className="text-center">
          <Building2 className="mx-auto h-10 w-10 text-red-400" />

          <h2 className="mt-4 text-xl font-black text-gray-800">
            Identidade não disponível
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {erro ||
              "Não foi possível carregar os dados da loja."}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
              <Store className="h-6 w-6" />
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
                Identidade da Loja
              </p>

              <h2 className="mt-1 text-2xl font-black text-gray-800">
                Informações da marca
              </h2>
            </div>
          </div>

          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-500">
            Configure o nome, o logotipo e o favicon que
            identificam sua loja para os clientes.
          </p>
        </div>

        <div className="rounded-2xl bg-gray-50 px-4 py-3 text-sm font-bold text-gray-500">
          Etapa 3 de 3
        </div>
      </div>

      {erro && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600">
          ⚠️ {erro}
        </div>
      )}

      {mensagem && (
        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm font-bold text-green-700">
          <CheckCircle2 className="h-5 w-5 shrink-0" />

          {mensagem}
        </div>
      )}

      <div className="mt-7 grid gap-6 lg:grid-cols-2">
        <div className="space-y-7">
          <div>
            <label
              htmlFor="nome-loja"
              className="block font-black text-gray-700"
            >
              Nome da loja
            </label>

            <p className="mt-1 text-sm text-gray-500">
              Este será o nome exibido para seus clientes.
            </p>

            <input
              id="nome-loja"
              type="text"
              maxLength={120}
              value={
                identidade.nome_loja
              }
              onChange={(evento) =>
                alterarNome(
                  evento.target.value,
                )
              }
              placeholder="Nome da sua loja"
              className="mt-4 w-full rounded-2xl border border-gray-200 bg-white px-5 py-4 text-lg font-bold text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-primary focus:ring-4 focus:ring-primary-soft"
            />

            <div className="mt-2 flex justify-end">
              <span className="text-xs font-medium text-gray-400">
                {
                  identidade
                    .nome_loja
                    .length
                }
                /120
              </span>
            </div>
          </div>

          <div>
            <p className="font-black text-gray-700">
              Logotipo da loja
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {legendaImagem(
                CONFIGURACOES_IMAGENS.logo,
              )}
            </p>

            <label className="mt-4 flex cursor-pointer items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 px-6 py-7 text-center transition hover:border-primary hover:bg-primary-soft">
              <input
                type="file"
                accept=".png,.jpg,.jpeg,.webp,.svg,image/png,image/jpeg,image/webp,image/svg+xml"
                onChange={
                  selecionarLogo
                }
                className="hidden"
              />

              <ImagePlus className="h-6 w-6 text-primary" />

              <div className="text-left">
                <p className="font-black text-gray-700">
                  {arquivoLogo
                    ? "Trocar arquivo selecionado"
                    : identidade.logo_url
                      ? "Trocar logotipo"
                      : "Selecionar logotipo"}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Clique para escolher uma imagem
                </p>
              </div>
            </label>

            {arquivoLogo && (
              <div className="mt-3 rounded-xl bg-primary-soft px-4 py-3">
                <p className="break-all text-sm font-bold text-primary">
                  <Upload className="mr-2 inline h-4 w-4" />

                  {arquivoLogo.name}
                </p>
              </div>
            )}
          </div>

          <div className="border-t border-gray-100 pt-7">
            <p className="font-black text-gray-700">
              Favicon da loja
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {legendaImagem(
                CONFIGURACOES_IMAGENS.favicon,
              )}
            </p>

            <label className="mt-4 flex cursor-pointer items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 px-6 py-7 text-center transition hover:border-primary hover:bg-primary-soft">
              <input
                type="file"
                accept=".png,.jpg,.jpeg,.webp,.ico,image/png,image/jpeg,image/webp,image/x-icon,image/vnd.microsoft.icon"
                onChange={
                  selecionarFavicon
                }
                className="hidden"
              />

              <ImagePlus className="h-6 w-6 text-primary" />

              <div className="text-left">
                <p className="font-black text-gray-700">
                  {arquivoFavicon
                    ? "Trocar favicon selecionado"
                    : identidade.favicon_url
                      ? "Trocar favicon"
                      : "Selecionar favicon"}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Recomendado: imagem quadrada
                </p>
              </div>
            </label>

            {arquivoFavicon && (
              <div className="mt-3 rounded-xl bg-primary-soft px-4 py-3">
                <p className="break-all text-sm font-bold text-primary">
                  <Upload className="mr-2 inline h-4 w-4" />

                  {arquivoFavicon.name}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-gray-50 p-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-gray-400">
            Pré-visualização
          </p>

          <div className="mt-5 flex items-center gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-md">
              {logoExibido ? (
                <img
                  src={
                    logoExibido
                  }
                  alt={
                    identidade.nome_loja ||
                    "Logotipo da loja"
                  }
                  className="h-full w-full object-contain p-1"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary text-white">
                  <Store className="h-8 w-8" />
                </div>
              )}
            </div>

            <div className="min-w-0">
              <p className="text-xs font-bold text-gray-400">
                Sua loja
              </p>

              <p className="truncate text-xl font-black text-primary">
                {identidade.nome_loja.trim() ||
                  "Nome da loja"}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-4">
            <p className="text-xs font-black uppercase tracking-wide text-gray-400">
              Status do logotipo
            </p>

            <p className="mt-2 text-sm font-bold text-gray-700">
              {arquivoLogo
                ? "Novo logotipo pronto para envio"
                : identidade.logo_url
                  ? "Logotipo salvo"
                  : "Nenhum logotipo personalizado salvo"}
            </p>

            <p className="mt-2 text-xs leading-relaxed text-gray-500">
              O novo arquivo será enviado somente quando
              você clicar em Salvar identidade.
            </p>
          </div>

          <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-4">
            <p className="text-xs font-black uppercase tracking-wide text-gray-400">
              Favicon
            </p>

            <div className="mt-3 flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                {faviconExibido ? (
                  <img
                    src={
                      faviconExibido
                    }
                    alt="Favicon da loja"
                    className="h-full w-full object-contain p-1.5"
                  />
                ) : (
                  <Store className="h-5 w-5 text-gray-400" />
                )}
              </div>

              <div>
                <p className="text-sm font-bold text-gray-700">
                  {arquivoFavicon
                    ? "Novo favicon pronto para envio"
                    : identidade.favicon_url
                      ? "Favicon salvo"
                      : "Nenhum favicon personalizado salvo"}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Este será o ícone utilizado pela identidade da loja.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-7 flex justify-end border-t border-gray-100 pt-6">
        <button
          type="button"
          disabled={salvando}
          onClick={() =>
            void salvarIdentidade()
          }
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-7 py-3 font-black text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {salvando ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />

              Salvando...
            </>
          ) : (
            <>
              <Save className="h-5 w-5" />

              Salvar identidade
            </>
          )}
        </button>
      </div>
    </section>
  );
}
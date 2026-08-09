"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  CheckCircle2,
  Image as ImageIcon,
  Loader2,
  Save,
  UploadCloud,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

type BannerHome = {
  id: number;
  titulo: string;
  destaque: string | null;
  descricao: string | null;
  imagem: string | null;
  botao_texto: string | null;
  botao_link: string | null;
  tema: string | null;
  ordem: number;
  ativo: boolean;
  created_at?: string;
  updated_at?: string;
};

const temasDisponiveis = [
  {
    valor: "primary",
    nome: "Azul petróleo",
  },
  {
    valor: "secondary",
    nome: "Dourado",
  },
  {
    valor: "accent",
    nome: "Coral",
  },
];

const TAMANHO_MAXIMO =
  5 * 1024 * 1024;

const TIPOS_PERMITIDOS = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

function obterDimensoesImagem(
  arquivo: File,
): Promise<{
  largura: number;
  altura: number;
}> {
  return new Promise(
    (resolve, reject) => {
      const url =
        URL.createObjectURL(arquivo);

      const imagem =
        new Image();

      imagem.onload = () => {
        resolve({
          largura:
            imagem.naturalWidth,
          altura:
            imagem.naturalHeight,
        });

        URL.revokeObjectURL(url);
      };

      imagem.onerror = () => {
        URL.revokeObjectURL(url);

        reject(
          new Error(
            "Não foi possível identificar as dimensões da imagem.",
          ),
        );
      };

      imagem.src = url;
    },
  );
}

export default function BannersAdminPage() {
  const [
    banners,
    setBanners,
  ] = useState<BannerHome[]>([]);

  const [
    carregando,
    setCarregando,
  ] = useState(true);

  const [
    salvandoId,
    setSalvandoId,
  ] = useState<number | null>(
    null,
  );

  const [
    enviandoImagemId,
    setEnviandoImagemId,
  ] = useState<number | null>(
    null,
  );

  const [
    erro,
    setErro,
  ] = useState("");

  const [
    mensagem,
    setMensagem,
  ] = useState("");

  const buscarBanners =
    useCallback(async () => {
      setCarregando(true);
      setErro("");

      const {
        data,
        error,
      } = await supabase
        .from("banners_home")
        .select("*")
        .order("ordem", {
          ascending: true,
        });

      if (error) {
        console.error(
          "Erro ao buscar banners:",
          error,
        );

        setErro(
          "Não foi possível carregar os banners.",
        );

        setCarregando(false);
        return;
      }

      setBanners(
        (data ?? []) as BannerHome[],
      );

      setCarregando(false);
    }, []);

  useEffect(() => {
    void buscarBanners();
  }, [buscarBanners]);

  function alterarBanner(
    id: number,
    campo: keyof BannerHome,
    valor:
      | string
      | number
      | boolean,
  ) {
    setMensagem("");

    setBanners(
      (bannersAtuais) =>
        bannersAtuais.map(
          (banner) =>
            banner.id === id
              ? {
                  ...banner,
                  [campo]: valor,
                }
              : banner,
        ),
    );
  }

  async function salvarBanner(
    banner: BannerHome,
  ) {
    try {
      setErro("");
      setMensagem("");
      setSalvandoId(
        banner.id,
      );

      const {
        error,
      } = await supabase
        .from("banners_home")
        .update({
          titulo:
            banner.titulo,
          destaque:
            banner.destaque,
          descricao:
            banner.descricao,
          imagem:
            banner.imagem,
          botao_texto:
            banner.botao_texto,
          botao_link:
            banner.botao_link,
          tema:
            banner.tema,
          ordem:
            banner.ordem,
          ativo:
            banner.ativo,
          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          banner.id,
        );

      if (error) {
        throw error;
      }

      setMensagem(
        `Banner ${banner.ordem} salvo com sucesso.`,
      );
    } catch (error) {
      console.error(
        "Erro ao salvar banner:",
        error,
      );

      setErro(
        `Não foi possível salvar o Banner ${banner.ordem}.`,
      );
    } finally {
      setSalvandoId(null);
    }
  }

  async function enviarImagem(
    banner: BannerHome,
    arquivo: File,
  ) {
    try {
      setErro("");
      setMensagem("");

      if (
        !TIPOS_PERMITIDOS.includes(
          arquivo.type,
        )
      ) {
        setErro(
          "Formato inválido. Utilize JPG, PNG ou WebP.",
        );

        return;
      }

      if (
        arquivo.size >
        TAMANHO_MAXIMO
      ) {
        setErro(
          "A imagem não pode ultrapassar 5 MB.",
        );

        return;
      }

      setEnviandoImagemId(
        banner.id,
      );

      const dimensoes =
        await obterDimensoesImagem(
          arquivo,
        );

      const extensao =
        arquivo.name
          .split(".")
          .pop()
          ?.toLowerCase() ||
        "webp";

      const nomeArquivo =
        `banner-${banner.id}/${Date.now()}.${extensao}`;

      const {
        error:
          erroUpload,
      } =
        await supabase.storage
          .from(
            "banner-home",
          )
          .upload(
            nomeArquivo,
            arquivo,
            {
              cacheControl:
                "3600",

              upsert: false,

              contentType:
                arquivo.type,
            },
          );

      if (erroUpload) {
        throw erroUpload;
      }

      const {
        data:
          dadosUrlPublica,
      } =
        supabase.storage
          .from(
            "banner-home",
          )
          .getPublicUrl(
            nomeArquivo,
          );

      const urlPublica =
        dadosUrlPublica.publicUrl;

      const {
        error:
          erroAtualizacao,
      } = await supabase
        .from("banners_home")
        .update({
          imagem:
            urlPublica,

          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          banner.id,
        );

      if (
        erroAtualizacao
      ) {
        await supabase.storage
          .from(
            "banner-home",
          )
          .remove([
            nomeArquivo,
          ]);

        throw erroAtualizacao;
      }

      setBanners(
        (bannersAtuais) =>
          bannersAtuais.map(
            (item) =>
              item.id ===
              banner.id
                ? {
                    ...item,
                    imagem:
                      urlPublica,
                  }
                : item,
          ),
      );

      const tamanhoIdeal =
        dimensoes.largura ===
          1920 &&
        dimensoes.altura ===
          720;

      if (tamanhoIdeal) {
        setMensagem(
          `Imagem do Banner ${banner.ordem} enviada com sucesso — 1920 × 720 px.`,
        );
      } else {
        setMensagem(
          `Imagem enviada com sucesso. Tamanho atual: ${dimensoes.largura} × ${dimensoes.altura} px. Recomendado: 1920 × 720 px.`,
        );
      }
    } catch (error) {
      console.error(
        "Erro ao enviar imagem:",
        error,
      );

      setErro(
        `Não foi possível enviar a imagem do Banner ${banner.ordem}.`,
      );
    } finally {
      setEnviandoImagemId(
        null,
      );
    }
  }

  if (carregando) {
    return (
      <main className="min-h-screen bg-background p-6 sm:p-8 lg:p-10">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-9 w-9 animate-spin text-primary" />

            <p className="mt-4 font-bold text-text-light">
              Carregando banners...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background p-6 sm:p-8 lg:p-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-secondary">
            Marketing
          </p>

          <h1 className="mt-2 text-3xl font-black text-primary sm:text-4xl">
            Banners da Home
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-light sm:text-base">
            Gerencie os principais
            destaques exibidos no
            início da sua loja.
          </p>
        </div>

        {erro && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-danger">
            {erro}
          </div>
        )}

        {mensagem && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm font-bold text-green-700">
            <CheckCircle2 className="h-5 w-5 shrink-0" />

            {mensagem}
          </div>
        )}

        {banners.length ===
        0 ? (
          <div className="rounded-3xl border border-border bg-card p-10 text-center shadow-sm">
            <ImageIcon className="mx-auto h-12 w-12 text-text-light" />

            <h2 className="mt-4 text-xl font-black text-primary">
              Nenhum banner
              encontrado
            </h2>

            <p className="mt-2 text-sm text-text-light">
              A tabela existe, mas
              ainda não possui
              banners cadastrados.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {banners.map(
              (banner) => (
                <section
                  key={
                    banner.id
                  }
                  className="overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow)]"
                >
                  <div className="flex flex-col gap-4 border-b border-border bg-primary px-6 py-5 text-white sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-white/60">
                        Destaque da
                        página inicial
                      </p>

                      <h2 className="mt-1 text-xl font-black">
                        Banner{" "}
                        {
                          banner.ordem
                        }
                      </h2>
                    </div>

                    <label className="flex cursor-pointer items-center gap-3">
                      <span className="text-sm font-bold">
                        {banner.ativo
                          ? "Ativo"
                          : "Inativo"}
                      </span>

                      <input
                        type="checkbox"
                        checked={
                          banner.ativo
                        }
                        onChange={(
                          evento,
                        ) =>
                          alterarBanner(
                            banner.id,
                            "ativo",
                            evento
                              .target
                              .checked,
                          )
                        }
                        className="h-5 w-5 accent-[var(--accent)]"
                      />
                    </label>
                  </div>

                  <div className="grid gap-8 p-6 lg:grid-cols-[360px_1fr] lg:p-8">
                    <div>
                      <p className="mb-3 text-sm font-black text-primary">
                        Imagem do banner
                      </p>

                      <div className="flex aspect-[8/3] items-center justify-center overflow-hidden rounded-2xl border border-dashed border-border bg-background">
                        {banner.imagem ? (
                          <img
                            src={
                              banner.imagem
                            }
                            alt={`Banner ${banner.ordem}`}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="px-6 text-center">
                            <ImageIcon className="mx-auto h-10 w-10 text-text-light" />

                            <p className="mt-3 text-sm font-bold text-text-light">
                              Nenhuma
                              imagem
                              enviada
                            </p>
                          </div>
                        )}
                      </div>

                      <label
                        className={`mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-primary bg-white px-4 py-3 text-sm font-black text-primary transition hover:bg-primary hover:text-white ${
                          enviandoImagemId ===
                          banner.id
                            ? "pointer-events-none opacity-60"
                            : ""
                        }`}
                      >
                        {enviandoImagemId ===
                        banner.id ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />

                            Enviando...
                          </>
                        ) : (
                          <>
                            <UploadCloud className="h-5 w-5" />

                            {banner.imagem
                              ? "Trocar imagem"
                              : "Enviar imagem"}
                          </>
                        )}

                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                          onChange={(
                            evento,
                          ) => {
                            const arquivo =
                              evento
                                .target
                                .files?.[0];

                            if (
                              arquivo
                            ) {
                              void enviarImagem(
                                banner,
                                arquivo,
                              );
                            }

                            evento.target.value =
                              "";
                          }}
                        />
                      </label>

                      <div className="mt-4 rounded-2xl border border-secondary/30 bg-secondary/10 p-4">
                        <p className="text-xs font-black uppercase tracking-[0.15em] text-primary">
                          Recomendação
                          da arte
                        </p>

                        <div className="mt-3 space-y-1.5 text-sm text-text-light">
                          <p>
                            <strong className="text-text">
                              Tamanho:
                            </strong>{" "}
                            1920 × 720
                            px
                          </p>

                          <p>
                            <strong className="text-text">
                              Proporção:
                            </strong>{" "}
                            8:3
                          </p>

                          <p>
                            <strong className="text-text">
                              Formatos:
                            </strong>{" "}
                            JPG, PNG ou
                            WebP
                          </p>

                          <p>
                            <strong className="text-text">
                              Limite:
                            </strong>{" "}
                            5 MB
                          </p>

                          <p>
                            <strong className="text-text">
                              Ideal:
                            </strong>{" "}
                            até 500 KB
                            para melhor
                            velocidade
                          </p>
                        </div>

                        <p className="mt-3 border-t border-secondary/20 pt-3 text-xs leading-relaxed text-text-light">
                          📱 Em celulares
                          a imagem poderá
                          ser recortada.
                          Mantenha rostos,
                          produtos e
                          informações
                          importantes na
                          região central
                          da arte.
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-5">
                      <div>
                        <label className="mb-2 block text-sm font-black text-primary">
                          Título
                        </label>

                        <input
                          type="text"
                          value={
                            banner.titulo ??
                            ""
                          }
                          onChange={(
                            evento,
                          ) =>
                            alterarBanner(
                              banner.id,
                              "titulo",
                              evento
                                .target
                                .value,
                            )
                          }
                          className="w-full rounded-xl border border-border bg-white px-4 py-3 text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-black text-primary">
                          Destaque
                        </label>

                        <input
                          type="text"
                          value={
                            banner.destaque ??
                            ""
                          }
                          onChange={(
                            evento,
                          ) =>
                            alterarBanner(
                              banner.id,
                              "destaque",
                              evento
                                .target
                                .value,
                            )
                          }
                          className="w-full rounded-xl border border-border bg-white px-4 py-3 text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-black text-primary">
                          Descrição
                        </label>

                        <textarea
                          rows={
                            3
                          }
                          value={
                            banner.descricao ??
                            ""
                          }
                          onChange={(
                            evento,
                          ) =>
                            alterarBanner(
                              banner.id,
                              "descricao",
                              evento
                                .target
                                .value,
                            )
                          }
                          className="w-full resize-none rounded-xl border border-border bg-white px-4 py-3 text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                        />
                      </div>

                      <div className="grid gap-5 md:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-sm font-black text-primary">
                            Texto do botão
                          </label>

                          <input
                            type="text"
                            value={
                              banner.botao_texto ??
                              ""
                            }
                            onChange={(
                              evento,
                            ) =>
                              alterarBanner(
                                banner.id,
                                "botao_texto",
                                evento
                                  .target
                                  .value,
                              )
                            }
                            className="w-full rounded-xl border border-border bg-white px-4 py-3 text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-black text-primary">
                            Link do botão
                          </label>

                          <input
                            type="text"
                            value={
                              banner.botao_link ??
                              ""
                            }
                            onChange={(
                              evento,
                            ) =>
                              alterarBanner(
                                banner.id,
                                "botao_link",
                                evento
                                  .target
                                  .value,
                              )
                            }
                            placeholder="/"
                            className="w-full rounded-xl border border-border bg-white px-4 py-3 text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                          />
                        </div>
                      </div>

                      <div className="grid gap-5 md:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-sm font-black text-primary">
                            Tema
                          </label>

                          <select
                            value={
                              banner.tema ??
                              "primary"
                            }
                            onChange={(
                              evento,
                            ) =>
                              alterarBanner(
                                banner.id,
                                "tema",
                                evento
                                  .target
                                  .value,
                              )
                            }
                            className="w-full cursor-pointer rounded-xl border border-border bg-white px-4 py-3 text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                          >
                            {temasDisponiveis.map(
                              (
                                tema,
                              ) => (
                                <option
                                  key={
                                    tema.valor
                                  }
                                  value={
                                    tema.valor
                                  }
                                >
                                  {
                                    tema.nome
                                  }
                                </option>
                              ),
                            )}
                          </select>
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-black text-primary">
                            Ordem
                          </label>

                          <input
                            type="number"
                            min={
                              1
                            }
                            max={
                              3
                            }
                            value={
                              banner.ordem
                            }
                            onChange={(
                              evento,
                            ) =>
                              alterarBanner(
                                banner.id,
                                "ordem",
                                Number(
                                  evento
                                    .target
                                    .value,
                                ),
                              )
                            }
                            className="w-full rounded-xl border border-border bg-white px-4 py-3 text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end border-t border-border pt-5">
                        <button
                          type="button"
                          disabled={
                            salvandoId ===
                            banner.id
                          }
                          onClick={() =>
                            void salvarBanner(
                              banner,
                            )
                          }
                          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 font-black text-white shadow-md transition hover:-translate-y-0.5 hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {salvandoId ===
                          banner.id ? (
                            <>
                              <Loader2 className="h-5 w-5 animate-spin" />

                              Salvando...
                            </>
                          ) : (
                            <>
                              <Save className="h-5 w-5" />

                              Salvar
                              banner
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </section>
              ),
            )}
          </div>
        )}
      </div>
    </main>
  );
}
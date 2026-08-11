"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  CheckCircle2,
  Eye,
  Loader2,
  Palette,
  RotateCcw,
  Save,
} from "lucide-react";

import { supabase } from "@/lib/supabase";
import IdentidadeLojaCard from "@/components/admin/aparencia/IdentidadeLojaCard";

type Tema = {
  id: number;
  nome: string;

  primary_color: string;
  primary_light_color: string;

  secondary_color: string;
  accent_color: string;

  success_color: string;
  warning_color: string;
  danger_color: string;

  background_color: string;
  card_color: string;

  text_color: string;
  text_light_color: string;

  border_color: string;

  ativo: boolean;
};

type CampoCor = {
  chave: keyof Pick<
    Tema,
    | "primary_color"
    | "primary_light_color"
    | "secondary_color"
    | "accent_color"
    | "success_color"
    | "warning_color"
    | "danger_color"
    | "background_color"
    | "card_color"
    | "text_color"
    | "text_light_color"
    | "border_color"
  >;

  titulo: string;
  descricao: string;
};

const CORES_PADRAO = {
  primary_color:
    "#1E3A5F",

  primary_light_color:
    "#2D527F",

  secondary_color:
    "#D4AF37",

  accent_color:
    "#FF6B6B",

  success_color:
    "#22C55E",

  warning_color:
    "#F59E0B",

  danger_color:
    "#EF4444",

  background_color:
    "#FAFAFA",

  card_color:
    "#FFFFFF",

  text_color:
    "#1F2937",

  text_light_color:
    "#6B7280",

  border_color:
    "#E5E7EB",
};

const grupos: {
  titulo: string;
  descricao: string;
  campos: CampoCor[];
}[] = [
  {
    titulo: "Identidade da marca",

    descricao:
      "Cores principais utilizadas na comunicação visual da loja.",

    campos: [
      {
        chave:
          "primary_color",
        titulo:
          "Cor principal",
        descricao:
          "Menus, títulos e elementos institucionais.",
      },
      {
        chave:
          "primary_light_color",
        titulo:
          "Principal clara",
        descricao:
          "Variação da cor principal.",
      },
      {
        chave:
          "secondary_color",
        titulo:
          "Cor secundária",
        descricao:
          "Destaques premium e elementos complementares.",
      },
      {
        chave:
          "accent_color",
        titulo:
          "Cor de destaque",
        descricao:
          "CTAs, comprar e elementos de maior atenção.",
      },
    ],
  },

  {
    titulo: "Estados",

    descricao:
      "Cores utilizadas para comunicar situações importantes.",

    campos: [
      {
        chave:
          "success_color",
        titulo:
          "Sucesso",
        descricao:
          "Pagamento aprovado, confirmação e conclusão.",
      },
      {
        chave:
          "warning_color",
        titulo:
          "Alerta",
        descricao:
          "Avisos e situações que exigem atenção.",
      },
      {
        chave:
          "danger_color",
        titulo:
          "Erro",
        descricao:
          "Cancelamento, exclusão e mensagens críticas.",
      },
    ],
  },

  {
    titulo: "Interface",

    descricao:
      "Cores estruturais utilizadas nas páginas e componentes.",

    campos: [
      {
        chave:
          "background_color",
        titulo:
          "Fundo geral",
        descricao:
          "Cor principal do fundo da loja.",
      },
      {
        chave:
          "card_color",
        titulo:
          "Cards",
        descricao:
          "Fundo de cards, caixas e painéis.",
      },
      {
        chave:
          "text_color",
        titulo:
          "Texto principal",
        descricao:
          "Títulos e textos de maior importância.",
      },
      {
        chave:
          "text_light_color",
        titulo:
          "Texto secundário",
        descricao:
          "Descrições e textos auxiliares.",
      },
      {
        chave:
          "border_color",
        titulo:
          "Bordas",
        descricao:
          "Divisores, contornos e campos.",
      },
    ],
  },
];

function corHexValida(
  valor: string,
) {
  return /^#[0-9A-Fa-f]{6}$/.test(
    valor,
  );
}

export default function AparenciaAdminPage() {
  const [
    tema,
    setTema,
  ] = useState<Tema | null>(
    null,
  );

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

  const buscarTema =
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
            "/api/admin/aparencia",
            {
              headers: {
                Authorization:
                  `Bearer ${session.access_token}`,
              },

              cache:
                "no-store",
            },
          );

        const resultado =
          await resposta.json();

        if (!resposta.ok) {
          throw new Error(
            resultado.erro ||
              "Não foi possível carregar o tema.",
          );
        }

        setTema(
          resultado.tema,
        );
      } catch (error) {
        console.error(
          "Erro ao carregar tema:",
          error,
        );

        setErro(
          error instanceof Error
            ? error.message
            : "Não foi possível carregar o tema.",
        );
      } finally {
        setCarregando(false);
      }
    }, []);

  useEffect(() => {
    void buscarTema();
  }, [buscarTema]);

  function alterarCor(
    chave: CampoCor["chave"],
    valor: string,
  ) {
    setMensagem("");

    setTema((temaAtual) =>
      temaAtual
        ? {
            ...temaAtual,
            [chave]:
              valor.toUpperCase(),
          }
        : temaAtual,
    );
  }

  function restaurarPadrao() {
    if (!tema) {
      return;
    }

    setTema({
      ...tema,
      ...CORES_PADRAO,
    });

    setMensagem(
      "Paleta padrão restaurada na pré-visualização. Clique em Salvar tema para confirmar.",
    );
  }

  async function salvarTema() {
    if (!tema) {
      return;
    }

    const todosCampos =
      grupos.flatMap(
        (grupo) =>
          grupo.campos,
      );

    const campoInvalido =
      todosCampos.find(
        (campo) =>
          !corHexValida(
            tema[campo.chave],
          ),
      );

    if (campoInvalido) {
      setErro(
        `A cor "${campoInvalido.titulo}" não contém um HEX válido.`,
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
          "Sua sessão expirou. Entre novamente.",
        );
      }

      const resposta =
        await fetch(
          "/api/admin/aparencia",
          {
            method: "PATCH",

            headers: {
              Authorization:
                `Bearer ${session.access_token}`,

              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                tema,
              ),
          },
        );

      const resultado =
        await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          resultado.erro ||
            "Não foi possível salvar o tema.",
        );
      }

      setTema(
        resultado.tema,
      );

      setMensagem(
        "Tema salvo com sucesso.",
      );
    } catch (error) {
      console.error(
        "Erro ao salvar tema:",
        error,
      );

      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível salvar o tema.",
      );
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <main className="min-h-screen bg-gray-50 p-6 md:p-10">
        <div className="flex min-h-[420px] items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-[#1E3A5F]" />

            <p className="mt-4 font-bold text-gray-500">
              Carregando aparência...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!tema) {
    return (
      <main className="min-h-screen bg-gray-50 p-6 md:p-10">
        <div className="mx-auto max-w-5xl rounded-3xl bg-white p-8 text-center shadow-sm">
          <Palette className="mx-auto h-12 w-12 text-gray-400" />

          <h1 className="mt-4 text-2xl font-black text-gray-800">
            Tema não disponível
          </h1>

          <p className="mt-2 text-gray-500">
            {erro}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#D4AF37]">
              <Palette className="h-5 w-5" />

              <p className="text-xs font-black uppercase tracking-[0.2em]">
                Aparência
              </p>
            </div>

            <h1 className="mt-2 text-3xl font-black text-[#1E3A5F] sm:text-4xl">
              Paleta de Cores
            </h1>

            <p className="mt-2 max-w-2xl text-gray-500">
              Personalize a identidade visual da loja e visualize o resultado antes de publicar.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={
                restaurarPadrao
              }
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-black text-gray-600 shadow-sm transition hover:bg-gray-50"
            >
              <RotateCcw className="h-4 w-4" />

              Restaurar padrão
            </button>

            <button
              type="button"
              disabled={salvando}
              onClick={() =>
                void salvarTema()
              }
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#FF6B6B] px-6 py-3 text-sm font-black text-white shadow-md transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {salvando ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />

                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />

                  Salvar tema
                </>
              )}
            </button>
          </div>
        </div>

        {erro && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600">
            {erro}
          </div>
        )}

        {mensagem && (
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm font-bold text-green-700">
            <CheckCircle2 className="h-5 w-5 shrink-0" />

            {mensagem}
          </div>
        )}

        <div className="mt-8">
          <IdentidadeLojaCard />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-7 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            {grupos.map(
              (grupo) => (
                <section
                  key={
                    grupo.titulo
                  }
                  className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7"
                >
                  <h2 className="text-xl font-black text-gray-800">
                    {grupo.titulo}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {
                      grupo.descricao
                    }
                  </p>

                  <div className="mt-6 grid gap-5 sm:grid-cols-2">
                    {grupo.campos.map(
                      (campo) => {
                        const valor =
                          tema[
                            campo.chave
                          ];

                        return (
                          <div
                            key={
                              campo.chave
                            }
                            className="rounded-2xl border border-gray-100 bg-gray-50 p-4"
                          >
                            <label className="font-black text-gray-700">
                              {
                                campo.titulo
                              }
                            </label>

                            <p className="mt-1 min-h-10 text-xs leading-relaxed text-gray-400">
                              {
                                campo.descricao
                              }
                            </p>

                            <div className="mt-4 flex items-center gap-3">
                              <input
                                type="color"
                                value={
                                  corHexValida(
                                    valor,
                                  )
                                    ? valor
                                    : "#000000"
                                }
                                onChange={(
                                  evento,
                                ) =>
                                  alterarCor(
                                    campo.chave,
                                    evento
                                      .target
                                      .value,
                                  )
                                }
                                className="h-12 w-14 cursor-pointer rounded-xl border border-gray-200 bg-white p-1"
                                aria-label={`Selecionar ${campo.titulo}`}
                              />

                              <input
                                type="text"
                                value={
                                  valor
                                }
                                maxLength={
                                  7
                                }
                                onChange={(
                                  evento,
                                ) =>
                                  alterarCor(
                                    campo.chave,
                                    evento
                                      .target
                                      .value,
                                  )
                                }
                                className={`min-w-0 flex-1 rounded-xl border bg-white px-4 py-3 font-mono text-sm font-bold uppercase outline-none ${
                                  corHexValida(
                                    valor,
                                  )
                                    ? "border-gray-200 text-gray-700 focus:border-[#1E3A5F]"
                                    : "border-red-300 text-red-600"
                                }`}
                              />
                            </div>
                          </div>
                        );
                      },
                    )}
                  </div>
                </section>
              ),
            )}
          </div>

          <div className="xl:sticky xl:top-8 xl:self-start">
            <section
              className="overflow-hidden rounded-3xl border shadow-xl"
              style={{
                borderColor:
                  tema.border_color,

                backgroundColor:
                  tema.background_color,
              }}
            >
              <div
                className="flex items-center justify-between px-6 py-4"
                style={{
                  backgroundColor:
                    tema.primary_color,

                  color: "#FFFFFF",
                }}
              >
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] opacity-60">
                    Preview
                  </p>

                  <h2 className="text-xl font-black">
                    Sua Loja
                  </h2>
                </div>

                <Eye className="h-5 w-5" />
              </div>

              <div className="p-5 sm:p-6">
                <div
                  className="overflow-hidden rounded-3xl border p-6"
                  style={{
                    backgroundColor:
                      tema.card_color,

                    borderColor:
                      tema.border_color,
                  }}
                >
                  <span
                    className="inline-flex rounded-full px-3 py-1.5 text-xs font-black"
                    style={{
                      backgroundColor:
                        `${tema.secondary_color}22`,

                      color:
                        tema.secondary_color,
                    }}
                  >
                    DESTAQUE
                  </span>

                  <h3
                    className="mt-5 text-3xl font-black"
                    style={{
                      color:
                        tema.text_color,
                    }}
                  >
                    Presentes que
                    <span
                      className="block"
                      style={{
                        color:
                          tema.primary_color,
                      }}
                    >
                      criam memórias
                    </span>
                  </h3>

                  <p
                    className="mt-4 leading-relaxed"
                    style={{
                      color:
                        tema.text_light_color,
                    }}
                  >
                    Veja em tempo real como sua paleta combina com os elementos da loja.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      type="button"
                      className="rounded-xl px-5 py-3 font-black text-white"
                      style={{
                        backgroundColor:
                          tema.accent_color,
                      }}
                    >
                      Comprar agora
                    </button>

                    <button
                      type="button"
                      className="rounded-xl border px-5 py-3 font-black"
                      style={{
                        borderColor:
                          tema.primary_color,

                        color:
                          tema.primary_color,
                      }}
                    >
                      Saiba mais
                    </button>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  <StatusPreview
                    titulo="Aprovado"
                    cor={
                      tema.success_color
                    }
                  />

                  <StatusPreview
                    titulo="Atenção"
                    cor={
                      tema.warning_color
                    }
                  />

                  <StatusPreview
                    titulo="Erro"
                    cor={
                      tema.danger_color
                    }
                  />
                </div>

                <div className="mt-6">
                  <p
                    className="text-xs font-black uppercase tracking-[0.15em]"
                    style={{
                      color:
                        tema.text_light_color,
                    }}
                  >
                    Paleta atual
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {[
                      tema.primary_color,
                      tema.primary_light_color,
                      tema.secondary_color,
                      tema.accent_color,
                      tema.success_color,
                      tema.warning_color,
                      tema.danger_color,
                    ].map(
                      (
                        cor,
                        indice,
                      ) => (
                        <div
                          key={`${cor}-${indice}`}
                          title={cor}
                          className="h-10 w-10 rounded-xl border border-black/10 shadow-sm"
                          style={{
                            backgroundColor:
                              cor,
                          }}
                        />
                      ),
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

function StatusPreview({
  titulo,
  cor,
}: {
  titulo: string;
  cor: string;
}) {
  return (
    <div
      className="rounded-xl p-3 text-center text-xs font-black text-white"
      style={{
        backgroundColor:
          cor,
      }}
    >
      {titulo}
    </div>
  );
}
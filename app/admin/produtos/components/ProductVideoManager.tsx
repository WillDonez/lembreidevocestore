"use client";

import {
  ChangeEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Film,
  Play,
  RefreshCw,
  Trash2,
  Upload,
} from "lucide-react";

type ProductVideoManagerProps = {
  video: File | null;
  videoAtual?: string;
  onChange: (video: File | null) => void;
};

const TIPOS_PERMITIDOS = [
  "video/mp4",
  "video/webm",
];

const TAMANHO_MAXIMO =
  50 * 1024 * 1024;

function formatarTamanhoArquivo(
  tamanhoEmBytes: number,
) {
  if (tamanhoEmBytes <= 0) {
    return "0 MB";
  }

  const tamanhoEmMegabytes =
    tamanhoEmBytes / (1024 * 1024);

  if (tamanhoEmMegabytes < 1) {
    const tamanhoEmKilobytes =
      tamanhoEmBytes / 1024;

    return `${tamanhoEmKilobytes.toFixed(
      0,
    )} KB`;
  }

  return `${tamanhoEmMegabytes.toFixed(
    1,
  )} MB`;
}

function formatarDuracao(
  duracaoEmSegundos: number,
) {
  if (
    !Number.isFinite(duracaoEmSegundos) ||
    duracaoEmSegundos <= 0
  ) {
    return "--:--";
  }

  const minutos = Math.floor(
    duracaoEmSegundos / 60,
  );

  const segundos = Math.floor(
    duracaoEmSegundos % 60,
  );

  return `${String(minutos).padStart(
    2,
    "0",
  )}:${String(segundos).padStart(
    2,
    "0",
  )}`;
}

function obterFormatoVideo(
  arquivo: File | null,
) {
  if (!arquivo) {
    return "Vídeo atual";
  }

  if (arquivo.type === "video/webm") {
    return "WEBM";
  }

  return "MP4";
}

export default function ProductVideoManager({
  video,
  videoAtual = "",
  onChange,
}: ProductVideoManagerProps) {
  const inputRef =
    useRef<HTMLInputElement | null>(null);

  const [
    duracaoVideo,
    setDuracaoVideo,
  ] = useState(0);

  const [
    larguraVideo,
    setLarguraVideo,
  ] = useState(0);

  const [
    alturaVideo,
    setAlturaVideo,
  ] = useState(0);

  const [
    erroVideo,
    setErroVideo,
  ] = useState("");

  const urlPreview = useMemo(() => {
    if (video) {
      return URL.createObjectURL(video);
    }

    return videoAtual;
  }, [video, videoAtual]);

  useEffect(() => {
    return () => {
      if (
        video &&
        urlPreview.startsWith("blob:")
      ) {
        URL.revokeObjectURL(urlPreview);
      }
    };
  }, [video, urlPreview]);

  useEffect(() => {
    setDuracaoVideo(0);
    setLarguraVideo(0);
    setAlturaVideo(0);
    setErroVideo("");
  }, [video, videoAtual]);

  const possuiVideo =
    Boolean(urlPreview);

  const informacoesVideo = [
    obterFormatoVideo(video),

    video
      ? formatarTamanhoArquivo(video.size)
      : "Arquivo já salvo",

    formatarDuracao(duracaoVideo),

    larguraVideo > 0 &&
    alturaVideo > 0
      ? `${larguraVideo} × ${alturaVideo}`
      : "Resolução não identificada",
  ];

  function abrirSeletor() {
    inputRef.current?.click();
  }

  function selecionarVideo(
    evento: ChangeEvent<HTMLInputElement>,
  ) {
    const arquivo =
      evento.target.files?.[0];

    setErroVideo("");

    if (!arquivo) {
      return;
    }

    if (
      !TIPOS_PERMITIDOS.includes(
        arquivo.type,
      )
    ) {
      setErroVideo(
        "Apenas vídeos MP4 ou WEBM são permitidos.",
      );

      evento.target.value = "";
      return;
    }

    if (
      arquivo.size > TAMANHO_MAXIMO
    ) {
      setErroVideo(
        "O vídeo deve ter no máximo 50 MB.",
      );

      evento.target.value = "";
      return;
    }

    onChange(arquivo);

    evento.target.value = "";
  }

  function removerVideo() {
    onChange(null);

    setDuracaoVideo(0);
    setLarguraVideo(0);
    setAlturaVideo(0);
    setErroVideo("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function carregarMetadados(
    elemento: HTMLVideoElement,
  ) {
    setDuracaoVideo(
      elemento.duration || 0,
    );

    setLarguraVideo(
      elemento.videoWidth || 0,
    );

    setAlturaVideo(
      elemento.videoHeight || 0,
    );
  }

  return (
    <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <input
        ref={inputRef}
        type="file"
        accept="video/mp4,video/webm"
        onChange={
          selecionarVideo
        }
        className="hidden"
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color-mix(in_srgb,var(--primary)_10%,white)] text-primary">
              <Film className="h-6 w-6" />
            </div>

            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-secondary">
                Vídeo do produto
              </p>

              <h3 className="mt-1 text-2xl font-black text-text">
                Demonstração em vídeo
              </h3>
            </div>
          </div>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-text-light">
            Adicione um vídeo curto para apresentar
            detalhes, acabamento, movimento ou utilização
            do produto.
          </p>
        </div>

        <div
          className={`rounded-2xl px-4 py-3 text-sm font-bold ${
            possuiVideo
              ? "bg-[color-mix(in_srgb,var(--success)_10%,white)] text-success"
              : "bg-background text-text-light"
          }`}
        >
          {possuiVideo
            ? "Vídeo selecionado"
            : "Sem vídeo"}
        </div>
      </div>

      {!possuiVideo ? (
        <div className="mt-8 rounded-3xl border-2 border-dashed border-border bg-background px-6 py-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-card text-primary shadow-sm">
            <Upload className="h-8 w-8" />
          </div>

          <h4 className="mt-5 text-lg font-black text-text">
            Nenhum vídeo selecionado
          </h4>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-light">
            Formatos aceitos: MP4 e WEBM. Tamanho máximo:
            50 MB.
          </p>

          <button
            type="button"
            onClick={
              abrirSeletor
            }
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-black text-white shadow-md transition hover:-translate-y-0.5 hover:opacity-90"
          >
            <Play className="h-5 w-5" />

            Selecionar vídeo
          </button>
        </div>
      ) : (
        <div className="mt-8">
          <div className="overflow-hidden rounded-3xl border border-border bg-black shadow-lg">
            <video
              key={
                urlPreview
              }
              src={
                urlPreview
              }
              controls
              playsInline
              preload="metadata"
              onLoadedMetadata={(
                evento,
              ) =>
                carregarMetadados(
                  evento.currentTarget,
                )
              }
              className="aspect-video w-full object-contain"
            >
              Seu navegador não oferece suporte à reprodução
              de vídeos.
            </video>
          </div>

          <div className="mt-4 rounded-2xl border border-border bg-background p-4">
            <div className="flex flex-wrap gap-2">
              {informacoesVideo.map(
                (
                  informacao,
                ) => (
                  <span
                    key={
                      informacao
                    }
                    className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-bold text-text-light"
                  >
                    {
                      informacao
                    }
                  </span>
                ),
              )}
            </div>

            {video && (
              <p className="mt-3 break-all text-sm font-medium text-text-light">
                {
                  video.name
                }
              </p>
            )}

            {!video &&
              videoAtual && (
                <p className="mt-3 text-sm font-medium text-text-light">
                  O vídeo salvo atualmente será mantido.
                </p>
              )}
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={
                abrirSeletor
              }
              className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-primary px-5 py-3 text-sm font-black text-primary transition hover:bg-[color-mix(in_srgb,var(--primary)_8%,white)]"
            >
              <RefreshCw className="h-5 w-5" />

              Trocar vídeo
            </button>

            <button
              type="button"
              onClick={
                removerVideo
              }
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[color-mix(in_srgb,var(--danger)_10%,white)] px-5 py-3 text-sm font-black text-danger transition hover:bg-danger hover:text-white"
            >
              <Trash2 className="h-5 w-5" />

              Remover vídeo
            </button>
          </div>
        </div>
      )}

      {erroVideo && (
        <div className="mt-5 rounded-2xl border border-danger/30 bg-[color-mix(in_srgb,var(--danger)_8%,white)] px-4 py-3 text-sm font-bold text-danger">
          ⚠️ {erroVideo}
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-primary/20 bg-[color-mix(in_srgb,var(--primary)_6%,white)] px-4 py-4">
        <p className="text-sm font-bold text-primary">
          Pré-visualização local
        </p>

        <p className="mt-1 text-sm leading-6 text-text-light">
          Nesta etapa o vídeo será apenas exibido no
          formulário. Depois conectaremos o upload ao bucket{" "}
          <strong className="text-text">
            produto-videos
          </strong>{" "}
          e salvaremos a URL no cadastro do produto.
        </p>
      </div>
    </section>
  );
}
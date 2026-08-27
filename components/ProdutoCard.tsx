

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ShoppingCart,
  Sparkles,
  Star,
} from "lucide-react";
import {
  useRef,
  useState,
} from "react";

import { useCarrinho } from "@/app/context/CarrinhoContext";
import FavoriteButton from "@/components/product/FavoriteButton";
import ProductBadges from "@/components/product/ProductBadges";
import ProductPrice from "@/components/product/ProductPrice";
import ProductTypeBadge from "@/components/product/ProductTypeBadge";

interface ProdutoCardProps {
  produto: any;
  adicionarCarrinho: (produto: any) => void;
}

export default function ProdutoCard({
  produto,
  adicionarCarrinho,
}: ProdutoCardProps) {
  const router = useRouter();

  const { limparCarrinho } =
    useCarrinho();

  const imagemProdutoRef =
    useRef<HTMLImageElement | null>(
      null,
    );

  const timerAdicionadoRef =
    useRef<ReturnType<
      typeof setTimeout
    > | null>(null);

  const [
    adicionado,
    setAdicionado,
  ] = useState(false);

  const produtoDigital =
    Boolean(
      produto.arquivo_digital,
    ) ||
    produto.tipo_produto ===
      "digital" ||
    produto.tipo_produto ===
      "pdf" ||
    produto.tipo_produto ===
      "kit";

  const preco = Number(
    produto.preco || 0,
  );

  const precoAnterior = Number(
    produto.preco_anterior || 0,
  );

  const possuiDesconto =
    precoAnterior > 0 &&
    preco > 0 &&
    precoAnterior > preco;

  const percentualDesconto =
    possuiDesconto
      ? Math.round(
          ((precoAnterior -
            preco) /
            precoAnterior) *
            100,
        )
      : 0;

  function avisarCarrinhoQueProdutoChegou() {
    window.dispatchEvent(
      new CustomEvent(
        "carrinho:produto-adicionado",
        {
          detail: {
            nome:
              produto.nome ||
              "Produto",
          },
        },
      ),
    );
  }

  function mostrarConfirmacaoNoBotao() {
    setAdicionado(true);

    if (
      timerAdicionadoRef.current
    ) {
      clearTimeout(
        timerAdicionadoRef.current,
      );
    }

    timerAdicionadoRef.current =
      setTimeout(() => {
        setAdicionado(false);
      }, 1600);
  }

  function animarProdutoAteCarrinho(
    origemAlternativa?: HTMLElement,
  ) {
    const destino =
      document.querySelector<HTMLElement>(
        '[data-cart-target="true"]',
      );

    const origem =
      imagemProdutoRef.current ||
      origemAlternativa;

    if (!destino || !origem) {
      avisarCarrinhoQueProdutoChegou();
      return;
    }

    const origemRect =
      origem.getBoundingClientRect();

    const destinoRect =
      destino.getBoundingClientRect();

    const tamanhoInicial = 76;

    const inicioX =
      origemRect.left +
      origemRect.width / 2 -
      tamanhoInicial / 2;

    const inicioY =
      origemRect.top +
      origemRect.height / 2 -
      tamanhoInicial / 2;

    const fimX =
      destinoRect.left +
      destinoRect.width / 2 -
      tamanhoInicial / 2;

    const fimY =
      destinoRect.top +
      destinoRect.height / 2 -
      tamanhoInicial / 2;

    const deltaX =
      fimX - inicioX;

    const deltaY =
      fimY - inicioY;

    const elemento =
      document.createElement("div");

    elemento.setAttribute(
      "aria-hidden",
      "true",
    );

    elemento.style.position =
      "fixed";

    elemento.style.left =
      `${inicioX}px`;

    elemento.style.top =
      `${inicioY}px`;

    elemento.style.width =
      `${tamanhoInicial}px`;

    elemento.style.height =
      `${tamanhoInicial}px`;

    elemento.style.zIndex =
      "9999";

    elemento.style.pointerEvents =
      "none";

    elemento.style.borderRadius =
      "20px";

    elemento.style.overflow =
      "hidden";

    elemento.style.background =
      "white";

    elemento.style.border =
      "3px solid rgba(124, 58, 237, 0.35)";

    elemento.style.boxShadow =
      "0 18px 45px rgba(76, 29, 149, 0.35), 0 0 0 8px rgba(124, 58, 237, 0.10)";

    elemento.style.willChange =
      "transform, opacity";

    if (produto.imagem) {
      const imagem =
        document.createElement("img");

      imagem.src =
        String(
          produto.imagem,
        );

      imagem.alt = "";
      imagem.style.width = "100%";
      imagem.style.height = "100%";
      imagem.style.objectFit = "cover";

      elemento.appendChild(
        imagem,
      );
    } else {
      elemento.innerHTML =
        "🛒";

      elemento.style.display =
        "flex";

      elemento.style.alignItems =
        "center";

      elemento.style.justifyContent =
        "center";

      elemento.style.fontSize =
        "34px";
    }

    document.body.appendChild(
      elemento,
    );

    const alturaDoArco =
      Math.max(
        70,
        Math.min(
          150,
          Math.abs(deltaY) * 0.22 +
            55,
        ),
      );

    const animacao =
      elemento.animate(
        [
          {
            transform:
              "translate3d(0, 0, 0) scale(1) rotate(0deg)",
            opacity: 1,
          },
          {
            transform: `translate3d(${deltaX * 0.52}px, ${deltaY * 0.48 - alturaDoArco}px, 0) scale(0.76) rotate(7deg)`,
            opacity: 0.98,
            offset: 0.56,
          },
          {
            transform: `translate3d(${deltaX}px, ${deltaY}px, 0) scale(0.22) rotate(14deg)`,
            opacity: 0.25,
          },
        ],
        {
          duration: 820,
          easing:
            "cubic-bezier(0.22, 0.75, 0.24, 1)",
          fill: "forwards",
        },
      );

    const finalizar = () => {
      elemento.remove();
      avisarCarrinhoQueProdutoChegou();
    };

    animacao.addEventListener(
      "finish",
      finalizar,
      {
        once: true,
      },
    );

    animacao.addEventListener(
      "cancel",
      finalizar,
      {
        once: true,
      },
    );
  }

  function adicionarAoCarrinho(
    botao: HTMLButtonElement,
  ) {
    adicionarCarrinho(
      produto,
    );

    mostrarConfirmacaoNoBotao();

    animarProdutoAteCarrinho(
      botao,
    );
  }

  function comprarAgora() {
    limparCarrinho();
    adicionarCarrinho(
      produto,
    );

    if (!produtoDigital) {
      router.push(
        "/carrinho",
      );

      return;
    }

    router.push(
      "/checkout",
    );
  }

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative overflow-hidden bg-background">
        <div className="absolute left-3 top-3 z-20 flex flex-wrap gap-2">
          <ProductBadges
            destaque={
              produto.destaque
            }
            possuiDesconto={
              possuiDesconto
            }
            percentualDesconto={
              percentualDesconto
            }
          />
        </div>

        <div className="absolute right-3 top-14 z-20">
          <FavoriteButton
            nomeProduto={
              produto.nome
            }
          />
        </div>

        <Link
          href={`/produtos/${produto.id}`}
          aria-label={`Ver detalhes de ${produto.nome}`}
          className="block"
        >
          {produto.imagem ? (
            <img
              ref={imagemProdutoRef}
              src={
                produto.imagem
              }
              alt={
                produto.nome
              }
              className="aspect-[4/4.35] w-full cursor-pointer object-cover transition duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex aspect-[4/4.35] w-full items-center justify-center px-6 text-center text-sm font-medium text-text-light">
              Imagem não
              disponível
            </div>
          )}
        </Link>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/15 to-transparent opacity-0 transition group-hover:opacity-100" />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-3">
          {produto.categoria ? (
            <p className="truncate text-[11px] font-bold uppercase tracking-[0.13em] text-primary">
              {
                produto.categoria
              }
            </p>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-1 text-secondary">
            <Star className="h-3.5 w-3.5 fill-current" />

            <span className="text-[11px] font-bold text-text-light">
              {produto.avaliacao ||
                "5,0"}
            </span>
          </div>
        </div>

        <Link
          href={`/produtos/${produto.id}`}
        >
          <h2 className="mt-2.5 line-clamp-2 min-h-[2.9rem] text-base font-black leading-snug text-text transition hover:text-primary">
            {
              produto.nome
            }
          </h2>
        </Link>

        {produto.descricao && (
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-text-light">
            {
              produto.descricao
            }
          </p>
        )}

        <ProductPrice
          preco={preco}
          precoAnterior={
            precoAnterior
          }
          parcelas={
            produto.parcelas
          }
          produtoDigital={
            produtoDigital
          }
        />

        <ProductTypeBadge
          produtoDigital={
            produtoDigital
          }
        />

        <div className="mt-auto pt-4">
          <button
            type="button"
            onClick={(event) =>
              adicionarAoCarrinho(
                event.currentTarget,
              )
            }
            className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-black text-white shadow-md transition duration-300 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98] ${
              adicionado
                ? "bg-success"
                : "bg-accent hover:brightness-95"
            }`}
          >
            {adicionado ? (
              <>
                <span className="text-base">
                  ✓
                </span>

                Adicionado!
              </>
            ) : (
              <>
                <ShoppingCart className="h-4.5 w-4.5" />

                Adicionar ao
                carrinho
              </>
            )}
          </button>

          <button
            type="button"
            onClick={
              comprarAgora
            }
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-accent px-4 py-2.5 text-sm font-black text-accent transition hover:bg-[color-mix(in_srgb,var(--accent)_10%,white)] active:scale-[0.98]"
          >
            <Sparkles className="h-4.5 w-4.5" />

            Comprar agora
          </button>

          <Link
            href={`/produtos/${produto.id}`}
            className="group/link mt-3 flex items-center justify-center gap-2 text-xs font-bold text-text-light transition hover:text-primary"
          >
            Ver detalhes

            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
}
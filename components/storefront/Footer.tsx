import Link from "next/link";

import {
  Camera,
  Heart,
  LockKeyhole,
  Mail,
  MapPin,
  MessageCircle,
  PackageCheck,
  ShieldCheck,
  Users,
} from "lucide-react";

const whatsappUrl =
  "https://wa.me/5533999958593?text=Olá!%20Gostaria%20de%20ajuda%20para%20escolher%20um%20produto.";

const instagramUrl =
  "https://www.instagram.com/lembreidevoce_store/";

const facebookUrl =
  "https://www.facebook.com/share/1TdrTfsQRo/";

export default function Footer() {
  const anoAtual = new Date().getFullYear();

  return (
    <footer className="mt-16">
      {/* CTA DE ATENDIMENTO */}
      <section
        className="px-6 py-12 text-white sm:px-10"
        style={{
          background:
            "linear-gradient(135deg, var(--primary), var(--primary-light))",
        }}
      >
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 text-center lg:flex-row lg:text-left">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-secondary">
              Atendimento próximo
            </p>

            <h2 className="mt-3 max-w-2xl text-3xl font-black leading-tight sm:text-4xl">
              Ainda procurando o presente ideal?
            </h2>

            <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
              Nossa equipe está pronta para ajudar você a encontrar
              uma opção especial para cada ocasião.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-card px-6 py-4 text-sm font-black text-primary shadow-xl transition hover:-translate-y-0.5 hover:brightness-95"
            >
              <MessageCircle className="h-5 w-5" />
              Falar no WhatsApp
            </a>

            <Link
              href="/produtos"
              className="inline-flex items-center justify-center rounded-2xl border border-white/50 bg-white/10 px-6 py-4 text-sm font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20"
            >
              Ver todos os produtos
            </Link>
          </div>
        </div>
      </section>

      {/* RODAPÉ PRINCIPAL */}
      <section className="bg-slate-950 px-6 pb-8 pt-14 text-slate-300 sm:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 md:grid-cols-2 xl:grid-cols-4">
            {/* MARCA */}
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white">
                  <Heart className="h-6 w-6 fill-current" />
                </div>

                <div>
                  <p className="text-lg font-black text-white">
                    Lembrei de Você
                  </p>

                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary">
                    Store
                  </p>
                </div>
              </div>

              <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
                Transformando carinho em presentes inesquecíveis,
                produtos personalizados e criações digitais feitas
                para momentos especiais.
              </p>

              <div className="mt-6 flex gap-3">
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram da Lembrei de Você Store"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-300 transition hover:bg-primary hover:text-white"
                >
                  <Camera className="h-5 w-5" />
                </a>

                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook da Lembrei de Você Store"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-300 transition hover:bg-primary hover:text-white"
                >
                  <Users className="h-5 w-5" />
                </a>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp da Lembrei de Você Store"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-300 transition hover:bg-primary hover:text-white"
                >
                  <MessageCircle className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* INSTITUCIONAL */}
            <div>
              <h3 className="text-sm font-black uppercase tracking-[0.16em] text-white">
                Institucional
              </h3>

              <nav className="mt-5 flex flex-col gap-3 text-sm">
                <Link
                  href="/quem-somos"
                  className="transition hover:text-secondary"
                >
                  Quem somos
                </Link>

                <Link
                  href="/como-comprar"
                  className="transition hover:text-secondary"
                >
                  Como comprar
                </Link>

                <Link
                  href="/politica-de-privacidade"
                  className="transition hover:text-secondary"
                >
                  Política de privacidade
                </Link>

                <Link
                  href="/trocas-e-devolucoes"
                  className="transition hover:text-secondary"
                >
                  Trocas e devoluções
                </Link>

                <Link
                  href="/termos-de-uso"
                  className="transition hover:text-secondary"
                >
                  Termos de uso
                </Link>
              </nav>
            </div>

            {/* ATENDIMENTO */}
            <div>
              <h3 className="text-sm font-black uppercase tracking-[0.16em] text-white">
                Atendimento
              </h3>

              <div className="mt-5 flex flex-col gap-4 text-sm">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 transition hover:text-secondary"
                >
                  <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />

                  <span>
                    Atendimento direto
                    <strong className="block font-bold text-white">
                      pelo WhatsApp
                    </strong>
                  </span>
                </a>

                <a
                  href="mailto:contato@lembreidevocestore.com.br"
                  className="flex items-start gap-3 transition hover:text-secondary"
                >
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />

                  <span className="break-all">
                    contato@lembreidevocestore.com.br
                  </span>
                </a>

                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />

                  <span>
                    Atendimento online para todo o Brasil
                  </span>
                </div>

                <Link
                  href="/minha-conta"
                  className="transition hover:text-secondary"
                >
                  Minha conta
                </Link>

                <Link
                  href="/meu-pedido"
                  className="transition hover:text-secondary"
                >
                  Meus pedidos
                </Link>
              </div>
            </div>

            {/* COMPRA SEGURA */}
            <div>
              <h3 className="text-sm font-black uppercase tracking-[0.16em] text-white">
                Compra segura
              </h3>

              <div className="mt-5 space-y-4">
                <div className="flex items-start gap-3 rounded-2xl bg-white/5 p-4">
                  <ShieldCheck className="h-5 w-5 shrink-0 text-secondary" />

                  <div>
                    <p className="text-sm font-bold text-white">
                      Pagamento protegido
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      Pix e cartão processados com segurança.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl bg-white/5 p-4">
                  <PackageCheck className="h-5 w-5 shrink-0 text-secondary" />

                  <div>
                    <p className="text-sm font-bold text-white">
                      Entrega acompanhada
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      Produtos físicos enviados com rastreamento.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl bg-white/5 p-4">
                  <LockKeyhole className="h-5 w-5 shrink-0 text-secondary" />

                  <div>
                    <p className="text-sm font-bold text-white">
                      Navegação segura
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      Seus dados são protegidos durante a compra.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RODAPÉ INFERIOR */}
          <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-7 text-center text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <p>
              © {anoAtual} Lembrei de Você Store. Todos os
              direitos reservados.
            </p>

            <p className="inline-flex items-center justify-center gap-1.5">
              Feito com
              <Heart className="h-3.5 w-3.5 fill-accent text-accent" />
              no Brasil
            </p>
          </div>
        </div>
      </section>
    </footer>
  );
}
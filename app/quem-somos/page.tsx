import Link from "next/link";

import Header from "@/components/Header";
import Footer from "@/components/storefront/Footer";

import {
  ArrowLeft,
  Heart,
  MessageCircle,
  MonitorDown,
  PackageCheck,
  Sparkles,
} from "lucide-react";

const whatsappUrl =
  "https://wa.me/5533999958593?text=Olá!%20Gostaria%20de%20conhecer%20melhor%20os%20produtos%20da%20Lembrei%20de%20Você%20Store.";

export default function QuemSomosPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-slate-50">
        {/* APRESENTAÇÃO */}
        <section
          className="px-6 py-16 text-white sm:px-10 lg:py-24"
          style={{
            background:
              "linear-gradient(135deg, var(--primary), var(--primary-light))",
          }}
        >
          <div className="mx-auto max-w-5xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-white/15 backdrop-blur">
              <Heart className="h-8 w-8 fill-current text-secondary" />
            </div>

            <p className="mt-6 text-sm font-black uppercase tracking-[0.2em] text-secondary">
              Lembrei de Você Store
            </p>

            <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              Presentes que transformam carinho em lembranças
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-white/85 sm:text-lg">
              Criamos produtos personalizados e digitais para ajudar
              você a celebrar pessoas, histórias e momentos especiais
              de uma maneira única.
            </p>
          </div>
        </section>

        {/* NOSSA HISTÓRIA */}
        <section className="px-6 py-16 sm:px-10 lg:py-20">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-secondary">
                Nossa história
              </p>

              <h2 className="mt-3 text-3xl font-black leading-tight text-slate-950 sm:text-4xl">
                Cada criação começa com uma lembrança especial
              </h2>

              <div className="mt-6 space-y-5 text-base leading-8 text-slate-600">
                <p>
                  A Lembrei de Você Store nasceu do desejo de
                  transformar ideias, sentimentos e ocasiões especiais
                  em presentes personalizados.
                </p>

                <p>
                  Trabalhamos com produtos físicos e digitais,
                  desenvolvidos para aniversários, celebrações,
                  empresas, igrejas, eventos e diferentes momentos da
                  vida.
                </p>

                <p>
                  Nosso propósito é oferecer um atendimento próximo,
                  entender cada pedido e entregar uma criação feita com
                  cuidado, criatividade e atenção aos detalhes.
                </p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/60 sm:p-10">
              <Sparkles className="h-10 w-10 text-secondary" />

              <h3 className="mt-6 text-2xl font-black text-slate-950">
                Nosso propósito
              </h3>

              <p className="mt-4 text-base leading-8 text-slate-600">
                Ajudar pessoas a demonstrarem carinho por meio de
                produtos que tenham significado, personalidade e sejam
                capazes de preservar bons momentos.
              </p>

              <div className="mt-8 rounded-2xl bg-slate-50 p-5">
                <p className="text-sm font-bold leading-7 text-slate-700">
                  Mais do que produzir um item, queremos participar de
                  histórias que serão lembradas com carinho.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* O QUE OFERECEMOS */}
        <section className="bg-white px-6 py-16 sm:px-10 lg:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-secondary">
                O que oferecemos
              </p>

              <h2 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">
                Produtos preparados para momentos especiais
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
                Soluções personalizadas para presentear, celebrar,
                decorar e guardar boas lembranças.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <article className="rounded-3xl border border-slate-200 bg-slate-50 p-7 transition hover:-translate-y-1 hover:shadow-xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Heart className="h-6 w-6" />
                </div>

                <h3 className="mt-5 text-xl font-black text-slate-950">
                  Personalizados
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Canecas, lembrancinhas, marcadores e outros produtos
                  criados para diferentes ocasiões.
                </p>
              </article>

              <article className="rounded-3xl border border-slate-200 bg-slate-50 p-7 transition hover:-translate-y-1 hover:shadow-xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <MonitorDown className="h-6 w-6" />
                </div>

                <h3 className="mt-5 text-xl font-black text-slate-950">
                  Arquivos digitais
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Artes e materiais digitais com acesso disponibilizado
                  após a confirmação do pagamento.
                </p>
              </article>

              <article className="rounded-3xl border border-slate-200 bg-slate-50 p-7 transition hover:-translate-y-1 hover:shadow-xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <PackageCheck className="h-6 w-6" />
                </div>

                <h3 className="mt-5 text-xl font-black text-slate-950">
                  Envio acompanhado
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Os produtos físicos são preparados com cuidado e
                  enviados com acompanhamento da entrega.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* ATENDIMENTO */}
        <section className="px-6 py-16 sm:px-10 lg:py-20">
          <div className="mx-auto max-w-5xl rounded-[2rem] bg-slate-950 px-7 py-12 text-center text-white shadow-2xl sm:px-12">
            <MessageCircle className="mx-auto h-10 w-10 text-secondary" />

            <h2 className="mt-5 text-3xl font-black">
              Vamos criar algo especial?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-300">
              Fale conosco pelo WhatsApp para conhecer os produtos,
              esclarecer dúvidas ou conversar sobre uma ideia
              personalizada.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-sm font-black text-white transition hover:-translate-y-0.5 hover:brightness-110"
              >
                <MessageCircle className="h-5 w-5" />
                Falar no WhatsApp
              </a>

              <Link
                href="/produtos"
                className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/5 px-6 py-4 text-sm font-black text-white transition hover:bg-white/10"
              >
                Conhecer os produtos
              </Link>
            </div>
          </div>

          <div className="mx-auto mt-10 max-w-5xl">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-bold text-primary transition hover:opacity-70"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para o início
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
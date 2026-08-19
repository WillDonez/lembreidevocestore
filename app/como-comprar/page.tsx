import Link from "next/link";

import Header from "@/components/Header";
import Footer from "@/components/storefront/Footer";

import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Download,
  MessageCircle,
  PackageCheck,
  Search,
  ShieldCheck,
  ShoppingCart,
} from "lucide-react";

const whatsappUrl =
  "https://wa.me/5533999958593?text=Olá!%20Preciso%20de%20ajuda%20para%20realizar%20uma%20compra%20na%20Lembrei%20de%20Você%20Store.";

const etapas = [
  {
    numero: "01",
    titulo: "Escolha seu produto",
    descricao:
      "Acesse nossos produtos, consulte as informações e escolha a opção ideal para o momento que deseja celebrar.",
    Icone: Search,
  },
  {
    numero: "02",
    titulo: "Adicione ao carrinho",
    descricao:
      "Escolha a quantidade desejada e adicione o produto ao carrinho. Você poderá revisar os itens antes de continuar.",
    Icone: ShoppingCart,
  },
  {
    numero: "03",
    titulo: "Informe seus dados",
    descricao:
      "Preencha corretamente seus dados de contato e, quando necessário, o endereço completo para entrega.",
    Icone: CheckCircle2,
  },
  {
    numero: "04",
    titulo: "Realize o pagamento",
    descricao:
      "O pagamento é processado com segurança pelo Mercado Pago. Aguarde a confirmação antes de fechar a página.",
    Icone: CreditCard,
  },
];

export default function ComoComprarPage() {
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
              <ShoppingCart className="h-8 w-8 text-secondary" />
            </div>

            <p className="mt-6 text-sm font-black uppercase tracking-[0.2em] text-secondary">
              Compra simples e segura
            </p>

            <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              Como comprar na Lembrei de Você Store
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-white/85 sm:text-lg">
              Veja como escolher seus produtos, realizar o pagamento
              e acompanhar cada etapa do seu pedido.
            </p>
          </div>
        </section>

        {/* PASSO A PASSO */}
        <section className="px-6 py-16 sm:px-10 lg:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-secondary">
                Passo a passo
              </p>

              <h2 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">
                Sua compra em quatro etapas
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
                Confira os dados com atenção antes de concluir o
                pagamento.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {etapas.map(
                ({
                  numero,
                  titulo,
                  descricao,
                  Icone,
                }) => (
                  <article
                    key={numero}
                    className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-lg shadow-slate-200/40 transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <span className="absolute right-6 top-5 text-5xl font-black text-slate-100">
                      {numero}
                    </span>

                    <div className="relative">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Icone className="h-6 w-6" />
                      </div>

                      <h3 className="mt-5 text-xl font-black text-slate-950">
                        {titulo}
                      </h3>

                      <p className="mt-3 max-w-lg text-sm leading-7 text-slate-600">
                        {descricao}
                      </p>
                    </div>
                  </article>
                )
              )}
            </div>
          </div>
        </section>

        {/* TIPOS DE ENTREGA */}
        <section className="bg-white px-6 py-16 sm:px-10 lg:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-secondary">
                Depois do pagamento
              </p>

              <h2 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">
                Como você recebe sua compra
              </h2>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              <article className="rounded-3xl border border-slate-200 bg-slate-50 p-7 sm:p-9">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <PackageCheck className="h-6 w-6" />
                </div>

                <h3 className="mt-5 text-2xl font-black text-slate-950">
                  Produtos físicos
                </h3>

                <p className="mt-4 text-base leading-8 text-slate-600">
                  Após a confirmação do pagamento, o pedido será
                  preparado para envio. Quando disponível, você poderá
                  acompanhar as informações da entrega e o código de
                  rastreamento em sua conta.
                </p>
              </article>

              <article className="rounded-3xl border border-slate-200 bg-slate-50 p-7 sm:p-9">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Download className="h-6 w-6" />
                </div>

                <h3 className="mt-5 text-2xl font-black text-slate-950">
                  Produtos digitais
                </h3>

                <p className="mt-4 text-base leading-8 text-slate-600">
                  Após a aprovação do pagamento, o arquivo digital será
                  liberado na área do cliente. Entre em sua conta e
                  acesse a seção de downloads para baixar o material.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* SEGURANÇA */}
        <section className="px-6 py-16 sm:px-10 lg:py-20">
          <div className="mx-auto grid max-w-5xl gap-8 rounded-[2rem] border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/50 sm:p-10 lg:grid-cols-[auto_1fr] lg:items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary">
              <ShieldCheck className="h-8 w-8" />
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-950 sm:text-3xl">
                Pagamento protegido
              </h2>

              <p className="mt-3 text-base leading-8 text-slate-600">
                O pagamento é realizado no ambiente seguro do Mercado
                Pago. A Lembrei de Você Store não armazena os dados do
                seu cartão.
              </p>
            </div>
          </div>
        </section>

        {/* ATENDIMENTO */}
        <section className="px-6 pb-16 sm:px-10 lg:pb-20">
          <div className="mx-auto max-w-5xl rounded-[2rem] bg-slate-950 px-7 py-12 text-center text-white shadow-2xl sm:px-12">
            <MessageCircle className="mx-auto h-10 w-10 text-secondary" />

            <h2 className="mt-5 text-3xl font-black">
              Precisa de ajuda para comprar?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-300">
              Fale conosco pelo WhatsApp. Teremos prazer em ajudar
              você a escolher o produto e esclarecer suas dúvidas.
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
                href="/#produtos"
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
import Link from "next/link";

import Header from "@/components/Header";
import Footer from "@/components/storefront/Footer";

import {
  ArrowLeft,
  Cookie,
  CreditCard,
  Database,
  FileCheck,
  LockKeyhole,
  Mail,
  MessageCircle,
  Scale,
  ServerCog,
  Share2,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react";

const whatsappUrl =
  "https://wa.me/5533999958593?text=Olá!%20Gostaria%20de%20falar%20sobre%20privacidade%20e%20meus%20dados%20pessoais.";

const emailPrivacidade =
  "contato@lembreidevocestore.com.br";

export default function PoliticaDePrivacidadePage() {
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
              <ShieldCheck className="h-8 w-8 text-secondary" />
            </div>

            <p className="mt-6 text-sm font-black uppercase tracking-[0.2em] text-secondary">
              Privacidade e proteção de dados
            </p>

            <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              Política de Privacidade
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-white/85 sm:text-lg">
              Esta política explica como a Lembrei de Você Store
              coleta, utiliza, armazena e protege os dados pessoais
              utilizados durante a navegação, o cadastro e a compra
              de nossos produtos.
            </p>

            <p className="mt-6 text-sm font-semibold text-white/70">
              Última atualização: 17 de agosto de 2026
            </p>
          </div>
        </section>

        {/* IDENTIFICAÇÃO */}
        <section className="px-6 py-16 sm:px-10 lg:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/60 sm:p-10">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <FileCheck className="h-6 w-6" />
                </div>

                <div>
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-secondary">
                    Quem somos
                  </p>

                  <h2 className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">
                    Responsável pelo tratamento dos dados
                  </h2>
                </div>
              </div>

              <div className="mt-7 space-y-4 text-base leading-8 text-slate-600">
                <p>
                  A <strong>Lembrei de Você Store</strong> é
                  responsável pelas decisões relacionadas ao
                  tratamento dos dados pessoais utilizados neste site.
                </p>

                <p>
                  A loja é administrada por{" "}
                  <strong>Willy Geronimo Donez Aricara</strong>,
                  inscrito no CNPJ sob o número{" "}
                  <strong>62.717.733/0001-07</strong>.
                </p>

                <p>
                  Para assuntos relacionados à privacidade e à
                  proteção de dados, entre em contato pelo e-mail{" "}
                  <a
                    href={`mailto:${emailPrivacidade}`}
                    className="font-bold text-primary underline-offset-4 hover:underline"
                  >
                    {emailPrivacidade}
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* DADOS COLETADOS */}
        <section className="bg-white px-6 py-16 sm:px-10 lg:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-secondary">
                Dados pessoais
              </p>

              <h2 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">
                Quais informações podemos utilizar
              </h2>

              <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-slate-600">
                Coletamos somente as informações necessárias para
                atender o cliente, processar pedidos, entregar
                produtos e manter o funcionamento seguro da loja.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              <article className="rounded-3xl border border-slate-200 bg-slate-50 p-7">
                <UserRoundCheck className="h-8 w-8 text-primary" />

                <h3 className="mt-5 text-xl font-black text-slate-950">
                  Identificação e contato
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Nome, e-mail, telefone ou WhatsApp, CPF ou CNPJ e
                  informações fornecidas durante o cadastro ou
                  atendimento.
                </p>
              </article>

              <article className="rounded-3xl border border-slate-200 bg-slate-50 p-7">
                <Database className="h-8 w-8 text-primary" />

                <h3 className="mt-5 text-xl font-black text-slate-950">
                  Cadastro e conta
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Identificador da conta, histórico de pedidos,
                  preferências e informações necessárias para
                  autenticação e acesso à área do cliente.
                </p>
              </article>

              <article className="rounded-3xl border border-slate-200 bg-slate-50 p-7">
                <Share2 className="h-8 w-8 text-primary" />

                <h3 className="mt-5 text-xl font-black text-slate-950">
                  Pedido e entrega
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Produtos adquiridos, valores, endereço, CEP, número,
                  complemento, bairro, cidade, estado, modalidade de
                  frete, rastreamento e situação da entrega.
                </p>
              </article>

              <article className="rounded-3xl border border-slate-200 bg-slate-50 p-7">
                <ServerCog className="h-8 w-8 text-primary" />

                <h3 className="mt-5 text-xl font-black text-slate-950">
                  Informações técnicas
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Dados técnicos necessários para segurança,
                  autenticação, prevenção de falhas e funcionamento
                  do site, como registros de acesso, dispositivo,
                  navegador e endereço IP, quando disponíveis.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* FINALIDADES */}
        <section className="px-6 py-16 sm:px-10 lg:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-secondary">
                  Uso das informações
                </p>

                <h2 className="mt-3 text-3xl font-black leading-tight text-slate-950 sm:text-4xl">
                  Por que tratamos seus dados
                </h2>

                <p className="mt-5 text-base leading-8 text-slate-600">
                  O tratamento é realizado conforme a finalidade de
                  cada informação e as bases legais previstas na Lei
                  Geral de Proteção de Dados.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  "Criar e administrar a conta do cliente.",
                  "Identificar o cliente e prestar atendimento.",
                  "Registrar, processar e acompanhar pedidos.",
                  "Calcular o frete e viabilizar a entrega.",
                  "Disponibilizar produtos e arquivos digitais.",
                  "Confirmar a situação do pagamento.",
                  "Emitir documentos fiscais quando necessário.",
                  "Prevenir fraudes, abusos e acessos indevidos.",
                  "Cumprir obrigações legais, fiscais e regulatórias.",
                  "Proteger os direitos da loja e dos clientes.",
                ].map((finalidade) => (
                  <div
                    key={finalidade}
                    className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4"
                  >
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                    <p className="text-sm font-semibold leading-6 text-slate-700">
                      {finalidade}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 rounded-3xl border border-secondary/30 bg-secondary/10 p-6">
              <h3 className="font-black text-slate-950">
                Bases legais utilizadas
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-700">
                Conforme o caso, o tratamento poderá ser fundamentado
                na execução de contrato ou de procedimentos
                preliminares, cumprimento de obrigação legal ou
                regulatória, exercício regular de direitos, legítimo
                interesse e consentimento do titular, quando este for
                necessário.
              </p>
            </div>
          </div>
        </section>

        {/* PAGAMENTO E COMPARTILHAMENTO */}
        <section className="bg-white px-6 py-16 sm:px-10 lg:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-6 lg:grid-cols-2">
              <article className="rounded-[2rem] border border-slate-200 bg-slate-50 p-7 sm:p-9">
                <CreditCard className="h-10 w-10 text-primary" />

                <h2 className="mt-5 text-2xl font-black text-slate-950">
                  Pagamentos
                </h2>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  Os pagamentos são processados pelo{" "}
                  <strong>Mercado Pago</strong>. A Lembrei de Você
                  Store recebe informações como situação,
                  identificação e referência da transação, mas não
                  armazena o número completo do cartão nem o código de
                  segurança.
                </p>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  O tratamento realizado pelo Mercado Pago também está
                  sujeito às políticas e aos procedimentos de
                  segurança próprios dessa plataforma.
                </p>
              </article>

              <article className="rounded-[2rem] border border-slate-200 bg-slate-50 p-7 sm:p-9">
                <Share2 className="h-10 w-10 text-primary" />

                <h2 className="mt-5 text-2xl font-black text-slate-950">
                  Compartilhamento de dados
                </h2>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  As informações poderão ser compartilhadas somente
                  quando necessário com fornecedores que ajudam a
                  operar a loja, como:
                </p>

                <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
                  <li>
                    • Mercado Pago, para processamento de pagamentos;
                  </li>

                  <li>
                    • Melhor Envio e transportadoras, para cotação,
                    postagem, rastreamento e entrega;
                  </li>

                  <li>
                    • Supabase, para banco de dados, autenticação e
                    armazenamento;
                  </li>

                  <li>
                    • Vercel, para hospedagem e funcionamento do site;
                  </li>

                  <li>
                    • autoridades públicas, quando houver obrigação
                    legal ou determinação válida.
                  </li>
                </ul>
              </article>
            </div>

            <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-7">
              <h3 className="text-xl font-black text-slate-950">
                Transferências internacionais
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                Alguns fornecedores de tecnologia podem utilizar
                infraestrutura localizada fora do Brasil. Nesses
                casos, procuramos utilizar prestadores que adotem
                medidas de segurança e proteção compatíveis com a
                legislação aplicável.
              </p>
            </div>
          </div>
        </section>

        {/* ARMAZENAMENTO E SEGURANÇA */}
        <section className="px-6 py-16 sm:px-10 lg:py-20">
          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
            <article className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-lg shadow-slate-200/50 sm:p-9">
              <LockKeyhole className="h-10 w-10 text-primary" />

              <h2 className="mt-5 text-2xl font-black text-slate-950">
                Segurança
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                Adotamos medidas técnicas e administrativas destinadas
                a reduzir riscos de acesso não autorizado, perda,
                alteração, divulgação indevida ou uso inadequado dos
                dados.
              </p>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                Nenhum sistema é totalmente isento de riscos, mas
                mantemos cuidados compatíveis com a natureza das
                informações tratadas e com o porte da operação.
              </p>
            </article>

            <article className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-lg shadow-slate-200/50 sm:p-9">
              <Database className="h-10 w-10 text-primary" />

              <h2 className="mt-5 text-2xl font-black text-slate-950">
                Prazo de armazenamento
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                Os dados são mantidos pelo tempo necessário para
                realizar as finalidades informadas nesta política e
                atender obrigações legais, fiscais, regulatórias,
                prevenção de fraudes e exercício regular de direitos.
              </p>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                Quando não houver mais finalidade ou obrigação para a
                conservação, as informações poderão ser eliminadas,
                bloqueadas ou anonimizadas.
              </p>
            </article>
          </div>
        </section>

        {/* COOKIES */}
        <section className="bg-white px-6 py-16 sm:px-10">
          <div className="mx-auto max-w-6xl rounded-[2rem] border border-slate-200 bg-slate-50 p-7 sm:p-10">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Cookie className="h-6 w-6" />
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-950">
                  Cookies e armazenamento local
                </h2>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  O site pode utilizar cookies técnicos e recursos de
                  armazenamento local necessários para manter sessões,
                  autenticação, carrinho de compras, segurança e
                  preferências básicas de navegação.
                </p>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  A desativação desses recursos diretamente no
                  navegador poderá impedir o funcionamento correto de
                  partes da loja.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* DIREITOS DO TITULAR */}
        <section className="px-6 py-16 sm:px-10 lg:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <Scale className="mx-auto h-10 w-10 text-secondary" />

              <p className="mt-5 text-sm font-black uppercase tracking-[0.18em] text-secondary">
                Seus direitos
              </p>

              <h2 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">
                Direitos do titular dos dados
              </h2>

              <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-slate-600">
                Nos termos da LGPD, você poderá solicitar, quando
                aplicável:
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {[
                "Confirmação da existência de tratamento.",
                "Acesso aos seus dados pessoais.",
                "Correção de informações incompletas ou incorretas.",
                "Anonimização, bloqueio ou eliminação de dados tratados de forma irregular.",
                "Informações sobre compartilhamento de dados.",
                "Portabilidade, conforme regulamentação aplicável.",
                "Revogação do consentimento, quando essa for a base utilizada.",
                "Eliminação de dados tratados com consentimento, respeitadas as exceções legais.",
                "Oposição a tratamentos realizados em desconformidade com a LGPD.",
                "Revisão de decisões exclusivamente automatizadas, quando aplicável.",
              ].map((direito) => (
                <div
                  key={direito}
                  className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-5"
                >
                  <UserRoundCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                  <p className="text-sm font-semibold leading-6 text-slate-700">
                    {direito}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6">
              <p className="text-sm leading-7 text-slate-600">
                Para proteger o titular e evitar fraudes, poderemos
                solicitar informações adicionais para confirmar a
                identidade de quem apresentar o pedido. Algumas
                solicitações poderão ser limitadas quando a
                conservação dos dados for necessária para o
                cumprimento de obrigações legais ou para o exercício
                regular de direitos.
              </p>
            </div>
          </div>
        </section>

        {/* CRIANÇAS E ATUALIZAÇÕES */}
        <section className="bg-white px-6 py-16 sm:px-10 lg:py-20">
          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
            <article className="rounded-3xl border border-slate-200 bg-slate-50 p-7">
              <h2 className="text-xl font-black text-slate-950">
                Crianças e adolescentes
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                A loja não é intencionalmente direcionada a crianças.
                Compras realizadas por menores de idade devem contar
                com a participação e supervisão de seus responsáveis
                legais.
              </p>
            </article>

            <article className="rounded-3xl border border-slate-200 bg-slate-50 p-7">
              <h2 className="text-xl font-black text-slate-950">
                Atualizações desta política
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                Esta política poderá ser atualizada para refletir
                alterações no site, nos serviços utilizados ou na
                legislação. A versão mais recente estará sempre
                disponível nesta página.
              </p>
            </article>
          </div>
        </section>

        {/* CONTATO */}
        <section className="px-6 py-16 sm:px-10 lg:py-20">
          <div className="mx-auto max-w-5xl rounded-[2rem] bg-slate-950 px-7 py-12 text-center text-white shadow-2xl sm:px-12">
            <ShieldCheck className="mx-auto h-10 w-10 text-secondary" />

            <h2 className="mt-5 text-3xl font-black">
              Dúvidas sobre seus dados?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-300">
              Entre em contato para esclarecer dúvidas, atualizar
              informações ou solicitar o exercício de seus direitos
              relacionados à proteção de dados pessoais.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href={`mailto:${emailPrivacidade}`}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-sm font-black text-slate-950 transition hover:-translate-y-0.5"
              >
                <Mail className="h-5 w-5" />
                Enviar e-mail
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-sm font-black text-white transition hover:-translate-y-0.5 hover:brightness-110"
              >
                <MessageCircle className="h-5 w-5" />
                Falar no WhatsApp
              </a>
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
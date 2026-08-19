import Link from "next/link";

import Header from "@/components/Header";
import Footer from "@/components/storefront/Footer";

import {
  AlertTriangle,
  ArrowLeft,
  BadgeCheck,
  CalendarClock,
  CheckCircle2,
  CircleDollarSign,
  FileDown,
  Mail,
  MessageCircle,
  PackageCheck,
  PackageOpen,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";

const whatsappUrl =
  "https://wa.me/5533999958593?text=Olá!%20Preciso%20de%20atendimento%20sobre%20troca%2C%20devolução%20ou%20cancelamento%20de%20um%20pedido.";

const emailContato =
  "mailto:contato@lembreidevocestore.com.br?subject=Troca%2C%20devolução%20ou%20cancelamento";

const passosSolicitacao = [
  {
    numero: "01",
    titulo: "Entre em contato",
    descricao:
      "Fale conosco pelo WhatsApp ou e-mail antes de enviar qualquer produto.",
  },
  {
    numero: "02",
    titulo: "Informe o pedido",
    descricao:
      "Envie o número do pedido, nome utilizado na compra e e-mail cadastrado.",
  },
  {
    numero: "03",
    titulo: "Explique a solicitação",
    descricao:
      "Descreva o motivo e, quando necessário, envie fotos ou vídeos do produto.",
  },
  {
    numero: "04",
    titulo: "Aguarde as orientações",
    descricao:
      "Nossa equipe analisará o caso e informará os próximos passos para devolução, correção ou reembolso.",
  },
];

export default function TrocasEDevolucoesPage() {
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
              <RefreshCcw className="h-8 w-8 text-secondary" />
            </div>

            <p className="mt-6 text-sm font-black uppercase tracking-[0.2em] text-secondary">
              Atendimento e garantia
            </p>

            <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              Trocas e Devoluções
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-white/85 sm:text-lg">
              Conheça os procedimentos para cancelamentos, trocas,
              devoluções, correções e reembolsos dos pedidos realizados
              na Lembrei de Você Store.
            </p>

            <p className="mt-5 text-sm font-bold text-white/75">
              Última atualização: 17 de agosto de 2026
            </p>
          </div>
        </section>

        {/* RESUMO */}
        <section className="px-6 py-16 sm:px-10 lg:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-secondary">
                Informações importantes
              </p>

              <h2 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">
                Entenda as principais situações
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
                Cada solicitação é analisada de acordo com o tipo do
                produto, a situação apresentada e os direitos previstos
                na legislação.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <article className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <CalendarClock className="h-6 w-6" />
                </div>

                <h3 className="mt-5 text-xl font-black text-slate-950">
                  Direito de arrependimento
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Nas compras realizadas pela internet, o consumidor
                  poderá exercer o direito de arrependimento no prazo
                  legal de 7 dias corridos, contado da contratação ou do
                  recebimento do produto.
                </p>
              </article>

              <article className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <PackageCheck className="h-6 w-6" />
                </div>

                <h3 className="mt-5 text-xl font-black text-slate-950">
                  Produto com problema
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Caso o pedido seja entregue com defeito, avaria,
                  divergência ou item diferente do comprado, entre em
                  contato para análise e solução.
                </p>
              </article>

              <article className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Sparkles className="h-6 w-6" />
                </div>

                <h3 className="mt-5 text-xl font-black text-slate-950">
                  Produtos personalizados
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Alterações devem ser solicitadas antes da aprovação da
                  arte ou do início da produção. Os direitos legais do
                  consumidor permanecem preservados.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* DIREITO DE ARREPENDIMENTO */}
        <section className="bg-white px-6 py-16 sm:px-10 lg:py-20">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-secondary">
                Compras pela internet
              </p>

              <h2 className="mt-3 text-3xl font-black leading-tight text-slate-950 sm:text-4xl">
                Direito de arrependimento
              </h2>

              <p className="mt-5 text-base leading-8 text-slate-600">
                Conforme o artigo 49 do Código de Defesa do Consumidor,
                o cliente poderá desistir de uma compra realizada fora
                do estabelecimento comercial no prazo de 7 dias
                corridos.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary" />

                <p className="text-sm leading-7 text-slate-700">
                  O prazo é contado da assinatura do contrato ou do
                  recebimento do produto, conforme a situação aplicável.
                </p>
              </div>

              <div className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary" />

                <p className="text-sm leading-7 text-slate-700">
                  Não é necessário apresentar uma justificativa para
                  exercer o direito dentro do prazo legal.
                </p>
              </div>

              <div className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary" />

                <p className="text-sm leading-7 text-slate-700">
                  Quando o direito for aplicável, os valores pagos,
                  inclusive os custos de entrega, serão restituídos.
                </p>
              </div>

              <div className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary" />

                <p className="text-sm leading-7 text-slate-700">
                  O cliente deverá entrar em contato conosco para
                  receber as instruções de devolução e acompanhamento.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* PERSONALIZADOS */}
        <section className="px-6 py-16 sm:px-10 lg:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-6 lg:grid-cols-2">
              <article className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
                <Sparkles className="h-9 w-9 text-secondary" />

                <h2 className="mt-5 text-2xl font-black text-slate-950">
                  Produtos personalizados
                </h2>

                <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600">
                  <p>
                    Produtos personalizados são produzidos conforme as
                    informações, nomes, textos, imagens, cores e demais
                    preferências informadas pelo cliente.
                  </p>

                  <p>
                    Antes de confirmar o pedido, confira cuidadosamente
                    todas as informações enviadas. Quando houver
                    aprovação de arte, a produção será iniciada conforme
                    o conteúdo aprovado.
                  </p>

                  <p>
                    Alterações solicitadas depois da aprovação ou do
                    início da produção poderão depender de viabilidade e
                    gerar novos custos, desde que não se trate de erro,
                    defeito ou descumprimento da oferta pela loja.
                  </p>
                </div>

                <div className="mt-6 rounded-2xl bg-amber-50 p-5">
                  <p className="text-sm font-bold leading-7 text-amber-900">
                    Essa condição não limita os direitos previstos na
                    legislação para arrependimento, vício, defeito,
                    avaria ou divergência do pedido.
                  </p>
                </div>
              </article>

              <article className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
                <FileDown className="h-9 w-9 text-secondary" />

                <h2 className="mt-5 text-2xl font-black text-slate-950">
                  Produtos digitais
                </h2>

                <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600">
                  <p>
                    Os arquivos digitais são disponibilizados após a
                    confirmação do pagamento, conforme as condições
                    apresentadas na página do produto.
                  </p>

                  <p>
                    Se o arquivo estiver corrompido, incompleto,
                    diferente do anunciado ou apresentar problema de
                    acesso, entre em contato para que possamos corrigir
                    ou disponibilizar novamente o material.
                  </p>

                  <p>
                    Solicitações de cancelamento ou arrependimento serão
                    avaliadas de acordo com o prazo legal, o acesso ao
                    conteúdo, a natureza do produto e a legislação
                    aplicável.
                  </p>
                </div>

                <div className="mt-6 rounded-2xl bg-slate-50 p-5">
                  <p className="text-sm font-bold leading-7 text-slate-700">
                    Não compartilhe links de download, senhas ou arquivos
                    adquiridos com terceiros.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* DEFEITOS E GARANTIA */}
        <section className="bg-white px-6 py-16 sm:px-10 lg:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-secondary">
                Garantia legal
              </p>

              <h2 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">
                Defeitos, avarias e divergências
              </h2>

              <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-slate-600">
                Confira o pedido assim que recebê-lo e entre em contato
                caso encontre qualquer problema.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              <article className="rounded-3xl border border-slate-200 bg-slate-50 p-7">
                <PackageOpen className="h-8 w-8 text-primary" />

                <h3 className="mt-5 text-xl font-black text-slate-950">
                  Ao receber o pedido
                </h3>

                <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-600">
                  <li>• Verifique a embalagem e as condições do item.</li>
                  <li>• Confira o produto, quantidade e personalização.</li>
                  <li>
                    • Registre fotos ou vídeos caso identifique avaria.
                  </li>
                  <li>
                    • Preserve a embalagem e os itens recebidos, quando
                    possível.
                  </li>
                </ul>
              </article>

              <article className="rounded-3xl border border-slate-200 bg-slate-50 p-7">
                <ShieldCheck className="h-8 w-8 text-primary" />

                <h3 className="mt-5 text-xl font-black text-slate-950">
                  Prazos para reclamação
                </h3>

                <p className="mt-5 text-sm leading-7 text-slate-600">
                  O Código de Defesa do Consumidor prevê prazo de 30 dias
                  para reclamar de vícios aparentes em produtos ou
                  serviços não duráveis e de 90 dias para produtos ou
                  serviços duráveis.
                </p>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  Nos vícios ocultos, o prazo começa quando o problema
                  ficar evidenciado, observadas as regras legais
                  aplicáveis.
                </p>
              </article>
            </div>

            <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-7">
              <div className="flex gap-4">
                <AlertTriangle className="mt-1 h-6 w-6 shrink-0 text-amber-700" />

                <div>
                  <h3 className="text-lg font-black text-amber-950">
                    Prazo para solução
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-amber-900">
                    Quando aplicável, o fornecedor terá o prazo legal de
                    até 30 dias para corrigir o problema. Caso não seja
                    solucionado nesse período, o consumidor poderá
                    escolher entre a substituição do produto, a
                    restituição do valor ou o abatimento proporcional,
                    observadas as exceções previstas em lei.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* COMO SOLICITAR */}
        <section className="px-6 py-16 sm:px-10 lg:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-secondary">
                Atendimento
              </p>

              <h2 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">
                Como solicitar uma troca ou devolução
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
                Siga as etapas abaixo para que possamos localizar e
                analisar sua compra.
              </p>
            </div>

            <div className="mt-12 grid gap-5 sm:grid-cols-2">
              {passosSolicitacao.map((passo) => (
                <article
                  key={passo.numero}
                  className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"
                >
                  <span className="absolute right-5 top-3 text-5xl font-black text-slate-100">
                    {passo.numero}
                  </span>

                  <BadgeCheck className="h-7 w-7 text-primary" />

                  <h3 className="mt-5 text-xl font-black text-slate-950">
                    {passo.titulo}
                  </h3>

                  <p className="mt-3 max-w-md text-sm leading-7 text-slate-600">
                    {passo.descricao}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* DEVOLUÇÃO E FRETE */}
        <section className="bg-white px-6 py-16 sm:px-10 lg:py-20">
          <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
            <article className="rounded-[2rem] border border-slate-200 bg-slate-50 p-7 sm:p-9">
              <Truck className="h-9 w-9 text-primary" />

              <h2 className="mt-5 text-2xl font-black text-slate-950">
                Envio do produto devolvido
              </h2>

              <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600">
                <p>
                  Não envie o produto por conta própria antes de receber
                  nossas orientações.
                </p>

                <p>
                  Quando a devolução decorrer de arrependimento dentro
                  do prazo legal, defeito, avaria, erro ou divergência
                  causada pela loja, os custos necessários para a
                  devolução serão assumidos pela Lembrei de Você Store.
                </p>

                <p>
                  O cliente receberá as instruções de postagem ou coleta,
                  conforme a modalidade disponível para sua localidade.
                </p>
              </div>
            </article>

            <article className="rounded-[2rem] border border-slate-200 bg-slate-50 p-7 sm:p-9">
              <CircleDollarSign className="h-9 w-9 text-primary" />

              <h2 className="mt-5 text-2xl font-black text-slate-950">
                Reembolso
              </h2>

              <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600">
                <p>
                  Após a aprovação do cancelamento ou devolução, o
                  reembolso será solicitado pelo mesmo meio de pagamento
                  utilizado na compra, sempre que possível.
                </p>

                <p>
                  Pagamentos são processados pelo Mercado Pago. O prazo
                  para visualização do estorno poderá variar conforme a
                  forma de pagamento, a instituição financeira e os
                  procedimentos da plataforma.
                </p>

                <p>
                  Quando aplicável, o valor do frete original também
                  integrará a restituição.
                </p>
              </div>
            </article>
          </div>
        </section>

        {/* SITUAÇÕES NÃO COBERTAS */}
        <section className="px-6 py-16 sm:px-10 lg:py-20">
          <div className="mx-auto max-w-6xl rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
            <h2 className="text-2xl font-black text-slate-950">
              Situações que precisam de análise específica
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              Fora das hipóteses previstas na legislação e das condições
              oferecidas pela loja, a troca poderá não ser realizada
              quando o problema decorrer exclusivamente de:
            </p>

            <div className="mt-7 grid gap-4 md:grid-cols-2">
              {[
                "Uso inadequado, queda, quebra ou dano causado após o recebimento.",
                "Desgaste natural incompatível com defeito de fabricação.",
                "Informação incorreta enviada pelo cliente e reproduzida conforme a aprovação.",
                "Alteração de preferência após o término do prazo legal aplicável.",
                "Modificação, tentativa de reparo ou intervenção realizada por terceiros.",
                "Ausência dos elementos necessários para identificar o pedido e analisar o problema.",
              ].map((item) => (
                <div
                  key={item}
                  className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <AlertTriangle className="mt-1 h-5 w-5 shrink-0 text-secondary" />

                  <p className="text-sm leading-6 text-slate-700">
                    {item}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-7 text-sm font-bold leading-7 text-slate-700">
              Nenhuma dessas condições limita os direitos do consumidor
              em casos de vício, defeito, descumprimento da oferta ou
              outras garantias previstas na legislação.
            </p>
          </div>
        </section>

        {/* CONTATO */}
        <section className="px-6 pb-16 sm:px-10 lg:pb-20">
          <div className="mx-auto max-w-5xl rounded-[2rem] bg-slate-950 px-7 py-12 text-center text-white shadow-2xl sm:px-12">
            <MessageCircle className="mx-auto h-10 w-10 text-secondary" />

            <h2 className="mt-5 text-3xl font-black">
              Precisa solicitar atendimento?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-300">
              Entre em contato e informe os dados do pedido para que
              possamos analisar sua solicitação.
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

              <a
                href={emailContato}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white px-6 py-4 text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-100"
              >
                <Mail className="h-5 w-5" />
                Enviar e-mail
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
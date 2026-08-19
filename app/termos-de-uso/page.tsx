import Link from "next/link";

import Header from "@/components/Header";
import Footer from "@/components/storefront/Footer";

import {
  AlertTriangle,
  ArrowLeft,
  BadgeCheck,
  BookOpenCheck,
  CheckCircle2,
  CreditCard,
  Download,
  FileText,
  Gavel,
  Mail,
  MessageCircle,
  PackageCheck,
  Palette,
  Scale,
  ShieldCheck,
  ShoppingCart,
  Truck,
  UserRoundCheck,
} from "lucide-react";

const whatsappUrl =
  "https://wa.me/5533999958593?text=Olá!%20Gostaria%20de%20esclarecer%20uma%20dúvida%20sobre%20os%20Termos%20de%20Uso%20da%20Lembrei%20de%20Você%20Store.";

const emailUrl =
  "mailto:contato@lembreidevocestore.com.br?subject=Dúvida sobre os Termos de Uso";

const responsabilidadesCliente = [
  "Fornecer informações verdadeiras, completas e atualizadas.",
  "Conferir os dados do pedido antes de concluir o pagamento.",
  "Manter em segurança as credenciais de acesso à conta.",
  "Não utilizar o site para fraude, abuso ou atividade ilegal.",
  "Não tentar acessar áreas, sistemas ou dados sem autorização.",
];

const etapasPedido = [
  {
    numero: "01",
    titulo: "Escolha do produto",
    descricao:
      "O cliente deverá conferir a descrição, o preço, o tipo do produto e as opções disponíveis antes da compra.",
    icone: ShoppingCart,
  },
  {
    numero: "02",
    titulo: "Informações do pedido",
    descricao:
      "Os dados pessoais, de contato, personalização e entrega devem ser preenchidos corretamente.",
    icone: UserRoundCheck,
  },
  {
    numero: "03",
    titulo: "Pagamento",
    descricao:
      "O pedido será confirmado conforme a aprovação do pagamento pelo Mercado Pago.",
    icone: CreditCard,
  },
  {
    numero: "04",
    titulo: "Preparação e entrega",
    descricao:
      "Após a confirmação, o produto será preparado ou o arquivo digital será disponibilizado.",
    icone: PackageCheck,
  },
];

export default function TermosDeUsoPage() {
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
              <BookOpenCheck className="h-8 w-8 text-secondary" />
            </div>

            <p className="mt-6 text-sm font-black uppercase tracking-[0.2em] text-secondary">
              Regras de utilização da loja
            </p>

            <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              Termos de Uso
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-white/85 sm:text-lg">
              Estes termos apresentam as condições aplicáveis ao
              acesso, à navegação e às compras realizadas na Lembrei
              de Você Store.
            </p>

            <p className="mt-5 text-sm font-bold text-white/75">
              Última atualização: 17 de agosto de 2026
            </p>
          </div>
        </section>

        {/* IDENTIFICAÇÃO */}
        <section className="px-6 py-16 sm:px-10 lg:py-20">
          <div className="mx-auto max-w-5xl rounded-[2rem] border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/60 sm:p-10">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <BadgeCheck className="h-6 w-6" />
              </div>

              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-secondary">
                  Identificação
                </p>

                <h2 className="mt-2 text-2xl font-black text-slate-950">
                  Responsável pela loja
                </h2>

                <div className="mt-5 space-y-3 text-sm leading-7 text-slate-600">
                  <p>
                    A Lembrei de Você Store é administrada por{" "}
                    <strong className="text-slate-900">
                      Willy Geronimo Donez Aricara
                    </strong>
                    , inscrito no CNPJ sob o número{" "}
                    <strong className="text-slate-900">
                      62.717.733/0001-07
                    </strong>
                    .
                  </p>

                  <p>
                    O contato oficial para dúvidas relacionadas a
                    estes termos é{" "}
                    <strong className="text-primary">
                      contato@lembreidevocestore.com.br
                    </strong>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ACEITAÇÃO */}
        <section className="bg-white px-6 py-16 sm:px-10 lg:py-20">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
            <article className="rounded-3xl border border-slate-200 bg-slate-50 p-7 sm:p-9">
              <FileText className="h-9 w-9 text-primary" />

              <h2 className="mt-5 text-2xl font-black text-slate-950">
                Aceitação destes termos
              </h2>

              <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600">
                <p>
                  Ao navegar no site, criar uma conta ou realizar uma
                  compra, o usuário declara que leu e compreendeu as
                  condições apresentadas nesta página.
                </p>

                <p>
                  Caso não concorde com alguma condição, o usuário
                  deverá interromper a utilização do site e entrar em
                  contato antes de concluir uma compra.
                </p>

                <p>
                  Estes termos não afastam os direitos garantidos pela
                  legislação brasileira, especialmente os direitos do
                  consumidor.
                </p>
              </div>
            </article>

            <article className="rounded-3xl border border-slate-200 bg-slate-50 p-7 sm:p-9">
              <ShieldCheck className="h-9 w-9 text-primary" />

              <h2 className="mt-5 text-2xl font-black text-slate-950">
                Finalidade do site
              </h2>

              <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600">
                <p>
                  O site permite conhecer produtos, consultar
                  informações, realizar pedidos, efetuar pagamentos e
                  acompanhar compras.
                </p>

                <p>
                  A loja comercializa produtos físicos personalizados
                  e materiais digitais, conforme as informações
                  apresentadas em cada página de produto.
                </p>

                <p>
                  Algumas características, preços e disponibilidades
                  podem ser atualizados antes da confirmação de uma
                  nova compra.
                </p>
              </div>
            </article>
          </div>
        </section>

        {/* PROCESSO DA COMPRA */}
        <section className="px-6 py-16 sm:px-10 lg:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-secondary">
                Pedidos e pagamentos
              </p>

              <h2 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">
                Como uma compra é processada
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
                O pedido passa pelas etapas abaixo até sua preparação
                ou disponibilização.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {etapasPedido.map((etapa) => {
                const Icone = etapa.icone;

                return (
                  <article
                    key={etapa.numero}
                    className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7"
                  >
                    <span className="absolute right-5 top-3 text-5xl font-black text-slate-100">
                      {etapa.numero}
                    </span>

                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Icone className="h-5 w-5" />
                    </div>

                    <h3 className="mt-5 text-xl font-black text-slate-950">
                      {etapa.titulo}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {etapa.descricao}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* PREÇOS E PAGAMENTOS */}
        <section className="bg-white px-6 py-16 sm:px-10 lg:py-20">
          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
            <article className="rounded-3xl border border-slate-200 bg-slate-50 p-7 sm:p-9">
              <CreditCard className="h-9 w-9 text-primary" />

              <h2 className="mt-5 text-2xl font-black text-slate-950">
                Preços e pagamento
              </h2>

              <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600">
                <p>
                  Os preços válidos são aqueles exibidos no momento da
                  conclusão do pedido, acrescidos do frete quando
                  aplicável.
                </p>

                <p>
                  Os pagamentos são processados pelo Mercado Pago. A
                  loja não armazena o número completo do cartão nem o
                  código de segurança.
                </p>

                <p>
                  O pedido somente será considerado pago após a
                  confirmação enviada pelo processador de pagamento.
                </p>
              </div>
            </article>

            <article className="rounded-3xl border border-slate-200 bg-slate-50 p-7 sm:p-9">
              <AlertTriangle className="h-9 w-9 text-secondary" />

              <h2 className="mt-5 text-2xl font-black text-slate-950">
                Disponibilidade e cancelamento
              </h2>

              <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600">
                <p>
                  A inclusão de um produto no carrinho não garante sua
                  reserva até que o pedido seja concluído.
                </p>

                <p>
                  Caso ocorra indisponibilidade, erro evidente de
                  cadastro, divergência técnica ou impossibilidade de
                  produção, a loja entrará em contato com o cliente.
                </p>

                <p>
                  Quando necessário, o pedido poderá ser corrigido ou
                  cancelado, com restituição dos valores pagos,
                  respeitando a legislação aplicável.
                </p>
              </div>
            </article>
          </div>
        </section>

        {/* PRODUTOS */}
        <section className="px-6 py-16 sm:px-10 lg:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-secondary">
                Condições dos produtos
              </p>

              <h2 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">
                Produtos físicos, personalizados e digitais
              </h2>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              <article className="rounded-3xl border border-slate-200 bg-white p-7">
                <PackageCheck className="h-9 w-9 text-primary" />

                <h3 className="mt-5 text-xl font-black text-slate-950">
                  Produtos físicos
                </h3>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  As características, dimensões, materiais e demais
                  informações relevantes são apresentadas na página
                  de cada produto. Pequenas variações de cor podem
                  ocorrer conforme a tela utilizada ou o processo de
                  produção.
                </p>
              </article>

              <article className="rounded-3xl border border-slate-200 bg-white p-7">
                <Palette className="h-9 w-9 text-primary" />

                <h3 className="mt-5 text-xl font-black text-slate-950">
                  Produtos personalizados
                </h3>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  O cliente é responsável por revisar nomes, textos,
                  imagens, cores e demais informações enviadas. Após a
                  aprovação da arte ou o início da produção,
                  alterações poderão depender de disponibilidade e
                  gerar novos custos.
                </p>
              </article>

              <article className="rounded-3xl border border-slate-200 bg-white p-7">
                <Download className="h-9 w-9 text-primary" />

                <h3 className="mt-5 text-xl font-black text-slate-950">
                  Produtos digitais
                </h3>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  O acesso será disponibilizado após a confirmação do
                  pagamento. O cliente deverá verificar os formatos,
                  requisitos e condições apresentados na página do
                  produto antes da compra.
                </p>
              </article>
            </div>

            <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-6">
              <p className="text-sm font-bold leading-7 text-amber-900">
                Nenhuma condição desta seção limita os direitos do
                consumidor em casos de vício, defeito, avaria,
                descumprimento da oferta ou outra garantia prevista na
                legislação.
              </p>
            </div>
          </div>
        </section>

        {/* ENTREGA */}
        <section className="bg-white px-6 py-16 sm:px-10 lg:py-20">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-secondary">
                Frete e entrega
              </p>

              <h2 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">
                Preparação e envio dos produtos
              </h2>

              <div className="mt-6 space-y-4 text-sm leading-7 text-slate-600">
                <p>
                  O prazo informado ao cliente poderá compreender o
                  período de produção e o prazo estimado pela
                  transportadora.
                </p>

                <p>
                  O frete pode ser calculado e contratado por meio do
                  Melhor Envio e das transportadoras disponíveis para
                  o endereço informado.
                </p>

                <p>
                  O cliente deverá preencher corretamente o endereço,
                  CEP, número e complemento. Custos decorrentes de
                  dados incorretos poderão ser analisados antes de um
                  novo envio.
                </p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-7 sm:p-9">
              <Truck className="h-10 w-10 text-primary" />

              <h3 className="mt-5 text-2xl font-black text-slate-950">
                Acompanhamento da entrega
              </h3>

              <div className="mt-5 space-y-4">
                {[
                  "O rastreamento será disponibilizado quando fornecido pela transportadora.",
                  "Os prazos de transporte são estimados e podem sofrer alterações.",
                  "A loja prestará auxílio ao cliente em caso de atraso, extravio ou problema na entrega.",
                  "A responsabilidade de cada participante será analisada conforme a legislação e a situação apresentada.",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                    <p className="text-sm leading-6 text-slate-600">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CONTA E RESPONSABILIDADES */}
        <section className="px-6 py-16 sm:px-10 lg:py-20">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
            <article className="rounded-3xl border border-slate-200 bg-white p-7 sm:p-9">
              <UserRoundCheck className="h-9 w-9 text-primary" />

              <h2 className="mt-5 text-2xl font-black text-slate-950">
                Cadastro e conta do cliente
              </h2>

              <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600">
                <p>
                  O cliente poderá criar uma conta para acompanhar
                  pedidos, consultar dados e acessar produtos
                  digitais.
                </p>

                <p>
                  A senha é pessoal e não deve ser compartilhada. O
                  cliente deverá comunicar a loja caso identifique
                  acesso suspeito ou uso não autorizado.
                </p>

                <p>
                  A loja poderá solicitar informações adicionais para
                  confirmar a identidade do usuário e prevenir
                  fraudes.
                </p>
              </div>
            </article>

            <article className="rounded-3xl border border-slate-200 bg-white p-7 sm:p-9">
              <ShieldCheck className="h-9 w-9 text-primary" />

              <h2 className="mt-5 text-2xl font-black text-slate-950">
                Responsabilidades do usuário
              </h2>

              <div className="mt-5 space-y-3">
                {responsabilidadesCliente.map((item) => (
                  <div key={item} className="flex gap-3">
                    <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary" />

                    <p className="text-sm leading-7 text-slate-600">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>

        {/* PROPRIEDADE INTELECTUAL */}
        <section className="bg-white px-6 py-16 sm:px-10 lg:py-20">
          <div className="mx-auto max-w-5xl rounded-[2rem] border border-slate-200 bg-slate-50 p-7 sm:p-10">
            <Gavel className="h-10 w-10 text-primary" />

            <h2 className="mt-5 text-3xl font-black text-slate-950">
              Propriedade intelectual e uso dos conteúdos
            </h2>

            <div className="mt-6 space-y-4 text-sm leading-7 text-slate-600">
              <p>
                Textos, artes, imagens, marcas, identidade visual,
                layouts e demais conteúdos próprios da loja são
                protegidos pela legislação aplicável.
              </p>

              <p>
                A compra de um produto digital não transfere ao
                cliente a titularidade dos direitos autorais. Salvo
                autorização expressa, o material adquirido é destinado
                ao uso pessoal do comprador.
              </p>

              <p>
                Não é permitido copiar, revender, distribuir,
                compartilhar, publicar ou alterar materiais da loja
                para fins comerciais sem autorização.
              </p>

              <p>
                Ao enviar uma imagem, texto, marca ou outro conteúdo
                para personalização, o cliente declara possuir
                autorização para utilizá-lo e assume responsabilidade
                pelo material enviado.
              </p>
            </div>
          </div>
        </section>

        {/* POLÍTICAS RELACIONADAS */}
        <section className="px-6 py-16 sm:px-10 lg:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-secondary">
                Informações complementares
              </p>

              <h2 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">
                Políticas relacionadas
              </h2>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              <article className="rounded-3xl border border-slate-200 bg-white p-7">
                <Scale className="h-9 w-9 text-primary" />

                <h3 className="mt-5 text-xl font-black text-slate-950">
                  Trocas, devoluções e cancelamentos
                </h3>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  As condições para arrependimento, troca, devolução,
                  correção e reembolso estão detalhadas em página
                  própria.
                </p>

                <Link
                  href="/trocas-e-devolucoes"
                  className="mt-6 inline-flex items-center font-black text-primary transition hover:opacity-70"
                >
                  Consultar Trocas e Devoluções
                </Link>
              </article>

              <article className="rounded-3xl border border-slate-200 bg-white p-7">
                <ShieldCheck className="h-9 w-9 text-primary" />

                <h3 className="mt-5 text-xl font-black text-slate-950">
                  Privacidade e proteção de dados
                </h3>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  O tratamento dos dados pessoais utilizados no
                  cadastro, pagamento, atendimento e entrega está
                  explicado na Política de Privacidade.
                </p>

                <Link
                  href="/politica-de-privacidade"
                  className="mt-6 inline-flex items-center font-black text-primary transition hover:opacity-70"
                >
                  Consultar Política de Privacidade
                </Link>
              </article>
            </div>
          </div>
        </section>

        {/* FUNCIONAMENTO E ALTERAÇÕES */}
        <section className="bg-white px-6 py-16 sm:px-10 lg:py-20">
          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
            <article className="rounded-3xl border border-slate-200 bg-slate-50 p-7">
              <AlertTriangle className="h-9 w-9 text-secondary" />

              <h2 className="mt-5 text-2xl font-black text-slate-950">
                Funcionamento do site
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                A loja busca manter o site disponível e seguro, mas
                poderão ocorrer interrupções temporárias para
                manutenção, atualização, falhas de terceiros ou
                situações fora do controle razoável da operação.
              </p>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                Quando possível, serão adotadas medidas para
                restabelecer os serviços e reduzir o impacto ao
                usuário.
              </p>
            </article>

            <article className="rounded-3xl border border-slate-200 bg-slate-50 p-7">
              <FileText className="h-9 w-9 text-primary" />

              <h2 className="mt-5 text-2xl font-black text-slate-950">
                Alterações destes termos
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                Estes termos poderão ser atualizados para refletir
                mudanças no site, nos produtos, nos serviços
                utilizados ou na legislação.
              </p>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                A versão mais recente permanecerá disponível nesta
                página, acompanhada da data de atualização.
              </p>
            </article>
          </div>
        </section>

        {/* LEGISLAÇÃO */}
        <section className="px-6 py-16 sm:px-10 lg:py-20">
          <div className="mx-auto max-w-5xl rounded-[2rem] border border-slate-200 bg-white p-7 sm:p-10">
            <Scale className="h-10 w-10 text-secondary" />

            <h2 className="mt-5 text-3xl font-black text-slate-950">
              Legislação e solução de dúvidas
            </h2>

            <div className="mt-6 space-y-4 text-sm leading-7 text-slate-600">
              <p>
                Estes termos são interpretados conforme a legislação
                brasileira, incluindo as normas de proteção ao
                consumidor e de proteção de dados pessoais.
              </p>

              <p>
                Eventuais divergências deverão, sempre que possível,
                ser resolvidas por atendimento direto e de boa-fé
                entre a loja e o cliente.
              </p>

              <p>
                Quando necessária medida judicial, serão preservadas
                as regras de competência previstas na legislação,
                inclusive o foro do domicílio do consumidor quando
                aplicável.
              </p>
            </div>
          </div>
        </section>

        {/* CONTATO */}
        <section className="px-6 pb-16 sm:px-10 lg:pb-20">
          <div className="mx-auto max-w-5xl rounded-[2rem] bg-slate-950 px-7 py-12 text-center text-white shadow-2xl sm:px-12">
            <BookOpenCheck className="mx-auto h-10 w-10 text-secondary" />

            <h2 className="mt-5 text-3xl font-black">
              Ficou com alguma dúvida?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-300">
              Entre em contato antes de concluir sua compra para
              esclarecer qualquer condição destes Termos de Uso.
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
                href={emailUrl}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-100"
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
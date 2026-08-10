type ContaCriadaProps = {
  nome: string;
  email: string;
  pedidoId?: string;
  pedidoEncontrado: boolean;
  sessaoCriada: boolean;
  onAcessarConta: () => void;
  onIrParaLogin: () => void;
};

export default function ContaCriada({
  nome,
  email,
  pedidoId,
  pedidoEncontrado,
  sessaoCriada,
  onAcessarConta,
  onIrParaLogin,
}: ContaCriadaProps) {
  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:py-12">
      <section className="mx-auto max-w-lg overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
        <div
          className="px-6 py-8 text-center text-white sm:px-9"
          style={{
            background:
              "linear-gradient(135deg, var(--success), color-mix(in srgb, var(--success) 75%, black))",
          }}
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-3xl backdrop-blur">
            🎉
          </div>

          <h1 className="mt-4 text-3xl font-extrabold">
            Bem-vindo, {nome.split(" ")[0] || "cliente"}!
          </h1>

          <p className="mt-2 text-white/80">
            Sua conta foi criada com sucesso.
          </p>
        </div>

        <div className="p-7 sm:p-9">
          <img
            src="/logo.png"
            alt="Lembrei de Você Store"
            className="mx-auto h-20 w-auto"
          />

          <div className="mt-7 space-y-3 rounded-2xl border border-success/30 bg-[color-mix(in_srgb,var(--success)_8%,white)] p-5 text-sm text-success">
            <p className="font-bold">
              ✅ Cadastro realizado
            </p>

            <p className="font-bold">
              ✅ Cliente vinculado à sua conta
            </p>

            {pedidoEncontrado && (
              <p className="font-bold">
                ✅ Pedido {pedidoId ? `#${pedidoId} ` : ""}vinculado
              </p>
            )}
          </div>

          {sessaoCriada ? (
            <div className="mt-6 rounded-2xl border border-success/30 bg-card p-5 text-center">
              <p className="font-bold text-success">
                Sua conta já está ativa.
              </p>

              <p className="mt-2 text-sm text-text-light">
                Você já pode acompanhar pedidos, dados e downloads.
              </p>

              <button
                type="button"
                onClick={onAcessarConta}
                className="mt-5 w-full rounded-2xl bg-success px-5 py-4 text-lg font-bold text-white transition hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-[color-mix(in_srgb,var(--success)_20%,transparent)]"
              >
                Acessar Minha Conta →
              </button>
            </div>
          ) : (
            <>
              <div className="mt-6 rounded-2xl border border-success/30 bg-[color-mix(in_srgb,var(--success)_8%,white)] p-5 text-center text-success">
                <p className="font-bold">
                  📧 Agora confirme seu e-mail
                </p>

                <p className="mt-2 text-sm text-text-light">
                  Enviamos uma mensagem de confirmação para:
                </p>

                <p className="mt-2 break-all font-bold text-text">
                  {email}
                </p>

                <p className="mt-3 text-sm text-text-light">
                  Clique no link recebido para ativar sua conta.
                </p>
              </div>

              <button
                type="button"
                onClick={onIrParaLogin}
                className="mt-6 w-full rounded-2xl bg-success px-5 py-4 text-lg font-bold text-white transition hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-[color-mix(in_srgb,var(--success)_20%,transparent)]"
              >
                Ir para o Login →
              </button>

              <p className="mt-4 text-center text-sm text-text-light">
                Não encontrou a mensagem? Verifique também a pasta de spam.
              </p>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
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
    <main className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-green-50 px-4 py-10">
      <section className="mx-auto max-w-lg overflow-hidden rounded-3xl border border-white bg-white shadow-2xl shadow-pink-100/70">
        <div className="bg-gradient-to-r from-green-600 to-emerald-500 px-8 py-8 text-center text-white">
          <div className="text-6xl" aria-hidden="true">
            🎉
          </div>

          <h1 className="mt-4 text-3xl font-extrabold">
            Bem-vindo, {nome.split(" ")[0] || "cliente"}!
          </h1>

          <p className="mt-2 text-green-50">
            Sua conta foi criada com sucesso.
          </p>
        </div>

        <div className="p-7 sm:p-9">
          <img
            src="/logo.png"
            alt="Lembrei de Você Store"
            className="mx-auto h-20 w-auto"
          />

          <div className="mt-7 space-y-3 rounded-2xl bg-green-50 p-5 text-sm text-green-900">
            <p className="font-bold">✅ Cadastro realizado</p>
            <p className="font-bold">✅ Cliente vinculado à sua conta</p>

            {pedidoEncontrado && (
              <p className="font-bold">
                ✅ Pedido {pedidoId ? `#${pedidoId} ` : ""}vinculado
              </p>
            )}
          </div>

          {sessaoCriada ? (
            <div className="mt-6 rounded-2xl border border-green-200 bg-white p-5 text-center">
              <p className="font-bold text-green-700">Sua conta já está ativa.</p>

              <p className="mt-2 text-sm text-gray-600">
                Você já pode acompanhar pedidos, dados e downloads.
              </p>

              <button
                type="button"
                onClick={onAcessarConta}
                className="mt-5 w-full rounded-2xl bg-green-600 px-5 py-4 text-lg font-bold text-white transition hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-200"
              >
                Acessar Minha Conta →
              </button>
            </div>
          ) : (
            <>
              <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-5 text-center text-green-900">
                <p className="font-bold">📧 Agora confirme seu e-mail</p>

                <p className="mt-2 text-sm">
                  Enviamos uma mensagem de confirmação para:
                </p>

                <p className="mt-2 break-all font-bold">{email}</p>

                <p className="mt-3 text-sm">
                  Clique no link recebido para ativar sua conta.
                </p>
              </div>

              <button
                type="button"
                onClick={onIrParaLogin}
                className="mt-6 w-full rounded-2xl bg-green-600 px-5 py-4 text-lg font-bold text-white transition hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-200"
              >
                Ir para o Login →
              </button>

              <p className="mt-4 text-center text-sm text-gray-500">
                Não encontrou a mensagem? Verifique também a pasta de spam.
              </p>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

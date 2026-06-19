export default function Pendente() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-yellow-50">

      <div className="bg-white p-10 rounded-3xl shadow-xl text-center">

        <h1 className="text-5xl font-bold text-yellow-500">
          Pagamento Pendente ⏳
        </h1>

        <p className="text-gray-600 mt-4 text-xl">
          Estamos aguardando a confirmação do pagamento.
        </p>

        <a
          href="/"
          className="inline-block mt-8 bg-yellow-500 text-white px-8 py-4 rounded-2xl font-bold"
        >
          Voltar para Loja
        </a>

      </div>

    </main>
  );
}
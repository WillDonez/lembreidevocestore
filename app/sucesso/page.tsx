export default function Sucesso() {

  return (
    <main className="min-h-screen flex items-center justify-center bg-green-50">

      <div className="bg-white p-12 rounded-3xl shadow-xl text-center max-w-xl">

        <h1 className="text-5xl font-bold text-green-600">
          Pagamento Aprovado 💚
        </h1>

        <p className="text-gray-600 text-xl mt-6">
          Seu pedido foi recebido com sucesso.
        </p>

        <p className="text-gray-500 mt-3">
          Em breve entraremos em contato.
        </p>

        <a
          href="/"
          className="inline-block mt-8 bg-green-500 text-white px-8 py-4 rounded-2xl font-bold"
        >
          Voltar para Loja
        </a>

      </div>

    </main>
  );
}
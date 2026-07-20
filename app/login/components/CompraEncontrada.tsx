type CompraEncontradaProps = {
  pedidoId?: string;
};

export default function CompraEncontrada({
  pedidoId,
}: CompraEncontradaProps) {
  return (
    <div className="mt-7 rounded-2xl border border-green-200 bg-green-50 p-5 text-left">
      <div className="flex items-start gap-3">
        <span className="text-2xl" aria-hidden="true">
          📦
        </span>

        <div>
          <p className="font-bold text-green-800">Compra localizada!</p>

          <p className="mt-1 text-sm leading-relaxed text-gray-600">
            Encontramos uma compra realizada com este e-mail. Ao criar ou
            acessar sua conta, você poderá acompanhá-la em Minha Conta.
          </p>

          {pedidoId && (
            <p className="mt-2 text-sm font-bold text-gray-700">
              Pedido #{pedidoId}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

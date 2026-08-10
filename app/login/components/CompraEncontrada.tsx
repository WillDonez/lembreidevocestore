type CompraEncontradaProps = {
  pedidoId?: string;
};

export default function CompraEncontrada({
  pedidoId,
}: CompraEncontradaProps) {
  return (
    <div className="mt-6 rounded-2xl border border-success/30 bg-[color-mix(in_srgb,var(--success)_8%,white)] p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-success text-white">
          📦
        </div>

        <div>
          <p className="font-bold text-success">
            Compra localizada!
          </p>

          <p className="mt-1 text-sm leading-relaxed text-text-light">
            Encontramos uma compra realizada com este e-mail. Ao criar ou
            acessar sua conta, você poderá acompanhá-la em Minha Conta.
          </p>

          {pedidoId && (
            <p className="mt-2 text-sm font-bold text-text">
              Pedido #{pedidoId}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
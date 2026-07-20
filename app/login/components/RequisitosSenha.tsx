type RequisitosSenhaProps = {
  minimo: boolean;
  maiuscula: boolean;
  minuscula: boolean;
  numero: boolean;
  especial: boolean;
};

function Requisito({
  concluido,
  texto,
}: {
  concluido: boolean;
  texto: string;
}) {
  return (
    <p className={concluido ? "font-bold text-green-600" : "text-gray-500"}>
      {concluido ? "✅" : "○"} {texto}
    </p>
  );
}

export default function RequisitosSenha({
  minimo,
  maiuscula,
  minuscula,
  numero,
  especial,
}: RequisitosSenhaProps) {
  return (
    <div className="mt-3 grid gap-1 rounded-xl bg-gray-50 p-4 text-sm sm:grid-cols-2">
      <Requisito concluido={minimo} texto="7 ou mais caracteres" />
      <Requisito concluido={maiuscula} texto="Letra maiúscula" />
      <Requisito concluido={minuscula} texto="Letra minúscula" />
      <Requisito concluido={numero} texto="Um número" />
      <Requisito concluido={especial} texto="Caractere especial" />
    </div>
  );
}

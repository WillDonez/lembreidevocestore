"use client";

type CheckoutClienteProps = {
  nomeCliente: string;
  setNomeCliente: (value: string) => void;

  whatsappCliente: string;
  setWhatsappCliente: (value: string) => void;

  emailCliente: string;
  setEmailCliente: (value: string) => void;

  cpfCnpj: string;
  setCpfCnpj: (value: string) => void;

  cep: string;
  setCep: (value: string) => void;

  endereco: string;
  setEndereco: (value: string) => void;

  numero: string;
  setNumero: (value: string) => void;

  complemento: string;
  setComplemento: (value: string) => void;

  bairro: string;
  setBairro: (value: string) => void;

  cidade: string;
  setCidade: (value: string) => void;

  estado: string;
  setEstado: (value: string) => void;
};

export default function CheckoutCliente({
  nomeCliente,
  setNomeCliente,

  whatsappCliente,
  setWhatsappCliente,

  emailCliente,
  setEmailCliente,

  cpfCnpj,
  setCpfCnpj,

  cep,
  setCep,

  endereco,
  setEndereco,

  numero,
  setNumero,

  complemento,
  setComplemento,

  bairro,
  setBairro,

  cidade,
  setCidade,

  estado,
  setEstado,
}: CheckoutClienteProps) {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 space-y-6">

      <h2 className="text-3xl font-bold text-pink-500">
        👤 Dados do Cliente
      </h2>

      <input
        type="text"
        placeholder="Nome Completo"
        value={nomeCliente}
        onChange={(e) => setNomeCliente(e.target.value)}
        className="w-full border p-4 rounded-xl"
      />

      <input
        type="email"
        placeholder="E-mail"
        value={emailCliente}
        onChange={(e) => setEmailCliente(e.target.value)}
        className="w-full border p-4 rounded-xl"
      />

      <input
        type="text"
        placeholder="WhatsApp"
        value={whatsappCliente}
        onChange={(e) => setWhatsappCliente(e.target.value)}
        className="w-full border p-4 rounded-xl"
      />

      <input
        type="text"
        placeholder="CPF ou CNPJ"
        value={cpfCnpj}
        onChange={(e) => setCpfCnpj(e.target.value)}
        className="w-full border p-4 rounded-xl"
      />

    </div>
  );
}
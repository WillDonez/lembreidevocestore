"use client";

import { useState } from "react";
import { buscarClientePorEmail } from "@/lib/clientes";

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

function formatarWhatsApp(valor: string) {
  const numeros = valor.replace(/\D/g, "").slice(0, 11);

  if (numeros.length <= 2) {
    return numeros;
  }

  if (numeros.length <= 7) {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
  }

  return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
}

function formatarCpfCnpj(valor: string) {
  const numeros = valor.replace(/\D/g, "").slice(0, 14);

  if (numeros.length <= 11) {
    return numeros
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }

  return numeros
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}

async function buscarCep(
  cep: string,
  setEndereco: (v: string) => void,
  setBairro: (v: string) => void,
  setCidade: (v: string) => void,
  setEstado: (v: string) => void,
  setStatusCep: (v: string) => void
) {
  const cepLimpo = cep.replace(/\D/g, "");

  if (cepLimpo.length !== 8) {
  setStatusCep("");
  return;
}

  try {
    const response = await fetch(
      `https://viacep.com.br/ws/${cepLimpo}/json/`
    );

    const data = await response.json();

    if (data.erro) {
  setEndereco("");
  setBairro("");
  setCidade("");
  setEstado("");

  setStatusCep("erro");

  alert("CEP não encontrado.");
  return;
}

    setEndereco(data.logradouro || "");
    setBairro(data.bairro || "");
    setCidade(data.localidade || "");
    setEstado(data.uf || "");
    setStatusCep("encontrado");

  } catch (error) {
  console.log(error);

  setEndereco("");
  setBairro("");
  setCidade("");
  setEstado("");

  setStatusCep("erro");

  alert("Erro ao consultar CEP.");
}
}

async function buscarCliente(email: string) {
  if (!email) return;

  console.log("Procurando cliente:", email);
}

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

  const [statusCep, setStatusCep] = useState("");

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
  onBlur={async () => {
    const cliente = await buscarClientePorEmail(emailCliente);

    if (!cliente) return;

    setNomeCliente(cliente.nome || "");
    setWhatsappCliente(cliente.whatsapp || "");
    setCpfCnpj(cliente.cpf_cnpj || "");
    setCep(cliente.cep || "");
    setEndereco(cliente.endereco || "");
    setNumero(cliente.numero || "");
    setComplemento(cliente.complemento || "");
    setBairro(cliente.bairro || "");
    setCidade(cliente.cidade || "");
    setEstado(cliente.estado || "");
  }}
  className="w-full border p-4 rounded-xl"
/>

      <input
  type="text"
  placeholder="WhatsApp"
  value={whatsappCliente}
  onChange={(e) => setWhatsappCliente(formatarWhatsApp(e.target.value))}
  className="w-full border p-4 rounded-xl"
/>

      <input
  type="text"
  placeholder="CPF ou CNPJ"
  value={cpfCnpj}
  onChange={(e) => setCpfCnpj(formatarCpfCnpj(e.target.value))}
  className="w-full border p-4 rounded-xl"
/>

<div className="border-t pt-6 mt-6">
  <h3 className="text-2xl font-bold text-pink-500 mb-4">
    📍 Endereço
  </h3>

  <input
  type="text"
  placeholder="CEP"
  value={cep}
  onChange={(e) => {
    const valor = e.target.value
      .replace(/\D/g, "")
      .replace(/^(\d{5})(\d)/, "$1-$2")
      .slice(0, 9);

    setCep(valor);

    buscarCep(
  valor,
  setEndereco,
  setBairro,
  setCidade,
  setEstado,
  setStatusCep
);

  }}
  className="w-full border p-4 rounded-xl mb-4"
/>

{statusCep === "encontrado" && (
  <p className="text-green-600 font-bold mb-4">
    ✅ Endereço localizado automaticamente.
  </p>
)}

{statusCep === "erro" && (
  <p className="text-red-600 font-bold mb-4">
    ⚠️ CEP não encontrado. Verifique e tente novamente.
  </p>
)}

  <input
    type="text"
    placeholder="Rua"
    value={endereco}
    onChange={(e) => setEndereco(e.target.value)}
    className="w-full border p-4 rounded-xl mb-4"
  />

  <input
    type="text"
    placeholder="Número"
    value={numero}
    onChange={(e) => setNumero(e.target.value)}
    className="w-full border p-4 rounded-xl mb-4"
  />

  <input
    type="text"
    placeholder="Complemento"
    value={complemento}
    onChange={(e) => setComplemento(e.target.value)}
    className="w-full border p-4 rounded-xl mb-4"
  />

  <input
    type="text"
    placeholder="Bairro"
    value={bairro}
    onChange={(e) => setBairro(e.target.value)}
    className="w-full border p-4 rounded-xl mb-4"
  />

  <input
    type="text"
    placeholder="Cidade"
    value={cidade}
    onChange={(e) => setCidade(e.target.value)}
    className="w-full border p-4 rounded-xl mb-4"
  />

  <input
    type="text"
    placeholder="Estado"
    value={estado}
    onChange={(e) => setEstado(e.target.value)}
    className="w-full border p-4 rounded-xl"
  />
</div>

    </div>
  );
}
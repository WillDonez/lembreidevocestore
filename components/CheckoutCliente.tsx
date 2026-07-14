"use client";

import { useState } from "react";

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
  setEndereco: (value: string) => void,
  setBairro: (value: string) => void,
  setCidade: (value: string) => void,
  setEstado: (value: string) => void,
  setStatusCep: (value: string) => void
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
      return;
    }

    setEndereco(data.logradouro || "");
    setBairro(data.bairro || "");
    setCidade(data.localidade || "");
    setEstado(data.uf || "");
    setStatusCep("encontrado");
  } catch (error) {
    console.log("Erro ao consultar CEP:", error);

    setEndereco("");
    setBairro("");
    setCidade("");
    setEstado("");
    setStatusCep("erro");
  }
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
  const [clienteEncontrado, setClienteEncontrado] = useState(false);

  async function localizarCliente(cpfCnpjDigitado: string) {
    const emailDigitado = emailCliente.trim().toLowerCase();

    if (!emailDigitado || !cpfCnpjDigitado) {
      setClienteEncontrado(false);
      return;
    }

    try {
      const response = await fetch("/api/clientes/buscar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailDigitado,
          cpfCnpj: cpfCnpjDigitado,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log("Erro ao buscar cliente:", data);
        setClienteEncontrado(false);
        return;
      }

      const cliente = data.cliente;

      if (!cliente) {
        setClienteEncontrado(false);
        return;
      }

      setClienteEncontrado(true);

      setNomeCliente(cliente.nome || "");
      setEmailCliente(cliente.email || emailDigitado);
      setWhatsappCliente(cliente.whatsapp || "");
      setCpfCnpj(cliente.cpf_cnpj || cpfCnpjDigitado);
      setCep(cliente.cep || "");
      setEndereco(cliente.endereco || "");
      setNumero(cliente.numero || "");
      setComplemento(cliente.complemento || "");
      setBairro(cliente.bairro || "");
      setCidade(cliente.cidade || "");
      setEstado(cliente.estado || "");
    } catch (error) {
      console.log("Erro ao consultar cadastro:", error);
      setClienteEncontrado(false);
    }
  }

  return (
    <div className="space-y-4 rounded-3xl bg-white p-4">
      <h2 className="text-2xl font-bold text-pink-500">
        👤 Dados do Cliente
      </h2>

      {/* Nome e e-mail */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <input
          type="text"
          placeholder="Nome Completo"
          value={nomeCliente}
          onChange={(e) => setNomeCliente(e.target.value)}
          className="w-full rounded-xl border p-3"
        />

        <input
          type="email"
          placeholder="E-mail"
          value={emailCliente}
          onChange={(e) =>
            setEmailCliente(e.target.value.trimStart().toLowerCase())
          }
          className="w-full rounded-xl border p-3"
        />
      </div>

      {/* CPF/CNPJ e WhatsApp */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <input
          type="text"
          placeholder="CPF ou CNPJ"
          value={cpfCnpj}
          onChange={(e) =>
            setCpfCnpj(formatarCpfCnpj(e.target.value))
          }
          onBlur={(e) =>
            localizarCliente(e.currentTarget.value.trim())
          }
          className="w-full rounded-xl border p-3"
        />

        <input
          type="text"
          placeholder="WhatsApp"
          value={whatsappCliente}
          onChange={(e) =>
            setWhatsappCliente(formatarWhatsApp(e.target.value))
          }
          className="w-full rounded-xl border p-3"
        />
      </div>

      {clienteEncontrado && (
        <p className="font-bold text-green-600">
          ✅ Cliente localizado automaticamente.
        </p>
      )}

      {/* Endereço */}
      <div className="border-t pt-4">
        <h3 className="mb-3 text-xl font-bold text-pink-500">
          📍 Endereço
        </h3>

        {/* CEP e número */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_140px]">
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
            className="w-full rounded-xl border p-3"
          />

          <input
            type="text"
            placeholder="Número"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            className="w-full rounded-xl border p-3"
          />
        </div>

        {statusCep === "encontrado" && (
          <p className="mt-2 font-bold text-green-600">
            ✅ Endereço localizado automaticamente.
          </p>
        )}

        {statusCep === "erro" && (
          <p className="mt-2 font-bold text-red-600">
            ⚠️ CEP não encontrado. Verifique e tente novamente.
          </p>
        )}

        {/* Rua e complemento */}
        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-[2fr_1fr]">
          <input
            type="text"
            placeholder="Rua"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            className="w-full rounded-xl border p-3"
          />

          <input
            type="text"
            placeholder="Complemento"
            value={complemento}
            onChange={(e) => setComplemento(e.target.value)}
            className="w-full rounded-xl border p-3"
          />
        </div>

        {/* Bairro, cidade e UF */}
        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-[1fr_1.5fr_90px]">
          <input
            type="text"
            placeholder="Bairro"
            value={bairro}
            onChange={(e) => setBairro(e.target.value)}
            className="w-full rounded-xl border p-3"
          />

          <input
            type="text"
            placeholder="Cidade"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            className="w-full rounded-xl border p-3"
          />

          <input
            type="text"
            placeholder="UF"
            value={estado}
            onChange={(e) =>
              setEstado(
                e.target.value
                  .replace(/[^a-zA-Z]/g, "")
                  .toUpperCase()
                  .slice(0, 2)
              )
            }
            maxLength={2}
            className="w-full rounded-xl border p-3 uppercase"
          />
        </div>
      </div>
    </div>
  );
}
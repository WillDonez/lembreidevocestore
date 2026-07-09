"use client";

import { useState } from "react";
import CheckoutCliente from "@/components/CheckoutCliente";

export default function CheckoutPage() {
  const [nomeCliente, setNomeCliente] = useState("");
  const [emailCliente, setEmailCliente] = useState("");
  const [whatsappCliente, setWhatsappCliente] = useState("");
  const [cpfCnpj, setCpfCnpj] = useState("");

  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");

  return (
    <main className="min-h-screen bg-pink-50 p-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-pink-500 mb-6">
            Produtos do Pedido
          </h2>

          <div className="border-2 border-dashed rounded-2xl p-10 text-center text-gray-500">
            Aqui aparecerão os produtos.
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <CheckoutCliente
            nomeCliente={nomeCliente}
            setNomeCliente={setNomeCliente}
            emailCliente={emailCliente}
            setEmailCliente={setEmailCliente}
            whatsappCliente={whatsappCliente}
            setWhatsappCliente={setWhatsappCliente}
            cpfCnpj={cpfCnpj}
            setCpfCnpj={setCpfCnpj}
            cep={cep}
            setCep={setCep}
            endereco={endereco}
            setEndereco={setEndereco}
            numero={numero}
            setNumero={setNumero}
            complemento={complemento}
            setComplemento={setComplemento}
            bairro={bairro}
            setBairro={setBairro}
            cidade={cidade}
            setCidade={setCidade}
            estado={estado}
            setEstado={setEstado}
          />
        </div>
      </div>
    </main>
  );
}
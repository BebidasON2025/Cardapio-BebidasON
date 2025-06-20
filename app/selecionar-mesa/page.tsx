"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function SelecionarMesa() {
  const [mesaSelecionada, setMesaSelecionada] = useState("")
  const router = useRouter()

  const handleSelecionarMesa = () => {
    if (mesaSelecionada) {
      router.push(`/?mesa=${mesaSelecionada}`)
    } else {
      alert("Por favor, selecione uma mesa")
    }
  }

  const mesas = Array.from({ length: 20 }, (_, i) => i + 1)

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-32 h-32 mx-auto rounded-full overflow-hidden shadow-xl border-4 border-amber-200 bg-white mb-4">
            <Image
              src="/logo-bebidas-on.png"
              alt="Bebidas ON Logo"
              width={128}
              height={128}
              className="w-full h-full object-cover rounded-full"
              priority
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Bebidas ON</h1>
          <p className="text-gray-600">Selecione sua mesa</p>
        </div>

        {/* Seleção de Mesa */}
        <div className="space-y-6">
          <div>
            <label htmlFor="mesa" className="block text-lg font-semibold text-gray-700 mb-3">
              Número da Mesa:
            </label>
            <select
              id="mesa"
              value={mesaSelecionada}
              onChange={(e) => setMesaSelecionada(e.target.value)}
              className="w-full p-4 border-2 border-amber-300 rounded-xl text-lg font-semibold focus:border-amber-500 focus:outline-none"
            >
              <option value="">Escolha sua mesa...</option>
              {mesas.map((mesa) => (
                <option key={mesa} value={mesa}>
                  Mesa {mesa}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSelecionarMesa}
            disabled={!mesaSelecionada}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 ${
              mesaSelecionada
                ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {mesaSelecionada ? `Acessar Mesa ${mesaSelecionada}` : "Selecione uma mesa"}
          </button>
        </div>

        {/* Informações */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">🍻 Cardápio digital • 🚚 Delivery rápido • 💳 Pagamento fácil</p>
        </div>
      </div>
    </div>
  )
}

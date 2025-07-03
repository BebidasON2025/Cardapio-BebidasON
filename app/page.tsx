"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import {
  ShoppingCart,
  Plus,
  Minus,
  Search,
  CreditCard,
  Banknote,
  Smartphone,
  Share,
  Package,
  Beer,
  Coffee,
  Zap,
  Wine,
  Droplets,
  Sparkles,
  CupSoda,
  Save,
  Edit,
  Download,
  Instagram,
  MapPin,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import { createClient } from "@supabase/supabase-js"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ToastProvider, useToast } from "@/components/toast"

// 🗄️ CONFIGURAÇÃO DO SUPABASE
const supabaseUrl = "https://ekavxyxdmorsjgviwgdk.supabase.co"
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrYXZ4eXhkbW9yc2pndml3Z2RrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3MTkwMjUsImV4cCI6MjA2NDI5NTAyNX0.RGQLwr-0zC0PGqX5OKVa5e-RERkc4dgy0SoCw6z5bN0"

const supabase = createClient(supabaseUrl, supabaseKey)

// 📱 TELEFONE
const CHAVE_PIX = "1799631-1727"
const NOME_PIX = "Nattieli De Carvalho"
const BANCO_PIX = "Banco Santander (Brasil) S.A."
const TELEFONE_WHATSAPP = "17996311727"
const TELEFONE_DISPLAY = "(17) 99631-1727"

interface Categoria {
  id: number
  nome: string
  icone: string
  cor: string
  ativo: boolean
}

interface Bebida {
  id: number
  nome: string
  descricao: string
  preco: number
  categoria_id: number
  categoria?: Categoria
  imagem: string
  estoque: number
  ativo: boolean
}

interface ItemCarrinho {
  bebida: Bebida
  quantidade: number
}

interface Pedido {
  id: string
  data: string
  itens: ItemCarrinho[]
  total: number
  formaPagamento: "cartao" | "dinheiro" | "pix"
  valorPago?: number
  troco?: number
  cliente: string
  tipoEntrega: "entrega" | "retirada"
  enderecoEntrega?: string
  localizacao?: string
  status: "enviado" | "confirmado" | "entregue"
}

const TAXA_ENTREGA = 1.0
const PEDIDO_MINIMO_ENTREGA = 20.0

// 🎨 CORES PARA CATEGORIAS
const CORES_CATEGORIAS = [
  { nome: "Âmbar", valor: "amber", classe: "bg-amber-500", classeTexto: "text-amber-700", classeBg: "bg-amber-50" },
  { nome: "Azul", valor: "blue", classe: "bg-blue-500", classeTexto: "text-blue-700", classeBg: "bg-blue-50" },
  { nome: "Verde", valor: "green", classe: "bg-green-500", classeTexto: "text-green-700", classeBg: "bg-green-50" },
  { nome: "Roxo", valor: "purple", classe: "bg-purple-500", classeTexto: "text-purple-700", classeBg: "bg-purple-50" },
  { nome: "Rosa", valor: "pink", classe: "bg-pink-500", classeTexto: "text-pink-700", classeBg: "bg-pink-50" },
  { nome: "Vermelho", valor: "red", classe: "bg-red-500", classeTexto: "text-red-700", classeBg: "bg-red-50" },
]

// 🎯 ÍCONES PARA CATEGORIAS
const ICONES_CATEGORIAS = [
  { nome: "Cerveja", valor: "beer", icone: Beer },
  { nome: "Refrigerante", valor: "cup-soda", icone: CupSoda },
  { nome: "Café", valor: "coffee", icone: Coffee },
  { nome: "Energético", valor: "zap", icone: Zap },
  { nome: "Vinho", valor: "wine", icone: Wine },
  { nome: "Água", valor: "droplets", icone: Droplets },
  { nome: "Especial", valor: "sparkles", icone: Sparkles },
  { nome: "Geral", valor: "package", icone: Package },
]

// 🏷️ COMPONENTE RODAPÉ
const Rodape = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-6 mt-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <p className="text-lg font-bold text-yellow-400 mb-1">© 2022 Bebidas ON</p>
            <p className="text-sm text-gray-300">Todos os direitos reservados</p>
          </div>
          <div className="flex items-center space-x-4 text-center md:text-right">
            <div className="text-xs text-gray-400">
              <p>Desenvolvido por</p>
              <p className="font-semibold text-gray-300">GV Software</p>
            </div>
            <a
              href="https://www.instagram.com/gv_software/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <Instagram className="w-4 h-4" />
              <span className="text-xs font-medium">@gv_software</span>
            </a>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-4 pt-4 text-center">
          <p className="text-xs text-gray-500">🍻 Delivery de bebidas • 🚚 Entrega rápida • 💳 Pagamento fácil</p>
        </div>
      </div>
    </footer>
  )
}

export default function BebidasOnApp() {
  return (
    <ToastProvider>
      <BebidasOnAppContent />
    </ToastProvider>
  )
}

function BebidasOnAppContent() {
  const { addToast } = useToast()
  const [bebidas, setBebidas] = useState<Bebida[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [telaAtual, setTelaAtual] = useState<
    "inicio" | "cardapio" | "carrinho" | "pagamento" | "comprovante" | "admin"
  >("inicio")
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([])
  const [categoriaFiltro, setCategoriaFiltro] = useState<number | "todas">("todas")
  const [busca, setBusca] = useState("")
  const [pedidoAtual, setPedidoAtual] = useState<Pedido | null>(null)
  const [formaPagamento, setFormaPagamento] = useState<"cartao" | "dinheiro" | "pix">("pix")
  const [valorPago, setValorPago] = useState("")
  const [nomeCliente, setNomeCliente] = useState("")
  const [capturandoImagem, setCapturandoImagem] = useState(false)
  const [carregando, setCarregando] = useState(false)
  const [abaAdmin, setAbaAdmin] = useState<"produtos" | "categorias" | "pedidos">("categorias")
  const [tipoEntrega, setTipoEntrega] = useState<"entrega" | "retirada">("retirada")
  const [enderecoEntrega, setEnderecoEntrega] = useState("")
  const [localizacaoAtual, setLocalizacaoAtual] = useState("")
  const [quantidadesSelecionadas, setQuantidadesSelecionadas] = useState<{ [key: number]: number }>({})
  const [modoTeste, setModoTeste] = useState(false) // 🧪 MODO TESTE DESATIVADO POR PADRÃO
  const [buscaProdutos, setBuscaProdutos] = useState("")

  const [novoItem, setNovoItem] = useState({
    nome: "",
    descricao: "",
    preco: "",
    categoria_id: "",
    estoque: "",
    imagem: "",
  })

  const [novaCategoria, setNovaCategoria] = useState({
    nome: "",
    icone: "package",
    cor: "amber",
  })

  const [editandoItem, setEditandoItem] = useState<Bebida | null>(null)
  const [editandoCategoria, setEditandoCategoria] = useState<Categoria | null>(null)

  const comprovanteRef = useRef<HTMLDivElement>(null)

  // 💾 CARREGAR DADOS
  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    try {
      if (modoTeste) {
        // 🧪 MODO TESTE - Dados fictícios
        carregarDadosTeste()
      } else {
        // 🔴 MODO PRODUÇÃO - Dados reais do Supabase
        await Promise.all([carregarCategorias(), carregarBebidas()])
      }
    } catch (error) {
      console.error("❌ Erro ao carregar dados, ativando modo teste:", error)
      // Se houver erro, ativar modo teste automaticamente
      setModoTeste(true)
      carregarDadosTeste()
      addToast({
        type: "warning",
        title: "⚠️ Erro de conexão detectado.",
        description: "Modo teste ativado automaticamente.",
      })
    }
  }

  // 🧪 DADOS DE TESTE
  const carregarDadosTeste = () => {
    const categoriasTeste: Categoria[] = [
      { id: 1, nome: "Cerveja", icone: "beer", cor: "amber", ativo: true },
      { id: 2, nome: "Refrigerante", icone: "cup-soda", cor: "blue", ativo: true },
      { id: 3, nome: "Água", icone: "droplets", cor: "blue", ativo: true },
      { id: 4, nome: "Energético", icone: "zap", cor: "green", ativo: true },
      { id: 5, nome: "Vinho", icone: "wine", cor: "purple", ativo: true },
    ]

    const bebidasTeste: Bebida[] = [
      {
        id: 1,
        nome: "Cerveja Skol Lata 350ml",
        descricao: "Cerveja gelada tradicional brasileira",
        preco: 4.5,
        categoria_id: 1,
        categoria: categoriasTeste[0],
        imagem: "/placeholder.svg?height=200&width=300&text=Cerveja+Skol",
        estoque: 25,
        ativo: true,
      },
      {
        id: 2,
        nome: "Coca-Cola 2L",
        descricao: "Refrigerante de cola tradicional",
        preco: 8.9,
        categoria_id: 2,
        categoria: categoriasTeste[1],
        imagem: "/placeholder.svg?height=200&width=300&text=Coca+Cola",
        estoque: 15,
        ativo: true,
      },
      {
        id: 3,
        nome: "Água Crystal 500ml",
        descricao: "Água mineral natural",
        preco: 2.5,
        categoria_id: 3,
        categoria: categoriasTeste[2],
        imagem: "/placeholder.svg?height=200&width=300&text=Água+Crystal",
        estoque: 30,
        ativo: true,
      },
      {
        id: 4,
        nome: "Red Bull 250ml",
        descricao: "Energético que te dá asas",
        preco: 12.9,
        categoria_id: 4,
        categoria: categoriasTeste[3],
        imagem: "/placeholder.svg?height=200&width=300&text=Red+Bull",
        estoque: 8,
        ativo: true,
      },
      {
        id: 5,
        nome: "Heineken Long Neck",
        descricao: "Cerveja premium importada",
        preco: 7.5,
        categoria_id: 1,
        categoria: categoriasTeste[0],
        imagem: "/placeholder.svg?height=200&width=300&text=Heineken",
        estoque: 12,
        ativo: true,
      },
      {
        id: 6,
        nome: "Vinho Tinto Seco",
        descricao: "Vinho nacional de qualidade",
        preco: 25.9,
        categoria_id: 5,
        categoria: categoriasTeste[4],
        imagem: "/placeholder.svg?height=200&width=300&text=Vinho+Tinto",
        estoque: 5,
        ativo: true,
      },
    ]

    setCategorias(categoriasTeste)
    setBebidas(bebidasTeste)
    console.log("🧪 Dados de teste carregados")
  }

  // 🆔 GERAR ID ÚNICO SEQUENCIAL - VERSÃO CORRIGIDA PARA EVITAR DUPLICATAS
  const gerarIdUnico = async () => {
    try {
      if (modoTeste) {
        // 🧪 MODO TESTE - Usar timestamp + random para evitar conflitos
        const timestamp = Date.now()
        const random = Math.floor(Math.random() * 10000)
        return `T${timestamp.toString().slice(-8)}${random.toString().padStart(4, "0")}`
      }

      // 🔴 MODO PRODUÇÃO - Usar timestamp + random mais robusto
      const agora = new Date()
      const timestamp = agora.getTime()
      const random = Math.floor(Math.random() * 100000)

      // Formato: YYYYMMDDHHMMSS + 5 dígitos random
      const ano = agora.getFullYear().toString()
      const mes = (agora.getMonth() + 1).toString().padStart(2, "0")
      const dia = agora.getDate().toString().padStart(2, "0")
      const hora = agora.getHours().toString().padStart(2, "0")
      const minuto = agora.getMinutes().toString().padStart(2, "0")
      const segundo = agora.getSeconds().toString().padStart(2, "0")

      const idBase = `${ano}${mes}${dia}${hora}${minuto}${segundo}${random.toString().padStart(5, "0")}`

      // Verificar se este ID já existe (apenas uma verificação simples)
      const { data: existeId, error: erroVerificacao } = await supabase
        .from("pedidos")
        .select("id")
        .eq("id", idBase)
        .limit(1)

      if (erroVerificacao) {
        console.warn("⚠️ Erro ao verificar ID, usando timestamp puro:", erroVerificacao)
        // Fallback: usar apenas timestamp + random maior
        const timestampFallback = Date.now()
        const randomFallback = Math.floor(Math.random() * 1000000)
        return `${timestampFallback}${randomFallback.toString().padStart(6, "0")}`
      }

      // Se o ID não existe, podemos usá-lo
      if (!existeId || existeId.length === 0) {
        return idBase
      }

      // Se existe, adicionar mais aleatoriedade
      const extraRandom = Math.floor(Math.random() * 1000000)
      const idFinal = `${idBase}${extraRandom.toString().padStart(6, "0")}`

      console.log("✅ ID único gerado:", idFinal)
      return idFinal
    } catch (error) {
      console.error("❌ Erro crítico ao gerar ID único:", error)
      // Fallback final: timestamp + random muito grande
      const timestamp = Date.now()
      const random = Math.floor(Math.random() * 10000000)
      const idEmergencia = `E${timestamp}${random.toString().padStart(7, "0")}`
      console.log("🚨 Usando ID de emergência:", idEmergencia)
      return idEmergencia
    }
  }

  // 📍 OBTER LOCALIZAÇÃO ATUAL COM MAPA
  const obterLocalizacaoAtual = () => {
    return new Promise<string>((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude
            const lng = position.coords.longitude
            const localizacao = `📍 Localização: https://maps.google.com/?q=${lat},${lng}`
            setLocalizacaoAtual(localizacao)
            console.log("✅ Localização obtida automaticamente:", localizacao)
            resolve(localizacao)
          },
          (error) => {
            console.warn("❌ Erro ao obter localização:", error)
            setLocalizacaoAtual("")
            resolve("") // Continuar sem localização
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 300000,
          },
        )
      } else {
        console.warn("❌ Geolocalização não suportada")
        setLocalizacaoAtual("")
        resolve("")
      }
    })
  }

  const carregarCategorias = async () => {
    try {
      console.log("🔄 Carregando categorias...")
      const { data, error } = await supabase.from("categorias").select("*").eq("ativo", true).order("nome")

      if (error) {
        console.error("❌ Erro ao carregar categorias:", error)
        throw error
      }

      setCategorias(data || [])
      console.log("✅ Categorias carregadas:", data?.length)
    } catch (error) {
      console.error("❌ Erro ao carregar categorias:", error)
      throw error // Re-throw para ser capturado em carregarDados
    }
  }

  const carregarBebidas = async () => {
    try {
      console.log("🔄 Carregando bebidas...")
      const { data: bebidasData, error: bebidasError } = await supabase
        .from("bebidas")
        .select("*")
        .eq("ativo", true)
        .order("nome")

      if (bebidasError) {
        console.error("❌ Erro ao carregar bebidas:", bebidasError)
        throw bebidasError
      }

      const { data: categoriasData, error: categoriasError } = await supabase
        .from("categorias")
        .select("*")
        .eq("ativo", true)

      if (categoriasError) {
        console.error("❌ Erro ao carregar categorias para bebidas:", categoriasError)
        throw categoriasError
      }

      const bebidasComCategorias = (bebidasData || []).map((bebida) => {
        const categoria = (categoriasData || []).find((cat) => cat.id === bebida.categoria_id)
        return { ...bebida, categoria: categoria || null }
      })

      setBebidas(bebidasComCategorias)
      console.log("✅ Bebidas carregadas:", bebidasComCategorias.length)
    } catch (error) {
      console.error("❌ Erro ao carregar bebidas:", error)
      throw error // Re-throw para ser capturado em carregarDados
    }
  }

  const getQuantidadeSelecionada = (bebidaId: number) => {
    return quantidadesSelecionadas[bebidaId] || 1
  }

  const setQuantidadeSelecionada = (bebidaId: number, quantidade: number) => {
    setQuantidadesSelecionadas((prev) => ({
      ...prev,
      [bebidaId]: quantidade,
    }))
  }

  const adicionarAoCarrinho = (bebida: Bebida, quantidade = 1) => {
    if (bebida.estoque === 0) {
      addToast({
        type: "error",
        title: "Produto esgotado!",
        description: "Este item não está mais disponível no estoque.",
      })
      return
    }

    if (quantidade > bebida.estoque) {
      addToast({
        type: "warning",
        title: "Estoque insuficiente!",
        description: `Disponível: ${bebida.estoque} unidades`,
      })
      return
    }

    setCarrinho((prev) => {
      const itemExistente = prev.find((item) => item.bebida.id === bebida.id)
      if (itemExistente) {
        const novaQuantidade = itemExistente.quantidade + quantidade
        if (novaQuantidade <= bebida.estoque) {
          return prev.map((item) => (item.bebida.id === bebida.id ? { ...item, quantidade: novaQuantidade } : item))
        } else {
          addToast({
            type: "warning",
            title: "Estoque insuficiente!",
            description: `Disponível: ${bebida.estoque} unidades`,
          })
          return prev
        }
      }
      return [...prev, { bebida, quantidade }]
    })
  }

  const removerDoCarrinho = (bebidaId: number) => {
    setCarrinho((prev) => {
      const itemExistente = prev.find((item) => item.bebida.id === bebidaId)
      if (itemExistente && itemExistente.quantidade > 1) {
        return prev.map((item) => (item.bebida.id === bebidaId ? { ...item, quantidade: item.quantidade - 1 } : item))
      }
      return prev.filter((item) => item.bebida.id !== bebidaId)
    })
  }

  const totalCarrinho = carrinho.reduce((total, item) => {
    return total + item.bebida.preco * item.quantidade
  }, 0)

  const subtotalItens = carrinho.reduce((total, item) => {
    return total + item.bebida.preco * item.quantidade
  }, 0)

  const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0)

  const calcularTroco = () => {
    if (formaPagamento === "dinheiro" && valorPago) {
      const valor = Number.parseFloat(valorPago)
      const totalComTaxa = totalCarrinho + (tipoEntrega === "entrega" ? TAXA_ENTREGA : 0)
      return valor > totalComTaxa ? valor - totalComTaxa : 0
    }
    return 0
  }

  const finalizarPedido = async () => {
    console.log("🔄 Iniciando finalização do pedido...")

    // Validações
    if (carrinho.length === 0) {
      addToast({
        type: "error",
        title: "Carrinho vazio!",
        description: "Adicione alguns itens antes de finalizar o pedido.",
      })
      return
    }

    const nomeClientePadrao = "Cliente"

    // Endereço de entrega agora é opcional

    const totalComTaxa = totalCarrinho + (tipoEntrega === "entrega" ? TAXA_ENTREGA : 0)
    if (formaPagamento === "dinheiro" && (!valorPago || Number.parseFloat(valorPago) < totalComTaxa)) {
      addToast({
        type: "error",
        title: "Valor pago insuficiente!",
        description: "O valor pago deve ser maior ou igual ao total do pedido.",
      })
      return
    }

    try {
      setCarregando(true)

      // Obter localização APENAS se for entrega E tiver endereço preenchido
      let localizacaoFinal = ""
      if (tipoEntrega === "entrega" && enderecoEntrega.trim()) {
        try {
          localizacaoFinal = await obterLocalizacaoAtual()
        } catch (error) {
          console.warn("⚠️ Não foi possível obter localização, continuando sem ela")
          localizacaoFinal = ""
        }
      }

      // Gerar ID único sequencial - VERSÃO CORRIGIDA
      const idUnico = await gerarIdUnico()

      const novoPedido: Pedido = {
        id: idUnico,
        data: new Date().toLocaleString("pt-BR"),
        itens: [...carrinho],
        total: totalComTaxa,
        formaPagamento,
        valorPago: formaPagamento === "dinheiro" ? Number.parseFloat(valorPago) : undefined,
        troco: formaPagamento === "dinheiro" ? calcularTroco() : undefined,
        cliente: nomeClientePadrao,
        tipoEntrega,
        enderecoEntrega: tipoEntrega === "entrega" ? enderecoEntrega : undefined,
        localizacao: localizacaoFinal || undefined,
        status: "enviado",
      }

      console.log("📋 Dados do pedido:", novoPedido)

      if (!modoTeste) {
        // 🔴 MODO PRODUÇÃO - Salvar no banco real
        console.log("💾 Salvando pedido no banco...")

        const dadosParaInserir: any = {
          id: novoPedido.id,
          cliente: novoPedido.cliente,
          total: novoPedido.total,
          forma_pagamento: novoPedido.formaPagamento,
          itens: novoPedido.itens,
          tipo_entrega: novoPedido.tipoEntrega,
          status: novoPedido.status,
        }

        if (novoPedido.valorPago !== undefined) {
          dadosParaInserir.valor_pago = novoPedido.valorPago
        }
        if (novoPedido.troco !== undefined) {
          dadosParaInserir.troco = novoPedido.troco
        }
        if (novoPedido.enderecoEntrega) {
          dadosParaInserir.endereco_entrega = novoPedido.enderecoEntrega
        }
        if (novoPedido.localizacao) {
          dadosParaInserir.localizacao = novoPedido.localizacao
        }

        // Remove the retry insertion logic and replace with simple insertion
        const { error } = await supabase.from("pedidos").insert([dadosParaInserir])

        if (error) {
          console.error("❌ Erro ao inserir pedido:", error)
          throw new Error(`Erro ao salvar pedido: ${error.message}`)
        }

        console.log("✅ Pedido inserido com sucesso:", novoPedido.id)

        // Atualizar estoque
        console.log("📦 Atualizando estoque...")
        for (const item of carrinho) {
          const novoEstoque = Math.max(0, item.bebida.estoque - item.quantidade)
          const { error: estoqueError } = await supabase
            .from("bebidas")
            .update({ estoque: novoEstoque })
            .eq("id", item.bebida.id)

          if (estoqueError) {
            console.error("❌ Erro ao atualizar estoque:", estoqueError)
          }
        }

        await carregarBebidas()
      } else {
        // 🧪 MODO TESTE - Apenas simular
        console.log("🧪 MODO TESTE - Pedido simulado (não salvo no banco)")
        addToast({
          type: "info",
          title: "🧪 MODO TESTE ATIVO",
          description: "Pedido criado apenas para demonstração!",
        })
      }

      setPedidos((prev) => [novoPedido, ...prev])
      setPedidoAtual(novoPedido)

      // 🚀 COMPARTILHAMENTO AUTOMÁTICO NO WHATSAPP
      setTimeout(async () => {
        await compartilharComprovanteAutomatico(novoPedido)
        // Ir para tela de comprovante após compartilhar
        setTelaAtual("comprovante")
      }, 1000) // Delay maior para garantir que o WhatsApp abra primeiro

      console.log("✅ Pedido finalizado com sucesso:", novoPedido.id)
    } catch (error) {
      console.error("❌ Erro ao finalizar pedido:", error)
      addToast({
        type: "error",
        title: "Erro ao finalizar pedido",
        description: error instanceof Error ? error.message : "Erro desconhecido",
      })
    } finally {
      setCarregando(false)
    }
  }

  const compartilharComprovante = async () => {
    if (!pedidoAtual) return

    try {
      let mensagem = `🍻 *PEDIDO BEBIDAS ON* 🍻\n`
      mensagem += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
      mensagem += `📋 *Pedido:* #${pedidoAtual.id}\n`
      mensagem += `📅 *Data:* ${pedidoAtual.data}\n`

      if (modoTeste) {
        mensagem += `🧪 *MODO TESTE ATIVO*\n`
      }

      if (pedidoAtual.tipoEntrega === "entrega") {
        mensagem += `🚚 *Tipo:* ENTREGA\n`
        mensagem += `📍 *Endereço:* ${pedidoAtual.enderecoEntrega}\n`
        if (pedidoAtual.localizacao) {
          mensagem += `\n${pedidoAtual.localizacao}\n`
        }
      } else {
        mensagem += `🏪 *Tipo:* RETIRADA NO LOCAL\n`
        mensagem += `📍 *Local:* Rua Amazonas 239 - Paraíso/SP\n`
      }

      mensagem += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`
      mensagem += `🛒 *ITENS DO PEDIDO:*\n`

      pedidoAtual.itens.forEach((item, index) => {
        mensagem += `${index + 1}. ${item.quantidade}x ${item.bebida.nome}\n`
        mensagem += `   💰 R$ ${item.bebida.preco.toFixed(2)} cada\n`
        mensagem += `   📊 Subtotal: R$ ${(item.bebida.preco * item.quantidade).toFixed(2)}\n\n`
      })

      mensagem += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
      mensagem += `💵 *RESUMO FINANCEIRO:*\n`
      mensagem += `🛍️ Subtotal dos itens: R$ ${subtotalItens.toFixed(2)}\n`

      if (pedidoAtual.tipoEntrega === "entrega") {
        mensagem += `🚚 Taxa de entrega: R$ ${TAXA_ENTREGA.toFixed(2)}\n`
      } else {
        mensagem += `🏪 Retirada no local: R$ 0,00\n`
      }

      mensagem += `💰 *TOTAL FINAL: R$ ${pedidoAtual.total.toFixed(2)}*\n\n`
      mensagem += `💳 *PAGAMENTO:* ${pedidoAtual.formaPagamento.toUpperCase()}\n`

      if (pedidoAtual.formaPagamento === "dinheiro") {
        mensagem += `💵 Valor pago: R$ ${pedidoAtual.valorPago?.toFixed(2)}\n`
        if (pedidoAtual.troco && pedidoAtual.troco > 0) {
          mensagem += `🔄 Troco: R$ ${pedidoAtual.troco.toFixed(2)}\n`
        } else {
          mensagem += `✅ Não precisa de troco\n`
        }
      }

      mensagem += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
      mensagem += `📞 *BEBIDAS ON* - ${TELEFONE_DISPLAY}\n`
      mensagem += `🏠 Rua Amazonas 239 - Paraíso/SP\n`

      if (pedidoAtual.tipoEntrega === "entrega") {
        mensagem += `⏰ Aguardando confirmação para entrega!\n`
        mensagem += `🚚 Delivery rápido e gelado! 🧊`
      } else {
        mensagem += `⏰ Aguardando confirmação para retirada!\n`
        mensagem += `🏪 Retire no balcão! 🧊`
      }

      const whatsappUrl = `https://wa.me/${TELEFONE_WHATSAPP}?text=${encodeURIComponent(mensagem)}`
      window.open(whatsappUrl, "_blank")

      setTimeout(() => {
        setCarrinho([])
        setEnderecoEntrega("")
        setValorPago("")
        setFormaPagamento("pix")
        setTipoEntrega("retirada")
        setPedidoAtual(null)
        setTelaAtual("inicio")
      }, 2000)
    } catch (error) {
      console.error("Erro ao compartilhar:", error)
      addToast({
        type: "error",
        title: "Erro ao compartilhar",
        description: "Ocorreu um erro ao tentar compartilhar o comprovante.",
      })
    }
  }

  const compartilharComprovanteAutomatico = async (pedido: Pedido) => {
    try {
      let mensagem = `🍻 *PEDIDO BEBIDAS ON* 🍻\n`
      mensagem += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
      mensagem += `📋 *Pedido:* #${pedido.id}\n`
      mensagem += `📅 *Data:* ${pedido.data}\n`

      if (modoTeste) {
        mensagem += `🧪 *MODO TESTE ATIVO*\n`
      }

      if (pedido.tipoEntrega === "entrega") {
        mensagem += `🚚 *Tipo:* ENTREGA\n`
        mensagem += `📍 *Endereço:* ${pedido.enderecoEntrega}\n`
        if (pedido.localizacao) {
          mensagem += `\n${pedido.localizacao}\n`
        }
      } else {
        mensagem += `🏪 *Tipo:* RETIRADA NO LOCAL\n`
        mensagem += `📍 *Local:* Rua Amazonas 239 - Paraíso/SP\n`
      }

      mensagem += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`
      mensagem += `🛒 *ITENS DO PEDIDO:*\n`

      pedido.itens.forEach((item, index) => {
        mensagem += `${index + 1}. ${item.quantidade}x ${item.bebida.nome}\n`
        mensagem += `   💰 R$ ${item.bebida.preco.toFixed(2)} cada\n`
        mensagem += `   📊 Subtotal: R$ ${(item.bebida.preco * item.quantidade).toFixed(2)}\n\n`
      })

      mensagem += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
      mensagem += `💵 *RESUMO FINANCEIRO:*\n`
      mensagem += `🛍️ Subtotal dos itens: R$ ${subtotalItens.toFixed(2)}\n`

      if (pedido.tipoEntrega === "entrega") {
        mensagem += `🚚 Taxa de entrega: R$ ${TAXA_ENTREGA.toFixed(2)}\n`
      } else {
        mensagem += `🏪 Retirada no local: R$ 0,00\n`
      }

      mensagem += `💰 *TOTAL FINAL: R$ ${pedido.total.toFixed(2)}*\n\n`
      mensagem += `💳 *PAGAMENTO:* ${pedido.formaPagamento.toUpperCase()}\n`

      if (pedido.formaPagamento === "dinheiro") {
        mensagem += `💵 Valor pago: R$ ${pedido.valorPago?.toFixed(2)}\n`
        if (pedido.troco && pedido.troco > 0) {
          mensagem += `🔄 Troco: R$ ${pedido.troco.toFixed(2)}\n`
        } else {
          mensagem += `✅ Não precisa de troco\n`
        }
      }

      mensagem += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
      mensagem += `📞 *BEBIDAS ON* - ${TELEFONE_DISPLAY}\n`
      mensagem += `🏠 Rua Amazonas 239 - Paraíso/SP\n`

      if (pedido.tipoEntrega === "entrega") {
        mensagem += `⏰ Aguardando confirmação para entrega!\n`
        mensagem += `🚚 Delivery rápido e gelado! 🧊`
      } else {
        mensagem += `⏰ Aguardando confirmação para retirada!\n`
        mensagem += `🏪 Retire no balcão! 🧊`
      }

      const whatsappUrl = `https://wa.me/${TELEFONE_WHATSAPP}?text=${encodeURIComponent(mensagem)}`
      window.open(whatsappUrl, "_blank")

      addToast({
        type: "success",
        title: "🚀 Pedido enviado automaticamente!",
        description: "WhatsApp aberto com seu comprovante pronto",
      })

      // Limpar carrinho após envio automático
      setTimeout(() => {
        setCarrinho([])
        setEnderecoEntrega("")
        setValorPago("")
        setFormaPagamento("pix")
        setTipoEntrega("retirada")
      }, 2000)
    } catch (error) {
      console.error("Erro no compartilhamento automático:", error)
      addToast({
        type: "warning",
        title: "Erro no envio automático",
        description: "Use o botão 'Enviar para WhatsApp' manualmente",
      })
    }
  }

  const salvarComprovante = async () => {
    if (!comprovanteRef.current) return

    try {
      setCapturandoImagem(true)
      const html2canvas = (await import("html2canvas")).default

      const canvas = await html2canvas(comprovanteRef.current, {
        backgroundColor: "#1f2937",
        scale: 2,
        useCORS: true,
        allowTaint: true,
        foreignObjectRendering: true,
      })

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const link = document.createElement("a")
          link.href = url
          link.download = `comprovante-${pedidoAtual?.id || "venda"}.png`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          URL.revokeObjectURL(url)
          addToast({
            type: "success",
            title: "Comprovante salvo!",
            description: "O comprovante foi salvo com sucesso na sua galeria.",
          })
        }
      }, "image/png")
    } catch (error) {
      console.error("Erro ao salvar comprovante:", error)
      addToast({
        type: "error",
        title: "Erro ao salvar comprovante",
        description: "Ocorreu um erro ao tentar salvar o comprovante.",
      })
    } finally {
      setCapturandoImagem(false)
    }
  }

  const bebidasFiltradas = bebidas.filter((bebida) => {
    const matchCategoria = categoriaFiltro === "todas" || bebida.categoria_id === categoriaFiltro
    const matchBusca =
      bebida.nome.toLowerCase().includes(busca.toLowerCase()) ||
      (bebida.descricao && bebida.descricao.toLowerCase().includes(busca.toLowerCase()))
    return matchCategoria && matchBusca
  })

  const getStatusEstoque = (estoque: number) => {
    if (estoque === 0) return { cor: "bg-red-500", texto: "Esgotado" }
    if (estoque <= 5) return { cor: "bg-yellow-500", texto: `Restam ${estoque}` }
    return { cor: "bg-green-500", texto: "Disponível" }
  }

  const getCorCategoria = (cor: string) => {
    return CORES_CATEGORIAS.find((c) => c.valor === cor) || CORES_CATEGORIAS[0]
  }

  const getIconeCategoria = (icone: string) => {
    const iconeEncontrado = ICONES_CATEGORIAS.find((i) => i.valor === icone)
    return iconeEncontrado?.icone || Package
  }

  const adicionarNovaCategoria = async () => {
    if (!novaCategoria.nome.trim()) {
      addToast({
        type: "error",
        title: "Nome da categoria ausente!",
        description: "Por favor, digite o nome da categoria.",
      })
      return
    }

    if (modoTeste) {
      // 🧪 MODO TESTE - Apenas simular
      const novaCategoriaTeste: Categoria = {
        id: Date.now(),
        nome: novaCategoria.nome,
        icone: novaCategoria.icone,
        cor: novaCategoria.cor,
        ativo: true,
      }
      setCategorias((prev) => [...prev, novaCategoriaTeste])
      setNovaCategoria({ nome: "", icone: "package", cor: "amber" })
      addToast({
        type: "info",
        title: "🧪 TESTE: Categoria criada localmente!",
        description: "Esta categoria não será salva no banco de dados real.",
      })
      return
    }

    try {
      setCarregando(true)
      const { data, error } = await supabase
        .from("categorias")
        .insert([
          {
            nome: novaCategoria.nome,
            icone: novaCategoria.icone,
            cor: novaCategoria.cor,
            ativo: true,
          },
        ])
        .select()

      if (error) {
        console.error("❌ Erro ao criar categoria:", error)
        addToast({
          type: "error",
          title: "Erro ao criar categoria",
          description: error.message,
        })
        return
      }

      setNovaCategoria({ nome: "", icone: "package", cor: "amber" })
      await carregarCategorias()
      addToast({
        type: "success",
        title: "Categoria criada!",
        description: "A categoria foi criada com sucesso.",
      })
    } catch (error) {
      console.error("❌ Erro ao criar categoria:", error)
      addToast({
        type: "error",
        title: "Erro ao criar categoria",
        description: "Ocorreu um erro ao criar a categoria.",
      })
    } finally {
      setCarregando(false)
    }
  }

  const adicionarNovaBebida = async () => {
    if (!novoItem.nome || !novoItem.preco || !novoItem.categoria_id) {
      addToast({
        type: "error",
        title: "Campos obrigatórios ausentes!",
        description: "Preencha todos os campos obrigatórios para adicionar a bebida.",
      })
      return
    }

    if (modoTeste) {
      // 🧪 MODO TESTE - Apenas simular
      const novaBebidaTeste: Bebida = {
        id: Date.now(),
        nome: novoItem.nome,
        descricao: novoItem.descricao,
        preco: Number.parseFloat(novoItem.preco),
        categoria_id: Number.parseInt(novoItem.categoria_id),
        categoria: categorias.find((c) => c.id === Number.parseInt(novoItem.categoria_id)),
        imagem: novoItem.imagem || "/placeholder.svg?height=200&width=300&text=Bebida+Teste",
        estoque: Number.parseInt(novoItem.estoque) || 0,
        ativo: true,
      }
      setBebidas((prev) => [...prev, novaBebidaTeste])
      setNovoItem({ nome: "", descricao: "", preco: "", categoria_id: "", estoque: "", imagem: "" })
      addToast({
        type: "info",
        title: "🧪 TESTE: Bebida criada localmente!",
        description: "Esta bebida não será salva no banco de dados real.",
      })
      return
    }

    try {
      setCarregando(true)
      const { data, error } = await supabase
        .from("bebidas")
        .insert([
          {
            nome: novoItem.nome,
            descricao: novoItem.descricao,
            preco: Number.parseFloat(novoItem.preco),
            categoria_id: Number.parseInt(novoItem.categoria_id),
            imagem: novoItem.imagem || "/placeholder.svg?height=200&width=300&text=Bebida",
            estoque: Number.parseInt(novoItem.estoque) || 0,
            ativo: true,
          },
        ])
        .select()

      if (error) {
        console.error("❌ Erro ao criar bebida:", error)
        addToast({
          type: "error",
          title: "Erro ao criar bebida",
          description: error.message,
        })
        return
      }

      setNovoItem({ nome: "", descricao: "", preco: "", categoria_id: "", estoque: "", imagem: "" })
      await carregarBebidas()
      addToast({
        type: "success",
        title: "Bebida adicionada!",
        description: "A bebida foi adicionada com sucesso ao cardápio.",
      })
    } catch (error) {
      console.error("❌ Erro ao criar bebida:", error)
      addToast({
        type: "error",
        title: "Erro ao criar bebida",
        description: "Ocorreu um erro ao adicionar a bebida.",
      })
    } finally {
      setCarregando(false)
    }
  }

  const excluirBebida = async (id: number) => {
    const bebida = bebidas.find((b) => b.id === id)
    if (bebida && confirm(`❌ Tem certeza que deseja excluir "${bebida.nome}"?`)) {
      if (modoTeste) {
        // 🧪 MODO TESTE - Apenas simular
        setBebidas((prev) => prev.filter((b) => b.id !== id))
        addToast({
          type: "info",
          title: "🧪 TESTE: Bebida removida localmente!",
          description: "Esta bebida não será excluída do banco de dados real.",
        })
        return
      }

      try {
        const { error } = await supabase.from("bebidas").delete().eq("id", id)
        if (error) {
          addToast({
            type: "error",
            title: "Erro ao excluir bebida",
            description: error.message,
          })
          return
        }
        await carregarBebidas()
        addToast({
          type: "success",
          title: "Bebida excluída!",
          description: "A bebida foi excluída com sucesso do cardápio.",
        })
      } catch (error) {
        addToast({
          type: "error",
          title: "Erro ao excluir bebida",
          description: "Ocorreu um erro ao excluir a bebida.",
        })
      }
    }
  }

  const atualizarEstoque = async (id: number, novoEstoque: number) => {
    if (modoTeste) {
      // 🧪 MODO TESTE - Apenas simular
      setBebidas((prev) => prev.map((b) => (b.id === id ? { ...b, estoque: novoEstoque } : b)))
      return
    }

    try {
      const { error } = await supabase.from("bebidas").update({ estoque: novoEstoque }).eq("id", id)
      if (error) {
        addToast({
          type: "error",
          title: "Erro ao atualizar estoque",
          description: error.message,
        })
        return
      }
      await carregarBebidas()
    } catch (error) {
      addToast({
        type: "error",
        title: "Erro ao atualizar estoque",
        description: "Ocorreu um erro ao atualizar o estoque.",
      })
    }
  }

  // 🔐 ACESSO ADMIN - CORRIGIDO COM MODO TESTE SECRETO
  const acessoAdmin = () => {
    const senha = prompt("🔐 Digite a senha de administrador:")
    if (senha === "admin123") {
      console.log("✅ Acesso admin autorizado")
      setTelaAtual("admin")
    } else if (senha === "teste123") {
      console.log("🧪 Modo teste ativado")
      setModoTeste(true)
      addToast({
        type: "info",
        title: "🧪 Modo teste ativado!",
        description: "Você está agora no modo de teste.",
      })
    } else if (senha !== null) {
      addToast({
        type: "error",
        title: "Senha incorreta!",
        description: "A senha digitada está incorreta.",
      })
    }
  }

  const excluirCategoria = async (id: number) => {
    const categoria = categorias.find((c) => c.id === id)
    if (categoria && confirm(`❌ Tem certeza que deseja excluir "${categoria.nome}"?`)) {
      if (modoTeste) {
        // 🧪 MODO TESTE - Apenas simular
        setCategorias((prev) => prev.filter((c) => c.id !== id))
        addToast({
          type: "info",
          title: "🧪 TESTE: Categoria removida localmente!",
          description: "Esta categoria não será excluída do banco de dados real.",
        })
        return
      }

      try {
        const { error } = await supabase.from("categorias").delete().eq("id", id)
        if (error) {
          addToast({
            type: "error",
            title: "Erro ao excluir categoria",
            description: error.message,
          })
          return
        }
        await carregarCategorias()
        addToast({
          type: "success",
          title: "Categoria excluída!",
          description: "A categoria foi excluída com sucesso.",
        })
      } catch (error) {
        addToast({
          type: "error",
          title: "Erro ao excluir categoria",
          description: "Ocorreu um erro ao excluir a categoria.",
        })
      }
    }
  }

  const editarBebida = async () => {
    if (!editandoItem || !editandoItem.nome || !editandoItem.preco || !editandoItem.categoria_id) {
      addToast({
        type: "error",
        title: "Campos obrigatórios ausentes!",
        description: "Preencha todos os campos obrigatórios para editar a bebida.",
      })
      return
    }

    if (modoTeste) {
      // 🧪 MODO TESTE - Apenas simular
      setBebidas((prev) =>
        prev.map((b) =>
          b.id === editandoItem.id
            ? {
                ...editandoItem,
                categoria: categorias.find((c) => c.id === editandoItem.categoria_id),
              }
            : b,
        ),
      )
      setEditandoItem(null)
      addToast({
        type: "info",
        title: "🧪 TESTE: Bebida editada localmente!",
        description: "As alterações não serão salvas no banco de dados real.",
      })
      return
    }

    try {
      setCarregando(true)
      const { error } = await supabase
        .from("bebidas")
        .update({
          nome: editandoItem.nome,
          descricao: editandoItem.descricao,
          preco: editandoItem.preco,
          categoria_id: editandoItem.categoria_id,
          imagem: editandoItem.imagem,
          estoque: editandoItem.estoque,
        })
        .eq("id", editandoItem.id)

      if (error) {
        addToast({
          type: "error",
          title: "Erro ao editar bebida",
          description: error.message,
        })
        return
      }

      setEditandoItem(null)
      await carregarBebidas()
      addToast({
        type: "success",
        title: "Bebida editada!",
        description: "A bebida foi editada com sucesso.",
      })
    } catch (error) {
      addToast({
        type: "error",
        title: "Erro ao editar bebida",
        description: "Ocorreu um erro ao editar a bebida.",
      })
    } finally {
      setCarregando(false)
    }
  }

  const editarCategoria = async () => {
    if (!editandoCategoria || !editandoCategoria.nome.trim()) {
      addToast({
        type: "error",
        title: "Nome da categoria ausente!",
        description: "Por favor, digite o nome da categoria.",
      })
      return
    }

    if (modoTeste) {
      // 🧪 MODO TESTE - Apenas simular
      setCategorias((prev) => prev.map((c) => (c.id === editandoCategoria.id ? editandoCategoria : c)))
      setEditandoCategoria(null)
      addToast({
        type: "info",
        title: "🧪 TESTE: Categoria editada localmente!",
        description: "As alterações não serão salvas no banco de dados real.",
      })
      return
    }

    try {
      setCarregando(true)
      const { error } = await supabase
        .from("categorias")
        .update({
          nome: editandoCategoria.nome,
          icone: editandoCategoria.icone,
          cor: editandoCategoria.cor,
        })
        .eq("id", editandoCategoria.id)

      if (error) {
        addToast({
          type: "error",
          title: "Erro ao editar categoria",
          description: error.message,
        })
        return
      }

      setEditandoCategoria(null)
      await carregarCategorias()
      addToast({
        type: "success",
        title: "Categoria editada!",
        description: "A categoria foi editada com sucesso.",
      })
    } catch (error) {
      addToast({
        type: "error",
        title: "Erro ao editar categoria",
        description: "Ocorreu um erro ao editar a categoria.",
      })
    } finally {
      setCarregando(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string
        if (editandoItem) {
          setEditandoItem({ ...editandoItem, imagem: imageUrl })
        } else {
          setNovoItem({ ...novoItem, imagem: imageUrl })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  // Recarregar dados quando mudar o modo
  useEffect(() => {
    carregarDados()
  }, [modoTeste])

  const produtosFiltrados = bebidas.filter(
    (bebida) =>
      bebida.nome.toLowerCase().includes(buscaProdutos.toLowerCase()) ||
      (bebida.descricao && bebida.descricao.toLowerCase().includes(buscaProdutos.toLowerCase())),
  )

  // TELA ADMIN - OTIMIZADA PARA MOBILE
  if (telaAtual === "admin") {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header Admin */}
        <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 text-gray-600">🔧</div>
              <h1 className="text-xl font-bold text-gray-800">Painel Administrativo</h1>
            </div>
            <Button
              variant="ghost"
              onClick={() => setTelaAtual("inicio")}
              className="text-gray-600 hover:text-gray-800"
            >
              ✕
            </Button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6">
          {/* Cards de Estatísticas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-5 h-5 text-blue-600">📦</div>
                <span className="text-sm font-medium text-blue-800">Produtos</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">{bebidas.length}</div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-5 h-5 text-purple-600">🏷️</div>
                <span className="text-sm font-medium text-purple-800">Categorias</span>
              </div>
              <div className="text-2xl font-bold text-purple-600">{categorias.length}</div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-5 h-5 text-green-600">📋</div>
                <span className="text-sm font-medium text-green-800">Pedidos</span>
              </div>
              <div className="text-2xl font-bold text-green-600">{pedidos.length}</div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-5 h-5 text-orange-600">💰</div>
                <span className="text-sm font-medium text-orange-800">Vendas</span>
              </div>
              <div className="text-2xl font-bold text-orange-600">
                R$ {pedidos.reduce((total, pedido) => total + pedido.total, 0).toFixed(2)}
              </div>
            </div>
          </div>

          {/* Abas */}
          <div className="flex space-x-1 mb-6">
            <button
              onClick={() => setAbaAdmin("categorias")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                abaAdmin === "categorias"
                  ? "bg-orange-500 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              🏷️ Categorias
            </button>
            <button
              onClick={() => setAbaAdmin("produtos")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                abaAdmin === "produtos"
                  ? "bg-gray-800 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              📦 Produtos
            </button>
            <button
              onClick={() => setAbaAdmin("pedidos")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                abaAdmin === "pedidos"
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              📋 Vendas
            </button>
          </div>

          {/* Conteúdo das Abas */}
          {abaAdmin === "categorias" && (
            <div className="space-y-6">
              {/* Gerenciar Categorias */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-5 h-5 text-purple-600">🏷️</div>
                  <h2 className="text-lg font-bold text-purple-600">Gerenciar Categorias</h2>
                </div>

                {/* Adicionar Nova Categoria */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-4 h-4 text-purple-600">➕</div>
                    <h3 className="font-semibold text-gray-800">Adicionar Nova Categoria</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Categoria *</label>
                      <Input
                        value={novaCategoria.nome}
                        onChange={(e) => setNovaCategoria({ ...novaCategoria, nome: e.target.value })}
                        placeholder="Ex: Cervejas, Vinhos, etc."
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Descrição (opcional)</label>
                      <Input placeholder="Descrição da categoria" className="w-full" />
                    </div>
                  </div>

                  <Button
                    onClick={adicionarNovaCategoria}
                    disabled={carregando}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {carregando ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Salvando...
                      </>
                    ) : (
                      <>➕ Adicionar Categoria</>
                    )}
                  </Button>
                </div>

                {/* Categorias Existentes */}
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-4 h-4 text-gray-600">📋</div>
                    <h3 className="font-semibold text-gray-800">Categorias Existentes</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categorias.map((categoria) => {
                      const produtosDaCategoria = bebidas.filter((b) => b.categoria_id === categoria.id).length
                      const IconeComponent = getIconeCategoria(categoria.icone)
                      const corInfo = getCorCategoria(categoria.cor)

                      return (
                        <div
                          key={categoria.id}
                          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <div className={`w-6 h-6 rounded ${corInfo.classe} flex items-center justify-center`}>
                                <IconeComponent className="w-3 h-3 text-white" />
                              </div>
                              <h4 className="font-semibold text-gray-800">{categoria.nome}</h4>
                            </div>
                            <div className="flex space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditandoCategoria(categoria)}
                                className="h-6 w-6 p-0 text-blue-600 hover:bg-blue-50"
                              >
                                ✏️
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => excluirCategoria(categoria.id)}
                                className="h-6 w-6 p-0 text-red-600 hover:bg-red-50"
                              >
                                🗑️
                              </Button>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">{produtosDaCategoria} produtos</div>
                          <div className="text-xs text-gray-500 mt-1">ID: {categoria.id}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {abaAdmin === "produtos" && (
            <div className="space-y-6">
              {/* Gerenciar Produtos */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-5 h-5 text-orange-600">📦</div>
                  <h2 className="text-lg font-bold text-orange-600">Gerenciar Produtos</h2>
                </div>

                {/* Adicionar Novo Produto */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-4 h-4 text-orange-600">➕</div>
                    <h3 className="font-semibold text-gray-800">Adicionar Novo Produto</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto *</label>
                      <Input
                        value={novoItem.nome}
                        onChange={(e) => setNovoItem({ ...novoItem, nome: e.target.value })}
                        placeholder="Ex: Cerveja Artesanal IPA"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
                      <Select
                        value={novoItem.categoria_id}
                        onValueChange={(value) => setNovoItem({ ...novoItem, categoria_id: value })}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          {categorias.map((categoria) => (
                            <SelectItem key={categoria.id} value={categoria.id.toString()}>
                              {categoria.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                    <Textarea
                      value={novoItem.descricao}
                      onChange={(e) => setNovoItem({ ...novoItem, descricao: e.target.value })}
                      placeholder="Descrição detalhada do produto"
                      rows={3}
                      className="w-full resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$) *</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={novoItem.preco}
                        onChange={(e) => setNovoItem({ ...novoItem, preco: e.target.value })}
                        placeholder="15.90"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Estoque *</label>
                      <Input
                        type="number"
                        value={novoItem.estoque}
                        onChange={(e) => setNovoItem({ ...novoItem, estoque: e.target.value })}
                        placeholder="50"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Desconto (%)</label>
                      <Input type="number" placeholder="20" className="w-full" />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Imagem do Produto</label>
                    <div className="flex space-x-2">
                      <Input
                        value={novoItem.imagem}
                        onChange={(e) => setNovoItem({ ...novoItem, imagem: e.target.value })}
                        placeholder="https://exemplo.com/imagem.jpg"
                        className="flex-1"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="upload-image"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="px-3 bg-transparent"
                        onClick={() => document.getElementById("upload-image")?.click()}
                      >
                        📁 Escolher
                      </Button>
                    </div>
                  </div>

                  <Button
                    onClick={adicionarNovaBebida}
                    disabled={carregando}
                    className="bg-orange-600 hover:bg-orange-700 text-white w-full"
                  >
                    {carregando ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Salvando...
                      </>
                    ) : (
                      <>✅ Adicionar Produto</>
                    )}
                  </Button>
                </div>

                {/* Produtos Cadastrados - LAYOUT MOBILE CORRIGIDO */}
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-2 sm:space-y-0">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 text-gray-600">📋</div>
                      <h3 className="font-semibold text-gray-800">Produtos Cadastrados</h3>
                    </div>
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Buscar produto..."
                        className="pl-10 w-full"
                        value={buscaProdutos}
                        onChange={(e) => setBuscaProdutos(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    {produtosFiltrados.map((bebida) => (
                      <div
                        key={bebida.id}
                        className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow"
                      >
                        {/* Layout Mobile Otimizado */}
                        <div className="space-y-3">
                          {/* Linha 1: Imagem + Info Principal */}
                          <div className="flex items-start space-x-3">
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                              <Image
                                src={bebida.imagem || "/placeholder.svg"}
                                alt={bebida.nome}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-800 text-sm leading-tight mb-1">{bebida.nome}</h4>
                              <p className="text-xs text-gray-600 mb-2">{bebida.categoria?.nome || "Sem categoria"}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-green-600">R$ {bebida.preco.toFixed(2)}</span>
                                <div className="flex items-center space-x-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setEditandoItem(bebida)}
                                    className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50"
                                  >
                                    ✏️
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => excluirBebida(bebida.id)}
                                    className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                                  >
                                    🗑️
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Linha 2: Estoque */}
                          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                            <span className="text-sm text-gray-600">Estoque disponível:</span>
                            <span className="font-bold text-lg">{bebida.estoque} unidades</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {abaAdmin === "pedidos" && (
            <div className="space-y-6">
              {/* Gerenciar Pedidos/Vendas */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-5 h-5 text-green-600">📋</div>
                  <h2 className="text-lg font-bold text-green-600">Vendas Realizadas</h2>
                </div>

                {pedidos.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="text-2xl">📋</div>
                    </div>
                    <p className="text-gray-500">Nenhuma venda realizada ainda</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pedidos.map((pedido) => (
                      <div key={pedido.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                          <div>
                            <h3 className="font-bold text-lg text-gray-800">Pedido #{pedido.id}</h3>
                            <p className="text-sm text-gray-600">{pedido.data}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-green-600">R$ {pedido.total.toFixed(2)}</p>
                            <Badge
                              className={`${
                                pedido.status === "enviado"
                                  ? "bg-yellow-500"
                                  : pedido.status === "confirmado"
                                    ? "bg-blue-500"
                                    : "bg-green-500"
                              } text-white text-xs`}
                            >
                              {pedido.status.toUpperCase()}
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                          <div>
                            <p className="text-sm text-gray-600">Cliente:</p>
                            <p className="font-semibold">{pedido.cliente}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Tipo:</p>
                            <p className="font-semibold">
                              {pedido.tipoEntrega === "entrega" ? "🚚 Entrega" : "🏪 Retirada"}
                            </p>
                          </div>
                        </div>

                        {pedido.enderecoEntrega && (
                          <div className="mb-3">
                            <p className="text-sm text-gray-600">Endereço:</p>
                            <p className="font-semibold text-sm">{pedido.enderecoEntrega}</p>
                          </div>
                        )}

                        <div className="mb-3">
                          <p className="text-sm text-gray-600">Pagamento:</p>
                          <p className="font-semibold">{pedido.formaPagamento.toUpperCase()}</p>
                          {pedido.formaPagamento === "dinheiro" && pedido.valorPago && (
                            <p className="text-sm">
                              Pago: R$ {pedido.valorPago.toFixed(2)}
                              {pedido.troco && pedido.troco > 0 && ` | Troco: R$ ${pedido.troco.toFixed(2)}`}
                            </p>
                          )}
                        </div>

                        <div>
                          <p className="text-sm text-gray-600 mb-2">Itens ({pedido.itens.length}):</p>
                          <div className="space-y-1">
                            {pedido.itens.map((item, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span>
                                  {item.quantidade}x {item.bebida.nome}
                                </span>
                                <span>R$ {(item.bebida.preco * item.quantidade).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modais de Edição */}
        {editandoItem && (
          <Dialog open={!!editandoItem} onOpenChange={() => setEditandoItem(null)}>
            <DialogContent className="max-w-[95vw] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-lg text-gray-800 flex items-center">
                  <Edit className="w-5 h-5 mr-2 text-blue-600" />
                  Editar: {editandoItem.nome}
                  {modoTeste && <Badge className="ml-2 bg-yellow-500 text-black text-xs">🧪</Badge>}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-3 mt-4">
                <Input
                  value={editandoItem.nome}
                  onChange={(e) => setEditandoItem({ ...editandoItem, nome: e.target.value })}
                  placeholder="Nome *"
                  className="h-10"
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    step="0.01"
                    value={editandoItem.preco}
                    onChange={(e) =>
                      setEditandoItem({ ...editandoItem, preco: Number.parseFloat(e.target.value) || 0 })
                    }
                    placeholder="Preço *"
                    className="h-10"
                  />
                  <Input
                    type="number"
                    value={editandoItem.estoque}
                    onChange={(e) =>
                      setEditandoItem({ ...editandoItem, estoque: Number.parseInt(e.target.value) || 0 })
                    }
                    placeholder="Estoque"
                    className="h-10"
                  />
                </div>
                <Select
                  value={editandoItem.categoria_id?.toString()}
                  onValueChange={(value) => setEditandoItem({ ...editandoItem, categoria_id: Number.parseInt(value) })}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Categoria *" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map((categoria) => (
                      <SelectItem key={categoria.id} value={categoria.id.toString()}>
                        {categoria.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Textarea
                  value={editandoItem.descricao || ""}
                  onChange={(e) => setEditandoItem({ ...editandoItem, descricao: e.target.value })}
                  placeholder="Descrição"
                  rows={2}
                  className="resize-none"
                />
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Imagem do Produto</label>
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <Input
                        value={editandoItem.imagem || ""}
                        onChange={(e) => setEditandoItem({ ...editandoItem, imagem: e.target.value })}
                        placeholder="URL da imagem"
                        className="flex-1 h-10"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="upload-image-edit"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="px-3 bg-transparent whitespace-nowrap"
                        onClick={() => document.getElementById("upload-image-edit")?.click()}
                      >
                        📷 Escolher Foto
                      </Button>
                    </div>
                    {editandoItem.imagem && (
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 border">
                        <Image
                          src={editandoItem.imagem || "/placeholder.svg"}
                          alt="Preview"
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col space-y-2 mt-4">
                <Button
                  onClick={editarBebida}
                  disabled={carregando}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white h-10"
                >
                  {carregando ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {modoTeste ? "🧪 Salvar (Teste)" : "Salvar Alterações"}
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditandoItem(null)}
                  disabled={carregando}
                  className="w-full h-10"
                >
                  Cancelar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {editandoCategoria && (
          <Dialog open={!!editandoCategoria} onOpenChange={() => setEditandoCategoria(null)}>
            <DialogContent className="max-w-[95vw]">
              <DialogHeader>
                <DialogTitle className="text-lg text-gray-800 flex items-center">
                  <Edit className="w-5 h-5 mr-2 text-blue-600" />
                  Editar: {editandoCategoria.nome}
                  {modoTeste && <Badge className="ml-2 bg-yellow-500 text-black text-xs">🧪</Badge>}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-3 mt-4">
                <Input
                  value={editandoCategoria.nome}
                  onChange={(e) => setEditandoCategoria({ ...editandoCategoria, nome: e.target.value })}
                  placeholder="Nome *"
                  className="h-10"
                />
                <div className="grid grid-cols-2 gap-2">
                  <Select
                    value={editandoCategoria.icone}
                    onValueChange={(value) => setEditandoCategoria({ ...editandoCategoria, icone: value })}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Ícone" />
                    </SelectTrigger>
                    <SelectContent>
                      {ICONES_CATEGORIAS.map((icone) => (
                        <SelectItem key={icone.valor} value={icone.valor}>
                          {icone.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={editandoCategoria.cor}
                    onValueChange={(value) => setEditandoCategoria({ ...editandoCategoria, cor: value })}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Cor" />
                    </SelectTrigger>
                    <SelectContent>
                      {CORES_CATEGORIAS.map((cor) => (
                        <SelectItem key={cor.valor} value={cor.valor}>
                          {cor.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex flex-col space-y-2 mt-4">
                <Button
                  onClick={editarCategoria}
                  disabled={carregando}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white h-10"
                >
                  {carregando ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {modoTeste ? "🧪 Salvar (Teste)" : "Salvar Alterações"}
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditandoCategoria(null)}
                  disabled={carregando}
                  className="w-full h-10"
                >
                  Cancelar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    )
  }

  // TELA DE COMPROVANTE
  if (telaAtual === "comprovante") {
    if (!pedidoAtual) {
      return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
          <div className="text-center animate-fadeInScale">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-lg mb-4">⏳ Gerando comprovante...</p>
            <Button onClick={() => setTelaAtual("inicio")} className="bg-orange-500 text-white hover-lift">
              Voltar ao Início
            </Button>
          </div>
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
        <div className="max-w-md w-full animate-fadeInScale">
          {/* Comprovante */}
          <div
            ref={comprovanteRef}
            className="bg-gradient-to-b from-gray-800 to-gray-900 text-white p-8 rounded-2xl shadow-2xl"
          >
            {/* Cabeçalho */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-yellow-400 mb-2">BEBIDAS ON</h1>
              <p className="text-gray-300 text-lg">Comprovante de Venda</p>
              {modoTeste && <Badge className="mt-2 bg-yellow-500 text-black text-xs">🧪 MODO TESTE</Badge>}
            </div>

            {/* Informações da Empresa */}
            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div>
                <p className="text-gray-300">Telefone: </p>
                <p className="font-semibold">{TELEFONE_DISPLAY}</p>
              </div>
              <div>
                <p className="text-gray-300">CNPJ:</p>
                <p className="font-semibold text-xs">46.203.975/8000-00</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-gray-300 text-sm">Endereço:</p>
              <p className="font-semibold">Rua Amazonas 239 - Paraíso/SP</p>
            </div>

            <hr className="border-gray-600 mb-6" />

            {/* Informações do Pedido */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-gray-300 text-sm">Venda Nº:</p>
                <p className="font-bold text-yellow-400 text-lg">{pedidoAtual.id}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-300 text-sm">Data e Hora:</p>
                <p className="font-semibold text-sm">{pedidoAtual.data}</p>
              </div>
            </div>

            <hr className="border-gray-600 mb-6" />

            {/* Informações de Entrega */}
            <div className="mb-6">
              <p className="text-gray-300 text-sm">Tipo de Entrega:</p>
              <p className="font-bold text-lg uppercase">
                {pedidoAtual.tipoEntrega === "entrega" ? "🚚 ENTREGA" : "🏪 RETIRADA NO LOCAL"}
              </p>
              {pedidoAtual.tipoEntrega === "entrega" && pedidoAtual.enderecoEntrega && (
                <div className="mt-2">
                  <p className="text-gray-300 text-sm">Endereço:</p>
                  <p className="font-semibold text-sm">{pedidoAtual.enderecoEntrega}</p>
                  {pedidoAtual.localizacao && <p className="text-xs text-blue-300 mt-1">{pedidoAtual.localizacao}</p>}
                </div>
              )}
            </div>

            <hr className="border-gray-600 mb-6" />

            {/* Itens da Venda */}
            <div className="mb-6">
              <p className="text-gray-300 text-sm mb-4">Itens da Venda:</p>
              <div className="space-y-3">
                {pedidoAtual.itens.map((item, index) => (
                  <div key={index} className="bg-gray-700 p-3 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-semibold">{item.bebida.nome}</p>
                        <p className="text-xs text-gray-300">
                          {item.quantidade} un. x R$ {item.bebida.preco.toFixed(2)}
                        </p>
                      </div>
                      <p className="font-bold text-yellow-400">R$ {(item.bebida.preco * item.quantidade).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-gray-600 mb-6" />

            {/* Total */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Subtotal dos Itens:</span>
                <span className="font-semibold">R$ {subtotalItens.toFixed(2)}</span>
              </div>
              {pedidoAtual.tipoEntrega === "entrega" ? (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Taxa de Entrega:</span>
                  <span className="font-semibold">R$ {TAXA_ENTREGA.toFixed(2)}</span>
                </div>
              ) : (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Retirada no Local:</span>
                  <span className="font-semibold text-green-400">R$ 0,00</span>
                </div>
              )}
              <div className="flex justify-between text-2xl font-bold">
                <span>Valor Final:</span>
                <span className="text-yellow-400">R$ {pedidoAtual.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Forma de Pagamento */}
            <div className="text-center bg-gray-700 p-3 rounded-lg">
              <p className="text-gray-300 text-sm">FORMA DE PAGAMENTO</p>
              <p className="font-bold text-lg uppercase">{pedidoAtual.formaPagamento}</p>
              {pedidoAtual.formaPagamento === "dinheiro" && (
                <div className="mt-2 text-sm">
                  <p>Valor pago: R$ {pedidoAtual.valorPago?.toFixed(2)}</p>
                  {pedidoAtual.troco && pedidoAtual.troco > 0 ? (
                    <p className="text-yellow-400">Troco: R$ {pedidoAtual.troco.toFixed(2)}</p>
                  ) : (
                    <p className="text-green-400">Não precisa de troco</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Botões */}
          <div className="mt-6 space-y-3">
            <Button
              onClick={compartilharComprovante}
              disabled={capturandoImagem}
              className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-4 rounded-xl font-bold shadow-lg hover-lift"
            >
              {capturandoImagem ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                  Preparando...
                </>
              ) : (
                <>
                  <Share className="w-6 h-6 mr-3" />
                  Enviar para WhatsApp
                </>
              )}
            </Button>

            <Button
              onClick={salvarComprovante}
              disabled={capturandoImagem}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-4 rounded-xl font-bold shadow-lg hover-lift"
            >
              {capturandoImagem ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <Download className="w-6 h-6 mr-3" />
                  Salvar Comprovante
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                setCarrinho([])
                setValorPago("")
                setFormaPagamento("pix")
                setPedidoAtual(null)
                setTelaAtual("inicio")
              }}
              className="w-full border-gray-400 text-gray-700 hover:bg-gray-100 hover-lift"
            >
              Fazer Novo Pedido
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // TELA DE PAGAMENTO
  if (telaAtual === "pagamento") {
    const calcularTaxaEntrega = () => {
      if (tipoEntrega === "retirada") return 0
      return TAXA_ENTREGA
    }

    const podeEntrega = totalCarrinho >= PEDIDO_MINIMO_ENTREGA

    const totalComEntrega = totalCarrinho + calcularTaxaEntrega()

    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 animate-fadeInUp">
        <div className="bg-gradient-to-r from-orange-400 via-orange-500 to-yellow-500 p-4 text-white shadow-lg">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => setTelaAtual("carrinho")}
              className="text-white hover:bg-white/20 font-semibold hover-lift"
            >
              ← Voltar ao Carrinho
            </Button>
            <h1 className="text-xl md:text-2xl font-bold">💳 Pagamento</h1>
            <div className="w-20 md:w-32"></div>
          </div>
        </div>

        <div className="max-w-md mx-auto p-4 space-y-6">
          {/* Resumo do Pedido */}
          <Card className="shadow-lg border-0 bg-gradient-to-r from-white to-orange-50 hover-lift">
            <CardHeader>
              <CardTitle className="text-center text-lg">📋 Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {carrinho.map((item) => (
                  <div key={item.bebida.id} className="flex justify-between text-sm">
                    <span>
                      {item.quantidade}x {item.bebida.nome}
                    </span>
                    <span>R$ {(item.bebida.preco * item.quantidade).toFixed(2)}</span>
                  </div>
                ))}
                {tipoEntrega === "entrega" && (
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Taxa de entrega</span>
                    <span>R$ {TAXA_ENTREGA.toFixed(2)}</span>
                  </div>
                )}
                {tipoEntrega === "retirada" && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Retirada no local</span>
                    <span>R$ 0,00</span>
                  </div>
                )}
                <hr className="my-3" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-green-600">R$ {totalComEntrega.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tipo de Entrega */}
          <Card className="shadow-lg border-0 bg-gradient-to-r from-white to-orange-50 hover-lift">
            <CardHeader>
              <CardTitle className="text-lg">🚚 Tipo de Entrega</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Retirada no Local */}
                <div
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 hover-lift ${
                    tipoEntrega === "retirada"
                      ? "border-blue-500 bg-blue-50 scale-105"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                  onClick={() => setTipoEntrega("retirada")}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 text-blue-600">🏪</div>
                    <div>
                      <p className="font-semibold">Retirada no Local</p>
                      <p className="text-sm text-gray-600">Sem taxa de entrega</p>
                    </div>
                    {tipoEntrega === "retirada" && <div className="ml-auto w-4 h-4 bg-blue-500 rounded-full"></div>}
                  </div>
                </div>

                {/* Entrega - com validação de pedido mínimo */}
                <div
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 hover-lift ${
                    !podeEntrega
                      ? "border-gray-300 bg-gray-100 cursor-not-allowed opacity-60"
                      : tipoEntrega === "entrega"
                        ? "border-orange-500 bg-orange-50 scale-105"
                        : "border-gray-200 hover:border-orange-300"
                  }`}
                  onClick={() => podeEntrega && setTipoEntrega("entrega")}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 text-orange-600">🚚</div>
                    <div>
                      <p className={`font-semibold ${!podeEntrega ? "text-gray-500" : ""}`}>
                        Entrega {!podeEntrega ? "(Indisponível)" : ""}
                      </p>
                      {!podeEntrega ? (
                        <div className="text-sm text-gray-500">
                          <p className="font-medium text-red-600">Entrega disponível a partir de R$ 20,00</p>
                          <p>Seu pedido: R$ {totalCarrinho.toFixed(2)}</p>
                          <p className="font-semibold text-orange-600">
                            Faltam: R$ {(PEDIDO_MINIMO_ENTREGA - totalCarrinho).toFixed(2)}
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-600">Taxa: R$ {TAXA_ENTREGA.toFixed(2)}</p>
                      )}
                    </div>
                    {tipoEntrega === "entrega" && podeEntrega && (
                      <div className="ml-auto w-4 h-4 bg-orange-500 rounded-full"></div>
                    )}
                  </div>
                </div>

                {/* Campo de Endereço para Entrega */}
                {tipoEntrega === "entrega" && (
                  <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <Label htmlFor="enderecoEntrega">Endereço para Entrega (opcional)</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => obterLocalizacaoAtual()}
                      className="text-xs px-2 py-1 h-auto bg-transparent"
                    >
                      <MapPin className="w-3 h-3 mr-1" />📍 Capturar Localização
                    </Button>
                    <Textarea
                      id="enderecoEntrega"
                      value={enderecoEntrega}
                      onChange={(e) => setEnderecoEntrega(e.target.value)}
                      placeholder="Digite seu endereço completo (rua, número, bairro, cidade)"
                      rows={3}
                      className="mt-2"
                    />
                    {localizacaoAtual && (
                      <div className="mt-2 p-2 bg-green-100 rounded text-green-800 text-xs">
                        ✅ Localização capturada automaticamente
                        <br />
                        <span className="text-blue-600">{localizacaoAtual}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Forma de Pagamento */}
          <Card className="shadow-lg border-0 bg-gradient-to-r from-white to-orange-50 hover-lift">
            <CardHeader>
              <CardTitle className="text-lg">💳 Forma de Pagamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* PIX */}
                <div
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 hover-lift ${
                    formaPagamento === "pix"
                      ? "border-green-500 bg-green-50 scale-105"
                      : "border-gray-200 hover:border-green-300"
                  }`}
                  onClick={() => setFormaPagamento("pix")}
                >
                  <div className="flex items-center space-x-3">
                    <Smartphone className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="font-semibold">PIX</p>
                      <p className="text-sm text-gray-600">Pagamento instantâneo</p>
                    </div>
                    {formaPagamento === "pix" && <div className="ml-auto w-4 h-4 bg-green-500 rounded-full"></div>}
                  </div>
                </div>

                {/* Campo para chave PIX - COMPACTO */}
                {formaPagamento === "pix" && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                    {/* Informações do PIX - Compactas */}
                    <div className="bg-white rounded-lg border border-green-300 p-3 mb-3">
                      <div className="text-center mb-3">
                        <div className="flex items-center justify-center space-x-2 mb-2">
                          <Smartphone className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-semibold text-green-800">Dados para PIX</span>
                        </div>

                        <div className="space-y-2">
                          <div>
                            <p className="text-xs text-gray-600">Chave PIX:</p>
                            <p className="font-mono text-base font-bold text-gray-800">{CHAVE_PIX}</p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-600">Nome:</p>
                            <p className="text-sm font-semibold text-gray-800">{NOME_PIX}</p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-600">Banco:</p>
                            <p className="text-sm font-medium text-gray-700">{BANCO_PIX}</p>
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(CHAVE_PIX)
                            addToast({
                              type: "success",
                              title: "Chave PIX copiada!",
                              description: "Cole no seu aplicativo do banco para fazer o pagamento",
                            })
                          }}
                          className="mt-3 px-4 py-2 bg-green-100 border-green-300 text-green-700 hover:bg-green-200 text-sm w-full"
                        >
                          📋 Copiar Chave PIX
                        </Button>
                      </div>
                    </div>

                    {/* Valor a ser pago */}
                    <div className="bg-blue-50 rounded-lg border border-blue-200 p-2 mb-3">
                      <div className="text-center">
                        <p className="text-xs text-blue-700">💰 Valor a pagar:</p>
                        <p className="text-xl font-bold text-blue-800">R$ {totalComEntrega.toFixed(2)}</p>
                      </div>
                    </div>

                    {/* Instruções compactas */}
                    <div className="bg-blue-100 rounded-lg p-2">
                      <div className="flex items-start space-x-2">
                        <div className="text-blue-600 mt-0.5 text-sm">💡</div>
                        <div className="text-blue-800 text-xs">
                          <p className="font-semibold mb-1">Como pagar:</p>
                          <p>
                            1. Copie a chave PIX • 2. Abra seu banco • 3. PIX → Pagar • 4. Cole a chave • 5. Digite o
                            valor • 6. Confirme
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Cartão */}
                <div
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 hover-lift ${
                    formaPagamento === "cartao"
                      ? "border-blue-500 bg-blue-50 scale-105"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                  onClick={() => setFormaPagamento("cartao")}
                >
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="font-semibold">Cartão</p>
                      <p className="text-sm text-gray-600">Débito ou Crédito</p>
                    </div>
                    {formaPagamento === "cartao" && <div className="ml-auto w-4 h-4 bg-blue-500 rounded-full"></div>}
                  </div>
                </div>

                {/* Dinheiro */}
                <div
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 hover-lift ${
                    formaPagamento === "dinheiro"
                      ? "border-yellow-500 bg-yellow-50 scale-105"
                      : "border-gray-200 hover:border-yellow-300"
                  }`}
                  onClick={() => setFormaPagamento("dinheiro")}
                >
                  <div className="flex items-center space-x-3">
                    <Banknote className="w-6 h-6 text-yellow-600" />
                    <div>
                      <p className="font-semibold">Dinheiro</p>
                      <p className="text-sm text-gray-600">Pagamento em espécie</p>
                    </div>
                    {formaPagamento === "dinheiro" && (
                      <div className="ml-auto w-4 h-4 bg-yellow-500 rounded-full"></div>
                    )}
                  </div>
                </div>

                {/* Campo para valor pago em dinheiro */}
                {formaPagamento === "dinheiro" && (
                  <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <Label htmlFor="valorPago">Valor que você vai pagar *</Label>
                    <Input
                      id="valorPago"
                      type="number"
                      step="0.01"
                      placeholder={`Mínimo: R$ ${totalComEntrega.toFixed(2)}`}
                      value={valorPago}
                      onChange={(e) => setValorPago(e.target.value)}
                      className="mt-2"
                    />
                    {valorPago && Number.parseFloat(valorPago) >= totalComEntrega && (
                      <div className="mt-2 p-2 bg-green-100 rounded text-green-800 text-sm">
                        {calcularTroco() > 0 ? (
                          <p>💰 Troco: R$ {calcularTroco().toFixed(2)}</p>
                        ) : (
                          <p>✅ Não precisa de troco</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Botão Finalizar */}
          <Button
            onClick={finalizarPedido}
            disabled={
              carregando ||
              (formaPagamento === "dinheiro" && (!valorPago || Number.parseFloat(valorPago) < totalComEntrega))
            }
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-xl py-6 rounded-xl font-bold shadow-lg hover-lift"
          >
            {carregando ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                Processando...
              </>
            ) : (
              <>🎉 {modoTeste ? "🧪 Finalizar (Teste)" : "Finalizar Pedido"}</>
            )}
          </Button>
        </div>

        {/* Rodapé */}
        <Rodape />
      </div>
    )
  }

  // TELA DO CARRINHO
  if (telaAtual === "carrinho") {
    const calcularTaxaEntrega = () => {
      if (tipoEntrega === "retirada") return 0
      if (totalCarrinho >= PEDIDO_MINIMO_ENTREGA) return 0
      return TAXA_ENTREGA
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 animate-fadeInUp flex flex-col">
        <div className="bg-gradient-to-r from-orange-400 via-orange-500 to-yellow-500 p-3 text-white shadow-lg">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => setTelaAtual("cardapio")}
              className="text-white hover:bg-white/20 font-medium hover-lift text-sm px-3 py-2"
            >
              ← Voltar
            </Button>
            <h1 className="text-lg md:text-xl font-bold">🛒 Meu Carrinho</h1>
            <div className="w-16 md:w-20"></div>
          </div>
        </div>

        <div className="flex-1 max-w-4xl mx-auto p-3 space-y-3">
          {carrinho.length === 0 ? (
            <div className="text-center py-16 animate-fadeInScale">
              <div className="bg-gradient-to-br from-orange-100 to-yellow-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 animate-bounce-custom">
                <ShoppingCart className="w-10 h-10 text-orange-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-700 mb-2">Carrinho vazio</h2>
              <p className="text-gray-500 mb-6 text-sm">Que tal adicionar algumas bebidas geladas?</p>
              <Button
                onClick={() => setTelaAtual("cardapio")}
                className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold px-6 py-3 rounded-xl hover-lift animate-pulse-custom"
              >
                🍻 Ver Cardápio
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {carrinho.map((item, index) => (
                  <Card
                    key={item.bebida.id}
                    className="shadow-lg border-0 bg-gradient-to-r from-white to-orange-50 hover-lift transition-all duration-300 hover:shadow-xl animate-fadeInUp"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="p-4">
                      {/* Layout Mobile Otimizado */}
                      <div className="space-y-3">
                        {/* Linha 1: Imagem + Nome + Preço */}
                        <div className="flex items-center space-x-3">
                          <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 animate-fadeInScale">
                            <Image
                              src={item.bebida.imagem || "/placeholder.svg"}
                              alt={item.bebida.nome}
                              width={56}
                              height={56}
                              className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-base text-gray-800 truncate">{item.bebida.nome}</h3>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-lg font-bold text-green-600">
                                R$ {item.bebida.preco.toFixed(2)}
                              </span>
                              {item.bebida.categoria && (
                                <Badge
                                  className={`text-xs px-2 py-1 ${getCorCategoria(item.bebida.categoria.cor).classeBg} ${getCorCategoria(item.bebida.categoria.cor).classeTexto} animate-slideInRight`}
                                >
                                  {item.bebida.categoria.nome}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Linha 2: Controles de Quantidade */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-2 animate-slideInLeft">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removerDoCarrinho(item.bebida.id)}
                              className="h-8 w-8 p-0 border-orange-300 hover:bg-orange-100 hover-lift transition-all duration-200"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="font-bold text-lg w-8 text-center animate-pulse">{item.quantidade}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => adicionarAoCarrinho(item.bebida)}
                              disabled={item.quantidade >= item.bebida.estoque}
                              className="h-8 w-8 p-0 border-orange-300 hover:bg-orange-100 hover-lift transition-all duration-200"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>

                          {/* Subtotal do Item */}
                          <div className="text-right animate-slideInRight">
                            <span className="text-lg font-bold text-orange-600">
                              R$ {(item.bebida.preco * item.quantidade).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Card do Total */}
              <Card className="bg-gradient-to-r from-green-50 to-yellow-50 border-2 border-green-300 shadow-xl hover-lift animate-fadeInScale">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 animate-bounce">💰 Total do Pedido</h3>
                    <div className="space-y-1 mb-2 animate-fadeInUp">
                      <div className="text-base text-gray-600">Subtotal: R$ {subtotalItens.toFixed(2)}</div>
                      <div className="text-base text-gray-600">
                        Taxa de entrega: R$ {calcularTaxaEntrega().toFixed(2)}
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-green-600 mb-2 animate-pulse-custom">
                      R$ {(totalCarrinho + calcularTaxaEntrega()).toFixed(2)}
                    </div>
                    <p className="text-gray-600 text-sm">
                      {totalItens} {totalItens === 1 ? "item" : "itens"} selecionados
                    </p>
                  </div>
                  <Button
                    onClick={() => setTelaAtual("pagamento")}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-lg py-4 rounded-xl font-bold shadow-lg hover-lift animate-glow transition-all duration-300"
                  >
                    💳 Continuar para Pagamento
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Rodapé */}
        <Rodape />
      </div>
    )
  }

  // TELA INICIAL - COM ANIMAÇÕES MELHORADAS
  if (telaAtual === "inicio") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-yellow-500 flex flex-col overflow-hidden">
        {/* Elementos flutuantes de fundo - ANIMAÇÕES MELHORADAS */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-float-1"></div>
          <div className="absolute top-32 right-16 w-16 h-16 bg-white/5 rounded-full animate-float-2"></div>
          <div className="absolute bottom-32 left-20 w-12 h-12 bg-white/10 rounded-full animate-float-3"></div>
          <div className="absolute bottom-20 right-32 w-24 h-24 bg-white/5 rounded-full animate-float-4"></div>
          <div className="absolute top-1/2 left-8 w-8 h-8 bg-white/10 rounded-full animate-float-5"></div>
          <div className="absolute top-1/3 right-8 w-14 h-14 bg-white/5 rounded-full animate-float-6"></div>

          {/* Elementos extras para mais movimento */}
          <div
            className="absolute top-1/4 left-1/3 w-6 h-6 bg-yellow-300/20 rounded-full animate-float-1"
            style={{ animationDelay: "3s" }}
          ></div>
          <div
            className="absolute bottom-1/4 right-1/3 w-10 h-10 bg-orange-300/15 rounded-full animate-float-2"
            style={{ animationDelay: "3.5s" }}
          ></div>
          <div
            className="absolute top-3/4 left-1/4 w-18 h-18 bg-white/8 rounded-full animate-float-3"
            style={{ animationDelay: "4s" }}
          ></div>
        </div>

        <div className="flex-1 flex items-center justify-center p-4 relative z-10">
          <div className="text-center space-y-8 max-w-md w-full">
            {/* Logo da empresa com animações */}
            <div className="glass-effect rounded-3xl p-8 shadow-2xl border border-white/20 hover-lift animate-fadeInScale">
              <div className="mb-6">
                <div className="w-48 h-48 mx-auto rounded-full overflow-hidden shadow-2xl border-4 border-white/30 animate-logo-chamativa">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-MAf9kkdTHQNURZA6HEvE69rfyuTkMS.png"
                    alt="Bebidas ON Logo"
                    width={200}
                    height={200}
                    className="w-full h-full object-cover animate-float"
                    priority
                  />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-white mb-2 animate-bounce-custom">BEBIDAS ON</h1>
              <div className="bg-gradient-to-r from-yellow-300 to-green-400 bg-clip-text text-transparent animate-pulse-custom">
                <p className="text-xl font-bold mb-2">🚚 DELIVERY PREMIUM</p>
              </div>
              <p className="text-white/90 text-lg font-medium animate-slideInUp">Buzinou, chegou! 📱</p>
              {modoTeste && (
                <Badge className="mt-3 bg-yellow-500 text-black text-sm animate-bounce">🧪 MODO TESTE ATIVO</Badge>
              )}
            </div>

            {/* Substituir a seção atual dos cards de benefícios e informação de entrega por: */}
            <div className="space-y-4 animate-fadeInUp" style={{ animationDelay: "0.3s" }}>
              <Button
                onClick={() => setTelaAtual("cardapio")}
                className="w-full bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white text-lg py-6 rounded-2xl font-bold shadow-xl hover-lift animate-glow"
              >
                🍻 Ver Cardápio Completo
              </Button>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="glass-effect rounded-xl p-3 border border-white/20 hover-lift animate-slideInLeft stagger-1">
                  <div className="text-2xl mb-1 animate-bounce">⚡</div>
                  <p className="text-white/80 text-xs font-medium">Entrega Rápida</p>
                </div>
                <div className="glass-effect rounded-xl p-3 border border-white/20 hover-lift animate-fadeInScale stagger-2">
                  <div className="text-2xl mb-1 animate-bounce" style={{ animationDelay: "0.2s" }}>
                    🧊
                  </div>
                  <p className="text-white/80 text-xs font-medium">Sempre Gelado</p>
                </div>
                <div className="glass-effect rounded-xl p-3 border border-white/20 hover-lift animate-slideInRight stagger-3">
                  <div className="text-2xl mb-1 animate-bounce" style={{ animationDelay: "0.4s" }}>
                    💳
                  </div>
                  <p className="text-white/80 text-xs font-medium">Pix, Cartão ou Dinheiro</p>
                </div>
              </div>

              {/* Card compacto de pedido mínimo */}
              <div
                className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 animate-fadeInUp"
                style={{ animationDelay: "0.5s" }}
              >
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <div className="text-2xl animate-moto-parada">🏍️</div>
                    <h4 className="text-lg font-bold text-white">Pedido Mínimo</h4>
                  </div>
                  <p className="text-white/90 text-sm font-semibold">
                    Entrega disponível para pedidos <span className="text-yellow-300 font-bold">acima de R$ 20,00</span>
                  </p>
                  <p className="text-white/80 text-xs mt-1">
                    Taxa: R$ {TAXA_ENTREGA.toFixed(2)} • Retirada sempre gratuita
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <Rodape />
      </div>
    )
  }

  // TELA DO CARDÁPIO (padrão)
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex flex-col">
      <div className="bg-gradient-to-r from-orange-400 via-orange-500 to-yellow-500 p-4 text-white sticky top-0 z-10 shadow-lg">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => setTelaAtual("inicio")}
            className="text-white hover:bg-white/20 font-semibold hover-lift"
          >
            ← Início
          </Button>
          <div className="flex items-center space-x-3">
            <div
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/30 cursor-pointer hover-lift animate-logo-suave"
              onDoubleClick={acessoAdmin}
            >
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-MAf9kkdTHQNURZA6HEvE69rfyuTkMS.png"
                alt="Logo"
                width={40}
                height={40}
                className="w-full h-full object-cover animate-float"
              />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold">Cardápio</h1>
              {modoTeste && <Badge className="bg-yellow-500 text-black text-xs">🧪 TESTE</Badge>}
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={() => setTelaAtual("carrinho")}
            className="text-white hover:bg-white/20 relative font-semibold hover-lift"
          >
            <ShoppingCart className="w-6 h-6 mr-2" />
            <span className="hidden sm:inline">Carrinho</span>
            {totalItens > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full animate-bounce">
                {totalItens}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      <div className="flex-1 max-w-6xl mx-auto p-4">
        {/* Barra de Busca */}
        <div className="mb-6">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Buscar bebidas..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-10 py-3 rounded-xl border-orange-300 focus:border-orange-500"
            />
          </div>
        </div>

        {/* Filtros de Categoria */}
        <div className="flex flex-wrap gap-3 mb-6 justify-center overflow-x-auto pb-2">
          <Button
            variant={categoriaFiltro === "todas" ? "default" : "outline"}
            onClick={() => setCategoriaFiltro("todas")}
            className="px-4 py-2 hover-lift transition-all duration-300 whitespace-nowrap"
          >
            Todas
          </Button>
          {categorias.map((categoria) => {
            const IconeComponent = getIconeCategoria(categoria.icone)
            const corInfo = getCorCategoria(categoria.cor)
            return (
              <Button
                key={categoria.id}
                variant={categoriaFiltro === categoria.id ? "default" : "outline"}
                onClick={() => setCategoriaFiltro(categoria.id)}
                className={`px-4 py-2 hover-lift transition-all duration-300 whitespace-nowrap ${
                  categoriaFiltro === categoria.id
                    ? `${corInfo.classe} text-white hover:${corInfo.classe}/90`
                    : `border-2 ${corInfo.classeTexto} hover:${corInfo.classeBg}`
                }`}
              >
                <IconeComponent className="w-4 h-4 mr-2" />
                {categoria.nome}
              </Button>
            )
          })}
        </div>

        {/* Lista de Bebidas */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {bebidasFiltradas.map((bebida, index) => {
            const IconeComponent = bebida.categoria ? getIconeCategoria(bebida.categoria.icone) : Package
            const corInfo = bebida.categoria ? getCorCategoria(bebida.categoria.cor) : getCorCategoria("amber")

            return (
              <Card
                key={bebida.id}
                className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50 hover-lift transition-all duration-300 hover:shadow-xl animate-fadeInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="relative mb-4">
                    <div className="w-full h-48 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={bebida.imagem || "/placeholder.svg?height=200&width=300&text=Bebida"}
                        alt={bebida.nome}
                        width={300}
                        height={200}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      />
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge className={`${getStatusEstoque(bebida.estoque).cor} text-white animate-pulse`}>
                        {bebida.estoque === 0 ? "Esgotado" : bebida.estoque <= 5 ? `${bebida.estoque}` : "OK"}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h3 className="font-bold text-xl text-gray-800 mb-1">{bebida.nome}</h3>
                      {bebida.descricao && <p className="text-gray-600 text-sm line-clamp-2">{bebida.descricao}</p>}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-green-600">R$ {bebida.preco.toFixed(2)}</span>
                        {bebida.categoria && (
                          <Badge className={`${corInfo.classeBg} ${corInfo.classeTexto} flex items-center space-x-1`}>
                            <IconeComponent className="w-3 h-3" />
                            <span className="hidden md:inline">{bebida.categoria.nome}</span>
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Seletor de Quantidade */}
                    {bebida.estoque > 0 && (
                      <div className="flex items-center justify-center space-x-2 bg-gray-50 rounded-lg p-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setQuantidadeSelecionada(bebida.id, Math.max(1, getQuantidadeSelecionada(bebida.id) - 1))
                          }
                          className="h-8 w-8 p-0 border-orange-300 hover:bg-orange-100"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="font-bold text-lg w-8 text-center">{getQuantidadeSelecionada(bebida.id)}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setQuantidadeSelecionada(
                              bebida.id,
                              Math.min(bebida.estoque, getQuantidadeSelecionada(bebida.id) + 1),
                            )
                          }
                          className="h-8 w-8 p-0 border-orange-300 hover:bg-orange-100"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    )}

                    <Button
                      onClick={() => adicionarAoCarrinho(bebida, getQuantidadeSelecionada(bebida.id))}
                      disabled={bebida.estoque === 0}
                      className={`w-full px-2 py-2 rounded-xl font-semibold text-[10px] sm:text-xs transition-all duration-200 hover-lift flex items-center justify-center gap-1 whitespace-nowrap ${
                        bebida.estoque === 0
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white shadow-lg hover:shadow-xl animate-glow"
                      }`}
                    >
                      {bebida.estoque === 0 ? (
                        "❌ Esgotado"
                      ) : (
                        <>
                          <Plus className="w-3 h-3" />
                          <span>Adicionar ao Carrinho</span>
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {bebidasFiltradas.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-gradient-to-br from-orange-100 to-yellow-100 rounded-full w-24 h-24 flex items-center justify-center gap-2 mx-auto mb-6">
              <Search className="w-12 h-12 text-orange-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Nenhuma bebida encontrada</h2>
            <p className="text-gray-500 mb-6">Tente buscar por outro termo ou categoria</p>
            <Button
              onClick={() => {
                setBusca("")
                setCategoriaFiltro("todas")
              }}
              className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold px-8 py-3 rounded-xl hover-lift"
            >
              🔄 Limpar Filtros
            </Button>
          </div>
        )}
      </div>

      {/* Rodapé */}
      <Rodape />
    </div>
  )
}

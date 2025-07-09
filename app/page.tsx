"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import {
  ShoppingCart,
  Plus,
  Minus,
  Search,
  Package,
  Beer,
  Coffee,
  Zap,
  Wine,
  Droplets,
  Sparkles,
  CupSoda,
  Instagram,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { createClient } from "@supabase/supabase-js"
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

// Adicionar função para detectar iOS no início do componente, após as interfaces
const detectarIOS = () => {
  if (typeof window === "undefined") return false
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  )
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
  const [modoTeste, setModoTeste] = useState(false) // 🔴 MODO PRODUÇÃO POR PADRÃO
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
    descricao: "",
  })

  const [editandoItem, setEditandoItem] = useState<Bebida | null>(null)
  const [editandoCategoria, setEditandoCategoria] = useState<Categoria | null>(null)

  const comprovanteRef = useRef<HTMLDivElement>(null)

  // 💾 CARREGAR DADOS - OTIMIZADO PARA CARREGAMENTO RÁPIDO
  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    try {
      if (modoTeste) {
        console.log("🧪 Carregando dados de teste...")
        carregarDadosTeste()
      } else {
        console.log("🔄 Carregando dados do Supabase...")
        // ⚡ CARREGAMENTO PARALELO E INSTANTÂNEO
        const promises = [carregarCategorias(), carregarBebidas(), carregarPedidos()]
        await Promise.allSettled(promises) // Usar allSettled para não falhar se um der erro
        console.log("✅ Dados carregados do Supabase com sucesso!")
      }
    } catch (error) {
      console.error("❌ Erro crítico ao carregar dados:", error)
      addToast({
        type: "error",
        title: "❌ Erro crítico",
        description: "Falha ao inicializar o sistema.",
      })
    }
  }

  // 🧪 DADOS DE TESTE - MAIS PRODUTOS PARA DEMONSTRAÇÃO
  const carregarDadosTeste = () => {
    const categoriasTeste: Categoria[] = [
      { id: 1, nome: "Cervejas", icone: "beer", cor: "amber", ativo: true },
      { id: 2, nome: "Refrigerantes", icone: "cup-soda", cor: "blue", ativo: true },
      { id: 3, nome: "Energéticos", icone: "zap", cor: "green", ativo: true },
      { id: 4, nome: "Ices", icone: "sparkles", cor: "pink", ativo: true },
      { id: 5, nome: "Palheiros", icone: "package", cor: "red", ativo: true },
      { id: 6, nome: "Salgadinhos", icone: "package", cor: "purple", ativo: true },
      { id: 7, nome: "Sucos", icone: "droplets", cor: "green", ativo: true },
    ]

    const bebidasTeste: Bebida[] = [
      // Cervejas
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
        nome: "Heineken Long Neck 330ml",
        descricao: "Cerveja premium importada",
        preco: 7.5,
        categoria_id: 1,
        categoria: categoriasTeste[0],
        imagem: "/placeholder.svg?height=200&width=300&text=Heineken",
        estoque: 12,
        ativo: true,
      },
      {
        id: 3,
        nome: "Brahma Duplo Malte 350ml",
        descricao: "Cerveja encorpada e saborosa",
        preco: 5.2,
        categoria_id: 1,
        categoria: categoriasTeste[0],
        imagem: "/placeholder.svg?height=200&width=300&text=Brahma",
        estoque: 18,
        ativo: true,
      },

      // Refrigerantes
      {
        id: 4,
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
        id: 5,
        nome: "Guaraná Antarctica 2L",
        descricao: "Refrigerante de guaraná brasileiro",
        preco: 7.5,
        categoria_id: 2,
        categoria: categoriasTeste[1],
        imagem: "/placeholder.svg?height=200&width=300&text=Guarana",
        estoque: 20,
        ativo: true,
      },

      // Energéticos
      {
        id: 6,
        nome: "Red Bull 250ml",
        descricao: "Energético que te dá asas",
        preco: 12.9,
        categoria_id: 3,
        categoria: categoriasTeste[2],
        imagem: "/placeholder.svg?height=200&width=300&text=Red+Bull",
        estoque: 8,
        ativo: true,
      },
      {
        id: 7,
        nome: "Monster Energy 473ml",
        descricao: "Energético com sabor intenso",
        preco: 15.9,
        categoria_id: 3,
        categoria: categoriasTeste[2],
        imagem: "/placeholder.svg?height=200&width=300&text=Monster",
        estoque: 6,
        ativo: true,
      },

      // Ices
      {
        id: 8,
        nome: "Smirnoff Ice 275ml",
        descricao: "Bebida refrescante com vodka",
        preco: 8.5,
        categoria_id: 4,
        categoria: categoriasTeste[3],
        imagem: "/placeholder.svg?height=200&width=300&text=Smirnoff+Ice",
        estoque: 10,
        ativo: true,
      },

      // Produto com nome muito longo para testar layout
      {
        id: 9,
        nome: "LICOR BALLENA CHOCOLATE E CARAMELO 750 ML",
        descricao: "Licor premium sabor chocolate e caramelo",
        preco: 160.0,
        categoria_id: 4,
        categoria: categoriasTeste[3],
        imagem: "/placeholder.svg?height=200&width=300&text=Licor+Ballena",
        estoque: 3,
        ativo: true,
      },

      // Sucos
      {
        id: 10,
        nome: "Suco Del Valle Laranja 1L",
        descricao: "Suco natural de laranja",
        preco: 6.5,
        categoria_id: 7,
        categoria: categoriasTeste[6],
        imagem: "/placeholder.svg?height=200&width=300&text=Del+Valle",
        estoque: 14,
        ativo: true,
      },
    ]

    setCategorias(categoriasTeste)
    setBebidas(bebidasTeste)
    console.log("✅ Dados de teste carregados:", bebidasTeste.length, "bebidas")
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
      const extraRandom = Math.floor(Math.random() * 100000)
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
      const { data, error } = await supabase.from("categorias").select("*").eq("ativo", true).order("nome").limit(50)

      if (error) throw error
      setCategorias(data || [])
      console.log("✅ Categorias carregadas:", data?.length)
    } catch (error) {
      console.error("❌ Erro ao carregar categorias:", error)
      // Não fazer throw para não quebrar o carregamento
    }
  }

  const carregarBebidas = async () => {
    try {
      // ⚡ CARREGAMENTO OTIMIZADO COM JOIN
      const { data: bebidasData, error: bebidasError } = await supabase
        .from("bebidas")
        .select(`
        *,
        categorias (
          id,
          nome,
          icone,
          cor,
          ativo
        )
      `)
        .eq("ativo", true)
        .order("nome")
        .limit(100)

      if (bebidasError) throw bebidasError

      const bebidasComCategorias = (bebidasData || []).map((bebida) => ({
        ...bebida,
        categoria: bebida.categorias || null,
      }))

      setBebidas(bebidasComCategorias)
      console.log("✅ Bebidas carregadas:", bebidasComCategorias.length)
    } catch (error) {
      console.error("❌ Erro ao carregar bebidas:", error)
      // Não fazer throw para não quebrar o carregamento
    }
  }

  const carregarPedidos = async () => {
    try {
      const { data, error } = await supabase
        .from("pedidos")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50)

      if (error) throw error

      const pedidosFormatados = (data || []).map((pedido) => ({
        id: pedido.id,
        data: new Date(pedido.created_at).toLocaleString("pt-BR"),
        itens: pedido.itens || [],
        total: pedido.total,
        formaPagamento: pedido.forma_pagamento,
        valorPago: pedido.valor_pago,
        troco: pedido.troco,
        cliente: pedido.cliente,
        tipoEntrega: pedido.tipo_entrega,
        enderecoEntrega: pedido.endereco_entrega,
        localizacao: pedido.localizacao,
        status: pedido.status || "enviado",
      }))

      setPedidos(pedidosFormatados)
      console.log("✅ Pedidos carregados:", pedidosFormatados.length)
    } catch (error) {
      console.error("❌ Erro ao carregar pedidos:", error)
      // Não fazer throw para não quebrar o carregamento
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

    addToast({
      type: "success",
      title: "Adicionado ao carrinho!",
      description: `${quantidade}x ${bebida.nome}`,
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
      return valor - totalComTaxa
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
          addToast({
            type: "info",
            title: "📍 Localização capturada!",
            description: "Sua localização será enviada junto com o pedido",
          })
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

      // ⚡ COMPORTAMENTO AUTOMÁTICO PARA TODOS OS DISPOSITIVOS
      setTimeout(async () => {
        await compartilharComprovanteAutomatico(novoPedido)
        setTelaAtual("comprovante")
      }, 300)

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

    const isIOS = detectarIOS()

    if (isIOS) {
      addToast({
        type: "info",
        title: "📱 Abrindo WhatsApp...",
        description: "Se não abrir automaticamente, copie e cole a mensagem",
        duration: 3000,
      })
    }

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
        mensagem += `\n`
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

      if (isIOS) {
        setTimeout(() => {
          addToast({
            type: "success",
            title: "✅ Mensagem preparada!",
            description: "WhatsApp deve ter aberto com seu pedido",
            duration: 3000,
          })
        }, 1500)
      }

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
        description: isIOS
          ? "Tente abrir o WhatsApp manualmente e colar a mensagem"
          : "Ocorreu um erro ao tentar compartilhar o comprovante.",
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

      try {
        const whatsappUrl = `https://wa.me/${TELEFONE_WHATSAPP}?text=${encodeURIComponent(mensagem)}`
        window.location.href = whatsappUrl
        console.log("✅ Método location.href executado")

        setTimeout(() => {
          const popup = window.open(whatsappUrl, "_blank", "noopener,noreferrer")
          if (popup) {
            popup.focus()
          }
          console.log("✅ Método window.open executado")
        }, 50)

        setTimeout(() => {
          const link = document.createElement("a")
          link.href = whatsappUrl
          link.target = "_blank"
          link.rel = "noopener noreferrer"
          link.style.position = "absolute"
          link.style.left = "-9999px"
          document.body.appendChild(link)

          const touchStart = new TouchEvent("touchstart", { bubbles: true })
          const touchEnd = new TouchEvent("touchend", { bubbles: true })
          const click = new MouseEvent("click", { bubbles: true })

          link.dispatchEvent(touchStart)
          link.dispatchEvent(touchEnd)
          link.dispatchEvent(click)
          link.click()

          setTimeout(() => document.body.removeChild(link), 100)
          console.log("✅ Método link com eventos de toque executado")
        }, 100)
      } catch (error) {
        console.error("❌ Erro nos métodos automáticos:", error)
        window.open(`https://wa.me/${TELEFONE_WHATSAPP}?text=${encodeURIComponent(mensagem)}`, "_blank")
      }

      addToast({
        type: "success",
        title: "🚀 WhatsApp abrindo automaticamente!",
        description: "Seu pedido está sendo enviado...",
        duration: 2000,
      })

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
      const novaCategoriaTeste: Categoria = {
        id: Date.now(),
        nome: novaCategoria.nome,
        icone: novaCategoria.icone,
        cor: novaCategoria.cor,
        ativo: true,
      }
      setCategorias((prev) => [...prev, novaCategoriaTeste])
      setNovaCategoria({ nome: "", icone: "package", cor: "amber", descricao: "" })
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

      setNovaCategoria({ nome: "", icone: "package", cor: "amber", descricao: "" })
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
        title: "🧪 Modo demonstração ativado!",
        description: "Agora você está no modo de demonstração com dados fictícios.",
      })
    } else if (senha === "producao123") {
      console.log("🔴 Modo produção ativado")
      setModoTeste(false)
      addToast({
        type: "success",
        title: "🔴 Modo produção ativado!",
        description: "Voltando aos dados reais do banco.",
      })
      carregarDados() // Recarregar dados reais
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
    console.log("🔧 Editando bebida:", editandoItem)
    if (
      !editandoItem ||
      !editandoItem.nome.trim() ||
      !editandoItem.preco ||
      editandoItem.preco <= 0 ||
      !editandoItem.categoria_id
    ) {
      addToast({
        type: "error",
        title: "Campos obrigatórios ausentes!",
        description: "Preencha todos os campos obrigatórios para editar a bebida.",
      })
      return
    }

    if (modoTeste) {
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
    console.log("🔧 Editando categoria:", editandoCategoria)
    if (!editandoCategoria || !editandoCategoria.nome.trim()) {
      addToast({
        type: "error",
        title: "Nome da categoria ausente!",
        description: "Por favor, digite o nome da categoria.",
      })
      return
    }

    if (modoTeste) {
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

  // TELA INICIAL - SEM BADGE DE DEMONSTRAÇÃO
  if (telaAtual === "inicio") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-yellow-500 flex flex-col overflow-hidden">
        {/* Elementos flutuantes de fundo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-float-1"></div>
          <div className="absolute top-32 right-16 w-16 h-16 bg-white/5 rounded-full animate-float-2"></div>
          <div className="absolute bottom-32 left-20 w-12 h-12 bg-white/10 rounded-full animate-float-3"></div>
          <div className="absolute bottom-20 right-32 w-24 h-24 bg-white/5 rounded-full animate-float-4"></div>
          <div className="absolute top-1/2 left-8 w-8 h-8 bg-white/10 rounded-full animate-float-5"></div>
          <div className="absolute top-1/3 right-8 w-14 h-14 bg-white/5 rounded-full animate-float-6"></div>
        </div>

        <div className="flex-1 flex items-center justify-center p-4 relative z-10">
          <div className="text-center space-y-8 max-w-md w-full">
            {/* Logo da empresa com animações */}
            <div className="glass-effect rounded-3xl p-8 shadow-2xl border border-white/20 hover-lift animate-fadeInScale">
              <div className="mb-6">
                <div className="w-48 h-48 mx-auto rounded-full overflow-hidden shadow-2xl border-4 border-white/30 animate-logo-chamativa">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-WvajSz47R3BLLDpToPYwJTlba8FRIH.png"
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
              {modoTeste && <Badge className="mt-3 bg-yellow-500 text-black text-sm animate-bounce">🧪 DEMO</Badge>}
            </div>

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
  // TELA DO CARRINHO
  if (telaAtual === "carrinho") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
        <div className="bg-gradient-to-r from-orange-400 via-orange-500 to-yellow-500 p-4 text-white sticky top-0 z-10 shadow-lg">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => setTelaAtual("cardapio")}
              className="text-white hover:bg-white/20 font-semibold"
            >
              ← Voltar
            </Button>
            <h1 className="text-2xl font-bold">Carrinho</h1>
            <div className="w-20"></div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-4">
          {carrinho.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-gradient-to-br from-orange-100 to-yellow-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="w-12 h-12 text-orange-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-700 mb-2">Carrinho vazio</h2>
              <p className="text-gray-500 mb-6">Adicione algumas bebidas para continuar</p>
              <Button
                onClick={() => setTelaAtual("cardapio")}
                className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold px-8 py-3 rounded-xl"
              >
                🍻 Ver Cardápio
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Itens do Carrinho */}
              <div className="space-y-4">
                {carrinho.map((item) => (
                  <Card key={item.bebida.id} className="shadow-lg">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={item.bebida.imagem || "/placeholder.svg?height=64&width=64&text=Bebida"}
                            alt={item.bebida.nome}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg">{item.bebida.nome}</h3>
                          <p className="text-gray-600">R$ {item.bebida.preco.toFixed(2)} cada</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removerDoCarrinho(item.bebida.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="font-bold text-lg w-8 text-center">{item.quantidade}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => adicionarAoCarrinho(item.bebida, 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-green-600">
                            R$ {(item.bebida.preco * item.quantidade).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Resumo do Pedido */}
              <Card className="shadow-lg bg-gradient-to-r from-green-50 to-blue-50">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Resumo do Pedido</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal ({totalItens} itens):</span>
                      <span className="font-semibold">R$ {subtotalItens.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxa de entrega:</span>
                      <span className="font-semibold">
                        {tipoEntrega === "entrega" ? `R$ ${TAXA_ENTREGA.toFixed(2)}` : "Grátis"}
                      </span>
                    </div>
                    <div className="border-t pt-2 flex justify-between text-xl font-bold text-green-600">
                      <span>Total:</span>
                      <span>R$ {(totalCarrinho + (tipoEntrega === "entrega" ? TAXA_ENTREGA : 0)).toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tipo de Entrega */}
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Tipo de Entrega</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant={tipoEntrega === "retirada" ? "default" : "outline"}
                      onClick={() => setTipoEntrega("retirada")}
                      className="p-4 h-auto flex flex-col items-center space-y-2"
                    >
                      <div className="text-2xl">🏪</div>
                      <div>
                        <div className="font-bold">Retirada</div>
                        <div className="text-sm opacity-70">Grátis</div>
                      </div>
                    </Button>
                    <Button
                      variant={tipoEntrega === "entrega" ? "default" : "outline"}
                      onClick={() => setTipoEntrega("entrega")}
                      className="p-4 h-auto flex flex-col items-center space-y-2"
                      disabled={totalCarrinho < PEDIDO_MINIMO_ENTREGA}
                    >
                      <div className="text-2xl">🚚</div>
                      <div>
                        <div className="font-bold">Entrega</div>
                        <div className="text-sm opacity-70">R$ {TAXA_ENTREGA.toFixed(2)}</div>
                      </div>
                    </Button>
                  </div>
                  {totalCarrinho < PEDIDO_MINIMO_ENTREGA && (
                    <p className="text-red-600 text-sm mt-2 text-center">
                      Pedido mínimo para entrega: R$ {PEDIDO_MINIMO_ENTREGA.toFixed(2)}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Endereço de Entrega */}
              {tipoEntrega === "entrega" && (
                <Card className="shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">Endereço de Entrega</h3>
                    <Input
                      type="text"
                      placeholder="Digite seu endereço completo (opcional)..."
                      value={enderecoEntrega}
                      onChange={(e) => setEnderecoEntrega(e.target.value)}
                      className="w-full"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      💡 Se informar o endereço, enviaremos sua localização junto com o pedido
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Botão Finalizar */}
              <Button
                onClick={() => setTelaAtual("pagamento")}
                disabled={carrinho.length === 0}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-4 text-lg rounded-xl"
              >
                🛒 Finalizar Pedido
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // TELA DE PAGAMENTO
  if (telaAtual === "pagamento") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
        <div className="bg-gradient-to-r from-orange-400 via-orange-500 to-yellow-500 p-4 text-white sticky top-0 z-10 shadow-lg">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => setTelaAtual("carrinho")}
              className="text-white hover:bg-white/20 font-semibold"
            >
              ← Voltar
            </Button>
            <h1 className="text-2xl font-bold">Pagamento</h1>
            <div className="w-20"></div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto p-4 space-y-6">
          {/* Resumo Final */}
          <Card className="shadow-lg bg-gradient-to-r from-green-50 to-blue-50">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Resumo Final</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>R$ {subtotalItens.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Entrega:</span>
                  <span>{tipoEntrega === "entrega" ? `R$ ${TAXA_ENTREGA.toFixed(2)}` : "Grátis"}</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-xl font-bold text-green-600">
                  <span>Total:</span>
                  <span>R$ {(totalCarrinho + (tipoEntrega === "entrega" ? TAXA_ENTREGA : 0)).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Forma de Pagamento */}
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Forma de Pagamento</h3>
              <div className="grid grid-cols-3 gap-4">
                <Button
                  variant={formaPagamento === "pix" ? "default" : "outline"}
                  onClick={() => setFormaPagamento("pix")}
                  className="p-4 h-auto flex flex-col items-center space-y-2"
                >
                  <div className="text-2xl">📱</div>
                  <div className="font-bold">PIX</div>
                </Button>
                <Button
                  variant={formaPagamento === "cartao" ? "default" : "outline"}
                  onClick={() => setFormaPagamento("cartao")}
                  className="p-4 h-auto flex flex-col items-center space-y-2"
                >
                  <div className="text-2xl">💳</div>
                  <div className="font-bold">Cartão</div>
                </Button>
                <Button
                  variant={formaPagamento === "dinheiro" ? "default" : "outline"}
                  onClick={() => setFormaPagamento("dinheiro")}
                  className="p-4 h-auto flex flex-col items-center space-y-2"
                >
                  <div className="text-2xl">💵</div>
                  <div className="font-bold">Dinheiro</div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Valor Pago (apenas para dinheiro) */}
          {formaPagamento === "dinheiro" && (
            <Card className="shadow-lg border-orange-200">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 text-orange-800">💵 Dinheiro</h3>
                <p className="text-sm text-gray-600 mb-2">Pagamento na entrega</p>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Valor que você vai pagar:</label>
                  <Input
                    type="number"
                    placeholder={`Mínimo: R$ ${(totalCarrinho + (tipoEntrega === "entrega" ? TAXA_ENTREGA : 0)).toFixed(2)}`}
                    value={valorPago}
                    onChange={(e) => setValorPago(e.target.value)}
                    className="w-full text-lg border-yellow-300 focus:border-yellow-500"
                    step="0.01"
                    min={(totalCarrinho + (tipoEntrega === "entrega" ? TAXA_ENTREGA : 0)).toFixed(2)}
                  />
                </div>

                {valorPago && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-lg">
                        <span>Total do pedido:</span>
                        <span className="font-bold">
                          R$ {(totalCarrinho + (tipoEntrega === "entrega" ? TAXA_ENTREGA : 0)).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-lg">
                        <span>Valor que você vai pagar:</span>
                        <span className="font-bold">R$ {Number.parseFloat(valorPago || "0").toFixed(2)}</span>
                      </div>
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between text-xl font-bold">
                          <span>Troco:</span>
                          <span className={calcularTroco() >= 0 ? "text-green-600" : "text-red-600"}>
                            {calcularTroco() === 0
                              ? "✅ Não precisa de troco"
                              : calcularTroco() > 0
                                ? `R$ ${calcularTroco().toFixed(2)}`
                                : `❌ Falta R$ ${Math.abs(calcularTroco()).toFixed(2)}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Dados PIX */}
          {formaPagamento === "pix" && (
            <Card className="shadow-lg bg-green-50 border-green-200">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 text-green-800 flex items-center">📱 Dados PIX</h3>
                <div className="bg-white border-2 border-green-300 rounded-lg p-4 mb-4">
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-semibold text-gray-600">Chave PIX:</span>
                      <div className="font-bold text-lg text-green-700">{CHAVE_PIX}</div>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-600">Nome:</span>
                      <div className="font-semibold text-gray-800">{NOME_PIX}</div>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-600">Banco:</span>
                      <div className="font-semibold text-gray-800">{BANCO_PIX}</div>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(CHAVE_PIX)
                    addToast({
                      type: "success",
                      title: "Chave PIX copiada!",
                      description: "A chave PIX foi copiada para a área de transferência",
                    })
                  }}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg mb-3"
                >
                  📋 Copiar Chave PIX
                </Button>
                <p className="text-center text-sm text-gray-600">
                  Após fazer o PIX, envie o comprovante junto com o pedido
                </p>
              </CardContent>
            </Card>
          )}

          {/* Botão Finalizar */}
          <Button
            onClick={finalizarPedido}
            disabled={carregando || (formaPagamento === "dinheiro" && calcularTroco() < 0)}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-4 text-lg rounded-xl"
          >
            {carregando ? "Processando..." : "🚀 Confirmar Pedido"}
          </Button>
        </div>
      </div>
    )
  }

  // TELA DO COMPROVANTE
  if (telaAtual === "comprovante" && pedidoAtual) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-white">
        <div className="bg-gradient-to-r from-green-600 to-blue-600 p-4 text-white sticky top-0 z-10 shadow-lg">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => setTelaAtual("inicio")}
              className="text-white hover:bg-white/20 font-semibold"
            >
              ← Início
            </Button>
            <h1 className="text-2xl font-bold">Comprovante</h1>
            <div className="w-20"></div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto p-4">
          <div ref={comprovanteRef} className="bg-white text-black rounded-lg shadow-2xl p-6 space-y-6">
            {/* Cabeçalho */}
            <div className="text-center border-b pb-4">
              <div className="w-16 h-16 mx-auto rounded-full overflow-hidden mb-4">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-WvajSz47R3BLLDpToPYwJTlba8FRIH.png"
                  alt="Logo"
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-2xl font-bold text-orange-600">BEBIDAS ON</h2>
              <p className="text-gray-600">Delivery Premium</p>
              <p className="text-sm text-gray-500">{TELEFONE_DISPLAY}</p>
            </div>

            {/* Dados do Pedido */}
            <div className="space-y-2">
              <h3 className="text-lg font-bold">Dados do Pedido</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold">Pedido:</span> #{pedidoAtual.id}
                </div>
                <div>
                  <span className="font-semibold">Data:</span> {pedidoAtual.data}
                </div>
                <div>
                  <span className="font-semibold">Cliente:</span> {pedidoAtual.cliente}
                </div>
                <div>
                  <span className="font-semibold">Tipo:</span>{" "}
                  {pedidoAtual.tipoEntrega === "entrega" ? "🚚 Entrega" : "🏪 Retirada"}
                </div>
              </div>
              {pedidoAtual.enderecoEntrega && (
                <div className="text-sm">
                  <span className="font-semibold">Endereço:</span> {pedidoAtual.enderecoEntrega}
                </div>
              )}
            </div>

            {/* Itens */}
            <div className="space-y-2">
              <h3 className="text-lg font-bold">Itens do Pedido</h3>
              <div className="space-y-2">
                {pedidoAtual.itens.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div>
                      <div className="font-semibold">
                        {item.quantidade}x {item.bebida.nome}
                      </div>
                      <div className="text-sm text-gray-600">R$ {item.bebida.preco.toFixed(2)} cada</div>
                    </div>
                    <div className="font-bold">R$ {(item.bebida.preco * item.quantidade).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totais */}
            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>R$ {subtotalItens.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxa de entrega:</span>
                <span>{pedidoAtual.tipoEntrega === "entrega" ? `R$ ${TAXA_ENTREGA.toFixed(2)}` : "R$ 0,00"}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-green-600 border-t pt-2">
                <span>Total:</span>
                <span>R$ {pedidoAtual.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Pagamento */}
            <div className="space-y-2 border-t pt-4">
              <h3 className="text-lg font-bold">Pagamento</h3>
              <div className="flex justify-between">
                <span>Forma:</span>
                <span className="font-semibold">{pedidoAtual.formaPagamento.toUpperCase()}</span>
              </div>
              {pedidoAtual.formaPagamento === "dinheiro" && (
                <>
                  <div className="flex justify-between">
                    <span>Valor pago:</span>
                    <span>R$ {pedidoAtual.valorPago?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Troco:</span>
                    <span>R$ {(pedidoAtual.troco || 0).toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>

            {/* Status */}
            <div className="text-center bg-yellow-100 p-4 rounded-lg">
              <p className="font-bold text-yellow-800">⏰ Aguardando confirmação</p>
              <p className="text-sm text-yellow-700">Seu pedido foi enviado via WhatsApp</p>
            </div>
          </div>

          {/* Botões */}
          <div className="mt-6 space-y-4">
            <Button
              onClick={compartilharComprovante}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 text-lg rounded-xl"
            >
              📱 Enviar para WhatsApp
            </Button>
            <Button
              onClick={salvarComprovante}
              disabled={capturandoImagem}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl"
            >
              {capturandoImagem ? "Salvando..." : "💾 Salvar Comprovante"}
            </Button>
            <Button
              onClick={() => {
                setCarrinho([])
                setEnderecoEntrega("")
                setValorPago("")
                setFormaPagamento("pix")
                setTipoEntrega("retirada")
                setPedidoAtual(null)
                setTelaAtual("inicio")
              }}
              variant="outline"
              className="w-full border-white text-white hover:bg-white hover:text-black py-3 rounded-xl"
            >
              🏠 Voltar ao Início
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // TELA ADMIN
  if (telaAtual === "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 text-white sticky top-0 z-10 shadow-lg">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => setTelaAtual("inicio")}
              className="text-white hover:bg-white/20 font-semibold"
            >
              ← Sair Admin
            </Button>
            <h1 className="text-2xl font-bold">🔐 Painel Administrativo</h1>
            <div className="flex items-center space-x-2">
              {modoTeste && <Badge className="bg-yellow-500 text-black">🧪 TESTE</Badge>}
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto p-4">
          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">📦</div>
                <h3 className="text-lg font-bold text-blue-800">Produtos</h3>
                <p className="text-3xl font-bold text-blue-600">{bebidas.length}</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">🏷️</div>
                <h3 className="text-lg font-bold text-purple-800">Categorias</h3>
                <p className="text-3xl font-bold text-purple-600">{categorias.length}</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">📋</div>
                <h3 className="text-lg font-bold text-green-800">Pedidos</h3>
                <p className="text-3xl font-bold text-green-600">{pedidos.length}</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-2">💰</div>
                <h3 className="text-lg font-bold text-yellow-800">Vendas Totais</h3>
                <p className="text-2xl font-bold text-yellow-600">
                  R$ {pedidos.reduce((total, pedido) => total + pedido.total, 0).toFixed(2)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 mb-6 bg-white rounded-lg p-1 shadow-lg">
            <Button
              variant={abaAdmin === "categorias" ? "default" : "ghost"}
              onClick={() => setAbaAdmin("categorias")}
              className="flex-1"
            >
              🏷️ Categorias
            </Button>
            <Button
              variant={abaAdmin === "produtos" ? "default" : "ghost"}
              onClick={() => setAbaAdmin("produtos")}
              className="flex-1"
            >
              📦 Produtos
            </Button>
            <Button
              variant={abaAdmin === "pedidos" ? "default" : "ghost"}
              onClick={() => setAbaAdmin("pedidos")}
              className="flex-1"
            >
              📋 Pedidos
            </Button>
          </div>

          {/* ABA CATEGORIAS */}
          {abaAdmin === "categorias" && (
            <div className="space-y-6">
              {/* Gerenciar Categorias Header */}
              <Card className="shadow-lg bg-gradient-to-r from-orange-50 to-yellow-50">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-orange-800 mb-4">🏷️ Gerenciar Categorias</h2>

                  {/* Adicionar Nova Categoria */}
                  <div className="bg-white rounded-lg p-4 border-2 border-orange-200 mb-6">
                    <h3 className="text-lg font-bold mb-4 text-orange-700">➕ Adicionar Nova Categoria</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Input
                        placeholder="Nome da Categoria *"
                        value={novaCategoria.nome}
                        onChange={(e) => setNovaCategoria({ ...novaCategoria, nome: e.target.value })}
                        className="border-orange-300 focus:border-orange-500"
                      />
                      <Input
                        placeholder="Descrição (opcional)"
                        value={novaCategoria.descricao || ""}
                        onChange={(e) => setNovaCategoria({ ...novaCategoria, descricao: e.target.value })}
                        className="border-orange-300 focus:border-orange-500"
                      />
                      <select
                        value={novaCategoria.icone}
                        onChange={(e) => setNovaCategoria({ ...novaCategoria, icone: e.target.value })}
                        className="px-3 py-2 border border-orange-300 rounded-md focus:border-orange-500"
                      >
                        {ICONES_CATEGORIAS.map((icone) => (
                          <option key={icone.valor} value={icone.valor}>
                            {icone.nome}
                          </option>
                        ))}
                      </select>
                      <select
                        value={novaCategoria.cor}
                        onChange={(e) => setNovaCategoria({ ...novaCategoria, cor: e.target.value })}
                        className="px-3 py-2 border border-orange-300 rounded-md focus:border-orange-500"
                      >
                        {CORES_CATEGORIAS.map((cor) => (
                          <option key={cor.valor} value={cor.valor}>
                            {cor.nome}
                          </option>
                        ))}
                      </select>
                    </div>
                    <Button
                      onClick={adicionarNovaCategoria}
                      disabled={carregando}
                      className="mt-4 bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      {carregando ? "Salvando..." : "➕ Adicionar Categoria"}
                    </Button>
                  </div>

                  {/* Categorias Existentes */}
                  <div>
                    <h3 className="text-lg font-bold mb-4 text-gray-700">📂 Categorias Existentes</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categorias.map((categoria) => {
                        const IconeComponent = getIconeCategoria(categoria.icone)
                        const corInfo = getCorCategoria(categoria.cor)
                        const produtosCount = bebidas.filter((b) => b.categoria_id === categoria.id).length

                        return (
                          <Card key={categoria.id} className={`shadow-lg ${corInfo.classeBg} border-2`}>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-2">
                                  <div className={`p-2 rounded-full ${corInfo.classe} text-white`}>
                                    <IconeComponent className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <h4 className={`font-bold ${corInfo.classeTexto}`}>{categoria.nome}</h4>
                                    <p className="text-sm text-gray-600">{produtosCount} produtos</p>
                                    <p className="text-xs text-gray-500">ID: {categoria.id}</p>
                                  </div>
                                </div>
                                <div className="flex space-x-1">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setEditandoCategoria(categoria)}
                                    className="h-8 w-8 p-0 hover:bg-blue-50"
                                  >
                                    ✏️
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => excluirCategoria(categoria.id)}
                                    className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                                  >
                                    🗑️
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Modal Editar Categoria - CORRIGIDO */}
              {editandoCategoria && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <Card className="shadow-lg border-2 border-blue-500 bg-blue-50 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-4 text-blue-800">✏️ Editando: {editandoCategoria.nome}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                          placeholder="Nome da categoria"
                          value={editandoCategoria.nome}
                          onChange={(e) => setEditandoCategoria({ ...editandoCategoria, nome: e.target.value })}
                          className="border-blue-300 focus:border-blue-500"
                        />
                        <select
                          value={editandoCategoria.icone}
                          onChange={(e) => setEditandoCategoria({ ...editandoCategoria, icone: e.target.value })}
                          className="px-3 py-2 border border-blue-300 rounded-md focus:border-blue-500"
                        >
                          {ICONES_CATEGORIAS.map((icone) => (
                            <option key={icone.valor} value={icone.valor}>
                              {icone.nome}
                            </option>
                          ))}
                        </select>
                        <select
                          value={editandoCategoria.cor}
                          onChange={(e) => setEditandoCategoria({ ...editandoCategoria, cor: e.target.value })}
                          className="px-3 py-2 border border-blue-300 rounded-md focus:border-blue-500"
                        >
                          {CORES_CATEGORIAS.map((cor) => (
                            <option key={cor.valor} value={cor.valor}>
                              {cor.nome}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex space-x-2 mt-4">
                        <Button
                          onClick={editarCategoria}
                          disabled={carregando}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {carregando ? "Salvando..." : "💾 Salvar"}
                        </Button>
                        <Button variant="outline" onClick={() => setEditandoCategoria(null)}>
                          ❌ Cancelar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}

          {/* Keep the existing ABA PRODUTOS and ABA PEDIDOS sections unchanged */}
          {abaAdmin === "produtos" && (
            <div className="space-y-6">
              {/* Formulário Novo Produto */}
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">➕ Novo Produto</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Nome do produto"
                      value={novoItem.nome}
                      onChange={(e) => setNovoItem({ ...novoItem, nome: e.target.value })}
                    />
                    <Input
                      placeholder="Preço (ex: 4.50)"
                      type="number"
                      step="0.01"
                      value={novoItem.preco}
                      onChange={(e) => setNovoItem({ ...novoItem, preco: e.target.value })}
                    />
                    <Input
                      placeholder="Descrição"
                      value={novoItem.descricao}
                      onChange={(e) => setNovoItem({ ...novoItem, descricao: e.target.value })}
                    />
                    <Input
                      placeholder="Estoque"
                      type="number"
                      value={novoItem.estoque}
                      onChange={(e) => setNovoItem({ ...novoItem, estoque: e.target.value })}
                    />
                    <select
                      value={novoItem.categoria_id}
                      onChange={(e) => setNovoItem({ ...novoItem, categoria_id: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Selecione uma categoria</option>
                      {categorias.map((categoria) => (
                        <option key={categoria.id} value={categoria.id}>
                          {categoria.nome}
                        </option>
                      ))}
                    </select>
                    <Input
                      placeholder="URL da imagem"
                      value={novoItem.imagem}
                      onChange={(e) => setNovoItem({ ...novoItem, imagem: e.target.value })}
                    />
                  </div>
                  <div className="mt-4">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="mb-2" />
                  </div>
                  <Button
                    onClick={adicionarNovaBebida}
                    disabled={carregando}
                    className="mt-4 bg-green-600 hover:bg-green-700"
                  >
                    {carregando ? "Salvando..." : "➕ Adicionar Produto"}
                  </Button>
                </CardContent>
              </Card>

              {/* Busca de Produtos */}
              <Card className="shadow-lg">
                <CardContent className="p-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="text"
                      placeholder="Buscar produtos..."
                      value={buscaProdutos}
                      onChange={(e) => setBuscaProdutos(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Lista de Produtos */}
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">🍻 Produtos ({produtosFiltrados.length})</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {produtosFiltrados.map((bebida) => (
                      <div key={bebida.id} className="border rounded-lg p-4 space-y-3">
                        <div className="w-full h-32 rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={bebida.imagem || "/placeholder.svg?height=128&width=200&text=Bebida"}
                            alt={bebida.nome}
                            width={200}
                            height={128}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm">{bebida.nome}</h4>
                          <p className="text-xs text-gray-600 line-clamp-2">{bebida.descricao}</p>
                          <div className="flex justify-between items-center mt-2">
                            <span className="font-bold text-green-600">R$ {bebida.preco.toFixed(2)}</span>
                            <Badge className={getStatusEstoque(bebida.estoque).cor}>{bebida.estoque}</Badge>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            value={bebida.estoque}
                            onChange={(e) => atualizarEstoque(bebida.id, Number.parseInt(e.target.value) || 0)}
                            className="flex-1 h-8 text-xs"
                            min="0"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditandoItem(bebida)}
                            className="h-8 w-8 p-0"
                          >
                            ✏️
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => excluirBebida(bebida.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                          >
                            🗑️
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Modal Editar Produto - CORRIGIDO */}
              {editandoItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <Card className="shadow-lg border-2 border-blue-500 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-4">✏️ Editando: {editandoItem.nome}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          placeholder="Nome do produto"
                          value={editandoItem.nome}
                          onChange={(e) => setEditandoItem({ ...editandoItem, nome: e.target.value })}
                        />
                        <Input
                          placeholder="Preço"
                          type="number"
                          step="0.01"
                          value={editandoItem.preco.toString()}
                          onChange={(e) =>
                            setEditandoItem({ ...editandoItem, preco: Number.parseFloat(e.target.value) || 0 })
                          }
                        />
                        <Input
                          placeholder="Descrição"
                          value={editandoItem.descricao || ""}
                          onChange={(e) => setEditandoItem({ ...editandoItem, descricao: e.target.value })}
                        />
                        <Input
                          placeholder="Estoque"
                          type="number"
                          value={editandoItem.estoque.toString()}
                          onChange={(e) =>
                            setEditandoItem({ ...editandoItem, estoque: Number.parseInt(e.target.value) || 0 })
                          }
                        />
                        <select
                          value={editandoItem.categoria_id.toString()}
                          onChange={(e) =>
                            setEditandoItem({ ...editandoItem, categoria_id: Number.parseInt(e.target.value) })
                          }
                          className="px-3 py-2 border border-gray-300 rounded-md"
                        >
                          {categorias.map((categoria) => (
                            <option key={categoria.id} value={categoria.id.toString()}>
                              {categoria.nome}
                            </option>
                          ))}
                        </select>
                        <Input
                          placeholder="URL da imagem"
                          value={editandoItem.imagem}
                          onChange={(e) => setEditandoItem({ ...editandoItem, imagem: e.target.value })}
                        />
                      </div>
                      <div className="mt-4">
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="mb-2" />
                      </div>
                      <div className="flex space-x-2 mt-4">
                        <Button onClick={editarBebida} disabled={carregando} className="bg-blue-600 hover:bg-blue-700">
                          {carregando ? "Salvando..." : "💾 Salvar"}
                        </Button>
                        <Button variant="outline" onClick={() => setEditandoItem(null)}>
                          ❌ Cancelar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}

          {/* ABA PEDIDOS */}
          {abaAdmin === "pedidos" && (
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">📋 Pedidos Recentes ({pedidos.length})</h3>
                <div className="space-y-4">
                  {pedidos.map((pedido) => (
                    <div key={pedido.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold">Pedido #{pedido.id}</h4>
                          <p className="text-sm text-gray-600">{pedido.data}</p>
                          <p className="text-sm">Cliente: {pedido.cliente}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-600 text-lg">R$ {pedido.total.toFixed(2)}</div>
                          <Badge className="bg-yellow-500 text-black">{pedido.status}</Badge>
                        </div>
                      </div>
                      <div className="text-sm">
                        <strong>Tipo:</strong> {pedido.tipoEntrega === "entrega" ? "🚚 Entrega" : "🏪 Retirada"}
                        {pedido.enderecoEntrega && (
                          <div>
                            <strong>Endereço:</strong> {pedido.enderecoEntrega}
                          </div>
                        )}
                        <div>
                          <strong>Pagamento:</strong> {pedido.formaPagamento.toUpperCase()}
                        </div>
                      </div>
                      <div className="text-sm">
                        <strong>Itens:</strong>
                        <ul className="ml-4 mt-1">
                          {pedido.itens.map((item, index) => (
                            <li key={index}>
                              {item.quantidade}x {item.bebida.nome} - R${" "}
                              {(item.bebida.preco * item.quantidade).toFixed(2)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                  {pedidos.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-4xl mb-2">📋</div>
                      <p>Nenhum pedido encontrado</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
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
            className="text-white hover:bg-white/20 font-semib old hover-lift"
          >
            ← Início
          </Button>
          <div className="flex items-center space-x-3">
            <div
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/30 cursor-pointer hover-lift animate-logo-suave"
              onDoubleClick={acessoAdmin}
            >
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-WvajSz47R3BLLDpToPYwJTlba8FRIH.png"
                alt="Logo"
                width={40}
                height={40}
                className="w-full h-full object-cover animate-float"
              />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold">Cardápio</h1>
              {modoTeste && <Badge className="bg-yellow-500 text-black text-xs">🧪 DEMO</Badge>}
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
                      <h3 className="font-bold text-xl text-gray-800 mb-1 leading-tight break-words">{bebida.nome}</h3>
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

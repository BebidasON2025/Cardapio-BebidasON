"use client"

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
  Settings,
  Package,
  Users,
  BarChart3,
  Trash2,
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

// 🗄️ CONFIGURAÇÃO DO SUPABASE
const supabaseUrl = "https://ekavxyxdmorsjgviwgdk.supabase.co"
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrYXZ4eXhkbW9yc2pndml3Z2RrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3MTkwMjUsImV4cCI6MjA2NDI5NTAyNX0.RGQLwr-0zC0PGqX5OKVa5e-RERkc4dgy0SoCw6z5bN0"

const supabase = createClient(supabaseUrl, supabaseKey)

// 📱 TELEFONE
const TELEFONE_WHATSAPP = "5517996311727"
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
  status: "enviado" | "confirmado" | "entregue"
}

const TAXA_ENTREGA = 1.0

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
            <p className="text-lg font-bold text-yellow-400 mb-1">© 2024 Bebidas ON</p>
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
  const [abaAdmin, setAbaAdmin] = useState<"produtos" | "categorias" | "pedidos">("produtos")
  const [contadorVendas, setContadorVendas] = useState(0)
  const [tipoEntrega, setTipoEntrega] = useState<"entrega" | "retirada">("retirada")
  const [enderecoEntrega, setEnderecoEntrega] = useState("")

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
    carregarContadorVendas()
  }, [])

  const carregarDados = async () => {
    await Promise.all([carregarCategorias(), carregarBebidas(), carregarPedidos()])
  }

  const carregarContadorVendas = () => {
    const contador = localStorage.getItem("contadorVendas")
    setContadorVendas(contador ? Number.parseInt(contador) : 0)
  }

  const incrementarContadorVendas = () => {
    const novoContador = contadorVendas + 1
    setContadorVendas(novoContador)
    localStorage.setItem("contadorVendas", novoContador.toString())
    return novoContador
  }

  const carregarCategorias = async () => {
    try {
      console.log("🔄 Carregando categorias...")
      const { data, error } = await supabase.from("categorias").select("*").eq("ativo", true).order("nome")

      if (error) {
        console.error("❌ Erro ao carregar categorias:", error)
        return
      }

      setCategorias(data || [])
      console.log("✅ Categorias carregadas:", data?.length)
    } catch (error) {
      console.error("❌ Erro ao carregar categorias:", error)
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
        return
      }

      const { data: categoriasData, error: categoriasError } = await supabase
        .from("categorias")
        .select("*")
        .eq("ativo", true)

      if (categoriasError) {
        console.error("❌ Erro ao carregar categorias para bebidas:", categoriasError)
      }

      const bebidasComCategorias = (bebidasData || []).map((bebida) => {
        const categoria = (categoriasData || []).find((cat) => cat.id === bebida.categoria_id)
        return { ...bebida, categoria: categoria || null }
      })

      setBebidas(bebidasComCategorias)
      console.log("✅ Bebidas carregadas:", bebidasComCategorias.length)
    } catch (error) {
      console.error("❌ Erro ao carregar bebidas:", error)
    }
  }

  const carregarPedidos = async () => {
    try {
      console.log("🔄 Carregando pedidos...")
      const { data, error } = await supabase
        .from("pedidos")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50)

      if (error) {
        if (error.message.includes("does not exist")) {
          console.log("⚠️ Tabela pedidos ainda não existe")
          setPedidos([])
          return
        }
        console.error("❌ Erro ao carregar pedidos:", error)
        return
      }

      const pedidosLimpos = (data || []).map((pedido) => ({
        ...pedido,
        formaPagamento: pedido.forma_pagamento || "pix",
        tipoEntrega: pedido.tipo_entrega || "retirada",
        enderecoEntrega: pedido.endereco_entrega || "",
        itens: Array.isArray(pedido.itens) ? pedido.itens : [],
      }))

      setPedidos(pedidosLimpos)
      console.log("✅ Pedidos carregados:", data?.length)
    } catch (error) {
      console.error("❌ Erro ao carregar pedidos:", error)
      setPedidos([])
    }
  }

  const adicionarAoCarrinho = (bebida: Bebida) => {
    if (bebida.estoque === 0) {
      alert("❌ Produto esgotado!")
      return
    }

    setCarrinho((prev) => {
      const itemExistente = prev.find((item) => item.bebida.id === bebida.id)
      if (itemExistente) {
        const novaQuantidade = itemExistente.quantidade + 1
        if (novaQuantidade <= bebida.estoque) {
          return prev.map((item) => (item.bebida.id === bebida.id ? { ...item, quantidade: novaQuantidade } : item))
        } else {
          alert(`❌ Estoque insuficiente! Disponível: ${bebida.estoque}`)
          return prev
        }
      }
      return [...prev, { bebida, quantidade: 1 }]
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

  const totalCarrinho =
    carrinho.reduce((total, item) => {
      return total + item.bebida.preco * item.quantidade
    }, 0) + (carrinho.length > 0 && tipoEntrega === "entrega" ? TAXA_ENTREGA : 0)

  const subtotalItens = carrinho.reduce((total, item) => {
    return total + item.bebida.preco * item.quantidade
  }, 0)

  const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0)

  const calcularTroco = () => {
    if (formaPagamento === "dinheiro" && valorPago) {
      const valor = Number.parseFloat(valorPago)
      return valor > totalCarrinho ? valor - totalCarrinho : 0
    }
    return 0
  }

  const finalizarPedido = async () => {
    console.log("🔄 Iniciando finalização do pedido...")

    // Validações
    if (carrinho.length === 0) {
      alert("❌ Carrinho vazio!")
      return
    }

    if (!nomeCliente.trim()) {
      alert("❌ Por favor, informe seu nome")
      return
    }

    if (tipoEntrega === "entrega" && !enderecoEntrega.trim()) {
      alert("❌ Por favor, informe o endereço para entrega")
      return
    }

    if (formaPagamento === "dinheiro" && (!valorPago || Number.parseFloat(valorPago) < totalCarrinho)) {
      alert("❌ Valor pago deve ser maior ou igual ao total do pedido")
      return
    }

    try {
      setCarregando(true)
      console.log("💾 Salvando pedido no banco...")

      const numeroVenda = incrementarContadorVendas()
      const idUnico = `VN-${numeroVenda.toString().padStart(6, "0")}`

      const novoPedido: Pedido = {
        id: idUnico,
        data: new Date().toLocaleString("pt-BR"),
        itens: [...carrinho],
        total: totalCarrinho,
        formaPagamento,
        valorPago: formaPagamento === "dinheiro" ? Number.parseFloat(valorPago) : undefined,
        troco: formaPagamento === "dinheiro" ? calcularTroco() : undefined,
        cliente: nomeCliente,
        tipoEntrega,
        enderecoEntrega: tipoEntrega === "entrega" ? enderecoEntrega : undefined,
        status: "enviado",
      }

      console.log("📋 Dados do pedido:", novoPedido)

      const { error } = await supabase.from("pedidos").insert([
        {
          id: novoPedido.id,
          cliente: novoPedido.cliente,
          total: novoPedido.total,
          forma_pagamento: novoPedido.formaPagamento,
          valor_pago: novoPedido.valorPago,
          troco: novoPedido.troco,
          itens: novoPedido.itens,
          tipo_entrega: novoPedido.tipoEntrega,
          endereco_entrega: novoPedido.enderecoEntrega,
          status: novoPedido.status,
        },
      ])

      if (error) {
        console.error("❌ Erro ao salvar pedido:", error)
        alert(`❌ Erro ao finalizar pedido: ${error.message}`)
        return
      }

      console.log("✅ Pedido salvo com sucesso!")

      // Atualizar estoque
      console.log("📦 Atualizando estoque...")
      for (const item of carrinho) {
        const novoEstoque = item.bebida.estoque - item.quantidade
        const { error: estoqueError } = await supabase
          .from("bebidas")
          .update({ estoque: novoEstoque })
          .eq("id", item.bebida.id)

        if (estoqueError) {
          console.error("❌ Erro ao atualizar estoque:", estoqueError)
        }
      }

      setPedidos((prev) => [novoPedido, ...prev])
      setPedidoAtual(novoPedido)
      await carregarBebidas()
      setTelaAtual("comprovante")

      console.log("✅ Pedido finalizado com sucesso:", novoPedido.id)
    } catch (error) {
      console.error("❌ Erro ao finalizar pedido:", error)
      alert("❌ Erro ao finalizar pedido. Tente novamente.")
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
      mensagem += `👤 *Cliente:* ${pedidoAtual.cliente}\n`
      mensagem += `📅 *Data:* ${pedidoAtual.data}\n`

      if (pedidoAtual.tipoEntrega === "entrega") {
        mensagem += `🚚 *Tipo:* ENTREGA\n`
        mensagem += `📍 *Endereço:* ${pedidoAtual.enderecoEntrega}\n`
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
        setNomeCliente("")
        setEnderecoEntrega("")
        setValorPago("")
        setFormaPagamento("pix")
        setTipoEntrega("retirada")
        setPedidoAtual(null)
        setTelaAtual("inicio")
      }, 2000)
    } catch (error) {
      console.error("Erro ao compartilhar:", error)
      alert("❌ Erro ao compartilhar.")
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
          alert("✅ Comprovante salvo com sucesso!")
        }
      }, "image/png")
    } catch (error) {
      console.error("Erro ao salvar comprovante:", error)
      alert("❌ Erro ao salvar comprovante.")
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
      alert("❌ Digite o nome da categoria!")
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
        alert(`❌ Erro ao criar categoria: ${error.message}`)
        return
      }

      setNovaCategoria({ nome: "", icone: "package", cor: "amber" })
      await carregarCategorias()
      alert("✅ Categoria criada com sucesso!")
    } catch (error) {
      console.error("❌ Erro ao criar categoria:", error)
      alert("❌ Erro ao criar categoria.")
    } finally {
      setCarregando(false)
    }
  }

  const adicionarNovaBebida = async () => {
    if (!novoItem.nome || !novoItem.preco || !novoItem.categoria_id) {
      alert("❌ Preencha todos os campos obrigatórios!")
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
        alert(`❌ Erro ao criar bebida: ${error.message}`)
        return
      }

      setNovoItem({ nome: "", descricao: "", preco: "", categoria_id: "", estoque: "", imagem: "" })
      await carregarBebidas()
      alert("✅ Bebida adicionada com sucesso!")
    } catch (error) {
      console.error("❌ Erro ao criar bebida:", error)
      alert("❌ Erro ao criar bebida.")
    } finally {
      setCarregando(false)
    }
  }

  const excluirBebida = async (id: number) => {
    const bebida = bebidas.find((b) => b.id === id)
    if (bebida && confirm(`❌ Tem certeza que deseja excluir "${bebida.nome}"?`)) {
      try {
        const { error } = await supabase.from("bebidas").delete().eq("id", id)
        if (error) {
          alert(`❌ Erro ao excluir bebida: ${error.message}`)
          return
        }
        await carregarBebidas()
        alert("✅ Bebida excluída com sucesso!")
      } catch (error) {
        alert("❌ Erro ao excluir bebida.")
      }
    }
  }

  const atualizarEstoque = async (id: number, novoEstoque: number) => {
    try {
      const { error } = await supabase.from("bebidas").update({ estoque: novoEstoque }).eq("id", id)

      if (error) {
        alert(`❌ Erro ao atualizar estoque: ${error.message}`)
        return
      }
      await carregarBebidas()
    } catch (error) {
      alert("❌ Erro ao atualizar estoque.")
    }
  }

  // 🔐 ACESSO ADMIN - CORRIGIDO
  const acessoAdmin = () => {
    const senha = prompt("🔐 Digite a senha de administrador:")
    if (senha === "admin123") {
      console.log("✅ Acesso admin autorizado")
      setTelaAtual("admin")
    } else if (senha !== null) {
      alert("❌ Senha incorreta!")
    }
  }

  const excluirCategoria = async (id: number) => {
    const categoria = categorias.find((c) => c.id === id)
    if (categoria && confirm(`❌ Tem certeza que deseja excluir "${categoria.nome}"?`)) {
      try {
        const { error } = await supabase.from("categorias").delete().eq("id", id)
        if (error) {
          alert(`❌ Erro ao excluir categoria: ${error.message}`)
          return
        }
        await carregarCategorias()
        alert("✅ Categoria excluída com sucesso!")
      } catch (error) {
        alert("❌ Erro ao excluir categoria.")
      }
    }
  }

  const editarBebida = async () => {
    if (!editandoItem || !editandoItem.nome || !editandoItem.preco || !editandoItem.categoria_id) {
      alert("❌ Preencha todos os campos obrigatórios!")
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
        alert(`❌ Erro ao editar bebida: ${error.message}`)
        return
      }

      setEditandoItem(null)
      await carregarBebidas()
      alert("✅ Bebida editada com sucesso!")
    } catch (error) {
      alert("❌ Erro ao editar bebida.")
    } finally {
      setCarregando(false)
    }
  }

  const editarCategoria = async () => {
    if (!editandoCategoria || !editandoCategoria.nome.trim()) {
      alert("❌ Digite o nome da categoria!")
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
        alert(`❌ Erro ao editar categoria: ${error.message}`)
        return
      }

      setEditandoCategoria(null)
      await carregarCategorias()
      alert("✅ Categoria editada com sucesso!")
    } catch (error) {
      alert("❌ Erro ao editar categoria.")
    } finally {
      setCarregando(false)
    }
  }

  // TELA ADMIN - OTIMIZADA PARA MOBILE
  if (telaAtual === "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header Admin - Mobile Otimizado */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-3 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => setTelaAtual("inicio")}
              className="text-white hover:bg-white/20 font-semibold text-sm p-2"
            >
              ← Voltar ao App
            </Button>
            <h1 className="text-lg font-bold flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Painel Admin
            </h1>
            <div className="w-16"></div>
          </div>
        </div>

        {/* Navegação Admin - Mobile Horizontal */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
          <div className="flex overflow-x-auto scrollbar-hide px-2">
            <button
              onClick={() => setAbaAdmin("produtos")}
              className={`flex-shrink-0 py-3 px-3 border-b-2 font-medium text-sm transition-all duration-300 whitespace-nowrap ${
                abaAdmin === "produtos"
                  ? "border-blue-500 text-blue-600 bg-blue-50"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Package className="w-4 h-4 inline mr-1" />
              Produtos ({bebidas.length})
            </button>
            <button
              onClick={() => setAbaAdmin("categorias")}
              className={`flex-shrink-0 py-3 px-3 border-b-2 font-medium text-sm transition-all duration-300 whitespace-nowrap ${
                abaAdmin === "categorias"
                  ? "border-blue-500 text-blue-600 bg-blue-50"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Users className="w-4 h-4 inline mr-1" />
              Categorias ({categorias.length})
            </button>
            <button
              onClick={() => setAbaAdmin("pedidos")}
              className={`flex-shrink-0 py-3 px-3 border-b-2 font-medium text-sm transition-all duration-300 whitespace-nowrap ${
                abaAdmin === "pedidos"
                  ? "border-blue-500 text-blue-600 bg-blue-50"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-1" />
              Pedidos ({pedidos.length})
            </button>
          </div>
        </div>

        <div className="p-3 space-y-4">
          {/* ABA PRODUTOS - Mobile Compacta */}
          {abaAdmin === "produtos" && (
            <div className="space-y-4">
              {/* Formulário Compacto */}
              <Card className="shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Plus className="w-4 h-4 mr-2 text-green-600" />
                    Adicionar Nova Bebida
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Input
                    value={novoItem.nome}
                    onChange={(e) => setNovoItem({ ...novoItem, nome: e.target.value })}
                    placeholder="Nome da bebida *"
                    className="h-10"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      step="0.01"
                      value={novoItem.preco}
                      onChange={(e) => setNovoItem({ ...novoItem, preco: e.target.value })}
                      placeholder="Preço (R$) *"
                      className="h-10"
                    />
                    <Input
                      type="number"
                      value={novoItem.estoque}
                      onChange={(e) => setNovoItem({ ...novoItem, estoque: e.target.value })}
                      placeholder="Estoque"
                      className="h-10"
                    />
                  </div>
                  <Select
                    value={novoItem.categoria_id}
                    onValueChange={(value) => setNovoItem({ ...novoItem, categoria_id: value })}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Selecione uma categoria *" />
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
                    value={novoItem.descricao}
                    onChange={(e) => setNovoItem({ ...novoItem, descricao: e.target.value })}
                    placeholder="Descrição da bebida..."
                    rows={2}
                    className="resize-none"
                  />
                  <Input
                    value={novoItem.imagem}
                    onChange={(e) => setNovoItem({ ...novoItem, imagem: e.target.value })}
                    placeholder="URL da imagem"
                    className="h-10"
                  />
                  <Button
                    onClick={adicionarNovaBebida}
                    disabled={carregando}
                    className="w-full bg-green-600 hover:bg-green-700 text-white h-10"
                  >
                    {carregando ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Salvar Bebida
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Lista Compacta de Produtos */}
              <Card className="shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Package className="w-4 h-4 mr-2 text-blue-600" />
                    Produtos Cadastrados
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2">
                  <div className="space-y-2">
                    {bebidas.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p className="text-sm">Nenhuma bebida cadastrada</p>
                      </div>
                    ) : (
                      bebidas.map((bebida) => (
                        <div key={bebida.id} className="border border-gray-200 rounded-lg p-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                              <Image
                                src={bebida.imagem || "/placeholder.svg"}
                                alt={bebida.nome}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-sm truncate">{bebida.nome}</h3>
                              <div className="flex items-center space-x-2 text-xs">
                                <span className="text-green-600 font-bold">R$ {bebida.preco.toFixed(2)}</span>
                                <span className="text-gray-500">Est: {bebida.estoque}</span>
                                {bebida.categoria && (
                                  <Badge className="text-xs px-1 py-0">{bebida.categoria.nome}</Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col space-y-1">
                              <div className="flex items-center space-x-1">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => atualizarEstoque(bebida.id, Math.max(0, bebida.estoque - 1))}
                                  className="h-6 w-6 p-0"
                                >
                                  <Minus className="w-3 h-3" />
                                </Button>
                                <span className="text-xs font-bold w-6 text-center">{bebida.estoque}</span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => atualizarEstoque(bebida.id, bebida.estoque + 1)}
                                  className="h-6 w-6 p-0"
                                >
                                  <Plus className="w-3 h-3" />
                                </Button>
                              </div>
                              <div className="flex space-x-1">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setEditandoItem(bebida)}
                                  className="h-6 w-6 p-0"
                                >
                                  <Edit className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => excluirBebida(bebida.id)}
                                  className="h-6 w-6 p-0 text-red-600"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Modal de Edição de Bebida */}
              {editandoItem && (
                <Dialog open={!!editandoItem} onOpenChange={() => setEditandoItem(null)}>
                  <DialogContent className="max-w-[95vw] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-lg text-gray-800 flex items-center">
                        <Edit className="w-5 h-5 mr-2 text-blue-600" />
                        Editar: {editandoItem.nome}
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
                            setEditandoItem({ ...editandoItem, preco: Number.parseFloat(e.target.value) })
                          }
                          placeholder="Preço *"
                          className="h-10"
                        />
                        <Input
                          type="number"
                          value={editandoItem.estoque}
                          onChange={(e) =>
                            setEditandoItem({ ...editandoItem, estoque: Number.parseInt(e.target.value) })
                          }
                          placeholder="Estoque"
                          className="h-10"
                        />
                      </div>
                      <Select
                        value={editandoItem.categoria_id?.toString()}
                        onValueChange={(value) =>
                          setEditandoItem({ ...editandoItem, categoria_id: Number.parseInt(value) })
                        }
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
                        value={editandoItem.descricao}
                        onChange={(e) => setEditandoItem({ ...editandoItem, descricao: e.target.value })}
                        placeholder="Descrição"
                        rows={2}
                        className="resize-none"
                      />
                      <Input
                        value={editandoItem.imagem}
                        onChange={(e) => setEditandoItem({ ...editandoItem, imagem: e.target.value })}
                        placeholder="URL da imagem"
                        className="h-10"
                      />
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
                            Salvar Alterações
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
            </div>
          )}

          {/* ABA CATEGORIAS - Mobile Compacta */}
          {abaAdmin === "categorias" && (
            <div className="space-y-4">
              <Card className="shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Plus className="w-4 h-4 mr-2 text-green-600" />
                    Nova Categoria
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Input
                    value={novaCategoria.nome}
                    onChange={(e) => setNovaCategoria({ ...novaCategoria, nome: e.target.value })}
                    placeholder="Nome da categoria *"
                    className="h-10"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Select
                      value={novaCategoria.icone}
                      onValueChange={(value) => setNovaCategoria({ ...novaCategoria, icone: value })}
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
                      value={novaCategoria.cor}
                      onValueChange={(value) => setNovaCategoria({ ...novaCategoria, cor: value })}
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
                  <Button
                    onClick={adicionarNovaCategoria}
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
                        Salvar Categoria
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Users className="w-4 h-4 mr-2 text-blue-600" />
                    Categorias ({categorias.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2">
                  <div className="space-y-2">
                    {categorias.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p className="text-sm">Nenhuma categoria cadastrada</p>
                      </div>
                    ) : (
                      categorias.map((categoria) => {
                        const IconeComponent = getIconeCategoria(categoria.icone)
                        const corInfo = getCorCategoria(categoria.cor)
                        const produtosDaCategoria = bebidas.filter((b) => b.categoria_id === categoria.id).length

                        return (
                          <div key={categoria.id} className="border border-gray-200 rounded-lg p-3">
                            <div className="flex items-center space-x-3">
                              <div
                                className={`w-8 h-8 rounded-full ${corInfo.classe} flex items-center justify-center`}
                              >
                                <IconeComponent className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-sm">{categoria.nome}</h3>
                                <p className="text-xs text-gray-500">{produtosDaCategoria} produtos</p>
                              </div>
                              <div className="flex space-x-1">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setEditandoCategoria(categoria)}
                                  className="h-6 w-6 p-0"
                                >
                                  <Edit className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => excluirCategoria(categoria.id)}
                                  className="h-6 w-6 p-0 text-red-600"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Modal de Edição de Categoria */}
              {editandoCategoria && (
                <Dialog open={!!editandoCategoria} onOpenChange={() => setEditandoCategoria(null)}>
                  <DialogContent className="max-w-[95vw]">
                    <DialogHeader>
                      <DialogTitle className="text-lg text-gray-800 flex items-center">
                        <Edit className="w-5 h-5 mr-2 text-blue-600" />
                        Editar: {editandoCategoria.nome}
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
                            Salvar Alterações
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
          )}

          {/* ABA PEDIDOS - Mobile Compacta */}
          {abaAdmin === "pedidos" && (
            <Card className="shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <BarChart3 className="w-4 h-4 mr-2 text-green-600" />
                  Pedidos ({pedidos.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <div className="space-y-2">
                  {pedidos.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-sm">Nenhum pedido encontrado</p>
                    </div>
                  ) : (
                    pedidos.map((pedido) => (
                      <div key={pedido.id} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-sm">#{pedido.id}</h3>
                            <p className="text-xs text-gray-600">{pedido.cliente}</p>
                            <p className="text-xs text-gray-500">{pedido.data}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600 text-sm">R$ {pedido.total.toFixed(2)}</p>
                            <Badge className="text-xs">{pedido.status}</Badge>
                          </div>
                        </div>
                        <div className="mt-2 pt-2 border-t border-gray-100">
                          <p className="text-xs text-gray-600">
                            {pedido.itens.length} {pedido.itens.length === 1 ? "item" : "itens"} •{" "}
                            {pedido.formaPagamento.toUpperCase()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Rodapé */}
        <Rodape />
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
            </div>

            {/* Informações da Empresa */}
            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div>
                <p className="text-gray-300">Telefone:</p>
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

            <div className="mb-6">
              <p className="text-gray-300 text-sm">Cliente:</p>
              <p className="font-bold text-lg uppercase">{pedidoAtual.cliente}</p>
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
                setNomeCliente("")
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
                  <span className="text-green-600">R$ {totalCarrinho.toFixed(2)}</span>
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

                {/* Entrega */}
                <div
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 hover-lift ${
                    tipoEntrega === "entrega"
                      ? "border-orange-500 bg-orange-50 scale-105"
                      : "border-gray-200 hover:border-orange-300"
                  }`}
                  onClick={() => setTipoEntrega("entrega")}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 text-orange-600">🚚</div>
                    <div>
                      <p className="font-semibold">Entrega</p>
                      <p className="text-sm text-gray-600">Taxa: R$ {TAXA_ENTREGA.toFixed(2)}</p>
                    </div>
                    {tipoEntrega === "entrega" && <div className="ml-auto w-4 h-4 bg-orange-500 rounded-full"></div>}
                  </div>
                </div>

                {/* Campo de Endereço para Entrega */}
                {tipoEntrega === "entrega" && (
                  <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <Label htmlFor="enderecoEntrega">Endereço para Entrega *</Label>
                    <Textarea
                      id="enderecoEntrega"
                      value={enderecoEntrega}
                      onChange={(e) => setEnderecoEntrega(e.target.value)}
                      placeholder="Digite seu endereço completo (rua, número, bairro, cidade)"
                      rows={3}
                      className="mt-2"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Dados do Cliente */}
          <Card className="shadow-lg border-0 bg-gradient-to-r from-white to-orange-50 hover-lift">
            <CardHeader>
              <CardTitle className="text-lg">👤 Seus Dados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="nome">Nome Completo *</Label>
                  <Input
                    id="nome"
                    type="text"
                    placeholder="Digite seu nome"
                    value={nomeCliente}
                    onChange={(e) => setNomeCliente(e.target.value)}
                    className="mt-1"
                  />
                </div>
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
                      placeholder={`Mínimo: R$ ${totalCarrinho.toFixed(2)}`}
                      value={valorPago}
                      onChange={(e) => setValorPago(e.target.value)}
                      className="mt-2"
                    />
                    {valorPago && Number.parseFloat(valorPago) >= totalCarrinho && (
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
              !nomeCliente.trim() ||
              (tipoEntrega === "entrega" && !enderecoEntrega.trim()) ||
              (formaPagamento === "dinheiro" && (!valorPago || Number.parseFloat(valorPago) < totalCarrinho))
            }
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-xl py-6 rounded-xl font-bold shadow-lg hover-lift"
          >
            {carregando ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                Processando...
              </>
            ) : (
              "🎉 Finalizar Pedido"
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 animate-fadeInUp flex flex-col">
        <div className="bg-gradient-to-r from-orange-400 via-orange-500 to-yellow-500 p-4 text-white shadow-lg">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => setTelaAtual("cardapio")}
              className="text-white hover:bg-white/20 font-semibold hover-lift"
            >
              ← Voltar ao Cardápio
            </Button>
            <h1 className="text-xl md:text-2xl font-bold">🛒 Meu Carrinho</h1>
            <div className="w-20 md:w-32"></div>
          </div>
        </div>

        <div className="flex-1 max-w-4xl mx-auto p-4 space-y-4">
          {carrinho.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-gradient-to-br from-orange-100 to-yellow-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="w-12 h-12 text-orange-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-700 mb-2">Carrinho vazio</h2>
              <p className="text-gray-500 mb-6">Que tal adicionar algumas bebidas geladas?</p>
              <Button
                onClick={() => setTelaAtual("cardapio")}
                className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold px-8 py-3 rounded-xl hover-lift"
              >
                🍻 Ver Cardápio
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {carrinho.map((item) => (
                  <Card
                    key={item.bebida.id}
                    className="shadow-lg border-0 bg-gradient-to-r from-white to-orange-50 hover-lift"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="w-16 h-16 rounded-lg overflow-hidden">
                            <Image
                              src={item.bebida.imagem || "/placeholder.svg"}
                              alt={item.bebida.nome}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-gray-800">{item.bebida.nome}</h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-lg font-bold text-green-600">
                                R$ {item.bebida.preco.toFixed(2)}
                              </span>
                              {item.bebida.categoria && (
                                <Badge
                                  className={`${getCorCategoria(item.bebida.categoria.cor).classeBg} ${getCorCategoria(item.bebida.categoria.cor).classeTexto}`}
                                >
                                  {item.bebida.categoria.nome}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removerDoCarrinho(item.bebida.id)}
                            className="border-orange-300 hover:bg-orange-100 hover-lift"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="font-bold text-xl w-8 text-center">{item.quantidade}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => adicionarAoCarrinho(item.bebida)}
                            disabled={item.quantidade >= item.bebida.estoque}
                            className="border-orange-300 hover:bg-orange-100 hover-lift"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-right mt-3">
                        <span className="text-xl font-bold text-orange-600">
                          R$ {(item.bebida.preco * item.quantidade).toFixed(2)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="bg-gradient-to-r from-green-50 to-yellow-50 border-2 border-green-300 shadow-xl hover-lift">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">💰 Total do Pedido</h3>
                    <div className="space-y-1 mb-2">
                      <div className="text-lg text-gray-600">Subtotal: R$ {subtotalItens.toFixed(2)}</div>
                      <div className="text-sm text-gray-500">+ Taxa de entrega: R$ {TAXA_ENTREGA.toFixed(2)}</div>
                    </div>
                    <div className="text-4xl font-bold text-green-600 mb-2">R$ {totalCarrinho.toFixed(2)}</div>
                    <p className="text-gray-600">
                      {totalItens} {totalItens === 1 ? "item" : "itens"} selecionados
                    </p>
                  </div>
                  <Button
                    onClick={() => setTelaAtual("pagamento")}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-xl py-6 rounded-xl font-bold shadow-lg hover-lift"
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

  // TELA INICIAL
  if (telaAtual === "inicio") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-yellow-500 flex flex-col">
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center space-y-8 max-w-md w-full">
            {/* Logo da empresa */}
            <div className="glass-effect rounded-3xl p-8 shadow-2xl border border-white/20 hover-lift">
              <div className="mb-6">
                <div className="w-48 h-48 mx-auto rounded-full overflow-hidden shadow-2xl border-4 border-white/30">
                  <Image
                    src="/logo-bebidas-on.png"
                    alt="Bebidas ON Logo"
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">BEBIDAS ON</h1>
              <div className="bg-gradient-to-r from-yellow-300 to-green-400 bg-clip-text text-transparent">
                <p className="text-xl font-bold mb-2">🚚 DELIVERY PREMIUM</p>
              </div>
              <p className="text-white/90 text-lg font-medium">Buzinou, chegou! 📱</p>
            </div>

            <div className="space-y-4">
              <Button
                onClick={() => setTelaAtual("cardapio")}
                className="w-full bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white text-lg py-6 rounded-2xl font-bold shadow-xl hover-lift"
              >
                🍻 Ver Cardápio Completo
              </Button>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="glass-effect rounded-xl p-3 border border-white/20 hover-lift">
                  <div className="text-2xl mb-1">⚡</div>
                  <p className="text-white/80 text-xs font-medium">Entrega Rápida</p>
                </div>
                <div className="glass-effect rounded-xl p-3 border border-white/20 hover-lift">
                  <div className="text-2xl mb-1">🧊</div>
                  <p className="text-white/80 text-xs font-medium">Sempre Gelado</p>
                </div>
                <div className="glass-effect rounded-xl p-3 border border-white/20 hover-lift">
                  <div className="text-2xl mb-1">💳</div>
                  <p className="text-white/80 text-xs font-medium">Pix, Cartão ou Dinheiro</p>
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
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/30 cursor-pointer hover-lift"
              onDoubleClick={acessoAdmin}
            >
              <Image
                src="/logo-bebidas-on.png"
                alt="Logo"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-2xl font-bold">Cardápio</h1>
          </div>
          <Button
            variant="ghost"
            onClick={() => setTelaAtual("carrinho")}
            className="text-white hover:bg-white/20 relative font-semibold hover-lift"
          >
            <ShoppingCart className="w-6 h-6 mr-2" />
            <span className="hidden sm:inline">Carrinho</span>
            {totalItens > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full">
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
          {bebidasFiltradas.map((bebida) => {
            const IconeComponent = bebida.categoria ? getIconeCategoria(bebida.categoria.icone) : Package
            const corInfo = bebida.categoria ? getCorCategoria(bebida.categoria.cor) : getCorCategoria("amber")

            return (
              <Card
                key={bebida.id}
                className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50 hover-lift transition-all duration-300 hover:shadow-xl"
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
                      <Badge className={`${getStatusEstoque(bebida.estoque).cor} text-white`}>
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
                        <span className="text-2xl font-bold text-green-600">R$ {bebida.preco.toFixed(2)}</span>
                        {bebida.categoria && (
                          <Badge className={`${corInfo.classeBg} ${corInfo.classeTexto} flex items-center space-x-1`}>
                            <IconeComponent className="w-3 h-3" />
                            <span className="hidden md:inline">{bebida.categoria.nome}</span>
                          </Badge>
                        )}
                      </div>
                    </div>

                    <Button
                      onClick={() => adicionarAoCarrinho(bebida)}
                      disabled={bebida.estoque === 0}
                      className={`w-full py-3 rounded-xl font-bold text-lg transition-all duration-200 hover-lift ${
                        bebida.estoque === 0
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white shadow-lg hover:shadow-xl"
                      }`}
                    >
                      {bebida.estoque === 0 ? (
                        "❌ Esgotado"
                      ) : (
                        <>
                          <Plus className="w-5 h-5 mr-2" />
                          Adicionar ao Carrinho
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
            <div className="bg-gradient-to-br from-orange-100 to-yellow-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
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

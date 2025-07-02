"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import { X, CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react"

interface Toast {
  id: string
  type: "success" | "error" | "warning" | "info"
  title: string
  description?: string
  duration?: number
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, "id">) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = { ...toast, id }

    setToasts((prev) => [...prev, newToast])

    // Auto remove após duração especificada ou 2.5 segundos
    setTimeout(() => {
      removeToast(id)
    }, toast.duration || 2500)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within ToastProvider")
  }
  return context
}

function ToastContainer() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed top-3 right-3 z-50 space-y-1 max-w-[280px] w-full">
      {toasts.map((toast, index) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} index={index} />
      ))}
    </div>
  )
}

function ToastItem({ toast, onRemove, index }: { toast: Toast; onRemove: (id: string) => void; index: number }) {
  const getToastStyles = () => {
    switch (toast.type) {
      case "success":
        return {
          bg: "bg-gradient-to-r from-emerald-500 to-green-500",
          icon: CheckCircle,
          iconColor: "text-white",
          shadow: "shadow-lg shadow-emerald-500/20",
          border: "border-emerald-400/30",
        }
      case "error":
        return {
          bg: "bg-gradient-to-r from-red-500 to-rose-500",
          icon: XCircle,
          iconColor: "text-white",
          shadow: "shadow-lg shadow-red-500/20",
          border: "border-red-400/30",
        }
      case "warning":
        return {
          bg: "bg-gradient-to-r from-amber-500 to-orange-500",
          icon: AlertTriangle,
          iconColor: "text-white",
          shadow: "shadow-lg shadow-amber-500/20",
          border: "border-amber-400/30",
        }
      case "info":
        return {
          bg: "bg-gradient-to-r from-blue-500 to-indigo-500",
          icon: Info,
          iconColor: "text-white",
          shadow: "shadow-lg shadow-blue-500/20",
          border: "border-blue-400/30",
        }
      default:
        return {
          bg: "bg-gradient-to-r from-gray-500 to-slate-500",
          icon: Info,
          iconColor: "text-white",
          shadow: "shadow-lg shadow-gray-500/20",
          border: "border-gray-400/30",
        }
    }
  }

  const { bg, icon: Icon, iconColor, shadow, border } = getToastStyles()

  return (
    <div
      className={`${bg} ${shadow} ${border} text-white p-2.5 rounded-lg transform transition-all duration-300 ease-out backdrop-blur-md border`}
      style={{
        animation: `slideInRight 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.1}s both, fadeOutRight 0.2s ease-in 2.3s forwards`,
        transform: `translateY(${index * -2}px)`,
      }}
    >
      <div className="flex items-center space-x-2">
        <Icon className={`w-3.5 h-3.5 ${iconColor} flex-shrink-0`} />
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-xs leading-tight truncate">{toast.title}</h4>
          {toast.description && (
            <p className="text-[10px] opacity-90 mt-0.5 leading-tight line-clamp-1">{toast.description}</p>
          )}
        </div>
        <button
          onClick={() => onRemove(toast.id)}
          className="text-white/70 hover:text-white transition-colors p-0.5 hover:bg-white/15 rounded-full flex-shrink-0"
        >
          <X className="w-2.5 h-2.5" />
        </button>
      </div>

      {/* Barra de progresso ultra fina */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20 rounded-b-lg overflow-hidden">
        <div
          className="h-full bg-white/70 rounded-b-lg"
          style={{
            animation: "progressBar 2.5s linear forwards",
          }}
        />
      </div>
    </div>
  )
}

// Animações CSS ultra suaves
const toastStyles = `
@keyframes slideInRight {
  from {
    transform: translateX(100%) scale(0.9);
    opacity: 0;
  }
  to {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
}

@keyframes fadeOutRight {
  from {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
  to {
    transform: translateX(100%) scale(0.9);
    opacity: 0;
  }
}

@keyframes progressBar {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
`

// Adicionar estilos ao head
if (typeof document !== "undefined") {
  const existingStyle = document.getElementById("toast-styles")
  if (!existingStyle) {
    const styleSheet = document.createElement("style")
    styleSheet.id = "toast-styles"
    styleSheet.textContent = toastStyles
    document.head.appendChild(styleSheet)
  }
}

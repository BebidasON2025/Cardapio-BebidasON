"use client"

export default function GlobalLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4" />
        <p className="text-orange-600 font-medium">Carregando…</p>
      </div>
    </div>
  )
}

import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cardápio Bebidas ON',
  description: 'Created by GV Software',
  generator: 'gvsoftware.tech',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

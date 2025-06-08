import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BSC Flash Arbitrage | Professional Trading Platform",
  description: "Advanced arbitrage trading platform for PancakeSwap and ApeSwap on Binance Smart Chain",
  keywords: "arbitrage, BSC, PancakeSwap, ApeSwap, DeFi, trading, flash loans",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}

"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Zap, ArrowRight } from "lucide-react"

interface MobilePriceCardProps {
  pair: string
  pancakePrice: number
  apePrice: number
  profitability: number
  volume24h: number
  opportunity: boolean
  onExecuteTrade?: () => void
}

export function MobilePriceCard({
  pair,
  pancakePrice,
  apePrice,
  profitability,
  volume24h,
  opportunity,
  onExecuteTrade,
}: MobilePriceCardProps) {
  const formatVolume = (volume: number) => {
    if (volume >= 1000000) return `$${(volume / 1000000).toFixed(1)}M`
    if (volume >= 1000) return `$${(volume / 1000).toFixed(0)}K`
    return `$${volume.toFixed(0)}`
  }

  const getProfitColor = (profit: number) => {
    if (profit > 0.5) return "text-green-600"
    if (profit > 0) return "text-green-500"
    if (profit > -0.5) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <Card className={`relative ${opportunity ? "ring-2 ring-green-200 bg-green-50/30" : ""}`}>
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg">{pair}</span>
            {opportunity && (
              <Badge className="bg-green-100 text-green-800 text-xs">
                <Zap className="h-3 w-3 mr-1" />
                HOT
              </Badge>
            )}
          </div>
          <div className={`flex items-center gap-1 ${getProfitColor(profitability)}`}>
            {profitability > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            <span className="font-bold">
              {profitability > 0 ? "+" : ""}
              {profitability.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Price Comparison */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-xs font-medium text-yellow-700">PancakeSwap</span>
            </div>
            <div className="text-sm font-bold text-yellow-800">${pancakePrice.toFixed(6)}</div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-xs font-medium text-blue-700">ApeSwap</span>
            </div>
            <div className="text-sm font-bold text-blue-800">${apePrice.toFixed(6)}</div>
          </div>
        </div>

        {/* Volume and Action */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-600">Volume: {formatVolume(volume24h)}</div>
          {opportunity && onExecuteTrade && (
            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white h-8 px-3">
              <Zap className="h-3 w-3 mr-1" />
              Trade
            </Button>
          )}
        </div>

        {/* Trade Flow Indicator for Opportunities */}
        {opportunity && (
          <div className="mt-3 p-2 bg-green-100 rounded-lg">
            <div className="flex items-center justify-center text-xs text-green-800">
              <span>Buy Low</span>
              <ArrowRight className="h-3 w-3 mx-2" />
              <span>Sell High</span>
              <ArrowRight className="h-3 w-3 mx-2" />
              <span className="font-bold">Profit!</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

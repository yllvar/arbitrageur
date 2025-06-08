"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Zap, X, TrendingUp, ArrowRight } from "lucide-react"
import type { PriceData } from "@/lib/dex-api"

interface MobileOpportunityAlertProps {
  opportunities: PriceData[]
  onExecuteTrade: (opportunity: PriceData) => void
  onDismiss: (index: number) => void
}

export function MobileOpportunityAlert({ opportunities, onExecuteTrade, onDismiss }: MobileOpportunityAlertProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (opportunities.length > 0) {
      setIsVisible(true)
      setCurrentIndex(0)
    } else {
      setIsVisible(false)
    }
  }, [opportunities])

  useEffect(() => {
    if (opportunities.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % opportunities.length)
      }, 3000) // Auto-rotate every 3 seconds

      return () => clearInterval(interval)
    }
  }, [opportunities.length])

  if (!isVisible || opportunities.length === 0) return null

  const currentOpportunity = opportunities[currentIndex]
  const priceDiff = currentOpportunity.apePrice - currentOpportunity.pancakePrice
  const profitability = (priceDiff / currentOpportunity.pancakePrice) * 100

  return (
    <div className="fixed top-16 left-4 right-4 z-50 md:hidden">
      <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg animate-pulse">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-300" />
              <span className="font-bold text-sm">ARBITRAGE OPPORTUNITY</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDismiss(currentIndex)}
              className="h-6 w-6 p-0 text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3">
            {/* Pair and Profit */}
            <div className="flex items-center justify-between">
              <span className="font-bold text-lg">{currentOpportunity.pair}</span>
              <Badge className="bg-yellow-400 text-yellow-900 font-bold">
                <TrendingUp className="h-3 w-3 mr-1" />+{profitability.toFixed(2)}%
              </Badge>
            </div>

            {/* Trade Flow */}
            <div className="flex items-center justify-center text-sm">
              <span className="bg-white/20 px-2 py-1 rounded">${currentOpportunity.pancakePrice.toFixed(4)}</span>
              <ArrowRight className="h-4 w-4 mx-2" />
              <span className="bg-white/20 px-2 py-1 rounded">${currentOpportunity.apePrice.toFixed(4)}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={() => onExecuteTrade(currentOpportunity)}
                className="flex-1 bg-white text-green-600 hover:bg-gray-100 font-bold"
              >
                <Zap className="h-4 w-4 mr-1" />
                Execute Trade
              </Button>
              <Button variant="ghost" onClick={() => onDismiss(currentIndex)} className="text-white hover:bg-white/20">
                Dismiss
              </Button>
            </div>

            {/* Pagination Dots */}
            {opportunities.length > 1 && (
              <div className="flex justify-center gap-1 pt-2">
                {opportunities.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentIndex ? "bg-white" : "bg-white/40"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

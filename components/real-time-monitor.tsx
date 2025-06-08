"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Zap, RefreshCw } from "lucide-react"
import { DEXPriceService, type PriceData } from "@/lib/dex-api"

interface RealTimeMonitorProps {
  onOpportunityFound: (data: PriceData) => void
}

export function RealTimeMonitor({ onOpportunityFound }: RealTimeMonitorProps) {
  const [priceData, setPriceData] = useState<PriceData[]>([])
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [opportunities, setOpportunities] = useState<PriceData[]>([])

  const priceService = DEXPriceService.getInstance()

  useEffect(() => {
    const pairs = ["WBNB/BUSD", "BUSD/WBNB", "CAKE/BUSD"]

    const updatePrices = (data: PriceData[]) => {
      setPriceData(data)

      // Check for arbitrage opportunities
      const newOpportunities = data.filter((item) => {
        const priceDiff = Math.abs(item.apePrice - item.pancakePrice)
        const profitability = (priceDiff / item.pancakePrice) * 100
        return profitability > 0.5 // 0.5% threshold
      })

      setOpportunities(newOpportunities)

      // Notify parent component of new opportunities
      newOpportunities.forEach((opportunity) => {
        onOpportunityFound(opportunity)
      })
    }

    if (isMonitoring) {
      priceService.startAutoUpdate(pairs, updatePrices)
    } else {
      priceService.stopAutoUpdate()
    }

    return () => {
      priceService.stopAutoUpdate()
    }
  }, [isMonitoring, onOpportunityFound])

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring)
  }

  const refreshPrices = async () => {
    const pairs = ["WBNB/BUSD", "BUSD/WBNB", "CAKE/BUSD"]
    const data = await priceService.getPriceComparison(pairs)
    setPriceData(data)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Real-Time Arbitrage Monitor
          </CardTitle>
          <div className="flex gap-2">
            <Badge variant={opportunities.length > 0 ? "default" : "secondary"}>
              {opportunities.length} Opportunities
            </Badge>
            <Button variant={isMonitoring ? "destructive" : "default"} size="sm" onClick={toggleMonitoring}>
              {isMonitoring ? "Stop Monitoring" : "Start Monitoring"}
            </Button>
            <Button variant="outline" size="sm" onClick={refreshPrices}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {priceData.map((data, index) => {
            const priceDiff = data.apePrice - data.pancakePrice
            const profitability = (priceDiff / data.pancakePrice) * 100
            const isOpportunity = Math.abs(profitability) > 0.5

            return (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  isOpportunity ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{data.pair}</div>
                    <div className="text-sm text-gray-600">
                      PancakeSwap: ${data.pancakePrice.toFixed(6)} | ApeSwap: ${data.apePrice.toFixed(6)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`flex items-center gap-1 ${profitability > 0 ? "text-green-600" : "text-red-600"}`}>
                      {profitability > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                      {profitability > 0 ? "+" : ""}
                      {profitability.toFixed(2)}%
                    </div>
                    {isOpportunity && <Badge className="bg-green-100 text-green-800 mt-1">Profitable!</Badge>}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

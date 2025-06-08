"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, TrendingUp, TrendingDown, RefreshCw, Zap } from "lucide-react"

interface PriceData {
  pair: string
  pancakePrice: number
  apePrice: number
  priceDiff: number
  profitability: number
  volume24h: number
  lastUpdated: Date
  opportunity: boolean
}

interface PriceMonitorProps {
  networkId: number | null
}

export function PriceMonitor({ networkId }: PriceMonitorProps) {
  const [priceData, setPriceData] = useState<PriceData[]>([
    {
      pair: "WBNB/BUSD",
      pancakePrice: 310.45,
      apePrice: 312.18,
      priceDiff: 1.73,
      profitability: 0.56,
      volume24h: 1250000,
      lastUpdated: new Date(),
      opportunity: true,
    },
    {
      pair: "BUSD/WBNB",
      pancakePrice: 0.003223,
      apePrice: 0.003201,
      priceDiff: -0.000022,
      profitability: -0.68,
      volume24h: 890000,
      lastUpdated: new Date(),
      opportunity: false,
    },
    {
      pair: "CAKE/BUSD",
      pancakePrice: 2.45,
      apePrice: 2.47,
      priceDiff: 0.02,
      profitability: 0.82,
      volume24h: 450000,
      lastUpdated: new Date(),
      opportunity: true,
    },
  ])

  const [isRefreshing, setIsRefreshing] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)

  const refreshPrices = async () => {
    setIsRefreshing(true)
    // Simulate API call with more realistic price movements
    setTimeout(() => {
      setPriceData((prev) =>
        prev
          .map((item) => {
            const priceChange = (Math.random() - 0.5) * 0.02 // ±1% change
            const newPancakePrice = item.pancakePrice * (1 + priceChange)
            const newApePrice = item.apePrice * (1 + priceChange * 0.8) // Slightly different movement

            return {
              ...item,
              pancakePrice: newPancakePrice,
              apePrice: newApePrice,
              lastUpdated: new Date(),
            }
          })
          .map((item) => {
            const priceDiff = item.apePrice - item.pancakePrice
            const profitability = (priceDiff / item.pancakePrice) * 100
            return {
              ...item,
              priceDiff,
              profitability,
              opportunity: Math.abs(profitability) > 0.5,
            }
          }),
      )
      setIsRefreshing(false)
    }, 1000)
  }

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(refreshPrices, 5000)
      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  const getProfitabilityColor = (profit: number) => {
    if (profit > 0.5) return "text-green-600 bg-green-50 border-green-200"
    if (profit > 0) return "text-green-500 bg-green-50 border-green-100"
    if (profit > -0.5) return "text-yellow-600 bg-yellow-50 border-yellow-200"
    return "text-red-600 bg-red-50 border-red-200"
  }

  const getProfitabilityIcon = (profit: number) => {
    if (profit > 0) return <TrendingUp className="h-4 w-4" />
    return <TrendingDown className="h-4 w-4" />
  }

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) return `$${(volume / 1000000).toFixed(1)}M`
    if (volume >= 1000) return `$${(volume / 1000).toFixed(0)}K`
    return `$${volume.toFixed(0)}`
  }

  const opportunities = priceData.filter((item) => item.opportunity).length

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Price Monitor</h2>
          <p className="text-gray-600">Real-time price comparison and arbitrage opportunities</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant={opportunities > 0 ? "default" : "secondary"} className="px-3 py-1">
            <Zap className="h-3 w-3 mr-1" />
            {opportunities} Opportunities
          </Badge>
          <Button
            variant="outline"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={autoRefresh ? "bg-green-50 text-green-700 border-green-200" : ""}
          >
            {autoRefresh ? "Auto Refresh ON" : "Auto Refresh OFF"}
          </Button>
          <Button onClick={refreshPrices} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Pairs</p>
                <p className="text-2xl font-bold">{priceData.length}</p>
              </div>
              <ArrowUpDown className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Opportunities</p>
                <p className="text-2xl font-bold text-green-600">{opportunities}</p>
              </div>
              <Zap className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Volume</p>
                <p className="text-2xl font-bold">
                  {formatVolume(priceData.reduce((sum, item) => sum + item.volume24h, 0))}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Price Comparison Cards */}
      <div className="grid gap-4">
        {priceData.map((data, index) => (
          <Card
            key={index}
            className={`relative overflow-hidden transition-all duration-200 ${data.opportunity ? "ring-2 ring-green-200 bg-green-50/30" : ""}`}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {data.pair}
                    <ArrowUpDown className="h-4 w-4 text-gray-400" />
                    {data.opportunity && (
                      <Badge className="bg-green-100 text-green-800 animate-pulse">
                        <Zap className="h-3 w-3 mr-1" />
                        Opportunity
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-4">
                    <span>Updated: {data.lastUpdated.toLocaleTimeString()}</span>
                    <span>Volume: {formatVolume(data.volume24h)}</span>
                  </CardDescription>
                </div>
                <Badge
                  className={`${getProfitabilityColor(data.profitability)} flex items-center gap-1 border`}
                  variant="secondary"
                >
                  {getProfitabilityIcon(data.profitability)}
                  {data.profitability > 0 ? "+" : ""}
                  {data.profitability.toFixed(2)}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="text-sm text-gray-600 flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    PancakeSwap
                  </div>
                  <div className="text-xl font-bold text-yellow-600">${data.pancakePrice.toFixed(6)}</div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-gray-600 flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    ApeSwap
                  </div>
                  <div className="text-xl font-bold text-blue-600">${data.apePrice.toFixed(6)}</div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-gray-600">Price Difference</div>
                  <div className={`text-xl font-bold ${data.priceDiff > 0 ? "text-green-600" : "text-red-600"}`}>
                    {data.priceDiff > 0 ? "+" : ""}${Math.abs(data.priceDiff).toFixed(6)}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-gray-600">Potential Profit</div>
                  <div className={`text-xl font-bold ${data.profitability > 0 ? "text-green-600" : "text-red-600"}`}>
                    {data.profitability > 0 ? "+" : ""}
                    {data.profitability.toFixed(2)}%
                  </div>
                </div>
              </div>

              {data.opportunity && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-800 font-medium">
                      Profitable arbitrage opportunity detected!
                    </span>
                  </div>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    Execute Trade
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

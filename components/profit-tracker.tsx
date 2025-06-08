"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, DollarSign, BarChart3, Target, Zap } from "lucide-react"

interface ProfitTrackerProps {
  account: string
  networkId: number | null
}

export function ProfitTracker({ account, networkId }: ProfitTrackerProps) {
  const [timeframe, setTimeframe] = useState("7d")

  const profitData = {
    "24h": { total: 12.34, trades: 5, avgProfit: 2.47, winRate: 80, volume: 15000 },
    "7d": { total: 89.67, trades: 23, avgProfit: 3.9, winRate: 78, volume: 125000 },
    "30d": { total: 234.56, trades: 67, avgProfit: 3.5, winRate: 75, volume: 450000 },
    "90d": { total: 567.89, trades: 156, avgProfit: 3.64, winRate: 73, volume: 1200000 },
  }

  const currentData = profitData[timeframe as keyof typeof profitData]

  const dailyProfits = [
    { date: "2024-01-01", profit: 12.34, trades: 3 },
    { date: "2024-01-02", profit: 8.9, trades: 2 },
    { date: "2024-01-03", profit: 15.67, trades: 4 },
    { date: "2024-01-04", profit: -2.34, trades: 1 },
    { date: "2024-01-05", profit: 9.87, trades: 3 },
    { date: "2024-01-06", profit: 18.45, trades: 5 },
    { date: "2024-01-07", profit: 6.78, trades: 2 },
  ]

  const topPairs = [
    { pair: "WBNB/BUSD", profit: 45.67, trades: 12, winRate: 83, volume: 25000 },
    { pair: "BUSD/WBNB", profit: 23.45, trades: 8, winRate: 75, volume: 18000 },
    { pair: "CAKE/BUSD", profit: 12.34, trades: 5, winRate: 60, volume: 8500 },
  ]

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) return `$${(volume / 1000000).toFixed(1)}M`
    if (volume >= 1000) return `$${(volume / 1000).toFixed(0)}K`
    return `$${volume.toFixed(0)}`
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Profit Analytics</h2>
          <p className="text-gray-600">Comprehensive analysis of your arbitrage trading performance</p>
        </div>
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">24 Hours</SelectItem>
            <SelectItem value="7d">7 Days</SelectItem>
            <SelectItem value="30d">30 Days</SelectItem>
            <SelectItem value="90d">90 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Profit</p>
                <p className="text-2xl font-bold text-green-600">+${currentData.total.toFixed(2)}</p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Trades</p>
                <p className="text-2xl font-bold">{currentData.trades}</p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Profit/Trade</p>
                <p className="text-2xl font-bold text-green-600">+${currentData.avgProfit.toFixed(2)}</p>
              </div>
              <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Win Rate</p>
                <p className="text-2xl font-bold">{currentData.winRate}%</p>
              </div>
              <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                <Target className="h-4 w-4 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Volume</p>
                <p className="text-2xl font-bold">{formatVolume(currentData.volume)}</p>
              </div>
              <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <Zap className="h-4 w-4 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Profit Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Performance</CardTitle>
            <CardDescription>Your profit and trading activity over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dailyProfits.map((day, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 w-20">
                      {new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className={`w-20 h-2 rounded-full ${day.profit > 0 ? "bg-green-200" : "bg-red-200"}`}>
                        <div
                          className={`h-full rounded-full ${day.profit > 0 ? "bg-green-500" : "bg-red-500"}`}
                          style={{ width: `${Math.min((Math.abs(day.profit) / 20) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${day.profit > 0 ? "text-green-600" : "text-red-600"}`}>
                      {day.profit > 0 ? "+" : ""}${day.profit.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">{day.trades} trades</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Pairs */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Pairs</CardTitle>
            <CardDescription>Your most profitable trading pairs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPairs.map((pair, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                        index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : "bg-orange-500"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{pair.pair}</div>
                      <div className="text-sm text-gray-600">
                        {pair.trades} trades • {pair.winRate}% win rate
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-green-600">+${pair.profit.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">{formatVolume(pair.volume)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
          <CardDescription>AI-powered insights to optimize your trading strategy</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-900">Best Trading Time</span>
                </div>
                <p className="text-sm text-blue-800">
                  Your most profitable trades occur between 2-4 PM UTC. Consider focusing your activity during these
                  hours for optimal results.
                </p>
              </div>

              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-900">Optimal Trade Size</span>
                </div>
                <p className="text-sm text-green-800">
                  Trades between 1-3 WBNB show the highest profit margins. Consider adjusting your position sizes to
                  this range.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="h-4 w-4 text-purple-600" />
                  <span className="font-medium text-purple-900">Market Conditions</span>
                </div>
                <p className="text-sm text-purple-800">
                  High volatility periods show 23% better arbitrage opportunities. Monitor market volatility indicators.
                </p>
              </div>

              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-orange-600" />
                  <span className="font-medium text-orange-900">Gas Optimization</span>
                </div>
                <p className="text-sm text-orange-800">
                  You could save 15% on gas costs by executing trades during off-peak hours (10 PM - 6 AM UTC).
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

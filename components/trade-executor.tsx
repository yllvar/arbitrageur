"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, Calculator, Zap, AlertCircle, CheckCircle, TrendingUp } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface TradeExecutorProps {
  account: string
  networkId: number | null
  contractAddress: string
}

export function TradeExecutor({ account, networkId, contractAddress }: TradeExecutorProps) {
  const [tradeAmount, setTradeAmount] = useState("")
  const [selectedPair, setSelectedPair] = useState("WBNB/BUSD")
  const [tradeDirection, setTradeDirection] = useState("pancake-to-ape")
  const [isExecuting, setIsExecuting] = useState(false)
  const [estimatedProfit, setEstimatedProfit] = useState(0)
  const [gasEstimate, setGasEstimate] = useState(0.003)
  const [slippage, setSlippage] = useState("0.5")

  const calculateProfit = () => {
    const amount = Number.parseFloat(tradeAmount) || 0
    const profitPercentage = tradeDirection === "pancake-to-ape" ? 0.56 : -0.68
    const profit = (amount * profitPercentage) / 100
    const gasCost = gasEstimate * 310 // Assuming BNB price
    const slippageCost = (amount * Number.parseFloat(slippage)) / 100
    setEstimatedProfit(profit - gasCost - slippageCost)
  }

  const executeTrade = async () => {
    if (!contractAddress) {
      alert("Please connect to a contract first")
      return
    }

    setIsExecuting(true)

    try {
      // Mock contract interaction - replace with actual Web3 calls
      const mockTransaction = {
        to: contractAddress,
        data: "0x...", // Encoded function call
        gas: "330000",
        gasPrice: "5000000000",
      }

      // Simulate transaction
      setTimeout(() => {
        setIsExecuting(false)
        alert("Trade executed successfully! (This is a simulation)")
      }, 3000)
    } catch (error) {
      console.error("Trade execution failed:", error)
      setIsExecuting(false)
    }
  }

  const isTradeValid = () => {
    return Number.parseFloat(tradeAmount) > 0 && estimatedProfit > 0 && contractAddress
  }

  const tradingPairs = [
    { value: "WBNB/BUSD", label: "WBNB/BUSD", volume: "$1.2M" },
    { value: "BUSD/WBNB", label: "BUSD/WBNB", volume: "$890K" },
    { value: "CAKE/BUSD", label: "CAKE/BUSD", volume: "$450K" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Execute Arbitrage Trade</h2>
        <p className="text-gray-600">Configure and execute flash swap arbitrage trades</p>
      </div>

      {!contractAddress && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Please connect to a contract in the Contract tab before executing trades.</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trade Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Trade Configuration</CardTitle>
            <CardDescription>Set up your arbitrage trade parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pair">Trading Pair</Label>
              <Select value={selectedPair} onValueChange={setSelectedPair}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tradingPairs.map((pair) => (
                    <SelectItem key={pair.value} value={pair.value}>
                      <div className="flex justify-between items-center w-full">
                        <span>{pair.label}</span>
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {pair.volume}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="direction">Trade Direction</Label>
              <Select value={tradeDirection} onValueChange={setTradeDirection}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pancake-to-ape">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      PancakeSwap → ApeSwap
                    </div>
                  </SelectItem>
                  <SelectItem value="ape-to-pancake">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      ApeSwap → PancakeSwap
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Flash Loan Amount</Label>
              <div className="relative">
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.0"
                  value={tradeAmount}
                  onChange={(e) => {
                    setTradeAmount(e.target.value)
                    calculateProfit()
                  }}
                  className="pr-16"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                  {selectedPair.split("/")[0]}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="slippage">Slippage Tolerance (%)</Label>
              <Select value={slippage} onValueChange={setSlippage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.1">0.1%</SelectItem>
                  <SelectItem value="0.5">0.5%</SelectItem>
                  <SelectItem value="1.0">1.0%</SelectItem>
                  <SelectItem value="2.0">2.0%</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={calculateProfit} variant="outline" className="w-full">
              <Calculator className="h-4 w-4 mr-2" />
              Calculate Profit
            </Button>
          </CardContent>
        </Card>

        {/* Trade Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Trade Summary</CardTitle>
            <CardDescription>Review your trade details before execution</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Flash Loan Amount:</span>
                <span className="font-medium">
                  {tradeAmount || "0"} {selectedPair.split("/")[0]}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Estimated Gas:</span>
                <span className="font-medium">{gasEstimate} BNB</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Flash Loan Fee:</span>
                <span className="font-medium">0.3%</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Slippage Tolerance:</span>
                <span className="font-medium">{slippage}%</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Contract Address:</span>
                <span className="font-mono text-xs">
                  {contractAddress ? `${contractAddress.slice(0, 6)}...${contractAddress.slice(-4)}` : "Not connected"}
                </span>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Estimated Profit:</span>
                <Badge
                  className={estimatedProfit > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                  variant="secondary"
                >
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {estimatedProfit > 0 ? "+" : ""}
                  {estimatedProfit.toFixed(4)} BUSD
                </Badge>
              </div>
            </div>

            {estimatedProfit > 0 ? (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  This trade is estimated to be profitable. Market conditions can change rapidly, so execute quickly.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  This trade may not be profitable. Consider adjusting parameters or waiting for better conditions.
                </AlertDescription>
              </Alert>
            )}

            <Button onClick={executeTrade} disabled={!isTradeValid() || isExecuting} className="w-full" size="lg">
              {isExecuting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Executing Trade...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Execute Flash Arbitrage
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Trade Flow Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Trade Flow</CardTitle>
          <CardDescription>Visual representation of the arbitrage process</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mb-2 shadow-lg">
                <span className="text-white font-bold">1</span>
              </div>
              <div className="text-sm font-medium">Flash Loan</div>
              <div className="text-xs text-gray-600">Borrow {tradeAmount || "0"} tokens</div>
            </div>

            <ArrowRight className="h-6 w-6 text-gray-400" />

            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center mb-2 shadow-lg">
                <span className="text-white font-bold">2</span>
              </div>
              <div className="text-sm font-medium">Buy Low</div>
              <div className="text-xs text-gray-600">
                {tradeDirection === "pancake-to-ape" ? "PancakeSwap" : "ApeSwap"}
              </div>
            </div>

            <ArrowRight className="h-6 w-6 text-gray-400" />

            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mb-2 shadow-lg">
                <span className="text-white font-bold">3</span>
              </div>
              <div className="text-sm font-medium">Sell High</div>
              <div className="text-xs text-gray-600">
                {tradeDirection === "pancake-to-ape" ? "ApeSwap" : "PancakeSwap"}
              </div>
            </div>

            <ArrowRight className="h-6 w-6 text-gray-400" />

            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center mb-2 shadow-lg">
                <span className="text-white font-bold">4</span>
              </div>
              <div className="text-sm font-medium">Repay & Profit</div>
              <div className="text-xs text-gray-600">Keep the difference</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

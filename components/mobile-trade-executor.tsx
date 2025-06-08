"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Zap, Calculator, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface MobileTradeExecutorProps {
  account: string
  networkId: number | null
  contractAddress: string
}

export function MobileTradeExecutor({ account, networkId, contractAddress }: MobileTradeExecutorProps) {
  const [tradeAmount, setTradeAmount] = useState("")
  const [selectedPair, setSelectedPair] = useState("WBNB/BUSD")
  const [tradeDirection, setTradeDirection] = useState("pancake-to-ape")
  const [slippage, setSlippage] = useState([0.5])
  const [isExecuting, setIsExecuting] = useState(false)
  const [estimatedProfit, setEstimatedProfit] = useState(0)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const calculateProfit = () => {
    const amount = Number.parseFloat(tradeAmount) || 0
    const profitPercentage = tradeDirection === "pancake-to-ape" ? 0.56 : -0.68
    const profit = (amount * profitPercentage) / 100
    const gasCost = 0.003 * 310 // Gas cost in USD
    const slippageCost = (amount * slippage[0]) / 100
    setEstimatedProfit(profit - gasCost - slippageCost)
  }

  const executeTrade = async () => {
    if (!contractAddress) {
      alert("Please connect to a contract first")
      return
    }

    setIsExecuting(true)
    // Simulate trade execution
    setTimeout(() => {
      setIsExecuting(false)
      alert("Trade executed successfully! (Simulation)")
    }, 3000)
  }

  const isTradeValid = () => {
    return Number.parseFloat(tradeAmount) > 0 && estimatedProfit > 0 && contractAddress
  }

  const quickAmounts = [0.1, 0.5, 1.0, 2.0, 5.0]

  return (
    <div className="space-y-4 pb-20">
      {" "}
      {/* Extra padding for mobile navigation */}
      {/* Quick Trade Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            Quick Trade
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Pair Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Trading Pair</Label>
            <Select value={selectedPair} onValueChange={setSelectedPair}>
              <SelectTrigger className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WBNB/BUSD">WBNB/BUSD</SelectItem>
                <SelectItem value="BUSD/WBNB">BUSD/WBNB</SelectItem>
                <SelectItem value="CAKE/BUSD">CAKE/BUSD</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Amount Input with Quick Buttons */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Amount ({selectedPair.split("/")[0]})</Label>
            <Input
              type="number"
              placeholder="0.0"
              value={tradeAmount}
              onChange={(e) => {
                setTradeAmount(e.target.value)
                calculateProfit()
              }}
              className="h-12 text-lg text-center"
            />

            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-5 gap-2">
              {quickAmounts.map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setTradeAmount(amount.toString())
                    calculateProfit()
                  }}
                  className="h-8 text-xs"
                >
                  {amount}
                </Button>
              ))}
            </div>
          </div>

          {/* Direction Toggle */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Direction</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={tradeDirection === "pancake-to-ape" ? "default" : "outline"}
                onClick={() => setTradeDirection("pancake-to-ape")}
                className="h-12 text-xs"
              >
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>→</span>
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                  <div>Pancake → Ape</div>
                </div>
              </Button>
              <Button
                variant={tradeDirection === "ape-to-pancake" ? "default" : "outline"}
                onClick={() => setTradeDirection("ape-to-pancake")}
                className="h-12 text-xs"
              >
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>→</span>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  </div>
                  <div>Ape → Pancake</div>
                </div>
              </Button>
            </div>
          </div>

          {/* Slippage Slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-medium">Slippage Tolerance</Label>
              <Badge variant="secondary">{slippage[0]}%</Badge>
            </div>
            <Slider value={slippage} onValueChange={setSlippage} max={5} min={0.1} step={0.1} className="w-full" />
          </div>

          {/* Calculate Button */}
          <Button onClick={calculateProfit} variant="outline" className="w-full h-12">
            <Calculator className="h-4 w-4 mr-2" />
            Calculate Profit
          </Button>
        </CardContent>
      </Card>
      {/* Profit Summary */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Flash Loan Amount:</span>
              <span className="font-medium">
                {tradeAmount || "0"} {selectedPair.split("/")[0]}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Estimated Gas:</span>
              <span className="font-medium">0.003 BNB</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Flash Loan Fee:</span>
              <span className="font-medium">0.3%</span>
            </div>

            <div className="border-t pt-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Estimated Profit:</span>
                <Badge
                  className={`${estimatedProfit > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"} text-sm px-3 py-1`}
                  variant="secondary"
                >
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {estimatedProfit > 0 ? "+" : ""}
                  {estimatedProfit.toFixed(4)} BUSD
                </Badge>
              </div>
            </div>
          </div>

          {/* Status Alert */}
          {estimatedProfit > 0 ? (
            <Alert className="mt-4 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 text-sm">
                This trade is estimated to be profitable. Execute quickly as market conditions change rapidly.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert variant="destructive" className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                This trade may not be profitable. Consider adjusting parameters.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
      {/* Execute Button */}
      <div className="sticky bottom-20 bg-white p-4 border-t border-gray-200">
        <Button
          onClick={executeTrade}
          disabled={!isTradeValid() || isExecuting}
          className="w-full h-14 text-lg font-semibold"
          size="lg"
        >
          {isExecuting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Executing Trade...
            </>
          ) : (
            <>
              <Zap className="h-5 w-5 mr-2" />
              Execute Flash Arbitrage
            </>
          )}
        </Button>
      </div>
      {/* Advanced Settings Toggle */}
      <Card>
        <CardContent className="p-4">
          <Button variant="ghost" onClick={() => setShowAdvanced(!showAdvanced)} className="w-full">
            {showAdvanced ? "Hide" : "Show"} Advanced Settings
          </Button>

          {showAdvanced && (
            <div className="mt-4 space-y-4 pt-4 border-t">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-xs text-gray-600">Gas Limit</Label>
                  <Input value="330000" readOnly className="h-10 text-xs" />
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Gas Price</Label>
                  <Input value="5 Gwei" readOnly className="h-10 text-xs" />
                </div>
              </div>

              <div>
                <Label className="text-xs text-gray-600">Contract Address</Label>
                <Input value={contractAddress || "Not connected"} readOnly className="h-10 text-xs font-mono" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

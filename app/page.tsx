"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { MobileNavigation } from "@/components/mobile-navigation"
import { MobileWalletConnection } from "@/components/mobile-wallet-connection"
import { MobileOpportunityAlert } from "@/components/mobile-opportunity-alert"
import { MobilePriceCard } from "@/components/mobile-price-card"
import { MobileTradeExecutor } from "@/components/mobile-trade-executor"
import { PriceMonitor } from "@/components/price-monitor"
import { RealTimeMonitor } from "@/components/real-time-monitor"
import { ContractManager } from "@/components/contract-manager"
import { TransactionHistory } from "@/components/transaction-history"
import { ProfitTracker } from "@/components/profit-tracker"
import { useWeb3 } from "@/hooks/useWeb3"
import { DEXPriceService, type PriceData } from "@/lib/dex-api"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wallet, Activity, TrendingUp } from "lucide-react"
import { WalletConnection } from "@/components/wallet-connection"
import { TradeExecutor } from "@/components/trade-executor"

export default function ArbitrageDashboard() {
  const { account, networkId, isConnected, balance, connectWallet, switchNetwork, disconnect } = useWeb3()
  const [activeTab, setActiveTab] = useState("monitor")
  const [contractAddress, setContractAddress] = useState<string>("")
  const [opportunities, setOpportunities] = useState<PriceData[]>([])
  const [priceData, setPriceData] = useState<PriceData[]>([])
  const [isMobile, setIsMobile] = useState(false)

  const isCorrectNetwork = networkId === 56 || networkId === 97

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Initialize price monitoring
  useEffect(() => {
    const priceService = DEXPriceService.getInstance()
    const pairs = ["WBNB/BUSD", "BUSD/WBNB", "CAKE/BUSD"]

    const updatePrices = (data: PriceData[]) => {
      setPriceData(data)

      // Filter opportunities
      const newOpportunities = data.filter((item) => {
        const priceDiff = Math.abs(item.apePrice - item.pancakePrice)
        const profitability = (priceDiff / item.pancakePrice) * 100
        return profitability > 0.5
      })

      setOpportunities(newOpportunities)
    }

    if (isConnected && isCorrectNetwork) {
      priceService.startAutoUpdate(pairs, updatePrices)
    }

    return () => {
      priceService.stopAutoUpdate()
    }
  }, [isConnected, isCorrectNetwork])

  const handleOpportunityFound = (opportunity: PriceData) => {
    // Browser notification for mobile
    if ("Notification" in window && Notification.permission === "granted") {
      const profitability = ((opportunity.apePrice - opportunity.pancakePrice) / opportunity.pancakePrice) * 100
      new Notification("🚀 Arbitrage Opportunity!", {
        body: `${opportunity.pair}: ${profitability.toFixed(2)}% profit potential`,
        icon: "/favicon.ico",
        tag: "arbitrage-opportunity",
        requireInteraction: true,
      })
    }

    // Haptic feedback on mobile
    if ("vibrate" in navigator) {
      navigator.vibrate([200, 100, 200])
    }
  }

  const handleExecuteTrade = (opportunity: PriceData) => {
    setActiveTab("trade")
    // Pre-fill trade form with opportunity data
  }

  const handleDismissOpportunity = (index: number) => {
    setOpportunities((prev) => prev.filter((_, i) => i !== index))
  }

  const requestNotificationPermission = () => {
    if ("Notification" in window) {
      Notification.requestPermission()
    }
  }

  // Mobile Layout
  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Mobile Opportunity Alerts */}
        <MobileOpportunityAlert
          opportunities={opportunities}
          onExecuteTrade={handleExecuteTrade}
          onDismiss={handleDismissOpportunity}
        />

        {/* Mobile Wallet Connection */}
        {!isConnected && (
          <div className="pt-4">
            <MobileWalletConnection
              isConnected={isConnected}
              currentAccount={account}
              networkId={networkId}
              balance={balance}
              onConnect={connectWallet}
              onDisconnect={disconnect}
              onSwitchNetwork={switchNetwork}
            />
          </div>
        )}

        {/* Network Warning */}
        {isConnected && !isCorrectNetwork && (
          <div className="p-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span className="text-sm">Switch to BSC network</span>
                <button
                  onClick={() => switchNetwork(56)}
                  className="ml-2 px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                >
                  Switch
                </button>
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Notification Permission */}
        {isConnected && Notification.permission === "default" && (
          <div className="p-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span className="text-sm">Enable alerts for opportunities</span>
                <button
                  onClick={requestNotificationPermission}
                  className="ml-2 px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                >
                  Enable
                </button>
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Main Content */}
        {isConnected && isCorrectNetwork ? (
          <div className="pb-20">
            {" "}
            {/* Space for bottom navigation */}
            {activeTab === "monitor" && (
              <div className="p-4 space-y-4">
                <h2 className="text-xl font-bold">Price Monitor</h2>
                {priceData.map((data, index) => {
                  const priceDiff = data.apePrice - data.pancakePrice
                  const profitability = (priceDiff / data.pancakePrice) * 100
                  const isOpportunity = Math.abs(profitability) > 0.5

                  return (
                    <MobilePriceCard
                      key={index}
                      pair={data.pair}
                      pancakePrice={data.pancakePrice}
                      apePrice={data.apePrice}
                      profitability={profitability}
                      volume24h={data.volume24h}
                      opportunity={isOpportunity}
                      onExecuteTrade={() => handleExecuteTrade(data)}
                    />
                  )
                })}
              </div>
            )}
            {activeTab === "realtime" && (
              <div className="p-4">
                <RealTimeMonitor onOpportunityFound={handleOpportunityFound} />
              </div>
            )}
            {activeTab === "contract" && (
              <div className="p-4">
                <ContractManager
                  account={account}
                  networkId={networkId}
                  contractAddress={contractAddress}
                  setContractAddress={setContractAddress}
                />
              </div>
            )}
            {activeTab === "trade" && (
              <div className="p-4">
                <MobileTradeExecutor account={account} networkId={networkId} contractAddress={contractAddress} />
              </div>
            )}
            {activeTab === "analytics" && (
              <div className="p-4 space-y-6">
                <TransactionHistory account={account} networkId={networkId} />
                <ProfitTracker account={account} networkId={networkId} />
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 pt-20">
            <Card className="text-center py-12">
              <CardContent>
                <h2 className="text-xl font-semibold mb-3">Welcome to BSC Arbitrage Pro</h2>
                <p className="text-gray-600 mb-6 text-sm">Connect your wallet to start trading</p>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="font-medium text-blue-900">Step 1</div>
                    <div className="text-blue-700">Install MetaMask</div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="font-medium text-purple-900">Step 2</div>
                    <div className="text-purple-700">Connect Wallet</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="font-medium text-green-900">Step 3</div>
                    <div className="text-green-700">Start Trading</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Mobile Navigation */}
        <MobileNavigation activeTab={activeTab} onTabChange={setActiveTab} opportunityCount={opportunities.length} />
      </div>
    )
  }

  // Desktop Layout (existing code)
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              BSC Flash Arbitrage Pro
            </h1>
            <p className="text-gray-600 text-lg">Professional arbitrage trading platform for BSC DEXs</p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-gray-600">Live Market Data</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-500" />
                <span className="text-gray-600">Real-time Monitoring</span>
              </div>
              {opportunities.length > 0 && (
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-green-600">{opportunities.length} Recent Opportunities</span>
                </div>
              )}
            </div>
          </div>

          {isConnected ? (
            <WalletConnection
              isConnected={isConnected}
              setIsConnected={() => {}}
              currentAccount={account}
              setCurrentAccount={() => {}}
              networkId={networkId}
              setNetworkId={() => {}}
            />
          ) : (
            <button
              onClick={connectWallet}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2"
            >
              <Wallet className="h-5 w-5" />
              Connect Wallet
            </button>
          )}
        </div>

        {/* Network Warning */}
        {isConnected && !isCorrectNetwork && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>Please switch to Binance Smart Chain (BSC) to use this application.</span>
              <button
                onClick={() => switchNetwork(56)}
                className="ml-4 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                Switch to BSC
              </button>
            </AlertDescription>
          </Alert>
        )}

        {/* Notification Permission */}
        {isConnected && Notification.permission === "default" && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>Enable notifications to get alerts for arbitrage opportunities.</span>
              <button
                onClick={requestNotificationPermission}
                className="ml-4 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
              >
                Enable Notifications
              </button>
            </AlertDescription>
          </Alert>
        )}

        {/* Main Dashboard */}
        {isConnected && isCorrectNetwork ? (
          <Tabs defaultValue="monitor" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-flex">
              <TabsTrigger value="monitor" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Monitor
              </TabsTrigger>
              <TabsTrigger value="realtime" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Live Feed
              </TabsTrigger>
              <TabsTrigger value="contract" className="flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                Contract
              </TabsTrigger>
              <TabsTrigger value="trade">Execute</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="monitor" className="space-y-6">
              <PriceMonitor networkId={networkId} />
            </TabsContent>

            <TabsContent value="realtime" className="space-y-6">
              <RealTimeMonitor onOpportunityFound={handleOpportunityFound} />
            </TabsContent>

            <TabsContent value="contract" className="space-y-6">
              <ContractManager
                account={account}
                networkId={networkId}
                contractAddress={contractAddress}
                setContractAddress={setContractAddress}
              />
            </TabsContent>

            <TabsContent value="trade" className="space-y-6">
              <TradeExecutor account={account} networkId={networkId} contractAddress={contractAddress} />
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TransactionHistory account={account} networkId={networkId} />
                <ProfitTracker account={account} networkId={networkId} />
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <Card className="text-center py-16">
            <CardContent>
              <Wallet className="h-20 w-20 mx-auto text-gray-400 mb-6" />
              <h2 className="text-2xl font-semibold mb-3">Welcome to BSC Flash Arbitrage Pro</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Connect your MetaMask wallet and switch to Binance Smart Chain to start monitoring arbitrage
                opportunities and execute profitable trades.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto text-sm">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="font-medium text-blue-900 mb-1">Step 1</div>
                  <div className="text-blue-700">Install MetaMask Extension</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="font-medium text-purple-900 mb-1">Step 2</div>
                  <div className="text-purple-700">Connect Your Wallet</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="font-medium text-green-900 mb-1">Step 3</div>
                  <div className="text-green-700">Switch to BSC Network</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, ChevronDown, Copy, ExternalLink, AlertTriangle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface WalletConnectionProps {
  isConnected: boolean
  setIsConnected: (connected: boolean) => void
  currentAccount: string
  setCurrentAccount: (account: string) => void
  networkId: number | null
  setNetworkId: (networkId: number) => void
}

export function WalletConnection({
  isConnected,
  setIsConnected,
  currentAccount,
  setCurrentAccount,
  networkId,
  setNetworkId,
}: WalletConnectionProps) {
  const [balance, setBalance] = useState<string>("0")
  const [isLoading, setIsLoading] = useState(false)

  const networks = {
    56: { name: "BSC Mainnet", explorer: "https://bscscan.com", color: "bg-yellow-100 text-yellow-800" },
    97: { name: "BSC Testnet", explorer: "https://testnet.bscscan.com", color: "bg-blue-100 text-blue-800" },
  }

  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      alert("Please install MetaMask!")
      return
    }

    setIsLoading(true)
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      if (accounts.length > 0) {
        setCurrentAccount(accounts[0])
        setIsConnected(true)

        // Get network
        const chainId = await window.ethereum.request({ method: "eth_chainId" })
        const networkId = Number.parseInt(chainId, 16)
        setNetworkId(networkId)

        // Get balance
        const balance = await window.ethereum.request({
          method: "eth_getBalance",
          params: [accounts[0], "latest"],
        })

        const balanceInEth = Number.parseInt(balance, 16) / Math.pow(10, 18)
        setBalance(balanceInEth.toFixed(4))

        // Listen for account changes
        window.ethereum.on("accountsChanged", (accounts: string[]) => {
          if (accounts.length === 0) {
            setIsConnected(false)
            setCurrentAccount("")
          } else {
            setCurrentAccount(accounts[0])
          }
        })

        // Listen for network changes
        window.ethereum.on("chainChanged", (chainId: string) => {
          setNetworkId(Number.parseInt(chainId, 16))
          window.location.reload()
        })
      }
    } catch (error) {
      console.error("Error connecting wallet:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const switchToBSC = async (chainId: string, chainName: string, rpcUrl: string) => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId }],
      })
    } catch (error: any) {
      if (error.code === 4902) {
        // Chain not added, add it
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId,
              chainName,
              nativeCurrency: {
                name: "BNB",
                symbol: "BNB",
                decimals: 18,
              },
              rpcUrls: [rpcUrl],
              blockExplorerUrls: [networks[chainId === "0x38" ? 56 : 97].explorer],
            },
          ],
        })
      }
    }
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(currentAccount)
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const disconnect = () => {
    setIsConnected(false)
    setCurrentAccount("")
    setNetworkId(null)
    setBalance("0")
  }

  if (!isConnected) {
    return (
      <Button
        onClick={connectWallet}
        disabled={isLoading}
        size="lg"
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
      >
        <Wallet className="h-4 w-4 mr-2" />
        {isLoading ? "Connecting..." : "Connect Wallet"}
      </Button>
    )
  }

  const currentNetwork = networks[networkId as keyof typeof networks]
  const isCorrectNetwork = networkId === 56 || networkId === 97

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">{formatAddress(currentAccount)}</span>
                <Button variant="ghost" size="sm" onClick={copyAddress} className="h-6 w-6 p-0">
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">{balance} BNB</span>
                {currentNetwork ? (
                  <Badge className={currentNetwork.color} variant="secondary">
                    {currentNetwork.name}
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Unknown Network
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="border-gray-200">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => switchToBSC("0x38", "BSC Mainnet", "https://bsc-dataseed1.binance.org")}>
                Switch to BSC Mainnet
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => switchToBSC("0x61", "BSC Testnet", "https://data-seed-prebsc-1-s1.binance.org:8545")}
              >
                Switch to BSC Testnet
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => window.open(`${currentNetwork?.explorer}/address/${currentAccount}`, "_blank")}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View on Explorer
              </DropdownMenuItem>
              <DropdownMenuItem onClick={disconnect} className="text-red-600">
                Disconnect Wallet
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  )
}

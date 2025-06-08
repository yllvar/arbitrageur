"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wallet, Copy, ExternalLink, ChevronDown, AlertTriangle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface MobileWalletConnectionProps {
  isConnected: boolean
  currentAccount: string
  networkId: number | null
  balance: string
  onConnect: () => void
  onDisconnect: () => void
  onSwitchNetwork: (chainId: number) => void
}

export function MobileWalletConnection({
  isConnected,
  currentAccount,
  networkId,
  balance,
  onConnect,
  onDisconnect,
  onSwitchNetwork,
}: MobileWalletConnectionProps) {
  const networks = {
    56: { name: "BSC Mainnet", explorer: "https://bscscan.com", color: "bg-yellow-100 text-yellow-800" },
    97: { name: "BSC Testnet", explorer: "https://testnet.bscscan.com", color: "bg-blue-100 text-blue-800" },
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(currentAccount)
  }

  const currentNetwork = networks[networkId as keyof typeof networks]
  const isCorrectNetwork = networkId === 56 || networkId === 97

  if (!isConnected) {
    return (
      <Card className="mx-4 mb-4">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wallet className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
          <p className="text-gray-600 text-sm mb-6">Connect MetaMask to start trading on BSC</p>
          <Button onClick={onConnect} className="w-full h-12 text-lg">
            <Wallet className="h-5 w-5 mr-2" />
            Connect Wallet
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mx-4 mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          {/* Wallet Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{formatAddress(currentAccount)}</span>
                <Button variant="ghost" size="sm" onClick={copyAddress} className="h-6 w-6 p-0">
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-600">{balance} BNB</span>
                {currentNetwork ? (
                  <Badge className={`${currentNetwork.color} text-xs`} variant="secondary">
                    {currentNetwork.name}
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="flex items-center gap-1 text-xs">
                    <AlertTriangle className="h-3 w-3" />
                    Unknown
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Actions Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => onSwitchNetwork(56)}>Switch to BSC Mainnet</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSwitchNetwork(97)}>Switch to BSC Testnet</DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => window.open(`${currentNetwork?.explorer}/address/${currentAccount}`, "_blank")}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View on Explorer
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDisconnect} className="text-red-600">
                Disconnect Wallet
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Network Warning */}
        {!isCorrectNetwork && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-800 text-sm">
              <AlertTriangle className="h-4 w-4" />
              <span>Please switch to BSC network</span>
            </div>
            <Button onClick={() => onSwitchNetwork(56)} size="sm" className="mt-2 w-full bg-red-600 hover:bg-red-700">
              Switch to BSC Mainnet
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

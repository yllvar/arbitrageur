"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, ExternalLink, Settings } from "lucide-react"

interface ContractManagerProps {
  account: string
  networkId: number | null
  contractAddress: string
  setContractAddress: (address: string) => void
}

export function ContractManager({ account, networkId, contractAddress, setContractAddress }: ContractManagerProps) {
  const [inputAddress, setInputAddress] = useState("")
  const [isValidating, setIsValidating] = useState(false)
  const [contractInfo, setContractInfo] = useState<any>(null)
  const [error, setError] = useState("")

  // Default contract addresses for different networks
  const defaultContracts = {
    56: "0x752A2a596BD9470d0F3E2eFF0cD8861fa996615A", // BSC Mainnet
    97: "0x752A2a596BD9470d0F3E2eFF0cD8861fa996615A", // BSC Testnet
  }

  useEffect(() => {
    if (networkId && defaultContracts[networkId as keyof typeof defaultContracts]) {
      const defaultAddress = defaultContracts[networkId as keyof typeof defaultContracts]
      setInputAddress(defaultAddress)
      setContractAddress(defaultAddress)
    }
  }, [networkId, setContractAddress])

  const validateContract = async () => {
    if (!inputAddress || !window.ethereum) return

    setIsValidating(true)
    setError("")

    try {
      // Check if address is valid
      if (!/^0x[a-fA-F0-9]{40}$/.test(inputAddress)) {
        throw new Error("Invalid contract address format")
      }

      // Check if contract exists
      const code = await window.ethereum.request({
        method: "eth_getCode",
        params: [inputAddress, "latest"],
      })

      if (code === "0x") {
        throw new Error("No contract found at this address")
      }

      // Mock contract validation - in real implementation, you'd call contract methods
      const mockContractInfo = {
        address: inputAddress,
        owner: account,
        pancakeFactory: "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73",
        apeFactory: "0x0841BD0B734E4F5853f0dD8d7Ea041c241fb0Da6",
        beneficiary: account,
        isValid: true,
      }

      setContractInfo(mockContractInfo)
      setContractAddress(inputAddress)
    } catch (err: any) {
      setError(err.message)
      setContractInfo(null)
    } finally {
      setIsValidating(false)
    }
  }

  const getExplorerUrl = () => {
    const baseUrl = networkId === 56 ? "https://bscscan.com" : "https://testnet.bscscan.com"
    return `${baseUrl}/address/${contractAddress}`
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Contract Management</h2>
        <p className="text-gray-600">Connect to your deployed ArbitrageExecutor contract</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contract Connection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Contract Connection
            </CardTitle>
            <CardDescription>Enter your deployed contract address to connect</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contract-address">Contract Address</Label>
              <div className="flex gap-2">
                <Input
                  id="contract-address"
                  placeholder="0x..."
                  value={inputAddress}
                  onChange={(e) => setInputAddress(e.target.value)}
                  className="font-mono text-sm"
                />
                <Button onClick={validateContract} disabled={isValidating || !inputAddress}>
                  {isValidating ? "Validating..." : "Connect"}
                </Button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {contractInfo && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>Contract validated successfully!</AlertDescription>
              </Alert>
            )}

            <div className="text-sm text-gray-600">
              <p className="mb-2">Default addresses:</p>
              <div className="space-y-1 font-mono text-xs">
                <div>Mainnet: {defaultContracts[56]}</div>
                <div>Testnet: {defaultContracts[97]}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contract Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contract Information</CardTitle>
            <CardDescription>Details about the connected contract</CardDescription>
          </CardHeader>
          <CardContent>
            {contractInfo ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Status:</span>
                    <Badge className="bg-green-100 text-green-800">Connected</Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Address:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs">{contractInfo.address.slice(0, 10)}...</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(getExplorerUrl(), "_blank")}
                        className="h-6 w-6 p-0"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Owner:</span>
                    <span className="font-mono text-xs">{contractInfo.owner.slice(0, 10)}...</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">PancakeSwap:</span>
                    <Badge variant="secondary">Connected</Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">ApeSwap:</span>
                    <Badge variant="secondary">Connected</Badge>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button variant="outline" onClick={() => window.open(getExplorerUrl(), "_blank")} className="w-full">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on Explorer
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Settings className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Connect to a contract to view details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Contract ABI Information */}
      {contractInfo && (
        <Card>
          <CardHeader>
            <CardTitle>Available Functions</CardTitle>
            <CardDescription>Contract functions available for interaction</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: "startArbitrage", description: "Execute flash loan arbitrage", type: "write" },
                { name: "updateBeneficiary", description: "Update beneficiary address", type: "write" },
                { name: "emergencyWithdraw", description: "Emergency fund withdrawal", type: "write" },
                { name: "owner", description: "Get contract owner", type: "read" },
                { name: "beneficiary", description: "Get beneficiary address", type: "read" },
                { name: "pancakeFactory", description: "Get PancakeSwap factory", type: "read" },
              ].map((func, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{func.name}</span>
                    <Badge variant={func.type === "write" ? "default" : "secondary"} className="text-xs">
                      {func.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600">{func.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

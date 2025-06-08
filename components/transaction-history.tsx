"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ExternalLink, Search, Filter, TrendingUp, TrendingDown, Clock } from "lucide-react"

interface Transaction {
  id: string
  timestamp: Date
  pair: string
  direction: string
  amount: number
  profit: number
  gasUsed: number
  status: "success" | "failed" | "pending"
  txHash: string
  blockNumber: number
}

interface TransactionHistoryProps {
  account: string
  networkId: number | null
}

export function TransactionHistory({ account, networkId }: TransactionHistoryProps) {
  const [transactions] = useState<Transaction[]>([
    {
      id: "1",
      timestamp: new Date(Date.now() - 3600000),
      pair: "WBNB/BUSD",
      direction: "PancakeSwap → ApeSwap",
      amount: 1.5,
      profit: 2.34,
      gasUsed: 0.0032,
      status: "success",
      txHash: "0x1234567890abcdef1234567890abcdef12345678",
      blockNumber: 32145678,
    },
    {
      id: "2",
      timestamp: new Date(Date.now() - 7200000),
      pair: "BUSD/WBNB",
      direction: "ApeSwap → PancakeSwap",
      amount: 500,
      profit: -1.23,
      gasUsed: 0.0028,
      status: "failed",
      txHash: "0x2345678901bcdef12345678901bcdef123456789",
      blockNumber: 32145650,
    },
    {
      id: "3",
      timestamp: new Date(Date.now() - 10800000),
      pair: "WBNB/BUSD",
      direction: "PancakeSwap → ApeSwap",
      amount: 2.1,
      profit: 4.56,
      gasUsed: 0.0035,
      status: "success",
      txHash: "0x3456789012cdef123456789012cdef1234567890",
      blockNumber: 32145620,
    },
    {
      id: "4",
      timestamp: new Date(Date.now() - 14400000),
      pair: "CAKE/BUSD",
      direction: "ApeSwap → PancakeSwap",
      amount: 100,
      profit: 1.89,
      gasUsed: 0.003,
      status: "success",
      txHash: "0x456789013def12345678903def12345678901234",
      blockNumber: 32145590,
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [timeFilter, setTimeFilter] = useState("all")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800 border-green-200"
      case "failed":
        return "bg-red-100 text-red-800 border-red-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getProfitColor = (profit: number) => {
    return profit > 0 ? "text-green-600" : "text-red-600"
  }

  const getExplorerUrl = (txHash: string) => {
    const baseUrl = networkId === 56 ? "https://bscscan.com" : "https://testnet.bscscan.com"
    return `${baseUrl}/tx/${txHash}`
  }

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.pair.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.direction.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.txHash.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || tx.status === statusFilter

    let matchesTime = true
    if (timeFilter !== "all") {
      const now = new Date()
      const txTime = tx.timestamp
      switch (timeFilter) {
        case "24h":
          matchesTime = now.getTime() - txTime.getTime() <= 24 * 60 * 60 * 1000
          break
        case "7d":
          matchesTime = now.getTime() - txTime.getTime() <= 7 * 24 * 60 * 60 * 1000
          break
        case "30d":
          matchesTime = now.getTime() - txTime.getTime() <= 30 * 24 * 60 * 60 * 1000
          break
      }
    }

    return matchesSearch && matchesStatus && matchesTime
  })

  const totalProfit = transactions.filter((tx) => tx.status === "success").reduce((sum, tx) => sum + tx.profit, 0)

  const successRate =
    transactions.length > 0
      ? (transactions.filter((tx) => tx.status === "success").length / transactions.length) * 100
      : 0

  const totalGasUsed = transactions.reduce((sum, tx) => sum + tx.gasUsed, 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Transaction History</h2>
          <p className="text-gray-600">Track your arbitrage trading performance and history</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Trades</p>
                <p className="text-2xl font-bold">{transactions.length}</p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Filter className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Profit</p>
                <p className={`text-2xl font-bold ${getProfitColor(totalProfit)}`}>
                  {totalProfit > 0 ? "+" : ""}
                  {totalProfit.toFixed(2)} BUSD
                </p>
              </div>
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  totalProfit > 0 ? "bg-green-100" : "bg-red-100"
                }`}
              >
                {totalProfit > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold">{successRate.toFixed(1)}%</p>
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
                <p className="text-sm text-gray-600">Gas Used</p>
                <p className="text-2xl font-bold">{totalGasUsed.toFixed(4)} BNB</p>
              </div>
              <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                <Clock className="h-4 w-4 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by pair, direction, or transaction hash..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Filter by time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="24h">Last 24 Hours</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transaction List */}
      <div className="space-y-4">
        {filteredTransactions.map((tx) => (
          <Card key={tx.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge className={`${getStatusColor(tx.status)} border`} variant="secondary">
                      {tx.status.toUpperCase()}
                    </Badge>
                    <span className="font-medium">{tx.pair}</span>
                    <span className="text-sm text-gray-600">{tx.direction}</span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>{tx.timestamp.toLocaleString()}</div>
                    <div className="flex items-center gap-4">
                      <span>
                        Amount: {tx.amount} {tx.pair.split("/")[0]}
                      </span>
                      <span>Block: #{tx.blockNumber}</span>
                    </div>
                    <div className="font-mono text-xs">
                      Tx: {tx.txHash.slice(0, 10)}...{tx.txHash.slice(-8)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className={`font-medium ${getProfitColor(tx.profit)}`}>
                      {tx.profit > 0 ? "+" : ""}
                      {tx.profit.toFixed(2)} BUSD
                    </div>
                    <div className="text-sm text-gray-600">Gas: {tx.gasUsed.toFixed(4)} BNB</div>
                  </div>

                  <Button variant="outline" size="sm" onClick={() => window.open(getExplorerUrl(tx.txHash), "_blank")}>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTransactions.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Clock className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-600">No transactions found matching your criteria.</p>
            <p className="text-sm text-gray-500 mt-1">
              Try adjusting your filters or execute some trades to see history.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

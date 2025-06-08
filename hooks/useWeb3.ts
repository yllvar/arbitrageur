"use client"

import { useState, useEffect } from "react"
import { NETWORK_CONFIG } from "@/lib/web3"

export function useWeb3() {
  const [account, setAccount] = useState<string>("")
  const [networkId, setNetworkId] = useState<number | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [balance, setBalance] = useState<string>("0")

  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      throw new Error("MetaMask is not installed")
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      if (accounts.length > 0) {
        setAccount(accounts[0])
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

        // Setup listeners
        window.ethereum.on("accountsChanged", handleAccountsChanged)
        window.ethereum.on("chainChanged", handleChainChanged)
      }
    } catch (error) {
      console.error("Error connecting wallet:", error)
      throw error
    }
  }

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      setIsConnected(false)
      setAccount("")
    } else {
      setAccount(accounts[0])
    }
  }

  const handleChainChanged = (chainId: string) => {
    setNetworkId(Number.parseInt(chainId, 16))
    window.location.reload()
  }

  const switchNetwork = async (chainId: number) => {
    const config = NETWORK_CONFIG[chainId as keyof typeof NETWORK_CONFIG]
    if (!config) throw new Error("Unsupported network")

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      })
    } catch (error: any) {
      if (error.code === 4902) {
        // Network not added, add it
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: `0x${chainId.toString(16)}`,
              chainName: config.name,
              nativeCurrency: {
                name: "BNB",
                symbol: "BNB",
                decimals: 18,
              },
              rpcUrls: [config.rpcUrl],
              blockExplorerUrls: [config.explorer],
            },
          ],
        })
      } else {
        throw error
      }
    }
  }

  const disconnect = () => {
    setIsConnected(false)
    setAccount("")
    setNetworkId(null)
    setBalance("0")
  }

  useEffect(() => {
    // Check if already connected
    const checkConnection = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" })
          if (accounts.length > 0) {
            setAccount(accounts[0])
            setIsConnected(true)

            const chainId = await window.ethereum.request({ method: "eth_chainId" })
            setNetworkId(Number.parseInt(chainId, 16))
          }
        } catch (error) {
          console.error("Error checking connection:", error)
        }
      }
    }

    checkConnection()
  }, [])

  return {
    account,
    networkId,
    isConnected,
    balance,
    connectWallet,
    switchNetwork,
    disconnect,
  }
}

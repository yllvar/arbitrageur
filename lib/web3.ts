// Web3 utilities for contract interaction
export const CONTRACT_ABI = [
  {
    inputs: [
      { internalType: "address", name: "token0", type: "address" },
      { internalType: "address", name: "token1", type: "address" },
      { internalType: "uint256", name: "amount0", type: "uint256" },
      { internalType: "uint256", name: "amount1", type: "uint256" },
      { internalType: "address", name: "startFactory", type: "address" },
      { internalType: "address", name: "endRouterAddress", type: "address" },
      { internalType: "uint256", name: "repay", type: "uint256" },
    ],
    name: "startArbitrage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "beneficiary",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
]

export const NETWORK_CONFIG = {
  56: {
    name: "BSC Mainnet",
    rpcUrl: "https://bsc-dataseed1.binance.org",
    explorer: "https://bscscan.com",
    contracts: {
      pancakeFactory: "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73",
      pancakeRouter: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
      apeFactory: "0x0841BD0B734E4F5853f0dD8d7Ea041c241fb0Da6",
      apeRouter: "0xcF0feBd3f17CEf5b47b0cD257aCf6025c5BFf3b7",
      wbnb: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
      busd: "0xe9e7cea3dedca5984780bafc599bd69add087d56",
    },
  },
  97: {
    name: "BSC Testnet",
    rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545",
    explorer: "https://testnet.bscscan.com",
    contracts: {
      pancakeFactory: "0x6725F303b657a9451d8BA641348b6761A6CC7a17",
      pancakeRouter: "0xD99D1c33F9fC3444f8101754aBC46c52416550D1",
      apeFactory: "0x0841BD0B734E4F5853f0dD8d7Ea041c241fb0Da6",
      apeRouter: "0xcF0feBd3f17CEf5b47b0cD257aCf6025c5BFf3b7",
      wbnb: "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",
      busd: "0x78867BbEeF44f2326bF8DDd1941a4439382EF2A7",
    },
  },
}

export const formatAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export const formatAmount = (amount: number, decimals = 4) => {
  return amount.toFixed(decimals)
}

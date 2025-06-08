// DEX API integration for real price data
export interface PriceData {
  pair: string
  pancakePrice: number
  apePrice: number
  volume24h: number
  lastUpdated: Date
}

export class DEXPriceService {
  private static instance: DEXPriceService
  private priceCache: Map<string, PriceData> = new Map()
  private updateInterval: NodeJS.Timeout | null = null

  static getInstance(): DEXPriceService {
    if (!DEXPriceService.instance) {
      DEXPriceService.instance = new DEXPriceService()
    }
    return DEXPriceService.instance
  }

  async fetchPancakeSwapPrice(tokenA: string, tokenB: string): Promise<number> {
    try {
      // Mock API call - replace with actual PancakeSwap API
      const response = await fetch(`https://api.pancakeswap.info/api/v2/tokens/${tokenA}`)
      const data = await response.json()
      return data.data?.price || 0
    } catch (error) {
      console.error("Error fetching PancakeSwap price:", error)
      return 0
    }
  }

  async fetchApeSwapPrice(tokenA: string, tokenB: string): Promise<number> {
    try {
      // Mock API call - replace with actual ApeSwap API
      const response = await fetch(`https://apeswap.finance/api/v1/price/${tokenA}`)
      const data = await response.json()
      return data.price || 0
    } catch (error) {
      console.error("Error fetching ApeSwap price:", error)
      return 0
    }
  }

  async getPriceComparison(pairs: string[]): Promise<PriceData[]> {
    const results: PriceData[] = []

    for (const pair of pairs) {
      const [tokenA, tokenB] = pair.split("/")

      // Simulate real API calls with mock data
      const pancakePrice = 310.45 + (Math.random() - 0.5) * 10
      const apePrice = 312.18 + (Math.random() - 0.5) * 10

      const priceData: PriceData = {
        pair,
        pancakePrice,
        apePrice,
        volume24h: Math.random() * 1000000,
        lastUpdated: new Date(),
      }

      results.push(priceData)
      this.priceCache.set(pair, priceData)
    }

    return results
  }

  startAutoUpdate(pairs: string[], callback: (data: PriceData[]) => void) {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
    }

    this.updateInterval = setInterval(async () => {
      const data = await this.getPriceComparison(pairs)
      callback(data)
    }, 5000)
  }

  stopAutoUpdate() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
      this.updateInterval = null
    }
  }
}

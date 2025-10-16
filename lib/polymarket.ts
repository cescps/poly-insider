import { PolymarketTrade, Market, TradeEvent, UserStats, MarketStats } from "@/types"

const DATA_API_BASE = "https://data-api.polymarket.com"
const GAMMA_API_BASE = "https://gamma-api.polymarket.com"

export interface TradeHistoryParams {
  limit?: number
  offset?: number
}

// Fetch recent trades from Data API (public endpoint)
export const fetchRecentTrades = async (
  params: TradeHistoryParams = { limit: 100 }
): Promise<PolymarketTrade[]> => {
  try {
    const url = `${DATA_API_BASE}/trades?${new URLSearchParams({
      limit: String(params.limit || 100),
      offset: String(params.offset || 0),
    })}`

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 0 }, // Don't cache
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch trades: ${response.statusText}`)
    }

    const data = await response.json()
    // Convert timestamps from seconds to milliseconds
    const trades = (data as PolymarketTrade[]).map(trade => ({
      ...trade,
      timestamp: trade.timestamp * 1000, // Convert to milliseconds
    }))
    return trades
  } catch (error) {
    console.error("Error fetching trades:", error)
    return []
  }
}

// Fetch user's trade history to determine markets traded and account age
export const fetchUserTradeHistory = async (
  address: string
): Promise<PolymarketTrade[]> => {
  try {
    const url = `${DATA_API_BASE}/trades?user=${address}&limit=1000`

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 }, // Cache for 1 minute
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch user history: ${response.statusText}`)
    }

    const data = await response.json()
    // Convert timestamps from seconds to milliseconds
    const trades = (data as PolymarketTrade[]).map(trade => ({
      ...trade,
      timestamp: trade.timestamp * 1000, // Convert to milliseconds
    }))
    return trades
  } catch (error) {
    console.error(`Error fetching user history for ${address}:`, error)
    return []
  }
}

// Fetch market information by condition ID
export const fetchMarket = async (conditionId: string): Promise<Market | null> => {
  try {
    const url = `${GAMMA_API_BASE}/markets/${conditionId}`

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      // Silently return null for market fetch failures - trade data has title anyway
      return null
    }

    const data = await response.json()
    return data as Market
  } catch (error) {
    // Silently fail - we'll use trade title instead
    return null
  }
}

// Fetch markets by multiple condition IDs
export const fetchMarkets = async (conditionIds: string[]): Promise<Map<string, Market>> => {
  const marketMap = new Map<string, Market>()
  
  // Fetch markets in parallel
  const results = await Promise.allSettled(
    conditionIds.map(id => fetchMarket(id))
  )

  results.forEach((result, index) => {
    if (result.status === "fulfilled" && result.value) {
      marketMap.set(conditionIds[index], result.value)
    }
  })

  return marketMap
}

// Get comprehensive user statistics
export const getUserStats = async (address: string) => {
  try {
    const trades = await fetchUserTradeHistory(address)

    if (trades.length === 0) {
      return {
        address,
        marketsTraded: 0,
        accountCreated: Date.now(),
        totalVolume: 0,
        totalTrades: 0,
        totalPnL: 0,
        openPositions: 0,
        openPositionsValue: 0,
      }
    }

    // Count unique markets
    const uniqueMarkets = new Set(trades.map((t) => t.conditionId || t.market))

    // Calculate total volume and PnL
    let totalVolume = 0
    let totalPnL = 0

    trades.forEach(trade => {
      const tradeSize = parseFloat(trade.size) * parseFloat(trade.price)
      totalVolume += tradeSize

      // Simplified PnL calculation (this would need more sophisticated logic in practice)
      // For now, we'll use a basic calculation
      const pnl = trade.side === 'BUY' ? -tradeSize : tradeSize
      totalPnL += pnl
    })

    // Find oldest trade timestamp as proxy for account creation
    const oldestTrade = trades.reduce((oldest, current) => {
      return current.timestamp < oldest.timestamp ? current : oldest
    })

    // Get user profile information if available
    const profile = await fetchUserProfile(address)

    return {
      address,
      marketsTraded: uniqueMarkets.size,
      accountCreated: oldestTrade.timestamp,
      totalVolume,
      totalTrades: trades.length,
      totalPnL,
      openPositions: uniqueMarkets.size, // Approximation - would need separate API call
      openPositionsValue: totalVolume * 0.1, // Approximation - would need separate API call
      walletName: profile?.username,
    }
  } catch (error) {
    console.error(`Error getting user stats for ${address}:`, error)
    return {
      address,
      marketsTraded: 0,
      accountCreated: Date.now(),
      totalVolume: 0,
      totalTrades: 0,
      totalPnL: 0,
      openPositions: 0,
      openPositionsValue: 0,
    }
  }
}

// Fetch user profile information
export const fetchUserProfile = async (address: string): Promise<{ username?: string } | null> => {
  try {
    // This would typically be a call to a user profile API
    // For now, return null as we don't have a direct API for this
    return null
  } catch (error) {
    console.error(`Error fetching user profile for ${address}:`, error)
    return null
  }
}

// Get comprehensive market statistics for a user
export const getMarketStats = async (address: string, conditionId: string): Promise<MarketStats> => {
  try {
    const allTrades = await fetchUserTradeHistory(address)
    const marketTrades = allTrades.filter(t => (t.conditionId || t.market) === conditionId)

    if (marketTrades.length === 0) {
      return {
        conditionId,
        marketName: '',
        marketSlug: '',
        tradesInMarket: 0,
        volumeInMarket: 0,
        pnlInMarket: 0,
      }
    }

    let volumeInMarket = 0
    let pnlInMarket = 0

    marketTrades.forEach(trade => {
      const tradeSize = parseFloat(trade.size) * parseFloat(trade.price)
      volumeInMarket += tradeSize

      // Simplified PnL calculation
      const pnl = trade.side === 'BUY' ? -tradeSize : tradeSize
      pnlInMarket += pnl
    })

    // Calculate entry price (first trade price)
    const firstTrade = marketTrades.reduce((first, current) => {
      return current.timestamp < first.timestamp ? current : first
    })
    const entryPrice = parseFloat(firstTrade.price)

    // Calculate average price
    const totalSize = marketTrades.reduce((sum, trade) => sum + parseFloat(trade.size), 0)
    const avgPrice = volumeInMarket / totalSize

    return {
      conditionId,
      marketName: marketTrades[0]?.title || `Market ${conditionId.slice(0, 8)}`,
      marketSlug: marketTrades[0]?.slug || marketTrades[0]?.eventSlug || conditionId,
      tradesInMarket: marketTrades.length,
      volumeInMarket,
      pnlInMarket,
      entryPrice,
      avgPrice,
    }
  } catch (error) {
    console.error(`Error getting market stats for ${address} on ${conditionId}:`, error)
    return {
      conditionId,
      marketName: '',
      marketSlug: '',
      tradesInMarket: 0,
      volumeInMarket: 0,
      pnlInMarket: 0,
    }
  }
}


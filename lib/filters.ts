import { PolymarketTrade, FilteredTrade, Market, UserStats, MarketStats } from "@/types"
import { getUserStats, fetchMarkets, getMarketStats } from "./polymarket"
import { FILTER_CONFIG } from "./config"

const TWO_DAYS_MS = FILTER_CONFIG.MAX_ACCOUNT_AGE_DAYS * 24 * 60 * 60 * 1000
const MIN_TRADE_SIZE = FILTER_CONFIG.MIN_TRADE_SIZE_USD

interface TradeWithStats extends PolymarketTrade {
  userStats?: {
    marketsTraded: number
    accountCreated: number
  }
}

// Filter trades based on criteria and calculate comprehensive metrics
export const filterTrades = async (
  trades: PolymarketTrade[]
): Promise<FilteredTrade[]> => {
  const now = Date.now()
  const filteredTrades: FilteredTrade[] = []

  // Process trades in parallel with rate limiting
  const tradesWithStats = await Promise.all(
    trades.map(async (trade) => {
      try {
        // Calculate trade size (price * size)
        const tradeSize = parseFloat(trade.price) * parseFloat(trade.size)

        // Filter by size first (cheapest check)
        if (tradeSize < MIN_TRADE_SIZE) {
          return null
        }

        // Get user statistics
        const address = trade.proxyWallet || trade.maker_address || trade.taker_address
        if (!address) return null

        const userStats = await getUserStats(address)

        // Filter by account age (less than 2 days AT THE TIME OF TRADE)
        // This allows historical trades to show up if the account was new when the trade happened
        const accountAgeAtTradeTime = trade.timestamp - userStats.accountCreated
        if (accountAgeAtTradeTime > TWO_DAYS_MS) {
          return null
        }

        // Filter by market concentration
        if (
          userStats.marketsTraded < FILTER_CONFIG.MIN_MARKETS_TRADED ||
          userStats.marketsTraded > FILTER_CONFIG.MAX_MARKETS_TRADED
        ) {
          return null
        }

        // Get market-specific statistics
        const conditionId = trade.conditionId || trade.market || ""
        const marketStats = await getMarketStats(address, conditionId)

        // Calculate concentrations and other derived metrics
        const volumeConcentration = userStats.totalVolume > 0 && marketStats.volumeInMarket >= 0 ? (marketStats.volumeInMarket / userStats.totalVolume) * 100 : 0
        const tradeConcentration = userStats.totalTrades > 0 && marketStats.tradesInMarket >= 0 ? (marketStats.tradesInMarket / userStats.totalTrades) * 100 : 0

        // Calculate wallet age in days
        const walletAge = userStats.accountCreated > 0 ? (now - userStats.accountCreated) / (24 * 60 * 60 * 1000) : 0

        // Calculate days between wallet creation and this trade
        const walletCreationToTradeDelta = accountAgeAtTradeTime >= 0 ? accountAgeAtTradeTime / (24 * 60 * 60 * 1000) : 0

        return {
          trade,
          userStats,
          marketStats,
          tradeSize,
          volumeConcentration,
          tradeConcentration,
          walletAge,
          walletCreationToTradeDelta,
        }
      } catch (error) {
        console.error("Error processing trade:", error)
        return null
      }
    })
  )

  // Filter out nulls and get market information
  const validTrades = tradesWithStats.filter((t) => t !== null) as Array<{
    trade: PolymarketTrade
    userStats: UserStats
    marketStats: MarketStats
    tradeSize: number
    volumeConcentration: number
    tradeConcentration: number
    walletAge: number
    walletCreationToTradeDelta: number
  }>

  if (validTrades.length === 0) {
    return []
  }

  // Fetch market information for all valid trades (for additional market data if needed)
  const uniqueMarketIds = [...new Set(validTrades.map((t) => t.trade.conditionId || t.trade.market || ""))]
  const marketMap = await fetchMarkets(uniqueMarketIds.filter(id => id !== ""))

  // Build final filtered trades with comprehensive information
  for (const { trade, userStats, marketStats, tradeSize, volumeConcentration, tradeConcentration, walletAge, walletCreationToTradeDelta } of validTrades) {
    const marketId = trade.conditionId || trade.market || ""
    const market = marketMap.get(marketId)

    // Use trade data first, fallback to market API data, then to marketStats
    const marketName = trade.title || market?.question || market?.title || marketStats.marketName || `Market ${marketId.slice(0, 8)}...`
    const marketSlug = trade.eventSlug || trade.slug || market?.market_slug || market?.slug || marketStats.marketSlug || marketId

    filteredTrades.push({
      id: trade.transactionHash || trade.id || `${trade.proxyWallet}-${trade.timestamp}`,
      wallet: (trade.proxyWallet || trade.maker_address || trade.taker_address || "").trim().toLowerCase(),
      walletName: userStats.walletName,
      size: tradeSize,
      side: trade.side,
      outcome: trade.outcome || "Unknown",
      marketName,
      marketSlug,
      timestamp: trade.timestamp,
      price: parseFloat(trade.price) || 0,
      entryPrice: marketStats.entryPrice || undefined,
      avgPrice: marketStats.avgPrice || undefined,
      marketTrades: marketStats.tradesInMarket || 0,
      marketVolume: marketStats.volumeInMarket || 0,
      volumeConcentration,
      marketPnL: marketStats.pnlInMarket || 0,
      totalTrades: userStats.totalTrades || 0,
      tradeConcentration,
      openPositions: userStats.openPositions || 0,
      openPositionsValue: userStats.openPositionsValue || 0,
      totalPnL: userStats.totalPnL || 0,
      totalVolume: userStats.totalVolume || 0,
      walletAge,
      walletCreationToTradeDelta,
    })
  }

  // Sort by timestamp (most recent first)
  return filteredTrades.sort((a, b) => b.timestamp - a.timestamp)
}

// Helper function to format relative time
export const formatRelativeTime = (timestamp: number): string => {
  if (timestamp == null || isNaN(timestamp)) return "unknown"
  const now = Date.now()
  const diff = now - timestamp
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return `${days}d ago`
  }
  if (hours > 0) {
    return `${hours}h ago`
  }
  if (minutes > 0) {
    return `${minutes}m ago`
  }
  return "just now"
}

// Helper function to format currency
export const formatCurrency = (amount: number): string => {
  if (amount == null || isNaN(amount)) return "$0"
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Helper function to format percentage
export const formatPercentage = (value: number, decimals: number = 1): string => {
  if (value == null || isNaN(value)) return "0.0%"
  return `${value.toFixed(decimals)}%`
}

// Helper function to format price
export const formatPrice = (price: number): string => {
  if (price == null || isNaN(price)) return "$0.00"
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(price)
}

// Helper function to format large numbers
export const formatNumber = (num: number): string => {
  if (num == null || isNaN(num)) return "0"
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toFixed(0)
}

// Helper function to format wallet age
export const formatWalletAge = (days: number): string => {
  if (days == null || isNaN(days)) return "0d"
  if (days < 1) {
    return '<1d'
  } else if (days < 30) {
    return `${Math.floor(days)}d`
  } else if (days < 365) {
    const months = Math.floor(days / 30)
    return `${months}mo`
  } else {
    const years = Math.floor(days / 365)
    return `${years}y`
  }
}


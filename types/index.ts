export interface PolymarketTrade {
  id?: string
  transactionHash?: string
  proxyWallet: string
  side: "BUY" | "SELL"
  asset?: string
  conditionId: string
  size: string
  price: string
  timestamp: number
  title?: string
  slug?: string
  eventSlug?: string
  outcome: string
  outcomeIndex?: number
  name?: string
  pseudonym?: string
  profileImage?: string
  
  // Legacy fields for backward compatibility
  market?: string
  asset_id?: string
  maker_address?: string
  taker_address?: string
}

export interface Market {
  id: string
  question: string
  description?: string
  market_slug?: string
  end_date_iso?: string
  game_start_time?: string
  question_id?: string
  slug?: string
  title?: string
}

export interface UserStats {
  address: string
  marketsTraded: number
  accountCreated: number
  totalVolume: number
  totalTrades: number
  totalPnL: number
  openPositions: number
  openPositionsValue: number
  walletName?: string
}

export interface MarketStats {
  conditionId: string
  marketName: string
  marketSlug: string
  tradesInMarket: number
  volumeInMarket: number
  pnlInMarket: number
  entryPrice?: number
  avgPrice?: number
}

export interface FilteredTrade {
  id: string
  wallet: string
  walletName?: string // Username of the trader
  size: number // Buy order size
  side: "BUY" | "SELL" // Buy or sell position
  outcome: string // Bet outcome (Yes/No)
  marketName: string // Market title
  marketSlug: string
  timestamp: number // Trade time
  price: number // Price per share at execution
  entryPrice?: number // Trader's initial share price in this market
  avgPrice?: number // Trader's average purchase price in this market
  marketTrades: number // Total trades in this market by user
  marketVolume: number // Total USDC volume in this market
  volumeConcentration: number // % of user's total volume in this market
  marketPnL: number // User's PnL in this market (USDC)
  totalTrades: number // Total trades by user on Polymarket
  tradeConcentration: number // % of user's trades in this market
  openPositions: number // Number of open positions
  openPositionsValue: number // Total USDC value of open positions
  totalPnL: number // User's overall PnL (USDC)
  totalVolume: number // User's total traded volume (USDC)
  walletAge: number // Days since wallet creation
  walletCreationToTradeDelta: number // Days between wallet creation and this trade
}

export interface TradeEvent {
  id: string
  asset_id: string
  market: string
  price: number
  side: string
  size: number
  timestamp: number
  taker_address?: string
  maker_address: string
  outcome?: string
  type?: string
}


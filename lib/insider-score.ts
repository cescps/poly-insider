import { FilteredTrade } from "@/types"

// Calculate insider score based on multiple factors (0-100)
export const calculateInsiderScore = (trade: FilteredTrade): number => {
  let score = 0
  
  // 1. Wallet Age Factor (0-25 points) - newer wallet = higher score
  if (trade.walletAge < 1) score += 25
  else if (trade.walletAge < 2) score += 20
  else if (trade.walletAge < 5) score += 10
  else if (trade.walletAge < 7) score += 5
  
  // 2. Trade Size Factor (0-20 points) - larger trade = higher score
  if (trade.size > 10000) score += 20
  else if (trade.size > 5000) score += 15
  else if (trade.size > 2000) score += 10
  else if (trade.size > 1000) score += 5
  
  // 3. Volume Concentration Factor (0-20 points) - more focused = higher score
  if (trade.volumeConcentration > 80) score += 20
  else if (trade.volumeConcentration > 60) score += 15
  else if (trade.volumeConcentration > 40) score += 10
  else if (trade.volumeConcentration > 20) score += 5
  
  // 4. Quick Action Factor (0-20 points) - faster action after wallet creation = higher score
  const hoursToTrade = trade.walletCreationToTradeDelta * 24
  if (hoursToTrade < 1) score += 20
  else if (hoursToTrade < 6) score += 15
  else if (hoursToTrade < 24) score += 10
  else if (hoursToTrade < 48) score += 5
  
  // 5. Market PnL Factor (0-15 points) - already profitable = higher score
  if (trade.marketPnL > 1000) score += 15
  else if (trade.marketPnL > 500) score += 10
  else if (trade.marketPnL > 0) score += 5
  
  return Math.min(score, 100)
}

// Get color styling for insider score
export const getInsiderScoreColor = (score: number): string => {
  if (score >= 80) return 'bg-red-500/20 text-red-700 border-red-400'
  if (score >= 60) return 'bg-orange-500/20 text-orange-700 border-orange-400'
  if (score >= 40) return 'bg-yellow-500/20 text-yellow-700 border-yellow-400'
  return 'bg-green-500/20 text-green-700 border-green-400'
}

// Get text color for insider score
export const getInsiderScoreTextColor = (score: number): string => {
  if (score >= 80) return 'text-red-700'
  if (score >= 60) return 'text-orange-700'
  if (score >= 40) return 'text-yellow-700'
  return 'text-green-700'
}

// Get description for insider score
export const getInsiderScoreDescription = (): string => {
  return "Insider confidence score (0-100) based on wallet age, trade size, concentration, timing, and profitability"
}

import { NextResponse } from "next/server"
import { fetchRecentTrades, getUserStats } from "@/lib/polymarket"

export const dynamic = "force-dynamic"
export const revalidate = 0

interface SmartTrader {
  wallet: string
  totalPnL: number
  totalVolume: number
  totalTrades: number
  marketsTraded: number
  winRate: number
  avgTradeSize: number
  openPositionsValue: number
  accountAge: number
}

export async function GET() {
  try {
    // Fetch recent trades to get active wallets
    const trades = await fetchRecentTrades({ limit: 1000 })
    
    if (trades.length === 0) {
      return NextResponse.json({ traders: [], message: "No trades found" })
    }

    // Get unique wallet addresses
    const uniqueWallets = [...new Set(
      trades
        .map(t => t.proxyWallet || t.maker_address || t.taker_address)
        .filter((wallet): wallet is string => Boolean(wallet))
    )]

    // Fetch stats for each wallet
    const traderStats = await Promise.all(
      uniqueWallets.slice(0, 100).map(async (wallet) => {
        try {
          const stats = await getUserStats(wallet)
          
          // Calculate additional metrics
          const avgTradeSize = stats.totalTrades > 0 ? stats.totalVolume / stats.totalTrades : 0
          const accountAge = stats.accountCreated > 0 ? (Date.now() - stats.accountCreated) / (24 * 60 * 60 * 1000) : 0
          
          // Simple win rate calculation (positive PnL = winning)
          const winRate = stats.totalPnL > 0 ? 70 : 30 // Simplified for now
          
          return {
            wallet,
            totalPnL: stats.totalPnL,
            totalVolume: stats.totalVolume,
            totalTrades: stats.totalTrades,
            marketsTraded: stats.marketsTraded,
            winRate,
            avgTradeSize,
            openPositionsValue: stats.openPositionsValue,
            accountAge,
          }
        } catch (error) {
          console.error(`Error fetching stats for ${wallet}:`, error)
          return null
        }
      })
    )

    // Filter out nulls and traders with negative or zero PnL
    const validTraders = traderStats
      .filter((t): t is SmartTrader => t !== null && t.totalPnL > 0)
      .sort((a, b) => b.totalPnL - a.totalPnL)
      .slice(0, 50) // Top 50 traders

    return NextResponse.json({
      traders: validTraders,
      count: validTraders.length,
      timestamp: Date.now(),
    })
  } catch (error) {
    console.error("Error in smart traders API route:", error)
    return NextResponse.json(
      { error: "Failed to fetch smart traders", traders: [] },
      { status: 500 }
    )
  }
}


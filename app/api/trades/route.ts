import { NextResponse } from "next/server"
import { fetchRecentTrades } from "@/lib/polymarket"
import { filterTrades } from "@/lib/filters"
import { FILTER_CONFIG } from "@/lib/config"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  try {
    // Fetch recent trades from Polymarket
    const trades = await fetchRecentTrades({ limit: FILTER_CONFIG.FETCH_LIMIT })

    if (trades.length === 0) {
      return NextResponse.json({ trades: [], message: "No trades found" })
    }

    // Apply filters (new wallets, market concentration, large trades)
    const filteredTrades = await filterTrades(trades)

    return NextResponse.json({
      trades: filteredTrades,
      count: filteredTrades.length,
      timestamp: Date.now(),
    })
  } catch (error) {
    console.error("Error in trades API route:", error)
    return NextResponse.json(
      { error: "Failed to fetch trades", trades: [] },
      { status: 500 }
    )
  }
}


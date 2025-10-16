import { NextResponse } from "next/server"
import { fetchRecentTrades } from "@/lib/polymarket"
import { filterTrades } from "@/lib/filters"
import { FILTER_CONFIG } from "@/lib/config"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const offset = parseInt(searchParams.get("offset") || "0")
    const limit = parseInt(searchParams.get("limit") || String(FILTER_CONFIG.FETCH_LIMIT))

    console.log(`Fetching historical trades with offset ${offset}, limit ${limit}`)
    
    // Fetch trades with offset for historical search
    const trades = await fetchRecentTrades({ limit, offset })

    if (trades.length === 0) {
      return NextResponse.json({ 
        trades: [], 
        message: "No more trades found",
        hasMore: false 
      })
    }

    // Apply filters
    const filteredTrades = await filterTrades(trades)

    console.log(`Found ${filteredTrades.length} matching trades in historical batch`)

    return NextResponse.json({
      trades: filteredTrades,
      count: filteredTrades.length,
      offset,
      limit,
      hasMore: trades.length === limit, // If we got full batch, there might be more
      timestamp: Date.now(),
    })
  } catch (error) {
    console.error("Error in historical trades API route:", error)
    return NextResponse.json(
      { error: "Failed to fetch historical trades", trades: [], hasMore: false },
      { status: 500 }
    )
  }
}


"use client"

import { useEffect, useState, useCallback } from "react"
import { formatCurrency, formatNumber, formatWalletAge } from "@/lib/filters"
import { getWalletHexColor } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

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

const formatWalletAddress = (address: string) => {
  if (!address) return "Unknown"
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

const getAllWallets = (traders: SmartTrader[]): string[] => {
  return traders.map(trader => trader.wallet).filter(wallet => wallet && wallet !== '')
}

export default function SmartTradersPage() {
  const [traders, setTraders] = useState<SmartTrader[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTraders = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true)
    } else {
      setIsLoading(true)
    }
    setError(null)

    try {
      const response = await fetch("/api/smart-traders", {
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error("Failed to fetch smart traders")
      }

      const data = await response.json()
      setTraders(data.traders || [])
    } catch (err) {
      console.error("Error fetching smart traders:", err)
      setError("Failed to load smart traders. Please try again.")
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchTraders()
  }, [fetchTraders])

  const handleRefresh = () => {
    fetchTraders(true)
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-black">
      <div className="container mx-auto px-3 sm:px-4 pt-6 pb-4 sm:pt-8 sm:pb-8 max-w-full">
        <div className="mb-6 sm:mb-8">
          <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  Smart Traders
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm sm:text-base">
                  Top performing traders with high PnL across all markets
                </p>
              </div>
              <Button
                onClick={handleRefresh}
                disabled={isRefreshing}
                variant="outline"
                size="sm"
                aria-label="Refresh traders"
                className="self-start sm:self-auto dark:border-gray-700 dark:hover:bg-gray-800"
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 sm:mb-6 rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950 p-3 sm:p-4 text-red-600 dark:text-red-400 text-sm sm:text-base">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-800 p-8 sm:p-12 text-center">
            <div className="text-gray-500 dark:text-gray-400">Loading smart traders...</div>
          </div>
        ) : traders.length === 0 ? (
          <div className="bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-800 p-8 sm:p-12 text-center">
            <div className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Smart Traders Found
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              No traders with positive PnL found in recent activity.
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4 sm:mb-6 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg p-3 sm:p-4">
              <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                {traders.length} Smart Trader{traders.length !== 1 ? "s" : ""} with Positive PnL
              </div>
            </div>

            <div className="bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 dark:bg-gray-800 border-b-2 border-gray-200 dark:border-gray-700">
                      <TableHead className="font-semibold text-gray-900 dark:text-white">Rank</TableHead>
                      <TableHead className="font-semibold text-gray-900 dark:text-white">Wallet</TableHead>
                      <TableHead className="font-semibold text-gray-900 dark:text-white text-right">Total PnL</TableHead>
                      <TableHead className="font-semibold text-gray-900 dark:text-white text-right">Total Volume</TableHead>
                      <TableHead className="font-semibold text-gray-900 dark:text-white text-center">Total Trades</TableHead>
                      <TableHead className="font-semibold text-gray-900 dark:text-white text-center">Markets Traded</TableHead>
                      <TableHead className="font-semibold text-gray-900 dark:text-white text-right">Avg Trade Size</TableHead>
                      <TableHead className="font-semibold text-gray-900 dark:text-white text-right">Open Positions Value</TableHead>
                      <TableHead className="font-semibold text-gray-900 dark:text-white text-center">Account Age</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {traders.map((trader, index) => (
                      <TableRow
                        key={trader.wallet}
                        className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        <TableCell className="py-3">
                          <span className="font-semibold text-gray-900">#{index + 1}</span>
                        </TableCell>
                        <TableCell className="py-3">
                          <a
                            href={`https://polymarket.com/profile/${trader.wallet}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-sm hover:underline"
                            style={{ color: getWalletHexColor(trader.wallet, getAllWallets(traders)) }}
                          >
                            {formatWalletAddress(trader.wallet)}
                          </a>
                        </TableCell>
                        <TableCell className="text-right py-3">
                          <span className="font-semibold text-green-600">
                            {formatCurrency(trader.totalPnL)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm py-3">
                          {formatCurrency(trader.totalVolume)}
                        </TableCell>
                        <TableCell className="text-center text-sm py-3">
                          {formatNumber(trader.totalTrades)}
                        </TableCell>
                        <TableCell className="text-center text-sm py-3">
                          {trader.marketsTraded}
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm py-3">
                          {formatCurrency(trader.avgTradeSize)}
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm py-3">
                          {formatCurrency(trader.openPositionsValue)}
                        </TableCell>
                        <TableCell className="text-center text-sm py-3">
                          {formatWalletAge(trader.accountAge)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  )
}


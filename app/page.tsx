"use client"

import { useEffect, useState, useCallback } from "react"
import { FilteredTrade } from "@/types"
import { FILTER_CONFIG } from "@/lib/config"
import { formatCurrency } from "@/lib/filters"
import TradesTable from "@/components/TradesTable"
import LoadingSkeleton from "@/components/LoadingSkeleton"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

const POLLING_INTERVAL = FILTER_CONFIG.POLLING_INTERVAL_MS
const MAX_DISPLAY_TRADES = 100
const STORAGE_KEY = "polymarket-insider-trades"

// Browser notification utilities
const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications')
    return false
  }

  if (Notification.permission === 'granted') {
    return true
  }

  if (Notification.permission === 'denied') {
    return false
  }

  const permission = await Notification.requestPermission()
  return permission === 'granted'
}

const showNotification = (title: string, options?: NotificationOptions): void => {
  if (Notification.permission === 'granted') {
    new Notification(title, options)
  }
}

// Helper functions for localStorage persistence
const saveTradesToStorage = (trades: FilteredTrade[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trades))
  } catch (error) {
    console.warn("Failed to save trades to localStorage:", error)
  }
}

const loadTradesFromStorage = (): FilteredTrade[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.warn("Failed to load trades from localStorage:", error)
    return []
  }
}

export default function Home() {
  const [trades, setTrades] = useState<FilteredTrade[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isSearchingHistory, setIsSearchingHistory] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<number | undefined>(undefined)
  const [hasSearchedHistory, setHasSearchedHistory] = useState(false)
  const [currentHistoryOffset, setCurrentHistoryOffset] = useState(0)
  const [isFetchingMoreHistory, setIsFetchingMoreHistory] = useState(false)

  const fetchTrades = useCallback(async (isManualRefresh = false) => {
    // Only show loading spinner on initial load
    if (isManualRefresh) {
      setIsRefreshing(true)
    } else if (trades.length === 0) {
      setIsLoading(true)
    }
    // Background updates don't show any loading state to prevent UI jumping

    setError(null)

    try {
      const response = await fetch("/api/trades", {
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error("Failed to fetch trades")
      }

      const data = await response.json()
      const newTrades = data.trades || []

      // Update trades with accumulation and persistence
      setTrades(prevTrades => {
        // Create a map of existing trades by ID for deduplication
        const existingIds = new Set(prevTrades.map(t => t.id))

        // Add only new trades that don't already exist
        const uniqueNewTrades = newTrades.filter((t: FilteredTrade) => !existingIds.has(t.id))

        // Show notification for new trades (immediate, no delay)
        if (uniqueNewTrades.length > 0) {
          const newTrade = uniqueNewTrades[0] // Show info about the newest trade
          showNotification(
            '🎯 New Insider Trade Detected!',
            {
              body: `${newTrade.wallet.slice(0, 6)}...${newTrade.wallet.slice(-4)} - ${formatCurrency(newTrade.size)} ${newTrade.outcome} on ${newTrade.marketName}`,
              icon: '/favicon.ico',
              tag: 'new-trade',
              requireInteraction: false,
              silent: false
            }
          )
        }

        // Only update if we have new trades or this is initial load
        if (uniqueNewTrades.length === 0 && prevTrades.length > 0) {
          return prevTrades
        }

        // Combine with existing trades and sort by timestamp (newest first)
        const combined = [...prevTrades, ...uniqueNewTrades].sort((a, b) => b.timestamp - a.timestamp)

        // Keep only the latest 100 trades and save to localStorage
        const latestTrades = combined.slice(0, MAX_DISPLAY_TRADES)
        saveTradesToStorage(latestTrades)

        return latestTrades
      })

      setLastUpdated(Date.now())
    } catch (err) {
      console.error("Error fetching trades:", err)
      // Only show error on initial load or manual refresh
      if (isManualRefresh || trades.length === 0) {
        setError("Failed to load trades. Please try again.")
      }
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [trades.length])
  
  const handleRefresh = useCallback(() => {
    fetchTrades(true)
  }, [fetchTrades])
  
  const searchHistoricalTrades = useCallback(async (initialLoad = true) => {
    if (initialLoad) {
      setIsSearchingHistory(true)
    } else {
      setIsFetchingMoreHistory(true)
    }
    setError(null)
    
    try {
      // Search through past trades in batches
      const batchSize = 500
      const totalToSearch = initialLoad 
        ? FILTER_CONFIG.INITIAL_HISTORICAL_FETCH 
        : Math.min(5000, FILTER_CONFIG.MAX_HISTORICAL_FETCH - currentHistoryOffset)
      const batches = Math.ceil(totalToSearch / batchSize)
      
      const startOffset = initialLoad ? 0 : currentHistoryOffset
      
      for (let i = 0; i < batches; i++) {
        const offset = startOffset + (i * batchSize)
        
        // Stop if we've reached the maximum
        if (offset >= FILTER_CONFIG.MAX_HISTORICAL_FETCH) {
          console.log(`Reached maximum historical fetch limit: ${FILTER_CONFIG.MAX_HISTORICAL_FETCH}`)
          break
        }
        
        const response = await fetch(
          `/api/historical-trades?offset=${offset}&limit=${batchSize}`,
          { cache: "no-store" }
        )

        if (!response.ok) {
          throw new Error("Failed to fetch historical trades")
        }

        const data = await response.json()
        const newTrades = data.trades || []
        
        if (newTrades.length > 0) {
          // Add to accumulated trades
          setTrades(prevTrades => {
            const existingIds = new Set(prevTrades.map(t => t.id))
            const uniqueNewTrades = newTrades.filter((t: FilteredTrade) => !existingIds.has(t.id))

            if (uniqueNewTrades.length === 0) {
              return prevTrades
            }

            // Show notification for historical trades found
            if (initialLoad && uniqueNewTrades.length > 0) {
              showNotification(
                `📈 Found ${uniqueNewTrades.length} Insider Trade${uniqueNewTrades.length > 1 ? 's' : ''} in Historical Data!`,
                {
                  body: `Discovered ${uniqueNewTrades.length} insider trade${uniqueNewTrades.length > 1 ? 's' : ''} from past trading activity`,
                  icon: '/favicon.ico',
                  tag: 'historical-trades',
                  requireInteraction: false,
                  silent: false
                }
              )
            }

            // Combine with existing trades and sort by timestamp (newest first)
            const combined = [...prevTrades, ...uniqueNewTrades].sort((a, b) => b.timestamp - a.timestamp)

            // Keep only the latest 100 trades and save to localStorage
            const latestTrades = combined.slice(0, MAX_DISPLAY_TRADES)
            saveTradesToStorage(latestTrades)

            return latestTrades
          })
        }
        
        // Update offset for next fetch
        setCurrentHistoryOffset(offset + batchSize)
        
        // Stop if we've found no more trades
        if (!data.hasMore) {
          console.log("Reached end of historical trades data")
          break
        }
      }
      
      if (initialLoad) {
        setHasSearchedHistory(true)
      }
      setLastUpdated(Date.now())
    } catch (err) {
      console.error("Error searching historical trades:", err)
      if (initialLoad) {
        setError("Failed to search historical trades. Please try again.")
      }
    } finally {
      setIsSearchingHistory(false)
      setIsFetchingMoreHistory(false)
    }
  }, [currentHistoryOffset])

  // Initialize trades from localStorage and start fetching
  useEffect(() => {
    const initializeTrades = async () => {
      // Request notification permission on first load
      await requestNotificationPermission()

      // Load existing trades from localStorage
      const storedTrades = loadTradesFromStorage()

      if (storedTrades.length > 0) {
        setTrades(storedTrades)
        setLastUpdated(Date.now())
      }

      // Start fetching new trades
      await fetchTrades()
    }

    initializeTrades()
  }, [fetchTrades])
  
  // Auto-search history on mount after initial fetch completes
  useEffect(() => {
    if (!isLoading && !hasSearchedHistory && trades.length >= 0) {
      const timer = setTimeout(() => {
        searchHistoricalTrades(true)
      }, 1000) // Wait 1 second after initial load
      
      return () => clearTimeout(timer)
    }
  }, [isLoading, hasSearchedHistory, searchHistoricalTrades, trades.length])
  
  // Continue fetching more historical trades in the background
  useEffect(() => {
    if (
      FILTER_CONFIG.CONTINUOUS_HISTORY_FETCH && 
      hasSearchedHistory && 
      !isSearchingHistory && 
      !isFetchingMoreHistory &&
      currentHistoryOffset < FILTER_CONFIG.MAX_HISTORICAL_FETCH
    ) {
      // Fetch more history every 30 seconds
      const timer = setTimeout(() => {
        console.log(`Fetching more history from offset ${currentHistoryOffset}`)
        searchHistoricalTrades(false)
      }, 30000)
      
      return () => clearTimeout(timer)
    }
  }, [hasSearchedHistory, isSearchingHistory, isFetchingMoreHistory, currentHistoryOffset, searchHistoricalTrades])

  // Set up polling for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isRefreshing && !isLoading) {
        fetchTrades(false)
      }
    }, POLLING_INTERVAL)

    return () => clearInterval(interval)
  }, [fetchTrades, isRefreshing, isLoading])

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-black">
      <div className="container mx-auto px-3 sm:px-4 pt-6 pb-4 sm:pt-8 sm:pb-8 max-w-full">
        <div className="mb-6 sm:mb-8">
          <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg p-4 sm:p-6">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    Polymarket Insider Trades
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm sm:text-base">
                    Real-time monitoring of large trades from new wallets with concentrated market activity
                  </p>
                </div>
                <Button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  variant="outline"
                  size="sm"
                  aria-label="Refresh trades"
                  className="self-start sm:self-auto dark:border-gray-700 dark:hover:bg-gray-800"
                >
                  <RefreshCw
                    className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
                  />
                  Refresh
                </Button>
              </div>
              
              {error && (
                <div className="rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950 p-3 sm:p-4 text-red-600 dark:text-red-400 text-sm sm:text-base">
                  {error}
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="text-xs sm:text-sm font-medium">
                  {trades.length === 0 ? (
                    <div className="text-gray-500 dark:text-gray-400">
                      {isSearchingHistory ? (
                        <span>Searching through past trades...</span>
                      ) : (
                        <span>
                          Monitoring: New wallets (&lt;{FILTER_CONFIG.MAX_ACCOUNT_AGE_DAYS} days) • {" "}
                          {FILTER_CONFIG.MIN_MARKETS_TRADED}-{FILTER_CONFIG.MAX_MARKETS_TRADED} markets • 
                          Trades &gt; ${FILTER_CONFIG.MIN_TRADE_SIZE_USD.toLocaleString()}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <span className="text-gray-900 dark:text-white">
                        {trades.length} Insider Trade{trades.length !== 1 ? "s" : ""} Found
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Live updates every {FILTER_CONFIG.POLLING_INTERVAL_MS / 1000}s
                      </span>
                    </div>
                  )}
                </div>
                {isSearchingHistory && (
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <div className="h-4 w-4 rounded-full border-2 border-gray-900 dark:border-white border-t-transparent animate-spin" />
                    <span className="text-gray-700 dark:text-gray-300">Searching history...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <TradesTable trades={trades} />
        )}
      </div>
    </main>
  )
}


"use client"

import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  onRefresh: () => void
  isRefreshing: boolean
}

const Header = ({ 
  onRefresh, 
  isRefreshing, 
}: HeaderProps) => {
  return (
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
              onClick={onRefresh}
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
        </div>
      </div>
    </div>
  )
}

export default Header


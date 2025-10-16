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
    <div className="relative mb-8 md:mb-12">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-2xl blur-3xl" />
      <div className="relative bg-card/50 backdrop-blur-sm border rounded-2xl p-4 md:p-8 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Polymarket Insider Trades
            </h1>
            <p className="text-muted-foreground mt-2 text-sm md:text-base">
              Real-time monitoring of large trades from new wallets with concentrated market activity
            </p>
          </div>
          <Button
            onClick={onRefresh}
            disabled={isRefreshing}
            variant="outline"
            size="sm"
            aria-label="Refresh trades"
            className="self-start sm:self-auto"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Header


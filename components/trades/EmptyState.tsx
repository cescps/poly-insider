"use client"

import { Activity } from "lucide-react"

export const EmptyState = () => {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 rounded-2xl blur-2xl" />
      <div className="relative flex flex-col items-center justify-center py-12 md:py-20 text-center bg-card/30 backdrop-blur-sm border rounded-2xl px-4">
        <div className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 motion-safe:animate-pulse">
          <Activity className="h-6 w-6 md:h-8 md:w-8 text-primary" aria-hidden="true" />
        </div>
        <h2 className="text-base md:text-lg font-medium text-foreground mb-2">
          Monitoring Live Trades
        </h2>
        <p className="text-xs md:text-sm text-muted-foreground max-w-md">
          Scanning the market for large trades from new wallets with concentrated activity. Matching trades will appear here automatically.
        </p>
      </div>
    </div>
  )
}

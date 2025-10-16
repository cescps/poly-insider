"use client"

import { FilteredTrade } from "@/types"
import { formatRelativeTime, formatCurrency, formatPercentage, formatPrice, formatNumber, formatWalletAge } from "@/lib/filters"
import { getWalletTextColor, getWalletHexColor } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { InsiderScoreBadge } from "./InsiderScoreBadge"
import { TradeMetric } from "./TradeMetric"
import { TrendingUp, ChevronDown, ChevronUp, Activity, DollarSign, BarChart3, Wallet } from "lucide-react"
import { useState } from "react"

interface TradeCardMobileProps {
  trade: FilteredTrade
  allWallets: string[]
  index: number
}

const formatWalletAddress = (address: string) => {
  if (!address) return "Unknown"
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export const TradeCardMobile = ({ trade, allWallets, index }: TradeCardMobileProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div
      className="relative bg-card/50 backdrop-blur-sm border rounded-xl overflow-hidden shadow-lg hover:bg-card/60 transition-all motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        {/* Header - Always Visible */}
        <div className="p-4 space-y-3">
          {/* Wallet, Score, and Size */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <a
                href={`https://polymarket.com/profile/${trade.wallet}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1 hover:underline font-mono text-xs font-medium truncate focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded`}
                style={{ color: getWalletHexColor(trade.wallet, allWallets) }}
                aria-label={`View wallet ${trade.wallet} on Polymarket`}
              >
                {formatWalletAddress(trade.wallet)}
              </a>
              <InsiderScoreBadge trade={trade} size="sm" showTooltip={false} />
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <TrendingUp className="h-3 w-3 text-green-500" aria-hidden="true" />
              <span className="font-bold text-sm bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                {formatCurrency(trade.size)}
              </span>
            </div>
          </div>

          {/* Market */}
          <div>
            <a
              href={`https://polymarket.com/event/${trade.marketSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm text-primary hover:underline font-medium line-clamp-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
              aria-label={`View market ${trade.marketName} on Polymarket`}
            >
              {trade.marketName}
            </a>
          </div>

          {/* Side, Bet, and Time */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge
                variant={trade.side === "BUY" ? "default" : "secondary"}
                className={`font-semibold text-xs uppercase ${trade.side === "BUY" ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"}`}
              >
                {trade.side}
              </Badge>
              <Badge
                variant={trade.outcome.toUpperCase() === "YES" ? "success" : trade.outcome.toUpperCase() === "NO" ? "secondary" : "default"}
                className="font-semibold text-xs uppercase"
              >
                {trade.outcome}
              </Badge>
            </div>
            <div className="flex items-center text-muted-foreground text-xs">
              {formatRelativeTime(trade.timestamp)}
            </div>
          </div>

          {/* Key Metrics - Always Visible */}
          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t">
            <TradeMetric 
              label="Price" 
              value={<span className="font-mono">{formatPrice(trade.price)}</span>}
            />
            <TradeMetric 
              label="Entry" 
              value={<span className="font-mono">{trade.entryPrice ? formatPrice(trade.entryPrice) : '-'}</span>}
            />
            <TradeMetric 
              label="Mkt PnL" 
              value={
                <span className={`font-mono ${trade.marketPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(trade.marketPnL)}
                </span>
              }
            />
            <TradeMetric 
              label="Wallet Age" 
              value={<Badge variant="outline" className="text-xs px-1 py-0">{formatWalletAge(trade.walletAge)}</Badge>}
            />
          </div>
        </div>

        {/* Expandable Section */}
        <CollapsibleTrigger 
          className="w-full px-4 py-2 bg-muted/50 hover:bg-muted/70 transition-colors flex items-center justify-center gap-2 text-xs text-muted-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
          aria-label={isOpen ? "Hide additional metrics" : "Show additional metrics"}
        >
          {isOpen ? (
            <>
              <ChevronUp className="h-4 w-4" aria-hidden="true" />
              Hide Details
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
              Show Details
            </>
          )}
        </CollapsibleTrigger>

        <CollapsibleContent className="motion-safe:data-[state=open]:animate-in motion-safe:data-[state=closed]:animate-out motion-safe:data-[state=closed]:fade-out-0 motion-safe:data-[state=open]:fade-in-0 motion-safe:data-[state=closed]:slide-out-to-top-2 motion-safe:data-[state=open]:slide-in-from-top-2">
          <div className="p-4 space-y-4 border-t">
            {/* Market Activity */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                <Activity className="h-4 w-4 text-purple-500" aria-hidden="true" />
                Market Activity
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs pl-6">
                <TradeMetric 
                  label="Mkt Trades" 
                  value={<Badge variant="success" className="font-mono text-xs px-1 py-0">{formatNumber(trade.marketTrades)}</Badge>}
                  tooltip="Total number of trades executed by the user in this market"
                />
                <TradeMetric 
                  label="Mkt Vol" 
                  value={<span className="font-mono">{formatCurrency(trade.marketVolume)}</span>}
                  tooltip="Total USDC volume traded in this market"
                />
                <TradeMetric 
                  label="Vol Conc" 
                  value={<Badge variant="outline" className="font-mono text-xs px-1 py-0">{formatPercentage(trade.volumeConcentration, 1)}</Badge>}
                  tooltip="Trader's volume in this market as a percentage of their total trading volume"
                />
                <TradeMetric 
                  label="Avg Price" 
                  value={<span className="font-mono">{trade.avgPrice ? formatPrice(trade.avgPrice) : '-'}</span>}
                  tooltip="Trader's average purchase price in this market"
                />
              </div>
            </div>

            {/* User Activity */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                <BarChart3 className="h-4 w-4 text-orange-500" aria-hidden="true" />
                User Activity
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs pl-6">
                <TradeMetric 
                  label="Tot Trades" 
                  value={<Badge variant="secondary" className="font-mono text-xs px-1 py-0">{formatNumber(trade.totalTrades)}</Badge>}
                  tooltip="Total number of trades this user has placed on Polymarket"
                />
                <TradeMetric 
                  label="Trade Conc" 
                  value={<Badge variant="outline" className="font-mono text-xs px-1 py-0">{formatPercentage(trade.tradeConcentration, 1)}</Badge>}
                  tooltip="Percentage of this user's trades concentrated in this market"
                />
                <TradeMetric 
                  label="Open Pos" 
                  value={<Badge variant="default" className="font-mono text-xs px-1 py-0">{formatNumber(trade.openPositions)}</Badge>}
                  tooltip="Number of positions this user currently has open"
                />
                <TradeMetric 
                  label="O.P. Value" 
                  value={<span className="font-mono">{formatCurrency(trade.openPositionsValue)}</span>}
                  tooltip="Total USDC value of this user's open positions"
                />
              </div>
            </div>

            {/* Overall Performance */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                <DollarSign className="h-4 w-4 text-red-500" aria-hidden="true" />
                Overall Performance
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs pl-6">
                <TradeMetric 
                  label="Tot PnL" 
                  value={
                    <span className={`font-mono ${trade.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(trade.totalPnL)}
                    </span>
                  }
                  tooltip="User's overall profit or loss on Polymarket (in USDC)"
                />
                <TradeMetric 
                  label="Tot Vol" 
                  value={<span className="font-mono">{formatCurrency(trade.totalVolume)}</span>}
                  tooltip="User's total traded volume on Polymarket (in USDC)"
                />
              </div>
            </div>

            {/* Wallet Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                <Wallet className="h-4 w-4 text-gray-500" aria-hidden="true" />
                Wallet Info
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs pl-6">
                <TradeMetric 
                  label="WC/TX Delta" 
                  value={<Badge variant="secondary" className="text-xs px-1 py-0">{formatWalletAge(trade.walletCreationToTradeDelta)}</Badge>}
                  tooltip="Days between wallet creation and this trade"
                />
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

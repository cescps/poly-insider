"use client"

import { FilteredTrade } from "@/types"
import { formatRelativeTime, formatCurrency, formatPercentage, formatPrice, formatNumber, formatWalletAge } from "@/lib/filters"
import { getWalletHexColor } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { InsiderScoreBadge } from "./InsiderScoreBadge"
import { TrendingUp, ExternalLink, Info } from "lucide-react"

interface TradeTableDesktopProps {
  trades: FilteredTrade[]
  allWallets: string[]
}

const formatWalletAddress = (address: string) => {
  if (!address) return "Unknown"
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export const TradeTableDesktop = ({ trades, allWallets }: TradeTableDesktopProps) => {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-transparent to-green-500/5 rounded-2xl blur-2xl" />
      <div className="relative bg-card/50 backdrop-blur-sm border border-black/20 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <Table className="relative">
            <TableHeader className="sticky top-0 z-10 bg-muted/90 backdrop-blur-sm">
              <TableRow className="hover:bg-transparent border-b-2 border-black/20 bg-muted/30">
                {/* Trader Information - Sticky columns */}
                <TableHead className="font-bold text-foreground border-r border-black/10 px-3 py-3 bg-blue-50/50 sticky left-0 z-20">
                  <div className="flex items-center gap-1">
                    Wallet
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 text-muted-foreground cursor-help" aria-label="More information" />
                      </TooltipTrigger>
                      <TooltipContent>Trader&apos;s wallet address</TooltipContent>
                    </Tooltip>
                  </div>
                </TableHead>
                <TableHead className="font-bold text-foreground border-r border-black/10 px-3 py-3 text-center bg-blue-50/50">Score</TableHead>
                <TableHead className="font-bold text-foreground border-r border-black/10 px-3 py-3 bg-blue-50/50">Size</TableHead>
                <TableHead className="font-bold text-foreground border-r border-black/10 px-3 py-3 bg-blue-50/50">Side</TableHead>
                <TableHead className="font-bold text-foreground border-r border-black/10 px-3 py-3 bg-blue-50/50">Bet</TableHead>
                <TableHead className="font-bold text-foreground border-r border-black/10 px-3 py-3 bg-blue-50/50 min-w-[200px]">Market</TableHead>
                <TableHead className="font-bold text-foreground border-r border-black/10 px-3 py-3 bg-blue-50/50">Time</TableHead>

                {/* Price Data */}
                <TableHead className="font-bold text-foreground border-r border-black/10 px-3 py-3 bg-green-50/50">
                  <div className="flex items-center gap-1">
                    Price
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 text-muted-foreground cursor-help" aria-label="More information" />
                      </TooltipTrigger>
                      <TooltipContent>Price per share at execution</TooltipContent>
                    </Tooltip>
                  </div>
                </TableHead>
                <TableHead className="font-bold text-foreground border-r border-black/10 px-3 py-3 bg-green-50/50">
                  <div className="flex items-center gap-1">
                    Entry
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 text-muted-foreground cursor-help" aria-label="More information" />
                      </TooltipTrigger>
                      <TooltipContent>Trader&apos;s initial share price in this market</TooltipContent>
                    </Tooltip>
                  </div>
                </TableHead>

                {/* Market Activity */}
                <TableHead className="font-bold text-foreground border-r border-black/10 px-3 py-3 text-center bg-purple-50/50">
                  <div className="flex items-center justify-center gap-1">
                    Mkt Trades
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 text-muted-foreground cursor-help" aria-label="More information" />
                      </TooltipTrigger>
                      <TooltipContent>Total trades by user in this market</TooltipContent>
                    </Tooltip>
                  </div>
                </TableHead>
                <TableHead className="font-bold text-foreground border-r border-black/10 px-3 py-3 text-center bg-purple-50/50">
                  <div className="flex items-center justify-center gap-1">
                    Vol Conc.
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 text-muted-foreground cursor-help" aria-label="More information" />
                      </TooltipTrigger>
                      <TooltipContent>Volume concentration in this market</TooltipContent>
                    </Tooltip>
                  </div>
                </TableHead>
                <TableHead className="font-bold text-foreground border-r border-black/10 px-3 py-3 text-center bg-purple-50/50">Mkt PnL</TableHead>

                {/* User Activity */}
                <TableHead className="font-bold text-foreground border-r border-black/10 px-3 py-3 text-center bg-orange-50/50">Tot Trades</TableHead>
                <TableHead className="font-bold text-foreground border-r border-black/10 px-3 py-3 text-center bg-orange-50/50">Open Pos</TableHead>

                {/* Overall Performance */}
                <TableHead className="font-bold text-foreground border-r border-black/10 px-3 py-3 text-center bg-red-50/50">Tot. PnL</TableHead>

                {/* Wallet Info */}
                <TableHead className="font-bold text-foreground px-3 py-3 text-center bg-gray-50/50">Wallet Age</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="relative z-0">
              {trades.map((trade, index) => (
                <TableRow
                  key={trade.id}
                  className={`group hover:bg-muted/40 transition-colors border-b border-black/10 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 ${
                    index % 2 === 0 ? 'bg-white/30' : 'bg-muted/10'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Wallet - Sticky */}
                  <TableCell className={`border-r border-black/10 px-3 py-3 sticky left-0 z-10 ${index % 2 === 0 ? 'bg-blue-50/40' : 'bg-blue-50/20'}`}>
                    <a
                      href={`https://polymarket.com/profile/${trade.wallet}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 hover:underline font-mono text-sm group/link focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                      style={{ color: getWalletHexColor(trade.wallet, allWallets) }}
                      aria-label={`View wallet ${trade.wallet} on Polymarket`}
                    >
                      <span className="font-medium">
                        {formatWalletAddress(trade.wallet)}
                      </span>
                      <ExternalLink className="h-3 w-3 opacity-0 group-hover/link:opacity-100 transition-opacity" aria-hidden="true" />
                    </a>
                  </TableCell>

                  {/* Score */}
                  <TableCell className={`border-r border-black/10 px-3 py-3 ${index % 2 === 0 ? 'bg-blue-50/40' : 'bg-blue-50/20'}`}>
                    <div className="flex justify-center">
                      <InsiderScoreBadge trade={trade} size="md" />
                    </div>
                  </TableCell>

                  {/* Size */}
                  <TableCell className={`border-r border-black/10 px-3 py-3 ${index % 2 === 0 ? 'bg-blue-50/40' : 'bg-blue-50/20'}`}>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500" aria-hidden="true" />
                      <span className="font-bold text-base bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                        {formatCurrency(trade.size)}
                      </span>
                    </div>
                  </TableCell>

                  {/* Side */}
                  <TableCell className={`border-r border-black/10 px-3 py-3 ${index % 2 === 0 ? 'bg-blue-50/40' : 'bg-blue-50/20'}`}>
                    <div className="flex justify-center">
                      <Badge
                        variant={trade.side === "BUY" ? "default" : "secondary"}
                        className={`font-semibold text-xs uppercase ${trade.side === "BUY" ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"}`}
                      >
                        {trade.side}
                      </Badge>
                    </div>
                  </TableCell>

                  {/* Bet */}
                  <TableCell className={`border-r border-black/10 px-3 py-3 ${index % 2 === 0 ? 'bg-blue-50/40' : 'bg-blue-50/20'}`}>
                    <div className="flex justify-center">
                      <Badge
                        variant={trade.outcome.toUpperCase() === "YES" ? "success" : trade.outcome.toUpperCase() === "NO" ? "secondary" : "default"}
                        className="font-semibold text-xs uppercase"
                      >
                        {trade.outcome}
                      </Badge>
                    </div>
                  </TableCell>

                  {/* Market */}
                  <TableCell className={`border-r border-black/10 px-3 py-3 ${index % 2 === 0 ? 'bg-blue-50/40' : 'bg-blue-50/20'}`}>
                    <a
                      href={`https://polymarket.com/event/${trade.marketSlug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-primary hover:underline max-w-xs group/link focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                      aria-label={`View market ${trade.marketName} on Polymarket`}
                    >
                      <span className="truncate font-medium">{trade.marketName}</span>
                      <ExternalLink className="h-3 w-3 flex-shrink-0 opacity-0 group-hover/link:opacity-100 transition-opacity" aria-hidden="true" />
                    </a>
                  </TableCell>

                  {/* Time */}
                  <TableCell className={`border-r border-black/10 px-3 py-3 ${index % 2 === 0 ? 'bg-blue-50/40' : 'bg-blue-50/20'}`}>
                    <span className="text-sm text-muted-foreground">{formatRelativeTime(trade.timestamp)}</span>
                  </TableCell>

                  {/* Price */}
                  <TableCell className={`border-r border-black/10 px-3 py-3 ${index % 2 === 0 ? 'bg-green-50/40' : 'bg-green-50/20'}`}>
                    <span className="font-mono text-sm">{formatPrice(trade.price)}</span>
                  </TableCell>

                  {/* Entry */}
                  <TableCell className={`border-r border-black/10 px-3 py-3 ${index % 2 === 0 ? 'bg-green-50/40' : 'bg-green-50/20'}`}>
                    <span className="font-mono text-sm">
                      {trade.entryPrice ? formatPrice(trade.entryPrice) : '-'}
                    </span>
                  </TableCell>

                  {/* Market Trades */}
                  <TableCell className={`border-r border-black/10 px-3 py-3 ${index % 2 === 0 ? 'bg-purple-50/40' : 'bg-purple-50/20'}`}>
                    <div className="flex justify-center">
                      <Badge variant="success" className="font-mono">
                        {formatNumber(trade.marketTrades)}
                      </Badge>
                    </div>
                  </TableCell>

                  {/* Volume Concentration */}
                  <TableCell className={`border-r border-black/10 px-3 py-3 ${index % 2 === 0 ? 'bg-purple-50/40' : 'bg-purple-50/20'}`}>
                    <div className="flex justify-center">
                      <Badge variant="outline" className="font-mono text-xs">
                        {formatPercentage(trade.volumeConcentration, 1)}
                      </Badge>
                    </div>
                  </TableCell>

                  {/* Market PnL */}
                  <TableCell className={`border-r border-black/10 px-3 py-3 ${index % 2 === 0 ? 'bg-purple-50/40' : 'bg-purple-50/20'}`}>
                    <div className="flex justify-center">
                      <span className={`font-mono text-sm font-semibold ${trade.marketPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(trade.marketPnL)}
                      </span>
                    </div>
                  </TableCell>

                  {/* Total Trades */}
                  <TableCell className={`border-r border-black/10 px-3 py-3 ${index % 2 === 0 ? 'bg-orange-50/40' : 'bg-orange-50/20'}`}>
                    <div className="flex justify-center">
                      <Badge variant="secondary" className="font-mono">
                        {formatNumber(trade.totalTrades)}
                      </Badge>
                    </div>
                  </TableCell>

                  {/* Open Positions */}
                  <TableCell className={`border-r border-black/10 px-3 py-3 ${index % 2 === 0 ? 'bg-orange-50/40' : 'bg-orange-50/20'}`}>
                    <div className="flex justify-center">
                      <Badge variant="default" className="font-mono">
                        {formatNumber(trade.openPositions)}
                      </Badge>
                    </div>
                  </TableCell>

                  {/* Total PnL */}
                  <TableCell className={`border-r border-black/10 px-3 py-3 ${index % 2 === 0 ? 'bg-red-50/40' : 'bg-red-50/20'}`}>
                    <div className="flex justify-center">
                      <span className={`font-mono text-sm font-semibold ${trade.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(trade.totalPnL)}
                      </span>
                    </div>
                  </TableCell>

                  {/* Wallet Age */}
                  <TableCell className={`px-3 py-3 ${index % 2 === 0 ? 'bg-gray-50/40' : 'bg-gray-50/20'}`}>
                    <div className="flex justify-center">
                      <Badge variant="outline" className="text-xs">
                        {formatWalletAge(trade.walletAge)}
                      </Badge>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

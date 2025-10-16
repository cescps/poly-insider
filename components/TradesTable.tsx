"use client"

import { FilteredTrade } from "@/types"
import {
  formatRelativeTime,
  formatCurrency,
  formatPercentage,
  formatPrice,
  formatNumber,
  formatWalletAge
} from "@/lib/filters"

// Calculate insider score based on multiple factors (0-100)
const calculateInsiderScore = (trade: FilteredTrade): number => {
  let score = 0
  
  // 1. Wallet Age Factor (0-25 points) - newer wallet = higher score
  if (trade.walletAge < 1) score += 25
  else if (trade.walletAge < 2) score += 20
  else if (trade.walletAge < 5) score += 10
  else if (trade.walletAge < 7) score += 5
  
  // 2. Trade Size Factor (0-20 points) - larger trade = higher score
  if (trade.size > 10000) score += 20
  else if (trade.size > 5000) score += 15
  else if (trade.size > 2000) score += 10
  else if (trade.size > 1000) score += 5
  
  // 3. Volume Concentration Factor (0-20 points) - more focused = higher score
  if (trade.volumeConcentration > 80) score += 20
  else if (trade.volumeConcentration > 60) score += 15
  else if (trade.volumeConcentration > 40) score += 10
  else if (trade.volumeConcentration > 20) score += 5
  
  // 4. Quick Action Factor (0-20 points) - faster action after wallet creation = higher score
  const hoursToTrade = trade.walletCreationToTradeDelta * 24
  if (hoursToTrade < 1) score += 20
  else if (hoursToTrade < 6) score += 15
  else if (hoursToTrade < 24) score += 10
  else if (hoursToTrade < 48) score += 5
  
  // 5. Market PnL Factor (0-15 points) - already profitable = higher score
  if (trade.marketPnL > 1000) score += 15
  else if (trade.marketPnL > 500) score += 10
  else if (trade.marketPnL > 0) score += 5
  
  return Math.min(score, 100)
}

// Get color styling for insider score
const getInsiderScoreColor = (score: number): string => {
  if (score >= 80) return 'bg-red-500/20 text-red-700 border-red-400'
  if (score >= 60) return 'bg-orange-500/20 text-orange-700 border-orange-400'
  if (score >= 40) return 'bg-yellow-500/20 text-yellow-700 border-yellow-400'
  return 'bg-green-500/20 text-green-700 border-green-400'
}

// Get text color for insider score (for mobile)
const getInsiderScoreTextColor = (score: number): string => {
  if (score >= 80) return 'text-red-700'
  if (score >= 60) return 'text-orange-700'
  if (score >= 40) return 'text-yellow-700'
  return 'text-green-700'
}
import { getWalletColor, getWalletTextColor, getWalletHexColor } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, TrendingUp, Clock, Activity } from "lucide-react"

interface TradesTableProps {
  trades: FilteredTrade[]
}

// Helper function to extract all wallet addresses from trades
const getAllWallets = (trades: FilteredTrade[]): string[] => {
  return trades.map(trade => trade.wallet).filter(wallet => wallet && wallet !== '')
}

const TradesTable = ({ trades }: TradesTableProps) => {
  if (trades.length === 0) {
    return (
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 rounded-2xl blur-2xl" />
        <div className="relative flex flex-col items-center justify-center py-12 md:py-20 text-center bg-card/30 backdrop-blur-sm border rounded-2xl px-4">
          <div className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Activity className="h-6 w-6 md:h-8 md:w-8 text-primary animate-pulse" />
          </div>
          <div className="text-base md:text-lg font-medium text-foreground mb-2">
            Monitoring Live Trades
          </div>
          <div className="text-xs md:text-sm text-muted-foreground max-w-md">
            Scanning the market for large trades from new wallets with concentrated activity. Matching trades will appear here automatically.
          </div>
        </div>
      </div>
    )
  }

  const formatWalletAddress = (address: string) => {
    if (!address) return "Unknown"
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <>
      {/* Mobile Card View */}
      <div className="block md:hidden space-y-4">
        {trades.map((trade, index) => (
          <div
            key={trade.id}
            className="relative bg-card/50 backdrop-blur-sm border rounded-xl p-4 shadow-lg hover:bg-card/60 transition-colors"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="space-y-3">
              {/* Header: Wallet + Insider Score + Size */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <a
                    href={`https://polymarket.com/profile/${trade.wallet}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 hover:underline font-mono text-xs ${getWalletTextColor(trade.wallet, getAllWallets(trades))}`}
                    aria-label={`View wallet ${trade.wallet} on Polymarket`}
                  >
                    <span className="font-medium" style={{ color: getWalletHexColor(trade.wallet, getAllWallets(trades)) }}>
                      {formatWalletAddress(trade.wallet)}
                    </span>
                  </a>
                  <Badge
                    variant="outline"
                    className={`font-bold text-xs px-2 py-0.5 border ${getInsiderScoreColor(calculateInsiderScore(trade))}`}
                    title="Insider confidence score (0-100) based on wallet age, trade size, concentration, timing, and profitability"
                  >
                    {calculateInsiderScore(trade)}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="font-bold text-base bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                    {formatCurrency(trade.size)}
                  </span>
                </div>
              </div>

              {/* Market and Bet */}
              <div className="space-y-2">
                <a
                  href={`https://polymarket.com/event/${trade.marketSlug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-primary hover:underline font-medium"
                  aria-label={`View market ${trade.marketName} on Polymarket`}
                >
                  {trade.marketName}
                </a>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={trade.side === "BUY" ? "default" : "secondary"}
                      className={`font-semibold text-xs uppercase ${trade.side === "BUY" ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"}`}
                      title={`${trade.side === "BUY" ? "Buying" : "Selling"} position`}
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
                  <div className="flex items-center justify-center text-muted-foreground text-xs">
                    {formatRelativeTime(trade.timestamp)}
                  </div>
                </div>
              </div>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">Price:</span>
                  <span className="font-mono">{formatPrice(trade.price)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">Entry:</span>
                  <span className="font-mono">{trade.entryPrice ? formatPrice(trade.entryPrice) : '-'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">Mkt Trades:</span>
                  <Badge variant="success" className="font-mono text-xs px-1 py-0">
                    {formatNumber(trade.marketTrades)}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">Mkt Vol:</span>
                  <span className="font-mono">{formatCurrency(trade.marketVolume)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">Vol Conc:</span>
                  <Badge variant="outline" className="font-mono text-xs px-1 py-0">
                    {formatPercentage(trade.volumeConcentration, 1)}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">Mkt PnL:</span>
                  <span className={`font-mono ${trade.marketPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(trade.marketPnL)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">Tot Trades:</span>
                  <Badge variant="secondary" className="font-mono text-xs px-1 py-0">
                    {formatNumber(trade.totalTrades)}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">Wallet Age:</span>
                  <Badge variant="outline" className="text-xs px-1 py-0">
                    {formatWalletAge(trade.walletAge)}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block relative">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-transparent to-green-500/5 rounded-2xl blur-2xl" />
        <div className="relative bg-card/50 backdrop-blur-sm border border-black/20 rounded-2xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <Table className="relative">
              <TableHeader className="sticky top-0 z-10 bg-muted/90 backdrop-blur-sm">
                <TableRow className="hover:bg-transparent border-b-2 border-black/20 bg-muted/30">
                  {/* Trader Information */}
                  <TableHead className="font-bold text-foreground border-r border-black/10 px-3 py-3 bg-blue-50/50">Name</TableHead>
                  <TableHead className="font-bold text-foreground border-r border-black/10 px-3 py-3 text-center bg-blue-50/50">Score</TableHead>
                  <TableHead className="font-bold text-foreground border-r border-black/10 px-3 py-3 bg-blue-50/50">Size</TableHead>
                  <TableHead className="font-bold text-foreground border-r border-black/10 px-3 py-3 bg-blue-50/50">Side</TableHead>
                  <TableHead className="font-bold text-foreground border-r border-black/10 px-3 py-3 bg-blue-50/50">Bet</TableHead>
                  <TableHead className="font-bold text-foreground border-r border-black/10 px-3 py-3 bg-blue-50/50">Market</TableHead>
                  <TableHead className="font-bold text-foreground border-r border-black/10 px-3 py-3 bg-blue-50/50">Time</TableHead>

                  {/* Price Data */}
                  <TableHead className="font-bold text-foreground border-r border-black/10 px-3 py-3 bg-green-50/50">Price</TableHead>
                  <TableHead className="font-bold text-foreground border-r border-black/10 px-3 py-3 bg-green-50/50">Entry</TableHead>
                  <TableHead className="font-bold text-foreground border-r border-black/10 px-3 py-3 bg-green-50/50">Avg</TableHead>

                  {/* Market Activity */}
                  <TableHead className="font-bold text-foreground border-r border-black/10 px-3 py-3 text-center bg-purple-50/50">Market Trades</TableHead>
                  <TableHead className="font-bold text-foreground border-r border-black/10 px-3 py-3 text-center bg-purple-50/50">Market Volume</TableHead>
                  <TableHead className="font-bold text-foreground border-r border-black/10 px-3 py-3 text-center bg-purple-50/50">Volume Conc.</TableHead>
                  <TableHead className="font-bold text-foreground border-r border-black/10 px-3 py-3 text-center bg-purple-50/50">Market PnL</TableHead>

                  {/* User Activity */}
                  <TableHead className="font-bold text-foreground border-r border-black/10 px-3 py-3 text-center bg-orange-50/50">Total Trades</TableHead>
                  <TableHead className="font-bold text-foreground border-r border-black/10 px-3 py-3 text-center bg-orange-50/50">Trade Conc.</TableHead>

                  {/* Positions */}
                  <TableHead className="font-bold text-foreground border-r border-black/10 px-3 py-3 text-center bg-yellow-50/50">Open Positions</TableHead>
                  <TableHead className="font-bold text-foreground border-r border-black/10 px-3 py-3 text-center bg-yellow-50/50">O.P. Value</TableHead>

                  {/* Overall Performance */}
                  <TableHead className="font-bold text-foreground border-r border-black/10 px-3 py-3 text-center bg-red-50/50">Tot. PnL</TableHead>
                  <TableHead className="font-bold text-foreground border-r border-black/10 px-3 py-3 text-center bg-red-50/50">Tot. Vol</TableHead>

                  {/* Wallet Info */}
                  <TableHead className="font-bold text-foreground border-r border-black/10 px-3 py-3 text-center bg-gray-50/50">Wallet Age</TableHead>
                  <TableHead className="font-bold text-foreground px-3 py-3 text-center bg-gray-50/50">WC/TX Delta</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="relative z-0">
                {trades.map((trade, index) => (
                  <TableRow
                    key={trade.id}
                    className="group hover:bg-muted/30 transition-colors border-b border-black/10"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <TableCell className="border-r border-black/10 px-3 py-3 bg-blue-50/30">
                      <a
                        href={`https://polymarket.com/profile/${trade.wallet}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-2 hover:underline font-mono text-sm group ${getWalletTextColor(trade.wallet, getAllWallets(trades))}`}
                        aria-label={`View wallet ${trade.wallet} on Polymarket`}
                      >
                        <span className="font-medium" style={{ color: getWalletHexColor(trade.wallet, getAllWallets(trades)) }}>
                    {formatWalletAddress(trade.wallet)}
                  </span>
                        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </TableCell>
                    <TableCell className="border-r border-black/10 px-3 py-3 bg-blue-50/30">
                      <div className="flex justify-center">
                        <Badge
                          variant="outline"
                          className={`font-bold text-base px-3 py-1 border-2 ${getInsiderScoreColor(calculateInsiderScore(trade))}`}
                          title="Insider confidence score (0-100) based on wallet age, trade size, concentration, timing, and profitability"
                        >
                          {calculateInsiderScore(trade)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="border-r border-black/10 px-3 py-3 bg-blue-50/30">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="font-bold text-lg bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                          {formatCurrency(trade.size)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="border-r border-black/10 px-3 py-3 bg-blue-50/30">
                      <div className="flex justify-center">
                        <Badge
                          variant={trade.side === "BUY" ? "default" : "secondary"}
                          className={`font-semibold text-xs uppercase ${trade.side === "BUY" ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"}`}
                          title={`${trade.side === "BUY" ? "Buying" : "Selling"} position`}
                        >
                          {trade.side}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="border-r border-black/10 px-3 py-3 bg-blue-50/30">
                      <div className="flex justify-center">
                        <Badge
                          variant={trade.outcome.toUpperCase() === "YES" ? "success" : trade.outcome.toUpperCase() === "NO" ? "secondary" : "default"}
                          className="font-semibold text-xs uppercase"
                        >
                          {trade.outcome}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="border-r border-black/10 px-3 py-3 bg-blue-50/30">
                      <a
                        href={`https://polymarket.com/event/${trade.marketSlug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-primary hover:underline max-w-md group"
                        aria-label={`View market ${trade.marketName} on Polymarket`}
                      >
                        <span className="truncate font-medium">{trade.marketName}</span>
                        <ExternalLink className="h-3 w-3 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </TableCell>
                    <TableCell className="border-r border-black/10 px-3 py-3 bg-blue-50/30">
                      <div className="flex items-center justify-center h-full">
                        <span className="text-sm text-muted-foreground">{formatRelativeTime(trade.timestamp)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="border-r border-black/10 px-3 py-3 bg-green-50/30">
                      <span className="font-mono text-sm" title="Price per share at execution">{formatPrice(trade.price)}</span>
                    </TableCell>
                    <TableCell className="border-r border-black/10 px-3 py-3 bg-green-50/30">
                      <span className="font-mono text-sm" title="Trader's initial share price in this market">
                        {trade.entryPrice ? formatPrice(trade.entryPrice) : '-'}
                      </span>
                    </TableCell>
                    <TableCell className="border-r border-black/10 px-3 py-3 bg-green-50/30">
                      <span className="font-mono text-sm" title="Trader's average purchase price in this market">
                        {trade.avgPrice ? formatPrice(trade.avgPrice) : '-'}
                      </span>
                    </TableCell>
                    <TableCell className="border-r border-black/10 px-3 py-3 bg-purple-50/30">
                      <div className="flex justify-center">
                        <Badge variant="success" className="font-mono" title="Total number of trades executed by the user in this market">
                          {formatNumber(trade.marketTrades)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="border-r border-black/10 px-3 py-3 bg-purple-50/30">
                      <div className="flex justify-center">
                        <span className="font-mono text-sm" title="Total USDC volume traded in this market">{formatCurrency(trade.marketVolume)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="border-r border-black/10 px-3 py-3 bg-purple-50/30">
                      <div className="flex justify-center">
                        <Badge variant="outline" className="font-mono text-xs" title="Trader's volume in this market as a percentage of their total trading volume">
                          {formatPercentage(trade.volumeConcentration, 1)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="border-r border-black/10 px-3 py-3 bg-purple-50/30">
                      <div className="flex justify-center">
                        <span className={`font-mono text-sm ${trade.marketPnL >= 0 ? 'text-green-600' : 'text-red-600'}`} title="Trader's profit or loss in this market (in USDC)">
                          {formatCurrency(trade.marketPnL)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="border-r border-black/10 px-3 py-3 bg-orange-50/30">
                      <div className="flex justify-center">
                        <Badge variant="secondary" className="font-mono" title="Total number of trades this user has placed on Polymarket">
                          {formatNumber(trade.totalTrades)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="border-r border-black/10 px-3 py-3 bg-orange-50/30">
                      <div className="flex justify-center">
                        <Badge variant="outline" className="font-mono text-xs" title="Percentage of this user's trades concentrated in this market">
                          {formatPercentage(trade.tradeConcentration, 1)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="border-r border-black/10 px-3 py-3 bg-yellow-50/30">
                      <div className="flex justify-center">
                        <Badge variant="default" className="font-mono" title="Number of positions this user currently has open">
                          {formatNumber(trade.openPositions)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="border-r border-black/10 px-3 py-3 bg-yellow-50/30">
                      <div className="flex justify-center">
                        <span className="font-mono text-sm" title="Total USDC value of this user's open positions">{formatCurrency(trade.openPositionsValue)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="border-r border-black/10 px-3 py-3 bg-red-50/30">
                      <div className="flex justify-center">
                        <span className={`font-mono text-sm ${trade.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`} title="User's overall profit or loss on Polymarket (in USDC)">
                          {formatCurrency(trade.totalPnL)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="border-r border-black/10 px-3 py-3 bg-red-50/30">
                      <div className="flex justify-center">
                        <span className="font-mono text-sm" title="User's total traded volume on Polymarket (in USDC)">{formatCurrency(trade.totalVolume)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="border-r border-black/10 px-3 py-3 bg-gray-50/30">
                      <div className="flex justify-center">
                        <Badge variant="outline" className="text-xs" title="Time since this wallet was created">
                          {formatWalletAge(trade.walletAge)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="px-3 py-3 bg-gray-50/30">
                      <div className="flex justify-center">
                        <Badge variant="secondary" className="text-xs" title="Days between wallet creation and this trade">
                          {formatWalletAge(trade.walletCreationToTradeDelta)}
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
    </>
  )
}

export default TradesTable


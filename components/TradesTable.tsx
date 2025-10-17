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
import { getWalletHexColor } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface TradesTableProps {
  trades: FilteredTrade[]
}

// Calculate insider score based on multiple factors (0-100)
const calculateInsiderScore = (trade: FilteredTrade): number => {
  let score = 0
  
  if (trade.walletAge < 1) score += 25
  else if (trade.walletAge < 2) score += 20
  else if (trade.walletAge < 5) score += 10
  else if (trade.walletAge < 7) score += 5
  
  if (trade.size > 10000) score += 20
  else if (trade.size > 5000) score += 15
  else if (trade.size > 2000) score += 10
  else if (trade.size > 1000) score += 5
  
  if (trade.volumeConcentration > 80) score += 20
  else if (trade.volumeConcentration > 60) score += 15
  else if (trade.volumeConcentration > 40) score += 10
  else if (trade.volumeConcentration > 20) score += 5
  
  const hoursToTrade = trade.walletCreationToTradeDelta * 24
  if (hoursToTrade < 1) score += 20
  else if (hoursToTrade < 6) score += 15
  else if (hoursToTrade < 24) score += 10
  else if (hoursToTrade < 48) score += 5
  
  if (trade.marketPnL > 1000) score += 15
  else if (trade.marketPnL > 500) score += 10
  else if (trade.marketPnL > 0) score += 5
  
  return Math.min(score, 100)
}

const getScoreColor = (score: number): string => {
  if (score >= 80) return 'text-red-600 font-bold'
  if (score >= 60) return 'text-orange-600 font-semibold'
  if (score >= 40) return 'text-yellow-600'
  return 'text-green-600'
}

const getAllWallets = (trades: FilteredTrade[]): string[] => {
  return trades.map(trade => trade.wallet).filter(wallet => wallet && wallet !== '')
}

const formatWalletAddress = (address: string) => {
  if (!address) return "Unknown"
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

const TradesTable = ({ trades }: TradesTableProps) => {
  if (trades.length === 0) {
    return (
      <div className="bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-800 p-8 sm:p-12 text-center">
        <div className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">
          Monitoring Live Trades
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Scanning the market for large trades from new wallets with concentrated activity.
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-800 border-b-2 border-gray-200 dark:border-gray-700">
              <TableHead className="font-semibold text-gray-900 dark:text-white">Wallet</TableHead>
              <TableHead className="font-semibold text-gray-900 dark:text-white text-center">Score</TableHead>
              <TableHead className="font-semibold text-gray-900 dark:text-white">Size</TableHead>
              <TableHead className="font-semibold text-gray-900 dark:text-white">Side</TableHead>
              <TableHead className="font-semibold text-gray-900 dark:text-white">Bet</TableHead>
              <TableHead className="font-semibold text-gray-900 dark:text-white">Market</TableHead>
              <TableHead className="font-semibold text-gray-900 dark:text-white">Time</TableHead>
              <TableHead className="font-semibold text-gray-900 dark:text-white">Price</TableHead>
              <TableHead className="font-semibold text-gray-900 dark:text-white">Entry</TableHead>
              <TableHead className="font-semibold text-gray-900 dark:text-white">Avg</TableHead>
              <TableHead className="font-semibold text-gray-900 dark:text-white text-center">Market Trades</TableHead>
              <TableHead className="font-semibold text-gray-900 dark:text-white text-center">Market Volume</TableHead>
              <TableHead className="font-semibold text-gray-900 dark:text-white text-center">Volume Conc.</TableHead>
              <TableHead className="font-semibold text-gray-900 dark:text-white text-center">Market PnL</TableHead>
              <TableHead className="font-semibold text-gray-900 dark:text-white text-center">Total Trades</TableHead>
              <TableHead className="font-semibold text-gray-900 dark:text-white text-center">Trade Conc.</TableHead>
              <TableHead className="font-semibold text-gray-900 dark:text-white text-center">Open Positions</TableHead>
              <TableHead className="font-semibold text-gray-900 dark:text-white text-center">O.P. Value</TableHead>
              <TableHead className="font-semibold text-gray-900 dark:text-white text-center">Tot. PnL</TableHead>
              <TableHead className="font-semibold text-gray-900 dark:text-white text-center">Tot. Vol</TableHead>
              <TableHead className="font-semibold text-gray-900 dark:text-white text-center">Wallet Age</TableHead>
              <TableHead className="font-semibold text-gray-900 dark:text-white text-center">WC/TX Delta</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trades.map((trade) => (
              <TableRow
                key={trade.id}
                className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <TableCell className="py-3">
                  <a
                    href={`https://polymarket.com/profile/${trade.wallet}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-sm hover:underline"
                    style={{ color: getWalletHexColor(trade.wallet, getAllWallets(trades)) }}
                  >
                    {formatWalletAddress(trade.wallet)}
                  </a>
                </TableCell>
                <TableCell className="text-center py-3">
                  <span className={getScoreColor(calculateInsiderScore(trade))}>
                    {calculateInsiderScore(trade)}
                  </span>
                </TableCell>
                <TableCell className="py-3">
                  <span className="font-semibold">{formatCurrency(trade.size)}</span>
                </TableCell>
                <TableCell className="py-3">
                  <span className={`font-semibold ${trade.side === "BUY" ? "text-green-600" : "text-red-600"}`}>
                    {trade.side}
                  </span>
                </TableCell>
                <TableCell className="py-3">
                  <span className="text-sm">{trade.outcome}</span>
                </TableCell>
                <TableCell className="py-3">
                  <a
                    href={`https://polymarket.com/event/${trade.marketSlug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-900 dark:text-white hover:underline max-w-md truncate block"
                  >
                    {trade.marketName}
                  </a>
                </TableCell>
                <TableCell className="text-sm text-gray-500 py-3">
                  {formatRelativeTime(trade.timestamp)}
                </TableCell>
                <TableCell className="font-mono text-sm py-3">{formatPrice(trade.price)}</TableCell>
                <TableCell className="font-mono text-sm py-3">
                  {trade.entryPrice ? formatPrice(trade.entryPrice) : '-'}
                </TableCell>
                <TableCell className="font-mono text-sm py-3">
                  {trade.avgPrice ? formatPrice(trade.avgPrice) : '-'}
                </TableCell>
                <TableCell className="text-center text-sm py-3">{formatNumber(trade.marketTrades)}</TableCell>
                <TableCell className="text-center font-mono text-sm py-3">{formatCurrency(trade.marketVolume)}</TableCell>
                <TableCell className="text-center font-mono text-sm py-3">{formatPercentage(trade.volumeConcentration, 1)}</TableCell>
                <TableCell className="text-center py-3">
                  <span className={`font-mono text-sm ${trade.marketPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(trade.marketPnL)}
                  </span>
                </TableCell>
                <TableCell className="text-center text-sm py-3">{formatNumber(trade.totalTrades)}</TableCell>
                <TableCell className="text-center font-mono text-sm py-3">{formatPercentage(trade.tradeConcentration, 1)}</TableCell>
                <TableCell className="text-center text-sm py-3">{formatNumber(trade.openPositions)}</TableCell>
                <TableCell className="text-center font-mono text-sm py-3">{formatCurrency(trade.openPositionsValue)}</TableCell>
                <TableCell className="text-center py-3">
                  <span className={`font-mono text-sm ${trade.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(trade.totalPnL)}
                  </span>
                </TableCell>
                <TableCell className="text-center font-mono text-sm py-3">{formatCurrency(trade.totalVolume)}</TableCell>
                <TableCell className="text-center text-sm py-3">{formatWalletAge(trade.walletAge)}</TableCell>
                <TableCell className="text-center text-sm py-3">{formatWalletAge(trade.walletCreationToTradeDelta)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default TradesTable

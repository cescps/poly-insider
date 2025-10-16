"use client"

import { FilteredTrade } from "@/types"
import { TooltipProvider } from "@/components/ui/tooltip"
import { TradeTableDesktop } from "./trades/TradeTableDesktop"
import { TradeCardMobile } from "./trades/TradeCardMobile"
import { EmptyState } from "./trades/EmptyState"

interface TradesTableProps {
  trades: FilteredTrade[]
}

// Helper function to extract all wallet addresses from trades
const getAllWallets = (trades: FilteredTrade[]): string[] => {
  return trades.map(trade => trade.wallet).filter(wallet => wallet && wallet !== '')
}

const TradesTable = ({ trades }: TradesTableProps) => {
  if (trades.length === 0) {
    return <EmptyState />
  }

  const allWallets = getAllWallets(trades)

  return (
    <TooltipProvider delayDuration={300}>
      {/* Mobile Card View */}
      <div className="block md:hidden space-y-4" role="list" aria-label="Trade list">
        {trades.map((trade, index) => (
          <TradeCardMobile 
            key={trade.id} 
            trade={trade} 
            allWallets={allWallets} 
            index={index}
          />
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block" role="region" aria-label="Trade table">
        <TradeTableDesktop trades={trades} allWallets={allWallets} />
      </div>
    </TooltipProvider>
  )
}

export default TradesTable

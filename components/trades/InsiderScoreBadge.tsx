"use client"

import { FilteredTrade } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { calculateInsiderScore, getInsiderScoreColor, getInsiderScoreDescription } from "@/lib/insider-score"
import { Info } from "lucide-react"

interface InsiderScoreBadgeProps {
  trade: FilteredTrade
  size?: "sm" | "md" | "lg"
  showTooltip?: boolean
}

export const InsiderScoreBadge = ({ trade, size = "md", showTooltip = true }: InsiderScoreBadgeProps) => {
  const score = calculateInsiderScore(trade)
  const colorClass = getInsiderScoreColor(score)
  
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5 border",
    md: "text-sm px-3 py-1 border-2",
    lg: "text-base px-3 py-1 border-2"
  }

  const badge = (
    <Badge
      variant="outline"
      className={`font-bold ${sizeClasses[size]} ${colorClass}`}
      aria-label={`Insider score: ${score}`}
    >
      {score}
    </Badge>
  )

  if (!showTooltip) {
    return badge
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="inline-flex items-center gap-1 cursor-help">
          {badge}
          <Info className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p className="max-w-xs">{getInsiderScoreDescription()}</p>
      </TooltipContent>
    </Tooltip>
  )
}

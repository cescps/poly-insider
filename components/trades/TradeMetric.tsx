"use client"

import { ReactNode } from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface TradeMetricProps {
  label: string
  value: ReactNode
  tooltip?: string
  className?: string
}

export const TradeMetric = ({ label, value, tooltip, className = "" }: TradeMetricProps) => {
  const content = (
    <div className={`flex items-center gap-1 ${className}`}>
      <span className="text-muted-foreground">{label}:</span>
      <span>{value}</span>
    </div>
  )

  if (tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-help">
            {content}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs">{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    )
  }

  return content
}

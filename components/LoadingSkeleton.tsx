"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const LoadingSkeleton = () => {
  return (
    <>
      {/* Mobile Card View */}
      <div className="block md:hidden space-y-4" role="status" aria-label="Loading trades">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="relative bg-card/50 backdrop-blur-sm border rounded-xl overflow-hidden shadow-lg"
          >
            <div className="p-4 space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-5 w-10 rounded-full" />
                </div>
                <div className="flex items-center gap-1">
                  <Skeleton className="h-3 w-3" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>

              {/* Market name */}
              <Skeleton className="h-4 w-full" />

              {/* Side, Bet, Time */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-12 rounded-full" />
                  <Skeleton className="h-6 w-12 rounded-full" />
                </div>
                <Skeleton className="h-3 w-16" />
              </div>

              {/* Metrics grid */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>

            {/* Expandable trigger */}
            <div className="w-full px-4 py-2 bg-muted/50 flex items-center justify-center">
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ))}
        <span className="sr-only">Loading trades...</span>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block relative" role="status" aria-label="Loading trades">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-transparent to-green-500/5 rounded-2xl blur-2xl" />
        <div className="relative bg-card/50 backdrop-blur-sm border rounded-2xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-muted/90 backdrop-blur-sm">
                <TableRow className="hover:bg-transparent border-b-2 border-black/20 bg-muted/30">
                  <TableHead className="font-bold border-r border-black/10 px-3 py-3 bg-blue-50/50 sticky left-0 z-20">Wallet</TableHead>
                  <TableHead className="font-bold border-r border-black/10 px-3 py-3 bg-blue-50/50 text-center">Score</TableHead>
                  <TableHead className="font-bold border-r border-black/10 px-3 py-3 bg-blue-50/50">Size</TableHead>
                  <TableHead className="font-bold border-r border-black/10 px-3 py-3 bg-blue-50/50">Side</TableHead>
                  <TableHead className="font-bold border-r border-black/10 px-3 py-3 bg-blue-50/50">Bet</TableHead>
                  <TableHead className="font-bold border-r border-black/10 px-3 py-3 bg-blue-50/50 min-w-[200px]">Market</TableHead>
                  <TableHead className="font-bold border-r border-black/10 px-3 py-3 bg-blue-50/50">Time</TableHead>
                  <TableHead className="font-bold border-r border-black/10 px-3 py-3 bg-green-50/50">Price</TableHead>
                  <TableHead className="font-bold border-r border-black/10 px-3 py-3 bg-green-50/50">Entry</TableHead>
                  <TableHead className="font-bold border-r border-black/10 px-3 py-3 bg-purple-50/50 text-center">Mkt Trades</TableHead>
                  <TableHead className="font-bold border-r border-black/10 px-3 py-3 bg-purple-50/50 text-center">Vol Conc.</TableHead>
                  <TableHead className="font-bold border-r border-black/10 px-3 py-3 bg-purple-50/50 text-center">Mkt PnL</TableHead>
                  <TableHead className="font-bold border-r border-black/10 px-3 py-3 bg-orange-50/50 text-center">Tot Trades</TableHead>
                  <TableHead className="font-bold border-r border-black/10 px-3 py-3 bg-orange-50/50 text-center">Open Pos</TableHead>
                  <TableHead className="font-bold border-r border-black/10 px-3 py-3 bg-red-50/50 text-center">Tot. PnL</TableHead>
                  <TableHead className="font-bold px-3 py-3 bg-gray-50/50 text-center">Wallet Age</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(5)].map((_, i) => (
                  <TableRow key={i} className={`border-b border-black/10 ${i % 2 === 0 ? 'bg-white/30' : 'bg-muted/10'}`}>
                    {/* Wallet - Sticky */}
                    <TableCell className={`border-r border-black/10 px-3 py-3 sticky left-0 z-10 ${i % 2 === 0 ? 'bg-blue-50/40' : 'bg-blue-50/20'}`}>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    {/* Score */}
                    <TableCell className={`border-r border-black/10 px-3 py-3 ${i % 2 === 0 ? 'bg-blue-50/40' : 'bg-blue-50/20'}`}>
                      <div className="flex justify-center">
                        <Skeleton className="h-7 w-12 rounded-full" />
                      </div>
                    </TableCell>
                    {/* Size */}
                    <TableCell className={`border-r border-black/10 px-3 py-3 ${i % 2 === 0 ? 'bg-blue-50/40' : 'bg-blue-50/20'}`}>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </TableCell>
                    {/* Side */}
                    <TableCell className={`border-r border-black/10 px-3 py-3 ${i % 2 === 0 ? 'bg-blue-50/40' : 'bg-blue-50/20'}`}>
                      <div className="flex justify-center">
                        <Skeleton className="h-6 w-12 rounded-full" />
                      </div>
                    </TableCell>
                    {/* Bet */}
                    <TableCell className={`border-r border-black/10 px-3 py-3 ${i % 2 === 0 ? 'bg-blue-50/40' : 'bg-blue-50/20'}`}>
                      <div className="flex justify-center">
                        <Skeleton className="h-6 w-12 rounded-full" />
                      </div>
                    </TableCell>
                    {/* Market */}
                    <TableCell className={`border-r border-black/10 px-3 py-3 ${i % 2 === 0 ? 'bg-blue-50/40' : 'bg-blue-50/20'}`}>
                      <Skeleton className="h-4 w-48" />
                    </TableCell>
                    {/* Time */}
                    <TableCell className={`border-r border-black/10 px-3 py-3 ${i % 2 === 0 ? 'bg-blue-50/40' : 'bg-blue-50/20'}`}>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    {/* Price */}
                    <TableCell className={`border-r border-black/10 px-3 py-3 ${i % 2 === 0 ? 'bg-green-50/40' : 'bg-green-50/20'}`}>
                      <Skeleton className="h-4 w-12" />
                    </TableCell>
                    {/* Entry */}
                    <TableCell className={`border-r border-black/10 px-3 py-3 ${i % 2 === 0 ? 'bg-green-50/40' : 'bg-green-50/20'}`}>
                      <Skeleton className="h-4 w-12" />
                    </TableCell>
                    {/* Mkt Trades */}
                    <TableCell className={`border-r border-black/10 px-3 py-3 ${i % 2 === 0 ? 'bg-purple-50/40' : 'bg-purple-50/20'}`}>
                      <div className="flex justify-center">
                        <Skeleton className="h-6 w-8 rounded-full" />
                      </div>
                    </TableCell>
                    {/* Vol Conc */}
                    <TableCell className={`border-r border-black/10 px-3 py-3 ${i % 2 === 0 ? 'bg-purple-50/40' : 'bg-purple-50/20'}`}>
                      <div className="flex justify-center">
                        <Skeleton className="h-6 w-12 rounded-full" />
                      </div>
                    </TableCell>
                    {/* Mkt PnL */}
                    <TableCell className={`border-r border-black/10 px-3 py-3 ${i % 2 === 0 ? 'bg-purple-50/40' : 'bg-purple-50/20'}`}>
                      <div className="flex justify-center">
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </TableCell>
                    {/* Tot Trades */}
                    <TableCell className={`border-r border-black/10 px-3 py-3 ${i % 2 === 0 ? 'bg-orange-50/40' : 'bg-orange-50/20'}`}>
                      <div className="flex justify-center">
                        <Skeleton className="h-6 w-8 rounded-full" />
                      </div>
                    </TableCell>
                    {/* Open Pos */}
                    <TableCell className={`border-r border-black/10 px-3 py-3 ${i % 2 === 0 ? 'bg-orange-50/40' : 'bg-orange-50/20'}`}>
                      <div className="flex justify-center">
                        <Skeleton className="h-6 w-8 rounded-full" />
                      </div>
                    </TableCell>
                    {/* Tot PnL */}
                    <TableCell className={`border-r border-black/10 px-3 py-3 ${i % 2 === 0 ? 'bg-red-50/40' : 'bg-red-50/20'}`}>
                      <div className="flex justify-center">
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </TableCell>
                    {/* Wallet Age */}
                    <TableCell className={`px-3 py-3 ${i % 2 === 0 ? 'bg-gray-50/40' : 'bg-gray-50/20'}`}>
                      <div className="flex justify-center">
                        <Skeleton className="h-6 w-16 rounded-full" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <span className="sr-only">Loading trades...</span>
      </div>
    </>
  )
}

export default LoadingSkeleton

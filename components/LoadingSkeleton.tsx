import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const LoadingSkeleton = () => {
  return (
    <>
      {/* Mobile Card View */}
      <div className="block md:hidden space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="relative bg-card/50 backdrop-blur-sm border rounded-xl p-4 shadow-lg"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex items-center gap-1">
                  <Skeleton className="h-3 w-3" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
              <Skeleton className="h-4 w-full" />
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-12 rounded-full" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 rounded-2xl blur-2xl" />
        <div className="relative bg-card/50 backdrop-blur-sm border rounded-2xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b-2">
                  <TableHead className="font-semibold">Wallet</TableHead>
                  <TableHead className="font-semibold text-center">Score</TableHead>
                  <TableHead className="font-semibold">Trade Size</TableHead>
                  <TableHead className="font-semibold">Outcome</TableHead>
                  <TableHead className="font-semibold">Market</TableHead>
                  <TableHead className="font-semibold">Time</TableHead>
                  <TableHead className="font-semibold text-center">Markets</TableHead>
                  <TableHead className="font-semibold text-center">Account Age</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-lg" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        <Skeleton className="h-7 w-12 rounded-full" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-5 w-20" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        <Skeleton className="h-6 w-16 rounded-full" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-48" />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-3 w-3" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        <Skeleton className="h-6 w-8 rounded-full" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        <Skeleton className="h-6 w-20 rounded-full" />
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

export default LoadingSkeleton


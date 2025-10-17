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
    <div className="bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-800">
              <TableHead className="font-semibold dark:text-white">Wallet</TableHead>
              <TableHead className="font-semibold dark:text-white text-center">Score</TableHead>
              <TableHead className="font-semibold dark:text-white">Trade Size</TableHead>
              <TableHead className="font-semibold dark:text-white">Side</TableHead>
              <TableHead className="font-semibold dark:text-white">Outcome</TableHead>
              <TableHead className="font-semibold dark:text-white">Market</TableHead>
              <TableHead className="font-semibold dark:text-white">Time</TableHead>
              <TableHead className="font-semibold dark:text-white text-center">Markets</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i} className="border-b border-gray-200 dark:border-gray-800">
                <TableCell>
                  <Skeleton className="h-4 w-24 dark:bg-gray-800" />
                </TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    <Skeleton className="h-4 w-8 dark:bg-gray-800" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20 dark:bg-gray-800" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-12 dark:bg-gray-800" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-12 dark:bg-gray-800" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-48 dark:bg-gray-800" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16 dark:bg-gray-800" />
                </TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    <Skeleton className="h-4 w-8 dark:bg-gray-800" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default LoadingSkeleton

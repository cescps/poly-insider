import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

// Generate consistent color for wallet addresses
export const getWalletColor = (walletAddress: string): string => {
  // Simple hash function to generate consistent colors
  let hash = 0
  for (let i = 0; i < walletAddress.length; i++) {
    const char = walletAddress.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }

  // Use the hash to select from a predefined color palette
  const colors = [
    'bg-blue-500/10 text-blue-600 border-blue-200',
    'bg-green-500/10 text-green-600 border-green-200',
    'bg-purple-500/10 text-purple-600 border-purple-200',
    'bg-pink-500/10 text-pink-600 border-pink-200',
    'bg-indigo-500/10 text-indigo-600 border-indigo-200',
    'bg-red-500/10 text-red-600 border-red-200',
    'bg-yellow-500/10 text-yellow-600 border-yellow-200',
    'bg-teal-500/10 text-teal-600 border-teal-200',
    'bg-orange-500/10 text-orange-600 border-orange-200',
    'bg-cyan-500/10 text-cyan-600 border-cyan-200',
  ]

  return colors[Math.abs(hash) % colors.length]
}

// Color mapping for wallet text colors
const colorMap: Record<string, string> = {
  'text-blue-500': '#3b82f6',
  'text-purple-500': '#a855f7',
  'text-pink-500': '#ec4899',
  'text-indigo-500': '#6366f1',
  'text-orange-500': '#f97316',
  'text-teal-500': '#14b8a6',
  'text-cyan-500': '#06b6d4',
  'text-violet-500': '#8b5cf6',
  'text-emerald-500': '#10b981',
  'text-amber-500': '#f59e0b',
}

// Simple wallet color assignment based on actual usage patterns
const walletColorMap = new Map<string, string>()

export const getWalletTextColor = (walletAddress: string, allWallets?: string[]): string => {
  if (!walletAddress || walletAddress === '') {
    return 'text-gray-500' // Default color for empty wallets
  }

  // If we have all wallets data, use it to determine colors for repeated wallets
  if (allWallets) {
    const walletCounts = new Map<string, number>()

    // Count occurrences of each wallet
    allWallets.forEach(wallet => {
      if (wallet) {
        const normalized = wallet.trim().toLowerCase()
        walletCounts.set(normalized, (walletCounts.get(normalized) || 0) + 1)
      }
    })

    // Find wallets that appear multiple times
    const repeatedWallets = Array.from(walletCounts.entries())
      .filter(([_, count]) => count > 1)
      .map(([wallet]) => wallet)

    // Assign colors only to repeated wallets
    if (repeatedWallets.length > 0) {
      const normalizedInput = walletAddress.trim().toLowerCase()

      // Check if this wallet is repeated
      if ((walletCounts.get(normalizedInput) || 0) > 1) {
        // Use a simple index-based color assignment for repeated wallets
        const walletIndex = repeatedWallets.indexOf(normalizedInput)
        const colors = [
          'text-blue-500',
          'text-purple-500',
          'text-pink-500',
          'text-indigo-500',
          'text-orange-500',
          'text-teal-500',
          'text-cyan-500',
          'text-violet-500',
          'text-emerald-500',
          'text-amber-500',
        ]
        return colors[walletIndex % colors.length]
      }
    }
  }

  // For single-occurrence wallets or fallback, use gray
  return 'text-gray-600'
}

// Get hex color for inline styles
export const getWalletHexColor = (walletAddress: string, allWallets?: string[]): string => {
  const colorClass = getWalletTextColor(walletAddress, allWallets)
  return colorMap[colorClass] || '#6b7280' // fallback to gray
}


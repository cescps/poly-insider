# Polymarket Insider Trades Tracker

A real-time dashboard for tracking significant Polymarket trades from new wallets with concentrated market activity.

## Features

- **Real-time Updates**: Automatically refreshes trades every 15 seconds
- **Historical Search**: Automatically searches through past 20,000 trades on load to find historical matches
- **Manual Search**: "Search Past Trades" button to manually scan more historical data
- **Trade Accumulation**: All matching trades accumulate and persist across page reloads, showing the latest 100 trades
- **Comprehensive Analytics**: Displays 20+ detailed metrics for each trade:
  - Name: Username of the trader
  - Size: Buy order size in USDC
  - Side: Buy or Sell position (BUY/SELL)
  - Bet: Outcome (Yes/No) selected by trader
  - Market: Title of the prediction market
  - Time: When the trade occurred
  - Price: Price per share at execution
  - Entry: Trader's initial share price in market
  - Avg: Trader's average purchase price
  - Market Trades: Total trades in this market by user
  - Market Volume: Total USDC volume in this market
  - Volume Conc.: % of user's volume in this market
  - Market PnL: User's profit/loss in this market
  - Total Trades: Total trades by user on Polymarket
  - Trade Conc.: % of user's trades in this market
  - Open Positions: Number of open positions
  - O.P. Value: Total value of open positions
  - Tot. PnL: User's overall profit/loss
  - Tot. Vol: User's total traded volume
  - Wallet Age: Time since wallet creation
  - WC/TX Delta: Days between wallet creation and trade
- **Smart Filtering**: Shows only trades that match all criteria:
  - New wallets (account created less than 2 days ago)
  - Market concentration (users who have traded in 1-5 markets)
  - Large trades (transactions over $1,000)
- **Clean UI**: Built with shadcn/ui components for a minimalist, modern design
- **Wallet Color Coding**: Each wallet gets a consistent color across all its trades for easy identification
- **Fixed Header**: Table header stays visible when scrolling through large datasets
- **Direct Links**: Click wallet addresses to view profiles on Polymarket
- **Market Links**: Click market names to view full details on Polymarket

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
# or
yarn install
```

2. Run the development server:

```bash
npm run dev
# or
yarn dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: shadcn/ui
- **Data Source**: Polymarket Data API & Gamma API
- **Deployment**: Vercel-ready

## How It Works

1. **Data Fetching**: The app fetches recent trades from the Polymarket Data API
2. **User Analysis**: For each trade, it retrieves the user's trading history to determine:
   - How many unique markets they've traded in
   - When their account was created (based on first trade)
3. **Filtering**: Trades are filtered based on the three criteria mentioned above
4. **Market Information**: Market details are fetched and displayed with links
5. **Real-time Updates**: The dashboard polls for new data every 15 seconds

## API Routes

- `GET /api/trades` - Returns filtered trades matching all criteria

## Deployment

This project is optimized for deployment on Vercel:

```bash
npm run build
```

Or deploy directly with the Vercel CLI:

```bash
vercel
```

## Configuration

### Adjusting Filter Criteria

Edit `lib/config.ts` to change the filtering criteria:

```typescript
export const FILTER_CONFIG = {
  MAX_ACCOUNT_AGE_DAYS: 2,           // Account must be newer than this
  MIN_TRADE_SIZE_USD: 1000,          // Minimum trade size to show
  MIN_MARKETS_TRADED: 1,             // Minimum markets traded
  MAX_MARKETS_TRADED: 5,             // Maximum markets traded  
  FETCH_LIMIT: 500,                  // Number of trades to fetch per request
  INITIAL_HISTORICAL_FETCH: 2000,    // Number of past trades to search on load
  POLLING_INTERVAL_MS: 15000,        // Update frequency
}
```

**Note**: The default criteria are very strict. To see more results:
- Increase `MAX_ACCOUNT_AGE_DAYS` to 7 or 30 days
- Decrease `MIN_TRADE_SIZE_USD` to 500 or 100
- Increase `MAX_MARKETS_TRADED` to 10 or 20

The app uses public Polymarket APIs and doesn't require authentication.

## Performance Considerations

- User data is cached for 1 minute to reduce API calls
- Market data is cached for 1 hour
- Trades are fetched server-side to avoid CORS issues
- Parallel requests are used where possible to improve speed

## License

MIT


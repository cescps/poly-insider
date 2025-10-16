// Configuration for trade filtering criteria
// Adjust these values to make filters more or less strict

export const FILTER_CONFIG = {
  // Maximum account age in days (default: 7)
  MAX_ACCOUNT_AGE_DAYS: 7,
  
  // Minimum trade size in USD (default: 1000)
  MIN_TRADE_SIZE_USD: 1000,
  
  // Market concentration range
  MIN_MARKETS_TRADED: 1,
  MAX_MARKETS_TRADED: 10,
  
  // Number of trades to fetch from API per request (default: 500)
  FETCH_LIMIT: 500,
  
  // Number of historical trades to search on initial load (default: 20000)
  // This ensures we capture at least 48-72 hours of trades for better coverage
  INITIAL_HISTORICAL_FETCH: 20000,
  
  // Polling interval in milliseconds (default: 15000 = 15 seconds)
  POLLING_INTERVAL_MS: 15000,
  
  // Continue fetching more historical trades in background
  CONTINUOUS_HISTORY_FETCH: true,
  
  // Maximum total historical trades to search (default: 50000)
  // This covers multiple days of trading history
  MAX_HISTORICAL_FETCH: 50000,
}

// To see more results, try adjusting these values:
// - Increase MAX_ACCOUNT_AGE_DAYS to 7 or 30 days
// - Decrease MIN_TRADE_SIZE_USD to 500 or 100
// - Increase MAX_MARKETS_TRADED to 10 or 20


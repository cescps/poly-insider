export default function StrategiesPage() {
  const strategies = [
    {
      id: 1,
      title: "Capital Allocation Strategy",
      content: "Assign 75% of your capital to a single trade with at least a 75% probability of success. This approach maximizes expected returns while keeping exposure focused on high-confidence outcomes."
    },
    {
      id: 2,
      title: "Short-Term Focus",
      content: "Prioritize markets that resolve within 1–2 days. Short time horizons reduce uncertainty and keep your capital moving efficiently."
    },
    {
      id: 3,
      title: "Avoid Long Waits",
      content: "Don't lock your money for months. If a market drags on, withdraw early and reinvest in something more active. Momentum matters."
    },
    {
      id: 4,
      title: "Exit at Peak",
      content: "When a position reaches ~99% probability, close it. You'll secure almost the full profit while avoiding potential disputes or unexpected reversals at settlement."
    },
    {
      id: 5,
      title: "Market Influence",
      content: "Engage strategically. Post data or links that support your current position to influence sentiment—then, balance the thread by sharing the opposite argument to maintain credibility and avoid suspicion."
    },
    {
      id: 6,
      title: "Avoid Speculation",
      content: "Don't bet on vague, unpredictable questions like \"What will someone say?\" Stick to markets with verifiable, objective outcomes."
    },
    {
      id: 7,
      title: "Sleep Protection",
      content: "Before sleeping, if a market might resolve overnight, withdraw 80% of your position. Protects against sudden outcomes while you're offline."
    },
    {
      id: 8,
      title: "Fast Redeployment",
      content: "Once a market resolves, reinvest quickly. Capital sitting idle earns nothing—speed compounds gains."
    },
    {
      id: 9,
      title: "Low-Probability Bets",
      content: "Use small stakes (1–5%) on outcomes with 1–5% probability, just before deadlines. These can deliver outsized returns if sentiment shifts suddenly."
    },
    {
      id: 10,
      title: "High Spread Strategy",
      content: "Buy at $0.10, sell at $0.20. Simple, disciplined spread trading—focus on liquidity and exit discipline."
    },
    {
      id: 11,
      title: "Safe Bets",
      content: "Always keep a portion of funds in very high-confidence positions. These serve as a stability anchor in your overall portfolio."
    },
    {
      id: 12,
      title: "Top Trader PnL Analysis Strategy",
      content: "Analyze the profit and loss (PnL) of top traders in prediction markets to identify where experienced players are positioning. This reveals valuable directional insights, especially when consistent across major markets."
    },
  ]

  const analysis = {
    title: "Example: Top Trader PnL Analysis",
    content: `Analyze the profit and loss (PnL) of top traders in prediction markets to identify where experienced players are positioning.

For example:

Top 15 holders – Zohran Mamdami:
• YES bets: +€2.319M
• NO bets: +€1.464M

Top 15 holders – Andrew Cuomo:
• YES bets: −€226K
• NO bets: +€4.384M

This reveals stronger confidence among top traders in Mamdami's candidacy. While not investment advice, this approach can uncover valuable directional insights—especially when consistent across major markets.`
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-black">
      <div className="container mx-auto px-3 sm:px-4 pt-6 pb-4 sm:pt-8 sm:pb-8 max-w-7xl">
        <div className="mb-6 sm:mb-8">
          <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg p-4 sm:p-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Trading Strategies
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm sm:text-base">
              Proven strategies and analytical frameworks for prediction markets.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {strategies.map((strategy) => (
            <div
              key={strategy.id}
              className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg p-4 sm:p-6 hover:border-gray-300 dark:hover:border-gray-700 transition-colors h-full flex flex-col"
            >
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {strategy.title}
              </h2>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed flex-1">
                {strategy.content}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {analysis.title}
          </h2>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            {analysis.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-4 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}


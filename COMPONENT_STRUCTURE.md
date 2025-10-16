# Component Structure Diagram

## Before Refactor

```
TradesTable.tsx (462 lines)
├─ calculateInsiderScore()
├─ getInsiderScoreColor()
├─ getInsiderScoreTextColor()
├─ getAllWallets()
├─ formatWalletAddress()
├─ EmptyState (inline JSX)
├─ MobileCardView (inline JSX)
└─ DesktopTableView (inline JSX)
```

**Issues:**
- Single file with multiple responsibilities
- Hard to maintain and test
- Difficult to reuse components
- Complex file to navigate

## After Refactor

```
TradesTable.tsx (48 lines) - Orchestrator
├─ Uses: TooltipProvider
├─ Conditionally renders:
│   ├─ EmptyState (when no trades)
│   ├─ TradeCardMobile (mobile view)
│   └─ TradeTableDesktop (desktop view)
│
├─ components/trades/
│   ├─ index.ts - Barrel exports
│   │
│   ├─ EmptyState.tsx
│   │   └─ Activity icon
│   │
│   ├─ InsiderScoreBadge.tsx
│   │   ├─ Uses: calculateInsiderScore()
│   │   ├─ Uses: getInsiderScoreColor()
│   │   ├─ Badge component
│   │   └─ Tooltip component
│   │
│   ├─ TradeMetric.tsx
│   │   └─ Tooltip component (optional)
│   │
│   ├─ TradeCardMobile.tsx
│   │   ├─ Uses: InsiderScoreBadge
│   │   ├─ Uses: TradeMetric
│   │   ├─ Collapsible component
│   │   └─ Section groups:
│   │       ├─ Market Activity
│   │       ├─ User Activity
│   │       ├─ Overall Performance
│   │       └─ Wallet Info
│   │
│   └─ TradeTableDesktop.tsx
│       ├─ Uses: InsiderScoreBadge
│       ├─ Table components
│       ├─ Tooltip components
│       └─ 16 columns with:
│           ├─ Sticky wallet column
│           ├─ Zebra striping
│           └─ Color-coded groups
│
├─ lib/
│   └─ insider-score.ts
│       ├─ calculateInsiderScore()
│       ├─ getInsiderScoreColor()
│       ├─ getInsiderScoreTextColor()
│       └─ getInsiderScoreDescription()
│
└─ components/ui/
    ├─ collapsible.tsx - Radix UI wrapper
    └─ tooltip.tsx - Radix UI wrapper
```

## Component Responsibility Matrix

| Component | Responsibilities | Reusable | Lines |
|-----------|-----------------|----------|-------|
| **TradesTable** | Orchestrate layout, handle empty state | No | 48 |
| **EmptyState** | Display "no trades" message | Yes | 20 |
| **InsiderScoreBadge** | Display score with tooltip | Yes | 50 |
| **TradeMetric** | Display label/value with optional tooltip | Yes | 35 |
| **TradeCardMobile** | Mobile card with collapsible sections | Yes | 220 |
| **TradeTableDesktop** | Desktop table with all columns | Yes | 280 |

## Data Flow

```
app/page.tsx
    ↓ (passes trades array)
TradesTable
    ↓
    ├─ if empty → EmptyState
    │
    ├─ Mobile view → TradeCardMobile (for each trade)
    │   ├─ InsiderScoreBadge (calculates score)
    │   └─ Multiple TradeMetric components
    │
    └─ Desktop view → TradeTableDesktop
        ├─ InsiderScoreBadge (for each row)
        └─ Formatted data cells
```

## Styling Architecture

```
Global Styles (globals.css)
├─ CSS Variables (theme colors)
├─ Base styles
├─ Focus styles (accessibility)
└─ Reduced motion support

Component Styles (Tailwind classes)
├─ Responsive utilities (md:, lg:)
├─ Color-coded backgrounds
├─ Motion-safe animations
└─ Accessibility utilities
```

## Key Improvements

1. **Separation of Concerns**
   - Business logic → `lib/insider-score.ts`
   - UI components → `components/trades/`
   - Shared utilities → `components/ui/`

2. **Reusability**
   - `InsiderScoreBadge` can be used anywhere
   - `TradeMetric` standardizes metric display
   - UI components are generic wrappers

3. **Maintainability**
   - Each file has a single responsibility
   - Easy to locate and modify specific features
   - Clear import/export structure

4. **Testability**
   - Small, focused units
   - Pure functions in utilities
   - Easy to mock dependencies

5. **Performance**
   - Code splitting benefits
   - Tree-shaking friendly
   - Optimized re-renders

## Mobile Layout Structure

```
TradeCardMobile
┌─────────────────────────────────────┐
│ [Wallet] [Score] [$Size]            │ ← Always visible
├─────────────────────────────────────┤
│ Market Name (clickable)             │
├─────────────────────────────────────┤
│ [BUY] [YES]              2h ago     │
├─────────────────────────────────────┤
│ Price: $0.65  Entry: $0.60          │ ← Key metrics grid
│ Mkt PnL: +$1.2K  Wallet Age: 2d     │
├─────────────────────────────────────┤
│   ▼ Show Details                    │ ← Collapsible trigger
└─────────────────────────────────────┘

When expanded:
┌─────────────────────────────────────┐
│   ▲ Hide Details                    │
├─────────────────────────────────────┤
│ 📊 Market Activity                  │
│   Mkt Trades: 15  Mkt Vol: $50K    │
│   Vol Conc: 75%   Avg Price: $0.62 │
├─────────────────────────────────────┤
│ 📈 User Activity                    │
│   Tot Trades: 45  Trade Conc: 33%  │
│   Open Pos: 8     O.P. Value: $10K │
├─────────────────────────────────────┤
│ 💰 Overall Performance              │
│   Tot PnL: +$5K   Tot Vol: $150K   │
├─────────────────────────────────────┤
│ 👛 Wallet Info                      │
│   WC/TX Delta: 1.5d                 │
└─────────────────────────────────────┘
```

## Desktop Table Structure

```
┌──────────────────────────────────────────────────────────────────┐
│ Trader Info (Blue) │ Price (Green) │ Market (Purple) │ User... │
├────────────────────┼───────────────┼─────────────────┼─────────┤
│ [Wallet] [Score]   │ Price  Entry  │ Trades  PnL     │ ...     │ ← Row 1 (white bg)
│ [Wallet] [Score]   │ Price  Entry  │ Trades  PnL     │ ...     │ ← Row 2 (muted bg)
│ [Wallet] [Score]   │ Price  Entry  │ Trades  PnL     │ ...     │ ← Row 3 (white bg)
└────────────────────┴───────────────┴─────────────────┴─────────┘
     ↑ Sticky                              ↑ Color-coded groups
```

## Accessibility Features Map

```
Accessibility Enhancements
├─ Keyboard Navigation
│   ├─ Tab order
│   ├─ Focus-visible indicators
│   └─ Enter/Space for interactions
│
├─ Screen Readers
│   ├─ ARIA labels on links
│   ├─ Role attributes (list, region, status)
│   ├─ SR-only text for context
│   └─ Meaningful link text
│
├─ Visual
│   ├─ Color contrast (WCAG AA)
│   ├─ Focus rings
│   └─ Icon + text labels
│
└─ Motion
    ├─ Prefers-reduced-motion support
    ├─ motion-safe: prefix
    └─ Graceful animation degradation
```

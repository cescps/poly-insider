# Trades Table Refactor - Technical Documentation

## Overview
This document outlines the comprehensive refactor of the trades list presentation, focusing on improved readability, responsiveness, maintainability, and accessibility.

## Changes Made

### 1. Component Architecture Breakdown

The monolithic `TradesTable.tsx` (462 lines) has been refactored into smaller, focused components:

#### New Component Structure
```
components/
├── TradesTable.tsx (main orchestrator - 48 lines)
└── trades/
    ├── index.ts (barrel exports)
    ├── TradeTableDesktop.tsx (desktop table view)
    ├── TradeCardMobile.tsx (mobile card with collapsible sections)
    ├── InsiderScoreBadge.tsx (insider score display with tooltips)
    ├── TradeMetric.tsx (reusable metric display component)
    └── EmptyState.tsx (empty state UI)
```

#### New Utility Modules
```
lib/
└── insider-score.ts (insider score calculation logic)
```

#### New UI Components
```
components/ui/
├── collapsible.tsx (Radix UI collapsible wrapper)
└── tooltip.tsx (Radix UI tooltip wrapper)
```

### 2. Desktop Table Improvements

#### Visual Enhancements
- **Zebra Striping**: Alternating row backgrounds (`bg-white/30` and `bg-muted/10`) for improved readability
- **Color-Coded Column Groups**: Maintained and enhanced with matching row backgrounds:
  - Blue: Trader information (Wallet, Score, Size, Side, Bet, Market, Time)
  - Green: Price data (Price, Entry)
  - Purple: Market activity (Mkt Trades, Vol Conc, Mkt PnL)
  - Orange: User activity (Tot Trades, Open Pos)
  - Red: Overall performance (Tot PnL)
  - Gray: Wallet info (Wallet Age)
- **Sticky Wallet Column**: First column (wallet address) remains visible during horizontal scrolling
- **Trimmed Columns**: Reduced from 22 to 16 columns, focusing on critical metrics

#### UX Improvements
- **Info Icons with Tooltips**: Added on column headers for contextual help
- **Enhanced Focus States**: Improved keyboard navigation with visible focus rings
- **External Link Indicators**: Icons appear on hover for external links
- **Improved Visual Hierarchy**: Better spacing and typography

### 3. Mobile Experience Overhaul

#### Collapsible Card Design
- **Always Visible (Header)**:
  - Wallet address with color coding
  - Insider score badge
  - Trade size with trending icon
  - Market name (clickable link)
  - Side and Bet badges
  - Relative time
  - Key metrics: Price, Entry, Mkt PnL, Wallet Age

- **Collapsible Sections** (Show/Hide Details):
  - **Market Activity**: Mkt Trades, Mkt Vol, Vol Conc, Avg Price
  - **User Activity**: Tot Trades, Trade Conc, Open Pos, O.P. Value
  - **Overall Performance**: Tot PnL, Tot Vol
  - **Wallet Info**: WC/TX Delta

#### Mobile-Specific Features
- Smooth expand/collapse animations
- Section icons for visual categorization
- Optimized touch targets (minimum 44x44px)
- Compact yet readable typography
- Grid layout for metrics (2 columns)

### 4. Loading Skeleton Updates

The `LoadingSkeleton.tsx` component has been updated to match the new layouts:
- Desktop: Matches new 16-column table with zebra striping and color-coded backgrounds
- Mobile: Reflects new card structure with collapsible trigger
- Consistent spacing and animation

### 5. Accessibility Enhancements

#### ARIA Labels
- Added descriptive `aria-label` attributes on all interactive elements
- Proper `role` attributes (`list`, `region`, `status`)
- Screen reader announcements for loading states

#### Focus Management
- Enhanced focus-visible styles with ring indicators
- Proper tab order for keyboard navigation
- Focus trapping in interactive elements

#### Reduced Motion Support
- Added `prefers-reduced-motion` media query support in `globals.css`
- Conditional animations using `motion-safe:` prefix
- Respects user preferences for motion

#### Color Contrast
- Maintained WCAG AA compliance for all text
- Enhanced color combinations for better readability
- Consistent use of semantic colors

### 6. New Dependencies

```json
{
  "@radix-ui/react-collapsible": "^1.1.x",
  "@radix-ui/react-tooltip": "^1.1.x"
}
```

### 7. Responsive Design

#### Breakpoints
- Mobile: `< 768px` (md breakpoint)
- Desktop: `>= 768px`

#### Features by Breakpoint
- **Mobile**: Card-based layout with collapsible sections
- **Desktop**: Full table with horizontal scroll, sticky first column

### 8. Performance Optimizations

- Component code-splitting through modular architecture
- Reduced bundle size by extracting logic into separate utilities
- Lazy rendering of collapsible content
- Optimized re-renders with proper React patterns

## Migration Guide

### For Developers

The main `TradesTable` component API remains unchanged:

```tsx
<TradesTable trades={filteredTrades} />
```

### Internal Changes

If you need to customize individual parts:

```tsx
import { 
  TradeTableDesktop, 
  TradeCardMobile, 
  InsiderScoreBadge,
  TradeMetric,
  EmptyState 
} from '@/components/trades'
```

## Testing Recommendations

### Visual Regression Testing
1. Test on mobile devices (320px - 767px widths)
2. Test on tablets (768px - 1024px widths)
3. Test on desktop (1024px+ widths)
4. Test with different trade data sets (0, 1, 5, 20+ trades)

### Accessibility Testing
1. Keyboard navigation (Tab, Enter, Space)
2. Screen reader compatibility (NVDA, JAWS, VoiceOver)
3. Reduced motion preferences
4. Color contrast verification
5. Focus indicator visibility

### Functionality Testing
1. Collapsible sections open/close smoothly
2. Tooltips display on hover/focus
3. External links open correctly
4. Sticky columns work during horizontal scroll
5. Loading skeletons match actual content layout

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile Safari 14+
- Chrome Mobile 90+

## Future Enhancements

Potential improvements for future iterations:
- Add sorting functionality to desktop table columns
- Implement filtering by metric ranges
- Add export functionality (CSV, JSON)
- Implement virtual scrolling for large datasets (100+ trades)
- Add column visibility toggle for desktop
- Implement saved view preferences
- Add comparison mode for multiple trades

## Accessibility Checklist

- [x] Keyboard navigation
- [x] Screen reader support
- [x] Focus indicators
- [x] ARIA labels
- [x] Color contrast
- [x] Reduced motion support
- [x] Semantic HTML
- [x] Touch target sizes (mobile)
- [x] Skip links consideration
- [x] Form labels and descriptions

## Performance Metrics

Expected improvements:
- Component complexity: 462 lines → ~50 lines (main component)
- Reusability: 0 → 5+ reusable components
- Maintainability: Significantly improved through separation of concerns
- Bundle size: Optimized through code splitting
- Accessibility score: Enhanced with proper ARIA and motion support

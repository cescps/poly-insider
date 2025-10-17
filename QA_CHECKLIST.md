# QA Checklist - Trades List Overhaul

## Build & Code Quality ✅
- [x] Production build successful
- [x] No ESLint errors or warnings
- [x] No TypeScript compilation errors
- [x] All imports resolve correctly
- [x] Dependencies installed correctly
- [x] .gitignore updated

## Visual Regression Testing

### Desktop View (≥768px) 
- [ ] Table displays with 16 columns
- [ ] Wallet column is sticky on horizontal scroll
- [ ] Zebra striping (alternating row colors) visible
- [ ] Color-coded column groups show correctly:
  - [ ] Blue: Trader info (Wallet, Score, Size, Side, Bet, Market, Time)
  - [ ] Green: Price data (Price, Entry)
  - [ ] Purple: Market activity (Mkt Trades, Vol Conc, Mkt PnL)
  - [ ] Orange: User activity (Tot Trades, Open Pos)
  - [ ] Red: Performance (Tot PnL)
  - [ ] Gray: Wallet info (Wallet Age)
- [ ] Info icons appear in column headers
- [ ] Tooltips display on info icon hover
- [ ] External link icons appear on hover
- [ ] Gradient background blur visible
- [ ] No layout shifts or jumps
- [ ] Text is readable and properly aligned
- [ ] Numbers are right-aligned where appropriate

### Mobile View (<768px)
- [ ] Cards display instead of table
- [ ] Cards have proper spacing
- [ ] Wallet address is colored and clickable
- [ ] Insider score badge displays correctly
- [ ] Trade size shows with trend icon
- [ ] Market name is clickable and truncates properly
- [ ] Side and Bet badges show with correct colors
- [ ] Relative time displays
- [ ] Key metrics grid shows (2 columns)
- [ ] "Show Details" button is visible and centered
- [ ] Clicking "Show Details" expands card smoothly
- [ ] Expanded sections show:
  - [ ] Market Activity with icon
  - [ ] User Activity with icon
  - [ ] Overall Performance with icon
  - [ ] Wallet Info with icon
- [ ] "Hide Details" button works
- [ ] Cards have hover effect (subtle background change)
- [ ] Touch targets are adequate (minimum 44x44px)

### Loading States
- [ ] Desktop skeleton matches table layout
- [ ] Desktop skeleton has zebra striping
- [ ] Desktop skeleton has color-coded columns
- [ ] Mobile skeleton matches card layout
- [ ] Mobile skeleton shows collapsible trigger
- [ ] Loading animation is smooth
- [ ] "Loading trades..." announced to screen readers

### Empty State
- [ ] Activity icon displays with pulse animation
- [ ] "Monitoring Live Trades" heading visible
- [ ] Description text is readable
- [ ] Gradient background effect visible
- [ ] Properly centered on all screen sizes

### Responsive Breakpoints
Test at these specific widths:
- [ ] 320px (small mobile)
- [ ] 375px (medium mobile)
- [ ] 414px (large mobile)
- [ ] 768px (tablet - breakpoint)
- [ ] 1024px (small desktop)
- [ ] 1280px (medium desktop)
- [ ] 1920px (large desktop)

## Accessibility Testing

### Keyboard Navigation
- [ ] Tab key navigates through all interactive elements
- [ ] Tab order is logical (top to bottom, left to right)
- [ ] Focus indicators are clearly visible
- [ ] Enter/Space activates links and buttons
- [ ] Collapsible sections open/close with Enter/Space
- [ ] No keyboard traps
- [ ] Skip to content functionality (if applicable)

### Screen Reader Testing
Test with NVDA (Windows), JAWS (Windows), or VoiceOver (Mac):
- [ ] Trade list announced as "list" with count
- [ ] Each trade card/row has meaningful description
- [ ] Wallet links announce as "View wallet [address] on Polymarket"
- [ ] Market links announce as "View market [name] on Polymarket"
- [ ] Insider score badge has descriptive text
- [ ] Collapsible trigger announces expanded/collapsed state
- [ ] Loading state announces "Loading trades..."
- [ ] Empty state content is read aloud
- [ ] Table headers are associated with cells (desktop)
- [ ] No duplicate announcements

### Color & Contrast
- [ ] All text meets WCAG AA contrast ratio (4.5:1 for normal text)
- [ ] Links are distinguishable from regular text
- [ ] Focus indicators have sufficient contrast
- [ ] Color is not the only way information is conveyed
- [ ] Badges have sufficient contrast
- [ ] Insider score colors are distinguishable

### Reduced Motion
Enable "Reduce Motion" in OS settings:
- [ ] Animations are disabled or significantly reduced
- [ ] Page is still fully functional
- [ ] No jarring layout shifts
- [ ] Collapsible sections still work
- [ ] No flashing or spinning elements

### Focus Management
- [ ] Focus ring is visible on all interactive elements
- [ ] Focus ring color contrasts with background
- [ ] Focus ring is consistent throughout
- [ ] Hover state different from focus state
- [ ] No focus on non-interactive elements

## Functionality Testing

### Desktop Table
- [ ] Horizontal scrolling works smoothly
- [ ] Wallet column stays fixed during scroll
- [ ] Sorting works (if implemented)
- [ ] All links navigate correctly
- [ ] Tooltips don't block content
- [ ] Tooltips dismiss properly
- [ ] External links open in new tab
- [ ] Hover effects work on all interactive elements

### Mobile Cards
- [ ] Cards scroll smoothly
- [ ] Expand/collapse animations are smooth
- [ ] Only one section expands at a time (if designed so)
- [ ] Links are tappable without accidental triggers
- [ ] Scrolling doesn't trigger unwanted interactions
- [ ] Pull-to-refresh doesn't break layout (if supported)

### Data Display
- [ ] Wallet addresses formatted correctly (6...4)
- [ ] Wallet colors are consistent across views
- [ ] Same wallet shows same color each time
- [ ] Insider scores calculate correctly (0-100 range)
- [ ] Insider score colors match score ranges:
  - [ ] Red (≥80)
  - [ ] Orange (60-79)
  - [ ] Yellow (40-59)
  - [ ] Green (<40)
- [ ] Currency values formatted correctly ($1,234.56)
- [ ] Percentages formatted correctly (12.3%)
- [ ] Prices formatted correctly (¢65 or $0.65)
- [ ] Numbers formatted with thousands separators
- [ ] Wallet ages formatted correctly (2d, 1w, 3mo, etc.)
- [ ] Relative times update correctly (2h ago, 1d ago)
- [ ] PnL shows correct color (green positive, red negative)

### Edge Cases
- [ ] No trades: Empty state displays
- [ ] 1 trade: Layout looks good
- [ ] 100+ trades: Performance is acceptable
- [ ] Very long market names: Truncate properly
- [ ] Very large numbers: Format correctly
- [ ] Missing data: Shows "-" or "Unknown"
- [ ] Extreme insider scores (0, 100): Display correctly
- [ ] Negative PnL values: Color and format correct

## Performance Testing

### Load Time
- [ ] Initial page load < 3 seconds
- [ ] Time to interactive < 5 seconds
- [ ] No cumulative layout shift (CLS < 0.1)
- [ ] First contentful paint < 1.5 seconds

### Runtime Performance
- [ ] Scrolling is smooth (60fps)
- [ ] Expanding/collapsing is smooth
- [ ] No janky animations
- [ ] No memory leaks on long sessions
- [ ] Table with 50+ rows performs well

### Network Performance
- [ ] Works on slow 3G
- [ ] Graceful degradation on network issues
- [ ] Loading states show immediately

## Browser Compatibility

### Desktop Browsers
- [ ] Chrome 90+ (Windows, Mac, Linux)
- [ ] Firefox 88+ (Windows, Mac, Linux)
- [ ] Safari 14+ (Mac)
- [ ] Edge 90+ (Windows)

### Mobile Browsers
- [ ] Safari iOS 14+
- [ ] Chrome Mobile 90+
- [ ] Firefox Mobile 88+
- [ ] Samsung Internet

### Known Issues
Document any browser-specific issues found:
- None known at release

## Regression Testing

### Existing Functionality
- [ ] API endpoints still work
- [ ] Data polling continues
- [ ] LocalStorage persistence works
- [ ] Notifications still trigger (if applicable)
- [ ] Other pages/features unaffected

### Integration Points
- [ ] Works with historical trades feature
- [ ] Works with real-time updates
- [ ] Works with filters/configuration

## Sign-off

- [ ] Developer QA complete
- [ ] Visual design review complete
- [ ] Accessibility audit complete
- [ ] Code review complete
- [ ] Product owner approval

## Notes

Document any issues, concerns, or observations:

```
[Add notes here]
```

## Test Environment

- **Date**: ___________
- **Tester**: ___________
- **OS**: ___________
- **Browser**: ___________
- **Screen Size**: ___________
- **Device**: ___________

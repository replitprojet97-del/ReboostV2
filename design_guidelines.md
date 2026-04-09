# Design Guidelines: Professional Multi-Language Loan Platform

## Design Approach

**Selected Approach:** Design System with Fintech Best Practices

Drawing inspiration from industry leaders like Stripe, Wise, and modern banking platforms, this design prioritizes trust, clarity, and efficient data presentation. The approach balances professional financial services aesthetics with modern web design principles.

**Core Principles:**
- Trust through clarity: Every financial figure must be immediately scannable
- Progressive disclosure: Complex processes broken into digestible steps
- Data hierarchy: Critical financial information receives visual priority
- Accessibility first: Multi-language support integrated seamlessly

## Typography System

**Font Families:**
- Primary (UI & Data): Inter or Work Sans via Google Fonts
- Numerical Data: JetBrains Mono or SF Mono for financial figures
- Headings: Same as primary for consistency

**Hierarchy:**
- Hero Headline: text-5xl md:text-6xl lg:text-7xl, font-bold
- Section Headers: text-3xl md:text-4xl, font-semibold
- Dashboard Card Titles: text-xl md:text-2xl, font-semibold
- Financial Figures (Large): text-4xl md:text-5xl, font-mono, font-bold
- Financial Figures (Small): text-2xl md:text-3xl, font-mono, font-semibold
- Body Text: text-base md:text-lg
- Labels & Metadata: text-sm, font-medium
- Micro-copy: text-xs

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, 16, 24
- Component padding: p-6 or p-8
- Section spacing: py-16 md:py-24
- Card gaps: gap-6 or gap-8
- Tight groupings: space-y-2 or space-y-4

**Container Strategy:**
- Full-width sections: w-full with max-w-7xl mx-auto px-6 md:px-8
- Dashboard grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 with gap-6
- Sidebar layout for "Mon espace": Two-column (sidebar + main content) on lg breakpoint

## Hero Section Design

**Structure:** Full-height scrollable hero (min-h-screen) with large background image

**Image Specifications:**
- Large hero image depicting professional business setting: modern office, business handshake, or abstract financial growth visualization
- Image should convey trust, professionalism, and growth
- Apply subtle overlay for text readability
- Position: background with object-cover

**Hero Content Layout:**
- Centered content with max-w-4xl
- Language switcher: Fixed top-right position with flag icons + text (EN | FR | etc.)
- Main headline with subheadline explaining loan services
- Two primary CTAs side-by-side: "Demander un prêt" (primary) and "Mon espace" (secondary)
- Buttons with backdrop-blur-md bg-white/20 treatment when over image
- Trust indicators below CTAs: "Trusted by 10,000+ businesses" with small logos of partner banks
- Scroll indicator at bottom: animated chevron or "Scroll to explore" text

## Dashboard Layout ("Mon espace")

**Overall Structure:**
Desktop: Sidebar navigation (w-64) + main content area
Mobile: Bottom navigation bar with collapsible sidebar

**Sidebar Navigation:**
- Logo at top (h-12 md:h-16)
- Main navigation items with icons: Dashboard, Loans, Transfers, History, Settings
- User profile card at bottom with name, account type, and logout button
- Active state with subtle background treatment

**Dashboard Grid Components:**

1. **Balance Overview Card** (Spans 2 columns on lg)
   - Large current balance figure with "Solde actuel" label
   - Secondary metrics in row: Active loans count, Total borrowed, Available credit
   - Subtle dividers between metrics
   - Last updated timestamp

2. **Active Loans Card**
   - List view with each loan showing: Amount, Interest rate, Next payment date, Progress bar
   - Maximum 3 visible, "View all" link if more exist
   - Each loan clickable for detail view

3. **Borrowing Capacity Card**
   - Circular progress indicator showing capacity percentage
   - Large figure: "Vous pouvez emprunter jusqu'à X€"
   - Small explanatory text about calculation factors

4. **Quick Actions Card**
   - Three prominent action buttons stacked vertically with icons:
     * "Nouveau prêt" with plus icon
     * "Transférer des fonds" with arrow icon
     * "Historique des transactions" with clock icon
   - Each button full-width within card

## Fee Section Design

**Layout:** Table format with expandable rows
- Columns: Fee type, Reason/Description, Amount, Date applied
- Grouped by category: Loan fees, Transfer fees, Account fees
- Each row expandable to show detailed breakdown
- Running total at bottom
- "Download statement" button

## Pending Transfers Section

**Step Progress Indicator:**
- Horizontal stepper component showing 4-5 steps:
  1. Request submitted
  2. Document verification
  3. Compliance check
  4. Approval pending
  5. Transfer complete
- Current step highlighted, completed steps with checkmarks
- Estimated time for each step shown below

**Transfer Cards:**
- Each transfer in card format showing:
  * Transfer amount (large, prominent)
  * Recipient information
  * Current status with progress indicator
  * Timestamp of last update
  * Expandable section for required documents/actions
- Cards ordered by recency
- Status badges: "En attente", "En cours", "Approuvé", "Rejeté"

## Dynamic Charts

**Chart Library:** Recharts or Chart.js

**Available Funds Chart:**
- Area chart showing fund availability over 12 months
- Smooth curves with subtle gradient fill
- Interactive tooltips on hover
- Legend showing: Available, Committed, Reserved

**Upcoming Repayments Chart:**
- Bar chart showing monthly repayment schedule for next 12 months
- Stacked bars if multiple loans
- Y-axis in currency format
- Hover shows breakdown by loan

**Chart Container:**
- Cards with aspect-ratio-[16/9] on mobile, aspect-ratio-[21/9] on desktop
- Padding around chart: p-6
- Title and timeframe selector (1M, 3M, 6M, 1Y) in header

## Transfer Validation Process

**Multi-Step Form Layout:**
- Progress bar at top showing 5 steps
- Main content area for current step with max-w-2xl centered
- Each step contains:
  * Step number and title
  * Instructions/description
  * Form fields or upload area
  * Summary of previous steps in collapsible sidebar
- Navigation: "Précédent" (ghost button) and "Suivant" (primary button)
- Auto-save indicator
- Exit warning if attempting to leave mid-process

**Step Breakdown:**
1. Amount & Purpose: Amount input, purpose dropdown, loan selector
2. Documents: Drag-and-drop upload zone with file type indicators
3. Recipient Details: Form with validation
4. Review: Read-only summary with edit links
5. Confirmation: Success state with reference number

## Multi-Language Implementation

**Language Switcher:**
- Dropdown in header with flag icons + language codes
- Current language highlighted
- Persists selection in localStorage

**Content Strategy:**
- All labels, buttons, and messages use translation keys
- Number formatting respects locale (1,000.00 vs 1 000,00)
- Currency symbols adapt to selected language
- Date formats localized

## Component Library

**Buttons:**
- Primary: Solid treatment, font-semibold, px-6 py-3, rounded-lg
- Secondary: Outline treatment with same sizing
- Ghost: No background, hover state only
- Icon buttons: Square (h-10 w-10) with centered icon

**Cards:**
- Rounded corners: rounded-xl
- Padding: p-6 or p-8 for larger cards
- Shadow: shadow-sm with hover:shadow-md transition
- Header with title and optional action button

**Inputs:**
- Height: h-12
- Padding: px-4
- Rounded: rounded-lg
- Label above with mb-2
- Error states with message below
- Currency inputs with € or $ prefix inside field

**Badges:**
- Small, rounded-full, px-3 py-1, text-xs font-semibold
- Status variants for different states

**Animations:**
- Minimal, purposeful only
- Loading states: Skeleton screens for data fetching
- Transitions: transition-all duration-200 for interactive elements
- Chart animations: Smooth entrance on initial render only

## Images

**Hero Section:**
- Large hero image: Professional business environment or abstract financial growth
- Dimensions: High-resolution, 1920x1080 minimum
- Placement: Full-width background with overlay

**Dashboard:**
- User avatar: Circular, 40x40px in sidebar, 80x80px in profile settings
- Empty states: Illustrations for "No active loans", "No pending transfers"
- Partner logos: Small, grayscale, h-8 in hero trust indicators

This design delivers a comprehensive, trust-building financial platform that balances data density with clarity and modern aesthetics.
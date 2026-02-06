# Web3 Events Page - Design Plan
## Clean, Unique UI for Blockchain Community Events

---

## 🎯 Core Philosophy

**Web3 Design Principles Applied:**
- **Transparency First** - All info visible upfront (no hidden costs, requirements clear)
- **Decentralized Feel** - Community-driven, not corporate
- **Trust Through Simplicity** - Minimal jargon, maximum clarity
- **Futuristic but Functional** - Modern aesthetics without sacrificing usability
- **Direct Data Display** - No third-party dependencies, backend-driven

---

## 📐 Unique Design Pattern: "Gradient Grid with Glassmorphism Cards"

### Visual Identity
This creates a distinctly Web3 feel while maintaining professional clarity:

**Background Treatment:**
- Dark base (#0A0B0D or #0F1419) for reduced eye strain
- Animated gradient overlay (subtle purple → blue → cyan movement)
- Mesh gradient pattern (low opacity 5-10%) creating depth
- No solid backgrounds - layers of transparency

**Card Style - Glassmorphism:**
```
Background: rgba(255, 255, 255, 0.05) with blur
Border: 1px solid gradient (45deg angle)
Shadow: Multi-layer glow effect in brand colors
Hover: Lift + intensify border glow + slight scale
```

**Why This Works for Web3:**
- Feels futuristic and tech-forward
- Creates depth without heavy graphics
- Lightweight (performance matters in Web3)
- Stands out from traditional event platforms
- Aligns with DeFi/crypto design language

---

## 🏗️ Page Architecture

### 1. Hero Section (Full viewport height)

**Layout:**
```
┌─────────────────────────────────────────┐
│  [Logo]              [Connect Wallet]   │
│                                         │
│         UPCOMING WEB3 EVENTS            │
│    Conferences • Hackathons • Meetups   │
│                                         │
│  [Search Events...]  [🎫 Submit Event]  │
│                                         │
│  ↓ Scroll to explore                    │
└─────────────────────────────────────────┘
```

**Elements:**
- **Title:** Large gradient text "UPCOMING WEB3 EVENTS"
- **Subtitle:** Event count badge "42 events • 12 countries • 5,200+ builders"
- **Search Bar:** Prominent, centered, glowing border on focus
- **CTA:** "Submit Event" button with gradient fill
- **Wallet Connect** (optional): Top right corner for personalized features
- **Animated Elements:** Floating geometric shapes (subtle triangles/hexagons)

**Typography:**
- Title: 56-72px, bold, gradient text (purple to cyan)
- Subtitle: 18px, medium, muted white (70% opacity)

---

### 2. Filter Bar (Sticky on scroll)

**Layout Style: Horizontal Pills + Dropdowns**

```
[All Events ▼] [Virtual ☁️] [In-Person 📍] [Hackathons 🏗️] [Conferences 🎤] [Workshops 📚] [Free 🎫]
                                                                          [Calendar View 📅] [Reset ✕]
```

**Design Specs:**
- **Container:** Glassmorphic background, 60px height, blur backdrop
- **Pills:** Rounded full (9999px), padding 12px 20px
- **Active State:** Solid gradient background, white text
- **Inactive State:** Transparent with border, 60% white text
- **Hover:** Border glow effect + scale 1.05

**Filter Categories:**

1. **Event Type:** 
   - All Events
   - Conferences
   - Hackathons  
   - Workshops
   - Meetups
   - AMAs
   - Product Launches

2. **Location:**
   - Virtual
   - In-Person
   - Hybrid
   - [City/Region dropdown]

3. **Track/Focus:**
   - DeFi
   - NFTs
   - Infrastructure
   - Gaming
   - DAOs
   - Developer Tools
   - Security/Auditing

4. **Time:**
   - Today
   - This Week
   - This Month
   - Q1 2026
   - All Upcoming

5. **Cost:**
   - Free
   - Paid
   - All

6. **Status:**
   - Open Registration
   - Waitlist Available
   - Sold Out
   - Past Events

**Mobile Filter:**
- Bottom sheet drawer with same categories
- Floating "Filter" button (bottom right, fixed)
- Active filter count badge on button

---

### 3. Events Grid Layout

**Desktop Grid Specs:**
- **3 columns** on large screens (1920px+)
- **2 columns** on medium (1024-1919px)
- **1 column** on mobile (<1024px)
- **Gap:** 32px between cards
- **Padding:** 80px horizontal container padding

---

## 🎴 Event Card - The Star Component

### Card Anatomy (Detailed)

**Dimensions:**
- **Width:** Flexible (grid auto-fill)
- **Height:** Auto (min 440px to maintain consistency)
- **Border Radius:** 20px
- **Padding:** 0 (image full bleed at top)

### Card Structure (Top to Bottom):

#### 1. **Image Container** (40% of card height)
```
┌─────────────────────────────────┐
│   [Event Cover Image]           │
│                                 │
│   [Status Badge]  [Type Badge]  │ ← Absolute positioned
│                                 │
└─────────────────────────────────┘
```

**Image Specs:**
- **Aspect Ratio:** 16:9
- **Overlay:** Linear gradient from transparent to card background (bottom)
- **Fallback:** Gradient background with blockchain icon pattern

**Badges on Image:**
- **Status Badge** (top-right): 
  - "LIVE NOW" - Red gradient, pulse animation
  - "SOLD OUT" - Gray, no animation
  - "FREE" - Green gradient
  - "EARLY BIRD" - Yellow gradient
  - Position: 16px from top-right
  - Style: Rounded pill, semi-transparent background

- **Type Badge** (top-left):
  - Category icon + text (e.g., "🏗️ Hackathon")
  - Position: 16px from top-left
  - Style: Glassmorphic, white text

#### 2. **Content Area** (60% of card height, padding: 24px)

**Date & Time Block:**
```
📅 Tue, Feb 18, 2026
⏰ 18:00 - 21:00 UTC
```
- Icon + Text format
- Font: 14px, medium weight
- Color: Brand accent color (cyan/purple)
- Background: Subtle gradient pill
- Margin bottom: 12px

**Event Title:**
```
Stellar Builders Bootcamp — Kabale Edition
```
- Font: 22px, bold
- Line height: 1.3
- Max lines: 2 with ellipsis
- Color: White 95%
- Margin bottom: 8px

**Location:**
```
📍 Virtual (Zoom) 
   or
📍 San Francisco, CA, USA
```
- Icon + text
- Font: 14px, regular
- Color: White 70%
- Margin bottom: 12px

**Organizer:**
```
[Avatar] Stellar Development Foundation
```
- 32x32px circle avatar
- Name: 14px, semibold
- Color: White 80%
- Inline-flex layout
- Margin bottom: 16px

**Description Preview:**
```
Join us for an intensive 3-day bootcamp covering smart contract development on Stellar, covering Soroban, tokenization...
```
- Font: 14px, regular
- Line height: 1.5
- Max lines: 2 with ellipsis
- Color: White 60%
- Margin bottom: 16px

**Attendees & Community Signal:**
```
[👤][👤][👤] +142 builders attending
```
- Stacked avatars (max 4 visible)
- Count text: 13px, medium
- Color: White 70%
- Position: Above footer actions

#### 3. **Card Footer** (Fixed height, 72px)
```
┌─────────────────────────────────┐
│ [RSVP FREE]      [🔖] [🔗] [•••] │
└─────────────────────────────────┘
```

**Primary Action Button:**
- Text: "RSVP FREE" / "REGISTER" / "JOIN WAITLIST" / "VIEW DETAILS"
- Width: 70% of footer
- Height: 44px
- Border radius: 10px
- Background: Gradient (brand colors)
- Hover: Glow effect + slight scale
- Font: 14px, semibold, uppercase

**Secondary Actions:**
- Bookmark icon (save for later)
- Share icon (copy link, social share)
- More menu (•••) → Report, Calendar add, etc.
- Size: 40x40px icon buttons
- Style: Transparent with border, hover glow

### Card Interactive States

**Default:**
- Border: 1px solid rgba(255,255,255,0.1)
- Shadow: 0 4px 20px rgba(0,0,0,0.4)

**Hover:**
- Transform: translateY(-8px)
- Border: Animated gradient border
- Shadow: 0 12px 40px rgba(brand-color, 0.3) + brand glow
- Transition: All 0.3s cubic-bezier(0.4, 0, 0.2, 1)

**Loading Skeleton:**
- Animated gradient shimmer across all elements
- Placeholder shapes matching layout
- Pulse animation on background

**Empty State (No Image):**
- Gradient background (purple → blue)
- Geometric pattern overlay
- Category icon in center (large, 60px)
- Maintain same card structure

---

## 🎨 Design System Specifications

### Color Palette (Dark Theme Base)

**Backgrounds:**
- Primary: `#0A0B0D`
- Secondary: `#0F1419`
- Card: `rgba(255, 255, 255, 0.05)` with backdrop-blur(20px)

**Text:**
- Primary: `rgba(255, 255, 255, 0.95)`
- Secondary: `rgba(255, 255, 255, 0.70)`
- Tertiary: `rgba(255, 255, 255, 0.50)`

**Gradients (Brand):**
- Primary: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)` (Purple)
- Accent: `linear-gradient(135deg, #f093fb 0%, #f5576c 100%)` (Pink)
- Success: `linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)` (Cyan)
- Info: `linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)` (Green)

**Status Colors:**
- Live: `#ef4444` (Red)
- Sold Out: `#6b7280` (Gray)
- Free: `#10b981` (Green)
- Early Bird: `#f59e0b` (Yellow)
- Waitlist: `#8b5cf6` (Purple)

**Borders:**
- Default: `rgba(255, 255, 255, 0.1)`
- Hover/Focus: Animated gradient or solid accent

### Typography Scale

**Font Family:**
- Primary: `'Inter', system-ui, sans-serif` (Clean, modern)
- Alternative: `'Space Grotesk', sans-serif` (For Web3 vibe)
- Mono: `'JetBrains Mono', monospace` (For addresses, hashes)

**Scale:**
- Hero Title: 72px / Bold / Line height 1.1
- Section Title: 48px / Bold / Line height 1.2
- Card Title: 22px / Bold / Line height 1.3
- Body Large: 18px / Regular / Line height 1.6
- Body: 16px / Regular / Line height 1.5
- Body Small: 14px / Regular / Line height 1.5
- Caption: 13px / Medium / Line height 1.4
- Tiny: 12px / Medium / Line height 1.3

### Spacing System (8px base)

```
4px   → 0.5  (xs)
8px   → 1    (sm)
12px  → 1.5  (md)
16px  → 2    (base)
24px  → 3    (lg)
32px  → 4    (xl)
48px  → 6    (2xl)
64px  → 8    (3xl)
80px  → 10   (4xl)
96px  → 12   (5xl)
128px → 16   (6xl)
```

### Animation Library

**Durations:**
- Instant: 100ms
- Fast: 200ms
- Normal: 300ms
- Slow: 500ms
- Very Slow: 800ms

**Easings:**
- Default: `cubic-bezier(0.4, 0, 0.2, 1)` (ease-in-out)
- Bounce: `cubic-bezier(0.68, -0.55, 0.265, 1.55)`
- Sharp: `cubic-bezier(0.4, 0, 0.6, 1)`

**Common Animations:**

1. **Card Hover Lift:**
```css
transition: transform 300ms ease-in-out, box-shadow 300ms ease-in-out;
&:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 60px rgba(brand, 0.4);
}
```

2. **Glow Pulse (for "LIVE NOW" badges):**
```css
@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 0 20px rgba(red, 0.5); }
  50% { box-shadow: 0 0 40px rgba(red, 0.8); }
}
```

3. **Gradient Border Animation:**
```css
@keyframes gradient-rotate {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
background-size: 200% 200%;
animation: gradient-rotate 3s ease infinite;
```

4. **Skeleton Loading:**
```css
@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}
background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
background-size: 1000px 100%;
animation: shimmer 2s infinite;
```

---

## 📱 Responsive Behavior

### Breakpoints
```
Mobile:  < 768px
Tablet:  768px - 1023px
Desktop: 1024px - 1439px
Large:   ≥ 1440px
```

### Mobile Optimizations

**Hero Section:**
- Title: 36px (down from 72px)
- Search bar: Full width with 16px padding
- Wallet connect: Hamburger menu

**Filter Bar:**
- Becomes bottom sheet
- Trigger: Floating button (bottom-right)
- Shows active filter count

**Event Cards:**
- Single column (100% width)
- Reduced padding: 16px
- Image height: 200px (fixed)
- Font sizes scale down 10-15%
- Touch targets: Minimum 44x44px

**Card Footer:**
- Stack buttons vertically if space constrained
- Primary button: Full width
- Secondary actions: Horizontal row below

---

## 🔍 Search & Empty States

### Search Bar Design

**Appearance:**
- Width: 600px on desktop, 100% on mobile
- Height: 56px
- Border radius: 28px (pill shape)
- Background: `rgba(255, 255, 255, 0.08)` with blur
- Border: 1px gradient on focus
- Icon: Search icon (left, 20px from edge)
- Clear button: X icon (right, appears on input)

**Behavior:**
- Real-time filtering (debounced 300ms)
- Highlights matching text in results
- Shows recent searches (dropdown)
- Keyboard navigation support (arrow keys)

**Search Suggestions:**
```
┌────────────────────────────────┐
│ 🔍 stellar                     │
├────────────────────────────────┤
│ Recent Searches:               │
│ → Stellar hackathon            │
│ → DeFi conference              │
│                                │
│ Suggested:                     │
│ → Stellar Development          │
│ → Stellar Meridian 2026        │
└────────────────────────────────┘
```

### Empty States

**No Events Found:**
```
┌─────────────────────────────────┐
│                                 │
│         🔍                       │
│                                 │
│   No events match your filters  │
│                                 │
│   Try removing some filters or  │
│   check back later for new      │
│   events in this category       │
│                                 │
│   [Clear Filters] [Submit Event]│
│                                 │
└─────────────────────────────────┘
```

**No Upcoming Events:**
```
┌─────────────────────────────────┐
│                                 │
│         📅                       │
│                                 │
│   No upcoming events scheduled  │
│                                 │
│   Be the first to add one!      │
│                                 │
│   [Browse Past Events]          │
│   [Submit New Event]            │
│                                 │
└─────────────────────────────────┘
```

**Loading State:**
- Show 6-9 skeleton cards
- Shimmer animation
- No actual text (pure visual placeholders)

---

## 🎯 Alternative View: Calendar Mode

### Toggle Position
- Top right of filter bar
- Icons: Grid view 🔲 | Calendar view 📅
- Active state: Gradient background

### Calendar Layout

**Month View:**
```
┌──────────────────────────────────────────┐
│ ← February 2026 →                        │
├──────────────────────────────────────────┤
│ Mon  Tue  Wed  Thu  Fri  Sat  Sun       │
├──────────────────────────────────────────┤
│                       1    2    3    4   │
│  5    6    7    8    9   10   11         │
│ 12   13   14  [15] [16]  17   18         │  [X] = has events
│ 19   20   21   22   23   24   25         │
│ 26   27   28                             │
└──────────────────────────────────────────┘
```

**Date with Events:**
- Colored dot(s) below date number (one per event)
- Dot colors: Event category colors
- Max 3 dots shown, "+2 more" text if >3 events

**Click Date Behavior:**
- Expand inline to show mini event cards
- Mini card: Title, time, location, RSVP button
- Scrollable if multiple events

---

## 🎪 Event Detail Page (Modal/Slide-over)

### Trigger
- Click anywhere on event card
- Opens slide-over panel from right (desktop)
- Opens full-screen modal (mobile)

### Layout Structure

**Panel Width:** 680px (desktop) | 100vw (mobile)

**Sections (Top to Bottom):**

1. **Header with Image**
   - Full-width cover image
   - Height: 300px
   - Overlay gradient for text readability
   - Close button (X) top-right

2. **Event Meta Info**
   - Event title (32px, bold)
   - Organizer (avatar + name)
   - Date & time (large, prominent)
   - Location (with map preview if in-person)
   - Attendee count + avatars

3. **Primary Action Section**
   - Large RSVP/Register button
   - Price if paid (with currency)
   - Spots remaining (if limited)
   - Waitlist option if sold out

4. **Description (Rich Text)**
   - Full event description
   - Markdown support (bold, lists, links)
   - Expandable if very long (>500 words)

5. **Event Details Grid**
   - **Duration:** 3 hours
   - **Language:** English
   - **Track:** DeFi
   - **Level:** Beginner-friendly
   - **Tags:** #stellar, #soroban, #smartcontracts

6. **Agenda/Schedule** (if available)
   ```
   6:00 PM - Registration & Networking
   6:30 PM - Keynote: Future of Stellar
   7:15 PM - Workshop: Build Your First dApp
   8:30 PM - Q&A Session
   ```

7. **Speakers/Hosts** (if applicable)
   - Card per speaker
   - Photo, name, title, company
   - Short bio (2-3 lines)
   - Social links

8. **Requirements** (if any)
   - "Laptop required"
   - "Install Stellar CLI beforehand"
   - "Beginner-friendly, no prior experience needed"

9. **Community Section**
   - Discussion thread (optional)
   - Questions for organizers
   - Related events

10. **Action Footer (Sticky on mobile)**
    - RSVP button (always visible)
    - Share button
    - Add to calendar
    - Report issue

---

## 📊 Additional Sections

### "Featured Events" Banner

**Position:** Below filter bar, above grid

**Design:**
- Horizontal scrollable carousel
- 3 featured events visible at once (desktop)
- 1 featured event (mobile)
- Slightly larger cards with "⭐ Featured" badge
- Auto-scroll every 5 seconds (pausable on hover)

**Selection Criteria:**
- Manually curated by admin
- OR largest events by attendee count
- OR events happening within 24-48 hours

---

### "Past Events" Section

**Trigger:** Toggle or separate tab

**Design Differences:**
- Reduced opacity (60%)
- Cards show "Ended" badge
- No RSVP button
- New action: "View Recap" or "Watch Recording"
- Optional: Attendee testimonials/highlights

**Layout:**
- Same grid structure
- Separated by time (This Week | Last Month | Earlier)

---

### "Submit Event" Flow

**Entry Points:**
- Hero CTA button
- Filter bar right side
- Empty state prompts
- Footer link

**Form Design (Multi-step):**

**Step 1: Basic Info**
- Event name
- Event type (dropdown)
- Date & time (with timezone selector)
- Duration

**Step 2: Location**
- Virtual (with meeting link)
- In-person (address, with autocomplete)
- Hybrid (both)

**Step 3: Details**
- Description (rich text editor)
- Cover image upload (drag & drop)
- Track/Category
- Tags (autocomplete)

**Step 4: Registration**
- Free or Paid
- Ticket price (if paid)
- Capacity limit (optional)
- Registration deadline

**Step 5: Additional**
- Agenda/Schedule builder
- Speaker information
- Requirements
- Social links

**Success State:**
- Confirmation message
- "Event pending review" (if moderation enabled)
- OR "Event published!" with link to view

---

## ⚡ Performance Optimizations

### Image Handling
- **Lazy loading:** All images below fold
- **Format:** WebP with JPEG fallback
- **Sizes:** Generate 3 sizes (400w, 800w, 1200w)
- **Placeholder:** Low-quality blur-up technique
- **Max file size:** 200KB per image

### Data Loading Strategy

**Initial Load:**
- Fetch first 18 events (2 rows on desktop)
- Load with skeleton screens

**Infinite Scroll:**
- Load next 18 events when user is 500px from bottom
- Show loading spinner at bottom
- Stop loading when all events fetched

**Caching:**
- Cache filter results for 5 minutes
- Cache event details for 10 minutes
- Cache images indefinitely (with versioning)

### Code Splitting
- Separate bundles for:
  - Main event grid
  - Calendar view
  - Event detail modal
  - Submit event form

---

## ♿ Accessibility Requirements

### Keyboard Navigation
- **Tab order:** Logo → Search → Filters → Event cards → Footer
- **Arrow keys:** Navigate between cards in grid
- **Enter:** Open event details
- **Escape:** Close modals/panels
- **Slash (/):** Focus search bar

### Screen Readers
- Semantic HTML: `<main>`, `<article>`, `<nav>`, `<aside>`
- ARIA labels on all interactive elements
- Alt text on all images (descriptive, not decorative)
- Skip links: "Skip to events" at top
- Live regions for dynamic content (search results, filter updates)

### Visual Accessibility
- Minimum contrast ratio: 4.5:1 for text
- Focus indicators: 3px solid outline with 2px offset
- No color-only information (use icons + text)
- Text resize support up to 200% without breaking layout
- Dark mode optimized (already default)

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 🧩 Web3-Specific Features (Optional Enhancements)

### 1. Wallet-Connected Personalization

**When Wallet Connected:**
- "Your Events" tab (auto-RSVP'd via wallet)
- Personalized recommendations based on wallet activity
- Token-gated events (holders-only access)
- Proof of attendance NFT minting for attended events

**UI Changes:**
- Wallet address in top-right (truncated: 0x7a4f...b29c)
- "Disconnect" option
- Badge for token holders: "🔷 Eligible for Token Holder Events"

### 2. On-Chain RSVP (if implemented)

**Benefits:**
- Permanent attendance record
- Transparent attendee list
- Potential token incentives
- Proof of participation

**UX Flow:**
- RSVP button → Sign transaction
- Loading: "Confirming on Stellar..."
- Success: "RSVP confirmed! Transaction: [hash link]"
- Show transaction hash (with explorer link)

**Card Display:**
- "12 on-chain RSVPs" badge
- Blockchain explorer link

### 3. Token-Gated Events

**Visual Indicator:**
- Lock icon 🔒 on card
- Badge: "Requires 100 XLM"
- Hover tooltip: "Connect wallet to check eligibility"

**When Wallet Connected:**
- Automatically check balance
- If eligible: Unlock event, show "✅ You're eligible!"
- If not: Show requirement clearly, CTA to acquire tokens

### 4. Community Reputation

**Display:**
- Event organizer reputation score (⭐ 4.8/5)
- "Hosted 12 events | 500+ attendees"
- Verified organizer checkmark

**Source:** On-chain event history + attendee feedback

---

## 🎭 Micro-interactions & Delight

### Hover Effects
- **Card:** Lift, glow, border animation
- **Buttons:** Scale up, color shift
- **Badges:** Subtle pulse on status badges
- **Images:** Slight zoom on hover (1.05x scale)

### Click Feedback
- **RSVP Button:** Ripple effect from click point
- **Filter Pills:** Pop-in animation
- **Share Button:** Confetti burst (subtle)

### Loading States
- **Search:** Typing indicator (3 dots pulse)
- **Filters:** Smooth fade in/out
- **Cards:** Stagger animation (each card 50ms delay)

### Success Animations
- **RSVP Confirmed:** Checkmark with scale + fade-in
- **Event Saved:** Bookmark fills with gradient
- **Event Shared:** Share icon bounce + "Copied!" tooltip

### Background Ambiance
- **Floating Particles:** Slow-moving geometric shapes (triangles, circles)
- **Mesh Gradient:** Gentle color shift over time
- **Cursor Trail:** Optional subtle glow following cursor (disable on mobile)

# Frontend: Public Profile & Users Directory — Implementation Plan

**Created**: February 7, 2026  
**Module**: User Profiles Frontend  
**Routes**: `/profile/:username`, `/users`

---

## Overview

Implement two public-facing pages in the frontend application:
1. **Individual Public Profile Page** — Display comprehensive user profile information
2. **Users Directory Page** — Browse and search all platform users

Both pages follow the existing design system with hex colors (`#1A1A1A`, `#4D4D4D`, `#E5E5E5`, `#F5F5F5`, `#FCFCFC`) established in hackathon/events pages.

---

## Available User Data

Based on backend schema analysis, the following data can be displayed:

### User Entity (core)
- `uuid` — Unique identifier
- `name` — Display name
- `avatar` — User avatar URL
- `role` — User role (USER, ORGANIZER, ADMIN)
- `createdAt` — Join date

### Profile Entity (detailed)
- `firstName`, `lastName` — Full name components
- `gender` — Gender identity
- `city`, `country` — Location
- `website` — Personal website URL
- `profilePictureUrl` — Profile picture
- `bio` — User biography/description
- `stellarAddress` — Primary Stellar address
- `socialLinks` — Twitter, LinkedIn, GitHub handles

### Experience Entity (professional)
- `roles` — Professional roles (array)
- `yearsOfExperience` — Total years (0-60)
- `web3SkillLevel` — BEGINNER | INTERMEDIATE | ADVANCED | EXPERT
- `programmingLanguages` — Languages known (array)
- `developerTools` — Tools/frameworks (array)

### Activity Data (future aggregations)
- Hackathons participated
- Projects submitted
- Organizations managed
- Teams joined
- Contributions made

---

## 1. Individual Public Profile Page

### Route & Parameters
- **Path**: `/profile/:username` or `/profile/:uuid`
- **Identifier**: Auto-detect username vs UUID format
- **Authentication**: Public (no auth required)

### Page Structure

#### A. Header Section
**Hero Banner**
- Gradient background (similar to hackathon cards)
- Deterministic color based on username hash
- Responsive height: 200px (mobile) → 280px (desktop)

**Profile Card Overlay**
- Positioned at bottom of hero, extending below
- Profile picture (circular, 120px, centered on mobile, left-aligned on desktop)
- Default avatar if not set
- Name (h1, `text-[#1A1A1A]`)
- Username badge (@username, `text-[#4D4D4D]`)
- Location chip (city, country with map pin icon)
- Join date ("Member since Month YYYY")

**Action Buttons** (top-right)
- "Share Profile" (copy link, social share)
- "Report" (abuse reporting, future)

#### B. Main Content Layout

**Grid Structure**: 8/4 columns (desktop), stacked (mobile)

**Left Column (col-span-8)**

1. **About Section**
   - Bio text (markdown-rendered, max 500 chars visible, "Show more" if longer)
   - Empty state: "This user hasn't written a bio yet"

2. **Social Links Bar**
   - Horizontal icon buttons for GitHub, Twitter, LinkedIn, Website
   - Only show if user has added link
   - Open in new tab
   - Styled as rounded-xl cards with hover effect

3. **Skills & Experience Card**
   - "Professional Experience" section title
   - Roles (pill badges, wrapped)
   - Years of Experience (progress bar visual)
   - Web3 Skill Level (badge with color coding)
   - Programming Languages (grid of pill badges)
   - Developer Tools (grid of pill badges)
   - Empty state if no experience data: "No experience added yet"

4. **Activity Stats Card** (future phase)
   - Grid of stat cards: Hackathons, Projects, Organizations
   - Each stat card: number + label + icon
   - Link to filtered views

5. **Recent Activity Timeline** (future phase)
   - Latest hackathons joined
   - Recent projects submitted
   - Organizations created/joined
   - Chronological feed with timestamps

**Right Column (col-span-4)**

1. **Stellar Wallet Card**
   - Contact & Links Card**
   - Website URL (with external link icon)
   - Social profiles (GitHub, Twitter, LinkedIn with icons and links)

2. **Achievements Badge** (future)
   - Badges earned (e.g., "Soroban Builder", "Hackathon Winner")
   - Achievement icons
   - Completion status

3  - Peer endorsements for skills
   - Team testimonials

#### C. Tabs Navigation (below header)
**Tabs**:
- Overview (default, shows sections above)
- Activity (hackathons, projects timeline)
- Contributions (GitHub-style contribution graph)
- Achievements (badges, certificates)

**Tab Styling**:
- Active: `bg-[#1A1A1A] text-white` (rounded-full pill)
- Inactive: `text-[#4D4D4D] hover:bg-[#F5F5F5]`

### Data Fetching Strategy

**API Endpoint**: `GET /profiles/public/:identifier`

**Loading States**:
- Skeleton screens for each card section
- Shimmer effect on placeholders
- Progressive loading: header first, then sections

**Error States**:
- 404 Page: "User not found" with search bar
- 500 Page: "Error loading profile" with retry button
- Network errors: Toast notification with retry

**Caching**:
- Cache profile data in React Query (5 minutes)
- Invalidate cache on profile update (if authenticated user)
- Background refetch on tab focus

### Responsive Behavior

**Mobile (<768px)**:
- Stack all sections vertically
- Full-width cards with 16px padding
- Profile picture centered in header
- Collapsed social links (icon grid)
- Hidden empty states (compact view)

**Tablet (768px-1024px)**:
- 6/6 column split
- Side-by-side action buttons
- Compact stat cards (2-column grid)

**Desktop (>1024px)**:
- 8/4 column layout as designed
- Fixed sidebar (right column sticky)
- Expanded all content sections

### Empty States & Fallbacks

**Profile Picture**:
- Default avatar with user initials
- Gradient background matching profile theme

**Bio**:
- Placeholder: "This member hasn't added a bio yet"
- Faded text style

**Experience**:
- Empty card with illustration
- CTA: "Complete your profile to showcase your skills"

**Wallets**:
- "No Stellar wallet connected"
- Info: Why connect wallet (verification, participation)

---

## 2. Users Directory Page

### Route
- **Path**: `/users`
- **Authentication**: Public (no auth required)
Social Links**:
- Empty state: "No social links added"
- Placeholder icons in muted state
#### A. Header Section
**Title Bar**
- Page title: "Community Builders"
- Subtitle: "Discover developers and creators in the Stellar ecosystem"
- User count badge: "X+ members" (dynamic)

#### B. Search & Filter Bar

**Search Input**
- Full-width search bar (sticky on scroll)
- Placeholder: "Search by name or username..."
- Real-time search with 300ms debounce
- Clear button (X icon)
- Search icon (left side)

**Filter Chips** (horizontal scrollable)
- "All Users" (default)
- "Organizers"
- "Builders"
- "Newcomers" (joined <30 days ago)
- "Verified" (Stellar wallet verified)
- Clear all filters button

**Sort Dropdown**
- Label: "Sort by"
- Options:
  - "Newest Members" (default)
  - "Most Active"
  - "Experience Level"
  - "Alphabetical"
- Dropdown icon, opens menu overlay
## C. Users Grid

**Layout**:
- 3 columns (desktop)
- 2 columns (tablet)
- 1 column (mobile)
- Gap: 24px
- Each card is clickable → navigates to profile page

**User Card Component**:

Structure (per card):
1. **Header**
   - Profile picture (80px circle)
   - Verification badge overlay (if verified)
   - Role badge (top-right corner): "Organizer" / "Builder"

2. **Body**
   - Name (h3, `text-[#1A1A1A]`, truncated 1 line)
   - Username (@username, `text-[#4D4D4D]`, small)
   - Location (city, country with icon, `text-[#999]`, small)
   - Bio preview (2 lines max, ellipsis, `text-[#4D4D4D]`)

3. **Footer**
   - Social links (icon buttons, compact)
   - "View Profile" link (appears on hover)

**Card Styling**:
- `rounded-xl border border-[#E5E5E5] bg-white p-6`
- Hover: `shadow-md border-[#E5E5E5] scale-[1.02]`
- Transition: `all 200ms ease`

#### D. Pagination

**Style**: Number-based pagination at bottom
- "Previous" / "Next" buttons
- Page numbers (show 5 at a time: 1 ... 4 5 [6] 7 8 ... 20)
- Current page: `bg-[#1A1A1A] text-white`
- Other pages: `text-[#4D4D4D] hover:bg-[#F5F5F5]`
- Disabled state: `text-[#999] opacity-50`

**Pagination Info**:
- Text above grid: "Showing 1-20 of 156 members"
- Responsive: hide on mobile, show on desktop

**Items Per Page**:
- Default: 20 users per page
- Dropdown (top-right): 20 / 50 / 100 options

### Data Fetching Strategy

**API Endpoint**: `GET /users/list`

**Query Parameters**:
- `page` (default: 1)
- `limit` (default: 20)
- `search` (optional, string)
- `role` (optional, filter)
- `sortBy` (default: "joinedAt")
- `sortOrder` (default: "desc")

**State Management**:
- Use URL query params for all filters (shareable links)
- Update URL on filter/search/page change
- Sync React Query with URL state
- Browser back/forward navigation support

**Loading States**:
- Initial load: Skeleton grid (20 skeleton cards)
- Pagination: Fade out old cards, fade in new
- Search: Debounced spinner in search bar
- Filter change: Instant skeleton grid

**Error States**:
- Empty results: "No users found matching your filters"
  - Illustration + "Clear filters" button
- API error: Toast notification with retry
- Network error: Retry banner at top

**Caching**:
- Cache each page result in React Query (5 minutes)
- Invalidate on user profile update (global event)
- Prefetch next page on pagination hover

### Search Implementation

**Client-Side**:
- Search in memory if <100 results loaded
- Filter by name, username, bio fields
- Highlight matching text in results

**Server-Side**:
- API search for full dataset
- Backend handles fuzzy matching
- Returns relevance-sorted results

**Search UX**:
- Show "Searching..." indicator
- Clear previous results during search
- Show result count: "Found X users"
- Preserve filters during search

### Filter Implementation

**Role Filter**:
- Multi-select (can combine filters)
- Checkboxes in dropdown menu
- Active filters shown as pills
- Clear individual filter (× on pill)

**Verified Filter**:
- Toggle switch in filter bar
- Shows only users with verified Stellar wallets

**Date Filter** (future):
- "Joined in last 7 days / 30 days / 90 days"
- Date range picker

### Responsive Behavior

**Mobile (<768px)**:
- Single column grid
- 
**Tablet (768px-1024px)**:
- 2-column grid
- Side-by-side search and sort
- Wrap filter chips if needed

**Desktop (>1024px)**:
- 3-column grid (4-column for large screens >1440px)
- All controls in one row
- Full pagination with numbers

---

## Design System Consistency

### Colors (from events/hackathon pages)
- Background: `#FCFCFC`
- Card background: `white`
- Primary text: `#1A1A1A`
- Secondary text: `#4D4D4D`
- Muted text/icons: `#999`
- Borders: `#E5E5E5`
- Hover backgrounds: `#F5F5F5`
- Active buttons: `bg-[#1A1A1A] text-white`

### Typography
- Font family: `var(--font-onest)`
- Page title: `text-4xl font-bold tracking-tight`
- Section title: `text-xl font-semibold tracking-tight`
- Card title: `text-lg font-semibold`
- Body text: `text-base`
- Metadata: `text-sm`

### Components to Create
- `ProfileHeader` — Hero with profile card
- `ProfileAbout` — Bio section
- `ProfileExperience` — Skills card
- `ProfileSocial` — Social links bar
- `ProfileWallet` — Wallet information card
- `UserCard` — Grid item for directory
- `SearchBar` — With debounce
- `FilterBar` — Chips and dropdowns
- `Pagination` — Number-based navigation
- `SkillBadge` — Reusable pill badge
- `EmptyState` — Illustrations for no data

### Shared Patterns
- All cards: `rounded-xl border border-[#E5E5E5] bg-white p-6`
- All buttons: `rounded-full` with appropriate colors
- All inputs: `rounded-full h-[46px] border border-[#E5E5E5]`
- Aover states: `transition-all duration-200`

---

## Folder Structure

```
app/src/
├── profiles/                         # NEW module
│   ├── layout.tsx                    # Layout wrapper
│   ├── page.tsx                      # Users directory (list)
│   ├── [username]/
│   │   └── page.tsx                  # Individual profile
│   ├── components/
│   │   ├── ProfileHeader.tsx
│   │   ├── ProfileAbout.tsx
│   │   ├── ProfileExperience.tsx
│   │   ├── ProfileSocial.tsx
│   │   ├── ProfileWallet.tsx
│   │   ├── ProfileTabs.tsx
│   │   ├── UserCard.tsx
│   │   ├── SearchBar.tsx
│   │   ├── FilterBar.tsx
│   │   ├── Pagination.tsx
│   │   └── EmptyState.tsx
│   ├── types/
│   │   └── profile
│   │   └── api/
│   │       └── profileApi.ts         # API client
│   └── context.md                    # Documentation
```

---

## API Integration

### Profile API Client

**Methods**:
- `getPublicProfile(identifier: string)` → Returns full profile
- `getUsersList(params: UsersListParams)` → Returns paginated list
- `getProfileStats(uuid: string)` → Returns activity statistics (future)

**Error Handling**:
- Wrap all requests in try-catch
- Show user-friendly error messages
- Retry logic for network failures
- Log errors to monitoring service

**Type Definitions**:
- Match backend DTOs exactly
- Use TypeScript interfaces for all API responses
- Validate response data with Zod schemas

---

## State Management

### React Query Setup
- Query keys:
  - `['profile', identifier]` — Individual profile
  - `['users', params]` — Users list with filters
  - `['profile-stats', uuid]` — Activity stats
- Stale time: 5 minutes (profile), 2 minutes (list)
- Cache time: 10 minutes
- Retry: 3 attempts with exponential backoff

### URL State Management
- Use Next.js `useSearchParams` for filters
- Sync with React Query state
- Shareable URLs with all filters encoded
- Browser history navigation support

---

## SEO & Metadata

### Individual Profile Page
- Dynamic title: "{Name} (@{username}) | Platform Name"
- Description: First 160 chars of bio
- Open Graph image: Profile picture
- Canonical URL: `/profile/{username}`
- JSON-LD structured data (Person schema)

### Users Directory Page
- Title: "Community Builders | Platform Name"
- Description: "Discover developers and creators in the Stellar ecosystem"
- Open Graph image: Brand image
- Noindex paginated pages (page > 1)

---

## Performance Considerations

### Image Optimization
- Use Next.js `<Image>` component
- Lazy load profile pictures
- Responsive image sizes
- WebP format with fallback
- Blur placeholder while loading

### Code Splitting
- Lazy load tab content
- Dynamic imports for heavy components
- Route-based code splitting

### Data Optimization
- Request only needed fields from API
- Paginate large lists (20 items default)
- Implement virtual scrolling for 100+ items (future)
- Debounce search input (300ms)

### Caching Strategy
- HTTP cache headers from backend
- React Query caching (as above)
- Consider service worker for offline (future)

---

## Accessibility

### Keyboard Navigation
- Full keyboard support for search and filters
- Tab order: search → filters → sort → cards → pagination
- Focus indicators on all interactive elements
- Arrow keys for pagination navigation

### Screen Readers
- Semantic HTML (header, main, nav, article)
- ARIA labels on icon-only buttons
- ARIA live region for search results count
- Alt text on all images
- Skip to content link

### Color Contrast
- All text meets WCAG AA standards
- Focus indicators have 3:1 contrast
- Interactive elements clearly distinguishable

---

## Testing Plan

### Unit Tests
- Component rendering with various props
- Empty state handling
- Search debounce logic
- Filter state management

### Integration Tests
- API integration with React Query
- URL state synchronization
- Pagination navigation
- Search and filter combinations

### E2E Tests
- Complete user flow: directory → search → filter → view profile
- Mobile responsive behavior
- Error states and recovery
- Browser back/forward navigation

---

## Implementation Phases

### Phase 1: Core Structure (Week 1)
- Set up routes and folder structure
- Create base layout components
- Implement API client
- Build TypeScript types

### Phase 2: Profile Page (Week 1-2)
- Profile header component
- About and social sections
- Experience card
- Wallet information
- Responsive design
- Loading and error states

### Phase 3: Users Directory (Week 2)
- Users grid layout
- User card component
- Search functionality
- Basic filtering
- Pagination

### Phase 4: Advanced Features (Week 3)
- Filter combinations
- Sort options
- Tab navigation (profile page)
- Profile stats integration
- Social sharing

### Phase 5: Polish & Testing (Week 3-4)
- Performance optimization
- Accessibility audit
- Cross-browser testing
- Mobile refinement
- SEO implementation
- Unit and E2E tests

---

## Future Enhancements

### User Profiles
- Activity timeline and contribution graph
- Achievement badges and verification system
- Skill endorsements from peers
- Direct messaging between users
- Profile privacy settings
- Custom profile themes

### Directory
- Advanced search with filters (skills, location, experience)
- Saved searches and alerts
- Export user list (CSV)
- Featured profiles section
- Follow/connection system
- User recommendations

### Integration
- GitHub integration system
- Skill endorsements from peers
- Direct messaging between user
- Organization member management

---

## Dependencies

### New Packages (if not already installed)
- `react-query` or `@tanstack/react-query` — Data fetching
- `react-intersection-observer` — Lazy loading
- `date-fns` — Date formatting
- `clsx` or `classnames` — Conditional classes
- `lucide-react` — Icons (already used)
- `zod` — Schema validation
# Existing Dependencies
- Next.js (routing, image optimization)
- TypeScript
- Tailwind CSS (styling)

---

## Open Questions

1. Should usernames be unique and human-readable, or should we use UUIDs in URLs?
2. Do we need profile analytics (view counts, profile completeness score)?
3. Should profiles be indexed by search engines, or require robots.txt rules?
4. Do we want user-to-user messaging features?
5. Should there be profile privacy levels (public, members only, private)?
6. Do we need profile verification badges (beyond Stellar wallet verification)?
7. Should we implement infinite scroll or pagination for users list?
8. Do we want featured/recommended users section on directory page?
 in the future?
5. Should we implement infinite scroll or pagination for users list?
6
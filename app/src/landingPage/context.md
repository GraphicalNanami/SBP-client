# Stellar Global Landing Page Context

This section of the platform is dedicated to the Stellar Global ecosystem hub, focusing on hackathons, events, and builder resources.

## Identity
- **Name:** Stellar Global
- **Tagline:** Building the future of Stellar.
- **Mission:** Discover hackathons, connect with top builders, and scale the next generation of Stellar projects.

## Audience
1. **Hackers:** Building projects and participating in ecosystem events.
2. **Organizers:** Managing hackathons and community events.
3. **Partners:** Supporting growth through sponsorship and integration.

## Ecosystem Data
- **Technologies:** Soroban (Smart Contracts), XLM (Asset), Stellar Network.
- **Key Metrics:** Project completion, Track progress, Prize deployment.

## Key Components

### UI Components (components/landingPageUI/)
- **Hero.tsx** - Main hero section with gradient background and CTA
- **Navbar.tsx** - Navigation bar with responsive menu
- **Footer.tsx** - Footer with links and social media
- **featuredSection.tsx** - Featured hackathons/events display
- **logoCarousel.tsx** - Animated logo carousel of partners
- **plansSection.tsx** - Pricing/membership plans
- **Posts.tsx** - Community posts from Twitter/Reddit (API-driven)

### Service Components (components/postsService/)
- **posts-api.ts** - API client for backend event-indexer endpoints
- **usePosts.ts** - Custom React hooks for posts and stats data fetching

### Posts UI Components (components/postsUI/)
- **PostCard.tsx** - Individual post card with platform icon, author, content, topics, engagement metrics
- **PostsColumn.tsx** - Animated scrolling column for posts display

### Types (types/)
- **posts.types.ts** - TypeScript interfaces for backend API responses

## Backend API Integration

### Endpoints
All endpoints use base URL from `process.env.NEXT_PUBLIC_API_BASE_URL`

1. **GET /api/events-indexer/stats?hours={number}**
   - Returns community activity statistics
   - Response: `{ total_posts, by_platform: {twitter, reddit}, top_topics: [{name, count}], recent_activity }`
   - Default: 72 hours

2. **GET /api/events-indexer/posts/recent**
   - Returns recent community posts from Twitter and Reddit
   - Response: `{ posts: Post[] }`
   - Post includes: id, platform, content, author, url, created_at, engagement, topics

3. **POST /api/events-indexer/topics/:topic/match**
   - Matches content against specific topic
   - Response: `{ matched: boolean, confidence: number, topics: string[] }`

### Data Flow
1. Posts component uses `usePosts()` and `useStats(72)` hooks
2. Hooks call API functions from `posts-api.ts`
3. API functions fetch from backend with error handling
4. Data flows to UI components (PostCard, PostsColumn)
5. Loading/error/empty states handled in Posts component

## State Management
- **Posts Data**: Custom hook `usePosts()` with useState/useEffect
- **Stats Data**: Custom hook `useStats(hours)` with useState/useEffect
- No global state needed - data fetched and managed locally in Posts component

## Styling Conventions
- Color Palette: #FCFCFC (background), #1A1A1A (text), #4D4D4D (secondary), #E6FF80 (accent/lime)
- Typography: Responsive font sizes with Tailwind (text-xl → text-5xl)
- Spacing: rem-based (space-4, space-6, space-8)
- Cards: rounded-2xl with border hover effects
- Animation: framer-motion for scroll animations and view transitions

## Recent Changes (2026-02-06)
- ✅ Integrated backend events-indexer API for community posts
- ✅ Created posts.types.ts with API response interfaces
- ✅ Created posts-api.ts service layer for API calls
- ✅ Created usePosts.ts custom hooks for data management
- ✅ Created PostCard.tsx for individual post display
- ✅ Created PostsColumn.tsx for animated scrolling layout
- ✅ Updated Posts.tsx from dummy data to real API integration
- ✅ Added stats display (total posts, platform breakdown, top topics)
- ✅ Implemented loading/error/empty states
- ✅ Used 3-column responsive grid with scroll animations

## Future Enhancements
- Add infinite scroll for posts loading
- Implement real-time updates via WebSocket
- Add post filtering by platform or topic
- Include search functionality for posts
- Add user interaction (like, share) if authenticated

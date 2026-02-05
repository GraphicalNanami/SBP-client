# Architecture Overview

## Design Principles

- **Feature-First Organization**: Code is grouped by business features, not technical layers
- **Co-location**: Feature documentation lives alongside feature code
- **Type Safety**: Strict TypeScript throughout the entire codebase
- **Server Components First**: Leverage Next.js App Router and React Server Components by default
- **Progressive Enhancement**: Start with server-rendered HTML, enhance with client-side interactivity
- **Separation of Concerns**: Clear boundaries between UI, business logic, and data access

## Technology Stack

### Core Framework
- **Next.js 15+** with App Router
- **React 19+** with Server Components
- **TypeScript 5+** for type safety

### Styling
- **Tailwind CSS v4** for utility-first styling
- **CSS Modules** for component-specific styles (when needed)
- **Radix UI** for accessible, unstyled components

### State Management
- **Server State**: React Server Components (default)
- **URL State**: Next.js searchParams and route params
- **Client State**: React hooks (useState, useReducer)
- **Global Client State**: React Context (minimal usage)

### Data Fetching
- **Server Components**: Native fetch with Next.js caching
- **Server Actions**: For mutations and form handling
- **Client-side**: React Query (only when necessary)

### Blockchain Integration
- **Stellar SDK** for blockchain interactions
- **Freighter/Albedo** for wallet connectivity
- **Soroban** for smart contract interactions

## Application Layers

### 1. Presentation Layer
React components organized by feature, following these patterns:

```typescript
// Server Component (default)
export default async function EventsPage() {
  const events = await fetchEvents()
  return <EventsList events={events} />
}

// Client Component (when interactivity needed)
'use client'
export function EventFilters({ onFilterChange }) {
  const [filters, setFilters] = useState({})
  // ... interactive logic
}
```

### 2. Business Logic Layer
Services and hooks that encapsulate business rules:

```typescript
// services/eventService.ts
export async function fetchEvents(filters?: EventFilters) {
  // API calls, data transformation, error handling
}

// hooks/useEventFilters.ts
export function useEventFilters() {
  // Client-side filter state management
}
```

### 3. Data Access Layer
API routes and server actions for data operations:

```typescript
// app/api/events/route.ts
export async function GET(request: Request) {
  // Database queries, external API calls
}

// actions/eventActions.ts
'use server'
export async function createEvent(formData: FormData) {
  // Server-side mutations
}
```

## File Organization

### Global Structure
```
├── app/                    # Next.js App Router pages
│   ├── (routes)/          # Route groups
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── src/
│   ├── features/          # Feature modules (see below)
│   ├── shared/            # Shared utilities and components
│   │   ├── components/    # Reusable UI components
│   │   ├── hooks/         # Reusable React hooks
│   │   ├── utils/         # Utility functions
│   │   ├── types/         # Shared TypeScript types
│   │   └── constants/     # App-wide constants
│   └── lib/               # Third-party library configurations
├── docs/                  # Common architecture documentation
└── public/                # Static assets
```

### Feature Module Structure
Each feature follows this consistent pattern:

```
feature-name/
├── components/            # Feature-specific components
│   ├── FeatureCard.tsx
│   ├── FeatureList.tsx
│   └── FeatureFilters.tsx
├── hooks/                 # Feature-specific hooks
│   └── useFeatureData.ts
├── services/              # API calls and business logic
│   └── featureService.ts
├── actions/               # Server actions
│   └── featureActions.ts
├── types/                 # Feature-specific types
│   └── feature.types.ts
├── utils/                 # Feature-specific utilities
│   └── featureHelpers.ts
└── docs/
    └── context.md         # Feature documentation
```

## Naming Conventions

### Files & Folders
- **Components**: PascalCase (e.g., `EventCard.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useEventData.ts`)
- **Services**: camelCase with `Service` suffix (e.g., `eventService.ts`)
- **Actions**: camelCase with `Actions` suffix (e.g., `eventActions.ts`)
- **Utils**: camelCase (e.g., `formatDate.ts`)
- **Types**: camelCase with `.types.ts` suffix (e.g., `event.types.ts`)
- **Folders**: kebab-case (e.g., `user-profile/`)

### Code Entities
- **Interfaces/Types**: PascalCase (e.g., `Event`, `EventProps`)
- **Functions**: camelCase (e.g., `fetchEvents`, `formatEventDate`)
- **Constants**: SCREAMING_SNAKE_CASE (e.g., `MAX_EVENTS_PER_PAGE`)
- **React Components**: PascalCase (e.g., `EventCard`, `EventList`)

## Component Patterns

### Server Components (Default)
Use for data fetching and static content:

```typescript
// No 'use client' directive
export default async function EventsPage({ 
  searchParams 
}: { 
  searchParams: { category?: string } 
}) {
  const events = await fetchEvents(searchParams)
  return <EventsList events={events} />
}
```

### Client Components
Use sparingly, only when needed for:
- User interactions (onClick, onChange)
- Browser APIs (localStorage, geolocation)
- React hooks (useState, useEffect)
- Third-party libraries requiring browser context

```typescript
'use client'

import { useState } from 'react'

export function EventFilters({ onFilterChange }: Props) {
  const [selectedCategory, setSelectedCategory] = useState('')
  
  return (
    <select onChange={(e) => {
      setSelectedCategory(e.target.value)
      onFilterChange({ category: e.target.value })
    }}>
      {/* options */}
    </select>
  )
}
```

### Composition Pattern
Break down complex components into smaller, focused units:

```typescript
// ✅ Good: Composed
export function EventCard({ event }: { event: Event }) {
  return (
    <Card>
      <EventHeader title={event.title} date={event.date} />
      <EventBody description={event.description} />
      <EventFooter location={event.location} />
    </Card>
  )
}

// ❌ Avoid: Monolithic
export function EventCard({ event }: { event: Event }) {
  return (
    <div>
      {/* 200+ lines of markup */}
    </div>
  )
}
```

## Data Flow Patterns

### 1. Server-Side Data Fetching (Preferred)
```typescript
// app/events/page.tsx
export default async function EventsPage() {
  const events = await fetchEvents() // Direct fetch in Server Component
  return <EventsList events={events} />
}
```

### 2. Server Actions for Mutations
```typescript
// actions/eventActions.ts
'use server'

export async function createEvent(formData: FormData) {
  const eventData = {
    title: formData.get('title'),
    // ... other fields
  }
  
  await db.events.create(eventData)
  revalidatePath('/events')
}

// components/CreateEventForm.tsx
'use client'

export function CreateEventForm() {
  return (
    <form action={createEvent}>
      <input name="title" />
      <button type="submit">Create</button>
    </form>
  )
}
```

### 3. Client-Side Fetching (When Necessary)
```typescript
'use client'

export function LiveEventUpdates({ eventId }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => fetchEvent(eventId),
    refetchInterval: 30000 // Poll every 30s
  })
  
  if (isLoading) return <Skeleton />
  return <EventDetails event={data} />
}
```

## Error Handling

### Server Component Errors
```typescript
// app/events/error.tsx
'use client'

export default function EventsError({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div>
      <h2>Failed to load events</h2>
      <button onClick={reset}>Try again</button>
    </div>
  )
}
```

### API Route Errors
```typescript
// app/api/events/route.ts
export async function GET() {
  try {
    const events = await fetchEventsFromDB()
    return Response.json(events)
  } catch (error) {
    console.error('Events API error:', error)
    return Response.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}
```

## TypeScript Patterns

### Strict Type Definitions
```typescript
// types/event.types.ts
export interface Event {
  id: string
  title: string
  description: string
  startDate: Date
  endDate: Date
  location: Location
  organizer: Organizer
  status: EventStatus
}

export type EventStatus = 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled'

export interface EventFilters {
  category?: string
  location?: string
  dateRange?: { start: Date; end: Date }
}
```

### Component Props
```typescript
// Explicit interface for props
interface EventCardProps {
  event: Event
  variant?: 'compact' | 'detailed'
  onSelect?: (event: Event) => void
  className?: string
}

export function EventCard({ 
  event, 
  variant = 'compact',
  onSelect,
  className 
}: EventCardProps) {
  // ...
}
```

## Performance Optimization

### 1. Server Component Optimization
- Keep server components as the default
- Fetch data close to where it's used
- Use parallel data fetching with Promise.all

### 2. Client Component Optimization
- Minimize client component usage
- Use dynamic imports for heavy components
- Implement proper React.memo for expensive renders

### 3. Caching Strategy
```typescript
// Next.js fetch with caching
const events = await fetch('https://api.example.com/events', {
  next: { revalidate: 3600 } // Cache for 1 hour
})

// Or mark route as static
export const revalidate = 3600
```

## Stellar Blockchain Integration

### Wallet Connection Pattern
```typescript
// lib/stellar/walletProvider.tsx
'use client'

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [wallet, setWallet] = useState<Wallet | null>(null)
  
  const connect = async () => {
    // Freighter connection logic
  }
  
  return (
    <WalletContext.Provider value={{ wallet, connect }}>
      {children}
    </WalletContext.Provider>
  )
}
```

### Transaction Pattern
```typescript
// services/stellarService.ts
export async function submitTransaction(
  operation: Operation,
  wallet: Wallet
) {
  const account = await server.loadAccount(wallet.publicKey)
  const transaction = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: Networks.PUBLIC
  })
    .addOperation(operation)
    .setTimeout(30)
    .build()
  
  const signedTx = await wallet.signTransaction(transaction)
  return await server.submitTransaction(signedTx)
}
```

## Testing Strategy

### Unit Tests
- Test pure functions and utilities
- Test React hooks in isolation
- Test component logic (not rendering)

### Integration Tests
- Test feature workflows end-to-end
- Test API routes with mocked dependencies
- Test Server Actions

### E2E Tests
- Test critical user journeys
- Test wallet connection flows
- Test event creation/registration flows

## Security Best Practices

1. **Never expose private keys** - Use environment variables
2. **Validate all inputs** - Server-side validation for all forms
3. **Sanitize user content** - Prevent XSS attacks
4. **Rate limiting** - Implement on API routes
5. **CORS configuration** - Restrict to known origins
6. **Wallet signatures** - Verify on server for critical operations

## Environment Configuration

```typescript
// .env.local (never commit)
NEXT_PUBLIC_STELLAR_NETWORK=TESTNET
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org
DATABASE_URL=postgresql://...
WALLET_CONNECT_PROJECT_ID=...

// lib/env.ts - Type-safe env variables
export const env = {
  stellarNetwork: process.env.NEXT_PUBLIC_STELLAR_NETWORK as 'TESTNET' | 'PUBLIC',
  horizonUrl: process.env.NEXT_PUBLIC_HORIZON_URL!,
  // ... other env vars with validation
}
```

## Code Quality Standards

### ESLint Rules
- Enforce TypeScript strict mode
- Require explicit return types for functions
- Enforce consistent naming conventions
- Prevent unused variables and imports

### Prettier Configuration
- 2 spaces for indentation
- Single quotes for strings
- Trailing commas
- Semicolons required

### Git Commit Conventions
Follow Conventional Commits:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `refactor:` - Code refactoring
- `test:` - Test additions/updates
- `chore:` - Build/tooling changes

## Documentation Requirements

### Code Documentation
- JSDoc comments for public functions and complex logic
- README.md in each feature folder (optional, use docs/context.md instead)
- Inline comments for non-obvious code

### Feature Documentation
Each feature must have a `docs/context.md` covering:
- Purpose and user stories
- Key components and their responsibilities
- Data flow and API endpoints
- Dependencies and edge cases
- Future enhancements

## Deployment & CI/CD

### Build Process
1. Type checking: `tsc --noEmit`
2. Linting: `eslint . --ext .ts,.tsx`
3. Tests: `npm run test`
4. Build: `npm run build`

### Deployment
- **Vercel** (recommended for Next.js)
- **Environment variables** configured per environment
- **Preview deployments** for all PRs
- **Production** deploys on main branch merge

---

**Last Updated**: February 2026
**Maintained By**: Stellar Global Team

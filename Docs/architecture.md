# Architecture Overview

## Design Principles

- **Feature-First Organization**: Code is grouped by business features, not technical layers
  - *Why*: Makes related code discoverable, enables teams to work on features independently without conflicts

- **Co-location**: Feature documentation lives alongside feature code
  - *Why*: Keeps context close to implementation, making maintenance faster and reducing outdated docs

- **Type Safety**: Strict TypeScript throughout the entire codebase
  - *Why*: Catches bugs at compile-time, provides autocomplete, makes refactoring safe and confident

- **Server Components First**: Leverage Next.js App Router and React Server Components by default
  - *Why*: Reduces client bundle size, improves performance, enables direct data fetching without API overhead

- **Progressive Enhancement**: Start with server-rendered HTML, enhance with client-side interactivity
  - *Why*: Ensures core functionality works without JavaScript, improves SEO and perceived performance

- **Separation of Concerns**: Clear boundaries between UI, business logic, and data access
  - *Why*: Makes code testable, reusable, and maintainable; prevents mixing presentation with business rules

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
- **Client State**: React hooks (useState, useReducer) for local component state
- **Global Client State**: Zustand for deep/complex global state management
- **Props Drilling**: Use normal props for 2-level value passing (avoid over-engineering)

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
├── app/                    # Next.js App Router pages & routes
│   ├── (routes)/          # Route groups for pages
│   ├── api/               # ⚠️ API ROUTES DEFINED HERE (Next.js API endpoints)
│   │   ├── events/        # Example: /api/events endpoints
│   │   └── hackathons/    # Example: /api/hackathons endpoints
|.  |.  |__ others.../
│   └── layout.tsx         # Root layout
├── src/
│   ├── features/          # Feature modules (see below)
│   ├── shared/            # Shared utilities and components
│   │   ├── components/    # Reusable UI components
│   │   │   ├── factories/ # Component factories (Button, Toast, Loader, Modal)
│   │   │   ├── ui/        # Base UI components
│   │   │   └── layout/    # Layout components
│   │   ├── hooks/         # Reusable React hooks
│   │   ├── utils/         # Utility functions
│   │   ├── types/         # Shared TypeScript types
│   │   ├── stores/        # Zustand store definitions
│   │   ├── constants/     # App-wide constants
│   │   │   └── errorCodes.ts  # ⚠️ API ERROR CODES MAPPING (all error definitions)
│   │   └── errors/        # Error handling utilities
│   │       ├── ApiError.ts     # Custom API error class
│   │       └── errorHandler.ts # Global error handler
│   └── lib/               # Third-party library configurations
│      
│       
├── docs/                  # Common architecture documentation
└── public/                # Static assets
```

### Feature Module Structure
Each feature follows this consistent pattern with **strict separation of concerns**:

```
feature-name/
├── components/
│   ├── featureUI/         # Pure UI components (presentation only)
│   │   ├── FeatureCard.tsx
│   │   ├── FeatureList.tsx
│   │   └── FeatureFilters.tsx
│   └── featureService/    # Business logic, hooks, API calls
│       ├── useFeatureData.ts
│       ├── useFeatureFilters.ts
│       ├── featureService.ts
│       └── featureHelpers.ts
|--page.tsx
|--layout.tsx
├── actions/               # Server actions
│   └── featureActions.ts
├── types/                 # Feature-specific types
│   └── feature.types.ts
├── stores/                # Zustand stores (if needed)
│   └── featureStore.ts
└── context.md             # ⚠️ SINGLE feature documentation file (NO docs/ folder)
```

**Key Principles:**
- **UI components** (`featureUI/`) are PURE presentation - no business logic, only UI rendering
- **Service components** (`featureService/`) handle all hooks, API calls, data fetching, and business logic
- UI components receive data via props from service layer
- Use Zustand stores for deep/global state that needs to be accessed across multiple components
- Use props for simple 2-level value passing
- **STRICT**: Only ONE `context.md` file per feature (directly in feature root, no `docs/` folder)

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

### Shared Component Factories
All common UI patterns are defined as factories in `src/shared/components/factories/`:

```typescript
// factories/Button.tsx - Configurable button factory
export const Button = ({ variant, size, children, ...props }) => {...}

// factories/Toast.tsx - Toast notification factory
export const useToast = () => {...}

// factories/Loader.tsx - Loading state factory
export const Loader = ({ size, variant }) => {...}

// factories/Modal.tsx - Modal dialog factory
export const Modal = ({ isOpen, onClose, children }) => {...}
```

**Always use these factories** instead of creating custom implementations.

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
// ✅ Good: Composed with UI/Service separation
// featureUI/EventCard.tsx (Pure UI)
export function EventCard({ event, onSelect }: { event: Event, onSelect: () => void }) {
  return (
    <Card>
      <EventHeader title={event.title} date={event.date} />
      <EventBody description={event.description} />
      <EventFooter location={event.location} />
      <Button onClick={onSelect}>Select</Button>
    </Card>
  )
}

// featureService/useEventCard.ts (Business logic)
export function useEventCard(eventId: string) {
  const { data: event, isLoading } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => fetchEvent(eventId)
  })
  
  const handleSelect = () => {
    // Business logic for selection
  }
  
  return { event, isLoading, handleSelect }
}

// ❌ Avoid: Monolithic with mixed concerns
export function EventCard({ event }: { event: Event }) {
  const [loading, setLoading] = useState(false) // ❌ Business logic in UI
  const handleClick = async () => { /* API call */ } // ❌ API call in UI
  return (
    <div>
      {/* 200+ lines of markup */}
    </div>
  )
}
```

### State Management with Zustand
Use Zustand for global/deep state that needs to be accessed across multiple components:

```typescript
// stores/eventStore.ts
import { create } from 'zustand'

interface EventStore {
  selectedEvent: Event | null
  filters: EventFilters
  setSelectedEvent: (event: Event | null) => void
  setFilters: (filters: EventFilters) => void
}

export const useEventStore = create<EventStore>((set) => ({
  selectedEvent: null,
  filters: {},
  setSelectedEvent: (event) => set({ selectedEvent: event }),
  setFilters: (filters) => set({ filters })
}))

// Usage in components
const { selectedEvent, setSelectedEvent } = useEventStore()
```

**When to use what:**
- **Zustand**: Deep state, cross-feature state, complex state that needs persistence
- **Props**: Simple 2-level parent-child data passing
- **useState**: Local component state that doesn't need to be shared

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
import { handleApiError, ApiError } from '@/src/shared/errors/errorHandler'
import { ErrorCode } from '@/src/shared/constants/errorCodes'

export async function GET() {
  try {
    const events = await fetchEventsFromDB()
    return Response.json(events)
  } catch (error) {
    return handleApiError(error, ErrorCode.EVENT_FETCH_FAILED)
  }
}
```

## API Error Handling System

### Error Codes Mapping
All API errors are centrally defined in `src/shared/constants/errorCodes.ts`:

```typescript
// src/shared/constants/errorCodes.ts
export enum ErrorCode {
  // Authentication Errors (1000-1099)
  AUTH_INVALID_CREDENTIALS = 'AUTH_1001',
  AUTH_TOKEN_EXPIRED = 'AUTH_1002',
  AUTH_WALLET_NOT_CONNECTED = 'AUTH_1003',
  
  // Event Errors (2000-2099)
  EVENT_NOT_FOUND = 'EVENT_2001',
  EVENT_FETCH_FAILED = 'EVENT_2002',
  EVENT_CREATE_FAILED = 'EVENT_2003',
  EVENT_ALREADY_REGISTERED = 'EVENT_2004',
  
  // Hackathon Errors (3000-3099)
  HACKATHON_NOT_FOUND = 'HACKATHON_3001',
  HACKATHON_SUBMISSION_CLOSED = 'HACKATHON_3002',
  
  // Stellar/Blockchain Errors (4000-4099)
  STELLAR_TRANSACTION_FAILED = 'STELLAR_4001',
  STELLAR_INSUFFICIENT_BALANCE = 'STELLAR_4002',
  STELLAR_NETWORK_ERROR = 'STELLAR_4003',
  
  // User Errors (5000-5099)
  USER_NOT_FOUND = 'USER_5001',
  USER_PROFILE_INCOMPLETE = 'USER_5002',
  
  // Validation Errors (6000-6099)
  VALIDATION_INVALID_INPUT = 'VALIDATION_6001',
  VALIDATION_MISSING_FIELD = 'VALIDATION_6002',
  
  // System Errors (9000-9099)
  INTERNAL_SERVER_ERROR = 'SYSTEM_9001',
  SERVICE_UNAVAILABLE = 'SYSTEM_9002',
}

export const ERROR_MESSAGES: Record<ErrorCode, { 
  userMessage: string
  logMessage: string
  httpStatus: number
  showToast: boolean
}> = {
  [ErrorCode.AUTH_INVALID_CREDENTIALS]: {
    userMessage: 'Invalid credentials. Please check your wallet signature.',
    logMessage: 'Authentication failed - invalid credentials',
    httpStatus: 401,
    showToast: true
  },
  [ErrorCode.EVENT_NOT_FOUND]: {
    userMessage: 'Event not found. It may have been removed.',
    logMessage: 'Event lookup failed - ID not in database',
    httpStatus: 404,
    showToast: true
  },
  [ErrorCode.STELLAR_TRANSACTION_FAILED]: {
    userMessage: 'Transaction failed. Please check your balance and try again.',
    logMessage: 'Stellar SDK transaction submission failed',
    httpStatus: 500,
    showToast: true
  },
  // ... all other error codes
}
```

### Custom Error Class
```typescript
// src/shared/errors/ApiError.ts
export class ApiError extends Error {
  constructor(
    public code: ErrorCode,
    public statusCode: number,
    public userMessage: string,
    public originalError?: unknown
  ) {
    super(userMessage)
    this.name = 'ApiError'
  }
}
```

### Global Error Handler
```typescript
// src/shared/errors/errorHandler.ts
import { ApiError } from './ApiError'
import { ErrorCode, ERROR_MESSAGES } from '../constants/errorCodes'

export function handleApiError(error: unknown, fallbackCode: ErrorCode) {
  if (error instanceof ApiError) {
    const config = ERROR_MESSAGES[error.code]
    console.error(`[${error.code}] ${config.logMessage}`, error.originalError)
    
    return Response.json(
      { 
        error: config.userMessage,
        code: error.code
      },
      { status: config.httpStatus }
    )
  }
  
  // Unknown error - use fallback
  const config = ERROR_MESSAGES[fallbackCode]
  console.error(`[${fallbackCode}] Unexpected error`, error)
  
  return Response.json(
    { 
      error: config.userMessage,
      code: fallbackCode
    },
    { status: config.httpStatus }
  )
}

export function throwApiError(code: ErrorCode, originalError?: unknown): never {
  const config = ERROR_MESSAGES[code]
  throw new ApiError(code, config.httpStatus, config.userMessage, originalError)
}
```

### Client-Side Error Display
```typescript
// src/shared/hooks/useApiError.ts
'use client'

import { useToast } from '@/src/shared/components/factories/Toast'
import { ErrorCode, ERROR_MESSAGES } from '../constants/errorCodes'

export function useApiError() {
  const { showToast } = useToast()
  
  const handleError = (error: { code: ErrorCode; error: string }) => {
    const config = ERROR_MESSAGES[error.code]
    
    if (config.showToast) {
      showToast({
        type: 'error',
        message: error.error,
        duration: 5000
      })
    }
    
    // Log to monitoring service if needed
    console.error(`[${error.code}]`, error.error)
  }
  
  return { handleError }
}
```

### Usage Example
```typescript
// Feature service using error handling
// src/features/events/components/featureService/eventService.ts
import { throwApiError } from '@/src/shared/errors/errorHandler'
import { ErrorCode } from '@/src/shared/constants/errorCodes'

export async function fetchEventById(id: string) {
  try {
    const response = await fetch(`/api/events/${id}`)
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.code)
    }
    
    return await response.json()
  } catch (error) {
    throwApiError(ErrorCode.EVENT_FETCH_FAILED, error)
  }
}

// Client component handling errors
'use client'
export function EventDetails({ eventId }: { eventId: string }) {
  const { handleError } = useApiError()
  
  const handleFetch = async () => {
    try {
      const event = await fetchEventById(eventId)
      // use event
    } catch (error: any) {
      handleError(error)
    }
  }
  
  // ... component logic
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
- Inline comments for non-obvious code
- NO README files in feature folders

### Feature Documentation
- Each feature has a `context.md` file in the feature root directory
- See `.github/copilot-instructions.md` for strict documentation rules

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

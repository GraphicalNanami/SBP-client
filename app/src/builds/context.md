# Builds Feature - Context

## Purpose

The Builds feature is a comprehensive platform for discovering, managing, and submitting Stellar/Soroban builds. It serves as both a portfolio system and discovery hub where users can:
- Browse and discover published builds from the Stellar ecosystem
- Filter and search builds by category, status, and keyword
- Submit detailed build information through a multi-tab dashboard
- Showcase their Stellar ecosystem contributions
- Connect builds to their team and social presence
- Manage builds with draft/published status workflow

## User Stories

1. **As a visitor**, I want to discover interesting builds in the Stellar ecosystem through browsing and search
2. **As an authenticated developer**, I want to submit my build through a comprehensive submission form
3. **As a builder**, I want to showcase my builds in an attractive grid layout with detailed cards
4. **As a user**, I want to filter builds by category, status, and use search to find specific builds
5. **As a visitor**, I want to understand what builds submission offers and be guided to sign in
6. **As a user**, I want the submission process to be intuitive with clear validation feedback
7. **As a builder**, I want to save drafts and publish when ready

## Key Components

### UI Components (@/src/builds/components/buildUI/)

#### `SubmitCTAButton.tsx`
- **Purpose**: Auth-aware CTA button for navigation to submission page (NO business logic)
- **Props**: `isAuthenticated`, `isLoading`
- **Behavior**:
  - Loading: Shows skeleton placeholder
  - Authenticated: "Submit Your Build" → `/builds/submit`
  - Not authenticated: "Sign in to Submit Your Build" → `/src/auth?redirect=/builds/submit`
- **Styling**: Responsive button with design system compliance

#### `BuildCard.tsx`
- **Purpose**: Displays build information in card format
- **Variants**:
  - **Featured**: Hero-style large card for top builds (aspect-video banner, overlay content)
  - **Regular**: Compact card for grid layout (square logo, stacked content)
- **Features**:
  - Responsive image handling with next/image optimization
  - Tech stack display with responsive chip layout
  - Status badges with visual indicators
  - Category and metadata display
  - Image proxy integration for external URLs
  - Hover effects with smooth transitions
- **Props**: `build` (BuildCardData), `featured` (optional boolean)

#### `page.tsx` (Builds Listing Page)
- **Purpose**: Main builds discovery and listing page with comprehensive filtering
- **Features**:
  - Hero section with wavy background text and discovery messaging
  - Search functionality with real-time filtering
  - Category, status, and sort filters with dropdown selectors
  - Responsive bento grid layout (1 featured + 2 secondary + regular grid)
  - Loading states, error handling, and empty states
  - Authenticated user access to "Submit Build" button
  - Results count and active filter indicators
- **API Integration**: Real-time data fetching from builds API with query parameters
- **State Management**: Local useState for search/filter state, API data, loading/error states

#### `buildsApi.ts`
- **Purpose**: Complete API service layer for build operations
- **Functions**:
  - `listPublicBuilds`: Fetch published builds with query parameters
  - `listUserBuilds`: Fetch authenticated user's builds  
  - `getBuildById`: Fetch single build details
  - `createBuild`, `updateBuild`: Build CRUD operations
  - `publishBuild`, `archiveBuild`: Status management
  - `addTeamMember`, `removeTeamMember`: Team management
  - `uploadBuildImage`: Image upload handling
- **Features**:
  - Type-safe API calls with request/response type annotations
  - Backend to frontend data transformation via `transformBuildToCard`
  - Error handling with descriptive error messages
  - Query parameter building for search/filter functionality
  - Automatic authentication header injection via apiClient

#### `ImageUpload.tsx`
- **Purpose**: Drag & drop image upload component for build logos (UI only)
- **Features**:
  - Drag and drop upload with visual feedback
  - File format validation (PNG, JPG, JPEG, WebP)
  - File size validation (5MB limit) 
  - Image preview with scaling
  - Base64 encoding for form integration
  - Error handling with user-friendly messages
- **Props**: `value`, `onChange`, `error`

#### `useBuildSubmission.ts`
- **Purpose**: State management hook with all business logic
- **State Management**:
  - `build`: Full BuildSubmission object
  - `activeTab`: Current tab navigation
  - `isSaving`, `saveSuccess`: UI feedback states
- **Actions**:
  - Update handlers: `updateDetails`, `updateLinks`, `updateTeam`, `updateStellar`
  - Array management: `addTechStack`, `removeTechStack`, `addSocialLink`, `removeSocialLink`
  - Save/Publish: `handleSave`, `handlePublish`
- **Validation**: `canPublish` - computed validation for all required fields
- **Required Fields**:
  - Name, tagline, description, category (non-empty)
  - At least one tech stack item
  - Valid contact email
  - At least one Stellar address (contract OR account)
  - Network type selection

#### `SubmissionDashboard.tsx`
- **Purpose**: Multi-tab submission form (orchestrates UI)
- **Structure**:
  - Sticky header with back link, build name, status, save/publish buttons
  - Tab navigation with 5 tabs and icons
  - Responsive 3-column layout (tabs, content, sidebar)
  - Shared UI primitives (Card, SectionTitle, Label, CSS classes)
- **Tabs**:
  1. **Details**: Name, logo, tagline, description, category, tech stack (with ChipInput)
  2. **Links**: GitHub, website, live demo, video, social links management
  3. **Description**: Extended textarea for comprehensive project description
  4. **Team**: Contact email, team description, team social links
  5. **Stellar**: Network selection (testnet/mainnet), contract address, Stellar address
- **Features**:
  - Real-time validation feedback
  - Tech stack chips with suggestions and removal
  - Social links management with platform selection
  - Publish checklist sidebar (desktop only, details tab)
  - Progress tracking with visual indicators

### Routes

#### `/builds/submit/page.tsx`
- **Purpose**: Submission entry route with auth guard
- **Auth Guard**: Redirects unauthenticated users to `/src/auth?redirect=/builds/submit`
- **Loading State**: Shows spinner while determining auth status
- **Integration**: Renders `SubmissionDashboard` with `useBuildSubmission` hook

### Types (@/src/builds/types/)

#### `build.types.ts`
- **BuildSubmission**: Main entity with nested interfaces for submission workflow
- **BuildCardData**: Display entity optimized for listing page cards
- **BuildDetails**: Name, logo, tagline, description, category, tech stack
- **BuildLinks**: GitHub, website, demo video, live demo, social links array
- **BuildTeam**: Description, team socials, contact email
- **BuildStellar**: Contract address, Stellar address, network type
- **Enums**: BuildStatus, BuildCategory, NetworkType, BuildDashboardTab

#### `backend.types.ts`
- **BackendBuild**: Complete build entity as returned by API
- **BackendTeamMember**: Team member with user association
- **Query Types**: ListBuildsQuery, CreateBuildPayload, UpdateBuildPayload
- **Response Types**: BuildsListResponse, BuildDetailResponse
- **Helper Types**: PaginationMeta, BuildFilters

## Data Flow

### Builds Discovery Flow
1. **Main Page Visit**: `/builds`
   - Page loads with hero section and search/filter interface
   - API call: `buildsApi.listPublicBuilds()` with initial parameters
   - Builds displayed in bento grid layout (featured + regular cards)
2. **Search & Filter**:
   - User types in search: Real-time filtering of displayed results
   - User changes category/status/sort: New API call with updated parameters
   - Results update with loading state and new filtered builds
3. **Build Interaction**:
   - Click build card: Navigate to build detail page (future enhancement)
   - View tech stack, category, and metadata in card format

### Build Submission Flow  
1. **Landing Page Visit**: `/builds`
   - If authenticated: See "Submit Your Build" button in filter section
   - If not authenticated: Button not displayed (browse-only experience)
2. **Authentication Check**:
   - Authenticated users: Direct navigation to `/builds/submit`
   - Unauthenticated users: Redirect to `/src/auth?redirect=/builds/submit`
3. **Submission Dashboard**: `/builds/submit`
   - Load with empty build state (Draft status)
   - Navigate through 5 tabs with persistent state
   - Real-time validation feedback on each field
   - Save Draft: Update build status to 'Draft', show success feedback
   - Publish: Validate all required fields, update to 'Published' status

### State Management Flow
- **API Data**: Managed via `useState` with loading/error states
- **Search/Filter State**: Local state for immediate UI feedback + debounced API calls
- **Auth Integration**: Consumes `useAuth` hook from auth context
- **Submission State**: Local `useState` in submission flow (no Zustand needed for current scope)
- **Validation**: Real-time validation with computed `canPublish` property
- **Persistence**: Full API integration with backend endpoints

## Dependencies

### Internal
- `@/src/auth/hooks/useAuth`: Authentication state (isAuthenticated, isLoading, user)
- `@/src/shared/components/ui/button`: Shared button component with variants
- `@/src/shared/components/factories/ChipInput`: Tech stack management
- `@/src/shared/components/ui/highlightText`: Hero section text highlights
- `@/src/shared/utils/imageProxy`: Image URL proxy utility for external images
- `@/src/shared/lib/apiClient`: Centralized API client with auth headers
- `@/src/shared/lib/endpoints`: API endpoint definitions
- Landing page components: `Navbar`, `Footer`

### External
- `lucide-react`: Icons for search, filters, tabs, UI elements, and interactive components
- `next/link`, `next/navigation`: Client-side routing and redirects
- `next/image`: Optimized image handling and responsive loading
- Built-in validation: Email format validation, required field checks

## Recent Changes

### 2026-02-07 - Build Submission API Integration
- **Integrated create and save draft functionality** with backend API
- **Updated buildsApi.ts**:
  - Changed `updateBuild` to use PATCH method for incremental updates
  - All API methods now properly call backend endpoints
- **Updated useBuildSubmission.ts**:
  - Added automatic draft creation on component mount via POST `/builds`
  - Implemented `handleSave` with PATCH `/builds/:id` for partial updates
  - Implemented `handlePublish` with save + POST `/builds/:id/publish`
  - Added transformation functions between UI state and API payloads
  - Added error handling and loading states (`isInitializing`, `error`)
  - Exports new state variables for UI feedback
- **Updated SubmissionDashboard.tsx**:
  - Added loading screen while creating initial draft
  - Added error screen if draft creation fails
  - Added error banner for save/publish errors
  - Updated prop types to include `isInitializing` and `error`
- **Workflow**:
  - User clicks "New Build" or "Create Your First Build" buttons
  - Navigation to `/builds/submit` triggers draft creation
  - Hook automatically creates empty draft via POST `/builds`
  - User fills out form across 5 tabs with real-time validation
  - Click "Save Draft" triggers PATCH `/builds/:id` with partial updates
  - Click "Publish" triggers save + POST `/builds/:id/publish` with validation
- **Known Limitation**: Each visit to submission page creates a new draft. Future enhancement: support editing existing drafts via URL parameter (`/builds/submit?id=uuid` or `/builds/edit/:id`)

### 2026-02-07 - My Builds Page Implementation
- **Created My Builds dashboard page** at `/builds/my-builds`
- **Added "My Builds" menu item** to ProfileDropdown component
  - Uses Hammer icon for visual consistency
  - Positioned between "My Hackathons" and "My Events"
- **Implemented comprehensive builds management**:
  - Real-time search across build names and taglines
  - Status filtering (All, Draft, Published, Archived)
  - Responsive grid layout with BuildCard components
  - Empty states for new users and filtered results
  - "New Build" CTA button linking to submission flow
- **Added API integration**:
  - New `getMyBuilds()` function in buildsApi.ts
  - Fetches from `/builds/my-builds` endpoint
  - Returns array of user's builds with full details
- **Auth protection**: Redirects unauthenticated users to login page

### 2026-02-07 - Builds Listing Page Transformation
- **Transformed builds landing page** from "coming soon" to full builds discovery experience
- **Added comprehensive filtering and search**:
  - Real-time search across names, taglines, and tech stacks
  - Category filtering with all build categories
  - Status filtering (Published/Draft/Archived)  
  - Sorting by newest, oldest, most viewed, alphabetical
- **Implemented bento grid layout** with featured builds showcase
  - 1 large featured buildcard + 2 secondary cards + regular grid
  - Responsive design with mobile-first approach
- **Integrated with real backend API**:
  - Updated backend.types.ts to match actual API specification
  - Rebuilt buildsApi.ts service with correct endpoint patterns
  - Connected to `/builds/public/list` endpoint for public builds
  - Added proper error handling and loading states
- **Enhanced user experience**:
  - Loading states during API calls
  - Empty states for no results
  - Active filter indicators and clear functionality
  - Results count display
  - Auth-aware submit button for authenticated users

### 2026-02-07 - Backend API Integration Complete  
- **Updated backend.types.ts** to match exact API specification:
  - PublicBuildsListResponse for listing endpoint
  - BackendBuild for detailed build objects
  - Proper payload types for create/publish operations
  - Team management and submissions module types
- **Rebuilt buildsApi.ts** with correct endpoints:
  - Public endpoints: `/builds/public/list`, `/builds/public/:slug`
  - Private endpoints: `/builds`, `/builds/:id/publish`, team management
  - Proper transformation between API and UI data formats
- **Fixed all TypeScript errors** and import issues
- **Added Submissions module types** for future hackathon integration
- **Added complete build submission UI system**
- **Created 5 new files**:
  1. `types/build.types.ts`: TypeScript interfaces for build entities
  2. `components/buildUI/SubmitCTAButton.tsx`: Auth-aware CTA component
  3. `components/buildService/useBuildSubmission.ts`: State management hook
  4. `components/buildService/SubmissionDashboard.tsx`: Multi-tab submission form
  5. `submit/page.tsx`: Protected submission route with auth guard
- **Modified 1 file**:
  - `page.tsx`: Updated landing page to use auth-aware CTA instead of email form
- **Key Features Implemented**:
  - Auth-aware landing page with conditional CTAs
  - 5-tab submission dashboard (Details, Links, Description, Team, Stellar)
  - Real-time form validation with publish checklist
  - Tech stack management with ChipInput integration
  - Social links management for both project and team
  - Stellar integration with network selection and address validation
  - Draft/Publish workflow with save states and success feedback
  - Responsive design with mobile-first approach
  - Proper separation of UI and Service components per claude.md rules

### Feature Architecture Compliance
- ✅ UI/Service separation: buildUI/ (NO business logic) vs buildService/ (business logic)
- ✅ Single context.md file (NO docs/ folder)
- ✅ Path aliases: `@/src/...` instead of relative paths
- ✅ Props for 2-level data passing
- ✅ Local useState (Zustand not needed for current scope)

## Design System Adherence

### Colors
- Background: `bg-background`
- Text Primary: `text-foreground`
- Text Secondary: `text-muted-foreground`
- Accent: `bg-accent/20` with `border-accent/30`
- Card backgrounds: `bg-card` with `border-border`

### Typography
- Hero heading: `text-5xl md:text-6xl lg:text-7xl` with Onest font
- Description: `text-lg md:text-xl`
- Feature cards: `text-lg` headings, `text-sm` descriptions

### Spacing
- Hero padding: `py-20 md:py-32`
- Container: `container-main` (from globals)
- Card padding: `p-6`
- Grid gaps: `gap-6 md:gap-8`

### Components
- Border radius: `rounded-xl` (buttons/inputs), `rounded-2xl` (cards)
- Transitions: `transition-all duration-300` for hover effects
- Shadows: `hover:shadow-lg` on feature cards
- Animations: `animate-pulse` on coming soon badge

## Data Flow

### Current State (Static)
1. User visits `/Builds` (linked from Navbar)
2. Static page renders with feature preview
3. User enters email and clicks "Notify Me"
4. Local state updates to show confirmation
5. State resets after 3 seconds (no backend integration yet)

### Future State (To Be Implemented)
1. Email subscriptions will be stored in database
2. Launch notification system will be implemented
3. Actual builds gallery and builder profiles will replace this page

## Design System Adherence

### Colors (CSS Variables)
- Background: `bg-[#FCFCFC]` (Ghost White)
- Text Primary: `text-[#1A1A1A]`
- Text Secondary: `text-[#4D4D4D]`
- Borders: `border-[#E5E5E5]`
- Accent: `bg-accent/20` with `border-accent/30`
- Brand: `bg-[#1A1A1A]` for primary buttons
- Card backgrounds: `bg-white` with `border-[#E5E5E5]`

### Typography
- Hero heading: `text-5xl md:text-6xl lg:text-7xl` (responsive)
- Section titles: `text-lg font-semibold`
- Body text: `text-sm md:text-base`
- Labels: `text-sm font-medium`

### Spacing & Layout
- Container: `max-w-7xl` with responsive padding
- Card padding: `p-6`
- Input padding: `px-4 py-3`
- Grid gaps: `gap-4 md:gap-6 lg:gap-8`
- Responsive grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

### Components
- Border radius: `rounded-xl` (inputs/buttons), `rounded-2xl` (cards), `rounded-full` (badges)
- Transitions: `transition-all duration-200 ease-in-out`
- Focus states: `focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]`
- Hover effects: `hover:bg-[#333]`, `hover:border-[#1A1A1A]`

## Edge Cases & Considerations

1. **Authentication Flow**:
   - Handles loading states during auth check
   - Proper redirect with return URL preservation
   - Graceful handling of auth failures

2. **Form Validation**:
   - Real-time validation feedback
   - Email format validation
   - Required field enforcement
   - Character limits (tagline: 120 chars)
   - Publish requirements clearly communicated

3. **Data Management**:
   - Optimistic UI updates for better UX
   - Local state persistence during tab navigation
   - Error handling for save/publish operations
   - Duplicate prevention for arrays (tech stack, social links)

4. **Responsive Design**:
   - Mobile-first approach with progressive enhancement
   - Tab navigation adapts to screen size
   - Sidebar only shows on desktop (details tab)
   - Touch-friendly interactive elements

5. **Accessibility**:
   - Semantic HTML structure with proper headings
   - Screen reader friendly labels and descriptions
   - Keyboard navigation support
   - Color contrast compliance
   - Focus management for tab navigation

## Future Enhancements (V2)

### Backend Integration
- Connect to actual API endpoints for CRUD operations
- Implement user authentication middleware
- Add build status workflow management
- Enable image upload for logos and media

### Enhanced Features  
- Rich text editor for descriptions (replace textarea)
- Public build gallery at `/builds/[id]`
- Build discovery page with filtering and search
- Build analytics dashboard for creators
- Rating and review system
- Build collections and favorites

### Stellar Ecosystem Integration
- Automatic contract verification
- Stellar account balance display
- Transaction history integration
- Soroban contract interaction testing
- Integration with Stellar development tools

### Social Features
- Build comments and community feedback
- Developer profiles and portfolios
- Build sharing and social promotion
- Integration with hackathon submissions
- Featured builds and trending sections

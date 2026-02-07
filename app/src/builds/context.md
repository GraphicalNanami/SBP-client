# Builds Feature - Context

## Purpose

The Builds feature enables authenticated developers to submit and showcase their Stellar/Soroban builds on the platform. It serves as a portfolio system where developers can:
- Submit detailed build information through a multi-tab dashboard
- Showcase their Stellar ecosystem contributions
- Connect builds to their team and social presence
- Demonstrate Stellar/Soroban integration

## User Stories

1. **As an authenticated developer**, I want to submit my build through a comprehensive submission form
2. **As a visitor**, I want to understand what builds submission offers and be guided to sign in
3. **As a user**, I want the submission process to be intuitive with clear validation feedback
4. **As a builder**, I want to save drafts and publish when ready

## Key Components

### UI Components (@/src/builds/components/buildUI/)

#### `SubmitCTAButton.tsx`
- **Purpose**: Auth-aware CTA button for landing page (NO business logic)
- **Props**: `isAuthenticated`, `isLoading`
- **Behavior**:
  - Loading: Shows skeleton placeholder
  - Authenticated: "Submit Your Build" → `/builds/submit`
  - Not authenticated: "Sign in to Submit Your Build" → `/src/auth?redirect=/builds/submit`
- **Styling**: Responsive button with design system compliance

#### `page.tsx` (Landing Page)
- **Purpose**: Updated landing page with submission CTA
- **Integration**: Uses `useAuth` hook and `SubmitCTAButton` component
- **Replaced**: Email subscription form with auth-aware CTA

### Service Components (@/src/builds/components/buildService/)

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
- **BuildSubmission**: Main entity with nested interfaces
- **BuildDetails**: Name, logo, tagline, description, category, tech stack
- **BuildLinks**: GitHub, website, demo video, live demo, social links array
- **BuildTeam**: Description, team socials, contact email
- **BuildStellar**: Contract address, Stellar address, network type
- **Enums**: BuildStatus, BuildCategory, NetworkType, BuildDashboardTab

## Data Flow

### User Flow
1. **Landing Page Visit**: `/builds`
   - If authenticated: See "Submit Your Build" button
   - If not authenticated: See "Sign in to Submit Your Build" button
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
- **Local State**: Uses `useState` (no Zustand needed for current scope)
- **Auth Integration**: Consumes `useAuth` hook from auth context
- **Validation**: Real-time validation with computed `canPublish` property
- **Persistence**: Currently mock/local (ready for API integration)

## Dependencies

### Internal
- `@/src/auth/hooks/useAuth`: Authentication state (isAuthenticated, isLoading, user)
- `@/src/shared/components/ui/button`: Shared button component with variants
- `@/src/shared/components/factories/ChipInput`: Tech stack management
- `@/src/shared/components/ui/highlightText`: Landing page text highlights
- Landing page components: `Navbar`, `Footer`

### External
- `lucide-react`: Icons for tabs, UI elements, and interactive components
- `next/link`, `next/navigation`: Client-side routing and redirects
- Built-in validation: Email format validation, required field checks

## Recent Changes

### 2026-02-07 - Build Submission Flow Added
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

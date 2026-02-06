# Builds Feature - Context

## Purpose

The Builds feature is a "coming soon" placeholder page for the future project gallery and builder showcase platform. It serves to:
- Inform users about the upcoming Builds feature
- Collect email subscriptions for launch notifications
- Maintain UI consistency with the rest of the platform
- Provide a sneak peek of planned features

## User Stories

1. **As a visitor**, I want to see what the Builds feature will offer so I can decide if I'm interested
2. **As a developer**, I want to subscribe for launch notifications so I don't miss the release
3. **As a user**, I want the page to feel cohesive with the rest of the platform

## Key Components

### UI Components

#### `page.tsx`
- **Purpose**: Main "coming soon" page with feature preview
- **Key Elements**:
  - Hero section with highlighted text (UnderlineHighlight, CircleHighlight)
  - Wavy background text pattern matching Events page
  - Three feature cards showcasing planned capabilities:
    - Project Gallery: Browse Stellar ecosystem projects
    - Builder Profiles: Developer portfolio system
    - Launch Showcase: Highlight new projects
  - Email subscription form with notification toggle
  - Expected launch timeline (Q1 2026)
- **State**:
  - `email`: User's email input
  - `isSubscribed`: Subscription confirmation state
- **Responsive**: Mobile-first design with breakpoints (md, lg)

### Shared Dependencies

- `Navbar`: From `@/src/landingPage/components/Navbar`
- `Footer`: From `@/src/landingPage/components/Footer`
- Highlight components: `UnderlineHighlight`, `CircleHighlight` from `@/src/shared/components/ui/highlightText`
- Icons: Lucide React (`Sparkles`, `Hammer`, `Code2`, `Rocket`, `Bell`)

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

## Dependencies

### Internal
- `@/src/landingPage/components/Navbar`: Global navigation
- `@/src/landingPage/components/Footer`: Global footer
- `@/src/shared/components/ui/highlightText`: Text highlight effects

### External
- `next/link`: Navigation (not currently used, but available)
- `lucide-react`: Icon library
- `react`: State management (useState)

## Edge Cases & Considerations

1. **Email Validation**: HTML5 email validation via `type="email"` and `required` attribute
2. **Form Submission**: Prevents default form submission (currently no backend)
3. **Subscription Feedback**: Visual confirmation with auto-reset after 3 seconds
4. **Accessibility**:
   - Semantic HTML structure
   - Proper button states (disabled when subscribed)
   - Screen reader friendly icon usage
5. **Responsive Design**: Mobile-first grid layout (1 column → 3 columns on md+)

## Recent Changes

### 2026-02-07 - Initial Creation
- Created coming soon page matching Events page design system
- Implemented email subscription form (frontend only)
- Added three feature preview cards
- Integrated wavy background text pattern
- Added launch timeline indicator (Q1 2026)
- Ensured full responsive design (mobile → desktop)

## Future Enhancements

### Phase 1 - Backend Integration
- Connect email subscription to database
- Implement email notification service
- Add analytics tracking

### Phase 2 - Builds Platform
- Project gallery with filtering and search
- Builder profile system
- Project submission flow
- Voting/rating system
- Integration with hackathon submissions

### Phase 3 - Advanced Features
- Project categories and tags
- Builder leaderboards
- Project analytics dashboard
- Social sharing features
- Integration with Stellar ecosystem tools

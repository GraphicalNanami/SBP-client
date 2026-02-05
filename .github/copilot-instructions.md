# Copilot Instructions for Stellar Global

## Project Overview

Stellar Global is a hackathons and events discovery platform for the Stellar blockchain ecosystem, inspired by EthGlobal. It serves as a unified hub where developers can discover, follow, and engage with ecosystem-driven events.

## Tech Stack & Setup

- **Framework**: Next.js 16.1.6 (App Router)
- **React**: 19.2.3
- **TypeScript**: Strict mode enabled
- **Styling**: Tailwind CSS v4 (latest version with inline config)
- **Package Manager**: pnpm with workspace support
- **Fonts**: Geist Sans & Geist Mono (loaded via `next/font/google`)

### Development Commands

```bash
pnpm dev      # Start dev server at localhost:3000
pnpm build    # Production build
pnpm start    # Production server
pnpm lint     # Run ESLint
```

## Design System & UI Conventions

### Layout & Spacing
- **8px Grid System**: All spacing follows 8px increments (16, 24, 32, 64, 120)
- **Container Width**: 1200px max-width, centered with fluid gutters
- **Hero Padding**: 120px top / 80px bottom
- **Element Gaps**: 24px (tag-to-title), 32px (title-to-subtitle), 40px (subtitle-to-buttons)

### Color Palette (from `Docs/design.md`)
```
Background:    #FCFCFC (Ghost White)
Text Primary:  #1A1A1A
Text Secondary: #4D4D4D
Brand Primary: #000000
Brand Accent:  #E6FF80 (lime highlight)
Border:        #E5E5E5
```

### Typography
- **Font**: Inter with system fallbacks (currently using Geist)
- **Headings**: font-weight 600, letter-spacing -0.03em, line-height 1.1
- **Body**: font-weight 400, line-height 1.6
- **Hero Headlines**: 84px with hand-drawn SVG highlights on key words

### Component Patterns
- **Buttons**: 12px border-radius, `transition: all 0.2s ease`
  - Solid variant: `#1A1A1A` background
  - Outline variant: 1px `#E5E5E5` border
- **Cards**: 24px border-radius, subtle shadows `0px 4px 20px rgba(0,0,0,0.05)`
- **Badges**: Pill-shaped (100px border-radius), 8px/16px padding
- **Icons**: Use Lucide-style slim-profile icons, precisely centered

### Background Effects
- Subtle dot-grid pattern overlay using repeating radial gradient
- Dark overlays for hero cards: `rgba(0,0,0,0.6)`

## File Structure & Conventions

### Path Aliases
- `@/*` maps to project root (configured in `tsconfig.json`)

### App Router Structure
- `app/layout.tsx` - Root layout with font configuration and metadata
- `app/page.tsx` - Homepage (currently default Next.js template)
- `app/globals.css` - Global styles with Tailwind v4 inline theme config

### Design Documentation
Reference `Docs/design.md` and `Docs/design1.md` for:
- Exact spacing measurements
- Component specifications
- Hand-drawn highlight SVG patterns
- 3-column grid layouts for plan cards

## Key Implementation Notes

1. **Tailwind v4 Syntax**: Uses new `@import "tailwindcss"` syntax with `@theme inline`
2. **CSS Variables**: Theme colors defined in `:root` with dark mode media query
3. **Font Variables**: Geist fonts exposed as `--font-geist-sans` and `--font-geist-mono`
4. **Image Optimization**: Use `next/image` for all images with proper width/height
5. **Monorepo Structure**: Uses pnpm workspaces (`pnpm-workspace.yaml`)

## Component Development Guidelines

When building UI components:
- Follow the 8px spacing grid strictly
- Use the color palette from design docs for consistency
- Implement smooth transitions (0.2s ease) on interactive elements
- Ensure responsive behavior with Tailwind's mobile-first approach
- Add dark mode support using CSS variables and `dark:` variants
- Center-align hero sections with vertical flex stacks
- Use 3-column grid layouts for feature/plan cards with 24px gaps

## Accessibility & Best Practices

- Maintain semantic HTML structure
- Include proper alt text for images
- Use appropriate heading hierarchy
- Ensure sufficient color contrast ratios
- Add keyboard navigation support for interactive elements



## Whenever you are developing the feature any for that follow the :-> ✅ STRICT Documentation & Implementation Rules

### Feature Documentation Requirements
**CRITICAL - MUST FOLLOW:**
- Each feature has **EXACTLY ONE** `context.md` file in the feature root directory
- **NEVER** create a `docs/` folder inside feature directories
- The `context.md` file **MUST** be updated every time changes are made to the feature
- Format for `context.md`:
  - Purpose and user stories
  - Key components (UI and Service layer)
  - Data flow and API endpoints
  - Dependencies and edge cases
  - Recent changes and updates (with date)
  - Future enhancements

### Implementation Rules When Working on Features
When working on a specific feature:
1. ✅ **STAY IN THAT FEATURE FOLDER ONLY** - do not create files outside the feature scope
2. ✅ **ALWAYS UPDATE** the `context.md` file when making changes (add date stamp)
3. ✅ Respect the UI/Service separation:
   - `featureUI/` - Pure presentation components (NO business logic)
   - `featureService/` - All hooks, API calls, business logic
4. ✅ Use Zustand stores (`stores/`) when state needs to be accessed deeply across components
5. ✅ Use props for simple 2-level value passing
6. ✅ Use shared factories from `src/shared/components/factories/` (Button, Toast, Loader, Modal)
7. ❌ **NEVER** create a `docs/` folder inside features
8. ❌ **NEVER** create multiple documentation files per feature
9. ❌ **NEVER** add business logic to UI components
10. ❌ **NEVER** create custom buttons/modals/loaders - use shared factories

### State Management Rules
- **Zustand**: For deep state, cross-feature state, complex state needing persistence
- **Props**: For simple 2-level parent-child data passing
- **useState**: For local component state that doesn't need sharing

### Feature Module Structure (MUST FOLLOW)
```
feature-name/
├── components/
│   ├── featureUI/         # Pure UI components (presentation only)
│   └── featureService/    # Business logic, hooks, API calls
├── actions/               # Server actions
├── types/                 # Feature-specific types
├── stores/                # Zustand stores (if needed)
└── context.md             # ⚠️ SINGLE feature documentation file
```

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

### Responsive Design Principles
- **Mobile-First Approach**: Design for mobile, progressively enhance for larger screens
- **Fluid Typography**: Use `clamp()` for font sizes that scale smoothly
- **Flexible Spacing**: Use `rem` for spacing (1rem = 16px base) instead of fixed px
- **Breakpoint System** (Tailwind v4):
  ```
  sm:  640px   (tablets portrait)
  md:  768px   (tablets landscape)
  lg:  1024px  (small desktops)
  xl:  1280px  (desktops)
  2xl: 1536px  (large desktops)
  ```

### Layout & Spacing (Responsive)
- **Spacing Scale**: Use Tailwind's rem-based spacing
  - `space-2` = 0.5rem (8px)
  - `space-4` = 1rem (16px)
  - `space-6` = 1.5rem (24px)
  - `space-8` = 2rem (32px)
  - `space-16` = 4rem (64px)
  - `space-30` = 7.5rem (120px)
- **Container**: `max-w-7xl` (1280px) with responsive padding
  - Mobile: `px-4` (1rem / 16px)
  - Tablet: `sm:px-6` (1.5rem / 24px)
  - Desktop: `lg:px-8` (2rem / 32px)
- **Hero Padding**: 
  - Mobile: `py-12` (3rem / 48px top/bottom)
  - Tablet: `md:py-20` (5rem / 80px)
  - Desktop: `lg:py-30` (7.5rem / 120px)
- **Element Gaps**: 
  - Small: `gap-4` (1rem / 16px)
  - Medium: `gap-6` (1.5rem / 24px)
  - Large: `gap-8` (2rem / 32px)

### Color Palette (from `Docs/design.md`)
```
Background:    #FCFCFC (Ghost White)
Text Primary:  #1A1A1A
Text Secondary: #4D4D4D
Brand Primary: #000000
Brand Accent:  #E6FF80 (lime highlight)
Border:        #E5E5E5
```

### Typography (Responsive & Fluid)
- **Font**: Inter with system fallbacks (currently using Geist)
- **Font Weights**: 
  - Headings: `font-semibold` (600)
  - Body: `font-normal` (400)
- **Tracking**: Headings use `-tracking-tight` (letter-spacing: -0.03em)
- **Line Heights**: 
  - Headings: `leading-tight` (1.1)
  - Body: `leading-relaxed` (1.6)
- **Responsive Font Sizes** (use clamp):
  ```css
  /* Hero Headlines */
  font-size: clamp(2.5rem, 5vw, 5.25rem);  /* 40px → 84px */
  
  /* H1 */
  font-size: clamp(2rem, 4vw, 3rem);       /* 32px → 48px */
  
  /* H2 */
  font-size: clamp(1.5rem, 3vw, 2.25rem);  /* 24px → 36px */
  
  /* H3 */
  font-size: clamp(1.25rem, 2.5vw, 1.875rem); /* 20px → 30px */
  
  /* Body */
  font-size: clamp(1rem, 1.5vw, 1.125rem); /* 16px → 18px */
  ```
- **Tailwind Classes**:
  - Hero: `text-4xl md:text-6xl lg:text-[5.25rem]`
  - H1: `text-3xl md:text-4xl lg:text-5xl`
  - H2: `text-2xl md:text-3xl lg:text-4xl`
  - H3: `text-xl md:text-2xl lg:text-3xl`
  - Body: `text-base md:text-lg`

### Component Patterns (Responsive)
- **Buttons**: 
  - Border radius: `rounded-xl` (0.75rem / 12px)
  - Padding: `px-6 py-3` (mobile), `md:px-8 md:py-4` (desktop)
  - Font: `text-sm md:text-base`
  - Transition: `transition-all duration-200 ease-in-out`
  - Solid variant: `bg-[#1A1A1A] text-white hover:bg-[#333]`
  - Outline variant: `border border-[#E5E5E5] hover:border-[#1A1A1A]`
- **Cards**: 
  - Border radius: `rounded-2xl` (1.5rem / 24px)
  - Shadow: `shadow-sm hover:shadow-md transition-shadow`
  - Padding: `p-4 md:p-6 lg:p-8`
  - Width: `w-full` with max constraints
- **Badges**: 
  - Border radius: `rounded-full`
  - Padding: `px-3 py-1 md:px-4 md:py-2`
  - Font: `text-xs md:text-sm`
- **Icons**: 
  - Size: `w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6`
  - Use Lucide React icons with responsive sizing
- **Grid Layouts**:
  - Cards: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6`
  - Features: `grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8`

### Background Effects
- Subtle dot-grid pattern overlay using repeating radial gradient (scales with viewport)
- Dark overlays for hero cards: `bg-black/60` (60% opacity)

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
- **Mobile-First**: Start with mobile layout, add breakpoints for larger screens
- **Fluid Spacing**: Use Tailwind's rem-based spacing (space-4, space-6, etc.), never fixed px
- **Responsive Typography**: Use clamp() or Tailwind's responsive text classes
- **Flexible Containers**: Use `max-w-*` with percentage-based padding
- **Grid & Flex**: Leverage responsive grid/flex with breakpoint modifiers (md:, lg:)
- **Touch Targets**: Minimum 44×44px (2.75rem) for interactive elements on mobile
- **Viewport Units**: Use `vh`/`vw` sparingly, prefer rem/% for predictability
- **Color Consistency**: Use color palette from design docs
- **Smooth Transitions**: Apply `transition-all duration-200 ease-in-out` to interactive elements
- **Dark Mode**: Support using CSS variables and `dark:` variants
- **Responsive Images**: Always use `next/image` with responsive sizes
- **Aspect Ratios**: Use `aspect-*` classes for consistent media ratios across breakpoints

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



### Rules 

---

# Folder Context Rules (context.md)

Every domain/module folder MUST contain a `context.md` file.

## Purpose

* `context.md` is the source of truth for that folder
* It explains:

  * Responsibilities
  * Public interfaces
  * Invariants
  * Dependencies on other modules

## Rule of Exploration (Mandatory)

* Any engineer or AI agent MUST read `context.md` before:

  * Modifying code in that folder
  * Adding new files
  * Refactoring logic

## Rule of Modification (Mandatory)

* If any code in a folder is changed, the corresponding `context.md` MUST be updated to reflect:

  * New responsibilities
  * Changed APIs
  * New invariants or assumptions
  * Deprecated behavior

## Enforcement

* PRs without updated `context.md` (when applicable) should be rejected
* Code reviewers must verify `context.md` accuracy

---

# Philosophy

This is a long-term ecosystem primitive for Stellar.
Design for:

* Clarity over cleverness
* Strong domain modeling
* Clean audit trails
* Future integrations (Colosseum, Stellar Dev tools, etc)


### RULES 

## Rule of plans

Plans should be human readable high level docs containing all the nitty gritties about how the work will be done but not the code, no pointers. Be as expressive as u can while planning but with words not with code .

## Rule of Package Manager

Our package  wil be mantained by the bun intrinsically

## Rule of build 

Anyone is not allowed to run build .
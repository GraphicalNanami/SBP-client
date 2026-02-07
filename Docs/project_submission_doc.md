# Build Submission UI Integration Plan

## Context

**Why this change?**
The /Builds page currently shows a "coming soon" landing page. Users need the ability to submit their Stellar/Soroban builds to showcase their work on the platform. This implements the build submission flow based on the project submission specification, integrating with the existing authentication system.

**Problem:**
- No way for authenticated users to submit builds
- Missing submission dashboard and form
- No CTA on /Builds page to start submission

**Intended Outcome:**
- Authenticated users see "Submit Your Build" button on /Builds page
- Unauthenticated users see "Sign in to Submit Your Build" button
- Complete 5-tab submission dashboard at /builds/submit
- Clean, CLAUDE.md-compliant feature structure

---

## Implementation Approach

**Strategy:** Create dedicated builds submission module following proven hackathon dashboard pattern

**Why this approach?**
- Builds are conceptually distinct from hackathon projects (standalone showcases vs competition entries)
- Existing hackathon module provides proven blueprint
- Full CLAUDE.md compliance with feature-based structure
- Future-proof for builds-specific features (ratings, portfolios, discovery)

---

## Architecture Overview

```
app/src/builds/
├── context.md                                    # UPDATE with date stamp
├── page.tsx                                      # MODIFY - add auth-aware CTA
├── submit/
│   └── page.tsx                                 # NEW - Submission entry with auth guard
├── components/
│   ├── buildUI/                                 # Pure presentation (NO business logic)
│   │   └── SubmitCTAButton.tsx                 # NEW - Auth-aware CTA component
│   └── buildService/                            # Business logic & hooks
│       ├── useBuildSubmission.ts               # NEW - State management hook
│       └── SubmissionDashboard.tsx             # NEW - 5-tab dashboard form
└── types/
    └── build.types.ts                          # NEW - TypeScript interfaces
```

---

## Critical Files & Reusable Patterns

**Existing files to reference:**
- `/app/src/auth/hooks/useAuth.ts` - Auth hook with `{ isAuthenticated, user, isLoading }`
- `/app/src/builds/page.tsx` - Current landing page (line 96-123: replace email form section)
- Design patterns from hackathon module (dashboard layout, tab structure, form inputs)

**Shared UI patterns to reuse:**
- Card, SectionTitle, Label components (define in SubmissionDashboard.tsx)
- `inputClass`, `textareaClass`, `selectClass` CSS patterns
- `aurora-bg` background class
- CSS variables: `--brand`, `--text`, `--border`, `--bg-muted`
- Responsive grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

---

## Step-by-Step Implementation

### 1. Create Type Definitions

**File:** `/app/src/builds/types/build.types.ts` (NEW)

```typescript
export type BuildStatus = 'Draft' | 'Published' | 'Archived';
export type BuildCategory = 'DeFi' | 'NFT & Gaming' | 'Payments' | 'Infrastructure'
  | 'Developer Tools' | 'Social Impact' | 'Other';
export type NetworkType = 'Testnet' | 'Mainnet';

export interface BuildDetails {
  name: string;
  logo: string;
  tagline: string; // max 120 chars
  description: string;
  category: BuildCategory | '';
  techStack: string[];
}

export interface BuildLinks {
  github: string;
  website: string;
  demoVideo: string;
  liveDemo: string;
  socialLinks: { platform: string; url: string }[];
}

export interface BuildTeam {
  description: string;
  teamSocials: { platform: string; url: string }[];
  contactEmail: string;
}

export interface BuildStellar {
  contractAddress: string;
  stellarAddress: string;
  networkType: NetworkType | '';
}

export interface BuildSubmission {
  id: string;
  userId: string;
  status: BuildStatus;
  details: BuildDetails;
  links: BuildLinks;
  team: BuildTeam;
  stellar: BuildStellar;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export type BuildDashboardTab = 'details' | 'links' | 'description' | 'team' | 'stellar';
```

**Key differences from project types:**
- No hackathon association
- No tracks (standalone builds)
- Network type selection (testnet vs mainnet)
- Simpler team model (no member invitations)

---

### 2. Create State Management Hook

**File:** `/app/src/builds/components/buildService/useBuildSubmission.ts` (NEW)

**Pattern:** Mirror existing hook patterns with useState (no Zustand needed yet)

**Exports:**
- `build` - Full BuildSubmission state
- `activeTab`, `setActiveTab` - Tab navigation
- `isSaving`, `saveSuccess` - Save UX indicators
- Update handlers: `updateDetails`, `updateLinks`, `updateTeam`, `updateStellar`
- Array handlers: `addSocialLink`, `removeSocialLink`, `addTechStack`, `removeTechStack`
- Actions: `handleSave` (save draft), `handlePublish` (validate & publish)
- `canPublish` - Computed validation boolean

**Validation rules (canPublish):**
- Name, tagline, description, category required
- At least one tech stack item
- Contact email (valid format)
- At least one: contract address OR stellar address
- Network type selected

---

### 3. Create Submission Dashboard

**File:** `/app/src/builds/components/buildService/SubmissionDashboard.tsx` (NEW)

**Structure (~600 lines):**
```tsx
// Shared UI primitives (top of file)
Card, SectionTitle, Label, inputClass, textareaClass, selectClass

// Main component
SubmissionDashboard({...props from hook})
  - Sticky header: Back link, build name, status badge, Save/Publish buttons
  - Tab navigation: 5 tabs with icons
  - Tab content area: Renders active tab

// Tab components (each 100-150 lines)
DetailsTab: Name, logo upload, tagline, description, category, tech stack chips
LinksTab: GitHub, website, live demo, demo video, social links
DescriptionTab: Rich text area with edit/preview toggle
TeamTab: Team description, contact email, team socials
StellarTab: Contract address, stellar address, network type radio buttons
```

**Right sidebar (DetailsTab only):**
- Submission summary card
- Publish checklist with checkmarks for required fields

**Uses path alias:** `import { useAuth } from '@/src/auth/hooks/useAuth'`

---

### 4. Create CTA Button Component

**File:** `/app/src/builds/components/buildUI/SubmitCTAButton.tsx` (NEW)

```tsx
interface SubmitCTAButtonProps {
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Renders:
// - If loading: Skeleton placeholder
// - If authenticated: "Submit Your Build" button → /builds/submit
// - If not authenticated: "Sign in to Submit Your Build" button → /src/auth?redirect=/builds/submit
```

**Styling:** Follow design system with responsive button classes, hover states, transitions

---

### 5. Update Landing Page

**File:** `/app/src/builds/page.tsx` (MODIFY)

**Changes:**
1. Add imports:
   ```tsx
   import { useAuth } from '@/src/auth/hooks/useAuth';
   import SubmitCTAButton from './components/buildUI/SubmitCTAButton';
   ```

2. Get auth state in component:
   ```tsx
   const { isAuthenticated, isLoading } = useAuth();
   ```

3. Replace email subscription section (lines ~96-123) with:
   ```tsx
   {/* Submission CTA */}
   <div className="max-w-md mx-auto">
     <SubmitCTAButton isAuthenticated={isAuthenticated} isLoading={isLoading} />
   </div>
   ```

**Keep:** Existing hero, feature cards, timeline, footer - only replace email form

---

### 6. Create Submission Entry Page

**File:** `/app/src/builds/submit/page.tsx` (NEW)

```tsx
'use client';

import { useAuth } from '@/src/auth/hooks/useAuth';
import { redirect } from 'next/navigation';
import SubmissionDashboard from '../components/buildService/SubmissionDashboard';
import { useBuildSubmission } from '../components/buildService/useBuildSubmission';

export default function BuildSubmitPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const hook = useBuildSubmission();

  // Auth guard
  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) {
    redirect('/src/auth?redirect=/builds/submit');
  }

  return <SubmissionDashboard {...hook} />;
}
```

**Route:** Automatically accessible at `/builds/submit` via Next.js App Router

---

### 7. Update context.md

**File:** `/app/src/builds/context.md` (UPDATE)

**Add sections:**
```markdown
## Recent Changes

### 2026-02-07 - Build Submission Flow Added
- Added authenticated build submission flow
- Created submission dashboard with 5 tabs (Details, Links, Description, Team, Stellar)
- Integrated useAuth hook for conditional rendering on landing page
- Added SubmitCTAButton component to landing page
- Created build types (BuildSubmission, BuildDetails, etc.)
- Implemented useBuildSubmission hook for state management
- Added /builds/submit route with auth guard

## Feature Structure

### UI Components (@/src/builds/components/buildUI/)
- `SubmitCTAButton.tsx`: Auth-aware CTA for landing page (NO business logic)

### Service Components (@/src/builds/components/buildService/)
- `useBuildSubmission.ts`: State management hook with all business logic
- `SubmissionDashboard.tsx`: Multi-tab submission form (orchestrates UI)

### Types (@/src/builds/types/)
- `build.types.ts`: Build-specific TypeScript interfaces

## Data Flow

User Flow:
1. Visit /Builds landing page
2. If authenticated: Click "Submit Your Build" → /builds/submit
3. If not authenticated: Click "Sign in to Submit" → /src/auth → /builds/submit
4. Fill 5 tabs (validation feedback on each field)
5. Save Draft → status: 'Draft' (can resume later)
6. Publish → Validate all fields → status: 'Published'

## Dependencies

Internal:
- `@/src/auth/hooks/useAuth`: Authentication state and user info
- CSS variables from globals.css for theming

External:
- lucide-react: Icons for tabs and UI elements
- next/link, next/navigation: Client-side routing
```

---

## CLAUDE.md Compliance Checklist

✅ Feature structure:
- ✅ components/buildUI/ - Pure presentation (NO business logic)
- ✅ components/buildService/ - Business logic, hooks
- ✅ types/ - TypeScript interfaces
- ✅ Single context.md file (NO docs/ folder)

✅ Implementation rules:
- ✅ Stay in /app/src/builds/ folder only
- ✅ Update context.md with date stamp
- ✅ UI/Service separation respected
- ✅ Use @/src/... paths (NOT ../../../)
- ✅ useState for local state (Zustand only if needed later)
- ✅ Props for 2-level data passing

---

## File Summary

**New Files (5):**
1. `/app/src/builds/types/build.types.ts` - Type definitions
2. `/app/src/builds/components/buildService/useBuildSubmission.ts` - State hook
3. `/app/src/builds/components/buildService/SubmissionDashboard.tsx` - Dashboard UI
4. `/app/src/builds/components/buildUI/SubmitCTAButton.tsx` - CTA button
5. `/app/src/builds/submit/page.tsx` - Entry route

**Modified Files (2):**
1. `/app/src/builds/page.tsx` - Add CTA section
2. `/app/src/builds/context.md` - Document changes

**Total:** 5 new files, 2 modifications

---

## Verification & Testing

**End-to-end test flow:**

1. **Unauthenticated user:**
   - Visit http://localhost:3000/Builds
   - Should see "Sign in to Submit Your Build" button
   - Click button → redirects to /src/auth?redirect=/builds/submit
   - Sign in → redirects to /builds/submit
   - Dashboard loads successfully

2. **Authenticated user:**
   - Visit http://localhost:3000/Builds
   - Should see "Submit Your Build" button
   - Click button → navigate to /builds/submit
   - Dashboard loads with empty state

3. **Submission dashboard:**
   - All 5 tabs render without errors
   - Switch between tabs - state persists
   - Fill required fields - publish checklist updates
   - Add tech stack chips - chips appear/remove correctly
   - Add social links - links appear/remove correctly
   - Save button - shows loading state, then success message
   - Publish button - disabled until validation passes
   - Publish button - enabled when all required fields filled

4. **Responsive design:**
   - Test mobile (320px-768px): Tabs scroll horizontally, cards stack
   - Test tablet (768px-1024px): 2-column layouts work
   - Test desktop (1024px+): Full 3-column layouts, sidebar visible

5. **Form validation:**
   - Try to publish with empty name → publish disabled
   - Try to publish without category → publish disabled
   - Try to publish without tech stack → publish disabled
   - Try to publish without email → publish disabled
   - Fill all required fields → publish enabled

**Run dev server:**
```bash
bun dev
# Visit http://localhost:3000/Builds
```

---

## Future Enhancements (Post-MVP)

**Not included in this implementation:**
- Backend API integration (currently mock/local state)
- Public build gallery page
- Build detail page at /builds/[id]
- Image upload functionality (currently URL input only)
- Rich text editor (currently plain textarea)
- Server-side auth middleware
- Build analytics dashboard

These will be added in subsequent phases after core submission flow is proven.

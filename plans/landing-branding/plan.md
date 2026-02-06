# Stellar Global Branding Refinement

**Branch:** `feat/brand-refinement`
**Feature Folder:** `src/landingPage/`
**Description:** Refine landing page copy and dashboard data to align with Stellar Global (Hackathons/Events platform) branding.

## Goal
Transform the generic "Remote" hiring platform template into a focused "Stellar Global" events hub to make the platform relatable to ecosystem builders, hackers, and organizers.

## Architecture Alignment
- **UI Components**: `app/src/landingPage/components/`
- **Service Layer**: N/A (Purely presentational refinement)
- **State**: Props only
- **Shared Components**: Using shared `highlightText` and standard Tailwind patterns.

## Implementation Steps

### Step 1: Branding and Navigation Update
**Files:**
- `app/src/landingPage/components/Navbar.tsx`
- `app/src/landingPage/components/Hero.tsx`
- `app/src/landingPage/context.md`

**What:** Update Navbar logo/links and Hero headline/subtext/badge to project Stellar Global identity. Create initial `context.md`.
**Testing:** Verify text displays correctly and links reflect ecosystem navigation.

### Step 2: Dashboard Data Transformation
**Files:**
- `app/src/landingPage/components/Hero.tsx`

**What:** Update the DashboardPreview component to show hackathon-specific data (Projects, Tracks, Prize Pools, Builder counts).
**Testing:** Ensure the table layout remains intact while showing Stellar-relevant data.

### Step 3: Audience/Community Section Refinement
**Files:**
- `app/src/landingPage/components/plansSection.tsx`

**What:** Rename "Plans" to "Community" or "Audiences", focusing on Hackers, Organizers, and Partners with tailored descriptions.
**Testing:** Verify the cards properly reflect the three core user types of the platform.

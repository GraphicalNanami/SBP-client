# Implementation Plan: Stellar Global Branding Refinement

This document outlines the steps to transform the generic "Remote" brand into "Stellar Global".

## Step 1: Core Branding Updates
**Task:** Update identity, navigation, and landing page context.

### 1.1 Update `app/src/landingPage/components/Navbar.tsx`
- Replace "Remote" logo text with "Stellar".
- Refine navigation links to ecosystem-relevant sections.

### 1.2 Update `app/src/landingPage/components/Hero.tsx`
- Import `CircleHighlight` from `@/src/shared/components/ui/highlightText`.
- Replace headline with: "Building the <CircleHighlight>future</CircleHighlight> of Stellar".
- Update subtext: "Discover hackathons, connect with top builders, and scale the next generation of Stellar projects."

### 1.3 Create `app/src/landingPage/context.md`
- Define the project context for the AI assistant and developers.

## Step 2: Dashboard Data Transformation
**Task:** Update `DashboardPreview` in `app/src/landingPage/components/Hero.tsx` to reflect Stellar hackathon data.

### 2.1 Update Table Headers
- Headers: `Project Name`, `Track`, `Progress`, `Prize Pool`, `Builders`.

### 2.2 Update `TableRow` Component and Data
- Refactor `TableRowProps` to match new headers.
- Use Stellar-related data (e.g., Soroban, XLM).

## Step 3: Community Section Refinement
**Task:** Update `app/src/landingPage/components/plansSection.tsx` to target ecosystem participants.

### 3.1 Refine Audience Categories
- Replace "Startups", "Mid-size", "Enterprise" with "Hackers", "Organizers", "Partners".
- Update descriptions to reflect the value proposition for each group.

---

## Detailed Changes

### Step 1: `Navbar.tsx`
```tsx
// Change 1: Logo text
<span className="text-xl font-semibold text-foreground">Stellar</span>

// Change 2: Nav items
<div className="hidden md:flex items-center gap-8">
  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Hackathons</a>
  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Ecosystem</a>
  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Developers</a>
</div>
```

### Step 1: `Hero.tsx` (Headline & Subtext)
```tsx
import { CircleHighlight } from "@/src/shared/components/ui/highlightText";

// Replace headline and subtext
<h1 className="heading-hero mb-6">
  Building the <CircleHighlight>future</CircleHighlight> 
  <br />
  of Stellar
</h1>

<p className="text-body max-w-lg mx-auto lg:mx-0 mb-10">
  Discover hackathons, connect with top builders, and scale the next generation of Stellar projects.
</p>
```

### Step 1: `context.md` (New File)
```markdown
# Stellar Global Landing Page
This section of the platform is dedicated to the Stellar Global ecosystem hub.

## Branding Guidelines
- Brand Name: Stellar Global
- Focus: Hackathons, Events, Builder Rewards
- Target Audience: Hackers, Ecosystem Organizers, Strategic Partners
```

### Step 2: `Hero.tsx` (Dashboard Table)
```tsx
<thead>
  <tr className="border-b border-border bg-secondary/50">
    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Project Name</th>
    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Track</th>
    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Progress</th>
    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Prize Pool</th>
    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Builders</th>
    <th className="px-4 py-3"></th>
  </tr>
</thead>
```

### Step 3: `plansSection.tsx`
```tsx
<div className="grid md:grid-cols-3 gap-6">
  <PlanCard 
    title="Hackers"
    description="Join hackathons, build innovative projects, and win prizes in the Stellar ecosystem."
  />
  <PlanCard 
    title="Organizers"
    description="Host hackathons, manage submissions, and grow your ecosystem with Stellar Global."
  />
  <PlanCard 
    title="Partners"
    description="Sponsor events, connect with top talent, and support the next generation of Stellar builders."
  />
</div>
```

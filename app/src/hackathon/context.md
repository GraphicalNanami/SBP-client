# Hackathon Feature — Context

Handles hackathon discovery (listings), creation, and full dashboard management. Organizers create hackathons under an existing organization. Public users can browse, filter, and view hackathon details without signing in.

---

## Route

- **URL**: `/hackathon` (mapped via `next.config.ts` rewrite from the physical path `/src/hackathon`)
- **Entry point**: `app/src/hackathon/page.tsx`

---

## Folder Structure

```
app/src/hackathon/
├── page.tsx                 # Page component — entry point for the hackathon module
├── layout.tsx               # Layout wrapper (light theme, base fonts)
├── context.md               # This file
├── components/              # UI and service-layer components (to be built)
└── types/
    └── hackathon.types.ts   # Shared TypeScript interfaces and type aliases
```

---

## Spec Reference

Full flow specification lives in `Docs/hackathon-flow.md`. Key sections:

1. **Discovery (Listings Page)** — public grid of hackathon cards with search, category/status/tag filters, and sorting.
2. **Creation** — initiated from org dashboard or listings "Host a Hackathon" button; opens the Hackathon Dashboard in Draft state.
3. **Dashboard** — seven-tab management interface:
   - General (name, category, visibility, poster, prize pool, dates, venue, submission reqs, admin contact, custom questions)
   - Tracks (add/edit/delete/reorder thematic tracks)
   - Description (rich-text editor with preview)
   - Team & Access (invite/manage admins with permission levels)
   - Insights (read-only analytics: registrations, submissions, views, traffic)
   - Participants & Submissions (builders table + projects table with export)
   - Winners & Prizes (prize setting, judges, winner assignment, prize distribution)
4. **States** — Draft → Under Review → Active → Ended (or Cancelled / Rejected at various points)
5. **Public Detail Page** — hero, key info bar, details, tracks, prizes, schedule, organizer card, Stellar build resources

---

## Types Overview

All types are defined in `types/hackathon.types.ts`:

- **Enums/Literals**: `HackathonStatus`, `HackathonVisibility`, `HackathonCategory` (Stellar-specific: Soroban, Payments & Remittances, DeFi on Stellar, etc.), `VenueType`, `AdminPermission`, `SubmissionStatus`, `DistributionStatus`, `BuilderStatus`
- **Models**: `HackathonTrack`, `CustomQuestion`, `HackathonGeneral`, `HackathonAdmin`, `HackathonPrize`, `HackathonPlacement`, `HackathonJudge`, `HackathonBuilder`, `HackathonProject`
- **Aggregate**: `Hackathon` — the root object tying everything together
- **Tab**: `HackathonDashboardTab` — union of the seven dashboard tab keys

---

## Design System

Uses the same CSS custom properties as the rest of the app (defined in `app/globals.css`). Light theme only.

- **Backgrounds**: `--bg`, `--bg-card`, `--bg-muted`, `--bg-hover`
- **Text**: `--text`, `--text-secondary`, `--text-muted`
- **Brand**: `--brand` / `--brand-fg`, `--accent`
- **Borders**: `--border`, `--border-hover`
- **Shadows**: `--shadow`, `--shadow-md`, `--shadow-lg`
- **Font**: Onest (via `--font-onest`)

---

## Dependencies

- **Organization module** (`app/src/organization/`) — hackathons are always created under an organization. The "Host a Hackathon" flow checks for an existing org first.
- **Auth module** (`app/src/auth/`) — signed-in state determines whether the "Host a Hackathon" button appears and who gets admin access.
- **Shared** (`app/src/shared/`) — API client, error handler, env config, UI factories.

---

## What's Implemented

- Folder scaffolding with placeholder page, layout, types, and this context file.
- All TypeScript types matching the `Docs/hackathon-flow.md` spec.

## What's Next (Not Yet Implemented)

- Listings page with hackathon cards, search, and filters
- Hackathon Dashboard UI (all seven tabs)
- `useHackathon` business-logic hook
- API service layer (`hackathonApi.ts`)
- Public hackathon detail page
- Rich-text editor integration for the Description tab
- Drag-and-drop track reordering
- Analytics charts for the Insights tab
- Judge invitation and judging workflow
- Prize distribution tracking

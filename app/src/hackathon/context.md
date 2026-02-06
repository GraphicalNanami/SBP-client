# Hackathon Feature — Context

Handles hackathon discovery (listings), creation, and full dashboard management. Organizers create hackathons under an existing organization. Public users can browse, filter, and view hackathon details without signing in.

---

## Route

- **Listings**: `/hackathon` → `app/src/hackathon/page.tsx`
- **Detail (public)**: `/hackathon/[id]` → `app/src/hackathon/[id]/page.tsx`
- **Dashboard (manage)**: `/hackathon/manage/[id]` → `app/src/hackathon/manage/[id]/page.tsx`
- **Preview**: `/hackathon/preview/[id]` → `app/src/hackathon/preview/[id]/page.tsx` *(NEW)*
- All routes mapped via `next.config.ts` wildcard rewrite: `/hackathon/:path*` → `/src/hackathon/:path*`
- Creating a new hackathon uses the special id `new`: `/hackathon/manage/new`

---

## Folder Structure

```
app/src/hackathon/
├── page.tsx                          # Listings page — grid of hackathon cards with search, filters, sort
├── layout.tsx                        # Layout wrapper (light theme, Onest font)
├── context.md                        # This file
├── [id]/
│   └── page.tsx                      # Public hackathon detail page (hero, info bar, description, tracks, prizes, resources)
├── manage/
│   └── [id]/
│       └── page.tsx                  # Dashboard management page (wires useHackathon hook to HackathonDashboard)
├── preview/                          # NEW: Preview functionality
│   └── [id]/
│       └── page.tsx                  # Preview page — read-only public view of draft hackathon
├── components/
│   ├── HackathonCard.tsx             # Card component used on the listings grid
│   ├── HackathonDashboard.tsx        # Full 7-tab management dashboard with aurora background + Preview button
│   ├── useHackathon.ts              # Business-logic hook (state, handlers, validation, sessionStorage sync)
│   └── mockData.ts                   # Mock hackathon data + filter/sort option constants
└── types/
    └── hackathon.types.ts            # Shared TypeScript interfaces and type aliases
```

---

## User Flow

### Listings Page (`/hackathon`)

1. User sees a hero header "Stellar Hackathons" with subtitle.
2. Below the hero: search bar, filter toggle, sort dropdown.
3. Filter panel expands to show category pills (Stellar-specific) and status pills.
4. Grid of hackathon cards — each shows poster gradient, status badge, org name, title, tagline, tags, prize pool, dates, venue, builder count.
5. Clicking a card → navigates to `/hackathon/[id]`.
6. "Host a Hackathon" button in the navbar → links to `/organization` (org required before creating).
7. Includes its own navbar and footer (independent of landing page).

### Public Detail Page (`/hackathon/[id]`)

1. Navbar with "← Back to Hackathons" link and "Join Hackathon" CTA (if not ended).
2. Hero section with gradient matching the card, org avatar, hackathon name, tagline, status/tags.
3. Key Info Bar: prize pool, timeline, venue, builder count.
4. Main content (left 2/3): About section, Tracks, Prizes breakdown.
5. Sidebar (right 1/3): Organizer card, Build Resources (Soroban docs, Stellar Laboratory, Horizon API, Freighter), Category & Tags.
6. Footer.

### Hackathon Dashboard (`/hackathon/manage/[id]`)

Entered from Organization Dashboard "Host a Hackathon" → `/hackathon/manage/new`, or from an existing hackathon's manage link.

**Header**: Back to Organization link, hackathon name, status badge, Preview button (opens in new tab), Save button, Submit for Review button.

**Preview Button**: Opens `/hackathon/preview/[id]` in a new tab, showing a read-only public view of the current draft state.

**7-tab navigation** (active tab highlighted with brand color):

| Tab | Key | Status |
|-----|-----|--------|
| General | `general` | ✅ Fully implemented — all form fields from spec |
| Tracks | `tracks` | ✅ Implemented — add/edit/delete with numbering |
| Description | `description` | ✅ Implemented — textarea with edit/preview toggle |
| Team & Access | `team` | ✅ Implemented — admin list, invite form, remove |
| Insights | `insights` | Placeholder — metric cards showing zeros, "available after publishing" |
| Participants | `participants` | Placeholder — empty state for Builders and Projects tables |
| Winners & Prizes | `winners` | Placeholder — empty states for Prizes, Judges, Winner Assignment |

**Aurora background**: The dashboard page uses the `.aurora-bg` CSS class — subtle radial gradients (violet, pink, green, blue at ~3–4.5% opacity) layered over `var(--bg)`.

### Hackathon Preview (`/hackathon/preview/[id]`) ✨ NEW

Accessed via the "Preview" button in the dashboard header. Opens in a new tab.

**Purpose**: Allows organizers to see exactly how their hackathon will appear to public users before publishing.

**Features**:
- Preview banner at top indicating "Preview Mode" with close button
- Full public hackathon view layout (matching `/hackathon/[id]` design)
- Hero section with gradient poster, status badge, organizer info, hackathon title
- Key info grid: prize pool, timeline, venue, builder count
- Main content sections: About, Tracks, Submission Requirements
- Sidebar: Organizer card, Build Resources, Category & Tags
- Data synced from dashboard via sessionStorage in real-time
- "Join Hackathon" button disabled in preview mode
- Close button returns to dashboard editor

**Data Flow**: The `useHackathon` hook syncs hackathon state to `sessionStorage` on every change. Preview page reads from `sessionStorage` key `hackathon-preview-{id}` on mount.

---

## File Details

### `components/mockData.ts`

Exports `HackathonCardData` interface and `MOCK_HACKATHONS` array (6 entries with realistic Stellar ecosystem data). Also exports `CATEGORY_OPTIONS`, `STATUS_OPTIONS`, and `SORT_OPTIONS` constants used by the listings page filters.

### `components/HackathonCard.tsx`

Pure UI card component. Takes a `HackathonCardData` object and renders:
- Gradient poster area (deterministic color based on name)
- Status badge, org overlay
- Title, tagline, category pill, tags
- Meta row: prize, dates, venue, builders

Wraps the entire card in a `Link` to `/hackathon/[id]`.

### `components/HackathonDashboard.tsx`

~640 lines. The main management UI. Contains:

**Header Actions**:
- Back to Organization link
- Hackathon name and status badge
- **Preview button** — Opens `/hackathon/preview/[id]` in new tab with ExternalLink icon
- Save button with loading state and success feedback
- Submit for Review button (disabled until `canPublish` criteria met)

**Shared UI**: `Card`, `SectionTitle`, `Label`, `inputClass`, `textareaClass`, `selectClass` — same patterns as OrganizationDashboard.

**Tab components** (not exported, internal):
- `GeneralTab` — Full form: name, category, visibility, poster upload, prize pool + asset, tags (add/remove), start time, deadline, pre-reg time (all with UTC timezone helper text), venue type + location, submission requirements, admin contact. Right column: summary card + publish checklist.
- `TracksTab` — Add/delete tracks with numbered cards, name + description per track.
- `DescriptionTab` — Textarea editor with Edit/Preview toggle. Markdown hint.
- `TeamTab` — Admin list with inline invite form. Permission selection (Full/Limited). Creator cannot be removed.
- `InsightsTab` — 6 metric cards with zero values. "Available after publishing" banner for drafts.
- `ParticipantsTab` — Empty states for Builders and Projects sections.
- `WinnersTab` — Prize form (add prize with name*, track multi-select, description*) + Judge invite form (name*, email*, track assignment) + empty states for Winner Assignment & Distribution.

### `components/useHackathon.ts`

Central business-logic hook. All state lives here; UI components are pure.

**State:**
- `hackathon: Hackathon` — the full hackathon object
- `activeTab: HackathonDashboardTab` — current tab
- `isSaving / saveSuccess` — save feedback

**SessionStorage Sync**: 
- Uses `useEffect` to sync hackathon state to `sessionStorage` with key `hackathon-preview-{id}` on every change
- Enables real-time preview updates when editing in dashboard

**Derived:**
- `isNew` — whether the id is `"new"`
- `canPublish` — computed from required field validation

**Handlers (all `useCallback`):**
| Handler | Purpose |
|---------|---------|
| `updateGeneral(field, value)` | Update any field on `hackathon.general` |
| `updateDescription(value)` | Update the rich-text description |
| `addTrack()` | Append a new empty track |
| `updateTrack(id, field, value)` | Modify a track's name/description |
| `removeTrack(id)` | Delete a track and reorder |
| `addAdmin(email, permission)` | Add a new admin |
| `removeAdmin(id)` | Remove an admin |
| `addTag(tag)` / `removeTag(tag)` | Manage general.tags array |
| `handleSave()` | Save hackathon (create if new, update if existing) |
| `handleSubmitForReview()` | Submit hackathon for platform admin review |

### `types/hackathon.types.ts`

All types from `Docs/hackathon-flow.md`:
- Enums: `HackathonStatus`, `HackathonVisibility`, `HackathonCategory` (Stellar-specific), `VenueType`, `AdminPermission`, `SubmissionStatus`, `DistributionStatus`, `BuilderStatus`
- Models: `HackathonTrack`, `CustomQuestion`, `HackathonGeneral`, `HackathonAdmin`, `HackathonPrize`, `HackathonPlacement`, `HackathonJudge`, `HackathonBuilder`, `HackathonProject`
- Aggregate: `Hackathon`
- Tab: `HackathonDashboardTab`

---

## Design System

Light theme only. Uses CSS custom properties from `app/globals.css`:
- **Backgrounds**: `--bg`, `--bg-card` (white), `--bg-muted`, `--bg-hover`
- **Text**: `--text`, `--text-secondary`, `--text-muted`
- **Brand**: `--brand` / `--brand-fg`, `--accent`
- **Borders**: `--border`, `--border-hover`
- **Shadows**: `--shadow`, `--shadow-md`, `--shadow-lg`
- **Font**: Onest via `var(--font-onest)`
- **Dashboard bg**: `.aurora-bg` (subtle multi-color radial gradients)

Card style: `rounded-2xl border bg-white p-6 shadow`. Inputs: `rounded-full h-[46px]`. Buttons: `rounded-full` with brand colors. Consistent with Organization module styling.

---

## Dependencies

- **Organization module** (`app/src/organization/`) — hackathons are created under an org. The org dashboard's "Host a Hackathon" CTA links to `/hackathon/manage/new`.
- **Auth module** (`app/src/auth/`) — determines "Host a Hackathon" visibility and admin assignment.
- **Shared** (`app/src/shared/`) — API client, error handler, env config.
- **lucide-react** — all icons.
- **next/link**, **next/navigation** — routing.

---

## What's Next (Not Yet Implemented)

- **API integration** — All state is client-side mock. Wire to backend endpoints for CRUD.
- **Rich-text editor** — Description tab currently uses a plain textarea. Integrate TipTap or similar.
- **Drag-and-drop tracks** — Track reordering via DnD library.
- **Image upload** — Poster upload is a visual placeholder.
- **Insights charts** — Integrate a charting library for the analytics tab.
- **Participants tables** — Full CRUD tables with search, filter, CSV export.
- **Prize management** — Full CRUD for prizes, placements, and payout tracking.
- **Judge workflow** — Invite judges, assign tracks, set deadlines.
- **Winner assignment** — Project selection per prize placement.
- **Custom questions** — Dynamic form builder for registration questions.
- **Hackathon state transitions** — Draft → Under Review → Active → Ended with proper guards.
- **Persistent storage** — localStorage or backend for draft preservation.

---

---

## Backend Integration

### API Service (`@/src/shared/lib/api/hackathonApi.ts`)

All hackathon operations use the centralized API client with automatic token injection and error handling.

**Key Methods:**
- `createHackathon(general, organizationId)` - Create new hackathon
- `getHackathon(id)` - Fetch hackathon by ID
- `getOrganizationHackathons(orgId)` - List hackathons for an organization
- `updateGeneral(id, updates)` - Update hackathon general info
- `createTrack(hackathonId, payload)` - Add a track
- `updateTrack(hackathonId, trackId, payload)` - Update a track
- `deleteTrack(hackathonId, trackId)` - Delete a track
- `inviteAdministrator(hackathonId, payload)` - Invite admin
- `submitForReview(id)` - Submit for platform approval
- `getInsights(hackathonId)` - Fetch analytics data

**Data Transformation:**
- Frontend uses human-readable types (e.g., `'Draft'`, `'Public'`, `'DeFi on Stellar'`)
- Backend uses UPPERCASE enums (e.g., `'DRAFT'`, `'PUBLIC'`, `'DEFI'`)
- `hackathonApi` handles bidirectional transformation automatically via utility functions:
  - `transformCategory()` / `transformCategoryToBackend()`
  - `transformVisibility()` / `transformVisibilityToBackend()`
  - `transformStatus()`
  - `transformHackathon()` - Complete transformation from backend to frontend format

### Backend Types (`types/backend.types.ts`)

Defines exact backend schema types matching the NestJS API:
- **Enums**: `BackendHackathonStatus`, `BackendHackathonCategory`, `BackendHackathonVisibility`, etc.
- **Schema Interfaces**: `BackendHackathon`, `BackendTrack`, `BackendPrize`, `BackendCustomQuestion`, etc.
- **API Payloads**: `CreateHackathonPayload`, `UpdateHackathonGeneralPayload`, `TrackPayload`, etc.
- **Response Types**: `PaginatedHackathonsResponse`, etc.

### API Endpoints (`@/src/shared/lib/api/endpoints.ts`)

Comprehensive endpoint definitions for:
- **Public**: List hackathons, get detail by slug
- **Organizer**: CRUD operations, submit for review, cancel, archive
- **Tracks**: CRUD operations for tracks
- **Custom Questions**: CRUD operations for registration questions
- **Prizes**: CRUD operations for prizes and placements
- **Administrators**: Invite, update permissions, remove
- **Judges**: Invite, assign tracks, remove
- **Winners**: Assign winners, update distribution, remove
- **Analytics**: Insights, daily trends, traffic sources
- **Registrations**: List, export (organizer view)
- **Submissions**: List, get detail, update status (organizer view)

### Status Transitions

Backend enforces valid state transitions:
1. `DRAFT` → `UNDER_REVIEW` (when "Submit for Review" clicked)
2. `UNDER_REVIEW` → `APPROVED` | `REJECTED` (platform admin action)
3. `REJECTED` → `DRAFT` (organizer can re-edit and resubmit)
4. `APPROVED` → `ENDED` | `CANCELLED`
5. `ENDED` (terminal, results phase begins)
6. `CANCELLED` (terminal)

---

## Recent Changes

### February 6, 2026 - Submit for Review Integration
- ✅ **Integrated Submit for Review functionality**:
  - Added `handleSubmitForReview()` method to `useHackathon` hook
  - Connected "Submit for Review" button in dashboard header to API endpoint
  - Button validates required fields before submitting (calls `canPublish`)
  - Shows validation errors if hackathon is new or fields are incomplete
  - Calls `POST /hackathons/:id/submit-for-review` endpoint
  - Updates hackathon status to `UNDER_REVIEW` on success
  - Button disabled when saving or when required fields are incomplete
- **Status Flow**:
  - `DRAFT` → `UNDER_REVIEW` (when organizer clicks "Submit for Review")
  - `REJECTED` → `UNDER_REVIEW` (when organizer resubmits after fixing issues)
- **Validation**: Must save hackathon first, complete all required fields, and have at least one track
- **Error Handling**: Shows validation errors for 400/403 responses, fatal errors for network/server issues
- **Data Flow**: User clicks Submit → `handleSubmitForReview()` → `hackathonApi.submitForReview()` → API updates status → UI shows success feedback

### February 6, 2026 - UUID Migration
- 🔄 **Migrated from MongoDB ObjectId (_id) to UUID (uuid)**:
  - Updated `BackendHackathon` interface to use `uuid` instead of `_id` for main document
  - Updated `BackendOrganization` interface to use `uuid` instead of `_id`
  - **Subdocuments remain with `_id`**: `BackendTrack`, `BackendPrize`, `BackendCustomQuestion` still use `_id` (embedded MongoDB subdocuments)
  - Updated all transformation functions in `hackathonApi.ts` and `organizationApi.ts`
  - Fixed organization creation errors and hackathon routing by properly handling `uuid` field
- **ID Structure**:
  - Main documents (Hackathon, Organization): Use `uuid` (e.g., `"uuid": "eacb95b9-5b07-4951-8711-8f2d8bbca4e2"`)
  - Embedded subdocuments (Tracks, Prizes, Questions): Use `_id` (MongoDB ObjectId for subdocuments)
- **Data Flow**: Backend sends `uuid` for main docs → Frontend transforms to `id` → UI uses UUID consistently

### February 6, 2026 - Comprehensive Update Endpoint Integration
- ✨ **Implemented comprehensive hackathon update functionality**:
  - Added `UpdateHackathonPayload` type to `backend.types.ts` with all updateable fields
  - Added `UPDATE` endpoint to `endpoints.ts` pointing to `PATCH /hackathons/:id`
  - Created `transformToUpdatePayload()` function to convert frontend Hackathon to backend payload
  - Added `updateHackathon()` method to `hackathonApi` for comprehensive updates
  - Updated `handleSave()` in `useHackathon` to use the new comprehensive update method
- 🔄 **Save button now updates all hackathon data** including:
  - Basic information (name, category, visibility, poster, prize pool, tags, etc.)
  - Timeline (start time, pre-registration end, submission deadline)
  - Tracks (creates new tracks, updates existing ones by _id)
  - Prizes (creates new prizes, updates existing ones by _id)
  - Custom registration questions (creates new, updates existing by _id)
  - Submission requirements (custom instructions)
- **Data Flow**: User edits → Click Save → `handleSave()` → `updateHackathon()` → `transformToUpdatePayload()` → PATCH `/hackathons/:id` → Response transformed back → UI updated
- **Backward Compatibility**: `updateGeneral()` method retained for targeted updates if needed

### February 6, 2026 - Organization Context & Backend Response Fix
- 🐛 **Fixed organization context flow** for hackathon creation:
  - Updated "Host a Hackathon" link in OrganizationDashboard to pass `orgId` query parameter
  - Link now correctly navigates to `/hackathon/manage/new?orgId={activeOrgId}`
  - Added `useEffect` in `useHackathon` hook to update `organizationId` when it changes
  - Prevents "Invalid organization" error when creating new hackathons
  - Ensures hackathon is always created under the correct organization from which the button was clicked
- 🐛 **Fixed backend transformation errors**:
  - Updated `transformHackathon` to handle actual backend response structure
  - Fixed field name mismatch: backend returns `customRegistrationQuestions` not `customQuestions`
  - Added safe fallbacks for optional arrays (`tracks`, `prizes`, `tags`)
  - Added optional chaining for nested objects (`submissionRequirements?.customInstructions`)
  - Updated `BackendHackathon` type to match actual API response with optional fields
- **Flow**: User selects org → clicks "Host a Hackathon" → orgId is passed → hackathon is created under that org → backend response is correctly transformed

### February 6, 2026 - Backend Integration Completed
- ✅ Created complete backend type definitions (`types/backend.types.ts`)
- ✅ Implemented `hackathonApi` service with full CRUD operations
- ✅ Added hackathon endpoints to centralized endpoints configuration
- ✅ Set up bidirectional data transformation layer
- ✅ Mapped all frontend types to backend schema
- ✅ Documented API integration in context.md
- 🔄 **Next**: Update `useHackathon` hook to integrate with `hackathonApi` service
- 🔄 **Next**: Update `HackathonDashboard` component to handle API errors and loading states

### February 6, 2026 - Dashboard Forms & UTC Timezone Enhancement
- ✨ **Added Prize form** to Winners & Prizes tab:
  - Click "Add Prize" opens inline form with Cancel/Add Prize actions
  - Prize name* input (required)
  - Track selection with multi-select checkboxes (Select All/Deselect All toggle)
  - Prize description* textarea (required)
  - Form validation with error messages
  - Empty state shows when no prizes configured
- ✨ **Added Judge invite form** to Winners & Prizes tab:
  - Click "Invite Judge" opens inline form with Cancel/Send Invite actions
  - Judge name* input (required)
  - Email* input with validation (required)
  - Track assignment with multi-select checkboxes
  - Form validation with error messages for name and email
  - Empty state shows when no judges invited
- 🌐 **Added UTC timezone helper text** to all date/time fields in General tab:
  - Start Time: "Time will be stored in UTC"
  - Submission Deadline: "Time will be stored in UTC"
  - Pre-registration End Time (optional): "Time will be stored in UTC"
  - Helper text appears below each datetime-local input
- Updated `WinnersTab` component with state management for both forms
- Added handlers: `handleAddPrize()`, `handleInviteJudge()`, `handleJudgeTrackToggle()`
- Forms follow same pattern as TeamTab invite form for consistency
- Updated context.md with all new functionality

### February 6, 2026 - Preview Feature Added
- ✨ **Added Preview functionality** for hackathon organizers to preview their draft hackathon
- Created new route: `/hackathon/preview/[id]` with full public view layout
- Added "Preview" button to dashboard header (opens in new tab with ExternalLink icon)
- Implemented real-time data sync using sessionStorage
- Preview page shows:
  - Preview mode banner with close button
  - Hero section with gradient poster and hackathon info
  - Key info grid (prize pool, timeline, venue, builders)
  - Main content: About, Prizes, Tracks, Submission Requirements
  - Sidebar: Organizer card, Build Resources, Category & Tags
- Updated `useHackathon` hook to sync state to sessionStorage on every change
- Preview page reads from sessionStorage and falls back to empty structure if not found
- Disabled "Join Hackathon" button in preview mode
- Section reordering: Prizes now appears before Tracks in both preview and public detail pages
- Updated context.md with full documentation of the preview feature

### February 7, 2026 - Public Hackathons API Integration
- ✅ **Integrated public hackathons listing with backend API**:
  - Updated endpoint to `/hackathons/public/list` to match backend specification
  - Added `PublicHackathonsQuery` and `PublicHackathonsResponse` types to `backend.types.ts`
  - Updated `hackathonApi.listPublicHackathons()` to use correct query parameters (`filter`, `limit`, `offset`)
  - Created `transformHackathonToCard()` function to map backend data to card format
  - Updated `/hackathon` page to fetch from API instead of using mock data
  - Added loading state with spinner animation
  - Added error state with retry functionality
  - Implemented real-time filtering based on backend `filter` parameter (all/upcoming/ongoing/past)
- **API Filter Mapping**:
  - Frontend "Upcoming" → Backend `filter=upcoming`
  - Frontend "Ongoing" → Backend `filter=ongoing`
  - Frontend "Ended" → Backend `filter=past`
  - Frontend "All" → Backend `filter=all`
- **Data Flow**: Page loads → API fetch → Transform to card format → Display in grid
- **Environment**: Requires `NEXT_PUBLIC_API_URL=http://localhost:3001` in `.env.local`
- **Status Determination**: Card status calculated from `startTime`, `submissionDeadline`, and backend `status`
- **Analytics**: Builder and project counts pulled from backend `analytics` or `analyticsTracking` fields
- Client-side search and category filtering still applied after fetching from API

### February 7, 2026 - Hackathon Detail Page API Data Integration
- ✅ **Aligned hackathon detail page with actual API response**:
  - Added `fullHackathon` state to store complete `Hackathon` object from API
  - Updated About section to display actual `description` from API instead of mocked content
  - Added **Tracks section** displaying all tracks from API with numbered cards
  - Added **Submission Requirements section** showing custom instructions from API
  - Updated **Prizes section** to show actual prize data when available, fallback to calculated prizes
  - Updated **Timeline section** to include pre-registration end time when present
  - Connected "Contact the Host" button to actual `adminContact` email with mailto link
  - Updated Build Resources links to point to real Stellar documentation URLs
- **Data Flow**:
  - Page fetches full hackathon via `hackathonApi.getPublicHackathon(slug)`
  - Stores both card format (for compatibility) and full format (for detailed data)
  - UI renders tracks, description, submission requirements directly from API response
- **Dynamic Content**: Description, tracks, prizes, and submission requirements now come from backend
- **Graceful Fallbacks**: Shows calculated prize breakdown if no structured prizes exist in API
- **Organization Info**: Using placeholder "Stellar Community" until organization data endpoint is integrated

### February 7, 2026 - Poster Image Integration for Hackathon Cards
- ✅ **Updated HackathonCard component to display poster images from API**:
  - **Featured Cards**: Use `posterUrl` as full background image when available
    - Applies darker overlay (from-black/70 via-black/40 to-black/20) for better text readability
    - Falls back to gradient background if no poster exists
    - Maintains white text on all backgrounds
  - **Regular Cards**: Display poster as thumbnail at top of card when available
    - Shows 128px height thumbnail with poster as background
    - Status badge overlays on top-right of poster
    - Falls back to pastel category colors if no poster exists
    - Card content (title, tagline, meta) remains below thumbnail
- **API Integration**:
  - Backend sends `posterUrl` field in hackathon response
  - Frontend transforms to `poster` field via `transformHackathon()` function
  - Cards check `hackathon.poster` and conditionally render image backgrounds
- **Visual Improvements**:
  - Featured cards now show actual hackathon branding via poster images
  - Regular cards have consistent thumbnail + content layout
  - Better visual hierarchy with real imagery vs solid colors

### February 7, 2026 - Image Proxy for ngrok URLs
- ✅ **Created image proxy endpoint to bypass ngrok browser warning**:
  - **Problem**: ngrok requires `ngrok-skip-browser-warning` header for all requests
  - CSS `background-image` cannot set custom headers, causing images to fail loading
  - **Solution**: Created `/api/image-proxy` route that proxies images with proper headers
- **Implementation**:
  - Created `app/api/image-proxy/route.ts` - Next.js API route that fetches images with ngrok header
  - Created `getProxiedImageUrl()` utility in `@/src/shared/utils/image-proxy.ts`
  - Automatically detects ngrok URLs and proxies them through local endpoint
  - Non-ngrok URLs are returned as-is (no unnecessary proxying)
- **Updated Components**:
  - `HackathonCard` (featured & regular) now use `getProxiedImageUrl()`
  - Hackathon detail page banner now uses `getProxiedImageUrl()`
- **Caching**: Proxy endpoint sets `Cache-Control: public, max-age=31536000, immutable` for performance
- **Data Flow**:
  ```
  ngrok image URL → getProxiedImageUrl() → /api/image-proxy?url=...
  → Fetch with ngrok header → Return image to browser
  ```


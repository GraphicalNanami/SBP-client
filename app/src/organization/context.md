# Organization Feature — Context

Handles organization creation, dashboard management, multi-org switching, and team management. Users must create and configure an organization before they can create hackathons on the Stellar platform. A single user can own or belong to multiple organizations and switch between them seamlessly.

---

## Route

- **URL**: `/organization` (mapped via `next.config.ts` rewrite from the physical path `/src/organization`)
- **Entry point**: `app/page.tsx` imports `OrganizationPage` from `./src/organization/page` and renders it at `/`
- The rewrite ensures `/organization` also resolves to this page

---

## Folder Structure

```
app/src/organization/
├── page.tsx                          # Page component — orchestrates the two-step flow
├── context.md                        # This file
├── components/
│   ├── OrganizationForm.tsx          # Step 1: Full-page creation form
│   ├── OrganizationDashboard.tsx     # Step 2: Dashboard with all management panels
│   └── useOrganization.ts           # Business-logic hook powering both steps
└── types/
    └── organization.types.ts         # Shared TypeScript interfaces and type aliases
```

---

## User Flow

### Step 1 — Organization Creation (`OrganizationForm`)

1. User visits `/organization` for the first time (no existing orgs).
2. A centered single-column form is displayed with three fields:
   - **Organization Name** (text, required)
   - **Website URL** (url, required, validated against `https://...` pattern)
   - **Terms Agreement** (checkbox, required — must agree to Stellar T&C)
3. Client-side validation runs on submit. Errors are displayed inline below each field.
4. On valid submit → the hook creates the org, auto-adds the current user as Admin, and transitions to the dashboard.

### Step 2 — Organization Dashboard (`OrganizationDashboard`)

After creation, the user lands on the dashboard. The dashboard is divided into:

**Header (sticky)**
- **Org Switcher** (left): Displays the active org name, website, and an "Active" badge. Click opens a dropdown listing all organizations the user owns. The dropdown includes:
  - All existing orgs (click to switch, checkmark on the active one)
  - "Create New Organization" button (navigates back to the create form)
- **Action pills** (right): Member count, org count (if >1), and the Save Changes button

**Main Content (3-column grid)**

Left column (2/3 width):
1. **Organization Profile** — Logo upload placeholder, name, tagline, and about textarea
2. **Social Links** — Six URL fields: X (Twitter), Telegram, GitHub, Discord, LinkedIn, Website
3. **Team Members** — Full CRUD table with:
   - Member list showing avatar, name, email, role badge, join date
   - Role management: Owner's role is locked; other members have a dropdown (Admin/Editor/Viewer)
   - Remove button per non-owner member
   - "Invite Member" button → opens the **InviteModal**
   - Empty state with illustration when no members exist

Right column (1/3 width):
1. **Quick Info** — Read-only summary card (name, website, tagline, team size)
2. **Create Hackathon CTA** — Styled card with "Coming Soon" disabled button (placeholder for future hackathon creation flow)

**InviteModal (overlay)**
- Email input with validation
- Role selection (Admin / Editor / Viewer) via pill buttons
- Cancel and Send Invite actions

---

## File Details

### `page.tsx`

The page component. Marked `'use client'` because it uses the `useOrganization` hook. It reads `step` from the hook:
- `step === 'create'` → renders `<OrganizationForm>`
- `step === 'dashboard'` → renders `<OrganizationDashboard>`

All state and handlers are destructured from the hook and passed down as props. The page itself has no local state — it purely wires the hook to the UI.

### `components/useOrganization.ts`

The central business-logic hook. All state lives here; UI components are pure.

**State:**
- `step: 'create' | 'dashboard'` — controls which UI is shown
- `organizations: OrganizationProfile[]` — array of all created organizations
- `activeOrgId: string | null` — ID of the currently selected org
- `isSaving / saveSuccess` — loading and feedback state for the save action

**Derived:**
- `profile` — the active organization, derived via `useMemo` from the `organizations` array and `activeOrgId`. Falls back to an empty profile if no org is selected.

**Handlers (all wrapped in `useCallback`):**
| Handler | Purpose |
|---------|---------|
| `handleCreate(payload)` | Creates a new org from the form payload, adds default Admin member, sets it active, transitions to dashboard |
| `handleSwitchOrg(orgId)` | Switches to another organization by updating `activeOrgId` |
| `handleStartCreateNew()` | Transitions back to the create form (sets `step = 'create'`) |
| `handleProfileChange(field, value)` | Updates a profile field on the active org |
| `handleSocialChange(field, value)` | Updates a social link field on the active org |
| `handleAddMember(email, role)` | Adds a new team member to the active org |
| `handleRemoveMember(memberId)` | Removes a team member from the active org |
| `handleUpdateMemberRole(memberId, role)` | Changes a member's role on the active org |
| `handleSave()` | Simulates an API save (800ms delay, sets success feedback for 2s) |

All mutation handlers are scoped to `activeOrgId` — they only modify the organization that's currently active.

**API integration note:** `handleSave` currently uses a mock `setTimeout`. When the backend is ready, replace the body with an actual API call. All org mutations already update `organizations[]` in-place, so persisting can be done in `handleSave` by sending the active org's profile to the server.

### `components/OrganizationForm.tsx`

Pure UI component for the creation step.

**Props:** `onSubmit: (payload: OrganizationCreatePayload) => void`

**Local state:** `name`, `website`, `termsAccepted`, `errors`

**Validation rules:**
- Name: required, trimmed
- Website: required, must match `https://...` URL pattern
- Terms: checkbox must be checked

**UI:** Centered card (`max-w-[440px]`), rounded-full inputs matching the platform design system, brand-colored submit button, footer with Terms/Privacy links. Fully responsive, supports light and dark themes via CSS variables.

**Icons used:** `ArrowRight`, `Check` (from lucide-react)

### `components/OrganizationDashboard.tsx`

The main dashboard UI. This is the largest file (~705 lines) and contains several internal sub-components:

**Props interface (`OrganizationDashboardProps`):**
| Prop | Type | Description |
|------|------|-------------|
| `profile` | `OrganizationProfile` | The active organization's full data |
| `organizations` | `OrganizationProfile[]` | All organizations (for the switcher) |
| `activeOrgId` | `string \| null` | Currently selected org ID |
| `isSaving` | `boolean` | Whether save is in progress |
| `saveSuccess` | `boolean` | Whether save just succeeded (shows feedback) |
| `onProfileChange` | `(field, value) => void` | Update a profile field |
| `onSocialChange` | `(field, value) => void` | Update a social link |
| `onAddMember` | `(email, role) => void` | Add a team member |
| `onRemoveMember` | `(memberId) => void` | Remove a team member |
| `onUpdateMemberRole` | `(memberId, role) => void` | Change a member's role |
| `onSwitchOrg` | `(orgId) => void` | Switch active organization |
| `onCreateNew` | `() => void` | Navigate to create form |
| `onSave` | `() => void` | Trigger save |

**Internal sub-components (not exported):**
| Component | Purpose |
|-----------|---------|
| `Card` | Styled section wrapper with border, shadow, and padding |
| `SectionTitle` | Consistent heading for card sections |
| `RoleBadge` | Colored pill displaying a role (Admin=purple, Editor=blue, Viewer=gray) |
| `RoleSelect` | Dropdown for changing a member's role with click-outside-to-close |
| `InviteModal` | Full-screen overlay with email input, role selector, and validation |
| `Avatar` | Circular initial-based avatar with deterministic color based on name |

**Constants:**
- `SOCIAL_FIELDS` — array defining the six social link inputs (key, label, icon, placeholder)
- `ROLE_OPTIONS` — array defining the three role options with icons
- `inputClass` — shared Tailwind class string for all text inputs

**Icons used:** `Save`, `Check`, `Loader2`, `Building2`, `ImagePlus`, `Twitter`, `Github`, `Linkedin`, `Globe`, `MessageCircle`, `Hash`, `Users`, `Rocket`, `ArrowRight`, `UserPlus`, `Trash2`, `ChevronDown`, `Shield`, `Pencil`, `Eye`, `X`, `Mail` (all from lucide-react)

### `types/organization.types.ts`

All shared TypeScript definitions:

```
OrganizationCreatePayload
├── name: string
├── website: string
└── termsAccepted: boolean

OrganizationProfile
├── id: string                    (unique, generated as "org-{timestamp}")
├── name: string
├── logo: string                  (URL or empty)
├── tagline: string
├── about: string
├── website: string
├── socialLinks: SocialLinks
└── teamMembers: TeamMember[]

SocialLinks
├── x: string
├── telegram: string
├── github: string
├── discord: string
├── linkedin: string
└── website: string

TeamMember
├── id: string                    (unique, generated as "member-{timestamp}")
├── email: string
├── name: string                  (derived from email prefix on invite)
├── role: 'Admin' | 'Editor' | 'Viewer'
├── avatarUrl?: string            (optional, unused currently)
└── joinedAt: string              (ISO timestamp)

OrganizationStep = 'create' | 'dashboard'
```

---

## Design System

All components use CSS custom properties defined in `app/globals.css` for consistent theming:

- **Backgrounds:** `--bg`, `--bg-card`, `--bg-muted`, `--bg-hover`
- **Text:** `--text`, `--text-secondary`, `--text-muted`
- **Brand:** `--brand` (primary), `--brand-fg` (text on brand), `--accent`
- **Borders:** `--border`, `--border-hover`
- **Feedback:** `--error`, `--success`
- **Shadows:** `--shadow`, `--shadow-md`, `--shadow-lg`

The app supports **light theme only** (dark theme has been removed from `globals.css`). All inputs use rounded-full pill style. Buttons follow brand colors with hover opacity and active scale transforms.

**Font:** Onest (loaded via `next/font/google` in `app/layout.tsx`)

---

## What's Next (Not Yet Implemented)

- **Hackathon Creation** — The "Create Hackathon" CTA in the dashboard sidebar is currently a disabled placeholder. The full hackathon creation flow (basic details, tracks, details, administrators, analytics, registration, judging & results) is specified in `Docs/organization-flow.md` but not yet built.
- **API Integration** — All state is currently client-side only (in-memory via React state). The `handleSave` function is a mock. Backend endpoints need to be wired for persistence.
- **Authentication** — No auth guard exists yet. The dashboard should eventually be behind login and the current user's email should replace the `'you@example.com'` placeholder.
- **Logo Upload** — The logo upload area is a visual placeholder. File upload and image cropping need implementation.
- **Persistent Storage** — Organizations are lost on page refresh. Either localStorage or backend persistence should be added.

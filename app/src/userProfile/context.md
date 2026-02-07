# User Profile Feature - Context & Documentation

## Purpose
User profile management system with dropdown navigation and settings pages for personal info, social accounts (GitHub, Twitter), professional experience, and Freighter wallet management.

## User Stories
- As an authenticated user, I want to see my profile avatar in the navbar
- As an authenticated user, I want to access settings via dropdown menu
- As a user, I want to edit my personal information and upload a profile picture
- As a user, I want to connect my GitHub and Twitter accounts
- As a user, I want to showcase my experience and skills
- As a user, I want to add and manage my Freighter wallet
- As a user, I want to easily log out from the dropdown menu

## Key Components

### Profile Dropdown (`ProfileDropdown.tsx`)
Displays user avatar with gradient background and dropdown menu. Shows user name, email, navigation links (My Hackathons, My Events, Settings), and logout button. Closes when clicking outside.

### Settings Layout (`SettingsLayout.tsx`)
Main settings page with left sidebar navigation and right content area. Sidebar shows: Personal Info, Social Accounts, Experience, and Wallets tabs. Light beige background with active tab indicator.

### Personal Info (`PersonalInfoSettings.tsx`)
Edit profile information including:
- Profile picture upload (circular, 160px)
- First and last name
- Email address
- Gender selection
- City and country
- Personal website URL

### Social Accounts (`SocialAccountsSettings.tsx`)
Connect GitHub and Twitter accounts. Shows connection status with badges. GitHub displays username, Twitter shows handle. OAuth flow for connections.

### Experience (`ExperienceSettings.tsx`)
Track professional background:
- Role tags (Backend Engineer, Blockchain Engineer, etc.)
- Years of coding experience
- Ethereum/Web3 skill level
- Programming languages (JavaScript, Solidity, Rust, etc.)
- Developer tools (Hardhat, Foundry, ethers.js, etc.)

Chip-based interface with removable tags.

### Wallets (`WalletsSettings.tsx`)
Manage Freighter wallets:
- Add wallet button connects Freighter extension
- Display wallet addresses with nicknames
- Verified and Primary badges
- Three-dot menu for options

### My Events Page (`my-events/page.tsx`)
**NEW - 2026-02-07**: Display all events the user has registered for:
- Fetches registrations via `GET /live-events/me/registrations`
- Auth guard (redirects to sign-in if not authenticated)
- Grid layout of registered event cards (2 columns on large screens)
- Each card shows:
  - Event banner image with status badge
  - Event title, description, dates, location
  - Registration count
  - Event tags
  - Registration date
  - Action buttons: "View Details" and "Unregister"
  - External event website link
- Empty state with CTA to browse events
- Responsive design with mobile-first approach
- Loading and error states
- Accessible from profile dropdown menu

## Recent Changes
- 2026-02-07: Created My Events page with registration management
- 2026-02-07: Integrated My Events link in ProfileDropdown (removed "Coming Soon" badge)
- 2026-02-07: Added auth gating for My Events page
- Set primary wallet for transactions

## Data Flow
1. User logs in and is redirected to landing page
2. Navbar shows profile dropdown instead of auth buttons
3. User clicks avatar to open dropdown menu
4. User navigates to Settings from dropdown
5. Settings page loads with sidebar navigation
6. User selects a tab (Personal Info, Social Accounts, Experience, or Wallets)
7. User edits information and saves
8. Data is validated and sent to backend
9. Success message shown, UI updates

## Dependencies
- `@/src/auth/hooks/useAuth` - Authentication state
- `@stellar/freighter-api` - Freighter wallet integration
- `lucide-react` - Icons
- `next/link` and `next/image` - Next.js utilities
- React hooks for state management

## Routes
- `/dashboard/settings` - Main settings page
- `/dashboard/settings/personal-info` - Personal information
- `/dashboard/settings/social-accounts` - GitHub and Twitter connections
- `/dashboard/settings/experience` - Skills and experience
- `/dashboard/settings/wallets` - Freighter wallet management

## Edge Cases & Validation
- Email must be valid format
- Website URLs validated before saving
- Profile images limited to 5MB (JPG, PNG, WebP)
- Wallet addresses validated for Stellar format
- Cannot delete primary wallet without setting another as primary
- Freighter extension required for wallet connection
- OAuth timeouts handled gracefully
- Form auto-saves on blur with debounce

## Feature Module Structure
```
userProfile/
├── components/
│   ├── userProfileUI/         # Pure UI components (presentation only)
│   │   ├── SettingsLayout.tsx
│   │   ├── ProfileDropdown.tsx
│   │   ├── PersonalInfoForm.tsx
│   │   ├── ExperienceForm.tsx
│   │   ├── WalletCard.tsx
│   │   └── WalletsManager.tsx
│   └── userProfileService/    # Business logic, hooks, API calls
│       ├── profile-service.ts
│       ├── experience-service.ts
│       ├── wallet-service.ts
│       ├── freighter-service.ts
│       ├── useProfile.ts
│       ├── useExperience.ts
### Profile Endpoints
- **GET /profile/me** → Returns `{ user, profile, experience, wallets }` with complete user data
- **PATCH /profile/personal-info** → Updates firstName, lastName, gender, city, country, website
- **POST /profile/upload-picture** → Uploads profile picture (FormData, max 5MB)

### Experience Endpoints
- **GET /experience/me** → Returns user's experience data
- **PUT /experience** → Replaces entire experience record
- **PATCH /experience** → Partially updates experience (add/remove tags)

### Wallet Endpoints
- **GET /wallets** → Returns all wallets for current user
- **POST /wallets** → Adds new wallet, returns wallet + challenge for verification
- **PATCH /wallets/:id** → Updates wallet nickname
- **DELETE /wallets/:id** → Removes wallet
- **POST /wallets/:id/verify** → Verifies wallet ownership via signature
- **POST /wallets/:id/set-primary** → Sets wallet as primary, unsets others

  ├── profile.types.ts       # UserProfile, UpdatePersonalInfoPayload, ProfileMeResponse
│   ├── experience.types.ts    # Experience, UpdateExperiencePayload, predefined lists
│   └── wallet.types.ts        # Wallet, AddWalletPayload, VerifyWalletPayload
├── context.md
└── page.tsx
```

## API Integration

### Profile Endpoints
- **GET /profile/me** → Returns `{ user, profile, experience, wallets }` with complete user data
- **PATCH /profile/personal-info** → Updates firstName, lastName, gender, city, country, website
- **POST /profile/upload-picture** → Uploads profile picture (FormData, max 5MB, JPEG/PNG/WebP)

### Experience Endpoints
- **GET /experience/me** → Returns user's experience data (roles, years, skill level, languages, tools)
- **PUT /experience** → Replaces entire experience record with new data
- **PATCH /experience** → Partially updates experience (useful for add/remove tags)

### Wallet Endpoints
- **GET /wallets** → Returns all wallets for current user with verification status
- **POST /wallets** → Adds new wallet, returns wallet + challenge for signature verification
- **PATCH /wallets/:id** → Updates wallet nickname
- **DELETE /wallets/:id** → Removes wallet (cannot delete primary without setting another first)
- **POST /wallets/:id/verify** → Verifies wallet ownership via Freighter signature
- **POST /wallets/:id/set-primary** → Sets wallet as primary, automatically unsets others

### Service Layer
- Uses shared `apiClient` from `@/src/shared/lib/api/client.ts`
- API endpoints defined in `@/src/shared/lib/api/endpoints.ts`
- Bearer token authentication automatically injected
- FormData support for file uploads (profile pictures)
- Error handling with `handleApiError` utility


## Recent Changes
**2026-02-06 (Latest Update - Backend Integration Complete)**
- ✅ **Complete Backend Integration Implemented**
- ✅ Updated profile types to include firstName, lastName, gender, city, country, website, profilePictureUrl
- ✅ Created `experience.types.ts` with Experience interface, predefined roles/languages/tools (max 10 roles, 20 languages, 30 tools)
- ✅ Created `wallet.types.ts` with Wallet interface, verification payloads, challenge structure
- ✅ Updated API endpoints in `endpoints.ts` to support profile, experience, and wallet operations
- ✅ Enhanced `apiClient` to support FormData uploads for profile pictures (auto-detects FormData vs JSON)
- ✅ Implemented `profile-service.ts` with personal info update and picture upload (5MB limit, JPEG/PNG/WebP)
- ✅ Implemented `experience-service.ts` with full CRUD operations (PUT for full replace, PATCH for partial)
- ✅ Implemented `wallet-service.ts` with add, verify, update, delete, set primary operations
- ✅ Implemented `freighter-service.ts` for Stellar wallet integration (address validation, signature signing)
- ✅ Created `useProfile` hook with personal info update, profile picture upload, optimistic updates
- ✅ Created `useExperience` hook with tag management (add/remove roles, languages, tools)
- ✅ Created `useWallets` hook with full wallet lifecycle (add, verify, delete, set primary, update nickname)
- ✅ Built reusable `ChipInput` factory component for tag management with suggestions dropdown
- ✅ Completely rebuilt `PersonalInfoForm` with file upload, gender selection, location fields
- ✅ Built `ExperienceForm` with ChipInput integration for roles, languages, tools
- ✅ Built `WalletCard` component for individual wallet display with edit/delete/set primary actions
- ✅ Built `WalletsManager` component with Freighter integration, verification flow, empty state
- ✅ Updated all settings pages to use new integrated components
- ✅ Mobile-responsive design throughout all components (mobile-first approach)
- ✅ Proper error handling with toast notifications
- ✅ Form validation (file size, URL format, Stellar address validation)

**Previous (2026-02-06)**
- Created profile dropdown with avatar and menu
- Integrated conditional rendering in Navbar
- Planned settings pages: Personal Info, Social Accounts (GitHub, Twitter), Experience, Wallets
- Added Freighter wallet integration plan
- Implemented proper separation of concerns for Personal Info
- Added profile types and service layer
- Added `avatar` field to shared `User` type

## Future Enhancements
- GitHub and Twitter OAuth integration (social accounts page)
- Auto-save functionality with debounce on blur
- Profile completeness indicator (progress bar)
- Public profile pages (`/users/:id`)
- Profile export (JSON/PDF)
- Wallet transaction history viewer
- Multi-wallet transaction signing
- Email change with verification flow
- Password change from settings
- Profile picture cropping tool before upload
- Drag-and-drop image upload
- Experience search/filter by skills
- Endorsements and recommendations
- Activity timeline on profile


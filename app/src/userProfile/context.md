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
│   │   └── PersonalInfoForm.tsx
│   └── userProfileService/    # Business logic, hooks, API calls
│       ├── profile-service.ts
│       └── useProfile.ts
├── types/
│   └── profile.types.ts       # SocialLinks, UserProfile, ProfileMeResponse
├── context.md
└── page.tsx
```

## API Integration
- **GET /profile/me** → Returns `{ user, profile }` with user data + profile (bio, stellarAddress, socialLinks)
- **PUT /profile/me** → Updates profile with `UpdateProfilePayload`
- Uses shared `apiClient` and `ENDPOINTS` from `@/src/shared/lib/api/`

## Recent Changes
**2026-02-06**
- Created profile dropdown with avatar and menu
- Integrated conditional rendering in Navbar
- Planned settings pages: Personal Info, Social Accounts (GitHub, Twitter), Experience, Wallets
- Added Freighter wallet integration plan
- Implemented proper separation of concerns for Personal Info:
  - Created `profile.types.ts` with `ProfileMeResponse`, `UserProfile`, `SocialLinks`, `UpdateProfilePayload`
  - Created `profile-service.ts` (API service layer using `apiClient`)
  - Created `useProfile` hook (data fetching + update logic)
  - Created `PersonalInfoForm` (pure UI component, no business logic)
  - Refactored `personal-info/page.tsx` to use hook + UI component pattern
  - Added `avatar` field to shared `User` type
  - Added `PROFILE.UPDATE` endpoint

## Future Enhancements
- Profile picture upload
- GitHub and Twitter OAuth integration
- Experience tags and skills management
- Freighter wallet connection and verification
- Wallet nickname and primary selection
- Form validation and error handling
- Auto-save functionality
- Mobile responsive design

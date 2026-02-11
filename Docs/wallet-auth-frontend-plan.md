# Freighter Wallet Authentication - Frontend Implementation Plan

**Date**: February 10, 2026  
**Status**: Planning Phase  
**Related Documents**: `auth-plan.md` (Backend API specification)

---

## Overview

This document outlines the frontend implementation plan for integrating Freighter wallet authentication as an alternative login/signup method alongside existing email/password authentication. The integration follows project standards from `copilot-instructions.md` and `nextjs.instructions.md`.

---

## 1. Current State Analysis

### Existing Authentication Infrastructure

**Location**: `app/src/auth/`

#### Components Structure
```
app/src/auth/
├── components/
│   └── authUI/
│       ├── AuthLayout.tsx      (Split-screen layout, toggles login/signup)
│       ├── LoginForm.tsx       (Email + Password login)
│       └── SignupForm.tsx      (Email + Password + Name registration)
├── context/
│   └── AuthContext.tsx         (Global auth state management)
├── hooks/
│   └── useAuth.ts              (Custom hook exposing auth methods)
└── context.md                  (Feature documentation)
```

#### Current User Model (from backend)
```typescript
interface User {
  _id: string;
  email: string;
  name: string;      // ⚠️ CRITICAL: Used as primary identity display
  avatar?: string;
  role: string;
  uuid: string;
}
```

#### Current Auth Flow
1. User fills email + password (+ name for signup)
2. Form validates locally
3. Calls `authService.login()` or `authService.register()`
4. JWT tokens stored in sessionStorage
5. `AuthContext` updates with user data
6. Redirect to homepage
7. `name` field displayed in ProfileDropdown and throughout UI

---

## 2. What Needs to Change

### 2.1 User Identity Display Impact

**CRITICAL FINDING**: The `name` field is currently the primary user identity displayed in:

1. **ProfileDropdown** (`app/src/userProfile/components/userProfileUI/ProfileDropdown.tsx`)
   - Line 119: `{user?.name || 'User'}`
   - Avatar initials derived from name
   - Dropdown header shows name prominently

2. **PersonalInfoForm** (`app/src/userProfile/components/userProfileUI/PersonalInfoForm.tsx`)
   - Line 97: `const displayName = data?.user?.name || 'User';`
   - Avatar fallback uses name
   - Form fields for firstName/lastName exist but name is primary

3. **Navbar/Header Components** (likely multiple locations)
   - All avatar displays use `user.name`

**Impact of Wallet-Only Registration**:
- Users registering with wallet MUST provide name during signup
- Name becomes the user's identity label (not wallet address)
- Wallet address should remain technical detail, not primary display

---

## 3. Feature Requirements

### 3.1 Functional Requirements

#### FR-1: Wallet Registration (Signup)
- User can register using Freighter wallet
- **MUST collect name during wallet registration** (critical for UI consistency)
- Optional: Allow users to choose display name vs default
- System verifies wallet signature
- Creates user account with wallet as primary identifier
- Email field optional for wallet-based accounts

#### FR-2: Wallet Login
- User can login by connecting Freighter wallet
- System challenges wallet with signature request
- Verifies signature matches registered wallet
- Returns JWT tokens (same session management as email auth)

#### FR-3: Dual Authentication Support
- Existing email/password auth continues to work
- Users can link wallet to existing email account (future)
- UI clearly indicates which auth method is active

#### FR-4: Profile Consistency
- Wallet-registered users appear identical to email-registered users
- Name field always populated (required during wallet signup)
- Avatar system works identically
- No visual distinction in ProfileDropdown

### 3.2 Non-Functional Requirements

#### NFR-1: User Experience
- Wallet connection must be intuitive
- Clear error messages for Freighter not installed
- Signature request purpose clearly explained
- Loading states during wallet operations
- Mobile-responsive (Freighter mobile support)

#### NFR-2: Security
- Challenge-response pattern prevents replay attacks
- Signature verification client-side (pre-validation)
- Never expose private keys
- Secure challenge storage (memory only)

#### NFR-3: Performance
- Wallet detection < 100ms
- Challenge generation < 200ms
- Signature verification < 500ms
- No blocking UI operations

---

## 4. UI/UX Changes Required

### 4.1 Auth Page Modifications

#### Option A: Unified Form with Mode Toggle (RECOMMENDED)
**Location**: `app/src/auth/components/authUI/`

```
┌─────────────────────────────────────┐
│  [Email] [Wallet]  ← Mode Tabs     │
│                                     │
│  ┌─ Email Mode ─────────────────┐  │
│  │ Email: __________________    │  │
│  │ Password: _______________    │  │
│  │ [Sign In] [Sign Up]          │  │
│  └──────────────────────────────┘  │
│                                     │
│  ┌─ Wallet Mode ────────────────┐  │
│  │ Name: ____________________   │  │ ← Only for signup
│  │ [Connect Freighter Wallet]   │  │
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘
```

**Benefits**:
- Clear separation of auth methods
- Minimal UI clutter
- Easy to extend (add more wallet types)

#### Option B: Side-by-Side Forms (Alternative)
```
┌─────────────────────────────────────┐
│  ┌──────────────┬──────────────┐    │
│  │ Email Login  │ Wallet Login │    │
│  │              │              │    │
│  │ Email: ___   │ Name: ___    │    │
│  │ Pass: ___    │ [Connect]    │    │
│  │ [Sign In]    │              │    │
│  └──────────────┴──────────────┘    │
└─────────────────────────────────────┘
```

**Drawbacks**:
- More cramped on mobile
- Less scalable

### 4.2 New Components Needed

#### Component: `WalletLoginForm.tsx`
**Location**: `app/src/auth/components/authUI/WalletLoginForm.tsx`

```typescript
interface WalletLoginFormProps {
  onSwitchToEmail: () => void;
}
```

**Features**:
- Detects Freighter installation
- "Connect Wallet" button
- Shows connected wallet address (truncated)
- Initiates login flow
- Loading states during signature

**States**:
- `isFreighterInstalled`: boolean
- `connectedAddress`: string | null
- `isConnecting`: boolean
- `isSigning`: boolean

#### Component: `WalletSignupForm.tsx`
**Location**: `app/src/auth/components/authUI/WalletSignupForm.tsx`

```typescript
interface WalletSignupFormProps {
  onSwitchToEmail: () => void;
}
```

**Features**:
- **Name input field** (REQUIRED)
- Freighter connection button
- Signature request flow
- Registration completion
- Email field (optional)

**Fields**:
- `name`: string (required)
- `email`: string (optional, for notifications)
- `walletAddress`: string (auto-filled after connection)

#### Component: `AuthModeTabs.tsx` (New)
**Location**: `app/src/auth/components/authUI/AuthModeTabs.tsx`

```typescript
interface AuthModeTabsProps {
  activeMode: 'email' | 'wallet';
  onModeChange: (mode: 'email' | 'wallet') => void;
}
```

**Design**:
```tsx
<div className="flex gap-2 mb-6 p-1 bg-[#F5F5F5] rounded-xl">
  <button 
    className={`flex-1 px-4 py-2 rounded-lg ${
      active ? 'bg-white shadow-sm' : ''
    }`}
  >
    <Mail /> Email
  </button>
  <button>
    <Wallet /> Wallet
  </button>
</div>
```

### 4.3 Modified Components

#### `AuthLayout.tsx`
**Changes**:
- Add `authMode` state: `'email' | 'wallet'`
- Add `<AuthModeTabs />` above form area
- Conditionally render:
  - Email mode: `<LoginForm />` or `<SignupForm />`
  - Wallet mode: `<WalletLoginForm />` or `<WalletSignupForm />`

```typescript
const [isLogin, setIsLogin] = useState(true);
const [authMode, setAuthMode] = useState<'email' | 'wallet'>('email'); // NEW
```

#### `SignupForm.tsx`
**No changes required** - continues to work as-is for email signups

#### `LoginForm.tsx`
**No changes required** - continues to work as-is for email logins

### 4.4 Profile/Dashboard Changes

#### ⚠️ NO CHANGES REQUIRED

**Reason**: Since wallet registration collects `name`, the user object structure remains identical:

```typescript
// Email-registered user
{
  email: "john@example.com",
  name: "John Doe",
  wallets: []
}

// Wallet-registered user
{
  email: "john@example.com" or null,
  name: "John Doe",        // ← Still provided during signup
  wallets: [{ address: "G...", isPrimary: true }]
}
```

**Profile Components Work As-Is**:
- `ProfileDropdown.tsx` - Shows name, no changes needed
- `PersonalInfoForm.tsx` - Name field works identically
- `SettingsLayout.tsx` - No auth-method-specific logic

**Potential Future Enhancement**:
- Add badge in ProfileDropdown: "🌐 Wallet User"
- Show primary wallet address in settings
- But these are optional UX improvements, not required

---

## 5. Service Layer Architecture

### 5.1 New Freighter Service

**Location**: `app/src/shared/lib/freighter/freighter-service.ts`

```typescript
export class FreighterService {
  /**
   * Check if Freighter extension is installed
   */
  static async isInstalled(): Promise<boolean>;

  /**
   * Request user's public key from Freighter
   */
  static async getPublicKey(): Promise<string>;

  /**
   * Sign a message using Freighter
   */
  static async signMessage(message: string): Promise<string>;

  /**
   * Verify a signature (client-side pre-validation)
   */
  static async verifySignature(
    publicKey: string, 
    message: string, 
    signature: string
  ): Promise<boolean>;
}
```

**Dependencies**:
```json
{
  "@stellar/freighter-api": "^2.0.0"
}
```

### 5.2 Wallet Auth Service

**Location**: `app/src/shared/lib/auth/wallet-auth-service.ts`

```typescript
export class WalletAuthService {
  /**
   * Request challenge from backend
   */
  static async requestChallenge(walletAddress: string): Promise<{
    challenge: string;
    expiresAt: string;
  }>;

  /**
   * Register new user with wallet
   */
  static async registerWithWallet(payload: {
    walletAddress: string;
    signature: string;
    challenge: string;
    name: string;      // REQUIRED
    email?: string;    // Optional
  }): Promise<User>;

  /**
   * Login with wallet signature
   */
  static async loginWithWallet(payload: {
    walletAddress: string;
    signature: string;
    challenge: string;
  }): Promise<User>;
}
```

### 5.3 AuthContext Enhancements

**Location**: `app/src/auth/context/AuthContext.tsx`

**New Methods**:
```typescript
interface AuthContextValue {
  // Existing methods
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  
  // NEW: Wallet methods
  walletSignup: (
    walletAddress: string, 
    signature: string, 
    challenge: string, 
    name: string,
    email?: string
  ) => Promise<void>;
  
  walletLogin: (
    walletAddress: string, 
    signature: string, 
    challenge: string
  ) => Promise<void>;
  
  // Existing methods
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  clearError: () => void;
}
```

---

## 6. Implementation Workflow

### Phase 1: Foundation Setup ✅ (Day 1)

#### Task 1.1: Install Dependencies
```bash
pnpm add @stellar/freighter-api
```

#### Task 1.2: Create Freighter Service
- File: `app/src/shared/lib/freighter/freighter-service.ts`
- Implement Freighter detection
- Implement connection logic
- Implement signing logic
- Add TypeScript types

#### Task 1.3: Create Wallet Auth Service
- File: `app/src/shared/lib/auth/wallet-auth-service.ts`
- Implement challenge request
- Implement registration endpoint call
- Implement login endpoint call
- Add error handling

#### Task 1.4: Update Types
- File: `app/src/shared/types/auth.types.ts`
- Add wallet-specific types
- Extend User type if needed

---

### Phase 2: Backend API Integration (Day 1-2)

#### Task 2.1: Update AuthContext
- Add `walletSignup()` method
- Add `walletLogin()` method
- Integrate wallet-auth-service

#### Task 2.2: Update useAuth Hook
- Export wallet methods
- Add wallet-specific loading states

#### Task 2.3: Environment Configuration
- Ensure API URLs configured
- Add Stellar network config if needed

---

### Phase 3: UI Components (Day 2-3)

#### Task 3.1: Create WalletLoginForm
- Connect wallet button
- Freighter detection UI
- Challenge signing flow
- Error states (no extension, rejected signature)
- Loading states

#### Task 3.2: Create WalletSignupForm
- **Name input field** (required)
- Email input field (optional)
- Connect wallet button
- Registration flow
- Success feedback

#### Task 3.3: Create AuthModeTabs
- Email/Wallet toggle
- Active state styling
- Icon integration

#### Task 3.4: Update AuthLayout
- Integrate AuthModeTabs
- Conditional rendering logic
- State management for mode + login/signup

---

### Phase 4: Integration & Polish (Day 3-4)

#### Task 4.1: End-to-End Testing
- Test wallet signup flow
- Test wallet login flow
- Test switching between modes
- Test error scenarios

#### Task 4.2: Error Handling
- Freighter not installed
- User rejects connection
- User rejects signature
- Invalid signature
- Backend errors

#### Task 4.3: Loading States
- Button loading spinners
- Disabled states during operations
- Skeleton loaders if needed

#### Task 4.4: Responsive Design
- Mobile layout testing
- Tablet breakpoint testing
- Touch target sizes (44px minimum)

---

### Phase 5: Documentation & Review (Day 4-5)

#### Task 5.1: Update context.md
```markdown
## Recent Changes
**2026-02-10 (Wallet Authentication Integration)**
- ✅ Added Freighter wallet authentication as alternative to email/password
- ✅ Created WalletLoginForm and WalletSignupForm components
- ✅ Implemented FreighterService for wallet interactions
- ✅ Extended AuthContext with wallet methods
- ✅ Name field required during wallet signup for UI consistency
- ✅ Added challenge-response signature verification
```

#### Task 5.2: Code Review Checklist
- [ ] Follows Next.js 16 best practices
- [ ] Uses Server/Client Components correctly
- [ ] No `next/dynamic` with `{ ssr: false }` in Server Components
- [ ] Proper TypeScript typing
- [ ] Error boundaries in place
- [ ] Accessibility (ARIA labels, keyboard nav)
- [ ] Mobile-responsive
- [ ] Loading states for all async operations

#### Task 5.3: Security Review
- [ ] Challenge stored only in memory
- [ ] Signature verification before API call
- [ ] No private keys ever exposed
- [ ] JWT tokens properly secured
- [ ] HTTPS enforced in production

---

## 7. User Flow Diagrams

### 7.1 Wallet Signup Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User visits /src/auth                                    │
│    - Clicks "Sign Up" tab                                   │
│    - Clicks "Wallet" mode tab                               │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. WalletSignupForm renders                                 │
│    - Shows "Name" input field (REQUIRED)                    │
│    - Shows "Email" input field (optional)                   │
│    - Shows "Connect Freighter Wallet" button                │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. User fills name & clicks "Connect Wallet"                │
│    - Frontend checks Freighter installed                    │
│    - Calls FreighterService.getPublicKey()                  │
│    - Freighter popup appears                                │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. User approves connection in Freighter                    │
│    - Wallet address received: "GABC...XYZ"                  │
│    - UI shows: "Connected: GABC...XYZ"                      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Frontend requests challenge                              │
│    - Calls WalletAuthService.requestChallenge()             │
│    - POST /auth/wallet/challenge                            │
│    - Receives: { challenge: "Sign this...", expiresAt }    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. User signs challenge                                     │
│    - Calls FreighterService.signMessage(challenge)          │
│    - Freighter popup appears with message                   │
│    - User clicks "Sign"                                     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. Frontend submits registration                            │
│    - Calls WalletAuthService.registerWithWallet()           │
│    - POST /auth/wallet/register with:                       │
│      { walletAddress, signature, challenge, name, email }   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 8. Backend validates & creates user                         │
│    - Verifies signature                                     │
│    - Creates User with name                                 │
│    - Creates Wallet record (isPrimary: true)                │
│    - Returns JWT tokens + user data                         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 9. Frontend stores session & redirects                      │
│    - TokenManager stores JWT in sessionStorage              │
│    - AuthContext updates: user = { name, email, ... }       │
│    - Router.push('/') → Homepage                            │
└─────────────────────────────────────────────────────────────┘
```

### 7.2 Wallet Login Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User visits /src/auth                                    │
│    - Clicks "Sign In" tab                                   │
│    - Clicks "Wallet" mode tab                               │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. WalletLoginForm renders                                  │
│    - Shows "Connect Freighter Wallet" button                │
│    - No name field needed (account exists)                  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. User clicks "Connect Wallet"                             │
│    - Frontend checks Freighter installed                    │
│    - Calls FreighterService.getPublicKey()                  │
│    - Freighter popup appears                                │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. User approves connection                                 │
│    - Wallet address received: "GABC...XYZ"                  │
│    - UI shows: "Connected: GABC...XYZ"                      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Frontend requests challenge                              │
│    - Calls WalletAuthService.requestChallenge()             │
│    - POST /auth/wallet/challenge                            │
│    - Receives: { challenge: "Sign this...", expiresAt }    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. User signs challenge                                     │
│    - Calls FreighterService.signMessage(challenge)          │
│    - Freighter popup appears                                │
│    - User clicks "Sign"                                     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. Frontend submits login                                   │
│    - Calls WalletAuthService.loginWithWallet()              │
│    - POST /auth/wallet/login with:                          │
│      { walletAddress, signature, challenge }                │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 8. Backend validates signature                              │
│    - Verifies challenge exists in Redis                     │
│    - Verifies signature matches wallet                      │
│    - Finds user by wallet address                           │
│    - Returns JWT tokens + user data                         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 9. Frontend stores session & redirects                      │
│    - TokenManager stores JWT in sessionStorage              │
│    - AuthContext updates: user = { name, email, ... }       │
│    - Router.push('/') → Homepage                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 8. Edge Cases & Error Handling

### 8.1 Freighter Not Installed

**Detection**:
```typescript
if (!window.freighter) {
  // Show install prompt
}
```

**UI Response**:
```tsx
<div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
  <p className="text-sm text-blue-900">
    Freighter wallet not detected.{' '}
    <a 
      href="https://www.freighter.app/" 
      target="_blank"
      className="underline font-semibold"
    >
      Install Freighter
    </a>{' '}
    to continue.
  </p>
</div>
```

### 8.2 User Rejects Connection

**Error**: `User denied access to their public key`

**UI Response**:
```tsx
<div className="text-sm text-red-600 p-3 bg-red-50 border border-red-200 rounded-xl">
  Connection cancelled. Please approve the connection request to continue.
</div>
```

### 8.3 User Rejects Signature

**Error**: `User denied message signing`

**UI Response**:
```tsx
<div className="text-sm text-orange-600 p-3 bg-orange-50 border border-orange-200 rounded-xl">
  Signature cancelled. You must sign the message to authenticate.
</div>
```

### 8.4 Wallet Already Registered (During Signup)

**Backend Error**: `Wallet address already registered`

**UI Response**:
```tsx
<div className="text-sm text-red-600 p-3 bg-red-50 border border-red-200 rounded-xl">
  This wallet is already registered.{' '}
  <button 
    onClick={switchToLogin}
    className="underline font-semibold"
  >
    Try signing in instead
  </button>
</div>
```

### 8.5 Wallet Not Found (During Login)

**Backend Error**: `Wallet address not found`

**UI Response**:
```tsx
<div className="text-sm text-red-600 p-3 bg-red-50 border border-red-200 rounded-xl">
  This wallet is not registered.{' '}
  <button 
    onClick={switchToSignup}
    className="underline font-semibold"
  >
    Create an account
  </button>
</div>
```

### 8.6 Challenge Expired

**Backend Error**: `Challenge expired or invalid`

**UI Response**:
```tsx
<div className="text-sm text-orange-600 p-3 bg-orange-50 border border-orange-200 rounded-xl">
  Verification timed out. Please try again.
  <button onClick={retry} className="ml-2 underline">
    Retry
  </button>
</div>
```

### 8.7 Invalid Signature

**Backend Error**: `Invalid signature`

**UI Response**:
```tsx
<div className="text-sm text-red-600 p-3 bg-red-50 border border-red-200 rounded-xl">
  Signature verification failed. Please try again.
</div>
```

### 8.8 Network Errors

**Error**: `Failed to fetch`, `Network request failed`

**UI Response**:
```tsx
<div className="text-sm text-red-600 p-3 bg-red-50 border border-red-200 rounded-xl">
  Connection error. Please check your internet connection and try again.
</div>
```

---

## 9. Design System Compliance

### 9.1 Color Palette (from copilot-instructions.md)

```css
Background:    #FCFCFC (Ghost White)
Text Primary:  #1A1A1A
Text Secondary: #4D4D4D
Brand Primary: #000000
Brand Accent:  #E6FF80 (lime highlight)
Border:        #E5E5E5
```

### 9.2 Component Styling

#### Buttons
```tsx
<button className="
  w-full 
  px-6 py-3 
  md:px-8 md:py-4 
  text-sm md:text-base 
  bg-[#1A1A1A] 
  text-white 
  rounded-xl 
  hover:bg-[#333] 
  transition-all duration-200 ease-in-out
  disabled:opacity-50 disabled:cursor-not-allowed
">
  Connect Freighter Wallet
</button>
```

#### Input Fields
```tsx
<input 
  type="text"
  placeholder="Your Name"
  className="
    w-full 
    px-4 py-2.5 
    text-sm 
    bg-white 
    border border-[#E5E5E5] 
    rounded-xl 
    focus:outline-none 
    focus:ring-2 
    focus:ring-[#1A1A1A]/20 
    transition-all
  "
/>
```

#### Mode Tabs
```tsx
<div className="flex gap-2 mb-6 p-1 bg-[#F5F5F5] rounded-xl">
  <button className={`
    flex-1 px-4 py-2.5 
    text-sm font-semibold 
    rounded-lg 
    transition-all duration-200
    ${active 
      ? 'bg-white shadow-sm text-[#1A1A1A]' 
      : 'text-[#4D4D4D] hover:text-[#1A1A1A]'
    }
  `}>
    <Mail className="w-4 h-4 inline mr-2" />
    Email
  </button>
</div>
```

### 9.3 Responsive Breakpoints

```
Mobile:  < 640px  (base styles)
Tablet:  640px+   (sm:)
Desktop: 768px+   (md:)
Large:   1024px+  (lg:)
```

**Apply to**:
- Font sizes: `text-sm md:text-base`
- Padding: `px-4 md:px-6 lg:px-8`
- Button sizes: `py-3 md:py-4`
- Grid layouts: `grid-cols-1 md:grid-cols-2`

---

## 10. Testing Strategy

### 10.1 Unit Tests

**Location**: `app/src/shared/lib/freighter/__tests__/`

```typescript
// freighter-service.test.ts
describe('FreighterService', () => {
  test('detects Freighter installation', async () => {});
  test('requests public key', async () => {});
  test('signs message correctly', async () => {});
  test('handles rejection gracefully', async () => {});
});
```

### 10.2 Integration Tests

**Location**: `app/src/auth/__tests__/`

```typescript
// wallet-auth-flow.test.tsx
describe('Wallet Authentication Flow', () => {
  test('completes wallet signup successfully', async () => {});
  test('completes wallet login successfully', async () => {});
  test('handles challenge expiration', async () => {});
  test('shows error for unregistered wallet', async () => {});
});
```

### 10.3 Manual Testing Checklist

#### Wallet Signup Flow
- [ ] Can toggle to wallet mode
- [ ] Name field is required
- [ ] Email field is optional
- [ ] Connect button triggers Freighter
- [ ] Wallet address displays after connection
- [ ] Challenge signing works
- [ ] Registration completes successfully
- [ ] Redirects to homepage
- [ ] ProfileDropdown shows correct name
- [ ] Settings page shows correct data

#### Wallet Login Flow
- [ ] Can toggle to wallet mode
- [ ] Connect button triggers Freighter
- [ ] Challenge signing works
- [ ] Login completes successfully
- [ ] Redirects to homepage
- [ ] User session persists

#### Error Scenarios
- [ ] Freighter not installed message appears
- [ ] User rejection shows appropriate error
- [ ] Already registered wallet handled correctly
- [ ] Unregistered wallet during login handled
- [ ] Challenge expiration shows retry option
- [ ] Network errors display clearly

#### Cross-Browser Testing
- [ ] Chrome (desktop)
- [ ] Firefox (desktop)
- [ ] Safari (desktop)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## 11. Security Considerations

### 11.1 Challenge Management

**Storage**: Memory only (React state)
```typescript
const [challenge, setChallenge] = useState<string | null>(null);
```

**Never**:
- Store in localStorage
- Store in cookies
- Send in URL parameters
- Log to console in production

### 11.2 Signature Verification

**Client-Side Pre-Validation**:
```typescript
const isValidSignature = await FreighterService.verifySignature(
  walletAddress,
  challenge,
  signature
);

if (!isValidSignature) {
  throw new Error('Invalid signature');
}
```

**Backend Final Validation**: Always required, client check is optimization only

### 11.3 Token Security

**Same as Email Auth**:
- JWT access token: sessionStorage + memory
- Refresh token: HTTP-only cookie (backend managed)
- Auto-refresh mechanism
- Logout clears all tokens

### 11.4 HTTPS Enforcement

**Production Only**:
```typescript
if (process.env.NODE_ENV === 'production' && window.location.protocol !== 'https:') {
  window.location.href = window.location.href.replace('http:', 'https:');
}
```

---

## 12. Accessibility Requirements

### 12.1 Keyboard Navigation

- All buttons must be keyboard accessible
- Tab order must be logical
- Enter key submits forms
- Escape key closes modals/dropdowns

### 12.2 Screen Reader Support

```tsx
<button
  onClick={connectWallet}
  aria-label="Connect your Freighter wallet to sign in"
  aria-describedby="wallet-connect-description"
>
  Connect Freighter Wallet
</button>

<p id="wallet-connect-description" className="sr-only">
  This will open the Freighter wallet extension and request your public key
</p>
```

### 12.3 Focus Management

```typescript
// After wallet connection, focus on sign button
const signButtonRef = useRef<HTMLButtonElement>(null);

useEffect(() => {
  if (walletConnected) {
    signButtonRef.current?.focus();
  }
}, [walletConnected]);
```

### 12.4 Error Announcements

```tsx
<div role="alert" aria-live="polite">
  {error && <p>{error}</p>}
</div>
```

---

## 13. Performance Targets

### 13.1 Loading Times

| Action | Target | Maximum |
|--------|--------|---------|
| Freighter detection | < 100ms | 200ms |
| Wallet connection | < 500ms | 1s |
| Challenge request | < 200ms | 500ms |
| Signature signing | < 500ms | 2s (user-dependent) |
| Registration API | < 800ms | 2s |
| Login API | < 600ms | 1.5s |

### 13.2 Bundle Size Impact

**Estimated Addition**:
- `@stellar/freighter-api`: ~50KB
- New components: ~15KB
- Services: ~10KB
- **Total**: ~75KB (gzipped: ~25KB)

**Optimization**:
- Code splitting for wallet components
- Lazy load Freighter service
- Tree-shake unused Stellar SDK functions

```typescript
// Lazy load wallet auth components
const WalletLoginForm = dynamic(
  () => import('@/src/auth/components/authUI/WalletLoginForm'),
  { ssr: false }
);
```

---

## 14. Migration & Rollout Plan

### 14.1 Feature Flag (Optional)

**Environment Variable**:
```env
NEXT_PUBLIC_ENABLE_WALLET_AUTH=true
```

**Conditional Rendering**:
```typescript
const isWalletAuthEnabled = 
  process.env.NEXT_PUBLIC_ENABLE_WALLET_AUTH === 'true';

{isWalletAuthEnabled && <AuthModeTabs />}
```

### 14.2 Phased Rollout

#### Phase 1: Internal Testing (Week 1)
- Deploy to staging environment
- Internal team testing
- Fix critical bugs

#### Phase 2: Beta Users (Week 2)
- Enable for 10% of users
- Monitor error rates
- Gather feedback

#### Phase 3: General Availability (Week 3)
- Enable for all users
- Update documentation
- Announce feature

### 14.3 Rollback Plan

**If Critical Issues**:
1. Set `NEXT_PUBLIC_ENABLE_WALLET_AUTH=false`
2. Redeploy frontend
3. Wallet-registered users can still login (backend unchanged)
4. Fix issues in development
5. Re-enable when stable

---

## 15. Success Metrics

### 15.1 Adoption Metrics

- **Primary**: Wallet signups / Total signups
- **Target**: 30% wallet auth adoption within 3 months

### 15.2 Performance Metrics

- **Average wallet signup time**: < 15 seconds
- **Average wallet login time**: < 10 seconds
- **Error rate**: < 5%

### 15.3 User Experience Metrics

- **Completion rate**: > 80% of users who start complete flow
- **Drop-off point**: Track where users abandon
- **Time to first transaction**: Measure onboarding efficiency

---

## 16. Future Enhancements

### 16.1 Multi-Wallet Support

- Allow users to link multiple wallets
- Switch between wallets
- Manage wallet nicknames

### 16.2 Other Wallet Providers

- Albedo wallet support
- LOBSTR wallet support
- Rabet wallet support

### 16.3 Social Recovery

- Link email to wallet account (post-signup)
- Recover account via email if wallet lost

### 16.4 Hardware Wallet Support

- Ledger integration
- Trezor integration

---

## 17. Dependencies & Prerequisites

### 17.1 NPM Packages

```json
{
  "dependencies": {
    "@stellar/freighter-api": "^2.0.0",
    "stellar-sdk": "^11.0.0"  // If not already installed
  }
}
```

### 17.2 Backend Requirements

**Endpoints Must Exist**:
- `POST /auth/wallet/challenge`
- `POST /auth/wallet/register`
- `POST /auth/wallet/login`

**Response Formats**: As specified in `auth-plan.md`

### 17.3 Environment Variables

```env
# Existing
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
NEXT_PUBLIC_API_VERSION=v1

# New (optional)
NEXT_PUBLIC_STELLAR_NETWORK=PUBLIC  # or TESTNET
NEXT_PUBLIC_ENABLE_WALLET_AUTH=true
```

---

## 18. Developer Handoff Checklist

### 18.1 Before Starting Development

- [ ] Read `auth-plan.md` (backend spec)
- [ ] Read `copilot-instructions.md` (project standards)
- [ ] Read `nextjs.instructions.md` (framework best practices)
- [ ] Review existing auth implementation
- [ ] Set up local development environment
- [ ] Verify backend API endpoints available

### 18.2 During Development

- [ ] Follow feature folder structure (`authUI/`, `authService/`)
- [ ] Use TypeScript strictly
- [ ] Add proper error handling
- [ ] Write unit tests for services
- [ ] Test on multiple browsers
- [ ] Test mobile responsiveness

### 18.3 Before Submitting PR

- [ ] Update `context.md` with changes
- [ ] Run `pnpm lint`
- [ ] Run `pnpm build` successfully
- [ ] Test all user flows manually
- [ ] Verify accessibility (keyboard nav, screen readers)
- [ ] Check bundle size impact
- [ ] Update this plan with any deviations

---

## 19. Known Limitations

### 19.1 Browser Support

- **Freighter requires**: Chrome 88+, Firefox 78+, Edge 88+
- **Not supported**: IE11, old Safari versions
- **Mobile**: Freighter mobile app required (not browser extension)

### 19.2 Network Dependency

- Requires active internet connection
- Stellar network must be reachable
- Backend API must be available

### 19.3 User Education

- Users must understand wallet custody
- Private keys are user's responsibility
- No "forgot password" recovery for wallet-only accounts

---

## 20. References

### 20.1 Internal Documentation

- [Backend Auth Plan](./auth-plan.md)
- [Copilot Instructions](../.github/copilot-instructions.md)
- [Next.js Instructions](../.github/instructions/nextjs.instructions.md)
- [Auth Context Documentation](../app/src/auth/context.md)

### 20.2 External Documentation

- [Freighter API Docs](https://docs.freighter.app/)
- [Stellar SDK Docs](https://stellar.github.io/js-stellar-sdk/)
- [Next.js 16 Docs](https://nextjs.org/docs)
- [React 19 Docs](https://react.dev/)

### 20.3 Design References

- [EthGlobal Auth Flow](https://ethglobal.com/auth) (inspiration)
- [Freighter UX Patterns](https://freighter.app/) (wallet interaction)

---

## Appendix A: File Structure After Implementation

```
app/src/auth/
├── components/
│   └── authUI/
│       ├── AuthLayout.tsx           (MODIFIED - mode toggle)
│       ├── AuthModeTabs.tsx         (NEW)
│       ├── LoginForm.tsx            (UNCHANGED)
│       ├── SignupForm.tsx           (UNCHANGED)
│       ├── WalletLoginForm.tsx      (NEW)
│       └── WalletSignupForm.tsx     (NEW)
├── context/
│   └── AuthContext.tsx              (MODIFIED - wallet methods)
├── hooks/
│   └── useAuth.ts                   (MODIFIED - export wallet methods)
└── context.md                       (UPDATED - recent changes)

app/src/shared/lib/
├── auth/
│   ├── auth-service.ts              (UNCHANGED)
│   └── wallet-auth-service.ts       (NEW)
└── freighter/
    ├── freighter-service.ts         (NEW)
    └── __tests__/
        └── freighter-service.test.ts (NEW)

app/src/shared/types/
└── auth.types.ts                    (MODIFIED - wallet types)

app/src/userProfile/
└── components/
    └── userProfileUI/
        └── ProfileDropdown.tsx      (UNCHANGED - works as-is)
```

---

## Appendix B: API Request/Response Examples

### Challenge Request

**Request**:
```http
POST /auth/wallet/challenge
Content-Type: application/json

{
  "walletAddress": "GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHIJKLMNOP"
}
```

**Response**:
```json
{
  "challenge": "Sign this message to authenticate: nonce_1234567890_1644494400000",
  "expiresAt": "2026-02-10T12:35:00.000Z"
}
```

### Wallet Registration

**Request**:
```http
POST /auth/wallet/register
Content-Type: application/json

{
  "walletAddress": "GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHIJKLMNOP",
  "signature": "dGVzdF9zaWduYXR1cmVfYmFzZTY0X2VuY29kZWQ=",
  "challenge": "Sign this message to authenticate: nonce_1234567890_1644494400000",
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Response**:
```json
{
  "user": {
    "_id": "65f1234567890abcdef12345",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": null,
    "role": "user",
    "uuid": "uuid-v4-string"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "opaque-refresh-token-string"
  }
}
```

### Wallet Login

**Request**:
```http
POST /auth/wallet/login
Content-Type: application/json

{
  "walletAddress": "GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHIJKLMNOP",
  "signature": "dGVzdF9zaWduYXR1cmVfYmFzZTY0X2VuY29kZWQ=",
  "challenge": "Sign this message to authenticate: nonce_1234567890_1644494400000"
}
```

**Response**:
```json
{
  "user": {
    "_id": "65f1234567890abcdef12345",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": null,
    "role": "user",
    "uuid": "uuid-v4-string"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "opaque-refresh-token-string"
  }
}
```

---

**END OF FRONTEND IMPLEMENTATION PLAN**

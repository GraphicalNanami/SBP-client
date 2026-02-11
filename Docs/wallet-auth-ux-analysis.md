# Wallet Authentication UX Flow Analysis

**Date**: February 10, 2026  
**Status**: Backend Gap Analysis

---

## Desired UX Flow

### User Journey

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User clicks "Sign In" in navbar                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Login page opens with TWO options:                       │
│    ┌──────────────────────────────────────────────────┐    │
│    │ [Email/Password Login Form]                       │    │
│    │ Email: _____________________                      │    │
│    │ Password: __________________                      │    │
│    │ [Sign In Button]                                  │    │
│    └──────────────────────────────────────────────────┘    │
│                                                              │
│    ─── OR ───                                               │
│                                                              │
│    ┌──────────────────────────────────────────────────┐    │
│    │ [Connect Wallet Button]                           │    │
│    └──────────────────────────────────────────────────┘    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. User clicks "Connect Wallet"                             │
│    - Freighter popup opens                                  │
│    - User approves connection                               │
│    - Wallet address received: GABC...XYZ                    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Frontend checks if wallet exists (API call)              │
│    POST /auth/wallet/check-existence                        │
│    { walletAddress: "GABC...XYZ" }                          │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
┌──────────────┐          ┌──────────────────┐
│ EXISTS       │          │ DOES NOT EXIST   │
└──────┬───────┘          └────────┬─────────┘
       │                           │
       ▼                           ▼
┌─────────────────────┐    ┌─────────────────────────────────┐
│ 5a. Proceed with    │    │ 5b. Show toast message:         │
│     challenge flow: │    │     "No account found.          │
│     - Request       │    │      Please sign up first"      │
│       challenge     │    │     - Navigate to signup page   │
│     - Sign message  │    │     - Pre-fill wallet address   │
│     - Submit login  │    └─────────────────────────────────┘
│     - Success!      │
└─────────────────────┘
```

---

## Current Backend API Analysis

### ✅ Endpoints Already Available

#### 1. Challenge Generation
```
POST /auth/wallet/challenge
Body: { walletAddress: "GABC...XYZ" }
Response: { challenge: "Sign this...", expiresAt: "..." }
```
**Status**: Available ✅

#### 2. Wallet Login
```
POST /auth/wallet/login
Body: { walletAddress, signature, challenge }
Response: { user: {...}, tokens: {...} }
Error: "Wallet address not found" (if not registered)
```
**Status**: Available ✅

#### 3. Wallet Registration
```
POST /auth/wallet/register
Body: { walletAddress, signature, challenge, name }
Response: { user: {...}, tokens: {...} }
Error: "Wallet already registered" (if exists)
```
**Status**: Available ✅

---

## ❌ Backend Gap Identified

### Missing Endpoint: Check Wallet Existence

**Current Problem**:
- To check if a wallet exists, we must either:
  1. Request challenge → Sign message → Try login → Handle error
  2. ❌ This requires user to sign unnecessarily if wallet doesn't exist

**Desired Behavior**:
- Lightweight check BEFORE asking user to sign
- Better UX: Don't make user sign if they're not registered

---

## Recommended Backend Addition

### NEW Endpoint: Check Wallet Existence

**Endpoint**: `POST /auth/wallet/check-existence`

**Purpose**: Quickly check if a wallet address is registered without requiring signature

**Request**:
```json
{
  "walletAddress": "GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHIJKLMNOP"
}
```

**Response (Success - Wallet Exists)**:
```json
{
  "exists": true,
  "userExists": true,
  "message": "Wallet is registered. Proceed with login."
}
```

**Response (Wallet Not Found)**:
```json
{
  "exists": false,
  "userExists": false,
  "message": "Wallet not registered. Please sign up first."
}
```

**Response Codes**:
- `200 OK` - Check completed successfully (exists: true or false)
- `400 Bad Request` - Invalid wallet address format
- `500 Internal Server Error` - Server error

**Backend Implementation Notes**:
```typescript
// Pseudo-code
async checkWalletExistence(walletAddress: string) {
  // Validate wallet address format
  if (!isValidStellarAddress(walletAddress)) {
    throw new BadRequestException('Invalid wallet address');
  }
  
  // Check if wallet exists in Wallet collection
  const wallet = await this.walletModel.findOne({ address: walletAddress });
  
  return {
    exists: !!wallet,
    userExists: !!wallet?.userId,
    message: wallet 
      ? 'Wallet is registered. Proceed with login.'
      : 'Wallet not registered. Please sign up first.'
  };
}
```

**Security Considerations**:
- ⚠️ **Potential Privacy Concern**: This endpoint reveals if a wallet address is registered
- **Mitigation**: This is acceptable because:
  1. Wallet addresses are public on blockchain anyway
  2. Prevents poor UX (unnecessary signature requests)
  3. Similar to email existence checks (common pattern)
  4. Rate limiting should be applied to prevent enumeration attacks

**Rate Limiting**:
- Max 10 requests per minute per IP
- Prevents wallet address enumeration

---

## Alternative Approach (If Backend Endpoint Cannot Be Added)

### Use Try-Catch Pattern with Login Endpoint

**Flow**:
```typescript
async function handleWalletConnect(walletAddress: string) {
  try {
    // Step 1: Request challenge
    const { challenge } = await requestChallenge(walletAddress);
    
    // Step 2: Ask user to sign
    const signature = await signMessage(challenge);
    
    // Step 3: Attempt login
    try {
      const result = await loginWithWallet(walletAddress, signature, challenge);
      // Success! User is logged in
      return { success: true, result };
    } catch (loginError) {
      // Check if error is "wallet not found"
      if (loginError.message.includes('not found') || 
          loginError.message.includes('not registered')) {
        // Show toast and navigate to signup
        toast.error('No account found. Please sign up first.');
        router.push('/auth?mode=signup&wallet=' + walletAddress);
        return { success: false, reason: 'not_registered' };
      }
      throw loginError; // Other errors
    }
  } catch (error) {
    // Handle other errors (signature rejection, etc.)
    toast.error('Login failed. Please try again.');
    return { success: false, reason: 'error' };
  }
}
```

**Pros**:
- No backend changes needed
- Works with existing API

**Cons**:
- User must sign message even if not registered (poor UX)
- Wastes a challenge (stored in Redis)
- Extra API call overhead

---

## Recommended Solution

###  Add Check Endpoint (RECOMMENDED)

**Why**:
- Best user experience
- Minimal backend effort (simple query)
- Clear separation of concerns
- Prevents unnecessary signature requests

**Implementation Effort**:
- Backend: 30 minutes (add endpoint + validation)
- Frontend: Integrate the check before challenge flow
- Testing: 15 minutes

**Total**: ~1 hour

---


---

## Updated Frontend UX Flow (With Check Endpoint)

### Login Page UI Structure

```tsx
<div className="space-y-6">
  {/* Email/Password Section */}
  <div className="bg-white rounded-2xl p-6 border border-[#E5E5E5]">
    <h2 className="text-xl font-semibold mb-4">Sign in with Email</h2>
    <form>
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />
      <button type="submit">Sign In</button>
    </form>
  </div>

  {/* Divider */}
  <div className="relative">
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t border-[#E5E5E5]"></div>
    </div>
    <div className="relative flex justify-center text-sm">
      <span className="px-4 bg-[#FCFCFC] text-[#4D4D4D]">OR</span>
    </div>
  </div>

  {/* Wallet Section */}
  <div className="bg-white rounded-2xl p-6 border border-[#E5E5E5]">
    <h2 className="text-xl font-semibold mb-4">Sign in with Wallet</h2>
    <button 
      onClick={handleConnectWallet}
      className="w-full btn-primary"
    >
      <WalletIcon /> Connect Freighter Wallet
    </button>
  </div>
</div>
```

### Frontend Implementation (With Check Endpoint)

```typescript
// app/src/auth/components/authUI/LoginForm.tsx

async function handleConnectWallet() {
  try {
    setIsLoading(true);
    
    // 1. Check Freighter installed
    if (!window.freighter) {
      toast.error('Freighter wallet not installed');
      return;
    }
    
    // 2. Request wallet address
    const walletAddress = await freighterAPI.getPublicKey();
    
    // 3. ✅ NEW: Check if wallet exists (lightweight)
    const { exists } = await walletAuthService.checkWalletExistence(walletAddress);
    
    if (!exists) {
      // Not registered - redirect to signup
      toast.error('No account found. Please sign up first.');
      router.push(`/auth?mode=signup&wallet=${walletAddress}`);
      return;
    }
    
    // 4. Wallet exists - proceed with login
    // Request challenge
    const { challenge } = await walletAuthService.requestChallenge(walletAddress);
    
    // 5. Ask user to sign
    const signature = await freighterAPI.signMessage(challenge);
    
    // 6. Submit login
    await login.walletLogin(walletAddress, signature, challenge);
    
    // 7. Success - AuthContext handles redirect
    toast.success('Login successful!');
    
  } catch (error) {
    if (error.message.includes('rejected')) {
      toast.error('Signature request was rejected');
    } else {
      toast.error('Login failed. Please try again.');
    }
  } finally {
    setIsLoading(false);
  }
}
```

---

## Signup Page Changes

### Pre-fill Wallet Address

When user is redirected from login → signup with wallet address in URL:

```typescript
// app/src/auth/components/authUI/SignupForm.tsx

const searchParams = useSearchParams();
const prefillWallet = searchParams.get('wallet');

useEffect(() => {
  if (prefillWallet) {
    // Show wallet signup mode
    setSignupMode('wallet');
    setWalletAddress(prefillWallet);
    // Show message: "Complete your registration with this wallet"
  }
}, [prefillWallet]);
```

**UI**:
```tsx
{prefillWallet && (
  <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl mb-4">
    <p className="text-sm text-blue-900">
      Complete your registration with wallet:{' '}
      <span className="font-mono">{truncateAddress(prefillWallet)}</span>
    </p>
  </div>
)}
```

---

## Implementation Checklist

### Backend Tasks (if adding endpoint)
- [ ] Create `POST /auth/wallet/check-existence` endpoint
- [ ] Validate wallet address format
- [ ] Query Wallet collection for address
- [ ] Return { exists, userExists, message }
- [ ] Add rate limiting (10 req/min per IP)
- [ ] Add to API documentation
- [ ] Write unit tests
- [ ] Deploy to staging

### Frontend Tasks
- [ ] Update LoginForm with wallet connect button
- [ ] Implement check-existence service call
- [ ] Handle wallet exists → proceed with challenge
- [ ] Handle wallet not found → toast + redirect to signup
- [ ] Update SignupForm to accept ?wallet= URL param
- [ ] Pre-fill wallet address in signup form
- [ ] Show "Complete registration" message
- [ ] Test full flow end-to-end

---

## Error Messages

### User-Facing Messages

| Scenario | Toast Message | Action |
|----------|---------------|--------|
| Freighter not installed | "Freighter wallet extension not found. Please install it first." | Show install link |
| User rejects connection | "Wallet connection was cancelled." | Allow retry |
| Wallet not registered (login) | "No account found with this wallet. Please sign up first." | Redirect to signup |
| Wallet already registered (signup) | "This wallet is already registered. Try signing in instead." | Redirect to login |
| User rejects signature | "Signature request was rejected." | Allow retry |
| Invalid signature | "Authentication failed. Please try again." | Restart flow |
| Network error | "Connection error. Please check your internet and try again." | Allow retry |
| Server error | "Something went wrong. Please try again later." | Contact support |

---

## Summary

### Current Status
✅ **Backend has**: challenge, login, register endpoints  
❌ **Backend missing**: check-existence endpoint (lightweight wallet lookup)

### Recommended Action
**Add the check-existence endpoint** for optimal UX. It's a small change with big UX impact.

### Timeline
- Backend addition: ~1 hour
- Frontend integration: ~2-3 hours
- Testing: ~1 hour
- **Total**: ~4-5 hours for complete feature

### Alternative
Use try-catch pattern with existing endpoints if backend changes not possible (but results in poor UX).

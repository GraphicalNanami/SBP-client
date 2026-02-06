Claude’s Plan
Auth Integration Implementation Plan
Overview
Integrate the existing auth UI (LoginForm, SignupForm) with the backend API. Backend returns tokens in JSON response body. Focus on core auth flow first - route protection will be added later.

Backend API Reference
Endpoints
POST /auth/register - Body: { email, password, name } → Returns: { accessToken, refreshToken, user }
POST /auth/login - Body: { email, password } → Returns: { accessToken, refreshToken, user }
POST /auth/refresh - Body: { refreshToken } → Returns: { accessToken, refreshToken, user }
POST /auth/logout - Body: { refreshToken } → Returns: void
GET /profile/me - Headers: Authorization: Bearer <accessToken> → Returns: { user, profile }
Token Details
Access Token: JWT, 15-minute TTL, payload: { userId, email, role }
Refresh Token: Opaque 64-char hex string, 7-day TTL
User Object: { _id, email, name, role }
Token Storage Strategy
Since backend returns tokens in JSON (not cookies), we'll use:

Access Token: Store in memory (React state) + sessionStorage fallback
Refresh Token: Store in sessionStorage (cleared on tab close)
User Data: Store in memory (context state)
Security Rationale: sessionStorage is more secure than localStorage (cleared on tab close) while still providing persistence across page reloads. Memory-first approach prevents XSS attacks on access token.

Directory Structure

app/
├── src/
│   ├── auth/
│   │   ├── components/authUI/
│   │   │   ├── LoginForm.tsx         [MODIFY]
│   │   │   ├── SignupForm.tsx        [MODIFY]
│   │   │   └── AuthLayout.tsx        [EXISTING]
│   │   ├── context/
│   │   │   └── AuthContext.tsx       [NEW]
│   │   ├── hooks/
│   │   │   └── useAuth.ts            [NEW]
│   │   └── ...
│   │
│   └── shared/
│       ├── lib/
│       │   ├── api/
│       │   │   ├── client.ts         [NEW] - Base fetch wrapper
│       │   │   └── endpoints.ts      [NEW] - URL constants
│       │   ├── auth/
│       │   │   ├── token-manager.ts  [NEW] - Token storage/retrieval
│       │   │   └── auth-service.ts   [NEW] - Auth API methods
│       │   └── config/
│       │       └── env.ts            [NEW] - Env var validation
│       │
│       ├── types/
│       │   ├── auth.types.ts         [NEW] - Auth interfaces
│       │   └── api.types.ts          [NEW] - API response types
│       │
│       └── utils/
│           └── error-handler.ts      [NEW] - Error formatting
│
├── layout.tsx                        [MODIFY] - Wrap with AuthProvider
│
├── .env.local                        [NEW]
└── .env.example                      [NEW]
Implementation Phases
Phase 1: Foundation
Files to create:

.env.local and .env.example


NEXT_PUBLIC_API_URL=http://localhost:5000/api
app/src/shared/lib/config/env.ts

Validate process.env.NEXT_PUBLIC_API_URL exists
Export typed config object: { apiUrl: string }
Throw helpful error if missing
app/src/shared/types/auth.types.ts


export interface User {
  _id: string;
  email: string;
  name: string;
  role: 'USER' | 'ORGANIZER' | 'ADMIN';
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}
app/src/shared/types/api.types.ts


export interface ApiError {
  status: number;
  message: string;
  field?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}
app/src/shared/utils/error-handler.ts

Parse fetch errors
Transform backend error responses to user-friendly messages
Export handleApiError(error: unknown): string
Phase 2: API Layer
app/src/shared/lib/api/endpoints.ts


export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },
  PROFILE: {
    ME: '/profile/me',
  },
};
app/src/shared/lib/api/client.ts

Create apiClient object with methods: get(), post(), put(), delete()
Use native fetch() API
Automatically add Content-Type: application/json
Inject access token from TokenManager into Authorization header
Parse JSON responses
Handle errors (network, HTTP status codes)
Return typed responses
Key Methods:


export const apiClient = {
  get: async <T>(url: string): Promise<T>
  post: async <T>(url: string, body: unknown): Promise<T>
  // ... etc
}
app/src/shared/lib/auth/token-manager.ts

Manage token storage in sessionStorage + memory
Methods:
getAccessToken(): string | null - Try memory first, fallback to sessionStorage
setAccessToken(token: string): void - Store in both memory and sessionStorage
getRefreshToken(): string | null - Read from sessionStorage
setRefreshToken(token: string): void - Store in sessionStorage
clearTokens(): void - Clear all tokens from memory and storage
isAuthenticated(): boolean - Check if tokens exist
app/src/shared/lib/auth/auth-service.ts

Use apiClient to make auth API calls
Handle token storage via TokenManager after successful login/register
Clear tokens on logout
Methods:


export const authService = {
  login: async (credentials: LoginCredentials): Promise<User>
  register: async (credentials: RegisterCredentials): Promise<User>
  logout: async (): Promise<void>
  refreshToken: async (): Promise<User>
  getCurrentUser: async (): Promise<User>
}
Phase 3: State Management
app/src/auth/context/AuthContext.tsx

Create React Context for global auth state
Provide AuthProvider component
Manage state: user, isLoading, error, isAuthenticated
Expose methods: login(), signup(), logout(), refreshAuth()
On mount: Check for existing tokens → call refreshAuth() to restore session
Handle all async operations and errors
Context Value:


interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  clearError: () => void;
}
app/src/auth/hooks/useAuth.ts

Simple hook that consumes AuthContext
Throw error if used outside AuthProvider
Provides clean API: const { user, login, logout } = useAuth()
Phase 4: Integration
Modify app/layout.tsx

Import AuthProvider
Wrap {children} with <AuthProvider>
Note: Root layout is Server Component, but AuthProvider will be Client Component

import { AuthProvider } from '@/src/auth/context/AuthContext';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
Modify app/src/auth/components/authUI/LoginForm.tsx

Import useAuth hook and useRouter from Next.js
Replace setTimeout simulation with await login(email, password)
Remove local isLoading state, use from context
Add error display above form (red text)
On success: redirect to home page (router.push('/'))
Clear error when user starts typing
Changes:


const { login, isLoading, error, clearError } = useAuth();
const router = useRouter();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    await login(email, password);
    router.push('/'); // or '/dashboard'
  } catch (err) {
    // Error handled in context
  }
};

// Add error display:
{error && (
  <div className="text-sm text-red-600 mb-4">
    {error}
  </div>
)}
Modify app/src/auth/components/authUI/SignupForm.tsx

Similar changes to LoginForm
Import useAuth and useRouter
Replace setTimeout with await signup(fullName, email, password)
Keep password match validation (client-side)
Use context isLoading and error
Redirect on success
Critical Files (In Order of Implementation)
app/src/shared/lib/config/env.ts - Foundation for all API calls
app/src/shared/types/auth.types.ts - Type safety for entire system
app/src/shared/lib/api/client.ts - Core API client used by all services
app/src/shared/lib/auth/token-manager.ts - Token storage abstraction
app/src/shared/lib/auth/auth-service.ts - Auth API methods
app/src/auth/context/AuthContext.tsx - Global state management
app/layout.tsx - Make auth available app-wide
app/src/auth/components/authUI/LoginForm.tsx - First integration point
app/src/auth/components/authUI/SignupForm.tsx - Complete basic auth flow
Token Refresh Mechanism
Initial Implementation (Simple):

On app load: AuthProvider checks for tokens → calls refreshAuth() → restores session
On logout: Clear all tokens
Future Enhancement (Optional):

Auto-refresh before access token expires
Intercept 401 errors in API client → attempt refresh → retry request
Error Handling
Three Levels:

API Client: Catch network errors, parse HTTP error responses
Auth Service: Transform errors to user-friendly messages
UI Components: Display errors inline in forms
Error Display:

Show error message above form inputs (red text)
Clear error when user modifies input
Non-blocking, allows user to retry
Example Error Messages:

401 Unauthorized → "Invalid email or password"
409 Conflict → "An account with this email already exists"
Network error → "Unable to connect. Please check your internet connection."
Verification Steps
After implementation, test the following:

Signup Flow:

✓ Open /src/auth page
✓ Fill signup form with new email
✓ Submit → should show loading state
✓ On success → redirect to home page
✓ Check browser DevTools → tokens in sessionStorage
✓ Refresh page → should stay logged in (session restored)
Login Flow:

✓ Logout (if logged in)
✓ Fill login form with existing credentials
✓ Submit → should login and redirect
✓ Verify tokens stored
Error Handling:

✓ Try signup with existing email → should show error
✓ Try login with wrong password → should show error
✓ Disconnect internet → should show network error
Logout Flow:

✓ Click logout (add logout button to navbar/profile menu)
✓ Tokens cleared from sessionStorage
✓ Redirect to auth page
Token Refresh:

✓ Login
✓ Wait 16+ minutes (access token expires)
✓ Make API call (e.g., fetch profile)
✓ Should auto-refresh and continue working
Out of Scope (Future Tasks)
Middleware for route protection
Protected route groups
Dashboard page
Password strength indicator
Email verification
Password reset flow
OAuth providers
Remember me functionality
Role-based access control
Dependencies
Required:

None (using native fetch, React Context, Next.js built-ins)
Optional (for future enhancements):

Toast notification library (react-hot-toast, sonner)
Form validation library (zod, react-hook-form)
JWT decode library (jwt-decode)
Security Notes
sessionStorage vs localStorage: Using sessionStorage (cleared on tab close) is more secure than localStorage for tokens
Memory-first: Access token stored in memory prevents XSS attacks
No token logging: Never log tokens to console in production
HTTPS only: In production, ensure API uses HTTPS
Clear on logout: Always clear all tokens from all storage locations
Token rotation: Backend should rotate refresh token on each refresh (backend responsibility)
Existing Patterns to Follow
Component styling: Use existing Tailwind classes from LoginForm/SignupForm
Loading states: Disable button, show loading text, reduce opacity
Form structure: HTML5 validation with required, type="email", minLength
File organization: Feature-based (auth/, shared/)
Imports: Use @/ path alias
Notes
Root layout is Server Component → AuthProvider must be marked 'use client'
Auth forms are already Client Components ('use client')
Keep error messages user-friendly, don't expose technical details
Backend URL must include /api path (e.g., http://localhost:5000/api)
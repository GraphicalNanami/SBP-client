# Auth Feature - Context & Documentation

## Purpose
Authentication feature for user registration and login with JWT-based session management. Provides a clean, institutional-grade UI for signing up and signing in to the Stellar Global platform.

## User Stories
- As a new user, I want to create an account with my email and password
- As a returning user, I want to sign in with my credentials
- As a user, I want a secure authentication experience with password validation
- As a user, I want to easily switch between login and signup forms

## Key Components

### UI Layer (`components/authUI/`)

#### `AuthLayout.tsx`
- **Purpose**: Main layout component for authentication pages with split-screen design
- **Features**:
  - Split-screen layout (image left, form right on desktop)
  - Responsive design (stacks on mobile)
  - Toggle between login and signup forms using local state
  - Decorative background image with gradient overlay
  - Orbital logo SVG with gradients
- **State**: `isLogin` (boolean) - controls which form is displayed

#### `LoginForm.tsx`
- **Purpose**: User login form with email and password
- **Fields**:
  - Email (required, type email)
  - Password (required, type password)
- **Actions**:
  - Submit form (simulated API call with 1s delay)
  - Switch to signup form
- **State**: 
  - `email`, `password` (form inputs)
  - `isLoading` (submission state)

#### `SignupForm.tsx`
- **Purpose**: User registration form with validation
- **Fields**:
  - Full Name (required, text)
  - Email (required, type email)
  - Password (required, min 8 chars)
  - Confirm Password (required, must match)
- **Actions**:
  - Submit form with password match validation
  - Switch to login form
- **State**:
  - `fullName`, `email`, `password`, `confirmPassword` (form inputs)
  - `isLoading` (submission state)

### Service Layer (`lib/auth/` & `context/`)

#### Token Management & API Integration
- **TokenManager**: Handles secure token storage using sessionStorage + memory
- **AuthService**: Manages API calls for login, register, logout, refresh, getCurrentUser  
- **ApiClient**: Base fetch wrapper with automatic token injection and error handling
- **Error Handler**: Transforms API errors into user-friendly messages

#### Authentication Context
- **AuthContext**: Global state management with React Context
- **useAuth Hook**: Clean API for components to access auth state and methods
- **State**: `{ user, isLoading, isAuthenticated, error }`
- **Methods**: `login()`, `signup()`, `logout()`, `refreshAuth()`, `clearError()`

## Design Implementation

### Color Palette
- Background: White (`#FFFFFF`)
- Foreground: Dark (`#0f0f0f` / `--foreground`)
- Border: Light gray (`--border`)
- Muted text: Gray (`--muted-foreground`)

### Typography
- Headings: Onest font family (`var(--font-onest)`)
- Body: Inter font family (default)
- H1: `text-3xl font-semibold`
- Body text: `text-sm`
- Legal text: `text-xs`

### Layout
- Split-screen on desktop (50/50)
- Full-width single column on mobile
- Form max-width: `max-w-md`
- Padding: `p-6 lg:p-12`

### Form Styling
- Input fields: `rounded-xl` with border
- Focus state: Ring effect with foreground color
- Button: Full-width, dark background, white text
- Loading state: Opacity reduced, cursor disabled

### Left Panel
- Background image from Unsplash (conference photo)
- Gradient overlay: Purple to blue to pink (`from-purple-900/80 via-blue-900/70 to-pink-900/80`)
- Decorative icon: Layered blockchain SVG
- Text: "Meet industry leaders" heading with subtitle

## Data Flow

### Current Implementation (With Backend API)
1. User enters form data
2. Form validates inputs locally (password match, required fields)
3. On submit, calls auth service API endpoint
4. AuthService makes API request and stores JWT tokens securely
5. AuthContext updates global state with user data
6. Redirects to home page on success
7. Displays error inline if request fails
8. On app load: Attempts to restore session using refresh token

## Dependencies
- `react` - Component framework
- `next/link` - Client-side navigation
- External image: Unsplash CDN (conference photo)
- CSS variables from `globals.css`
- Onest font from Google Fonts

## Edge Cases & Validation
- Password mismatch in signup form shows alert
- Minimum password length: 8 characters
- Email validation via HTML5 input type
- Form submission disabled during loading
- Required fields enforced by HTML5 validation

## Recent Changes
**2026-02-06 (Initial Implementation)**
- Initial implementation of auth feature
- Created split-screen layout matching design specs
- Implemented login and signup forms with local state
- Added form validation and loading states
- Updated navbar with Link to auth page
- No API integration yet (using simulated delays)

**2026-02-06 (Backend Integration)**
- ✅ Integrated with backend auth API following comprehensive auth integration plan
- ✅ Created foundation layer: env config, types, error handler
- ✅ Implemented API layer: endpoints, client, token manager, auth service
- ✅ Added global state management with AuthContext and useAuth hook
- ✅ Updated UI components to use real auth API (removed simulations)
- ✅ Added JWT token storage in sessionStorage with memory fallback
- ✅ Implemented proper error handling and user feedback
- ✅ Added auto-refresh auth mechanism for session restoration
- ✅ Connected forms to backend endpoints (/auth/login, /auth/register)
- ✅ Added redirect to home page after successful login/signup

## Future Enhancements
- [ ] Add password strength indicator
- [ ] Add social login options (Google, GitHub)
- [ ] Implement "Forgot Password" flow
- [ ] Add email verification step
- [ ] Implement protected route HOC/middleware
- [ ] Add form validation library (e.g., Zod, React Hook Form)
- [ ] Implement toast notifications for better UX
- [ ] Add loading skeleton for better UX
- [ ] Make image URL configurable (move to env or CMS)
- [ ] Add auto-refresh before token expires
- [ ] Implement 401 error interception and retry logic

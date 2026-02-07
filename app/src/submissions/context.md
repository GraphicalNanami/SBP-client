# Submissions Feature - Context

## Purpose

The Submissions feature enables builders to submit their projects (builds) to hackathons. It provides a streamlined workflow for:
- Joining hackathons with existing builds
- Creating new builds during hackathon registration
- Managing build submissions to multiple hackathons
- Tracking submission status and eligibility

## User Stories

1. **As a builder**, I want to join a hackathon by submitting an existing build from my portfolio
2. **As a builder**, I want to create a new build specifically for a hackathon during registration
3. **As a builder**, I want to see which hackathons I've submitted to and track my submissions
4. **As a hackathon organizer**, I want to view all submissions for my hackathon
5. **As a judge**, I want to score and provide feedback on submissions

## Key Components

### UI Components (@/src/submissions/components/submissionUI/)

#### `JoinHackathonModal.tsx`
- **Purpose**: Modal dialog for hackathon registration flow (NO business logic)
- **Props**: `isOpen`, `onClose`, `hackathonId`, `hackathonName`
- **Features**:
  - Two-step flow: Choose option → Select/Create build
  - Option 1: "Submit an existing build" - Shows list of user's published builds
  - Option 2: "Create a new build" - Creates draft build and redirects to submission
  - Loading states for builds fetching
  - Empty states if user has no builds
  - Error handling with user-friendly messages
- **Styling**: Responsive modal with design system compliance, backdrop blur

### Service Components (@/src/submissions/components/submissionService/)

#### `submissionsApi.ts`
- **Purpose**: API service layer for all submission operations
- **Functions**:
  - `createSubmission(payload)`: POST `/submissions` - Create new submission
  - `getMySubmissions()`: GET `/submissions/my-submissions` - Fetch user's submissions
  - `getHackathonSubmissions(hackathonId)`: GET `/submissions/hackathon/:id` - List all submissions for a hackathon (organizer/judge view)
  - `judgeSubmission(id, payload)`: POST `/submissions/:id/judge` - Submit score and feedback
  - `selectWinner(id, payload)`: POST `/submissions/:id/select-winner` - Mark submission as winner
- **Features**:
  - Type-safe API calls with request/response types
  - Automatic authentication via apiClient
  - Error handling with descriptive messages

#### `useJoinHackathon.ts`
- **Purpose**: Business logic hook for joining hackathons
- **State**:
  - `isModalOpen`: Modal visibility state
  - `step`: Current step in flow ('choose' | 'select-build' | 'create-build')
  - `userBuilds`: Array of user's available builds
  - `isLoadingBuilds`: Loading state for builds fetch
  - `isSubmitting`: Submission in progress state
  - `error`: Error messages
- **Actions**:
  - `openModal()`: Opens the join modal
  - `closeModal()`: Closes modal and resets state
  - `selectExistingBuild(buildId)`: Submits selected build to hackathon
  - `createNewBuild()`: Creates draft build and navigates to edit page
  - `fetchUserBuilds()`: Loads user's published builds
- **Validation**:
  - User must be authenticated
  - Build must be published to be submitted
  - User cannot submit same build twice to same hackathon

### Types (@/src/submissions/types/)

#### `submission.types.ts`
- **Submission**: Main entity with build, hackathon, status, scores
- **SubmissionStatus**: Enum - 'DRAFT', 'SUBMITTED', 'WINNER'
- **CustomAnswer**: Question UUID + answer text
- **JudgingDetails**: Scores array with judge ID, score, feedback
- **CreateSubmissionPayload**: Request payload for creating submissions
- **JudgeSubmissionPayload**: Score and feedback submission

## Data Flow

### Join Hackathon Flow
1. **User clicks "Join Hackathon"** on hackathon detail page
2. **Modal opens** with two options
3. **User chooses option**:
   - **Existing Build Path**:
     a. Fetch user's builds via `GET /builds/my-builds`
     b. Display builds in selectable list
     c. User selects a build
     d. Create submission via `POST /submissions` with buildUuid and hackathonUuid
     e. Show success message and close modal
     f. Optional: Navigate to submission confirmation page
   - **New Build Path**:
     a. Create empty draft build via `POST /builds` with minimal payload (name only)
     b. Navigate to `/builds/edit/:id` with context that it's for hackathon submission
     c. User fills out build details
     d. After publishing build, redirect to create submission

### Submission Creation Flow (Backend)
1. **Frontend sends** CreateSubmissionPayload:
   ```json
   {
     "buildUuid": "...",
     "hackathonUuid": "...",
     "selectedTrackUuids": ["..."],
     "customAnswers": [{"questionUuid": "...", "answer": "..."}]
   }
   ```
2. **Backend validates**:
   - Build exists and user is team member
   - Hackathon is active (not ended)
   - Build not already submitted to this hackathon
   - Selected tracks are valid for hackathon
3. **Backend creates** submission record with status 'SUBMITTED'
4. **Backend returns** created submission object
5. **Frontend shows** success feedback

## Dependencies

### Internal
- `@/src/auth/hooks/useAuth`: Authentication state (user, isAuthenticated)
- `@/src/builds/components/buildService/buildsApi`: Fetch user's builds, create builds
- `@/src/shared/lib/api/client`: Centralized API client with auth
- `@/src/shared/components/ui/button`: Shared button component
- `@/src/shared/utils/endpoints`: API endpoint definitions

### External
- `lucide-react`: Icons (Check, Plus, Loader2, etc.)
- `next/navigation`: useRouter for navigation after build creation
- `react`: useState, useEffect, useCallback for state management

## API Integration

### Endpoint: POST `/submissions`
**Request**:
```json
{
  "buildUuid": "uuid-v4",
  "hackathonUuid": "uuid-v4",
  "selectedTrackUuids": ["track-uuid"],
  "customAnswers": [{"questionUuid": "...", "answer": "..."}]
}
```

**Response**:
```json
{
  "uuid": "uuid-v4",
  "buildUuid": "...",
  "hackathonUuid": "...",
  "status": "SUBMITTED",
  "submittedAt": "2024-02-07T12:00:00Z"
}
```

### Endpoint: GET `/submissions/my-submissions`
**Response**:
```json
[
  {
    "uuid": "...",
    "buildUuid": "...",
    "hackathonUuid": "...",
    "status": "SUBMITTED",
    "submittedAt": "..."
  }
]
```

## Edge Cases & Considerations

1. **Authentication**:
   - Modal only accessible to authenticated users
   - Redirect to auth page if user is not logged in

2. **Build Eligibility**:
   - Only published builds can be submitted
   - Builds in draft status are not shown in selection list

3. **Duplicate Submissions**:
   - Backend prevents submitting same build to same hackathon twice
   - Frontend shows error message if duplicate attempted

4. **Hackathon Status**:
   - Cannot join ended hackathons
   - Join button disabled for past hackathons

5. **Empty States**:
   - If user has no published builds, show "Create New Build" as primary option
   - Provide helpful messaging about build requirements

6. **Error Handling**:
   - Network errors: Retry functionality
   - Validation errors: Clear error messages
   - Server errors: User-friendly fallback messaging

## Recent Changes

### 2026-02-07 - Initial Implementation Complete
- ✅ Created submissions feature structure with proper UI/Service separation
- ✅ Created context.md with comprehensive documentation
- ✅ Implemented submission types (`submission.types.ts`)
  - Defined SubmissionStatus enum (DRAFT, SUBMITTED, WINNER)
  - Created API payload types (CreateSubmissionPayload, JudgeSubmissionPayload, SelectWinnerPayload)
  - Defined response types for submissions list and my submissions
- ✅ Built submissions API service (`submissionsApi.ts`)
  - `createSubmission()`: Create new hackathon submission
  - `getMySubmissions()`: Fetch user's submissions
  - `getHackathonSubmissions()`: List all submissions for a hackathon (organizer view)
  - `judgeSubmission()`: Submit score and feedback
  - `selectWinner()`: Mark submission as winner
- ✅ Created JoinHackathonModal UI component (`JoinHackathonModal.tsx`)
  - Two-step flow: Choose option → Select/Create build
  - Option 1: Submit existing build with build selection cards
  - Option 2: Create new build with navigation to build editor
  - Loading states, error handling, empty states
  - Responsive modal design with backdrop blur
  - Build cards with logo, name, tagline, category display
  - Empty state links to `/builds/my-builds` for users to manage their draft builds
- ✅ Implemented useJoinHackathon hook (`useJoinHackathon.ts`)
  - Modal state management (open/close)
  - Fetches user's published builds on modal open
  - `handleCreateNewBuild()`: Creates draft build and navigates to editor
  - `handleSelectExistingBuild()`: Submits selected build to hackathon
  - Error handling and loading states
  - Filters only published builds (draft builds not shown)
- ✅ Integrated with hackathon detail page (`/hackathon/[id]/page.tsx`)
  - Added modal trigger on "Join Hackathon" button
  - Wired up useJoinHackathon hook
  - Modal opens when clicking active hackathon join button
  - Button disabled for ended hackathons
- **Data Flow**: Click Join → Modal opens → Choose option → Either select existing build (creates submission) OR create new build (navigates to editor with hackathon context)

## Feature Architecture Compliance

- ✅ UI/Service separation: submissionUI/ (presentation only) vs submissionService/ (business logic)
- ✅ Single context.md file (NO docs/ folder)
- ✅ Path aliases: `@/src/...` instead of relative paths
- ✅ Props for data passing between components
- ✅ useState/useEffect for local state management
- ✅ Integrated with centralized API client

## Design System Adherence

### Modal Styling
- Backdrop: `bg-black/50` with backdrop blur
- Container: `bg-white rounded-2xl shadow-xl max-w-2xl`
- Header: Large title with close button
- Content: Padded sections with clear visual hierarchy
- Buttons: Primary (bg-[#8B4513]) and secondary (border-[#E5E5E5])
- Transitions: `transition-all duration-200 ease-in-out`

### Build Selection Cards
- Border: `border border-[#E5E5E5]`
- Hover: `hover:border-[#8B4513] hover:shadow-md`
- Selected: `border-[#8B4513] bg-[#8B4513]/5`
- Padding: `p-4`
- Border radius: `rounded-xl`

## Future Enhancements (V2)

- Track selection UI if hackathon has multiple tracks
- Custom question form for registration questions
- Submission preview before final submit
- Edit submission after submission (before deadline)
- Submission analytics for builders (views, judge feedback)
- Team collaboration for multi-member build submissions

# Events Feature

## Purpose
A unified hub for discovering, following, and engaging with Web3 events in the Stellar ecosystem. Inspired by the "Gradient Grid with Glassmorphism Cards" design.

## User Stories
- As a developer, I want to browse upcoming Web3 events (conferences, meetups, hackathons).
- As a user, I want to filter events by type (Virtual, In-Person, etc.) and category (DeFi, Security, etc.).
- As a user, I want to search for specific events.
- As a user, I want to view detailed information about an event in a slide-over/modal.

## Key Components

### UI Layer (`eventsUI/`)
- `EventHero.tsx`: Hero section with featured titles and search. **(Deprecated - integrated into page.tsx)**
- `FilterBar.tsx`: Sticky filter bar with pills and dropdowns.
- `EventCard.tsx`: Light-themed cards with type-based colors (featured and regular variants).
- `EventGrid.tsx`: 3-column bento layout (1 large + 2 stacked cards + calendar widget) + regular grid for remaining events.
- `EventDetailModal.tsx`: Luma-style event detail modal with registration, hosted by section, attendees, and tags.
- `JoinCommunitySection.tsx`: Community CTA with blob-shaped images and decorative elements.
- `ExploreCategoriesSection.tsx`: 5 category cards with colored borders and hover effects.
- `PopularCitiesSection.tsx`: City cards with skyline images and wavy SVG bottom edges.
- `HowItWorksSection.tsx`: 3-step explanation flow with connecting wavy lines.
- `CalendarButton.tsx`: Beautiful accent-colored button to open calendar modal.
- `CalendarModal.tsx`: Full-screen modal wrapper for calendar view.
- `EventCalendar.tsx`: Calendar component with real event data integration.

### Service Layer (`eventsService/`)
- `useEvents.ts`: Hook for managing event state, filtering, and searching.
- `events-api.ts`: API calls for fetching events.

## Data Flow
1. `useEvents` fetches data from the backend (mocked initially).
2. Data is filtered and sorted based on `FilterBar` and `EventHero` search inputs.
3. `EventGrid` renders the list of filtered events using `EventCard`.
4. Clicking a card opens `EventDetail` with the selected event.

## Dependencies
- Lucide React (icons)
- Framer Motion (for glassmorphism animations)
- Next.js (App Router)
- Zustand (for global event state if needed)
- **shadcn/ui components** (Button, Card, Separator, Select)
- **react-day-picker** (calendar functionality)
- **date-fns** (date manipulation for calendar presets)
- **@radix-ui** primitives (react-slot, react-icons, react-select, react-separator)
- **class-variance-authority** (button variants)

## Recent Changes
- 2026-02-06: Initial documentation and structure creation.
- 2026-02-06: Implemented EventHero, FilterBar, EventCard, and EventGrid.
- 2026-02-06: Added useEvents hook and mock data.
- 2026-02-06: Created main EventsPage and added routing rewrites in next.config.ts.
- 2026-02-06: Transformed entire Events page to light theme matching landing page design.
- 2026-02-06: Added highlighted text elements (UnderlineHighlight, CircleHighlight, BackgroundHighlight) throughout.
- 2026-02-06: **MAJOR REDESIGN** - Complete page restructure inspired by Meetup.com:
  - Replaced sidebar with Netflix-style centered modal (EventDetailModal) for event details
  - Modal features: full-screen card with padding, shadow effects, beautiful typography
  - Simplified hero section (removed large search, kept title with highlights and wavy background text)
  - Implemented 2-column bento grid: 1 large rectangular card + 2 vertically stacked cards
  - Added JoinCommunitySection with blob-shaped images and decorative elements
  - Added ExploreCategoriesSection with 5 colorful category cards
  - Added PopularCitiesSection with city skyline images and wavy bottom edges
  - Added HowItWorksSection with 3-step flow and connecting wavy lines
  - Moved filters to sticky bar below hero
  - Added 6 diverse mock events for better showcase
- 2026-02-06: **CALENDAR INTEGRATION** - Added shadcn/ui calendar component:
  - Created `/components/ui` folder structure for shadcn components
  - Installed required dependencies (react-day-picker, date-fns, @radix-ui primitives)
  - Implemented range calendar with preset date filters (Today, Last 7 Days, Last Month, etc.)
  - Integrated calendar into EventGrid as 3rd column beside the 2 stacked event cards
  - Calendar only visible on large screens (lg breakpoint) to maintain responsive design
  - Calendar features sidebar with scrollable presets and dynamic height matching
- 2026-02-06: **UNIFIED CALENDAR MODAL SYSTEM**:
  - Updated event types with EventTag, EventAttendee, and enhanced organizer fields
  - Updated MOCK_EVENTS with 2026 dates matching real events (Students Hackathon, Stellar Technical Bootcamp)
  - Created CalendarButton component with beautiful accent styling in hero section
  - Created CalendarModal wrapper for full-screen calendar view
  - Updated EventCalendar to use real MOCK_EVENTS data
  - Enhanced FullScreenCalendar with onClick handlers for event labels
  - Redesigned EventDetailModal with Luma-style layout:
    - Registration status badges (Sold Out, Open Registration)
    - Hosted By section with organizer avatars and Twitter links
    - Attendees display with avatar grid
    - Color-coded tags (hackathon, bootcamp, meetups, etc.)
    - About Event section with longDescription
    - Contact Host and Report Event links
  - Unified event detail view accessible from both EventGrid cards and Calendar labels
  - Removed CalendarDemo from bottom of page, now only accessible via modal

## Future Enhancements
- Calendar view toggle.
- "Submit Event" flow.
- Featured events carousel.

# Hackathons Feature

## Purpose
Central hub for discovering and managing Stellar ecosystem hackathons.

## User Stories
- As a developer, I want to browse available hackathons
- As an organizer, I want to create a new hackathon via the organization flow

## Key Components

### UI Layer
- `page.tsx` - Main hackathons listing page with "Create Hackathon" CTA

### Navigation
- "Create Hackathon" button → `/src/organization` (organization setup flow)

## Dependencies
- `@/src/organization` - For hackathon creation flow
- Lucide React icons

## Recent Changes
- **2026-02-06**: Initial page setup with proper Next.js navigation using Link component

## Future Enhancements
- Hackathon listing grid
- Filter by status (upcoming, active, completed)
- Search functionality
- Pagination

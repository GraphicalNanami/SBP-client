# Mock Events Seeding Script

This script seeds the mock events data from the frontend to your backend API.

## Prerequisites

1. **Backend API running** at the URL specified in `NEXT_PUBLIC_API_URL`
2. **Valid JWT authentication token** from a logged-in user

## Getting Your Auth Token

### Method 1: Browser DevTools
1. Sign in to your application in the browser
2. Open DevTools (F12 or Cmd+Option+I on Mac)
3. Go to **Application** tab > **Local Storage**
4. Find and copy the auth token value (usually under key like `token` or `auth_token`)

### Method 2: API Response
1. Make a login request to your auth endpoint
2. Copy the `access_token` or `token` from the response

## Running the Seed Script

### With Environment Variable:
```bash
SEED_AUTH_TOKEN=your_jwt_token_here pnpm seed-events
```

### Example:
```bash
SEED_AUTH_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMTIzNCIsImlhdCI6MTY3... pnpm seed-events
```

### With Custom API URL:
```bash
NEXT_PUBLIC_API_URL=https://your-api.com/api SEED_AUTH_TOKEN=your_token pnpm seed-events
```

## What the Script Does

1. **Reads** all 9 mock events from `mockData.ts`
2. **Transforms** each event to match backend `CreateLiveEventDto` format
3. **Maps** frontend event types to backend EventType enum:
   - `Meetup` → `MEETUP`
   - `Workshop` (Virtual) → `WORKSHOP_VIRTUAL`
   - `Workshop` (Physical) → `WORKSHOP_PHYSICAL`
   - `Bootcamp` → `WORKSHOP_PHYSICAL`
   - `Hackathon` → `CONFERENCE`
   - `University` → `CONFERENCE`
4. **Sends** POST requests to `POST /live-events` with authentication
5. **Reports** success/failure for each event

## Expected Output

```
🌱 Starting mock events seed...

[1/9] Creating: Students Hackathon: Building on the Stellar Blockchain
   Type: Hackathon | Location: Tanzania
   ✅ Success! UUID: abc-123

[2/9] Creating: Stellar Technical Blockchain BOOTCAMP
   Type: Bootcamp | Location: Kenya
   ✅ Success! UUID: def-456

...

============================================================
📊 Seed Summary:
   ✅ Successfully created: 9 events
   ❌ Failed: 0 events
   📋 Total processed: 9 events
============================================================

🎉 All mock events have been successfully seeded to the backend!
```

## Troubleshooting

### Error: "SEED_AUTH_TOKEN environment variable is required"
- You forgot to provide the auth token
- Use: `SEED_AUTH_TOKEN=your_token pnpm seed-events`

### Error: "401 Unauthorized"
- Your token is invalid or expired
- Get a fresh token by logging in again

### Error: "400 Validation errors"
- Backend validation failed for event data
- Check the error message for specific field issues
- Verify the CreateLiveEventDto schema matches your backend

### Error: "Failed to create event: 404"
- Backend API URL is incorrect
- Check `NEXT_PUBLIC_API_URL` environment variable
- Verify your backend is running

### Error: "ECONNREFUSED"
- Backend server is not running
- Start your backend server first

## Event Mapping Details

### Fields Transformed:
- `title` → `title`
- `longDescription` → `description` (uses longDescription if available)
- `startDate` → `startDate` (ISO 8601 format)
- `endDate` → `endDate` (ISO 8601 format)
- `type` + `locationType` → `eventType` (enum mapping)
- `country` → `country`
- `venue` or `location` → `location`
- `hostedBy[]` → `hosts[]` (array of host objects)
- `coverImage` → `bannerUrl`
- `tags[]` → `tags[]`

### Fields Not Mapped (not in mock data):
- `externalUrl` (set to `undefined`)

## After Seeding

Once seeded successfully:
1. All 9 mock events will exist in your backend database
2. Users can register for these events
3. Events will appear in `GET /live-events` responses
4. Frontend will merge these with any additional mock events

## Re-running the Script

If you need to re-seed:
1. **Clear existing events** from your database (or they'll be duplicated)
2. Run the script again with a fresh token

## Script Location

- Script: `scripts/seed-mock-events.ts`
- Mock Data: `app/src/events/components/eventsService/mockData.ts`
- Configuration: Uses `NEXT_PUBLIC_API_URL` and `SEED_AUTH_TOKEN` env vars

# Events Feature - Backend Integration Flow

## Overview
The frontend has a hybrid event system that combines:
1. **Mock Events** (hardcoded frontend data for showcase/demo)
2. **Live Events** (real backend data from API)

When users interact with events (register/unregister), the frontend intelligently syncs with the backend.

---

## Complete Data Flow

### 1. Fetching All Events (Initial Load)

**Frontend Action:**
- User visits `/src/events` page
- Frontend calls `GET /live-events` API

**Backend Response Expected:**
```json
{
  "events": [
    {
      "uuid": "backend-event-123",
      "title": "Real Event from Backend",
      "description": "...",
      "startDate": "2026-03-15T10:00:00Z",
      "endDate": "2026-03-15T18:00:00Z",
      "status": "UPCOMING",
      "eventType": "CONFERENCE",
      "country": "India",
      "location": "Mumbai",
      "hosts": [{"name": "John Doe", "role": "Speaker"}],
      "registeredCount": 150,
      "bannerUrl": "https://...",
      "externalUrl": "https://...",
      "tags": ["blockchain", "web3"]
    }
  ],
  "total": 1,
  "limit": 100,
  "skip": 0
}
```

**Frontend Processing:**
1. Receives backend events array
2. Takes hardcoded mock events from frontend
3. **Merges both arrays**: `[...mockEvents, ...backendEvents]`
4. Displays combined list to user
5. User sees both mock events (for demo) and real backend events together

**Result:** 
- If backend has 5 events and frontend has 6 mock events, user sees 11 total events
- Mock events have IDs starting with "mock-" (e.g., "mock-stellar-india-2026")
- Backend events have UUIDs from database

---

### 2. Viewing Event Details

**Frontend Action:**
- User clicks on an event card
- Frontend navigates to `/src/events/{eventId}` or `/src/events/{uuid}`

**Two Scenarios:**

#### Scenario A: Mock Event (ID starts with "mock-")
- Frontend does NOT call backend
- Shows data from hardcoded frontend object
- Registration button appears

#### Scenario B: Backend Event (UUID from backend)
- Frontend calls `GET /live-events/{uuid}`
- Backend returns full event details with current `registeredCount`
- If user is logged in, frontend also calls `GET /live-events/me/registrations` to check if user already registered

**Backend Response for Detail:**
```json
{
  "uuid": "backend-event-123",
  "title": "Real Event",
  "registeredCount": 150,
  // ... all other fields
}
```

---

### 3. User Registration Flow (THE CRITICAL PART)

**Frontend Action:**
- User is viewing an event (mock or backend)
- User clicks "Register" button
- Frontend checks if event is mock or backend

#### Flow A: Registering for Mock Event (Auto-Create in Backend)

**Step 1:** Frontend detects event ID starts with "mock-"

**Step 2:** Frontend calls `POST /live-events/{mockEventId}/register`

**Step 3:** Backend receives registration request with `mockEventId` (e.g., "mock-stellar-india-2026")

**Step 4 (BACKEND LOGIC REQUIRED):** Backend checks if event UUID exists:
```javascript
// Backend pseudocode
if (!eventExistsInDatabase(mockEventId)) {
  // Event doesn't exist, need to create it first
  
  // Frontend will send the full event data in request body
  const eventData = request.body.eventData; // Frontend sends this!
  
  // Create event in database
  const newEvent = createEvent({
    uuid: mockEventId, // Use the mock ID as UUID
    title: eventData.title,
    description: eventData.description,
    startDate: eventData.startDate,
    endDate: eventData.endDate,
    eventType: eventData.eventType,
    country: eventData.country,
    location: eventData.location,
    hosts: eventData.hosts,
    bannerUrl: eventData.bannerUrl,
    externalUrl: eventData.externalUrl,
    tags: eventData.tags,
    registeredCount: 0 // Initial count
  });
}

// Now register the user
registerUserForEvent(userId, mockEventId);
incrementRegisteredCount(mockEventId);

return {
  eventUuid: mockEventId,
  userUuid: userId,
  registered: true,
  registeredCount: getUpdatedCount(mockEventId),
  registeredAt: new Date().toISOString()
};
```

**Step 5:** Backend returns success response:
```json
{
  "eventUuid": "mock-stellar-india-2026",
  "userUuid": "user-456",
  "registered": true,
  "registeredCount": 1,
  "registeredAt": "2026-02-07T10:30:00Z"
}
```

**Step 6:** Frontend updates UI:
- Button changes from "Register" to "Unregister"
- Shows updated `registeredCount`
- Event is now "real" in backend for future fetches

#### Flow B: Registering for Backend Event (Normal Registration)

**Step 1:** Event UUID is from backend (not starting with "mock-")

**Step 2:** Frontend calls `POST /live-events/{uuid}/register`

**Step 3:** Backend registers user (event already exists):
```javascript
// Backend pseudocode
if (userAlreadyRegistered(userId, eventUuid)) {
  return {
    eventUuid: eventUuid,
    userUuid: userId,
    alreadyRegistered: true,
    registeredCount: getCurrentCount(eventUuid)
  };
}

registerUserForEvent(userId, eventUuid);
incrementRegisteredCount(eventUuid);

return {
  eventUuid: eventUuid,
  userUuid: userId,
  registered: true,
  registeredCount: getUpdatedCount(eventUuid),
  registeredAt: new Date().toISOString()
};
```

**Step 4:** Frontend updates UI with new registration status

---

### 4. Registration Request Body Structure

**Frontend sends this to `POST /live-events/{eventId}/register`:**

```json
{
  "eventData": {
    "uuid": "mock-stellar-india-2026",
    "title": "Stellar India Summit 2026",
    "description": "Premier Stellar blockchain conference in India...",
    "startDate": "2026-03-15T10:00:00.000Z",
    "endDate": "2026-03-17T18:00:00.000Z",
    "status": "UPCOMING",
    "eventType": "CONFERENCE",
    "country": "India",
    "location": "Mumbai",
    "hosts": [
      {
        "name": "Stellar Foundation",
        "role": "Organizer",
        "avatar": "https://..."
      }
    ],
    "bannerUrl": "https://example.com/banner.jpg",
    "externalUrl": "https://stellarindia.com",
    "tags": ["conference", "blockchain", "stellar", "india"],
    "registeredCount": 0
  }
}
```

**Important Notes:**
- `eventData` is ONLY included when registering for mock events (ID starts with "mock-")
- For backend events, request body is empty `{}`
- Backend MUST check if `eventData` exists in request body to determine if auto-creation is needed

---

### 5. Unregistration Flow

**Frontend Action:**
- User clicks "Unregister" button
- Frontend calls `DELETE /live-events/{eventId}/register`

**Backend Logic:**
```javascript
// Backend pseudocode
unregisterUserFromEvent(userId, eventUuid);
decrementRegisteredCount(eventUuid);

return {
  eventUuid: eventUuid,
  userUuid: userId,
  unregistered: true,
  registeredCount: getUpdatedCount(eventUuid)
};
```

**Response:**
```json
{
  "eventUuid": "mock-stellar-india-2026",
  "userUuid": "user-456",
  "unregistered": true,
  "registeredCount": 0
}
```

**Frontend:** Updates button back to "Register"

---

### 6. Fetching User's Registered Events

**Frontend Action:**
- User goes to "My Events" page (`/src/userProfile/my-events`)
- Frontend calls `GET /live-events/me/registrations`

**Backend Response:**
```json
{
  "userUuid": "user-456",
  "registrations": [
    {
      "event": {
        "uuid": "mock-stellar-india-2026",
        "title": "Stellar India Summit 2026",
        "registeredCount": 1,
        // ... full event object
      },
      "registeredAt": "2026-02-07T10:30:00Z"
    },
    {
      "event": {
        "uuid": "backend-event-123",
        "title": "Real Backend Event",
        "registeredCount": 150,
        // ... full event object
      },
      "registeredAt": "2026-02-05T14:20:00Z"
    }
  ],
  "total": 2
}
```

**Frontend:** Displays all registered events (both auto-created mock events and normal backend events)

---

## Backend Requirements Summary

### 1. Registration Endpoint Enhancement
**Endpoint:** `POST /live-events/{eventId}/register`

**Required Logic:**
```
1. Check if request body contains `eventData` field
2. If YES:
   a. Event doesn't exist in database yet (it's a mock event)
   b. Extract event data from request.body.eventData
   c. Create new event in database using provided data
   d. Use the eventId from URL as the UUID
   e. Register user for this newly created event
3. If NO:
   a. Event already exists in database
   b. Just register user normally
4. Return registration response with updated registeredCount
```

### 2. Event List Endpoint
**Endpoint:** `GET /live-events`
- Return all events from database
- Frontend will merge with mock events automatically
- Include accurate `registeredCount` for each event

### 3. Event Detail Endpoint
**Endpoint:** `GET /live-events/{uuid}`
- Return full event details
- Include current `registeredCount`

### 4. User Registrations Endpoint
**Endpoint:** `GET /live-events/me/registrations`
- Return all events user has registered for
- Include both auto-created (from mocks) and normal events
- Each registration includes full event object + `registeredAt` timestamp

### 5. Unregister Endpoint
**Endpoint:** `DELETE /live-events/{uuid}/register`
- Remove user registration
- Decrement `registeredCount`
- Return updated count

---

## Example Backend Implementation (Node.js/Express)

```javascript
app.post('/live-events/:eventId/register', async (req, res) => {
  const { eventId } = req.params;
  const { eventData } = req.body;
  const userId = req.user.id; // From auth middleware

  try {
    // Check if event exists
    let event = await Event.findOne({ uuid: eventId });

    // If event doesn't exist AND eventData is provided, create it
    if (!event && eventData) {
      event = await Event.create({
        uuid: eventId, // Use the mock ID
        title: eventData.title,
        description: eventData.description,
        startDate: new Date(eventData.startDate),
        endDate: new Date(eventData.endDate),
        status: eventData.status,
        eventType: eventData.eventType,
        country: eventData.country,
        location: eventData.location,
        hosts: eventData.hosts,
        bannerUrl: eventData.bannerUrl,
        externalUrl: eventData.externalUrl,
        tags: eventData.tags,
        registeredCount: 0
      });
    }

    // Check if user already registered
    const existingRegistration = await Registration.findOne({
      userId,
      eventId: event._id
    });

    if (existingRegistration) {
      return res.json({
        eventUuid: eventId,
        userUuid: userId,
        alreadyRegistered: true,
        registeredCount: event.registeredCount
      });
    }

    // Create registration
    await Registration.create({
      userId,
      eventId: event._id,
      registeredAt: new Date()
    });

    // Increment count
    event.registeredCount += 1;
    await event.save();

    res.json({
      eventUuid: eventId,
      userUuid: userId,
      registered: true,
      registeredCount: event.registeredCount,
      registeredAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});
```

---

## Key Points for Backend Team

1. **Auto-Creation is Seamless:** When frontend sends `eventData` in registration request, backend creates the event automatically. No manual event creation needed.

2. **Mock IDs are UUIDs:** Frontend mock event IDs (like "mock-stellar-india-2026") become the UUID in backend database.

3. **Registration Count is Critical:** Always return updated `registeredCount` in responses so frontend shows accurate numbers.

4. **No Duplicate Data:** Once a mock event is registered, it becomes a real backend event. Future fetches from `GET /live-events` will include it.

5. **User Experience:** From user's perspective, there's no difference between mock and backend events. They see one unified list.

6. **My Events Works Automatically:** Since mock events are auto-created in backend on first registration, they appear in user's registered events list normally.

---

## Testing Scenarios

### Scenario 1: First User Registers for Mock Event
1. Frontend shows event with ID "mock-stellar-india-2026"
2. User clicks "Register"
3. Backend receives POST with full `eventData`
4. Backend creates event in database
5. Backend registers user
6. Returns `registeredCount: 1`

### Scenario 2: Second User Registers for Same Mock Event
1. Frontend shows same event "mock-stellar-india-2026"
2. User clicks "Register"
3. Backend receives POST (eventData might be included)
4. Backend finds event already exists in database
5. Backend registers second user
6. Returns `registeredCount: 2`

### Scenario 3: User Fetches All Events
1. Frontend calls `GET /live-events`
2. Backend returns events (including auto-created mocks)
3. Frontend merges with frontend mocks (avoiding duplicates by ID)
4. User sees complete list with accurate registration counts

### Scenario 4: User Views My Events
1. User registered for both mock and backend events
2. Frontend calls `GET /live-events/me/registrations`
3. Backend returns both types of events
4. Frontend displays unified list

---

## Summary

The system is designed to provide a **seamless hybrid experience**:
- **Frontend:** Maintains demo/showcase events (mocks) for immediate display
- **Backend:** Stores real event data and user registrations
- **Auto-Sync:** When users interact with mock events, they automatically become real backend events
- **Unified View:** Users see both mock and backend events as one cohesive list
- **No Manual Work:** Backend developers don't need to manually seed mock data—it happens automatically through user interactions

This approach allows:
- Fast initial page loads (mock data shows instantly)
- Real backend integration for registrations
- Accurate registration counts across all events
- Smooth transition from demo to production data

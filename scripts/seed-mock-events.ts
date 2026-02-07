import { MOCK_EVENTS } from '../app/src/events/components/eventsService/mockData';

// Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const AUTH_TOKEN = process.env.SEED_AUTH_TOKEN; // You need to provide a valid JWT token

// EventType enum from backend
enum EventType {
  MEETUP = 'MEETUP',
  WORKSHOP_VIRTUAL = 'WORKSHOP_VIRTUAL',
  WORKSHOP_PHYSICAL = 'WORKSHOP_PHYSICAL',
  CONFERENCE = 'CONFERENCE',
}

// Map frontend event types to backend EventType enum
function mapEventType(type: string, locationType: string): EventType {
  switch (type) {
    case 'Meetup':
      return EventType.MEETUP;
    case 'Workshop':
      return locationType === 'Virtual' ? EventType.WORKSHOP_VIRTUAL : EventType.WORKSHOP_PHYSICAL;
    case 'Bootcamp':
      return EventType.WORKSHOP_PHYSICAL; // Bootcamp maps to physical workshop
    case 'Hackathon':
    case 'University':
      return EventType.CONFERENCE; // Hackathons and University events map to conference
    default:
      return EventType.MEETUP;
  }
}

interface CreateLiveEventDto {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  eventType: EventType;
  country: string;
  location?: string;
  hosts: Array<{
    name: string;
    role?: string;
    avatar?: string;
  }>;
  bannerUrl?: string;
  externalUrl?: string;
  tags?: string[];
}

// Transform mock event to backend DTO
function transformMockEventToDto(mockEvent: typeof MOCK_EVENTS[0]): CreateLiveEventDto {
  // Get hosts from hostedBy or use organizer as fallback
  let hosts: Array<{ name: string; role?: string; avatar?: string }> = [];
  
  if (mockEvent.hostedBy && mockEvent.hostedBy.length > 0) {
    hosts = mockEvent.hostedBy.map(host => ({
      name: host.name || 'Unknown Host',
      role: undefined,
      avatar: host.avatar,
    }));
  } else if (mockEvent.organizer) {
    // Use organizer as host if hostedBy is missing
    hosts = [{
      name: mockEvent.organizer.name || 'Event Organizer',
      role: 'Organizer',
      avatar: mockEvent.organizer.avatar,
    }];
  } else {
    // Fallback host
    hosts = [{ name: 'Event Host', role: 'Organizer' }];
  }

  return {
    title: mockEvent.title,
    description: mockEvent.longDescription || mockEvent.description,
    startDate: mockEvent.startDate,
    endDate: mockEvent.endDate,
    eventType: mapEventType(mockEvent.type, mockEvent.locationType),
    country: mockEvent.country,
    location: mockEvent.venue || mockEvent.location,
    hosts: hosts,
    bannerUrl: mockEvent.coverImage,
    externalUrl: undefined, // Not in mock data
    tags: mockEvent.tags,
  };
}

// Create event via API
async function createEvent(eventDto: CreateLiveEventDto, token: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/live-events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(eventDto),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create event: ${response.status} - ${errorText}`);
  }

  return response.json();
}

// Main seed function
async function seedMockEvents() {
  console.log('🌱 Starting mock events seed...\n');

  if (!AUTH_TOKEN) {
    console.error('❌ Error: SEED_AUTH_TOKEN environment variable is required');
    console.log('\nUsage:');
    console.log('  SEED_AUTH_TOKEN=your_jwt_token pnpm seed-events');
    console.log('\nTo get a token:');
    console.log('  1. Sign in to your application');
    console.log('  2. Open browser DevTools > Application > Local Storage');
    console.log('  3. Copy the auth token value');
    process.exit(1);
  }

  let successCount = 0;
  let failureCount = 0;

  for (let i = 0; i < MOCK_EVENTS.length; i++) {
    const mockEvent = MOCK_EVENTS[i];
    console.log(`\n[${i + 1}/${MOCK_EVENTS.length}] Creating: ${mockEvent.title}`);
    console.log(`   Type: ${mockEvent.type} | Location: ${mockEvent.country}`);

    try {
      const eventDto = transformMockEventToDto(mockEvent);
      const result = await createEvent(eventDto, AUTH_TOKEN);
      
      console.log(`   ✅ Success! UUID: ${result.uuid}`);
      successCount++;
      
      // Add a small delay to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`   ❌ Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      failureCount++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 Seed Summary:');
  console.log(`   ✅ Successfully created: ${successCount} events`);
  console.log(`   ❌ Failed: ${failureCount} events`);
  console.log(`   📋 Total processed: ${MOCK_EVENTS.length} events`);
  console.log('='.repeat(60) + '\n');

  if (failureCount === 0) {
    console.log('🎉 All mock events have been successfully seeded to the backend!\n');
  } else {
    console.log('⚠️  Some events failed to seed. Please check the errors above.\n');
    process.exit(1);
  }
}

// Run the seed script
seedMockEvents().catch((error) => {
  console.error('\n💥 Fatal error during seeding:', error);
  process.exit(1);
});

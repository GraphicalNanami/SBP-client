import { Web3Event } from "../../types/event.types";

export const MOCK_EVENTS: Web3Event[] = [
  // East Africa Events
  {
    id: '1',
    title: 'Students Hackathon: Building on the Stellar Blockchain',
    description: 'One-day Students Mini-Hackathon to strengthen the East African Stellar Community in Tanzania and attract a new wave of talented builders.',
    longDescription: 'Following the successful foundational introductions and discussions in our previous meetings, this one-day Students Mini-Hackathon is the next strategic step to strengthen the East African Stellar Community in Tanzania and attract a new wave of talented builders.\n\nThe event brings university students together for hands-on collaboration, practical project building, and direct mentorship from experienced Stellar ecosystem members. Our goal is to convert growing awareness into active participation, long-term engagement, and sustainable growth of local developers building on Stellar.\n\nParticipants will explore real-world use cases such as fast cross-border payments, remittances, and decentralized finance (DeFi) applications, all powered by the Stellar blockchain.',
    type: 'Hackathon',
    locationType: 'In-Person',
    location: 'Dar es Salaam, Tanzania',
    region: 'East Africa',
    country: 'Tanzania',
    venue: 'Dar es Salaam',
    startDate: '2026-02-21T08:00:00Z',
    endDate: '2026-02-21T17:00:00Z',
    timezone: 'GMT+3',
    coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80',
    status: 'Open Registration',
    organizer: {
      name: 'Julius Marenga',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=julius',
      twitter: 'juliusmarenga'
    },
    hostedBy: [
      { name: 'StellarEastAfrica', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=stellareafrica' }
    ],
    attendeeCount: 17,
    attendees: [
      { name: 'Wycliffe Osano', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wycliffe' },
      { name: 'EDMUND JIMMY', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=edmund' },
      { name: 'Sarah Kimani', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah' },
      { name: 'David Omondi', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david' },
      { name: 'Grace Mwangi', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=grace' }
    ],
    tags: ['hackathon', 'university', 'stellar ecosystem'],
    cost: 'Free',
    featured: true
  },
  {
    id: '2',
    title: 'Stellar Technical Blockchain BOOTCAMP',
    description: 'This Bootcamp is about Blockchain Development on Stellar. It Targets Developers and Programmers.',
    longDescription: '3 DAYS of intensive blockchain development training covering:\n\n• Advanced blockchain development concepts\n• Smart contract design and deployment\n• Soroban technical training\n• Understanding blockchain architecture and protocols\n• Advanced blockchain development concepts\n\nTraining Date: 6th Feb - 8th Feb 2026',
    type: 'Bootcamp',
    locationType: 'In-Person',
    location: 'Kakuma, Turkana County, Kenya',
    region: 'East Africa',
    country: 'Kenya',
    venue: 'Inzone Kakuma, 2 Turkana-west',
    startDate: '2026-02-06T09:00:00Z',
    endDate: '2026-02-08T16:00:00Z',
    timezone: 'GMT+3',
    coverImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80',
    status: 'Sold Out',
    organizer: {
      name: 'Almarat Arnu Ngutulu',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=almarat'
    },
    hostedBy: [
      { name: 'StellarEastAfrica', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=stellareafrica' }
    ],
    attendeeCount: 44,
    attendees: [
      { name: 'Aluong Dot Yuol', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aluong' },
      { name: 'Abel Manirambona', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=abel' },
      { name: 'John Kiprono', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john' },
      { name: 'Mary Wanjiku', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mary' }
    ],
    tags: ['bootcamp', 'stellar ecosystem', 'university'],
    cost: 'Free'
  },

  // India Events
  {
    id: '3',
    title: 'Stellar India Developer Workshop',
    description: 'Learn blockchain development with Stellar - from basics to building your first DApp.',
    longDescription: 'A comprehensive workshop for developers in India to learn Stellar blockchain development. Topics include:\n\n• Introduction to Stellar blockchain and its use cases\n• Setting up development environment\n• Building and deploying smart contracts with Soroban\n• Creating DApps on Stellar\n• Best practices for security and scalability\n\nLed by Akash Panda (web3warrior), President of Stellar India Ambassador Program.',
    type: 'Workshop',
    locationType: 'Hybrid',
    location: 'Mumbai, India',
    region: 'India',
    country: 'India',
    venue: 'IIT Bombay',
    startDate: '2026-02-18T10:00:00Z',
    endDate: '2026-02-18T17:00:00Z',
    timezone: 'IST',
    coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80',
    status: 'Open Registration',
    organizer: {
      name: 'Akash Panda',
      discord: 'web3warrior',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=akash'
    },
    hostedBy: [
      { name: 'Stellar India', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=stellarindia' }
    ],
    attendeeCount: 156,
    attendees: [
      { name: 'Raj Patel', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=raj' },
      { name: 'Priya Sharma', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya' },
      { name: 'Amit Kumar', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=amit' },
      { name: 'Sneha Gupta', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sneha' },
      { name: 'Rahul Singh', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rahul' }
    ],
    tags: ['stellar ecosystem', 'bootcamp'],
    cost: 'Free',
    featured: true
  },

  // Brazil Events
  {
    id: '4',
    title: 'Stellar Brazil Build-a-thon',
    description: 'Brazilian builders unite to create innovative Stellar projects. Featuring talks from Soroswap, Cheesecake Lab, and Nearx teams.',
    longDescription: 'Brazil has been a hotbed of innovation for Stellar, producing major projects like Soroswap, Cheesecake Lab, Emigro, Oinc, and Nearx. Join us for a full-day build-a-thon focused on:\n\n• Technical architecture design\n• Team collaboration workshops\n• Building DeFi applications on Stellar\n• Project presentations and judging\n• Networking with ecosystem builders\n\nLed by Caio Mattos (caiodemattos), CEO of Nearx and President of Stellar Brazil Ambassador Program.',
    type: 'Hackathon',
    locationType: 'In-Person',
    location: 'São Paulo, Brazil',
    region: 'Brazil',
    country: 'Brazil',
    venue: 'Google Campus São Paulo',
    startDate: '2026-03-01T10:00:00Z',
    endDate: '2026-03-01T20:00:00Z',
    timezone: 'BRT',
    coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80',
    status: 'Open Registration',
    organizer: {
      name: 'Caio Mattos',
      discord: 'caiodemattos',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=caio'
    },
    hostedBy: [
      { name: 'Nearx', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nearx' },
      { name: 'Soroswap', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=soroswap' }
    ],
    attendeeCount: 234,
    attendees: [
      { name: 'Lucas Silva', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lucas' },
      { name: 'Maria Santos', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria' },
      { name: 'Pedro Costa', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pedro' },
      { name: 'Ana Oliveira', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ana' }
    ],
    tags: ['hackathon', 'builder house', 'stellar ecosystem'],
    cost: 'Free',
    featured: true
  },

  // Colombia Events
  {
    id: '5',
    title: 'StarMaker Colombia: Nebula Workshop',
    description: 'Introduction to Stellar blockchain for beginners in Colombia - the first step in your blockchain journey.',
    longDescription: 'Welcome to StarMaker Colombia! This Nebula-level workshop is designed for complete beginners:\n\n• What is blockchain and why does it matter?\n• Understanding Stellar\'s mission for financial inclusion\n• Setting up your first Stellar wallet\n• Exploring the Stellar ecosystem\n• Connecting with the Colombian community\n\nPart of the 4-stage StarMaker Colombia program (Nebula → Protostar → Quasar → Supernova).',
    type: 'Workshop',
    locationType: 'Hybrid',
    location: 'Bogotá, Colombia',
    region: 'Colombia',
    country: 'Colombia',
    venue: 'Universidad de los Andes',
    startDate: '2026-02-25T14:00:00Z',
    endDate: '2026-02-25T18:00:00Z',
    timezone: 'COT',
    coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80',
    status: 'Open Registration',
    organizer: {
      name: 'StarMaker Colombia',
      discord: 'stellarcolombia',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=colombia'
    },
    attendeeCount: 89,
    attendees: [
      { name: 'Carlos Rodríguez', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carlos' },
      { name: 'Sofia García', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sofia' },
      { name: 'Diego López', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=diego' }
    ],
    tags: ['meetups', 'university', 'stellar ecosystem'],
    cost: 'Free'
  },

  // Virtual/Global Events
  {
    id: '6',
    title: 'Soroban Smart Contract Masterclass',
    description: 'Learn how to build and deploy your first smart contract on Stellar using Soroban and Rust.',
    longDescription: 'A comprehensive virtual masterclass for developers worldwide who want to master Soroban smart contract development:\n\n• Setting up your Soroban development environment\n• Writing your first smart contract in Rust\n• Testing and debugging contracts\n• Deploying to testnet and mainnet\n• Best practices for secure contract development\n• Building a complete DApp from scratch\n\nPerfect for developers with basic Rust knowledge who want to build on Stellar.',
    type: 'Bootcamp',
    locationType: 'Virtual',
    location: 'Zoom / Discord',
    region: 'Virtual',
    country: 'Global',
    startDate: '2026-02-10T15:00:00Z',
    endDate: '2026-03-10T18:00:00Z',
    timezone: 'UTC',
    coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80',
    status: 'Open Registration',
    organizer: {
      name: 'Stellar Global Community',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=community'
    },
    attendeeCount: 456,
    attendees: [
      { name: 'Alex Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex' },
      { name: 'Emma Williams', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma' },
      { name: 'Michael Brown', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael' },
      { name: 'Sophia Davis', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sophia' }
    ],
    tags: ['bootcamp', 'stellar ecosystem'],
    cost: 'Free'
  },

  // Additional Regional Events
  {
    id: '7',
    title: 'Stellar Ecosystem Meetup - Mexico City',
    description: 'Monthly networking event for Stellar developers and enthusiasts in Mexico.',
    longDescription: 'Join the growing Stellar community in Mexico for an evening of networking, project showcases, and knowledge sharing.\n\n🎯 What to expect:\n• Lightning talks from local builders\n• Project demos\n• Open networking session\n• Tacos and refreshments 🌮\n\nWhether you\'re building on Stellar or just curious about the ecosystem, everyone is welcome!',
    type: 'Meetup',
    locationType: 'In-Person',
    location: 'Mexico City, Mexico',
    region: 'Mexico',
    country: 'Mexico',
    venue: 'Campus CDMX',
    startDate: '2026-02-28T19:00:00Z',
    endDate: '2026-02-28T22:00:00Z',
    timezone: 'CST',
    coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80',
    status: 'Open Registration',
    organizer: {
      name: 'Stellar LATAM',
      discord: 'stellarlatam',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=latam'
    },
    attendeeCount: 67,
    attendees: [
      { name: 'Juan Hernández', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=juan' },
      { name: 'Isabel Torres', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=isabel' }
    ],
    tags: ['meetups', 'stellar ecosystem'],
    cost: 'Free'
  },
  {
    id: '8',
    title: 'Builder House: 48-Hour Build Marathon - Buenos Aires',
    description: '48 hours of intensive building with mentorship from top Stellar developers.',
    longDescription: 'Lock in for 48 hours of pure building in Buenos Aires! This intensive builder house brings together developers to:\n\n• Build complete projects from scratch\n• Get mentorship from experienced Stellar developers\n• Collaborate with other builders\n• Present your project to judges and VCs\n• Win prizes and potential funding\n\nAll meals, snacks, and energy drinks provided. Sleeping areas available but optional 😴',
    type: 'Hackathon',
    locationType: 'In-Person',
    location: 'Buenos Aires, Argentina',
    region: 'Argentina',
    country: 'Argentina',
    venue: 'AreaTres Workspace',
    startDate: '2026-03-15T10:00:00Z',
    endDate: '2026-03-17T10:00:00Z',
    timezone: 'ART',
    coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80',
    status: 'Open Registration',
    organizer: {
      name: 'Stellar LATAM',
      discord: 'stellarlatam',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=latam'
    },
    attendeeCount: 45,
    attendees: [
      { name: 'Martín González', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=martin' },
      { name: 'Valentina Fernández', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=valentina' }
    ],
    tags: ['hackathon', 'builder house', 'stellar ecosystem'],
    cost: 'Free',
    featured: true
  },
  {
    id: '9',
    title: 'Stellar Chile University Blockchain Series',
    description: 'Multi-week university course on blockchain technology and Stellar development.',
    longDescription: 'A comprehensive university blockchain series designed for Chilean students and educators:\n\nWeek 1: Introduction to Blockchain & Stellar\nWeek 2: Smart Contracts with Soroban\nWeek 3: DApp Development\nWeek 4: Final Project Presentations\n\nStudents will build real projects and receive certificates upon completion.',
    type: 'University',
    locationType: 'Hybrid',
    location: 'Santiago, Chile',
    region: 'Chile',
    country: 'Chile',
    venue: 'Pontificia Universidad Católica de Chile',
    startDate: '2026-03-05T14:00:00Z',
    endDate: '2026-03-26T18:00:00Z',
    timezone: 'CLT',
    coverImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80',
    status: 'Open Registration',
    organizer: {
      name: 'Stellar LATAM',
      discord: 'stellarlatam',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=latam'
    },
    attendeeCount: 128,
    attendees: [
      { name: 'Cristóbal Silva', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cristobal' },
      { name: 'Francisca Morales', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=francisca' }
    ],
    tags: ['university', 'bootcamp', 'stellar ecosystem'],
    cost: 'Free'
  }
];


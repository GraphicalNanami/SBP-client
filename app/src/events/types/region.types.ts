export type RegionName = 
  | 'India'
  | 'Brazil'
  | 'Colombia'
  | 'Argentina'
  | 'Mexico'
  | 'Chile'
  | 'West Africa'
  | 'East Africa'
  | 'Southern Africa';

export interface RegionalChapter {
  id: string;
  name: RegionName;
  continent: 'Asia' | 'LATAM' | 'Africa';
  president: {
    name: string;
    discord: string;
    avatar?: string;
  };
  description: string;
  socials: {
    twitter?: string;
    telegram?: string;
    discord?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
  meetingSchedule?: {
    day: string;
    time: string;
    timezone: string;
  };
  notionPage?: string;
}

export const REGIONAL_CHAPTERS: Record<RegionName, RegionalChapter> = {
  'India': {
    id: 'india',
    name: 'India',
    continent: 'Asia',
    president: {
      name: 'Akash Panda',
      discord: 'web3warrior',
    },
    description: 'A passionate and diverse community dedicated to promoting the Stellar blockchain and its mission to create equitable access to the global financial system.',
    socials: {
      discord: 'http://discord.gg/stellardev',
      twitter: 'https://twitter.com/stellar',
    },
    notionPage: 'https://stellarregionalambassadors.notion.site/Stellar-India-b87b09213e894365a664d60649f3a2ac'
  },
  'Brazil': {
    id: 'brazil',
    name: 'Brazil',
    continent: 'LATAM',
    president: {
      name: 'Caio Mattos',
      discord: 'caiodemattos',
    },
    description: 'Brazil has been a hotbed of innovation for Stellar, producing major projects like Soroswap, Cheesecake Lab, Emigro, Oinc, and Nearx. Our events focus on building technical architecture, team collaboration, and university students.',
    socials: {
      discord: 'http://discord.gg/stellardev',
      twitter: 'https://twitter.com/stellar',
    },
    notionPage: 'https://stellarregionalambassadors.notion.site/About-Brazil-cbf12359f7ff4403a1258e644b10dccb'
  },
  'Colombia': {
    id: 'colombia',
    name: 'Colombia',
    continent: 'LATAM',
    president: {
      name: 'StarMaker Colombia Team',
      discord: 'stellarcolombia'
    },
    description: 'StarMaker Colombia, el Programa de Embajadores de Stellar diseñado para acelerar la adopción de blockchain en América Latina, generando un impacto significativo y empoderando a las comunidades.',
    socials: {
      discord: 'http://discord.gg/stellardev',
      twitter: 'https://twitter.com/stellar',
      instagram: 'https://instagram.com/stellar',
    },
    notionPage: 'https://stellarregionalambassadors.notion.site/Stellar-Colombia-1152f53cc0b280d0a4a3eb60a151b09f'
  },
  'Argentina': {
    id: 'argentina',
    name: 'Argentina',
    continent: 'LATAM',
    president: {
      name: 'LATAM Ambassador',
      discord: 'stellarlatam'
    },
    description: 'Stellar Ambassador Program in Argentina, promoting blockchain technology and financial inclusion across the region.',
    socials: {
      discord: 'http://discord.gg/stellardev',
      twitter: 'https://twitter.com/stellar',
    }
  },
  'Mexico': {
    id: 'mexico',
    name: 'Mexico',
    continent: 'LATAM',
    president: {
      name: 'LATAM Ambassador',
      discord: 'stellarlatam'
    },
    description: 'Stellar Ambassador Program in Mexico, empowering local communities with blockchain technology and education.',
    socials: {
      discord: 'http://discord.gg/stellardev',
      twitter: 'https://twitter.com/stellar',
    }
  },
  'Chile': {
    id: 'chile',
    name: 'Chile',
    continent: 'LATAM',
    president: {
      name: 'LATAM Ambassador',
      discord: 'stellarlatam'
    },
    description: 'Stellar Ambassador Program in Chile, fostering innovation and blockchain adoption in South America.',
    socials: {
      discord: 'http://discord.gg/stellardev',
      twitter: 'https://twitter.com/stellar',
    }
  },
  'West Africa': {
    id: 'west-africa',
    name: 'West Africa',
    continent: 'Africa',
    president: {
      name: 'West Africa Ambassador',
      discord: 'stellarafrica'
    },
    description: 'Stellar Ambassador Program in West Africa, driving financial inclusion and blockchain education across the region.',
    socials: {
      discord: 'http://discord.gg/stellardev',
      twitter: 'https://twitter.com/stellar',
    }
  },
  'East Africa': {
    id: 'east-africa',
    name: 'East Africa',
    continent: 'Africa',
    president: {
      name: 'East Africa Ambassador',
      discord: 'stellarafrica'
    },
    description: 'Stellar Ambassador Program in East Africa, supporting builders and educators in the blockchain space.',
    socials: {
      discord: 'http://discord.gg/stellardev',
      twitter: 'https://twitter.com/stellar',
    }
  },
  'Southern Africa': {
    id: 'southern-africa',
    name: 'Southern Africa',
    continent: 'Africa',
    president: {
      name: 'Southern Africa Ambassador',
      discord: 'stellarafrica'
    },
    description: 'Stellar Ambassador Program in Southern Africa, promoting blockchain technology and ecosystem growth.',
    socials: {
      discord: 'http://discord.gg/stellardev',
      twitter: 'https://twitter.com/stellar',
    }
  }
};

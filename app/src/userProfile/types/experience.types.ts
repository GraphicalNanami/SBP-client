/**
 * Experience Types
 * Professional experience and skills data structures
 */

export type Web3SkillLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';

export interface Experience {
  userId: string;
  roles: string[];
  yearsOfExperience?: number;
  web3SkillLevel?: Web3SkillLevel;
  programmingLanguages: string[];
  developerTools: string[];
}

export interface UpdateExperiencePayload {
  roles?: string[];
  yearsOfExperience?: number;
  web3SkillLevel?: Web3SkillLevel;
  programmingLanguages?: string[];
  developerTools?: string[];
}

// Predefined options for dropdowns
export const PREDEFINED_ROLES = [
  'Backend Engineer',
  'Frontend Engineer',
  'Full Stack Engineer',
  'Blockchain Engineer',
  'Smart Contract Developer',
  'DevOps Engineer',
  'Data Engineer',
  'Mobile Developer',
  'UI/UX Designer',
  'Product Manager',
] as const;

export const PREDEFINED_LANGUAGES = [
  'JavaScript',
  'TypeScript',
  'Solidity',
  'Rust',
  'Python',
  'Go',
  'Java',
  'C++',
  'Swift',
  'Kotlin',
] as const;

export const PREDEFINED_TOOLS = [
  'Hardhat',
  'Foundry',
  'Truffle',
  'ethers.js',
  'web3.js',
  'Ganache',
  'Remix',
  'OpenZeppelin',
  'Metamask',
  'IPFS',
] as const;

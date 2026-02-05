/**
 * Environment Configuration
 * Validates and exports environment variables for the application
 */

const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || '',
} as const;

// Validate required environment variables
if (!config.apiUrl) {
  throw new Error(
    'Missing required environment variable: NEXT_PUBLIC_API_URL. ' +
    'Please add it to your .env.local file. ' +
    'Example: NEXT_PUBLIC_API_URL=http://localhost:3000/api'
  );
}

export { config };
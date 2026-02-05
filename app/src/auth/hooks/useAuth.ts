/**
 * useAuth Hook
 * Simple hook that consumes AuthContext
 */

import { useAuth as useAuthContext } from '@/src/auth/context/AuthContext';

export const useAuth = useAuthContext;
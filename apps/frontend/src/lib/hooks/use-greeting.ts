/**
 * React Query hooks for Greeting API
 */

import { useQuery } from '@tanstack/react-query';
import { getGreeting, type GreetingResponse } from '../api/greeting.api';

/**
 * Query keys for greeting
 */
export const greetingKeys = {
  all: ['greeting'] as const,
  greeting: () => [...greetingKeys.all] as const,
};

/**
 * Get greeting message
 */
export function useGreeting() {
  return useQuery({
    queryKey: greetingKeys.greeting(),
    queryFn: () => getGreeting(),
  });
}

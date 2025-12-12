/**
 * Greeting API client
 */

import { apiGet } from './api-client';

export interface GreetingResponse {
  message: string;
}

/**
 * Get greeting message
 */
export async function getGreeting(): Promise<GreetingResponse> {
  return apiGet<GreetingResponse>('/greeting');
}

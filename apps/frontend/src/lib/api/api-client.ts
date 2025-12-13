/**
 * API client configuration and utilities using Axios
 */

import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';

const getApiUrl = (): string => {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
};

/**
 * Create axios instance with default configuration
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: getApiUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

import { getSupabaseClient } from '../supabase/supabase-client';

/**
 * Request interceptor
 */
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const supabase = getSupabaseClient();
      const { data } = await supabase.auth.getSession();

      if (data.session?.access_token) {
        console.log('API Client: Attaching token', data.session.access_token.substring(0, 10) + '...');
        config.headers.Authorization = `Bearer ${data.session.access_token}`;
      } else {
        console.warn('API Client: No token found in session');
      }
    } catch (e) {
      console.warn('Failed to attach auth token', e);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/**
 * Response interceptor for error handling
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      const message =
        (error.response.data as { message?: string })?.message ||
        error.message ||
        'An error occurred';
      throw new Error(`API Error: ${error.response.status} - ${message}`);
    } else if (error.request) {
      throw new Error('Network error: No response from server');
    } else {
      throw new Error(`Request error: ${error.message}`);
    }
  },
);

/**
 * GET request
 */
export async function apiGet<T>(
  endpoint: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  const response = await apiClient.get<T>(endpoint, config);
  return response.data;
}

/**
 * POST request
 */
export async function apiPost<T>(
  endpoint: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  const response = await apiClient.post<T>(endpoint, data, config);
  return response.data;
}

/**
 * PATCH request
 */
export async function apiPatch<T>(
  endpoint: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  const response = await apiClient.patch<T>(endpoint, data, config);
  return response.data;
}

/**
 * DELETE request
 */
export async function apiDelete<T>(
  endpoint: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  const response = await apiClient.delete<T>(endpoint, config);
  return response.data;
}

/**
 * Upload file request
 */
export async function apiUpload<T>(
  endpoint: string,
  formData: FormData,
  config?: AxiosRequestConfig,
): Promise<T> {
  const response = await apiClient.post<T>(endpoint, formData, {
    ...config,
    headers: {
      'Content-Type': 'multipart/form-data',
      ...config?.headers,
    },
  });
  return response.data;
}

export default apiClient;

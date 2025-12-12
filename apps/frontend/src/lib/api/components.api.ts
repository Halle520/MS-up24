/**
 * Components API client
 */

import { apiGet, apiPost, apiPatch, apiDelete } from './api-client';

export interface Component {
  id: string;
  type: string;
  content?: string;
  src?: string;
  alt?: string;
  iconName?: string;
  style?: Record<string, unknown>;
  children?: Component[];
}

export interface ComponentListResponse {
  components: Component[];
  total: number;
}

export interface CreateComponentDto {
  type: string;
  content?: string;
  src?: string;
  alt?: string;
  iconName?: string;
  style?: Record<string, unknown>;
  children?: Component[];
}

export interface UpdateComponentDto extends Partial<CreateComponentDto> {}

/**
 * Get all components
 */
export async function getComponents(
  type?: string,
): Promise<ComponentListResponse> {
  const endpoint = type ? `/components?type=${type}` : '/components';
  return apiGet<ComponentListResponse>(endpoint);
}

/**
 * Get available component types
 */
export async function getComponentTypes(): Promise<string[]> {
  return apiGet<string[]>('/components/types');
}

/**
 * Get a component by ID
 */
export async function getComponentById(id: string): Promise<Component> {
  return apiGet<Component>(`/components/${id}`);
}

/**
 * Create a new component
 */
export async function createComponent(
  data: CreateComponentDto,
): Promise<Component> {
  return apiPost<Component>('/components', data);
}

/**
 * Update a component
 */
export async function updateComponent(
  id: string,
  data: UpdateComponentDto,
): Promise<Component> {
  return apiPatch<Component>(`/components/${id}`, data);
}

/**
 * Delete a component
 */
export async function deleteComponent(id: string): Promise<void> {
  return apiDelete<void>(`/components/${id}`);
}

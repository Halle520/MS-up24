/**
 * React Query hooks for Components API
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getComponents,
  getComponentTypes,
  getComponentById,
  createComponent,
  updateComponent,
  deleteComponent,
  type Component,
  type ComponentListResponse,
  type CreateComponentDto,
  type UpdateComponentDto,
} from '../api/components.api';

/**
 * Query keys for components
 */
export const componentKeys = {
  all: ['components'] as const,
  lists: () => [...componentKeys.all, 'list'] as const,
  list: (type?: string) =>
    [...componentKeys.lists(), type] as const,
  details: () => [...componentKeys.all, 'detail'] as const,
  detail: (id: string) => [...componentKeys.details(), id] as const,
  types: () => [...componentKeys.all, 'types'] as const,
};

/**
 * Get all components
 */
export function useComponents(type?: string) {
  return useQuery({
    queryKey: componentKeys.list(type),
    queryFn: () => getComponents(type),
  });
}

/**
 * Get available component types
 */
export function useComponentTypes() {
  return useQuery({
    queryKey: componentKeys.types(),
    queryFn: () => getComponentTypes(),
  });
}

/**
 * Get a component by ID
 */
export function useComponent(id: string) {
  return useQuery({
    queryKey: componentKeys.detail(id),
    queryFn: () => getComponentById(id),
    enabled: !!id,
  });
}

/**
 * Create a new component
 */
export function useCreateComponent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateComponentDto) => createComponent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: componentKeys.lists() });
    },
  });
}

/**
 * Update a component
 */
export function useUpdateComponent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateComponentDto }) =>
      updateComponent(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: componentKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: componentKeys.lists() });
    },
  });
}

/**
 * Delete a component
 */
export function useDeleteComponent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteComponent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: componentKeys.lists() });
    },
  });
}

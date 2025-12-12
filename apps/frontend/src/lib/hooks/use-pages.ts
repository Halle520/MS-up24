/**
 * React Query hooks for Pages API
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getPages,
  getPageById,
  getPageBySlug,
  createPage,
  updatePage,
  deletePage,
  publishPage,
  unpublishPage,
  type Page,
  type PageListResponse,
  type CreatePageDto,
  type UpdatePageDto,
} from '../api/pages.api';

/**
 * Query keys for pages
 */
export const pageKeys = {
  all: ['pages'] as const,
  lists: () => [...pageKeys.all, 'list'] as const,
  list: (page: number, limit: number) =>
    [...pageKeys.lists(), page, limit] as const,
  details: () => [...pageKeys.all, 'detail'] as const,
  detail: (id: string) => [...pageKeys.details(), id] as const,
  bySlug: (slug: string) => [...pageKeys.details(), 'slug', slug] as const,
};

/**
 * Get all pages with pagination
 */
export function usePages(page = 1, limit = 10) {
  return useQuery({
    queryKey: pageKeys.list(page, limit),
    queryFn: () => getPages(page, limit),
  });
}

/**
 * Get a page by ID
 */
export function usePage(id: string) {
  return useQuery({
    queryKey: pageKeys.detail(id),
    queryFn: () => getPageById(id),
    enabled: !!id,
  });
}

/**
 * Get a page by slug
 */
export function usePageBySlug(slug: string) {
  return useQuery({
    queryKey: pageKeys.bySlug(slug),
    queryFn: () => getPageBySlug(slug),
    enabled: !!slug,
  });
}

/**
 * Create a new page
 */
export function useCreatePage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePageDto) => createPage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pageKeys.lists() });
    },
  });
}

/**
 * Update a page
 */
export function useUpdatePage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePageDto }) =>
      updatePage(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: pageKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: pageKeys.lists() });
    },
  });
}

/**
 * Delete a page
 */
export function useDeletePage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pageKeys.lists() });
    },
  });
}

/**
 * Publish a page
 */
export function usePublishPage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => publishPage(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: pageKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: pageKeys.lists() });
    },
  });
}

/**
 * Unpublish a page
 */
export function useUnpublishPage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => unpublishPage(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: pageKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: pageKeys.lists() });
    },
  });
}

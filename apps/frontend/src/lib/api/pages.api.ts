/**
 * Pages API client
 */

import { apiGet, apiPost, apiPatch, apiDelete } from './api-client';

export interface Page {
  id: string;
  name: string;
  slug: string;
  metadata: {
    title: string;
    description?: string;
    keywords?: string[];
    author?: string;
    createdAt: string;
    updatedAt: string;
  };
  components: unknown[];
  isPublished: boolean;
  userId?: string;
}

export interface PageListResponse {
  pages: Page[];
  total: number;
  page: number;
  limit: number;
}

export interface CreatePageDto {
  name: string;
  slug: string;
  description?: string;
  keywords?: string[];
  author?: string;
  components?: unknown[];
  isPublished?: boolean;
}

export interface UpdatePageDto extends Partial<CreatePageDto> {}

/**
 * Get all pages with pagination
 */
export async function getPages(
  page = 1,
  limit = 10,
): Promise<PageListResponse> {
  return apiGet<PageListResponse>(`/pages?page=${page}&limit=${limit}`);
}

/**
 * Get a page by ID
 */
export async function getPageById(id: string): Promise<Page> {
  return apiGet<Page>(`/pages/${id}`);
}

/**
 * Get a page by slug
 */
export async function getPageBySlug(slug: string): Promise<Page> {
  return apiGet<Page>(`/pages/slug/${slug}`);
}

/**
 * Create a new page
 */
export async function createPage(data: CreatePageDto): Promise<Page> {
  return apiPost<Page>('/pages', data);
}

/**
 * Update a page
 */
export async function updatePage(
  id: string,
  data: UpdatePageDto,
): Promise<Page> {
  return apiPatch<Page>(`/pages/${id}`, data);
}

/**
 * Delete a page
 */
export async function deletePage(id: string): Promise<void> {
  return apiDelete<void>(`/pages/${id}`);
}

/**
 * Publish a page
 */
export async function publishPage(id: string): Promise<Page> {
  return apiPost<Page>(`/pages/${id}/publish`);
}

/**
 * Unpublish a page
 */
export async function unpublishPage(id: string): Promise<Page> {
  return apiPost<Page>(`/pages/${id}/unpublish`);
}

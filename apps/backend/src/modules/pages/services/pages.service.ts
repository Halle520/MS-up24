import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePageDto } from '../models/create-page.dto';
import { UpdatePageDto } from '../models/update-page.dto';
import { PageResponse, PageListResponse } from '../models/page-response.type';
import { Page } from '../../../shared/types/page.types';
import {
  ComponentType,
  PageComponent,
} from '../../../shared/types/component.types';

/**
 * Service for managing pages
 * Uses mock data for initial implementation
 */
@Injectable()
export class PagesService {
  private pages: Page[] = [];
  private nextId = 1;

  constructor() {
    this.initializeMockData();
  }

  /**
   * Initialize mock data for development
   */
  private initializeMockData(): void {
    const mockPage1: Page = {
      id: '1',
      name: 'Welcome Page',
      slug: 'welcome',
      metadata: {
        title: 'Welcome to Monospace',
        description: 'A beautiful welcome page',
        keywords: ['welcome', 'home'],
        author: 'System',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      components: [
        {
          id: 'comp-1',
          type: ComponentType.TEXT,
          content: 'Welcome to Monospace Page Builder',
          style: {
            fontSize: '32px',
            fontWeight: 'bold',
            textAlign: 'center',
            padding: '20px',
            color: '#333333',
          },
        },
        {
          id: 'comp-2',
          type: ComponentType.TEXT,
          content: 'Build beautiful pages without coding',
          style: {
            fontSize: '18px',
            textAlign: 'center',
            padding: '10px',
            color: '#666666',
          },
        },
      ],
      isPublished: true,
    };

    const mockPage2: Page = {
      id: '2',
      name: 'About Page',
      slug: 'about',
      metadata: {
        title: 'About Us',
        description: 'Learn more about our company',
        keywords: ['about', 'company'],
        author: 'System',
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
      },
      components: [
        {
          id: 'comp-3',
          type: ComponentType.TEXT,
          content: 'About Our Company',
          style: {
            fontSize: '28px',
            fontWeight: 'bold',
            padding: '20px',
            color: '#333333',
          },
        },
        {
          id: 'comp-4',
          type: ComponentType.CONTAINER,
          children: [
            {
              id: 'comp-5',
              type: ComponentType.TEXT,
              content: 'We are a team of passionate developers building amazing tools.',
              style: {
                padding: '15px',
                color: '#555555',
              },
            } as PageComponent,
          ],
          style: {
            padding: '20px',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
          },
        },
      ],
      isPublished: false,
    };

    this.pages = [mockPage1, mockPage2];
    this.nextId = 3;
  }

  /**
   * Create a new page
   */
  create(createPageDto: CreatePageDto, userId?: string): PageResponse {
    const now = new Date();
    const newPage: Page = {
      id: String(this.nextId++),
      name: createPageDto.name,
      slug: createPageDto.slug,
      metadata: {
        title: createPageDto.name,
        description: createPageDto.description,
        keywords: createPageDto.keywords,
        author: createPageDto.author || 'System',
        createdAt: now,
        updatedAt: now,
      },
      components: createPageDto.components || [],
      isPublished: createPageDto.isPublished ?? false,
      userId,
    };

    this.pages.push(newPage);
    return newPage;
  }

  /**
   * Get all pages with pagination
   */
  findAll(page = 1, limit = 10, userId?: string): PageListResponse {
    let filteredPages = this.pages;

    if (userId) {
      filteredPages = this.pages.filter((p) => p.userId === userId);
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPages = filteredPages.slice(startIndex, endIndex);

    return {
      pages: paginatedPages,
      total: filteredPages.length,
      page,
      limit,
    };
  }

  /**
   * Get a page by ID
   */
  findOne(id: string): PageResponse {
    const page = this.pages.find((p) => p.id === id);
    if (!page) {
      throw new NotFoundException(`Page with ID ${id} not found`);
    }
    return page;
  }

  /**
   * Get a page by slug
   */
  findBySlug(slug: string): PageResponse {
    const page = this.pages.find((p) => p.slug === slug);
    if (!page) {
      throw new NotFoundException(`Page with slug ${slug} not found`);
    }
    return page;
  }

  /**
   * Update a page
   */
  update(id: string, updatePageDto: UpdatePageDto): PageResponse {
    const pageIndex = this.pages.findIndex((p) => p.id === id);
    if (pageIndex === -1) {
      throw new NotFoundException(`Page with ID ${id} not found`);
    }

    const existingPage = this.pages[pageIndex];
    const updatedPage: Page = {
      ...existingPage,
      ...updatePageDto,
      metadata: {
        ...existingPage.metadata,
        title: updatePageDto.name ?? existingPage.metadata.title,
        description: updatePageDto.description ?? existingPage.metadata.description,
        keywords: updatePageDto.keywords ?? existingPage.metadata.keywords,
        author: updatePageDto.author ?? existingPage.metadata.author,
        updatedAt: new Date(),
      },
      components: updatePageDto.components ?? existingPage.components,
      isPublished: updatePageDto.isPublished ?? existingPage.isPublished,
    };

    this.pages[pageIndex] = updatedPage;
    return updatedPage;
  }

  /**
   * Delete a page
   */
  remove(id: string): void {
    const pageIndex = this.pages.findIndex((p) => p.id === id);
    if (pageIndex === -1) {
      throw new NotFoundException(`Page with ID ${id} not found`);
    }
    this.pages.splice(pageIndex, 1);
  }

  /**
   * Publish a page
   */
  publish(id: string): PageResponse {
    return this.update(id, { isPublished: true });
  }

  /**
   * Unpublish a page
   */
  unpublish(id: string): PageResponse {
    return this.update(id, { isPublished: false });
  }
}

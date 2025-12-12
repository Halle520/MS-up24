/**
 * Page types and interfaces
 */

import { PageComponent } from './component.types';

export interface PageMetadata {
  title: string;
  description?: string;
  keywords?: string[];
  author?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Page {
  id: string;
  name: string;
  slug: string;
  metadata: PageMetadata;
  components: PageComponent[];
  isPublished: boolean;
  userId?: string;
}

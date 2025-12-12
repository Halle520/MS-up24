import { ApiProperty } from '@nestjs/swagger';
import { Page } from '../../../shared/types/page.types';

/**
 * Response type for page operations
 */
export class PageResponse implements Page {
  @ApiProperty({ example: '1' })
  id: string;

  @ApiProperty({ example: 'My Page' })
  name: string;

  @ApiProperty({ example: 'my-page' })
  slug: string;

  @ApiProperty({
    type: Object,
    additionalProperties: true,
    description: 'Page metadata',
  })
  metadata: Page['metadata'];

  @ApiProperty({
    type: 'array',
    items: {
      type: 'object' as any,
      additionalProperties: true,
    },
    description: 'Page components',
  })
  components: Page['components'];

  @ApiProperty({ example: false })
  isPublished: boolean;

  @ApiProperty({ required: false, example: 'user-123' })
  userId?: string;
}

/**
 * Response type for page list operations
 */
export class PageListResponse {
  @ApiProperty({ type: [PageResponse] })
  pages: PageResponse[];

  @ApiProperty({ example: 10 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;
}

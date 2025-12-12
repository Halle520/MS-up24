import { IsString, IsOptional, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PageComponent } from '../../../shared/types/component.types';

/**
 * DTO for creating a new page
 */
export class CreatePageDto {
  @ApiProperty({
    description: 'Page name',
    example: 'My Page',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'URL-friendly page slug',
    example: 'my-page',
  })
  @IsString()
  slug: string;

  @ApiPropertyOptional({
    description: 'Page description',
    example: 'A beautiful page created with Monospace',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'SEO keywords',
    example: ['page', 'monospace', 'builder'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keywords?: string[];

  @ApiPropertyOptional({
    description: 'Page author',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  author?: string;

  @ApiPropertyOptional({
    description: 'Page components',
    type: 'array',
    items: { type: 'object' },
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  components?: PageComponent[];

  @ApiPropertyOptional({
    description: 'Whether the page is published',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

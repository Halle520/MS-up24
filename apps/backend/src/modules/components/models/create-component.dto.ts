import {
  IsString,
  IsOptional,
  IsEnum,
  IsObject,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ComponentType,
  ComponentStyle,
  BaseComponent,
} from '../../../shared/types/component.types';

/**
 * DTO for creating a new component
 */
export class CreateComponentDto {
  @ApiProperty({
    description: 'Component type',
    enum: ComponentType,
    example: ComponentType.TEXT,
  })
  @IsEnum(ComponentType)
  type: ComponentType;

  @ApiPropertyOptional({
    description: 'Text content (for text components)',
    example: 'Hello World',
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({
    description: 'Image source URL (for image components)',
    example: '/images/sample.jpg',
  })
  @IsOptional()
  @IsString()
  src?: string;

  @ApiPropertyOptional({
    description: 'Image alt text (for image components)',
    example: 'Sample image',
  })
  @IsOptional()
  @IsString()
  alt?: string;

  @ApiPropertyOptional({
    description: 'Icon name (for icon components)',
    example: 'heart',
  })
  @IsOptional()
  @IsString()
  iconName?: string;

  @ApiPropertyOptional({
    description: 'Component styles',
    type: Object,
    example: {
      fontSize: '16px',
      color: '#333333',
      padding: '10px',
    },
    additionalProperties: true,
  })
  @IsOptional()
  @IsObject()
  style?: ComponentStyle;

  @ApiPropertyOptional({
    description: 'Child components (for container components)',
    type: 'array',
    items: { type: 'object' },
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  children?: BaseComponent[];
}

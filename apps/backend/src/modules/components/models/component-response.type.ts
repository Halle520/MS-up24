import { ApiProperty } from '@nestjs/swagger';
import { PageComponent } from '../../../shared/types/component.types';

/**
 * Response type for component operations
 */
export class ComponentResponse {
  @ApiProperty({ example: 'comp-1' })
  id: string;

  @ApiProperty({ enum: ['text', 'image', 'icon', 'container', 'row', 'column'] })
  type: string;

  @ApiProperty({ required: false, example: 'Sample text' })
  content?: string;

  @ApiProperty({ required: false, example: '/images/sample.jpg' })
  src?: string;

  @ApiProperty({ required: false, example: 'Sample image' })
  alt?: string;

  @ApiProperty({ required: false, example: 'heart' })
  iconName?: string;

  @ApiProperty({ required: false, type: Object, additionalProperties: true })
  style?: Record<string, any>;

  @ApiProperty({ required: false, type: 'array', items: { type: 'object' } })
  children?: PageComponent[];
}

/**
 * Response type for component list operations
 */
export class ComponentListResponse {
  @ApiProperty({ type: [ComponentResponse] })
  components: ComponentResponse[];

  @ApiProperty({ example: 10 })
  total: number;
}

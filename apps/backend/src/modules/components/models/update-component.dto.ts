import { PartialType } from '@nestjs/swagger';
import { CreateComponentDto } from './create-component.dto';

/**
 * DTO for updating an existing component
 */
export class UpdateComponentDto extends PartialType(CreateComponentDto) {}

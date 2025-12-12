import { PartialType } from '@nestjs/swagger';
import { CreatePageDto } from './create-page.dto';

/**
 * DTO for updating an existing page
 */
export class UpdatePageDto extends PartialType(CreatePageDto) {}

import { IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for uploading an image from a URL
 */
export class UploadFromUrlDto {
  @ApiProperty({
    description: 'URL of the image to upload',
    example: 'https://example.com/image.jpg',
  })
  @IsString()
  @IsUrl({}, { message: 'Invalid URL format' })
  url: string;
}

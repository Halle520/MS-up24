import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Response type for image operations
 */
export class ImageResponse {
  @ApiProperty({ example: 'img-1' })
  id: string;

  @ApiProperty({ example: 'sample-1.jpg' })
  filename: string;

  @ApiProperty({ example: 'sample-image.jpg' })
  originalName: string;

  @ApiProperty({ example: 'image/jpeg' })
  mimeType: string;

  @ApiProperty({ example: 102400 })
  size: number;

  @ApiProperty({ example: '/api/images/sample-1.jpg' })
  url: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  uploadedAt: Date;

  @ApiPropertyOptional({ example: 'user-123' })
  userId?: string;

  @ApiPropertyOptional({ example: 'https://storage.example.com/.../tiny.jpg' })
  urlTiny?: string;

  @ApiPropertyOptional({
    example: 'https://storage.example.com/.../medium.jpg',
  })
  urlMedium?: string;

  @ApiPropertyOptional({ example: 'https://storage.example.com/.../large.jpg' })
  urlLarge?: string;

  @ApiPropertyOptional({
    example: 'https://storage.example.com/.../original.jpg',
  })
  urlOriginal?: string;
}

/**
 * Response type for image list operations
 */
export class ImageListResponse {
  @ApiProperty({ type: [ImageResponse] })
  images: ImageResponse[];

  @ApiProperty({ example: 10 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;
}

import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  Res,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Body,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { ImagesService } from '../services/images.service';
import {
  ImageResponse,
  ImageListResponse,
} from '../models/image-response.type';
import { UploadFromUrlDto } from '../models/upload-from-url.dto';
import { memoryStorage } from 'multer';

/**
 * Controller for image management endpoints
 */
@ApiTags('images')
@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  /**
   * Upload an image
   * POST /api/images/upload
   */
  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    })
  )
  @ApiOperation({ summary: 'Upload an image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image file (JPEG, PNG, GIF, WebP, SVG)',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Image uploaded successfully',
    type: ImageResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid file or file too large',
  })
  async upload(
    @UploadedFile() file: Express.Multer.File
  ): Promise<ImageResponse> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    return this.imagesService.upload(file);
  }

  /**
   * Upload an image from a URL
   * POST /api/images/upload-from-url
   */
  @Post('upload-from-url')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Upload an image from a URL' })
  @ApiBody({ type: UploadFromUrlDto })
  @ApiResponse({
    status: 201,
    description: 'Image uploaded successfully from URL',
    type: ImageResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid URL or image',
  })
  async uploadFromUrl(
    @Body() uploadFromUrlDto: UploadFromUrlDto
  ): Promise<ImageResponse> {
    return this.imagesService.uploadFromUrl(uploadFromUrlDto.url);
  }

  /**
   * Get all images with pagination
   * GET /api/images?page=1&limit=10
   */
  @Get()
  @ApiOperation({ summary: 'Get all images with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: ['original', 'large', 'medium', 'tiny'],
    description: 'Preferred image resolution for the main url field',
  })
  @ApiResponse({
    status: 200,
    description: 'List of images retrieved successfully',
    type: ImageListResponse,
  })
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('type') type?: 'original' | 'large' | 'medium' | 'tiny'
  ): Promise<ImageListResponse> {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.imagesService.findAll(pageNum, limitNum, undefined, type);
  }

  /**
   * Get image file by filename
   * GET /api/images/file/:filename
   * Note: Images are served from external storage, so this endpoint redirects to the public URL
   */
  @Get('file/:filename')
  @ApiOperation({
    summary: 'Get image file by filename (redirects to external URL)',
  })
  @ApiParam({
    name: 'filename',
    description: 'Image filename',
    example: 'sample-1.jpg',
  })
  @ApiResponse({
    status: 200,
    description: 'Image file URL',
  })
  @ApiResponse({ status: 404, description: 'Image file not found' })
  async getImageFile(
    @Param('filename') filename: string,
    @Res() res: Response
  ): Promise<void> {
    try {
      const image = await this.imagesService.findByFilename(filename);
      // Redirect to external storage URL
      res.redirect(image.urlOriginal);
    } catch (error) {
      res.status(404).json({ message: 'Image not found' });
    }
  }

  /**
   * Get an image by ID
   * GET /api/images/:id
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get image metadata by ID' })
  @ApiParam({ name: 'id', description: 'Image ID', example: 'img-1' })
  @ApiResponse({
    status: 200,
    description: 'Image metadata retrieved successfully',
    type: ImageResponse,
  })
  @ApiResponse({ status: 404, description: 'Image not found' })
  async findOne(@Param('id') id: string): Promise<ImageResponse> {
    return this.imagesService.findOne(id);
  }

  /**
   * Delete an image
   * DELETE /api/images/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an image' })
  @ApiParam({ name: 'id', description: 'Image ID', example: 'img-1' })
  @ApiResponse({ status: 204, description: 'Image deleted successfully' })
  @ApiResponse({ status: 404, description: 'Image not found' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.imagesService.remove(id);
  }
}

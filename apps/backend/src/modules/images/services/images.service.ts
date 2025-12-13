import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import sharp from 'sharp';
import {
  ImageResponse,
  ImageListResponse,
} from '../models/image-response.type';
import { PrismaService } from '../../../shared/services/prisma.service';
import { SupabaseService } from '../../../shared/services/supabase.service';

/**
 * Image resolution configurations
 */
const IMAGE_RESOLUTIONS = {
  tiny: { width: 150, quality: 80 },
  medium: { width: 600, quality: 85 },
  large: { width: 1200, quality: 90 },
} as const;

/**
 * Service for managing images
 * Handles image upload, processing, storage, and retrieval via Supabase
 */
@Injectable()
export class ImagesService {
  private readonly logger = new Logger(ImagesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly supabaseService: SupabaseService
  ) {}

  /**
   * Upload an image file and create multiple resolutions
   */
  async upload(
    file: Express.Multer.File,
    userId?: string
  ): Promise<ImageResponse> {
    this.validateImageFile(file);

    try {
      // Generate unique filename
      const fileId = randomUUID();
      const fileExtension = this.getFileExtension(file.originalname);
      const baseFilename = `${fileId}${fileExtension}`;

      // Process original image to get dimensions
      const originalImage = sharp(file.buffer);
      const metadata = await originalImage.metadata();
      const width = metadata.width;
      const height = metadata.height;

      // Create multiple resolutions
      const resolutions = await this.createResolutions(
        file.buffer,
        baseFilename,
        file.mimetype
      );

      // Upload all versions to Supabase Storage
      const uploadPromises = [
        this.supabaseService.uploadFile(
          `original/${baseFilename}`,
          file.buffer,
          file.mimetype
        ),
        ...Object.entries(resolutions).map(([size, buffer]) =>
          this.supabaseService.uploadFile(
            `${size}/${baseFilename}`,
            buffer,
            file.mimetype
          )
        ),
      ];

      await Promise.all(uploadPromises);

      // Get public URLs
      const urlOriginal = this.supabaseService.getPublicUrl(
        `original/${baseFilename}`
      );
      const urlTiny = this.supabaseService.getPublicUrl(`tiny/${baseFilename}`);
      const urlMedium = this.supabaseService.getPublicUrl(
        `medium/${baseFilename}`
      );
      const urlLarge = this.supabaseService.getPublicUrl(
        `large/${baseFilename}`
      );

      // Save metadata to database using Prisma
      const image = await this.prisma.image.create({
        data: {
          filename: baseFilename,
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: BigInt(file.size),
          width: width,
          height: height,
          urlTiny: urlTiny,
          urlMedium: urlMedium,
          urlLarge: urlLarge,
          urlOriginal: urlOriginal,
          userId: userId,
        },
      });

      this.logger.log(`Image uploaded successfully: ${image.id}`);

      return this.mapPrismaToResponse(image);
    } catch (error) {
      this.logger.error('Failed to upload image:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to upload image: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  /**
   * Create multiple resolutions of an image
   */
  private async createResolutions(
    buffer: Buffer,
    filename: string,
    mimeType: string
  ): Promise<Record<string, Buffer>> {
    const results: Record<string, Buffer> = {};

    for (const [size, config] of Object.entries(IMAGE_RESOLUTIONS)) {
      try {
        let image = sharp(buffer);

        // Resize image
        image = image.resize(config.width, null, {
          withoutEnlargement: true,
          fit: 'inside',
        });

        // Convert and optimize based on format
        if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') {
          image = image.jpeg({ quality: config.quality });
        } else if (mimeType === 'image/png') {
          image = image.png({ quality: config.quality });
        } else if (mimeType === 'image/webp') {
          image = image.webp({ quality: config.quality });
        } else if (mimeType === 'image/gif') {
          // GIFs are converted to PNG for better quality
          image = image.png({ quality: config.quality });
        } else {
          // For SVG and other formats, keep original
          image = image;
        }

        const processedBuffer = await image.toBuffer();
        results[size] = processedBuffer;
      } catch (error) {
        this.logger.error(`Failed to create ${size} resolution:`, error);
        // Continue with other resolutions even if one fails
      }
    }

    return results;
  }

  /**
   * Get all images with pagination
   */
  async findAll(
    page = 1,
    limit = 10,
    userId?: string,
    imageType?: 'original' | 'large' | 'medium' | 'tiny'
  ): Promise<ImageListResponse> {
    try {
      const offset = (page - 1) * limit;

      const where = userId ? { userId } : {};

      const [images, total] = await Promise.all([
        this.prisma.image.findMany({
          where,
          orderBy: { uploadedAt: 'desc' },
          skip: offset,
          take: limit,
        }),
        this.prisma.image.count({ where }),
      ]);

      return {
        images: images.map((image) =>
          this.mapPrismaToResponse(image, imageType)
        ),
        total,
        page,
        limit,
      };
    } catch (error) {
      this.logger.error('Failed to find all images:', error);
      throw new InternalServerErrorException(
        `Failed to fetch images: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  /**
   * Get an image by ID
   */
  async findOne(id: string): Promise<ImageResponse> {
    try {
      const image = await this.prisma.image.findUnique({
        where: { id },
      });

      if (!image) {
        throw new NotFoundException(`Image with ID ${id} not found`);
      }

      return this.mapPrismaToResponse(image);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to find image ${id}:`, error);
      throw new InternalServerErrorException(
        `Failed to fetch image: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  /**
   * Get image metadata by filename
   */
  async findByFilename(filename: string): Promise<ImageResponse> {
    try {
      const image = await this.prisma.image.findUnique({
        where: { filename },
      });

      if (!image) {
        throw new NotFoundException(
          `Image with filename ${filename} not found`
        );
      }

      return this.mapPrismaToResponse(image);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to find image by filename ${filename}:`, error);
      throw new InternalServerErrorException(
        `Failed to fetch image: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  /**
   * Delete an image
   */
  async remove(id: string): Promise<void> {
    try {
      // First, get the image to find all file paths
      const image = await this.findOne(id);
      const filename = image.filename;

      // Delete all resolution files from storage
      const filePaths = [
        `original/${filename}`,
        `tiny/${filename}`,
        `medium/${filename}`,
        `large/${filename}`,
      ];

      await this.supabaseService.deleteFiles(filePaths);

      // Delete metadata from database using Prisma
      await this.prisma.image.delete({
        where: { id },
      });

      this.logger.log(`Image deleted successfully: ${id}`);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof InternalServerErrorException) {
        throw error;
      }
      this.logger.error(`Failed to delete image ${id}:`, error);
      throw new InternalServerErrorException(
        `Failed to delete image: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  /**
   * Map Prisma model to response DTO
   */
  private mapPrismaToResponse(
    image: {
      id: string;
      filename: string;
      originalName: string;
      mimeType: string;
      size: bigint;
      width: number | null;
      height: number | null;
      urlTiny: string | null;
      urlMedium: string | null;
      urlLarge: string | null;
      urlOriginal: string;
      userId: string | null;
      uploadedAt: Date;
    },
    imageType?: 'original' | 'large' | 'medium' | 'tiny'
  ): ImageResponse {
    let url = image.urlOriginal;

    if (imageType) {
      switch (imageType) {
        case 'tiny':
          url = image.urlTiny || image.urlOriginal;
          break;
        case 'medium':
          url = image.urlMedium || image.urlOriginal;
          break;
        case 'large':
          url = image.urlLarge || image.urlOriginal;
          break;
        case 'original':
        default:
          url = image.urlOriginal;
          break;
      }
    }

    return {
      id: image.id,
      filename: image.filename,
      originalName: image.originalName,
      mimeType: image.mimeType,
      size: Number(image.size),
      url: url,
      urlTiny: image.urlTiny || undefined,
      urlMedium: image.urlMedium || undefined,
      urlLarge: image.urlLarge || undefined,
      urlOriginal: image.urlOriginal,
      uploadedAt: image.uploadedAt,
      userId: image.userId || undefined,
    };
  }

  /**
   * Get file extension from filename
   */
  private getFileExtension(filename: string): string {
    const lastDot = filename.lastIndexOf('.');
    return lastDot !== -1 ? filename.substring(lastDot) : '';
  }

  /**
   * Upload an image from a URL
   */
  async uploadFromUrl(
    imageUrl: string,
    userId?: string
  ): Promise<ImageResponse> {
    try {
      // Fetch image from URL
      const response = await fetch(imageUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      if (!response.ok) {
        throw new BadRequestException(
          `Failed to fetch image from URL: ${response.statusText}`
        );
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.startsWith('image/')) {
        throw new BadRequestException(
          'URL does not point to a valid image file'
        );
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const maxSize = 10 * 1024 * 1024; // 10MB
      if (buffer.length > maxSize) {
        throw new BadRequestException(
          'Image size exceeds maximum limit of 10MB'
        );
      }

      // Extract filename from URL or generate one
      const urlPath = new URL(imageUrl).pathname;
      const urlFilename = urlPath.split('/').pop() || `image-${Date.now()}.jpg`;
      const fileExtension = this.getFileExtension(urlFilename);

      // Create a mock file object for processing
      const mockFile: Express.Multer.File = {
        fieldname: 'file',
        originalname: urlFilename,
        encoding: '7bit',
        mimetype: contentType,
        size: buffer.length,
        buffer: buffer,
        destination: '',
        filename: urlFilename,
        path: '',
        stream: null as any,
      };

      // Validate the fetched image
      this.validateImageFile(mockFile);

      // Generate unique filename
      const fileId = randomUUID();
      const baseFilename = `${fileId}${fileExtension}`;

      // Process original image to get dimensions
      const originalImage = sharp(buffer);
      const metadata = await originalImage.metadata();
      const width = metadata.width;
      const height = metadata.height;

      // Create multiple resolutions
      const resolutions = await this.createResolutions(
        buffer,
        baseFilename,
        contentType
      );

      // Upload all versions to Supabase Storage
      const uploadPromises = [
        this.supabaseService.uploadFile(
          `original/${baseFilename}`,
          buffer,
          contentType
        ),
        ...Object.entries(resolutions).map(([size, resBuffer]) =>
          this.supabaseService.uploadFile(
            `${size}/${baseFilename}`,
            resBuffer,
            contentType
          )
        ),
      ];

      await Promise.all(uploadPromises);

      // Get public URLs
      const urlOriginal = this.supabaseService.getPublicUrl(
        `original/${baseFilename}`
      );
      const urlTiny = this.supabaseService.getPublicUrl(`tiny/${baseFilename}`);
      const urlMedium = this.supabaseService.getPublicUrl(
        `medium/${baseFilename}`
      );
      const urlLarge = this.supabaseService.getPublicUrl(
        `large/${baseFilename}`
      );

      // Save metadata to database using Prisma
      const image = await this.prisma.image.create({
        data: {
          filename: baseFilename,
          originalName: urlFilename,
          mimeType: contentType,
          size: BigInt(buffer.length),
          width: width,
          height: height,
          urlTiny: urlTiny,
          urlMedium: urlMedium,
          urlLarge: urlLarge,
          urlOriginal: urlOriginal,
          userId: userId,
        },
      });

      this.logger.log(`Image uploaded from URL successfully: ${image.id}`);

      return this.mapPrismaToResponse(image);
    } catch (error) {
      this.logger.error('Failed to upload image from URL:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to upload image from URL: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  /**
   * Validate image file
   */
  validateImageFile(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types: ${allowedMimeTypes.join(', ')}`
      );
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size exceeds maximum limit of 10MB');
    }
  }
}

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase Service for storage operations
 * Handles file uploads, deletions, and URL generation
 */
@Injectable()
export class SupabaseService implements OnModuleInit {
  private readonly logger = new Logger(SupabaseService.name);
  private client: SupabaseClient;
  private readonly bucketName = 'images';

  constructor(private readonly configService: ConfigService) {}

  /**
   * Initialize Supabase client when module starts
   */
  async onModuleInit(): Promise<void> {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey =
      this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY') ||
      this.configService.get<string>('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseKey) {
      this.logger.error(
        'Supabase URL or key not configured. Storage operations will fail.'
      );
      throw new Error(
        'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_ANON_KEY) must be set'
      );
    }

    this.client = createClient(supabaseUrl, supabaseKey);
    this.logger.log('Supabase client initialized successfully');
  }

  /**
   * Get Supabase client instance
   */
  getClient(): SupabaseClient {
    return this.client;
  }

  /**
   * Upload a file to Supabase Storage
   */
  async uploadFile(
    path: string,
    file: Buffer,
    contentType: string
  ): Promise<void> {
    try {
      const { error } = await this.client.storage
        .from(this.bucketName)
        .upload(path, file, {
          contentType,
          upsert: false,
          cacheControl: '3600',
        });

      if (error) {
        this.logger.error(`Failed to upload file ${path}:`, error);
        throw new Error(`Failed to upload file: ${error.message}`);
      }
    } catch (error) {
      this.logger.error(`Error uploading file ${path}:`, error);
      throw error;
    }
  }

  /**
   * Get public URL for a file
   */
  getPublicUrl(path: string): string {
    const {
      data: { publicUrl },
    } = this.client.storage.from(this.bucketName).getPublicUrl(path);
    return publicUrl;
  }

  /**
   * Delete files from Supabase Storage
   */
  async deleteFiles(paths: string[]): Promise<void> {
    if (paths.length === 0) {
      return;
    }

    try {
      const { error } = await this.client.storage
        .from(this.bucketName)
        .remove(paths);

      if (error) {
        this.logger.error(`Failed to delete files:`, error);
        throw new Error(`Failed to delete files: ${error.message}`);
      }
    } catch (error) {
      this.logger.error(`Error deleting files:`, error);
      throw error;
    }
  }
}


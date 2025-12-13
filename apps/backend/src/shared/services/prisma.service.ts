import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

/**
 * Prisma Service for database operations
 * Provides Prisma Client instance for dependency injection
 *
 * Note: Prisma 7 requires using a driver adapter instead of datasourceUrl.
 * We use @prisma/adapter-pg for PostgreSQL connections (Supabase).
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);
  private pool: Pool | null = null;

  constructor(configService: ConfigService) {
    const databaseUrl = configService.get<string>('DATABASE_URL');

    if (!databaseUrl) {
      throw new Error(
        'DATABASE_URL is not configured. Please set it in your .env file.'
      );
    }

    // Create a pg Pool for the adapter
    // Add connection timeout and retry options for Supabase
    const pool = new Pool({
      connectionString: databaseUrl,
      connectionTimeoutMillis: 10000, // 10 seconds
      idleTimeoutMillis: 30000, // 30 seconds
      max: 10, // Maximum number of clients in the pool
      ssl: { rejectUnauthorized: false },
    });

    // Create Prisma adapter
    const adapter = new PrismaPg(pool);

    // Initialize PrismaClient with the adapter (must be called first)
    super({ adapter });

    // Store pool reference for cleanup
    this.pool = pool;
  }

  /**
   * Initialize Prisma Client when module starts
   */
  async onModuleInit(): Promise<void> {
    try {
      // Connect to database
      await this.$connect();
      this.logger.log('Prisma Client connected successfully');
    } catch (error) {
      this.logger.error('Failed to connect Prisma Client:', error);
      // Log more details for debugging
      if (error instanceof Error) {
        this.logger.error('Error details:', {
          message: error.message,
          stack: error.stack,
        });
      }
      throw error;
    }
  }

  /**
   * Disconnect Prisma Client when module is destroyed
   */
  async onModuleDestroy(): Promise<void> {
    try {
      await this.$disconnect();
      if (this.pool) {
        await this.pool.end();
      }
      this.logger.log('Prisma Client disconnected successfully');
    } catch (error) {
      this.logger.error('Failed to disconnect Prisma Client:', error);
    }
  }
}

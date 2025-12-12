import { Module, Global } from '@nestjs/common';
import { PrismaService } from './services/prisma.service';
import { SupabaseService } from './services/supabase.service';

/**
 * Shared module for services used across multiple modules
 */
@Global()
@Module({
  providers: [PrismaService, SupabaseService],
  exports: [PrismaService, SupabaseService],
})
export class SharedModule {}

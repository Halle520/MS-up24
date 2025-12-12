import { Module } from '@nestjs/common';
import { ImagesService } from './services/images.service';
import { ImagesController } from './controllers/images.controller';
import { SharedModule } from '../../shared/shared.module';

/**
 * Images module for image upload and management
 * Handles image upload, processing, storage, and retrieval via Supabase
 */
@Module({
  imports: [SharedModule],
  controllers: [ImagesController],
  providers: [ImagesService],
  exports: [ImagesService],
})
export class ImagesModule {}

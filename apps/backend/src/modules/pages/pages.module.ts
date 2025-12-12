import { Module } from '@nestjs/common';
import { PagesService } from './services/pages.service';
import { PagesController } from './controllers/pages.controller';

/**
 * Pages module for page management
 */
@Module({
  controllers: [PagesController],
  providers: [PagesService],
  exports: [PagesService],
})
export class PagesModule {}

import { Module } from '@nestjs/common';
import { ComponentsService } from './services/components.service';
import { ComponentsController } from './controllers/components.controller';

/**
 * Components module for component management
 */
@Module({
  controllers: [ComponentsController],
  providers: [ComponentsService],
  exports: [ComponentsService],
})
export class ComponentsModule {}

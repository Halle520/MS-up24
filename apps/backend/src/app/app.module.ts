import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PagesModule } from '../modules/pages/pages.module';
import { ComponentsModule } from '../modules/components/components.module';
import { ImagesModule } from '../modules/images/images.module';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SharedModule,
    PagesModule,
    ComponentsModule,
    ImagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

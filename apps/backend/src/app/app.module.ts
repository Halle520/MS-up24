import { Module, MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';


import { ImagesModule } from '../modules/images/images.module';
import { SharedModule } from '../shared/shared.module';
import { AuthModule } from '../modules/auth/auth.module';
import { UsersModule } from '../modules/users/users.module';
import { GroupsModule } from '../modules/groups/groups.module';
import { ConsumptionModule } from '../modules/consumption/consumption.module';


// ... imports

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        `.env.${process.env.NODE_ENV || 'development'}`,
        '.env',
        `apps/backend/.env.${process.env.NODE_ENV || 'development'}`,
        'apps/backend/.env',
      ],
    }),
    SharedModule,
    ImagesModule,
    AuthModule,
    UsersModule,
    GroupsModule,
    ConsumptionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply((req: any, res: any, next: () => void) => {
        console.log(`[Request] ${req.method} ${req.url}`);
        next();
      })
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}

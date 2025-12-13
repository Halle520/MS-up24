/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const jwtSecret = process.env.SUPABASE_JWT_SECRET;
  Logger.log(`Supabase JWT Secret check: ${jwtSecret ? 'Present' : 'MISSING'} (${jwtSecret?.substring(0, 5)}...)`);

  // Allow all localhost origins in development
  app.enableCors({
    origin: true, // Allow all origins in development
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type', 'Accept', 'Origin', 'X-Requested-With', 'X-CSRF-Token'],
    exposedHeaders: ['Content-Length', 'Content-Type'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  Logger.log('✅ CORS enabled for all origins (development mode)');

  // Swagger/OpenAPI Configuration
  const config = new DocumentBuilder()
    .setTitle('Monospace API')
    .setDescription(
      'API documentation for Monospace - A visual page builder application that enables users to create individual pages by dragging and dropping components, adding text and icons, and uploading images.',
    )
    .setVersion('1.0')
    .addTag('pages', 'Page management endpoints')
    .addTag('components', 'Component management endpoints')
    .addTag('images', 'Image upload and management endpoints')
    .addTag('general', 'General endpoints')
    .addServer(`http://localhost:${process.env.PORT || 4000}/api`, 'Development server')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Expose OpenAPI JSON endpoint (for external access)
  SwaggerModule.setup('api-docs-json', app, document);

  // Setup Scalar API Reference
  // Using 'content' to pass the document directly (more reliable than URL)
  app.use(
    '/api-docs',
    apiReference({
      theme: 'default',
      layout: 'modern',
      metaData: {
        title: 'Monospace API Documentation',
        description: 'Interactive API documentation for Monospace page builder',
      },
      content: document,
      persistAuth: true,
      hideDarkModeToggle: false,
      hideModels: false,
      hideSearch: false,
      hideTestRequestButton: false,
      expandAllModelSections: false,
      expandAllResponses: false,
      defaultOpenAllTags: false,
      showOperationId: false,
      showSidebar: true,
      withDefaultFonts: true,
      telemetry: false,
    }),
  );

  const port = process.env.PORT || 4000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
  Logger.log(
    `📚 API Documentation available at: http://localhost:${port}/api-docs`
  );
  Logger.log(
    `📄 OpenAPI JSON available at: http://localhost:${port}/api/api-docs-json`
  );
}

bootstrap();

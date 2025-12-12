import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL'),
    // Optional: Add direct URL for migrations if using connection pooling
    // directUrl: env('DIRECT_URL'),
  },
});


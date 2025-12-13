/**
 * Supabase Migration Runner
 * Executes SQL migration files from the migrations directory
 */

import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { Client } from 'pg';

/**
 * Load environment variables from backend .env file
 */
const loadEnvironment = (): void => {
  // Try multiple possible paths for .env file
  const possiblePaths = [
    path.join(__dirname, '../../.env'),
    path.join(process.cwd(), 'apps/backend/.env'),
    path.join(process.cwd(), '.env'),
  ];
  let loaded = false;
  for (const envPath of possiblePaths) {
    if (fs.existsSync(envPath)) {
      dotenv.config({ path: envPath });
      console.log(`📝 Loaded environment from: ${envPath}`);
      loaded = true;
      break;
    }
  }
  if (!loaded) {
    console.warn(
      '⚠️  .env file not found. Using system environment variables.'
    );
    console.warn(`   Tried: ${possiblePaths.join(', ')}`);
  }
};

/**
 * Get database connection string from environment
 */
const getDatabaseUrl = (): string => {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error(
      'DATABASE_URL is not configured. Please set it in apps/backend/.env file.'
    );
  }
  return databaseUrl;
};

/**
 * Get migrations directory path
 */
  /*
  * Get migrations directory path
  */
 const getMigrationsDirectory = (): string => {
   // Try multiple possible paths
   const possiblePaths = [
     path.join(__dirname, '../../prisma/migrations'),
     path.join(process.cwd(), 'apps/backend/prisma/migrations'),
   ];
   for (const migrationsPath of possiblePaths) {
     if (fs.existsSync(migrationsPath)) {
       return migrationsPath;
     }
   }
   throw new Error(
     `Migrations directory not found. Tried: ${possiblePaths.join(', ')}`
   );
 };

 /**
  * Get all SQL migration files sorted by name
  */
 const getMigrationFiles = (migrationsDir: string): string[] => {
   const files = fs
     .readdirSync(migrationsDir)
     .filter((file) => file.endsWith('.sql'))
     .sort();
   return files.map((file) => path.join(migrationsDir, file));
 };

 /**
  * Read and parse SQL file content
  */
 const readSqlFile = (filePath: string): string => {
   const content = fs.readFileSync(filePath, 'utf-8');
   // Remove comments and empty lines for cleaner execution
   // But keep the SQL intact for now
   return content;
 };

 /**
  * Execute a single migration file
  */
 const executeMigration = async (
   client: Client,
   filePath: string
 ): Promise<void> => {
   const fileName = path.basename(filePath);
   console.log(`\n📄 Executing migration: ${fileName}`);
   try {
     const sql = readSqlFile(filePath);
     await client.query(sql);
     console.log(`✅ Successfully executed: ${fileName}`);
   } catch (error) {
     console.error(`❌ Error executing ${fileName}:`, error);
     throw error;
   }
 };

 /**
  * Check if migration has already been run (optional tracking table)
  */
 const createMigrationTable = async (client: Client): Promise<void> => {
   const createTableSql = `
     CREATE TABLE IF NOT EXISTS schema_migrations (
       id SERIAL PRIMARY KEY,
       filename VARCHAR(255) NOT NULL UNIQUE,
       executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
     );
   `;
   await client.query(createTableSql);
 };

 /**
  * Check if migration has been executed
  */
 const isMigrationExecuted = async (
   client: Client,
   filename: string
 ): Promise<boolean> => {
   try {
     const result = await client.query(
       'SELECT 1 FROM schema_migrations WHERE filename = $1',
       [filename]
     );
     return result.rows.length > 0;
   } catch (error) {
     // Table might not exist yet, return false
     return false;
   }
 };

 /**
  * Mark migration as executed
  */
 const markMigrationAsExecuted = async (
   client: Client,
   filename: string
 ): Promise<void> => {
   await client.query(
     'INSERT INTO schema_migrations (filename) VALUES ($1) ON CONFLICT (filename) DO NOTHING',
     [filename]
   );
 };

 /**
  * Main migration runner function
  */
 const runMigrations = async (): Promise<void> => {
   console.log('🚀 Starting Supabase migrations...\n');
   loadEnvironment();
   const databaseUrl = getDatabaseUrl();
   const migrationsDir = getMigrationsDirectory();
   const migrationFiles = getMigrationFiles(migrationsDir);
   if (migrationFiles.length === 0) {
     console.log('⚠️  No migration files found.');
     return;
   }
   console.log(`📦 Found ${migrationFiles.length} migration file(s)\n`);
   const client = new Client({
     connectionString: databaseUrl,
     ssl: { rejectUnauthorized: false }, // Necessary for some environments/poolers
   });
  try {
    await client.connect();
    console.log('✅ Connected to database');
    // Create migration tracking table
    await createMigrationTable(client);
    // Execute each migration
    for (const filePath of migrationFiles) {
      const filename = path.basename(filePath);
      const alreadyExecuted = await isMigrationExecuted(client, filename);
      if (alreadyExecuted) {
        console.log(`⏭️  Skipping ${filename} (already executed)`);
        continue;
      }
      await executeMigration(client, filePath);
      await markMigrationAsExecuted(client, filename);
    }
    console.log('\n✅ All migrations completed successfully!');
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n🔌 Database connection closed');
  }
};

// Run migrations if this script is executed directly
if (require.main === module) {
  runMigrations().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { runMigrations };

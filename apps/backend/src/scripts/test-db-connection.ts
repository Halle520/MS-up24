/**
 * Test database connection script
 * Helps diagnose connection issues with Supabase
 */

import * as dotenv from 'dotenv';
import { Pool } from 'pg';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

async function testConnection() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error('❌ DATABASE_URL is not set in .env file');
    process.exit(1);
  }

  console.log('🔍 Testing database connection...');
  console.log(
    '📍 Connection string format:',
    databaseUrl.replace(/:[^:@]+@/, ':****@')
  );

  // Parse connection string
  const urlMatch = databaseUrl.match(/@([^:]+):(\d+)/);
  if (urlMatch) {
    console.log('   Host:', urlMatch[1]);
    console.log('   Port:', urlMatch[2]);
  }

  const pool = new Pool({
    connectionString: databaseUrl,
    connectionTimeoutMillis: 10000,
  });

  try {
    console.log('\n⏳ Attempting to connect...');
    const client = await pool.connect();

    try {
      const result = await client.query('SELECT NOW(), version()');
      console.log('✅ Connection successful!');
      console.log('   Current time:', result.rows[0].now);
      console.log(
        '   PostgreSQL version:',
        result.rows[0].version.split(' ')[0] +
          ' ' +
          result.rows[0].version.split(' ')[1]
      );

      // Test if images table exists
      const tableCheck = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_schema = 'public'
          AND table_name = 'images'
        );
      `);

      if (tableCheck.rows[0].exists) {
        console.log('✅ Images table exists');
      } else {
        console.log('⚠️  Images table does not exist');
      }
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('\n❌ Connection failed!');
    console.error('   Error code:', error.code);
    console.error('   Error message:', error.message);

    if (error.code === 'ENOTFOUND') {
      console.error('\n💡 Possible solutions:');
      console.error(
        '   1. Check if your Supabase project is active (not paused)'
      );
      console.error('   2. Verify the hostname in DATABASE_URL is correct');
      console.error('   3. Check your internet connection');
    } else if (error.code === 'ETIMEDOUT' || error.code === 'ECONNREFUSED') {
      console.error('\n💡 Possible solutions:');
      console.error('   1. Check if your Supabase project is active');
      console.error('   2. Verify the port (5432) is correct');
      console.error('   3. Check firewall settings');
      console.error('   4. Try using connection pooling instead (port 6543)');
    } else if (error.code === '28P01') {
      console.error('\n💡 Possible solutions:');
      console.error('   1. Check if your database password is correct');
      console.error('   2. Verify credentials in Supabase Dashboard');
    } else if (error.code === '3D000') {
      console.error('\n💡 Possible solutions:');
      console.error(
        '   1. Check if the database name is correct (usually "postgres")'
      );
    }

    process.exit(1);
  } finally {
    await pool.end();
  }
}

testConnection();


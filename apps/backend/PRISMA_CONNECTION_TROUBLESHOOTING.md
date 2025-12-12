# Prisma Database Connection Troubleshooting

## Error: DatabaseNotReachable

If you're getting a `DatabaseNotReachable` error when connecting to Supabase, follow these steps:

### 1. Check Supabase Project Status

First, verify your Supabase project is active:

- Go to [Supabase Dashboard](https://supabase.com/dashboard)
- Check if your project is paused (free tier projects pause after inactivity)
- If paused, click "Restore" to reactivate

### 2. Verify Connection String Format

Your `DATABASE_URL` in `apps/backend/.env` should be in one of these formats:

**Direct Connection (Recommended for Prisma):**

```
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

**Connection Pooling (Session Mode - Port 5432):**

```
DATABASE_URL=postgres://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
```

**Connection Pooling (Transaction Mode - Port 6543):**

```
DATABASE_URL=postgres://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
```

### 3. Get Your Connection String from Supabase

1. Go to Supabase Dashboard > Your Project > Settings > Database
2. Under "Connection string", select "URI"
3. Copy the connection string
4. Replace `[YOUR-PASSWORD]` with your actual database password
5. Update `apps/backend/.env` with the complete connection string

### 4. Test Connection

Test the connection using Prisma:

```bash
cd apps/backend
npx prisma db pull --print
```

Or test with a simple Node.js script:

```bash
node -e "
const { Pool } = require('pg');
require('dotenv').config({ path: '.env' });
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query('SELECT NOW()')
  .then(res => { console.log('✅ Connected:', res.rows[0].now); pool.end(); })
  .catch(err => { console.error('❌ Error:', err.message); process.exit(1); });
"
```

### 5. Common Issues and Solutions

#### Issue: "Can't reach database server"

**Solutions:**

- Verify project is not paused in Supabase Dashboard
- Check internet connection
- Verify hostname and port are correct
- Try using connection pooling instead of direct connection

#### Issue: "Connection timeout"

**Solutions:**

- Check firewall settings
- Verify port 5432 (or 6543 for pooling) is not blocked
- Try connection pooling (port 6543) instead

#### Issue: "Authentication failed"

**Solutions:**

- Verify database password is correct
- Reset password in Supabase Dashboard if needed
- Check if connection string has correct format

#### Issue: "Database does not exist"

**Solutions:**

- Verify database name is `postgres` (default for Supabase)
- Check connection string format

### 6. Using Connection Pooling (Recommended for Production)

For better performance and reliability, use Supabase's connection pooler:

1. Get the pooling connection string from Supabase Dashboard
2. Update `DATABASE_URL` in `.env`
3. For Prisma migrations, you might need a direct connection:

```env
# For runtime queries (connection pooling)
DATABASE_URL=postgres://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true

# For migrations (direct connection)
DIRECT_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

Then update `prisma.config.ts`:

```typescript
export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL'),
    directUrl: env('DIRECT_URL'), // For migrations
  },
});
```

### 7. Verify Environment Variables

Make sure your `.env` file is in the correct location:

- File should be at: `apps/backend/.env`
- File should contain: `DATABASE_URL=postgresql://...`

### 8. Network/Firewall Issues

If you're behind a corporate firewall:

- Contact IT to allow connections to `*.supabase.co` on port 5432 or 6543
- Or use a VPN
- Or use connection pooling which might work better through firewalls

### 9. Test with Prisma Studio

Once connected, you can verify with Prisma Studio:

```bash
cd apps/backend
npx prisma studio
```

This will open a browser interface to view your database.

### Still Having Issues?

1. Check Supabase project logs in the Dashboard
2. Verify your project hasn't exceeded usage limits
3. Try creating a new connection string from Supabase Dashboard
4. Check Prisma logs for more detailed error messages


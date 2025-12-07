# Monospace

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

✨ Your Monospace Nx workspace with NestJS backend and Next.js frontend ✨.

## 🚀 Quick Start

### Prerequisites
- Node.js 20 (use `nvm use 20` if you have nvm)
- Bun installed (`curl -fsSL https://bun.sh/install | bash`)

### Starting the Project

#### Option 1: Start Both Services Together (Recommended)
```bash
# Using npm scripts (easiest)
bun run start:all

# Or using Nx directly
bunx nx run-many --targets=serve,dev --projects=backend,frontend --parallel
```

#### Option 2: Start Services Separately

**Terminal 1 - Backend:**
```bash
# Using npm script
bun run start:backend

# Or using Nx directly
bunx nx serve backend
```
Backend will run on: `http://localhost:3000`
API endpoint: `http://localhost:3000/api/greeting`

**Terminal 2 - Frontend:**
```bash
# Using npm script
bun run start:frontend

# Or using Nx directly
bunx nx dev frontend
```
Frontend will run on: `http://localhost:3000` (Next.js default port, or check terminal output)

### Verify It's Working

1. Open your browser and navigate to `http://localhost:3000` (or the port shown in the frontend terminal)
2. You should see the frontend page displaying a greeting message fetched from the backend API
3. The greeting API endpoint is available at: `http://localhost:3000/api/greeting`

**Note:** Both backend and frontend may try to use port 3000. If there's a conflict:
- Backend will use port 3000 (or PORT env variable)
- Frontend (Next.js) will automatically use the next available port (usually 3001)
- Check the terminal output to see which port each service is using

## 📁 Project Structure

```
monospace/
├── apps/
│   ├── backend/          # NestJS backend application
│   │   └── src/
│   │       ├── app/
│   │       │   ├── app.controller.ts
│   │       │   ├── app.service.ts
│   │       │   └── app.module.ts
│   │       └── main.ts
│   └── frontend/         # Next.js frontend application
│       └── src/
│           └── app/
│               ├── page.tsx
│               └── layout.tsx
```

## 🛠️ Available Commands

### Build
```bash
# Build backend
bunx nx build backend

# Build frontend
bunx nx build frontend

# Build both
bunx nx run-many --target=build --projects=backend,frontend
```

### Test
```bash
# Test backend
bunx nx test backend

# Test frontend
bunx nx test frontend
```

### Lint
```bash
# Lint backend
bunx nx lint backend

# Lint frontend
bunx nx lint frontend
```

## 🔧 Technology Stack

### Backend
- **NestJS** - Progressive Node.js framework
- **MikroORM** - TypeScript ORM for PostgreSQL
- **Supabase** - Backend as a Service
- **Auth0** - Authentication
- **PostgreSQL** - Database
- **Passport** - Authentication middleware

### Frontend
- **Next.js 14** - React framework
- **React 18** - UI library
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Vite** - Build tool

## 📝 API Endpoints

### Backend API (Base URL: `http://localhost:3000/api`)

- `GET /api/greeting` - Returns a greeting message
  ```json
  {
    "message": "Hello from Monospace Backend! 👋"
  }
  ```

## 🌐 Environment Variables

Environment files have been created for both projects. Copy the `.env.example` files and update with your actual values:

### Backend (`apps/backend/.env`)

Essential variables:
- `PORT` - Server port (default: 3000)
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:3000)
- `DATABASE_URL` - PostgreSQL connection string
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key
- `AUTH0_DOMAIN` - Your Auth0 domain
- `AUTH0_CLIENT_ID` - Auth0 client ID
- `AUTH0_CLIENT_SECRET` - Auth0 client secret
- `JWT_SECRET` - Secret key for JWT tokens

**Setup:**
```bash
# Copy the example file
cp apps/backend/.env.example apps/backend/.env

# Edit with your actual values
# (The .env file is already created with default development values)
```

### Frontend (`apps/frontend/.env.local`)

Essential variables (all must be prefixed with `NEXT_PUBLIC_` to be accessible in the browser):
- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:3000/api)
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `NEXT_PUBLIC_AUTH0_DOMAIN` - Auth0 domain
- `NEXT_PUBLIC_AUTH0_CLIENT_ID` - Auth0 client ID
- `NEXT_PUBLIC_APP_URL` - Frontend application URL

**Setup:**
```bash
# Copy the example file
cp apps/frontend/.env.example apps/frontend/.env.local

# Edit with your actual values
# (The .env.local file is already created with default development values)
```

**Note:** `.env` and `.env.local` files are gitignored and should never be committed to version control.

## 📚 Learn More

- [Nx Documentation](https://nx.dev)
- [NestJS Documentation](https://docs.nestjs.com)
- [Next.js Documentation](https://nextjs.org/docs)

## 🎯 Next Steps

1. Set up your database connection (PostgreSQL/Supabase)
2. Configure Auth0 authentication
3. Add more API endpoints
4. Build out your frontend components
5. Set up environment variables

---

**Note:** Make sure both services are running before testing the full-stack integration!

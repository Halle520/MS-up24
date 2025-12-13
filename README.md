# Monospace

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

✨ **Visual Page Builder** - Build individual pages by dragging and dropping components, adding text and icons, and uploading images ✨

A modern full-stack monorepo application with NestJS backend and Next.js frontend for creating customizable web pages without coding.

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

Backend will run on: `http://localhost:4000`
API endpoint: `http://localhost:4000/api/greeting`

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
3. The greeting API endpoint is available at: `http://localhost:4000/api/greeting`

### Frontend Routes

- `/` - Home page with API data overview
- `/show` - Show page (list view)
- `/show/[id]` - Image detail/show page with resize and edit functionality

**Note:** Both backend and frontend may try to use port 4000. If there's a conflict:

- Backend will use port 4000 (or PORT env variable)
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
│   │       ├── modules/  # Feature modules
│   │       │   ├── pages/
│   │       │   ├── components/
│   │       │   └── images/
│   │       └── main.ts
│   └── frontend/         # Next.js frontend application
│       └── src/
│           └── app/
│               ├── page.tsx              # Home page
│               ├── layout.tsx            # Root layout
│               └── show/            # Show page
│                   ├── page.tsx          # Show list page
│                   └── [id]/             # Dynamic route
│                       └── page.tsx      # Image detail/show page
├── docs/                 # Project documentation
│   ├── PROJECT_INTENTION.md      # Project purpose and goals
│   ├── ARCHITECTURE.md           # System architecture
│   ├── FOLDER_STRUCTURE.md       # Folder structure details
│   ├── DEVELOPMENT_GUIDELINES.md # Development standards
│   └── README.md                 # Documentation index
```

## 📖 Documentation

Comprehensive project documentation is available in the [`docs/`](./docs/) folder:

- **[Project Intention](./docs/PROJECT_INTENTION.md)** - Overview of project purpose, goals, and philosophy
- **[Architecture](./docs/ARCHITECTURE.md)** - Detailed system architecture and design patterns
- **[Folder Structure](./docs/FOLDER_STRUCTURE.md)** - Complete folder structure documentation
- **[Development Guidelines](./docs/DEVELOPMENT_GUIDELINES.md)** - Code standards and best practices

**For new team members**: Start with [Project Intention](./docs/PROJECT_INTENTION.md) and [Architecture](./docs/ARCHITECTURE.md).

**For development**: Reference [Development Guidelines](./docs/DEVELOPMENT_GUIDELINES.md) when implementing features.

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
- **Supabase** - Database and Storage (PostgreSQL-based, fully managed)
- **Prisma** - TypeScript ORM (connects to Supabase database)
- **Sharp** - High-performance image processing library
- **Auth0** - Authentication
- **Passport** - Authentication middleware

### Frontend

- **Next.js 15** - React framework
- **React 19** - UI library
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Vite** - Build tool
- **LocatorJS** - Component finder tool (development only)

## 📝 API Documentation

### Interactive API Documentation (Scalar)

The API is fully documented using **Scalar API Reference** - a modern, beautiful API documentation tool that replaces traditional Swagger UI.

**Access the API Documentation:**

- **Scalar UI**: `http://localhost:4000/api-docs`
- **OpenAPI JSON**: `http://localhost:4000/api-docs-json`

The interactive documentation provides:

- ✅ Complete API endpoint documentation with modern UI
- ✅ Request/response schemas with examples
- ✅ Try-it-out functionality with code examples
- ✅ Authentication support (persisted in browser)
- ✅ Organized by API tags (pages, components, images, general)
- ✅ Dark mode support
- ✅ Search functionality
- ✅ Model/schema browser
- ✅ Multiple HTTP client code examples

### API Endpoints Summary

#### General

- `GET /api/greeting` - Returns a greeting message

#### Pages API (`/api/pages`)

- `GET /api/pages` - Get all pages (with pagination: `?page=1&limit=10`)
- `GET /api/pages/:id` - Get a page by ID
- `GET /api/pages/slug/:slug` - Get a page by slug
- `POST /api/pages` - Create a new page
- `PATCH /api/pages/:id` - Update a page
- `DELETE /api/pages/:id` - Delete a page
- `POST /api/pages/:id/publish` - Publish a page
- `POST /api/pages/:id/unpublish` - Unpublish a page

#### Components API (`/api/components`)

- `GET /api/components` - Get all components (filter by type: `?type=text`)
- `GET /api/components/types` - Get available component types
- `GET /api/components/:id` - Get a component by ID
- `POST /api/components` - Create a new component
- `PATCH /api/components/:id` - Update a component
- `DELETE /api/components/:id` - Delete a component

#### Images API (`/api/images`)

Images are handled via the backend API with Supabase storage:

- `GET /api/images` - Get all images with pagination (`?page=1&limit=20`)
- `GET /api/images/:id` - Get an image by ID
- `POST /api/images/upload` - Upload an image (multipart/form-data)
- `DELETE /api/images/:id` - Delete an image

**Backend Processing:**
- **Upload**: Images are uploaded to the backend API, which processes them and stores in Supabase Storage
- **Storage**: Images are stored in the `images` bucket in Supabase Storage with multiple resolutions (tiny, medium, large, original)
- **Metadata**: Image metadata is stored in the `images` table in Supabase PostgreSQL via Prisma
- **Retrieval**: Images are fetched via backend API, which returns public Supabase URLs
- **Deletion**: Images are deleted from both storage and database

**Frontend Integration** (in `apps/frontend/src/lib/api/images.api.ts` and `apps/frontend/src/lib/hooks/use-images.ts`):

- `useImages(page, limit, userId?)` - Query hook for image list
- `useImage(id)` - Query hook for single image
- `useUploadImage()` - Mutation hook for uploading images
- `useDeleteImage()` - Mutation hook for deleting images

**Next.js Image Configuration:**

The frontend is configured to load images from Supabase Storage using Next.js Image component:
- Remote patterns are configured in `next.config.js` to allow `**.supabase.co` domains
- Images use the `fill` layout for responsive sizing
- Error handling displays a placeholder when images fail to load
- Unoptimized mode is enabled in development for faster loading

**For detailed API documentation with examples, request/response schemas, and interactive testing, visit the [API Documentation](http://localhost:4000/api-docs) page.**

## 🌐 Environment Variables

Environment files have been created for both projects. Copy the `.env.example` files and update with your actual values:

### Backend (`apps/backend/.env`)

Essential variables:

- `PORT` - Server port (default: 4000)
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:3000)
- `DATABASE_URL` - Supabase database connection string (from Supabase Dashboard > Settings > Database). Used by Prisma to connect to the database.
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key (for frontend operations)
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (recommended for backend storage operations, or use ANON_KEY)
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

- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:4000/api)
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

## 🗄️ Database Setup

### Supabase Configuration

The project uses Supabase for both PostgreSQL database and file storage. Follow these steps:

1. **Create a Supabase Project:**

   - Go to [supabase.com](https://supabase.com) and create a new project
   - Note your project URL and anon key from the project settings

2. **Configure Environment Variables:**

   - Add `SUPABASE_URL` and `SUPABASE_ANON_KEY` to `apps/backend/.env`
   - The `DATABASE_URL` should be your Supabase PostgreSQL connection string
   - Format: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

3. **Create Storage Bucket:**

   - In Supabase Dashboard, go to Storage
   - Create a new bucket named `images`
   - Set it to public (or configure RLS policies as needed)

4. **Run Database Migrations:**

   **Option 1: Using the migration command (recommended)**

   ```bash
   # Make sure DATABASE_URL is set in apps/backend/.env
   yarn migration:run
   # or
   yarn migration:supabase
   ```

   This will automatically:

   - Connect to your Supabase database using `DATABASE_URL`
   - Execute all SQL files from `apps/backend/src/modules/images/migrations/` in alphabetical order
   - Track executed migrations in a `schema_migrations` table to avoid running them twice
   - Create the `images` table with all necessary columns, indexes, and RLS policies

   **Note:** The migration runner creates a `schema_migrations` table to track which migrations have been executed. This prevents running the same migration multiple times.

   **Option 2: Manual execution via Supabase Dashboard**

   - In Supabase Dashboard, go to SQL Editor
   - Run the migration script from `apps/backend/src/modules/images/migrations/create-images-table.sql`
   - This creates the `images` table with all necessary columns and indexes
   - Alternatively, you can copy and paste the SQL directly into the SQL Editor

   **If you get RLS policy errors when uploading images:**

   **Option 1: Automatic deployment (recommended)**

   ```bash
   # Make sure DATABASE_URL is set in apps/backend/.env
   bun run deploy:rls
   # or
   node apps/backend/src/modules/images/migrations/deploy-rls-policies.js
   ```

   **Option 2: Manual deployment via Supabase Dashboard**

   - Go to Supabase Dashboard > SQL Editor
   - Copy and paste the contents of `apps/backend/src/modules/images/migrations/fix-rls-policies.sql`
   - Click "Run" to execute

   **Option 3: Using Supabase CLI** (if installed)

   ```bash
   supabase db execute -f apps/backend/src/modules/images/migrations/fix-rls-policies.sql
   ```

   This will update the Row Level Security policies to allow public access for all image operations.

   **Troubleshooting RLS Policy Errors:**

   If you're still getting "Unauthorized: new row violates row-level security policy" after deploying:

   **Step 1: Run diagnostic script**

   Run the diagnostic script to identify the issue:

   - Copy contents of `apps/backend/src/modules/images/migrations/diagnose-rls-issue.sql`
   - Run in Supabase Dashboard > SQL Editor
   - This will show you exactly what's wrong

   1. **Verify policies exist:**

      ```bash
      # Run the verification script in Supabase SQL Editor
      # Copy contents of: apps/backend/src/modules/images/migrations/verify-rls-policies.sql
      ```

   2. **Check environment variables:**

      - Ensure `NEXT_PUBLIC_SUPABASE_URL` is set in frontend `.env.local`
      - Ensure `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set (not service role key)
      - The anon key is required for frontend operations

   3. **Verify RLS is enabled:**

      - In Supabase Dashboard: Table Editor > images table > Settings
      - Ensure "Enable Row Level Security" is checked

   4. **Common issues:**
      - **Wrong key**: Using service role key instead of anon key in frontend
      - **Policies not deployed**: Run the deployment script again
      - **Table doesn't exist**: Run `create-images-table.sql` first
      - **Conflicting policies**: The fix script drops all existing policies first

5. **Run Database Migrations:**

   **For Supabase SQL migrations:**

   ```bash
   # Run all Supabase migrations
   yarn migration:run
   # or
   yarn migration:supabase
   ```

   **For Prisma (ORM):**

   ```bash
   # Generate Prisma Client (after schema changes)
   cd apps/backend
   npx prisma generate

   # Pull schema from existing database (if database already exists)
   npx prisma db pull

   # Create migration from schema changes
   npx prisma migrate dev --name migration_name

   # Apply migrations to database
   npx prisma migrate deploy

   # Open Prisma Studio (database GUI)
   npx prisma studio
   ```

   **Note:** The Prisma schema is located at `apps/backend/prisma/schema.prisma`. The connection URL is configured in `prisma/prisma.config.ts` using the `DATABASE_URL` environment variable.

6. **Test Supabase Connection:**

   **Option 1: Using the API endpoint (recommended)**

   ```bash
   # Start the backend server
   bun run start:be

   # Test connection via API (tests both database and Supabase client)
   curl http://localhost:4000/api/test-db

   # Or test Supabase client only
   curl http://localhost:4000/api/images/test-connection
   ```

   The `/api/test-db` endpoint will return:

   - Database connection status (via Prisma to Supabase)
   - Prisma Client connection status
   - Supabase client connection status
   - Overall connection health

   **Option 2: Using the test script**

   ```bash
   # Test database connection directly (requires valid DATABASE_URL)
   bun run test:supabase
   ```

   **Note:** If you get DNS/connection errors, verify:

   - Your Supabase project is active (not paused)
   - The DATABASE_URL in `.env` matches the connection string from Supabase Dashboard
   - Your internet connection is working

### Image Upload Features

The image upload system handles everything directly from the frontend:

- ✅ Uploads images directly to Supabase Storage (no backend API needed)
- ✅ Stores images in the `images` bucket in Supabase Storage
- ✅ Saves metadata (filename, size, dimensions, URLs) to PostgreSQL database
- ✅ Handles JPEG, PNG, GIF, WebP, and SVG formats
- ✅ Automatically extracts image dimensions (width/height) from uploaded files
- ✅ Returns public URLs for direct access
- ✅ Automatic cleanup when deleting images (removes from both storage and database)

**Implementation Details:**

- **Frontend Direct Integration**: All image operations use Supabase client directly from the browser
- **Storage**: Images are stored in Supabase Storage bucket named `images`
- **Database**: Metadata is stored in the `images` table in Supabase PostgreSQL
- **File Organization**: Images are stored in `original/` folder within the bucket
- **File Size Limit**: Maximum 10MB per image
- **Image Dimensions**: Automatically extracted using browser Image API
- **React Hooks**: Uses React Query for efficient data fetching and caching

**Note**: For multiple resolutions (tiny, medium, large), you can:

1. Use Supabase Edge Functions to process images server-side
2. Use a service like Cloudinary/ImageKit
3. Process images client-side before upload (limited browser support)

**Image Response Structure:**

```json
{
  "id": "uuid",
  "filename": "image.jpg",
  "originalName": "photo.jpg",
  "mimeType": "image/jpeg",
  "size": 102400,
  "url": "https://...original.jpg",
  "urlTiny": "https://...tiny.jpg",
  "urlMedium": "https://...medium.jpg",
  "urlLarge": "https://...large.jpg",
  "urlOriginal": "https://...original.jpg",
  "uploadedAt": "2024-01-01T00:00:00.000Z"
}
```

## 🎯 Next Steps

1. ✅ Set up your database connection (PostgreSQL/Supabase)
2. Configure Auth0 authentication
3. Add more API endpoints
4. Build out your frontend components
5. Set up environment variables

## 🔍 LocatorJS

LocatorJS is configured and enabled in development mode. It helps you quickly find React components in your browser.

### Installation

LocatorJS is configured using the [data-ids variant](https://www.locatorjs.com/install/react-data-id) which works with the browser extension:

1. **Webpack Loader**: `@locator/webpack-loader` - Adds data-ids to components during build
2. **Runtime Library**: `@locator/runtime` - Optional UI library (included for convenience)

### How to Use

1. **Install the Browser Extension:**

   - [Chrome Extension](https://chrome.google.com/webstore/detail/locatorjs/npbfbmleipbkchlnhfhfhpdabebgdfji)
   - [Firefox Extension](https://addons.mozilla.org/en-US/firefox/addon/locatorjs/)
   - [Edge Extension](https://microsoftedge.microsoft.com/addons/detail/locatorjs/edhghaodanlmhbdpfbcbhdlbdfgojkci)

2. **Usage:**
   - Start your frontend in development mode: `bun run start:fe`
   - Open your browser and navigate to your app
   - Click on any component in the browser
   - LocatorJS will highlight the component and show you its file location
   - Click the file path to open it directly in your IDE

### Configuration

- **Webpack Loader**: Configured in `apps/frontend/next.config.js` to add data-ids to all React components in development mode
- **Runtime**: Initialized through the `Locator` component in `apps/frontend/src/components/locator.tsx`
- Only active when:
  - `NODE_ENV === 'development'`
  - Running in the browser (client-side only)
  - Browser extension is installed

## 📚 Storybook

Storybook is configured for component development and documentation.

### Starting Storybook

```bash
# Start Storybook development server
bun run storybook
```

Storybook will be available at `http://localhost:6006` (or the port shown in terminal)

### Building Storybook

```bash
# Build static Storybook for deployment
bun run build:storybook
```

### Features

- **Component Stories**: Located in `apps/frontend/src/**/*.stories.tsx`
- **Tailwind CSS**: Fully configured and working in Storybook
- **Addons**: Includes essential addons (controls, actions, interactions, etc.)
- **TypeScript**: Full TypeScript support

### Example Stories

- `Button.stories.tsx` - Example button component with variants
- `Locator.stories.tsx` - LocatorJS component story

### Creating New Stories

Create a `.stories.tsx` file next to your component:

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { YourComponent } from './your-component';

const meta: Meta<typeof YourComponent> = {
  title: 'Components/YourComponent',
  component: YourComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Your component props
  },
};
```

---

**Note:** Make sure both services are running before testing the full-stack integration!

# Monospace Architecture Overview

## System Architecture

Monospace is a modern web application combining a rich media gallery with collaborative group features.

```
┌─────────────────────────────────────────────────────────────┐
│                  Monospace Application                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Frontend App (Next.js 15)                  │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  Gallery Interface                             │  │   │
│  │  │  - Masonry Grid Layout                         │  │   │
│  │  │  - Image Preview & Details                     │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  Communication Hub                             │  │   │
│  │  │  - Group Chat Interface                        │  │   │
│  │  │  - Real-time Updates                           │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
│           │                                                  │
│           │  HTTP/REST API                                   │
│           ▼                                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Backend API (NestJS)                       │   │
│  │  - Images API (Upload/Management)                    │   │
│  │  - Groups API (Chat/Membership)                      │   │
│  │  - Auth API                                          │   │
│  │  - Users API                                         │   │
│  └──────────────────────────────────────────────────────┘   │
│           │                                                  │
│           │                                                  │
│           ▼                                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Data Layer                                  │   │
│  │  ┌──────────────┐         ┌──────────────┐          │   │
│  │  │  PostgreSQL  │         │  File Storage│          │   │
│  │  │  (via Prisma)│         │  (Uploads)   │          │   │
│  │  └──────────────┘         └──────────────┘          │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Backend Architecture (NestJS)

### Module Structure

```
apps/backend/src/
├── app/                    # Root application setup
├── modules/                # Feature modules
│   └── [Feature]/          # e.g., groups, images
│       ├── dto/            # Data Transfer Objects (Validation)
│       ├── entities/       # Database Entities
│       ├── controllers/    # API Endpoints
│       ├── services/       # Business Logic
│       └── [feature].module.ts
├── prisma/                 # Database schema & client configuration
└── shared/                 # Shared utilities & constants
```

### Technology Stack
- **Framework**: NestJS 11
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma (replaced MikroORM)
- **API Documentation**: Scalar
- **File Processing**: Sharp (Image optimization)
- **File Upload**: Multer

### Key Design Principles
1. **Modular Design**: Features are encapsulated in dedicated modules (Groups, Images, etc.).
2. **Prisma ORM**: Type-safe database access with schema-first design.
3. **DTO Validation**: Strict input validation using `class-validator`.
4. **Service Layer Pattern**: Business logic isolated from controllers.

## Frontend Architecture (Next.js)

### Directory Structure

```
apps/frontend/src/
├── app/                    # Next.js App Router
│   ├── [feature]/          # Feature routes (e.g., dashboard, groups)
│   ├── api/                # Local API routes
│   └── layout.tsx          # Root layout
├── components/             # React components
│   ├── [feature]/          # Feature-specific components
│   └── ui/                 # Reusable UI components (buttons, inputs)
├── lib/                    # Core libraries
│   ├── api/                # Backend API clients
│   ├── hooks/              # Custom React hooks
│   ├── stores/             # Global state (Zustand)
│   └── utils/              # Helper functions
└── styles/                 # Global styles (Tailwind)
```

### Technology Stack
- **Framework**: Next.js 15 (App Router)
- **Library**: React 19
- **Styling**: Tailwind CSS
- **Data Fetching**: TanStack Query (React Query)
- **Icons**: Lucide React
- **State Management**: Zustand
- **Monorepo Tools**: Nx

### Key Features
1. **Gallery System**:
    - Pinterest-style masonry grid layout.
    - Optimized image loading with Next.js Image.
    - Image details and preview modal.

2. **Group Chat**:
    - Message history.
    - Multi-type message support (Text, Image, Cards).
    - Real-time feel interaction.

## Data Flow Patterns

### Image Upload Flow
1. **User Action**: User selects file via Upload Modal.
2. **Frontend**: Validates file type/size, creates FormData.
3. **API Call**: `POST /api/images` handled by Backend.
4. **Processing**: Backend uses `multer` to receive file, `sharp` for optimization.
5. **Storage**: File stored in configured storage provider.
6. **Database**: Record created via Prisma.
7. **Response**: Returns image metadata.
8. **Frontend Update**: React Query invalidates cache, gallery refreshes.

### Gallery Rendering
1. **Fetch**: Frontend requests images via `useImages` hook (React Query).
2. **API**: Backend queries PostgreSQL via Prisma.
3. **Response**: Returns paginated list of images.
4. **Render**: Frontend renders Masonry grid.
    - Uses `NextImage` for optimization.
    - Handles loading/error states.

## Environment Configuration

### Backend (`.env`)
- `DATABASE_URL`: PostgreSQL connection string.
- `PORT`: Server port.
- Authentication secrets (Auth0/JWT).

### Frontend (`.env.local`)
- `NEXT_PUBLIC_API_URL`: URL of the backend API.
- Feature flags or public config keys.

## Development Status
- **Current Focus**: Enhancing Gallery features and Group Chat functionality.
- **Migration**: Recently migrated from CSS Modules to Tailwind CSS.
- **Architecture**: Shifted from "Page Builder" to "Collaborative Gallery" focus.

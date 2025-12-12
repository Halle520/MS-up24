# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  Monospace Page Builder                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Frontend App (Next.js)                     │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  Page Builder Interface                        │  │   │
│  │  │  - Drag & Drop System                          │  │   │
│  │  │  - Component Library Panel                     │  │   │
│  │  │  - Canvas/Editor Area                          │  │   │
│  │  │  - Properties Panel                             │  │   │
│  │  │  - Preview Mode                                │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  Component System                              │  │   │
│  │  │  - Text Component                              │  │   │
│  │  │  - Image Component                             │  │   │
│  │  │  - Icon Component                              │  │   │
│  │  │  - Layout Components                           │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
│           │                                                  │
│           │  HTTP/REST API                                  │
│           ▼                                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Backend API (NestJS)                       │   │
│  │  - Pages API (CRUD)                                  │   │
│  │  - Components API                                    │   │
│  │  - Images API (Upload/Storage)                      │   │
│  │  - Auth API (Auth0)                                  │   │
│  └──────────────────────────────────────────────────────┘   │
│           │                                                  │
│           │                                                  │
│           ▼                                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Storage Layer                               │   │
│  │  ┌──────────────┐         ┌──────────────┐          │   │
│  │  │  PostgreSQL  │         │  File Storage│          │   │
│  │  │  - Pages     │         │  - Images    │          │   │
│  │  │  - Components│         │  - Assets    │          │   │
│  │  │  - Users     │         │              │          │   │
│  │  └──────────────┘         └──────────────┘          │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Backend Architecture (NestJS)

### Module Structure

```
apps/backend/src/
├── app/                    # Root application module
│   ├── app.module.ts      # Main application module
│   ├── app.controller.ts  # Root controller
│   └── app.service.ts     # Root service
├── core/                   # Core NestJS artifacts (future)
│   ├── filters/           # Global exception filters
│   ├── guards/            # Authentication/authorization guards
│   ├── interceptors/      # Request/response interceptors
│   └── middlewares/       # Global middlewares
├── shared/                 # Shared services (future)
│   └── utils/             # Utility functions
└── modules/                # Feature modules
    ├── pages/             # Page management module
    │   ├── models/        # Page DTOs
    │   ├── entities/      # Page entity
    │   ├── services/      # Page service
    │   └── controllers/   # Pages API
    ├── components/        # Component management module
    │   ├── models/        # Component DTOs
    │   ├── entities/      # Component entity
    │   ├── services/      # Component service
    │   └── controllers/   # Components API
    ├── images/            # Image upload module
    │   ├── models/        # Image DTOs
    │   ├── entities/      # Image entity
    │   ├── services/      # Image service (upload, storage)
    │   └── controllers/   # Images API
    └── {feature-name}/     # Other feature modules
        ├── models/        # Data types and DTOs
        ├── entities/      # MikroORM entities
        ├── services/      # Business logic
        └── controllers/   # API endpoints
```

### Design Principles

1. **Modular Architecture**
   - One module per main domain/route
   - Encapsulated API per module
   - Clear separation of concerns

2. **Layered Architecture**
   - **Controllers**: Handle HTTP requests/responses
   - **Services**: Business logic and orchestration
   - **Entities**: Data models and persistence
   - **DTOs**: Data transfer objects with validation

3. **Dependency Injection**
   - All dependencies injected via constructor
   - Easy testing with test doubles
   - Loose coupling between components

## Frontend Architecture (Next.js)

### Directory Structure

```
apps/frontend/src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── builder/           # Page builder routes
│   │   ├── [pageId]/      # Edit specific page
│   │   └── new/           # Create new page
│   ├── preview/           # Preview pages
│   │   └── [pageId]/      # Preview specific page
│   └── api/               # API routes (if needed)
├── components/             # React components
│   ├── ui/                # Base UI components (shadcn/ui)
│   ├── builder/           # Page builder components
│   │   ├── canvas/        # Canvas/editor area
│   │   ├── component-library/  # Component library panel
│   │   ├── properties-panel/   # Properties editor panel
│   │   ├── toolbar/       # Builder toolbar
│   │   └── preview/       # Preview mode components
│   ├── page-components/   # Page builder components
│   │   ├── text/          # Text component
│   │   ├── image/         # Image component
│   │   ├── icon/          # Icon component
│   │   ├── container/     # Container/layout components
│   │   └── base/          # Base component wrapper
│   └── *.stories.tsx      # Storybook stories
├── lib/                    # Utilities and helpers
│   ├── api/               # API client functions
│   │   ├── pages.api.ts   # Pages API
│   │   ├── components.api.ts  # Components API
│   │   └── images.api.ts  # Images API
│   ├── utils/             # Utility functions
│   │   ├── dnd.utils.ts   # Drag and drop utilities
│   │   └── component.utils.ts  # Component utilities
│   └── stores/            # State management
│       └── builder.store.ts  # Builder state store
├── hooks/                  # Custom React hooks
│   ├── use-builder.ts     # Builder hook
│   ├── use-dnd.ts         # Drag and drop hook
│   └── use-component.ts   # Component hook
└── types/                  # TypeScript type definitions
    ├── page.types.ts      # Page types
    ├── component.types.ts # Component types
    └── builder.types.ts   # Builder types
```

### Design Principles

1. **Page Builder Architecture**
   - **Canvas System**: Main editing area where components are placed
   - **Drag-and-Drop**: Intuitive DnD system for component placement
   - **Component Registry**: Centralized component registration and management
   - **State Management**: Efficient state management for builder state (pages, components, selection)
   - **Property System**: Dynamic property editing for each component type

2. **Component System**
   - **Base Component**: Abstract base class for all page components
   - **Component Types**: Text, Image, Icon, Container, etc.
   - **Component Props**: Type-safe component properties
   - **Component Rendering**: Render components in both builder and preview modes
   - **Component Serialization**: Convert components to/from JSON for storage

3. **Component-Driven Development**
   - Reusable, composable components
   - Storybook for component documentation
   - Isolated component testing

4. **Server/Client Components**
   - Server components by default (Next.js 14)
   - Client components for interactive builder interface
   - Optimal performance and SEO

5. **Type Safety**
   - Shared types between frontend and backend
   - Type-safe API calls
   - No `any` types
   - Type-safe component definitions

## Data Flow

### Page Builder Flow

```
1. User Drags Component (Frontend)
   ↓
2. DnD System Updates Builder State
   ↓
3. Component Rendered on Canvas
   ↓
4. User Edits Component Properties
   ↓
5. State Updated Locally (Optimistic Update)
   ↓
6. API Call to Save Page (lib/api/pages.api.ts)
   ↓
7. HTTP Request to Backend
   ↓
8. NestJS Pages Controller
   ↓
9. Pages Service (Business Logic)
   ↓
10. Page Entity Saved to Database
    ↓
11. Response with Updated Page Data
    ↓
12. Frontend Updates State with Server Response
```

### Image Upload Flow

```
1. User Selects Image File (Frontend)
   ↓
2. File Validation (size, type)
   ↓
3. FormData Created with Image
   ↓
4. API Call to Upload Image (lib/api/images.api.ts)
   ↓
5. HTTP POST to /api/images/upload
   ↓
6. NestJS Images Controller
   ↓
7. Images Service (File Processing)
   ↓
8. Image Saved to Storage (File System/Cloud Storage)
   ↓
9. Image Metadata Saved to Database
   ↓
10. Response with Image URL
    ↓
11. Image URL Used in Component
```

### Component Rendering Flow

```
1. Page Loaded from Database
   ↓
2. Page JSON Parsed
   ↓
3. Component Registry Lookup
   ↓
4. Components Rendered Based on Type
   ↓
5. Builder Mode: Editable Components with DnD
   ↓
6. Preview Mode: Static Components (Final Output)
```

### Authentication Flow

```
1. User Login (Frontend)
   ↓
2. Auth0 Authentication
   ↓
3. JWT Token Received
   ↓
4. Token Stored (Frontend)
   ↓
5. Token Sent with API Requests
   ↓
6. NestJS Guard Validates Token
   ↓
7. Request Authorized/Rejected
```

## Technology Stack

### Backend Stack
- **NestJS**: Progressive Node.js framework
- **MikroORM**: TypeScript ORM for database operations
- **PostgreSQL**: Relational database
- **Auth0**: Authentication and authorization
- **Passport**: Authentication middleware
- **class-validator**: DTO validation
- **class-transformer**: Object transformation

### Frontend Stack
- **Next.js 14**: React framework with App Router
- **React 18**: UI library
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Component library
- **React DnD / DnD Kit**: Drag and drop library
- **Zustand / Jotai**: State management for builder state
- **Lucide React**: Icon library
- **Storybook**: Component development and documentation
- **LocatorJS**: Development tool for component finding

### Development Tools
- **Nx**: Monorepo build system
- **Bun**: Fast JavaScript runtime and package manager
- **Playwright**: E2E testing
- **Jest**: Unit testing
- **ESLint**: Code linting
- **Prettier**: Code formatting

## Environment Configuration

### Backend Environment Variables
- `PORT`: Server port
- `FRONTEND_URL`: CORS origin
- `DATABASE_URL`: PostgreSQL connection string
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_ANON_KEY`: Supabase anonymous key
- `AUTH0_DOMAIN`: Auth0 domain
- `AUTH0_CLIENT_ID`: Auth0 client ID
- `AUTH0_CLIENT_SECRET`: Auth0 client secret
- `JWT_SECRET`: JWT signing secret

### Frontend Environment Variables
- `NEXT_PUBLIC_API_URL`: Backend API URL
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key
- `NEXT_PUBLIC_AUTH0_DOMAIN`: Auth0 domain
- `NEXT_PUBLIC_AUTH0_CLIENT_ID`: Auth0 client ID
- `NEXT_PUBLIC_APP_URL`: Frontend application URL

## Security Considerations

1. **Authentication**: Auth0 for secure user authentication
2. **Authorization**: Role-based access control (RBAC)
3. **CORS**: Configured for specific origins
4. **Input Validation**: DTOs with class-validator
5. **SQL Injection**: ORM prevents SQL injection
6. **XSS Protection**: React's built-in XSS protection
7. **Environment Variables**: Sensitive data in .env files (gitignored)

## Page Builder Architecture

### Component System

1. **Component Registry**
   - Centralized component registration
   - Component metadata (name, icon, default props)
   - Component factory functions
   - Type-safe component definitions

2. **Component Types**
   - **Text Component**: Rich text editing, styling options
   - **Image Component**: Image upload, display, sizing
   - **Icon Component**: Icon selection from library, sizing, color
   - **Container Component**: Layout containers (rows, columns, grids)
   - **Custom Components**: Extensible system for new component types

3. **Component Properties**
   - Dynamic property panels based on component type
   - Type-safe property definitions
   - Property validation
   - Default values and constraints

### Drag and Drop System

1. **DnD Implementation**
   - Drag from component library to canvas
   - Reorder components on canvas
   - Nested component support (containers)
   - Visual feedback during drag

2. **Selection System**
   - Select components on canvas
   - Multi-select support
   - Selection indicators
   - Keyboard shortcuts (delete, copy, paste)

### State Management

1. **Builder State**
   - Current page data
   - Selected component
   - Component library state
   - Undo/redo history
   - Preview mode state

2. **Page State**
   - Component tree structure
   - Component properties
   - Page metadata (title, description, etc.)

### Image Management

1. **Upload System**
   - File upload handling
   - Image validation (size, type)
   - Image processing (resize, optimize)
   - Storage integration (local/cloud)

2. **Image Storage**
   - File system or cloud storage (S3, Cloudinary, etc.)
   - Image metadata in database
   - CDN integration for delivery
   - Image optimization

## Scalability Considerations

1. **Horizontal Scaling**: Stateless API design
2. **Database**: Connection pooling, migrations, indexing for pages/components
3. **Caching**: Ready for Redis integration (page data, component definitions)
4. **CDN**: Static assets and images served via CDN
5. **Load Balancing**: API designed for load balancing
6. **Microservices**: Modular structure supports microservices
7. **Image Storage**: Scalable image storage solution (S3, Cloudinary)
8. **Component System**: Extensible component registry for adding new types

# Folder Structure Documentation

## Root Directory

```
monospace/
├── .cursor/                 # Cursor IDE configuration
│   └── rules/              # Workspace rules
├── .vscode/                 # VS Code configuration
├── apps/                    # Application source code
│   ├── backend/            # NestJS backend application
│   ├── backend-e2e/        # Backend E2E tests
│   ├── frontend/           # Next.js frontend application
│   └── frontend-e2e/       # Frontend E2E tests
├── docs/                    # Project documentation (this folder)
├── libs/                    # Shared libraries (future)
├── node_modules/            # Dependencies (generated)
├── .editorconfig            # Editor configuration
├── .gitignore               # Git ignore rules
├── .prettierignore          # Prettier ignore rules
├── .prettierrc              # Prettier configuration
├── bun.lock                 # Bun lock file
├── nx.json                  # Nx workspace configuration
├── package.json             # Root package.json with scripts
├── README.md                # Main project README
└── tsconfig.base.json       # Base TypeScript configuration
```

## Backend Application (`apps/backend/`)

```
apps/backend/
├── .env.example             # Environment variables template
├── project.json             # Nx project configuration
├── tsconfig.app.json        # TypeScript config for app
├── tsconfig.json            # TypeScript config extends
├── webpack.config.js        # Webpack configuration
└── src/
    ├── app/                 # Application root module
    │   ├── app.controller.ts    # Root controller
    │   ├── app.module.ts        # Root module
    │   └── app.service.ts       # Root service
    ├── assets/              # Static assets
    │   └── .gitkeep
    └── main.ts              # Application entry point
```

### Future Backend Structure

```
apps/backend/src/
├── app/                     # Root application module
├── core/                    # Core NestJS artifacts
│   ├── filters/            # Global exception filters
│   │   └── http-exception.filter.ts
│   ├── guards/             # Authentication/authorization guards
│   │   ├── jwt-auth.guard.ts
│   │   └── roles.guard.ts
│   ├── interceptors/       # Request/response interceptors
│   │   ├── logging.interceptor.ts
│   │   └── transform.interceptor.ts
│   └── middlewares/        # Global middlewares
│       └── logger.middleware.ts
├── shared/                 # Shared services and utilities
│   ├── utils/              # Utility functions
│   │   ├── date.utils.ts
│   │   └── string.utils.ts
│   └── constants/          # Shared constants
│       └── app.constants.ts
└── modules/                # Feature modules
    ├── pages/              # Page management module
    │   ├── models/         # DTOs and types
    │   │   ├── create-page.dto.ts
    │   │   ├── update-page.dto.ts
    │   │   └── page-response.type.ts
    │   ├── entities/       # MikroORM entities
    │   │   └── page.entity.ts
    │   ├── services/       # Business logic
    │   │   └── pages.service.ts
    │   ├── controllers/    # API endpoints
    │   │   └── pages.controller.ts
    │   └── pages.module.ts # Module definition
    ├── components/         # Component management module
    │   ├── models/         # Component DTOs
    │   ├── entities/       # Component entity
    │   ├── services/       # Component service
    │   ├── controllers/    # Components API
    │   └── components.module.ts
    ├── images/             # Image upload module
    │   ├── models/         # Image DTOs
    │   ├── entities/       # Image entity
    │   ├── services/       # Image service (upload, storage)
    │   ├── controllers/    # Images API
    │   └── images.module.ts
    └── users/              # User management module
        └── ...             # Similar structure
```

## Frontend Application (`apps/frontend/`)

```
apps/frontend/
├── .env.example             # Environment variables template
├── .storybook/             # Storybook configuration
│   ├── main.ts            # Storybook main config
│   └── preview.ts         # Storybook preview config
├── .swcrc                  # SWC compiler configuration
├── index.d.ts              # TypeScript declarations
├── next-env.d.ts           # Next.js type definitions
├── next.config.js          # Next.js configuration
├── project.json            # Nx project configuration
├── tsconfig.json           # TypeScript configuration
├── tsconfig.storybook.json # Storybook TypeScript config
├── public/                 # Static public files
│   ├── .gitkeep
│   └── favicon.ico
└── src/
    ├── app/                # Next.js App Router
    │   ├── api/            # API routes (optional)
    │   │   └── hello/
    │   │       └── route.ts
    │   ├── global.css      # Global styles
    │   ├── layout.tsx      # Root layout
    │   ├── page.module.css # Home page styles
    │   └── page.tsx        # Home page
    └── components/         # React components
        ├── button.stories.tsx  # Button Storybook story
        ├── locator.stories.tsx # Locator Storybook story
        └── locator.tsx         # LocatorJS component
```

### Future Frontend Structure

```
apps/frontend/src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth route group
│   │   ├── login/
│   │   └── register/
│   ├── builder/           # Page builder routes
│   │   ├── [pageId]/      # Edit specific page
│   │   │   └── page.tsx
│   │   └── new/           # Create new page
│   │       └── page.tsx
│   ├── preview/           # Preview pages
│   │   └── [pageId]/      # Preview specific page
│   │       └── page.tsx
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Base UI components (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   └── card.tsx
│   ├── builder/           # Page builder components
│   │   ├── canvas/        # Canvas/editor area
│   │   │   ├── canvas.tsx
│   │   │   └── canvas-container.tsx
│   │   ├── component-library/  # Component library panel
│   │   │   ├── component-library.tsx
│   │   │   └── component-item.tsx
│   │   ├── properties-panel/   # Properties editor panel
│   │   │   ├── properties-panel.tsx
│   │   │   └── property-editor.tsx
│   │   ├── toolbar/       # Builder toolbar
│   │   │   └── toolbar.tsx
│   │   └── preview/       # Preview mode components
│   │       └── preview-mode.tsx
│   ├── page-components/   # Page builder components
│   │   ├── text/          # Text component
│   │   │   ├── text-component.tsx
│   │   │   └── text-editor.tsx
│   │   ├── image/         # Image component
│   │   │   ├── image-component.tsx
│   │   │   └── image-uploader.tsx
│   │   ├── icon/          # Icon component
│   │   │   ├── icon-component.tsx
│   │   │   └── icon-picker.tsx
│   │   ├── container/     # Container/layout components
│   │   │   ├── container-component.tsx
│   │   │   ├── row-component.tsx
│   │   │   └── column-component.tsx
│   │   └── base/          # Base component wrapper
│   │       └── base-component.tsx
│   └── layout/           # Layout components
│       ├── header.tsx
│       ├── footer.tsx
│       └── sidebar.tsx
├── lib/                  # Utilities and helpers
│   ├── api/              # API client functions
│   │   ├── pages.api.ts  # Pages API
│   │   ├── components.api.ts  # Components API
│   │   └── images.api.ts # Images API
│   ├── utils/            # Utility functions
│   │   ├── dnd.utils.ts  # Drag and drop utilities
│   │   ├── component.utils.ts  # Component utilities
│   │   └── format.utils.ts
│   ├── stores/           # State management
│   │   └── builder.store.ts  # Builder state store
│   └── constants/        # Constants
│       └── app.constants.ts
├── hooks/                # Custom React hooks
│   ├── use-builder.ts    # Builder hook
│   ├── use-dnd.ts        # Drag and drop hook
│   ├── use-component.ts  # Component hook
│   └── use-auth.ts
└── types/                # TypeScript type definitions
    ├── page.types.ts     # Page types
    ├── component.types.ts  # Component types
    ├── builder.types.ts  # Builder types
    └── api.types.ts
```

## E2E Tests

### Backend E2E (`apps/backend-e2e/`)

```
apps/backend-e2e/
├── jest.config.cts        # Jest configuration
├── project.json           # Nx project configuration
└── src/
    ├── backend/           # Test files
    │   └── backend.spec.ts
    └── support/           # Test support files
        ├── global-setup.ts
        ├── global-teardown.ts
        └── test-setup.ts
```

### Frontend E2E (`apps/frontend-e2e/`)

```
apps/frontend-e2e/
├── playwright.config.ts   # Playwright configuration
├── project.json          # Nx project configuration
└── src/
    └── example.spec.ts   # Example E2E test
```

## Shared Libraries (Future - `libs/`)

```
libs/
├── shared-types/         # Shared TypeScript types
│   └── src/
│       └── index.ts
├── api-client/           # Shared API client
│   └── src/
│       └── index.ts
└── ui-components/        # Shared UI components
    └── src/
        └── index.ts
```

## Configuration Files

### Root Level
- `nx.json`: Nx workspace configuration
- `package.json`: Root dependencies and scripts
- `tsconfig.base.json`: Base TypeScript configuration
- `.prettierrc`: Prettier formatting rules
- `.editorconfig`: Editor configuration
- `.gitignore`: Git ignore patterns

### Backend Configuration
- `apps/backend/tsconfig.json`: Backend TypeScript config
- `apps/backend/tsconfig.app.json`: App-specific TypeScript config
- `apps/backend/webpack.config.js`: Webpack build configuration
- `apps/backend/.env.example`: Environment variables template

### Frontend Configuration
- `apps/frontend/tsconfig.json`: Frontend TypeScript config
- `apps/frontend/tsconfig.storybook.json`: Storybook TypeScript config
- `apps/frontend/next.config.js`: Next.js configuration
- `apps/frontend/.swcrc`: SWC compiler configuration
- `apps/frontend/.storybook/`: Storybook configuration
- `apps/frontend/.env.example`: Environment variables template

## Naming Conventions

### Files
- **Components**: `kebab-case.tsx` (e.g., `user-list.tsx`)
- **Services**: `kebab-case.service.ts` (e.g., `users.service.ts`)
- **Controllers**: `kebab-case.controller.ts` (e.g., `users.controller.ts`)
- **Entities**: `kebab-case.entity.ts` (e.g., `user.entity.ts`)
- **DTOs**: `kebab-case.dto.ts` (e.g., `create-user.dto.ts`)
- **Types**: `kebab-case.type.ts` (e.g., `user.type.ts`)
- **Utils**: `kebab-case.utils.ts` (e.g., `date.utils.ts`)
- **Stories**: `component-name.stories.tsx` (e.g., `button.stories.tsx`)

### Directories
- **Modules**: `kebab-case` (e.g., `user-management/`)
- **Features**: `kebab-case` (e.g., `user-profile/`)
- **Components**: `kebab-case` (e.g., `user-list/`)

### Code
- **Classes**: `PascalCase` (e.g., `UserService`)
- **Variables/Functions**: `camelCase` (e.g., `getUserById`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `API_BASE_URL`)
- **Interfaces/Types**: `PascalCase` (e.g., `UserResponse`)

## Important Notes

1. **Never commit `.env` files** - Only `.env.example` files should be committed
2. **Keep components small** - One component per file, one export per file
3. **Follow the monorepo structure** - Backend in `apps/backend/`, frontend in `apps/frontend/`
4. **Document new modules** - Update this documentation when adding new modules
5. **Shared code** - Use `libs/` for code shared between apps
6. **Test files** - Co-locate test files with source files or in `__tests__/` directories

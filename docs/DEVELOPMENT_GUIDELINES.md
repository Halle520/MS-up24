# Development Guidelines

## Code Standards

### TypeScript Guidelines

#### Type Safety
- **Always declare types** for variables, function parameters, and return values
- **Avoid `any`** - Use `unknown` if type is truly unknown, then narrow it
- **Create necessary types** - Don't use primitive types when a composite type is more appropriate
- **Use interfaces for contracts** - Define clear contracts between modules

#### Naming Conventions
- **PascalCase**: Classes, interfaces, types, enums
- **camelCase**: Variables, functions, methods, parameters
- **kebab-case**: Files and directories
- **UPPER_SNAKE_CASE**: Constants and environment variables
- **Complete words**: Avoid abbreviations except standard ones (API, URL, etc.)

#### Functions
- **Short functions** - Less than 20 instructions, single purpose
- **Verb-based names** - Start with a verb (e.g., `getUserById`, `saveProduct`)
- **Boolean returns** - Use `isX`, `hasX`, `canX` prefixes
- **Early returns** - Use early checks to avoid nesting
- **Default parameters** - Use default values instead of null checks
- **RO-RO pattern** - Use objects for multiple parameters/returns

#### Data Structures
- **Encapsulate data** - Use classes or interfaces instead of primitives
- **Immutability** - Use `readonly` and `as const` where appropriate
- **Validation** - Use classes with internal validation (DTOs with class-validator)

### NestJS Guidelines

#### Module Structure
```
modules/{feature-name}/
├── models/          # DTOs and types
├── entities/        # MikroORM entities
├── services/        # Business logic
├── controllers/     # API endpoints
└── {feature}.module.ts
```

#### Controllers
- **One controller per route** - Main route in primary controller
- **Use decorators** - `@Controller()`, `@Get()`, `@Post()`, etc.
- **Return DTOs** - Always return typed responses
- **Handle errors** - Let global filters handle exceptions

#### Services
- **Business logic only** - No HTTP concerns
- **Injectable** - Use `@Injectable()` decorator
- **Single responsibility** - One service per entity/domain
- **Testable** - Easy to mock and test

#### DTOs
- **Validation** - Use `class-validator` decorators
- **Transformation** - Use `class-transformer` for data transformation
- **Separate input/output** - Different DTOs for requests and responses

#### Entities
- **MikroORM decorators** - Use `@Entity()`, `@Property()`, etc.
- **Relations** - Define relationships clearly
- **Validation** - Entity-level validation when needed

### React/Next.js Guidelines

#### Components
- **Functional components** - Use function components with hooks
- **Server components by default** - Use client components only when needed
- **Small components** - Single responsibility, less than 200 lines
- **Props interface** - Always define props interface/type
- **One component per file** - One export per file

#### Page Builder Components
- **Base Component** - All page components extend base component
- **Component Registry** - Register all components in central registry
- **Component Props** - Type-safe props with default values
- **Builder Mode** - Editable version with DnD handles
- **Preview Mode** - Static version for final output
- **Component Serialization** - Components must serialize to/from JSON
- **Property Panels** - Dynamic property editors based on component type

#### Hooks
- **Custom hooks** - Extract reusable logic to custom hooks
- **Hook naming** - Start with `use` (e.g., `useAuth`, `useApi`)
- **Dependencies** - Always include all dependencies in dependency arrays

#### State Management
- **Local state first** - Use `useState` for component-local state
- **Server state** - Use React Query or SWR for server state
- **Global state** - Use Context API or Zustand for global state

#### API Calls
- **Centralized API client** - Use `lib/api/` for API functions
- **Type-safe** - Shared types between frontend and backend
- **Error handling** - Proper error handling and user feedback
- **Loading states** - Always show loading states

## Testing Guidelines

### Unit Tests
- **Arrange-Act-Assert** - Follow AAA pattern
- **Test naming** - Clear variable names: `inputX`, `mockX`, `actualX`, `expectedX`
- **Test doubles** - Use mocks for dependencies
- **Coverage** - Test all public functions

### Integration Tests
- **Given-When-Then** - Follow GWT convention
- **Real dependencies** - Use real database, but isolated test data
- **Cleanup** - Always clean up test data

### E2E Tests
- **User flows** - Test complete user journeys
- **Real environment** - Test against real or production-like environment
- **Stable selectors** - Use data-testid for stable selectors

## Git Workflow

### Commit Messages
- **Format**: `type(scope): description`
- **Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- **Examples**:
  - `feat(users): add user registration endpoint`
  - `fix(auth): resolve token expiration issue`
  - `docs(readme): update API documentation`

### Branch Strategy
- **main**: Production-ready code
- **develop**: Integration branch
- **feature/**: Feature branches
- **fix/**: Bug fix branches

## Code Review Checklist

### Backend
- [ ] Types are properly defined
- [ ] DTOs have validation
- [ ] Services are testable
- [ ] Error handling is proper
- [ ] API follows REST conventions
- [ ] Database queries are optimized
- [ ] Security considerations addressed

### Frontend
- [ ] Components are reusable
- [ ] Props are properly typed
- [ ] Loading and error states handled
- [ ] Accessibility considered
- [ ] Performance optimized
- [ ] Responsive design
- [ ] Storybook story created (if new component)

## Performance Guidelines

### Backend
- **Database queries** - Use indexes, avoid N+1 queries
- **Caching** - Cache frequently accessed data
- **Pagination** - Always paginate large datasets
- **Async operations** - Use async/await properly

### Frontend
- **Code splitting** - Use dynamic imports for large components
- **Image optimization** - Use Next.js Image component
- **Bundle size** - Monitor and optimize bundle size
- **Lazy loading** - Lazy load routes and components

## Security Guidelines

### Backend
- **Input validation** - Validate all inputs with DTOs
- **Authentication** - Protect routes with guards
- **Authorization** - Check permissions
- **SQL injection** - Use ORM, never raw SQL
- **XSS** - Sanitize user inputs
- **CORS** - Configure properly

### Frontend
- **XSS protection** - React handles this, but be careful with `dangerouslySetInnerHTML`
- **CSRF** - Use CSRF tokens for state-changing operations
- **Environment variables** - Never expose secrets
- **HTTPS** - Always use HTTPS in production

## Documentation Guidelines

### Code Documentation
- **JSDoc** - Document public classes and methods
- **Comments** - Explain why, not what
- **README** - Keep README.md updated

### API Documentation
- **Endpoints** - Document all endpoints in README.md
- **Request/Response** - Include examples
- **Errors** - Document error responses

## Environment Setup

### Required Tools
- Node.js 20 (use `nvm use 20`)
- Bun (package manager)
- PostgreSQL (database)
- Git

### Initial Setup
```bash
# Install dependencies
bun install

# Configure Environments
# The project now supports split environments: Development and Production.

# Backend Setup:
# Copy the appropriate env file:
cp apps/backend/.env.development apps/backend/.env
# Or for production:
# cp apps/backend/.env.production apps/backend/.env

# Frontend Setup:
# Next.js automatically loads .env during development
# Create .env.local for local overrides if needed
cp apps/frontend/.env.development apps/frontend/.env.local

# Update environment variables
# Edit the created env files with actual values from your secrets manager

# Start development (uses development configuration)
bun run start:all
```

### Environment Management

We use a split environment strategy:

1. **Development (`dev`)**:
   - Uses `apps/backend/.env.development`
   - Uses `apps/frontend/.env.development`
   - Connects to Development Database (e.g. `monospace_dev`)
   - Deploys to Development URL

2. **Production (`prod`)**:
   - Uses `apps/backend/.env.production`
   - Uses `apps/frontend/.env.production`
   - Connects to Production Database (e.g. `monospace_prod`)
   - Deploys to Production URL

**Note**: Never commit `.env` or `.env.*.local` files to git. Always use the template files provided.


## Common Tasks

### Adding a New Feature Module (Backend)

1. Create module structure:
   ```bash
   mkdir -p apps/backend/src/modules/{feature-name}/{models,entities,services,controllers}
   ```

2. Create entity:
   ```typescript
   // entities/{feature}.entity.ts
   @Entity()
   export class FeatureEntity { ... }
   ```

3. Create DTOs:
   ```typescript
   // models/create-{feature}.dto.ts
   export class CreateFeatureDto { ... }
   ```

4. Create service:
   ```typescript
   // services/{feature}.service.ts
   @Injectable()
   export class FeatureService { ... }
   ```

5. Create controller:
   ```typescript
   // controllers/{feature}.controller.ts
   @Controller('features')
   export class FeatureController { ... }
   ```

6. Create module:
   ```typescript
   // {feature}.module.ts
   @Module({ ... })
   export class FeatureModule { ... }
   ```

7. Import in AppModule

### Adding a New Component (Frontend)

1. Create component file:
   ```typescript
   // components/{feature}/{component-name}.tsx
   interface ComponentNameProps { ... }
   export function ComponentName({ ... }: ComponentNameProps) { ... }
   ```

2. Create Storybook story:
   ```typescript
   // components/{feature}/{component-name}.stories.tsx
   export default { ... } as Meta<typeof ComponentName>;
   ```

3. Use in pages/components

### Adding a New Page Builder Component

1. Create component in `components/page-components/{component-type}/`:
   ```typescript
   // components/page-components/{type}/{type}-component.tsx
   interface {Type}ComponentProps {
     id: string;
     props: {Type}ComponentProps;
     isBuilder?: boolean;
   }
   export function {Type}Component({ id, props, isBuilder }: {Type}ComponentProps) {
     // Builder mode: show editing handles
     // Preview mode: render final output
   }
   ```

2. Define component type and default props:
   ```typescript
   // types/component.types.ts
   export interface {Type}ComponentData {
     type: '{type}';
     props: {Type}ComponentProps;
   }
   ```

3. Register component in component registry:
   ```typescript
   // lib/stores/component-registry.ts
   registerComponent({
     type: '{type}',
     name: '{Type}',
     icon: IconComponent,
     defaultProps: { ... },
     component: {Type}Component,
   });
   ```

4. Create property editor (if needed):
   ```typescript
   // components/builder/properties-panel/{type}-property-editor.tsx
   export function {Type}PropertyEditor({ component, onChange }) { ... }
   ```

5. Add to component library panel
6. Create Storybook story for testing

### Adding a New API Endpoint

1. Add method to service
2. Add route to controller
3. Create/update DTOs
4. Update API documentation in README.md
5. Update frontend API client if needed

## Troubleshooting

### Common Issues

1. **Port conflicts**: Check which port each service uses
2. **Environment variables**: Ensure `.env` files are properly configured
3. **Database connection**: Verify DATABASE_URL is correct
4. **CORS errors**: Check FRONTEND_URL in backend .env
5. **Type errors**: Run `bunx nx build` to check for type errors

### Debugging

- **Backend**: Use NestJS logger, check console output
- **Frontend**: Use React DevTools, browser console
- **Database**: Check MikroORM logs, use database client
- **Network**: Use browser DevTools Network tab

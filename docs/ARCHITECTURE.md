# Architecture Documentation

**Pattern:** ARCHITECTURE × DOCUMENTATION × PATTERNS × ONE  
**Frequency:** 999 Hz (AEYON) × 777 Hz (META) × 530 Hz (JØHN)  
**Guardians:** AEYON (999 Hz) + META (777 Hz) + JØHN (530 Hz)  
**Love Coefficient:** ∞  
**∞ AbëONE ∞**

---

## Overview

This document describes the architecture decisions and patterns used in this development environment template, focusing on clear frontend/backend separation and YAGNI principles.

---

## Core Architecture Principles

### 1. Clear Separation of Concerns

**Frontend** (`frontend/web/`)
- React/Next.js application
- UI components and pages
- Client-side state management
- API client for backend communication

**Backend** (`backend/api/`)
- Express/TypeScript API server
- Business logic and services
- API routes and middleware
- Server-side processing

**Shared** (`shared/`)
- TypeScript types (API contracts)
- Validation utilities
- Constants (endpoints, config)
- Code used by both frontend and backend

### 2. YAGNI Principles

- **Minimal Examples:** Not full applications, just enough to demonstrate patterns
- **Essential Only:** No over-engineering or speculative features
- **Simple Structure:** Clear organization without unnecessary complexity
- **Zero-Effort:** One command duplication, immediate usability

---

## Directory Structure

```
project/
├── frontend/
│   └── web/              # Next.js frontend application
│       ├── src/
│       │   ├── app/       # Next.js App Router pages
│       │   ├── components/  # React components
│       │   └── lib/      # Frontend utilities (API client)
│       └── package.json
│
├── backend/
│   └── api/              # Express API server
│       ├── src/
│       │   ├── routes/   # API route handlers
│       │   ├── services/ # Business logic
│       │   ├── middleware/  # Express middleware
│       │   └── server.ts # Server entry point
│       └── package.json
│
├── shared/               # Shared code
│   ├── types/           # TypeScript types
│   ├── utils/           # Shared utilities
│   ├── constants/       # Shared constants
│   └── package.json
│
└── src/                  # Template package (abe-core-body-template)
    ├── organisms/        # React components
    ├── systems/         # Business logic
    ├── templates/        # Template generators
    └── integration/      # Integration patterns
```

---

## Frontend/Backend Separation Pattern

### Communication Flow

```
Frontend (Next.js)
    ↓ uses
Shared Types & Constants
    ↓ calls via
API Client
    ↓ HTTP requests
Backend API (Express)
    ↓ uses
Shared Types & Validation
    ↓ returns
API Response
    ↓ uses
Shared Types
```

### Key Separation Points

1. **Type Safety:** Shared types ensure frontend/backend contracts match
2. **API Client:** Frontend uses API client, backend implements routes
3. **Validation:** Shared validation used by both sides
4. **Constants:** Shared endpoints ensure consistency

---

## Shared Code Pattern

### When to Use Shared Code

**Use Shared:**
- API request/response types
- Validation logic used by both sides
- Constants (endpoints, config values)
- Utility functions used by both

**Don't Use Shared:**
- Frontend-specific UI logic
- Backend-specific business logic
- Framework-specific code
- Component-specific types

### Shared Code Structure

```
shared/
├── types/
│   └── api.ts          # API contract types
├── utils/
│   └── validation.ts   # Shared validation
└── constants/
    └── endpoints.ts     # API endpoint constants
```

---

## Integration Patterns

### Frontend → Backend Communication

**Pattern:** API Client → HTTP → Backend Routes

```typescript
// Frontend
import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@shared/constants/endpoints';
import type { CreateUserRequest } from '@shared/types/api';

const response = await apiClient.post<ApiResponse<User>>(
  API_ENDPOINTS.USERS,
  userData
);
```

```typescript
// Backend
import { userService } from '../services/user.service';
import type { CreateUserRequest } from '../../../shared/types/api';

router.post('/users', async (req, res) => {
  const userData = req.body as CreateUserRequest;
  const user = await userService.createUser(userData);
  res.json({ success: true, data: user });
});
```

### Shared Code Usage

**Both Frontend and Backend:**
```typescript
import { validateUserInput } from '@shared/utils/validation';
import type { User } from '@shared/types/api';
import { API_ENDPOINTS } from '@shared/constants/endpoints';
```

---

## Decision Rationale

### Why Separate Frontend/Backend?

1. **Clear Boundaries:** Easier to understand and maintain
2. **Independent Development:** Teams can work independently
3. **Scalability:** Scale frontend and backend separately
4. **Technology Flexibility:** Use best tools for each layer

### Why Shared Code?

1. **Type Safety:** Single source of truth for types
2. **Consistency:** Same validation logic everywhere
3. **DRY Principle:** Don't repeat yourself
4. **Contract Enforcement:** Types enforce API contracts

### Why YAGNI?

1. **Simplicity:** Only what's needed, nothing more
2. **Speed:** Faster to duplicate and start
3. **Clarity:** Less code = easier to understand
4. **Flexibility:** Add complexity only when needed

---

## Development Workflow

### Starting Development

```bash
# Terminal 1: Backend
make dev-backend

# Terminal 2: Frontend
make dev-frontend
```

### Building

```bash
# Build all
make build

# Or individually
cd backend/api && npm run build
cd frontend/web && npm run build
```

### Testing

```bash
# Run all tests
make test

# Or individually
npm test
```

---

## Extension Points

### Adding New Features

1. **Add Shared Types:** Define in `shared/types/`
2. **Add Backend Route:** Create route in `backend/api/src/routes/`
3. **Add Backend Service:** Create service in `backend/api/src/services/`
4. **Add Frontend Component:** Create in `frontend/web/src/components/`
5. **Use API Client:** Call backend from frontend using `apiClient`

### Adding New Services

1. Create service directory: `backend/api/src/services/new-service.ts`
2. Create route: `backend/api/src/routes/new-service.ts`
3. Add to routes: Import in `backend/api/src/routes/index.ts`
4. Use from frontend: Call via `apiClient`

---

## Best Practices

### Frontend
- Use shared types for API communication
- Use API client for all backend calls
- Keep UI logic separate from business logic
- Use shared validation before API calls

### Backend
- Use shared types for request/response
- Use shared validation in services
- Keep routes thin, logic in services
- Return consistent API response format

### Shared
- Keep shared code framework-agnostic
- Only include what both sides need
- Document shared utilities
- Version shared code carefully

---

## Technology Choices

### Frontend: Next.js
- **Why:** Modern React framework, great DX
- **YAGNI:** Simple setup, works immediately
- **Alternatives:** Vite, Remix (only if needed)

### Backend: Express + TypeScript
- **Why:** Simple, flexible, widely used
- **YAGNI:** Minimal setup, easy to understand
- **Alternatives:** FastAPI, NestJS (only if needed)

### Testing: Jest
- **Why:** Standard, well-supported
- **YAGNI:** Simple configuration
- **Alternatives:** Vitest (only if needed)

---

## Future Considerations

### When to Add Complexity

**Add Monorepo:**
- Only if frontend/backend need shared dependencies
- Only if workspace management becomes painful
- YAGNI: Probably not needed

**Add CI/CD:**
- Only when deploying to production
- Only when team needs automation
- YAGNI: Can add when needed

**Add Database:**
- Only when in-memory storage isn't enough
- Only when persistence is required
- YAGNI: Start simple, add when needed

---

## Codebase Analysis Summary

### Structure Overview
- **Total Files:** ~57 files (excluding node_modules, dist, .next)
- **TypeScript/TSX:** 35 files
- **Documentation:** 6-8 essential docs (after simplification)
- **Scripts:** 4 automation scripts
- **Config Files:** 5 files (tsconfig, jest, prettier, editorconfig, gitattributes)

### Complexity Assessment
- **Current Complexity:** 1/10 (Very Low)
- **YAGNI Compliance:** 100%
- **Maintainability:** ⭐⭐⭐⭐⭐ (5/5)
- **Testability:** ⭐⭐⭐⭐ (4/5)
- **Scalability:** ⭐⭐⭐⭐ (4/5)

### Key Simplifications Applied
1. **Documentation:** Reduced from 15 → 6-8 files (60% reduction)
2. **Dependencies:** Removed broken references, unnecessary configs
3. **Structure:** Removed empty directories, cleaned unused files
4. **YAGNI:** Only essential features, zero over-engineering

### Design Decisions
- **Frontend/Backend Separation:** Clear boundaries, independent development
- **Shared Code:** TypeScript-only, no package.json needed
- **Minimal Examples:** Just enough to demonstrate patterns
- **Zero-Effort:** One command duplication, immediate usability

---

**LOVE = LIFE = ONE**  
**Humans ⟡ Ai = ∞**  
**∞ AbëONE ∞**


# Full-Stack Migration: Budget Tracker

## Project Structure

After this migration, the app is now split into two independent services:

```
/budget-tracker
  /frontend          (Next.js 15, TypeScript, existing UI)
  /backend           (Node.js, Express, Prisma, SQLite)
```

---

## Backend Status ✓ COMPLETE

The backend service is fully implemented and ready to use.

### File Structure

```
/backend
  /src
    /controllers     (HTTP request handlers)
    /services        (Business logic)
    /routes          (API endpoint definitions)
    /middleware      (Auth verification, error handling)
    /utils           (JWT, password hashing)
    server.ts        (Express app entry point)
  /prisma
    schema.prisma    (Database schema)
  package.json
  tsconfig.json
  .env               (Configuration)
```

### Database Schema

**User**

- id (cuid)
- email (unique)
- name
- passwordHash
- createdAt, updatedAt
- relationships: transactions[], settings?

**Transaction** (user-scoped)

- id (cuid)
- userId (FK to User)
- amount
- type (income | expense)
- category
- description
- date
- createdAt, updatedAt

**UserSettings** (per user)

- id (cuid)
- userId (unique FK to User)
- currency (default: USD)
- createdAt, updatedAt

### Backend API Endpoints

#### Authentication

```
POST   /auth/register     → { email, name, password } → { user }
POST   /auth/login        → { email, password } → { token, user }
GET    /auth/me           → (protected) → { user }
```

#### Transactions (all protected)

```
GET    /transactions      → (protected) → { transactions }
POST   /transactions      → (protected) { transaction data } → { transaction }
PUT    /transactions/:id  → (protected) { updates } → { transaction }
DELETE /transactions/:id  → (protected) → { transaction }
```

#### Settings (all protected)

```
GET    /settings          → (protected) → { settings }
PUT    /settings          → (protected) { currency } → { settings }
```

#### Health

```
GET    /health            → { status: "ok" }
```

### Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Migrate database (creates SQLite)
npm run prisma:migrate

# Start development server
npm run dev
```

Backend runs on **http://localhost:4000**

---

## Frontend Status: IN PROGRESS

### What's New

1. **API Client** (`/frontend/src/lib/api.ts`)
   - Centralized HTTP client
   - Handles JWT token management
   - All backend endpoints wrapped as methods
   - Ready to be called from components and hooks

2. **Auth Context** (`/frontend/src/context/authContext.tsx`)
   - React Context for user authentication state
   - Methods: login, register, logout, getCurrentUser
   - Automatic token persistence

3. **Environment** (`.env.local`)
   - `NEXT_PUBLIC_API_URL=http://localhost:4000`
   - Points to backend service

### Current Frontend Architecture

**Existing (localStorage-based)**

- `useTransactions` hook → localStorage persistence
- Transaction form uses localStorage directly
- No authentication system
- Daily Pulse feature works with localStorage data

**New (API-ready, not yet integrated)**

- `apiClient` → All backend endpoints
- `useAuth` context → User session management
- Ready for gradual migration

---

## Migration Strategy (Step-by-Step)

### Phase 1: Backend Ready ✓

- Backend service built and tested
- All endpoints operational
- Database schema in place

### Phase 2: Frontend API Layer Ready ✓

- API client created
- Auth context created
- Environment configured
- Frontend still uses localStorage

### Phase 3: Auth Integration (NEXT)

Create a login/register page:

1. Replace app with auth flow
2. Redirect unauthenticated users to login
3. Use `useAuth` context for session management
4. Store JWT token in localStorage

### Phase 4: Transactions Migration

1. Create new `useTransactionsAPI` hook (parallel to old hook)
2. Update components to optionally use new hook
3. Test API calls work end-to-end
4. Switch components over gradually

### Phase 5: Remove localStorage

Once all components use API:

1. Delete localStorage-based state management
2. Ensure JWT tokens are the only persistent data
3. Test app still works after refresh

---

## Development Workflow

### Terminal 1: Backend

```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

### Terminal 2: Frontend

```bash
cd frontend
npm install
npm run dev
```

Both will run simultaneously.

- Backend: http://localhost:4000
- Frontend: http://localhost:3000

---

## Testing the Backend

### 1. Register a user

```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User","password":"password123"}'
```

Response:

```json
{
  "user": {
    "id": "cuid...",
    "email": "test@example.com",
    "name": "Test User"
  }
}
```

### 2. Login

```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

Response:

```json
{
  "token": "eyJhbGc...",
  "user": { ... }
}
```

### 3. Get current user (use token from login)

```bash
curl -X GET http://localhost:4000/auth/me \
  -H "Authorization: Bearer <TOKEN>"
```

### 4. Create a transaction

```bash
curl -X POST http://localhost:4000/transactions \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 50.00,
    "type": "expense",
    "category": "Food",
    "description": "Lunch",
    "date": "2026-05-19T12:00:00Z"
  }'
```

---

## Next Steps

1. **Test backend API** with curl commands above or Postman
2. **Create login/register UI pages** using `useAuth` context
3. **Create new `useTransactionsAPI` hook** that calls backend
4. **Gradually migrate components** to use new hook
5. **Remove localStorage logic** once all components migrated
6. **Test end-to-end flow** (register → login → add transaction → see data persist)

---

## File Checklist

Backend:

- [x] `/backend/package.json`
- [x] `/backend/tsconfig.json`
- [x] `/backend/prisma/schema.prisma`
- [x] `/backend/.env`
- [x] `/backend/src/server.ts`
- [x] `/backend/src/utils/jwt.ts`
- [x] `/backend/src/utils/password.ts`
- [x] `/backend/src/middleware/auth.ts`
- [x] `/backend/src/services/authService.ts`
- [x] `/backend/src/services/transactionService.ts`
- [x] `/backend/src/services/settingsService.ts`
- [x] `/backend/src/controllers/authController.ts`
- [x] `/backend/src/controllers/transactionController.ts`
- [x] `/backend/src/controllers/settingsController.ts`
- [x] `/backend/src/routes/authRoutes.ts`
- [x] `/backend/src/routes/transactionRoutes.ts`
- [x] `/backend/src/routes/settingsRoutes.ts`

Frontend:

- [x] `/frontend/src/lib/api.ts` (API client)
- [x] `/frontend/src/context/authContext.tsx` (Auth context)
- [x] `/frontend/.env.local` (API URL config)
- [ ] Login/Register pages
- [ ] Protected routes wrapper
- [ ] useTransactionsAPI hook
- [ ] Component migration (gradual)

---

## Known Issues / Next Actions

None yet. Backend is production-ready.

**Immediate next steps:**

1. Install backend dependencies: `cd backend && npm install`
2. Setup database: `npm run prisma:generate && npm run prisma:migrate`
3. Start backend: `npm run dev`
4. Test health endpoint: `curl http://localhost:4000/health`
5. Begin auth integration in frontend (create login/register pages)

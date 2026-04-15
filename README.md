# MERN Stack Developer Intern Assessment - User Management System

Full-stack MERN application implementing:
- JWT authentication
- Role-based authorization (Admin, Manager, User)
- User lifecycle management (create, update, deactivate, view)
- Pagination, search, filters for user list
- Audit info (`createdAt`, `updatedAt`, `createdBy`, `updatedBy`)

## Tech Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Auth: JWT + bcrypt

## Project Structure
- `backend/`: API server
- `frontend/`: React client

## Backend Setup
1. Go to backend:
```bash
cd backend
```
2. Install dependencies:
```bash
npm install
```
3. Create env file:
```bash
cp .env.example .env
```
4. Update `backend/.env` values, especially `MONGO_URI` and `JWT_SECRET`.
5. Seed default users:
```bash
npm run seed
```
6. Start backend:
```bash
npm run dev
```

Backend URL: `http://localhost:5000`

## Frontend Setup
1. Go to frontend:
```bash
cd frontend
```
2. Install dependencies:
```bash
npm install
```
3. Create env file:
```bash
cp .env.example .env
```
4. Start frontend:
```bash
npm run dev
```

Frontend URL: `http://localhost:5173`

## Seeded Accounts
- Admin: `admin@example.com` / `Admin@1234`
- Manager: `manager@example.com` / `Manager@1234`
- User: `user@example.com` / `User@1234`

## RBAC Behavior
- Admin:
  - Full user management (create/update/change role/deactivate/view)
- Manager:
  - View user list and details
  - Update non-admin users
  - Deactivate non-admin users
- User:
  - View and update own profile only

## API Highlights
Base path: `/api`
- `POST /auth/login`
- `GET /auth/me`
- `GET /users/me`
- `PATCH /users/me`
- `GET /users` (admin/manager)
- `GET /users/:id` (admin/manager)
- `POST /users` (admin)
- `PATCH /users/:id` (admin/manager)
- `DELETE /users/:id` (admin/manager, soft-deactivate)

## Deployment Notes
Deploy backend and frontend separately.
- Backend platforms: Render / Railway / etc.
- Frontend platforms: Vercel / Netlify / etc.

Set frontend env:
- `VITE_API_BASE_URL=<deployed_backend_url>/api`

Set backend env:
- `MONGO_URI=<mongo_connection_string>`
- `JWT_SECRET=<strong_secret>`
- `CORS_ORIGIN=<deployed_frontend_url>`

# User-Management-System

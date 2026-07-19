# Smart Parking Management System

A full-stack college DSA project built with React, Node.js, Express, MySQL, JWT, and MVC architecture.

## Included features

The application includes JWT authentication, role-based user/admin dashboards, vehicle and slot management, automatic slot allocation, booking cancellation, parking entry/exit, fee calculation, cash/UPI/card dummy payments, receipts, and occupancy/revenue reporting.

## Quick start

1. For a new database, run `database/schema.sql`. For a database created with the original Phase 1 schema, run `database/migrate_phase2.sql` once instead.
2. Copy `backend/.env.example` to `backend/.env`, then fill in your local MySQL and JWT values.
3. Install dependencies in each app:
   - `cd backend && npm install`
   - `cd frontend && npm install`
4. Start both applications:
   - Backend: `npm run dev` (from `backend`)
   - Frontend: `npm run dev` (from `frontend`)

The backend API runs on `http://localhost:5000/api`; Vite serves the frontend on `http://localhost:5173` by default.

## Development administrator

The database seed creates `admin@parksmart.local` with password `Admin@123`. Change this password immediately after first sign-in outside local development.

# Evoxers Form with Dashboard

A complete client questionnaire system with admin dashboard, built with React, Node.js, Express, and Prisma.

## Project Structure

```
.
├── src/                    # Main frontend (React + Vite + TypeScript)
│   ├── components/        # React components including QuestionnaireForm
│   ├── pages/             # Main pages (Index, Admin, Success, NotFound)
│   └── integrations/      # Supabase integration (legacy, not used)
│
├── backend/               # Node.js + Express + Prisma backend
│   ├── src/
│   │   ├── server.js      # Express server (port 4000)
│   │   ├── routes/        # API routes
│   │   ├── controllers/   # Request handlers
│   │   ├── services/      # Business logic
│   │   └── database/      # Prisma client
│   ├── prisma/            # Database schema and migrations
│   └── dev.db             # SQLite database
│
└── backend/dashboard/     # Admin dashboard (React + Vite)
    ├── src/
    │   ├── pages/         # Login, Submissions, SubmissionDetail
    │   └── Layout.jsx     # Dashboard layout with sidebar
    └── vite.config.js     # Configured for port 3000
```

## Features

- **Multi-step Questionnaire Form**: Collects comprehensive client information across 7 steps
- **Admin Dashboard**: View, search, export, and manage submissions
- **RESTful API**: Node.js/Express backend with Prisma ORM
- **PostgreSQL Database**: Production-ready database (SQLite for local dev, PostgreSQL for production)
- **Modern UI**: Tailwind CSS with dark mode support
- **Vercel Ready**: Configured for deployment on Vercel

## Prerequisites

- Node.js (v18 or higher)
- npm

## Setup Instructions

### 1. Install Dependencies

```bash
# Root (main frontend)
npm install

# Backend
cd backend
npm install
npx prisma generate

# Dashboard
cd dashboard
npm install
```

### 2. Start All Servers

Open three terminal windows:

**Terminal 1 - Backend (port 4000):**
```bash
cd backend
npm run dev
```

**Terminal 2 - Dashboard (port 3000):**
```bash
cd backend/dashboard
npm run dev
```

**Terminal 3 - Frontend (port 5173):**
```bash
npm run dev
```

### 3. Access the Applications

- **Questionnaire Form**: http://localhost:5173
- **Admin Dashboard**: http://localhost:3000
  - Login: `admin` / `admin123`
- **Backend API**: http://localhost:4000
  - Health check: http://localhost:4000/
  - API endpoints: `/api/submit`, `/api/all`, `/api/:id`

## API Endpoints

- `POST /api/submit` - Create new submission
- `GET /api/all` - Get all submissions
- `GET /api/:id` - Get submission by ID
- `DELETE /api/:id` - Delete submission

## Database

The project uses **PostgreSQL** for production (Vercel deployment) and supports **SQLite** for local development.

### Local Development (SQLite)

For local development, the project defaults to SQLite. To use SQLite:

1. Update `backend/prisma/schema.prisma` to use SQLite:
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = "file:./dev.db"
   }
   ```

2. Run migrations:
   ```bash
   cd backend
   npx prisma migrate dev
   ```

3. View database:
   ```bash
   cd backend
   npx prisma studio
   ```

### Production (PostgreSQL)

For production/Vercel deployment, use PostgreSQL:

1. Set up a PostgreSQL database (Vercel Postgres, Supabase, etc.)
2. Set `DATABASE_URL` environment variable
3. The schema is already configured for PostgreSQL
4. Run migrations:
   ```bash
   cd backend
   export DATABASE_URL="your-postgresql-connection-string"
   npx prisma migrate deploy
   ```

## Environment Variables

### Local Development

Create a `.env` file in the `backend` directory:

```env
# For PostgreSQL (production)
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require

# For local development with SQLite (update schema.prisma to use sqlite)
# DATABASE_URL is not needed for SQLite

# CORS Origins (comma-separated)
CORS_ORIGIN=http://localhost:5173,http://localhost:3000

# Node Environment
NODE_ENV=development
```

### Frontend & Dashboard

Create `.env` files in root and `backend/dashboard` directories:

```env
# Backend API URL
VITE_API_URL=http://localhost:4000
```

For production, set these in your Vercel project settings.

## Deployment

The project is configured for **single Vercel project deployment** where:
- **Frontend** is served at the root (`/`)
- **Dashboard** is served at `/dashboard`
- **API** is served at `/api/*`

📖 **See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for complete step-by-step deployment instructions.**

📋 **Quick reference: [VERCEL_ENV_VARIABLES.txt](./VERCEL_ENV_VARIABLES.txt) - Copy/paste environment variables**

### Quick Deploy

1. ✅ PostgreSQL database already set up (Supabase)
2. Create a Vercel project and import this repository
3. Add `DATABASE_URL` environment variable (see VERCEL_ENV_VARIABLES.txt)
4. Deploy!

All three applications will be available from a single deployment URL.

## Technologies Used

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express, Prisma, PostgreSQL (production), SQLite (local dev)
- **Dashboard**: React, Vite, Tailwind CSS, Axios, React Router
- **Deployment**: Vercel (serverless functions)

## License

Private project for Evoxers.

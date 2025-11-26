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
- **SQLite Database**: Lightweight, file-based database
- **Modern UI**: Tailwind CSS with dark mode support

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

The project uses SQLite with Prisma ORM. The database file is located at `backend/dev.db`.

To run migrations:
```bash
cd backend
npx prisma migrate dev
```

To view database:
```bash
cd backend
npx prisma studio
```

## Environment Variables

Create a `.env` file in the root directory (optional, not required for local development):
```env
# Not currently used, but can be added for future Supabase integration
```

## Technologies Used

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express, Prisma, SQLite
- **Dashboard**: React, Vite, Tailwind CSS, Axios, React Router

## License

Private project for Evoxers.

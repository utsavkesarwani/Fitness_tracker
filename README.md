# Gym Fitness Tracker

This project is a full-stack gym and fitness tracking application with real MongoDB-backed workout, measurement, weekly plan, analytics, and personal record data.

## Included features

- React + Vite frontend with a dark dashboard UI
- Protected JWT authentication for login, register, and demo access
- Express.js backend with MongoDB persistence via Mongoose
- Workout tracking, history, body measurements, and planner records
- Analytics and personal records generated from stored workout data
- Deployment-ready configuration guidance for local and production environments

## Project structure

```text
gym-fitness-tracker/
├── client/
│   ├── src/
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/
│   ├── src/
│   ├── .env.example
│   └── package.json
├── .gitignore
├── PROJECT_PLAN.md
├── README.md
└── package-lock.json
```

## Start the frontend

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

## Start the backend

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

## Environment variables

Server:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=
JWT_SECRET=change-me-in-production
```

Client:

```env
VITE_API_URL=http://localhost:5000/api
```

## Health and auth checks

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000/api/health`
- Auth: `POST /api/register`, `POST /api/login`, `POST /api/demo-login`

The backend automatically uses MongoDB Atlas if `MONGODB_URI` is configured; otherwise it falls back to a temporary MongoDB in-memory instance so development can continue without a local MongoDB service.

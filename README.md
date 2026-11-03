# Gym Fitness Tracker

This project includes the Phase 1 foundation and the Phase 2 dashboard experience for a full-stack gym and fitness tracking application. It includes:

- React + Vite frontend with Tailwind CSS
- React Router-based dashboard navigation for all Phase 2 pages
- Express.js backend with health-check and dashboard overview API
- MongoDB connection setup using Mongoose
- Environment variable configuration
- Frontend/backend integration placeholders for later phases

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
└── README.md
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

## Health check

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000/api/health`

The backend automatically uses MongoDB Atlas if `MONGODB_URI` is configured; otherwise it falls back to a temporary MongoDB in-memory instance so development can continue without a local MongoDB service.

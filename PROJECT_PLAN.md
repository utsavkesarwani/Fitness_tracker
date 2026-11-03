# Personal Gym & Fitness Tracker
## Complete Development Roadmap

**Project Type:** Full-Stack Web Application  
**Frontend:** React.js + Vite + Tailwind CSS  
**Backend:** Node.js + Express.js  
**Database:** MongoDB + Mongoose  
**Charts:** Recharts  
**Icons:** Lucide React  

---

# Project Objective

Build a personal Gym & Fitness Tracker where I can manually enter my daily gym activities, exercises, sets, reps, weights, and body measurements.

The application must save all data permanently in MongoDB and automatically compare my current performance with my previous workout records.

I generally work out six days a week, with different muscle groups on different days. The application should support a flexible Monday–Sunday schedule.

# PHASE 1 — Project Setup & Architecture

## Objective
Set up the complete development environment.

## Tasks
- Create React + Vite frontend.
- Configure Tailwind CSS.
- Create Node.js + Express backend.
- Connect MongoDB using Mongoose.
- Configure environment variables.
- Create reusable folder structures.
- Set up frontend/backend communication.
- Create a backend health-check API.

## Suggested Structure

```text
gym-fitness-tracker/
├── client/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── layouts/
│       ├── services/
│       └── utils/
├── server/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── models/
│       ├── routes/
│       ├── middleware/
│       └── services/
├── docs/
│   └── PROJECT_PLAN.md
└── README.md
```

## Completion Criteria
- Frontend runs successfully.
- Backend runs successfully.
- MongoDB connection works.
- API health check works.

---

# PHASE 2 — UI Design & Dashboard

## Objective
Build a modern, professional fitness dashboard.

## Pages
1. Dashboard
2. Daily Workout
3. Workout History
4. Weekly Planner
5. Exercise Library
6. Body Measurements
7. Analytics
8. Personal Records
9. Settings

## Dashboard Features
- Today's workout status.
- Total gym sessions.
- Weekly workout completion.
- Current workout streak.
- Total exercises completed.
- Total sets and reps.
- Current body weight.
- Recent workout history.
- Weekly activity chart.
- Workout calendar.

## Design Requirements
- Modern dark theme.
- Black/charcoal background.
- Green or teal accent colors.
- Sidebar navigation.
- Responsive mobile layout.
- Clean tables and cards.
- Interactive charts.
- Lucide icons.

## Completion Criteria
All pages should be accessible and responsive, with useful empty and loading states.

---

# PHASE 3 — Daily Workout Tracker

## Objective
Build the most important feature: a table where I can manually record my daily gym exercises.

## Workout Entry Form

Allow me to:
- Select workout date.
- Add multiple exercises.
- Select muscle groups.
- Enter exercise names.
- Add multiple sets.
- Record reps and weights.
- Add rest time.
- Add workout duration.
- Write workout notes.

## Main Workout Table

| Exercise | Set | Reps | Weight (kg) | Action |
|---|---:|---:|---:|---|
| Bench Press | 1 | 12 | 20 | Edit |
| Bench Press | 2 | 10 | 25 | Edit |
| Bench Press | 3 | 8 | 30 | Edit |
| Incline DB Press | 1 | 12 | 10 | Edit |

## Exercise Categories
- Chest
- Back
- Shoulders
- Biceps
- Triceps
- Legs
- Abs
- Cardio
- Full Body

## Additional Features
- Add custom exercises.
- Edit exercises.
- Delete exercises.
- Save workouts.
- Mark workout as completed.
- Automatically calculate total sets and training volume.

## Completion Criteria
All workout entries must be saved in MongoDB and remain available after refreshing the website.

---

# PHASE 4 — Workout History & Comparison

## Objective
Automatically compare today's workout with previous sessions.

## Features

Whenever I perform an exercise again, display:
- Previous workout date.
- Previous weight.
- Previous reps.
- Previous number of sets.
- Current weight.
- Current reps.
- Performance improvement or decline.

## Example: Bench Press Comparison

| Metric | Previous | Today |
|---|---:|---:|
| Weight | 25 kg | 30 kg |
| Reps | 10 | 8 |
| Sets | 3 | 3 |

Show a meaningful comparison rather than simply declaring improvement based on weight alone.

## Workout History
- View all previous workouts.
- Filter by date.
- Search by exercise.
- Filter by muscle group.
- Edit or delete historical records.
- View exercise-specific progress charts.

## Completion Criteria
The system must fetch the actual previous workout for the same exercise from MongoDB.

---

# PHASE 5 — Weekly Planner & Body Measurements

## Objective
Track workout schedules and physical fitness measurements.

## Weekly Planner
- Display Monday through Sunday.
- Assign exercises to each day.
- Assign muscle groups.
- Set workout plans.
- Mark planned workouts as completed.
- Compare planned versus completed sessions.
- Edit weekly schedules.

Support six workout days per week without forcing a fixed rest day.

## Body Measurements

Allow me to record:
- Body weight (kg).
- Height (cm).
- BMI (automatically calculated).
- Chest measurement.
- Waist measurement.
- Hip measurement.
- Biceps measurement.
- Thigh measurement.
- Body fat percentage (optional).
- Resting heart rate (optional).

## Progress Charts
- Weight progression.
- Measurement changes.
- Weekly workout consistency.
- Monthly progress.

## Completion Criteria
All measurements and workout plans must be saved permanently.

---

# PHASE 6 — Fitness Analytics & Personal Records

## Objective
Understand my fitness progress through actual recorded data.

## Analytics Dashboard
- Weekly workout statistics.
- Monthly workout statistics.
- Total sets and reps.
- Training volume.
- Muscle group frequency.
- Exercise-wise progress.
- Workout consistency.
- Current and longest streak.

## Personal Records
- Maximum bench press.
- Maximum squat.
- Maximum deadlift.
- Maximum weight for each exercise.
- Highest reps.
- Best recorded session volume.

## Progress Intelligence

Generate insights based on actual workout history.

Examples:
- Bench Press increased from 25 kg to 30 kg.
- You completed 4 workouts this week.
- Your recorded weight changed by 1 kg this month.
- Your workout consistency is 85%.

Never generate fake statistics or unsupported health claims.

## Completion Criteria
All analytics must be calculated from real MongoDB records.

---

# PHASE 7 — Backend Integration, Authentication & Deployment

## Objective
Complete and test the entire application.

## Backend APIs

Create REST APIs for:
- User authentication.
- Workout management.
- Exercise management.
- Weekly workout plans.
- Body measurements.
- Workout history.
- Analytics.
- Personal records.

## Authentication
- JWT authentication.
- Protected routes.
- Secure password hashing.
- User-specific data.
- Environment-based secrets.

## Testing

Test:
- Add workout.
- Edit workout.
- Delete workout.
- Add multiple exercises.
- Add multiple sets.
- Save workout history.
- Compare previous workouts.
- Update body measurements.
- Calculate BMI.
- Generate analytics.
- Test mobile responsiveness.

## Deployment
Prepare the application for:
- MongoDB Atlas.
- Frontend hosting.
- Backend hosting.
- Production environment variables.

## Final Completion Criteria
- Every form must work.
- Every button must work.
- Data must persist in MongoDB.
- Previous workout comparisons must work.
- Analytics must use actual records.
- Application must be responsive.
- No fake charts or hardcoded statistics.
- No broken navigation.

---

# IMPORTANT DEVELOPMENT INSTRUCTIONS FOR AI

Act as a senior full-stack developer.

Follow these rules throughout development:

1. Read this entire `PROJECT_PLAN.md` before starting.
2. Implement only one phase at a time.
3. Do not skip phases.
4. Do not start the next phase without my approval.
5. Inspect existing code before modifying it.
6. Use reusable components and clean architecture.
7. Never use fake data as actual user records.
8. Connect frontend features to real backend APIs.
9. Test every important feature before completing a phase.
10. Update the project documentation after every phase.

After completing each phase, provide:
- What you implemented.
- Files created or modified.
- Features completed.
- How to test the features.
- Any remaining issues.

**Start with PHASE 1 only. Wait for my approval before proceeding to PHASE 2.**

# FINAL GOAL

Build a complete personal fitness management system that I can use every day at the gym.

I should be able to enter my exercises, sets, reps, and weights, and the website should remember everything, compare previous sessions, and help me understand my fitness progress over time.

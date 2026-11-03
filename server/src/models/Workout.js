import mongoose from 'mongoose';

const exerciseSetSchema = new mongoose.Schema(
  {
    setNumber: { type: Number, required: true },
    reps: { type: Number, required: true },
    weight: { type: Number, required: true },
    restTime: { type: Number, default: 0 },
  },
  { _id: false },
);

const workoutExerciseSchema = new mongoose.Schema(
  {
    exerciseName: { type: String, required: true, trim: true },
    muscleGroup: { type: String, required: true, trim: true },
    sets: { type: [exerciseSetSchema], default: [] },
  },
  { _id: false },
);

const workoutSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    notes: { type: String, default: '' },
    durationMinutes: { type: Number, default: 45 },
    restTimeSeconds: { type: Number, default: 90 },
    completed: { type: Boolean, default: false },
    exercises: { type: [workoutExerciseSchema], default: [] },
    totalSets: { type: Number, default: 0 },
    totalVolume: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const Workout = mongoose.model('Workout', workoutSchema);

export default Workout;

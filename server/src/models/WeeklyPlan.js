import mongoose from 'mongoose';

const weeklyPlanSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    day: {
      type: String,
      required: true,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    focus: { type: String, default: 'Recovery / Mobility' },
    status: { type: String, enum: ['Planned', 'Completed', 'Rest'], default: 'Planned' },
    notes: { type: String, default: '' },
  },
  { timestamps: true },
);

weeklyPlanSchema.index({ userId: 1, day: 1 }, { unique: true });

const WeeklyPlan = mongoose.model('WeeklyPlan', weeklyPlanSchema);

export default WeeklyPlan;

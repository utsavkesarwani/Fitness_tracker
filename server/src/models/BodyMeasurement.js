import mongoose from 'mongoose';

const bodyMeasurementSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true, default: Date.now },
    weight: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    chest: { type: Number, default: 0 },
    waist: { type: Number, default: 0 },
    hips: { type: Number, default: 0 },
    biceps: { type: Number, default: 0 },
    thigh: { type: Number, default: 0 },
    bodyFatPercent: { type: Number, default: 0 },
    restingHeartRate: { type: Number, default: 0 },
    bmi: { type: Number, default: 0 },
  },
  { timestamps: true },
);

bodyMeasurementSchema.pre('validate', function normalizeBmi(next) {
  const weight = Number(this.weight || 0);
  const height = Number(this.height || 0);

  if (weight > 0 && height > 0) {
    this.bmi = Number((weight / ((height / 100) ** 2)).toFixed(1));
  } else {
    this.bmi = 0;
  }

  next();
});

const BodyMeasurement = mongoose.model('BodyMeasurement', bodyMeasurementSchema);

export default BodyMeasurement;

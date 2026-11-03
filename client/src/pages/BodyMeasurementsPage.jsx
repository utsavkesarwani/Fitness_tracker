const measurements = [
  { name: 'Body weight', value: '78.4 kg' },
  { name: 'Height', value: '182 cm' },
  { name: 'BMI', value: '23.6' },
  { name: 'Chest', value: '104 cm' },
  { name: 'Waist', value: '86 cm' },
  { name: 'Hips', value: '96 cm' },
  { name: 'Biceps', value: '36 cm' },
  { name: 'Thigh', value: '58 cm' },
];

function BodyMeasurementsPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Progress</p>
            <h2 className="text-2xl font-semibold text-white">Body measurements</h2>
          </div>
          <button className="rounded-xl bg-teal-500 px-4 py-2 font-medium text-slate-950">Add entry</button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {measurements.map((metric) => (
          <div key={metric.name} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-sm text-slate-400">{metric.name}</p>
            <p className="mt-3 text-2xl font-semibold text-white">{metric.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BodyMeasurementsPage;

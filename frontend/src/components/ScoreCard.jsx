import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

export default function ScoreCard({ label, value, color = '#3B82F6', size = 140 }) {
  const data = [{ name: label, value, fill: color }];
  return (
    <div className="card flex flex-col items-center p-5">
      <div className="relative" style={{ height: size, width: size }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            innerRadius="72%"
            outerRadius="100%"
            data={data}
            startAngle={90}
            endAngle={90 - 360}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <RadialBar background={{ fill: 'rgba(255,255,255,0.06)' }} dataKey="value" cornerRadius={16} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 grid place-items-center">
          <span className="text-xl font-bold text-white">{value}</span>
        </div>
      </div>
      <p className="mt-3 text-sm font-medium text-slate-300">{label}</p>
    </div>
  );
}

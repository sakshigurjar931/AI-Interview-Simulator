import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

export default function ProgressCard({ score = 78, skills = [] }) {
  const data = [{ name: 'score', value: score, fill: '#3B82F6' }];
  return (
    <div className="card p-6 lg:col-span-1">
      <h3 className="text-lg font-semibold text-white">Your Progress</h3>
      <p className="mt-1 text-sm text-slate-400">Track your growth and see how far you've come.</p>

      <div className="relative mx-auto mt-6 h-44 w-44">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            innerRadius="70%"
            outerRadius="100%"
            data={data}
            startAngle={90}
            endAngle={90 - 360}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <RadialBar background={{ fill: 'rgba(255,255,255,0.06)' }} dataKey="value" cornerRadius={20} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-center">
            <p className="text-3xl font-bold text-white">{score}%</p>
            <p className="text-xs text-slate-400">Overall Score</p>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {skills.map((s) => (
          <SkillBarInline key={s.label} {...s} />
        ))}
      </div>
    </div>
  );
}

function SkillBarInline({ label, value, color }) {
  const colors = {
    blue: 'from-blue-500 to-blue-400',
    cyan: 'from-cyan-500 to-cyan-400',
    violet: 'from-violet-500 to-violet-400',
    emerald: 'from-emerald-500 to-emerald-400',
  };
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-300">{label}</span>
        <span className="font-semibold text-white">{value}%</span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/5">
        <div className={`h-full rounded-full bg-gradient-to-r ${colors[color]}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

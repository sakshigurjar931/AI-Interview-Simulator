export default function SkillBar({ label, value, color = 'blue' }) {
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
        <div
          className={`h-full rounded-full bg-gradient-to-r ${colors[color]} transition-all duration-700`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

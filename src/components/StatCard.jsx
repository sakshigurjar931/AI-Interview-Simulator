export default function StatCard({ icon: Icon, label, value, accent = 'blue' }) {
  const accents = {
    blue: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
    cyan: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
    violet: 'text-violet-400 border-violet-500/30 bg-violet-500/10',
    emerald: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  };
  return (
    <div className="card card-hover p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-400">{label}</span>
        <span className={`grid h-10 w-10 place-items-center rounded-xl border ${accents[accent]}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-4 text-3xl font-bold text-white">{value}</p>
    </div>
  );
}

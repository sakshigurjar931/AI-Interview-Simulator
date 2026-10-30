export default function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="card card-hover group p-6">
      <div className="grid h-12 w-12 place-items-center rounded-xl border border-blue-500/30 bg-blue-500/10">
        <Icon className="h-6 w-6 text-blue-400" />
      </div>
      <h3 className="mt-5 text-base font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">{description}</p>
    </div>
  );
}

import Button from './Button';

export default function RoleCard({ role, onStart }) {
  const Icon = role.icon;
  return (
    <div className="card card-hover flex flex-col p-6">
      <div className="flex items-center gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-xl border border-blue-500/30 bg-blue-500/10">
          <Icon className="h-6 w-6 text-blue-400" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-white">{role.name}</h3>
          <span className="mt-1 inline-block rounded-full border border-blue-500/25 bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-300">
            {role.difficulty}
          </span>
        </div>
      </div>
      <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-400">{role.description}</p>
      <Button onClick={onStart} className="mt-5 w-full py-2.5 text-sm">
        Start Interview
      </Button>
    </div>
  );
}

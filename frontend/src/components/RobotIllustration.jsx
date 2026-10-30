import { Sparkles, TrendingUp } from 'lucide-react';

export default function RobotIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div
        className="pointer-events-none absolute inset-0 -z-10 rounded-full opacity-50 blur-3xl"
        style={{
          background:
            'radial-gradient(20rem 20rem at 50% 40%, rgba(59,130,246,0.25), transparent 70%)',
        }}
      />
      <svg viewBox="0 0 400 400" className="w-full" role="img" aria-label="AI interview assistant robot">
        <defs>
          <linearGradient id="body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F8FAFC" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </linearGradient>
          <linearGradient id="screen" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1E3A8A" />
            <stop offset="100%" stopColor="#0EA5E9" />
          </linearGradient>
          <radialGradient id="eye" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22D3EE" />
            <stop offset="100%" stopColor="#3B82F6" />
          </radialGradient>
        </defs>

        {/* laptop */}
        <rect x="120" y="280" width="160" height="80" rx="10" fill="#1E293B" stroke="#3B82F6" strokeWidth="2" />
        <rect x="135" y="295" width="130" height="55" rx="6" fill="url(#screen)" />
        <rect x="100" y="358" width="200" height="14" rx="7" fill="#334155" />

        {/* robot body */}
        <rect x="150" y="180" width="100" height="110" rx="22" fill="url(#body)" stroke="#94A3B8" strokeWidth="1.5" />
        <circle cx="200" cy="220" r="10" fill="#22D3EE" opacity="0.85" />
        <circle cx="200" cy="245" r="6" fill="#3B82F6" opacity="0.7" />

        {/* arms */}
        <rect x="120" y="200" width="30" height="70" rx="14" fill="url(#body)" stroke="#94A3B8" strokeWidth="1.5" />
        <rect x="250" y="200" width="30" height="70" rx="14" fill="url(#body)" stroke="#94A3B8" strokeWidth="1.5" />

        {/* head */}
        <rect x="160" y="90" width="80" height="80" rx="24" fill="url(#body)" stroke="#94A3B8" strokeWidth="1.5" />
        <rect x="175" y="110" width="50" height="30" rx="10" fill="#0F172A" />
        <circle cx="188" cy="125" r="6" fill="url(#eye)" />
        <circle cx="212" cy="125" r="6" fill="url(#eye)" />
        {/* antenna */}
        <line x1="200" y1="90" x2="200" y2="72" stroke="#94A3B8" strokeWidth="3" />
        <circle cx="200" cy="68" r="6" fill="#22D3EE" />

        {/* neck */}
        <rect x="190" y="170" width="20" height="14" fill="#CBD5E1" />
      </svg>

      <div className="absolute left-0 top-6 animate-float rounded-xl border border-blue-500/25 bg-[#061432]/90 px-3 py-2 text-xs font-medium text-white shadow-glow backdrop-blur">
        <span className="inline-flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
          Great Answer!
        </span>
      </div>
      <div
        className="absolute right-0 top-1/3 animate-float rounded-xl border border-violet-500/25 bg-[#061432]/90 px-3 py-2 text-xs font-medium text-white shadow-glow backdrop-blur"
        style={{ animationDelay: '1.5s' }}
      >
        <span className="inline-flex items-center gap-1.5">
          <TrendingUp className="h-3.5 w-3.5 text-violet-400" />
          Improve Your Skills
        </span>
      </div>
    </div>
  );
}

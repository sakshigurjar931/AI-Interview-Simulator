import Button from './Button';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export default function CTASection() {
  const navigate = useNavigate();
  return (
    <section className="container-app py-20">
      <div className="relative overflow-hidden rounded-3xl border border-blue-500/25 bg-[#061432] px-6 py-16 text-center sm:px-12">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              'radial-gradient(40rem 30rem at 50% 0%, rgba(59,130,246,0.18), transparent 60%), radial-gradient(30rem 20rem at 80% 100%, rgba(124,58,237,0.15), transparent 60%)',
          }}
        />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300">
            <Sparkles className="h-3.5 w-3.5" />
            Start Today
          </span>
          <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to improve your interview skills?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-slate-400 sm:text-base">
            Build confidence, practice smarter, and prepare for your next interview with AI.
          </p>
          <Button onClick={() => navigate('/roles')} className="mt-8 px-7 py-3.5">
            Start Practicing
          </Button>
        </div>
      </div>
    </section>
  );
}

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertCircle, RotateCcw, Lightbulb } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScoreCard from '../components/ScoreCard';
import SkillBar from '../components/SkillBar';
import Button from '../components/Button';
import { getLastResult } from '../utils/storage';

export default function Results() {
  const navigate = useNavigate();
  const result = getLastResult();

  useEffect(() => {
    if (!result) navigate('/roles');
  }, [result, navigate]);

  if (!result) return null;

  const scores = result.scores;
  const scoreCards = [
    { label: 'Overall Score', value: scores.overall, color: '#3B82F6' },
    { label: 'Technical', value: scores.technical, color: '#22D3EE' },
    { label: 'Communication', value: scores.communication, color: '#7C3AED' },
    { label: 'Confidence', value: scores.confidence, color: '#10B981' },
    { label: 'Relevance', value: scores.relevance, color: '#F59E0B' },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container-app py-10">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-blue-400">
            {result.role}
          </span>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Interview Results
          </h1>
          <p className="mt-3 text-slate-400">
            Here's a detailed breakdown of your performance.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {scoreCards.map((s) => (
            <ScoreCard key={s.label} {...s} />
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="card p-6">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              <h3 className="text-lg font-semibold text-white">What You Did Well</h3>
            </div>
            <ul className="mt-4 space-y-3">
              {result.feedback.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-400" />
              <h3 className="text-lg font-semibold text-white">What You Can Improve</h3>
            </div>
            <ul className="mt-4 space-y-3">
              {result.feedback.improvements.map((s, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 card p-6">
          <h3 className="text-lg font-semibold text-white">Skill Gap Analysis</h3>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {result.skillGaps.map((g, i) => {
              const colors = ['blue', 'cyan', 'violet', 'emerald', 'blue'];
              return <SkillBar key={g.skill} label={g.skill} value={g.score} color={colors[i % colors.length]} />;
            })}
          </div>
        </div>

        <div className="mt-8 card p-6">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-violet-400" />
            <h3 className="text-lg font-semibold text-white">Personalized Recommendations</h3>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {result.recommendations.map((r, i) => (
              <div key={i} className="rounded-xl border border-blue-500/15 bg-white/5 p-4 text-sm text-slate-300">
                {r}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button onClick={() => navigate('/roles')} className="px-7 py-3.5">
            <RotateCcw className="h-4 w-4" />
            Practice Again
          </Button>
          <Button to="/dashboard" variant="ghost" className="px-7 py-3.5">
            Back to Dashboard
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}

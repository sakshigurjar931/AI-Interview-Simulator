import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Trophy, Target, ChartColumn, TrendingUp, ArrowRight, History, Lightbulb } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StatCard from '../components/StatCard';
import ProgressCard from '../components/ProgressCard';
import { getAuthUser, getInterviewHistory } from '../utils/storage';

export default function Dashboard() {
  const navigate = useNavigate();
  const user = getAuthUser();
  const history = getInterviewHistory();

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  if (!user) return null;

  const total = history.length;
  const avg = total ? Math.round(history.reduce((a, h) => a + h.score, 0) / total) : 0;
  const best = total ? Math.max(...history.map((h) => h.score)) : 0;

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 18) return 'Good Afternoon';
    return 'Good Evening';
  })();

  const stats = [
    { icon: Target, label: 'Total Interviews', value: total, accent: 'blue' },
    { icon: ChartColumn, label: 'Average Score', value: `${avg}%`, accent: 'cyan' },
    { icon: Trophy, label: 'Best Score', value: `${best}%`, accent: 'violet' },
    { icon: TrendingUp, label: 'Skills Improved', value: '5', accent: 'emerald' },
  ];

  const skills = [
    { label: 'DSA', value: 80, color: 'blue' },
    { label: 'OOP', value: 90, color: 'cyan' },
    { label: 'DBMS', value: 60, color: 'violet' },
    { label: 'Operating Systems', value: 70, color: 'emerald' },
    { label: 'Communication', value: 70, color: 'blue' },
  ];

  const recommendations = [
    'Practice DSA arrays and two-pointer problems.',
    'Revise OOP concepts: encapsulation, inheritance, polymorphism.',
    'Practice behavioral questions using the STAR method.',
    'Improve communication structure and clarity.',
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container-app py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              {greeting}, {user.name}
            </h1>
            <p className="mt-1 text-sm text-slate-400">Ready to improve your interview skills?</p>
          </div>
          <button onClick={() => navigate('/roles')} className="btn-primary px-6 py-3">
            <Plus className="h-4 w-4" />
            Start New Interview
          </button>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <ProgressCard score={avg || 78} skills={skills} />

          <div className="card p-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Recent Interviews</h3>
              <Link to="/history" className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-400 hover:text-blue-300">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            {history.length === 0 ? (
              <div className="mt-6 rounded-xl border border-dashed border-blue-500/20 p-8 text-center">
                <History className="mx-auto h-8 w-8 text-slate-500" />
                <p className="mt-3 text-sm text-slate-400">No interviews yet. Start your first one!</p>
                <button onClick={() => navigate('/roles')} className="btn-ghost mt-4 py-2.5 text-sm">
                  Choose a Role
                </button>
              </div>
            ) : (
              <div className="mt-5 space-y-3">
                {history.slice(0, 4).map((h) => (
                  <div key={h.id} className="flex items-center justify-between rounded-xl border border-blue-500/15 bg-white/5 p-4">
                    <div>
                      <p className="text-sm font-semibold text-white">{h.role}</p>
                      <p className="text-xs text-slate-400">{h.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-white">{h.score}%</p>
                      <p className="text-xs text-slate-400">{h.performance}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 card p-6">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-violet-400" />
            <h3 className="text-lg font-semibold text-white">Recommended Actions</h3>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recommendations.map((r, i) => (
              <div key={i} className="rounded-xl border border-blue-500/15 bg-white/5 p-4">
                <span className="grid h-8 w-8 place-items-center rounded-lg border border-violet-500/30 bg-violet-500/10 text-sm font-bold text-violet-300">
                  {i + 1}
                </span>
                <p className="mt-3 text-sm text-slate-300">{r}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

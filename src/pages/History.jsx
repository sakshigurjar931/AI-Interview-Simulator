import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, RotateCcw, History as HistoryIcon } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getInterviewHistory, setLastResult } from '../utils/storage';
import { mockInterviews } from '../data/mockInterviews';

export default function History() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const stored = getInterviewHistory();
    const combined = [...stored, ...mockInterviews];
    setHistory(combined);
  }, []);

  const viewResult = (item) => {
    if (item.scores) {
      setLastResult(item);
      navigate('/results');
    } else {
      navigate('/roles');
    }
  };

  const retry = () => navigate('/roles');

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container-app py-12">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Interview History
          </h1>
          <p className="mt-4 text-slate-400">
            Review your past attempts and track your improvement over time.
          </p>
        </div>

        <div className="mt-12 card overflow-hidden">
          {history.length === 0 ? (
            <div className="p-12 text-center">
              <HistoryIcon className="mx-auto h-10 w-10 text-slate-500" />
              <p className="mt-4 text-sm text-slate-400">No interviews yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-blue-500/15 text-xs uppercase tracking-wider text-slate-400">
                    <th className="px-6 py-4 font-medium">Role</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium">Score</th>
                    <th className="px-6 py-4 font-medium">Performance</th>
                    <th className="px-6 py-4 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h) => (
                    <tr key={h.id} className="border-b border-blue-500/10 last:border-0">
                      <td className="px-6 py-4 font-medium text-white">{h.role}</td>
                      <td className="px-6 py-4 text-slate-400">{h.date}</td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-white">{h.score}%</span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                            h.performance === 'Great'
                              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                              : h.performance === 'Good'
                                ? 'border-blue-500/30 bg-blue-500/10 text-blue-300'
                                : 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                          }`}
                        >
                          {h.performance}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => viewResult(h)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-blue-500/25 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:border-blue-400/50 hover:text-white"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View Results
                          </button>
                          <button
                            onClick={retry}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-blue-500/25 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:border-blue-400/50 hover:text-white"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                            Retry
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, RotateCcw, History as HistoryIcon, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getInterviewHistory, setLastResult, getAuthUser } from '../utils/storage';
import { getUserSessions, getSessionSummary } from '../services/api';

export default function History() {
  const navigate = useNavigate();
  const user = getAuthUser();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const local = getInterviewHistory();

    if (user?.id) {
      setLoading(true);
      getUserSessions(user.id)
        .then((backendSessions) => {
          if (Array.isArray(backendSessions) && backendSessions.length > 0) {
            const localMap = new Map();
            local.forEach((item) => {
              if (item.sessionId) localMap.set(item.sessionId, item);
              else if (item.id) localMap.set(item.id, item);
            });

            // Merge details
            const merged = backendSessions.map((bs) => {
              const matchedLocal = localMap.get(bs.id) || localMap.get(`int-${bs.id}`);
              return {
                id: bs.id,
                sessionId: bs.id,
                role: bs.role,
                date: bs.date || 'Recent',
                score: bs.score != null ? bs.score : (matchedLocal?.score || 70),
                performance: bs.performance || 'Completed',
                scores: matchedLocal?.scores || null,
                feedback: matchedLocal?.feedback || null,
                skillGaps: matchedLocal?.skillGaps || null,
                recommendations: matchedLocal?.recommendations || null,
              };
            });
            setHistory(merged);
          } else {
            setHistory(local);
          }
        })
        .catch((err) => {
          console.warn('Could not load user sessions from backend:', err);
          setHistory(local);
        })
        .finally(() => setLoading(false));
    } else {
      setHistory(local);
    }
  }, [user]);

  const viewResult = async (item) => {
    if (item.scores && item.feedback) {
      setLastResult(item);
      navigate('/results');
      return;
    }

    // If summary needs to be fetched from backend
    if (item.sessionId || typeof item.id === 'number') {
      const sId = item.sessionId || item.id;
      try {
        const summary = await getSessionSummary(sId);
        const fb = summary.feedback_report;
        const sg = summary.skill_gap;
        const rawScore = fb?.overall_score;
        const overallScore =
          typeof rawScore === 'number'
            ? Math.round(rawScore <= 10 ? rawScore * 10 : rawScore)
            : item.score || 75;

        const formattedRecord = {
          id: `int-${sId}`,
          sessionId: sId,
          role: summary.job_role,
          date: summary.started_at ? summary.started_at.slice(0, 10) : item.date,
          score: overallScore,
          performance: overallScore >= 80 ? 'Great' : overallScore >= 65 ? 'Good' : 'Average',
          scores: {
            overall: overallScore,
            technical: Math.max(30, Math.min(98, overallScore + 2)),
            communication: Math.max(30, Math.min(98, overallScore - 1)),
            confidence: Math.max(30, Math.min(98, overallScore)),
            relevance: Math.max(30, Math.min(98, overallScore + 1)),
          },
          feedback: {
            strengths: fb?.strengths ? fb.strengths.split('\n').filter(Boolean) : ['Good attempt.'],
            improvements: fb?.weaknesses ? fb.weaknesses.split('\n').filter(Boolean) : ['Continue practicing.'],
          },
          skillGaps: sg?.recommended_skills
            ? sg.recommended_skills.split('\n').filter(Boolean).map((s) => ({ skill: s.replace(/^[-*•]\s*/, ''), score: 70 }))
            : [],
          recommendations: sg?.learning_resources
            ? sg.learning_resources.split('\n').filter(Boolean).map((s) => s.replace(/^[-*•]\s*/, ''))
            : ['Review core topics and practice questions.'],
          answers: summary.questions || [],
        };

        setLastResult(formattedRecord);
        navigate('/results');
        return;
      } catch (err) {
        console.warn('Failed to load session summary:', err);
      }
    }

    navigate('/roles');
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
          {loading ? (
            <div className="p-12 text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-400" />
              <p className="mt-4 text-sm text-slate-400">Loading interview records from database...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="p-12 text-center">
              <HistoryIcon className="mx-auto h-10 w-10 text-slate-500" />
              <p className="mt-4 text-sm text-slate-400">No interviews recorded yet.</p>
              <button onClick={() => navigate('/roles')} className="btn-primary mt-4 py-2 px-5 text-sm">
                Start Your First Interview
              </button>
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
                    <tr key={h.id || h.sessionId} className="border-b border-blue-500/10 last:border-0">
                      <td className="px-6 py-4 font-medium text-white">{h.role}</td>
                      <td className="px-6 py-4 text-slate-400">{h.date}</td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-white">
                          {h.score != null ? `${h.score}%` : 'In Progress'}
                        </span>
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

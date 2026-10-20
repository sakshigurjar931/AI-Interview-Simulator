import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Target, Save, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import { getAuthUser, setAuthUser, getInterviewHistory } from '../utils/storage';
import { roles } from '../data/roles';

export default function Profile() {
  const navigate = useNavigate();
  const user = getAuthUser();
  const history = getInterviewHistory();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', targetRole: '' });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    setForm({
      name: user.name || '',
      email: user.email || '',
      targetRole: user.targetRole || 'Software Engineer',
    });
  }, [user, navigate]);

  if (!user) return null;

  const total = history.length;
  const avg = total ? Math.round(history.reduce((a, h) => a + h.score, 0) / total) : 0;

  const handleSave = () => {
    const updated = { ...user, ...form };
    setAuthUser(updated);
    const users = JSON.parse(localStorage.getItem('ais_users') || '[]');
    const idx = users.findIndex((u) => u.email === user.email);
    if (idx >= 0) {
      users[idx] = { ...users[idx], ...form };
      localStorage.setItem('ais_users', JSON.stringify(users));
    }
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const initials = (form.name || 'U')
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container-app py-12">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Profile</h1>
        <p className="mt-2 text-slate-400">Manage your account and view your stats.</p>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <div className="card p-6 text-center">
            <div className="mx-auto grid h-24 w-24 place-items-center rounded-full border border-blue-500/30 bg-gradient-to-br from-blue-500/20 to-violet-500/20 text-2xl font-bold text-white">
              {initials}
            </div>
            <h2 className="mt-4 text-xl font-semibold text-white">{form.name}</h2>
            <p className="text-sm text-slate-400">{form.email}</p>
            <span className="mt-3 inline-block rounded-full border border-blue-500/25 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300">
              {form.targetRole}
            </span>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-blue-500/15 bg-white/5 p-4">
                <p className="text-2xl font-bold text-white">{total}</p>
                <p className="text-xs text-slate-400">Interviews</p>
              </div>
              <div className="rounded-xl border border-blue-500/15 bg-white/5 p-4">
                <p className="text-2xl font-bold text-white">{avg}%</p>
                <p className="text-xs text-slate-400">Avg Score</p>
              </div>
            </div>
          </div>

          <div className="card p-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Account Information</h3>
              {!editing && (
                <button onClick={() => setEditing(true)} className="btn-ghost py-2 px-4 text-sm">
                  Edit
                </button>
              )}
            </div>

            {saved && (
              <p className="mt-4 inline-flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
                <CheckCircle2 className="h-4 w-4" />
                Profile updated successfully.
              </p>
            )}

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">Full Name</label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    disabled={!editing}
                    className="input-field pl-10 disabled:opacity-60"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">Email</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    disabled={!editing}
                    className="input-field pl-10 disabled:opacity-60"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">Target Role</label>
                <div className="relative">
                  <Target className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <select
                    value={form.targetRole}
                    onChange={(e) => setForm((f) => ({ ...f, targetRole: e.target.value }))}
                    disabled={!editing}
                    className="input-field pl-10 disabled:opacity-60"
                  >
                    {roles.map((r) => (
                      <option key={r.id} value={r.name} className="bg-[#081A3A]">
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {editing && (
              <div className="mt-6 flex gap-3">
                <Button onClick={handleSave} className="px-6 py-2.5 text-sm">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
                <button onClick={() => setEditing(false)} className="btn-ghost px-6 py-2.5 text-sm">
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

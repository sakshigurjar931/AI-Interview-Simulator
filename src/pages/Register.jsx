import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BrainCircuit, User, Mail, Lock, ArrowRight } from 'lucide-react';
import { setAuthUser } from '../utils/storage';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    const stored = JSON.parse(localStorage.getItem('ais_users') || '[]');
    if (stored.some((u) => u.email === form.email)) {
      setError('An account with this email already exists.');
      return;
    }
    const user = { name: form.name, email: form.email, password: form.password, targetRole: 'Software Engineer' };
    stored.push(user);
    localStorage.setItem('ais_users', JSON.stringify(stored));
    setAuthUser({ name: user.name, email: user.email, targetRole: user.targetRole });
    navigate('/dashboard');
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-12">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-60"
        style={{
          background:
            'radial-gradient(40rem 30rem at 50% 0%, rgba(124,58,237,0.15), transparent 60%), radial-gradient(30rem 25rem at 20% 100%, rgba(59,130,246,0.12), transparent 60%)',
        }}
      />
      <div className="w-full max-w-md animate-fade-up">
        <div className="mb-6 flex items-center justify-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-xl border border-blue-500/30 bg-blue-500/10">
            <BrainCircuit className="h-5 w-5 text-blue-400" />
          </span>
          <span className="text-lg font-semibold text-white">AI Interview Simulator</span>
        </div>

        <div className="card p-8">
          <h1 className="text-2xl font-bold text-white">Create Your Account</h1>
          <p className="mt-1.5 text-sm text-slate-400">Start practicing smarter in under a minute.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-300">Full Name</label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input id="name" value={form.name} onChange={update('name')} placeholder="Your Name" className="input-field pl-10" />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-300">Email</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input id="email" type="email" value={form.email} onChange={update('email')} placeholder="you@example.com" className="input-field pl-10" autoComplete="email" />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-300">Password</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input id="password" type="password" value={form.password} onChange={update('password')} placeholder="••••••••" className="input-field pl-10" autoComplete="new-password" />
              </div>
            </div>
            <div>
              <label htmlFor="confirm" className="mb-1.5 block text-sm font-medium text-slate-300">Confirm Password</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input id="confirm" type="password" value={form.confirm} onChange={update('confirm')} placeholder="••••••••" className="input-field pl-10" autoComplete="new-password" />
              </div>
            </div>

            {error && <p className="text-sm text-rose-400">{error}</p>}

            <button type="submit" className="btn-primary w-full py-3">
              Create Account
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-400 hover:text-blue-300">Login</Link>
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-slate-400">
          <Link to="/" className="font-medium text-slate-300 hover:text-white">← Back to Home</Link>
        </p>
      </div>
    </div>
  );
}

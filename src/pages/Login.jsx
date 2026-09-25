import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BrainCircuit, Mail, Lock, ArrowRight } from 'lucide-react';
import { setAuthUser } from '../utils/storage';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    const stored = JSON.parse(localStorage.getItem('ais_users') || '[]');
    const user = stored.find((u) => u.email === email && u.password === password);
    const profile = user || { name: email.split('@')[0], email, targetRole: 'Software Engineer' };
    setAuthUser(profile);
    navigate('/dashboard');
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-12">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-60"
        style={{
          background:
            'radial-gradient(40rem 30rem at 50% 0%, rgba(59,130,246,0.15), transparent 60%), radial-gradient(30rem 25rem at 80% 100%, rgba(124,58,237,0.12), transparent 60%)',
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
          <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
          <p className="mt-1.5 text-sm text-slate-400">Log in to continue your interview practice.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-300">
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-field pl-10"
                  autoComplete="email"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-300">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-10"
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error && <p className="text-sm text-rose-400">{error}</p>}

            <button type="submit" className="btn-primary w-full py-3">
              Login
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-5 flex items-center justify-between text-sm">
            <a href="#" className="text-slate-400 hover:text-white">Forgot Password?</a>
            <Link to="/register" className="font-medium text-blue-400 hover:text-blue-300">
              Create Account
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-slate-400">
          <Link to="/" className="font-medium text-slate-300 hover:text-white">← Back to Home</Link>
        </p>
      </div>
    </div>
  );
}

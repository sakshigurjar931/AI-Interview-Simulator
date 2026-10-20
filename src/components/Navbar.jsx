import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { BrainCircuit, Menu, X, LogOut } from 'lucide-react';
import { getAuthUser, clearAuthUser } from '../utils/storage';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'How It Works', to: '/#how-it-works' },
  { label: 'Features', to: '/#features' },
  { label: 'About', to: '/#about' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const user = getAuthUser();

  const handleLogout = () => {
    clearAuthUser();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-blue-500/15 bg-[#020B24]/80 backdrop-blur-md">
      <nav className="container-app flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl border border-blue-500/30 bg-blue-500/10">
            <BrainCircuit className="h-5 w-5 text-blue-400" />
          </span>
          <span className="text-base font-semibold tracking-tight text-white">
            AI Interview Simulator
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `text-sm font-medium transition hover:text-white ${
                  isActive ? 'text-white' : 'text-slate-400'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="text-sm font-medium text-slate-300 transition hover:text-white"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 rounded-xl border border-blue-500/30 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-blue-400/50 hover:text-white"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-slate-300 transition hover:text-white"
              >
                Login
              </Link>
              <Link to="/register" className="btn-primary px-5 py-2.5 text-sm">
                Get Started
              </Link>
            </>
          )}
        </div>

        <button
          className="rounded-lg border border-blue-500/20 p-2 text-slate-200 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-blue-500/15 bg-[#020B24]/95 px-5 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-slate-300 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
            <div className="my-2 h-px bg-blue-500/15" />
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setOpen(false)} className="text-sm font-medium text-slate-200">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="text-left text-sm font-medium text-slate-200">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="text-sm font-medium text-slate-200">
                  Login
                </Link>
                <Link to="/register" onClick={() => setOpen(false)} className="btn-primary w-fit px-5 py-2.5 text-sm">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

import { Link } from 'react-router-dom';
import { BrainCircuit, Github, Linkedin, Twitter, Mail } from 'lucide-react';

const links = ['Home', 'About', 'Features', 'Contact', 'Privacy'];

export default function Footer() {
  return (
    <footer className="border-t border-blue-500/15 bg-[#020B24]">
      <div className="container-app py-12">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <Link to="/" className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl border border-blue-500/30 bg-blue-500/10">
                <BrainCircuit className="h-5 w-5 text-blue-400" />
              </span>
              <span className="text-base font-semibold text-white">AI Interview Simulator</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-slate-400">
              Smarter Practice. Better Opportunities.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white">Quick Links</h4>
            <ul className="mt-4 flex flex-col gap-2.5">
              {links.map((l) => (
                <li key={l}>
                  <a href="#" className="text-sm text-slate-400 transition hover:text-white">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white">Connect</h4>
            <div className="mt-4 flex gap-3">
              {[
                { Icon: Github, label: 'GitHub' },
                { Icon: Linkedin, label: 'LinkedIn' },
                { Icon: Twitter, label: 'Twitter' },
                { Icon: Mail, label: 'Email' },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-xl border border-blue-500/25 bg-white/5 text-slate-300 transition hover:border-blue-400/50 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-blue-500/15 pt-6 text-center text-xs text-slate-500">
          © 2026 AI Interview Simulator. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

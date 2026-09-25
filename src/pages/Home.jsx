import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Target,
  Trophy,
  Briefcase,
  Users,
  BrainCircuit,
  Mic,
  ChartColumn,
  History,
  Lightbulb,
  User,
  Bot,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import FeatureCard from '../components/FeatureCard';
import ProgressCard from '../components/ProgressCard';
import CTASection from '../components/CTASection';
import RobotIllustration from '../components/RobotIllustration';

const features = [
  { icon: Briefcase, title: 'Role-Based Interviews', description: 'Practice for your target job roles and build confidence.' },
  { icon: BrainCircuit, title: 'AI-Powered Questions', description: 'Get intelligent, role-specific interview questions.' },
  { icon: ChartColumn, title: 'Instant Feedback', description: 'Receive detailed feedback and performance scores.' },
  { icon: Target, title: 'Skill Gap Analysis', description: 'Identify your weak areas and get personalized tips.' },
  { icon: History, title: 'Interview History', description: 'Track your progress and see your past attempts.' },
  { icon: Lightbulb, title: 'Personalized Recommendations', description: 'Get custom learning resources to improve faster.' },
];

const steps = [
  { num: '01', icon: User, title: 'Choose Your Role', desc: 'Select from various job roles.' },
  { num: '02', icon: Bot, title: 'Start Interview', desc: 'Begin your mock interview.' },
  { num: '03', icon: Mic, title: 'Answer AI Questions', desc: 'Speak or type your answers.' },
  { num: '04', icon: ChartColumn, title: 'Receive Feedback', desc: 'Get scores and insights.' },
  { num: '05', icon: Target, title: 'Improve Your Skills', desc: 'Follow recommendations and grow.' },
];

const progressSkills = [
  { label: 'DSA', value: 80, color: 'blue' },
  { label: 'OOP', value: 90, color: 'cyan' },
  { label: 'DBMS', value: 60, color: 'violet' },
  { label: 'Operating Systems', value: 70, color: 'emerald' },
  { label: 'Communication', value: 70, color: 'blue' },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="container-app pt-16 pb-20 lg:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300">
              <Sparkles className="h-3.5 w-3.5" />
              Your Success, Our AI
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Practice Smarter.
              <br />
              <span className="gradient-text">Interview Better.</span>
            </h1>
            <p className="mt-5 max-w-md text-base text-slate-400 sm:text-lg">
              AI-powered mock interviews that help you improve your technical, behavioral and communication skills.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button to="/roles" className="px-7 py-3.5 text-base">
                Start Mock Interview
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button to="/#features" variant="ghost" className="px-7 py-3.5 text-base">
                Explore Features
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap gap-6">
              {[
                { icon: Target, label: 'Build Skills' },
                { icon: Trophy, label: 'Gain Confidence' },
                { icon: Briefcase, label: 'Get Hired' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-sm text-slate-300">
                  <Icon className="h-4 w-4 text-blue-400" />
                  {label}
                </div>
              ))}
            </div>
          </div>

          <div className="animate-fade-up" style={{ animationDelay: '0.15s' }}>
            <RobotIllustration />
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section id="features" className="container-app py-20 scroll-mt-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Why Choose AI Interview Simulator?
          </h2>
          <p className="mt-4 text-slate-400">
            Everything you need to prepare smarter and perform better in real interviews.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="container-app py-20 scroll-mt-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-blue-400">Simple Steps</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">How It Works</h2>
          <p className="mt-4 text-slate-400">
            Your journey from preparation to success, in 5 simple steps.
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-5">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.num} className="relative flex flex-col items-center text-center">
                {i < steps.length - 1 && (
                  <div className="absolute left-1/2 top-8 hidden h-px w-full bg-gradient-to-r from-blue-500/40 to-transparent md:block" />
                )}
                <div className="relative z-10 grid h-16 w-16 place-items-center rounded-2xl border border-blue-500/30 bg-[#061432]">
                  <Icon className="h-7 w-7 text-blue-400" />
                </div>
                <span className="mt-4 text-xs font-semibold tracking-widest text-blue-400">
                  STEP {step.num}
                </span>
                <h3 className="mt-1 text-base font-semibold text-white">{step.title}</h3>
                <p className="mt-1.5 text-sm text-slate-400">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Progress */}
      <section id="about" className="container-app py-20 scroll-mt-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Track Your Progress
          </h2>
          <p className="mt-4 text-slate-400">
            Visualize your growth with detailed analytics across every skill that matters.
          </p>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <ProgressCard score={78} skills={progressSkills} />
          <div className="card p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold text-white">Performance Overview</h3>
            <p className="mt-1 text-sm text-slate-400">A snapshot of your recent interview activity.</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                { label: 'Interviews Completed', value: '12', icon: Trophy, accent: 'text-blue-400' },
                { label: 'Average Score', value: '78%', icon: ChartColumn, accent: 'text-cyan-400' },
                { label: 'Best Score', value: '92%', icon: Target, accent: 'text-violet-400' },
                { label: 'Skills Improved', value: '5', icon: TrendingUp, accent: 'text-emerald-400' },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="rounded-xl border border-blue-500/15 bg-white/5 p-4">
                    <Icon className={`h-5 w-5 ${s.accent}`} />
                    <p className="mt-3 text-2xl font-bold text-white">{s.value}</p>
                    <p className="text-xs text-slate-400">{s.label}</p>
                  </div>
                );
              })}
            </div>
            <Link to="/dashboard" className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-blue-400 hover:text-blue-300">
              View full dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <CTASection />
      <Footer />
    </div>
  );
}

function TrendingUp(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}

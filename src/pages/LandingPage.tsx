import { useState, useEffect } from 'react'
import { Sparkles, ArrowRight, Code, CheckCircle, Bell, MessageSquare, Zap, ChevronRight } from 'lucide-react'
import { useApp } from '../contexts/AppContext'
import { AuthModal } from '../components/modals/AuthModal'
import { FloatingBackground } from '../components/landing/FloatingBackground'

// --- Components ---

function TypewriterText({ text, speed = 40, delay = 0 }: { text: string, speed?: number, delay?: number }) {
  const [displayed, setDisplayed] = useState('')
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const startTimer = setTimeout(() => {
      setStarted(true)
    }, delay)
    return () => clearTimeout(startTimer)
  }, [delay])

  useEffect(() => {
    if (!started) return
    let i = 0
    const timer = setInterval(() => {
      setDisplayed(text.substring(0, i))
      i++
      if (i > text.length) clearInterval(timer)
    }, speed)
    return () => clearInterval(timer)
  }, [text, started, speed])

  return (
    <span className="whitespace-nowrap">
      {displayed}
      <span className="inline-block w-[3px] h-[1em] translate-y-[0.1em] ml-1 bg-current animate-pulse" />
    </span>
  )
}

const TESTIMONIALS = [
  { handle: "@futurebuilder", role: "Student, CS", body: "Finally an app that cures Student Syndrome! The velocity tracking shows me when I'm actually stalling instead of just being busy." },
  { handle: "@sarah_builds", role: "Indie Founder", body: "Future Me forces me to break down my massive product launches into sub-goals. The AI deconstruction is an underrated feature." },
  { handle: "@dev_marco", role: "Self-taught Dev", body: "The round-the-clock reminders fuel my motivation when I'm tired. It literally sends me notifications from my 'future self'." },
  { handle: "@alisa_tech", role: "Product Manager", body: "Clean Notion-like aesthetics, but with actual intelligence built-in. It doesn't just store tasks, it actively coaches you." },
  { handle: "@indiehackerz", role: "Bootstrapper", body: "Tracking true velocity instead of just checking boxes changes the whole game. It has become my entire team's accountability partner." },
  { handle: "@study_notes", role: "Med Student", body: "I use the AI Efficiency assistant to break down 3 months of medical board prep automatically. Essential tool for massive study loads." }
]

export function LandingPage() {
  const { loginAsDemo, applyUserTheme } = useApp()
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup')

  const openAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode)
    setAuthModalOpen(true)
  }

  useEffect(() => {
    document.documentElement.classList.remove('light');
    document.documentElement.classList.add('dark');
    document.documentElement.style.setProperty('--user-accent', '#f57362');
  }, []);

  return (
    <div className="min-h-screen bg-[#141414] text-[#D4D4D4] overflow-x-hidden font-sans selection:bg-[var(--user-accent)] selection:text-white">

      {/* ── Top Navigation ── */}
      <nav className="sticky top-0 z-40 w-full backdrop-blur-md bg-background/80 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: 'var(--user-accent)' }}
              >
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold tracking-tight text-lg">Future Me</span>
            </div>

            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
              <a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a>
              <a href="#features" className="hover:text-foreground transition-colors">Features</a>
              <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => loginAsDemo()}
              className="hidden sm:flex text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
            >
              Demo
            </button>
            <div className="w-px h-4 bg-border hidden sm:block mx-1" />
            <button
              onClick={() => openAuth('login')}
              className="text-sm font-bold text-foreground transition-opacity hover:opacity-80"
            >
              Log in
            </button>
            <button
              onClick={() => openAuth('signup')}
              className="text-sm font-bold px-4 py-2 rounded-lg text-white shadow-sm transition-transform hover:scale-105"
              style={{ backgroundColor: 'var(--user-accent)' }}
            >
              Sign up
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1">

        {/* ── Hero Section ── */}
        <section className="relative min-h-screen flex flex-col items-center justify-center pb-20 px-4 overflow-hidden border-b border-border">
          <div className="hidden md:block">
            <FloatingBackground />
          </div>
          {/* Minimalist Grid Pattern Background */}
          <div className="absolute inset-0 pointer-events-none opacity-20"
            style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

          <div className="relative max-w-6xl mx-auto text-center z-10 mt-16">
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-[1.1] text-inherit" style={{ letterSpacing: '-0.04em' }}>
              Put the <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#f57362] to-[#e8daf9]">Pro</span> in <br className="hidden md:block" />
              <span className="whitespace-nowrap"><TypewriterText text="Procrastination." speed={65} delay={100} /></span>
            </h1>
            <p className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
              The AI helper that gets you through your To-Do's and Goals, here to remind you every step of the way in making you <strong className="text-foreground">Better</strong>.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-5">
              <button
                onClick={() => openAuth('signup')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl text-white font-bold text-lg shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] transition-transform hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] flex items-center justify-center gap-2 group"
                style={{ backgroundColor: 'var(--user-accent)' }}
              >
                <span>Start for free</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => loginAsDemo()}
                className="w-full sm:w-auto px-8 py-4 rounded-xl text-foreground bg-card border border-border font-bold text-lg transition-colors hover:bg-muted"
              >
                Try the Demo
              </button>
            </div>
            <p className="text-sm font-medium text-muted-foreground opacity-80">
              No credit card required. Join 1,200+ students curing burnout.
            </p>
          </div>
        </section>

        {/* ── Problem / Story Section ── */}
        <section id="how-it-works" className="py-24 px-4 bg-muted/30 border-b border-border">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">The Student Syndrome</h2>
            <h3 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight text-foreground">
              Why do we wait until the last minute?
            </h3>
            <div className="prose prose-base md:prose-lg mx-auto text-muted-foreground leading-relaxed">
              <p className="mb-6">
                Whether you're battling <strong className="text-foreground font-semibold">Student Syndrome</strong>, trying to launch a startup, or just need to fuel yourself through a difficult side project, pure willpower isn't enough.
              </p>
              <p>
                Future Me is the underrated AI Assistant designed to cure perfection-paralysis. By combining relentless <strong className="text-foreground font-semibold">Round the Clock Reminders</strong> with actionable AI-driven task breakdowns, it becomes the ultimate motivation engine to ensure you execute.
              </p>
            </div>
          </div>
        </section>

        {/* ── Feature Grid ── */}
        <section id="features" className="py-24 px-4 border-b border-border">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">

              <div className="card-flat p-8 rounded-2xl flex flex-col hover:-translate-y-1 transition-transform cursor-default group">
                <div className="w-12 h-12 rounded-xl mb-6 flex items-center justify-center transition-colors group-hover:bg-opacity-80" style={{ backgroundColor: 'color-mix(in srgb, var(--user-accent) 15%, transparent)' }}>
                  <Code className="w-6 h-6" style={{ color: 'var(--user-accent)' }} />
                </div>
                <h4 className="text-xl font-bold mb-3 text-foreground">AI Task Deconstruction</h4>
                <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                  Vague ambitions are the root of perfection-paralysis. When you tell Future Me you want to "Launch an App," our deep AI engines instantly deconstruct it. We generate an intelligent, chronologically structured hierarchy of highly specific sub-goals with tailored estimated completion times—giving you an explicit map to execution instead of an overwhelming blank canvas.
                </p>
              </div>

              <div className="card-flat p-8 rounded-2xl flex flex-col hover:-translate-y-1 transition-transform cursor-default group">
                <div className="w-12 h-12 rounded-xl mb-6 flex items-center justify-center transition-colors group-hover:bg-opacity-80" style={{ backgroundColor: 'color-mix(in srgb, var(--user-accent) 15%, transparent)' }}>
                  <Bell className="w-6 h-6" style={{ color: 'var(--user-accent)' }} />
                </div>
                <h4 className="text-xl font-bold mb-3 text-foreground">Round the Clock Reminders</h4>
                <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                  We engineered this platform to serve as a relentless motivation engine specifically to combat Student Syndrome. By scheduling proactive notifications—daily, weekly, or at custom pivot points—Future Me guarantees you can't push goals into your peripheral vision. It's an accountability lever that actively reminds you of the promises your past self made.
                </p>
              </div>

              <div className="card-flat p-8 rounded-2xl flex flex-col hover:-translate-y-1 transition-transform cursor-default group">
                <div className="w-12 h-12 rounded-xl mb-6 flex items-center justify-center transition-colors group-hover:bg-opacity-80" style={{ backgroundColor: 'color-mix(in srgb, var(--user-accent) 15%, transparent)' }}>
                  <Zap className="w-6 h-6" style={{ color: 'var(--user-accent)' }} />
                </div>
                <h4 className="text-xl font-bold mb-3 text-foreground">AI Efficiency Assistant</h4>
                <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                  Beyond static tracking, Future Me embeds an intelligent co-pilot within your UI. It analyzes your task velocity, identifies friction bottlenecks, and chats with you natively to adapt your strategy. If you start drifting behind schedule, your AI Coach dynamically spots the trend and helps you renegotiate your timeline before burnout strikes.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* ── Social Proof (Infinite Marquee) ── */}
        <section className="py-24 bg-muted/30 border-y border-border overflow-hidden">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-foreground">Be a part of building yourself.</h2>
              <p className="text-muted-foreground">Discover how founders and students are finding their true velocity.</p>
            </div>
          </div>
            
          <div className="w-full mask-edges-x max-w-7xl mx-auto overflow-hidden pointer-events-auto">
            <div className="flex w-max animate-marquee hover:[animation-play-state:paused] gap-4 px-4 pb-4 select-none">
              {[...TESTIMONIALS, ...TESTIMONIALS].map((t, idx) => (
                <div key={idx} className="w-[320px] lg:w-[350px] shrink-0 bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-default">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center font-bold text-foreground overflow-hidden">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${t.handle}`} alt={t.handle} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-foreground">{t.handle}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                  <p className="text-sm text-foreground/90 leading-relaxed font-medium">"{t.body}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pricing Teaser ── */}
        <section id="pricing" className="py-24 px-4 border-b border-border">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-foreground">Simple, transparent pricing.</h2>
              <p className="text-muted-foreground">Start for free. Upgrade when you're ready to accelerate.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* B2C Tier */}
              <div className="card-flat rounded-2xl p-8 relative flex flex-col">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">Pro Individual</h3>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-4xl font-black">$1</span>
                    <span className="text-muted-foreground font-medium">/ month</span>
                  </div>
                  <p className="text-muted-foreground text-sm">Perfect for students and indie hackers prioritizing their own goals.</p>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {['Unlimited AI Task Deconstruction', 'Daily AI Coach usage', 'Premium UI Themes', 'Unlimited Email Reminders'].map((feat, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground font-medium">
                      <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--user-accent)' }} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => openAuth('signup')}
                  className="w-full py-3 rounded-lg font-bold text-foreground bg-muted hover:bg-border transition-colors flex items-center justify-center gap-2"
                >
                  Start 14-day free trial
                </button>
              </div>

              {/* B2B Tier */}
              <div className="card-flat rounded-2xl p-8 relative flex flex-col border-[1.5px]" style={{ borderColor: 'var(--user-accent)' }}>
                <div className="absolute top-0 right-8 -translate-y-1/2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider text-white uppercase shadow-sm" style={{ backgroundColor: 'var(--user-accent)' }}>
                    Enterprise
                  </span>
                </div>
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2 text-foreground">University / Team</h3>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-4xl font-black">Custom</span>
                  </div>
                  <p className="text-muted-foreground text-sm">For classrooms, student cohorts, and startup incubators scaling accountability.</p>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {['Admin Dashboard Analytics', 'Aggregate Velocity Tracking', 'Custom Model Integrations', 'Priority 24/7 Support'].map((feat, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground font-medium">
                      <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--user-accent)' }} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className="w-full py-3 rounded-lg font-bold text-white shadow-sm transition-opacity hover:opacity-90 flex items-center justify-center gap-2"
                  style={{ backgroundColor: 'var(--user-accent)' }}
                >
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── Pre-Footer CTA ── */}
        <section className="py-32 px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-8 text-foreground">
              Ready to meet your future self?
            </h2>
            <button
              onClick={() => openAuth('signup')}
              className="px-10 py-5 rounded-2xl text-white font-bold text-xl shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl group inline-flex items-center gap-3"
              style={{ backgroundColor: 'var(--user-accent)' }}
            >
              <span>Start for free</span>
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-border bg-card py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Sparkles className="w-5 h-5" />
            <span className="font-bold">Future Me</span>
            <span className="text-sm">© {new Date().getFullYear()}</span>
          </div>

          <div className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            <a href="https://github.com" className="hover:text-foreground transition-colors flex items-center gap-1">
              <Code className="w-4 h-4" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </footer>

      {/* Auth Modal overlay */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultMode={authMode}
      />
    </div>
  )
}

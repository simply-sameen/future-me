import { useState } from 'react'
import { Mail, Lock, Zap, Sparkles, ArrowRight, Eye, EyeOff } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { useApp } from '../contexts/AppContext'

export function LoginPage() {
  const { loginAsDemo, register, login } = useApp()
  const [isSignUp, setIsSignUp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const handleAuth = async () => {
    if (isSignUp) {
      if (!email || !password || !name) return alert('Please fill in all fields')
      try {
        setIsLoading(true)
        await register(email, password, name)
      } catch (error: any) {
        alert(error.message || 'Registration failed')
      } finally {
        setIsLoading(false)
      }
    } else {
      if (!email || !password) return alert('Please fill in all fields')
      try {
        setIsLoading(true)
        await login(email, password)
      } catch (error: any) {
        alert(error.message || 'Login failed')
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden grid-pattern"
      style={{ background: '#141414' }}
    >
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-5 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #FF69B4, transparent)', filter: 'blur(80px)' }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-5 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #89CFF0, transparent)', filter: 'blur(80px)' }}
      />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 animate-float"
            style={{ background: 'linear-gradient(135deg, rgba(255,105,180,0.2), rgba(137,207,240,0.2))', border: '1px solid rgba(255,105,180,0.3)' }}
          >
            <Sparkles className="w-8 h-8" style={{ color: '#FF69B4' }} />
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-1">
            <span className="shimmer-text">Future Me</span>
          </h1>
          <p className="text-muted-foreground text-sm font-medium">Remind</p>
          <p className="text-muted-foreground text-xs mt-2 max-w-xs mx-auto">
            Your AI-powered goal tracker that sends messages from your future self.
          </p>
        </div>

        <button
          onClick={loginAsDemo}
          className="w-full h-14 rounded-xl text-base font-black flex items-center justify-center gap-3 mb-6 relative overflow-hidden btn-neon-pink pulse-glow-pink group"
          style={{ letterSpacing: '0.02em' }}
        >
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.1), transparent)' }}
          />
          <Zap className="w-6 h-6" />
          <span>Enter Demo Mode</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px" style={{ background: '#262626' }} />
          <span className="text-xs text-muted-foreground">or continue with email</span>
          <div className="flex-1 h-px" style={{ background: '#262626' }} />
        </div>

        <div
          className="rounded-2xl p-6"
          style={{ background: '#0A0A0A', border: '1px solid #262626' }}
        >
          <div className="flex rounded-lg overflow-hidden mb-5" style={{ background: '#141414', border: '1px solid #262626' }}>
            <button
              onClick={() => setIsSignUp(false)}
              className="flex-1 py-2 text-sm font-semibold transition-all"
              style={{
                background: !isSignUp ? 'rgba(255,105,180,0.15)' : 'transparent',
                color: !isSignUp ? '#FF69B4' : '#888',
                borderBottom: !isSignUp ? '2px solid #FF69B4' : '2px solid transparent',
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className="flex-1 py-2 text-sm font-semibold transition-all"
              style={{
                background: isSignUp ? 'rgba(137,207,240,0.15)' : 'transparent',
                color: isSignUp ? '#89CFF0' : '#888',
                borderBottom: isSignUp ? '2px solid #89CFF0' : '2px solid transparent',
              }}
            >
              Sign Up
            </button>
          </div>

          <div className="space-y-3 mb-4">
            {isSignUp && (
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Sparkles className="w-4 h-4" />
                </div>
                <Input
                  placeholder="Full Name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="pl-9 border-border bg-input text-foreground placeholder:text-muted-foreground"
                />
              </div>
            )}

            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Mail className="w-4 h-4" />
              </div>
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="pl-9 border-border bg-input text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Lock className="w-4 h-4" />
              </div>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="pl-9 pr-9 border-border bg-input text-foreground placeholder:text-muted-foreground"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button
            className="w-full h-10 text-sm font-bold btn-neon-blue border-none rounded-lg"
            onClick={handleAuth}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
          </Button>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px" style={{ background: '#262626' }} />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="flex-1 h-px" style={{ background: '#262626' }} />
          </div>

          <Button
            variant="outline"
            className="w-full h-10 text-sm font-medium border-border bg-transparent text-foreground hover:bg-accent flex items-center gap-2"
            onClick={loginAsDemo}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span>Continue with Google</span>
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Built by{' '}
          <span className="text-neon-pink font-semibold">Divya and Team</span>
        </p>
      </div>
    </div>
  )
}

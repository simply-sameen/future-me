import { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Sparkles, CircleAlert as AlertCircle, Lock } from 'lucide-react'

interface APIKeyModalProps {
  onSubmit: (apiKey: string) => void
  isOpen: boolean
}

export function APIKeyModal({ onSubmit, isOpen }: APIKeyModalProps) {
  const [apiKey, setApiKey] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async () => {
    if (!apiKey.trim()) return
    setIsSubmitting(true)
    try {
      onSubmit(apiKey.trim())
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(8px)' }}
    >
      <div
        className="relative max-w-lg w-full rounded-2xl p-6 overflow-hidden"
        style={{ background: '#0A0A0A', border: '1px solid rgba(255,105,180,0.3)' }}
      >
        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(255,105,180,0.15)', border: '1px solid rgba(255,105,180,0.3)' }}
          >
            <Sparkles className="w-5 h-5 text-neon-pink" />
          </div>
          <div>
            <h3 className="font-bold text-foreground text-lg">Set up AI Assistant</h3>
            <p className="text-xs text-muted-foreground">Enter your Google Gemini API key</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="rounded-xl p-4" style={{ background: 'rgba(137,207,240,0.08)', border: '1px solid rgba(137,207,240,0.2)' }}>
            <div className="flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div className="text-xs text-muted-foreground">
                <p className="font-semibold text-foreground mb-1">Free Google AI Studio API</p>
                <p className="mb-2">1. Visit <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300">aistudio.google.com/apikey</a></p>
                <p className="mb-2">2. Click "Create API key"</p>
                <p>3. Copy and paste it below</p>
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
              Google Gemini API Key
            </label>
            <Input
              type="password"
              placeholder="AIza..."
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              className="border-border bg-input text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="rounded-xl p-3" style={{ background: 'rgba(255,105,180,0.05)', border: '1px solid rgba(255,105,180,0.2)' }}>
            <div className="flex items-start gap-2">
              <Lock className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-[10px] text-muted-foreground">
                Your API key is stored locally in your browser. It's never sent to our servers. Use a Google Cloud project key with restricted API access for security.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setApiKey('')
            }}
            className="flex-1 h-10 border-border text-muted-foreground hover:text-foreground"
          >
            Skip for Now
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!apiKey.trim() || isSubmitting}
            className="flex-1 h-10 btn-neon-pink border-none font-bold disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save API Key'}
          </Button>
        </div>
      </div>
    </div>
  )
}

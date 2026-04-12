import { useState } from 'react'
import { Plus, Target, CircleCheck as CheckCircle2, Circle, ChevronDown, ChevronUp, Zap, Lock, Sparkles, Flame, Trash2 } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { useApp } from '../../contexts/AppContext'
import { AICoachModal } from '../modals/AICoachModal'
import type { Goal } from '../../types'

const COLOR_CONFIG = {
  pink: {
    gradient: 'linear-gradient(135deg, rgba(255,105,180,0.15), rgba(255,105,180,0.05))',
    border: 'rgba(255,105,180,0.25)',
    glow: 'rgba(255,105,180,0.2)',
    accent: '#FF69B4',
    badge: 'rgba(255,105,180,0.15)',
    badgeText: '#ff69b4',
  },
  blue: {
    gradient: 'linear-gradient(135deg, rgba(137,207,240,0.15), rgba(137,207,240,0.05))',
    border: 'rgba(137,207,240,0.25)',
    glow: 'rgba(137,207,240,0.2)',
    accent: '#89CFF0',
    badge: 'rgba(137,207,240,0.15)',
    badgeText: '#89CFF0',
  },
  green: {
    gradient: 'linear-gradient(135deg, rgba(134,239,172,0.15), rgba(134,239,172,0.05))',
    border: 'rgba(134,239,172,0.25)',
    glow: 'rgba(134,239,172,0.2)',
    accent: '#86efac',
    badge: 'rgba(134,239,172,0.15)',
    badgeText: '#86efac',
  },
}

function GoalCard({ goal, onCoachClick }: { goal: Goal; onCoachClick: (goal: Goal) => void }) {
  const { completeSubGoal, deleteGoal } = useApp()
  const [expanded, setExpanded] = useState(false)
  const colors = COLOR_CONFIG[goal.color]
  const completedCount = goal.subGoals.filter(sg => sg.completed).length

  return (
    <div
      className="rounded-xl p-5 transition-all duration-300 group"
      style={{
        background: colors.gradient,
        border: `1px solid ${colors.border}`,
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = `0 0 30px ${colors.glow}`
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = 'none'
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
            style={{ background: `${colors.accent}20`, border: `1px solid ${colors.accent}40` }}
          >
            <Target className="w-4 h-4" style={{ color: colors.accent }} />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-foreground text-base leading-snug mb-1 truncate">
              {goal.title}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-1">{goal.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge
            className="text-xs border-none"
            style={{ background: colors.badge, color: colors.badgeText }}
          >
            {goal.category}
          </Badge>
          <button
            onClick={e => {
              e.stopPropagation()
              deleteGoal(goal.id)
            }}
            className="p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20 rounded-lg"
            title="Delete goal"
          >
            <Trash2 className="w-3.5 h-3.5 text-destructive" />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-muted-foreground font-medium">Progress</span>
          <div className="flex items-center gap-2">
            <span style={{ color: colors.accent }} className="font-bold">{goal.progress}%</span>
            <span className="text-muted-foreground">· ETC: {goal.etcDays}d</span>
          </div>
        </div>
        <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: '#1A1A1A' }}>
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${goal.progress}%`,
              background: `linear-gradient(90deg, ${colors.accent}, ${colors.accent}99)`,
              boxShadow: `0 0 8px ${colors.accent}60`,
            }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <CheckCircle2 className="w-3.5 h-3.5" style={{ color: colors.accent }} />
          <span>{completedCount}/{goal.subGoals.length} sub-goals</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={e => {
              e.stopPropagation()
              setExpanded(!expanded)
            }}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>{expanded ? 'Collapse' : 'View Plan'}</span>
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={e => {
              e.stopPropagation()
              onCoachClick(goal)
            }}
            className="px-2 py-1 rounded text-xs font-semibold bg-neon-pink/20 text-neon-pink hover:bg-neon-pink/30 transition-colors flex items-center gap-1"
            title="Ask AI Coach for advice"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Coach</span>
          </button>
        </div>
      </div>

      {expanded && (
        <div
          className="mt-4 pt-4 space-y-2"
          style={{ borderTop: `1px solid ${colors.border}` }}
        >
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            AI Deconstruction Plan
          </p>
          {goal.subGoals.map((sg, idx) => (
            <div
              key={sg.id}
              className="flex items-start gap-2.5 p-2.5 rounded-lg transition-colors cursor-pointer hover:opacity-80"
              style={{ background: sg.completed ? `${colors.accent}08` : 'rgba(255,255,255,0.02)' }}
              onClick={() => completeSubGoal(goal.id, sg.id)}
            >
              <div className="shrink-0 mt-0.5">
                {sg.completed ? (
                  <CheckCircle2 className="w-4 h-4" style={{ color: colors.accent }} />
                ) : (
                  <Circle className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs leading-snug ${sg.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                  <span className="font-semibold text-muted-foreground mr-1.5">{idx + 1}.</span>
                  {sg.title}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">~{sg.estimatedDays} days</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function AddGoalModal({ onClose, onAdd }: { onClose: () => void; onAdd: (goal: Goal) => void }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)

  const handleGenerate = async () => {
    if (!title.trim()) return
    setIsGenerating(true)
    await new Promise(r => setTimeout(r, 2000))
    setIsGenerating(false)
    setGenerated(true)
  }

  const handleAdd = () => {
    if (!title.trim()) return
    const newGoal: Omit<Goal, 'id' | 'createdAt'> = {
      title,
      description: description || `Achieve: ${title}`,
      category: 'Personal',
      progress: 0,
      etcDays: 90,
      color: 'pink',
      subGoals: [
        { id: `sg-${Date.now()}-1`, title: `Research and plan your approach to: ${title}`, completed: false, estimatedDays: 7 },
        { id: `sg-${Date.now()}-2`, title: 'Define measurable milestones and success criteria', completed: false, estimatedDays: 5 },
        { id: `sg-${Date.now()}-3`, title: 'Build the core habit or skill required', completed: false, estimatedDays: 21 },
        { id: `sg-${Date.now()}-4`, title: 'Execute the first major phase of your plan', completed: false, estimatedDays: 30 },
        { id: `sg-${Date.now()}-5`, title: 'Review, iterate, and push toward completion', completed: false, estimatedDays: 30 },
      ],
    }
    onAdd(newGoal as any)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
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
            <h3 className="font-bold text-foreground text-lg">Goal Deconstructor</h3>
            <p className="text-xs text-muted-foreground">AI splits your goal into 5 actionable steps</p>
          </div>
        </div>

        <div className="space-y-4 mb-5">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
              Your Large Goal
            </label>
            <Input
              placeholder="e.g. Launch a profitable online business"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="border-border bg-input text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
              Why does this matter to you? (optional)
            </label>
            <Input
              placeholder="e.g. Financial freedom for my family"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="border-border bg-input text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {!generated ? (
          <Button
            onClick={handleGenerate}
            disabled={!title.trim() || isGenerating}
            className="w-full h-11 text-sm font-bold btn-neon-pink rounded-lg border-none mb-3 disabled:opacity-50"
          >
            {isGenerating ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                <span>AI Deconstructing...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Deconstruct with AI</span>
              </div>
            )}
          </Button>
        ) : (
          <div
            className="rounded-xl p-4 mb-4"
            style={{ background: 'rgba(255,105,180,0.06)', border: '1px solid rgba(255,105,180,0.2)' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Flame className="w-4 h-4 text-neon-pink" />
              <p className="text-xs font-bold text-neon-pink">5 Sub-Goals Generated · ETC: 90 days</p>
            </div>
            <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: '#1A1A1A' }}>
              <div
                className="progress-neon"
                style={{ width: '0%', animation: 'progress-fill 1.5s ease-out forwards', '--progress-width': '100%' } as React.CSSProperties}
              />
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 h-10 border-border text-muted-foreground hover:text-foreground"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAdd}
            disabled={!title.trim()}
            className="flex-1 h-10 btn-neon-pink border-none font-bold disabled:opacity-50"
          >
            Add Goal
          </Button>
        </div>
      </div>
    </div>
  )
}

export function GoalsView() {
  const { goals, isPremium, addGoal } = useApp()
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedGoalForCoach, setSelectedGoalForCoach] = useState<Goal | null>(null)

  const FREE_LIMIT = 10
  const canAddGoal = isPremium || goals.length < FREE_LIMIT

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">My Goals</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isPremium
              ? `${goals.length} active goals · Premium unlocked`
              : `${goals.length}/${FREE_LIMIT} goals · Free plan`}
          </p>
        </div>
        <Button
          onClick={() => canAddGoal && setShowAddModal(true)}
          className={`h-9 text-sm font-bold border-none rounded-lg flex items-center gap-1.5 ${canAddGoal ? 'btn-neon-pink' : 'opacity-50 cursor-not-allowed bg-muted text-muted-foreground'}`}
        >
          {canAddGoal ? (
            <>
              <Plus className="w-4 h-4" />
              New Goal
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              Limit Reached
            </>
          )}
        </Button>
      </div>

      {!isPremium && goals.length >= FREE_LIMIT && (
        <div
          className="rounded-xl p-4 mb-6 flex items-center justify-between gap-4"
          style={{ background: 'rgba(255,105,180,0.05)', border: '1px solid rgba(255,105,180,0.2)' }}
        >
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-neon-pink shrink-0" />
            <div>
              <p className="text-sm font-semibold text-foreground">Goal limit reached on Free Plan</p>
              <p className="text-xs text-muted-foreground">Upgrade to Premium for unlimited goals + analytics</p>
            </div>
          </div>
          <Badge
            className="shrink-0 border-none font-bold"
            style={{ background: 'rgba(255,105,180,0.2)', color: '#FF69B4' }}
          >
            <Zap className="w-3 h-3 mr-1" />
            Upgrade
          </Badge>
        </div>
      )}

      {goals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5 animate-float"
            style={{ background: 'rgba(255,105,180,0.08)', border: '1px solid rgba(255,105,180,0.2)' }}
          >
            <Target className="w-10 h-10 text-neon-pink" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">Set Your First Goal</h3>
          <p className="text-sm text-muted-foreground max-w-xs mb-6">
            Define a large goal and let AI break it into 5 clear, actionable steps.
          </p>
          <Button
            onClick={() => setShowAddModal(true)}
            className="btn-neon-pink border-none h-10 px-6 font-bold"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Create Your First Goal
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {goals.map(goal => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onCoachClick={setSelectedGoalForCoach}
            />
          ))}
        </div>
      )}

      {showAddModal && (
        <AddGoalModal
          onClose={() => setShowAddModal(false)}
          onAdd={addGoal}
        />
      )}

      {selectedGoalForCoach && (
        <AICoachModal
          goal={selectedGoalForCoach}
          isOpen={!!selectedGoalForCoach}
          onClose={() => setSelectedGoalForCoach(null)}
        />
      )}
    </div>
  )
}

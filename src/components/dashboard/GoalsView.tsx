import { useState } from 'react'
import { Plus, Target, CircleCheck as CheckCircle2, Circle, ChevronDown, ChevronUp, Sparkles, Lock, Flame, Trash2, Pencil } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { useApp } from '../../contexts/AppContext'
import { AICoachModal } from '../modals/AICoachModal'
import type { Goal } from '../../types'

// Accent helper — all goal colours keyed off --user-accent
const ACCENT = 'var(--user-accent)'
const ACCENT_MIX = (p: number) => `color-mix(in srgb, var(--user-accent) ${p}%, transparent)`

function GoalCard({ goal, onCoachClick, onEditClick }: { goal: Goal; onCoachClick: (goal: Goal) => void; onEditClick: (goal: Goal) => void }) {
  const { completeSubGoal, deleteGoal } = useApp()
  const [expanded, setExpanded] = useState(false)
  const completedCount = goal.subGoals.filter(sg => sg.completed).length

  return (
    <div
      className="rounded-xl p-5 transition-all duration-300 group card-flat"
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
            style={{ background: ACCENT_MIX(12), border: `1px solid ${ACCENT_MIX(25)}` }}
          >
            <Target className="w-4 h-4" style={{ color: ACCENT }} />
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
            style={{ background: ACCENT_MIX(12), color: ACCENT }}
          >
            {goal.category}
          </Badge>
          <button
            onClick={e => { e.stopPropagation(); onEditClick(goal) }}
            className="p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-500/20 rounded-lg"
            title="Edit goal"
          >
            <Pencil className="w-3.5 h-3.5 text-blue-400" />
          </button>
          <button
            onClick={e => { e.stopPropagation(); deleteGoal(goal.id) }}
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
            <span style={{ color: ACCENT }} className="font-bold">{goal.progress}%</span>
            <span className="text-muted-foreground">· ETC: {goal.etcDays}d</span>
          </div>
        </div>
        <div className="w-full h-2 rounded-full overflow-hidden bg-muted">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${goal.progress}%`, background: ACCENT }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <CheckCircle2 className="w-3.5 h-3.5" style={{ color: ACCENT }} />
          <span>{completedCount}/{goal.subGoals.length} sub-goals</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={e => { e.stopPropagation(); setExpanded(!expanded) }}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>{expanded ? 'Collapse' : 'View Plan'}</span>
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={e => { e.stopPropagation(); onCoachClick(goal) }}
            className="px-2 py-1 rounded text-xs font-semibold transition-colors flex items-center gap-1"
            style={{ background: ACCENT_MIX(15), color: ACCENT }}
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
          style={{ borderTop: `1px solid ${ACCENT_MIX(20)}` }}
        >
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            AI Deconstruction Plan
          </p>
          {goal.subGoals.map((sg, idx) => (
            <div
              key={sg.id}
              className="flex items-start gap-2.5 p-2.5 rounded-lg transition-colors cursor-pointer hover:opacity-80"
              style={{ background: sg.completed ? ACCENT_MIX(8) : 'rgba(255,255,255,0.02)' }}
              onClick={() => completeSubGoal(goal.id, sg.id)}
            >
              <div className="shrink-0 mt-0.5">
                {sg.completed ? (
                  <CheckCircle2 className="w-4 h-4" style={{ color: ACCENT }} />
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

function GoalModal({ onClose, onAdd, onUpdate, editingGoal }: { onClose: () => void; onAdd: (goal: Goal) => void; onUpdate?: (id: string, updates: Partial<Goal>) => void; editingGoal?: Goal | null }) {
  const { incrementAiCalls } = useApp()
  const [title, setTitle] = useState(editingGoal?.title || '')
  const [description, setDescription] = useState(editingGoal?.description || '')
  const [targetDate, setTargetDate] = useState(editingGoal?.targetDate || '')
  const [priority, setPriority] = useState(editingGoal?.priority || 2)
  const [difficulty, setDifficulty] = useState(editingGoal?.difficulty || 3)
  const [obstacles, setObstacles] = useState(editingGoal?.obstacles || '')
  const [motivation, setMotivation] = useState(editingGoal?.motivation || '')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generated, setGenerated] = useState(!!editingGoal)
  const [generatedSubGoals, setGeneratedSubGoals] = useState(editingGoal?.subGoals || [])
  const [generatedEtcDays, setGeneratedEtcDays] = useState(editingGoal?.etcDays || 90)

  const isEditing = !!editingGoal

  const handleGenerate = async () => {
    if (!title.trim()) return
    setIsGenerating(true)
    try {
      const prompt = `Deconstruct this goal: "${title}".
Description: ${description || 'N/A'}
Target Date: ${targetDate || 'Not set'}
Priority: ${priority === 3 ? 'High' : priority === 2 ? 'Medium' : 'Low'}
Difficulty: ${difficulty}/5
Obstacles: ${obstacles || 'None specified'}
Motivation: ${motivation || 'Not specified'}`

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, mode: 'deconstruct' }),
      })

      if (!response.ok) throw new Error('API request failed')

      const data = await response.json()
      const text = data.response || ''

      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        if (parsed.subGoals && Array.isArray(parsed.subGoals)) {
          const aiSubGoals = parsed.subGoals.map((sg: any, idx: number) => ({
            id: `sg-${Date.now()}-${idx + 1}`,
            title: sg.title,
            completed: false,
            estimatedDays: sg.estimatedDays || 14,
          }))
          setGeneratedSubGoals(aiSubGoals)
          setGeneratedEtcDays(parsed.totalDays || aiSubGoals.reduce((sum: number, sg: any) => sum + sg.estimatedDays, 0))
          setGenerated(true)
          incrementAiCalls()
        }
      }
    } catch (err) {
      console.error('Deconstruct error:', err)
      const fallbackSubGoals = [
        { id: `sg-${Date.now()}-1`, title: `Research and plan your approach to: ${title}`, completed: false, estimatedDays: 7 },
        { id: `sg-${Date.now()}-2`, title: 'Define measurable milestones and success criteria', completed: false, estimatedDays: 5 },
        { id: `sg-${Date.now()}-3`, title: 'Build the core habit or skill required', completed: false, estimatedDays: 21 },
        { id: `sg-${Date.now()}-4`, title: 'Execute the first major phase of your plan', completed: false, estimatedDays: 30 },
        { id: `sg-${Date.now()}-5`, title: 'Review, iterate, and push toward completion', completed: false, estimatedDays: 30 },
      ]
      setGeneratedSubGoals(fallbackSubGoals)
      setGeneratedEtcDays(90)
      setGenerated(true)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSubmit = () => {
    if (!title.trim()) return
    if (isEditing && onUpdate) {
      onUpdate(editingGoal.id, {
        title,
        description: description || `Achieve: ${title}`,
        targetDate: targetDate || undefined,
        priority,
        difficulty,
        obstacles: obstacles || undefined,
        motivation: motivation || undefined,
      })
    } else {
      const newGoal: Omit<Goal, 'id' | 'createdAt'> = {
        title,
        description: description || `Achieve: ${title}`,
        category: 'Personal',
        progress: 0,
        etcDays: generatedEtcDays,
        color: 'pink',
        targetDate: targetDate || undefined,
        priority,
        difficulty,
        obstacles: obstacles || undefined,
        motivation: motivation || undefined,
        subGoals: generatedSubGoals.length > 0 ? generatedSubGoals : [
          { id: `sg-${Date.now()}-1`, title: `Research and plan your approach to: ${title}`, completed: false, estimatedDays: 7 },
          { id: `sg-${Date.now()}-2`, title: 'Define measurable milestones and success criteria', completed: false, estimatedDays: 5 },
          { id: `sg-${Date.now()}-3`, title: 'Build the core habit or skill required', completed: false, estimatedDays: 21 },
          { id: `sg-${Date.now()}-4`, title: 'Execute the first major phase of your plan', completed: false, estimatedDays: 30 },
          { id: `sg-${Date.now()}-5`, title: 'Review, iterate, and push toward completion', completed: false, estimatedDays: 30 },
        ],
      }
      onAdd(newGoal as any)
    }
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
    >
      <div
        className="relative max-w-lg w-full rounded-2xl p-6 overflow-y-auto card-flat"
        style={{ maxHeight: '90vh' }}
      >
        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: ACCENT_MIX(12), border: `1px solid ${ACCENT_MIX(25)}` }}
          >
            <Sparkles className="w-5 h-5" style={{ color: ACCENT }} />
          </div>
          <div>
            <h3 className="font-bold text-foreground text-lg">{isEditing ? 'Edit Goal' : 'Goal Deconstructor'}</h3>
            <p className="text-xs text-muted-foreground">{isEditing ? 'Update your goal details' : 'AI splits your goal into 5 actionable steps'}</p>
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
              Description
            </label>
            <textarea
              placeholder="Describe your goal in detail..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-md border border-border bg-input text-foreground placeholder:text-muted-foreground text-sm px-3 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                Target Date
              </label>
              <Input
                type="date"
                value={targetDate}
                onChange={e => setTargetDate(e.target.value)}
                className="border-border bg-input"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                Priority
              </label>
              <select
                value={priority}
                onChange={e => setPriority(Number(e.target.value))}
                className="w-full h-9 rounded-md border border-border bg-input text-foreground text-sm px-3 focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value={1}>Low</option>
                <option value={2}>Medium</option>
                <option value={3}>High</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
              Difficulty (1-5)
            </label>
            <select
              value={difficulty}
              onChange={e => setDifficulty(Number(e.target.value))}
              className="w-full h-9 rounded-md border border-border bg-input text-foreground text-sm px-3 focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value={1}>1 — Easy</option>
              <option value={2}>2 — Moderate</option>
              <option value={3}>3 — Challenging</option>
              <option value={4}>4 — Hard</option>
              <option value={5}>5 — Extreme</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
              Potential Obstacles
            </label>
            <textarea
              placeholder="What challenges might you face?"
              value={obstacles}
              onChange={e => setObstacles(e.target.value)}
              rows={2}
              className="w-full rounded-md border border-border bg-input text-foreground placeholder:text-muted-foreground text-sm px-3 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
              Motivation / Why
            </label>
            <textarea
              placeholder="Why does this goal matter to you?"
              value={motivation}
              onChange={e => setMotivation(e.target.value)}
              rows={2}
              className="w-full rounded-md border border-border bg-input text-foreground placeholder:text-muted-foreground text-sm px-3 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        </div>

        {!isEditing && !generated ? (
          <Button
            onClick={handleGenerate}
            disabled={!title.trim() || isGenerating}
            className="w-full h-11 text-sm font-bold btn-primary rounded-lg border-none mb-3 disabled:opacity-50"
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
        ) : !isEditing ? (
          <div
            className="rounded-xl p-4 mb-4"
            style={{ background: ACCENT_MIX(6), border: `1px solid ${ACCENT_MIX(20)}` }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Flame className="w-4 h-4" style={{ color: ACCENT }} />
              <p className="text-xs font-bold" style={{ color: ACCENT }}>5 Sub-Goals Generated · ETC: 90 days</p>
            </div>
            <div className="h-2 w-full rounded-full overflow-hidden bg-muted">
              <div
                className="progress-bar animate-progress"
                style={{ '--progress-width': '100%' } as React.CSSProperties}
              />
            </div>
          </div>
        ) : null}

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 h-10 border-border text-muted-foreground hover:text-foreground"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!title.trim()}
            className="flex-1 h-10 btn-primary border-none font-bold disabled:opacity-50"
          >
            {isEditing ? 'Save Changes' : 'Add Goal'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export function GoalsView() {
  const { goals, isPremium, addGoal, updateGoal } = useApp()
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [selectedGoalForCoach, setSelectedGoalForCoach] = useState<Goal | null>(null)

  const FREE_LIMIT = 10
  const canAddGoal = isPremium || goals.length < FREE_LIMIT

  const handleCloseModal = () => {
    setShowAddModal(false)
    setEditingGoal(null)
  }

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
          className={`h-9 text-sm font-bold border-none rounded-lg flex items-center gap-1.5 ${canAddGoal ? 'btn-primary' : 'opacity-50 cursor-not-allowed bg-muted text-muted-foreground'}`}
        >
          {canAddGoal ? (
            <><Plus className="w-4 h-4" />New Goal</>
          ) : (
            <><Lock className="w-4 h-4" />Limit Reached</>
          )}
        </Button>
      </div>

      {!isPremium && goals.length >= FREE_LIMIT && (
        <div
          className="rounded-xl p-4 mb-6 flex items-center justify-between gap-4"
          style={{ background: ACCENT_MIX(5), border: `1px solid ${ACCENT_MIX(20)}` }}
        >
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 shrink-0" style={{ color: ACCENT }} />
            <div>
              <p className="text-sm font-semibold text-foreground">Goal limit reached on Free Plan</p>
              <p className="text-xs text-muted-foreground">Upgrade to Premium for unlimited goals + analytics</p>
            </div>
          </div>
          <Badge
            className="shrink-0 border-none font-bold"
            style={{ background: ACCENT_MIX(18), color: ACCENT }}
          >
            Upgrade
          </Badge>
        </div>
      )}

      {goals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5 animate-float"
            style={{ background: ACCENT_MIX(8), border: `1px solid ${ACCENT_MIX(20)}` }}
          >
            <Target className="w-10 h-10" style={{ color: ACCENT }} />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">Set Your First Goal</h3>
          <p className="text-sm text-muted-foreground max-w-xs mb-6">
            Define a large goal and let AI break it into 5 clear, actionable steps.
          </p>
          <Button
            onClick={() => setShowAddModal(true)}
            className="btn-primary border-none h-10 px-6 font-bold"
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
              onEditClick={setEditingGoal}
            />
          ))}
        </div>
      )}

      {(showAddModal || editingGoal) && (
        <GoalModal
          onClose={handleCloseModal}
          onAdd={addGoal}
          onUpdate={updateGoal}
          editingGoal={editingGoal}
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

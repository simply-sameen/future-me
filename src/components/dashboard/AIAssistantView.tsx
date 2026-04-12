import { useState } from 'react'
import { Sparkles, Send, MessageCircle } from 'lucide-react'
import { useApp } from '../../contexts/AppContext'
import { toast } from 'sonner'
import type { ChatMessage } from '../../contexts/AppContext'

const GREETING_MESSAGE: ChatMessage = {
  id: 'greeting',
  role: 'assistant',
  content: 'Hello! I\'m your AI assistant here to help you break down goals, create strategies, and stay motivated. For specific goal coaching, use the "Coach" button on each goal card. How can I help you today?',
  timestamp: Date.now(),
}

export function AIAssistantView() {
  const { goals, reminders, chatMessages, setChatMessages } = useApp()
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Display messages: greeting + actual conversation from context
  const displayMessages = [GREETING_MESSAGE, ...chatMessages]

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: Date.now(),
    }

    setChatMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Send full conversation history so backend can reconstruct context statelessly.
      // Exclude the static greeting — it's UI-only, not part of the AI conversation.
      const historyForApi = [...chatMessages, userMessage].map(msg => ({
        role: msg.role,
        content: msg.content,
      }))

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: input,
          history: historyForApi.slice(0, -1), // History is everything before the current message
          goalsData: JSON.stringify(goals.map(g => ({ title: g.title, description: g.description, category: g.category, targetDate: g.targetDate, priority: g.priority, difficulty: g.difficulty, obstacles: g.obstacles, motivation: g.motivation }))),
          remindersData: JSON.stringify(reminders.map(r => ({ title: r.title, date: r.scheduledDate }))),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.response || 'No response generated',
        timestamp: Date.now(),
      }
      setChatMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to get response'
      toast.error(`AI API Error: ${errorMsg}`)
      
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: `Error: ${errorMsg}`,
        timestamp: Date.now(),
      }
      setChatMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-[#313338] text-[#dbdee1] rounded-lg overflow-hidden">
      <div className="p-4 border-b border-[#2b2d31] shadow-sm flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-neon-pink/20 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-neon-pink" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">AI Assistant</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-1 py-4">
        {displayMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-12 text-center text-[#949ba4]">
            <MessageCircle className="w-12 h-12 mb-3 opacity-50" />
            <p>Start a conversation about your goals</p>
          </div>
        ) : (
          displayMessages.map((message) => {
            const isAI = message.role === 'assistant'
            const timeString = message.timestamp
              ? new Date(message.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
              : 'Just now'

            return (
              <div
                key={message.id}
                className="group flex gap-4 px-4 py-1 hover:bg-[#2b2d31] transition-colors"
              >
                <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden bg-[#2b2d31] mt-1">
                  {isAI ? (
                    <Sparkles className="w-5 h-5 text-neon-pink" />
                  ) : (
                    <div className="w-full h-full bg-indigo-500 flex items-center justify-center text-white font-bold">
                      U
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-medium text-white hover:underline cursor-pointer">
                      {isAI ? 'AI Coach' : 'You'}
                    </span>
                    <span className="text-xs text-[#949ba4] font-medium">{timeString}</span>
                  </div>
                  <div className="text-[15px] leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </div>
                </div>
              </div>
            )
          })
        )}
        {isLoading && (
          <div className="flex gap-4 px-4 py-2 mt-2">
            <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center bg-[#2b2d31]">
              <Sparkles className="w-5 h-5 text-neon-pink animate-pulse" />
            </div>
            <div className="flex-1 min-w-0 flex items-center">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-[#dbdee1] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-[#dbdee1] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-[#dbdee1] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="px-4 pb-6 pt-2">
        <div className="flex items-center gap-2 bg-[#383a40] rounded-lg px-4 py-1">
          <input
            type="text"
            placeholder="Message AI Coach..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            disabled={isLoading}
            className="flex-1 bg-transparent border-none text-[#dbdee1] placeholder:text-[#949ba4] focus:outline-none py-2.5"
          />
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="p-2 text-[#b5bac1] hover:text-[#dbdee1] disabled:opacity-50 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

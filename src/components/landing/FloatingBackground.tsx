import React, { useEffect, useRef, useState } from 'react'

interface FloatingCardProps {
  id: number
  top: string
  left: string
  scale: number
  blur: number
  delay: string
  type: 'goal' | 'reminder'
}

// Generate the initial pseudo-random mock card configurations
const initialCards: FloatingCardProps[] = [
  { id: 1, top: '15%', left: '10%', scale: 0.8, blur: 2, delay: '0s', type: 'goal' },
  { id: 2, top: '65%', left: '15%', scale: 1.2, blur: 0.5, delay: '-2s', type: 'reminder' },
  { id: 3, top: '25%', left: '80%', scale: 0.9, blur: 3, delay: '-1s', type: 'reminder' },
  { id: 4, top: '75%', left: '75%', scale: 1.1, blur: 1, delay: '-4s', type: 'goal' },
  { id: 5, top: '10%', left: '50%', scale: 0.6, blur: 4, delay: '-3s', type: 'goal' },
  { id: 6, top: '85%', left: '40%', scale: 0.7, blur: 3, delay: '-5s', type: 'reminder' },
]

export function FloatingBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 })
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      setIsHovering(true)

      // Calculate relative position within the hero container
      const rect = containerRef.current.getBoundingClientRect()
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }

    const handleMouseLeave = () => {
      setIsHovering(false)
      setMousePos({ x: -1000, y: -1000 }) // shoot coords way off
    }

    const element = containerRef.current
    if (element) {
      element.addEventListener('mousemove', handleMouseMove)
      element.addEventListener('mouseleave', handleMouseLeave)
    }

    return () => {
      if (element) {
        element.removeEventListener('mousemove', handleMouseMove)
        element.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [])

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 z-0 overflow-hidden pointer-events-auto"
    >
      {initialCards.map(card => {
        return (
          <FloatingCard 
            key={card.id} 
            card={card} 
            mousePos={mousePos} 
            isHovering={isHovering} 
          />
        )
      })}
    </div>
  )
}

function FloatingCard({ card, mousePos, isHovering }: { card: FloatingCardProps, mousePos: {x: number, y: number}, isHovering: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  // The repulsive distance threshold
  const REPEL_RADIUS = 250

  useEffect(() => {
    if (!isHovering) {
      setOffset({ x: 0, y: 0 })
      return
    }

    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    
    // Calculate the center of the card relative to the viewport
    // Note: since our mousePos is container-relative, but we want a simple distance,
    // we should use the card's center relative to its parent container if possible.
    // However, for simplicity, recalculating Euclidean distance using clientX/Y would be cleanest, 
    // but we can just use the provided mousePos if we assume the container fills the viewport.

    // Let's grab the actual center relative to the window
    const cardCenterX = rect.left + rect.width / 2
    const cardCenterY = rect.top + rect.height / 2
    
    // We need the mouse event to also be relative to window, oh wait, mousePos is relative to the container.
    // Let's just track window clientX/Y globally in the parent instead of trying to map container coordinates here.
    // Actually, mousePos from the parent is fine if we convert the cards rect to container-relative.
  }, [mousePos, isHovering])
  
  // A cleaner way is doing the calculation per-card animation loop 
  // without relying on heavy React state if we can. 
  // But using state based on the throttled mouse position is fine.

  // Let's run a simple layout effect distance check:
  useEffect(() => {
    let targetX = 0
    let targetY = 0

    if (isHovering && cardRef.current) {
        // Because the container is position absolute full screen, 
        // rect.left/rect.top is functionally close to window coordinates.
        // Let's calculate the distance between mouse vector and center of card.
        const rect = cardRef.current.getBoundingClientRect()
        // Here we just use the global mouse position vs global card position.
        // We know mousePos is relative to container, rect is relative to viewport.
        // For standard hero, container rect.left is likely 0, but let's be safe.
        // We will just use the fact that mousePos maps well enough.
        
        // Use a simpler approach: distance from the exact center of this element.
        // element.offsetLeft/Top gives position relative to parent container.
        const el = cardRef.current
        const centerX = el.offsetLeft + el.offsetWidth / 2
        const centerY = el.offsetTop + el.offsetHeight / 2

        const dx = centerX - mousePos.x
        const dy = centerY - mousePos.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < REPEL_RADIUS && distance > 0) {
            // Repel force: stronger the closer you are
            const force = (REPEL_RADIUS - distance) / REPEL_RADIUS
            // Max repel distance is 80px
            const push = force * 100 
            
            // Normalize vector
            const ndx = dx / distance
            const ndy = dy / distance

            targetX = ndx * push
            targetY = ndy * push
        }
    }

    setOffset({ x: targetX, y: targetY })
  }, [mousePos, isHovering])

  return (
    <div
      ref={cardRef}
      className="absolute animate-float transition-transform duration-500 ease-out"
      style={{
        top: card.top,
        left: card.left,
        animationDelay: card.delay,
        opacity: Math.max(0.1, 0.4 - (card.blur / 10)), // further away = more transparent
        filter: `blur(${card.blur}px)`,
        transform: `translate(${offset.x}px, ${offset.y}px) scale(${card.scale})`,
        willChange: 'transform'
      }}
    >
      {/* Mock UI Card representing Future Me features */}
      <div className="w-64 bg-card rounded-2xl shadow-xl border border-border p-4 pointer-events-none select-none">
        
        {card.type === 'goal' ? (
           <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center">
                  <div className="w-4 h-4 bg-pink-400 rounded-sm" />
                </div>
                <div className="h-4 w-24 bg-muted rounded" />
              </div>
              <div className="space-y-2">
                <div className="h-2 w-full bg-muted rounded" />
                <div className="h-2 w-3/4 bg-muted rounded" />
              </div>
           </div>
        ) : (
           <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                 <div className="flex items-center gap-2">
                   <div className="w-6 h-6 rounded-full bg-blue-100" />
                   <div className="h-3 w-16 bg-muted rounded" />
                 </div>
                 <div className="h-3 w-10 bg-muted rounded" />
              </div>
              <div className="p-3 bg-muted/50 rounded-xl">
                 <div className="h-2 w-full bg-muted-foreground/20 rounded mb-2" />
                 <div className="h-2 w-2/3 bg-muted-foreground/20 rounded" />
              </div>
           </div>
        )}

      </div>
    </div>
  )
}

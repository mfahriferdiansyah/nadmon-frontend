"use client"

import type React from "react"
import { useRef, useEffect, useState, useCallback } from "react"
import type { PokemonCard } from "@/types/card"
import Image from "next/image"

interface GameCanvasProps {
  equippedMonsters: PokemonCard[]
}

interface MonsterPosition {
  id: number
  x: number
  y: number
  targetX: number
  targetY: number
  velocityX: number
  velocityY: number
  card: PokemonCard
  lastMovement: number
  lastDirectionChange: number
  scale: number
  rotation: number
  isIdle: boolean
  idleStartTime: number
  facingLeft: boolean
  movementDistance: number
  // New randomization properties
  movementOffset: number
  idleOffset: number
  personalitySpeed: number
  // Interaction properties
  isHovered: boolean
  hoverStartTime: number
  // Running properties
  isRunning: boolean
  runStartTime: number
  runTargetX: number
  runTargetY: number
  // Touch interaction properties
  touchCount: number
  runThreshold: number
  isShowingLove: boolean
  loveStartTime: number
  lastTouchTime: number
  // Hover avoidance properties
  isCaught: boolean
  caughtStartTime: number
  lastHoverTime: number
  // Thought bubble properties
  isThinking: boolean
  thoughtStartTime: number
  currentThought: string
  nextThoughtTime: number
  thoughtDuration: number
}

interface StarParticle {
  id: number
  x: number
  y: number
  opacity: number
  scale: number
  rotation: number
  delay: number
}

interface LoveParticle {
  id: number
  x: number
  y: number
  opacity: number
  scale: number
  delay: number
}

interface ThoughtBubble {
  id: number
  x: number
  y: number
  text: string
  opacity: number
  scale: number
  duration: number
}

// Cute and fun thoughts for monsters using icon style
const MONSTER_THOUGHTS = [
  "I wonder what's for dinner...",
  "Maybe I should take a nap",
  "This place is pretty nice!",
  "I love being here with you!",
  "I wish I had a toy to play with",
  "What a beautiful day!",
  "I wonder what's over there...",
  "Feeling a bit sleepy...",
  "Something smells delicious!",
  "La la la~ ♪",
  "I'm so happy!",
  "The flowers smell lovely",
  "Ooh, a butterfly!",
  "Should I go for a run?",
  "I love making friends!",
  "I'm feeling lucky today!",
  "Time flies so fast...",
  "What should I do next?",
  "This is my favorite spot!",
  "Life is like a carnival!",
  "I hope good things happen!",
  "Adventures await!",
  "Feeling light as air!",
  "Going with the flow...",
  "Sunshine makes me happy!"
]

export function GameCanvas({ equippedMonsters }: GameCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [monsterPositions, setMonsterPositions] = useState<MonsterPosition[]>([])
  const [hoveredMonsterId, setHoveredMonsterId] = useState<number | null>(null)
  const [starParticles, setStarParticles] = useState<StarParticle[]>([])
  const [loveParticles, setLoveParticles] = useState<LoveParticle[]>([])
  const animationRef = useRef<number>()
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })

  // Update canvas size on resize
  useEffect(() => {
    const updateCanvasSize = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect()
        setCanvasSize({ width: rect.width, height: rect.height })
      }
    }

    updateCanvasSize()
    window.addEventListener('resize', updateCanvasSize)
    return () => window.removeEventListener('resize', updateCanvasSize)
  }, [])

  // Mouse position tracking removed - monsters no longer run from cursor

  // Initialize monster positions when equipped monsters change
  useEffect(() => {
    const validMonsters = equippedMonsters.filter(monster => monster && monster.id)
    
    if (validMonsters.length === 0) {
      setMonsterPositions([])
      return
    }

    setMonsterPositions(prevPositions => {
      const newPositions = validMonsters.map((monster, index) => {
        const existingPosition = prevPositions.find(pos => pos.id === monster.id)
        if (existingPosition) {
          return existingPosition
        }
        
        // Direct spawn in bottom 10-40% area (safe zone)
        const minY = canvasSize.height * 0.6 // 60% from top = 40% from bottom  
        const maxY = canvasSize.height * 0.9 // 90% from top = 10% from bottom
        const margin = 100
        const now = Date.now()
        
        // Ensure canvas size is available before spawning
        if (canvasSize.width === 0 || canvasSize.height === 0) {
          // Default positioning if canvas size not ready
          const x = 300 + index * 200
          const y = 400 + Math.random() * 100
          
          return {
            id: monster.id,
            x,
            y,
            targetX: x,
            targetY: y,
            velocityX: 0,
            velocityY: 0,
            card: monster,
            lastMovement: now,
            lastDirectionChange: now,
            scale: 1,
            rotation: 0,
            isIdle: true,
            idleStartTime: now,
            facingLeft: false,
            movementDistance: 0,
            movementOffset: Math.random() * 3000,
            idleOffset: Math.random() * 2000,
            personalitySpeed: 0.8 + Math.random() * 0.4,
            isHovered: false,
            hoverStartTime: 0,
            isRunning: false,
            runStartTime: 0,
            runTargetX: 0,
            runTargetY: 0,
            touchCount: 0,
            runThreshold: 1 + Math.floor(Math.random() * 2), // 1-2 touches
            isShowingLove: false,
            loveStartTime: 0,
            lastTouchTime: 0,
            isCaught: false,
            caughtStartTime: 0,
            lastHoverTime: 0,
            isThinking: false,
            thoughtStartTime: 0,
            currentThought: "",
            nextThoughtTime: now + 5000 + Math.random() * 10000, // 5-15 seconds from now
            thoughtDuration: 3000 + Math.random() * 2000 // 3-5 seconds duration
          }
        }
        
        // More distributed initial positioning within allowed area
        const sectors = 3 // Divide area into sectors for better distribution
        const sectorWidth = (canvasSize.width - margin * 2) / sectors
        const sectorIndex = index % sectors
        const sectorX = margin + sectorIndex * sectorWidth + Math.random() * sectorWidth
        
        const x = Math.max(margin, Math.min(canvasSize.width - margin, sectorX))
        const y = minY + Math.random() * (maxY - minY) // Ensure spawn within exact area
        
        return {
          id: monster.id,
          x,
          y,
          targetX: x,
          targetY: y,
          velocityX: 0,
          velocityY: 0,
          card: monster,
          lastMovement: now,
          lastDirectionChange: now,
          scale: 1,
          rotation: 0,
          isIdle: true, // Start in idle state
          idleStartTime: now,
          facingLeft: false, // Default facing right
          movementDistance: 0,
          // Randomization for natural behavior
          movementOffset: Math.random() * 3000, // 0-3 second offset for movement timing
          idleOffset: Math.random() * 2000, // 0-2 second offset for idle timing
          personalitySpeed: 0.8 + Math.random() * 0.4, // 0.8-1.2x speed multiplier
          // Interaction states
          isHovered: false,
          hoverStartTime: 0,
          // Running states
          isRunning: false,
          runStartTime: 0,
          runTargetX: x,
          runTargetY: y,
          // Touch interaction states
          touchCount: 0,
          runThreshold: 1 + Math.floor(Math.random() * 2), // 1-2 touches
          isShowingLove: false,
          loveStartTime: 0,
          lastTouchTime: 0,
          // Hover avoidance states
          isCaught: false,
          caughtStartTime: 0,
          lastHoverTime: 0,
          // Thought bubble states
          isThinking: false,
          thoughtStartTime: 0,
          currentThought: "",
          nextThoughtTime: now + 5000 + Math.random() * 10000, // 5-15 seconds from now
          thoughtDuration: 3000 + Math.random() * 2000 // 3-5 seconds duration
        }
      })
      
      return newPositions
    })
  }, [equippedMonsters, canvasSize])

  // Generate new random target for a monster with movement constraints
  const generateNewTarget = useCallback((monster: MonsterPosition) => {
    const minY = canvasSize.height * 0.6 // Bottom 40%
    const maxY = canvasSize.height * 0.9 // Bottom 10%
    const margin = 100
    
    // Movement distance constraints (50-200 pixels) with personality
    const baseMinMovement = 50
    const baseMaxMovement = 200
    const minMovement = baseMinMovement * monster.personalitySpeed
    const maxMovement = baseMaxMovement * monster.personalitySpeed
    const movementDistance = minMovement + Math.random() * (maxMovement - minMovement)
    
    // Generate target within movement distance
    const angle = Math.random() * Math.PI * 2
    let targetX = monster.x + Math.cos(angle) * movementDistance
    let targetY = monster.y + Math.sin(angle) * movementDistance
    
    // Keep within bounds
    targetX = Math.max(margin, Math.min(canvasSize.width - margin, targetX))
    targetY = Math.max(minY, Math.min(maxY, targetY))
    
    return { targetX, targetY, movementDistance }
  }, [canvasSize])

  // Handle monster hover with avoidance behavior
  const handleMonsterHover = useCallback((monsterId: number, isHovering: boolean) => {
    setHoveredMonsterId(isHovering ? monsterId : null)
    
    setMonsterPositions(prev => prev.map(monster => {
      if (monster.id === monsterId) {
        const now = Date.now()
        const timeSinceCaught = now - monster.caughtStartTime
        
        // If monster is caught, don't react to hover for 5 seconds
        if (monster.isCaught && timeSinceCaught < 5000) {
          return {
            ...monster,
            isHovered: isHovering,
            hoverStartTime: isHovering ? now : monster.hoverStartTime
          }
        }
        

        
        return {
          ...monster,
          isHovered: isHovering,
          hoverStartTime: isHovering ? now : monster.hoverStartTime,
          lastHoverTime: isHovering ? now : monster.lastHoverTime
        }
      }
      return monster
    }))

    // Generate star particles on hover start (only if not running away)
    if (isHovering) {
      const monster = monsterPositions.find(m => m.id === monsterId)
      if (monster && !monster.isRunning) {
        const newParticles: StarParticle[] = Array.from({ length: 3 }, (_, i) => ({
          id: Date.now() + i,
          x: monster.x + (Math.random() - 0.5) * 40,
          y: monster.y + (Math.random() - 0.5) * 40,
          opacity: 1,
          scale: 0.5 + Math.random() * 0.3,
          rotation: Math.random() * 360,
          delay: i * 100
        }))
        setStarParticles(prev => [...prev, ...newParticles])
      }
    }
  }, [monsterPositions, canvasSize])

  // Handle monster touch with love/run logic
  const handleMonsterClick = useCallback((monsterId: number) => {
    setMonsterPositions(prev => prev.map(monster => {
      if (monster.id === monsterId) {
        const now = Date.now()
        // Always show love when clicked (no more touch counting)
        return {
          ...monster,
          isShowingLove: true,
          loveStartTime: now,
          lastTouchTime: now,
          isIdle: false, // Exit idle to show love animation
          isCaught: true, // Set caught state
          caughtStartTime: now // Start caught timer
        }
      }
      return monster
    }))

    // Always generate love particles when clicked (fixed)
    const clickedMonster = monsterPositions.find(m => m.id === monsterId)
    if (clickedMonster) {
      const newLoveParticles: LoveParticle[] = Array.from({ length: 3 }, (_, i) => ({
        id: Date.now() + i + 1000, // Ensure unique IDs
        x: clickedMonster.x + (Math.random() - 0.5) * 40,
        y: clickedMonster.y - 10 + (Math.random() - 0.5) * 20,
        opacity: 1,
        scale: 0.8 + Math.random() * 0.4,
        delay: i * 150
      }))
      setLoveParticles(prev => [...prev, ...newLoveParticles])
    }
  }, [canvasSize, monsterPositions, hoveredMonsterId])

  // Animation loop
  const animate = useCallback(() => {
    setMonsterPositions(prev => {
      const now = Date.now()
      
      return prev.map(monster => {
        const timeSinceLastMove = now - monster.lastMovement - monster.movementOffset
        const timeSinceDirectionChange = now - monster.lastDirectionChange
        const idleDuration = now - monster.idleStartTime - monster.idleOffset
        const runDuration = now - monster.runStartTime
        const loveDuration = now - monster.loveStartTime
        const timeSinceCaught = now - monster.caughtStartTime
        const thoughtDuration = now - monster.thoughtStartTime
        
        // Thought bubble logic - only when idle and no interaction
        let updatedMonster = { ...monster }
        
        // Check if it's time to start a new thought
        if (!monster.isThinking && 
            !monster.isHovered && 
            !monster.isRunning && 
            !monster.isShowingLove && 
            monster.isIdle &&
            now >= monster.nextThoughtTime) {
          
          const randomThought = MONSTER_THOUGHTS[Math.floor(Math.random() * MONSTER_THOUGHTS.length)]
          updatedMonster = {
            ...monster,
            isThinking: true,
            thoughtStartTime: now,
            currentThought: randomThought,
            thoughtDuration: 3000 + Math.random() * 2000 // 3-5 seconds
          }
        }
        
        // Check if current thought should end
        if (monster.isThinking && thoughtDuration > monster.thoughtDuration) {
          updatedMonster = {
            ...updatedMonster,
            isThinking: false,
            currentThought: "",
            nextThoughtTime: now + 8000 + Math.random() * 12000 // Next thought in 8-20 seconds
          }
        }
        
        // If interaction happens, cancel current thought
        if (monster.isThinking && (monster.isHovered || monster.isRunning || monster.isShowingLove || !monster.isIdle)) {
          updatedMonster = {
            ...updatedMonster,
            isThinking: false,
            currentThought: "",
            nextThoughtTime: now + 5000 + Math.random() * 10000 // Reset timer
          }
        }
        
        monster = updatedMonster
        
        // Mouse proximity running behavior removed - monsters no longer flee from cursor
        
        // Love/Happy behavior - takes priority over idle/movement but not running
        if (monster.isShowingLove && !monster.isRunning) {
          const loveTime = 800 + Math.random() * 400 // Show love for 0.8-1.2 seconds (shorter)
          
          if (loveDuration < loveTime) {
            // Up-and-down wiggling with random rotation
            const wiggleFreq = 0.02 * monster.personalitySpeed // Faster wiggle frequency
            const wiggleAmount = 2 // Wiggle intensity in pixels
            const hoverScale = monster.isHovered ? 1.15 : 1
            
            // Wiggle up and down
            const wiggleY = Math.sin(now * wiggleFreq) * wiggleAmount
            // Random small rotation wiggle
            const rotationWiggle = Math.sin(now * wiggleFreq * 1.3) * (3 + Math.random() * 3) // 3-6 degrees random
            
            return {
              ...monster,
              scale: 1.0 * hoverScale,
              rotation: rotationWiggle,
              y: monster.y + wiggleY,
              velocityX: monster.velocityX * 0.95, // Slow down movement
              velocityY: monster.velocityY * 0.95
            }
          } else {
            // End love state and transition to idle
            return {
              ...monster,
              isShowingLove: false,
              isIdle: true,
              idleStartTime: now,
              idleOffset: Math.random() * 1000
            }
          }
        }
        
        // Proximity-triggered running removed - monsters no longer run from mouse cursor
        
        // Running behavior - takes priority over all other behaviors
        if (monster.isRunning) {
          const runTime = 2000 + Math.random() * 1000 // Run for 2-3 seconds
          
          if (runDuration < runTime) {
            // Calculate distance to run target
            const deltaX = monster.runTargetX - monster.x
            const deltaY = monster.runTargetY - monster.y
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
            
            // Running physics - energetic but natural
            const runSpeed = 0.9 * monster.personalitySpeed // 2.25x normal speed (energetic but natural)
            const runFriction = 0.94 // Slightly less friction for smoother running
            
            let newVelocityX = monster.velocityX
            let newVelocityY = monster.velocityY
            
            if (distance > 5) {
              // Add force towards run target
              const forceX = (deltaX / distance) * runSpeed
              const forceY = (deltaY / distance) * runSpeed
              
              newVelocityX += forceX
              newVelocityY += forceY
            }
            
            // Apply friction
            newVelocityX *= runFriction
            newVelocityY *= runFriction
            
            // Update position
            let newX = monster.x + newVelocityX
            let newY = monster.y + newVelocityY
            
            // Keep within bounds
            const minY = canvasSize.height * 0.6
            const maxY = canvasSize.height * 0.9
            const margin = 80
            
            if (newX < margin || newX > canvasSize.width - margin) {
              newVelocityX *= -0.3
              newX = Math.max(margin, Math.min(canvasSize.width - margin, newX))
            }
            
            if (newY < minY || newY > maxY) {
              newVelocityY *= -0.3
              newY = Math.max(minY, Math.min(maxY, newY))
            }
            
            // Determine facing direction while running
            let newFacingLeft = monster.facingLeft
            if (timeSinceDirectionChange > 500 && Math.abs(deltaX) > 10) { // Faster direction changes when running
              if (deltaX < -5 && !monster.facingLeft) {
                newFacingLeft = true
              } else if (deltaX > 5 && monster.facingLeft) {
                newFacingLeft = false
              }
            }
            
            const directionChanged = newFacingLeft !== monster.facingLeft
            
            // Running animation effects - more energetic
            const speed_factor = Math.sqrt(newVelocityX * newVelocityX + newVelocityY * newVelocityY)
            const runScale = 1.1 + Math.sin(now * 0.01) * 0.1 + speed_factor * 0.03 // Bouncy running animation
            const hoverScale = monster.isHovered ? 1.15 : 1
            const rotation = Math.atan2(newVelocityY, newVelocityX) * 3 // More rotation when running
            
            return {
              ...monster,
              x: newX,
              y: newY,
              velocityX: newVelocityX,
              velocityY: newVelocityY,
              lastDirectionChange: directionChanged ? now : monster.lastDirectionChange,
              scale: Math.max(1.0, Math.min(1.3, runScale * hoverScale)),
              rotation: Math.max(-8, Math.min(8, rotation)),
              facingLeft: newFacingLeft
            }
          } else {
            // End running state - simple flip toward back and act normal
            const awayFromStartX = monster.x - monster.runTargetX
            const shouldFaceLeft = awayFromStartX > 0 // Face away from where they were running to
            
            return {
              ...monster,
              isRunning: false,
              isIdle: true,
              idleStartTime: now,
              idleOffset: Math.random() * 1000,
              targetX: monster.x,
              targetY: monster.y,
              facingLeft: shouldFaceLeft, // Simple directional flip
              velocityX: 0, // Stop completely
              velocityY: 0,
              scale: 1.0, // Return to normal scale
              rotation: 0 // Return to normal rotation
            }
          }
        }
        
        // Idle behavior - monsters stay still for varied durations based on personality
        if (monster.isIdle) {
          const baseIdleTime = 3000 + Math.random() * 5000 // 3-8 seconds
          const personalizedIdleTime = baseIdleTime / monster.personalitySpeed // Faster personality = shorter idle
          
          if (idleDuration < personalizedIdleTime) {
            // Stay idle with subtle breathing animation
            const breathe = 0.95 + Math.sin(now * 0.002 * monster.personalitySpeed) * 0.05
            const hoverScale = monster.isHovered ? 1.1 : 1
            
            return {
              ...monster,
              scale: breathe * hoverScale,
              velocityX: monster.velocityX * 0.9, // Slow down to stop
              velocityY: monster.velocityY * 0.9,
              x: monster.x + monster.velocityX,
              y: monster.y + monster.velocityY
            }
          } else {
            // End idle state and generate new target
            const newTarget = generateNewTarget(monster)
            return {
              ...monster,
              targetX: newTarget.targetX,
              targetY: newTarget.targetY,
              movementDistance: newTarget.movementDistance,
              isIdle: false,
              lastMovement: now,
              movementOffset: Math.random() * 1000 // New random offset for next cycle
            }
          }
        }
        
        // Movement behavior with personality-based timing
        const baseMovementTime = 4000 + Math.random() * 3000 // 4-7 seconds
        const personalizedMovementTime = baseMovementTime * monster.personalitySpeed
        const shouldStartIdle = timeSinceLastMove > personalizedMovementTime
        
        if (shouldStartIdle) {
          return {
            ...monster,
            isIdle: true,
            idleStartTime: now,
            idleOffset: Math.random() * 1000, // New random offset
            targetX: monster.x, // Stop at current position
            targetY: monster.y
          }
        }
        
        // Calculate distance to target
        const deltaX = monster.targetX - monster.x
        const deltaY = monster.targetY - monster.y
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
        
        // Determine facing direction with minimum movement threshold
        let newFacingLeft = monster.facingLeft
        if (timeSinceDirectionChange > 1000 && Math.abs(deltaX) > 20) { // Minimum 1 second between flips and 20px movement
          if (deltaX < -10 && !monster.facingLeft) {
            newFacingLeft = true
          } else if (deltaX > 10 && monster.facingLeft) {
            newFacingLeft = false
          }
        }
        
        const directionChanged = newFacingLeft !== monster.facingLeft
        
        // Apply movement with personality-based physics
        const baseSpeed = 0.4
        const personalizedSpeed = baseSpeed * monster.personalitySpeed
        const friction = 0.88
        
        let newVelocityX = monster.velocityX
        let newVelocityY = monster.velocityY
        
        if (distance > 3) {
          // Add force towards target
          const forceX = (deltaX / distance) * personalizedSpeed
          const forceY = (deltaY / distance) * personalizedSpeed
          
          newVelocityX += forceX
          newVelocityY += forceY
        }
        
        // Apply friction
        newVelocityX *= friction
        newVelocityY *= friction
        
        // Update position
        let newX = monster.x + newVelocityX
        let newY = monster.y + newVelocityY
        
        // Keep within bounds (bottom 10-40% area)
        const minY = canvasSize.height * 0.6
        const maxY = canvasSize.height * 0.9
        const margin = 80
        
        if (newX < margin || newX > canvasSize.width - margin) {
          newVelocityX *= -0.3
          newX = Math.max(margin, Math.min(canvasSize.width - margin, newX))
        }
        
        if (newY < minY || newY > maxY) {
          newVelocityY *= -0.3
          newY = Math.max(minY, Math.min(maxY, newY))
        }
        
        // Calculate animation effects - more subtle with hover enhancement
        const speed_factor = Math.sqrt(newVelocityX * newVelocityX + newVelocityY * newVelocityY)
        const baseScale = 0.95 + Math.sin(now * 0.003 * monster.personalitySpeed) * 0.05 + speed_factor * 0.01
        const hoverScale = monster.isHovered ? 1.15 : 1
        const rotation = Math.atan2(newVelocityY, newVelocityX) * 2 // Subtle rotation
        
        return {
          ...monster,
          x: newX,
          y: newY,
          velocityX: newVelocityX,
          velocityY: newVelocityY,
          lastDirectionChange: directionChanged ? now : monster.lastDirectionChange,
          scale: Math.max(0.9, Math.min(1.2, baseScale * hoverScale)),
          rotation: Math.max(-5, Math.min(5, rotation)),
          facingLeft: newFacingLeft
        }
      })
    })

    // Animate star particles
    setStarParticles(prev => prev.map(particle => ({
      ...particle,
      y: particle.y - 1,
      opacity: Math.max(0, particle.opacity - 0.02),
      scale: particle.scale + 0.01,
      rotation: particle.rotation + 2
    })).filter(particle => particle.opacity > 0))

    // Animate love particles
    setLoveParticles(prev => prev.map(particle => ({
      ...particle,
      y: particle.y - 1.5,
      opacity: Math.max(0, particle.opacity - 0.025),
      scale: particle.scale + 0.008
    })).filter(particle => particle.opacity > 0))
    
    animationRef.current = requestAnimationFrame(animate)
  }, [generateNewTarget, canvasSize])

  // Start/stop animation
  useEffect(() => {
    if (monsterPositions.length > 0 && canvasSize.width > 0) {
      animationRef.current = requestAnimationFrame(animate)
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [animate, monsterPositions.length, canvasSize])

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/game-background.webp"
          alt="Game Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Monster Canvas */}
      <div 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full overflow-hidden"
      >
        {/* Animated Monsters */}
        {monsterPositions.map((position) => (
          <div
            key={position.id}
            className="absolute transition-transform duration-150 ease-out z-10 cursor-pointer"
            style={{
              left: `${position.x - 40}px`, // Center the 80px wide monster
              top: `${position.y - 40}px`,  // Center the 80px tall monster
              transform: `scale(${position.scale}) rotate(${position.rotation}deg) ${position.facingLeft ? 'scaleX(-1)' : ''}`,
            }}
            onMouseEnter={() => handleMonsterHover(position.id, true)}
            onMouseLeave={() => handleMonsterHover(position.id, false)}
            onClick={() => handleMonsterClick(position.id)}
          >
            {/* Monster Image Only */}
            <div className="relative w-20 h-20 drop-shadow-lg">
              <Image
                src={`/monster/${position.card.id}.png`}
                alt={position.card.name}
                fill
                className="object-contain"
                style={{
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                }}
              />
              {/* Subtle glow effect */}
              <div 
                className="absolute inset-0 rounded-full blur-sm opacity-30 -z-10"
                style={{
                  background: `radial-gradient(circle, ${position.card.color}40 0%, transparent 70%)`
                }}
              />
              
              {/* Idle indicator - subtle pulse when idle */}
              {position.isIdle && !position.isHovered && (
                <div 
                  className="absolute inset-0 rounded-full blur-md opacity-20 -z-20 animate-pulse"
                  style={{
                    background: `radial-gradient(circle, ${position.card.color}60 0%, transparent 50%)`
                  }}
                />
              )}

              {/* Hover glow effect */}
              {position.isHovered && (
                <div 
                  className="absolute inset-0 rounded-full blur-lg opacity-40 -z-10 animate-pulse"
                  style={{
                    background: `radial-gradient(circle, ${position.card.color}80 0%, transparent 60%)`
                  }}
                />
              )}


            </div>

            {/* Hover Tooltip - Fix for flipped monsters */}
            {position.isHovered && (
              <div 
                className="absolute -top-8 left-1/2 bg-black/80 text-white px-2 py-1 rounded text-xs font-medium whitespace-nowrap z-20"
                style={{
                  transform: `translateX(-50%) ${position.facingLeft ? 'scaleX(-1)' : ''}`,
                }}
              >
                {position.card.name}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-black/80"></div>
              </div>
            )}

            {/* Thought Bubble */}
            {position.isThinking && position.currentThought && (
              <div 
                className="absolute -top-8 left-1/2 bg-black/80 text-white px-2 py-1 rounded text-xs font-medium whitespace-nowrap z-15"
                style={{
                  transform: `translateX(-50%) ${position.facingLeft ? 'scaleX(-1)' : ''}`,
                }}
              >
                {position.currentThought}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-black/80"></div>
              </div>
            )}
          </div>
        ))}

        {/* Star Particles */}
        {starParticles.map((particle) => (
          <div
            key={particle.id}
            className="absolute pointer-events-none z-30"
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              opacity: particle.opacity,
              transform: `scale(${particle.scale}) rotate(${particle.rotation}deg)`,
              transition: 'all 0.1s ease-out'
            }}
          >
            <div className="text-yellow-400 text-lg">⭐</div>
          </div>
        ))}

        {/* Love Particles */}
        {loveParticles.map((particle) => {
          // Create breathing/yawning effect based on particle lifetime
          const breathePhase = (Date.now() + particle.id) * 0.003;
          const breatheScale = 1 + Math.sin(breathePhase) * 0.2; // Gentle breathing scale
          const breatheOpacity = 0.8 + Math.sin(breathePhase * 0.8) * 0.15; // Subtle opacity breathing
          
          return (
            <div
              key={particle.id}
              className="absolute pointer-events-none z-30"
              style={{
                left: `${particle.x}px`,
                top: `${particle.y}px`,
                opacity: particle.opacity * breatheOpacity,
                transform: `scale(${particle.scale * breatheScale})`,
                transition: 'all 0.1s ease-out'
              }}
            >
              <div className="relative flex items-center justify-center">
                {/* Stylized floating heart that matches game art style with yawning effect */}
                <div 
                  className="relative"
                  style={{
                    transform: `scale(${breatheScale}) rotate(${Math.sin(breathePhase * 0.5) * 2}deg)`, // Gentle rotation yawn
                  }}
                >
                  {/* Main heart shape using CSS */}
                  <div 
                    className="w-3 h-3 bg-gradient-to-br from-pink-300 via-pink-400 to-pink-500 transform rotate-45 relative"
                    style={{
                      filter: `drop-shadow(0 2px 6px rgba(236, 72, 153, ${0.5 * breatheOpacity}))`,
                      borderRadius: '0 50% 50% 50%'
                    }}
                  >
                    {/* Left heart bulb with breathing */}
                    <div 
                      className="absolute -left-1.5 -top-0.5 w-2.5 h-2.5 bg-gradient-to-br from-pink-300 to-pink-500 rounded-full"
                      style={{
                        transform: `scale(${1 + Math.sin(breathePhase * 1.2) * 0.1})` // Individual bulb breathing
                      }}
                    />
                    {/* Right heart bulb with breathing */}
                    <div 
                      className="absolute -right-0.5 -top-1.5 w-2.5 h-2.5 bg-gradient-to-br from-pink-300 to-pink-500 rounded-full"
                      style={{
                        transform: `scale(${1 + Math.sin(breathePhase * 1.1) * 0.1})` // Slightly different rhythm
                      }}
                    />
                  </div>
                  {/* Sparkle highlight with twinkling */}
                  <div 
                    className="absolute top-0 left-0.5 w-1 h-1 bg-pink-100 rounded-full"
                    style={{
                      opacity: 0.6 + Math.sin(breathePhase * 2) * 0.4 // Twinkling effect
                    }}
                  />
                </div>
              </div>
            </div>
          )
        })}

        {/* Empty State Message */}
        {equippedMonsters.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="glass-panel rounded-2xl p-8 backdrop-blur-md bg-white/10 border border-white/20 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">No Monsters Equipped</h3>
              <p className="text-white/70 mb-6">
                Open your inventory and equip some monsters to see them roam the battlefield!
              </p>
              <div className="text-4xl mb-4">🐾</div>
              <p className="text-white/50 text-sm">
                Equip up to 3 monsters at once and hover over them to interact!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 
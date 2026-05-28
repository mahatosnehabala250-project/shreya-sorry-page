'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Sparkles, Crown } from 'lucide-react'

const sorryMessages = [
  "Shreya, I'm Really Sorry! 🥺",
  "Please Maaf Kar Do! 😢",
  "I Promise I Won't Do It Again! 🙏",
  "Sir Maaf Kardo Shreya! 🙇‍♂️",
  "Ab Toh Maaf Hi Kar Do! 😭",
  "Dil Se Sorry Shreya! 💖",
]

const noBtnLabels = [
  "Nahi Maf Karunga! 😤",
  "Pakdi? Pakad Ke Dikhao! 😏",
  "Ha Ha Nahi! 🏃‍♂️",
  "Idhar Udhar Mat Bhago! 😅",
  "Pakad Nahi Paya! 😝",
  "Chor De Mujhe! 🏃💨",
  "Wapas Aa Raha Hu... NOT! 🤣",
  "Maaf Kar De Yaar! 🥺",
  "Main Bhagta Rahoonga! 🏃‍♂️💨",
  "Tu Mujhe Kabhi Nahi Pakad Payegi! 😎",
  "Hehe Bhai Bhag! 🏃",
  "Mujhe Mat Pakad! 😱",
]

const praiseMessages = [
  "Tum Itni Achi Ho Ki Dil Khush Ho Gaya! 🌸",
  "Shreya Tumhare Jaisi Koi Nahi! 💎",
  "World's Most Kindest Person = Shreya! 🏆",
  "Tumhari Smile Sabse Pyari Hai! 😊",
  "Shreya Tum Ek Angel Ho! 😇",
  "Har Din Tumhe Thanks Ki Main Maaf Karo! 🙏",
]

export default function Home() {
  const [forgiven, setForgiven] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showFireworks, setShowFireworks] = useState(false)
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number; emoji: string }[]>([])
  const [noBtnLabel, setNoBtnLabel] = useState("Nahi Maf Karunga! 😤")
  const [messageIndex, setMessageIndex] = useState(0)
  const [praiseIndex, setPraiseIndex] = useState(0)
  const [attemptCount, setAttemptCount] = useState(0)
  const [isButtonActivated, setIsButtonActivated] = useState(false)
  const [noBtnPos, setNoBtnPos] = useState({ x: 0, y: 0 })
  const [screenSize, setScreenSize] = useState({ w: 0, h: 0 })

  const containerRef = useRef<HTMLDivElement>(null)
  const heartIdRef = useRef(0)
  const wanderTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Get screen size
  useEffect(() => {
    const updateSize = () => {
      setScreenSize({ w: window.innerWidth, h: window.innerHeight })
    }
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  // Infinite wandering after activation
  useEffect(() => {
    if (!isButtonActivated || forgiven) return

    const wander = () => {
      const btnW = 180
      const btnH = 50
      const pad = 10
      const maxX = screenSize.w - btnW - pad
      const maxY = screenSize.h - btnH - pad

      const newX = pad + Math.random() * maxX
      const newY = pad + Math.random() * maxY

      setNoBtnPos({ x: newX, y: newY })
      setNoBtnLabel(noBtnLabels[Math.floor(Math.random() * noBtnLabels.length)])

      const nextDelay = 800 + Math.random() * 1200
      wanderTimeoutRef.current = setTimeout(wander, nextDelay)
    }

    wander()

    return () => {
      if (wanderTimeoutRef.current) clearTimeout(wanderTimeoutRef.current)
    }
  }, [isButtonActivated, forgiven, screenSize])

  // Touch/mouse proximity tracking for the runaway button
  useEffect(() => {
    if (!isButtonActivated || forgiven) return

    const handlePointer = (clientX: number, clientY: number) => {
      const btnW = 180
      const btnH = 50
      const btnCenterX = noBtnPos.x + btnW / 2
      const btnCenterY = noBtnPos.y + btnH / 2

      const distance = Math.sqrt(
        Math.pow(clientX - btnCenterX, 2) + Math.pow(clientY - btnCenterY, 2)
      )

      // If finger/cursor within 120px, RUN AWAY immediately
      if (distance < 120) {
        const pad = 10
        const maxX = screenSize.w - btnW - pad
        const maxY = screenSize.h - btnH - pad

        // Move in opposite direction
        const angle = Math.atan2(btnCenterY - clientY, btnCenterX - clientX)
        const runDist = 150 + Math.random() * 150
        let newX = btnCenterX + Math.cos(angle) * runDist - btnW / 2
        let newY = btnCenterY + Math.sin(angle) * runDist - btnH / 2

        // Keep within screen
        newX = Math.max(pad, Math.min(maxX, newX))
        newY = Math.max(pad, Math.min(maxY, newY))

        setNoBtnPos({ x: newX, y: newY })
        setNoBtnLabel(noBtnLabels[Math.floor(Math.random() * noBtnLabels.length)])
        setAttemptCount(prev => prev + 1)

        // Change sorry message every 3 attempts
        setMessageIndex(prev => Math.min(prev + 1, sorryMessages.length - 1))
      }
    }

    const handleTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handlePointer(e.touches[0].clientX, e.touches[0].clientY)
      }
    }

    const handleMouse = (e: MouseEvent) => {
      handlePointer(e.clientX, e.clientY)
    }

    window.addEventListener('touchmove', handleTouch, { passive: true })
    window.addEventListener('mousemove', handleMouse)

    return () => {
      window.removeEventListener('touchmove', handleTouch)
      window.removeEventListener('mousemove', handleMouse)
    }
  }, [isButtonActivated, forgiven, noBtnPos, screenSize])

  // Create floating emoji
  const createEmoji = useCallback((x: number, y: number, emoji?: string) => {
    const id = heartIdRef.current++
    const emojis = ['💕', '💖', '🌸', '✨', '🦋', '🌹', '💗', '💝', '🥰', '😇', '🎊', '🎆']
    setHearts(prev => [...prev, {
      id,
      x, y,
      emoji: emoji || emojis[Math.floor(Math.random() * emojis.length)]
    }])
    setTimeout(() => {
      setHearts(prev => prev.filter(h => h.id !== id))
    }, 2500)
  }, [])

  // Activate the runaway button on first touch/click attempt
  const handleNoButtonFirstTouch = useCallback(() => {
    if (!isButtonActivated) {
      setIsButtonActivated(true)
      // Move it to a random position on first touch
      const pad = 20
      const maxX = screenSize.w - 200
      const maxY = screenSize.h - 70
      setNoBtnPos({
        x: pad + Math.random() * maxX,
        y: pad + Math.random() * maxY,
      })
      setNoBtnLabel("Aha! Ab Pakad Ke Dikhao! 😏🏃‍♂️")
      setAttemptCount(1)
    }
  }, [isButtonActivated, screenSize])

  // Handle "Maf Kar Diya" - INSTANT CELEBRATION!
  const handleForgive = useCallback(() => {
    setForgiven(true)
    setShowConfetti(true)
    setShowFireworks(true)

    // Massive emoji burst
    for (let i = 0; i < 25; i++) {
      setTimeout(() => {
        createEmoji(
          Math.random() * screenSize.w,
          Math.random() * screenSize.h
        )
      }, i * 80)
    }

    // Cycle praise messages
    let pIdx = 0
    const praiseInterval = setInterval(() => {
      pIdx = (pIdx + 1) % praiseMessages.length
      setPraiseIndex(pIdx)
    }, 3000)

    // Stop effects
    setTimeout(() => {
      setShowConfetti(false)
      setShowFireworks(false)
    }, 10000)

    setTimeout(() => clearInterval(praiseInterval), 30000)

    // Periodic emoji rain
    const emojiRain = setInterval(() => {
      for (let i = 0; i < 3; i++) {
        createEmoji(Math.random() * screenSize.w, -20)
      }
    }, 500)
    setTimeout(() => clearInterval(emojiRain), 15000)
  }, [screenSize, createEmoji])

  // Confetti
  const confettiColors = ['#ff6b9d', '#c44dff', '#ff4757', '#ffa502', '#2ed573', '#1e90ff', '#ff6348', '#ffd700', '#ff1493', '#00ff88']
  const confettiParticles = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: confettiColors[i % confettiColors.length],
    delay: Math.random() * 3,
    duration: 2 + Math.random() * 4,
    size: 4 + Math.random() * 10,
    isCircle: Math.random() > 0.5,
  }))

  // Firework positions
  const fireworkPositions = [
    { x: 15, y: 20 }, { x: 50, y: 10 }, { x: 85, y: 18 },
    { x: 30, y: 30 }, { x: 70, y: 25 },
  ]

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen flex flex-col overflow-hidden select-none"
      style={{
        background: forgiven
          ? 'linear-gradient(135deg, #fce4ec 0%, #f8bbd0 25%, #f48fb1 50%, #ec407a 75%, #e91e63 100%)'
          : 'linear-gradient(135deg, #fff5f5 0%, #ffe0e6 25%, #ffb3c1 50%, #ff758f 75%, #ff5252 100%)',
        transition: 'background 1s ease',
      }}
    >
      {/* Background floating elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{
              x: Math.random() * screenSize.w,
              y: -50,
              scale: 0.3 + Math.random() * 0.6,
            }}
            animate={{
              y: screenSize.h + 100,
              rotate: 360,
              x: (i % 2 === 0 ? 1 : -1) * (30 + Math.random() * 60),
            }}
            transition={{
              duration: 10 + Math.random() * 12,
              repeat: Infinity,
              delay: Math.random() * 6,
              ease: 'linear',
            }}
          >
            {i % 2 === 0 ? (
              <Heart className="w-5 h-5 text-pink-200/20 fill-pink-200/20" />
            ) : (
              <span className="text-base opacity-20">✨</span>
            )}
          </motion.div>
        ))}
      </div>

      {/* Firework Bursts */}
      <AnimatePresence>
        {showFireworks && fireworkPositions.map((pos, idx) => (
          <motion.div
            key={`fw-${idx}`}
            className="absolute pointer-events-none z-30"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: [0, 3, 4], opacity: [1, 0.8, 0] }}
            transition={{ duration: 1.5, delay: idx * 0.3, repeat: 3, repeatDelay: 1 }}
          >
            <div className="relative">
              {Array.from({ length: 8 }).map((_, j) => (
                <motion.div
                  key={j}
                  className="absolute w-2 h-2 rounded-full"
                  style={{ backgroundColor: confettiColors[(idx + j) % confettiColors.length] }}
                  animate={{
                    x: Math.cos((j / 8) * Math.PI * 2) * 50,
                    y: Math.sin((j / 8) * Math.PI * 2) * 50,
                  }}
                  transition={{ duration: 1, delay: idx * 0.3 }}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Emoji popups */}
      <AnimatePresence>
        {hearts.map(heart => (
          <motion.div
            key={heart.id}
            className="fixed pointer-events-none z-50 text-2xl"
            initial={{ x: heart.x, y: heart.y, scale: 0, opacity: 1 }}
            animate={{ y: heart.y - 180, scale: 1.3, opacity: 0, rotate: Math.random() * 360 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: 'easeOut' }}
          >
            {heart.emoji}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Confetti */}
      <AnimatePresence>
        {showConfetti && confettiParticles.map(p => (
          <motion.div
            key={p.id}
            className="fixed top-0 pointer-events-none z-40"
            style={{
              left: `${p.x}%`,
              width: p.size,
              height: p.size * (p.isCircle ? 1 : 1.5),
              backgroundColor: p.color,
              borderRadius: p.isCircle ? '50%' : '2px',
            }}
            initial={{ y: -30, opacity: 1, rotate: 0 }}
            animate={{
              y: screenSize.h + 80,
              opacity: [1, 1, 0.5, 0],
              rotate: 720 * (Math.random() > 0.5 ? 1 : -1),
              x: (Math.random() - 0.5) * 250,
            }}
            transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
          />
        ))}
      </AnimatePresence>

      {/* ========== MAIN CONTENT ========== */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-5 py-6">
        {/* Image */}
        <motion.div className="relative mb-4" animate={forgiven ? { scale: [1, 1.12, 1] } : {}}>
          <motion.div
            animate={!forgiven ? { y: [0, -8, 0] } : {}}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="relative">
              <img
                src="/sorry-image.png"
                alt="Sorry Shreya"
                className="w-28 h-28 rounded-full object-cover shadow-xl border-4 border-white/70"
              />
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-pink-300/40"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>
          {!forgiven && (
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Sparkles className="w-6 h-6 text-yellow-400" />
            </motion.div>
          )}
          {forgiven && (
            <motion.div
              className="absolute -top-2 -right-2"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <Crown className="w-8 h-8 text-yellow-400" />
            </motion.div>
          )}
        </motion.div>

        {/* Sorry Message */}
        <AnimatePresence mode="wait">
          <motion.h1
            key={forgiven ? 'forgiven' : messageIndex}
            className="text-xl font-extrabold text-center text-rose-700 leading-tight mb-2"
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.9 }}
            transition={{ duration: 0.4 }}
          >
            {forgiven ? "Shreya Ne Maaf Kar Diya! 🎉" : sorryMessages[messageIndex]}
          </motion.h1>
        </AnimatePresence>

        {/* Sub message */}
        {!forgiven && (
          <motion.p
            className="text-rose-600/70 text-center text-sm mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Dil se sorry Shreya! Mujhe maaf kar do 🙏💕
          </motion.p>
        )}

        {/* Attempt counter */}
        {!forgiven && isButtonActivated && attemptCount > 0 && (
          <motion.div
            key={attemptCount}
            className="bg-white/30 backdrop-blur-sm rounded-full px-3 py-1.5 mb-3"
            initial={{ scale: 1.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <span className="text-rose-700 font-semibold text-xs">
              {attemptCount < 3
                ? `Pakadne ki koshish: ${attemptCount} ❌`
                : attemptCount < 6
                ? `${attemptCount} baar try! Pakad nahi paya! 😂`
                : attemptCount < 10
                ? `${attemptCount} attempts! Give up kar! 🤣`
                : `${attemptCount} attempts!! Maaf hi kar de! 😭😂`}
            </span>
          </motion.div>
        )}

        {/* ====== FORGIVEN CELEBRATION ====== */}
        {forgiven && (
          <motion.div
            className="flex flex-col items-center gap-3"
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 150, damping: 12 }}
          >
            <motion.div
              className="text-5xl"
              animate={{ rotate: [0, -15, 15, -10, 10, 0], scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            >
              🎉
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.p
                key={praiseIndex}
                className="text-rose-600 text-center text-base font-medium"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
              >
                {praiseMessages[praiseIndex]}
              </motion.p>
            </AnimatePresence>

            {/* Bouncing emoji */}
            <motion.div
              className="flex gap-2 mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {['🥰', '💕', '👑', '💖', '🦋', '🌹', '✨'].map((emoji, i) => (
                <motion.span
                  key={i}
                  className="text-2xl"
                  animate={{ y: [0, -12, 0], rotate: [0, 8, -8, 0] }}
                  transition={{ duration: 1.2, delay: i * 0.12, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {emoji}
                </motion.span>
              ))}
            </motion.div>

            {/* Love Letter */}
            <motion.div
              className="mt-3 bg-white/40 backdrop-blur-md rounded-2xl p-4 max-w-xs w-full border border-white/50 shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <div className="flex items-center gap-1.5 mb-2">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                <span className="font-bold text-rose-700 text-sm">Shreya Ke Liye</span>
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              </div>
              <p className="text-rose-700 text-xs leading-relaxed">
                Dear Shreya, 💕<br /><br />
                Tum world ki sabse pyari insaan ho! Tumne maaf karke mujhe dubara jeene ka hak diya.
                Main promise karta hoon ki aisi galti dubara nahi karunga.
                Tumhare bina meri duniya adhoori hai! 🌸<br /><br />
                Forever grateful, 🙏💖
              </p>
            </motion.div>

            <motion.button
              onClick={(e) => {
                for (let i = 0; i < 8; i++) {
                  setTimeout(() => {
                    createEmoji(
                      e.clientX + (Math.random() - 0.5) * 150,
                      e.clientY + (Math.random() - 0.5) * 150
                    )
                  }, i * 50)
                }
              }}
              className="mt-2 px-5 py-2.5 bg-white/30 backdrop-blur-sm rounded-full text-rose-700 font-semibold text-sm hover:bg-white/50 transition-all cursor-pointer border border-white/40"
              whileTap={{ scale: 0.9 }}
            >
              More Love 💕
            </motion.button>
          </motion.div>
        )}

        {/* ====== BUTTONS (Not Forgiven) ====== */}
        {!forgiven && !isButtonActivated && (
          <motion.div
            className="flex flex-col items-center gap-3 w-full mt-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {/* Maf Kar Diya */}
            <motion.button
              onClick={handleForgive}
              className="w-full max-w-xs px-6 py-4 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white font-extrabold text-lg rounded-2xl shadow-xl shadow-pink-500/30 cursor-pointer relative overflow-hidden"
              whileTap={{ scale: 0.92 }}
            >
              <span className="flex items-center justify-center gap-2 relative z-10">
                <Heart className="w-5 h-5 fill-white" />
                Maf Kar Diya 💕
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
            </motion.button>

            {/* Nahi Maf Karunga - STEADY, below Maf Kar Diya */}
            <button
              onClick={handleNoButtonFirstTouch}
              onTouchStart={(e) => {
                e.preventDefault()
                handleNoButtonFirstTouch()
              }}
              className="w-full max-w-xs px-6 py-4 bg-gradient-to-r from-gray-400 to-gray-500 text-white font-bold text-lg rounded-2xl shadow-lg cursor-pointer select-none"
            >
              Nahi Maf Karunga! 😤
            </button>
          </motion.div>
        )}

        {/* Hint when buttons are steady */}
        {!forgiven && !isButtonActivated && (
          <motion.p
            className="text-rose-400/50 text-xs text-center mt-3"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Ek option choose karo... 😏
          </motion.p>
        )}
      </div>

      {/* ====== RUNAWAY BUTTON (after activation) ====== */}
      {!forgiven && isButtonActivated && (
        <motion.button
          className="fixed z-50 px-4 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-bold text-sm rounded-2xl shadow-xl cursor-pointer select-none whitespace-nowrap border border-gray-400/50"
          animate={{
            left: noBtnPos.x,
            top: noBtnPos.y,
            rotate: (Math.random() - 0.5) * 20,
          }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 25,
          }}
          onClick={(e) => {
            e.preventDefault()
            // Even if somehow clicked - just run away more!
            const pad = 10
            const maxX = screenSize.w - 200
            const maxY = screenSize.h - 70
            setNoBtnPos({
              x: pad + Math.random() * maxX,
              y: pad + Math.random() * maxY,
            })
            setNoBtnLabel("HAHA! Pakad Nahi Paya! 😂🏃‍♂️💨")
            setAttemptCount(prev => prev + 2)
            createEmoji(e.clientX, e.clientY, '🏃‍♂️')
          }}
          onTouchStart={(e) => {
            e.preventDefault()
            const pad = 10
            const maxX = screenSize.w - 200
            const maxY = screenSize.h - 70
            setNoBtnPos({
              x: pad + Math.random() * maxX,
              y: pad + Math.random() * maxY,
            })
            setNoBtnLabel(noBtnLabels[Math.floor(Math.random() * noBtnLabels.length)])
            setAttemptCount(prev => prev + 1)
          }}
        >
          <span className="flex items-center gap-1">
            {noBtnLabel}
          </span>
          {/* Speed trails */}
          <motion.div
            className="absolute -right-1 -top-1 w-2 h-2 bg-red-400 rounded-full"
            animate={{ scale: [0, 1, 0], opacity: [1, 0.5, 0] }}
            transition={{ duration: 0.4, repeat: Infinity }}
          />
          <motion.div
            className="absolute -left-1 -bottom-1 w-2 h-2 bg-orange-400 rounded-full"
            animate={{ scale: [0, 1, 0], opacity: [1, 0.5, 0] }}
            transition={{ duration: 0.4, repeat: Infinity, delay: 0.2 }}
          />
        </motion.button>
      )}

      {/* Maf Kar Diya button remains accessible even after no button activated */}
      {!forgiven && isButtonActivated && (
        <motion.div
          className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            onClick={handleForgive}
            className="px-8 py-4 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white font-extrabold text-lg rounded-2xl shadow-2xl shadow-pink-500/40 cursor-pointer relative overflow-hidden"
            whileTap={{ scale: 0.92 }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <span className="flex items-center justify-center gap-2 relative z-10">
              <Heart className="w-5 h-5 fill-white" />
              Maf Kar Diya 💕
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
          </motion.button>
        </motion.div>
      )}

      {/* Footer */}
      <footer className="pb-4 pt-2 text-center w-full relative z-10">
        <p className="text-rose-400/40 text-xs">
          Made with 💕 for Shreya
        </p>
      </footer>
    </div>
  )
}

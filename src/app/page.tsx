'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useAnimate } from 'framer-motion'
import { Heart, PartyPopper, Sparkles, Star, Crown } from 'lucide-react'

const sorryMessages = [
  "Shreya, I'm Really Sorry! 🥺",
  "Please Maaf Kar Do Shreya! 😢",
  "I Promise I Won't Do It Again! 🙏",
  "You're The Best Shreya, Please Forgive Me! 💕",
  "Sir Maaf Kardo Shreya! 🙇‍♂️",
  "Ab Toh Maaf Hi Kar Do! 😭",
  "Dil Se Sorry Shreya! 💖",
]

const noBtnLabels = [
  "Nahi Maf Karunga! 😤",
  "Pakdi? Pakad Ke Dikhao! 😏",
  "Aree Yahan Nahi! 🏃‍♂️",
  "Idhar Udhar Mat Bhago! 😅",
  "Ha Ha Pakad Nahi Paya! 😝",
  "Chor De Mujhe! 🏃💨",
  "Wapas Aa Raha Hu... NOT! 🤣",
  "Shreya Maaf Kar De Yaar! 🥺",
  "Main Bhagta Rahoonga! 🏃‍♂️💨",
  "Tu Mujhe Kabhi Nahi Pakad Payegi! 😎",
  "Hehe Bhai Bhag! 🏃",
  "Mujhe Mat Pakad! 😱",
  "Aukat Se Bahar! 💨",
  "Sorry Bol Raha Hu... Par Bhag Bhi Raha Hu! 🏃‍♂️🙏",
]

const celebrationTexts = [
  "Shreya Ne Maaf Kar Diya! 🎉",
  "Tum Duniya Ki Sabse Pyari Ho! 🥰",
  "I Love You Shreya! 💕",
  "Best Shreya Ever! 👑",
  "Meri Jaan Shreya! 💖",
  "Shreya = Angel! 😇✨",
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
  const [showGlitch, setShowGlitch] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const heartIdRef = useRef(0)
  const noBtnX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 - 100 : 400)
  const noBtnY = useMotionValue(typeof window !== 'undefined' ? window.innerHeight - 150 : 500)
  const wanderIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const [scope, animate] = useAnimate()

  // Wandering No Button - moves continuously
  useEffect(() => {
    const wander = () => {
      const padding = 80
      const maxX = typeof window !== 'undefined' ? window.innerWidth - 220 : 800
      const maxY = typeof window !== 'undefined' ? window.innerHeight - 80 : 600

      const newX = padding + Math.random() * (maxX - padding)
      const newY = padding + Math.random() * (maxY - padding)

      animate(scope.current, {
        left: newX,
        top: newY,
        rotate: (Math.random() - 0.5) * 30,
      }, {
        type: 'spring',
        stiffness: 150,
        damping: 15,
      })
    }

    // Wander every 1.5-3 seconds
    const startWandering = () => {
      wander()
      const nextDelay = 1500 + Math.random() * 1500
      wanderIntervalRef.current = setTimeout(() => {
        startWandering()
      }, nextDelay)
    }

    startWandering()

    return () => {
      if (wanderIntervalRef.current) {
        clearTimeout(wanderIntervalRef.current)
      }
    }
  }, [animate, scope])

  // Track mouse globally and run away if cursor is near
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (forgiven) return

      const btnEl = scope.current
      if (!btnEl) return

      const rect = btnEl.getBoundingClientRect()
      const btnCenterX = rect.left + rect.width / 2
      const btnCenterY = rect.top + rect.height / 2

      const distance = Math.sqrt(
        Math.pow(e.clientX - btnCenterX, 2) + Math.pow(e.clientY - btnCenterY, 2)
      )

      // If cursor is within 150px, RUN AWAY fast!
      if (distance < 150) {
        const padding = 80
        const maxX = window.innerWidth - 220
        const maxY = window.innerHeight - 80

        // Move in opposite direction from cursor
        const angle = Math.atan2(btnCenterY - e.clientY, btnCenterX - e.clientX)
        const runDistance = 200 + Math.random() * 200
        let newX = btnCenterX + Math.cos(angle) * runDistance
        let newY = btnCenterY + Math.sin(angle) * runDistance

        // Keep within bounds
        newX = Math.max(padding, Math.min(maxX, newX))
        newY = Math.max(padding, Math.min(maxY, newY))

        animate(btnEl, {
          left: newX,
          top: newY,
          rotate: (Math.random() - 0.5) * 40,
        }, {
          type: 'spring',
          stiffness: 500,
          damping: 25,
        })

        setNoBtnLabel(noBtnLabels[Math.floor(Math.random() * noBtnLabels.length)])
        setAttemptCount(prev => prev + 1)

        // Change sorry message every 3 attempts
        if (attemptCount > 0 && attemptCount % 3 === 0) {
          setMessageIndex(prev => Math.min(prev + 1, sorryMessages.length - 1))
        }

        // Glitch effect when trying hard
        if (attemptCount > 0 && attemptCount % 5 === 0) {
          setShowGlitch(true)
          setTimeout(() => setShowGlitch(false), 300)
        }
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [forgiven, attemptCount, animate, scope])

  // Create floating emoji/hearts
  const createEmoji = useCallback((x: number, y: number, emoji?: string) => {
    const id = heartIdRef.current++
    const emojis = ['💕', '💖', '🌸', '✨', '🦋', '🌹', '💗', '💝', '🥰', '😇']
    setHearts(prev => [...prev, {
      id,
      x,
      y,
      emoji: emoji || emojis[Math.floor(Math.random() * emojis.length)]
    }])
    setTimeout(() => {
      setHearts(prev => prev.filter(h => h.id !== id))
    }, 2500)
  }, [])

  // Handle "Maf Kar Diya" - INSTANT CELEBRATION!
  const handleForgive = useCallback(() => {
    setForgiven(true)
    setShowConfetti(true)
    setShowFireworks(true)

    // Massive emoji burst from center
    for (let i = 0; i < 30; i++) {
      setTimeout(() => {
        createEmoji(
          Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800),
          Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 600)
        )
      }, i * 80)
    }

    // Cycle through praise messages
    let pIdx = 0
    const praiseInterval = setInterval(() => {
      pIdx = (pIdx + 1) % praiseMessages.length
      setPraiseIndex(pIdx)
    }, 3000)

    // Stop confetti after 10s
    setTimeout(() => {
      setShowConfetti(false)
      setShowFireworks(false)
    }, 10000)

    // Keep cycling praise
    setTimeout(() => clearInterval(praiseInterval), 30000)

    // Periodic emoji rain
    const emojiRain = setInterval(() => {
      for (let i = 0; i < 3; i++) {
        createEmoji(
          Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800),
          -20
        )
      }
    }, 500)

    setTimeout(() => clearInterval(emojiRain), 15000)
  }, [createEmoji])

  // Confetti particles - much more!
  const confettiColors = ['#ff6b9d', '#c44dff', '#ff4757', '#ffa502', '#2ed573', '#1e90ff', '#ff6348', '#ffd700', '#ff1493', '#00ff88']
  const confettiParticles = Array.from({ length: 120 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: confettiColors[i % confettiColors.length],
    delay: Math.random() * 3,
    duration: 2 + Math.random() * 4,
    size: 4 + Math.random() * 10,
    isCircle: Math.random() > 0.5,
  }))

  // Firework bursts
  const fireworkPositions = [
    { x: 20, y: 25 }, { x: 50, y: 15 }, { x: 80, y: 20 },
    { x: 35, y: 35 }, { x: 65, y: 30 }, { x: 15, y: 40 },
    { x: 85, y: 45 },
  ]

  return (
    <div
      ref={containerRef}
      className={`relative min-h-screen flex flex-col overflow-hidden ${showGlitch ? 'animate-pulse' : ''}`}
      style={{
        background: forgiven
          ? 'linear-gradient(135deg, #fce4ec 0%, #f8bbd0 25%, #f48fb1 50%, #ec407a 75%, #e91e63 100%)'
          : 'linear-gradient(135deg, #fff5f5 0%, #ffe0e6 25%, #ffb3c1 50%, #ff758f 75%, #ff5252 100%)',
        transition: 'background 1s ease',
      }}
    >
      {/* Animated Background Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: -50,
              scale: 0.3 + Math.random() * 0.8,
            }}
            animate={{
              y: typeof window !== 'undefined' ? window.innerHeight + 100 : 1000,
              rotate: [0, 360],
              x: (i % 2 === 0 ? 1 : -1) * (50 + Math.random() * 100),
            }}
            transition={{
              duration: 10 + Math.random() * 15,
              repeat: Infinity,
              delay: Math.random() * 8,
              ease: 'linear',
            }}
          >
            {i % 3 === 0 ? (
              <Heart className="w-6 h-6 text-pink-200/25 fill-pink-200/25" />
            ) : i % 3 === 1 ? (
              <Star className="w-5 h-5 text-rose-200/20 fill-rose-200/20" />
            ) : (
              <span className="text-lg opacity-20">
                {['💕', '✨', '🌸', '💖'][i % 4]}
              </span>
            )}
          </motion.div>
        ))}
      </div>

      {/* Firework Bursts */}
      <AnimatePresence>
        {showFireworks && fireworkPositions.map((pos, idx) => (
          <motion.div
            key={`firework-${idx}`}
            className="absolute pointer-events-none z-30"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{
              scale: [0, 3, 4],
              opacity: [1, 0.8, 0],
            }}
            transition={{
              duration: 1.5,
              delay: idx * 0.3,
              repeat: 3,
              repeatDelay: 1,
            }}
          >
            <div className="relative">
              {Array.from({ length: 8 }).map((_, j) => (
                <motion.div
                  key={j}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: confettiColors[(idx + j) % confettiColors.length],
                  }}
                  animate={{
                    x: Math.cos((j / 8) * Math.PI * 2) * 60,
                    y: Math.sin((j / 8) * Math.PI * 2) * 60,
                  }}
                  transition={{ duration: 1, delay: idx * 0.3 }}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Emoji/Hearts on events */}
      <AnimatePresence>
        {hearts.map(heart => (
          <motion.div
            key={heart.id}
            className="fixed pointer-events-none z-50 text-3xl"
            initial={{ x: heart.x, y: heart.y, scale: 0, opacity: 1 }}
            animate={{ y: heart.y - 200, scale: 1.5, opacity: 0, rotate: Math.random() * 360 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.5, ease: 'easeOut' }}
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
              y: typeof window !== 'undefined' ? window.innerHeight + 80 : 1200,
              opacity: [1, 1, 0.5, 0],
              rotate: 720 * (Math.random() > 0.5 ? 1 : -1),
              x: (Math.random() - 0.5) * 300,
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              ease: 'easeIn',
            }}
          />
        ))}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-5 px-4 max-w-lg w-full pt-8 sm:pt-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Sorry Image */}
        <motion.div className="relative" animate={forgiven ? { scale: [1, 1.15, 1] } : {}}>
          <motion.div
            animate={!forgiven ? { y: [0, -10, 0] } : {}}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="relative">
              <motion.img
                src="/sorry-image.png"
                alt="Sorry Shreya"
                className="w-36 h-36 sm:w-48 sm:h-48 rounded-full object-cover shadow-2xl border-4 border-white/70"
              />
              {/* Glowing ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-pink-300/50"
                animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>

          {!forgiven && (
            <motion.div
              className="absolute -top-3 -right-3"
              animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Sparkles className="w-8 h-8 text-yellow-400 drop-shadow-lg" />
            </motion.div>
          )}

          {forgiven && (
            <motion.div
              className="absolute -top-4 -right-4"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <Crown className="w-10 h-10 text-yellow-400 drop-shadow-lg" />
            </motion.div>
          )}
        </motion.div>

        {/* Sorry Message */}
        <AnimatePresence mode="wait">
          <motion.h1
            key={forgiven ? 'forgiven' : messageIndex}
            className="text-2xl sm:text-4xl font-extrabold text-center text-rose-700 drop-shadow-sm leading-tight"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            transition={{ duration: 0.5, type: 'spring' }}
          >
            {forgiven ? celebrationTexts[0] : sorryMessages[messageIndex]}
          </motion.h1>
        </AnimatePresence>

        {/* Sub message */}
        {!forgiven && (
          <motion.p
            className="text-rose-600/80 text-center text-sm sm:text-base"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Shreya, dil se sorry! Mujhe maaf kar do please 🙏💕
          </motion.p>
        )}

        {/* Attempt counter - funny */}
        {!forgiven && attemptCount > 0 && (
          <motion.div
            key={attemptCount}
            className="bg-white/30 backdrop-blur-sm rounded-full px-4 py-2"
            initial={{ scale: 1.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <span className="text-rose-700 font-semibold text-sm">
              {attemptCount < 3
                ? `Pakadne ki koshish: ${attemptCount} ❌`
                : attemptCount < 6
                ? `${attemptCount} baar try kiya, pakad nahi paya! 😂`
                : attemptCount < 10
                ? `${attemptCount} attempts! Give up kar! 🤣`
                : `${attemptCount} attempts!! Shreya maaf kar de usko! 😭😂`}
            </span>
          </motion.div>
        )}

        {/* ====== FORGIVEN STATE - MASSIVE CELEBRATION ====== */}
        {forgiven && (
          <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 150, damping: 12 }}
          >
            {/* Big celebration emoji */}
            <motion.div
              className="text-5xl sm:text-7xl"
              animate={{
                rotate: [0, -15, 15, -10, 10, 0],
                scale: [1, 1.3, 1, 1.2, 1],
              }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            >
              🎉
            </motion.div>

            <motion.h2
              className="text-3xl sm:text-5xl font-black text-rose-700 text-center"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Shreya Ne Maaf Kar Diya!
            </motion.h2>

            {/* Rotating praise messages */}
            <AnimatePresence mode="wait">
              <motion.p
                key={praiseIndex}
                className="text-rose-600 text-center text-lg sm:text-xl font-medium"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
              >
                {praiseMessages[praiseIndex]}
              </motion.p>
            </AnimatePresence>

            {/* Bouncing emoji row */}
            <motion.div
              className="flex gap-3 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {['🥰', '💕', '👑', '💖', '🦋', '🌹', '✨'].map((emoji, i) => (
                <motion.span
                  key={i}
                  className="text-3xl sm:text-4xl"
                  animate={{
                    y: [0, -15, 0],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 1.2,
                    delay: i * 0.15,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  {emoji}
                </motion.span>
              ))}
            </motion.div>

            {/* Love letter animation */}
            <motion.div
              className="mt-4 bg-white/40 backdrop-blur-md rounded-2xl p-5 sm:p-6 max-w-sm w-full border border-white/50 shadow-xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                <span className="font-bold text-rose-700">Shreya Ke Liye Special Message</span>
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              </div>
              <p className="text-rose-700 text-sm sm:text-base leading-relaxed">
                Dear Shreya, 💕<br /><br />
                Tum world ki sabse pyari insaan ho! Tumne maaf karke mujhe dubara jeene ka hak diya.
                Main promise karta hoon ki aisi galti dubara nahi karunga.
                Tumhare bina meri duniya adhoori hai! 🌸<br /><br />
                Forever grateful, 🙏💖
                Your Sorry Person
              </p>
            </motion.div>

            {/* Click for more hearts */}
            <motion.button
              onClick={(e) => {
                for (let i = 0; i < 10; i++) {
                  setTimeout(() => {
                    createEmoji(
                      e.clientX + (Math.random() - 0.5) * 200,
                      e.clientY + (Math.random() - 0.5) * 200
                    )
                  }, i * 50)
                }
              }}
              className="mt-2 px-6 py-3 bg-white/30 backdrop-blur-sm rounded-full text-rose-700 font-semibold hover:bg-white/50 transition-all cursor-pointer border border-white/40"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              More Love Click Karo 💕
            </motion.button>
          </motion.div>
        )}

        {/* ====== MAF KAR DIYA BUTTON - Before forgiveness ====== */}
        {!forgiven && (
          <motion.button
            onClick={handleForgive}
            className="relative px-10 py-5 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white font-extrabold text-xl rounded-3xl shadow-2xl shadow-pink-500/40 hover:shadow-pink-500/60 active:scale-95 transition-all cursor-pointer mt-2"
            whileHover={{
              scale: 1.08,
              boxShadow: '0 20px 60px rgba(236, 64, 122, 0.5)',
            }}
            whileTap={{ scale: 0.92 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <span className="flex items-center justify-center gap-2">
              <Heart className="w-6 h-6 fill-white animate-pulse" />
              Maf Kar Diya 💕
              <Heart className="w-6 h-6 fill-white animate-pulse" />
            </span>
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/25 to-transparent"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
          </motion.button>
        )}

        {/* Hint text */}
        {!forgiven && (
          <motion.p
            className="text-rose-400/60 text-xs text-center mt-1"
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            💡 &quot;Nahi Maf Karunga&quot ko pakadne ki koshish mat kar... 🏃‍♂️💨
          </motion.p>
        )}
      </motion.div>

      {/* ====== THE RUNAWAY "NAHI MAF KARUNGA" BUTTON ====== */}
      {!forgiven && (
        <motion.button
          ref={scope}
          className="fixed z-20 px-6 py-3 bg-gradient-to-r from-slate-500 via-gray-500 to-slate-600 text-white font-bold text-base rounded-2xl shadow-xl cursor-pointer select-none whitespace-nowrap border-2 border-gray-400/50"
          style={{
            touchAction: 'none',
            left: typeof window !== 'undefined' ? window.innerWidth / 2 - 100 : 400,
            top: typeof window !== 'undefined' ? window.innerHeight - 150 : 500,
          }}
          onMouseEnter={() => {
            // Extra dodge on hover just in case
            const padding = 80
            const maxX = window.innerWidth - 220
            const maxY = window.innerHeight - 80
            const newX = padding + Math.random() * (maxX - padding)
            const newY = padding + Math.random() * (maxY - padding)
            animate(scope.current, {
              left: newX,
              top: newY,
              rotate: (Math.random() - 0.5) * 45,
            }, {
              type: 'spring',
              stiffness: 600,
              damping: 20,
            })
            setNoBtnLabel(noBtnLabels[Math.floor(Math.random() * noBtnLabels.length)])
            setAttemptCount(prev => prev + 1)
          }}
          onClick={(e) => {
            e.preventDefault()
            // Even if somehow clicked, it just runs away!
            const padding = 80
            const maxX = window.innerWidth - 220
            const maxY = window.innerHeight - 80
            const newX = padding + Math.random() * (maxX - padding)
            const newY = padding + Math.random() * (maxY - padding)
            animate(scope.current, {
              left: newX,
              top: newY,
              rotate: (Math.random() - 0.5) * 60,
            }, {
              type: 'spring',
              stiffness: 800,
              damping: 15,
            })
            setNoBtnLabel("HAHA! Pakad Nahi Paya! 😂🏃‍♂️💨")
            setAttemptCount(prev => prev + 3)
            createEmoji(e.clientX, e.clientY, '🏃‍♂️')
          }}
          onTouchStart={(e) => {
            e.preventDefault()
            const padding = 80
            const maxX = window.innerWidth - 220
            const maxY = window.innerHeight - 80
            const newX = padding + Math.random() * (maxX - padding)
            const newY = padding + Math.random() * (maxY - padding)
            animate(scope.current, {
              left: newX,
              top: newY,
              rotate: (Math.random() - 0.5) * 45,
            }, {
              type: 'spring',
              stiffness: 600,
              damping: 20,
            })
            setNoBtnLabel(noBtnLabels[Math.floor(Math.random() * noBtnLabels.length)])
            setAttemptCount(prev => prev + 1)
          }}
        >
          <motion.span
            animate={{ rotate: [0, (Math.random() - 0.5) * 10, 0] }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-1"
          >
            {noBtnLabel}
          </motion.span>
          {/* Trail effect dots */}
          <motion.div
            className="absolute -right-2 -top-2 w-3 h-3 bg-red-400 rounded-full"
            animate={{ scale: [0, 1, 0], opacity: [1, 0.5, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
          <motion.div
            className="absolute -left-2 -bottom-2 w-2 h-2 bg-orange-400 rounded-full"
            animate={{ scale: [0, 1, 0], opacity: [1, 0.5, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, delay: 0.25 }}
          />
        </motion.button>
      )}

      {/* Footer */}
      <footer className="mt-auto pb-4 pt-2 text-center w-full relative z-10">
        <p className="text-rose-400/50 text-xs">
          Made with 💕 for Shreya {forgiven ? '| Maaf Kar Diya! 🎉' : '| Please Maaf Kar Do 🙏'}
        </p>
      </footer>
    </div>
  )
}

'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, HandHeart, PartyPopper, Sparkles } from 'lucide-react'

const sorryMessages = [
  "Shreya, I'm Really Sorry! 🥺",
  "Please Maaf Kar Do Shreya! 😢",
  "I Promise I Won't Do It Again! 🙏",
  "You're The Best Shreya, Please Forgive Me! 💕",
  "Sir Maaf Kardo Shreya! 🙇‍♂️",
  "Ab Toh Maaf Hi Kar Do! 😭",
  "Dil Se Sorry Shreya! 💖",
]

const forgivenessTexts = [
  "Maf Kar Diya! 💕",
  "Tum Bahut Ache Ho! 🥰",
  "Shreya Ne Maaf Kar Diya! 🎉",
  "Finally! Thank You Shreya! 🙏✨",
  "You're The Kindest, Shreya! 💖",
]

export default function Home() {
  const [noBtnPos, setNoBtnPos] = useState({ x: 0, y: 0 })
  const [messageIndex, setMessageIndex] = useState(0)
  const [forgiven, setForgiven] = useState(false)
  const [forgiveCount, setForgiveCount] = useState(0)
  const [forgiveTextIndex, setForgiveTextIndex] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([])
  const [noBtnLabel, setNoBtnLabel] = useState("Nahi Maf Karunga! 😤")
  const containerRef = useRef<HTMLDivElement>(null)
  const noBtnRef = useRef<HTMLButtonElement>(null)
  const heartIdRef = useRef(0)

  const noBtnLabels = [
    "Nahi Maf Karunga! 😤",
    "Aree Maaf Kar Na! 😅",
    "Soch Lo Dobara! 🤔",
    "Pakka Nahi Maf Karoge? 🥺",
    "Please Yaar! 🙏",
    "Ab Toh Maaf Kar Do! 😭",
    "Sir Maaf Kardo! 🙇‍♂️",
    "Dil Se Maaf Kar Do! 💔",
  ]

  // Move the "No" button away randomly
  const moveNoButton = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    const containerRect = container.getBoundingClientRect()
    const btnWidth = 200
    const btnHeight = 50
    const padding = 20

    // Random position within container bounds
    const maxX = containerRect.width - btnWidth - padding
    const maxY = containerRect.height - btnHeight - padding

    const newX = Math.floor(Math.random() * maxX) - maxX / 2
    const newY = Math.floor(Math.random() * maxY) - maxY / 2

    setNoBtnPos({ x: newX, y: newY })
    setNoBtnLabel(noBtnLabels[Math.floor(Math.random() * noBtnLabels.length)])
  }, [])

  // Create floating hearts
  const createHeart = useCallback((x: number, y: number) => {
    const id = heartIdRef.current++
    setHearts(prev => [...prev, { id, x, y }])
    setTimeout(() => {
      setHearts(prev => prev.filter(h => h.id !== id))
    }, 1500)
  }, [])

  // Handle "Maf Kar Diya" click
  const handleForgive = useCallback(() => {
    const newCount = forgiveCount + 1
    setForgiveCount(newCount)
    setForgiveTextIndex(Math.min(Math.floor((newCount - 1) / 1), forgivenessTexts.length - 1))

    // Change sorry message after every 2-3 clicks
    if (newCount % 2 === 0 && messageIndex < sorryMessages.length - 1) {
      setMessageIndex(prev => prev + 1)
    }

    // Create hearts burst
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        createHeart(
          Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800),
          Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 600)
        )
      }, i * 100)
    }

    // After 4+ clicks, show full forgiveness
    if (newCount >= 4) {
      setForgiven(true)
      setShowConfetti(true)
      // Stop confetti after some time
      setTimeout(() => setShowConfetti(false), 8000)
    }
  }, [forgiveCount, messageIndex, createHeart])

  // Handle trying to click "No" button
  const handleNoHover = useCallback(() => {
    moveNoButton()
  }, [moveNoButton])

  const handleNoClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    moveNoButton()
    // Spawn hearts at click position
    createHeart(e.clientX, e.clientY)
  }, [moveNoButton, createHeart])

  // Confetti particles
  const confettiColors = ['#ff6b9d', '#c44dff', '#ff4757', '#ffa502', '#2ed573', '#1e90ff', '#ff6348']
  const confettiParticles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: confettiColors[i % confettiColors.length],
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 3,
    size: 6 + Math.random() * 8,
  }))

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: forgiven
          ? 'linear-gradient(135deg, #fce4ec 0%, #f8bbd0 30%, #f48fb1 60%, #ec407a 100%)'
          : 'linear-gradient(135deg, #fff5f5 0%, #ffe0e6 30%, #ffb3c1 60%, #ff758f 100%)',
      }}
    >
      {/* Floating Background Hearts */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-pink-200/30"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: -50,
              scale: 0.5 + Math.random() * 1,
              rotate: Math.random() * 360,
            }}
            animate={{
              y: typeof window !== 'undefined' ? window.innerHeight + 50 : 800,
              rotate: 360 + Math.random() * 360,
            }}
            transition={{
              duration: 8 + Math.random() * 12,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: 'linear',
            }}
          >
            <Heart className="w-8 h-8 fill-current" />
          </motion.div>
        ))}
      </div>

      {/* Animated Hearts on click */}
      <AnimatePresence>
        {hearts.map(heart => (
          <motion.div
            key={heart.id}
            className="fixed pointer-events-none z-50"
            initial={{ x: heart.x, y: heart.y, scale: 0, opacity: 1 }}
            animate={{ y: heart.y - 150, scale: 1.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          >
            <Heart className="w-8 h-8 text-pink-500 fill-pink-500" />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Confetti */}
      <AnimatePresence>
        {showConfetti && confettiParticles.map(p => (
          <motion.div
            key={p.id}
            className="fixed top-0 pointer-events-none z-50"
            style={{
              left: `${p.x}%`,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            }}
            initial={{ y: -20, opacity: 1, rotate: 0 }}
            animate={{
              y: typeof window !== 'undefined' ? window.innerHeight + 50 : 1000,
              opacity: [1, 1, 0],
              rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
              x: (Math.random() - 0.5) * 200,
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
        className="relative z-10 flex flex-col items-center gap-6 px-4 max-w-lg w-full"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Sorry Image */}
        <motion.div
          className="relative"
          animate={{ scale: forgiven ? [1, 1.1, 1] : 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.img
            src="/sorry-image.png"
            alt="Sorry Shreya"
            className="w-40 h-40 sm:w-52 sm:h-52 rounded-full object-cover shadow-2xl border-4 border-white/60"
            animate={!forgiven ? {
              y: [0, -8, 0],
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          {!forgiven && (
            <motion.div
              className="absolute -top-2 -right-2"
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Sparkles className="w-8 h-8 text-yellow-400" />
            </motion.div>
          )}
          {forgiven && (
            <motion.div
              className="absolute -top-2 -right-2"
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 360] }}
              transition={{ duration: 0.5 }}
            >
              <PartyPopper className="w-10 h-10 text-yellow-400" />
            </motion.div>
          )}
        </motion.div>

        {/* Sorry Message */}
        <AnimatePresence mode="wait">
          <motion.h1
            key={messageIndex}
            className="text-2xl sm:text-4xl font-bold text-center text-rose-700 drop-shadow-sm"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            transition={{ duration: 0.5 }}
          >
            {sorryMessages[messageIndex]}
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

        {/* Forgiveness Count */}
        {forgiveCount > 0 && !forgiven && (
          <motion.div
            className="flex items-center gap-2 bg-white/40 backdrop-blur-sm rounded-full px-4 py-2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <HandHeart className="w-5 h-5 text-pink-500" />
            <span className="text-rose-700 font-medium text-sm">
              {forgivenessTexts[forgiveTextIndex]} ({forgiveCount}/4)
            </span>
          </motion.div>
        )}

        {/* Forgiven State */}
        {forgiven && (
          <motion.div
            className="flex flex-col items-center gap-3"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <motion.div
              className="text-4xl sm:text-6xl"
              animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
            >
              🎉
            </motion.div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-rose-700 text-center">
              Shreya Ne Maaf Kar Diya!
            </h2>
            <p className="text-rose-600 text-center text-lg">
              Tum Duniya Ki Sabse Pyari Shreya Ho! 💖✨
            </p>
            <motion.div
              className="flex gap-2 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              {['🥰', '💕', '🌸', '💖', '🦋'].map((emoji, i) => (
                <motion.span
                  key={i}
                  className="text-3xl"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
                >
                  {emoji}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* Buttons */}
        {!forgiven && (
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full mt-4">
            {/* Maf Kar Diya Button */}
            <motion.button
              onClick={handleForgive}
              className="relative w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-lg rounded-2xl shadow-lg shadow-pink-500/30 hover:shadow-xl hover:shadow-pink-500/40 active:scale-95 transition-all cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center justify-center gap-2">
                <Heart className="w-5 h-5 fill-white" />
                Maf Kar Diya 💕
              </span>
              <motion.div
                className="absolute inset-0 rounded-2xl bg-white/20"
                animate={{ opacity: [0, 0.3, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.button>

            {/* Nahi Maf Karunga Button - Runs Away! */}
            <motion.button
              ref={noBtnRef}
              onMouseEnter={handleNoHover}
              onClick={handleNoClick}
              onTouchStart={(e) => {
                e.preventDefault()
                moveNoButton()
              }}
              animate={{
                x: noBtnPos.x,
                y: noBtnPos.y,
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 20,
              }}
              className="relative w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-gray-400 to-gray-500 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl active:scale-95 transition-all cursor-pointer select-none"
              style={{ touchAction: 'none' }}
            >
              <span className="flex items-center justify-center gap-2">
                {noBtnLabel}
              </span>
            </motion.button>
          </div>
        )}

        {/* Hint text */}
        {!forgiven && (
          <motion.p
            className="text-rose-400/60 text-xs text-center mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Hint: &quot;Nahi Maf Karunga&quot ko click karna mushkil hai... 😏
          </motion.p>
        )}
      </motion.div>

      {/* Footer */}
      <footer className="mt-auto pb-6 pt-4 text-center w-full">
        <p className="text-rose-400/50 text-xs">
          Made with 💕 for Shreya
        </p>
      </footer>
    </div>
  )
}

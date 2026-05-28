'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Sparkles, Crown, Zap, Trophy } from 'lucide-react'

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
  "Pakad Nahi Paya! 😝",
  "Chor De Mujhe! 🏃💨",
  "NOT! 🤣",
  "Bhag Bhag Bhag! 🏃‍♂️💨",
  "Kabhi Nahi Pakad Payegi! 😎",
  "Mujhe Mat Pakad! 😱",
  "Hehe Bhag! 🏃",
  "Aukat Se Bahar! 💨",
  "Slow Ho Tum! 🐌",
  "Thoda Aur Try Kar! 😜",
  "Bye Bye! 👋🏃‍♂️",
]

const praiseMessages = [
  "Tum Itni Achi Ho Ki Dil Khush Ho Gaya! 🌸",
  "Shreya Tumhare Jaisi Koi Nahi! 💎",
  "World's Most Kindest Person = Shreya! 🏆",
  "Tumhari Smile Sabse Pyari Hai! 😊",
  "Shreya Tum Ek Angel Ho! 😇",
]

const roamBoxLabels = [
  "🏃‍♂️ Bhagne Ka Maidaan 🏃‍♀️",
  "🎯 Pakad Ke Dikhao!",
  "⚡ Lightning Zone ⚡",
  "🏋️ Chase Arena 🏋️",
  "🌪️ Bhagoda Zone 🌪️",
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
  const [btnTranslate, setBtnTranslate] = useState({ x: 0, y: 0 })
  const [screenSize, setScreenSize] = useState({ w: 0, h: 0 })
  const [shakeScreen, setShakeScreen] = useState(false)
  const [btnColorIndex, setBtnColorIndex] = useState(0)
  const [roamLabelIndex, setRoamLabelIndex] = useState(0)
  const [showMilestone, setShowMilestone] = useState('')

  const heartIdRef = useRef(0)
  const roamBoxRef = useRef<HTMLDivElement>(null)

  // Button color schemes that change with attempts
  const btnColors = [
    'from-gray-500 to-gray-600',
    'from-slate-500 to-slate-600',
    'from-zinc-500 to-zinc-600',
    'from-stone-500 to-stone-600',
    'from-red-400 to-orange-500',
    'from-amber-500 to-yellow-500',
    'from-emerald-500 to-teal-500',
    'from-cyan-500 to-blue-500',
    'from-violet-500 to-purple-500',
    'from-fuchsia-500 to-pink-500',
  ]

  // Get screen size
  useEffect(() => {
    const updateSize = () => setScreenSize({ w: window.innerWidth, h: window.innerHeight })
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  // Move button to random position within the roam box
  const moveBtnRandom = useCallback(() => {
    const box = roamBoxRef.current
    if (!box) return
    const boxW = box.clientWidth
    const boxH = box.clientHeight
    const btnW = 170
    const btnH = 40
    // Button gets smaller with attempts making it harder
    const sizeFactor = Math.max(0.6, 1 - attemptCount * 0.03)
    const maxX = boxW - btnW * sizeFactor
    const maxY = boxH - btnH * sizeFactor
    const newX = Math.max(0, Math.random() * maxX)
    const newY = Math.max(0, Math.random() * maxY)
    setBtnTranslate({ x: newX, y: newY })
    setNoBtnLabel(noBtnLabels[Math.floor(Math.random() * noBtnLabels.length)])
  }, [attemptCount])

  // Create floating emoji
  const createEmoji = useCallback((x: number, y: number, emoji?: string) => {
    const id = heartIdRef.current++
    const emojis = ['💕', '💖', '🌸', '✨', '🦋', '🌹', '💗', '💝', '🥰', '😇', '🎊', '🎆', '😭', '🤣', '💪']
    setHearts(prev => [...prev, { id, x, y, emoji: emoji || emojis[Math.floor(Math.random() * emojis.length)] }])
    setTimeout(() => { setHearts(prev => prev.filter(h => h.id !== id)) }, 2500)
  }, [])

  // Activate runaway
  const handleNoButtonFirstTouch = useCallback(() => {
    if (!isButtonActivated) {
      setIsButtonActivated(true)
      setShakeScreen(true)
      setTimeout(() => setShakeScreen(false), 400)
      setTimeout(() => moveBtnRandom(), 50)
      setNoBtnLabel("Aha! Ab Pakad Ke Dikhao! 😏🏃‍♂️")
      setAttemptCount(1)
    }
  }, [isButtonActivated, moveBtnRandom])

  // Handle click/touch on runaway button
  const handleRunawayClick = useCallback((clientX: number, clientY: number) => {
    moveBtnRandom()
    setAttemptCount(prev => prev + 1)
    setBtnColorIndex(prev => (prev + 1) % btnColors.length)
    setMessageIndex(prev => Math.min(prev + 1, sorryMessages.length - 1))
    createEmoji(clientX, clientY, '🏃‍♂️')
    setShakeScreen(true)
    setTimeout(() => setShakeScreen(false), 300)

    // Milestone effects
    const newCount = attemptCount + 1
    if (newCount === 5) {
      setShowMilestone('5 Attempts! 🏅')
      setTimeout(() => setShowMilestone(''), 2000)
    } else if (newCount === 10) {
      setShowMilestone('10 Attempts! 🏆 Legend!')
      setTimeout(() => setShowMilestone(''), 2500)
    } else if (newCount === 20) {
      setShowMilestone('20 Attempts!! 🤯 Insane!')
      setTimeout(() => setShowMilestone(''), 3000)
    }

    // Change roam box label every 4 attempts
    if (newCount % 4 === 0) {
      setRoamLabelIndex(prev => (prev + 1) % roamBoxLabels.length)
    }
  }, [attemptCount, moveBtnRandom, createEmoji])

  // Maf Kar Diya - INSTANT CELEBRATION!
  const handleForgive = useCallback(() => {
    setForgiven(true)
    setShowConfetti(true)
    setShowFireworks(true)
    for (let i = 0; i < 30; i++) {
      setTimeout(() => { createEmoji(Math.random() * screenSize.w, Math.random() * screenSize.h) }, i * 60)
    }
    let pIdx = 0
    const pi = setInterval(() => { pIdx = (pIdx + 1) % praiseMessages.length; setPraiseIndex(pIdx) }, 3000)
    setTimeout(() => { setShowConfetti(false); setShowFireworks(false) }, 12000)
    setTimeout(() => clearInterval(pi), 30000)
    const er = setInterval(() => { for (let i = 0; i < 4; i++) createEmoji(Math.random() * screenSize.w, -20) }, 400)
    setTimeout(() => clearInterval(er), 15000)
  }, [screenSize, createEmoji])

  // Button size decreases with attempts
  const btnScale = Math.max(0.55, 1 - attemptCount * 0.03)

  const confettiColors = ['#ff6b9d', '#c44dff', '#ff4757', '#ffa502', '#2ed573', '#1e90ff', '#ff6348', '#ffd700', '#ff1493', '#00ff88']
  const confettiParticles = Array.from({ length: 120 }, (_, i) => ({
    id: i, x: Math.random() * 100, color: confettiColors[i % confettiColors.length],
    delay: Math.random() * 3, duration: 2 + Math.random() * 4,
    size: 4 + Math.random() * 12, isCircle: Math.random() > 0.5,
  }))
  const fireworkPositions = [{ x: 15, y: 15 }, { x: 50, y: 8 }, { x: 85, y: 15 }, { x: 30, y: 25 }, { x: 70, y: 22 }, { x: 45, y: 30 }]

  return (
    <div
      className={`relative min-h-screen flex flex-col overflow-hidden select-none transition-transform ${shakeScreen ? 'animate-pulse' : ''}`}
      style={{
        background: forgiven
          ? 'linear-gradient(135deg, #fce4ec 0%, #f8bbd0 25%, #f48fb1 50%, #ec407a 75%, #e91e63 100%)'
          : 'linear-gradient(135deg, #fff5f5 0%, #ffe0e6 25%, #ffb3c1 50%, #ff758f 75%, #ff5252 100%)',
        transition: 'background 1s ease',
      }}
    >
      {/* Background floating */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div key={i} className="absolute"
            initial={{ x: Math.random() * screenSize.w, y: -50, scale: 0.3 + Math.random() * 0.4 }}
            animate={{ y: screenSize.h + 100, rotate: 360 }}
            transition={{ duration: 12 + Math.random() * 10, repeat: Infinity, delay: Math.random() * 6, ease: 'linear' }}
          >
            {i % 3 === 0 ? (
              <Heart className="w-4 h-4 text-pink-200/15 fill-pink-200/15" />
            ) : i % 3 === 1 ? (
              <span className="text-sm opacity-15">✨</span>
            ) : (
              <span className="text-sm opacity-10">💕</span>
            )}
          </motion.div>
        ))}
      </div>

      {/* Fireworks */}
      <AnimatePresence>
        {showFireworks && fireworkPositions.map((pos, idx) => (
          <motion.div key={`fw-${idx}`} className="absolute pointer-events-none z-30"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            initial={{ scale: 0, opacity: 1 }} animate={{ scale: [0, 3.5, 5], opacity: [1, 0.8, 0] }}
            transition={{ duration: 1.8, delay: idx * 0.25, repeat: 4, repeatDelay: 0.8 }}
          >
            {Array.from({ length: 10 }).map((_, j) => (
              <motion.div key={j} className="absolute w-2 h-2 rounded-full"
                style={{ backgroundColor: confettiColors[(idx + j) % confettiColors.length] }}
                animate={{ x: Math.cos((j / 10) * Math.PI * 2) * 60, y: Math.sin((j / 10) * Math.PI * 2) * 60 }}
                transition={{ duration: 1.2, delay: idx * 0.25 }}
              />
            ))}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Milestone popup */}
      <AnimatePresence>
        {showMilestone && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white/80 backdrop-blur-md rounded-3xl px-8 py-5 shadow-2xl border-2 border-yellow-400"
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: [0, 1.3, 1], rotate: [0, 10, 0] }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 12 }}
            >
              <p className="text-2xl font-black text-rose-600 text-center">{showMilestone}</p>
              <p className="text-sm text-rose-500 text-center mt-1">Aur try kar! 😂</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Emoji popups */}
      <AnimatePresence>
        {hearts.map(h => (
          <motion.div key={h.id} className="fixed pointer-events-none z-50 text-2xl"
            initial={{ x: h.x, y: h.y, scale: 0, opacity: 1 }}
            animate={{ y: h.y - 200, scale: 1.5, opacity: 0, rotate: Math.random() * 360 }}
            transition={{ duration: 2, ease: 'easeOut' }}
          >{h.emoji}</motion.div>
        ))}
      </AnimatePresence>

      {/* Confetti */}
      <AnimatePresence>
        {showConfetti && confettiParticles.map(p => (
          <motion.div key={p.id} className="fixed top-0 pointer-events-none z-40"
            style={{ left: `${p.x}%`, width: p.size, height: p.size * (p.isCircle ? 1 : 1.5), backgroundColor: p.color, borderRadius: p.isCircle ? '50%' : '2px' }}
            initial={{ y: -30, opacity: 1, rotate: 0 }}
            animate={{ y: screenSize.h + 80, opacity: [1, 1, 0.5, 0], rotate: 720 * (Math.random() > 0.5 ? 1 : -1), x: (Math.random() - 0.5) * 250 }}
            transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
          />
        ))}
      </AnimatePresence>

      {/* ========== TOP: Image + Text ========== */}
      <div className="relative z-20 flex flex-col items-center px-5 pt-6 pb-2 shrink-0">
        <motion.div className="relative mb-3" animate={forgiven ? { scale: [1, 1.12, 1] } : {}}>
          <motion.div animate={!forgiven ? { y: [0, -8, 0] } : {}} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}>
            <div className="relative">
              <img src="/sorry-image.png" alt="Sorry Shreya"
                className="w-24 h-24 rounded-full object-cover shadow-xl border-4 border-white/70" />
              <motion.div className="absolute inset-0 rounded-full border-2 border-pink-300/40"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 2, repeat: Infinity }} />
            </div>
          </motion.div>
          {!forgiven && (
            <motion.div className="absolute -top-1 -right-1"
              animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}>
              <Sparkles className="w-5 h-5 text-yellow-400" />
            </motion.div>
          )}
          {forgiven && (
            <motion.div className="absolute -top-2 -right-2"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}>
              <Crown className="w-7 h-7 text-yellow-400 drop-shadow-lg" />
            </motion.div>
          )}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.h1 key={forgiven ? 'f' : messageIndex}
            className="text-lg font-extrabold text-center text-rose-700 leading-tight mb-1"
            initial={{ opacity: 0, y: 15, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.9 }} transition={{ duration: 0.4 }}>
            {forgiven ? "Shreya Ne Maaf Kar Diya! 🎉" : sorryMessages[messageIndex]}
          </motion.h1>
        </AnimatePresence>

        {!forgiven && (
          <motion.p className="text-rose-600/70 text-center text-xs" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            Dil se sorry Shreya! Mujhe maaf kar do 🙏💕
          </motion.p>
        )}

        {/* Attempt counter with level */}
        {!forgiven && attemptCount > 0 && (
          <motion.div key={attemptCount}
            className="flex items-center gap-2 bg-white/40 backdrop-blur-sm rounded-full px-3 py-1 mt-1.5"
            initial={{ scale: 1.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <Zap className="w-3 h-3 text-amber-500" />
            <span className="text-rose-700 font-bold text-xs">
              {attemptCount < 3 ? `Koshish: ${attemptCount} ❌`
                : attemptCount < 5 ? `Level ${Math.floor(attemptCount / 2)} - ${attemptCount} try! 😅`
                : attemptCount < 10 ? `Level ${Math.floor(attemptCount / 2)} - ${attemptCount} try! 😂`
                : attemptCount < 20 ? `Pro Level! ${attemptCount} tries! 🤣`
                : `${attemptCount} tries! LEGEND! 🏆😭😂`}
            </span>
          </motion.div>
        )}

        {/* Celebration */}
        {forgiven && (
          <motion.div className="flex flex-col items-center gap-2 mt-2 max-h-[60vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.3 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 150, damping: 12 }}>
            <motion.div className="text-5xl"
              animate={{ rotate: [0, -15, 15, -10, 10, 0], scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}>🎉</motion.div>
            <AnimatePresence mode="wait">
              <motion.p key={praiseIndex} className="text-rose-600 text-center text-sm font-medium px-2"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}>
                {praiseMessages[praiseIndex]}
              </motion.p>
            </AnimatePresence>
            <motion.div className="flex gap-1.5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              {['🥰', '💕', '👑', '💖', '🦋', '🌹', '✨'].map((e, i) => (
                <motion.span key={i} className="text-xl"
                  animate={{ y: [0, -10, 0], rotate: [0, 8, -8, 0] }}
                  transition={{ duration: 1.2, delay: i * 0.1, repeat: Infinity, ease: 'easeInOut' }}>{e}</motion.span>
              ))}
            </motion.div>
            <motion.div className="bg-white/40 backdrop-blur-md rounded-2xl p-3 max-w-xs w-full border border-white/50 shadow-xl"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                <span className="font-bold text-rose-700 text-xs">Shreya Ke Liye Special 💝</span>
                <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
              </div>
              <p className="text-rose-700 text-xs leading-relaxed">
                Dear Shreya, 💕<br /><br />
                Tum world ki sabse pyari insaan ho! Tumne maaf karke mujhe dubara jeene ka hak diya.
                Main promise karta hoon ki aisi galti dubara nahi karunga.
                Tumhare bina meri duniya adhoori hai! 🌸<br /><br />
                Tum meri zindagi ho! 💖<br />
                Forever grateful, 🙏💕
              </p>
            </motion.div>
            <motion.button
              onClick={(e) => { for (let i = 0; i < 10; i++) setTimeout(() => createEmoji(e.clientX + (Math.random() - 0.5) * 200, e.clientY + (Math.random() - 0.5) * 200), i * 40) }}
              className="px-5 py-2.5 bg-white/30 backdrop-blur-sm rounded-full text-rose-700 font-semibold text-xs cursor-pointer border border-white/40"
              whileTap={{ scale: 0.9 }}>More Love 💕</motion.button>
          </motion.div>
        )}
      </div>

      {/* ========== MIDDLE: Roam Box ========== */}
      {!forgiven && isButtonActivated && (
        <motion.div
          ref={roamBoxRef}
          className="relative z-10 flex-1 mx-3 my-2 rounded-2xl overflow-hidden min-h-[160px]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            background: 'linear-gradient(135deg, rgba(255,182,193,0.15) 0%, rgba(255,228,225,0.1) 50%, rgba(255,192,203,0.15) 100%)',
            border: '2px dashed rgba(255,105,135,0.3)',
            boxShadow: 'inset 0 0 30px rgba(255,105,135,0.08)',
          }}
        >
          {/* Decorative corners */}
          <div className="absolute top-1 left-2 text-xs opacity-20">🌸</div>
          <div className="absolute top-1 right-2 text-xs opacity-20">✨</div>
          <div className="absolute bottom-8 left-2 text-xs opacity-20">💫</div>
          <div className="absolute bottom-8 right-2 text-xs opacity-20">🌟</div>

          {/* Runaway Button */}
          <motion.button
            className="absolute left-0 top-0 px-3 py-2 text-white font-bold rounded-xl shadow-lg cursor-pointer select-none whitespace-nowrap"
            style={{
              touchAction: 'none',
              scale: btnScale,
              background: `linear-gradient(to right, var(--tw-gradient-stops))`,
              fontSize: `${Math.max(10, 13 - attemptCount * 0.2)}px`,
            }}
            animate={{
              x: btnTranslate.x,
              y: btnTranslate.y,
              rotate: attemptCount > 5 ? (Math.random() - 0.5) * 15 : 0,
            }}
            transition={{
              type: 'spring',
              stiffness: 350 + attemptCount * 10,
              damping: 22,
            }}
            onClick={(e) => {
              e.preventDefault()
              handleRunawayClick(e.clientX, e.clientY)
              setNoBtnLabel("HAHA! Pakad Nahi Paya! 😂🏃‍♂️💨")
              setAttemptCount(prev => prev + 1)
            }}
            onTouchStart={(e) => {
              e.preventDefault()
              const touch = e.touches[0]
              handleRunawayClick(touch.clientX, touch.clientY)
            }}
          >
            <span className={`flex items-center gap-1 bg-gradient-to-r ${btnColors[btnColorIndex]} px-3 py-2 rounded-xl`}>
              {noBtnLabel}
            </span>
            {/* Speed trails */}
            <motion.div className="absolute -right-1 -top-1 w-2 h-2 bg-red-400 rounded-full"
              animate={{ scale: [0, 1, 0], opacity: [1, 0.5, 0] }}
              transition={{ duration: 0.3, repeat: Infinity }} />
            <motion.div className="absolute -left-1 -bottom-1 w-1.5 h-1.5 bg-orange-400 rounded-full"
              animate={{ scale: [0, 1, 0], opacity: [1, 0.5, 0] }}
              transition={{ duration: 0.3, repeat: Infinity, delay: 0.15 }} />
          </motion.button>

          {/* Roam box label */}
          <motion.div
            className="absolute bottom-1.5 left-0 right-0 text-center"
            key={roamLabelIndex}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-rose-400/40 text-xs font-medium">
              {roamBoxLabels[roamLabelIndex]}
            </span>
          </motion.div>
        </motion.div>
      )}

      {/* ========== BOTTOM: Maf Kar Diya ========== */}
      {!forgiven && (
        <div className="relative z-20 px-5 pb-5 pt-2 shrink-0">
          {!isButtonActivated ? (
            <motion.div className="flex flex-col items-center gap-3 w-full"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              {/* Maf Kar Diya */}
              <motion.button onClick={handleForgive}
                className="w-full max-w-xs px-6 py-4 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white font-extrabold text-lg rounded-2xl shadow-xl shadow-pink-500/30 cursor-pointer relative overflow-hidden"
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.92 }}>
                <span className="flex items-center justify-center gap-2 relative z-10">
                  <Heart className="w-5 h-5 fill-white" /> Maf Kar Diya 💕
                </span>
                <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ['-100%', '200%'] }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} />
              </motion.button>
              {/* Nahi Maf Karunga */}
              <motion.button onClick={handleNoButtonFirstTouch}
                onTouchStart={(e) => { e.preventDefault(); handleNoButtonFirstTouch() }}
                className="w-full max-w-xs px-6 py-4 bg-gradient-to-r from-gray-400 to-gray-500 text-white font-bold text-lg rounded-2xl shadow-lg cursor-pointer select-none"
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}>
                Nahi Maf Karunga! 😤
              </motion.button>
              <motion.p className="text-rose-400/50 text-xs text-center"
                animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 3, repeat: Infinity }}>
                Ek option choose karo... 😏
              </motion.p>
            </motion.div>
          ) : (
            <motion.div className="flex flex-col items-center gap-2"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              {/* Maf Kar Diya - pulsing */}
              <motion.button onClick={handleForgive}
                className="w-full max-w-xs px-6 py-4 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white font-extrabold text-lg rounded-2xl shadow-2xl shadow-pink-500/50 cursor-pointer relative overflow-hidden"
                whileTap={{ scale: 0.92 }}
                animate={{ scale: [1, 1.04, 1], boxShadow: ['0 25px 50px rgba(236,64,122,0.3)', '0 25px 50px rgba(236,64,122,0.5)', '0 25px 50px rgba(236,64,122,0.3)'] }}
                transition={{ duration: 1.5, repeat: Infinity }}>
                <span className="flex items-center justify-center gap-2 relative z-10">
                  <Heart className="w-5 h-5 fill-white animate-pulse" /> Maf Kar Diya 💕
                </span>
                <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                  animate={{ x: ['-100%', '200%'] }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} />
              </motion.button>
              <p className="text-rose-500/60 text-xs text-center">
                Sirf yahi button kaam karta hai! 😄
              </p>
            </motion.div>
          )}
        </div>
      )}

      {/* Footer */}
      <footer className="pb-3 pt-1 text-center w-full relative z-10 shrink-0">
        <p className="text-rose-400/40 text-xs">
          Made with 💕 for Shreya
          {attemptCount > 0 && !forgiven && ` • ${attemptCount} failed attempts 🏃‍♂️`}
        </p>
      </footer>
    </div>
  )
}

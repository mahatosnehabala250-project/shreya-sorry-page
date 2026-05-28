'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Sparkles, Crown, Zap, Trophy, Star } from 'lucide-react'

const sorryMessages = [
  "Shreya, I'm Really Sorry! 🥺",
  "Please Maaf Kar Do! 😢",
  "I Promise I Won't Do It Again! 🙏",
  "Sir Maaf Kardo Shreya! 🙇‍♂️",
  "Ab Toh Maaf Hi Kar Do! 😭",
  "Dil Se Sorry Shreya! 💖",
]

// Text always stays "Nahi Maf Karunga!" - never changes

const praiseMessages = [
  "Tum Itni Achi Ho Ki Dil Khush Ho Gaya! 🌸",
  "Shreya Tumhare Jaisi Koi Nahi! 💎",
  "World's Most Kindest Person = Shreya! 🏆",
  "Tumhari Smile Sabse Pyari Hai! 😊",
  "Shreya Tum Ek Angel Ho! 😇",
]

export default function Home() {
  const [forgiven, setForgiven] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showFireworks, setShowFireworks] = useState(false)
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number; emoji: string }[]>([])
  const NO_BTN_TEXT = "Nahi Maf Karunga! 😤"
  const [messageIndex, setMessageIndex] = useState(0)
  const [praiseIndex, setPraiseIndex] = useState(0)
  const [attemptCount, setAttemptCount] = useState(0)
  const [isButtonActivated, setIsButtonActivated] = useState(false)
  const [btnTranslate, setBtnTranslate] = useState({ x: 0, y: 0 })
  const [screenSize, setScreenSize] = useState({ w: 0, h: 0 })
  const [shakeScreen, setShakeScreen] = useState(false)

  const [showMilestone, setShowMilestone] = useState('')
  const [touchedNoBtn, setTouchedNoBtn] = useState(false)

  const heartIdRef = useRef(0)
  const roamBoxRef = useRef<HTMLDivElement>(null)

  // Nahi Maf Karunga button always stays grey

  useEffect(() => {
    const updateSize = () => setScreenSize({ w: window.innerWidth, h: window.innerHeight })
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  const moveBtnRandom = useCallback(() => {
    const box = roamBoxRef.current
    if (!box) return
    const boxW = box.clientWidth
    const boxH = box.clientHeight
    const btnW = 160
    const btnH = 38
    const sizeFactor = Math.max(0.6, 1 - attemptCount * 0.02)
    const maxX = Math.max(0, boxW - btnW * sizeFactor)
    const maxY = Math.max(0, boxH - btnH * sizeFactor)
    const newX = Math.random() * maxX
    const newY = Math.random() * maxY
    setBtnTranslate({ x: newX, y: newY })
  }, [attemptCount])

  const createEmoji = useCallback((x: number, y: number, emoji?: string) => {
    const id = heartIdRef.current++
    const emojis = ['💕', '💖', '🌸', '✨', '🦋', '🌹', '💗', '💝', '🥰', '😇', '🎊', '🎆', '😭', '🤣', '💪']
    setHearts(prev => [...prev, { id, x, y, emoji: emoji || emojis[Math.floor(Math.random() * emojis.length)] }])
    setTimeout(() => { setHearts(prev => prev.filter(h => h.id !== id)) }, 2500)
  }, [])

  const handleNoButtonFirstTouch = useCallback(() => {
    if (!isButtonActivated) {
      setIsButtonActivated(true)
      setShakeScreen(true)
      setTimeout(() => setShakeScreen(false), 400)
      setTimeout(() => moveBtnRandom(), 50)
      setAttemptCount(1)
      setTouchedNoBtn(true)
    }
  }, [isButtonActivated, moveBtnRandom])

  const handleRunawayClick = useCallback((clientX: number, clientY: number) => {
    moveBtnRandom()
    setAttemptCount(prev => prev + 1)
    setMessageIndex(prev => Math.min(prev + 1, sorryMessages.length - 1))
    createEmoji(clientX, clientY, '🏃‍♂️')
    setShakeScreen(true)
    setTimeout(() => setShakeScreen(false), 300)

    const newCount = attemptCount + 1
    if (newCount === 5) {
      setShowMilestone('5 Attempts! 🏅')
      setTimeout(() => setShowMilestone(''), 2000)
    } else if (newCount === 10) {
      setShowMilestone('10 Attempts! 🏆')
      setTimeout(() => setShowMilestone(''), 2500)
    } else if (newCount === 20) {
      setShowMilestone('20 Attempts!! 🤯')
      setTimeout(() => setShowMilestone(''), 3000)
    }
  }, [attemptCount, moveBtnRandom, createEmoji])

  const handleForgive = useCallback(() => {
    setForgiven(true)
    setShowConfetti(true)
    setShowFireworks(true)
    for (let i = 0; i < 25; i++) {
      setTimeout(() => { createEmoji(Math.random() * screenSize.w, Math.random() * screenSize.h) }, i * 80)
    }
    let pIdx = 0
    const pi = setInterval(() => { pIdx = (pIdx + 1) % praiseMessages.length; setPraiseIndex(pIdx) }, 3000)
    setTimeout(() => { setShowConfetti(false); setShowFireworks(false) }, 12000)
    setTimeout(() => clearInterval(pi), 30000)
    const er = setInterval(() => { for (let i = 0; i < 3; i++) createEmoji(Math.random() * screenSize.w, -20) }, 500)
    setTimeout(() => clearInterval(er), 15000)
  }, [screenSize, createEmoji])

  const btnScale = Math.max(0.6, 1 - attemptCount * 0.02)

  const confettiColors = ['#ff6b9d', '#c44dff', '#ff4757', '#ffa502', '#2ed573', '#1e90ff', '#ff6348', '#ffd700', '#ff1493', '#00ff88']
  const confettiParticles = Array.from({ length: 100 }, (_, i) => ({
    id: i, x: Math.random() * 100, color: confettiColors[i % confettiColors.length],
    delay: Math.random() * 3, duration: 2 + Math.random() * 4,
    size: 4 + Math.random() * 10, isCircle: Math.random() > 0.5,
  }))
  const fireworkPositions = [{ x: 15, y: 15 }, { x: 50, y: 8 }, { x: 85, y: 15 }, { x: 30, y: 25 }, { x: 70, y: 22 }]

  return (
    <div
      className={`relative flex flex-col select-none ${shakeScreen ? 'animate-pulse' : ''}`}
      style={{
        height: '100dvh',
        background: forgiven
          ? 'linear-gradient(135deg, #fce4ec 0%, #f8bbd0 25%, #f48fb1 50%, #ec407a 75%, #e91e63 100%)'
          : 'linear-gradient(180deg, #fff0f3 0%, #ffe0e6 30%, #ffb3c1 60%, #ff758f 85%, #ff5252 100%)',
        transition: 'background 1s ease',
        overflow: 'hidden',
      }}
    >
      {/* Background floating elements */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div key={i} className="absolute"
            initial={{ x: Math.random() * (screenSize.w || 300), y: -50, scale: 0.3 + Math.random() * 0.3 }}
            animate={{ y: (screenSize.h || 600) + 100, rotate: 360 }}
            transition={{ duration: 14 + Math.random() * 10, repeat: Infinity, delay: Math.random() * 8, ease: 'linear' }}
          >
            {i % 3 === 0 ? (
              <Heart className="w-3 h-3 text-pink-200/20 fill-pink-200/20" />
            ) : i % 3 === 1 ? (
              <span className="text-xs opacity-20">✨</span>
            ) : (
              <span className="text-xs opacity-15">💕</span>
            )}
          </motion.div>
        ))}
      </div>

      {/* Fireworks */}
      <AnimatePresence>
        {showFireworks && fireworkPositions.map((pos, idx) => (
          <motion.div key={`fw-${idx}`} className="absolute pointer-events-none z-30"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            initial={{ scale: 0, opacity: 1 }} animate={{ scale: [0, 3, 4.5], opacity: [1, 0.7, 0] }}
            transition={{ duration: 1.5, delay: idx * 0.3, repeat: 4, repeatDelay: 1 }}
          >
            {Array.from({ length: 8 }).map((_, j) => (
              <motion.div key={j} className="absolute w-2 h-2 rounded-full"
                style={{ backgroundColor: confettiColors[(idx + j) % confettiColors.length] }}
                animate={{ x: Math.cos((j / 8) * Math.PI * 2) * 50, y: Math.sin((j / 8) * Math.PI * 2) * 50 }}
                transition={{ duration: 1, delay: idx * 0.3 }}
              />
            ))}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Milestone popup */}
      <AnimatePresence>
        {showMilestone && (
          <motion.div
            className="absolute inset-0 z-[60] flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white/85 backdrop-blur-md rounded-3xl px-6 py-4 shadow-2xl border-2 border-yellow-400"
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: [0, 1.2, 1], rotate: [0, 10, 0] }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 12 }}
            >
              <p className="text-xl font-black text-rose-600 text-center">{showMilestone}</p>
              <p className="text-xs text-rose-500 text-center mt-1">Aur try kar! 😂</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Emoji popups */}
      <AnimatePresence>
        {hearts.map(h => (
          <motion.div key={h.id} className="fixed pointer-events-none z-50 text-2xl"
            initial={{ x: h.x, y: h.y, scale: 0, opacity: 1 }}
            animate={{ y: h.y - 180, scale: 1.5, opacity: 0, rotate: Math.random() * 360 }}
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
            animate={{ y: (screenSize.h || 600) + 80, opacity: [1, 1, 0.5, 0], rotate: 720 * (Math.random() > 0.5 ? 1 : -1), x: (Math.random() - 0.5) * 200 }}
            transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
          />
        ))}
      </AnimatePresence>

      {/* ========== TOP: Image + Text ========== */}
      <div className="relative z-20 flex flex-col items-center px-4 pt-4 pb-2 shrink-0">
        {/* Image */}
        <motion.div className="relative mb-2" animate={forgiven ? { scale: [1, 1.1, 1] } : {}}>
          <motion.div animate={!forgiven ? { y: [0, -6, 0] } : {}} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}>
            <div className="relative">
              <img src="/sorry-image.png" alt="Sorry Shreya"
                className="w-20 h-20 rounded-full object-cover shadow-xl border-[3px] border-white/80" />
              <motion.div className="absolute inset-0 rounded-full border-2 border-pink-300/40"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 2, repeat: Infinity }} />
            </div>
          </motion.div>
          {!forgiven && (
            <motion.div className="absolute -top-1 -right-1"
              animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}>
              <Sparkles className="w-4 h-4 text-yellow-400" />
            </motion.div>
          )}
          {forgiven && (
            <motion.div className="absolute -top-2 -right-2"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}>
              <Crown className="w-6 h-6 text-yellow-400 drop-shadow-lg" />
            </motion.div>
          )}
        </motion.div>

        {/* Sorry message */}
        <AnimatePresence mode="wait">
          <motion.h1 key={forgiven ? 'f' : messageIndex}
            className="text-base font-extrabold text-center text-rose-700 leading-tight mb-0.5"
            initial={{ opacity: 0, y: 10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }} transition={{ duration: 0.3 }}>
            {forgiven ? "Shreya Ne Maaf Kar Diya! 🎉" : sorryMessages[messageIndex]}
          </motion.h1>
        </AnimatePresence>

        {!forgiven && (
          <motion.p className="text-rose-600/60 text-center text-[11px]"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            Dil se sorry Shreya! Mujhe maaf kar do 🙏💕
          </motion.p>
        )}

        {/* Attempt counter */}
        {!forgiven && attemptCount > 0 && (
          <motion.div key={attemptCount}
            className="flex items-center gap-1.5 bg-white/40 backdrop-blur-sm rounded-full px-2.5 py-0.5 mt-1"
            initial={{ scale: 1.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <Zap className="w-3 h-3 text-amber-500" />
            <span className="text-rose-700 font-bold text-[11px]">
              {attemptCount < 5 ? `${attemptCount} koshish ❌`
                : attemptCount < 10 ? `Level ${Math.floor(attemptCount / 2)} - ${attemptCount} try! 😂`
                : attemptCount < 20 ? `Pro! ${attemptCount} tries! 🤣`
                : `${attemptCount} tries! LEGEND! 🏆`}
            </span>
          </motion.div>
        )}

        {/* Celebration content */}
        {forgiven && (
          <motion.div className="flex flex-col items-center gap-1.5 mt-1 w-full max-w-xs overflow-y-auto"
            style={{ maxHeight: 'calc(100dvh - 220px)' }}
            initial={{ opacity: 0, scale: 0.3 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 150, damping: 12 }}>
            <motion.div className="text-4xl"
              animate={{ rotate: [0, -15, 15, -10, 10, 0], scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}>🎉</motion.div>
            <AnimatePresence mode="wait">
              <motion.p key={praiseIndex} className="text-rose-600 text-center text-sm font-medium px-2"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}>
                {praiseMessages[praiseIndex]}
              </motion.p>
            </AnimatePresence>
            <motion.div className="flex gap-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              {['🥰', '💕', '👑', '💖', '🦋', '🌹', '✨'].map((e, i) => (
                <motion.span key={i} className="text-lg"
                  animate={{ y: [0, -8, 0], rotate: [0, 6, -6, 0] }}
                  transition={{ duration: 1.2, delay: i * 0.1, repeat: Infinity, ease: 'easeInOut' }}>{e}</motion.span>
              ))}
            </motion.div>
            <motion.div className="bg-white/40 backdrop-blur-md rounded-2xl p-3 w-full border border-white/50 shadow-xl"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
              <div className="flex items-center gap-1 mb-1">
                <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                <span className="font-bold text-rose-700 text-[10px]">Shreya Ke Liye Special 💝</span>
                <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
              </div>
              <p className="text-rose-700 text-[11px] leading-relaxed">
                Dear Shreya, 💕<br /><br />
                Tum world ki sabse pyari insaan ho! Tumne maaf karke mujhe dubara jeene ka hak diya.
                Main promise karta hoon ki aisi galti dubara nahi karunga.
                Tumhare bina meri duniya adhoori hai! 🌸<br /><br />
                Tum meri zindagi ho! 💖<br />
                Forever grateful, 🙏💕
              </p>
            </motion.div>
            <motion.button
              onClick={(e) => { for (let i = 0; i < 8; i++) setTimeout(() => createEmoji(e.clientX + (Math.random() - 0.5) * 200, e.clientY + (Math.random() - 0.5) * 200), i * 50) }}
              className="px-4 py-2 bg-white/30 backdrop-blur-sm rounded-full text-rose-700 font-semibold text-xs cursor-pointer border border-white/40"
              whileTap={{ scale: 0.9 }}>More Love 💕</motion.button>
          </motion.div>
        )}
      </div>

      {/* ========== MIDDLE: Roam Box ========== */}
      {!forgiven && isButtonActivated && (
        <motion.div
          ref={roamBoxRef}
          className="relative z-10 flex-1 mx-3 my-1 rounded-2xl overflow-hidden"
          style={{ minHeight: '120px' }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Subtle inner glow instead of dashed border */}
          <div className="absolute inset-0 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(255,182,193,0.1) 0%, rgba(255,228,225,0.05) 50%, rgba(255,192,203,0.1) 100%)',
              boxShadow: 'inset 0 0 40px rgba(255,105,135,0.06), 0 0 0 1px rgba(255,105,135,0.1)',
            }}
          />

          {/* Fun zone label at top */}
          <motion.div
            className="absolute top-1 left-0 right-0 text-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          >
            <span className="text-rose-400/30 text-[10px] font-medium tracking-wider uppercase">
              🏃 Pakad Ke Dikhao Zone 🏃
            </span>
          </motion.div>

          {/* Runaway Button */}
          <motion.button
            className="absolute left-0 top-0 text-white font-bold rounded-xl shadow-lg cursor-pointer select-none whitespace-nowrap"
            style={{
              touchAction: 'none',
              scale: btnScale,
              fontSize: `${Math.max(11, 13 - attemptCount * 0.15)}px`,
            }}
            animate={{
              x: btnTranslate.x,
              y: btnTranslate.y,
              rotate: attemptCount > 5 ? (Math.random() - 0.5) * 10 : 0,
            }}
            transition={{
              type: 'spring',
              stiffness: 400 + attemptCount * 15,
              damping: 20,
            }}
            onClick={(e) => {
              e.preventDefault()
              handleRunawayClick(e.clientX, e.clientY)
            }}
            onTouchStart={(e) => {
              e.preventDefault()
              const touch = e.touches[0]
              handleRunawayClick(touch.clientX, touch.clientY)
            }}
          >
            <span className="flex items-center gap-1 bg-gradient-to-r from-gray-500 to-gray-600 px-3 py-2 rounded-xl shadow-md">
              {NO_BTN_TEXT}
            </span>
          </motion.button>

          {/* Bottom hint */}
          <motion.div
            className="absolute bottom-1 left-0 right-0 text-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          >
            <span className="text-rose-400/25 text-[9px]">
              {attemptCount < 3 ? "👆 Try pakadne ka!" 
                : attemptCount < 7 ? "😂 Ha ha nahi hoga!"
                : attemptCount < 15 ? "🤣 Legend ban rahi hai!"
                : "🏆 Giving up? Maf Kar Diya dabao!"}
            </span>
          </motion.div>
        </motion.div>
      )}

      {/* ========== BOTTOM: Buttons ========== */}
      {!forgiven && (
        <div className="relative z-20 px-4 pb-4 pt-1 shrink-0">
          {!isButtonActivated ? (
            /* Initial state: both buttons stacked */
            <motion.div className="flex flex-col items-center gap-2.5 w-full"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              {/* Maf Kar Diya */}
              <motion.button onClick={handleForgive}
                className="w-full max-w-xs px-5 py-3.5 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-pink-500/30 cursor-pointer relative overflow-hidden"
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.92 }}>
                <span className="flex items-center justify-center gap-2 relative z-10">
                  <Heart className="w-4 h-4 fill-white" /> Maf Kar Diya 💕
                </span>
                <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ['-100%', '200%'] }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} />
              </motion.button>
              {/* Nahi Maf Karunga */}
              <motion.button 
                onClick={handleNoButtonFirstTouch}
                onTouchStart={(e) => { e.preventDefault(); handleNoButtonFirstTouch() }}
                className="w-full max-w-xs px-5 py-3.5 bg-gradient-to-r from-gray-400 to-gray-500 text-white font-bold text-base rounded-2xl shadow-lg cursor-pointer select-none"
                whileTap={{ scale: 0.95 }}>
                Nahi Maf Karunga! 😤
              </motion.button>
              <motion.p className="text-rose-400/50 text-[10px] text-center"
                animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 3, repeat: Infinity }}>
                Ek option choose karo... 😏
              </motion.p>
            </motion.div>
          ) : (
            /* After activation: only Maf Kar Diya with pulse */
            <motion.div className="flex flex-col items-center gap-1.5"
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <motion.button onClick={handleForgive}
                className="w-full max-w-xs px-5 py-3.5 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white font-extrabold text-base rounded-2xl shadow-2xl shadow-pink-500/50 cursor-pointer relative overflow-hidden"
                whileTap={{ scale: 0.92 }}
                animate={{ scale: [1, 1.03, 1], boxShadow: ['0 20px 40px rgba(236,64,122,0.3)', '0 20px 40px rgba(236,64,122,0.5)', '0 20px 40px rgba(236,64,122,0.3)'] }}
                transition={{ duration: 1.5, repeat: Infinity }}>
                <span className="flex items-center justify-center gap-2 relative z-10">
                  <Heart className="w-4 h-4 fill-white animate-pulse" /> Maf Kar Diya 💕
                </span>
                <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                  animate={{ x: ['-100%', '200%'] }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} />
              </motion.button>
              <p className="text-rose-500/50 text-[10px] text-center">
                Sirf yahi button kaam karta hai! 😄
              </p>
            </motion.div>
          )}
        </div>
      )}

      {/* Footer */}
      <footer className="pb-2 pt-0.5 text-center w-full relative z-10 shrink-0">
        <p className="text-rose-400/35 text-[9px]">
          Made with 💕 for Shreya
          {attemptCount > 0 && !forgiven && ` • ${attemptCount} failed attempts 🏃‍♂️`}
        </p>
      </footer>
    </div>
  )
}

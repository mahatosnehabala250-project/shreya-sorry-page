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
  "Pakad Nahi Paya! 😝",
  "Chor De Mujhe! 🏃💨",
  "NOT! 🤣",
  "Main Bhagta Rahoonga! 🏃‍♂️💨",
  "Kabhi Nahi Pakad Payegi! 😎",
  "Mujhe Mat Pakad! 😱",
  "Hehe Bhag! 🏃",
]

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
  const [noBtnLabel, setNoBtnLabel] = useState("Nahi Maf Karunga! 😤")
  const [messageIndex, setMessageIndex] = useState(0)
  const [praiseIndex, setPraiseIndex] = useState(0)
  const [attemptCount, setAttemptCount] = useState(0)
  const [isButtonActivated, setIsButtonActivated] = useState(false)
  const [btnTranslate, setBtnTranslate] = useState({ x: 0, y: 0 })
  const [screenSize, setScreenSize] = useState({ w: 0, h: 0 })

  const heartIdRef = useRef(0)
  const roamBoxRef = useRef<HTMLDivElement>(null)

  // Get screen size
  useEffect(() => {
    const updateSize = () => setScreenSize({ w: window.innerWidth, h: window.innerHeight })
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  // Move button to random position within the roam box using CSS transform
  const moveBtnRandom = useCallback(() => {
    const box = roamBoxRef.current
    if (!box) return
    const boxW = box.clientWidth
    const boxH = box.clientHeight
    // Button is about 180x44, so limit movement
    const maxX = boxW - 180
    const maxY = boxH - 44
    const newX = Math.max(0, Math.random() * maxX)
    const newY = Math.max(0, Math.random() * maxY)
    setBtnTranslate({ x: newX, y: newY })
    setNoBtnLabel(noBtnLabels[Math.floor(Math.random() * noBtnLabels.length)])
  }, [])

  // Create floating emoji
  const createEmoji = useCallback((x: number, y: number, emoji?: string) => {
    const id = heartIdRef.current++
    const emojis = ['💕', '💖', '🌸', '✨', '🦋', '🌹', '💗', '💝', '🥰', '😇', '🎊', '🎆']
    setHearts(prev => [...prev, { id, x, y, emoji: emoji || emojis[Math.floor(Math.random() * emojis.length)] }])
    setTimeout(() => { setHearts(prev => prev.filter(h => h.id !== id)) }, 2500)
  }, [])

  // Activate runaway
  const handleNoButtonFirstTouch = useCallback(() => {
    if (!isButtonActivated) {
      setIsButtonActivated(true)
      // Small delay so the roam box renders, then move
      setTimeout(() => moveBtnRandom(), 50)
      setNoBtnLabel("Aha! Ab Pakad Ke Dikhao! 😏🏃‍♂️")
      setAttemptCount(1)
    }
  }, [isButtonActivated, moveBtnRandom])

  // Maf Kar Diya - INSTANT CELEBRATION!
  const handleForgive = useCallback(() => {
    setForgiven(true)
    setShowConfetti(true)
    setShowFireworks(true)
    for (let i = 0; i < 25; i++) {
      setTimeout(() => { createEmoji(Math.random() * screenSize.w, Math.random() * screenSize.h) }, i * 80)
    }
    let pIdx = 0
    const pi = setInterval(() => { pIdx = (pIdx + 1) % praiseMessages.length; setPraiseIndex(pIdx) }, 3000)
    setTimeout(() => { setShowConfetti(false); setShowFireworks(false) }, 10000)
    setTimeout(() => clearInterval(pi), 30000)
    const er = setInterval(() => { for (let i = 0; i < 3; i++) createEmoji(Math.random() * screenSize.w, -20) }, 500)
    setTimeout(() => clearInterval(er), 15000)
  }, [screenSize, createEmoji])

  const confettiColors = ['#ff6b9d', '#c44dff', '#ff4757', '#ffa502', '#2ed573', '#1e90ff', '#ff6348', '#ffd700', '#ff1493', '#00ff88']
  const confettiParticles = Array.from({ length: 100 }, (_, i) => ({
    id: i, x: Math.random() * 100, color: confettiColors[i % confettiColors.length],
    delay: Math.random() * 3, duration: 2 + Math.random() * 4,
    size: 4 + Math.random() * 10, isCircle: Math.random() > 0.5,
  }))
  const fireworkPositions = [{ x: 15, y: 20 }, { x: 50, y: 10 }, { x: 85, y: 18 }, { x: 30, y: 30 }, { x: 70, y: 25 }]

  return (
    <div
      className="relative min-h-screen flex flex-col overflow-hidden select-none"
      style={{
        background: forgiven
          ? 'linear-gradient(135deg, #fce4ec 0%, #f8bbd0 25%, #f48fb1 50%, #ec407a 75%, #e91e63 100%)'
          : 'linear-gradient(135deg, #fff5f5 0%, #ffe0e6 25%, #ffb3c1 50%, #ff758f 75%, #ff5252 100%)',
        transition: 'background 1s ease',
      }}
    >
      {/* Background floating */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div key={i} className="absolute"
            initial={{ x: Math.random() * screenSize.w, y: -50, scale: 0.3 + Math.random() * 0.4 }}
            animate={{ y: screenSize.h + 100, rotate: 360 }}
            transition={{ duration: 14 + Math.random() * 10, repeat: Infinity, delay: Math.random() * 6, ease: 'linear' }}
          >
            <Heart className="w-4 h-4 text-pink-200/15 fill-pink-200/15" />
          </motion.div>
        ))}
      </div>

      {/* Fireworks */}
      <AnimatePresence>
        {showFireworks && fireworkPositions.map((pos, idx) => (
          <motion.div key={`fw-${idx}`} className="absolute pointer-events-none z-30"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            initial={{ scale: 0, opacity: 1 }} animate={{ scale: [0, 3, 4], opacity: [1, 0.8, 0] }}
            transition={{ duration: 1.5, delay: idx * 0.3, repeat: 3, repeatDelay: 1 }}
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

      {/* Emoji popups */}
      <AnimatePresence>
        {hearts.map(h => (
          <motion.div key={h.id} className="fixed pointer-events-none z-50 text-2xl"
            initial={{ x: h.x, y: h.y, scale: 0, opacity: 1 }}
            animate={{ y: h.y - 180, scale: 1.3, opacity: 0, rotate: Math.random() * 360 }}
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
            animate={{ y: screenSize.h + 80, opacity: [1, 1, 0.5, 0], rotate: 720 * (Math.random() > 0.5 ? 1 : -1), x: (Math.random() - 0.5) * 200 }}
            transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
          />
        ))}
      </AnimatePresence>

      {/* ========== TOP: Image + Text ========== */}
      <div className="relative z-20 flex flex-col items-center px-5 pt-6 pb-2 shrink-0">
        <motion.div className="relative mb-3" animate={forgiven ? { scale: [1, 1.12, 1] } : {}}>
          <motion.div animate={!forgiven ? { y: [0, -8, 0] } : {}} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}>
            <div className="relative">
              <img src="/sorry-image.png" alt="Sorry Shreya" className="w-24 h-24 rounded-full object-cover shadow-xl border-4 border-white/70" />
              <motion.div className="absolute inset-0 rounded-full border-2 border-pink-300/40"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>
          {!forgiven && (
            <motion.div className="absolute -top-1 -right-1" animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <Sparkles className="w-5 h-5 text-yellow-400" />
            </motion.div>
          )}
          {forgiven && (
            <motion.div className="absolute -top-2 -right-2" initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 200 }}>
              <Crown className="w-7 h-7 text-yellow-400" />
            </motion.div>
          )}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.h1 key={forgiven ? 'f' : messageIndex}
            className="text-lg font-extrabold text-center text-rose-700 leading-tight mb-1"
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.4 }}
          >
            {forgiven ? "Shreya Ne Maaf Kar Diya! 🎉" : sorryMessages[messageIndex]}
          </motion.h1>
        </AnimatePresence>

        {!forgiven && (
          <motion.p className="text-rose-600/70 text-center text-xs" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            Dil se sorry Shreya! Mujhe maaf kar do 🙏💕
          </motion.p>
        )}

        {/* Attempt counter */}
        {!forgiven && attemptCount > 0 && (
          <motion.div key={attemptCount} className="bg-white/40 backdrop-blur-sm rounded-full px-3 py-1 mt-1.5"
            initial={{ scale: 1.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          >
            <span className="text-rose-700 font-semibold text-xs">
              {attemptCount < 3 ? `Pakadne ki koshish: ${attemptCount} ❌`
                : attemptCount < 6 ? `${attemptCount} baar try! 😂`
                : attemptCount < 10 ? `${attemptCount} attempts! Give up kar! 🤣`
                : `${attemptCount} attempts!! Maaf hi kar de! 😭😂`}
            </span>
          </motion.div>
        )}

        {/* Celebration */}
        {forgiven && (
          <motion.div className="flex flex-col items-center gap-2 mt-2"
            initial={{ opacity: 0, scale: 0.3 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 150, damping: 12 }}
          >
            <motion.div className="text-4xl" animate={{ rotate: [0, -15, 15, -10, 10, 0], scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}>🎉</motion.div>
            <AnimatePresence mode="wait">
              <motion.p key={praiseIndex} className="text-rose-600 text-center text-sm font-medium"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.5 }}>
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
                <span className="font-bold text-rose-700 text-xs">Shreya Ke Liye</span>
                <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
              </div>
              <p className="text-rose-700 text-xs leading-relaxed">
                Dear Shreya, 💕<br /><br />
                Tum world ki sabse pyari insaan ho! Tumne maaf karke mujhe dubara jeene ka hak diya.
                Main promise karta hoon ki aisi galti dubara nahi karunga. 🌸<br /><br />
                Forever grateful, 🙏💖
              </p>
            </motion.div>
            <motion.button onClick={(e) => { for (let i = 0; i < 8; i++) setTimeout(() => createEmoji(e.clientX + (Math.random() - 0.5) * 150, e.clientY + (Math.random() - 0.5) * 150), i * 50) }}
              className="px-4 py-2 bg-white/30 backdrop-blur-sm rounded-full text-rose-700 font-semibold text-xs cursor-pointer border border-white/40"
              whileTap={{ scale: 0.9 }}>More Love 💕</motion.button>
          </motion.div>
        )}
      </div>

      {/* ========== MIDDLE: Roam Box (overflow hidden = button can NEVER escape) ========== */}
      {!forgiven && isButtonActivated && (
        <div
          ref={roamBoxRef}
          className="relative z-10 flex-1 mx-3 my-2 rounded-2xl overflow-hidden min-h-[140px]"
          style={{ background: 'radial-gradient(circle, rgba(255,182,193,0.2) 0%, rgba(255,228,225,0.1) 100%)', border: '2px dashed rgba(255,105,135,0.25)' }}
        >
          <motion.button
            className="absolute left-0 top-0 px-3 py-2.5 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-bold text-xs rounded-xl shadow-lg cursor-pointer select-none whitespace-nowrap"
            style={{ touchAction: 'none' }}
            animate={{ x: btnTranslate.x, y: btnTranslate.y }}
            transition={{ type: 'spring', stiffness: 350, damping: 22 }}
            onClick={(e) => {
              e.preventDefault()
              moveBtnRandom()
              setNoBtnLabel("HAHA! Pakad Nahi Paya! 😂🏃‍♂️💨")
              setAttemptCount(prev => prev + 2)
              setMessageIndex(prev => Math.min(prev + 1, sorryMessages.length - 1))
              createEmoji(e.clientX, e.clientY, '🏃‍♂️')
            }}
            onTouchStart={(e) => {
              e.preventDefault()
              moveBtnRandom()
              setAttemptCount(prev => prev + 1)
              setMessageIndex(prev => Math.min(prev + 1, sorryMessages.length - 1))
            }}
          >
            <span className="flex items-center gap-1">{noBtnLabel}</span>
          </motion.button>
          {/* Fun label inside the roam box */}
          <p className="absolute bottom-2 left-0 right-0 text-center text-rose-400/30 text-xs">
            🏃‍♂️ Pakadne ki koshish kar...
          </p>
        </div>
      )}

      {/* ========== BOTTOM: Maf Kar Diya ========== */}
      {!forgiven && (
        <div className="relative z-20 px-5 pb-5 pt-2 shrink-0">
          {!isButtonActivated ? (
            <motion.div className="flex flex-col items-center gap-3 w-full"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            >
              <motion.button onClick={handleForgive}
                className="w-full max-w-xs px-6 py-4 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white font-extrabold text-lg rounded-2xl shadow-xl shadow-pink-500/30 cursor-pointer relative overflow-hidden"
                whileTap={{ scale: 0.92 }}>
                <span className="flex items-center justify-center gap-2 relative z-10">
                  <Heart className="w-5 h-5 fill-white" /> Maf Kar Diya 💕
                </span>
                <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ['-100%', '200%'] }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} />
              </motion.button>
              <button onClick={handleNoButtonFirstTouch}
                onTouchStart={(e) => { e.preventDefault(); handleNoButtonFirstTouch() }}
                className="w-full max-w-xs px-6 py-4 bg-gradient-to-r from-gray-400 to-gray-500 text-white font-bold text-lg rounded-2xl shadow-lg cursor-pointer select-none"
              >
                Nahi Maf Karunga! 😤
              </button>
              <motion.p className="text-rose-400/50 text-xs text-center"
                animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 3, repeat: Infinity }}>
                Ek option choose karo... 😏
              </motion.p>
            </motion.div>
          ) : (
            <motion.div className="flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <motion.button onClick={handleForgive}
                className="w-full max-w-xs px-6 py-4 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white font-extrabold text-lg rounded-2xl shadow-2xl shadow-pink-500/40 cursor-pointer relative overflow-hidden"
                whileTap={{ scale: 0.92 }}
                animate={{ scale: [1, 1.04, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <span className="flex items-center justify-center gap-2 relative z-10">
                  <Heart className="w-5 h-5 fill-white" /> Maf Kar Diya 💕
                </span>
                <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                  animate={{ x: ['-100%', '200%'] }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} />
              </motion.button>
            </motion.div>
          )}
        </div>
      )}

      {/* Footer */}
      <footer className="pb-3 pt-1 text-center w-full relative z-10 shrink-0">
        <p className="text-rose-400/40 text-xs">Made with 💕 for Shreya</p>
      </footer>
    </div>
  )
}

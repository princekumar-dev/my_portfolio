import { m, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion'
import { useRef, useState, useEffect, useCallback, useMemo } from 'react'
import { FiArrowDown } from 'react-icons/fi'
import { usePointer } from '../context/PointerContext'

const FULL_NAME = 'Prince R'
const TYPING_SPEED = 80
const START_DELAY = 600
const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
const ROLE_TEXTS = ['AI Engineer', 'Data Scientist', 'Full Stack Developer', 'ML Researcher']
const HOLD_MS = 2800
const DECODE_MS = 500
const ENCODE_MS = 250
const STAGGER_MS = 35
const ENCODE_STAGGER_MS = 20
const GAP_MS = 80

function SplitText({ text, className, delay = 0 }) {
  return (
    <span className={className} aria-label={text}>
      {text.split('').map((char, i) => (
        <m.span
          key={i}
          initial={{ opacity: 0, y: 40, rotateX: -80 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            duration: 0.6,
            delay: delay + i * 0.04,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ display: 'inline-block', whiteSpace: char === ' ' ? 'pre' : 'normal' }}
        >
          {char}
        </m.span>
      ))}
    </span>
  )
}

function TextScramble({ texts, className }) {
  const containerRef = useRef(null)
  const rafRef = useRef(0)
  const stateRef = useRef({ phase: 'in', textIdx: 0, startTime: 0 })
  const maxLen = useMemo(() => Math.max(...texts.map(t => t.length)), [texts])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.innerHTML = ''
    const spans = []
    for (let i = 0; i < maxLen; i++) {
      const s = document.createElement('span')
      s.className = 'scramble-char'
      container.appendChild(s)
      spans.push(s)
    }

    const state = stateRef.current
    state.phase = 'in'
    state.textIdx = 0
    state.startTime = performance.now()
    let completedCycles = 0

    const rnd = () => SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]

    const tick = (now) => {
      const elapsed = now - state.startTime
      const text = texts[state.textIdx]

      if (state.phase === 'in') {
        let allSettled = true
        for (let i = 0; i < maxLen; i++) {
          if (i >= text.length) {
            spans[i].textContent = ''
            spans[i].className = 'scramble-char'
            continue
          }
          const delay = i * STAGGER_MS
          const charTime = elapsed - delay
          if (charTime < 0) {
            spans[i].textContent = rnd()
            spans[i].className = 'scramble-char scrambling'
            allSettled = false
          } else if (charTime < DECODE_MS * 0.5) {
            spans[i].textContent = rnd()
            spans[i].className = 'scramble-char scrambling'
            allSettled = false
          } else {
            spans[i].textContent = text[i]
            spans[i].className = 'scramble-char settled'
          }
        }
        if (allSettled) {
          for (let i = 0; i < text.length; i++) {
            spans[i].textContent = text[i]
            spans[i].className = 'scramble-char settled'
          }
          state.phase = 'hold'
          state.startTime = now
        }
      } else if (state.phase === 'hold') {
        if (elapsed >= HOLD_MS) {
          state.phase = 'out'
          state.startTime = now
        }
      } else if (state.phase === 'out') {
        let allCleared = true
        for (let i = 0; i < maxLen; i++) {
          if (i >= text.length) continue
          const delay = (text.length - 1 - i) * ENCODE_STAGGER_MS
          const charTime = elapsed - delay
          if (charTime < 0) {
            spans[i].textContent = text[i]
            spans[i].className = 'scramble-char settled'
            allCleared = false
          } else if (charTime < ENCODE_MS * 0.5) {
            spans[i].textContent = rnd()
            spans[i].className = 'scramble-char scrambling'
            allCleared = false
          } else {
            spans[i].textContent = ''
            spans[i].className = 'scramble-char'
          }
        }
        if (allCleared) {
          completedCycles++
          if (completedCycles >= texts.length) return
          state.textIdx = (state.textIdx + 1) % texts.length
          state.phase = 'in'
          state.startTime = now + GAP_MS
        }
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(rafRef.current)
      container.innerHTML = ''
    }
  }, [texts, maxLen])

  return (
    <span className={`scramble-container ${className || ''}`}>
      <span ref={containerRef} className="scramble-text" />
    </span>
  )
}

function MagneticButton({ children, className, href, target, rel, ...rest }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 500, damping: 20 })
  const springY = useSpring(y, { stiffness: 500, damping: 20 })

  const handleMouseMove = useCallback((e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    x.set((e.clientX - cx) * 0.3)
    y.set((e.clientY - cy) * 0.3)
  }, [x, y])

  const handleMouseLeave = useCallback(() => {
    x.set(0)
    y.set(0)
  }, [x, y])

  const Tag = href ? m.a : m.button

  return (
    <Tag
      ref={ref}
      href={href}
      target={target}
      rel={rel}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={className}
      {...rest}
    >
      {children}
    </Tag>
  )
}

const ParticleCanvas = ({ isMobile }) => {
  const canvasRef = useRef(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const particlesRef = useRef([])
  const rafRef = useRef(0)
  const visibleRef = useRef(true)

  useEffect(() => {
    if (isMobile) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let w = (canvas.width = window.innerWidth)
    let h = (canvas.height = window.innerHeight)

    const cpuCores = navigator.hardwareConcurrency || 4
    const maxParticles = cpuCores <= 4 ? 6 : cpuCores <= 8 ? 8 : 10
    const PARTICLE_COUNT = Math.min(w < 1024 ? 6 : w < 1440 ? 8 : 10, maxParticles)
    const CONNECTION_DIST = 100
    const CONNECTION_DIST_SQ = CONNECTION_DIST * CONNECTION_DIST
    const MOUSE_RADIUS = 120
    const MOUSE_RADIUS_SQ = MOUSE_RADIUS * MOUSE_RADIUS

    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: 1 + Math.random() * 1.5,
      opacity: 0.2 + Math.random() * 0.3,
    }))
    particlesRef.current = particles

    let resizeTimeout
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        w = canvas.width = window.innerWidth
        h = canvas.height = window.innerHeight
      }, 150)
    }
    const handleMouse = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting
        if (!entry.isIntersecting) {
          cancelAnimationFrame(rafRef.current)
        } else {
          rafRef.current = requestAnimationFrame(animate)
        }
      },
      { threshold: 0 }
    )
    observer.observe(canvas)

    window.addEventListener('resize', handleResize)
    window.addEventListener('pointermove', handleMouse, { passive: true })

    const animate = () => {
      if (!visibleRef.current) return

      ctx.clearRect(0, 0, w, h)
      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        const pdx = mx - p.x
        const pdy = my - p.y
        const pdistSq = pdx * pdx + pdy * pdy
        if (pdistSq < MOUSE_RADIUS_SQ && pdistSq > 0) {
          const pdist = Math.sqrt(pdistSq)
          const force = (MOUSE_RADIUS - pdist) / MOUSE_RADIUS * 0.02
          p.vx -= (pdx / pdist) * force
          p.vy -= (pdy / pdist) * force
        }

        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.99
        p.vy *= 0.99

        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1
        p.x = Math.max(0, Math.min(w, p.x))
        p.y = Math.max(0, Math.min(h, p.y))

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(59, 130, 246, ${p.opacity})`
        ctx.fill()
      }

      ctx.beginPath()
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distSq = dx * dx + dy * dy
          if (distSq < CONNECTION_DIST_SQ) {
            const dist = Math.sqrt(distSq)
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
          }
        }
      }
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.06)'
      ctx.lineWidth = 0.5
      ctx.stroke()

      if (mx > 0 && my > 0) {
        ctx.beginPath()
        for (let i = 0; i < particles.length; i++) {
          const dx = mx - particles[i].x
          const dy = my - particles[i].y
          const distSq = dx * dx + dy * dy
          if (distSq < MOUSE_RADIUS_SQ) {
            ctx.moveTo(mx, my)
            ctx.lineTo(particles[i].x, particles[i].y)
          }
        }
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.10)'
        ctx.lineWidth = 0.5
        ctx.stroke()
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      observer.disconnect()
      clearTimeout(resizeTimeout)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('pointermove', handleMouse)
      cancelAnimationFrame(rafRef.current)
    }
  }, [isMobile])

  if (isMobile) return null

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  )
}

const Hero = () => {
  const sectionRef = useRef(null)
  const [displayed, setDisplayed] = useState('')
  const [typingDone, setTypingDone] = useState(false)
  const [badgeVisible, setBadgeVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { nx } = usePointer()
  const arrowX = useSpring(useTransform(nx, (v) => v * 10), { stiffness: 350, damping: 20 })

  useEffect(() => {
    let interval
    let cursorTimeout
    const startTimeout = setTimeout(() => {
      let i = 0
      interval = setInterval(() => {
        i++
        setDisplayed(FULL_NAME.slice(0, i))
        if (i >= FULL_NAME.length) {
          clearInterval(interval)
          cursorTimeout = setTimeout(() => {
            setTypingDone(true)
            setTimeout(() => setBadgeVisible(true), 300)
          }, 800)
        }
      }, TYPING_SPEED)
    }, START_DELAY)
    return () => {
      clearTimeout(startTimeout)
      clearInterval(interval)
      clearTimeout(cursorTimeout)
    }
  }, [])

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const smooth = useSpring(scrollYProgress, { stiffness: 150, damping: 35 })

  const blobsY = useTransform(smooth, [0, 1], [0, 200])
  const gridY = useTransform(smooth, [0, 1], [0, 60])
  const contentY = useTransform(smooth, [0, 1], [0, -40])
  const contentOpacity = useTransform(smooth, [0, 0.8], [1, 0])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.15,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  }

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden pt-16 sm:pt-20"
      style={{ contain: 'layout style', contentVisibility: 'auto' }}
    >
      <m.div style={{ y: gridY }} className="pointer-events-none absolute inset-0 z-0 opacity-[0.4]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(59,130,246,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(59,130,246,0.06) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </m.div>

      <ParticleCanvas isMobile={isMobile} />

      <m.div style={{ y: blobsY }} className="absolute inset-0 z-0">
        <div className={`absolute top-16 left-10 ${isMobile ? 'w-48 h-48' : 'w-72 h-72'} bg-accent-blue/20 rounded-full blur-lg`} />
        <div className={`absolute bottom-24 right-10 ${isMobile ? 'w-48 h-48' : 'w-72 h-72'} bg-accent-cyan/20 rounded-full blur-lg`} />
        {!isMobile && (
          <>
            <div className="absolute top-1/3 right-1/4 w-56 h-56 bg-accent-purple/15 rounded-full blur-lg" />
            <div className="absolute bottom-1/3 left-1/4 w-44 h-44 bg-accent-indigo/15 rounded-full blur-lg" />
          </>
        )}
      </m.div>

      <m.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ y: contentY, opacity: contentOpacity, perspective: 1000 }}
        className="relative z-10 text-center px-4 max-w-4xl"
      >
        <m.div variants={itemVariants} className="mb-6 flex justify-center">
          {badgeVisible && (
            <m.div
              initial={{ opacity: 0, scale: 0.8, filter: 'blur(8px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="badge-shimmer inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-green-500/25 bg-green-500/[0.06] backdrop-blur-sm"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-60" style={{ animation: 'pulseRing 8s ease-out infinite' }} />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
              </span>
              <span className="text-sm font-semibold text-green-600 tracking-wide" style={{ fontFamily: 'Sora, sans-serif' }}>
                Open to Opportunities
              </span>
            </m.div>
          )}
        </m.div>

        <m.div variants={itemVariants} className="mb-6">
          <span className="eyebrow text-accent-blue">Welcome to my portfolio</span>
        </m.div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 leading-tight text-light-900">
          <span className="hero-shimmer bg-gradient-to-r from-accent-blue via-accent-purple to-accent-cyan bg-clip-text text-transparent">
            {typingDone ? (
              <SplitText text={FULL_NAME} className="inline-block" delay={0} />
            ) : (
              displayed
            )}
          </span>
          {!typingDone && (
            <span
              className="inline-block w-[3px] h-[0.85em] ml-1 align-middle bg-accent-blue animate-pulse"
            />
          )}
        </h1>

        <m.p
          variants={itemVariants}
          className="text-lg sm:text-xl md:text-2xl text-light-700 mb-6 sm:mb-8 font-light"
        >
          <TextScramble texts={ROLE_TEXTS} className="text-accent-blue font-semibold" />
        </m.p>

        <m.p
          variants={itemVariants}
          className="text-light-600 text-base sm:text-lg mb-8 sm:mb-12 max-w-2xl mx-auto px-2"
        >
          Building intelligent systems that transform data into meaningful experiences.
          Passionate about creating seamless user experiences and scalable solutions.
        </m.p>

        <m.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <MagneticButton
            href="#projects"
            className="px-8 py-3 bg-gradient-to-r from-accent-blue to-accent-cyan text-white rounded-full font-semibold shadow-lg shadow-accent-blue/20 hover:shadow-xl hover:shadow-accent-blue/40 transition-shadow"
          >
            View My Work
          </MagneticButton>
          <MagneticButton
            href="https://drive.google.com/file/d/15iuECh0MvqrQLKrAnKAN0q7IWkSN_PnL/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 btn-glass rounded-full font-semibold text-accent-blue"
          >
            Download Resume
          </MagneticButton>
        </m.div>
      </m.div>

      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
        style={{ x: arrowX }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10"
      >
        <FiArrowDown className="text-accent-blue text-2xl" />
      </m.div>
    </section>
  )
}

export default Hero

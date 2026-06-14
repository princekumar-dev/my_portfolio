import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion'
import { useRef, useState, useEffect, useCallback, useMemo } from 'react'
import { FiArrowDown } from 'react-icons/fi'

const FULL_NAME = 'Prince R'
const TYPING_SPEED = 80
const START_DELAY = 600
const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*'
const ROLE_TEXTS = ['AI Engineer', 'Data Scientist', 'Full Stack Developer', 'ML Researcher']

function SplitText({ text, className, delay = 0 }) {
  return (
    <span className={className} aria-label={text}>
      {text.split('').map((char, i) => (
        <motion.span
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
        </motion.span>
      ))}
    </span>
  )
}

function TextScramble({ texts, className }) {
  const [displayed, setDisplayed] = useState('')
  const [textIndex, setTextIndex] = useState(0)
  const [isScrambling, setIsScrambling] = useState(true)

  useEffect(() => {
    const target = texts[textIndex]
    let frame = 0
    const totalFrames = target.length * 3
    const interval = setInterval(() => {
      frame++
      const progress = frame / totalFrames
      const revealed = Math.floor(progress * target.length)
      const scrambled = target
        .slice(revealed)
        .split('')
        .map(() => SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)])
        .join('')
      setDisplayed(target.slice(0, revealed) + scrambled)
      if (frame >= totalFrames) {
        clearInterval(interval)
        setDisplayed(target)
        setIsScrambling(false)
        setTimeout(() => {
          setIsScrambling(true)
          setTextIndex((prev) => (prev + 1) % texts.length)
        }, 3000)
      }
    }, 40)
    return () => clearInterval(interval)
  }, [textIndex, texts])

  return (
    <span className={`scramble-text ${className || ''}`}>
      {displayed}
      {isScrambling && (
        <span className="inline-block w-[2px] h-[1em] ml-0.5 align-middle bg-accent-blue animate-pulse" />
      )}
    </span>
  )
}

function MagneticButton({ children, className, href, target, rel, ...rest }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 300, damping: 20 })
  const springY = useSpring(y, { stiffness: 300, damping: 20 })

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

  const Tag = href ? motion.a : motion.button

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

  useEffect(() => {
    if (isMobile) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let w = (canvas.width = window.innerWidth)
    let h = (canvas.height = window.innerHeight)

    const PARTICLE_COUNT = 60
    const CONNECTION_DIST = 120
    const MOUSE_RADIUS = 150

    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: 1 + Math.random() * 1.5,
      opacity: 0.2 + Math.random() * 0.3,
    }))
    particlesRef.current = particles

    const handleResize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
    }
    const handleMouse = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('pointermove', handleMouse, { passive: true })

    const animate = () => {
      ctx.clearRect(0, 0, w, h)
      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      particles.forEach((p) => {
        const dx = mx - p.x
        const dy = my - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < MOUSE_RADIUS && dist > 0) {
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS * 0.02
          p.vx -= (dx / dist) * force
          p.vy -= (dy / dist) * force
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
      })

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < CONNECTION_DIST) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.08 * (1 - dist / CONNECTION_DIST)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      if (mx > 0 && my > 0) {
        for (let i = 0; i < particles.length; i++) {
          const dx = mx - particles[i].x
          const dy = my - particles[i].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < MOUSE_RADIUS) {
            ctx.beginPath()
            ctx.moveTo(mx, my)
            ctx.lineTo(particles[i].x, particles[i].y)
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.15 * (1 - dist / MOUSE_RADIUS)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
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
  const mouseX = useMotionValue(0)
  const arrowX = useSpring(mouseX, { stiffness: 150, damping: 20 })

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

  useEffect(() => {
    const handlePointer = (e) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 20
      mouseX.set(nx)
    }
    window.addEventListener('pointermove', handlePointer, { passive: true })
    return () => window.removeEventListener('pointermove', handlePointer)
  }, [mouseX])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const smooth = useSpring(scrollYProgress, { stiffness: 150, damping: 35 })

  const blobsY = useTransform(smooth, [0, 1], [0, 200])
  const gridY = useTransform(smooth, [0, 1], [0, 60])
  const microY = useTransform(smooth, [0, 1], [0, 35])
  const contentY = useTransform(smooth, [0, 1], [0, -40])
  const contentOpacity = useTransform(smooth, [0, 0.8], [1, 0])
  const microOpacity = useTransform(smooth, [0, 0.6, 1], [0, 0.6, 0])
  const heroRotateX = useTransform(smooth, [0, 1], [0, -5])

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
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      <motion.div style={{ y: gridY }} className="pointer-events-none absolute inset-0 z-0 opacity-[0.4]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(59,130,246,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(59,130,246,0.06) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </motion.div>

      <ParticleCanvas isMobile={isMobile} />

      <motion.div style={{ y: blobsY }} className="absolute inset-0 z-0">
        <div className={`absolute top-16 left-10 ${isMobile ? 'w-48 h-48' : 'w-72 h-72'} bg-accent-blue/20 rounded-full ${isMobile ? 'blur-xl' : 'blur-2xl'}`} />
        <div className={`absolute bottom-24 right-10 ${isMobile ? 'w-48 h-48' : 'w-72 h-72'} bg-accent-cyan/20 rounded-full ${isMobile ? 'blur-xl' : 'blur-2xl'}`} />
        {!isMobile && (
          <>
            <div className="absolute top-1/3 right-1/4 w-56 h-56 bg-accent-purple/15 rounded-full blur-2xl" />
            <div className="absolute bottom-1/3 left-1/4 w-44 h-44 bg-accent-indigo/15 rounded-full blur-2xl" />
          </>
        )}
      </motion.div>

      <motion.div style={{ y: microY, opacity: microOpacity }} className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(isMobile ? 6 : 12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${2 + (i % 3)}px`,
              height: `${2 + (i % 3)}px`,
              background: i % 3 === 0 ? 'rgba(59,130,246,0.3)' : i % 3 === 1 ? 'rgba(139,92,246,0.25)' : 'rgba(6,182,212,0.25)',
              top: `${10 + (i * 7.3) % 80}%`,
              left: `${5 + (i * 8.1) % 90}%`,
              animation: `particleFloat ${3 + (i % 4) * 0.8}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ y: contentY, opacity: contentOpacity, perspective: 1000 }}
        className="relative z-10 text-center px-4 max-w-4xl"
      >
        <motion.div variants={itemVariants} className="mb-6 flex justify-center">
          {badgeVisible && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, filter: 'blur(8px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="badge-shimmer inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-green-500/25 bg-green-500/[0.06] backdrop-blur-sm"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-60" style={{ animation: 'pulseRing 2s ease-out infinite' }} />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
              </span>
              <span className="text-sm font-semibold text-green-600 tracking-wide" style={{ fontFamily: 'Sora, sans-serif' }}>
                Open to Opportunities
              </span>
            </motion.div>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="mb-6">
          <span className="eyebrow text-accent-blue">Welcome to my portfolio</span>
        </motion.div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-light-900 h-[1.2em]">
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

        <motion.p
          variants={itemVariants}
          className="text-xl md:text-2xl text-light-700 mb-8 font-light"
        >
          <TextScramble texts={ROLE_TEXTS} className="text-accent-blue font-semibold" />
        </motion.p>

        <motion.p
          variants={itemVariants}
          className="text-light-600 text-lg mb-12 max-w-2xl mx-auto"
        >
          Building intelligent systems that transform data into meaningful experiences.
          Passionate about creating seamless user experiences and scalable solutions.
        </motion.p>

        <motion.div
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
        </motion.div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ x: arrowX }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10"
      >
        <FiArrowDown className="text-accent-blue text-2xl" />
      </motion.div>
    </section>
  )
}

export default Hero

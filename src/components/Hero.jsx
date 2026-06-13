import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion'
import { useRef, useState, useEffect, useCallback } from 'react'
import { FiArrowDown } from 'react-icons/fi'

const FULL_NAME = 'Prince R'
const TYPING_SPEED = 80
const START_DELAY = 600

const Hero = () => {
  const sectionRef = useRef(null)
  const [displayed, setDisplayed] = useState('')
  const [typingDone, setTypingDone] = useState(false)
  const [badgeVisible, setBadgeVisible] = useState(false)
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
    const handleMouse = (e) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 20
      mouseX.set(nx)
    }
    window.addEventListener('mousemove', handleMouse, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouse)
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

      <motion.div style={{ y: blobsY }} className="absolute inset-0 z-0">
        <div className="absolute top-16 left-10 w-72 h-72 bg-accent-blue/20 rounded-full blur-2xl" />
        <div className="absolute bottom-24 right-10 w-72 h-72 bg-accent-cyan/20 rounded-full blur-2xl" />
        <div className="absolute top-1/3 right-1/4 w-56 h-56 bg-accent-purple/15 rounded-full blur-2xl" />
        <div className="absolute bottom-1/3 left-1/4 w-44 h-44 bg-accent-indigo/15 rounded-full blur-2xl" />
      </motion.div>

      {/* Micro depth layer - ultra-slow floating particles */}
      <motion.div style={{ y: microY, opacity: microOpacity }} className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
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
        style={{ y: contentY, opacity: contentOpacity }}
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
            {displayed}
          </span>
          <span
            className={`inline-block w-[3px] h-[0.85em] ml-1 align-middle bg-accent-blue transition-opacity duration-300 ${
              typingDone ? 'opacity-0' : 'opacity-100 animate-pulse'
            }`}
          />
        </h1>

        <motion.p
          variants={itemVariants}
          className="text-xl md:text-2xl text-light-700 mb-8 font-light"
        >
          AI & Data Science Engineer
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
          <motion.a
            href="#projects"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-gradient-to-r from-accent-blue to-accent-cyan text-white rounded-full font-semibold shadow-lg shadow-accent-blue/20 hover:shadow-xl hover:shadow-accent-blue/40 transition-all"
          >
            View My Work
          </motion.a>
          <motion.a
            href="https://drive.google.com/file/d/15iuECh0MvqrQLKrAnKAN0q7IWkSN_PnL/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 btn-glass rounded-full font-semibold text-accent-blue transition-all"
          >
            Download Resume
          </motion.a>
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

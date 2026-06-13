import { useEffect, useRef } from 'react'
import {
  motion,
  useReducedMotion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'

// Fixed, full-viewport animated aurora background.
// Blobs drift continuously, follow the cursor, AND shift as the page scrolls
// (scroll-driven parallax) for a moncy.dev feel.
const AnimatedBackground = () => {
  const reduceMotion = useReducedMotion()

  // Normalized pointer position (-1..1), spring-smoothed for a soft trailing effect.
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const mx = useSpring(pointerX, { stiffness: 40, damping: 20 })
  const my = useSpring(pointerY, { stiffness: 40, damping: 20 })
  const frame = useRef(0)

  // Page scroll progress (0..1) -> spring-smoothed scroll value.
  const { scrollYProgress } = useScroll()
  const scroll = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 24,
    restDelta: 0.001,
  })

  // Each blob combines a mouse offset with a scroll offset at a different
  // depth/direction, so the background visibly updates as you scroll.
  const mouseScale = reduceMotion ? 0 : 1
  const scrollScale = reduceMotion ? 0 : 1

  const blob1X = useTransform([mx, scroll], ([m, s]) => m * 60 * mouseScale + s * -80 * scrollScale)
  const blob1Y = useTransform([my, scroll], ([m, s]) => m * 60 * mouseScale + s * 260 * scrollScale)

  const blob2X = useTransform([my, scroll], ([m, s]) => m * -45 * mouseScale + s * 120 * scrollScale)
  const blob2Y = useTransform([mx, scroll], ([m, s]) => m * -45 * mouseScale + s * -200 * scrollScale)

  const blob3X = useTransform([mx, scroll], ([m, s]) => m * 30 * mouseScale + s * 60 * scrollScale)
  const blob3Y = useTransform([my, scroll], ([m, s]) => m * 30 * mouseScale + s * -300 * scrollScale)

  // Subtle grid drifts upward as the page scrolls.
  const gridY = useTransform(scroll, [0, 1], reduceMotion ? [0, 0] : [0, -120])

  useEffect(() => {
    if (reduceMotion) return

    const handlePointer = (e) => {
      cancelAnimationFrame(frame.current)
      frame.current = requestAnimationFrame(() => {
        const nx = (e.clientX / window.innerWidth) * 2 - 1
        const ny = (e.clientY / window.innerHeight) * 2 - 1
        pointerX.set(nx)
        pointerY.set(ny)
      })
    }

    window.addEventListener('pointermove', handlePointer)
    return () => {
      window.removeEventListener('pointermove', handlePointer)
      cancelAnimationFrame(frame.current)
    }
  }, [reduceMotion, pointerX, pointerY])

  const drift = reduceMotion
    ? {}
    : {
        animate: { scale: [1, 1.15, 1], opacity: [0.5, 0.7, 0.5] },
        transition: { duration: 14, repeat: Infinity, ease: 'easeInOut' },
      }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Subtle grid that drifts on scroll */}
      <motion.div
        style={{ y: gridY }}
        className="absolute inset-0 opacity-[0.35]"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(59,130,246,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(59,130,246,0.05) 1px, transparent 1px)',
            backgroundSize: '52px 52px',
            maskImage:
              'radial-gradient(circle at 50% 30%, black, transparent 75%)',
            WebkitMaskImage:
              'radial-gradient(circle at 50% 30%, black, transparent 75%)',
          }}
        />
      </motion.div>

      {/* Mouse- and scroll-reactive aurora blobs */}
      <motion.div
        style={{ x: blob1X, y: blob1Y }}
        className="absolute -top-32 -left-24 h-[28rem] w-[28rem]"
      >
        <motion.div
          {...drift}
          className="h-full w-full rounded-full bg-accent-blue/25 blur-3xl"
        />
      </motion.div>

      <motion.div
        style={{ x: blob2X, y: blob2Y }}
        className="absolute top-1/3 -right-24 h-[24rem] w-[24rem]"
      >
        <motion.div
          {...drift}
          transition={{ ...(drift.transition || {}), duration: 18 }}
          className="h-full w-full rounded-full bg-accent-cyan/25 blur-3xl"
        />
      </motion.div>

      <motion.div
        style={{ x: blob3X, y: blob3Y }}
        className="absolute bottom-0 left-1/3 h-[22rem] w-[22rem]"
      >
        <motion.div
          {...drift}
          transition={{ ...(drift.transition || {}), duration: 22 }}
          className="h-full w-full rounded-full bg-accent-purple/20 blur-3xl"
        />
      </motion.div>
    </div>
  )
}

export default AnimatedBackground

import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useReducedMotion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'

const AnimatedBackground = () => {
  const reduceMotion = useReducedMotion()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const mx = useSpring(pointerX, { stiffness: 50, damping: 25 })
  const my = useSpring(pointerY, { stiffness: 50, damping: 25 })
  const frame = useRef(0)

  const { scrollYProgress } = useScroll()
  const scroll = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 35,
    restDelta: 0.001,
  })

  const mouseScale = reduceMotion ? 0 : 1
  const scrollScale = reduceMotion ? 0 : 1

  const blob1X = useTransform(mx, (m) => m * 60 * mouseScale)
  const blob1Y = useTransform([my, scroll], ([m, s]) => m * 50 * mouseScale + s * 200 * scrollScale)

  const blob2X = useTransform(my, (m) => m * -40 * mouseScale)
  const blob2Y = useTransform([mx, scroll], ([m, s]) => m * -35 * mouseScale + s * -160 * scrollScale)

  const blob3X = useTransform(mx, (m) => m * 25 * mouseScale)
  const blob3Y = useTransform(scroll, (s) => s * -220 * scrollScale)

  const gridY = useTransform(scroll, [0, 1], reduceMotion ? [0, 0] : [0, -100])

  useEffect(() => {
    if (reduceMotion || isMobile) return

    const handlePointer = (e) => {
      cancelAnimationFrame(frame.current)
      frame.current = requestAnimationFrame(() => {
        const nx = (e.clientX / window.innerWidth) * 2 - 1
        const ny = (e.clientY / window.innerHeight) * 2 - 1
        pointerX.set(nx)
        pointerY.set(ny)
      })
    }

    window.addEventListener('pointermove', handlePointer, { passive: true })
    return () => {
      window.removeEventListener('pointermove', handlePointer)
      cancelAnimationFrame(frame.current)
    }
  }, [reduceMotion, isMobile, pointerX, pointerY])

  const drift = (reduceMotion || isMobile)
    ? {}
    : {
        animate: { scale: [1, 1.12, 1], opacity: [0.5, 0.65, 0.5] },
        transition: { duration: 16, repeat: Infinity, ease: 'easeInOut' },
      }

  if (isMobile && reduceMotion) return null

  const blobSize1 = isMobile ? 'h-[18rem] w-[18rem]' : 'h-[28rem] w-[28rem]'
  const blobSize2 = isMobile ? 'h-[15rem] w-[15rem]' : 'h-[24rem] w-[24rem]'
  const blobSize3 = isMobile ? 'h-[13rem] w-[13rem]' : 'h-[22rem] w-[22rem]'

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ contain: 'layout style paint' }}
    >
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

      <motion.div
        style={{ x: blob1X, y: blob1Y, willChange: 'transform' }}
        className={`absolute -top-32 -left-24 ${blobSize1}`}
      >
        <motion.div
          {...drift}
          className="h-full w-full rounded-full bg-accent-blue/25 blur-xl"
        />
      </motion.div>

      <motion.div
        style={{ x: blob2X, y: blob2Y, willChange: 'transform' }}
        className={`absolute top-1/3 -right-24 ${blobSize2}`}
      >
        <motion.div
          {...drift}
          transition={{ ...(drift.transition || {}), duration: 20 }}
          className="h-full w-full rounded-full bg-accent-cyan/25 blur-xl"
        />
      </motion.div>

      {!isMobile && (
        <motion.div
          style={{ x: blob3X, y: blob3Y, willChange: 'transform' }}
          className={`absolute bottom-0 left-1/3 ${blobSize3}`}
        >
          <motion.div
            {...drift}
            transition={{ ...(drift.transition || {}), duration: 24 }}
            className="h-full w-full rounded-full bg-accent-purple/20 blur-xl"
          />
        </motion.div>
      )}
    </div>
  )
}

export default AnimatedBackground

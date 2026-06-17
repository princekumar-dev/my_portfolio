import { useEffect, useState } from 'react'
import {
  m,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion'
import { usePointer } from '../context/PointerContext'
import { useSharedScroll } from '../context/ScrollContext'

const AnimatedBackground = () => {
  const reduceMotion = useReducedMotion()
  const [isMobile, setIsMobile] = useState(false)
  const { nx, ny } = usePointer()
  const { scrollYProgress } = useSharedScroll()

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const mx = useSpring(nx, { stiffness: 50, damping: 25 })
  const my = useSpring(ny, { stiffness: 50, damping: 25 })

  const scroll = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 35,
    restDelta: 0.001,
  })

  const mouseScale = reduceMotion ? 0 : 1
  const scrollScale = reduceMotion ? 0 : 1

  const blob1X = useTransform(mx, (m) => m * 50 * mouseScale)
  const blob1Y = useTransform([my, scroll], ([m, s]) => m * 40 * mouseScale + s * 150 * scrollScale)

  const blob2X = useTransform(my, (m) => m * -35 * mouseScale)
  const blob2Y = useTransform([mx, scroll], ([m, s]) => m * -30 * mouseScale + s * -120 * scrollScale)

  const gridY = useTransform(scroll, [0, 1], reduceMotion ? [0, 0] : [0, -80])

  if (isMobile) return null

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ contain: 'layout style paint' }}
    >
      <m.div
        style={{ y: gridY }}
        className="absolute inset-0 opacity-[0.35]"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(61,90,115,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(61,90,115,0.05) 1px, transparent 1px)',
            backgroundSize: '52px 52px',
            maskImage:
              'radial-gradient(circle at 50% 30%, black, transparent 75%)',
            WebkitMaskImage:
              'radial-gradient(circle at 50% 30%, black, transparent 75%)',
          }}
        />
      </m.div>

      <m.div
        style={{ x: blob1X, y: blob1Y, willChange: 'transform' }}
        className="absolute -top-32 -left-24 h-[22rem] w-[22rem]"
      >
        <div className="h-full w-full rounded-full bg-accent-slate/20" />
      </m.div>

      <m.div
        style={{ x: blob2X, y: blob2Y, willChange: 'transform' }}
        className="absolute top-1/3 -right-24 h-[18rem] w-[18rem]"
      >
        <div className="h-full w-full rounded-full bg-accent-sage/20" />
      </m.div>
    </div>
  )
}

export default AnimatedBackground

import { useEffect, useState } from 'react'
import {
  motion,
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

  const blob1X = useTransform(mx, (m) => m * 60 * mouseScale)
  const blob1Y = useTransform([my, scroll], ([m, s]) => m * 50 * mouseScale + s * 200 * scrollScale)

  const blob2X = useTransform(my, (m) => m * -40 * mouseScale)
  const blob2Y = useTransform([mx, scroll], ([m, s]) => m * -35 * mouseScale + s * -160 * scrollScale)

  const blob3X = useTransform(mx, (m) => m * 25 * mouseScale)
  const blob3Y = useTransform(scroll, (s) => s * -220 * scrollScale)

  const gridY = useTransform(scroll, [0, 1], reduceMotion ? [0, 0] : [0, -100])

  if (isMobile) return null

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
        <div className="h-full w-full rounded-full bg-accent-blue/20" />
      </motion.div>

      <motion.div
        style={{ x: blob2X, y: blob2Y, willChange: 'transform' }}
        className={`absolute top-1/3 -right-24 ${blobSize2}`}
      >
        <div className="h-full w-full rounded-full bg-accent-cyan/20" />
      </motion.div>

      {!isMobile && (
        <motion.div
          style={{ x: blob3X, y: blob3Y, willChange: 'transform' }}
          className={`absolute bottom-0 left-1/3 ${blobSize3}`}
        >
          <div className="h-full w-full rounded-full bg-accent-purple/15" />
        </motion.div>
      )}
    </div>
  )
}

export default AnimatedBackground

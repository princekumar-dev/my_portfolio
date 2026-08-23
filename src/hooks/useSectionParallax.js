import { useRef } from 'react'
import { useScroll, useSpring, useTransform, useReducedMotion, useInView, useMotionValue } from 'framer-motion'

const PRESETS = {
  snappy:  { stiffness: 200, damping: 35, restDelta: 0.001 },
  default: { stiffness: 120, damping: 35, restDelta: 0.001 },
  soft:    { stiffness: 80,  damping: 30, restDelta: 0.001 },
}

const isTouchDevice = () =>
  typeof window !== 'undefined' &&
  ('ontouchstart' in window || navigator.maxTouchPoints > 0)

export function useSectionParallax({
  slowDistance = 60,
  fastDistance = 120,
  preset = 'default',
  opacityFade = false,
} = {}) {
  const ref = useRef(null)
  const reduceMotion = useReducedMotion()
  const isNear = useInView(ref, { margin: '-100px 0px' })
  const touchDevice = isTouchDevice()

  const zeroVal = useMotionValue(0)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const springConfig = PRESETS[preset] || PRESETS.default
  const smooth = useSpring(scrollYProgress, springConfig)

  const away = touchDevice || reduceMotion || !isNear

  const slow = useTransform(
    smooth,
    [0, 1],
    away ? [0, 0] : [slowDistance, -slowDistance]
  )
  const fast = useTransform(
    smooth,
    [0, 1],
    away ? [0, 0] : [fastDistance, -fastDistance]
  )

  const opacityTransform = useTransform(smooth, [0, 0.2, 0.8, 1], away ? [1, 1, 1, 1] : [0, 1, 1, 0])
  const opacity = opacityFade ? opacityTransform : null

  if (touchDevice) {
    return { ref, smooth: zeroVal, slow: zeroVal, fast: zeroVal, opacity: null }
  }

  return { ref, smooth, slow, fast, opacity }
}

import { useRef } from 'react'
import { useScroll, useSpring, useTransform, useReducedMotion } from 'framer-motion'

const PRESETS = {
  snappy:  { stiffness: 200, damping: 35, restDelta: 0.001 },
  default: { stiffness: 120, damping: 35, restDelta: 0.001 },
  soft:    { stiffness: 80,  damping: 30, restDelta: 0.001 },
}

export function useSectionParallax({
  slowDistance = 60,
  fastDistance = 120,
  preset = 'default',
  opacityFade = false,
} = {}) {
  const ref = useRef(null)
  const reduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const springConfig = PRESETS[preset] || PRESETS.default
  const smooth = useSpring(scrollYProgress, springConfig)

  const slow = useTransform(
    smooth,
    [0, 1],
    reduceMotion ? [0, 0] : [slowDistance, -slowDistance]
  )
  const fast = useTransform(
    smooth,
    [0, 1],
    reduceMotion ? [0, 0] : [fastDistance, -fastDistance]
  )

  const opacity = opacityFade
    ? useTransform(smooth, [0, 0.2, 0.8, 1], reduceMotion ? [1, 1, 1, 1] : [0, 1, 1, 0])
    : null

  return { ref, smooth, slow, fast, opacity }
}

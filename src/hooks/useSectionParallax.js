import { useRef } from 'react'
import { useScroll, useSpring, useTransform, useReducedMotion } from 'framer-motion'

// Reusable scoped scroll parallax for a section.
// Attach `ref` to the section root. `slow` and `fast` are spring-smoothed
// motion values that move as the section scrolls through the viewport.
// When the user prefers reduced motion, both values stay at 0 (no parallax).
export function useSectionParallax({ slowDistance = 60, fastDistance = 120 } = {}) {
  const ref = useRef(null)
  const reduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const smooth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 35,
    restDelta: 0.001,
  })

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

  return { ref, smooth, slow, fast }
}

import { useRef } from 'react'
import { useScroll, useTransform, useReducedMotion, useInView, useMotionValue } from 'framer-motion'

const isTouchDevice = () =>
  typeof window !== 'undefined' &&
  ('ontouchstart' in window || navigator.maxTouchPoints > 0)

export function useSectionParallax({
  slowDistance = 60,
  fastDistance = 120,
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

  // Deliberately NOT wrapped in a spring. Lenis already smooths the wheel
  // input, so a spring here made the parallax trail the scroll position on
  // top of that — the visible lag — and, because springs keep ticking after
  // motion stops, six of them kept writing styles for ~1s after you did.
  const smooth = scrollYProgress

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

  // Touch devices keep parallax translations off (they jank mobile scroll),
  // but `smooth` must stay live — it's the scroll-progress signal that drives
  // the Experience timeline beam and its per-card dots.
  if (touchDevice) {
    return { ref, smooth, slow: zeroVal, fast: zeroVal, opacity: null }
  }

  return { ref, smooth, slow, fast, opacity }
}

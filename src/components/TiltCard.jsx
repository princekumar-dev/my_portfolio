import { useRef, useCallback, useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion, useInView } from 'framer-motion'

const isTouchDevice = () =>
  typeof window !== 'undefined' &&
  ('ontouchstart' in window || navigator.maxTouchPoints > 0)

const TiltCard = ({
  children,
  className = '',
  maxTilt = 12,
  glare = true,
  borderGlow = true,
  float = true,
  ...rest
}) => {
  const reduceMotion = useReducedMotion()
  const [touchDevice] = useState(isTouchDevice)
  const cardRef = useRef(null)
  const rafRef = useRef(0)
  const hoverRef = useRef(false)
  const isInView = useInView(cardRef, { margin: '-50px' })

  const px = useMotionValue(0)
  const py = useMotionValue(0)

  const springCfg = touchDevice
    ? { stiffness: 300, damping: 30, mass: 0.6 }
    : { stiffness: 500, damping: 25, mass: 0.4 }

  const rotateX = useSpring(useTransform(py, v => -v * maxTilt * 2), springCfg)
  const rotateY = useSpring(useTransform(px, v => v * maxTilt * 2), springCfg)

  const glareX = useTransform(px, v => `${(v + 0.5) * 100}%`)
  const glareY = useTransform(py, v => `${(v + 0.5) * 100}%`)
  const glareOpacity = useTransform(px, [-0.5, 0, 0.5], [0.3, 0, 0.3])

  const glowX = useTransform(px, v => `${(v + 0.5) * 60 + 20}%`)
  const glowY = useTransform(py, v => `${(v + 0.5) * 60 + 20}%`)
  const glowOpacity = useTransform([px, py], ([x, y]) => {
    const d2 = x * x + y * y
    return Math.min((d2 < 0.0001 ? 0 : Math.sqrt(d2)) * 2.5, 0.55)
  })

  const shadowX = useTransform(px, v => v * 20)
  const shadowY = useTransform(py, v => v * 20)
  const shadowBlur = useTransform([px, py], ([x, y]) => {
    const d2 = x * x + y * y
    return 15 + (d2 < 0.0001 ? 0 : Math.sqrt(d2)) * 50
  })

  const glareBg = useTransform([glareX, glareY], ([gx, gy]) =>
    `radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.45), transparent 55%)`
  )
  const glowBg = useTransform([glowX, glowY], ([gx, gy]) =>
    `radial-gradient(circle at ${gx} ${gy}, rgba(99,102,241,0.4), rgba(168,85,247,0.15), transparent 60%)`
  )
  const shadowVal = useTransform([shadowX, shadowY, shadowBlur], ([sx, sy, sb]) =>
    `${sx}px ${sy}px ${sb}px rgba(0,0,0,0.2), ${sx * 0.4}px ${sy * 0.4}px ${sb * 0.4}px rgba(99,102,241,0.08)`
  )

  const setPointer = useCallback((ex, ey) => {
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      const rect = cardRef.current?.getBoundingClientRect()
      if (!rect) return
      px.set((ex - rect.left) / rect.width - 0.5)
      py.set((ey - rect.top) / rect.height - 0.5)
    })
  }, [px, py])

  const handleMove = useCallback((e) => {
    if (!hoverRef.current || touchDevice) return
    setPointer(e.clientX, e.clientY)
  }, [setPointer, touchDevice])

  useEffect(() => {
    if (reduceMotion || !isInView) return
    const el = cardRef.current
    if (!el) return

    const unsubX = px.onChange((v) => {
      el.style.setProperty('--mx', `${(v + 0.5) * 100}%`)
      el.style.setProperty('--card-mx', `${(v + 0.5) * 100}%`)
    })
    const unsubY = py.onChange((v) => {
      el.style.setProperty('--my', `${(v + 0.5) * 100}%`)
      el.style.setProperty('--card-my', `${(v + 0.5) * 100}%`)
    })
    return () => { unsubX(); unsubY() }
  }, [reduceMotion, isInView, px, py])

  if (reduceMotion) {
    return (
      <div className={className} {...rest}>
        {children}
      </div>
    )
  }

  const tiltContent = (
    <motion.div
      ref={cardRef}
      onPointerEnter={() => { hoverRef.current = true }}
      onPointerMove={handleMove}
      onPointerLeave={() => {
        hoverRef.current = false
        px.set(0)
        py.set(0)
      }}
      style={touchDevice ? {} : {
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        transformPerspective: 800,
      }}
      whileHover={touchDevice ? undefined : { scale: 1.025 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      className={`relative ${className}`}
      {...rest}
    >
      {children}

      <div className="card-spotlight" aria-hidden="true" />

      {glare && !touchDevice && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{
            contain: 'layout style paint',
            willChange: 'opacity',
            background: glareBg,
            opacity: glareOpacity,
          }}
        />
      )}

      {borderGlow && !touchDevice && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{
            contain: 'layout style paint',
            willChange: 'opacity',
            background: glowBg,
            opacity: glowOpacity,
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            WebkitMaskComposite: 'xor',
            padding: '1.5px',
          }}
        />
      )}

      {!touchDevice && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{
            contain: 'layout style paint',
            boxShadow: shadowVal,
          }}
        />
      )}
    </motion.div>
  )

  if (!float) return tiltContent

  return (
    <div className={touchDevice ? '' : 'tilt-float'}>
      {tiltContent}
    </div>
  )
}

export default TiltCard

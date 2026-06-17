import { useRef, useCallback, useEffect, useState, useContext } from 'react'
import { m, useMotionValue, useSpring, useTransform, useReducedMotion, useInView, useMotionValueEvent } from 'framer-motion'
import { useTiltContext } from '../context/TiltContext'

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
  const { setTilt, clearTilt } = useTiltContext()

  const px = useMotionValue(0)
  const py = useMotionValue(0)

  const springCfg = touchDevice
    ? { stiffness: 300, damping: 30, mass: 0.6 }
    : { stiffness: 500, damping: 25, mass: 0.4 }

  const rotateX = useSpring(useTransform(py, v => -v * maxTilt * 2), springCfg)
  const rotateY = useSpring(useTransform(px, v => v * maxTilt * 2), springCfg)

  useMotionValueEvent(rotateX, "change", (v) => {
    if (reduceMotion || touchDevice) return
    const rect = cardRef.current?.getBoundingClientRect()
    setTilt({ x: v, y: rotateY.get(), rect, active: hoverRef.current })
  })

  useMotionValueEvent(rotateY, "change", (v) => {
    if (reduceMotion || touchDevice) return
    const rect = cardRef.current?.getBoundingClientRect()
    setTilt({ x: rotateX.get(), y: v, rect, active: hoverRef.current })
  })

  const glareOpacity = useTransform(px, [-0.5, 0, 0.5], [0.3, 0, 0.3])
  const glowOpacity = useTransform([px, py], ([x, y]) => {
    const d2 = x * x + y * y
    return Math.min((d2 < 0.0001 ? 0 : Math.sqrt(d2)) * 2.5, 0.55)
  })

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

    let unsubX, unsubY

    const subscribe = () => {
      unsubX = px.on("change", (v) => {
        el.style.setProperty('--mx', `${(v + 0.5) * 100}%`)
        el.style.setProperty('--card-mx', `${(v + 0.5) * 100}%`)
        el.style.setProperty('--mx-raw', v)
      })
      unsubY = py.on("change", (v) => {
        el.style.setProperty('--my', `${(v + 0.5) * 100}%`)
        el.style.setProperty('--card-my', `${(v + 0.5) * 100}%`)
        el.style.setProperty('--my-raw', v)
      })
    }

    const unsubscribe = () => {
      if (unsubX) { unsubX(); unsubX = null }
      if (unsubY) { unsubY(); unsubY = null }
    }

    const onEnter = () => subscribe()
    const onLeave = () => unsubscribe()

    const card = cardRef.current
    card.addEventListener('pointerenter', onEnter)
    card.addEventListener('pointerleave', onLeave)

    return () => {
      unsubscribe()
      card.removeEventListener('pointerenter', onEnter)
      card.removeEventListener('pointerleave', onLeave)
    }
  }, [reduceMotion, isInView, px, py])

  if (reduceMotion) {
    return (
      <div className={className} data-cursor-target="tilt-card" {...rest}>
        {children}
      </div>
    )
  }

  const tiltContent = (
    <m.div
      ref={cardRef}
      data-cursor-target="tilt-card"
      onPointerEnter={() => {
        hoverRef.current = true
        const rect = cardRef.current?.getBoundingClientRect()
        if (rect) setTilt({ x: rotateX.get(), y: rotateY.get(), rect, active: true })
      }}
      onPointerMove={handleMove}
      onPointerLeave={() => {
        hoverRef.current = false
        px.jump(0)
        py.jump(0)
        clearTilt()
      }}
      style={touchDevice ? {} : {
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        transformPerspective: 800,
        willChange: isInView ? 'transform' : 'auto',
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
        <m.div
          aria-hidden="true"
          className="card-glare pointer-events-none"
          style={{ opacity: glareOpacity }}
        />
      )}

      {borderGlow && !touchDevice && (
        <m.div
          aria-hidden="true"
          className="card-glow pointer-events-none"
          style={{ opacity: glowOpacity }}
        />
      )}

      {!touchDevice && (
        <div className="card-shadow pointer-events-none" />
      )}
    </m.div>
  )

  if (!float) return tiltContent

  return (
    <div className={touchDevice ? '' : 'tilt-float'}>
      {tiltContent}
    </div>
  )
}

export default TiltCard

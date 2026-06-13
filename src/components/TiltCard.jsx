import { useRef, useCallback, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion, useInView } from 'framer-motion'

const TiltCard = ({
  children,
  className = '',
  maxTilt = 8,
  glare = true,
  ...rest
}) => {
  const reduceMotion = useReducedMotion()
  const cardRef = useRef(null)
  const frameRef = useRef(0)
  const isInView = useInView(cardRef, { margin: '-50px' })

  const px = useMotionValue(0)
  const py = useMotionValue(0)

  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [maxTilt, -maxTilt]), {
    stiffness: 400,
    damping: 15,
    mass: 0.4,
  })
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-maxTilt, maxTilt]), {
    stiffness: 400,
    damping: 15,
    mass: 0.4,
  })

  const glareX = useTransform(px, [-0.5, 0.5], ['0%', '100%'])
  const glareY = useTransform(py, [-0.5, 0.5], ['0%', '100%'])
  const glareOpacity = useTransform(px, [-0.5, 0, 0.5], [0.15, 0, 0.15])

  useEffect(() => {
    if (!cardRef.current || reduceMotion || !isInView) return

    let scrollFrame
    const handleScroll = () => {
      cancelAnimationFrame(scrollFrame)
      scrollFrame = requestAnimationFrame(() => {
        const rect = cardRef.current?.getBoundingClientRect()
        if (!rect) return
        if (rect.bottom < -100 || rect.top > window.innerHeight + 100) return
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const viewCenterX = window.innerWidth / 2
        const viewCenterY = window.innerHeight / 2
        const dx = (centerX - viewCenterX) / viewCenterX
        const dy = (centerY - viewCenterY) / viewCenterY
        px.set(dx * 0.25)
        py.set(dy * 0.2)
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => {
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(scrollFrame)
    }
  }, [reduceMotion, isInView, px, py])

  const handleMove = useCallback((e) => {
    if (reduceMotion) return
    cancelAnimationFrame(frameRef.current)
    frameRef.current = requestAnimationFrame(() => {
      const rect = cardRef.current?.getBoundingClientRect()
      if (!rect) return
      px.set((e.clientX - rect.left) / rect.width - 0.5)
      py.set((e.clientY - rect.top) / rect.height - 0.5)
    })
  }, [reduceMotion, px, py])

  const handleLeave = useCallback(() => {
    px.set(0)
    py.set(0)
  }, [px, py])

  if (reduceMotion) {
    return (
      <div className={className} {...rest}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      ref={cardRef}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        transformPerspective: 1200,
        willChange: 'transform',
      }}
      whileHover={{ y: -6, scale: 1.01, rotateX: 2, rotateY: -2 }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      className={`relative ${className}`}
      {...rest}
    >
      {children}
      {glare && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{
            background: useTransform(
              [glareX, glareY],
              ([gx, gy]) =>
                `radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.35), transparent 55%)`
            ),
            opacity: glareOpacity,
            transition: 'opacity 0.3s ease',
          }}
        />
      )}
    </motion.div>
  )
}

export default TiltCard

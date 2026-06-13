import { useRef, useCallback } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion'

const TiltCard = ({
  children,
  className = '',
  maxTilt = 10,
  glare = true,
  ...rest
}) => {
  const reduceMotion = useReducedMotion()
  const cardRef = useRef(null)
  const frameRef = useRef(0)

  const px = useMotionValue(0)
  const py = useMotionValue(0)

  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [maxTilt, -maxTilt]), {
    stiffness: 200,
    damping: 25,
  })
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-maxTilt, maxTilt]), {
    stiffness: 200,
    damping: 25,
  })

  const glareX = useTransform(px, [-0.5, 0.5], ['0%', '100%'])
  const glareY = useTransform(py, [-0.5, 0.5], ['0%', '100%'])

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
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', transformPerspective: 900, willChange: 'transform' }}
      whileHover={{ y: -10 }}
      className={`relative ${className}`}
      {...rest}
    >
      {children}
      {glare && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: useTransform(
              [glareX, glareY],
              ([gx, gy]) =>
                `radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.45), transparent 60%)`
            ),
          }}
        />
      )}
    </motion.div>
  )
}

export default TiltCard

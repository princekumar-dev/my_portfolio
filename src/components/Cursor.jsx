import { useEffect, useState, useRef, useMemo } from 'react'
import { motion, useMotionValue, useSpring, useTransform, animate } from 'framer-motion'

const SECTION_COLORS = {
  home:     { r: 59,  g: 130, b: 246 },  // blue
  about:    { r: 6,   g: 182, b: 212 },  // cyan
  skills:   { r: 139, g: 92,  b: 246 },  // purple
  projects: { r: 99,  g: 102, b: 241 },  // indigo
  experience: { r: 59,  g: 130, b: 246 },
  certifications: { r: 6,   g: 182, b: 212 },
  contact:  { r: 139, g: 92,  b: 246 },
}

const BURST_COUNT = 8
const SNAP_STRENGTH = 0.15

const Cursor = () => {
  const [visible, setVisible] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [sectionColor, setSectionColor] = useState(SECTION_COLORS.home)
  const [burstParticles, setBurstParticles] = useState([])

  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const prevX = useRef(-100)
  const prevY = useRef(-100)
  const velocity = useMotionValue(0)
  const angle = useMotionValue(0)

  const x = useSpring(cursorX, { stiffness: 600, damping: 30, mass: 0.3 })
  const y = useSpring(cursorY, { stiffness: 600, damping: 30, mass: 0.3 })

  const trail1X = useSpring(cursorX, { stiffness: 250, damping: 24, mass: 0.5 })
  const trail1Y = useSpring(cursorY, { stiffness: 250, damping: 24, mass: 0.5 })
  const trail2X = useSpring(cursorX, { stiffness: 120, damping: 20, mass: 0.8 })
  const trail2Y = useSpring(cursorY, { stiffness: 120, damping: 20, mass: 0.8 })
  const trail3X = useSpring(cursorX, { stiffness: 60, damping: 18, mass: 1.1 })
  const trail3Y = useSpring(cursorY, { stiffness: 60, damping: 18, mass: 1.1 })

  const scale = useSpring(1, { stiffness: 400, damping: 22 })
  const glowIntensity = useSpring(0, { stiffness: 200, damping: 15 })
  const antiGravity = useSpring(0, { stiffness: 100, damping: 12, mass: 1.5 })

  const glowScale = useTransform(scale, (s) => s * 1.8)
  const mainY = useTransform([y, antiGravity], ([cy, ag]) => cy + ag)

  // Velocity-driven morph values
  const stretchX = useTransform(velocity, (v) => 1 + v * 0.4)
  const stretchY = useTransform(velocity, (v) => 1 - v * 0.15)
  const trailSpread = useTransform(velocity, (v) => 1 + v * 0.6)

  const sc = sectionColor
  const glowRGB = `${sc.r}, ${sc.g}, ${sc.b}`

  const burstKey = useRef(0)

  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (isTouch) return

    let raf
    const move = (e) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const dx = e.clientX - prevX.current
        const dy = e.clientY - prevY.current
        const speed = Math.sqrt(dx * dx + dy * dy)
        velocity.set(Math.min(speed / 20, 1))
        if (speed > 1) {
          angle.set(Math.atan2(dy, dx))
        }
        prevX.current = e.clientX
        prevY.current = e.clientY
      })

      // Magnetic snap
      const el = document.elementFromPoint(e.clientX, e.clientY)
      const target = el?.closest('a, button, [role="button"], .glass-card, .group')
      if (target && hovering) {
        const rect = target.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const pullX = (cx - e.clientX) * SNAP_STRENGTH
        const pullY = (cy - e.clientY) * SNAP_STRENGTH
        cursorX.set(e.clientX + pullX)
        cursorY.set(e.clientY + pullY)
      } else {
        cursorX.set(e.clientX)
        cursorY.set(e.clientY)
      }

      if (!visible) setVisible(true)
    }

    // Click burst particles
    const down = (e) => {
      scale.set(0.6)
      const newParticles = Array.from({ length: BURST_COUNT }, (_, i) => {
        const a = (i / BURST_COUNT) * Math.PI * 2 + (Math.random() - 0.5) * 0.5
        const speed = 40 + Math.random() * 60
        return {
          id: burstKey.current++,
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(a) * speed,
          vy: Math.sin(a) * speed,
          size: 2 + Math.random() * 3,
          color: i % 2 === 0 ? `rgba(${glowRGB}, 0.6)` : 'rgba(255,255,255,0.5)',
        }
      })
      setBurstParticles(newParticles)
      setTimeout(() => setBurstParticles([]), 700)
    }

    const up = () => {
      scale.set(1)
      antiGravity.set(-8)
      setTimeout(() => antiGravity.set(0), 300)
    }

    const over = (e) => {
      const t = e.target.closest('a, button, [role="button"], .glass-card, .group')
      if (t) {
        setHovering(true)
        scale.set(1.25)
        glowIntensity.set(1)
        antiGravity.set(-12)

        // Detect section
        const section = t.closest('section[id]')
        if (section && SECTION_COLORS[section.id]) {
          setSectionColor(SECTION_COLORS[section.id])
        }
      }
    }

    const out = (e) => {
      const t = e.target.closest('a, button, [role="button"], .glass-card, .group')
      if (t) {
        setHovering(false)
        scale.set(1)
        glowIntensity.set(0)
        antiGravity.set(0)
      }
    }

    window.addEventListener('mousemove', move, { passive: true })
    window.addEventListener('mousedown', down, { passive: true })
    window.addEventListener('mouseup', up, { passive: true })
    document.addEventListener('mouseover', over, { passive: true })
    document.addEventListener('mouseout', out, { passive: true })

    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mousedown', down)
      window.removeEventListener('mouseup', up)
      document.removeEventListener('mouseover', over)
      document.removeEventListener('mouseout', out)
      cancelAnimationFrame(raf)
    }
  }, [cursorX, cursorY, visible, scale, glowIntensity, antiGravity, velocity, hovering, glowRGB])

  if (!visible) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]" aria-hidden="true">
      {/* Magnetic field lines */}
      <motion.div
        style={{ x, y, translateX: '-50%', translateY: '-50%', opacity: glowIntensity }}
        className="absolute top-0 left-0 w-24 h-24 -ml-6 -mt-6"
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(from 0deg, transparent, rgba(${glowRGB},0.06), transparent, rgba(${glowRGB},0.06), transparent)`,
            animation: 'magneticSpin 6s linear infinite',
            filter: 'blur(2px)',
          }}
        />
      </motion.div>
      <motion.div
        style={{ x, y, translateX: '-50%', translateY: '-50%', opacity: glowIntensity }}
        className="absolute top-0 left-0"
      >
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${3 - i * 0.4}px`,
              height: `${3 - i * 0.4}px`,
              background: `rgba(${glowRGB}, ${0.3 - i * 0.05})`,
              top: `${-20 - i * 8}px`,
              left: `${50 + Math.sin(i * 1.2) * 15}%`,
              transform: 'translateX(-50%)',
              animation: `particleFloat ${2.5 + i * 0.4}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
              filter: 'blur(0.5px)',
            }}
          />
        ))}
      </motion.div>

      {/* Burst particles on click */}
      {burstParticles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: p.x, y: p.y, scale: 1, opacity: 0.8 }}
          animate={{
            x: p.x + p.vx,
            y: p.y + p.vy,
            scale: 0,
            opacity: 0,
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            background: p.color,
            translateX: '-50%',
            translateY: '-50%',
          }}
        />
      ))}

      {/* Trail 3 */}
      <motion.div
        style={{ x: trail3X, y: trail3Y, translateX: '-50%', translateY: '-50%', scaleX: stretchX, scaleY: stretchY }}
        className="absolute top-0 left-0 w-2.5 h-2.5 rounded-full"
      >
        <div className="w-full h-full rounded-full" style={{ border: `1px solid rgba(${glowRGB},0.2)` }} />
      </motion.div>

      {/* Trail 2 */}
      <motion.div
        style={{ x: trail2X, y: trail2Y, translateX: '-50%', translateY: '-50%', scaleX: stretchX, scaleY: stretchY }}
        className="absolute top-0 left-0 w-4 h-4 rounded-full"
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
          }}
        />
      </motion.div>

      {/* Trail 1 */}
      <motion.div
        style={{ x: trail1X, y: trail1Y, translateX: '-50%', translateY: '-50%', scaleX: stretchX, scaleY: stretchY }}
        className="absolute top-0 left-0 w-7 h-7 rounded-full"
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            background: 'rgba(255, 255, 255, 0.07)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
          }}
        />
      </motion.div>

      {/* Triple ripple rings */}
      <motion.div
        style={{ x, y, translateX: '-50%', translateY: '-50%' }}
        className="absolute top-0 left-0 w-10 h-10 rounded-full"
      >
        <div className="w-full h-full rounded-full border-[1.5px] animate-ping" style={{ borderColor: `rgba(${glowRGB},0.3)`, animationDuration: '1.5s' }} />
      </motion.div>
      <motion.div
        style={{ x, y, translateX: '-50%', translateY: '-50%' }}
        className="absolute top-0 left-0 w-10 h-10 rounded-full"
      >
        <div className="w-full h-full rounded-full border animate-ping" style={{ borderColor: `rgba(255,255,255,0.15)`, animationDuration: '2s', animationDelay: '0.3s' }} />
      </motion.div>

      {/* Outer glow halo */}
      <motion.div
        style={{ x, y, translateX: '-50%', translateY: '-50%', opacity: glowIntensity, scale: glowScale }}
        className="absolute top-0 left-0 w-20 h-20 -ml-5 -mt-5 rounded-full"
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            background: `radial-gradient(circle, rgba(${glowRGB},0.12) 0%, rgba(${glowRGB},0.04) 40%, transparent 70%)`,
            filter: 'blur(6px)',
          }}
        />
      </motion.div>

      {/* Main cursor */}
      <motion.div
        style={{ x, y: mainY, translateX: '-50%', translateY: '-50%', scale }}
        className="absolute top-0 left-0 w-10 h-10 rounded-full"
      >
        {/* Depth shadow */}
        <div
          className="absolute rounded-full"
          style={{
            bottom: '-8px',
            left: '15%',
            width: '70%',
            height: '20%',
            background: 'radial-gradient(ellipse, rgba(31,41,55,0.08) 0%, transparent 70%)',
            filter: 'blur(2px)',
            transform: hovering ? 'scale(0.5) translateY(4px)' : 'scale(1)',
            transition: 'transform 0.3s ease, opacity 0.3s ease',
            opacity: hovering ? 0.3 : 0.6,
          }}
        />

        {/* Outer glass shell */}
        <div
          className="absolute inset-[-3px] rounded-full"
          style={{
            background: hovering
              ? `linear-gradient(135deg, rgba(${glowRGB},0.12) 0%, rgba(${glowRGB},0.06) 50%, rgba(${glowRGB},0.1) 100%)`
              : 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
            border: `1px solid ${hovering ? `rgba(${glowRGB},0.25)` : 'rgba(255,255,255,0.12)'}`,
            transition: 'background 0.4s ease, border-color 0.4s ease',
          }}
        />

        {/* Core glass body */}
        <div
          className="absolute inset-0 rounded-full overflow-hidden"
          style={{
            background: hovering
              ? `linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(${glowRGB},0.06) 40%, rgba(255,255,255,0.15) 100%)`
              : 'linear-gradient(135deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.06) 40%, rgba(255,255,255,0.12) 100%)',
            backdropFilter: 'blur(12px) saturate(200%) brightness(1.1)',
            WebkitBackdropFilter: 'blur(12px) saturate(200%) brightness(1.1)',
            border: `1.5px solid ${hovering ? `rgba(${glowRGB},0.4)` : 'rgba(255,255,255,0.35)'}`,
            boxShadow: hovering
              ? `0 12px 50px -10px rgba(${glowRGB},0.3), 0 0 25px -5px rgba(${glowRGB},0.15), inset 0 2px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(255,255,255,0.15)`
              : '0 6px 30px -6px rgba(31,41,55,0.12), inset 0 1.5px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(255,255,255,0.12)',
            transition: 'border-color 0.35s ease, box-shadow 0.35s ease, background 0.35s ease',
          }}
        >
          <div
            style={{
              position: 'absolute', top: '8%', left: '12%', width: '55%', height: '35%',
              background: 'rgba(255,255,255,0.3)', borderRadius: '50%', filter: 'blur(3px)',
              animation: 'waterCaustic1 4.5s ease-in-out infinite',
            }}
          />
          <div
            style={{
              position: 'absolute', bottom: '18%', right: '12%', width: '40%', height: '28%',
              background: hovering ? `rgba(${glowRGB},0.12)` : 'rgba(255,255,255,0.18)',
              borderRadius: '50%', filter: 'blur(2px)',
              animation: 'waterCaustic2 3.8s ease-in-out infinite',
              transition: 'background 0.35s ease',
            }}
          />
          <div
            style={{
              position: 'absolute', top: '45%', left: '40%', width: '30%', height: '20%',
              background: 'rgba(255,255,255,0.15)', borderRadius: '50%', filter: 'blur(1.5px)',
              animation: 'waterCaustic3 3.2s ease-in-out infinite',
            }}
          />
          <div
            className="absolute"
            style={{
              top: '6%', left: '22%', width: '56%', height: '22%',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.55) 0%, transparent 100%)',
              borderRadius: '50%', filter: 'blur(1.5px)',
            }}
          />
          <div
            className="absolute"
            style={{
              bottom: '10%', left: '18%', width: '64%', height: '14%',
              background: 'linear-gradient(0deg, rgba(255,255,255,0.12) 0%, transparent 100%)',
              borderRadius: '50%', filter: 'blur(1.5px)',
            }}
          />
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: hovering
                ? `radial-gradient(circle at 40% 40%, rgba(${glowRGB},0.08) 0%, transparent 60%)`
                : 'transparent',
              transition: 'background 0.4s ease',
            }}
          />
        </div>

        {/* Center point */}
        <div
          className="absolute rounded-full"
          style={{
            top: '50%', left: '50%', width: '5px', height: '5px',
            transform: 'translate(-50%, -50%)',
            background: hovering ? `rgba(${glowRGB}, 0.8)` : 'rgba(255, 255, 255, 0.55)',
            boxShadow: hovering
              ? `0 0 10px rgba(${glowRGB},0.5), 0 0 20px rgba(${glowRGB},0.2)`
              : '0 0 8px rgba(255,255,255,0.35)',
            transition: 'background 0.3s ease, box-shadow 0.3s ease',
          }}
        />
      </motion.div>
    </div>
  )
}

export default Cursor

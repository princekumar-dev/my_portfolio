import { useEffect, useState, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

const SECTION_COLORS = {
  home:     { r: 59,  g: 130, b: 246 },
  about:    { r: 6,   g: 182, b: 212 },
  skills:   { r: 139, g: 92,  b: 246 },
  projects: { r: 99,  g: 102, b: 241 },
  experience: { r: 59,  g: 130, b: 246 },
  certifications: { r: 6,   g: 182, b: 212 },
  contact:  { r: 139, g: 92,  b: 246 },
}

const SNAP_STRENGTH = 0.15

const Cursor = () => {
  const [visible, setVisible] = useState(false)

  const hoveringRef = useRef(false)
  const sectionRGBRef = useRef('59, 130, 246')
  const cursorElRef = useRef(null)
  const coreRef = useRef(null)
  const shellRef = useRef(null)
  const dotRef = useRef(null)
  const shadowRef = useRef(null)
  const caustic2Ref = useRef(null)
  const causticOverlayRef = useRef(null)

  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const prevX = useRef(-100)
  const prevY = useRef(-100)
  const velocity = useMotionValue(0)

  const x = useSpring(cursorX, { stiffness: 600, damping: 30, mass: 0.3 })
  const y = useSpring(cursorY, { stiffness: 600, damping: 30, mass: 0.3 })

  const trail1X = useSpring(cursorX, { stiffness: 250, damping: 24, mass: 0.5 })
  const trail1Y = useSpring(cursorY, { stiffness: 250, damping: 24, mass: 0.5 })
  const trail2X = useSpring(cursorX, { stiffness: 300, damping: 20, mass: 0.6 })
  const trail2Y = useSpring(cursorY, { stiffness: 300, damping: 20, mass: 0.6 })

  const scale = useSpring(1, { stiffness: 400, damping: 22 })
  const glowIntensity = useSpring(0, { stiffness: 400, damping: 18 })

  const glowScale = useTransform(scale, (s) => s * 1.8)

  const stretchX = useTransform(velocity, (v) => 1 + v * 0.4)
  const stretchY = useTransform(velocity, (v) => 1 - v * 0.15)

  const applyHoverStyles = (isHovering, rgb) => {
    const core = coreRef.current
    const shell = shellRef.current
    const dot = dotRef.current
    const shadow = shadowRef.current
    const caustic2 = caustic2Ref.current
    const overlay = causticOverlayRef.current

    if (core) {
      core.style.background = isHovering
        ? `linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(${rgb},0.06) 40%, rgba(255,255,255,0.15) 100%)`
        : 'linear-gradient(135deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.06) 40%, rgba(255,255,255,0.12) 100%)'
      core.style.borderColor = isHovering ? `rgba(${rgb},0.4)` : 'rgba(255,255,255,0.35)'
      core.style.boxShadow = isHovering
        ? `0 12px 50px -10px rgba(${rgb},0.3), 0 0 25px -5px rgba(${rgb},0.15), inset 0 2px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(255,255,255,0.15)`
        : '0 6px 30px -6px rgba(31,41,55,0.12), inset 0 1.5px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(255,255,255,0.12)'
    }
    if (shell) {
      shell.style.background = isHovering
        ? `linear-gradient(135deg, rgba(${rgb},0.12) 0%, rgba(${rgb},0.06) 50%, rgba(${rgb},0.1) 100%)`
        : 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)'
      shell.style.borderColor = isHovering ? `rgba(${rgb},0.25)` : 'rgba(255,255,255,0.12)'
    }
    if (dot) {
      dot.style.background = isHovering ? `rgba(${rgb}, 0.8)` : 'rgba(255, 255, 255, 0.55)'
      dot.style.boxShadow = isHovering
        ? `0 0 10px rgba(${rgb},0.5), 0 0 20px rgba(${rgb},0.2)`
        : '0 0 8px rgba(255,255,255,0.35)'
    }
    if (shadow) {
      shadow.style.transform = isHovering ? 'scale(0.5) translateY(4px)' : 'scale(1)'
      shadow.style.opacity = isHovering ? '0.3' : '0.6'
    }
    if (caustic2) {
      caustic2.style.background = isHovering ? `rgba(${rgb},0.12)` : 'rgba(255,255,255,0.18)'
    }
    if (overlay) {
      overlay.style.background = isHovering
        ? `radial-gradient(circle at 40% 40%, rgba(${rgb},0.08) 0%, transparent 60%)`
        : 'transparent'
    }
  }

  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (isTouch) return

    if (!visible) setVisible(true)

    const root = cursorElRef.current
    if (root) {
      coreRef.current = root.querySelector('.cursor-core')
      shellRef.current = root.querySelector('.cursor-shell')
      dotRef.current = root.querySelector('.cursor-dot')
      shadowRef.current = root.querySelector('.cursor-shadow')
      caustic2Ref.current = root.querySelector('.cursor-caustic2')
      causticOverlayRef.current = root.querySelector('.cursor-caustic-overlay')
    }

    let raf
    let lastSnapTarget = null
    let lastElementCheck = 0

    const move = (e) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const dx = e.clientX - prevX.current
        const dy = e.clientY - prevY.current
        const d2 = dx * dx + dy * dy
        velocity.set(Math.min((d2 < 1 ? 0 : Math.sqrt(d2)) / 20, 1))
        prevX.current = e.clientX
        prevY.current = e.clientY
      })

      const now = performance.now()
      if (now - lastElementCheck > 100) {
        lastElementCheck = now
        const el = document.elementFromPoint(e.clientX, e.clientY)
        lastSnapTarget = el?.closest('a, button, [role="button"], .glass-card, .group') || null
      }

      if (lastSnapTarget && hoveringRef.current) {
        const rect = lastSnapTarget.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        cursorX.set(e.clientX + (cx - e.clientX) * SNAP_STRENGTH)
        cursorY.set(e.clientY + (cy - e.clientY) * SNAP_STRENGTH)
      } else {
        cursorX.set(e.clientX)
        cursorY.set(e.clientY)
      }
    }

    const down = () => {
      scale.set(0.6)
    }

    const up = () => {
      scale.set(1)
    }

    const over = (e) => {
      const t = e.target.closest('a, button, [role="button"], .glass-card, .group')
      if (t) {
        hoveringRef.current = true
        scale.set(1.25)
        glowIntensity.set(1)

        const section = t.closest('section[id]')
        const rgb = section && SECTION_COLORS[section.id]
          ? `${SECTION_COLORS[section.id].r}, ${SECTION_COLORS[section.id].g}, ${SECTION_COLORS[section.id].b}`
          : sectionRGBRef.current
        sectionRGBRef.current = rgb
        applyHoverStyles(true, rgb)
      }
    }

    const out = (e) => {
      const t = e.target.closest('a, button, [role="button"], .glass-card, .group')
      if (t) {
        hoveringRef.current = false
        scale.set(1)
        glowIntensity.set(0)
        applyHoverStyles(false, sectionRGBRef.current)
      }
    }

    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('mousedown', down, { passive: true })
    window.addEventListener('mouseup', up, { passive: true })
    document.addEventListener('mouseover', over, { passive: true })
    document.addEventListener('mouseout', out, { passive: true })

    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('mousedown', down)
      window.removeEventListener('mouseup', up)
      document.removeEventListener('mouseover', over)
      document.removeEventListener('mouseout', out)
      cancelAnimationFrame(raf)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const glowRGB = sectionRGBRef.current

  return (
    <div
      ref={cursorElRef}
      className="pointer-events-none fixed inset-0 z-[9999]"
      aria-hidden="true"
    >
      {/* Trail 3 */}
      <motion.div
        style={{ x: trail2X, y: trail2Y, translateX: '-50%', translateY: '-50%', scaleX: stretchX, scaleY: stretchY }}
        className="absolute top-0 left-0 w-4 h-4 rounded-full"
        willChange="transform"
      >
        <div className="w-full h-full rounded-full border border-white/12" />
      </motion.div>

      {/* Trail 2 */}
      <motion.div
        style={{ x: trail1X, y: trail1Y, translateX: '-50%', translateY: '-50%', scaleX: stretchX, scaleY: stretchY }}
        className="absolute top-0 left-0 w-6 h-6 rounded-full"
        willChange="transform"
      >
        <div className="w-full h-full rounded-full border border-white/10" />
      </motion.div>

      {/* Ripple ring */}
      <motion.div
        style={{ x, y, translateX: '-50%', translateY: '-50%', opacity: glowIntensity }}
        className="absolute top-0 left-0 w-12 h-12 rounded-full"
      >
        <div className="w-full h-full rounded-full border border-accent-blue/20 animate-ping" style={{ animationDuration: '1.5s' }} />
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
        style={{ x, y, translateX: '-50%', translateY: '-50%', scale }}
        className="absolute top-0 left-0 w-10 h-10 rounded-full"
      >
        <div
          className="cursor-shadow absolute rounded-full"
          style={{
            bottom: '-8px', left: '15%', width: '70%', height: '20%',
            background: 'radial-gradient(ellipse, rgba(31,41,55,0.08) 0%, transparent 70%)',
            filter: 'blur(2px)',
            transform: 'scale(1)',
            transition: 'transform 0.3s ease, opacity 0.3s ease',
            opacity: 0.6,
          }}
        />

        <div
          className="cursor-shell absolute inset-[-3px] rounded-full"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
            border: '1px solid rgba(255,255,255,0.12)',
            transition: 'background 0.4s ease, border-color 0.4s ease',
          }}
        />

        <div
          className="cursor-core absolute inset-0 rounded-full overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.06) 40%, rgba(255,255,255,0.12) 100%)',
            border: '1.5px solid rgba(255,255,255,0.35)',
            boxShadow: '0 6px 30px -6px rgba(31,41,55,0.12), inset 0 1.5px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(255,255,255,0.12)',
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
            className="cursor-caustic2"
            style={{
              position: 'absolute', bottom: '18%', right: '12%', width: '40%', height: '28%',
              background: 'rgba(255,255,255,0.18)',
              borderRadius: '50%', filter: 'blur(2px)',
              animation: 'waterCaustic2 3.8s ease-in-out infinite',
              transition: 'background 0.35s ease',
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
            className="cursor-caustic-overlay absolute inset-0 rounded-full"
            style={{ background: 'transparent', transition: 'background 0.4s ease' }}
          />
        </div>

        <div
          className="cursor-dot absolute rounded-full"
          style={{
            top: '50%', left: '50%', width: '5px', height: '5px',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(255, 255, 255, 0.55)',
            boxShadow: '0 0 8px rgba(255,255,255,0.35)',
            transition: 'background 0.3s ease, box-shadow 0.3s ease',
          }}
        />
      </motion.div>
    </div>
  )
}

export default Cursor

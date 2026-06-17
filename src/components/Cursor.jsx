import { useEffect, useState, useRef } from 'react'
import { AnimatePresence, m, useReducedMotion, useSpring, useMotionValue, useMotionTemplate } from 'framer-motion'
import { usePointer } from '../context/PointerContext'
import { useTheme } from '../context/ThemeContext'
import { useTiltContext } from '../context/TiltContext'

const SECTION_COLORS = {
  home:           '#3B82F6',
  about:          '#06B6D4',
  skills:         '#8B5CF6',
  projects:       '#6366F1',
  experience:     '#3B82F6',
  certifications: '#06B6D4',
  contact:        '#8B5CF6',
}

    const SELECTOR = 'a, button, [role="button"], [data-cursor-target], .btn-glass, .tag-glass'
let burstId = 0

const Cursor = () => {
  const [visible, setVisible] = useState(false)
  const [bursts, setBursts] = useState([])
  const reduceMotion = useReducedMotion()
  const { clientX, clientY } = usePointer()
  const { isDark } = useTheme()
  const tiltContext = useTiltContext()

  const bubbleRef = useRef(null)
  const specular1Ref = useRef(null)
  const specular2Ref = useRef(null)
  const specular3Ref = useRef(null)
  const ringRef = useRef(null)
  const hoverRef = useRef(false)
  const targetRef = useRef(null)
  const colorRef = useRef('#3B82F6')
  const borderRadiusRef = useRef('50%')
  const lastMoveTime = useRef(0)
  const blurActiveRef = useRef(false)
  const isTiltCardRef = useRef(false)

  const dotRef = useRef(null)
  const targetRectRef = useRef(null)
  const rafRef = useRef(0)
  const hoveredElRef = useRef(null)

  const posX = useMotionValue(-100)
  const posY = useMotionValue(-100)
  const sx = useSpring(posX, { stiffness: 180, damping: 18 })
  const sy = useSpring(posY, { stiffness: 180, damping: 18 })

  const targetW = useMotionValue(20)
  const targetH = useMotionValue(20)
  const sw = useSpring(targetW, { stiffness: 200, damping: 25 })
  const sh = useSpring(targetH, { stiffness: 200, damping: 25 })

  const scaleVal = useMotionValue(1)
  const smoothScale = useSpring(scaleVal, { stiffness: 300, damping: 20 })

  const tiltX = useSpring(useMotionValue(0), { stiffness: 300, damping: 30 })
  const tiltY = useSpring(useMotionValue(0), { stiffness: 300, damping: 30 })
  const rotateZ = useSpring(useMotionValue(0), { stiffness: 300, damping: 30 })
  const transform = useMotionTemplate`translate(${sx}px, ${sy}px) translate(-50%, -50%) scale(${smoothScale}) perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) rotateZ(${rotateZ}deg)`

  // Highly responsive tracking values for the cursor pointer dot
  const dx = useSpring(clientX, { stiffness: 900, damping: 32 })
  const dy = useSpring(clientY, { stiffness: 900, damping: 32 })
  const dotTransform = useMotionTemplate`translate(${dx}px, ${dy}px) translate(-50%, -50%)`

  useEffect(() => {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return
    setVisible(true)

    let resizeObserver = null
    if (typeof window.ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        if (tgt) {
          const rect = tgt.getBoundingClientRect()
          const width = tgt.offsetWidth || rect.width
          const height = tgt.offsetHeight || rect.height
          targetRectRef.current = {
            centerX: rect.left + rect.width / 2,
            centerY: rect.top + rect.height / 2,
            width,
            height
          }
        }
      })
    }

    const find = (el) => {
      let n = el
      while (n && n !== document.body) {
        if (n.matches?.(SELECTOR)) return n
        n = n.parentElement
      }
      return null
    }

    const findTarget = (el) => {
      let n = el
      while (n && n !== document.body) {
        if (n.hasAttribute?.('data-cursor-target')) return n
        n = n.parentElement
      }
      return null
    }

    const getRotation = (el) => {
      const cs = getComputedStyle(el).transform
      if (!cs || cs === 'none') return 0
      const m = cs.match(/matrix(?:3d)?\(([^)]+)\)/)
      if (!m) return 0
      const vals = m[1].split(',').map(Number)
      if (vals.length === 6) return Math.atan2(vals[1], vals[0]) * (180 / Math.PI)
      if (vals.length === 16) return Math.atan2(vals[1], vals[0]) * (180 / Math.PI)
      return 0
    }

    const color = (el) => {
      const s = el.closest('section[id]')
      return (s && SECTION_COLORS[s.id]) || colorRef.current
    }

    const applyBlur = (b, on) => {
      if (on) {
        b.style.backdropFilter = 'blur(4px)'
        b.style.webkitBackdropFilter = 'blur(4px)'
      } else {
        b.style.backdropFilter = 'none'
        b.style.webkitBackdropFilter = 'none'
      }
    }

    const paintHover = (c) => {
      const b = bubbleRef.current
      if (!b) return
      b.style.background = 'transparent'
      b.style.border = `1.5px solid ${c}55`
      b.style.boxShadow = `0 0 24px ${c}22, 0 0 48px ${c}0c, inset 0 0 12px ${c}10`
      applyBlur(b, false)
      if (specular1Ref.current) specular1Ref.current.style.opacity = '0'
      if (specular2Ref.current) specular2Ref.current.style.opacity = '0'
      if (specular3Ref.current) specular3Ref.current.style.opacity = '0'
      if (ringRef.current) ringRef.current.style.opacity = '0'

      if (dotRef.current) {
        dotRef.current.style.backgroundColor = c
        dotRef.current.style.boxShadow = `0 0 4px ${c}`
      }
    }

    const paintIdle = () => {
      const b = bubbleRef.current
      if (!b) return
      b.style.background = isDark
        ? [
            'radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.35) 0%, transparent 50%)',
            'radial-gradient(ellipse at 70% 80%, rgba(255,255,255,0.08) 0%, transparent 40%)',
            'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 70%, transparent 100%)',
          ].join(', ')
        : [
            'radial-gradient(ellipse at 30% 20%, rgba(59,130,246,0.3) 0%, transparent 50%)',
            'radial-gradient(ellipse at 70% 80%, rgba(6,182,212,0.1) 0%, transparent 40%)',
            'radial-gradient(circle at 50% 50%, rgba(59,130,246,0.15) 0%, rgba(59,130,246,0.04) 70%, transparent 100%)',
          ].join(', ')
      b.style.border = isDark ? '2px solid rgba(255,255,255,0.6)' : '2px solid rgba(59,130,246,0.5)'
      b.style.boxShadow = isDark
        ? 'inset 0 2px 8px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.15), 0 0 20px rgba(0,0,0,0.25), 0 0 12px rgba(59,130,246,0.12), 0 4px 16px rgba(0,0,0,0.15)'
        : 'inset 0 2px 8px rgba(255,255,255,0.8), inset 0 -2px 4px rgba(59,130,246,0.06), 0 0 20px rgba(59,130,246,0.1), 0 0 0 1px rgba(59,130,246,0.15), 0 4px 16px rgba(0,0,0,0.06)'
      if (specular1Ref.current) specular1Ref.current.style.opacity = '1'
      if (specular2Ref.current) specular2Ref.current.style.opacity = '1'
      if (specular3Ref.current) specular3Ref.current.style.opacity = '1'
      if (ringRef.current) ringRef.current.style.opacity = '0.8'

      const activeColor = isDark ? '#ffffff' : '#3B82F6'
      if (dotRef.current) {
        dotRef.current.style.backgroundColor = activeColor
        dotRef.current.style.boxShadow = isDark ? '0 0 4px rgba(255,255,255,0.6)' : '0 0 4px rgba(59,130,246,0.4)'
      }
    }

    const down = () => {
      scaleVal.set(0.7)
      const ps = Array.from({ length: 8 }, (_, i) => ({
        id: burstId++,
        a: (i / 8) * 360 + Math.random() * 30 - 15,
        d: 35 + Math.random() * 85,
        s: 3 + Math.random() * 5,
        dl: Math.random() * 0.06,
      }))
      setBursts((p) => [...p, ...ps])
      setTimeout(() => setBursts((p) => p.filter((x) => !ps.find((n) => n.id === x.id))), 600)
    }
    const up = () => { scaleVal.set(1) }

    let tgt = null
    let bobT = 0

    const updateRect = () => {
      if (tgt) {
        const rect = tgt.getBoundingClientRect()
        targetRectRef.current = {
          ...targetRectRef.current,
          centerX: rect.left + rect.width / 2,
          centerY: rect.top + rect.height / 2,
          width: tgt.offsetWidth || rect.width,
          height: tgt.offsetHeight || rect.height
        }
      }
    }

    const loop = () => {
      if (tgt) {
        const isTiltCard = isTiltCardRef.current
        let r = targetRectRef.current
        if (!r) {
          const rect = tgt.getBoundingClientRect()
          r = {
            centerX: rect.left + rect.width / 2,
            centerY: rect.top + rect.height / 2,
            width: tgt.offsetWidth || rect.width,
            height: tgt.offsetHeight || rect.height
          }
          targetRectRef.current = r
        }
        const ecx = r.centerX
        const ecy = r.centerY

        posX.set(ecx)
        posY.set(ecy)
        targetW.set(r.width + 8)
        targetH.set(r.height + 8)

        const { rotateX: rx, rotateY: ry, isActive: ta } = tiltContext
        if (isTiltCard && ta) {
          tiltX.set(rx)
          tiltY.set(ry)
          rotateZ.set(0)
        } else {
          tiltX.set(0)
          tiltY.set(0)
          const he = hoveredElRef.current
          if (he) {
            rotateZ.set(getRotation(he))
          } else {
            rotateZ.set(0)
          }
        }

        const b = bubbleRef.current
        if (b) b.style.borderRadius = borderRadiusRef.current
      } else {
        tiltX.set(0)
        tiltY.set(0)
        rotateZ.set(0)

        const now = performance.now()
        const isIdle = now - lastMoveTime.current > 200

        if (isIdle && !blurActiveRef.current) {
          const b = bubbleRef.current
          if (b && !hoverRef.current) applyBlur(b, true)
          blurActiveRef.current = true
        } else if (!isIdle && blurActiveRef.current) {
          const b = bubbleRef.current
          if (b) applyBlur(b, false)
          blurActiveRef.current = false
        }

        if (!isIdle) {
          bobT += 0.022
          scaleVal.set(1 + Math.sin(bobT) * 0.05)
        }

        posX.set(clientX.get())
        posY.set(clientY.get())
        targetW.set(20)
        targetH.set(20)

        const b = bubbleRef.current
        if (b) b.style.borderRadius = '50%'
      }

      rafRef.current = requestAnimationFrame(loop)
    }

    const onPointerMove = () => {
      lastMoveTime.current = performance.now()
    }

    const over = (e) => {
      const t = find(e.target)
      if (!t || tgt === t) return
      tgt = t
      hoverRef.current = true

      const radiusEl = findTarget(e.target) || t
      borderRadiusRef.current = getComputedStyle(radiusEl).borderRadius || '16px'

      const isTiltCard = t.hasAttribute('data-cursor-target') && t.getAttribute('data-cursor-target') === 'tilt-card'
      isTiltCardRef.current = isTiltCard

      const rect = t.getBoundingClientRect()
      targetRectRef.current = {
        centerX: rect.left + rect.width / 2,
        centerY: rect.top + rect.height / 2,
        width: t.offsetWidth || rect.width,
        height: t.offsetHeight || rect.height
      }

      if (resizeObserver) {
        resizeObserver.disconnect()
        resizeObserver.observe(t)
      }

      const c = color(t)
      colorRef.current = c
      const b = bubbleRef.current
      if (b) applyBlur(b, false)
      paintHover(c)
      hoveredElRef.current = t
    }

    const out = (e) => {
      const t = find(e.target)
      if (!t) return
      if (e.relatedTarget && t.contains(e.relatedTarget)) return
      if (tgt === t) {
        tgt = null
        targetRectRef.current = null
        if (resizeObserver) {
          resizeObserver.disconnect()
        }
        borderRadiusRef.current = '50%'
      }
      hoverRef.current = false
      blurActiveRef.current = false
      isTiltCardRef.current = false
      hoveredElRef.current = null
      paintIdle()
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('mousedown', down, { passive: true })
    window.addEventListener('mouseup', up, { passive: true })
    document.addEventListener('mouseover', over, { passive: true })
    document.addEventListener('mouseout', out, { passive: true })
    window.addEventListener('scroll', updateRect, { passive: true })
    window.addEventListener('resize', updateRect, { passive: true })

    rafRef.current = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('mousedown', down)
      window.removeEventListener('mouseup', up)
      document.removeEventListener('mouseover', over)
      document.removeEventListener('mouseout', out)
      window.removeEventListener('scroll', updateRect)
      window.removeEventListener('resize', updateRect)
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
      cancelAnimationFrame(rafRef.current)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (reduceMotion || !visible) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]" aria-hidden="true">
      <m.div
        ref={dotRef}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: '4px',
          height: '4px',
          borderRadius: '50%',
          backgroundColor: isDark ? '#ffffff' : '#3B82F6',
          boxShadow: isDark ? '0 0 4px rgba(255,255,255,0.6)' : '0 0 4px rgba(59,130,246,0.4)',
          transform: dotTransform,
          willChange: 'transform',
          zIndex: 10000,
          pointerEvents: 'none',
          opacity: 0.4,
          transition: 'background-color 0.3s, box-shadow 0.3s, opacity 0.3s',
        }}
      />

      <m.div
        ref={bubbleRef}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: sw,
          height: sh,
          transform,
          willChange: 'transform',
          transformStyle: 'preserve-3d',
          zIndex: 9999,
          overflow: 'visible',
          background: isDark
            ? [
                'radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.35) 0%, transparent 50%)',
                'radial-gradient(ellipse at 70% 80%, rgba(255,255,255,0.08) 0%, transparent 40%)',
                'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 70%, transparent 100%)',
              ].join(', ')
            : [
                'radial-gradient(ellipse at 30% 20%, rgba(59,130,246,0.3) 0%, transparent 50%)',
                'radial-gradient(ellipse at 70% 80%, rgba(6,182,212,0.1) 0%, transparent 40%)',
                'radial-gradient(circle at 50% 50%, rgba(59,130,246,0.15) 0%, rgba(59,130,246,0.04) 70%, transparent 100%)',
              ].join(', '),
          border: isDark ? '2px solid rgba(255,255,255,0.6)' : '2px solid rgba(59,130,246,0.5)',
          boxShadow: isDark
            ? 'inset 0 2px 8px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.15), 0 0 20px rgba(0,0,0,0.25), 0 0 12px rgba(59,130,246,0.12), 0 4px 16px rgba(0,0,0,0.15)'
            : 'inset 0 2px 8px rgba(255,255,255,0.8), inset 0 -2px 4px rgba(59,130,246,0.06), 0 0 20px rgba(59,130,246,0.1), 0 0 0 1px rgba(59,130,246,0.15), 0 4px 16px rgba(0,0,0,0.06)',
          transition: 'background 0.4s, border 0.4s, box-shadow 0.4s, border-radius 0.4s cubic-bezier(0.22,1,0.36,1), opacity 0.3s, backdrop-filter 0.3s',
        }}
      >
        <div ref={specular1Ref} style={{
          position: 'absolute',
          top: '6%',
          left: '10%',
          width: '48%',
          height: '36%',
          borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(ellipse, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.2) 50%, transparent 70%)'
            : 'radial-gradient(ellipse, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.3) 50%, transparent 70%)',
          pointerEvents: 'none',
          transition: 'opacity 0.3s',
        }} />
        <div ref={specular2Ref} style={{
          position: 'absolute',
          bottom: '12%',
          right: '14%',
          width: '30%',
          height: '22%',
          borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(ellipse, rgba(255,255,255,0.35) 0%, transparent 70%)'
            : 'radial-gradient(ellipse, rgba(255,255,255,0.4) 0%, transparent 70%)',
          pointerEvents: 'none',
          transition: 'opacity 0.3s',
        }} />
        <div ref={specular3Ref} style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '20%',
          height: '15%',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          background: isDark
            ? 'radial-gradient(ellipse, rgba(255,255,255,0.15) 0%, transparent 70%)'
            : 'radial-gradient(ellipse, rgba(255,255,255,0.2) 0%, transparent 70%)',
          pointerEvents: 'none',
          transition: 'opacity 0.3s',
        }} />
        <div ref={ringRef} style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          background: 'conic-gradient(from 45deg, rgba(59,130,246,0.55), rgba(6,182,212,0.4), rgba(139,92,246,0.55), rgba(99,102,241,0.4), rgba(236,72,153,0.3), rgba(59,130,246,0.55))',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          padding: '2px',
          pointerEvents: 'none',
          opacity: 0.8,
          transition: 'opacity 0.3s',
          animation: 'cursorRingSpin 8s linear infinite',
        }} />
      </m.div>

      <AnimatePresence>
        {bursts.map((p) => (
          <m.div
            key={p.id}
            style={{
              position: 'fixed',
              width: p.s,
              height: p.s,
              borderRadius: '50%',
              left: 0,
              top: 0,
              transform: 'translate(-50%,-50%)',
              background: `radial-gradient(circle, ${colorRef.current}88, ${colorRef.current}33)`,
              boxShadow: `0 0 ${p.s * 2}px ${colorRef.current}40`,
              pointerEvents: 'none',
              zIndex: 9999,
            }}
            initial={{ x: clientX.get(), y: clientY.get(), scale: 1, opacity: 0.85 }}
            animate={{
              x: clientX.get() + Math.cos((p.a * Math.PI) / 180) * p.d,
              y: clientY.get() + Math.sin((p.a * Math.PI) / 180) * p.d,
              scale: 0,
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: p.dl }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

export default Cursor

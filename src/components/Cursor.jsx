import { useEffect, useState, useRef } from 'react'
import { AnimatePresence, m, useReducedMotion, useSpring, useMotionValue, useMotionTemplate, useTransform } from 'framer-motion'
import { usePointer } from '../context/PointerContext'
import { useTheme } from '../context/ThemeContext'
import { useTiltContext } from '../context/TiltContext'

const SECTION_COLORS = {
  home:           '#3D5A73',
  about:          '#4A7060',
  skills:         '#996B75',
  projects:       '#3A5258',
  experience:     '#3D5A73',
  certifications: '#4A7060',
  contact:        '#996B75',
}

const SELECTOR = 'a, button, [role="button"], [data-cursor-target], .btn-glass, .tag-glass, .tag-glass-dark'
let burstId = 0

const Cursor = () => {
  const reduceMotion = useReducedMotion()
  const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)
  if (reduceMotion || isTouch) return null
  return <CursorDesktop />
}

const CursorDesktop = () => {
  const [visible, setVisible] = useState(false)
  const [bursts, setBursts] = useState([])
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
  const colorRef = useRef('#3D5A73')
  const borderRadiusRef = useRef('50%')
  const lastMoveTime = useRef(0)
  const isTiltCardRef = useRef(false)
  // Adaptive suppression: if this device keeps dropping frames while the
  // hover swell is on screen, drop the swell for the rest of the session
  // rather than stay janky.
  const liteRef = useRef(false)
  const slowFramesRef = useRef(0)
  const lastFrameTimeRef = useRef(0)
  const lastRadiusRef = useRef('')

  const dotRef = useRef(null)
  const targetRectRef = useRef(null)
  const rafRef = useRef(0)
  const hoveredElRef = useRef(null)
  const lastRotTime = useRef(0)
  const lastRotVal = useRef(0)
  const lastPosX = useRef(-100)
  const lastPosY = useRef(-100)
  const lastW = useRef(20)
  const lastH = useRef(20)
  const lastPointerTime = useRef(0)

  const posX = useMotionValue(-100)
  const posY = useMotionValue(-100)
  const sx = useSpring(posX, { stiffness: 180, damping: 18 })
  const sy = useSpring(posY, { stiffness: 180, damping: 18 })

  // Size is set INSTANTLY, never sprung. Animating width/height makes the
  // browser re-run layout and re-raster this layer — its gradients, its
  // shadows and all four child elements — on every single frame of the
  // transition, which is exactly what made hovering a card hitch. The reveal
  // is carried by opacity and transform instead, both compositor-only.
  const targetW = useMotionValue(20)
  const targetH = useMotionValue(20)
  const swellReveal = useSpring(0.92, { stiffness: 260, damping: 26 })

  const scaleVal = useMotionValue(1)
  const smoothScale = useSpring(scaleVal, { stiffness: 300, damping: 20 })
  const revealScale = useTransform([smoothScale, swellReveal], ([a, b]) => a * b)

  const tiltXVal = useMotionValue(0)
  const tiltYVal = useMotionValue(0)
  const rotateZVal = useMotionValue(0)
  const tiltX = useSpring(tiltXVal, { stiffness: 300, damping: 30 })
  const tiltY = useSpring(tiltYVal, { stiffness: 300, damping: 30 })
  const rotateZ = useSpring(rotateZVal, { stiffness: 300, damping: 30 })
  const transform = useMotionTemplate`translate(${sx}px, ${sy}px) translate(-50%, -50%) scale(${revealScale}) perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) rotateZ(${rotateZ}deg)`

  // Highly responsive tracking values for the cursor pointer dot
  const dx = useSpring(clientX, { stiffness: 900, damping: 32 })
  const dy = useSpring(clientY, { stiffness: 900, damping: 32 })
  const dotTransform = useMotionTemplate`translate(${dx}px, ${dy}px) translate(-50%, -50%)`

  useEffect(() => {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return
    setVisible(true)

    // Up-front capability floor: on a machine with very few cores or very
    // little memory the swell is suppressed before it ever renders, so the
    // cursor stays fluid instead of stuttering into existence.
    if ((navigator.hardwareConcurrency || 8) <= 2) liteRef.current = true
    if (typeof navigator.deviceMemory === 'number' && navigator.deviceMemory <= 2) liteRef.current = true

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
        // A disabled control is inert: its whole subtree must not trigger a
        // hover morph, and we must not fall through to an interactive ancestor
        // (otherwise the cursor swells to the entire form once the send button
        // disables itself) — and it never fires the mouseout that would
        // otherwise release tracking.
        if (n.disabled || n.getAttribute?.('aria-disabled') === 'true') return null
        // Explicit escape hatch: a container can opt out of hover tracking
        // (used while the contact form is busy, so the cursor stops swelling
        // to the whole card when the toast shifts layout underneath it).
        if (n.hasAttribute?.('data-cursor-disabled')) return null
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

    const computeRotation = (el) => {
      const cs = getComputedStyle(el).transform
      if (!cs || cs === 'none') return 0
      const m = cs.match(/matrix(?:3d)?\(([^)]+)\)/)
      if (!m) return 0
      const vals = m[1].split(',').map(Number)
      if (vals.length === 6) return Math.atan2(vals[1], vals[0]) * (180 / Math.PI)
      if (vals.length === 16) return Math.atan2(vals[1], vals[0]) * (180 / Math.PI)
      return 0
    }

    const getRotationCached = (el) => {
      const now = performance.now()
      if (now - lastRotTime.current < 60) return lastRotVal.current
      lastRotTime.current = now
      const r = computeRotation(el)
      lastRotVal.current = r
      return r
    }

    const color = (el) => {
      const s = el.closest('section[id]')
      return (s && SECTION_COLORS[s.id]) || colorRef.current
    }

    const paintHover = (c) => {
      const b = bubbleRef.current
      if (!b) return
      b.style.background = 'transparent'
      b.style.border = `1.5px solid ${c}55`
      // One glow rather than three. Box-shadow blur cost scales with the
      // element's area, and at card size the wide second glow plus the inset
      // ring were by far the most expensive thing this cursor painted.
      b.style.boxShadow = `0 0 28px ${c}33`
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
      // Two gradient layers, three shadow layers — matches the JSX default
      // below, and every one of these is repainted on each frame the cursor
      // moves, so each layer saved is a real per-frame win.
      b.style.background = isDark
        ? [
            'radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.35) 0%, transparent 50%)',
            'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 70%, transparent 100%)',
          ].join(', ')
        : [
            'radial-gradient(ellipse at 30% 20%, rgba(61,90,115,0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 50% 50%, rgba(61,90,115,0.15) 0%, rgba(61,90,115,0.04) 70%, transparent 100%)',
          ].join(', ')
      b.style.border = isDark ? '2px solid rgba(255,255,255,0.6)' : '2px solid rgba(61,90,115,0.5)'
      b.style.boxShadow = isDark
        ? 'inset 0 2px 8px rgba(255,255,255,0.3), 0 0 20px rgba(0,0,0,0.25), 0 4px 16px rgba(0,0,0,0.15)'
        : 'inset 0 2px 8px rgba(255,255,255,0.8), 0 0 20px rgba(61,90,115,0.1), 0 4px 16px rgba(0,0,0,0.06)'
      if (specular1Ref.current) specular1Ref.current.style.opacity = '1'
      if (specular2Ref.current) specular2Ref.current.style.opacity = '1'
      if (specular3Ref.current) specular3Ref.current.style.opacity = '1'
      if (ringRef.current) ringRef.current.style.opacity = '0.8'

      const activeColor = isDark ? '#ffffff' : '#3D5A73'
      if (dotRef.current) {
        dotRef.current.style.backgroundColor = activeColor
        dotRef.current.style.boxShadow = isDark ? '0 0 4px rgba(255,255,255,0.6)' : '0 0 4px rgba(61,90,115,0.4)'
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
    let loopRunning = false
    let scrollDirty = false

    // Drop any sticky hover state (e.g. a card that was covered by the
    // certificate modal) so the cursor returns to its idle look instead of
    // still tracking the element behind the modal.
    const resetHover = () => {
      tgt = null
      targetRectRef.current = null
      if (resizeObserver) resizeObserver.disconnect()
      borderRadiusRef.current = '50%'
      hoverRef.current = false
      isTiltCardRef.current = false
      hoveredElRef.current = null
      swellReveal.set(0.92)
      paintIdle()
    }

    const startLoop = () => {
      if (!loopRunning) {
        loopRunning = true
        rafRef.current = requestAnimationFrame(loop)
      }
    }

    const scheduleLoop = () => {
      if (!loopRunning) startLoop()
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

        if (ecx !== lastPosX.current) { posX.set(ecx); lastPosX.current = ecx }
        if (ecy !== lastPosY.current) { posY.set(ecy); lastPosY.current = ecy }
        // Instant, never sprung — see the note by targetW. On a device that
        // can't afford the swell, the bubble simply stays its resting size.
        const w = liteRef.current ? 20 : r.width + 8
        const h = liteRef.current ? 20 : r.height + 8
        if (w !== lastW.current) { targetW.set(w); lastW.current = w }
        if (h !== lastH.current) { targetH.set(h); lastH.current = h }

        const isMoving = (performance.now() - lastPointerTime.current) < 100
        if (isTiltCard) {
          const { rotateX: rx, rotateY: ry, isActive: ta } = tiltContext
          if (ta) {
            tiltX.set(rx)
            tiltY.set(ry)
          } else {
            tiltX.set(0)
            tiltY.set(0)
          }
          rotateZ.set(0)
        } else if (isMoving) {
          tiltX.set(0)
          tiltY.set(0)
          const he = hoveredElRef.current
          if (he) {
            rotateZ.set(getRotationCached(he))
          } else {
            rotateZ.set(0)
          }
        }

        const b = bubbleRef.current
        // Only write when the value actually changes: writing the same
        // borderRadius every frame forces a style recalc 60x a second.
        if (b && lastRadiusRef.current !== borderRadiusRef.current) {
          b.style.borderRadius = borderRadiusRef.current
          lastRadiusRef.current = borderRadiusRef.current
        }
      } else {
        tiltX.set(0)
        tiltY.set(0)
        rotateZ.set(0)

        const now = performance.now()
        const isIdle = now - lastMoveTime.current > 200

        if (!isIdle) {
          bobT += 0.022
          scaleVal.set(1 + Math.sin(bobT) * 0.05)
        }

        const cx = clientX.get()
        const cy = clientY.get()
        if (cx !== lastPosX.current) { posX.set(cx); lastPosX.current = cx }
        if (cy !== lastPosY.current) { posY.set(cy); lastPosY.current = cy }
        if (lastW.current !== 20) { targetW.set(20); lastW.current = 20 }
        if (lastH.current !== 20) { targetH.set(20); lastH.current = 20 }

        const b = bubbleRef.current
        if (b && lastRadiusRef.current !== '50%') {
          b.style.borderRadius = '50%'
          lastRadiusRef.current = '50%'
        }
      }

      const now = performance.now()

      // Adaptive suppression. If the device keeps dropping to under ~25fps
      // while the swell is on screen it cannot afford the effect — shrink
      // back to the plain orb for the rest of the session rather than stay
      // janky.
      if (tgt) {
        const dt = now - lastFrameTimeRef.current
        lastFrameTimeRef.current = now
        // Only sustained jank may condemn this device. The loop stops when
        // the pointer idles, so the first frame after a restart carries a dt
        // spanning the whole idle gap — that must never count, or every
        // restart reads as a dropped frame and the swell is suppressed almost
        // immediately. Healthy frames decay the counter so one GC pause or a
        // background tab doesn't condemn it either.
        if (dt > 0 && dt < 200) {
          if (dt > 50) slowFramesRef.current += 1
          else if (slowFramesRef.current > 0) slowFramesRef.current -= 1
        }
        if (slowFramesRef.current > 40 && !liteRef.current) {
          liteRef.current = true
          lastW.current = -1
          lastH.current = -1
        }
      }

      const idleLong = now - lastMoveTime.current > 2000
      if (idleLong && !tgt) {
        loopRunning = false
        return
      }

      if (scrollDirty && tgt) {
        scrollDirty = false
        const rect = tgt.getBoundingClientRect()
        targetRectRef.current = {
          ...targetRectRef.current,
          centerX: rect.left + rect.width / 2,
          centerY: rect.top + rect.height / 2,
          width: tgt.offsetWidth || rect.width,
          height: tgt.offsetHeight || rect.height
        }
      }

      rafRef.current = requestAnimationFrame(loop)
    }

    const onPointerMove = () => {
      lastMoveTime.current = performance.now()
      lastPointerTime.current = lastMoveTime.current
      scheduleLoop()
    }

    const onScroll = () => {
      if (tgt) scrollDirty = true
      scheduleLoop()
    }

    const onResize = () => {
      if (tgt) scrollDirty = true
      scheduleLoop()
    }

    const onVisibilityChange = () => {
      if (document.hidden) {
        loopRunning = false
        cancelAnimationFrame(rafRef.current)
      } else {
        scheduleLoop()
      }
    }

    const over = (e) => {
      // While a modal is open, only elements inside it are hover targets —
      // anything behind the backdrop must not keep/drive the hover state.
      const dialog = document.querySelector('[role="dialog"]')
      if (dialog && !(e.target instanceof Element && dialog.contains(e.target))) {
        if (hoverRef.current || tgt) resetHover()
        return
      }

      const t = find(e.target)
      if (!t || tgt === t) {
        // Moving over plain, non-interactive content: drop any stale state.
        if (!t && hoverRef.current) resetHover()
        return
      }
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
      paintHover(c)
      // Compositor-only reveal: the size itself is applied instantly by the
      // loop, so the transition must not come from animating layout.
      swellReveal.set(0.92)
      requestAnimationFrame(() => swellReveal.set(1))
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
      isTiltCardRef.current = false
      hoveredElRef.current = null
      swellReveal.set(0.92)
      paintIdle()
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('mousedown', down, { passive: true })
    window.addEventListener('mouseup', up, { passive: true })
    document.addEventListener('mouseover', over, { passive: true })
    document.addEventListener('mouseout', out, { passive: true })
    document.addEventListener('certificate-modal-open', resetHover)
    document.addEventListener('cursor-reset', resetHover)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })
    document.addEventListener('visibilitychange', onVisibilityChange)

    startLoop()

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('mousedown', down)
      window.removeEventListener('mouseup', up)
      document.removeEventListener('mouseover', over)
      document.removeEventListener('mouseout', out)
      document.removeEventListener('certificate-modal-open', resetHover)
      document.removeEventListener('cursor-reset', resetHover)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
      cancelAnimationFrame(rafRef.current)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!visible) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[90]" aria-hidden="true">
      <m.div
        ref={dotRef}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: '4px',
          height: '4px',
          borderRadius: '50%',
          backgroundColor: isDark ? '#ffffff' : '#3D5A73',
          boxShadow: isDark ? '0 0 4px rgba(255,255,255,0.6)' : '0 0 4px rgba(61,90,115,0.4)',
          transform: dotTransform,
          willChange: 'transform',
          zIndex: 41,
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
          width: targetW,
          height: targetH,
          transform,
          willChange: 'transform',
          zIndex: 41,
          overflow: 'visible',
          // This element repositions on EVERY frame, so everything it paints is
          // repainted constantly. Deliberately not preserve-3d (its children are
          // coplanar highlights), two gradients rather than three, and three
          // shadows rather than five — the hairline inset and the 1px ring were
          // redundant with the real 2px border.
          background: isDark
            ? [
                'radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.35) 0%, transparent 50%)',
                'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 70%, transparent 100%)',
              ].join(', ')
            : [
                'radial-gradient(ellipse at 30% 20%, rgba(61,90,115,0.3) 0%, transparent 50%)',
                'radial-gradient(circle at 50% 50%, rgba(61,90,115,0.15) 0%, rgba(61,90,115,0.04) 70%, transparent 100%)',
              ].join(', '),
          border: isDark ? '2px solid rgba(255,255,255,0.6)' : '2px solid rgba(61,90,115,0.5)',
          boxShadow: isDark
            ? 'inset 0 2px 8px rgba(255,255,255,0.3), 0 0 20px rgba(0,0,0,0.25), 0 4px 16px rgba(0,0,0,0.15)'
            : 'inset 0 2px 8px rgba(255,255,255,0.8), 0 0 20px rgba(61,90,115,0.1), 0 4px 16px rgba(0,0,0,0.06)',
          // Short paint transitions only. border-radius is deliberately not
          // eased: it now changes at the same instant as the size, and a
          // 550ms radius morph on a card-sized layer is a lot of repainting
          // for something the eye reads as a single snap.
          transition: 'background 0.18s, border 0.18s, box-shadow 0.18s, opacity 0.3s',
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
          background: 'conic-gradient(from 45deg, rgba(61,90,115,0.55), rgba(74,112,96,0.4), rgba(153,107,117,0.55), rgba(58,82,88,0.4), rgba(176,125,98,0.3), rgba(61,90,115,0.55))',
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
          zIndex: 40,
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

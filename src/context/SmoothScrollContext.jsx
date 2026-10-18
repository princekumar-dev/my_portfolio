import { createContext, useContext, useEffect, useRef } from 'react'
import Lenis from 'lenis'
// Lenis toggles root classes (lenis, lenis-smooth, lenis-scrolling); this
// stylesheet is what makes them do anything. Skipping it is the classic
// "Lenis feels no smoother than native scroll" bug.
import 'lenis/dist/lenis.css'

const SmoothScrollContext = createContext(null)

export function SmoothScrollProvider({ children }) {
  const lenisRef = useRef(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const lenis = new Lenis({
      // Velocity-based smoothing (lerp) rather than a fixed-duration glide:
      // the page tracks the wheel from the first tick and settles in ~250ms
      // instead of coasting for a further 1.4s after input stops. The old
      // duration/easing pair is what read as input lag.
      lerp: prefersReduced ? 1 : 0.1,
      smoothWheel: !prefersReduced,
      syncTouch: false,
      anchors: true,
    })

    lenisRef.current = lenis

    // Mark the document as scrolling so decorative animations (shimmer, float,
    // gradient sweeps) pause while the page moves and resume at rest — this
    // removes a full page of gradient repaints from every scroll frame.
    let idleTimer = 0
    const root = document.documentElement
    const onScroll = () => {
      if (!root.classList.contains('is-scrolling')) root.classList.add('is-scrolling')
      window.clearTimeout(idleTimer)
      idleTimer = window.setTimeout(() => {
        // While a theme spread is running it owns this flag (its snapshots
        // need the frozen paints) — ThemeContext releases it when done.
        if (!root.hasAttribute('data-theme-animating')) root.classList.remove('is-scrolling')
      }, 160)
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    let rafId
    function raf(time) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      window.clearTimeout(idleTimer)
      window.removeEventListener('scroll', onScroll)
      root.classList.remove('is-scrolling')
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  return (
    <SmoothScrollContext.Provider value={lenisRef}>
      {children}
    </SmoothScrollContext.Provider>
  )
}

export function useSmoothScroll() {
  return useContext(SmoothScrollContext)
}

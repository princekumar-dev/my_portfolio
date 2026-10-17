import { createContext, useContext, useEffect, useRef } from 'react'
import Lenis from 'lenis'

const SmoothScrollContext = createContext(null)

export function SmoothScrollProvider({ children }) {
  const lenisRef = useRef(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const lenis = new Lenis({
      // Slower, longer glide + quartic ease-out: the page settles like it's
      // riding on rails instead of snapping to a stop.
      duration: prefersReduced ? 0.1 : 1.25,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      smoothWheel: !prefersReduced,
      smoothTouch: false,
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

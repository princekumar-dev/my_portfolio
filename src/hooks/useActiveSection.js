import { useEffect, useState, useRef, useCallback } from 'react'

// Scroll-spy: returns the id of the section closest to viewport center.
// Uses scroll position instead of IntersectionObserver for reliable
// detection with Lenis smooth scroll and lazy-loaded sections.
export function useActiveSection(sectionIds) {
  const [active, setActive] = useState(sectionIds[0] || '')
  const ticking = useRef(false)

  const check = useCallback(() => {
    const scrollY = window.scrollY
    const viewH = window.innerHeight
    const anchor = scrollY + viewH * 0.35

    let bestId = sectionIds[0] || ''
    let bestDist = Infinity

    for (const id of sectionIds) {
      const el = document.getElementById(id)
      if (!el) continue
      const top = el.getBoundingClientRect().top + scrollY
      const dist = Math.abs(anchor - top)
      if (dist < bestDist) {
        bestDist = dist
        bestId = id
      }
    }

    setActive(bestId)
  }, [sectionIds])

  useEffect(() => {
    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true
        requestAnimationFrame(() => {
          check()
          ticking.current = false
        })
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    check()
    return () => window.removeEventListener('scroll', onScroll)
  }, [check])

  return active
}

import { useEffect, useState, useRef, useCallback } from 'react'

// Scroll-spy: returns the id of the section closest to viewport center.
// Caches section offsets and only reads layout on resize, avoiding
// getBoundingClientRect calls on every scroll frame.
export function useActiveSection(sectionIds) {
  const [active, setActive] = useState(sectionIds[0] || '')
  const ticking = useRef(false)
  const offsets = useRef(new Map())

  const measure = useCallback(() => {
    const scrollY = window.scrollY
    const m = new Map()
    for (const id of sectionIds) {
      const el = document.getElementById(id)
      if (el) m.set(id, el.getBoundingClientRect().top + scrollY)
    }
    offsets.current = m
  }, [sectionIds])

  const check = useCallback(() => {
    const scrollY = window.scrollY
    const viewH = window.innerHeight
    const anchor = scrollY + viewH * 0.35
    const m = offsets.current

    let bestId = sectionIds[0] || ''
    let bestDist = Infinity

    for (const id of sectionIds) {
      const top = m.get(id)
      if (top === undefined) continue
      const dist = Math.abs(anchor - top)
      if (dist < bestDist) {
        bestDist = dist
        bestId = id
      }
    }

    setActive(bestId)
  }, [sectionIds])

  useEffect(() => {
    measure()
    const onResize = () => measure()
    window.addEventListener('resize', onResize, { passive: true })

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
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [check, measure])

  return active
}

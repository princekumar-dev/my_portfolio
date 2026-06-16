import { useEffect, useState, useRef } from 'react'

// Scroll-spy: returns the id of the section currently in view.
// Uses IntersectionObserver and picks the most visible matching section.
export function useActiveSection(sectionIds, { rootMargin = '-45% 0px -45% 0px' } = {}) {
  const [active, setActive] = useState(sectionIds[0] || '')
  const timeoutRef = useRef(null)

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean)

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) {
          clearTimeout(timeoutRef.current)
          timeoutRef.current = setTimeout(() => {
            setActive(visible[0].target.id)
          }, 100)
        }
      },
      { rootMargin, threshold: [0.1, 0.5] }
    )

    elements.forEach((el) => observer.observe(el))
    return () => {
      observer.disconnect()
      clearTimeout(timeoutRef.current)
    }
  }, [sectionIds, rootMargin])

  return active
}

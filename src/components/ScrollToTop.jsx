import { useState, useEffect } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { FiArrowUp } from 'react-icons/fi'
import { useSmoothScroll } from '../context/SmoothScrollContext'

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false)
  const lenisRef = useSmoothScroll()

  useEffect(() => {
    let ticking = false
    const toggleVisibility = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsVisible(window.scrollY > 300)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', toggleVisibility, { passive: true })
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    lenisRef?.current?.scrollTo(0)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <m.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          aria-label="Scroll to top"
          title="Scroll to top"
          className="fixed z-40 p-3 rounded-full bg-gradient-to-r from-accent-blue to-accent-cyan text-white shadow-lg shadow-accent-blue/30 hover:shadow-xl hover:shadow-accent-blue/50 transition-[transform] duration-300"
          style={{ bottom: 'max(2rem, env(safe-area-inset-bottom, 2rem))', right: 'max(2rem, env(safe-area-inset-right, 2rem))', contain: 'layout style' }}
        >
          <FiArrowUp size={24} />
        </m.button>
      )}
    </AnimatePresence>
  )
}

export default ScrollToTop
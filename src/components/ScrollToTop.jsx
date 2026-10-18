import { useState, useEffect } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { FiArrowUp } from 'react-icons/fi'
import { useSmoothScroll } from '../context/SmoothScrollContext'

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false)
  /* Fixed in the bottom-right corner, so at some scroll positions this
     clips the top-right of a contact form field. Step aside entirely while
     the visitor is typing — the button exists to move between sections,
     not to compete with a form. */
  const [blocked, setBlocked] = useState(false)
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

  useEffect(() => {
    const isFormField = (el) =>
      !!el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT')
    const onFocusIn = (e) => { if (isFormField(e.target)) setBlocked(true) }
    const onFocusOut = () => setBlocked(false)
    document.addEventListener('focusin', onFocusIn)
    document.addEventListener('focusout', onFocusOut)
    return () => {
      document.removeEventListener('focusin', onFocusIn)
      document.removeEventListener('focusout', onFocusOut)
    }
  }, [])

  const scrollToTop = () => {
    lenisRef?.current?.scrollTo(0)
  }

  return (
    <AnimatePresence>
      {isVisible && !blocked && (
        <m.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          aria-label="Scroll to top"
          title="Scroll to top"
          className="fixed z-40 p-3 rounded-full bg-gradient-to-r from-accent-slate to-accent-sage text-white shadow-lg shadow-accent-slate/30 hover:shadow-xl hover:shadow-accent-slate/50 transition-[transform] duration-300"
          style={{ bottom: 'max(2rem, env(safe-area-inset-bottom, 2rem))', right: 'max(2rem, env(safe-area-inset-right, 2rem))', contain: 'layout style' }}
        >
          <FiArrowUp size={24} />
        </m.button>
      )}
    </AnimatePresence>
  )
}

export default ScrollToTop
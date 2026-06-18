import { useState, useEffect, useRef, useCallback } from 'react'
import { m, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { FiSun, FiMoon } from 'react-icons/fi'
import { useActiveSection } from '../hooks/useActiveSection'
import { useTheme } from '../context/ThemeContext'
import { useSmoothScroll } from '../context/SmoothScrollContext'

const isTouchDevice = () =>
  typeof window !== 'undefined' &&
  ('ontouchstart' in window || navigator.maxTouchPoints > 0)

const navItems = [
  { name: 'Home', href: '#home', id: 'home' },
  { name: 'About', href: '#about', id: 'about' },
  { name: 'Skills', href: '#skills', id: 'skills' },
  { name: 'Projects', href: '#projects', id: 'projects' },
  { name: 'Experience', href: '#experience', id: 'experience' },
  { name: 'Certifications', href: '#certifications', id: 'certifications' },
  { name: 'Contact', href: '#contact', id: 'contact' }
]

const sectionIds = navItems.map((item) => item.id)

function MorphingHamburger({ isOpen }) {
  return (
    <button
      className="md:hidden relative w-6 h-5 flex flex-col justify-between"
      onClick={() => isOpen ? document.dispatchEvent(new CustomEvent('closemenu')) : document.dispatchEvent(new CustomEvent('openmenu'))}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isOpen}
      aria-controls="mobile-menu"
    >
      <m.span
        className="block w-full h-0.5 bg-accent-slate rounded-full origin-left"
        animate={isOpen ? { rotate: 45, y: -1 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      />
      <m.span
        className="block w-full h-0.5 bg-accent-slate rounded-full"
        animate={isOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
      />
      <m.span
        className="block w-full h-0.5 bg-accent-slate rounded-full origin-left"
        animate={isOpen ? { rotate: -45, y: 1 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      />
    </button>
  )
}

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrollDir, setScrollDir] = useState('up')
  const [scrollDepth, setScrollDepth] = useState(0)
  const active = useActiveSection(sectionIds)
  const { isDark, toggleTheme } = useTheme()
  const lenisRef = useSmoothScroll()
  const lastScrollY = useRef(0)
  const menuRef = useRef(null)
  const menuButtonRef = useRef(null)
  const [touchDevice] = useState(isTouchDevice)

  useEffect(() => {
    const menuOpen = () => setIsOpen(true)
    const menuClose = () => setIsOpen(false)
    document.addEventListener('openmenu', menuOpen)
    document.addEventListener('closemenu', menuClose)
    return () => {
      document.removeEventListener('openmenu', menuOpen)
      document.removeEventListener('closemenu', menuClose)
    }
  }, [])

  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentY = window.scrollY
          const nextDir = currentY > lastScrollY.current && currentY > 80 ? 'down' : 'up'
          setScrollDir((prev) => (prev === nextDir ? prev : nextDir))
          const rawDepth = Math.min(currentY / 400, 1)
          const quantized = Math.round(rawDepth * 4) / 4
          setScrollDepth((prev) => (prev === quantized ? prev : quantized))
          lastScrollY.current = currentY
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const handleEsc = (e) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen || !menuRef.current) return
    const menu = menuRef.current
    const focusable = menu.querySelectorAll('a[href], button, [tabindex]:not([tabindex="-1"])')
    if (focusable.length === 0) return
    focusable[0].focus()

    const handleKeyDown = (e) => {
      if (e.key !== 'Tab') return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus() }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    menu.addEventListener('keydown', handleKeyDown)
    return () => menu.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const scrollToSection = useCallback((href) => {
    document.body.style.overflow = ''
    if (lenisRef?.current?.scrollTo) {
      lenisRef.current.scrollTo(href, { offset: -80 })
    } else {
      const el = document.querySelector(href)
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 80
        window.scrollTo({ top: y, behavior: 'smooth' })
      }
    }
  }, [lenisRef])

  const isScrolled = scrollDepth > 0.05
  const bgOpacity = isScrolled ? (0.4 + scrollDepth * 0.35) : 0

  return (
    <m.nav
      aria-label="Main navigation"
      initial={{ y: -100 }}
      animate={{
        y: scrollDir === 'down' && scrollDepth > 0.1 ? -100 : 0,
      }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="fixed w-full z-50 transition-[border-color] duration-500"
      style={{
        contain: 'layout style',
        backdropFilter: !touchDevice && isScrolled ? 'blur(16px) saturate(180%)' : 'none',
        WebkitBackdropFilter: !touchDevice && isScrolled ? 'blur(16px) saturate(180%)' : 'none',
        background: isScrolled
          ? isDark
            ? `rgba(15, 23, 42, ${touchDevice ? Math.min(bgOpacity + 0.15, 0.92) : bgOpacity})`
            : `rgba(255, 255, 255, ${touchDevice ? Math.min(bgOpacity + 0.15, 0.92) : bgOpacity})`
          : 'transparent',
        borderBottom: isScrolled
          ? `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`
          : '1px solid transparent',
        boxShadow: scrollDepth > 0.1
          ? `0 4px 30px -4px ${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.06)'}`
          : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <m.a
            href="#home"
            whileHover={{ scale: 1.05 }}
            className="text-2xl font-bold text-light-900"
            onClick={(e) => { e.preventDefault(); scrollToSection('#home') }}
          >
            Prince.dev
          </m.a>

          <div className="hidden md:flex gap-1">
            {navItems.map((item) => {
              const isActive = active === item.id
              return (
                <a
                  key={item.name}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className="relative px-3 py-1.5 text-sm font-medium transition-colors duration-300 rounded-full"
                  onClick={(e) => { e.preventDefault(); scrollToSection(item.href) }}
                >
                  {isActive && (
                    <m.span
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-accent-slate/10 border border-accent-slate/20 rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className={`relative z-10 ${isActive ? 'text-accent-slate' : 'text-light-600 hover:text-accent-slate'}`}>
                    {item.name}
                  </span>
                </a>
              )
            })}
          </div>

          <div className="flex items-center gap-3">
            <m.button
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 rounded-full text-light-600 hover:text-accent-slate hover:bg-accent-slate/10 transition-colors duration-200"
            >
              <m.span
                key={isDark ? 'sun' : 'moon'}
                initial={{ rotate: -90, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                exit={{ rotate: 90, scale: 0 }}
                transition={{ duration: 0.3 }}
                className="block"
              >
                {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
              </m.span>
            </m.button>

            <MorphingHamburger isOpen={isOpen} />
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <m.div
              ref={menuRef}
              id="mobile-menu"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden overflow-hidden rounded-b-xl mb-2"
              style={{
                background: isDark
                  ? 'rgba(15, 23, 42, 0.95)'
                  : 'rgba(255, 255, 255, 0.95)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              }}
            >
                <div className="py-2 space-y-1">
                {navItems.map((item, i) => (
                  <m.a
                    key={item.name}
                    href={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`relative block px-4 py-2.5 transition-colors duration-200 ${
                      active === item.id
                        ? 'text-accent-slate font-semibold'
                        : 'text-light-600 hover:text-accent-slate hover:bg-accent-slate/5'
                    }`}
                    onClick={(e) => { e.preventDefault(); setIsOpen(false); scrollToSection(item.href) }}
                  >
                    {active === item.id && (
                      <m.span
                        layoutId="nav-pill-mobile"
                        className="absolute inset-0 bg-accent-slate/5 border border-accent-slate/20 rounded-lg"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{item.name}</span>
                  </m.a>
                ))}
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </m.nav>
  )
}

export default Navigation

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { FiSun, FiMoon } from 'react-icons/fi'
import { useActiveSection } from '../hooks/useActiveSection'
import { useTheme } from '../context/ThemeContext'

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
      <motion.span
        className="block w-full h-0.5 bg-accent-blue rounded-full origin-left"
        animate={isOpen ? { rotate: 45, y: -1 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.span
        className="block w-full h-0.5 bg-accent-blue rounded-full"
        animate={isOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
      />
      <motion.span
        className="block w-full h-0.5 bg-accent-blue rounded-full origin-left"
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
  const lastScrollY = useRef(0)

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
          setScrollDir(currentY > lastScrollY.current && currentY > 80 ? 'down' : 'up')
          setScrollDepth(Math.min(currentY / 400, 1))
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

  const blurAmount = 8 + scrollDepth * 16
  const bgOpacity = 0.4 + scrollDepth * 0.35

  return (
    <motion.nav
      aria-label="Main navigation"
      initial={{ y: -100 }}
      animate={{
        y: scrollDir === 'down' && scrollDepth > 0.1 ? -100 : 0,
      }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="fixed w-full z-50 transition-[border-color] duration-500"
      style={{
        backdropFilter: scrollDepth > 0.05 ? `blur(${blurAmount}px) saturate(180%)` : 'none',
        WebkitBackdropFilter: scrollDepth > 0.05 ? `blur(${blurAmount}px) saturate(180%)` : 'none',
        background: scrollDepth > 0.05
          ? isDark
            ? `rgba(15, 23, 42, ${bgOpacity})`
            : `rgba(255, 255, 255, ${bgOpacity})`
          : 'transparent',
        borderBottom: scrollDepth > 0.05
          ? `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`
          : '1px solid transparent',
        boxShadow: scrollDepth > 0.1
          ? `0 4px 30px -4px ${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.06)'}`
          : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.a
            href="#home"
            whileHover={{ scale: 1.05 }}
            className="text-2xl font-bold bg-gradient-to-r from-accent-blue to-accent-cyan bg-clip-text text-transparent"
          >
            Prince.dev
          </motion.a>

          <div className="hidden md:flex gap-1">
            {navItems.map((item) => {
              const isActive = active === item.id
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className="relative px-3 py-1.5 text-sm font-medium transition-colors duration-300 rounded-full"
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-accent-blue/10 border border-accent-blue/20 rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className={`relative z-10 ${isActive ? 'text-accent-blue' : 'text-light-600 hover:text-accent-blue'}`}>
                    {item.name}
                  </span>
                </a>
              )
            })}
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 rounded-full text-light-600 hover:text-accent-blue hover:bg-accent-blue/10 transition-colors duration-200"
            >
              <motion.span
                key={isDark ? 'sun' : 'moon'}
                initial={{ rotate: -90, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                exit={{ rotate: 90, scale: 0 }}
                transition={{ duration: 0.3 }}
                className="block"
              >
                {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
              </motion.span>
            </motion.button>

            <MorphingHamburger isOpen={isOpen} />
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
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
                  <motion.a
                    key={item.name}
                    href={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`block px-4 py-2.5 transition-colors duration-200 ${
                      active === item.id
                        ? 'text-accent-blue font-semibold bg-accent-blue/5'
                        : 'text-light-600 hover:text-accent-blue hover:bg-accent-blue/5'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}

export default Navigation

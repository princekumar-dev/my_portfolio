import { Component, Suspense, lazy, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Navigation from './components/Navigation'
import AnimatedBackground from './components/AnimatedBackground'
import ScrollProgressBar from './components/ScrollProgressBar'
import Cursor from './components/Cursor'
import Hero from './components/Hero'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'

const About = lazy(() => import('./components/About'))
const Skills = lazy(() => import('./components/Skills'))
const Projects = lazy(() => import('./components/Projects'))
const Experience = lazy(() => import('./components/Experience'))
const Certifications = lazy(() => import('./components/Certifications'))
const Contact = lazy(() => import('./components/Contact'))

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-light">
          <div className="text-center px-4">
            <h1 className="text-4xl font-bold text-light-800 mb-4">Something went wrong</h1>
            <p className="text-light-600 mb-6">An unexpected error occurred. Please refresh the page.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-accent-blue to-accent-cyan text-white rounded-full font-semibold"
            >
              Reload Page
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

function WaveDivider({ flip = false, color = 'rgba(59,130,246,0.06)' }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-20px' })

  return (
    <div ref={ref} className="wave-divider relative" aria-hidden="true" style={{ transform: flip ? 'scaleY(-1)' : 'none' }}>
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
        <motion.path
          d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z"
          fill={color}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
    </div>
  )
}

function SectionReveal({ children }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      initial={{ clipPath: 'inset(8% 0 8% 0)' }}
      animate={isInView ? { clipPath: 'inset(0% 0 0% 0)' } : { clipPath: 'inset(8% 0 8% 0)' }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      <main id="main-content" className="relative bg-gradient-light min-h-screen text-light-800">
        <Cursor />
        <AnimatedBackground />
        <ScrollProgressBar />
        <Navigation />
        <Hero />
        <Suspense fallback={null}>
          <WaveDivider />
          <SectionReveal>
            <About />
          </SectionReveal>
          <WaveDivider flip color="rgba(6,182,212,0.05)" />
          <SectionReveal>
            <Skills />
          </SectionReveal>
          <WaveDivider color="rgba(139,92,246,0.05)" />
          <SectionReveal>
            <Projects />
          </SectionReveal>
          <WaveDivider flip color="rgba(59,130,246,0.04)" />
          <SectionReveal>
            <Experience />
          </SectionReveal>
          <WaveDivider color="rgba(6,182,212,0.04)" />
          <SectionReveal>
            <Certifications />
          </SectionReveal>
          <WaveDivider flip color="rgba(139,92,246,0.04)" />
          <SectionReveal>
            <Contact />
          </SectionReveal>
        </Suspense>
        <Footer />
        <ScrollToTop />
      </main>
    </ErrorBoundary>
  )
}

export default App

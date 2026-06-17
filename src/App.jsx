import { Component, Suspense, lazy, useRef } from 'react'
import { LazyMotion, domAnimation, m, useInView } from 'framer-motion'
import Navigation from './components/Navigation'
import AnimatedBackground from './components/AnimatedBackground'
import ScrollProgressBar from './components/ScrollProgressBar'
import { PointerProvider } from './context/PointerContext'
import { ScrollProvider } from './context/ScrollContext'
import { SmoothScrollProvider } from './context/SmoothScrollContext'
import { TiltProvider } from './context/TiltContext'
import Cursor from './components/Cursor'
import Hero from './components/Hero'
import ScrollToTop from './components/ScrollToTop'

const About = lazy(() => import('./components/About'))
const Skills = lazy(() => import('./components/Skills'))
const Projects = lazy(() => import('./components/Projects'))
const Experience = lazy(() => import('./components/Experience'))
const Certifications = lazy(() => import('./components/Certifications'))
const Contact = lazy(() => import('./components/Contact'))
const Footer = lazy(() => import('./components/Footer'))

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
      <m.svg
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <path
          d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z"
          fill={color}
        />
      </m.svg>
    </div>
  )
}

function SectionReveal({ children }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-20px' })

  return (
    <m.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </m.div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <LazyMotion features={domAnimation} strict>
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      <main id="main-content" className="relative bg-gradient-light min-h-screen text-light-800">
        <PointerProvider>
        <SmoothScrollProvider>
        <ScrollProvider>
        <TiltProvider>
        <Cursor />
        <AnimatedBackground />
        <ScrollProgressBar />
        <Navigation />
        <Hero />
        <Suspense fallback={<div className="min-h-[300px] w-full" />}>
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
        </TiltProvider>
        </ScrollProvider>
        </SmoothScrollProvider>
        </PointerProvider>
      </main>
      </LazyMotion>
    </ErrorBoundary>
  )
}

export default App

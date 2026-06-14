import { Component, Suspense, lazy } from 'react'
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

function SectionDivider() {
  return (
    <div className="relative h-px max-w-4xl mx-auto" aria-hidden="true">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-blue/20 to-transparent" />
    </div>
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
          <SectionDivider />
          <About />
          <SectionDivider />
          <Skills />
          <SectionDivider />
          <Projects />
          <SectionDivider />
          <Experience />
          <SectionDivider />
          <Certifications />
          <SectionDivider />
          <Contact />
        </Suspense>
        <Footer />
        <ScrollToTop />
      </main>
    </ErrorBoundary>
  )
}

export default App

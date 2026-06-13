import { useEffect } from 'react'
import Navigation from './components/Navigation'
import AnimatedBackground from './components/AnimatedBackground'
import ScrollProgressBar from './components/ScrollProgressBar'
import Cursor from './components/Cursor'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Experience from './components/Experience'
import Certifications from './components/Certifications'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'

function App() {
  return (
    <div className="relative bg-gradient-light min-h-screen text-light-800">
      <Cursor />
      <AnimatedBackground />
      <ScrollProgressBar />
      <Navigation />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Certifications />
      <Contact />
      <Footer />
      <ScrollToTop />
    </div>
  )
}

export default App
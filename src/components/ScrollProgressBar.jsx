import { m } from 'framer-motion'
import { useSharedScroll } from '../context/ScrollContext'

// Thin gradient bar at the top of the viewport that fills as the page scrolls.
const ScrollProgressBar = () => {
  const { scrollYProgress } = useSharedScroll()

  return (
    <m.div
      style={{ scaleX: scrollYProgress, willChange: 'transform', contain: 'layout style' }}
      className="fixed top-0 left-0 right-0 z-[60] h-1 origin-left bg-gradient-to-r from-accent-blue via-accent-purple to-accent-cyan"
    />
  )
}

export default ScrollProgressBar

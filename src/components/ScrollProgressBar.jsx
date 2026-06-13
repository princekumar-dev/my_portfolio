import { motion, useScroll, useSpring } from 'framer-motion'

// Thin gradient bar at the top of the viewport that fills as the page scrolls.
const ScrollProgressBar = () => {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 35,
    restDelta: 0.001,
  })

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 z-[60] h-1 origin-left bg-gradient-to-r from-accent-blue via-accent-purple to-accent-cyan"
    />
  )
}

export default ScrollProgressBar

import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useRef } from 'react'
import { FiArrowDown } from 'react-icons/fi'

const Hero = () => {
  const sectionRef = useRef(null)

  // Scroll-linked parallax scoped to the hero section.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 24 })

  const blobsY = useTransform(smooth, [0, 1], [0, 220])
  const midY = useTransform(smooth, [0, 1], [0, 120])
  const gridY = useTransform(smooth, [0, 1], [0, 80])
  const contentY = useTransform(smooth, [0, 1], [0, -60])
  const contentOpacity = useTransform(smooth, [0, 0.8], [1, 0])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  }

  const wordVariants = {
    hidden: { opacity: 0, y: 40, rotateX: -40 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  }

  const name = 'Prince R'.split(' ')

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Parallax depth layers (moncy.dev style) */}
      <motion.div
        style={{ y: gridY }}
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.4]"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(59,130,246,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(59,130,246,0.06) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </motion.div>

      <motion.div style={{ y: blobsY }} className="absolute inset-0 z-0">
        <div className="absolute top-16 left-10 w-72 h-72 bg-accent-blue/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-24 right-10 w-72 h-72 bg-accent-cyan/20 rounded-full blur-3xl"></div>
      </motion.div>

      <motion.div style={{ y: midY }} className="absolute inset-0 z-0">
        <div className="absolute top-1/3 right-1/4 w-56 h-56 bg-accent-purple/15 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/4 w-44 h-44 bg-accent-indigo/15 rounded-full blur-3xl"></div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 text-center px-4 max-w-4xl"
      >
        <motion.div variants={itemVariants} className="mb-6">
          <span className="eyebrow text-accent-blue">Welcome to my portfolio</span>
        </motion.div>

        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-light-900"
          style={{ perspective: 800 }}
        >
          <span className="bg-gradient-to-r from-accent-blue via-accent-purple to-accent-cyan bg-clip-text text-transparent">
            {name.map((word, i) => (
              <motion.span
                key={i}
                variants={wordVariants}
                className="inline-block mr-3"
              >
                {word}
              </motion.span>
            ))}
          </span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-xl md:text-2xl text-light-700 mb-8 font-light"
        >
          AI & Data Science Engineer
        </motion.p>

        <motion.p
          variants={itemVariants}
          className="text-light-600 text-lg mb-12 max-w-2xl mx-auto"
        >
          Building intelligent systems that transform data into meaningful experiences.
          Passionate about creating seamless user experiences and scalable solutions.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.a
            href="#projects"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-gradient-to-r from-accent-blue to-accent-cyan text-white rounded-full font-semibold shadow-lg shadow-accent-blue/20 hover:shadow-xl hover:shadow-accent-blue/40 transition-all"
          >
            View My Work
          </motion.a>
          <motion.a
            href="https://drive.google.com/file/d/15iuECh0MvqrQLKrAnKAN0q7IWkSN_PnL/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 glass-card glass-edge rounded-full font-semibold text-accent-blue hover:text-accent-blue transition-all"
          >
            Download Resume
          </motion.a>
        </motion.div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10"
      >
        <FiArrowDown className="text-accent-blue text-2xl" />
      </motion.div>
    </section>
  )
}

export default Hero
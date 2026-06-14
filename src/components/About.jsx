import { motion, useInView } from 'framer-motion'
import { useSectionParallax } from '../hooks/useSectionParallax'
import { useRef, useEffect, useState } from 'react'

const AnimatedCounter = ({ target, suffix = '+', duration = 2 }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return
    const end = parseInt(target)
    const step = Math.max(1, Math.floor(end / 60))
    const incrementTime = (duration * 1000) / (end / step)

    const timer = setInterval(() => {
      setCount((prev) => {
        const next = prev + step
        if (next >= end) {
          clearInterval(timer)
          return end
        }
        return next
      })
    }, incrementTime)

    return () => clearInterval(timer)
  }, [isInView, target, duration])

  return <span ref={ref} className="counter-value">{count}{suffix}</span>
}

const LineReveal = ({ children, delay = 0 }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <div ref={ref} className="overflow-hidden">
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={isInView ? { y: 0, opacity: 1 } : { y: '100%', opacity: 0 }}
        transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  )
}

const stats = [
  { target: 5, suffix: '+', label: 'Projects Completed', color: 'from-accent-blue to-accent-cyan' },
  { target: 15, suffix: '+', label: 'Technologies', color: 'from-accent-cyan to-accent-purple' },
  { target: 3, suffix: '+', label: 'Years Experience', color: 'from-accent-purple to-accent-pink' },
  { target: 5, suffix: '+', label: 'Certifications', color: 'from-accent-pink to-accent-blue' },
]

const About = () => {
  const { ref, slow, fast, opacity } = useSectionParallax({ slowDistance: 60, fastDistance: 100, preset: 'soft', opacityFade: true })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -40, scale: 0.97 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  }

  return (
    <motion.section ref={ref} id="about" className="relative py-16 sm:py-24 px-4 overflow-hidden" style={{ opacity, contain: 'layout style' }}>
      <motion.div
        style={{ y: fast }}
        className="absolute -top-40 -right-40 w-80 h-80 bg-accent-blue/10 rounded-full blur-2xl"
      ></motion.div>
      <motion.div
        style={{ y: slow }}
        className="absolute top-40 -left-32 w-64 h-64 bg-accent-cyan/10 rounded-full blur-2xl"
      ></motion.div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <span className="eyebrow text-accent-blue">Who I am</span>
            <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold">
              <span className="animated-gradient-text">
                About Me
              </span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div variants={itemVariants} className="glass-card glass-edge rounded-2xl p-6 sm:p-8 space-y-4">
              <LineReveal delay={0}>
                <p className="text-light-600 text-lg leading-relaxed">
                  I'm an AI & Data Science engineer with a strong foundation in modern web and machine learning
                  technologies. With experience in building scalable applications and solving complex problems,
                  I'm dedicated to creating solutions that make a real impact.
                </p>
              </LineReveal>
              <LineReveal delay={0.1}>
                <p className="text-light-600 text-lg leading-relaxed">
                  My journey in tech has been driven by curiosity and a desire to continuously learn and grow.
                  I thrive in collaborative environments and love turning ideas into reality through clean,
                  efficient code.
                </p>
              </LineReveal>
              <LineReveal delay={0.2}>
                <p className="text-light-600 text-lg leading-relaxed">
                  When I'm not coding, you can find me exploring new technologies, contributing to open-source
                  projects, or sharing knowledge with the developer community.
                </p>
              </LineReveal>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 gap-3 sm:gap-4"
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="glass-card glass-edge animated-border rounded-2xl p-6 text-center group"
                >
                  <div className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                    <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                  </div>
                  <p className="text-light-600 text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}

export default About

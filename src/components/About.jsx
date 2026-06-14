import { motion, useMotionValue, useTransform, useInView } from 'framer-motion'
import { useSectionParallax } from '../hooks/useSectionParallax'
import { useRef, useEffect, useState } from 'react'

const AnimatedCounter = ({ target, duration = 2 }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return
    let start = 0
    const end = parseInt(target)
    const incrementTime = (duration * 1000) / end
    const step = Math.max(1, Math.floor(end / 60))

    const timer = setInterval(() => {
      start += step
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(start)
      }
    }, incrementTime * step)

    return () => clearInterval(timer)
  }, [isInView, target, duration])

  return <span ref={ref}>{count}+</span>
}

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
    <motion.section ref={ref} id="about" className="relative py-24 px-4 overflow-hidden" style={{ opacity }}>
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
            <h2 className="mt-3 text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">
                About Me
              </span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div variants={itemVariants} className="glass-card glass-edge rounded-2xl p-8 space-y-6">
              <p className="text-light-600 text-lg leading-relaxed">
                I'm an AI & Data Science engineer with a strong foundation in modern web and machine learning
                technologies. With experience in building scalable applications and solving complex problems,
                I'm dedicated to creating solutions that make a real impact.
              </p>
              <p className="text-light-600 text-lg leading-relaxed">
                My journey in tech has been driven by curiosity and a desire to continuously learn and grow.
                I thrive in collaborative environments and love turning ideas into reality through clean,
                efficient code.
              </p>
              <p className="text-light-600 text-lg leading-relaxed">
                When I'm not coding, you can find me exploring new technologies, contributing to open-source
                projects, or sharing knowledge with the developer community.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              style={{ y: slow }}
              className="relative"
            >
              <div className="relative w-full aspect-square rounded-3xl overflow-hidden glass-card glass-edge group">
                <div className="absolute inset-0 bg-gradient-to-br from-accent-blue to-accent-cyan opacity-10"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center float-slow">
                    <div className="text-7xl font-bold bg-gradient-to-r from-accent-blue to-accent-cyan bg-clip-text text-transparent mb-3">
                      <AnimatedCounter target={5} />
                    </div>
                    <p className="text-light-600 text-lg">Projects Completed</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}

export default About

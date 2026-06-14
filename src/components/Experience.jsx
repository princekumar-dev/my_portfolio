import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { experienceData } from '../data/experienceData'
import { useSectionParallax } from '../hooks/useSectionParallax'

const TimelineConnector = ({ isLast }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  if (isLast) return null

  return (
    <div ref={ref} className="absolute left-1.5 top-4 w-0.5 h-24 overflow-hidden" style={{ transformOrigin: 'top' }}>
      <motion.div
        initial={{ scaleY: 0 }}
        animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        className="w-full h-full bg-gradient-to-b from-accent-blue to-transparent"
      />
    </div>
  )
}

const Experience = () => {
  const { ref, fast, opacity } = useSectionParallax({ fastDistance: 100, preset: 'default', opacityFade: true })
  const [touchDevice, setTouchDevice] = useState(false)

  useEffect(() => {
    setTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: touchDevice ? 0.08 : 0.15,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = touchDevice ? {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
  } : {
    hidden: { opacity: 0, x: -40, scale: 0.97 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  }

  const ExperienceCard = ({ exp, index }) => (
    <motion.div
      variants={itemVariants}
      className="relative pl-8 pb-12"
    >
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: index * 0.1 }}
        className="absolute left-0 top-0 w-4 h-4 rounded-full bg-accent-blue border-4 border-white shadow-md glow-pulse"
      />
      <TimelineConnector isLast={index === experienceData.length - 1} />

      <motion.div
        whileHover={{ x: 10, boxShadow: '0 8px 30px -8px rgba(59,130,246,0.15)' }}
        transition={{ duration: 0.2 }}
        className="glass-card glass-edge rounded-xl p-6 cursor-default"
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-accent-blue">{exp.position}</h3>
          <span className="text-sm text-light-500">{exp.duration}</span>
        </div>
        <p className="text-light-500 mb-4">{exp.company}</p>
        <p className="text-light-600 mb-4">{exp.description}</p>
        <ul className="space-y-2">
          {exp.achievements.map((achievement, idx) => (
            <motion.li
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * idx }}
              className="text-light-600 text-sm flex items-start"
            >
              <span className="text-accent-purple mr-3">▸</span>
              {achievement}
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  )

  return (
    <motion.section ref={ref} id="experience" className="relative py-20 px-4 overflow-hidden" style={{ opacity }}>
      <motion.div
        style={{ y: fast }}
        className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-purple/10 rounded-full blur-2xl"
      ></motion.div>

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold mb-16 text-center"
        >
          <span className="animated-gradient-text">
            Experience
          </span>
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {experienceData.map((exp, index) => (
            <ExperienceCard key={exp.id} exp={exp} index={index} />
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}

export default Experience

import { motion } from 'framer-motion'
import { experienceData } from '../data/experienceData'
import { useSectionParallax } from '../hooks/useSectionParallax'

const Experience = () => {
  const { ref, fast } = useSectionParallax({ fastDistance: 100 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8 },
    },
  }

  const ExperienceCard = ({ exp, index }) => (
    <motion.div
      variants={itemVariants}
      className="relative pl-8 pb-12"
    >
      <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-accent-blue border-4 border-white shadow-md glow-pulse"></div>
      {index !== experienceData.length - 1 && (
        <div className="absolute left-1.5 top-4 w-0.5 h-24 bg-gradient-to-b from-accent-blue to-transparent"></div>
      )}

      <motion.div
        whileHover={{ x: 10 }}
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
            <li key={idx} className="text-light-600 text-sm flex items-start">
              <span className="text-accent-purple mr-3">▸</span>
              {achievement}
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  )

  return (
    <section ref={ref} id="experience" className="relative py-20 px-4 overflow-hidden">
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
          <span className="bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">
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
    </section>
  )
}

export default Experience
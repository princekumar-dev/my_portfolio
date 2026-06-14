import { motion } from 'framer-motion'
import { certificationsData } from '../data/certificationsData'
import { useSectionParallax } from '../hooks/useSectionParallax'
import TiltCard from './TiltCard'

const Certifications = () => {
  const { ref, fast, opacity } = useSectionParallax({ fastDistance: 100, opacityFade: true })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.85 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  }

  const CertCard = ({ cert }) => (
    <motion.div variants={itemVariants}>
      <TiltCard className="group glass-card glass-edge h-full rounded-2xl overflow-hidden">
        <div className="relative h-32 sm:h-40 bg-gradient-to-br from-accent-blue/15 to-accent-cyan/15 overflow-hidden flex items-center justify-center">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-accent-blue to-accent-cyan opacity-0 group-hover:opacity-15 transition-opacity duration-300"
          />
          <div className="text-center relative z-10">
            <div className="text-4xl mb-2 float-medium">🏆</div>
            <p className="text-sm text-light-600 font-semibold">{cert.date}</p>
          </div>
        </div>
        <div className="p-4 sm:p-5">
          <h3 className="text-lg font-bold text-accent-blue mb-2">{cert.title}</h3>
          <p className="text-light-500 text-sm">{cert.issuer}</p>
        </div>
      </TiltCard>
    </motion.div>
  )

  return (
    <section ref={ref} id="certifications" className="relative py-16 sm:py-24 px-4 overflow-hidden" style={{ opacity, contain: 'layout style' }}>
      <motion.div
        style={{ y: fast }}
        className="absolute -top-40 -right-40 w-80 h-80 bg-accent-blue/10 rounded-full blur-2xl"
      ></motion.div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="eyebrow text-accent-blue">Recognitions</span>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold">
            <span className="animated-gradient-text">
              Certifications
            </span>
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {certificationsData.map((cert) => (
            <CertCard key={cert.id} cert={cert} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Certifications
import { motion } from 'framer-motion'
import { skillsData } from '../data/skillsData'
import { useSectionParallax } from '../hooks/useSectionParallax'
import TiltCard from './TiltCard'

// Icons whose brand color is white/near-white and would be invisible on a
// light theme. Render these on a dark chip so they stay visible.
const DARK_LOGO = new Set(['Next.js', 'Express.js', 'GitHub'])

const floatClasses = ['float-slow', 'float-medium', 'float-fast']

const levelStyles = {
  Expert: 'bg-accent-blue/10 text-accent-blue border-accent-blue/30',
  Intermediate: 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/30',
  Beginner: 'bg-accent-purple/10 text-accent-purple border-accent-purple/30',
}

const Skills = () => {
  const { ref, slow, fast } = useSectionParallax({ slowDistance: 50, fastDistance: 110 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  }

  const SkillCard = ({ skill, index }) => {
    const Icon = skill.icon
    const isDarkLogo = DARK_LOGO.has(skill.name)
    const float = floatClasses[index % floatClasses.length]

    return (
      <motion.div variants={itemVariants}>
        <TiltCard
          maxTilt={14}
          className="group glass-card glass-edge h-full flex flex-col items-center p-6 rounded-2xl text-center"
        >
          {/* Floating translucent icon block with a color-matched aura */}
          <div className={`relative mb-5 ${float}`}>
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-2xl blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-300"
              style={{ backgroundColor: skill.color }}
            />
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className={`relative flex h-16 w-16 items-center justify-center rounded-2xl border shadow-inner backdrop-blur-md ${
                isDarkLogo
                  ? 'bg-light-800/90 border-white/10'
                  : 'bg-white/60 border-white/70'
              }`}
            >
              <Icon size={34} style={{ color: skill.color }} />
            </motion.div>
          </div>

          <h3 className="text-light-800 font-accent font-semibold">{skill.name}</h3>
          {skill.level && (
            <span
              className={`mt-3 inline-block rounded-full border px-3 py-0.5 text-[0.7rem] font-medium ${
                levelStyles[skill.level] || levelStyles.Intermediate
              }`}
            >
              {skill.level}
            </span>
          )}
        </TiltCard>
      </motion.div>
    )
  }

  return (
    <section ref={ref} id="skills" className="relative py-24 px-4 overflow-hidden">
      <motion.div
        style={{ y: fast }}
        className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-purple/10 rounded-full blur-3xl"
      ></motion.div>
      <motion.div
        style={{ y: slow }}
        className="absolute top-10 right-0 w-64 h-64 bg-accent-blue/10 rounded-full blur-3xl"
      ></motion.div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="eyebrow text-accent-blue">What I work with</span>
          <h2 className="mt-3 text-4xl md:text-5xl font-bold">
            <span className="bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">
              Skills &amp; Technologies
            </span>
          </h2>
        </motion.div>

        <div className="space-y-14">
          {Object.entries(skillsData).map(([category, skills]) => (
            <motion.div
              key={category}
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
            >
              <div className="flex items-center gap-4 mb-8">
                <h3 className="text-xl md:text-2xl font-bold text-light-800 capitalize">
                  {category.replace(/([A-Z])/g, ' $1').trim()}
                </h3>
                <span className="h-px flex-1 bg-gradient-to-r from-accent-blue/40 to-transparent" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {skills.map((skill, index) => (
                  <SkillCard key={skill.name} skill={skill} index={index} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Skills
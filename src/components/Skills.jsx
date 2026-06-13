import { motion } from 'framer-motion'
import { skillsData } from '../data/skillsData'
import { useSectionParallax } from '../hooks/useSectionParallax'

const DARK_LOGO = new Set(['Next.js', 'Express.js', 'GitHub'])
const DARK_LOGO_GLOW = { 'Next.js': '#000000', 'Express.js': '#666666', 'GitHub': '#24292e' }

const levelStyles = {
  Expert: 'bg-accent-blue/10 text-accent-blue border-accent-blue/30',
  Intermediate: 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/30',
  Beginner: 'bg-accent-purple/10 text-accent-purple border-accent-purple/30',
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95, rotateX: 8 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}

const Skills = () => {
  const { ref, slow, fast, opacity } = useSectionParallax({ slowDistance: 50, fastDistance: 110, preset: 'snappy', opacityFade: true })

  const allSkills = Object.entries(skillsData).map(([category, skills]) => ({
    category,
    skills,
  }))

  return (
    <motion.section ref={ref} id="skills" className="relative py-24 px-4 overflow-hidden" style={{ opacity }}>
      <motion.div
        style={{ y: fast }}
        className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-purple/10 rounded-full blur-2xl"
      />
      <motion.div
        style={{ y: slow }}
        className="absolute top-10 right-0 w-64 h-64 bg-accent-blue/10 rounded-full blur-2xl"
      />

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

        {allSkills.map(({ category, skills }) => (
          <div key={category} className="mb-14">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-4 mb-8"
            >
              <h3 className="text-xl md:text-2xl font-bold text-light-800 capitalize">
                {category.replace(/([A-Z])/g, ' $1').trim()}
              </h3>
              <span className="h-px flex-1 bg-gradient-to-r from-accent-blue/40 to-transparent" />
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {skills.map((skill) => {
                const Icon = skill.icon
                const isDarkLogo = DARK_LOGO.has(skill.name)

                return (
                  <motion.div
                    key={skill.name}
                    variants={itemVariants}
                    className="glass-card glass-edge group rounded-2xl p-6 text-center cursor-default"
                  >
                    <div className="relative mb-5 inline-block">
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 rounded-2xl blur-xl opacity-30 group-hover:opacity-60 transition-opacity duration-300"
                        style={{ backgroundColor: isDarkLogo ? DARK_LOGO_GLOW[skill.name] : skill.color }}
                      />
                      <div
                        className={`relative flex h-14 w-14 items-center justify-center rounded-2xl ${
                          isDarkLogo ? 'tag-glass-dark' : 'tag-glass'
                        }`}
                      >
                        <Icon size={30} style={{ color: skill.color }} />
                      </div>
                    </div>

                    <h3 className="text-light-800 font-accent font-semibold text-sm">{skill.name}</h3>
                    {skill.level && (
                      <span
                        className={`mt-2 inline-block rounded-full border px-2.5 py-0.5 text-[0.65rem] font-medium ${
                          levelStyles[skill.level] || levelStyles.Intermediate
                        }`}
                      >
                        {skill.level}
                      </span>
                    )}
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        ))}
      </div>
    </motion.section>
  )
}

export default Skills

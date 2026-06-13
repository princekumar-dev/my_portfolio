import { motion } from 'framer-motion'
import { FiMail, FiLinkedin, FiGithub } from 'react-icons/fi'
import { useSectionParallax } from '../hooks/useSectionParallax'
import TiltCard from './TiltCard'

const Contact = () => {
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  }

  const contactLinks = [
    {
      icon: FiMail,
      label: 'Email',
      value: 'prince55833kuma@gmail.com',
      href: 'mailto:prince55833kuma@gmail.com',
      color: 'text-accent-blue'
    },
    {
      icon: FiLinkedin,
      label: 'LinkedIn',
      value: 'Prince R',
      href: 'https://www.linkedin.com/in/prince-r-b9685130b',
      color: 'text-accent-purple'
    },
    {
      icon: FiGithub,
      label: 'GitHub',
      value: 'princekumar-dev',
      href: 'https://github.com/princekumar-dev',
      color: 'text-accent-cyan'
    }
  ]

  return (
    <section ref={ref} id="contact" className="relative py-24 px-4 overflow-hidden">
      <motion.div
        style={{ y: fast }}
        className="absolute -bottom-40 -right-40 w-80 h-80 bg-accent-purple/10 rounded-full blur-2xl"
      ></motion.div>

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants} className="text-center">
            <span className="eyebrow text-accent-blue">Let's talk</span>
            <h2 className="mt-3 text-4xl md:text-5xl font-bold mb-8">
              <span className="bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">
                Get In Touch
              </span>
            </h2>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-light-600 text-lg text-center mb-16 max-w-2xl mx-auto"
          >
            I'm always interested in hearing about new projects and opportunities.
            Feel free to reach out through any of the channels below!
          </motion.p>

          <motion.div
            variants={containerVariants}
            className="grid md:grid-cols-3 gap-8"
          >
            {contactLinks.map((link) => {
              const Icon = link.icon
              return (
                <motion.div key={link.label} variants={itemVariants}>
                  <TiltCard maxTilt={12} className="group glass-card glass-edge h-full rounded-2xl">
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center p-8"
                    >
                      <div className="relative mb-4 float-medium">
                        <span
                          aria-hidden="true"
                          className="absolute inset-0 rounded-2xl blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-300 bg-accent-blue"
                        />
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.8, ease: 'easeInOut' }}
                          className={`relative flex h-16 w-16 items-center justify-center rounded-2xl tag-glass ${link.color}`}
                        >
                          <Icon size={32} />
                        </motion.div>
                      </div>
                      <h3 className="text-xl font-bold text-accent-blue mb-2">{link.label}</h3>
                      <p className="text-light-600 text-center text-sm">{link.value}</p>
                    </a>
                  </TiltCard>
                </motion.div>
              )
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default Contact
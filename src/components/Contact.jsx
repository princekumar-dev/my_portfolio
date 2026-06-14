import { motion } from 'framer-motion'
import { FiMail, FiLinkedin, FiGithub, FiSend, FiCheck } from 'react-icons/fi'
import { SiInstagram } from 'react-icons/si'
import { useState } from 'react'
import { useSectionParallax } from '../hooks/useSectionParallax'
import TiltCard from './TiltCard'

const Contact = () => {
  const { ref, fast, opacity } = useSectionParallax({ fastDistance: 100, preset: 'soft', opacityFade: true })
  const [formState, setFormState] = useState('idle')
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })

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
      value: 'prince55833kumar',
      href: 'mailto:prince55833kumar@gmail.com',
      color: 'text-accent-blue',
      hoverBg: 'hover:bg-accent-blue/15',
    },
    {
      icon: FiLinkedin,
      label: 'LinkedIn',
      value: 'Prince R',
      href: 'https://www.linkedin.com/in/prince-r-b9685130b',
      color: 'text-accent-purple',
      hoverBg: 'hover:bg-accent-purple/15',
    },
    {
      icon: FiGithub,
      label: 'GitHub',
      value: 'princekumar-dev',
      href: 'https://github.com/princekumar-dev',
      color: 'text-accent-cyan',
      hoverBg: 'hover:bg-accent-cyan/15',
    },
    {
      icon: SiInstagram,
      label: 'Instagram',
      value: '@prince_r_94',
      href: 'https://instagram.com/prince_r_94',
      color: 'text-accent-pink',
      hoverBg: 'hover:bg-accent-pink/15',
    }
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    setFormState('sending')
    setTimeout(() => {
      setFormState('sent')
      setTimeout(() => setFormState('idle'), 3000)
    }, 1500)
  }

  return (
    <motion.section ref={ref} id="contact" className="relative py-24 px-4 overflow-hidden" style={{ opacity, contain: 'layout style' }}>
      <motion.div
        style={{ y: fast }}
        className="absolute -bottom-40 -right-40 w-80 h-80 bg-accent-purple/10 rounded-full blur-2xl"
      ></motion.div>

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants} className="text-center">
            <span className="eyebrow text-accent-blue">Let's talk</span>
            <h2 className="mt-3 text-4xl md:text-5xl font-bold mb-8">
              <span className="animated-gradient-text">
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

          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-2 gap-4"
            >
              {contactLinks.map((link) => {
                const Icon = link.icon
                return (
                  <motion.div key={link.label} variants={itemVariants}>
                    <TiltCard maxTilt={8} className="group glass-card glass-edge animated-border h-full rounded-2xl">
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${link.label} (opens in new tab)`}
                        className="flex flex-col items-center p-6"
                      >
                        <div className="relative mb-3 social-link-hover rounded-2xl p-3">
                          <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.8, ease: 'easeInOut' }}
                            className={`relative flex h-12 w-12 items-center justify-center rounded-xl tag-glass ${link.color}`}
                          >
                            <Icon size={24} />
                          </motion.div>
                        </div>
                        <h3 className="text-sm font-bold text-accent-blue mb-1">{link.label}</h3>
                        <p className="text-light-600 text-center text-xs break-all">{link.value}</p>
                      </a>
                    </TiltCard>
                  </motion.div>
                )
              })}
            </motion.div>

            <motion.div variants={itemVariants}>
              <form onSubmit={handleSubmit} className="glass-card glass-edge rounded-2xl p-8 space-y-5">
                <div className="floating-label-group">
                  <input
                    id="contact-name"
                    type="text"
                    placeholder=" "
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                  <label htmlFor="contact-name">Your Name</label>
                </div>

                <div className="floating-label-group">
                  <input
                    id="contact-email"
                    type="email"
                    placeholder=" "
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                  <label htmlFor="contact-email">Email Address</label>
                </div>

                <div className="floating-label-group">
                  <textarea
                    id="contact-message"
                    placeholder=" "
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    className="resize-none"
                  />
                  <label htmlFor="contact-message">Your Message</label>
                </div>

                <motion.button
                  type="submit"
                  disabled={formState !== 'idle'}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
                    formState === 'sent'
                      ? 'bg-green-500 text-white'
                      : 'bg-gradient-to-r from-accent-blue to-accent-cyan text-white shadow-lg shadow-accent-blue/20 hover:shadow-xl hover:shadow-accent-blue/40'
                  }`}
                >
                  {formState === 'idle' && (
                    <>
                      <FiSend size={18} />
                      Send Message
                    </>
                  )}
                  {formState === 'sending' && (
                    <span className="animate-pulse">Sending...</span>
                  )}
                  {formState === 'sent' && (
                    <>
                      <FiCheck size={18} />
                      Sent!
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}

export default Contact

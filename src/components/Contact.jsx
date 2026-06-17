import { m } from 'framer-motion'
import { FiMail, FiLinkedin, FiGithub, FiSend, FiCheck, FiAlertCircle } from 'react-icons/fi'
import { SiInstagram } from 'react-icons/si'
import { useState, useRef, memo } from 'react'
import { useSectionParallax } from '../hooks/useSectionParallax'
import TiltCard from './TiltCard'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const linkItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8 },
  },
}

const ContactLink = memo(({ link }) => {
  const Icon = link.icon
  return (
    <m.div variants={linkItemVariants}>
      <TiltCard maxTilt={8} className="group glass-card glass-edge animated-border h-full rounded-2xl">
        <a
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${link.label} (opens in new tab)`}
          className="flex flex-col items-center p-6"
        >
          <div className="relative mb-3 social-link-hover rounded-2xl p-3">
            <m.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className={`relative flex h-12 w-12 items-center justify-center rounded-xl tag-glass ${link.color}`}
            >
              <Icon size={24} />
            </m.div>
          </div>
          <h3 className="text-sm font-bold text-accent-blue mb-1">{link.label}</h3>
          <p className="text-light-600 text-center text-xs break-all">{link.value}</p>
        </a>
      </TiltCard>
    </m.div>
  )
})

ContactLink.displayName = 'ContactLink'

const Contact = () => {
  const { ref, fast } = useSectionParallax({ fastDistance: 100, preset: 'soft' })
  const [formState, setFormState] = useState('idle')
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const formRef = useRef(null)

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

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Please enter your name'
    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email'
    } else if (!EMAIL_REGEX.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Please enter your message'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    setFormState('sending')

    const submission = { ...formData, timestamp: new Date().toISOString() }

    setTimeout(() => {
      try {
        const existing = JSON.parse(localStorage.getItem('contact_messages') || '[]')
        existing.push(submission)
        localStorage.setItem('contact_messages', JSON.stringify(existing))
      } catch { /* localStorage unavailable */ }
      console.log('Message received:', submission)

      setFormState('sent')
      setFormData({ name: '', email: '', message: '' })
      setErrors({})
      setTimeout(() => setFormState('idle'), 3000)
    }, 1200)
  }

  return (
    <m.section ref={ref} id="contact" className="relative py-16 sm:py-24 px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <m.div
          style={{ y: fast }}
          className="absolute -bottom-40 -right-40 w-80 h-80 bg-accent-purple/10 rounded-full blur-lg"
        ></m.div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <m.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <m.div variants={itemVariants} className="text-center">
            <span className="eyebrow text-accent-blue">Let's talk</span>
            <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8">
              <span className="animated-gradient-text">
                Get In Touch
              </span>
            </h2>
          </m.div>

          <m.p
            variants={itemVariants}
            className="text-light-600 text-base sm:text-lg text-center mb-10 sm:mb-16 max-w-2xl mx-auto"
          >
            I'm always interested in hearing about new projects and opportunities.
            Feel free to reach out through any of the channels below!
          </m.p>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            <m.div
              variants={containerVariants}
              className="grid grid-cols-2 gap-3 sm:gap-4"
            >
              {contactLinks.map((link) => (
                <ContactLink key={link.label} link={link} />
              ))}
            </m.div>

            <m.div variants={itemVariants}>
              <form ref={formRef} onSubmit={handleSubmit} className="glass-card glass-edge rounded-2xl p-6 sm:p-8 space-y-4 sm:space-y-5" data-cursor-target="card" noValidate>
                <div className="floating-label-group rounded-xl" data-cursor-target="card">
                  <input
                    id="contact-name"
                    type="text"
                    placeholder=" "
                    autoComplete="name"
                    value={formData.name}
                    onChange={(e) => { setFormData({ ...formData, name: e.target.value }); if (errors.name) setErrors((prev) => ({ ...prev, name: '' })) }}
                    className={errors.name ? 'border-red-400/50' : ''}
                  />
                  <label htmlFor="contact-name">Your Name</label>
                  {errors.name && (
                    <span className="text-red-500 text-xs mt-1 flex items-center gap-1" role="alert">
                      <FiAlertCircle size={12} /> {errors.name}
                    </span>
                  )}
                </div>

                <div className="floating-label-group rounded-xl" data-cursor-target="card">
                  <input
                    id="contact-email"
                    type="email"
                    placeholder=" "
                    autoComplete="email"
                    value={formData.email}
                    onChange={(e) => { setFormData({ ...formData, email: e.target.value }); if (errors.email) setErrors((prev) => ({ ...prev, email: '' })) }}
                    className={errors.email ? 'border-red-400/50' : ''}
                  />
                  <label htmlFor="contact-email">Email Address</label>
                  {errors.email && (
                    <span className="text-red-500 text-xs mt-1 flex items-center gap-1" role="alert">
                      <FiAlertCircle size={12} /> {errors.email}
                    </span>
                  )}
                </div>

                <div className="floating-label-group rounded-xl" data-cursor-target="card">
                  <textarea
                    id="contact-message"
                    placeholder=" "
                    rows={4}
                    maxLength={1000}
                    autoComplete="off"
                    value={formData.message}
                    onChange={(e) => { setFormData({ ...formData, message: e.target.value }); if (errors.message) setErrors((prev) => ({ ...prev, message: '' })) }}
                    className={`resize-none ${errors.message ? 'border-red-400/50' : ''}`}
                  />
                  <label htmlFor="contact-message">Your Message</label>
                  <div className="flex justify-between mt-1">
                    {errors.message && (
                      <span className="text-red-500 text-xs flex items-center gap-1" role="alert">
                        <FiAlertCircle size={12} /> {errors.message}
                      </span>
                    )}
                    <span className={`text-xs ml-auto ${formData.message.length > 900 ? 'text-amber-500' : 'text-light-500'}`}>
                      {formData.message.length}/1000
                    </span>
                  </div>
                </div>

                <m.button
                  type="submit"
                  disabled={formState !== 'idle'}
                  whileHover={formState === 'idle' ? { scale: 1.02 } : {}}
                  whileTap={formState === 'idle' ? { scale: 0.98 } : {}}
                  data-cursor-target="card"
                  className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
                    formState === 'sent'
                      ? 'bg-green-500 text-white'
                      : formState === 'error'
                        ? 'bg-red-500 text-white'
                        : formState !== 'idle'
                          ? 'bg-accent-blue/50 text-white cursor-not-allowed'
                          : 'bg-gradient-to-r from-accent-blue to-accent-cyan text-white shadow-lg shadow-accent-blue/20 hover:shadow-xl hover:shadow-accent-blue/40'
                  }`}
                  aria-live="polite"
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
                </m.button>
              </form>
            </m.div>
          </div>
        </m.div>
      </div>
    </m.section>
  )
}

export default Contact

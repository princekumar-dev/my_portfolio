import { m, AnimatePresence, useReducedMotion } from 'framer-motion'
import { FiMail, FiLinkedin, FiGithub, FiSend, FiCheck, FiAlertCircle } from 'react-icons/fi'
import { SiInstagram } from 'react-icons/si'
import { useState, useRef, memo } from 'react'
import { useSectionParallax } from '../hooks/useSectionParallax'
import TiltCard from './TiltCard'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit'

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
    color: 'text-accent-slate',
    hoverBg: 'hover:bg-accent-slate/15',
  },
  {
    icon: FiLinkedin,
    label: 'LinkedIn',
    value: 'Prince R',
    href: 'https://www.linkedin.com/in/prince-r-b9685130b',
    color: 'text-accent-rose',
    hoverBg: 'hover:bg-accent-rose/15',
  },
  {
    icon: FiGithub,
    label: 'GitHub',
    value: 'princekumar-dev',
    href: 'https://github.com/princekumar-dev',
    color: 'text-accent-sage',
    hoverBg: 'hover:bg-accent-sage/15',
  },
  {
    icon: SiInstagram,
    label: 'Instagram',
    value: '@prince_r_94',
    href: 'https://instagram.com/prince_r_94',
    color: 'text-accent-sand',
    hoverBg: 'hover:bg-accent-sand/15',
  }
]

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
          <h3 className="text-sm font-bold text-accent-slate mb-1">{link.label}</h3>
          <p className="text-light-600 text-center text-xs break-all">{link.value}</p>
        </a>
      </TiltCard>
    </m.div>
  )
})

ContactLink.displayName = 'ContactLink'

// ── Easter egg ───────────────────────────────────────────────────────────────
// A sender on this list gets a pastel heart-particle flourish on success.
const SPECIAL_SENDERS = ['preethiy694@gmail.com']

// Warm, pink-leaning lines — one is drawn at random on every special send so
// the flourish never plays the same note twice.
const SPECIAL_LINES = [
  'Got it, {name}. My whole screen just turned pink.',
  '{name} — pastel hearts, incoming.',
  'Received, {name}. I am smiling at my desk right now.',
  '{name} managed to pick the softest colour in my inbox.',
  'Got it, {name}. This one gets the pastel treatment.',
  'Received with both hands, {name}.',
  '{name}, my afternoon just got considerably pinker.',
  'Got it, {name}. Straight to the top of the pile.',
  '{name} — pastel hearts and a very real thank you.',
  'Landed safely, {name}. This one made my day.',
]

// Never repeat the previous line, so a second send still feels fresh.
const pickSpecialLine = (name, lastRef) => {
  const pool = SPECIAL_LINES
  let line = pool[Math.floor(Math.random() * pool.length)]
  for (let i = 0; i < 4 && lastRef.current === line; i += 1) {
    line = pool[Math.floor(Math.random() * pool.length)]
  }
  lastRef.current = line
  return line.replace('{name}', name || 'you')
}

const HEART_D =
  'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'
const SPARKLE_D = 'M12 2l1.9 6.1L20 10l-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.9z'

// Pink-led pastel palette. Kept deliberately desaturated so the burst reads as
// soft paper confetti rather than saturated valentine red.
const PINK_TONES = [
  '#f9c9d8', '#f5b3c8', '#f2aec4', '#f8d6e0',
  '#efb0c9', '#f6c4d4', '#fadfe7', '#f3bccf',
]

// 28 particles in three depth layers: a few pale slow ones drifting behind,
// the main body, and sparkles on top. Depth comes from size and opacity only —
// per-particle blur or drop-shadow would cost a filter layer each.
const makeHearts = (n = 28) =>
  Array.from({ length: n }, (_, i) => {
    const sparkle = i % 6 === 0
    const back = !sparkle && i % 4 === 1
    return {
      id: i,
      sparkle,
      back,
      // fan out from the button instead of stacking in one column
      x: (Math.random() - 0.5) * 380,
      sway: (Math.random() - 0.5) * 90,
      y: -(80 + Math.random() * 230),
      size: sparkle
        ? 7 + Math.random() * 6
        : back
          ? 8 + Math.random() * 8
          : 12 + Math.random() * 16,
      rot: (Math.random() - 0.5) * 70,
      delay: Math.random() * 0.9,
      duration: 2.4 + Math.random() * 1.8,
      color: PINK_TONES[(i * 3) % PINK_TONES.length],
      opacity: back ? 0.4 + Math.random() * 0.2 : 0.75 + Math.random() * 0.25,
    }
  })

const HEARTS = makeHearts()

const HeartBurst = memo(({ reduced }) => (
  <div
    className="pointer-events-none absolute inset-x-0 z-30 overflow-visible"
    style={{ bottom: '-3.25rem' }}
    data-heart-burst=""
    aria-hidden="true"
  >
    {/* Soft pink bloom the burst rises out of. One blurred element, not one   */}
    {/* per particle — the glow is free, the particles stay compositor-cheap.  */}
    {!reduced && (
      <m.div
        className="absolute bottom-0 left-1/2 h-40 w-[26rem] -translate-x-1/2 rounded-full"
        style={{
          background:
            'radial-gradient(closest-side, rgba(244,170,196,0.42), rgba(244,170,196,0) 72%)',
          filter: 'blur(6px)',
        }}
        initial={{ opacity: 0, scale: 0.35 }}
        animate={{ opacity: [0, 1, 0], scale: [0.35, 1.05, 1.25] }}
        transition={{ duration: 2.8, ease: 'easeOut' }}
      />
    )}

    {/* Two expanding rings give the burst a point of origin. */}
    {!reduced &&
      [0, 0.2].map((d) => (
        <m.span
          key={d}
          className="absolute bottom-0 left-1/2 h-16 w-16 -translate-x-1/2 translate-y-1/2 rounded-full border-2 border-rose-300/70"
          initial={{ opacity: 0.7, scale: 0.2 }}
          animate={{ opacity: 0, scale: 3.4 }}
          transition={{ duration: 1.5, delay: d, ease: 'easeOut' }}
        />
      ))}

    <AnimatePresence>
      {HEARTS.map((h) => (
        <m.svg
          key={h.id}
          viewBox="0 0 24 24"
          width={h.size}
          height={h.size}
          className="absolute bottom-0"
          style={{
            left: h.back ? 'calc(50% + 6px)' : '50%',
            marginLeft: -h.size / 2,
          }}
          initial={{ opacity: 0, y: 0, x: 0, scale: 0.15, rotate: 0 }}
          animate={
            reduced
              ? { opacity: 0, y: 0, x: 0, scale: 0.15 }
              : {
                  opacity: [0, h.opacity, h.opacity * 0.85, 0],
                  y: [0, h.y * 0.6, h.y],
                  x: [0, h.sway * 0.3, h.x + h.sway],
                  scale: [0.15, 1, 1, 0.75],
                  rotate: [0, h.rot * 0.5, h.rot],
                }
          }
          exit={{ opacity: 0 }}
          transition={{
            duration: reduced ? 0.4 : h.duration,
            delay: h.delay,
            ease: 'easeOut',
            times: [0, 0.28, 0.72, 1],
          }}
        >
          <path d={h.sparkle ? SPARKLE_D : HEART_D} fill={h.color} />
        </m.svg>
      ))}
    </AnimatePresence>
  </div>
))

HeartBurst.displayName = 'HeartBurst'


const Contact = () => {
  const { ref, fast } = useSectionParallax({ fastDistance: 100 })
  const [formState, setFormState] = useState('idle')
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [statusMsg, setStatusMsg] = useState('')
  const [special, setSpecial] = useState(false)
  const [sentName, setSentName] = useState('')
  // Last line shown to a special sender, so two sends in a row differ.
  const lastSpecialLine = useRef('')
  const prefersReduced = useReducedMotion()
  const formRef = useRef(null)

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY
    if (!accessKey) {
      setFormState('error')
      setStatusMsg('Contact form is not configured yet — add VITE_WEB3FORMS_ACCESS_KEY to your .env file.')
      setTimeout(() => { setFormState('idle'); setStatusMsg('') }, 6000)
      return
    }

    setFormState('sending')
    setStatusMsg('')
    // The submit button becomes disabled, which swallows the mouseout that
    // would normally release the cursor's hover tracking — release it manually.
    document.dispatchEvent(new CustomEvent('cursor-reset'))

    try {
      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: accessKey,
          subject: `New message from your portfolio — ${formData.name}`,
          from_name: 'Portfolio Contact Form',
          name: formData.name,
          email: formData.email,
          message: formData.message,
          replyto: formData.email,
          // Honeypot: hidden anti-bot field. Real users never set it.
          botcheck: false,
        }),
      })

      const data = await res.json().catch(() => ({ success: false, message: 'Unexpected response from server.' }))
      if (!res.ok || !data.success) throw new Error(data.message || 'Something went wrong. Please try again.')

      const senderEmail = formData.email.trim().toLowerCase()
      const isSpecial = SPECIAL_SENDERS.includes(senderEmail)
      const firstName = formData.name.trim().split(/\s+/)[0]

      setFormState('sent')
      setSpecial(isSpecial)
      setSentName(firstName)
      setStatusMsg(
        isSpecial
          ? pickSpecialLine(firstName, lastSpecialLine)
          : `Your message landed safely${firstName ? `, ${firstName}` : ''}. I read every one and reply personally, usually within a day.`
      )
      setFormData({ name: '', email: '', message: '' })
      setErrors({})
      setTimeout(() => {
        setFormState('idle')
        setStatusMsg('')
        setSpecial(false)
        setSentName('')
      }, 4600)
    } catch (err) {
      setSpecial(false)
      setFormState('error')
      setStatusMsg(err?.message || 'Failed to send. Please email me directly instead.')
      setTimeout(() => { setFormState('idle'); setStatusMsg('') }, 6000)
    }
  }

  return (
    <m.section ref={ref} id="contact" className="relative py-12 sm:py-24 px-3 sm:px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <m.div
          style={{ y: fast }}
          className="absolute -bottom-40 -right-40 w-80 h-80 bg-accent-rose/10 rounded-full blur-lg"
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
            <h2 className="text-shimmer text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8 text-light-900">
              Get In Touch
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
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="glass-card glass-edge rounded-2xl p-6 sm:p-8 space-y-4 sm:space-y-5"
                data-cursor-target="card"
                data-cursor-disabled={formState !== 'idle' ? 'true' : undefined}
                noValidate
              >
                <div className="floating-label-group rounded-xl" data-cursor-target="card">
                  <input
                    id="contact-name"
                    type="text"
                    required
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
                    required
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
                    required
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

                <div className="relative">
                  <AnimatePresence mode="wait">
                    {statusMsg && (
                      <m.div
                        key={formState}
                        role="status"
                        aria-live="polite"
                        initial={{ opacity: 0, y: 14, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className={`relative overflow-hidden rounded-2xl border backdrop-blur-md ${
                          formState === 'error'
                            ? 'border-red-400/35 bg-gradient-to-br from-red-400/15 via-transparent to-red-300/10 shadow-[0_12px_32px_-16px_rgba(220,90,90,0.55)]'
                            : special
                              ? 'border-rose-300/45 bg-gradient-to-br from-rose-300/28 via-accent-rose/12 to-pink-200/22 shadow-[0_16px_40px_-14px_rgba(244,114,182,0.7)]'
                              : 'border-accent-sage/30 bg-gradient-to-br from-accent-sage/15 via-transparent to-accent-slate/10 shadow-[0_12px_32px_-16px_rgba(74,112,96,0.5)]'
                        }`}
                      >
                        {/* pink bloom behind the special toast */}
                        {special && !prefersReduced && (
                          <m.span
                            aria-hidden="true"
                            className="pointer-events-none absolute -left-8 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full"
                            style={{
                              background:
                                'radial-gradient(closest-side, rgba(244,143,177,0.55), rgba(244,143,177,0) 70%)',
                              filter: 'blur(4px)',
                            }}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: [0, 0.9, 0], scale: [0.5, 1.3, 1.6] }}
                            transition={{ duration: 2.2, delay: 0.1, ease: 'easeOut' }}
                          />
                        )}

                        {/* one-shot sheen sweep */}
                        {!prefersReduced && (
                          <m.span
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3"
                            style={{ background: 'linear-gradient(100deg, transparent, rgba(255,255,255,0.5), transparent)' }}
                            initial={{ x: '0%' }}
                            animate={{ x: '430%' }}
                            transition={{ duration: 1.5, delay: 0.15, ease: 'easeInOut' }}
                          />
                        )}

                        <div className="relative flex items-start gap-3 px-4 py-3.5">
                          <span
                            className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${
                              formState === 'error'
                                ? 'border-red-400/40 bg-red-500/15 text-red-600 dark:text-red-300'
                                : special
                                  ? 'border-accent-rose/40 bg-accent-rose/15 text-accent-rose'
                                  : 'border-accent-sage/40 bg-accent-sage/15 text-accent-sage'
                            }`}
                          >
                            {formState === 'error' ? (
                              <FiAlertCircle size={15} />
                            ) : (
                              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                                <m.path
                                  d="M4.5 12.5l4.5 4.5 10-10"
                                  stroke="currentColor"
                                  strokeWidth="2.6"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  initial={{ pathLength: 0 }}
                                  animate={{ pathLength: 1 }}
                                  transition={{ duration: 0.45, delay: 0.2, ease: 'easeOut' }}
                                />
                              </svg>
                            )}
                          </span>

                          <div className="min-w-0 flex-1">
                            <p className={`text-sm font-bold tracking-tight ${
                              formState === 'error'
                                ? 'text-red-600 dark:text-red-300'
                                : special
                                  ? 'bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 bg-clip-text text-transparent'
                                  : 'text-accent-sage'
                            }`}>
                              {formState === 'error' ? "Couldn't send" : special ? 'Sent with love' : 'Message sent'}
                            </p>
                            <p className="mt-0.5 text-xs leading-relaxed text-light-600 dark:text-light-400">
                              {statusMsg}
                            </p>
                          </div>

                          {/* drawn-then-filled heart, easter egg only */}
                          {special && formState === 'sent' && (
                            <m.svg
                              viewBox="0 0 24 24"
                              className="mt-0.5 h-4 w-4 shrink-0 text-accent-rose"
                              initial={{ scale: 0, rotate: -12 }}
                              animate={{ scale: [0, 1.3, 1], rotate: 0 }}
                              transition={{ duration: 0.6, delay: 0.35, ease: 'easeOut' }}
                              aria-hidden="true"
                            >
                              <m.path
                                d={HEART_D}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                initial={{ pathLength: 0, opacity: 1 }}
                                animate={{ pathLength: 1, opacity: 0 }}
                                transition={{ duration: 0.85, delay: 0.3, ease: 'easeInOut' }}
                              />
                              <m.path
                                d={HEART_D}
                                fill="currentColor"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.4, delay: 0.65 }}
                              />
                            </m.svg>
                          )}
                        </div>

                        {/* draining timer bar */}
                        <m.div
                          aria-hidden="true"
                          className={`absolute bottom-0 left-0 h-[2px] w-full origin-left ${
                            formState === 'error'
                              ? 'bg-red-400/70'
                              : special
                                ? 'bg-accent-rose/70'
                                : 'bg-accent-sage/70'
                          }`}
                          initial={{ scaleX: 1 }}
                          animate={{ scaleX: 0 }}
                          transition={{ duration: formState === 'error' ? 6 : 4.6, ease: 'linear' }}
                        />
                      </m.div>
                    )}
                  </AnimatePresence>

                  {special && formState === 'sent' && <HeartBurst reduced={prefersReduced} />}
                </div>

                <m.button
                  type="submit"
                  disabled={formState !== 'idle'}
                  whileHover={formState === 'idle' ? { scale: 1.02 } : {}}
                  whileTap={formState === 'idle' ? { scale: 0.98 } : {}}
                  aria-busy={formState === 'sending'}
                  data-cursor-target="card"
                  className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
                    formState === 'sent'
                      ? special
                        ? 'bg-[#7f545f] text-white shadow-lg shadow-accent-rose/30'
                        : 'bg-green-700 text-white shadow-lg shadow-green-500/30'
                      : formState === 'error'
                        ? 'bg-red-600 text-white'
                        : formState !== 'idle'
                          ? 'bg-accent-slate/50 text-light-900 cursor-not-allowed'
                          : 'bg-gradient-to-r from-accent-slate to-accent-sage text-white shadow-lg shadow-accent-slate/20 hover:shadow-xl hover:shadow-accent-slate/40'
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

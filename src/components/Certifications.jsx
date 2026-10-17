import { memo, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { m, AnimatePresence } from 'framer-motion'
import { FiAward, FiExternalLink, FiMaximize2, FiX } from 'react-icons/fi'
import { certificationsData, certificationCategories } from '../data/certificationsData'
import { useSmoothScroll } from '../context/SmoothScrollContext'
import { useSectionParallax } from '../hooks/useSectionParallax'
import TiltCard from './TiltCard'

const CATEGORY_LABELS = {
  All: 'All',
  Certification: 'Certifications',
  Internship: 'Internships',
  Competition: 'Competitions',
  Achievement: 'Achievements',
}

const CATEGORY_STYLES = {
  Certification: 'bg-accent-slate/15 text-accent-slate border-accent-slate/30',
  Internship: 'bg-accent-sage/15 text-accent-sage border-accent-sage/30',
  Competition: 'bg-accent-rose/15 text-accent-rose border-accent-rose/30',
  Achievement: 'bg-accent-sand/15 text-accent-sand border-accent-sand/30',
}

/* A certificate can live in more than one tab (e.g. an internship that also
   earned a "Best Performer" award belongs in Internships *and* Achievements). */
const categoriesOf = (cert) => [cert.category, ...(cert.alsoIn || [])]

const matchesTab = (cert, tab) => tab === 'All' || categoriesOf(cert).includes(tab)

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

/* Real certificate scan with shimmer while loading + graceful fallback */
const CertImage = memo(({ cert }) => {
  const [status, setStatus] = useState('loading')

  if (!cert.image || status === 'error') {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-accent-slate/15 to-accent-sage/15">
        <div className="text-4xl float-medium">🏆</div>
        <p className="text-sm text-light-600 font-semibold">{cert.date}</p>
      </div>
    )
  }

  return (
    <>
      <div
        className={`absolute inset-0 bg-gradient-to-br from-accent-slate/10 to-accent-sage/10 shimmer transition-opacity duration-500 ${
          status === 'loaded' ? 'opacity-0' : 'opacity-100'
        }`}
      />
      {/* Frosted glass well: a fixed inset from the card edges with the logo
          centred and capped per its own aspect ratio (max-h/max-w %), so wide
          wordmarks and square emblems all keep the same generous padding. */}
      <div className="absolute inset-3 sm:inset-4 overflow-hidden rounded-xl border border-white/70 bg-white/50 shadow-[0_2px_12px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/[0.07]">
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={cert.image}
            alt={`${cert.title} certificate issued by ${cert.issuer}`}
            loading="lazy"
            decoding="async"
            onLoad={() => setStatus('loaded')}
            onError={() => setStatus('error')}
            className={`max-h-[64%] max-w-[76%] object-contain transition-opacity duration-500 ${
              status === 'loaded' ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </div>
        {/* One light frost sheet over everything — a small, consistent smear
            that keeps every thumbnail reading as frosted glass while the logo
            stays recognisable. Lives in .logo-frost so scrolling can drop it. */}
        <div className="logo-frost absolute inset-0" aria-hidden="true" />
      </div>
    </>
  )
})

CertImage.displayName = 'CertImage'

const CertCard = memo(({ cert, onOpen }) => (
  <m.div variants={itemVariants}>
    <TiltCard className="group glass-card glass-edge animated-border h-full rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={() => onOpen(cert)}
        aria-label={`View full certificate: ${cert.title}`}
        className="relative block h-40 sm:h-44 w-full overflow-hidden cursor-pointer"
      >
        <CertImage cert={cert} />
        <m.div className="absolute inset-0 bg-gradient-to-r from-accent-slate to-accent-sage opacity-0 group-hover:opacity-15 transition-opacity duration-300 pointer-events-none" />

        <div className="absolute top-3 left-3 flex max-w-[72%] flex-wrap gap-1.5">
          {categoriesOf(cert).map((cat) => (
            <span
              key={cat}
              className={`rounded-full border px-2.5 py-0.5 text-[0.7rem] font-semibold backdrop-blur-sm ${
                CATEGORY_STYLES[cat] || CATEGORY_STYLES.Certification
              }`}
            >
              {cat}
            </span>
          ))}
        </div>

        <span className="absolute bottom-3 right-3 rounded-full bg-light-900/70 px-2.5 py-0.5 text-[0.7rem] font-semibold text-white backdrop-blur-sm">
          {cert.date}
        </span>
      </button>

      <div className="p-4 sm:p-5">
        <p className="flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-light-500 mb-2">
          <FiAward size={14} className="text-accent-slate shrink-0" aria-hidden="true" />
          <span className="truncate">{cert.issuer}</span>
        </p>

        <h3 className="text-lg font-bold text-accent-slate leading-snug mb-2">{cert.title}</h3>
        <p className="text-light-600 text-sm line-clamp-2 mb-4">{cert.description}</p>

        <div className="flex items-center justify-between gap-3">
          {cert.award ? (
            <span className="rounded-full border border-accent-sand/40 bg-accent-sand/15 px-3 py-1 text-xs font-semibold text-accent-sand">
              {cert.award}
            </span>
          ) : (
            <span className="text-xs text-light-500">{cert.issuer}</span>
          )}

          <button
            type="button"
            onClick={() => onOpen(cert)}
            className="inline-flex items-center gap-1.5 rounded-lg text-sm font-semibold text-accent-slate hover:text-accent-sage transition-colors"
          >
            <FiMaximize2 size={15} aria-hidden="true" />
            View
          </button>
        </div>
      </div>
    </TiltCard>
  </m.div>
))

CertCard.displayName = 'CertCard'

const CertificateModal = ({ cert, onClose }) => {
  useEffect(() => {
    // Tell the custom cursor to drop the hover state it had on the card we
    // just left behind (otherwise it keeps tracking the card through the
    // semi-transparent backdrop).
    document.dispatchEvent(new Event('certificate-modal-open'))

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

  return createPortal(
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6"
    >
      <div
        className="absolute inset-0 bg-light-900/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <m.div
        role="dialog"
        aria-modal="true"
        aria-label={cert.title}
        initial={{ opacity: 0, scale: 0.94, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl glass-card glass-edge animated-border"
      >
        <header className="flex items-start justify-between gap-4 border-b border-light-200/70 p-4 sm:p-5">
          <div className="min-w-0">
            <div className="flex flex-wrap gap-1.5">
              {categoriesOf(cert).map((cat) => (
                <span
                  key={cat}
                  className={`rounded-full border px-2.5 py-0.5 text-[0.7rem] font-semibold ${
                    CATEGORY_STYLES[cat] || CATEGORY_STYLES.Certification
                  }`}
                >
                  {cat}
                </span>
              ))}
            </div>
            <h3 className="mt-2 text-lg sm:text-2xl font-bold text-accent-slate leading-snug">
              {cert.title}
            </h3>
            <p className="mt-1 text-sm text-light-600">
              {cert.issuer} · {cert.date}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close certificate"
            className="shrink-0 rounded-full p-2 btn-glass text-accent-slate"
          >
            <FiX size={20} />
          </button>
        </header>

        <div className="overflow-y-auto bg-white/80 p-3 sm:p-5">
          <img
            src={cert.fullImage || cert.image}
            alt={`${cert.title} certificate issued by ${cert.issuer}`}
            className="mx-auto max-h-[52vh] w-auto rounded-lg object-contain shadow-sm"
          />
        </div>

        <footer className="border-t border-light-200/70 p-4 sm:p-5">
          <p className="text-sm leading-relaxed text-light-600">{cert.description}</p>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            {cert.award && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-sand/40 bg-accent-sand/15 px-3 py-1 text-xs font-semibold text-accent-sand">
                <FiAward size={13} aria-hidden="true" />
                {cert.award}
              </span>
            )}
            {cert.credentialId && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-slate/30 bg-accent-slate/10 px-3 py-1 text-xs font-semibold text-accent-slate">
                ID: {cert.credentialId}
              </span>
            )}
            {cert.credentialUrl && (
              <a
                href={cert.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg btn-glass px-3 py-1.5 text-xs font-semibold text-accent-slate"
              >
                Verify credential
                <FiExternalLink size={13} aria-hidden="true" />
              </a>
            )}
          </div>
        </footer>
      </m.div>
    </m.div>,
    document.body
  )
}

const Certifications = () => {
  const { ref, fast } = useSectionParallax({ fastDistance: 100 })
  const lenisRef = useSmoothScroll()
  const [active, setActive] = useState('All')
  const [selected, setSelected] = useState(null)

  const tabs = useMemo(
    () => ['All', ...certificationCategories.filter((c) => certificationsData.some((cert) => matchesTab(cert, c)))],
    []
  )

  const visibleCerts = useMemo(
    () => certificationsData.filter((cert) => matchesTab(cert, active)),
    [active]
  )

  useEffect(() => {
    if (!selected) return

    const lenis = lenisRef?.current
    lenis?.stop?.()

    return () => {
      lenis?.start?.()
    }
  }, [selected, lenisRef])

  return (
    <section ref={ref} id="certifications" className="relative py-16 sm:py-24 px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <m.div
          style={{ y: fast }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-accent-slate/10 rounded-full blur-lg"
        ></m.div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="eyebrow text-accent-slate">Recognitions</span>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold">
            <span className="animated-gradient-text">
              Certifications
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-light-600 text-sm sm:text-base">
            Every entry below is backed by the original document — select a card to view the
            issued certificate.
          </p>
        </m.div>

        <div className="mb-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActive(tab)}
              aria-pressed={active === tab}
              className={`rounded-full border px-4 py-1.5 text-xs sm:text-sm font-semibold transition-colors duration-300 ${
                active === tab
                  ? 'border-transparent bg-gradient-to-r from-accent-slate to-accent-sage text-light-900 shadow-md shadow-accent-slate/25'
                  : 'tag-glass text-accent-slate hover:border-accent-slate/40'
              }`}
            >
              {CATEGORY_LABELS[tab] || tab}
              <span className="ml-1.5 opacity-70">
                {certificationsData.filter((cert) => matchesTab(cert, tab)).length}
              </span>
            </button>
          ))}
        </div>

        {visibleCerts.length === 0 ? (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-light-500 text-lg">Certifications coming soon!</p>
          </m.div>
        ) : (
          <m.div
            key={active}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          >
            {visibleCerts.map((cert) => (
              <CertCard key={cert.id} cert={cert} onOpen={setSelected} />
            ))}
          </m.div>
        )}
      </div>

      <AnimatePresence>
        {selected && <CertificateModal cert={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </section>
  )
}

export default Certifications

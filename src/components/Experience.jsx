import { m, useTransform, useInView } from 'framer-motion'
import { useRef, useState, memo } from 'react'
import { FiChevronRight } from 'react-icons/fi'
import { experienceData } from '../data/experienceData'
import { useSectionParallax } from '../hooks/useSectionParallax'

const isTouchDevice = () =>
  typeof window !== 'undefined' &&
  ('ontouchstart' in window || navigator.maxTouchPoints > 0)

const MetroidBeam = ({ scrollYProgress }) => {
  const beamRef = useRef(null)
  const beamInView = useInView(beamRef, { margin: '-50px' })
  const beamScaleY = useTransform(scrollYProgress, [0, 1], [0, 1])
  const tipY = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  const [touchDevice] = useState(isTouchDevice)

  return (
    <div ref={beamRef} className="absolute left-[7px] top-0 w-[3px] h-full z-0 pointer-events-none" style={{ contain: 'layout style' }}>
      <div className="absolute inset-0 w-full rounded-full bg-gradient-to-b from-accent-slate/10 via-accent-sage/10 to-accent-rose/10" />

      <m.div
        style={{ scaleY: beamScaleY, transformOrigin: 'top', willChange: 'transform' }}
        className="absolute top-0 w-full h-full rounded-full bg-gradient-to-b from-accent-slate via-accent-sage to-accent-rose opacity-100 shadow-[0_0_8px_rgba(61,90,115,0.5)]"
      />
      <m.div
        style={{ scaleY: beamScaleY, transformOrigin: 'top', willChange: 'transform' }}
        className="absolute top-0 left-[0.5px] w-[2px] h-full rounded-full bg-white/40 blur-sm"
      />

      <m.div
        style={{ top: tipY, willChange: 'transform' }}
        className="absolute -left-[4px] w-[11px] h-[11px]"
      >
        <div
          className={`w-full h-full rounded-full bg-white ${beamInView && !touchDevice ? 'beam-pulse' : ''}`}
          style={!beamInView || touchDevice ? { opacity: 0.8 } : undefined}
        />
      </m.div>
    </div>
  )
}

const getInitials = (name) => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

const ExperienceCard = memo(({ exp, index, scrollYProgress, total, touchDevice }) => {
  const slotSize = 1 / total
  const slotStart = index * slotSize
  const slotEnd = (index + 1) * slotSize
  const fade = 0.08

  const fillProgress = useTransform(
    scrollYProgress,
    [slotStart, slotStart + fade, slotEnd - fade, slotEnd],
    [0, 1, 1, 0]
  )

  const dotScale = useTransform(fillProgress, [0, 1], [1, 1.2])
  const dotOpacity = useTransform(fillProgress, [0, 0.3, 1], [0.3, 1, 1])

  const accent = exp.accentColor || '#577590'

  return (
    <m.div
      className="relative pb-12"
      initial={{ opacity: 0, x: touchDevice ? 0 : -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <m.div
        className="absolute left-[1px] top-[2px] w-[15px] h-[15px] rounded-full border-[3px] z-10"
        style={{
          scale: dotScale,
          opacity: dotOpacity,
          backgroundColor: accent,
          borderColor: accent,
          boxShadow: `0 0 12px ${accent}88`,
          willChange: 'transform',
        }}
      />

      <div className="ml-8">
        <m.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="group glass-card glass-edge animated-border rounded-2xl cursor-default"
          data-cursor-target="card"
        >
          <div className="p-5 sm:p-7">
            <div className="flex items-start gap-4 mb-4">
              <div
                className="shrink-0 flex h-12 w-12 items-center justify-center rounded-xl font-bold text-sm text-white shadow-lg"
                style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)` }}
              >
                {getInitials(exp.company)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap justify-between items-start gap-2">
                  <h3 className="text-lg sm:text-xl font-bold text-light-900">{exp.position}</h3>
                  <span className="text-sm text-light-500 whitespace-nowrap">{exp.duration}</span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-light-500 text-sm">{exp.company}</p>
                  {exp.duration.includes('Present') && (
                    <span className="badge-shimmer inline-flex rounded-full border border-green-500/30 bg-green-500/10 px-2.5 py-0.5 text-[0.65rem] font-semibold text-green-600">
                      Current
                    </span>
                  )}
                </div>
              </div>
            </div>

            <p className="text-light-600 mb-4 text-sm leading-relaxed">{exp.description}</p>

            <div className="card-reveal-wrap">
              <div className="card-reveal-content">
                <ul className="space-y-2 mb-4">
                  {exp.achievements.map((achievement, idx) => (
                    <li
                      key={idx}
                      className="text-light-600 text-sm flex items-start"
                    >
                      <FiChevronRight className="mr-3 mt-0.5 shrink-0" size={14} style={{ color: accent }} />
                      {achievement}
                    </li>
                  ))}
                </ul>

                {exp.technologies && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {exp.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="tag-glass px-2.5 py-1 text-xs rounded-full text-accent-slate"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </m.div>
      </div>
    </m.div>
  )
})

ExperienceCard.displayName = 'ExperienceCard'

const Experience = () => {
  const { ref, smooth } = useSectionParallax({ fastDistance: 100, preset: 'default' })
  const [touchDevice] = useState(() => 'ontouchstart' in window || navigator.maxTouchPoints > 0)

  return (
    <m.section ref={ref} id="experience" className="relative py-16 sm:py-24 px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <m.div
          style={{ y: smooth }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-rose/10 rounded-full blur-lg"
        />
      </div>

      <div className="max-w-4xl mx-auto relative z-10 px-2 sm:px-0">
        <div className="text-center mb-12 sm:mb-16">
          <m.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="eyebrow text-accent-slate block"
          >
            Where I've worked
          </m.span>
          <m.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold"
          >
            <span className="animated-gradient-text">
              Experience
            </span>
          </m.h2>
        </div>

        {experienceData.length === 0 ? (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-light-500 text-lg">Experience details coming soon!</p>
          </m.div>
        ) : (
          <div className="relative">
            <MetroidBeam scrollYProgress={smooth} />
            {experienceData.map((exp, index) => (
              <ExperienceCard
                key={exp.id}
                exp={exp}
                index={index}
                scrollYProgress={smooth}
                total={experienceData.length}
                touchDevice={touchDevice}
              />
            ))}
          </div>
        )}
      </div>
    </m.section>
  )
}

export default Experience

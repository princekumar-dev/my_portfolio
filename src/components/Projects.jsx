import { m } from 'framer-motion'
import { FiGithub, FiExternalLink } from 'react-icons/fi'
import { useState, useMemo, memo } from 'react'
import { projectsData } from '../data/projectsData'
import { useSectionParallax } from '../hooks/useSectionParallax'
import TiltCard from './TiltCard'

const statusStyles = {
  Completed: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30',
  'In Progress': 'bg-amber-500/15 text-amber-600 border-amber-500/30',
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
}

const desktopItemVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.96, rotateX: 6 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
}

const mobileItemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
}

const ShimmerImage = ({ src, alt, className, style }) => {
  const [loaded, setLoaded] = useState(false)
  const webpSrc = src ? src.replace(/\.png$/, '.webp') : null

  return (
    <div className="absolute inset-0">
      <div
        className={`absolute inset-0 bg-gradient-to-br from-accent-slate/10 to-accent-sage/10 ${loaded ? 'opacity-0' : 'opacity-100 shimmer'} transition-opacity duration-500`}
      />
      {src && (
        <picture>
          {webpSrc && <source srcSet={webpSrc} type="image/webp" />}
          <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            width={400}
            height={300}
            onLoad={() => setLoaded(true)}
            onError={(e) => { e.currentTarget.style.display = 'none'; setLoaded(true) }}
            className={className}
            style={{ ...style, opacity: loaded ? 1 : 0, transition: 'opacity 0.5s ease' }}
          />
        </picture>
      )}
    </div>
  )
}

const ProjectCard = memo(({ project, itemVariants }) => (
  <m.div variants={itemVariants}>
    <TiltCard className="group glass-card glass-edge animated-border h-full rounded-2xl">
      <div className="relative h-48 sm:h-56 bg-gradient-to-br from-accent-slate/15 to-accent-sage/15 overflow-hidden">
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-none blur-xl opacity-20 group-hover:opacity-50 transition-opacity duration-300"
          style={{ backgroundColor: project.color }}
        />
        {project.image && (
          <ShimmerImage
            src={project.image}
            alt={`${project.title} preview`}
            className="absolute inset-0 h-full w-full object-contain p-10 transition-transform duration-700 ease-out group-hover:scale-105"
            style={{ transform: 'translateZ(0)' }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/10 to-transparent" />
        <m.div className="absolute inset-0 bg-gradient-to-r from-accent-slate to-accent-sage opacity-0 group-hover:opacity-10 transition-opacity duration-300" />

        {project.status && (
          <span
            className={`absolute top-3 right-3 rounded-full border px-3 py-0.5 text-[0.7rem] font-medium backdrop-blur-sm ${
              statusStyles[project.status] || statusStyles.Completed
            }`}
          >
            {project.status}
          </span>
        )}

        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3 className="text-2xl font-bold text-light-900 drop-shadow-sm">{project.title}</h3>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <p className="text-light-600 text-sm mb-4 line-clamp-2">{project.description}</p>

        <div className="card-reveal-wrap">
        <div className="card-reveal-content pb-3">
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="tag-glass px-3 py-1 text-xs rounded-full text-accent-slate"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex gap-4">
            <m.a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg btn-glass text-accent-slate ml-1.5"
            >
              <FiGithub size={18} />
              <span className="text-sm font-semibold">Code</span>
            </m.a>
            {project.liveUrl && (
              <m.a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg btn-glass text-accent-slate"
              >
                <FiExternalLink size={18} />
                <span className="text-sm font-semibold">Live Demo</span>
              </m.a>
            )}
          </div>
        </div>
        </div>
      </div>
    </TiltCard>
  </m.div>
))

ProjectCard.displayName = 'ProjectCard'

const Projects = () => {
  const { ref, slow, fast } = useSectionParallax({ slowDistance: 50, fastDistance: 110, preset: 'snappy' })
  const [touchDevice] = useState(() => 'ontouchstart' in window || navigator.maxTouchPoints > 0)

  const itemVariants = touchDevice ? mobileItemVariants : desktopItemVariants

  return (
    <m.section ref={ref} id="projects" className="relative py-16 sm:py-24 px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <m.div
          style={{ y: fast }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-accent-slate/10 rounded-full blur-lg"
        ></m.div>
        <m.div
          style={{ y: slow }}
          className="absolute bottom-0 -left-32 w-64 h-64 bg-accent-sage/10 rounded-full blur-lg"
        ></m.div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="eyebrow text-accent-slate">Selected work</span>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold">
            <span className="animated-gradient-text">
              Featured Projects
            </span>
          </h2>
        </m.div>

        {projectsData.length === 0 ? (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-light-500 text-lg">No projects to show yet. Check back soon!</p>
          </m.div>
        ) : (
          <m.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 auto-rows-auto"
          >
            {projectsData.map((project) => (
              <ProjectCard key={project.id} project={project} itemVariants={itemVariants} />
            ))}
          </m.div>
        )}
      </div>
    </m.section>
  )
}

export default Projects

import { motion } from 'framer-motion'
import { FiGithub, FiExternalLink } from 'react-icons/fi'
import { useState, useEffect, useRef } from 'react'
import { projectsData } from '../data/projectsData'
import { useSectionParallax } from '../hooks/useSectionParallax'
import TiltCard from './TiltCard'

const statusStyles = {
  Completed: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30',
  'In Progress': 'bg-amber-500/15 text-amber-600 border-amber-500/30',
}

const Projects = () => {
  const { ref, slow, fast, opacity } = useSectionParallax({ slowDistance: 50, fastDistance: 110, preset: 'snappy', opacityFade: true })
  const [touchDevice, setTouchDevice] = useState(false)

  useEffect(() => {
    setTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: touchDevice ? 0.08 : 0.15,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = touchDevice ? {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
  } : {
    hidden: { opacity: 0, y: 50, scale: 0.96, rotateX: 6 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  }

  const ProjectCard = ({ project }) => (
    <motion.div variants={itemVariants}>
      <TiltCard className="group glass-card glass-edge animated-border h-full rounded-2xl overflow-hidden">
        <div className="relative h-48 bg-gradient-to-br from-accent-blue/15 to-accent-cyan/15 overflow-hidden">
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-none blur-xl opacity-20 group-hover:opacity-50 transition-opacity duration-300"
            style={{ backgroundColor: project.color }}
          />
          {project.image && (
            <img
              src={project.image}
              alt={`${project.title} preview`}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-contain p-10 transition-transform duration-700 ease-out group-hover:scale-105"
              style={{ transform: 'translateZ(0)' }}
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/10 to-transparent" />
          <motion.div className="absolute inset-0 bg-gradient-to-r from-accent-blue to-accent-cyan opacity-0 group-hover:opacity-10 transition-opacity duration-300" />

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

        <div className="p-6">
          <p className="text-light-600 text-sm mb-4 line-clamp-2">{project.description}</p>

          <div className="card-reveal-content">
            <div className="flex flex-wrap gap-2 mb-4">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="tag-glass px-3 py-1 text-xs rounded-full text-accent-blue"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex gap-4">
              <motion.a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg btn-glass text-accent-blue"
              >
                <FiGithub size={18} />
                <span className="text-sm font-semibold">Code</span>
              </motion.a>
              <motion.a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg btn-glass text-accent-purple"
              >
                <FiExternalLink size={18} />
                <span className="text-sm font-semibold">Demo</span>
              </motion.a>
            </div>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  )

  return (
    <motion.section ref={ref} id="projects" className="relative py-24 px-4 overflow-hidden" style={{ opacity }}>
      <motion.div
        style={{ y: fast }}
        className="absolute -top-40 -right-40 w-80 h-80 bg-accent-blue/10 rounded-full blur-2xl"
      ></motion.div>
      <motion.div
        style={{ y: slow }}
        className="absolute bottom-0 -left-32 w-64 h-64 bg-accent-cyan/10 rounded-full blur-2xl"
      ></motion.div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="eyebrow text-accent-blue">Selected work</span>
          <h2 className="mt-3 text-4xl md:text-5xl font-bold">
            <span className="animated-gradient-text">
              Featured Projects
            </span>
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-auto"
        >
          {projectsData.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}

export default Projects

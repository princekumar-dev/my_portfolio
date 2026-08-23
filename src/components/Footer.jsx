import { m } from 'framer-motion'
import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer aria-label="Site footer" className="relative glass border-t border-white/40 py-8 sm:py-12 px-4" style={{ contain: 'layout style' }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-8 mb-8">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="sm:flex-1"
          >
            <h3 className="text-2xl font-bold text-light-900 mb-3">
              Prince.dev
            </h3>
            <p className="text-light-500 text-sm leading-relaxed max-w-xs">
              AI & Data Science engineer passionate about building intelligent, data-driven experiences.
            </p>
          </m.div>

          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="sm:flex-1"
          >
            <h4 className="text-accent-slate font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2.5 text-light-500 text-sm">
              <li><a href="#home" data-cursor-target="link" className="inline-block rounded-lg px-2 py-0.5 hover:text-accent-slate transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-px after:bg-accent-slate after:transition-all after:duration-300">Home</a></li>
              <li><a href="#projects" data-cursor-target="link" className="inline-block rounded-lg px-2 py-0.5 hover:text-accent-slate transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-px after:bg-accent-slate after:transition-all after:duration-300">Projects</a></li>
              <li><a href="#contact" data-cursor-target="link" className="inline-block rounded-lg px-2 py-0.5 hover:text-accent-slate transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-px after:bg-accent-slate after:transition-all after:duration-300">Contact</a></li>
            </ul>
          </m.div>

          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="sm:flex-1"
          >
            <h4 className="text-accent-slate font-semibold mb-3">Connect</h4>
            <ul className="space-y-2.5 text-light-500 text-sm">
              <li>
                <a href="https://github.com/princekumar-dev" target="_blank" rel="noopener noreferrer" aria-label="GitHub (opens in new tab)" data-cursor-target="link" className="inline-flex items-center gap-2 rounded-lg px-2 py-0.5 hover:text-accent-slate transition-colors duration-200 group">
                  <FiGithub size={16} className="group-hover:rotate-12 transition-transform duration-200" />
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/prince-r-b9685130b" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn (opens in new tab)" data-cursor-target="link" className="inline-flex items-center gap-2 rounded-lg px-2 py-0.5 hover:text-accent-slate transition-colors duration-200 group">
                  <FiLinkedin size={16} className="group-hover:rotate-12 transition-transform duration-200" />
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="mailto:prince55833kumar@gmail.com" data-cursor-target="link" className="inline-flex items-center gap-2 rounded-lg px-2 py-0.5 hover:text-accent-slate transition-colors duration-200 group">
                  <FiMail size={16} className="group-hover:rotate-12 transition-transform duration-200" />
                  Email
                </a>
              </li>
            </ul>
          </m.div>
        </div>

        <m.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="border-t border-light-200 pt-6 text-center text-light-500 text-sm"
        >
          <p>&copy; {currentYear} Prince R. All rights reserved.</p>
        </m.div>
      </div>
    </footer>
  )
}

export default Footer
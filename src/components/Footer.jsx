import { motion } from 'framer-motion'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-white/60 backdrop-blur-md border-t border-light-200 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold bg-gradient-to-r from-accent-blue to-accent-cyan bg-clip-text text-transparent mb-4">
              PR
            </h3>
            <p className="text-light-500 text-sm">
              AI & Data Science engineer passionate about building intelligent, data-driven experiences.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="text-accent-blue font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-light-500 text-sm">
              <li><a href="#home" className="hover:text-accent-blue transition-colors">Home</a></li>
              <li><a href="#projects" className="hover:text-accent-blue transition-colors">Projects</a></li>
              <li><a href="#contact" className="hover:text-accent-blue transition-colors">Contact</a></li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="text-accent-blue font-semibold mb-4">Connect</h4>
            <ul className="space-y-2 text-light-500 text-sm">
              <li><a href="https://github.com/princekumar-dev" target="_blank" rel="noopener noreferrer" className="hover:text-accent-blue transition-colors">GitHub</a></li>
              <li><a href="https://www.linkedin.com/in/prince-r-b9685130b" target="_blank" rel="noopener noreferrer" className="hover:text-accent-blue transition-colors">LinkedIn</a></li>
              <li><a href="mailto:prince55833kuma@gmail.com" className="hover:text-accent-blue transition-colors">Email</a></li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="border-t border-light-200 pt-8 text-center text-light-500 text-sm"
        >
          <p>© {currentYear} Prince R. All rights reserved. Built with React & Framer Motion.</p>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer
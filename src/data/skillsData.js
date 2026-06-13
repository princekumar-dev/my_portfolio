import {
  FaReact,
  FaNode,
  FaPython,
  FaDatabase,
  FaGitAlt,
  FaDocker,
  FaJava,
  FaJs,
  FaHtml5,
  FaCss3Alt,
  FaLinux,
  FaAws,
  FaGithub,
  FaFire
} from 'react-icons/fa'
import { SiMongodb, SiPostgresql, SiMysql, SiTailwindcss, SiExpress, SiNextdotjs, SiFirebase, SiTypescript } from 'react-icons/si'

export const skillsData = {
  frontend: [
    { name: 'React', icon: FaReact, color: '#61dafb', level: 'Expert' },
    { name: 'JavaScript', icon: FaJs, color: '#f7df1e', level: 'Expert' },
    { name: 'TypeScript', icon: SiTypescript, color: '#3178c6', level: 'Intermediate' },
    { name: 'HTML5', icon: FaHtml5, color: '#e34c26', level: 'Expert' },
    { name: 'CSS3', icon: FaCss3Alt, color: '#1572b6', level: 'Expert' },
    { name: 'Tailwind CSS', icon: SiTailwindcss, color: '#06b6d4', level: 'Expert' },
    { name: 'Next.js', icon: SiNextdotjs, color: '#ffffff', level: 'Intermediate' },
    { name: 'Firebase', icon: SiFirebase, color: '#ffa726', level: 'Intermediate' }
  ],
  backend: [
    { name: 'Node.js', icon: FaNode, color: '#68a063', level: 'Expert' },
    { name: 'Express.js', icon: SiExpress, color: '#ffffff', level: 'Expert' },
    { name: 'Python', icon: FaPython, color: '#3776ab', level: 'Intermediate' },
    { name: 'Java', icon: FaJava, color: '#007396', level: 'Beginner' },
    { name: 'REST APIs', icon: FaFire, color: '#ff6b6b', level: 'Expert' }
  ],
  database: [
    { name: 'MongoDB', icon: SiMongodb, color: '#13aa52', level: 'Expert' },
    { name: 'PostgreSQL', icon: SiPostgresql, color: '#336791', level: 'Intermediate' },
    { name: 'MySQL', icon: SiMysql, color: '#00758f', level: 'Intermediate' },
    { name: 'Firebase DB', icon: SiFirebase, color: '#ffa726', level: 'Intermediate' }
  ],
  tools: [
    { name: 'Git', icon: FaGitAlt, color: '#f1502f', level: 'Expert' },
    { name: 'GitHub', icon: FaGithub, color: '#ffffff', level: 'Expert' },
    { name: 'Docker', icon: FaDocker, color: '#2496ed', level: 'Intermediate' },
    { name: 'Linux', icon: FaLinux, color: '#fcc624', level: 'Intermediate' },
    { name: 'AWS', icon: FaAws, color: '#ff9900', level: 'Beginner' }
  ]
}
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
    { name: 'React', icon: FaReact, color: '#61dafb', level: 'Expert', percent: 92 },
    { name: 'JavaScript', icon: FaJs, color: '#f7df1e', level: 'Expert', percent: 90 },
    { name: 'TypeScript', icon: SiTypescript, color: '#3178c6', level: 'Intermediate', percent: 60 },
    { name: 'HTML5', icon: FaHtml5, color: '#e34c26', level: 'Expert', percent: 95 },
    { name: 'CSS3', icon: FaCss3Alt, color: '#1572b6', level: 'Expert', percent: 88 },
    { name: 'Tailwind CSS', icon: SiTailwindcss, color: '#06b6d4', level: 'Expert', percent: 90 },
    { name: 'Next.js', icon: SiNextdotjs, color: '#ffffff', level: 'Intermediate', percent: 55 },
    { name: 'Firebase', icon: SiFirebase, color: '#ffa726', level: 'Intermediate', percent: 65 }
  ],
  backend: [
    { name: 'Node.js', icon: FaNode, color: '#68a063', level: 'Expert', percent: 88 },
    { name: 'Express.js', icon: SiExpress, color: '#ffffff', level: 'Expert', percent: 85 },
    { name: 'Python', icon: FaPython, color: '#3776ab', level: 'Intermediate', percent: 65 },
    { name: 'Java', icon: FaJava, color: '#007396', level: 'Beginner', percent: 30 },
    { name: 'REST APIs', icon: FaFire, color: '#ff6b6b', level: 'Expert', percent: 90 }
  ],
  database: [
    { name: 'MongoDB', icon: SiMongodb, color: '#13aa52', level: 'Expert', percent: 85 },
    { name: 'PostgreSQL', icon: SiPostgresql, color: '#336791', level: 'Intermediate', percent: 60 },
    { name: 'MySQL', icon: SiMysql, color: '#00758f', level: 'Intermediate', percent: 65 },
    { name: 'Firebase DB', icon: SiFirebase, color: '#ffa726', level: 'Intermediate', percent: 55 }
  ],
  tools: [
    { name: 'Git', icon: FaGitAlt, color: '#f1502f', level: 'Expert', percent: 85 },
    { name: 'GitHub', icon: FaGithub, color: '#ffffff', level: 'Expert', percent: 88 },
    { name: 'Docker', icon: FaDocker, color: '#2496ed', level: 'Intermediate', percent: 55 },
    { name: 'Linux', icon: FaLinux, color: '#fcc624', level: 'Intermediate', percent: 60 },
    { name: 'AWS', icon: FaAws, color: '#ff9900', level: 'Beginner', percent: 30 }
  ]
}
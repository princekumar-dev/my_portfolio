<div align="center">

# 👋 Prince R — Portfolio

**Modern, fully-animated personal portfolio for an AI & Data Science Engineer**

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-4-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-animated-EB459E?style=flat-square&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

**[🔗 Live Demo](https://princekumar-dev.github.io/my_portfolio/)** · **[🌐 GitHub](https://github.com/princekumar-dev/my_portfolio)** · **[💼 LinkedIn](https://www.linkedin.com/in/prince-r-b9685130b)**

</div>

---

## 📖 About

A light-first, fully animated portfolio website showcasing projects, skills, certifications, and experience. Built with **React 18** and **Vite** for blazing-fast builds, animated with **Framer Motion**, styled with **Tailwind CSS**, and scrolled with **Lenis** smooth scrolling.

Highlights include a custom cursor, 3D tilt cards, parallax sections, a scroll progress bar, and an animated dark-mode toggle that ripples outward in a unique random wave every time.

**Featured projects on the site:** [Academics](https://github.com/princekumar-dev/Academics--2), [Connect](https://github.com/princekumar-dev/Connect), [Busy Bot](https://github.com/princekumar-dev/Busy_Bot), and more.

## ✨ Features

**🎨 Design**
- Light theme with an animated dark-mode toggle (wave-ripple transition from the button you press)
- Elegant typography — Playfair Display, Sora, Inter, and JetBrains Mono
- Fully responsive: mobile, tablet, and desktop
- Respects `prefers-reduced-motion` for accessibility

**🎬 Animation & Interaction**
- Lenis-powered smooth scrolling with parallax sections
- Custom cursor with pointer context
- 3D tilt cards on projects
- Staggered hero text animations and scroll-triggered reveals
- Scroll progress bar and scroll-to-top button
- Animated gradient background

**⚡ Engineering**
- Lazy-loaded sections via `React.lazy` + `Suspense` for code splitting
- Error boundary so a bad section never blanks the whole page
- Manual Vite chunks (react-vendor / framer / icons)
- Brotli + gzip pre-compression
- SEO-ready: Open Graph + Twitter card meta, theme-color, font preconnect
- Auto-deploy to **GitHub Pages** on every push

**📄 Sections**
Navigation · Hero · About · Skills · Projects · Experience · Certifications · Contact · Footer

## 🛠️ Tech Stack

| Category | Tools |
|----------|-------|
| Frontend | React 18, JavaScript (ES2020) |
| Build | Vite 4, PostCSS, Autoprefixer |
| Styling | Tailwind CSS 3 |
| Animation | Framer Motion, Lenis (smooth scroll) |
| Icons | React Icons |
| Deployment | GitHub Pages (Actions), Vercel, Netlify |

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18 or newer
- npm (or yarn / pnpm)

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/princekumar-dev/my_portfolio.git
cd my_portfolio

# 2. Install dependencies
npm install

# 3. Start the dev server (opens at http://localhost:3000)
npm run dev
```

### Production build

```bash
npm run build     # output in dist/
npm run preview   # preview the production build locally
```

## 📁 Project Structure

```
my_portfolio/
├── index.html                 # SEO meta, fonts, OG/Twitter cards
├── vite.config.js             # Vite build + compression + chunking
├── tailwind.config.js         # Custom color palette & typography
├── .github/workflows/
│   └── static.yml             # Auto-deploy to GitHub Pages
└── src/
    ├── components/
    │   ├── Navigation.jsx     # Sticky nav with scroll detection
    │   ├── Hero.jsx           # Animated intro + parallax
    │   ├── About.jsx          # Personal intro with stats
    │   ├── Skills.jsx         # Categorized tech stack
    │   ├── Projects.jsx       # 3D tilt project cards
    │   ├── Experience.jsx     # Animated timeline
    │   ├── Certifications.jsx # Certifications grid
    │   ├── Contact.jsx        # Contact + social links
    │   ├── Footer.jsx         # Footer with quick links
    │   ├── Cursor.jsx         # Custom cursor
    │   ├── TiltCard.jsx       # 3D tilt wrapper
    │   ├── AnimatedBackground.jsx
    │   ├── ScrollProgressBar.jsx
    │   └── ScrollToTop.jsx
    ├── context/               # Pointer, Scroll, SmoothScroll, Theme, Tilt
    ├── hooks/                 # useActiveSection, useSectionParallax
    ├── data/                  # skills, projects, experience, certifications
    ├── App.jsx                # Providers, lazy sections, error boundary
    ├── main.jsx               # Entry point
    └── index.css              # Global styles
```

All content lives in `src/data/*.js` — edit those files to make the portfolio yours without touching any components.

## 🎨 Customization

| What | Where |
|------|-------|
| Name, title, resume link | `src/components/Hero.jsx` |
| Bio & stats | `src/components/About.jsx` |
| Skills & categories | `src/data/skillsData.js` |
| Projects | `src/data/projectsData.js` |
| Experience timeline | `src/data/experienceData.js` |
| Certifications | `src/data/certificationsData.js` |
| Email & social links | `src/components/Contact.jsx` |
| Colors & fonts | `tailwind.config.js` |

## 🌐 Deployment

**GitHub Pages** (included) — the workflow in `.github/workflows/static.yml` builds with Vite and deploys `dist/` automatically on every push to `main`. Enable *Settings → Pages → Source: GitHub Actions*.

**Vercel** — import the repo at [vercel.com](https://vercel.com); framework auto-detected, done.

**Netlify** — run `npm run build`, then drag the `dist/` folder onto [netlify.com/drop](https://app.netlify.com/drop).

## ⚡ Performance

- Section-level code splitting keeps the initial bundle tiny
- Vendor chunks split into react / framer / icons bundles
- Pre-compressed Brotli + gzip assets served by the host
- Non-blocking Google Fonts (`preconnect` + `media="print"` swap)
- Theme-aware `theme-color` meta keeps mobile browser chrome on-palette

## 🌍 Browser Support

Chrome · Firefox · Safari · Edge (latest versions)

## 📄 License

MIT — free to use, modify, and share. A credit is appreciated but not required.

## 📬 Contact

- **Email:** prince55833kuma@gmail.com
- **LinkedIn:** [Prince R](https://www.linkedin.com/in/prince-r-b9685130b)
- **GitHub:** [@princekumar-dev](https://github.com/princekumar-dev)

---

<div align="center">

**Built with ❤️ by Prince R**

</div>

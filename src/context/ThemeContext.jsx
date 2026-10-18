import { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { flushSync } from 'react-dom'

const ThemeContext = createContext()

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const applyThemeClass = (dark) => {
  const root = document.documentElement
  if (dark) root.classList.add('dark')
  else root.classList.remove('dark')
}

// Matches the site's body gradients; Android Chrome paints its status/URL
// bar with the theme-color meta, so these keep the browser chrome on-palette.
const THEME_COLOR = { dark: '#0F172A', light: '#FAFBFC' }

/* Origin + wavefront for the theme spread, measured from the toggle button so
   the ripple grows out of the control the user pressed. The front is an
   organic "wave": three sine bands whose lobe counts, weights, phases,
   amplitude and per-point jitter are ALL re-rolled on every toggle, so no two
   spreads ever share the same flow — each one leaks out in its own random
   pattern instead of a perfect circle. Both path variants share the same point
   structure so the browser interpolates them frame-by-frame. */

const rand = (min, max) => min + Math.random() * (max - min)

const setSpreadOrigin = (source) => {
  const root = document.documentElement

  // Measure the control's SETTLED position: the fixed nav slides in/out with
  // a transform, so a tap right as it settles would otherwise anchor the wave
  // to its mid-flight spot. Neutralize ancestor transforms just for the read.
  const neutralized = []
  let node = source
  while (node && node !== document.body) {
    if (node.style && node.style.transform && node.style.transform !== 'none') {
      neutralized.push([node, node.style.transform])
      node.style.transform = 'none'
    }
    node = node.parentElement
  }

  const rect =
    source && typeof source.getBoundingClientRect === 'function'
      ? source.getBoundingClientRect()
      : null

  for (const [el, t] of neutralized) el.style.transform = t

  // The clip resolves against the view-transition ROOT group, whose box is the
  // viewport — not the document canvas. So the wave is built in viewport
  // space; a document-space build put the whole wave one screenful above the
  // button whenever the page was scrolled.
  const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2
  const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2
  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
  const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

  // Reach the farthest viewport CORNER. Comparing viewport x against
  // document-space vw collapsed the radius to ~150px once scrolled, so the
  // spread never made it out of the top of the screen.
  const endRadius = Math.hypot(Math.max(x, vw - x), Math.max(y, vh - y))

  // Roll a fresh wavefront: lobe count, band frequencies, band weights,
  // phases and amplitude — different on every single toggle.
  const points = 64 + 2 * Math.floor(rand(0, 9)) // 64..80 lobes, always even
  const p1 = rand(0, Math.PI * 2)
  const p2 = rand(0, Math.PI * 2)
  const p3 = rand(0, Math.PI * 2)
  const k1 = 2 + Math.floor(rand(0, 3)) // 2..4 lobes (slow drift)
  const k2 = 4 + Math.floor(rand(0, 4)) // 4..7 lobes (mid waves)
  const k3 = 7 + Math.floor(rand(0, 5)) // 7..11 lobes (fine ripples)
  const w1 = rand(0.3, 0.5)
  const w2 = rand(0.2, 0.35)
  const w3 = Math.max(0.15, 1 - w1 - w2) // weights sum to 1 -> w stays in [0,1]
  const amp = rand(0.28, 0.55)

  const radii = []
  for (let i = 0; i < points; i++) {
    const th = (i / points) * Math.PI * 2
    // weighted sum of three sine bands, each normalised to [0, 1] -> w in [0,1]
    const w =
      w1 * ((1 + Math.sin(th * k1 + p1)) / 2) +
      w2 * ((1 + Math.sin(th * k2 + p2)) / 2) +
      w3 * ((1 + Math.sin(th * k3 + p3)) / 2)
    // tiny per-point jitter: an irregular, hand-drawn edge on top of the waves
    const jitter = rand(-0.015, 0.015)
    // clamped at endRadius so every corner stays covered at full spread
    radii.push(endRadius * Math.max(1, 1 + amp * w + jitter))
  }

  const build = (rAt) => {
    let d = ''
    for (let i = 0; i < points; i++) {
      const th = (i / points) * Math.PI * 2
      const px = (x + rAt(i) * Math.cos(th)).toFixed(1)
      const py = (y + rAt(i) * Math.sin(th)).toFixed(1)
      d += (i === 0 ? 'M ' : ' L ') + px + ' ' + py
    }
    return `path("${d} Z")`
  }

  root.style.setProperty('--wave-start', build(() => 1))
  root.style.setProperty('--wave-end', build((i) => radii[i]))
}

export const ThemeProvider = ({ children }) => {
  const spreadSeqRef = useRef(0)
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme')
      if (saved) return saved === 'dark'
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  })

  useEffect(() => {
    applyThemeClass(isDark)
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
    // Keep the mobile browser chrome (Android status/URL bar) on the site's
    // palette — it only re-reads theme-color when the meta content changes.
    const color = isDark ? THEME_COLOR.dark : THEME_COLOR.light
    document
      .querySelectorAll('meta[name="theme-color"]')
      .forEach((m) => m.setAttribute('content', color))
  }, [isDark])

  // `origin` is the toggle ELEMENT (not the React event). React nulls
  // `event.currentTarget` after the handler returns, so an event handed to a
  // setTimeout arrives with a null target and the wave anchors on <body>.
  const toggleTheme = useCallback(
    (origin) => {
      const next = !isDark
      const canSpread =
        typeof document !== 'undefined' &&
        typeof document.startViewTransition === 'function' &&
        !prefersReducedMotion()

      if (canSpread) {
        // next=true (light -> dark): the new theme wave-grows out of the button.
        // next=false (dark -> light): the old theme wave-shrinks back into it —
        // the same motion reversed, like an undo. The direction is handed to
        // CSS through custom properties (animation-name interpolates fine, and
        // the view-transition pseudos inherit them from <html>).
        const root = document.documentElement
        root.dataset.themeSpread = next ? 'forward' : 'reverse'
        if (next) {
          root.style.setProperty('--vt-new-anim', 'themeSpreadNew')
          root.style.setProperty('--vt-old-anim', 'none')
          root.style.setProperty('--vt-new-z', '999999')
          root.style.setProperty('--vt-old-z', '1')
        } else {
          root.style.setProperty('--vt-new-anim', 'none')
          root.style.setProperty('--vt-old-anim', 'themeSpreadReverse')
          root.style.setProperty('--vt-new-z', '1')
          root.style.setProperty('--vt-old-z', '999999')
        }
        setSpreadOrigin(
          origin && typeof origin.getBoundingClientRect === 'function'
            ? origin
            : // Last resort: the aria-label is unique to the toggle, so this
              // still anchors the wave on the control rather than <body>.
              document.querySelector('[aria-label*="mode"]')
        )

        // Pre-snapshot freeze: the two things that make capturing the page
        // expensive are decorative CSS animations and backdrop-filters (nav,
        // glass cards, logo frost). The `is-scrolling` class already suppresses
        // both, so borrowing it lets the spread start on the very next frame
        // instead of hitching on the capture — the blurs fade back over 0.18s
        // once the transition finishes, so nothing pops.
        root.classList.add('is-scrolling')
        root.setAttribute('data-theme-animating', '1')
        const mySeq = ++spreadSeqRef.current

        const transition = document.startViewTransition(() => {
          flushSync(() => setIsDark(next))
          applyThemeClass(next)
        })

        const release = () => {
          // A newer toggle owns the flag now — let it clean up instead.
          if (spreadSeqRef.current !== mySeq) return
          root.classList.remove('is-scrolling')
          root.removeAttribute('data-theme-animating')
        }
        if (transition?.finished) transition.finished.then(release, release)
        else window.setTimeout(release, 2300)
        return
      }

      // Fallback: fade colours instead of hard-cutting (no View Transitions).
      const root = document.documentElement
      root.classList.add('theme-fallback')
      window.clearTimeout(root._themeFallbackTimer)
      root._themeFallbackTimer = window.setTimeout(
        () => root.classList.remove('theme-fallback'),
        650
      )
      setIsDark(next)
      applyThemeClass(next)
    },
    [isDark]
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e) => {
      if (!localStorage.getItem('theme')) setIsDark(e.matches)
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const value = useMemo(() => ({ isDark, toggleTheme }), [isDark, toggleTheme])

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

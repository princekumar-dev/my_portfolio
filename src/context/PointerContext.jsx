import { createContext, useContext, useEffect, useRef, useState, useMemo } from 'react'
import { useMotionValue } from 'framer-motion'

const PointerContext = createContext(null)

export const PointerProvider = ({ children }) => {
  const clientX = useMotionValue(-100)
  const clientY = useMotionValue(-100)
  const nx = useMotionValue(0)
  const ny = useMotionValue(0)
  const frameRef = useRef(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    let timeout
    const check = () => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window || navigator.maxTouchPoints > 0)
      }, 200)
    }
    check()
    window.addEventListener('resize', check)
    return () => { clearTimeout(timeout); window.removeEventListener('resize', check) }
  }, [])

  useEffect(() => {
    if (isMobile) return

    const handlePointer = (e) => {
      cancelAnimationFrame(frameRef.current)
      frameRef.current = requestAnimationFrame(() => {
        clientX.set(e.clientX)
        clientY.set(e.clientY)
        nx.set((e.clientX / window.innerWidth) * 2 - 1)
        ny.set((e.clientY / window.innerHeight) * 2 - 1)
      })
    }
    window.addEventListener('pointermove', handlePointer, { passive: true })
    return () => {
      window.removeEventListener('pointermove', handlePointer)
      cancelAnimationFrame(frameRef.current)
    }
  }, [isMobile, clientX, clientY, nx, ny])

  const value = useMemo(() => ({ clientX, clientY, nx, ny }), [clientX, clientY, nx, ny])

  return (
    <PointerContext.Provider value={value}>
      {children}
    </PointerContext.Provider>
  )
}

export const usePointer = () => {
  const ctx = useContext(PointerContext)
  if (!ctx) throw new Error('usePointer must be used within PointerProvider')
  return ctx
}

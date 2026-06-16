import { createContext, useContext, useEffect, useRef } from 'react'
import { useMotionValue } from 'framer-motion'

const PointerContext = createContext(null)

export const PointerProvider = ({ children }) => {
  const clientX = useMotionValue(-100)
  const clientY = useMotionValue(-100)
  const nx = useMotionValue(0)
  const ny = useMotionValue(0)
  const frameRef = useRef(0)

  useEffect(() => {
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
  }, [clientX, clientY, nx, ny])

  return (
    <PointerContext.Provider value={{ clientX, clientY, nx, ny }}>
      {children}
    </PointerContext.Provider>
  )
}

export const usePointer = () => {
  const ctx = useContext(PointerContext)
  if (!ctx) throw new Error('usePointer must be used within PointerProvider')
  return ctx
}

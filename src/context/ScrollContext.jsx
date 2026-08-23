import { createContext, useContext } from 'react'
import { useScroll } from 'framer-motion'

const ScrollContext = createContext(null)

export const ScrollProvider = ({ children }) => {
  const { scrollYProgress } = useScroll()

  return (
    <ScrollContext.Provider value={{ scrollYProgress }}>
      {children}
    </ScrollContext.Provider>
  )
}

export const useSharedScroll = () => {
  const ctx = useContext(ScrollContext)
  if (!ctx) throw new Error('useSharedScroll must be used within ScrollProvider')
  return ctx
}

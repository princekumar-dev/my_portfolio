import { createContext, useContext, useRef, useCallback, useMemo } from 'react'

const TiltContext = createContext({
  rotateX: 0,
  rotateY: 0,
  isActive: false,
  cardRect: null,
  setTilt: () => {},
  clearTilt: () => {},
})

export const useTiltContext = () => useContext(TiltContext)

export const TiltProvider = ({ children }) => {
  const rotateXRef = useRef(0)
  const rotateYRef = useRef(0)
  const isActiveRef = useRef(false)
  const cardRectRef = useRef(null)

  const setTilt = useCallback(({ x, y, rect, active }) => {
    rotateXRef.current = x
    rotateYRef.current = y
    isActiveRef.current = active
    if (rect) cardRectRef.current = rect
  }, [])

  const clearTilt = useCallback(() => {
    rotateXRef.current = 0
    rotateYRef.current = 0
    isActiveRef.current = false
    cardRectRef.current = null
  }, [])

  const value = useMemo(() => ({
    get rotateX() { return rotateXRef.current },
    get rotateY() { return rotateYRef.current },
    get isActive() { return isActiveRef.current },
    get cardRect() { return cardRectRef.current },
    setTilt,
    clearTilt,
  }), [setTilt, clearTilt])

  return (
    <TiltContext.Provider value={value}>
      {children}
    </TiltContext.Provider>
  )
}

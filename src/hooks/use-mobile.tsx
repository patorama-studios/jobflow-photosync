
import React, { useState, useEffect, useCallback } from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const [isMounted, setIsMounted] = useState<boolean>(false)

  // Memoize the resize handler for better performance
  const checkMobile = useCallback(() => {
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
  }, [])
  
  useEffect(() => {
    // Set mounted state
    setIsMounted(true)
    
    // Set initial state
    checkMobile()
    
    // Add event listener for resize with improved debounce
    let resizeTimer: ReturnType<typeof setTimeout>
    
    const handleResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer)
      resizeTimer = setTimeout(checkMobile, 100)
    }
    
    // Use passive event listener for better performance
    window.addEventListener("resize", handleResize, { passive: true })
    
    // Clean up
    return () => {
      window.removeEventListener("resize", handleResize)
      clearTimeout(resizeTimer)
    }
  }, [checkMobile])

  // Return false for SSR
  return isMounted ? isMobile : false
}

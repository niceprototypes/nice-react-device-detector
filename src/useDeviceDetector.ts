import { useEffect, useState } from "react"

const BREAKPOINT_SM = 480

const checkMobile = (setIsMobile: (isMobile: boolean) => void) => {
  const userAgent = typeof window.navigator === "undefined" ? "" : navigator.userAgent

  // Debug flag - check localStorage and URL parameters
  const debugMobile =
    localStorage.getItem("debug-mobile") === "true" ||
    new URLSearchParams(window.location.search).get("mobile") === "true"

  if (debugMobile) {
    setIsMobile(true)
    return
  }

  // Enhanced mobile detection including Chrome DevTools mobile emulation
  const mobileUserAgent = Boolean(
    userAgent.match(
      /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop|Mobile|mobile/i
    )
  )

  // Check for touch capability
  const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0

  // Check viewport width using BREAKPOINT_SM from variables
  const smallScreen = window.innerWidth <= BREAKPOINT_SM

  // Check if using Chrome DevTools device emulation
  const isDevToolsMobile = hasTouch && smallScreen

  setIsMobile(mobileUserAgent || isDevToolsMobile)
}

export const useDeviceDetector = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Initial check
    checkMobile(setIsMobile)

    // Create a resize handler that calls checkMobile with the setter
    const handleResize = () => {
      checkMobile(setIsMobile)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return isMobile
}

export default useDeviceDetector
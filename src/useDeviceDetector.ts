import { useEffect, useState } from "react"

/**
 * Breakpoint threshold (in pixels) for determining small screen devices.
 * Screens with width <= 480px are considered mobile-sized.
 *
 * @constant {number}
 * @default 480
 */
const BREAKPOINT_SM = 480

/**
 * Performs comprehensive mobile device detection using multiple heuristics.
 *
 * This function employs a multi-layered detection strategy:
 * 1. **Debug Mode**: Checks localStorage and URL parameters for forced mobile mode
 * 2. **User Agent Detection**: Analyzes the browser's user agent string
 * 3. **Touch Capability**: Detects if the device supports touch events
 * 4. **Screen Size**: Evaluates viewport width against the mobile breakpoint
 * 5. **DevTools Emulation**: Identifies Chrome DevTools mobile emulation mode
 *
 * The detection prioritizes debug flags for development/testing purposes, then
 * falls back to production detection methods that combine user agent analysis
 * with physical device characteristics.
 *
 * @param {(isMobile: boolean) => void} setIsMobile - State setter function to update mobile status
 *
 * @example
 * // Used internally by useDeviceDetector
 * const [isMobile, setIsMobile] = useState(false)
 * checkMobile(setIsMobile) // Updates isMobile state based on detection
 *
 * @remarks
 * Debug mode can be activated by:
 * - Setting localStorage item "debug-mobile" to "true"
 * - Adding "?mobile=true" to the URL query string
 */
const checkMobile = (setIsMobile: (isMobile: boolean) => void) => {
  const userAgent = typeof window.navigator === "undefined" ? "" : navigator.userAgent

  // Debug flag - check localStorage and URL parameters
  // This allows developers to test mobile-specific features without actual mobile devices
  const debugMobile =
    localStorage.getItem("debug-mobile") === "true" ||
    new URLSearchParams(window.location.search).get("mobile") === "true"

  if (debugMobile) {
    setIsMobile(true)
    return
  }

  // Enhanced mobile detection including Chrome DevTools mobile emulation
  // Matches common mobile device identifiers in the user agent string
  const mobileUserAgent = Boolean(
    userAgent.match(
      /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop|Mobile|mobile/i
    )
  )

  // Check for touch capability
  // Modern mobile devices support touch events, while most desktop browsers don't
  const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0

  // Check viewport width using BREAKPOINT_SM from variables
  // Small screen width is a strong indicator of mobile devices
  const smallScreen = window.innerWidth <= BREAKPOINT_SM

  // Check if using Chrome DevTools device emulation
  // Combines touch capability with small screen to catch emulated mobile environments
  const isDevToolsMobile = hasTouch && smallScreen

  // Device is considered mobile if EITHER:
  // - User agent indicates a mobile device, OR
  // - Device exhibits mobile characteristics (touch + small screen)
  setIsMobile(mobileUserAgent || isDevToolsMobile)
}

/**
 * React hook for detecting mobile devices with support for various detection methods.
 *
 * This hook provides real-time mobile device detection that responds to window resize
 * events, making it suitable for responsive applications. It uses a combination of
 * user agent analysis, touch capability detection, and screen size evaluation.
 *
 * **Detection Methods:**
 * - User agent string parsing (identifies iOS, Android, and other mobile platforms)
 * - Touch event support detection
 * - Viewport width analysis (threshold: 480px)
 * - Chrome DevTools mobile emulation support
 * - Debug mode via localStorage or URL parameters
 *
 * **Debug Mode:**
 * Enable mobile mode for testing by:
 * - Adding `?mobile=true` to the URL
 * - Setting `localStorage.setItem("debug-mobile", "true")`
 *
 * @returns {boolean} `true` if a mobile device is detected, `false` otherwise
 *
 * @example
 * // Basic usage - direct hook call
 * function MyComponent() {
 *   const isMobile = useDeviceDetector()
 *
 *   return (
 *     <div>
 *       {isMobile ? (
 *         <MobileLayout />
 *       ) : (
 *         <DesktopLayout />
 *       )}
 *     </div>
 *   )
 * }
 *
 * @example
 * // Conditional rendering based on device type
 * function Navigation() {
 *   const isMobile = useDeviceDetector()
 *
 *   return isMobile ? <HamburgerMenu /> : <FullNavBar />
 * }
 *
 * @example
 * // Testing mobile-specific features in development
 * // Add ?mobile=true to your URL or run in console:
 * // localStorage.setItem("debug-mobile", "true")
 * // Then refresh the page
 *
 * @remarks
 * - The hook sets up a resize event listener for dynamic detection
 * - Event listener is automatically cleaned up when component unmounts
 * - Initial detection runs on mount before any resize events
 * - SSR-safe: returns `false` during server-side rendering
 *
 * @see {@link DeviceProvider} For context-based alternative that prevents multiple detections
 * @see {@link useDevice} For accessing device state from DeviceProvider context
 */
export const useDeviceDetector = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Initial check on component mount
    // This ensures the correct device type is detected immediately
    checkMobile(setIsMobile)

    // Create a resize handler that calls checkMobile with the setter
    // This allows dynamic detection when:
    // - User rotates their device
    // - Browser window is resized
    // - DevTools device emulation is toggled
    const handleResize = () => {
      checkMobile(setIsMobile)
    }

    // Listen for window resize events to update detection in real-time
    window.addEventListener("resize", handleResize)

    // Cleanup function to prevent memory leaks
    // Removes event listener when component unmounts
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return isMobile
}

export default useDeviceDetector
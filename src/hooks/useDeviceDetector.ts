import { useEffect, useMemo, useState } from "react"
import { checkMobile } from "../services/checkMobile"

/**
 * Default list of substrings matched against `navigator.userAgent` to flag
 * a request as coming from a mobile device. Joined with `|` into a
 * case-insensitive RegExp. Override via `useDeviceDetector({ userAgents })`
 * or the `userAgents` prop on `DeviceProvider`.
 *
 * Entries are treated as regex source fragments — they are joined as-is, not
 * escaped, so consumers can pass plain substrings (the common case) or
 * regex fragments if needed.
 */
export const DEFAULT_MOBILE_USER_AGENTS: readonly string[] = [
  "Android",
  "BlackBerry",
  "iPhone",
  "iPad",
  "iPod",
  "Opera Mini",
  "IEMobile",
  "WPDesktop",
  "Mobile",
  "mobile",
]

/**
 * Options accepted by `useDeviceDetector`.
 *
 * @property {string[]} [userAgents] - Substrings matched against `navigator.userAgent`
 *   to flag the request as mobile. Defaults to `DEFAULT_MOBILE_USER_AGENTS`.
 */
export interface UseDeviceDetectorOptions {
  userAgents?: readonly string[]
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
 * - Viewport width analysis (threshold: 640px, aligned with nice-styles "small")
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
export const useDeviceDetector = (options: UseDeviceDetectorOptions = {}) => {
  const { userAgents = DEFAULT_MOBILE_USER_AGENTS } = options
  const [isMobile, setIsMobile] = useState(false)

  // Keying on the joined string (not the array reference) keeps the RegExp
  // stable when consumers pass inline literals — otherwise the resize listener
  // would tear down on every render. Joining inside the handler would also
  // rebuild on every viewport event.
  const userAgentPattern = userAgents.join("|")
  const userAgentRegex = useMemo(
    () => new RegExp(userAgentPattern, "i"),
    [userAgentPattern]
  )

  useEffect(() => {
    // Initial check on component mount
    // This ensures the correct device type is detected immediately
    checkMobile(setIsMobile, userAgentRegex)

    // Create a resize handler that calls checkMobile with the setter
    // This allows dynamic detection when:
    // - User rotates their device
    // - Browser window is resized
    // - DevTools device emulation is toggled
    const handleResize = () => {
      checkMobile(setIsMobile, userAgentRegex)
    }

    // Listen for window resize events to update detection in real-time
    window.addEventListener("resize", handleResize)

    // Cleanup function to prevent memory leaks
    // Removes event listener when component unmounts
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [userAgentRegex])

  return isMobile
}

export default useDeviceDetector

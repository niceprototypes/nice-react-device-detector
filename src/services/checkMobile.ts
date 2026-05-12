/**
 * Breakpoint threshold (in pixels) for determining small screen devices.
 * Screens with width <= 640px are considered mobile-sized. Aligned with
 * the `small` breakpoint in nice-styles so `isMobile` and
 * `breakpoint === "small"` map 1:1.
 *
 * @constant {number}
 * @default 640
 */
const BREAKPOINT_SM = 640

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
 * @param {RegExp} userAgentRegex - Compiled regex of mobile user-agent identifiers
 *
 * @remarks
 * Debug mode can be activated by:
 * - Setting localStorage item "debug-mobile" to "true"
 * - Adding "?mobile=true" to the URL query string
 */
export const checkMobile = (
  setIsMobile: (isMobile: boolean) => void,
  userAgentRegex: RegExp
) => {
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
  // Matches the configurable list of mobile user-agent identifiers
  const mobileUserAgent = Boolean(userAgent.match(userAgentRegex))

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
/**
 * @fileoverview
 * React Device Detector - A comprehensive library for mobile device detection.
 *
 * This library provides two flexible approaches for device detection in React applications:
 *
 * **1. Hook-based approach** (useDeviceDetector):
 * - Direct, component-level detection
 * - Simple to use for one-off needs
 * - Each component gets its own detection instance
 *
 * **2. Context-based approach** (DeviceProvider + useDevice):
 * - Centralized detection with shared state
 * - More efficient for multiple components
 * - Single detection instance for entire app/section
 *
 * @example
 * // Hook approach - Simple usage
 * import { useDeviceDetector } from 'nice-react-device-detector'
 *
 * function MyComponent() {
 *   const isMobile = useDeviceDetector()
 *   return <div>{isMobile ? 'Mobile' : 'Desktop'}</div>
 * }
 *
 * @example
 * // Context approach - Better for multiple components
 * import { DeviceProvider, useDevice } from 'nice-react-device-detector'
 *
 * function App() {
 *   return (
 *     <DeviceProvider>
 *       <Header />
 *       <Content />
 *     </DeviceProvider>
 *   )
 * }
 *
 * function Header() {
 *   const { isMobile } = useDevice()
 *   return <header>{isMobile ? 'Mobile Header' : 'Desktop Header'}</header>
 * }
 *
 * @module nice-react-device-detector
 * @version 1.2.0
 * @license MIT
 */

/**
 * Re-export of the main device detection hook and its default export.
 *
 * **useDeviceDetector** is a React hook that provides real-time mobile device detection.
 * It uses multiple detection methods including user agent parsing, touch capability,
 * screen size evaluation, and debug mode support.
 *
 * @see {@link useDeviceDetector} For detailed documentation and usage examples
 */
export { useDeviceDetector, default, DEFAULT_MOBILE_USER_AGENTS } from "./hooks/useDeviceDetector"
export type { UseDeviceDetectorOptions } from "./hooks/useDeviceDetector"

/**
 * Re-export of the Context API components for shared device detection state.
 *
 * **DeviceProvider** - Context provider that performs detection once and shares state
 * **useDevice** - Hook to access device state from DeviceProvider context
 *
 * Use this approach when multiple components in your app need device detection,
 * as it's more efficient than calling useDeviceDetector() in each component.
 *
 * @see {@link DeviceProvider} For provider component documentation
 * @see {@link useDevice} For consumer hook documentation
 */
export { DeviceProvider, useDevice } from "./components/DeviceProvider"
export type { DeviceProviderProps } from "./components/DeviceProvider"

export { checkMobile } from "./services"

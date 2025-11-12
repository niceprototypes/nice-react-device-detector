import React, { createContext, useContext } from 'react'
import { useDeviceDetector } from './useDeviceDetector'

/**
 * Type definition for the Device Context value.
 *
 * Encapsulates device detection state that is shared across the component tree.
 *
 * @interface DeviceContextType
 * @property {boolean} isMobile - Indicates whether the current device is detected as mobile
 */
interface DeviceContextType {
  isMobile: boolean
}

/**
 * React Context for sharing device detection state across the component tree.
 *
 * This context is created with an undefined initial value to enforce the use
 * of DeviceProvider. Attempting to use useDevice() outside of a DeviceProvider
 * will throw a descriptive error.
 *
 * @internal
 * @see {@link DeviceProvider} Provider component that supplies the context value
 * @see {@link useDevice} Hook for consuming this context
 */
const DeviceContext = createContext<DeviceContextType | undefined>(undefined)

/**
 * Context Provider component for device detection state.
 *
 * This component performs device detection once at the provider level and shares
 * the result with all descendant components via React Context. This approach is
 * more efficient than calling `useDeviceDetector()` in multiple components, as it:
 * - Performs detection logic only once
 * - Sets up a single resize event listener instead of multiple
 * - Reduces overall performance overhead in large applications
 *
 * **When to Use:**
 * - Multiple components need device detection in your app
 * - You want to centralize device detection logic
 * - Performance optimization is a priority
 *
 * **When to Use `useDeviceDetector()` Instead:**
 * - Only one or two components need device detection
 * - You prefer component-level control
 * - You're building a small application
 *
 * @component
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Child components that will have access to device state
 *
 * @returns {JSX.Element} Provider component wrapping children with device context
 *
 * @example
 * // Typical app-level usage
 * function App() {
 *   return (
 *     <DeviceProvider>
 *       <Header />
 *       <MainContent />
 *       <Footer />
 *     </DeviceProvider>
 *   )
 * }
 *
 * @example
 * // Wrapping specific sections
 * function ResponsiveSection() {
 *   return (
 *     <DeviceProvider>
 *       <Navigation />
 *       <Content />
 *       <Sidebar />
 *     </DeviceProvider>
 *   )
 * }
 *
 * @example
 * // Combining with other providers
 * function AppProviders({ children }) {
 *   return (
 *     <ThemeProvider>
 *       <AuthProvider>
 *         <DeviceProvider>
 *           {children}
 *         </DeviceProvider>
 *       </AuthProvider>
 *     </ThemeProvider>
 *   )
 * }
 *
 * @see {@link useDevice} Hook for accessing device state from child components
 * @see {@link useDeviceDetector} Alternative hook-based approach without context
 */
export const DeviceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Perform device detection once at the provider level
  const isMobile = useDeviceDetector()

  return (
    <DeviceContext.Provider value={{ isMobile }}>
      {children}
    </DeviceContext.Provider>
  )
}

/**
 * React hook for accessing device detection state from DeviceProvider context.
 *
 * This hook provides a convenient way to access the shared device detection state
 * in any component within a DeviceProvider tree. It includes built-in error handling
 * to ensure it's used correctly within the provider hierarchy.
 *
 * **Advantages over direct `useDeviceDetector()` calls:**
 * - No duplicate detection logic or event listeners
 * - Consistent state across all components
 * - Better performance in large applications
 * - Single source of truth for device type
 *
 * @returns {DeviceContextType} Object containing device detection state
 * @returns {boolean} returns.isMobile - `true` if mobile device detected, `false` otherwise
 *
 * @throws {Error} Throws an error if used outside of a DeviceProvider component
 *
 * @example
 * // Basic usage in a component
 * function MyComponent() {
 *   const { isMobile } = useDevice()
 *
 *   return (
 *     <div className={isMobile ? 'mobile-layout' : 'desktop-layout'}>
 *       <h1>Welcome</h1>
 *     </div>
 *   )
 * }
 *
 * @example
 * // Conditional styling
 * function Card() {
 *   const { isMobile } = useDevice()
 *
 *   return (
 *     <div style={{
 *       padding: isMobile ? '10px' : '20px',
 *       fontSize: isMobile ? '14px' : '16px'
 *     }}>
 *       Content here
 *     </div>
 *   )
 * }
 *
 * @example
 * // Conditional feature rendering
 * function AdvancedFeatures() {
 *   const { isMobile } = useDevice()
 *
 *   // Hide complex features on mobile
 *   if (isMobile) {
 *     return <SimplifiedView />
 *   }
 *
 *   return <FullFeaturedView />
 * }
 *
 * @example
 * // Error handling - this will throw
 * function BrokenComponent() {
 *   // ERROR: Not wrapped in DeviceProvider!
 *   const { isMobile } = useDevice()
 *   return <div>{isMobile ? 'Mobile' : 'Desktop'}</div>
 * }
 *
 * @example
 * // Correct usage with provider
 * function App() {
 *   return (
 *     <DeviceProvider>
 *       <WorkingComponent />
 *     </DeviceProvider>
 *   )
 * }
 *
 * function WorkingComponent() {
 *   const { isMobile } = useDevice() // ✓ Works correctly
 *   return <div>{isMobile ? 'Mobile' : 'Desktop'}</div>
 * }
 *
 * @see {@link DeviceProvider} Provider component that must wrap components using this hook
 * @see {@link useDeviceDetector} Alternative standalone hook that doesn't require a provider
 */
export const useDevice = () => {
  const context = useContext(DeviceContext)

  // Enforce proper provider usage with a descriptive error message
  if (context === undefined) {
    throw new Error('useDevice must be used within a DeviceProvider')
  }

  return context
}
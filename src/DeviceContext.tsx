import React, { createContext, useContext } from 'react'
import { useDeviceDetector } from './useDeviceDetector'

interface DeviceContextType {
  isMobile: boolean
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined)

export const DeviceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isMobile = useDeviceDetector()

  return (
    <DeviceContext.Provider value={{ isMobile }}>
      {children}
    </DeviceContext.Provider>
  )
}

export const useDevice = () => {
  const context = useContext(DeviceContext)
  if (context === undefined) {
    throw new Error('useDevice must be used within a DeviceProvider')
  }
  return context
}
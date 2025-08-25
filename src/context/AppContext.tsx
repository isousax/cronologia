import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

type AppContextType = {
  startDate: Date
}

const AppContext = createContext<AppContextType | undefined>(undefined)

type AppProviderProps = {
  children: ReactNode
  startDate?: string | Date
}

export function AppProvider({ children, startDate: startDateProp }: AppProviderProps) {
  const [startDate] = useState<Date>(
    startDateProp
      ? typeof startDateProp === 'string'
        ? new Date(startDateProp)
        : startDateProp
      : new Date(2025, 6, 4)
  )

  return (
    <AppContext.Provider value={{ startDate }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type Theme = 'light' | 'dark'

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const STORAGE_KEY = 'xmad-theme-preference'

const lightTokens: Record<string, string> = {
  '--bg': '0 0% 98%',
  '--fg': '220 17% 17%',
  '--surface': '0 0% 100%',
  '--surface-muted': '210 20% 96%',
  '--muted': '214 15% 90%',
  '--muted-foreground': '215 15% 45%',
  '--accent': '221 83% 53%',
  '--accent-foreground': '0 0% 100%',
  '--border': '213 18% 85%',
  '--ring': '221 83% 53%',
}

const darkTokens: Record<string, string> = {
  '--bg': '222 47% 11%',
  '--fg': '213 31% 91%',
  '--surface': '222 36% 14%',
  '--surface-muted': '222 26% 19%',
  '--muted': '217 19% 22%',
  '--muted-foreground': '218 11% 65%',
  '--accent': '221 83% 60%',
  '--accent-foreground': '214 32% 95%',
  '--border': '217 19% 27%',
  '--ring': '221 83% 60%',
}

function getPreferredTheme(): Theme {
  if (typeof window === 'undefined') return 'light'

  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => getPreferredTheme())

  useEffect(() => {
    if (typeof window === 'undefined') return

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const listener = (event: MediaQueryListEvent) => {
      setThemeState(event.matches ? 'dark' : 'light')
    }

    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [])

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, next)
    }
  }, [])

  const toggle = useCallback(() => {
    setThemeState((prevTheme) => {
      const nextTheme: Theme = prevTheme === 'light' ? 'dark' : 'light'
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, nextTheme)
      }
      return nextTheme
    })
  }, [])

  const tokens = theme === 'dark' ? darkTokens : lightTokens

  const contextValue = useMemo(
    () => ({ theme, setTheme, toggle }),
    [theme, setTheme, toggle],
  )

  return (
    <ThemeContext.Provider value={contextValue}>
      <div data-theme={theme} style={tokens as React.CSSProperties}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

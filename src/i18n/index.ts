import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

export const SUPPORTED_LANGUAGES = ['en', 'zh-CN'] as const
export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number]

export const LANGUAGE_STORAGE_KEY = 'nova-locale'

export const NAV_PATH_KEYS: Record<string, `nav.${string}`> = {
  '/': 'nav.dashboard',
  '/projects': 'nav.projects',
  '/analytics': 'nav.analytics',
  '/team': 'nav.team',
  '/templates': 'nav.templates',
  '/billing': 'nav.billing',
  '/settings': 'nav.settings',
}

function isAppLanguage(value: string | null): value is AppLanguage {
  return value === 'en' || value === 'zh-CN'
}

function readStoredLanguage(): AppLanguage | null {
  try {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
    return isAppLanguage(stored) ? stored : null
  } catch {
    return null
  }
}

function detectLanguage(): AppLanguage {
  const stored = readStoredLanguage()
  if (stored) return stored
  const browser = window.navigator.language.toLowerCase()
  return browser.startsWith('zh') ? 'zh-CN' : 'en'
}

export function persistLanguage(language: string) {
  const next: AppLanguage = isAppLanguage(language) ? language : 'en'
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, next)
  } catch {
    /* ignore quota / private mode */
  }
  document.documentElement.lang = next
}

export function resolveAppLanguage(language: string): AppLanguage {
  if (language.toLowerCase().startsWith('zh')) return 'zh-CN'
  return 'en'
}

const initialLanguage = detectLanguage()
persistLanguage(initialLanguage)

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    'zh-CN': { translation: zhCN },
  },
  lng: initialLanguage,
  fallbackLng: 'en',
  supportedLngs: [...SUPPORTED_LANGUAGES],
  interpolation: {
    escapeValue: false,
  },
})

i18n.on('languageChanged', persistLanguage)

export default i18n

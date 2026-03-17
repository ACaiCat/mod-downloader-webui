import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import zh from './zh'
import en from './en'

const locales = { zh, en }

const I18nContext = createContext()

function getNestedValue(obj, path) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj)
}

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem('mod-dl-lang')
    if (saved && locales[saved]) return saved
    const browserLang = navigator.language.toLowerCase()
    return browserLang.startsWith('zh') ? 'zh' : 'en'
  })

  useEffect(() => {
    localStorage.setItem('mod-dl-lang', lang)
    document.documentElement.lang = lang
  }, [lang])

  const t = useCallback(
    (key) => getNestedValue(locales[lang], key) || key,
    [lang]
  )

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === 'zh' ? 'en' : 'zh'))
  }, [])

  return (
    <I18nContext.Provider value={{ lang, setLang, t, toggleLang }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}

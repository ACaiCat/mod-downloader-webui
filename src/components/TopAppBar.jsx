import { useI18n } from '../i18n/index.jsx'
import { useTheme } from '../hooks/useTheme.jsx'
import './TopAppBar.css'

export default function TopAppBar() {
  const { t, lang, toggleLang } = useI18n()
  const { mode, cycleTheme } = useTheme()

  const themeIcon =
    mode === 'light' ? 'light_mode' : mode === 'dark' ? 'dark_mode' : 'routine'

  return (
    <header className="top-app-bar">
      <div className="top-app-bar__inner">
        <div className="top-app-bar__leading">
          <span className="material-symbols-rounded icon-filled top-app-bar__logo">
            cloud_download
          </span>
          <div className="top-app-bar__titles">
            <h1 className="top-app-bar__title">{t('app.title')}</h1>
            <p className="top-app-bar__subtitle">{t('app.subtitle')}</p>
          </div>
        </div>
        <div className="top-app-bar__actions">
          <button
            className="icon-button md-ripple"
            onClick={cycleTheme}
            aria-label={t(`theme.${mode}`)}
            title={t(`theme.${mode}`)}
          >
            <span className="material-symbols-rounded">{themeIcon}</span>
          </button>
          <button
            className="icon-button md-ripple lang-toggle"
            onClick={toggleLang}
            aria-label={t(`language.${lang === 'zh' ? 'en' : 'zh'}`)}
          >
            <span className="lang-toggle__text">{lang === 'zh' ? 'EN' : '中'}</span>
          </button>
        </div>
      </div>
    </header>
  )
}

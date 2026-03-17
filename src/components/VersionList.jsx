import { useI18n } from '../i18n/index.jsx'
import './VersionList.css'

export default function VersionList({ versions, modId, onSelectVersion, loading }) {
  const { t } = useI18n()

  if (loading) {
    return (
      <div className="version-list animate-fade-in">
        <div className="version-list__loading">
          <span className="version-list__spinner" />
          <span>{t('versions.loading')}</span>
        </div>
      </div>
    )
  }

  if (!versions) return null

  if (versions.length === 0) {
    return (
      <div className="version-list animate-fade-in">
        <div className="version-list__empty">
          <span className="material-symbols-rounded version-list__empty-icon">
            inventory_2
          </span>
          <p>{t('versions.empty')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="version-list animate-fade-in">
      <div className="version-list__header">
        <span className="material-symbols-rounded">layers</span>
        <h2 className="version-list__title">
          {t('versions.title')} — <span className="version-list__mod-id">{modId}</span>
        </h2>
      </div>
      <p className="version-list__subtitle">{t('versions.selectVersion')}</p>
      <div className="version-list__grid">
        {versions.map((v, i) => (
          <button
            key={v.name}
            className="version-card md-ripple"
            onClick={() => onSelectVersion(v.name)}
          >
            <div className="version-card__leading">
              <span className="material-symbols-rounded version-card__icon">
                folder
              </span>
            </div>
            <div className="version-card__content">
              <span className="version-card__name">{v.name}</span>
              {v.lastModified && (
                <span className="version-card__date">{v.lastModified}</span>
              )}
            </div>
            <span className="material-symbols-rounded version-card__arrow">
              chevron_right
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

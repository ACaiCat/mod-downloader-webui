import { useI18n } from '../i18n/index.jsx'
import { getDownloadUrl } from '../services/api.js'
import './FileList.css'

export default function FileList({ files, modId, version, onBack, loading }) {
  const { t } = useI18n()

  if (loading) {
    return (
      <div className="file-list animate-fade-in">
        <div className="file-list__loading">
          <span className="file-list__spinner" />
          <span>{t('versions.loading')}</span>
        </div>
      </div>
    )
  }

  if (!files) return null

  return (
    <div className="file-list animate-fade-in">
      <div className="file-list__nav">
        <button className="file-list__back md-ripple" onClick={onBack}>
          <span className="material-symbols-rounded">arrow_back</span>
          <span>{t('files.back')}</span>
        </button>
      </div>

      <div className="file-list__header">
        <span className="material-symbols-rounded">description</span>
        <h2 className="file-list__title">
          {t('files.title')} — <span className="file-list__version">{version}</span>
        </h2>
      </div>

      {files.length === 0 ? (
        <div className="file-list__empty">
          <span className="material-symbols-rounded file-list__empty-icon">
            folder_off
          </span>
          <p>{t('files.empty')}</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="file-table-wrapper">
            <table className="file-table">
              <thead>
                <tr>
                  <th>{t('files.name')}</th>
                  <th>{t('files.size')}</th>
                  <th>{t('files.lastModified')}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {files.map((f, i) => (
                  <tr key={f.name}>
                    <td className="file-table__name">
                      <span className="material-symbols-rounded file-table__file-icon">
                        {f.isDirectory ? 'folder' : 'draft'}
                      </span>
                      <span>{f.name}</span>
                    </td>
                    <td className="file-table__size">{f.size || '—'}</td>
                    <td className="file-table__date">{f.lastModified || '—'}</td>
                    <td className="file-table__action">
                      {!f.isDirectory && (
                        <a
                          href={getDownloadUrl(modId, version, f.name)}
                          className="file-download-btn md-ripple"
                          download
                        >
                          <span className="material-symbols-rounded">download</span>
                          <span className="file-download-btn__label">{t('files.download')}</span>
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="file-cards">
            {files.map((f, i) => (
              <div key={f.name} className="file-card">
                <div className="file-card__main">
                  <span className="material-symbols-rounded file-card__icon">
                    {f.isDirectory ? 'folder' : 'draft'}
                  </span>
                  <div className="file-card__info">
                    <span className="file-card__name">{f.name}</span>
                    <span className="file-card__meta">
                      {f.size && <span>{f.size}</span>}
                      {f.lastModified && <span>{f.lastModified}</span>}
                    </span>
                  </div>
                </div>
                {!f.isDirectory && (
                  <a
                    href={getDownloadUrl(modId, version, f.name)}
                    className="file-card__download md-ripple"
                    download
                  >
                    <span className="material-symbols-rounded">download</span>
                  </a>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

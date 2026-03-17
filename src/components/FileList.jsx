import { useState, useEffect, useCallback } from 'react'
import { useI18n } from '../i18n/index.jsx'
import { getDownloadUrl, getDirectoryContents } from '../services/api.js'
import './FileList.css'

export default function FileList({ files, modId, version, onBack, loading }) {
  const { t } = useI18n()

  // navStack: array of subfolder names representing current path within the version
  const [navStack, setNavStack] = useState([])
  const [subFiles, setSubFiles] = useState(null)
  const [navLoading, setNavLoading] = useState(false)
  const [navError, setNavError] = useState(null)

  // Reset folder navigation whenever the selected version changes
  useEffect(() => {
    setNavStack([])
    setSubFiles(null)
    setNavError(null)
  }, [version])

  const currentFiles = navStack.length === 0 ? files : subFiles
  const isLoading = loading || navLoading

  const navigateTo = useCallback(async (targetStack) => {
    if (targetStack.length === 0) {
      setNavStack([])
      setSubFiles(null)
      setNavError(null)
      return
    }
    setNavLoading(true)
    setNavError(null)
    try {
      const result = await getDirectoryContents(modId, version, targetStack)
      if (result === null) {
        setNavError(t('error.notFound'))
      } else {
        setNavStack(targetStack)
        setSubFiles(result)
      }
    } catch {
      setNavError(t('error.server'))
    } finally {
      setNavLoading(false)
    }
  }, [modId, version, t])

  const handleFolderClick = (folderName) => navigateTo([...navStack, folderName])

  const handleBack = () => {
    if (navStack.length > 0) {
      navigateTo(navStack.slice(0, -1))
    } else {
      onBack()
    }
  }

  if (isLoading) {
    return (
      <div className="file-list animate-fade-in">
        <div className="file-list__loading">
          <span className="file-list__spinner" />
          <span>{t('versions.loading')}</span>
        </div>
      </div>
    )
  }

  if (!currentFiles) return null

  // If the current directory contains a zip, it's a resource pack — show only the zip
  const zipFile = currentFiles.find(f => !f.isDirectory && f.name.toLowerCase().endsWith('.zip'))
  const isResourcePack = !!zipFile
  const displayFiles = isResourcePack ? [zipFile] : currentFiles

  // breadcrumbs[0] = version root (or modId for flat depots), breadcrumbs[1..] = navStack entries
  const rootLabel = version || modId
  const breadcrumbs = [rootLabel, ...navStack]

  return (
    <div className="file-list animate-fade-in">
      <div className="file-list__nav">
        <button className="file-list__back md-ripple" onClick={handleBack}>
          <span className="material-symbols-rounded">arrow_back</span>
          <span>{navStack.length > 0 ? t('files.backToParent') : t('files.back')}</span>
        </button>
      </div>

      <div className="file-list__header">
        <span className="material-symbols-rounded">
          {isResourcePack ? 'folder_zip' : navStack.length > 0 ? 'folder_open' : 'description'}
        </span>
        <h2 className="file-list__title">
          {isResourcePack ? t('files.titleResourcePack') : t('files.title')} —{' '}
          <span className="file-list__breadcrumb">
            {breadcrumbs.map((seg, i) => (
              <span key={i}>
                {i > 0 && <span className="file-list__breadcrumb-sep"> / </span>}
                {i < breadcrumbs.length - 1 ? (
                  <button
                    className="file-list__breadcrumb-btn"
                    onClick={() => navigateTo(navStack.slice(0, i))}
                  >
                    {seg}
                  </button>
                ) : (
                  <span className="file-list__version">{seg}</span>
                )}
              </span>
            ))}
          </span>
        </h2>
      </div>

      {navError && <div className="file-list__error">{navError}</div>}

      {currentFiles.length === 0 ? (
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
                {displayFiles.map((f) => (
                  <tr
                    key={f.name}
                    className={f.isDirectory ? 'file-table__row--folder' : ''}
                    onClick={f.isDirectory ? () => handleFolderClick(f.name) : undefined}
                  >
                    <td className="file-table__name">
                      <span className="material-symbols-rounded file-table__file-icon">
                        {f.isDirectory ? 'folder' : 'draft'}
                      </span>
                      <span>{f.name}</span>
                    </td>
                    <td className="file-table__size">{f.size || '—'}</td>
                    <td className="file-table__date">{f.lastModified || '—'}</td>
                    <td className="file-table__action">
                      {f.isDirectory ? (
                        <button
                          className="file-folder-btn md-ripple"
                          onClick={() => handleFolderClick(f.name)}
                        >
                          <span className="material-symbols-rounded">chevron_right</span>
                        </button>
                      ) : (
                        <a
                          href={getDownloadUrl(modId, version, f.name, navStack)}
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
            {displayFiles.map((f) => (
              <div
                key={f.name}
                className={`file-card${f.isDirectory ? ' file-card--folder' : ''}`}
                onClick={f.isDirectory ? () => handleFolderClick(f.name) : undefined}
              >
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
                {f.isDirectory ? (
                  <span className="material-symbols-rounded file-card__folder-arrow">chevron_right</span>
                ) : (
                  <a
                    href={getDownloadUrl(modId, version, f.name, navStack)}
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

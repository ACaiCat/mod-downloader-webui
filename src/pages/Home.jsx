import { useState, useCallback, useEffect } from 'react'
import { useI18n } from '../i18n/index.jsx'
import SearchBar from '../components/SearchBar.jsx'
import VersionList from '../components/VersionList.jsx'
import FileList from '../components/FileList.jsx'
import Snackbar from '../components/Snackbar.jsx'
import { submitDownload, getModVersions, getModFiles, getStorageInfo } from '../services/api.js'
import './Home.css'

function classifyError(err) {
  const msg = err?.message || ''
  if (msg.includes('Failed to fetch') || msg.includes('NetworkError') || msg.includes('TypeError')) {
    return 'network'
  }
  if (msg.includes('404')) return 'notFound'
  if (msg.startsWith('HTTP 5')) return 'server'
  return 'server'
}

const QUEUE_ERROR_MAP = {
  'already downloaded within a day': 'queueError.alreadyDownloaded',
  'Failed to post queue! Too many queued items': 'queueError.tooManyQueued',
}

function translateQueueError(msg, t) {
  const lower = (msg || '').toLowerCase()
  for (const [key, i18nKey] of Object.entries(QUEUE_ERROR_MAP)) {
    if (lower.includes(key.toLowerCase())) {
      return t(i18nKey)
    }
  }
  return msg || t('search.queueFailed')
}

function formatBytes(bytes) {
  if (bytes == null || bytes < 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let i = 0
  let val = bytes
  while (val >= 1024 && i < units.length - 1) {
    val /= 1024
    i++
  }
  return `${val.toFixed(i === 0 ? 0 : 2)} ${units[i]}`
}

export default function Home() {
  const { t } = useI18n()

  const [modId, setModId] = useState('')
  const [versions, setVersions] = useState(null)
  const [selectedVersion, setSelectedVersion] = useState(null)
  const [files, setFiles] = useState(null)
  const [searchLoading, setSearchLoading] = useState(false)
  const [queueLoading, setQueueLoading] = useState(false)
  const [fileLoading, setFileLoading] = useState(false)
  const [storageInfo, setStorageInfo] = useState(null)
  const [snackbar, setSnackbar] = useState({ message: '', type: 'info' })

  useEffect(() => {
    if (!snackbar.message) return
    const timer = setTimeout(() => setSnackbar({ message: '', type: 'info' }), 4000)
    return () => clearTimeout(timer)
  }, [snackbar.message])

  useEffect(() => {
    getStorageInfo()
      .then(setStorageInfo)
      .catch(() => {})
  }, [])

  const showSnackbar = (message, type = 'info') => {
    setSnackbar({ message, type })
  }

  // Query versions only
  const handleSearch = useCallback(async (id) => {
    setModId(id)
    setVersions(null)
    setSelectedVersion(null)
    setFiles(null)
    setSearchLoading(true)

    try {
      const result = await getModVersions(id)
      if (result === null) {
        showSnackbar(t('versions.notFound'), 'error')
      } else {
        // Flat depot: zip present at root → it's a resource pack, no version subdirs
        const hasZip = result.some(f => !f.isDirectory && f.name.toLowerCase().endsWith('.zip'))
        if (hasZip) {
          setSelectedVersion('')
          setFiles(result)
        } else {
          const dirs = result.filter(v => v.isDirectory && !v.name.endsWith('.json'))
          const looksLikeVersions = dirs.some(v => /^\d/.test(v.name))
          const sorted = [...dirs].sort((a, b) => looksLikeVersions
            ? b.name.localeCompare(a.name, undefined, { numeric: true })
            : a.name.localeCompare(b.name))
          setVersions(sorted)
        }
      }
    } catch (err) {
      showSnackbar(t(`error.${classifyError(err)}`), 'error')
    } finally {
      setSearchLoading(false)
    }
  }, [t])

  // Add to download queue only
  const handleQueue = useCallback(async (id) => {
    setQueueLoading(true)
    try {
      await submitDownload(id)
      showSnackbar(t('search.submitted'), 'success')
    } catch (err) {
      const msg = err?.message || ''
      showSnackbar(translateQueueError(msg, t), 'error')
    } finally {
      setQueueLoading(false)
    }
  }, [t])

  const handleSelectVersion = useCallback(async (version) => {
    setSelectedVersion(version)
    setFiles(null)
    setFileLoading(true)

    try {
      const result = await getModFiles(modId, version)
      if (result === null) {
        showSnackbar(t('error.notFound'), 'error')
        setSelectedVersion(null)
      } else {
        setFiles(result)
      }
    } catch (err) {
      showSnackbar(t(`error.${classifyError(err)}`), 'error')
      setSelectedVersion(null)
    } finally {
      setFileLoading(false)
    }
  }, [modId, t])

  const handleBack = useCallback(() => {
    setSelectedVersion(null)
    setFiles(null)
  }, [])

  return (
    <div className="home">
      <section className="home__hero">
        <div className="home__hero-content animate-slide-up">
          <span className="material-symbols-rounded icon-filled home__hero-icon">
            cloud_download
          </span>
          <h2 className="home__hero-title">{t('app.title')}</h2>
          <p className="home__hero-desc">{t('app.subtitle')}</p>
          <div className="storage-bar">
            <div className="storage-bar__header">
              <span className="material-symbols-rounded storage-bar__icon">database</span>
              <span className="storage-bar__label">{t('storage.title')}</span>
              <span className="storage-bar__value">
                {storageInfo
                  ? `${formatBytes(storageInfo.totalSize - storageInfo.availableFreeSpace)} / ${formatBytes(storageInfo.totalSize)}`
                  : t('storage.loading')}
              </span>
            </div>
            <div className="storage-bar__track">
              <div
                className="storage-bar__fill"
                style={{ width: storageInfo
                  ? `${Math.min(100, ((storageInfo.totalSize - storageInfo.availableFreeSpace) / storageInfo.totalSize) * 100)}%`
                  : '0%' }}
              />
            </div>
          </div>
        </div>
        <SearchBar
          onSearch={handleSearch}
          onQueue={handleQueue}
          loading={searchLoading}
          queueLoading={queueLoading}
        />
      </section>

      <section className="home__results">
        {selectedVersion === null ? (
          <VersionList
            versions={versions}
            modId={modId}
            onSelectVersion={handleSelectVersion}
            loading={searchLoading}
          />
        ) : (
          <FileList
            files={files}
            modId={modId}
            version={selectedVersion}
            onBack={handleBack}
            loading={fileLoading}
          />
        )}
      </section>

      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        onClose={() => setSnackbar({ message: '', type: 'info' })}
      />

      <section className="home__usage">
        <h3 className="home__usage-title">
          <span className="material-symbols-rounded">help_outline</span>
          {t('usage.title')}
        </h3>
        <ol className="home__usage-steps">
          {t('usage.steps').map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
        <ul className="home__usage-tips">
          {t('usage.tips').map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}

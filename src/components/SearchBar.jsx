import { useState } from 'react'
import { useI18n } from '../i18n/index.jsx'
import { extractModId } from '../services/api.js'
import './SearchBar.css'

export default function SearchBar({ onSearch, onQueue, loading, queueLoading }) {
  const { t } = useI18n()
  const [input, setInput] = useState('')
  const [error, setError] = useState('')

  const getValidId = () => {
    const modId = extractModId(input)
    if (!modId) {
      setError(t('error.invalidInput'))
      return null
    }
    setError('')
    return modId
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const modId = getValidId()
    if (modId) onSearch(modId)
  }

  const handleQueue = (e) => {
    e.preventDefault()
    const modId = getValidId()
    if (modId) onQueue(modId)
  }

  return (
    <div className="search-bar animate-slide-up">
      <form className={`search-bar__field ${error ? 'search-bar__field--error' : ''}`} onSubmit={handleSearch}>
        <span className="material-symbols-rounded search-bar__icon">search</span>
        <input
          type="text"
          className="search-bar__input"
          placeholder={t('search.placeholder')}
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            if (error) setError('')
          }}
          disabled={loading || queueLoading}
          autoComplete="off"
        />
        {input && (
          <button
            type="button"
            className="icon-button search-bar__clear"
            onClick={() => { setInput(''); setError('') }}
            aria-label="Clear"
          >
            <span className="material-symbols-rounded">close</span>
          </button>
        )}
      </form>
      <div className="search-bar__actions">
        <button
          className="search-bar__btn search-bar__btn--query md-ripple"
          disabled={loading || !input.trim()}
          onClick={handleSearch}
        >
          {loading ? <span className="search-bar__spinner" /> : <span className="material-symbols-rounded">folder_open</span>}
          <span>{t('search.button')}</span>
        </button>
        <button
          className="search-bar__btn search-bar__btn--queue md-ripple"
          disabled={queueLoading || !input.trim()}
          onClick={handleQueue}
        >
          {queueLoading ? <span className="search-bar__spinner search-bar__spinner--dark" /> : <span className="material-symbols-rounded">add_to_queue</span>}
          <span>{t('search.queue')}</span>
        </button>
      </div>
      {error && (
        <p className="search-bar__hint search-bar__hint--error">{error}</p>
      )}
    </div>
  )
}

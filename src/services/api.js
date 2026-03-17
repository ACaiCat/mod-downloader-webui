/**
 * Parse HTML directory listing from the server into structured data.
 * Extracts name, size, and lastModified from the table rows.
 */

const API_BASE = 'https://workshop.755757.xyz'
function parseDirectoryListing(html) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const rows = doc.querySelectorAll('table tr')
  const items = []

  rows.forEach((row) => {
    const cells = row.querySelectorAll('td')
    if (cells.length < 3) return

    const anchor = cells[0].querySelector('a')
    if (!anchor) return

    const name = anchor.textContent.trim()
    // Skip parent directory and hidden directories
    if (name === '..' || name.startsWith('.')) return

    const href = anchor.getAttribute('href') || ''
    const size = cells[1].textContent.trim()
    const lastModified = cells[2].textContent.trim()
    const isDirectory = href.endsWith('/')

    items.push({
      name: name,
      size: size === '-' ? null : size,
      lastModified: lastModified === '-' ? null : lastModified,
      isDirectory,
    })
  })

  return items
}

/**
 * Submit a mod URL or ID to the download queue.
 * POST /api/downloader/queue
 */
export async function submitDownload(urlOrId) {
  const res = await fetch(`${API_BASE}/api/downloader/queue`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ UrlOrId: urlOrId }),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`HTTP ${res.status}${text ? ': ' + text.slice(0, 100) : ''}`)
  }
  // Response may be empty or non-JSON
  const text = await res.text()
  let data = {}
  try { data = JSON.parse(text) } catch { /* empty */ }
  if (data.isSuccess === false) {
    throw new Error(data.message || 'Queue request failed')
  }
  return data
}

/**
 * Get available versions of a mod.
 * GET /depots/{id}/
 */
export async function getModVersions(modId) {
  const res = await fetch(`${API_BASE}/depots/${encodeURIComponent(modId)}/`)
  if (res.status === 404) {
    return null
  }
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`)
  }
  const html = await res.text()
  return parseDirectoryListing(html)
}

/**
 * Get files for a specific version of a mod.
 * GET /depots/{id}/{version}
 */
export async function getModFiles(modId, version) {
  const res = await fetch(
    `${API_BASE}/depots/${encodeURIComponent(modId)}/${encodeURIComponent(version)}/`
  )
  if (res.status === 404) {
    return null
  }
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`)
  }
  const html = await res.text()
  return parseDirectoryListing(html)
}

/**
 * Get the download URL for a specific mod file.
 * GET /depots/{id}/{version}/{mod}
 */
export function getDownloadUrl(modId, version, fileName) {
  return `${API_BASE}/depots/${encodeURIComponent(modId)}/${encodeURIComponent(version)}/${encodeURIComponent(fileName)}`
}

/**
 * Get server storage info (free space and total size).
 * GET /api/downloader/available-free-space
 */
export async function getStorageInfo() {
  const res = await fetch(`${API_BASE}/api/downloader/available-free-space`)
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`)
  }
  return res.json()
}

/**
 * Extract mod ID from a Steam Workshop URL or raw ID string.
 */
export function extractModId(input) {
  if (!input || typeof input !== 'string') return null
  const trimmed = input.trim()

  // Pure numeric ID
  if (/^\d+$/.test(trimmed)) {
    return trimmed
  }

  // Steam Workshop URL patterns
  try {
    const url = new URL(trimmed)
    const id = url.searchParams.get('id')
    if (id && /^\d+$/.test(id)) {
      return id
    }
  } catch {
    // Not a valid URL, ignore
  }

  // Fallback: extract any number sequence from the string
  const match = trimmed.match(/(\d{5,})/)
  return match ? match[1] : null
}

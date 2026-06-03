/* Format utilities */
export const formatDuration = (seconds: number): string => {
  if (!seconds || isNaN(seconds)) return '0:00'
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }
  return `${minutes}:${String(secs).padStart(2, '0')}`
}

export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d)
}

export const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

/* String utilities */
export const truncate = (text: string, length: number): string => {
  return text.length > length ? `${text.slice(0, length)}...` : text
}

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/* Array utilities */
export const shuffle = <T>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export const chunk = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

export const unique = <T>(array: T[], key?: (item: T) => any): T[] => {
  if (key) {
    const seen = new Set()
    return array.filter((item) => {
      const k = key(item)
      if (seen.has(k)) return false
      seen.add(k)
      return true
    })
  }
  return [...new Set(array)]
}

/* Validation utilities */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/* Local Storage utilities */
export const setLocalStorage = (key: string, value: any): void => {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, JSON.stringify(value))
    }
  } catch (error) {
    console.error(`Failed to set localStorage [${key}]:`, error)
  }
}

export const getLocalStorage = <T>(key: string, defaultValue?: T): T | null => {
  try {
    if (typeof window !== 'undefined') {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue ?? null
    }
  } catch (error) {
    console.error(`Failed to get localStorage [${key}]:`, error)
  }
  return defaultValue ?? null
}

export const removeLocalStorage = (key: string): void => {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(key)
    }
  } catch (error) {
    console.error(`Failed to remove localStorage [${key}]:`, error)
  }
}

/* Debounce utility */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

/* Throttle utility */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/* Color utilities */
export const getImageDominantColor = async (imageUrl: string): Promise<string | null> => {
  try {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = imageUrl

    return new Promise((resolve) => {
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          resolve(null)
          return
        }
        ctx.drawImage(img, 0, 0)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data

        let r = 0, g = 0, b = 0
        for (let i = 0; i < data.length; i += 4) {
          r += data[i]
          g += data[i + 1]
          b += data[i + 2]
        }

        const pixelCount = data.length / 4
        r = Math.floor(r / pixelCount)
        g = Math.floor(g / pixelCount)
        b = Math.floor(b / pixelCount)

        resolve(`rgb(${r}, ${g}, ${b})`)
      }
      img.onerror = () => resolve(null)
    })
  } catch {
    return null
  }
}

/* Sleep utility */
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

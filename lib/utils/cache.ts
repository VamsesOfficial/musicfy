import NodeCache from 'node-cache'

class CacheManager {
  private memoryCache: NodeCache
  private localCache: Map<string, { data: any; expires: number }>

  constructor() {
    this.memoryCache = new NodeCache({ stdTTL: 600 })
    this.localCache = new Map()
  }

  set(key: string, data: any, ttl: number = 600, strategy: 'memory' | 'local' = 'memory') {
    if (strategy === 'memory') {
      this.memoryCache.set(key, data, ttl)
    } else {
      const expires = Date.now() + ttl * 1000
      this.localCache.set(key, { data, expires })
    }
  }

  get(key: string, strategy: 'memory' | 'local' = 'memory'): any | undefined {
    if (strategy === 'memory') {
      return this.memoryCache.get(key)
    } else {
      const item = this.localCache.get(key)
      if (!item) return undefined
      
      if (item.expires < Date.now()) {
        this.localCache.delete(key)
        return undefined
      }

      return item.data
    }
  }

  delete(key: string, strategy: 'memory' | 'local' = 'memory') {
    if (strategy === 'memory') {
      this.memoryCache.del(key)
    } else {
      this.localCache.delete(key)
    }
  }

  clear(strategy?: 'memory' | 'local') {
    if (!strategy || strategy === 'memory') {
      this.memoryCache.flushAll()
    }
    if (!strategy || strategy === 'local') {
      this.localCache.clear()
    }
  }

  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number = 600,
    strategy: 'memory' | 'local' = 'memory'
  ): Promise<T> {
    const cached = this.get(key, strategy)
    if (cached) return cached

    const data = await fetcher()
    this.set(key, data, ttl, strategy)
    return data
  }
}

export const cache = new CacheManager()

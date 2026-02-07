interface CacheStrategy {
  ttl: number;
  fallback: () => Promise<any>;
  validation: (data: any) => boolean;
}

export class IntelligentCache {
  private cache = new Map();
  private strategies = new Map<string, CacheStrategy>();

  setStrategy(key: string, strategy: CacheStrategy) {
    this.strategies.set(key, strategy);
  }

  async get(key: string): Promise<any> {
    const cached = this.cache.get(key);
    if (cached && Date.now() < cached.expiry) {
      return cached.data;
    }
    
    const strategy = this.strategies.get(key);
    if (!strategy) throw new Error(`No strategy for key: ${key}`);
    
    try {
      const data = await strategy.fallback();
      if (strategy.validation(data)) {
        this.set(key, data, strategy.ttl);
        return data;
      }
    } catch (error) {
      console.error(`Cache fallback failed for ${key}:`, error);
    }
    
    return cached?.data;
  }

  set(key: string, data: any, ttl: number) {
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttl
    });
  }
}

export const cache = new IntelligentCache();

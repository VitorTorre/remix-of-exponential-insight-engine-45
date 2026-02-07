import { createClient } from '@supabase/supabase-js';
import { cache } from '../../lib/cache';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: { persistSession: true, autoRefreshToken: true },
  }
);

// Configurar cache para dados de mercado
cache.setStrategy('market_data', {
  ttl: 1000 * 30,
  fallback: async () => {
    const { data, error } = await supabase
      .from('market_data')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(100);
    
    if (error) throw error;
    return data;
  },
  validation: (data) => Array.isArray(data) && data.length > 0
});

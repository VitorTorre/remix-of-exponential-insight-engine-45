import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OpportunityScore {
  asset: string;
  score: number;
  signal: 'BUY' | 'SELL';
  confidence: number;
  nextCandles: {
    timeframe: string;
    prediction: 'UP' | 'DOWN';
    probability: number;
  }[];
  orderFlow: {
    buyVolume: number;
    sellVolume: number;
    ratio: number;
  };
  newsImpact: {
    sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
    relevance: number;
  };
  technicalStrength: number;
}

// Simulação de análise de fluxo de ordens e notícias
function analyzeMarketData(asset: string): OpportunityScore {
  const basePrice = 1000 + Math.random() * 50000;
  
  // Simulação de fluxo de ordens
  const buyVolume = Math.random() * 1000000;
  const sellVolume = Math.random() * 1000000;
  const ratio = buyVolume / (buyVolume + sellVolume);
  
  // Simulação de impacto de notícias
  const sentiments = ['POSITIVE', 'NEGATIVE', 'NEUTRAL'] as const;
  const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
  const relevance = Math.random();
  
  // Análise técnica agregada
  const rsi = 30 + Math.random() * 40;
  const macd = (Math.random() - 0.5) * 2;
  const volume = Math.random() * 100;
  
  // Força técnica (0-1)
  let technicalStrength = 0;
  if (rsi < 30) technicalStrength += 0.3;
  if (rsi > 70) technicalStrength += 0.3;
  if (macd > 0) technicalStrength += 0.2;
  if (volume > 70) technicalStrength += 0.2;
  technicalStrength += ratio * 0.3;
  
  // Predição para próximas velas
  const timeframes = ['1M', '2M', '3M', '5M', '10M'];
  const nextCandles = timeframes.map(tf => ({
    timeframe: tf,
    prediction: (ratio > 0.5 && sentiment !== 'NEGATIVE') ? 'UP' : 'DOWN' as 'UP' | 'DOWN',
    probability: 0.6 + Math.random() * 0.3
  }));
  
  // Score final (0-100)
  let score = 0;
  score += technicalStrength * 40;
  score += ratio * 30;
  score += (sentiment === 'POSITIVE' ? 20 : sentiment === 'NEGATIVE' ? -10 : 5);
  score += relevance * 10;
  score = Math.max(0, Math.min(100, score));
  
  const signal = ratio > 0.5 ? 'BUY' : 'SELL';
  const confidence = technicalStrength;
  
  return {
    asset,
    score,
    signal,
    confidence,
    nextCandles,
    orderFlow: {
      buyVolume,
      sellVolume,
      ratio
    },
    newsImpact: {
      sentiment,
      relevance
    },
    technicalStrength
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Lista de ativos para análise
    const assets = [
      'BTC/USD', 'ETH/USD', 'EUR/USD', 'GBP/USD', 'GOLD',
      'AAPL', 'TSLA', 'NVDA', 'S&P500', 'SOL/USD',
      'BNB/USD', 'ADA/USD', 'XRP/USD', 'DOGE/USD'
    ];

    // Analisar todos os ativos
    const opportunities = assets.map(asset => analyzeMarketData(asset));
    
    // Ordenar por score (top 5)
    const topOpportunities = opportunities
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    // Buscar histórico de operações para aprendizado
    const { data: historicalData } = await supabase
      .from('signal_analysis')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    // Calcular métricas de aprendizado
    const successfulOps = historicalData?.filter(op => op.actual_result === 'WIN') || [];
    const failedOps = historicalData?.filter(op => op.actual_result === 'LOSS') || [];
    
    const learningInsights = {
      topSuccessPatterns: successfulOps.slice(0, 10).map(op => ({
        asset: op.asset,
        signal: op.signal,
        confidence: op.confidence,
        strategies: op.strategies
      })),
      topFailurePatterns: failedOps.slice(0, 10).map(op => ({
        asset: op.asset,
        signal: op.signal,
        confidence: op.confidence,
        strategies: op.strategies
      }))
    };

    return new Response(
      JSON.stringify({
        success: true,
        topOpportunities,
        learningInsights,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in market-opportunities:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MarketAnalysisRequest {
  asset: string;
  timeframe?: string;
}

interface TechnicalIndicators {
  rsi: number;
  macd: number;
  ema: number;
  volume: number;
  trend: "bullish" | "bearish" | "neutral";
}

// Simulação de análise técnica baseada na lógica do Python
function calculateTechnicalIndicators(asset: string): TechnicalIndicators {
  // Simular RSI (0-100)
  const rsi = Math.random() * 100;
  
  // Simular MACD (-2 a +2)
  const macd = (Math.random() - 0.5) * 4;
  
  // Simular EMA (preço base)
  const ema = 1000 + (Math.random() * 1000);
  
  // Simular Volume (0-100)
  const volume = Math.random() * 100;
  
  // Determinar tendência baseado em indicadores
  let trend: "bullish" | "bearish" | "neutral" = "neutral";
  
  if (rsi > 60 && macd > 0.5) {
    trend = "bullish";
  } else if (rsi < 40 && macd < -0.5) {
    trend = "bearish";
  }
  
  return {
    rsi: Number(rsi.toFixed(2)),
    macd: Number(macd.toFixed(2)),
    ema: Number(ema.toFixed(2)),
    volume: Number(volume.toFixed(2)),
    trend
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { asset, timeframe = "5m" }: MarketAnalysisRequest = await req.json();
    
    if (!asset) {
      return new Response(
        JSON.stringify({ error: "Asset is required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Analyzing ${asset} on ${timeframe} timeframe`);
    
    // Calcular indicadores técnicos
    const indicators = calculateTechnicalIndicators(asset);
    
    // Simular dados de mercado (histórico de velas)
    const marketData = [];
    const basePrice = 1000 + (Math.random() * 500);
    
    for (let i = 0; i < 50; i++) {
      const volatility = 0.02;
      const change = (Math.random() - 0.5) * volatility;
      const open = basePrice * (1 + change);
      const close = open * (1 + (Math.random() - 0.5) * volatility);
      const high = Math.max(open, close) * (1 + Math.random() * volatility * 0.5);
      const low = Math.min(open, close) * (1 - Math.random() * volatility * 0.5);
      
      marketData.push({
        timestamp: new Date(Date.now() - (50 - i) * 60000).toISOString(),
        open: Number(open.toFixed(2)),
        high: Number(high.toFixed(2)),
        low: Number(low.toFixed(2)),
        close: Number(close.toFixed(2)),
        volume: Math.floor(Math.random() * 10000) + 1000
      });
    }
    
    const response = {
      asset,
      timeframe,
      indicators,
      marketData,
      timestamp: new Date().toISOString()
    };

    console.log(`Analysis completed for ${asset}:`, indicators);

    return new Response(
      JSON.stringify(response),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in market-analysis:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SignalRequest {
  asset: string;
  capital: number;
  timeframe?: string;
}

type SignalType = "COMPRA" | "VENDA" | "NEUTRO";

interface CandlePattern {
  name: string;
  type: "BULLISH" | "BEARISH" | "NEUTRAL";
  strength: number;
}

interface SupportResistance {
  poc: number;
  valueAreaHigh: number;
  valueAreaLow: number;
  resistanceLevels: number[];
  supportLevels: number[];
}

interface StopLoss {
  atrStopLoss: number;
  trailingStop: number;
  riskRewardRatio: number;
}

interface StrategyResult {
  signal: SignalType;
  confidence: number;
  score: number;
  name: string;
}

interface SignalResponse {
  signal: SignalType;
  confidence: number;
  entry: number;
  stopLoss: StopLoss;
  supportResistance: SupportResistance;
  candlePatterns: CandlePattern[];
  indicators: {
    rsi: number;
    macd: number;
    ema: number;
    volume: number;
    atr: number;
    bollingerBands: { upper: number; middle: number; lower: number };
    fibonacci: { level618: number; level50: number; level382: number };
  };
  qiAspects: {
    rsi: number;
    macd: number;
    ema: number;
    volume: number;
  };
  qeAspects: {
    momentumConfidence: number;
    volatilityComfort: number;
    riskAppetite: number;
    marketSentiment: number;
  };
  strategies: StrategyResult[];
  recommendation: string;
}

// Calcular ATR (Average True Range)
function calculateATR(close: number): number {
  const volatility = Math.random() * 0.02 + 0.01; // 1-3% volatilidade simulada
  return close * volatility;
}

// Detectar padrões de candlestick (Fase 2)
function detectCandlePatterns(): CandlePattern[] {
  const patterns: CandlePattern[] = [];
  const rand = Math.random();
  
  if (rand > 0.7) {
    patterns.push({
      name: "Engolfo de Alta",
      type: "BULLISH",
      strength: 0.75 + Math.random() * 0.25
    });
  } else if (rand < 0.3) {
    patterns.push({
      name: "Estrela Cadente",
      type: "BEARISH",
      strength: 0.65 + Math.random() * 0.35
    });
  }
  
  if (Math.random() > 0.8) {
    patterns.push({
      name: "Doji",
      type: "NEUTRAL",
      strength: 0.5 + Math.random() * 0.3
    });
  }
  
  if (Math.random() > 0.85) {
    patterns.push({
      name: "Martelo",
      type: "BULLISH",
      strength: 0.7 + Math.random() * 0.3
    });
  }
  
  return patterns;
}

// Calcular zonas de suporte e resistência baseado em Volume Profile (Fase 1)
function calculateSupportResistance(basePrice: number, atr: number): SupportResistance {
  const poc = basePrice * (1 + (Math.random() - 0.5) * 0.005); // Point of Control
  const valueAreaHigh = poc * (1 + atr * 0.7);
  const valueAreaLow = poc * (1 - atr * 0.7);
  
  const resistanceLevels = [
    basePrice * (1 + atr * 1.5),
    basePrice * (1 + atr * 2.5),
    basePrice * (1 + atr * 3.5)
  ];
  
  const supportLevels = [
    basePrice * (1 - atr * 1.5),
    basePrice * (1 - atr * 2.5),
    basePrice * (1 - atr * 3.5)
  ];
  
  return {
    poc,
    valueAreaHigh,
    valueAreaLow,
    resistanceLevels,
    supportLevels
  };
}

// Calcular Stop Loss dinâmico ATR-based + Trailing Stop (Fase 1)
function calculateStopLoss(
  signal: SignalType,
  entry: number,
  atr: number,
  supportResistance: SupportResistance
): StopLoss {
  let atrStopLoss: number;
  let trailingStop: number;
  
  if (signal === "COMPRA") {
    // Para compra, stop loss abaixo do preço de entrada
    atrStopLoss = entry - (atr * 2); // 2 ATRs abaixo
    trailingStop = Math.max(atrStopLoss, supportResistance.supportLevels[0]);
  } else if (signal === "VENDA") {
    // Para venda, stop loss acima do preço de entrada
    atrStopLoss = entry + (atr * 2); // 2 ATRs acima
    trailingStop = Math.min(atrStopLoss, supportResistance.resistanceLevels[0]);
  } else {
    atrStopLoss = entry;
    trailingStop = entry;
  }
  
  const potentialProfit = Math.abs(
    signal === "COMPRA" 
      ? supportResistance.resistanceLevels[0] - entry
      : entry - supportResistance.supportLevels[0]
  );
  const potentialLoss = Math.abs(entry - atrStopLoss);
  const riskRewardRatio = potentialLoss > 0 ? potentialProfit / potentialLoss : 0;
  
  return {
    atrStopLoss,
    trailingStop,
    riskRewardRatio
  };
}

// ===== ESTRATÉGIA 1: Triple Indicator (RSI + MACD + Bollinger Bands) =====
function strategy1_TripleIndicator(rsi: number, macd: number, price: number, bb: { upper: number; middle: number; lower: number }): StrategyResult {
  let score = 0;
  
  // RSI analysis
  if (rsi < 30) score += 30; // Oversold - buy signal
  else if (rsi > 70) score -= 30; // Overbought - sell signal
  else score += (50 - Math.abs(rsi - 50)) / 5; // Neutral zone
  
  // MACD analysis
  if (macd > 0) score += 25; // Bullish momentum
  else score -= 25; // Bearish momentum
  
  // Bollinger Bands analysis
  if (price < bb.lower) score += 25; // Price at lower band - buy
  else if (price > bb.upper) score -= 25; // Price at upper band - sell
  else score += (bb.middle - price) / (bb.upper - bb.lower) * 10;
  
  score = Math.max(0, Math.min(100, 50 + score));
  
  let signal: SignalType = "NEUTRO";
  if (score >= 65) signal = "COMPRA";
  else if (score <= 35) signal = "VENDA";
  
  return {
    signal,
    confidence: score >= 50 ? score : 100 - score,
    score,
    name: "Triple Indicator"
  };
}

// ===== ESTRATÉGIA 2: EMA Confluence with RSI Divergence =====
function strategy2_EMAConfluence(price: number, ema20: number, ema50: number, ema200: number, rsi: number, prevRsi: number): StrategyResult {
  let score = 50;
  
  // EMA confluence
  const bullishAlignment = ema20 > ema50 && ema50 > ema200;
  const bearishAlignment = ema20 < ema50 && ema50 < ema200;
  
  if (bullishAlignment) score += 25;
  else if (bearishAlignment) score -= 25;
  
  // Price position relative to EMAs
  if (price > ema20 && price > ema50) score += 15;
  else if (price < ema20 && price < ema50) score -= 15;
  
  // RSI divergence detection
  const rsiDivergence = Math.abs(rsi - prevRsi);
  if (rsi < prevRsi && rsiDivergence > 5) score -= 10; // Bearish divergence
  else if (rsi > prevRsi && rsiDivergence > 5) score += 10; // Bullish divergence
  
  score = Math.max(0, Math.min(100, score));
  
  let signal: SignalType = "NEUTRO";
  if (score >= 65) signal = "COMPRA";
  else if (score <= 35) signal = "VENDA";
  
  return {
    signal,
    confidence: score >= 50 ? score : 100 - score,
    score,
    name: "EMA Confluence"
  };
}

// ===== ESTRATÉGIA 3: Price Action + Order Flow =====
function strategy3_PriceActionOrderFlow(price: number, poc: number, valueAreaHigh: number, valueAreaLow: number, volume: number, avgVolume: number): StrategyResult {
  let score = 50;
  
  // Price position in value area
  if (price < valueAreaLow) score += 20; // Below value area - potential buy
  else if (price > valueAreaHigh) score -= 20; // Above value area - potential sell
  else if (Math.abs(price - poc) < (valueAreaHigh - valueAreaLow) * 0.1) score += 10; // Near POC - high volume node
  
  // Order flow (volume analysis)
  const volumeRatio = volume / avgVolume;
  if (volumeRatio > 1.5) {
    if (price > poc) score += 15; // High volume buying
    else score -= 15; // High volume selling
  }
  
  // Market structure
  if (price > poc && price < valueAreaHigh) score += 10; // Bullish structure
  else if (price < poc && price > valueAreaLow) score -= 10; // Bearish structure
  
  score = Math.max(0, Math.min(100, score));
  
  let signal: SignalType = "NEUTRO";
  if (score >= 65) signal = "COMPRA";
  else if (score <= 35) signal = "VENDA";
  
  return {
    signal,
    confidence: score >= 50 ? score : 100 - score,
    score,
    name: "Price Action + Order Flow"
  };
}

// ===== ESTRATÉGIA 4: Fibonacci Retracement with Momentum =====
function strategy4_FibonacciMomentum(price: number, fib: { level618: number; level50: number; level382: number }, macd: number, rsi: number): StrategyResult {
  let score = 50;
  
  // Fibonacci levels analysis
  if (Math.abs(price - fib.level618) < price * 0.002) score += 25; // Near 61.8% - strong level
  else if (Math.abs(price - fib.level50) < price * 0.002) score += 20; // Near 50% - moderate level
  else if (Math.abs(price - fib.level382) < price * 0.002) score += 15; // Near 38.2% - weak level
  
  // Momentum confirmation
  if (macd > 0 && rsi > 50) score += 15; // Bullish momentum
  else if (macd < 0 && rsi < 50) score -= 15; // Bearish momentum
  
  // Direction based on Fib levels
  if (price < fib.level618) score += 10; // Below golden ratio - buy zone
  else if (price > fib.level382) score -= 10; // Above 38.2% - sell zone
  
  score = Math.max(0, Math.min(100, score));
  
  let signal: SignalType = "NEUTRO";
  if (score >= 65) signal = "COMPRA";
  else if (score <= 35) signal = "VENDA";
  
  return {
    signal,
    confidence: score >= 50 ? score : 100 - score,
    score,
    name: "Fibonacci + Momentum"
  };
}

// ===== ESTRATÉGIA 5: Volume Profile Scalping =====
function strategy5_VolumeProfileScalping(price: number, poc: number, atr: number, volume: number, avgVolume: number, timeframe: string): StrategyResult {
  let score = 50;
  
  // Timeframe multiplier (scalping works better in shorter timeframes)
  const tfMultiplier = timeframe === "1m" ? 1.2 : timeframe === "2m" ? 1.1 : timeframe === "3m" ? 1.0 : 0.9;
  
  // Distance from POC (Point of Control)
  const distanceFromPOC = Math.abs(price - poc) / poc;
  
  if (distanceFromPOC < 0.001) score += 20; // Very close to POC - high probability zone
  else if (distanceFromPOC < 0.003) score += 10; // Close to POC
  
  // Volume surge detection
  if (volume > avgVolume * 1.8) score += 20; // Strong volume surge
  else if (volume > avgVolume * 1.3) score += 10; // Moderate volume increase
  
  // Volatility check (scalping needs moderate volatility)
  const volatilityScore = (atr / price) * 10000;
  if (volatilityScore > 5 && volatilityScore < 20) score += 15; // Optimal volatility for scalping
  
  // Price momentum (quick moves)
  if (price > poc) score += 5; // Upward momentum
  else score -= 5; // Downward momentum
  
  score = Math.max(0, Math.min(100, score * tfMultiplier));
  
  let signal: SignalType = "NEUTRO";
  if (score >= 65) signal = "COMPRA";
  else if (score <= 35) signal = "VENDA";
  
  return {
    signal,
    confidence: score >= 50 ? score : 100 - score,
    score,
    name: "Volume Profile Scalping"
  };
}

async function generateAdvancedSignal(
  asset: string, 
  timeframe: string = "1m",
  strategyWeights: Map<string, number> = new Map(),
  recentAnalyses: any[] = []
): Promise<SignalResponse> {
  // Simular preço base
  const basePrice = 50000 + Math.random() * 20000;
  
  // Calcular ATR (Fase 1)
  const atr = calculateATR(basePrice);
  
  // Indicadores Técnicos (QI - Quociente Intelectual)
  const rsi = Math.random() * 100;
  const prevRsi = Math.random() * 100;
  const macd = (Math.random() - 0.5) * 200;
  const ema20 = basePrice * (1 + (Math.random() - 0.5) * 0.05);
  const ema50 = basePrice * (1 + (Math.random() - 0.5) * 0.08);
  const ema200 = basePrice * (1 + (Math.random() - 0.5) * 0.12);
  const volume = Math.random() * 1000000;
  const avgVolume = volume * (0.7 + Math.random() * 0.6);

  // Bollinger Bands
  const bbStdDev = atr * 2;
  const bollingerBands = {
    upper: basePrice + bbStdDev,
    middle: basePrice,
    lower: basePrice - bbStdDev
  };

  // Fibonacci Levels (based on recent swing)
  const swingHigh = basePrice * 1.05;
  const swingLow = basePrice * 0.95;
  const fibonacci = {
    level618: swingLow + (swingHigh - swingLow) * 0.618,
    level50: swingLow + (swingHigh - swingLow) * 0.5,
    level382: swingLow + (swingHigh - swingLow) * 0.382
  };

  // QI Aspects (0-100 cada)
  const qiRsi = rsi > 70 ? 100 - rsi : rsi < 30 ? rsi * 3.33 : 50;
  const qiMacd = macd > 0 ? Math.min(100, macd / 2) : Math.max(0, 50 + macd / 2);
  const qiEma = basePrice > ema20 ? 75 : 25;
  const qiVolume = Math.min(100, (volume / 10000));

  // QE Aspects (Quociente Emocional - sentiment & market conditions)
  const qeMomentum = (qiRsi + qiMacd) / 2;
  const qeVolatility = 50 + (Math.random() - 0.5) * 40;
  const qeRisk = 50 + (Math.random() - 0.5) * 30;
  const qeSentiment = 50 + (Math.random() - 0.5) * 40;

  // Detectar padrões de candlestick (Fase 2)
  const candlePatterns = detectCandlePatterns();
  
  // Calcular zonas de suporte e resistência (Fase 1)
  const supportResistance = calculateSupportResistance(basePrice, atr / basePrice);
  
  // ===== APLICAR AS 5 ESTRATÉGIAS =====
  const strategies: StrategyResult[] = [
    strategy1_TripleIndicator(rsi, macd, basePrice, bollingerBands),
    strategy2_EMAConfluence(basePrice, ema20, ema50, ema200, rsi, prevRsi),
    strategy3_PriceActionOrderFlow(basePrice, supportResistance.poc, supportResistance.valueAreaHigh, supportResistance.valueAreaLow, volume, avgVolume),
    strategy4_FibonacciMomentum(basePrice, fibonacci, macd, rsi),
    strategy5_VolumeProfileScalping(basePrice, supportResistance.poc, atr, volume, avgVolume, timeframe)
  ];

  // ===== ADAPTIVE LEARNING: Apply strategy weights =====
  const weightedStrategies = strategies.map(strategy => {
    const weight = strategyWeights.get(strategy.name) || 1.0;
    return {
      ...strategy,
      weightedScore: strategy.score * weight,
      weight
    };
  });

  // Log adaptive learning insights
  if (recentAnalyses.length > 0) {
    const recentAccuracy = recentAnalyses.filter(a => a.actual_result === 'WIN').length / recentAnalyses.length;
    console.log(`📊 Learning from ${recentAnalyses.length} recent analyses. Accuracy: ${(recentAccuracy * 100).toFixed(1)}%`);
    console.log(`🎯 Strategy weights:`, Object.fromEntries(strategyWeights));
  }

  // Combinar resultados das 5 estratégias COM PESOS ADAPTATIVOS
  const buySignals = weightedStrategies.filter(s => s.signal === "COMPRA").length;
  const sellSignals = weightedStrategies.filter(s => s.signal === "VENDA").length;
  const avgWeightedScore = weightedStrategies.reduce((sum, s) => sum + s.weightedScore, 0) / weightedStrategies.length;
  const avgConfidence = weightedStrategies.reduce((sum, s) => sum + s.confidence * s.weight, 0) / 
                        weightedStrategies.reduce((sum, s) => sum + s.weight, 0);

  let signal: SignalType;
  let confidence: number;
  let recommendation: string;

  // Decisão final baseada em score ponderado
  if (avgWeightedScore >= 60) {
    signal = "COMPRA";
    confidence = Math.min(95, avgConfidence + (buySignals - 2) * 5);
    recommendation = `🚀 SINAL DE COMPRA em ${timeframe} - ${buySignals}/5 estratégias (score ponderado: ${avgWeightedScore.toFixed(1)}). Confiança: ${confidence.toFixed(1)}%`;
  } else if (avgWeightedScore <= 40) {
    signal = "VENDA";
    confidence = Math.min(95, avgConfidence + (sellSignals - 2) * 5);
    recommendation = `📉 SINAL DE VENDA em ${timeframe} - ${sellSignals}/5 estratégias (score ponderado: ${avgWeightedScore.toFixed(1)}). Confiança: ${confidence.toFixed(1)}%`;
  } else {
    signal = "NEUTRO";
    confidence = 50 + Math.abs(avgWeightedScore - 50) / 2;
    recommendation = `⚖️ MERCADO INDECISO em ${timeframe} - Score ponderado: ${avgWeightedScore.toFixed(1)}. Aguardar confirmação.`;
  }

  // Calcular Stop Loss (Fase 1)
  const stopLoss = calculateStopLoss(signal, basePrice, atr, supportResistance);

  console.log(`Signal: ${signal}, Confidence: ${confidence}%, Strategies: Buy=${buySignals}, Sell=${sellSignals}, Weighted Score: ${avgWeightedScore.toFixed(1)}`);

  return {
    signal,
    confidence,
    entry: basePrice,
    stopLoss,
    supportResistance,
    candlePatterns,
    indicators: {
      rsi,
      macd,
      ema: ema20,
      volume,
      atr,
      bollingerBands,
      fibonacci
    },
    qiAspects: {
      rsi: qiRsi,
      macd: qiMacd,
      ema: qiEma,
      volume: qiVolume
    },
    qeAspects: {
      momentumConfidence: qeMomentum,
      volatilityComfort: qeVolatility,
      riskAppetite: qeRisk,
      marketSentiment: qeSentiment
    },
    strategies,
    recommendation
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { asset, capital, timeframe }: SignalRequest = await req.json();
    
    if (!asset) {
      return new Response(
        JSON.stringify({ error: "Asset is required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Generating signal for ${asset} with capital: ${capital}, timeframe: ${timeframe || "1m"}`);
    
    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // ===== ADAPTIVE LEARNING: Fetch strategy weights and recent analyses =====
    const strategyWeights = new Map<string, number>();
    
    // Fetch strategy performance weights for this asset and timeframe
    const { data: strategyData, error: strategyError } = await supabase
      .from('strategy_performance')
      .select('strategy_name, weight, accuracy, total_signals')
      .eq('asset', asset)
      .eq('timeframe', timeframe || "1m");

    if (!strategyError && strategyData) {
      strategyData.forEach(s => {
        strategyWeights.set(s.strategy_name, s.weight);
        console.log(`📈 ${s.strategy_name}: weight=${s.weight}, accuracy=${s.accuracy}%, signals=${s.total_signals}`);
      });
    }

    // Fetch last 20 analyses for this asset to learn from patterns
    const { data: recentAnalyses, error: analysesError } = await supabase
      .from('signal_analysis')
      .select('*')
      .eq('asset', asset)
      .eq('timeframe', timeframe || "1m")
      .order('created_at', { ascending: false })
      .limit(20);

    if (!analysesError && recentAnalyses) {
      console.log(`🔍 Analyzing ${recentAnalyses.length} recent signals for learning`);
    }
    
    // Gerar sinal usando estratégia avançada COM APRENDIZADO ADAPTATIVO
    const signalResponse = await generateAdvancedSignal(
      asset, 
      timeframe || "1m", 
      strategyWeights,
      recentAnalyses || []
    );

    // Save analysis to database for future learning
    const { error: insertError } = await supabase
      .from('signal_analysis')
      .insert({
        asset,
        timeframe: timeframe || "1m",
        signal: signalResponse.signal,
        confidence: signalResponse.confidence,
        entry_price: signalResponse.entry,
        stop_loss: signalResponse.stopLoss.atrStopLoss,
        take_profit: signalResponse.signal === "COMPRA" 
          ? signalResponse.supportResistance.resistanceLevels[0]
          : signalResponse.supportResistance.supportLevels[0],
        strategies: signalResponse.strategies,
        predicted_result: signalResponse.confidence > 65 ? 'WIN' : 'NEUTRAL'
      });

    if (insertError) {
      console.error('Error saving analysis:', insertError);
    } else {
      console.log('✅ Analysis saved successfully for future learning');
    }

    return new Response(
      JSON.stringify({
        ...signalResponse,
        asset,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in generate-signal:', error);
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

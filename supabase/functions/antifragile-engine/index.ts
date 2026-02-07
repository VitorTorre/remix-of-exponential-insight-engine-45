import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// 100 Cenários Base de Padrões de Velas
const BASE_SCENARIOS = [
  // 1-20 Martelo / Martelo Invertido
  { number: 1, context: '↓ forte', context_type: 'tendência forte', pattern: 'Martelo', pattern_type: 'bullish', outcome: 'CP↑', direction: 'UP' },
  { number: 2, context: '↓ forte', context_type: 'tendência forte', pattern: 'Martelo', pattern_type: 'bullish', outcome: 'EX↑', direction: 'UP' },
  { number: 3, context: '↓ moderada', context_type: 'tendência fraca', pattern: 'Martelo', pattern_type: 'bullish', outcome: 'Continuação↓ (falha)', direction: 'DOWN' },
  { number: 4, context: '↓ longa', context_type: 'tendência forte', pattern: 'Martelo', pattern_type: 'bullish', outcome: 'Reversão parcial↑', direction: 'UP' },
  { number: 5, context: '↓ em suporte', context_type: 'tendência forte', pattern: 'Martelo', pattern_type: 'bullish', outcome: 'EX↑', direction: 'UP' },
  { number: 6, context: '↓ sem suporte', context_type: 'tendência fraca', pattern: 'Martelo', pattern_type: 'bullish', outcome: 'Lateral', direction: 'LATERAL' },
  { number: 7, context: '↓ com volume alto', context_type: 'tendência forte', pattern: 'Martelo', pattern_type: 'bullish', outcome: 'EX↑', direction: 'UP' },
  { number: 8, context: '↓ com corpo grande anterior', context_type: 'tendência forte', pattern: 'Martelo', pattern_type: 'bullish', outcome: 'CP↑', direction: 'UP' },
  { number: 9, context: '↓ após gap', context_type: 'exaustão', pattern: 'Martelo', pattern_type: 'bullish', outcome: 'Reversão↑', direction: 'UP' },
  { number: 10, context: '↓ prolongada', context_type: 'exaustão', pattern: 'Martelo', pattern_type: 'bullish', outcome: 'Consolidação', direction: 'LATERAL' },
  { number: 11, context: '↑ forte', context_type: 'tendência forte', pattern: 'Martelo invertido', pattern_type: 'bearish', outcome: 'Continuação↑', direction: 'UP' },
  { number: 12, context: '↑ topo', context_type: 'exaustão', pattern: 'Martelo invertido', pattern_type: 'bearish', outcome: 'Reversão↓', direction: 'DOWN' },
  { number: 13, context: '↑ longa', context_type: 'tendência forte', pattern: 'Martelo invertido', pattern_type: 'bearish', outcome: 'CP↓', direction: 'DOWN' },
  { number: 14, context: '↑ fraca', context_type: 'tendência fraca', pattern: 'Martelo invertido', pattern_type: 'bearish', outcome: 'Lateral', direction: 'LATERAL' },
  { number: 15, context: '↑ com resistência', context_type: 'exaustão', pattern: 'Martelo invertido', pattern_type: 'bearish', outcome: 'EX↓', direction: 'DOWN' },
  { number: 16, context: '↑ sem resistência', context_type: 'tendência forte', pattern: 'Martelo invertido', pattern_type: 'bearish', outcome: 'Continuação↑', direction: 'UP' },
  { number: 17, context: '↑ com exaustão', context_type: 'exaustão', pattern: 'Martelo invertido', pattern_type: 'bearish', outcome: 'Reversão↓', direction: 'DOWN' },
  { number: 18, context: '↑ parabólica', context_type: 'exaustão', pattern: 'Martelo invertido', pattern_type: 'bearish', outcome: 'EX↓', direction: 'DOWN' },
  { number: 19, context: '↑ após notícia', context_type: 'exaustão', pattern: 'Martelo invertido', pattern_type: 'bearish', outcome: 'Volatilidade', direction: 'LATERAL' },
  { number: 20, context: '↑ madura', context_type: 'exaustão', pattern: 'Martelo invertido', pattern_type: 'bearish', outcome: 'Lateral', direction: 'LATERAL' },
  
  // 21-40 Engolfos
  { number: 21, context: '↓', context_type: 'tendência forte', pattern: 'Engolfo de alta', pattern_type: 'bullish', outcome: 'EX↑', direction: 'UP' },
  { number: 22, context: '↓', context_type: 'tendência forte', pattern: 'Engolfo de alta', pattern_type: 'bullish', outcome: 'CP↑', direction: 'UP' },
  { number: 23, context: '↓ fraca', context_type: 'tendência fraca', pattern: 'Engolfo de alta', pattern_type: 'bullish', outcome: 'Falha', direction: 'DOWN' },
  { number: 24, context: '↓ suporte', context_type: 'tendência forte', pattern: 'Engolfo de alta', pattern_type: 'bullish', outcome: 'Reversão↑', direction: 'UP' },
  { number: 25, context: '↓ longa', context_type: 'exaustão', pattern: 'Engolfo de alta', pattern_type: 'bullish', outcome: 'Pullback↑', direction: 'UP' },
  { number: 26, context: '↑', context_type: 'tendência forte', pattern: 'Engolfo de baixa', pattern_type: 'bearish', outcome: 'EX↓', direction: 'DOWN' },
  { number: 27, context: '↑', context_type: 'tendência forte', pattern: 'Engolfo de baixa', pattern_type: 'bearish', outcome: 'CP↓', direction: 'DOWN' },
  { number: 28, context: '↑ fraca', context_type: 'tendência fraca', pattern: 'Engolfo de baixa', pattern_type: 'bearish', outcome: 'Falha', direction: 'UP' },
  { number: 29, context: '↑ resistência', context_type: 'exaustão', pattern: 'Engolfo de baixa', pattern_type: 'bearish', outcome: 'Reversão↓', direction: 'DOWN' },
  { number: 30, context: '↑ longa', context_type: 'exaustão', pattern: 'Engolfo de baixa', pattern_type: 'bearish', outcome: 'Pullback↓', direction: 'DOWN' },
  { number: 31, context: '→', context_type: 'consolidação', pattern: 'Engolfo alta', pattern_type: 'bullish', outcome: 'Falso breakout', direction: 'LATERAL' },
  { number: 32, context: '→', context_type: 'consolidação', pattern: 'Engolfo baixa', pattern_type: 'bearish', outcome: 'Falso breakout', direction: 'LATERAL' },
  { number: 33, context: 'Compressão', context_type: 'consolidação', pattern: 'Engolfo', pattern_type: 'neutral', outcome: 'EX', direction: 'LATERAL' },
  { number: 34, context: 'Range topo', context_type: 'consolidação', pattern: 'Engolfo baixa', pattern_type: 'bearish', outcome: 'EX↓', direction: 'DOWN' },
  { number: 35, context: 'Range fundo', context_type: 'consolidação', pattern: 'Engolfo alta', pattern_type: 'bullish', outcome: 'EX↑', direction: 'UP' },
  { number: 36, context: 'Microtrend', context_type: 'tendência fraca', pattern: 'Engolfo', pattern_type: 'neutral', outcome: 'Continuação', direction: 'LATERAL' },
  { number: 37, context: 'Após doji', context_type: 'consolidação', pattern: 'Engolfo', pattern_type: 'neutral', outcome: 'EX', direction: 'LATERAL' },
  { number: 38, context: 'Após 3 candles mesma cor', context_type: 'tendência forte', pattern: 'Engolfo', pattern_type: 'neutral', outcome: 'Reversão curta', direction: 'LATERAL' },
  { number: 39, context: 'Após spike', context_type: 'exaustão', pattern: 'Engolfo', pattern_type: 'neutral', outcome: 'Correção', direction: 'LATERAL' },
  { number: 40, context: 'Após notícia', context_type: 'exaustão', pattern: 'Engolfo', pattern_type: 'neutral', outcome: 'Alta volatilidade', direction: 'LATERAL' },
  
  // 41-60 Estrela da Manhã / Noite
  { number: 41, context: '↓', context_type: 'tendência forte', pattern: 'Estrela da manhã', pattern_type: 'bullish', outcome: 'Reversão↑', direction: 'UP' },
  { number: 42, context: '↓ longa', context_type: 'exaustão', pattern: 'Estrela manhã', pattern_type: 'bullish', outcome: 'EX↑', direction: 'UP' },
  { number: 43, context: '↓ fraca', context_type: 'tendência fraca', pattern: 'Estrela manhã', pattern_type: 'bullish', outcome: 'CP↑', direction: 'UP' },
  { number: 44, context: '↓ suporte', context_type: 'tendência forte', pattern: 'Estrela manhã', pattern_type: 'bullish', outcome: 'Forte↑', direction: 'UP' },
  { number: 45, context: '↓ sem contexto', context_type: 'consolidação', pattern: 'Estrela manhã', pattern_type: 'bullish', outcome: 'Lateral', direction: 'LATERAL' },
  { number: 46, context: '↑', context_type: 'tendência forte', pattern: 'Estrela da noite', pattern_type: 'bearish', outcome: 'Reversão↓', direction: 'DOWN' },
  { number: 47, context: '↑ longa', context_type: 'exaustão', pattern: 'Estrela noite', pattern_type: 'bearish', outcome: 'EX↓', direction: 'DOWN' },
  { number: 48, context: '↑ fraca', context_type: 'tendência fraca', pattern: 'Estrela noite', pattern_type: 'bearish', outcome: 'CP↓', direction: 'DOWN' },
  { number: 49, context: '↑ resistência', context_type: 'exaustão', pattern: 'Estrela noite', pattern_type: 'bearish', outcome: 'Forte↓', direction: 'DOWN' },
  { number: 50, context: '↑ sem contexto', context_type: 'consolidação', pattern: 'Estrela noite', pattern_type: 'bearish', outcome: 'Lateral', direction: 'LATERAL' },
  { number: 51, context: '→', context_type: 'consolidação', pattern: 'Estrela manhã', pattern_type: 'bullish', outcome: 'Falso↑', direction: 'LATERAL' },
  { number: 52, context: '→', context_type: 'consolidação', pattern: 'Estrela noite', pattern_type: 'bearish', outcome: 'Falso↓', direction: 'LATERAL' },
  { number: 53, context: 'Compressão', context_type: 'consolidação', pattern: 'Estrela', pattern_type: 'neutral', outcome: 'EX', direction: 'LATERAL' },
  { number: 54, context: 'Vol baixa', context_type: 'consolidação', pattern: 'Estrela', pattern_type: 'neutral', outcome: 'Sem follow', direction: 'LATERAL' },
  { number: 55, context: 'Vol alta', context_type: 'exaustão', pattern: 'Estrela', pattern_type: 'neutral', outcome: 'Movimento forte', direction: 'LATERAL' },
  { number: 56, context: 'Após gap', context_type: 'exaustão', pattern: 'Estrela', pattern_type: 'neutral', outcome: 'Correção', direction: 'LATERAL' },
  { number: 57, context: 'Após spike', context_type: 'exaustão', pattern: 'Estrela', pattern_type: 'neutral', outcome: 'Reversão curta', direction: 'LATERAL' },
  { number: 58, context: 'Após tendência longa', context_type: 'exaustão', pattern: 'Estrela', pattern_type: 'neutral', outcome: 'Exaustão', direction: 'LATERAL' },
  { number: 59, context: 'Após consolidação', context_type: 'consolidação', pattern: 'Estrela', pattern_type: 'neutral', outcome: 'Breakout', direction: 'LATERAL' },
  { number: 60, context: 'Pós notícia', context_type: 'exaustão', pattern: 'Estrela', pattern_type: 'neutral', outcome: 'Ruído', direction: 'LATERAL' },
  
  // 61-80 Doji / Spinning Top
  { number: 61, context: '↑', context_type: 'tendência forte', pattern: 'Doji', pattern_type: 'neutral', outcome: 'Continuação↑', direction: 'UP' },
  { number: 62, context: '↑ topo', context_type: 'exaustão', pattern: 'Doji', pattern_type: 'neutral', outcome: 'Reversão↓', direction: 'DOWN' },
  { number: 63, context: '↓', context_type: 'tendência forte', pattern: 'Doji', pattern_type: 'neutral', outcome: 'Continuação↓', direction: 'DOWN' },
  { number: 64, context: '↓ fundo', context_type: 'exaustão', pattern: 'Doji', pattern_type: 'neutral', outcome: 'Reversão↑', direction: 'UP' },
  { number: 65, context: '→', context_type: 'consolidação', pattern: 'Doji', pattern_type: 'neutral', outcome: 'Continuação lateral', direction: 'LATERAL' },
  { number: 66, context: 'Compressão', context_type: 'consolidação', pattern: 'Doji', pattern_type: 'neutral', outcome: 'EX', direction: 'LATERAL' },
  { number: 67, context: 'Tendência longa', context_type: 'exaustão', pattern: 'Doji', pattern_type: 'neutral', outcome: 'Exaustão', direction: 'LATERAL' },
  { number: 68, context: 'Após engolfo', context_type: 'consolidação', pattern: 'Doji', pattern_type: 'neutral', outcome: 'Pausa', direction: 'LATERAL' },
  { number: 69, context: 'Após 3 candles fortes', context_type: 'tendência forte', pattern: 'Doji', pattern_type: 'neutral', outcome: 'Pullback', direction: 'LATERAL' },
  { number: 70, context: 'Vol alta', context_type: 'exaustão', pattern: 'Doji', pattern_type: 'neutral', outcome: 'Indecisão', direction: 'LATERAL' },
  { number: 71, context: '↑', context_type: 'tendência forte', pattern: 'Spinning Top', pattern_type: 'neutral', outcome: 'Continuação', direction: 'UP' },
  { number: 72, context: '↓', context_type: 'tendência forte', pattern: 'Spinning Top', pattern_type: 'neutral', outcome: 'Continuação', direction: 'DOWN' },
  { number: 73, context: 'Topo', context_type: 'exaustão', pattern: 'Spinning Top', pattern_type: 'neutral', outcome: 'Reversão', direction: 'DOWN' },
  { number: 74, context: 'Fundo', context_type: 'exaustão', pattern: 'Spinning Top', pattern_type: 'neutral', outcome: 'Reversão', direction: 'UP' },
  { number: 75, context: 'Range', context_type: 'consolidação', pattern: 'Spinning Top', pattern_type: 'neutral', outcome: 'Ruído', direction: 'LATERAL' },
  { number: 76, context: 'Após spike', context_type: 'exaustão', pattern: 'Spinning Top', pattern_type: 'neutral', outcome: 'Correção', direction: 'LATERAL' },
  { number: 77, context: 'Antes de notícia', context_type: 'consolidação', pattern: 'Spinning Top', pattern_type: 'neutral', outcome: 'Compressão', direction: 'LATERAL' },
  { number: 78, context: 'Após breakout', context_type: 'tendência forte', pattern: 'Spinning Top', pattern_type: 'neutral', outcome: 'Reteste', direction: 'LATERAL' },
  { number: 79, context: 'Microtrend', context_type: 'tendência fraca', pattern: 'Spinning Top', pattern_type: 'neutral', outcome: 'Continuação', direction: 'LATERAL' },
  { number: 80, context: 'Tendência madura', context_type: 'exaustão', pattern: 'Spinning Top', pattern_type: 'neutral', outcome: 'Exaustão', direction: 'LATERAL' },
  
  // 81-100 Padrões de Sequência
  { number: 81, context: '↑↑↑', context_type: 'tendência forte', pattern: '3 soldados', pattern_type: 'bullish', outcome: 'Continuação↑', direction: 'UP' },
  { number: 82, context: '↓↓↓', context_type: 'tendência forte', pattern: '3 corvos', pattern_type: 'bearish', outcome: 'Continuação↓', direction: 'DOWN' },
  { number: 83, context: '↑↑↑', context_type: 'exaustão', pattern: '3 soldados', pattern_type: 'bullish', outcome: 'Exaustão', direction: 'LATERAL' },
  { number: 84, context: '↓↓↓', context_type: 'exaustão', pattern: '3 corvos', pattern_type: 'bearish', outcome: 'Exaustão', direction: 'LATERAL' },
  { number: 85, context: '↑ longa', context_type: 'tendência forte', pattern: 'Marubozu', pattern_type: 'bullish', outcome: 'EX↑', direction: 'UP' },
  { number: 86, context: '↓ longa', context_type: 'tendência forte', pattern: 'Marubozu', pattern_type: 'bearish', outcome: 'EX↓', direction: 'DOWN' },
  { number: 87, context: '↑ após consolidação', context_type: 'consolidação', pattern: 'Marubozu', pattern_type: 'bullish', outcome: 'Breakout', direction: 'UP' },
  { number: 88, context: '↓ após consolidação', context_type: 'consolidação', pattern: 'Marubozu', pattern_type: 'bearish', outcome: 'Breakout', direction: 'DOWN' },
  { number: 89, context: 'Sequência alternada', context_type: 'consolidação', pattern: 'Inside bars', pattern_type: 'neutral', outcome: 'Compressão', direction: 'LATERAL' },
  { number: 90, context: 'Inside breakout', context_type: 'consolidação', pattern: 'Inside bar', pattern_type: 'neutral', outcome: 'EX', direction: 'LATERAL' },
  { number: 91, context: '5 candles pequenos', context_type: 'consolidação', pattern: 'Compressão', pattern_type: 'neutral', outcome: 'Explosão', direction: 'LATERAL' },
  { number: 92, context: 'Parabólico', context_type: 'exaustão', pattern: 'Parabólico', pattern_type: 'neutral', outcome: 'Correção', direction: 'LATERAL' },
  { number: 93, context: 'Tendência madura', context_type: 'exaustão', pattern: 'Exaustão', pattern_type: 'neutral', outcome: 'Pullback', direction: 'LATERAL' },
  { number: 94, context: 'Pullback 3 velas', context_type: 'tendência fraca', pattern: 'Pullback', pattern_type: 'neutral', outcome: 'Continuação', direction: 'LATERAL' },
  { number: 95, context: 'Pullback profundo', context_type: 'exaustão', pattern: 'Pullback', pattern_type: 'neutral', outcome: 'Reversão', direction: 'LATERAL' },
  { number: 96, context: 'Spike + pausa', context_type: 'tendência forte', pattern: 'Spike', pattern_type: 'neutral', outcome: 'Continuação', direction: 'LATERAL' },
  { number: 97, context: 'Spike + rejeição', context_type: 'exaustão', pattern: 'Spike', pattern_type: 'neutral', outcome: 'Reversão', direction: 'LATERAL' },
  { number: 98, context: 'Falso breakout', context_type: 'consolidação', pattern: 'Falso breakout', pattern_type: 'neutral', outcome: 'Retorno ao range', direction: 'LATERAL' },
  { number: 99, context: 'Range estreito', context_type: 'consolidação', pattern: 'Range', pattern_type: 'neutral', outcome: 'Expansão', direction: 'LATERAL' },
  { number: 100, context: 'Range largo', context_type: 'consolidação', pattern: 'Range', pattern_type: 'neutral', outcome: 'Continuação lateral', direction: 'LATERAL' },
];

interface CandleData {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  timestamp: string;
}

interface MetaAnalysisRequest {
  action: 'analyze' | 'learn' | 'export' | 'seed_scenarios' | 'get_memories' | 'create_report';
  asset?: string;
  timeframe?: string;
  candles?: CandleData[];
  operationResult?: 'WIN' | 'LOSS' | 'NEUTRAL';
  exportType?: 'operations' | 'micro_reports';
  filters?: Record<string, any>;
}

// Identificar padrão de vela
function identifyPattern(candle: CandleData, prevCandles: CandleData[]): string {
  const body = Math.abs(candle.close - candle.open);
  const range = candle.high - candle.low;
  const upperShadow = candle.high - Math.max(candle.open, candle.close);
  const lowerShadow = Math.min(candle.open, candle.close) - candle.low;
  
  // Doji
  if (body < range * 0.1) return 'Doji';
  
  // Martelo
  if (lowerShadow > body * 2 && upperShadow < body * 0.5) return 'Martelo';
  
  // Martelo invertido
  if (upperShadow > body * 2 && lowerShadow < body * 0.5) return 'Martelo invertido';
  
  // Engolfo
  if (prevCandles.length > 0) {
    const prev = prevCandles[prevCandles.length - 1];
    if (candle.close > candle.open && prev.close < prev.open && 
        candle.close > prev.open && candle.open < prev.close) {
      return 'Engolfo de alta';
    }
    if (candle.close < candle.open && prev.close > prev.open && 
        candle.close < prev.open && candle.open > prev.close) {
      return 'Engolfo de baixa';
    }
  }
  
  // Marubozu
  if (upperShadow < body * 0.05 && lowerShadow < body * 0.05) {
    return candle.close > candle.open ? 'Marubozu alta' : 'Marubozu baixa';
  }
  
  // Spinning Top
  if (upperShadow > body && lowerShadow > body) return 'Spinning Top';
  
  return 'Vela comum';
}

// Classificar contexto das 5 velas anteriores
function classifyContext(candles: CandleData[]): { type: string; description: string } {
  if (candles.length < 5) return { type: 'consolidação', description: 'Dados insuficientes' };
  
  const changes = candles.map((c, i) => {
    if (i === 0) return 0;
    return (c.close - candles[i - 1].close) / candles[i - 1].close;
  }).slice(1);
  
  const avgChange = changes.reduce((a, b) => a + b, 0) / changes.length;
  const volatility = Math.sqrt(changes.reduce((acc, c) => acc + Math.pow(c - avgChange, 2), 0) / changes.length);
  
  const bullishCandles = candles.filter(c => c.close > c.open).length;
  const bearishCandles = candles.filter(c => c.close < c.open).length;
  
  // Tendência forte
  if (avgChange > 0.01 && bullishCandles >= 4) {
    return { type: 'tendência forte', description: '↑ forte' };
  }
  if (avgChange < -0.01 && bearishCandles >= 4) {
    return { type: 'tendência forte', description: '↓ forte' };
  }
  
  // Tendência fraca
  if (avgChange > 0.003) {
    return { type: 'tendência fraca', description: '↑ fraca' };
  }
  if (avgChange < -0.003) {
    return { type: 'tendência fraca', description: '↓ fraca' };
  }
  
  // Exaustão
  if (volatility > 0.02) {
    return { type: 'exaustão', description: 'Alta volatilidade' };
  }
  
  return { type: 'consolidação', description: '→' };
}

// Calcular score antifrágil
function calculateAntifragileScore(
  memory: any, 
  volatility: number, 
  isShock: boolean
): number {
  let score = 0;
  
  // Base score from accuracy
  if (memory.actual_result === 'WIN') score += 30;
  
  // Bonus for performing well in high volatility
  if (memory.actual_result === 'WIN' && volatility > 0.02) {
    score += volatility * 100;
  }
  
  // Extra bonus for shock events
  if (isShock && memory.actual_result === 'WIN') {
    score += 25;
  }
  
  // Penalty for failures in calm markets
  if (memory.actual_result === 'LOSS' && volatility < 0.01) {
    score -= 10;
  }
  
  return Math.max(0, Math.min(100, score));
}

// Generate detailed explanation for WIN or LOSS
function generateLearningExplanation(
  memory: any,
  result: 'WIN' | 'LOSS' | 'NEUTRAL',
  antifragileScore: number
): string {
  const pattern = memory.pattern_scenarios?.pattern_name || 'Padrão não identificado';
  const context = memory.pattern_scenarios?.context_description || 'Contexto não classificado';
  const expectedDirection = memory.pattern_scenarios?.expected_direction || 'LATERAL';
  const volatility = ((memory.volatility_index || 0) * 100).toFixed(2);
  const isShock = memory.is_shock_event;
  
  if (result === 'WIN') {
    let explanation = `✅ ACERTO: ${pattern} em contexto ${context}. `;
    
    if (isShock) {
      explanation += `DESTAQUE: Operação bem-sucedida durante evento de choque (vol: ${volatility}%). `;
      explanation += `O sistema demonstrou antifragilidade ao lucrar em condições extremas. `;
    } else if (parseFloat(volatility) > 2) {
      explanation += `Volatilidade elevada (${volatility}%) indicou oportunidade. `;
    } else {
      explanation += `Condições de mercado normais (vol: ${volatility}%). `;
    }
    
    explanation += `Direção esperada: ${expectedDirection}. `;
    explanation += `Score antifrágil: ${antifragileScore}. `;
    explanation += `REFORÇO: Este padrão deve ser priorizado em contextos similares.`;
    
    return explanation;
  } else if (result === 'LOSS') {
    let explanation = `❌ ERRO: ${pattern} em contexto ${context}. `;
    
    if (isShock) {
      explanation += `ALERTA: Falha durante evento de choque (vol: ${volatility}%). `;
      explanation += `O sistema precisa se adaptar para volatilidade extrema. `;
    } else if (parseFloat(volatility) < 0.5) {
      explanation += `Volatilidade muito baixa (${volatility}%) gerou sinal fraco. `;
      explanation += `APRENDIZADO: Evitar operações em mercados laterais sem direção. `;
    } else {
      explanation += `Volatilidade: ${volatility}%. `;
    }
    
    explanation += `Direção esperada: ${expectedDirection}, porém mercado não confirmou. `;
    explanation += `CORREÇÃO NECESSÁRIA: `;
    
    if (memory.pattern_scenarios?.probability_score < 0.5) {
      explanation += `Probabilidade do cenário era baixa (${((memory.pattern_scenarios?.probability_score || 0) * 100).toFixed(0)}%). Aumentar filtro de qualidade.`;
    } else {
      explanation += `Verificar se o contexto foi corretamente identificado. Considerar indicadores adicionais.`;
    }
    
    return explanation;
  }
  
  return `Resultado neutro. Sem alteração significativa na estratégia.`;
}

// Match scenario with current market conditions
function matchScenario(
  context: { type: string; description: string },
  pattern: string,
  scenarios: any[]
): any | null {
  // First try exact match
  let matched = scenarios.find(s => 
    s.pattern_name.toLowerCase().includes(pattern.toLowerCase()) &&
    s.context_type === context.type
  );
  
  // Fallback to pattern match only
  if (!matched) {
    matched = scenarios.find(s => 
      s.pattern_name.toLowerCase().includes(pattern.toLowerCase())
    );
  }
  
  return matched;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const body: MetaAnalysisRequest = await req.json();
    const { action, asset, timeframe, candles, operationResult, exportType, filters } = body;

    switch (action) {
      case 'seed_scenarios': {
        // Insert base scenarios
        const scenariosToInsert = BASE_SCENARIOS.map(s => ({
          scenario_number: s.number,
          context_description: s.context,
          context_type: s.context_type,
          pattern_name: s.pattern,
          pattern_type: s.pattern_type,
          expected_outcome: s.outcome,
          expected_direction: s.direction,
          probability_score: 0.5,
          is_base_scenario: true,
          discovered_by_ai: false,
        }));

        const { data, error } = await supabase
          .from('pattern_scenarios')
          .upsert(scenariosToInsert, { onConflict: 'scenario_number' });

        if (error) throw error;

        return new Response(
          JSON.stringify({ success: true, inserted: scenariosToInsert.length }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'analyze': {
        if (!candles || candles.length < 6) {
          throw new Error('Need at least 6 candles for analysis');
        }

        // Get scenarios from database
        const { data: scenarios } = await supabase
          .from('pattern_scenarios')
          .select('*');

        const prevCandles = candles.slice(0, 5);
        const currentCandle = candles[5];
        
        const context = classifyContext(prevCandles);
        const pattern = identifyPattern(currentCandle, prevCandles);
        const matchedScenario = matchScenario(context, pattern, scenarios || []);

        // Calculate volatility
        const changes = candles.map((c, i) => {
          if (i === 0) return 0;
          return Math.abs((c.close - candles[i - 1].close) / candles[i - 1].close);
        }).slice(1);
        const volatility = changes.reduce((a, b) => a + b, 0) / changes.length;
        const isShock = volatility > 0.03;

        // Create memory
        const memory = {
          asset: asset || 'UNKNOWN',
          timeframe: timeframe || '5M',
          scenario_id: matchedScenario?.id || null,
          candles_before: prevCandles,
          pattern_candle: currentCandle,
          volatility_index: volatility,
          market_stress_level: Math.min(volatility * 20, 1),
          is_shock_event: isShock,
          signal_generated: matchedScenario?.expected_direction === 'UP' ? 'COMPRA' : 
                           matchedScenario?.expected_direction === 'DOWN' ? 'VENDA' : 'NEUTRO',
        };

        const { data: insertedMemory, error: memoryError } = await supabase
          .from('market_memories')
          .insert(memory)
          .select()
          .single();

        if (memoryError) throw memoryError;

        return new Response(
          JSON.stringify({
            success: true,
            analysis: {
              context,
              pattern,
              matchedScenario,
              volatility,
              isShock,
              memory: insertedMemory,
              prediction: matchedScenario ? {
                direction: matchedScenario.expected_direction,
                outcome: matchedScenario.expected_outcome,
                probability: matchedScenario.probability_score,
              } : null,
            },
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'learn': {
        if (!operationResult) {
          throw new Error('Operation result required for learning');
        }

        // Get recent memories without results
        const { data: memories } = await supabase
          .from('market_memories')
          .select('*, pattern_scenarios(*)')
          .is('actual_result', null)
          .eq('asset', asset || '')
          .order('created_at', { ascending: false })
          .limit(1);

        if (!memories || memories.length === 0) {
          return new Response(
            JSON.stringify({ success: false, message: 'No pending memories to learn from' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const memory = memories[0];
        const antifragileScore = calculateAntifragileScore(
          { actual_result: operationResult },
          memory.volatility_index || 0,
          memory.is_shock_event || false
        );

        // Update memory with result
        await supabase
          .from('market_memories')
          .update({
            actual_result: operationResult,
            antifragile_score: antifragileScore,
            learning_weight: operationResult === 'WIN' ? 1.2 : 0.8,
          })
          .eq('id', memory.id);

        // Update scenario statistics
        if (memory.scenario_id) {
          const isCorrect = (memory.pattern_scenarios?.expected_direction === 'UP' && operationResult === 'WIN') ||
                           (memory.pattern_scenarios?.expected_direction === 'DOWN' && operationResult === 'WIN');

          await supabase.rpc('update_scenario_stats', {
            p_scenario_id: memory.scenario_id,
            p_is_correct: isCorrect,
          }).catch(() => {
            // RPC might not exist yet, update manually
            supabase
              .from('pattern_scenarios')
              .update({
                total_occurrences: (memory.pattern_scenarios?.total_occurrences || 0) + 1,
                successful_occurrences: (memory.pattern_scenarios?.successful_occurrences || 0) + (isCorrect ? 1 : 0),
                probability_score: ((memory.pattern_scenarios?.successful_occurrences || 0) + (isCorrect ? 1 : 0)) / 
                                   ((memory.pattern_scenarios?.total_occurrences || 0) + 1),
                updated_at: new Date().toISOString(),
              })
              .eq('id', memory.scenario_id);
          });
        }

        // Generate detailed explanation for WIN or LOSS
        const analysisExplanation = generateLearningExplanation(
          memory,
          operationResult,
          antifragileScore
        );

        // Record learning event with detailed explanation
        await supabase
          .from('antifragile_learning')
          .insert({
            learning_type: memory.is_shock_event ? 'shock_adaptation' : 'pattern_evolution',
            trigger_event: `${operationResult} em ${memory.asset}`,
            before_state: { 
              scenario_probability: memory.pattern_scenarios?.probability_score,
              pattern: memory.pattern_scenarios?.pattern_name,
              context: memory.pattern_scenarios?.context_description,
              volatility: memory.volatility_index,
              signal: memory.signal_generated,
            },
            after_state: { 
              antifragile_score: antifragileScore,
              learning_weight: operationResult === 'WIN' ? 1.2 : 0.8,
              explanation: analysisExplanation,
            },
            improvement_delta: antifragileScore - (memory.antifragile_score || 0),
            scenarios_affected: memory.scenario_id ? [memory.pattern_scenarios?.scenario_number] : [],
            volatility_at_learning: memory.volatility_index,
            stress_level_at_learning: memory.market_stress_level,
            notes: analysisExplanation,
          });

        // Create annotation
        await supabase
          .from('system_annotations')
          .insert({
            annotation_type: 'learning',
            related_memory_id: memory.id,
            related_scenario_id: memory.scenario_id,
            title: `Aprendizado: ${operationResult}`,
            content: `Sistema aprendeu com ${operationResult} no cenário ${memory.pattern_scenarios?.pattern_name || 'desconhecido'}. Score antifrágil: ${antifragileScore.toFixed(2)}`,
            importance_level: memory.is_shock_event ? 5 : 3,
            tags: [operationResult.toLowerCase(), memory.asset || '', memory.is_shock_event ? 'shock' : 'normal'],
            is_ai_generated: true,
          });

        return new Response(
          JSON.stringify({
            success: true,
            learning: {
              memoryId: memory.id,
              result: operationResult,
              antifragileScore,
              scenarioUpdated: !!memory.scenario_id,
            },
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'create_report': {
        // Create micro report based on recent memories
        const { data: recentMemories } = await supabase
          .from('market_memories')
          .select('*, pattern_scenarios(*)')
          .order('created_at', { ascending: false })
          .limit(20);

        if (!recentMemories || recentMemories.length === 0) {
          throw new Error('No memories to create report from');
        }

        const wins = recentMemories.filter(m => m.actual_result === 'WIN').length;
        const losses = recentMemories.filter(m => m.actual_result === 'LOSS').length;
        const avgVolatility = recentMemories.reduce((acc, m) => acc + (m.volatility_index || 0), 0) / recentMemories.length;
        const patterns = [...new Set(recentMemories.map(m => m.pattern_scenarios?.pattern_name).filter(Boolean))];

        const report = {
          report_type: 'pattern',
          asset: asset || 'MULTI',
          timeframe: timeframe || '5M',
          title: `Micro Relatório - ${new Date().toLocaleDateString('pt-BR')}`,
          summary: `${recentMemories.length} operações analisadas. Taxa de acerto: ${((wins / (wins + losses)) * 100 || 0).toFixed(1)}%`,
          detailed_analysis: `Volatilidade média: ${(avgVolatility * 100).toFixed(2)}%. Padrões mais frequentes: ${patterns.slice(0, 3).join(', ')}`,
          patterns_identified: patterns,
          scenarios_matched: recentMemories.map(m => m.pattern_scenarios?.scenario_number).filter(Boolean),
          key_insights: [
            { insight: `Taxa de acerto: ${((wins / (wins + losses)) * 100 || 0).toFixed(1)}%`, importance: 'high' },
            { insight: `Volatilidade média: ${(avgVolatility * 100).toFixed(2)}%`, importance: 'medium' },
          ],
          performance_metrics: { wins, losses, total: recentMemories.length },
          volatility_analysis: { average: avgVolatility, shockEvents: recentMemories.filter(m => m.is_shock_event).length },
          recommendations: wins > losses 
            ? ['Continuar estratégia atual', 'Aumentar tamanho gradualmente']
            : ['Revisar cenários de baixa performance', 'Reduzir exposição temporariamente'],
          ai_generated: true,
          confidence_score: (wins / (wins + losses)) || 0.5,
        };

        const { data: insertedReport, error } = await supabase
          .from('micro_reports')
          .insert(report)
          .select()
          .single();

        if (error) throw error;

        return new Response(
          JSON.stringify({ success: true, report: insertedReport }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'export': {
        let csvContent = '';
        let records: any[] = [];

        if (exportType === 'operations') {
          const { data: operations } = await supabase
            .from('signal_analysis')
            .select('*')
            .order('created_at', { ascending: false });

          records = operations || [];
          csvContent = 'ID,Asset,Timeframe,Signal,Confidence,Entry Price,Stop Loss,Take Profit,Predicted,Actual,Profit/Loss,Created At\n';
          csvContent += records.map(r => 
            `${r.id},${r.asset},${r.timeframe},${r.signal},${r.confidence},${r.entry_price},${r.stop_loss || ''},${r.take_profit || ''},${r.predicted_result},${r.actual_result || ''},${r.profit_loss || ''},${r.created_at}`
          ).join('\n');
        } else if (exportType === 'micro_reports') {
          const { data: reports } = await supabase
            .from('micro_reports')
            .select('*')
            .order('created_at', { ascending: false });

          records = reports || [];
          csvContent = 'ID,Type,Asset,Timeframe,Title,Summary,Patterns,Wins,Losses,Confidence,Created At\n';
          csvContent += records.map(r => 
            `${r.id},${r.report_type},${r.asset || ''},${r.timeframe || ''},${r.title},"${r.summary}","${(r.patterns_identified || []).join(';')}",${r.performance_metrics?.wins || 0},${r.performance_metrics?.losses || 0},${r.confidence_score},${r.created_at}`
          ).join('\n');
        }

        // Save export to database
        await supabase
          .from('csv_exports')
          .insert({
            export_type: exportType || 'operations',
            file_name: `export_${exportType}_${Date.now()}.csv`,
            file_content: csvContent,
            filters_applied: filters || {},
            records_count: records.length,
          });

        return new Response(
          JSON.stringify({ 
            success: true, 
            csv: csvContent,
            recordsCount: records.length,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'get_memories': {
        const { data: memories } = await supabase
          .from('market_memories')
          .select('*, pattern_scenarios(*)')
          .eq('asset', asset || '')
          .order('created_at', { ascending: false })
          .limit(50);

        const { data: learnings } = await supabase
          .from('antifragile_learning')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20);

        return new Response(
          JSON.stringify({ 
            success: true, 
            memories: memories || [],
            learnings: learnings || [],
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.error('Antifragile engine error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

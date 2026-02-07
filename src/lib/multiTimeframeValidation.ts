interface TimeframeAnalysis {
  timeframe: string;
  signal: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  indicators: Record<string, number>;
}

export class MultiTimeframeValidator {
  private timeframes = ['1m', '5m', '15m', '1h', '4h', '1d'];
  
  async validateSignal(symbol: string) {
    const analyses = await Promise.all(
      this.timeframes.map(tf => this.analyzeTimeframe(symbol, tf))
    );

    const signals = analyses.map(a => a.signal);
    const concordance = this.calculateConcordance(signals);
    
    if (concordance >= 0.75) {
      const dominantSignal = this.getDominantSignal(signals);
      return {
        finalSignal: dominantSignal,
        confidence: concordance,
        timeframeConcordance: concordance,
        details: analyses
      };
    }

    return {
      finalSignal: 'HOLD',
      confidence: 0,
      timeframeConcordance: concordance,
      details: analyses
    };
  }

  private calculateConcordance(signals: string[]): number {
    const counts = signals.reduce((acc, signal) => {
      acc[signal] = (acc[signal] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const maxCount = Math.max(...Object.values(counts));
    return maxCount / signals.length;
  }

  private getDominantSignal(signals: string[]): 'BUY' | 'SELL' | 'HOLD' {
    const counts = signals.reduce((acc, signal) => {
      acc[signal] = (acc[signal] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const dominant = Object.entries(counts).reduce((a, b) => 
      a[1] > b[1] ? a : b
    )[0];
    
    return dominant as 'BUY' | 'SELL' | 'HOLD';
  }

  private async analyzeTimeframe(symbol: string, timeframe: string): Promise<TimeframeAnalysis> {
    // Simulação de análise por timeframe
    const rsi = 30 + Math.random() * 40;
    const macd = (Math.random() - 0.5) * 2;
    const ema = Math.random();
    
    let signal: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
    let confidence = 0;
    
    if (rsi < 30 && macd > 0 && ema > 0.5) {
      signal = 'BUY';
      confidence = 0.7 + Math.random() * 0.3;
    } else if (rsi > 70 && macd < 0 && ema < 0.5) {
      signal = 'SELL';
      confidence = 0.7 + Math.random() * 0.3;
    } else {
      confidence = Math.random() * 0.5;
    }
    
    return {
      timeframe,
      signal,
      confidence,
      indicators: { rsi, macd, ema }
    };
  }
}

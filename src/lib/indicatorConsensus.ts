interface IndicatorWeight {
  name: string;
  weight: number;
  threshold: number;
}

export class IndicatorConsensus {
  private weights: IndicatorWeight[] = [
    { name: 'RSI', weight: 0.15, threshold: 0.7 },
    { name: 'MACD', weight: 0.20, threshold: 0.75 },
    { name: 'EMA_CROSS', weight: 0.18, threshold: 0.7 },
    { name: 'VOLUME_PROFILE', weight: 0.12, threshold: 0.6 },
  ];

  calculateConsensus(indicators: Record<string, any>) {
    let buyScore = 0;
    let sellScore = 0;
    let totalWeight = 0;
    let activatedIndicators = 0;

    this.weights.forEach(({ name, weight, threshold }) => {
      const indicator = indicators[name];
      if (!indicator) return;

      const absoluteValue = Math.abs(indicator.value);
      
      if (absoluteValue >= threshold) {
        activatedIndicators++;
        
        if (indicator.signal === 'BUY') {
          buyScore += weight * (absoluteValue / threshold);
        } else if (indicator.signal === 'SELL') {
          sellScore += weight * (absoluteValue / threshold);
        }
      }
      
      totalWeight += weight;
    });

    const activationRatio = activatedIndicators / this.weights.length;
    
    if (activationRatio < 0.6) {
      return { signal: 'HOLD', confidence: 0, activationRatio };
    }

    const netScore = buyScore - sellScore;
    const confidence = Math.min(Math.abs(netScore) / totalWeight, 1);
    
    if (netScore > 0.1) return { signal: 'BUY', confidence, activationRatio };
    if (netScore < -0.1) return { signal: 'SELL', confidence, activationRatio };
    return { signal: 'HOLD', confidence: 0, activationRatio };
  }
}

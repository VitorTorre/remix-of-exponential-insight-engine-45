export class SignalQualityFilter {
  private volumeHistory: number[] = [];

  private calculateAverageVolume(): number {
    if (this.volumeHistory.length === 0) return 1000000;
    return this.volumeHistory.reduce((a, b) => a + b, 0) / this.volumeHistory.length;
  }

  updateVolumeHistory(volume: number) {
    this.volumeHistory.push(volume);
    if (this.volumeHistory.length > 100) {
      this.volumeHistory = this.volumeHistory.slice(-100);
    }
  }

  evaluateSignalQuality(signal: any): { quality: 'HIGH' | 'MEDIUM' | 'LOW'; reasons: string[] } {
    const reasons: string[] = [];
    let score = 0;
    const maxScore = 5;

    if (signal.volume > this.calculateAverageVolume() * 1.2) {
      score += 1;
      reasons.push('Volume acima da média');
    }

    if (signal.volatility < 0.02) {
      score += 1;
      reasons.push('Baixa volatilidade');
    }

    if (signal.confidence > 0.8) {
      score += 1;
      reasons.push('Alta confiança dos indicadores');
    }

    const qualityScore = score / maxScore;
    
    if (qualityScore >= 0.8) return { quality: 'HIGH', reasons };
    if (qualityScore >= 0.6) return { quality: 'MEDIUM', reasons };
    return { quality: 'LOW', reasons };
  }

  shouldExecuteSignal(signal: any): boolean {
    const quality = this.evaluateSignalQuality(signal);
    return quality.quality === 'HIGH' || 
          (quality.quality === 'MEDIUM' && signal.confidence > 0.85);
  }
}

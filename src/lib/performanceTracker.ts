export class PrecisionTracker {
  private results: Array<{
    timestamp: Date;
    predicted: string;
    actual: string;
    confidence: number;
  }> = [];

  calculatePrecision() {
    const total = this.results.length;
    const correct = this.results.filter(r => r.predicted === r.actual).length;
    
    return {
      overall: correct / total,
      recent: this.calculateRecentPrecision(),
      byConfidence: this.calculateByConfidence()
    };
  }

  private calculateRecentPrecision() {
    const recent = this.results.slice(-100);
    const correct = recent.filter(r => r.predicted === r.actual).length;
    return correct / recent.length;
  }

  private calculateByConfidence() {
    const ranges = [
      { min: 0, max: 0.5, label: 'low' },
      { min: 0.5, max: 0.75, label: 'medium' },
      { min: 0.75, max: 1, label: 'high' }
    ];
    
    return ranges.map(range => {
      const inRange = this.results.filter(
        r => r.confidence >= range.min && r.confidence < range.max
      );
      const correct = inRange.filter(r => r.predicted === r.actual).length;
      
      return {
        range: range.label,
        accuracy: inRange.length > 0 ? correct / inRange.length : 0,
        count: inRange.length
      };
    });
  }

  addResult(predicted: string, actual: string, confidence: number) {
    this.results.push({
      timestamp: new Date(),
      predicted,
      actual,
      confidence
    });
    
    // Manter apenas os últimos 1000 resultados
    if (this.results.length > 1000) {
      this.results = this.results.slice(-1000);
    }
  }
}

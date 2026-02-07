import { MultiTimeframeValidator } from './multiTimeframeValidation';
import { IndicatorConsensus } from './indicatorConsensus';
import { SignalQualityFilter } from './signalQualityFilter';

export class HighPrecisionEngine {
  private validator = new MultiTimeframeValidator();
  private consensus = new IndicatorConsensus();
  private qualityFilter = new SignalQualityFilter();

  async generateSignal(symbol: string, marketData: any) {
    const timeframeValidation = await this.validator.validateSignal(symbol);
    const indicatorConsensus = this.consensus.calculateConsensus(marketData.indicators);
    
    const finalSignal = this.calculateFinalSignal({
      timeframe: timeframeValidation,
      indicators: indicatorConsensus,
    });

    const qualityAssessment = this.qualityFilter.evaluateSignalQuality(finalSignal);

    return {
      ...finalSignal,
      quality: qualityAssessment.quality,
      reasons: qualityAssessment.reasons,
      shouldExecute: this.qualityFilter.shouldExecuteSignal(finalSignal)
    };
  }

  private calculateFinalSignal(inputs: any) {
    const weights = { timeframe: 0.35, indicators: 0.40 };
    let buyScore = 0;
    let sellScore = 0;

    if (inputs.timeframe.finalSignal === 'BUY') {
      buyScore += inputs.timeframe.confidence * weights.timeframe;
    } else if (inputs.timeframe.finalSignal === 'SELL') {
      sellScore += inputs.timeframe.confidence * weights.timeframe;
    }

    if (inputs.indicators.signal === 'BUY') {
      buyScore += inputs.indicators.confidence * weights.indicators;
    } else if (inputs.indicators.signal === 'SELL') {
      sellScore += inputs.indicators.confidence * weights.indicators;
    }

    const netScore = buyScore - sellScore;
    const confidence = Math.abs(netScore);
    
    if (netScore > 0.15) return { signal: 'BUY', confidence };
    if (netScore < -0.15) return { signal: 'SELL', confidence };
    return { signal: 'HOLD', confidence: 0 };
  }
}

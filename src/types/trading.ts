export type SignalType = "COMPRA" | "VENDA" | "NEUTRO";

export interface Operation {
  id: string;
  timestamp: Date;
  asset: string;
  signal: SignalType;
  entry: number;
  exit?: number;
  pnl: number;
  confidence: number;
}

export interface TechnicalAnalysis {
  rsi: number;
  macd: number;
  ema: number;
  volume: number;
  trend: "bullish" | "bearish" | "neutral";
}

export interface MarketData {
  timestamp: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

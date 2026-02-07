import { supabase } from "@/integrations/supabase/client";

export interface CandleData {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  timestamp: string;
}

export interface MetaAnalysisResult {
  context: { type: string; description: string };
  pattern: string;
  matchedScenario: any | null;
  volatility: number;
  isShock: boolean;
  memory: any;
  prediction: {
    direction: 'UP' | 'DOWN' | 'LATERAL';
    outcome: string;
    probability: number;
  } | null;
}

export interface LearningResult {
  memoryId: string;
  result: 'WIN' | 'LOSS' | 'NEUTRAL';
  antifragileScore: number;
  scenarioUpdated: boolean;
}

export interface MicroReport {
  id: string;
  report_type: string;
  asset: string | null;
  timeframe: string | null;
  title: string;
  summary: string;
  detailed_analysis: string | null;
  patterns_identified: string[] | null;
  scenarios_matched: number[] | null;
  key_insights: any[];
  performance_metrics: any;
  volatility_analysis: any;
  recommendations: string[] | null;
  ai_generated: boolean;
  confidence_score: number;
  created_at: string;
}

export class AntifragileSystem {
  private static instance: AntifragileSystem;

  static getInstance(): AntifragileSystem {
    if (!AntifragileSystem.instance) {
      AntifragileSystem.instance = new AntifragileSystem();
    }
    return AntifragileSystem.instance;
  }

  async seedScenarios(): Promise<{ success: boolean; inserted: number }> {
    const { data, error } = await supabase.functions.invoke('antifragile-engine', {
      body: { action: 'seed_scenarios' }
    });

    if (error) throw error;
    return data;
  }

  async analyzeCandles(
    asset: string,
    timeframe: string,
    candles: CandleData[]
  ): Promise<{ success: boolean; analysis: MetaAnalysisResult }> {
    const { data, error } = await supabase.functions.invoke('antifragile-engine', {
      body: { 
        action: 'analyze',
        asset,
        timeframe,
        candles
      }
    });

    if (error) throw error;
    return data;
  }

  async recordLearning(
    asset: string,
    result: 'WIN' | 'LOSS' | 'NEUTRAL'
  ): Promise<{ success: boolean; learning: LearningResult }> {
    const { data, error } = await supabase.functions.invoke('antifragile-engine', {
      body: {
        action: 'learn',
        asset,
        operationResult: result
      }
    });

    if (error) throw error;
    return data;
  }

  async createMicroReport(
    asset?: string,
    timeframe?: string
  ): Promise<{ success: boolean; report: MicroReport }> {
    const { data, error } = await supabase.functions.invoke('antifragile-engine', {
      body: {
        action: 'create_report',
        asset,
        timeframe
      }
    });

    if (error) throw error;
    return data;
  }

  async exportCSV(
    exportType: 'operations' | 'micro_reports',
    filters?: Record<string, any>
  ): Promise<{ success: boolean; csv: string; recordsCount: number }> {
    const { data, error } = await supabase.functions.invoke('antifragile-engine', {
      body: {
        action: 'export',
        exportType,
        filters
      }
    });

    if (error) throw error;
    return data;
  }

  async getMemories(asset: string): Promise<{ 
    success: boolean; 
    memories: any[]; 
    learnings: any[] 
  }> {
    const { data, error } = await supabase.functions.invoke('antifragile-engine', {
      body: {
        action: 'get_memories',
        asset
      }
    });

    if (error) throw error;
    return data;
  }

  downloadCSV(csvContent: string, filename: string): void {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export const antifragileSystem = AntifragileSystem.getInstance();

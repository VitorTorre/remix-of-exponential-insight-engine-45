-- Tabela de cenários de padrões (100 base + dinâmicos)
CREATE TABLE public.pattern_scenarios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scenario_number INTEGER NOT NULL,
  context_description TEXT NOT NULL, -- Descrição das 5 velas anteriores
  context_type TEXT NOT NULL, -- tendência forte, fraca, consolidação, exaustão
  pattern_name TEXT NOT NULL, -- Martelo, Engolfo, Estrela, Doji, etc.
  pattern_type TEXT NOT NULL, -- bullish, bearish, neutral
  expected_outcome TEXT NOT NULL, -- EX↑, CP↓, Reversão, etc.
  expected_direction TEXT NOT NULL, -- UP, DOWN, LATERAL
  probability_score NUMERIC DEFAULT 0.5,
  total_occurrences INTEGER DEFAULT 0,
  successful_occurrences INTEGER DEFAULT 0,
  accuracy NUMERIC DEFAULT 0,
  is_base_scenario BOOLEAN DEFAULT true,
  discovered_by_ai BOOLEAN DEFAULT false,
  ai_confidence NUMERIC DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(scenario_number)
);

-- Tabela de memórias de mercado (longo prazo)
CREATE TABLE public.market_memories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  asset TEXT NOT NULL,
  timeframe TEXT NOT NULL,
  scenario_id UUID REFERENCES public.pattern_scenarios(id),
  candles_before JSONB NOT NULL, -- 5 velas anteriores
  pattern_candle JSONB NOT NULL, -- Vela central
  candles_after JSONB, -- 4 velas posteriores (quando disponível)
  max_favorable NUMERIC, -- Máxima favorável após padrão
  max_adverse NUMERIC, -- Máxima adversa
  final_direction TEXT, -- UP, DOWN, LATERAL
  signal_generated TEXT, -- COMPRA, VENDA, NEUTRO
  actual_result TEXT, -- WIN, LOSS, NEUTRAL
  volatility_index NUMERIC, -- Índice de volatilidade no momento
  market_stress_level NUMERIC DEFAULT 0, -- 0-1 nível de estresse
  learning_weight NUMERIC DEFAULT 1.0, -- Peso para aprendizado
  is_shock_event BOOLEAN DEFAULT false, -- Se foi um evento de choque
  antifragile_score NUMERIC DEFAULT 0, -- Score de antifragilidade
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de micro relatórios
CREATE TABLE public.micro_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  report_type TEXT NOT NULL, -- 'pattern', 'operation', 'daily', 'stress'
  asset TEXT,
  timeframe TEXT,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  detailed_analysis TEXT,
  patterns_identified TEXT[],
  scenarios_matched INTEGER[],
  key_insights JSONB DEFAULT '[]',
  performance_metrics JSONB DEFAULT '{}',
  volatility_analysis JSONB DEFAULT '{}',
  recommendations TEXT[],
  ai_generated BOOLEAN DEFAULT false,
  confidence_score NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de anotações do sistema e usuário
CREATE TABLE public.system_annotations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  annotation_type TEXT NOT NULL, -- 'learning', 'observation', 'alert', 'user_note'
  related_memory_id UUID REFERENCES public.market_memories(id),
  related_report_id UUID REFERENCES public.micro_reports(id),
  related_scenario_id UUID REFERENCES public.pattern_scenarios(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  importance_level INTEGER DEFAULT 1, -- 1-5
  tags TEXT[],
  is_ai_generated BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de exportações CSV
CREATE TABLE public.csv_exports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  export_type TEXT NOT NULL, -- 'operations', 'micro_reports', 'scenarios', 'memories'
  file_name TEXT NOT NULL,
  file_content TEXT NOT NULL, -- CSV content
  filters_applied JSONB DEFAULT '{}',
  records_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de aprendizado antifrágil
CREATE TABLE public.antifragile_learning (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  learning_type TEXT NOT NULL, -- 'shock_adaptation', 'pattern_evolution', 'weight_adjustment'
  trigger_event TEXT NOT NULL, -- O que causou o aprendizado
  before_state JSONB NOT NULL, -- Estado antes
  after_state JSONB NOT NULL, -- Estado depois
  improvement_delta NUMERIC, -- Melhoria observada
  scenarios_affected INTEGER[], -- Cenários afetados
  volatility_at_learning NUMERIC,
  stress_level_at_learning NUMERIC,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.pattern_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.micro_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_annotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.csv_exports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.antifragile_learning ENABLE ROW LEVEL SECURITY;

-- Create read policies (allow public read for now - will restrict later with auth)
CREATE POLICY "Allow read pattern_scenarios" ON public.pattern_scenarios FOR SELECT USING (true);
CREATE POLICY "Allow read market_memories" ON public.market_memories FOR SELECT USING (true);
CREATE POLICY "Allow read micro_reports" ON public.micro_reports FOR SELECT USING (true);
CREATE POLICY "Allow read system_annotations" ON public.system_annotations FOR SELECT USING (true);
CREATE POLICY "Allow read csv_exports" ON public.csv_exports FOR SELECT USING (true);
CREATE POLICY "Allow read antifragile_learning" ON public.antifragile_learning FOR SELECT USING (true);

-- Create insert policies (via service role for edge functions)
CREATE POLICY "Allow insert pattern_scenarios via service" ON public.pattern_scenarios FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow insert market_memories via service" ON public.market_memories FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow insert micro_reports via service" ON public.micro_reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow insert system_annotations via service" ON public.system_annotations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow insert csv_exports via service" ON public.csv_exports FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow insert antifragile_learning via service" ON public.antifragile_learning FOR INSERT WITH CHECK (true);

-- Create update policies
CREATE POLICY "Allow update pattern_scenarios" ON public.pattern_scenarios FOR UPDATE USING (true);
CREATE POLICY "Allow update market_memories" ON public.market_memories FOR UPDATE USING (true);
CREATE POLICY "Allow update micro_reports" ON public.micro_reports FOR UPDATE USING (true);

-- Enable realtime for market_memories
ALTER PUBLICATION supabase_realtime ADD TABLE public.market_memories;
ALTER PUBLICATION supabase_realtime ADD TABLE public.micro_reports;

-- Create indexes for performance
CREATE INDEX idx_market_memories_asset_timeframe ON public.market_memories(asset, timeframe);
CREATE INDEX idx_market_memories_scenario ON public.market_memories(scenario_id);
CREATE INDEX idx_market_memories_created ON public.market_memories(created_at DESC);
CREATE INDEX idx_pattern_scenarios_type ON public.pattern_scenarios(pattern_type, context_type);
CREATE INDEX idx_micro_reports_type ON public.micro_reports(report_type, created_at DESC);
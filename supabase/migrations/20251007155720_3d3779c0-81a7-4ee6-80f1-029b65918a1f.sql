-- Tabela para armazenar histórico de análises com resultados reais
CREATE TABLE IF NOT EXISTS public.signal_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset TEXT NOT NULL,
  timeframe TEXT NOT NULL,
  signal TEXT NOT NULL,
  confidence DECIMAL NOT NULL,
  entry_price DECIMAL NOT NULL,
  stop_loss DECIMAL,
  take_profit DECIMAL,
  strategies JSONB NOT NULL,
  predicted_result TEXT NOT NULL,
  actual_result TEXT,
  actual_exit_price DECIMAL,
  profit_loss DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  closed_at TIMESTAMP WITH TIME ZONE
);

-- Tabela para métricas de desempenho por estratégia e ativo
CREATE TABLE IF NOT EXISTS public.strategy_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset TEXT NOT NULL,
  timeframe TEXT NOT NULL,
  strategy_name TEXT NOT NULL,
  total_signals INTEGER DEFAULT 0,
  correct_signals INTEGER DEFAULT 0,
  accuracy DECIMAL DEFAULT 0,
  avg_confidence DECIMAL DEFAULT 0,
  weight DECIMAL DEFAULT 1.0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(asset, timeframe, strategy_name)
);

-- Tabela para métricas gerais de desempenho
CREATE TABLE IF NOT EXISTS public.performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset TEXT NOT NULL,
  timeframe TEXT NOT NULL,
  total_operations INTEGER DEFAULT 0,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  accuracy DECIMAL DEFAULT 0,
  consecutive_errors INTEGER DEFAULT 0,
  needs_review BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(asset, timeframe)
);

-- Índices para consultas rápidas
CREATE INDEX IF NOT EXISTS idx_signal_analysis_asset_time ON public.signal_analysis(asset, timeframe, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_strategy_performance_asset ON public.strategy_performance(asset, timeframe);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_asset ON public.performance_metrics(asset, timeframe);

-- Enable RLS
ALTER TABLE public.signal_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strategy_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;

-- Políticas RLS (público para leitura, restrito para escrita)
CREATE POLICY "Anyone can read signal_analysis" ON public.signal_analysis FOR SELECT USING (true);
CREATE POLICY "Anyone can insert signal_analysis" ON public.signal_analysis FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update signal_analysis" ON public.signal_analysis FOR UPDATE USING (true);

CREATE POLICY "Anyone can read strategy_performance" ON public.strategy_performance FOR SELECT USING (true);
CREATE POLICY "Anyone can insert strategy_performance" ON public.strategy_performance FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update strategy_performance" ON public.strategy_performance FOR UPDATE USING (true);

CREATE POLICY "Anyone can read performance_metrics" ON public.performance_metrics FOR SELECT USING (true);
CREATE POLICY "Anyone can insert performance_metrics" ON public.performance_metrics FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update performance_metrics" ON public.performance_metrics FOR UPDATE USING (true);

-- Função para atualizar pesos das estratégias baseado no desempenho
CREATE OR REPLACE FUNCTION public.update_strategy_weights()
RETURNS TRIGGER AS $$
BEGIN
  -- Atualiza métricas de performance da estratégia
  INSERT INTO public.strategy_performance (asset, timeframe, strategy_name, total_signals, correct_signals, accuracy, weight)
  SELECT 
    NEW.asset,
    NEW.timeframe,
    strategy->>'name' as strategy_name,
    1,
    CASE WHEN NEW.actual_result = 'WIN' THEN 1 ELSE 0 END,
    CASE WHEN NEW.actual_result = 'WIN' THEN 100.0 ELSE 0.0 END,
    1.0
  FROM jsonb_array_elements(NEW.strategies) as strategy
  ON CONFLICT (asset, timeframe, strategy_name) 
  DO UPDATE SET
    total_signals = strategy_performance.total_signals + 1,
    correct_signals = strategy_performance.correct_signals + CASE WHEN NEW.actual_result = 'WIN' THEN 1 ELSE 0 END,
    accuracy = ((strategy_performance.correct_signals::DECIMAL + CASE WHEN NEW.actual_result = 'WIN' THEN 1 ELSE 0 END) / (strategy_performance.total_signals::DECIMAL + 1)) * 100,
    weight = CASE 
      WHEN ((strategy_performance.correct_signals::DECIMAL + CASE WHEN NEW.actual_result = 'WIN' THEN 1 ELSE 0 END) / (strategy_performance.total_signals::DECIMAL + 1)) > 0.6 
      THEN 1.5
      WHEN ((strategy_performance.correct_signals::DECIMAL + CASE WHEN NEW.actual_result = 'WIN' THEN 1 ELSE 0 END) / (strategy_performance.total_signals::DECIMAL + 1)) > 0.5 
      THEN 1.0
      ELSE 0.5
    END,
    last_updated = now();

  -- Atualiza métricas gerais de performance
  INSERT INTO public.performance_metrics (asset, timeframe, total_operations, wins, losses, accuracy, consecutive_errors, needs_review)
  VALUES (
    NEW.asset,
    NEW.timeframe,
    1,
    CASE WHEN NEW.actual_result = 'WIN' THEN 1 ELSE 0 END,
    CASE WHEN NEW.actual_result = 'LOSS' THEN 1 ELSE 0 END,
    CASE WHEN NEW.actual_result = 'WIN' THEN 100.0 ELSE 0.0 END,
    CASE WHEN NEW.actual_result = 'LOSS' THEN 1 ELSE 0 END,
    CASE WHEN NEW.actual_result = 'LOSS' THEN true ELSE false END
  )
  ON CONFLICT (asset, timeframe)
  DO UPDATE SET
    total_operations = performance_metrics.total_operations + 1,
    wins = performance_metrics.wins + CASE WHEN NEW.actual_result = 'WIN' THEN 1 ELSE 0 END,
    losses = performance_metrics.losses + CASE WHEN NEW.actual_result = 'LOSS' THEN 1 ELSE 0 END,
    accuracy = ((performance_metrics.wins::DECIMAL + CASE WHEN NEW.actual_result = 'WIN' THEN 1 ELSE 0 END) / (performance_metrics.total_operations::DECIMAL + 1)) * 100,
    consecutive_errors = CASE 
      WHEN NEW.actual_result = 'LOSS' THEN performance_metrics.consecutive_errors + 1
      ELSE 0
    END,
    needs_review = CASE 
      WHEN NEW.actual_result = 'LOSS' AND performance_metrics.consecutive_errors + 1 >= 5 THEN true
      ELSE false
    END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para atualizar pesos quando um resultado é registrado
CREATE TRIGGER update_weights_on_result
AFTER UPDATE OF actual_result ON public.signal_analysis
FOR EACH ROW
WHEN (NEW.actual_result IS NOT NULL AND OLD.actual_result IS NULL)
EXECUTE FUNCTION public.update_strategy_weights();
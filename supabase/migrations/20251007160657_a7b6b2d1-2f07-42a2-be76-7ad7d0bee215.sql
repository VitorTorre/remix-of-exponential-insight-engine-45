-- Fix critical error: remove last_updated column reference that doesn't exist
-- and improve the adaptive learning system

CREATE OR REPLACE FUNCTION public.update_strategy_weights()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Update strategy performance metrics
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
    -- Adaptive weight calculation based on recent performance
    weight = CASE 
      WHEN ((strategy_performance.correct_signals::DECIMAL + CASE WHEN NEW.actual_result = 'WIN' THEN 1 ELSE 0 END) / (strategy_performance.total_signals::DECIMAL + 1)) > 0.7 
      THEN 2.0  -- Excellent strategy (>70% accuracy)
      WHEN ((strategy_performance.correct_signals::DECIMAL + CASE WHEN NEW.actual_result = 'WIN' THEN 1 ELSE 0 END) / (strategy_performance.total_signals::DECIMAL + 1)) > 0.6 
      THEN 1.5  -- Good strategy (60-70% accuracy)
      WHEN ((strategy_performance.correct_signals::DECIMAL + CASE WHEN NEW.actual_result = 'WIN' THEN 1 ELSE 0 END) / (strategy_performance.total_signals::DECIMAL + 1)) > 0.5 
      THEN 1.0  -- Average strategy (50-60% accuracy)
      ELSE 0.5  -- Poor strategy (<50% accuracy)
    END,
    last_updated = now();

  -- Update overall performance metrics
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
$function$;

-- Create trigger to update weights when analysis result is recorded
DROP TRIGGER IF EXISTS update_weights_on_result ON public.signal_analysis;
CREATE TRIGGER update_weights_on_result
  AFTER UPDATE OF actual_result ON public.signal_analysis
  FOR EACH ROW
  WHEN (NEW.actual_result IS NOT NULL AND OLD.actual_result IS DISTINCT FROM NEW.actual_result)
  EXECUTE FUNCTION public.update_strategy_weights();
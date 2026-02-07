-- Remove public write access from all trading tables to prevent data corruption
-- Edge Functions with service_role key will still be able to write
-- Frontend can still read data for display

-- Drop all public INSERT and UPDATE policies
DROP POLICY IF EXISTS "Anyone can insert signal_analysis" ON public.signal_analysis;
DROP POLICY IF EXISTS "Anyone can update signal_analysis" ON public.signal_analysis;

DROP POLICY IF EXISTS "Anyone can insert performance_metrics" ON public.performance_metrics;
DROP POLICY IF EXISTS "Anyone can update performance_metrics" ON public.performance_metrics;

DROP POLICY IF EXISTS "Anyone can insert strategy_performance" ON public.strategy_performance;
DROP POLICY IF EXISTS "Anyone can update strategy_performance" ON public.strategy_performance;

-- Keep SELECT policies for frontend to display data
-- (These already exist, no changes needed)
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { antifragileSystem, CandleData, MetaAnalysisResult, MicroReport } from '@/lib/antifragileSystem';
import { toast } from 'sonner';

export function useAntifragileSystem(asset: string) {
  const queryClient = useQueryClient();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<MetaAnalysisResult | null>(null);

  // Query for memories
  const { 
    data: memoriesData, 
    isLoading: isLoadingMemories,
    refetch: refetchMemories 
  } = useQuery({
    queryKey: ['antifragile-memories', asset],
    queryFn: () => antifragileSystem.getMemories(asset),
    enabled: !!asset,
    staleTime: 30000,
  });

  // Seed scenarios mutation
  const seedScenariosMutation = useMutation({
    mutationFn: () => antifragileSystem.seedScenarios(),
    onSuccess: (data) => {
      toast.success(`${data.inserted} cenários base inseridos com sucesso!`);
    },
    onError: (error) => {
      toast.error('Erro ao inserir cenários: ' + (error as Error).message);
    },
  });

  // Analyze candles
  const analyzeCandles = useCallback(async (
    timeframe: string,
    candles: CandleData[]
  ): Promise<MetaAnalysisResult | null> => {
    setIsAnalyzing(true);
    try {
      const result = await antifragileSystem.analyzeCandles(asset, timeframe, candles);
      if (result.success) {
        setLastAnalysis(result.analysis);
        refetchMemories();
        return result.analysis;
      }
      return null;
    } catch (error) {
      toast.error('Erro na análise: ' + (error as Error).message);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, [asset, refetchMemories]);

  // Record learning
  const recordLearningMutation = useMutation({
    mutationFn: (result: 'WIN' | 'LOSS' | 'NEUTRAL') => 
      antifragileSystem.recordLearning(asset, result),
    onSuccess: (data) => {
      if (data.success) {
        toast.success(`Aprendizado registrado! Score antifrágil: ${data.learning.antifragileScore.toFixed(1)}`);
        refetchMemories();
      }
    },
    onError: (error) => {
      toast.error('Erro ao registrar aprendizado: ' + (error as Error).message);
    },
  });

  // Create micro report
  const createReportMutation = useMutation({
    mutationFn: (params: { timeframe?: string }) => 
      antifragileSystem.createMicroReport(asset, params.timeframe),
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Micro relatório criado com sucesso!');
        queryClient.invalidateQueries({ queryKey: ['micro-reports'] });
      }
    },
    onError: (error) => {
      toast.error('Erro ao criar relatório: ' + (error as Error).message);
    },
  });

  // Export CSV
  const exportCSV = useCallback(async (
    exportType: 'operations' | 'micro_reports'
  ) => {
    try {
      const result = await antifragileSystem.exportCSV(exportType);
      if (result.success) {
        const filename = `${exportType}_${new Date().toISOString().split('T')[0]}.csv`;
        antifragileSystem.downloadCSV(result.csv, filename);
        toast.success(`${result.recordsCount} registros exportados!`);
      }
    } catch (error) {
      toast.error('Erro ao exportar: ' + (error as Error).message);
    }
  }, []);

  return {
    // State
    isAnalyzing,
    lastAnalysis,
    memories: memoriesData?.memories || [],
    learnings: memoriesData?.learnings || [],
    isLoadingMemories,

    // Actions
    seedScenarios: seedScenariosMutation.mutate,
    isSeedingScenarios: seedScenariosMutation.isPending,
    
    analyzeCandles,
    
    recordLearning: recordLearningMutation.mutate,
    isRecordingLearning: recordLearningMutation.isPending,
    
    createReport: createReportMutation.mutate,
    isCreatingReport: createReportMutation.isPending,
    
    exportCSV,
    refetchMemories,
  };
}

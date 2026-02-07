import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const AnalysisReport = () => {
  const { data: recentAnalyses, isLoading } = useQuery({
    queryKey: ['recent-analyses'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('signal_analysis')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data as any[];
    },
    refetchInterval: 5000,
  });

  const { data: performanceData } = useQuery({
    queryKey: ['performance-metrics'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('performance_metrics')
        .select('*')
        .order('last_updated', { ascending: false })
        .limit(1)
        .single();
      
      if (error) throw error;
      return data as any;
    },
    refetchInterval: 5000,
  });

  return (
    <Card className="p-6 border-primary/20">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Últimas 10 Análises</h3>
          {performanceData && performanceData.needs_review && (
            <Badge variant="destructive" className="gap-1">
              <AlertTriangle className="w-3 h-3" />
              Revisão Necessária
            </Badge>
          )}
        </div>

        {performanceData && (
          <div className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-muted/50">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Acertos</p>
              <p className="text-lg font-bold text-green-500">{performanceData.correct_signals}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Erros</p>
              <p className="text-lg font-bold text-red-500">{performanceData.incorrect_signals}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Precisão</p>
              <p className="text-lg font-bold text-primary">{performanceData.accuracy_rate.toFixed(1)}%</p>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Carregando análises...
          </div>
        ) : !recentAnalyses || recentAnalyses.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhuma análise registrada ainda
          </div>
        ) : (
          <ScrollArea className="h-[300px]">
            <div className="space-y-3">
              {recentAnalyses.map((analysis) => (
                <div
                  key={analysis.id}
                  className="p-4 rounded-lg bg-secondary/50 border border-border"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">{analysis.asset}</span>
                        <Badge variant="outline" className="text-xs">
                          {analysis.timeframe}
                        </Badge>
                        <Badge
                          variant={analysis.signal === "COMPRA" ? "default" : "destructive"}
                          className="text-xs"
                        >
                          {analysis.signal}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>Confiança: {analysis.confidence}%</p>
                        <p>Entrada: R$ {analysis.entry_price?.toFixed(2) || "N/A"}</p>
                        {analysis.actual_result && (
                          <p className="flex items-center gap-1 mt-2">
                            {analysis.actual_result === "WIN" ? (
                              <>
                                <CheckCircle className="w-3 h-3 text-green-500" />
                                <span className="text-green-500 font-semibold">Acertou</span>
                              </>
                            ) : analysis.actual_result === "LOSS" ? (
                              <>
                                <XCircle className="w-3 h-3 text-red-500" />
                                <span className="text-red-500 font-semibold">Errou</span>
                              </>
                            ) : (
                              <>
                                <Clock className="w-3 h-3 text-yellow-500" />
                                <span className="text-yellow-500 font-semibold">Pendente</span>
                              </>
                            )}
                          </p>
                        )}
                        {analysis.error_reason && (
                          <p className="text-destructive text-xs mt-1">
                            Razão: {analysis.error_reason}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        {performanceData && performanceData.consecutive_errors >= 5 && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <p className="text-xs text-destructive font-semibold">
              ⚠️ {performanceData.consecutive_errors} erros consecutivos detectados
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              O sistema está sendo monitorado para ajustes
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default AnalysisReport;

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Operation, SignalType } from "@/types/trading";

interface SignalPanelProps {
  asset: string;
  onNewOperation: (operation: Operation) => void;
  currentCapital: number;
  timeframe: string;
  isRealMode: boolean;
}

const SignalPanel = ({ asset, onNewOperation, currentCapital, timeframe, isRealMode }: SignalPanelProps) => {
  const [signal, setSignal] = useState<SignalType>("NEUTRO");
  const [confidence, setConfidence] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [stopLoss, setStopLoss] = useState<number | null>(null);
  const [takeProfit, setTakeProfit] = useState<number | null>(null);
  const [riskReward, setRiskReward] = useState<number | null>(null);
  const [patterns, setPatterns] = useState<string[]>([]);
  const [strategies, setStrategies] = useState<any[]>([]);

  const analyzeMarket = async () => {
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-signal', {
        body: { asset, capital: currentCapital, timeframe }
      });

      if (error) throw error;

      if (data) {
        setSignal(data.signal);
        setConfidence(data.confidence);
        setStopLoss(data.stopLoss?.trailingStop || null);
        setRiskReward(data.stopLoss?.riskRewardRatio || null);
        
        if (data.signal === "COMPRA") {
          setTakeProfit(data.supportResistance?.resistanceLevels?.[0] || null);
        } else if (data.signal === "VENDA") {
          setTakeProfit(data.supportResistance?.supportLevels?.[0] || null);
        }
        
        setPatterns(data.candlePatterns?.map((p: any) => p.name) || []);
        setStrategies(data.strategies || []);
        
        // Salvar análise no banco de dados
        await (supabase as any).from('signal_analysis').insert({
          asset,
          timeframe,
          signal: data.signal,
          confidence: data.confidence,
          entry_price: 1000 + Math.random() * 500,
          predicted_result: data.signal === "NEUTRO" ? "NEUTRAL" : "WIN",
          metadata: {
            stopLoss: data.stopLoss,
            supportResistance: data.supportResistance,
            patterns: data.candlePatterns,
            isRealMode
          }
        });
        
        toast.success(data.recommendation);
      }
    } catch (error) {
      console.error('Error analyzing market:', error);
      toast.error('Erro ao analisar mercado');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const executeOperation = () => {
    if (signal === "NEUTRO") {
      toast.warning("Aguarde um sinal válido antes de executar");
      return;
    }

    const operation: Operation = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      asset,
      signal,
      entry: 1000 + Math.random() * 500,
      pnl: (Math.random() - 0.3) * 200,
      confidence
    };

    onNewOperation(operation);
    toast.success(`Operação ${signal} executada em ${asset}`);
  };

  const getSignalConfig = () => {
    switch (signal) {
      case "COMPRA":
        return {
          icon: TrendingUp,
          color: "text-green-500",
          bgClass: "bg-green-500/10 border-green-500/30",
          label: "COMPRA"
        };
      case "VENDA":
        return {
          icon: TrendingDown,
          color: "text-red-500",
          bgClass: "bg-red-500/10 border-red-500/30",
          label: "VENDA"
        };
      default:
        return {
          icon: Minus,
          color: "text-muted-foreground",
          bgClass: "bg-muted/50 border-border",
          label: "NEUTRO"
        };
    }
  };

  const config = getSignalConfig();
  const Icon = config.icon;

  return (
    <Card className="p-6 lg:col-span-2">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Análise de Sinal</h2>
          <Button 
            onClick={analyzeMarket}
            disabled={isAnalyzing}
            className="gap-2"
          >
            {isAnalyzing ? "Analisando..." : "Analisar Mercado"}
          </Button>
        </div>

        <div className={`flex items-center justify-center p-8 rounded-xl border-2 ${config.bgClass}`}>
          <div className="text-center space-y-2">
            <Icon className={`w-16 h-16 mx-auto ${config.color}`} />
            <h3 className={`text-3xl font-bold ${config.color}`}>{config.label}</h3>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <span className="text-sm text-muted-foreground">Confiança do Sinal</span>
            <span className="text-2xl font-bold">{confidence.toFixed(0)}%</span>
          </div>
          <Progress value={confidence} className="h-2" />
          
          {stopLoss && (
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-xs text-muted-foreground">Stop Loss</p>
                <p className="text-lg font-bold text-destructive">${stopLoss.toFixed(2)}</p>
              </div>
              {takeProfit && (
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-xs text-muted-foreground">Take Profit</p>
                  <p className="text-lg font-bold text-primary">${takeProfit.toFixed(2)}</p>
                </div>
              )}
            </div>
          )}
          
          {riskReward && (
            <div className="p-3 rounded-lg bg-muted/50 mt-2">
              <p className="text-xs text-muted-foreground">Risco/Retorno</p>
              <p className="text-lg font-bold">1:{riskReward.toFixed(2)}</p>
            </div>
          )}
          
          {patterns.length > 0 && (
            <div className="p-3 rounded-lg bg-muted/50 mt-2">
              <p className="text-xs text-muted-foreground mb-2">Padrões Detectados</p>
              <div className="flex flex-wrap gap-2">
                {patterns.map((pattern, idx) => (
                  <span key={idx} className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                    {pattern}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {strategies.length > 0 && (
            <div className="p-4 rounded-lg bg-muted/50 mt-2 space-y-3">
              <p className="text-sm font-semibold text-muted-foreground mb-3">5 Estratégias Profissionais</p>
              {strategies.map((strategy, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded bg-background/50">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      strategy.signal === "COMPRA" ? "bg-green-500" : 
                      strategy.signal === "VENDA" ? "bg-red-500" : "bg-muted-foreground"
                    }`} />
                    <span className="text-xs font-medium">{strategy.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${
                      strategy.signal === "COMPRA" ? "text-green-500" : 
                      strategy.signal === "VENDA" ? "text-red-500" : "text-muted-foreground"
                    }`}>
                      {strategy.signal}
                    </span>
                    <span className="text-xs text-muted-foreground">{strategy.confidence.toFixed(0)}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {signal !== "NEUTRO" && (
          <Button 
            onClick={executeOperation}
            className="w-full"
            size="lg"
          >
            Executar Operação
          </Button>
        )}
      </div>
    </Card>
  );
};

export default SignalPanel;

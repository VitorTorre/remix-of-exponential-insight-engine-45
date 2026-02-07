import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Activity, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";

interface TechnicalIndicatorsProps {
  asset: string;
}

const TechnicalIndicators = ({ asset }: TechnicalIndicatorsProps) => {
  const [indicators, setIndicators] = useState([
    { name: "RSI (14)", value: 64.5, max: 100, status: "neutral" },
    { name: "MACD", value: 0.52, max: 2, status: "bullish" },
    { name: "EMA (20)", value: 1850.23, max: 2000, status: "bullish" },
    { name: "Volume", value: 75, max: 100, status: "high" },
  ]);
  const [trend, setTrend] = useState<string>("bullish");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAnalysis = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke('market-analysis', {
          body: { asset }
        });

        if (error) throw error;

        if (data?.indicators) {
          setIndicators([
            { name: "RSI (14)", value: data.indicators.rsi, max: 100, status: data.indicators.rsi > 70 ? "bearish" : data.indicators.rsi < 30 ? "bullish" : "neutral" },
            { name: "MACD", value: Math.abs(data.indicators.macd), max: 2, status: data.indicators.macd > 0 ? "bullish" : "bearish" },
            { name: "EMA (20)", value: data.indicators.ema, max: data.indicators.ema * 1.2, status: "bullish" },
            { name: "Volume", value: data.indicators.volume, max: 100, status: data.indicators.volume > 60 ? "high" : "low" },
          ]);
          setTrend(data.indicators.trend);
        }
      } catch (error) {
        console.error('Error fetching market analysis:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalysis();
    const interval = setInterval(fetchAnalysis, 30000); // Atualizar a cada 30 segundos
    
    return () => clearInterval(interval);
  }, [asset]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "bullish": return "text-bull";
      case "bearish": return "text-bear";
      default: return "text-neutral";
    }
  };

  return (
    <Card className="p-6 border-primary/20">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold">Indicadores Técnicos</h2>
      </div>

      <div className="space-y-6">
        {indicators.map((indicator, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{indicator.name}</span>
              <span className={`text-sm font-semibold ${getStatusColor(indicator.status)}`}>
                {indicator.value.toFixed(2)}
              </span>
            </div>
            <Progress value={(indicator.value / indicator.max) * 100} className="h-2" />
          </div>
        ))}

        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className={`w-4 h-4 ${
              trend === 'bullish' ? 'text-bull' : 
              trend === 'bearish' ? 'text-bear' : 
              'text-neutral'
            }`} />
            <span className="text-sm font-semibold">Tendência Geral</span>
          </div>
          <div className={`p-3 rounded-lg border ${
            trend === 'bullish' ? 'bg-bull/10 border-bull/30' : 
            trend === 'bearish' ? 'bg-bear/10 border-bear/30' : 
            'bg-neutral/10 border-neutral/30'
          }`}>
            <p className={`text-sm font-medium uppercase ${
              trend === 'bullish' ? 'text-bull' : 
              trend === 'bearish' ? 'text-bear' : 
              'text-neutral'
            }`}>{trend}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {isLoading ? 'Atualizando indicadores...' : 
               trend === 'bullish' ? 'Indicadores sugerem movimento de alta' :
               trend === 'bearish' ? 'Indicadores sugerem movimento de baixa' :
               'Mercado sem direção clara'}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TechnicalIndicators;

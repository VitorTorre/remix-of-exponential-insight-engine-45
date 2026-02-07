import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, TrendingDown, Activity, Newspaper, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface NextCandle {
  timeframe: string;
  prediction: 'UP' | 'DOWN';
  probability: number;
}

interface Opportunity {
  asset: string;
  score: number;
  signal: 'BUY' | 'SELL';
  confidence: number;
  nextCandles: NextCandle[];
  orderFlow: {
    buyVolume: number;
    sellVolume: number;
    ratio: number;
  };
  newsImpact: {
    sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
    relevance: number;
  };
  technicalStrength: number;
}

const OpportunitiesDashboard = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOpportunities();
    const interval = setInterval(fetchOpportunities, 60000); // Atualizar a cada minuto
    return () => clearInterval(interval);
  }, []);

  const fetchOpportunities = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('market-opportunities');
      
      if (error) throw error;
      
      if (data?.success) {
        setOpportunities(data.topOpportunities);
      }
    } catch (error) {
      console.error('Erro ao buscar oportunidades:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAsset = (asset: string) => {
    // Navegar para análise do ativo
    navigate(`/?asset=${encodeURIComponent(asset)}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Activity className="w-16 h-16 animate-pulse mx-auto text-primary" />
          <p className="text-lg text-muted-foreground">Analisando oportunidades de mercado...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Top 5 Oportunidades Agora
          </h1>
          <p className="text-muted-foreground">
            Análise macro em tempo real com fluxo de ordens e impacto de notícias
          </p>
        </div>

        <div className="grid gap-6">
          {opportunities.map((opp, index) => (
            <Card key={opp.asset} className="p-6 hover:shadow-lg transition-all border-primary/20">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Badge className="text-2xl font-bold px-4 py-2" variant="outline">
                      #{index + 1}
                    </Badge>
                    <div>
                      <h2 className="text-2xl font-bold">{opp.asset}</h2>
                      <p className="text-sm text-muted-foreground">
                        Score: {opp.score.toFixed(1)}/100
                      </p>
                    </div>
                  </div>
                  <Badge 
                    variant={opp.signal === 'BUY' ? 'default' : 'destructive'}
                    className="text-lg px-4 py-2"
                  >
                    {opp.signal === 'BUY' ? (
                      <><TrendingUp className="w-5 h-5 mr-2" /> COMPRA</>
                    ) : (
                      <><TrendingDown className="w-5 h-5 mr-2" /> VENDA</>
                    )}
                  </Badge>
                </div>

                {/* Métricas */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Confiança</p>
                    <p className="text-lg font-semibold">{(opp.confidence * 100).toFixed(1)}%</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Força Técnica</p>
                    <p className="text-lg font-semibold">{(opp.technicalStrength * 100).toFixed(1)}%</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Fluxo Compra/Venda</p>
                    <p className="text-lg font-semibold">{(opp.orderFlow.ratio * 100).toFixed(1)}%</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Sentimento Notícias</p>
                    <Badge variant={
                      opp.newsImpact.sentiment === 'POSITIVE' ? 'default' : 
                      opp.newsImpact.sentiment === 'NEGATIVE' ? 'destructive' : 
                      'secondary'
                    }>
                      <Newspaper className="w-3 h-3 mr-1" />
                      {opp.newsImpact.sentiment}
                    </Badge>
                  </div>
                </div>

                {/* Previsão próximas velas */}
                <div className="space-y-2">
                  <p className="text-sm font-semibold">Previsão Próximas Velas:</p>
                  <div className="flex gap-2 flex-wrap">
                    {opp.nextCandles.map((candle) => (
                      <Badge 
                        key={candle.timeframe}
                        variant={candle.prediction === 'UP' ? 'default' : 'destructive'}
                        className="flex items-center gap-1"
                      >
                        {candle.timeframe}: {candle.prediction === 'UP' ? '📈' : '📉'}
                        {(candle.probability * 100).toFixed(0)}%
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Fluxo de Ordens */}
                <div className="space-y-2">
                  <p className="text-sm font-semibold">Fluxo de Ordens:</p>
                  <div className="relative h-8 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="absolute left-0 top-0 h-full bg-green-500/30 flex items-center justify-start px-2"
                      style={{ width: `${opp.orderFlow.ratio * 100}%` }}
                    >
                      <span className="text-xs font-bold">
                        Compra: {(opp.orderFlow.buyVolume / 1000).toFixed(0)}K
                      </span>
                    </div>
                    <div 
                      className="absolute right-0 top-0 h-full bg-red-500/30 flex items-center justify-end px-2"
                      style={{ width: `${(1 - opp.orderFlow.ratio) * 100}%` }}
                    >
                      <span className="text-xs font-bold">
                        Venda: {(opp.orderFlow.sellVolume / 1000).toFixed(0)}K
                      </span>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={() => handleSelectAsset(opp.asset)}
                  className="w-full"
                  size="lg"
                >
                  Analisar {opp.asset}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" size="lg" onClick={() => navigate('/dashboard')}>
            Ver Análise Completa
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OpportunitiesDashboard;

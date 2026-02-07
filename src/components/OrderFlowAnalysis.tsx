import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import { useEffect, useState } from "react";

interface OrderFlowProps {
  asset: string;
}

interface FlowData {
  buyPressure: number;
  sellPressure: number;
  netFlow: number;
  dominance: 'BUYERS' | 'SELLERS' | 'NEUTRAL';
  strength: number;
}

const OrderFlowAnalysis = ({ asset }: OrderFlowProps) => {
  const [flowData, setFlowData] = useState<FlowData>({
    buyPressure: 0,
    sellPressure: 0,
    netFlow: 0,
    dominance: 'NEUTRAL',
    strength: 0
  });

  useEffect(() => {
    updateFlowData();
    const interval = setInterval(updateFlowData, 3000);
    return () => clearInterval(interval);
  }, [asset]);

  const updateFlowData = () => {
    const buyPressure = Math.random() * 100;
    const sellPressure = Math.random() * 100;
    const netFlow = buyPressure - sellPressure;
    const total = buyPressure + sellPressure;
    const strength = Math.abs(netFlow) / total;

    let dominance: 'BUYERS' | 'SELLERS' | 'NEUTRAL' = 'NEUTRAL';
    if (netFlow > 15) dominance = 'BUYERS';
    else if (netFlow < -15) dominance = 'SELLERS';

    setFlowData({
      buyPressure,
      sellPressure,
      netFlow,
      dominance,
      strength
    });
  };

  return (
    <Card className="p-6 border-primary/20">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Fluxo de Ordens</h3>
          </div>
          <Badge variant={
            flowData.dominance === 'BUYERS' ? 'default' :
            flowData.dominance === 'SELLERS' ? 'destructive' :
            'secondary'
          }>
            {flowData.dominance}
          </Badge>
        </div>

        {/* Barra de pressão */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-green-500 font-semibold flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              Compradores: {flowData.buyPressure.toFixed(1)}%
            </span>
            <span className="text-red-500 font-semibold flex items-center gap-1">
              <TrendingDown className="w-4 h-4" />
              Vendedores: {flowData.sellPressure.toFixed(1)}%
            </span>
          </div>
          
          <div className="relative h-12 bg-secondary rounded-lg overflow-hidden">
            <div 
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-500/50 to-green-500/30 flex items-center justify-start px-3 transition-all duration-500"
              style={{ width: `${(flowData.buyPressure / (flowData.buyPressure + flowData.sellPressure)) * 100}%` }}
            >
              <span className="text-xs font-bold text-white">BUY</span>
            </div>
            <div 
              className="absolute right-0 top-0 h-full bg-gradient-to-l from-red-500/50 to-red-500/30 flex items-center justify-end px-3 transition-all duration-500"
              style={{ width: `${(flowData.sellPressure / (flowData.buyPressure + flowData.sellPressure)) * 100}%` }}
            >
              <span className="text-xs font-bold text-white">SELL</span>
            </div>
          </div>
        </div>

        {/* Fluxo líquido */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Fluxo Líquido</p>
            <p className={`text-xl font-bold ${flowData.netFlow >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {flowData.netFlow >= 0 ? '+' : ''}{flowData.netFlow.toFixed(1)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Força do Movimento</p>
            <p className="text-xl font-bold">
              {(flowData.strength * 100).toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Interpretação */}
        <div className="p-3 bg-secondary/50 rounded-lg">
          <p className="text-sm">
            {flowData.dominance === 'BUYERS' && 
              "📈 Forte pressão compradora. Volume de compras dominando o mercado."
            }
            {flowData.dominance === 'SELLERS' && 
              "📉 Forte pressão vendedora. Volume de vendas dominando o mercado."
            }
            {flowData.dominance === 'NEUTRAL' && 
              "⚖️ Mercado equilibrado. Aguardando definição de direção."
            }
          </p>
        </div>
      </div>
    </Card>
  );
};

export default OrderFlowAnalysis;

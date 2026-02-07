import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface TimeframeSelectorProps {
  selectedTimeframe: string;
  onTimeframeChange: (timeframe: string) => void;
  recommendations: Record<string, number>;
}

const TimeframeSelector = ({ selectedTimeframe, onTimeframeChange, recommendations }: TimeframeSelectorProps) => {
  const timeframes = ["1m", "2m", "3m", "5m"];

  return (
    <Card className="p-6 border-primary/20">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold">Período de Operação</h3>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {timeframes.map((tf) => {
            const score = recommendations[tf] || 0;
            const isSelected = selectedTimeframe === tf;
            const isBest = score === Math.max(...Object.values(recommendations));

            return (
              <button
                key={tf}
                onClick={() => onTimeframeChange(tf)}
                className={`relative p-3 rounded-lg border-2 transition-all ${
                  isSelected
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50 bg-card"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{tf}</span>
                  {isBest && score > 0 && (
                    <Badge variant="default" className="text-xs">
                      Melhor
                    </Badge>
                  )}
                </div>
                {score > 0 && (
                  <div className="mt-2">
                    <div className="text-xs text-muted-foreground">Score</div>
                    <div className="text-sm font-bold text-primary">{score.toFixed(1)}%</div>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="p-3 rounded-lg bg-muted/50">
          <p className="text-xs text-muted-foreground">
            📊 Períodos recomendados baseados em análise de volatilidade e tendência
          </p>
        </div>
      </div>
    </Card>
  );
};

export default TimeframeSelector;

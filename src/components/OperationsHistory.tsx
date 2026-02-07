import { Card } from "@/components/ui/card";
import { History, TrendingUp, TrendingDown } from "lucide-react";
import { Operation } from "@/types/trading";
import { ScrollArea } from "@/components/ui/scroll-area";

interface OperationsHistoryProps {
  operations: Operation[];
}

const OperationsHistory = ({ operations }: OperationsHistoryProps) => {
  return (
    <Card className="p-6 border-primary/20">
      <div className="flex items-center gap-2 mb-4">
        <History className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold">Histórico de Operações</h2>
      </div>

      {operations.length === 0 ? (
        <div className="text-center py-12">
          <History className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="text-muted-foreground">Nenhuma operação realizada ainda</p>
          <p className="text-xs text-muted-foreground mt-1">
            Execute sua primeira análise para começar
          </p>
        </div>
      ) : (
        <ScrollArea className="h-[300px]">
          <div className="space-y-3">
            {operations.map((op) => (
              <div
                key={op.id}
                className="p-4 rounded-lg bg-secondary/50 border border-border hover:bg-secondary transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {op.signal === "COMPRA" ? (
                      <div className="w-10 h-10 rounded-full bg-bull/20 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-bull" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-bear/20 flex items-center justify-center">
                        <TrendingDown className="w-5 h-5 text-bear" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold">{op.asset}</p>
                      <p className="text-xs text-muted-foreground">
                        {op.timestamp.toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${op.pnl >= 0 ? 'text-bull' : 'text-bear'}`}>
                      {op.pnl >= 0 ? '+' : ''}R$ {op.pnl.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Confiança: {op.confidence}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </Card>
  );
};

export default OperationsHistory;

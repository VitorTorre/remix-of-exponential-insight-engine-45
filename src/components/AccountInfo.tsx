import { Card } from "@/components/ui/card";
import { Wallet, TrendingUp, Award } from "lucide-react";
import { Operation } from "@/types/trading";

interface AccountInfoProps {
  capital: number;
  operations: Operation[];
}

const AccountInfo = ({ capital, operations }: AccountInfoProps) => {
  const totalPnL = operations.reduce((sum, op) => sum + op.pnl, 0);
  const winRate = operations.length > 0
    ? (operations.filter(op => op.pnl > 0).length / operations.length) * 100
    : 0;

  return (
    <Card className="p-6 border-primary/20">
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Wallet className="w-4 h-4" />
            <span className="text-sm">Capital Atual</span>
          </div>
          <p className="text-3xl font-bold">
            R$ {capital.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="h-px bg-border" />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingUp className="w-3 h-3" />
              <span className="text-xs">PnL Total</span>
            </div>
            <p className={`text-lg font-semibold ${totalPnL >= 0 ? 'text-bull' : 'text-bear'}`}>
              {totalPnL >= 0 ? '+' : ''}R$ {totalPnL.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Award className="w-3 h-3" />
              <span className="text-xs">Win Rate</span>
            </div>
            <p className="text-lg font-semibold">
              {winRate.toFixed(1)}%
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Total de Operações: <span className="font-semibold">{operations.length}</span>
          </p>
        </div>
      </div>
    </Card>
  );
};

export default AccountInfo;

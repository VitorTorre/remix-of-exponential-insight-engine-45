import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DollarSign } from "lucide-react";

interface CapitalSelectorProps {
  isRealMode: boolean;
  onModeChange: (isReal: boolean) => void;
  capital: number;
  onCapitalChange: (capital: number) => void;
}

const CapitalSelector = ({ isRealMode, onModeChange, capital, onCapitalChange }: CapitalSelectorProps) => {
  return (
    <Card className="p-6 border-primary/20">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold">Tipo de Capital</span>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="capital-mode" className="text-xs">
              {isRealMode ? "Real" : "Demo"}
            </Label>
            <Switch
              id="capital-mode"
              checked={isRealMode}
              onCheckedChange={onModeChange}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="capital-amount" className="text-xs text-muted-foreground">
            Capital {isRealMode ? "Real" : "Demo"}
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              R$
            </span>
            <Input
              id="capital-amount"
              type="number"
              value={capital}
              onChange={(e) => onCapitalChange(Number(e.target.value))}
              className="pl-10"
              min={100}
              step={100}
            />
          </div>
        </div>

        {isRealMode && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <p className="text-xs text-destructive font-semibold">
              ⚠️ Modo Real Ativado
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Operações serão executadas com capital real. Tenha cautela!
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default CapitalSelector;

import { TrendingUp, Info, LogIn } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  selectedAsset: string;
  onAssetChange: (asset: string) => void;
}

const Header = ({ selectedAsset, onAssetChange }: HeaderProps) => {
  const navigate = useNavigate();
  
  const assets = [
    // Criptomoedas Principais
    "BTCUSD", "ETHUSD", "BNBUSD", "SOLUSD", "ADAUSD", "XRPUSD", "DOTUSD", "LINKUSD",  "BTC", "ETH", "SOL", "LINK", "TON", 
    
    // Forex Majors (Principais)
    "EURUSD", "GBPUSD", "USDJPY", "USDCHF", "AUDUSD", "NZDUSD", "USDCAD", "AUDSGD", "AUDJPY",  "EUR",
    
    // Forex Exóticos e Emergentes
    "USDBRL", "EURBRL", "GBPBRL", "USDMXN", "USDZAR", "USDTRY",
    
    // Índices Globais
    "SPX", "NDX", "DJI", "DAX", "FTSE", "CAC40", "IBOV", "NIKKEI",
    
    // Ações Tech USA (OTC)
    "AAPL", "GOOGL", "MSFT", "AMZN", "TSLA", "NVDA", "META", "NFLX", "AMD", "INTC",
    
    // Ações Financeiras USA
    "JPM", "BAC", "WFC", "GS", "MS", "C",
    
    // Ações Brasil (B3/OTC)
    "PETR4", "VALE3", "ITUB4", "BBDC4", "ABEV3", "WEGE3", "MGLU3", "B3SA3",
    
    // Commodities
    "XAUUSD", "XAGUSD", "CRUDE", "BRENT", "NATGAS", "COPPER", "PLATINUM",
    
    // Pares OTC Populares
    "GBPJPY", "EURJPY", "AUDJPY",  "AUDSGD", "GBPUSD", "GBPNZD", "EURGBP", "CHFJPY", "GOLD", "AUDNZD"
  ];

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">EXOT</h1>
              <p className="text-sm text-muted-foreground">Examinador Operacional de Ativos</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/about")}
              className="gap-2"
            >
              <Info className="h-4 w-4" />
              Como Funciona
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/auth")}
              className="gap-2"
            >
              <LogIn className="h-4 w-4" />
              Login
            </Button>
            
            <div className="flex flex-col items-end">
              <span className="text-xs text-muted-foreground">Ativo Selecionado</span>
              <Select value={selectedAsset} onValueChange={onAssetChange}>
                <SelectTrigger className="w-32 border-primary/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {assets.map(asset => (
                    <SelectItem key={asset} value={asset}>
                      {asset}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

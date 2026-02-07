import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import SignalPanel from "@/components/SignalPanel";
import MarketChart from "@/components/MarketChart";
import AccountInfo from "@/components/AccountInfo";
import OperationsHistory from "@/components/OperationsHistory";
import TechnicalIndicators from "@/components/TechnicalIndicators";
import CapitalSelector from "@/components/CapitalSelector";
import TimeframeSelector from "@/components/TimeframeSelector";
import AnalysisReport from "@/components/AnalysisReport";
import OrderFlowAnalysis from "@/components/OrderFlowAnalysis";
import { Operation } from "@/types/trading";

const Index = () => {
  const [searchParams] = useSearchParams();
  const [capital, setCapital] = useState(10000);
  const [operations, setOperations] = useState<Operation[]>([]);
  const [selectedAsset, setSelectedAsset] = useState("EURUSD");
  const [isRealMode, setIsRealMode] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState("1m");
  const [timeframeRecommendations, setTimeframeRecommendations] = useState({
    "1m": 85,
    "2m": 72,
    "3m": 68,
    "5m": 79
  });

  // Atualizar ativo se vier da URL
  useEffect(() => {
    const assetParam = searchParams.get('asset');
    if (assetParam) {
      setSelectedAsset(decodeURIComponent(assetParam));
    }
  }, [searchParams]);

  const handleNewOperation = (operation: Operation) => {
    setOperations(prev => [operation, ...prev]);
    setCapital(prev => prev + operation.pnl);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header 
        selectedAsset={selectedAsset}
        onAssetChange={setSelectedAsset}
      />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Top Row - Capital & Timeframe Selectors */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CapitalSelector
            isRealMode={isRealMode}
            onModeChange={setIsRealMode}
            capital={capital}
            onCapitalChange={setCapital}
          />
          <TimeframeSelector
            selectedTimeframe={selectedTimeframe}
            onTimeframeChange={setSelectedTimeframe}
            recommendations={timeframeRecommendations}
          />
        </div>

        {/* Second Row - Account Info & Signal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <AccountInfo capital={capital} operations={operations} />
          <SignalPanel 
            asset={selectedAsset}
            onNewOperation={handleNewOperation}
            currentCapital={capital}
            timeframe={selectedTimeframe}
            isRealMode={isRealMode}
          />
        </div>

        {/* Third Row - Chart & Order Flow */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <MarketChart asset={selectedAsset} className="xl:col-span-2" />
          <OrderFlowAnalysis asset={selectedAsset} />
        </div>

        {/* Fourth Row - Indicators */}
        <div className="grid grid-cols-1 gap-6">
          <TechnicalIndicators asset={selectedAsset} />
        </div>

        {/* Fifth Row - Analysis Report & Operations History */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <AnalysisReport />
          <OperationsHistory operations={operations} />
        </div>
      </main>
    </div>
  );
};

export default Index;

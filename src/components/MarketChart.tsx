import { Card } from "@/components/ui/card";
import { BarChart3, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MarketChartProps {
  asset: string;
  className?: string;
}

interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

const MarketChart = ({ asset, className }: MarketChartProps) => {
  const [chartData, setChartData] = useState<CandleData[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [priceChange, setPriceChange] = useState<number>(0);

  useEffect(() => {
    generateRealisticData();
    const interval = setInterval(updatePrice, 2000);
    return () => clearInterval(interval);
  }, [asset]);

  const generateRealisticData = () => {
    const basePrice = 1000 + Math.random() * 50000;
    const data: CandleData[] = [];
    let lastPrice = basePrice;

    for (let i = 0; i < 50; i++) {
      const volatility = lastPrice * 0.02;
      const open = lastPrice;
      const change = (Math.random() - 0.48) * volatility;
      const close = open + change;
      const high = Math.max(open, close) + Math.random() * volatility * 0.5;
      const low = Math.min(open, close) - Math.random() * volatility * 0.5;
      const volume = 100000 + Math.random() * 900000;

      data.push({
        time: new Date(Date.now() - (50 - i) * 60000).toLocaleTimeString('pt-BR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        open,
        high,
        low,
        close,
        volume
      });

      lastPrice = close;
    }

    setChartData(data);
    setCurrentPrice(lastPrice);
    setPriceChange(((lastPrice - basePrice) / basePrice) * 100);
  };

  const updatePrice = () => {
    setChartData(prev => {
      const lastCandle = prev[prev.length - 1];
      const volatility = lastCandle.close * 0.01;
      const change = (Math.random() - 0.48) * volatility;
      const newClose = lastCandle.close + change;

      const newCandle: CandleData = {
        time: new Date().toLocaleTimeString('pt-BR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        open: lastCandle.close,
        high: Math.max(lastCandle.close, newClose) + Math.random() * volatility * 0.3,
        low: Math.min(lastCandle.close, newClose) - Math.random() * volatility * 0.3,
        close: newClose,
        volume: 100000 + Math.random() * 900000
      };

      setCurrentPrice(newClose);
      setPriceChange(((newClose - prev[0].close) / prev[0].close) * 100);

      return [...prev.slice(1), newCandle];
    });
  };

  return (
    <Card className={cn("p-6 border-primary/20", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Gráfico {asset}</h2>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">
            ${currentPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <div className={cn("flex items-center gap-1", priceChange >= 0 ? "text-green-500" : "text-red-500")}>
            {priceChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span className="text-sm font-semibold">
              {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="time" 
            stroke="hsl(var(--muted-foreground))"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            tick={{ fontSize: 12 }}
            domain={['auto', 'auto']}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="close" 
            stroke="hsl(var(--primary))" 
            strokeWidth={2}
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="high" 
            stroke="hsl(var(--muted-foreground))" 
            strokeWidth={1}
            dot={false}
            strokeDasharray="3 3"
          />
          <Line 
            type="monotone" 
            dataKey="low" 
            stroke="hsl(var(--muted-foreground))" 
            strokeWidth={1}
            dot={false}
            strokeDasharray="3 3"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default MarketChart;

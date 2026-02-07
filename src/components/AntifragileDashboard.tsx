import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Brain, 
  Database, 
  Download, 
  FileText, 
  Zap, 
  TrendingUp, 
  TrendingDown,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle
} from "lucide-react";
import { useAntifragileSystem } from "@/hooks/useAntifragileSystem";

interface AntifragileDashboardProps {
  asset: string;
  timeframe: string;
}

const AntifragileDashboard = ({ asset, timeframe }: AntifragileDashboardProps) => {
  const {
    memories,
    learnings,
    isLoadingMemories,
    lastAnalysis,
    isAnalyzing,
    seedScenarios,
    isSeedingScenarios,
    recordLearning,
    isRecordingLearning,
    createReport,
    isCreatingReport,
    exportCSV,
  } = useAntifragileSystem(asset);

  const [selectedTab, setSelectedTab] = useState("overview");

  // Calculate metrics
  const totalMemories = memories.length;
  const winsCount = memories.filter((m: any) => m.actual_result === 'WIN').length;
  const lossesCount = memories.filter((m: any) => m.actual_result === 'LOSS').length;
  const winRate = totalMemories > 0 ? (winsCount / (winsCount + lossesCount)) * 100 : 0;
  const avgAntifragileScore = memories.reduce((acc: number, m: any) => acc + (m.antifragile_score || 0), 0) / totalMemories || 0;
  const shockEvents = memories.filter((m: any) => m.is_shock_event).length;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Brain className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-bold">Sistema Antifrágil</h2>
          <Badge variant="outline" className="gap-1">
            <Activity className="w-3 h-3" />
            {totalMemories} memórias
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => seedScenarios()}
            disabled={isSeedingScenarios}
          >
            <Database className="w-4 h-4 mr-2" />
            {isSeedingScenarios ? "Inserindo..." : "Seed 100 Cenários"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => createReport({ timeframe })}
            disabled={isCreatingReport}
          >
            <FileText className="w-4 h-4 mr-2" />
            {isCreatingReport ? "Criando..." : "Gerar Relatório"}
          </Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="memories">Memórias</TabsTrigger>
          <TabsTrigger value="learning">Aprendizado</TabsTrigger>
          <TabsTrigger value="export">Exportar</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <TrendingUp className="w-4 h-4 text-green-500" />
                Taxa de Acerto
              </div>
              <p className="text-2xl font-bold">{winRate.toFixed(1)}%</p>
              <Progress value={winRate} className="h-1 mt-2" />
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <Zap className="w-4 h-4 text-primary" />
                Score Antifrágil
              </div>
              <p className="text-2xl font-bold">{avgAntifragileScore.toFixed(1)}</p>
              <Progress value={avgAntifragileScore} className="h-1 mt-2" />
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <AlertTriangle className="w-4 h-4 text-orange-500" />
                Eventos de Choque
              </div>
              <p className="text-2xl font-bold">{shockEvents}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {((shockEvents / totalMemories) * 100 || 0).toFixed(0)}% das operações
              </p>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <Brain className="w-4 h-4 text-purple-500" />
                Aprendizados
              </div>
              <p className="text-2xl font-bold">{learnings.length}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {learnings.filter((l: any) => l.learning_type === 'shock_adaptation').length} adaptações a choque
              </p>
            </Card>
          </div>

          {lastAnalysis && (
            <Card className="p-4 bg-muted/50">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Última Análise
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Contexto</p>
                  <p className="font-medium">{lastAnalysis.context.description}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Padrão</p>
                  <p className="font-medium">{lastAnalysis.pattern}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Volatilidade</p>
                  <p className="font-medium">{(lastAnalysis.volatility * 100).toFixed(2)}%</p>
                </div>
                {lastAnalysis.prediction && (
                  <div>
                    <p className="text-muted-foreground">Previsão</p>
                    <Badge variant={lastAnalysis.prediction.direction === 'UP' ? 'default' : 'destructive'}>
                      {lastAnalysis.prediction.direction} ({(lastAnalysis.prediction.probability * 100).toFixed(0)}%)
                    </Badge>
                  </div>
                )}
              </div>
            </Card>
          )}

          <div className="flex gap-2">
            <Button
              onClick={() => recordLearning('WIN')}
              disabled={isRecordingLearning}
              className="flex-1 gap-2"
              variant="outline"
            >
              <CheckCircle className="w-4 h-4 text-green-500" />
              Registrar WIN
            </Button>
            <Button
              onClick={() => recordLearning('LOSS')}
              disabled={isRecordingLearning}
              className="flex-1 gap-2"
              variant="outline"
            >
              <XCircle className="w-4 h-4 text-red-500" />
              Registrar LOSS
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="memories">
          <ScrollArea className="h-[400px]">
            {isLoadingMemories ? (
              <div className="flex items-center justify-center h-40">
                <p className="text-muted-foreground">Carregando memórias...</p>
              </div>
            ) : memories.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                <Database className="w-8 h-8 mb-2" />
                <p>Nenhuma memória registrada ainda</p>
              </div>
            ) : (
              <div className="space-y-2">
                {memories.map((memory: any) => (
                  <Card key={memory.id} className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          memory.actual_result === 'WIN' ? 'default' :
                          memory.actual_result === 'LOSS' ? 'destructive' :
                          'secondary'
                        }>
                          {memory.actual_result || 'PENDING'}
                        </Badge>
                        <span className="text-sm font-medium">
                          {memory.pattern_scenarios?.pattern_name || 'Padrão desconhecido'}
                        </span>
                        {memory.is_shock_event && (
                          <Badge variant="outline" className="gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Choque
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Vol: {((memory.volatility_index || 0) * 100).toFixed(2)}%</span>
                        <span>Score: {(memory.antifragile_score || 0).toFixed(1)}</span>
                        <span>{new Date(memory.created_at).toLocaleString('pt-BR')}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="learning">
          <ScrollArea className="h-[400px]">
            {learnings.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                <Brain className="w-8 h-8 mb-2" />
                <p>Nenhum aprendizado registrado ainda</p>
              </div>
            ) : (
              <div className="space-y-2">
                {learnings.map((learning: any) => (
                  <Card key={learning.id} className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          learning.learning_type === 'shock_adaptation' ? 'destructive' :
                          'secondary'
                        }>
                          {learning.learning_type === 'shock_adaptation' ? 'Adaptação a Choque' : 'Evolução de Padrão'}
                        </Badge>
                        <span className="text-sm">{learning.trigger_event}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className={learning.improvement_delta > 0 ? 'text-green-500' : 'text-red-500'}>
                          {learning.improvement_delta > 0 ? '+' : ''}{(learning.improvement_delta || 0).toFixed(2)}
                        </span>
                        <span>{new Date(learning.created_at).toLocaleString('pt-BR')}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-8 h-8 text-primary" />
                <div>
                  <h3 className="font-semibold">Exportar Operações</h3>
                  <p className="text-sm text-muted-foreground">
                    Todas as operações com resultados e métricas
                  </p>
                </div>
              </div>
              <Button 
                onClick={() => exportCSV('operations')}
                className="w-full gap-2"
              >
                <Download className="w-4 h-4" />
                Baixar CSV de Operações
              </Button>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-8 h-8 text-primary" />
                <div>
                  <h3 className="font-semibold">Exportar Micro Relatórios</h3>
                  <p className="text-sm text-muted-foreground">
                    Relatórios de análise e insights
                  </p>
                </div>
              </div>
              <Button 
                onClick={() => exportCSV('micro_reports')}
                className="w-full gap-2"
              >
                <Download className="w-4 h-4" />
                Baixar CSV de Relatórios
              </Button>
            </Card>
          </div>

          <Card className="p-4 bg-muted/50">
            <h4 className="font-semibold mb-2">Formato do CSV</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">Operações:</p>
                <p className="text-muted-foreground">
                  ID, Asset, Timeframe, Signal, Confidence, Entry Price, Stop Loss, Take Profit, Predicted, Actual, Profit/Loss, Created At
                </p>
              </div>
              <div>
                <p className="font-medium">Micro Relatórios:</p>
                <p className="text-muted-foreground">
                  ID, Type, Asset, Timeframe, Title, Summary, Patterns, Wins, Losses, Confidence, Created At
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default AntifragileDashboard;

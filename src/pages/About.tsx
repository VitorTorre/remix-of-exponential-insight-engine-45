import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, BarChart3, Zap, LineChart, Target } from "lucide-react";
import Header from "@/components/Header";

const About = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header selectedAsset="EURUSD" onAssetChange={() => {}} />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            EXOT - Exotic Trading AI
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Sistema de análise de mercado com inteligência artificial adaptativa baseado em múltiplas estratégias de trading profissional
          </p>
        </div>

        {/* O que é EXOT */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              O que é EXOT?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              EXOT (Exotic Trading) é um sistema de análise de mercado financeiro que utiliza <strong>5 estratégias avançadas</strong> 
              trabalhando simultaneamente para gerar sinais de compra e venda com alta precisão.
            </p>
            <p>
              O diferencial do EXOT está em seu <strong>sistema de aprendizado adaptativo</strong>, que ajusta automaticamente 
              os pesos de cada estratégia baseado nos resultados históricos, melhorando continuamente sua performance.
            </p>
          </CardContent>
        </Card>

        {/* As 5 Estratégias */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">As 5 Estratégias Avançadas</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Estratégia 1 */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">1. Triple Indicator</CardTitle>
                    <CardDescription>RSI + MACD + Bollinger Bands</CardDescription>
                  </div>
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Combina três indicadores técnicos clássicos para identificar condições de sobrecompra/sobrevenda, 
                  momentum e volatilidade do mercado.
                </p>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <Badge variant="outline">RSI</Badge>
                    <span className="text-muted-foreground">Força relativa do preço</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Badge variant="outline">MACD</Badge>
                    <span className="text-muted-foreground">Convergência/divergência de médias</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Badge variant="outline">Bollinger</Badge>
                    <span className="text-muted-foreground">Bandas de volatilidade</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Estratégia 2 */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">2. EMA Confluence</CardTitle>
                    <CardDescription>Médias Móveis + Divergência RSI</CardDescription>
                  </div>
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Analisa o alinhamento de múltiplas médias móveis exponenciais (EMA 20, 50, 200) 
                  combinado com detecção de divergências no RSI.
                </p>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <Badge variant="outline">EMA 20/50/200</Badge>
                    <span className="text-muted-foreground">Tendência multi-timeframe</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Badge variant="outline">Divergência</Badge>
                    <span className="text-muted-foreground">Reversões de tendência</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Estratégia 3 */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">3. Price Action + Order Flow</CardTitle>
                    <CardDescription>Volume Profile + POC</CardDescription>
                  </div>
                  <LineChart className="h-5 w-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Utiliza perfil de volume para identificar zonas de alto interesse (POC - Point of Control) 
                  e analisa o fluxo de ordens do mercado.
                </p>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <Badge variant="outline">POC</Badge>
                    <span className="text-muted-foreground">Ponto de máximo volume</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Badge variant="outline">Value Area</Badge>
                    <span className="text-muted-foreground">Zona de equilíbrio</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Estratégia 4 */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">4. Fibonacci + Momentum</CardTitle>
                    <CardDescription>Retração de Fibonacci + MACD</CardDescription>
                  </div>
                  <Target className="h-5 w-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Identifica níveis-chave de Fibonacci (38.2%, 50%, 61.8%) e confirma com análise de momentum 
                  para entradas de alta probabilidade.
                </p>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <Badge variant="outline">61.8%</Badge>
                    <span className="text-muted-foreground">Golden ratio - nível forte</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Badge variant="outline">Momentum</Badge>
                    <span className="text-muted-foreground">Confirmação de direção</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Estratégia 5 */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">5. Volume Profile Scalping</CardTitle>
                    <CardDescription>Scalping baseado em Volume</CardDescription>
                  </div>
                  <Zap className="h-5 w-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Estratégia otimizada para timeframes curtos (1m-5m), focando em movimentos rápidos 
                  próximos ao POC com alta volatilidade.
                </p>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <Badge variant="outline">Scalping</Badge>
                    <span className="text-muted-foreground">Operações rápidas</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Badge variant="outline">Volume Surge</Badge>
                    <span className="text-muted-foreground">Detecção de volume anormal</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Como funciona a decisão */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              Como o EXOT decide se é COMPRA ou VENDA?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h3 className="font-semibold">1. Análise Individual</h3>
              <p className="text-sm">
                Cada uma das 5 estratégias analisa o mercado independentemente e gera um <strong>score de 0 a 100</strong>:
              </p>
              <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                <li><strong>Score ≥ 65</strong>: Sinal de COMPRA</li>
                <li><strong>Score ≤ 35</strong>: Sinal de VENDA</li>
                <li><strong>Score entre 35-65</strong>: NEUTRO</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">2. Pesos Adaptativos</h3>
              <p className="text-sm">
                Cada estratégia possui um <strong>peso</strong> que aumenta ou diminui baseado em seu histórico de acertos:
              </p>
              <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                <li><strong>Peso 2.0</strong>: Estratégia com &gt;70% de acerto (excelente)</li>
                <li><strong>Peso 1.5</strong>: Estratégia com 60-70% de acerto (boa)</li>
                <li><strong>Peso 1.0</strong>: Estratégia com 50-60% de acerto (média)</li>
                <li><strong>Peso 0.5</strong>: Estratégia com &lt;50% de acerto (fraca)</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">3. Decisão Final</h3>
              <p className="text-sm">
                O EXOT calcula um <strong>Score Ponderado</strong> combinando os scores de todas as estratégias 
                multiplicados por seus respectivos pesos:
              </p>
              <div className="bg-muted p-4 rounded-lg font-mono text-xs">
                Score Ponderado = Σ (Score da Estratégia × Peso) / Σ Pesos
              </div>
              <ul className="list-disc list-inside text-sm space-y-1 ml-4 mt-3">
                <li><strong>Score Ponderado ≥ 60</strong>: Sinal final de COMPRA 🚀</li>
                <li><strong>Score Ponderado ≤ 40</strong>: Sinal final de VENDA 📉</li>
                <li><strong>Score Ponderado entre 40-60</strong>: Mercado INDECISO ⚖️</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Aprendizado Adaptativo */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              Sistema de Aprendizado Adaptativo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              O EXOT <strong>aprende continuamente</strong> com seus próprios resultados através de um sistema de feedback:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">📊 Análise de Performance</h4>
                <p className="text-sm text-muted-foreground">
                  Cada sinal gerado é armazenado e posteriormente avaliado como WIN ou LOSS, 
                  atualizando as métricas de cada estratégia.
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">⚖️ Ajuste de Pesos</h4>
                <p className="text-sm text-muted-foreground">
                  Estratégias com melhor performance recebem pesos maiores, aumentando sua influência 
                  nas decisões futuras.
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">🔍 Análise Contextual</h4>
                <p className="text-sm text-muted-foreground">
                  O sistema consulta as últimas 20 análises do ativo para identificar padrões 
                  e adaptar-se às condições atuais do mercado.
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">🛡️ Detecção de Problemas</h4>
                <p className="text-sm text-muted-foreground">
                  Se uma estratégia apresenta 5 erros consecutivos, o sistema marca para revisão 
                  e reduz seu peso automaticamente.
                </p>
              </div>
            </div>

            <div className="bg-primary/10 p-4 rounded-lg space-y-2">
              <p className="font-semibold text-sm">💡 Resultado:</p>
              <p className="text-sm">
                Um sistema que <strong>evolui constantemente</strong>, tornando-se mais preciso a cada operação 
                e adaptando-se automaticamente a diferentes condições de mercado e ativos.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Aspectos QI e QE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>QI - Quociente Intelectual</CardTitle>
              <CardDescription>Análise técnica objetiva</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>Aspectos quantitativos e objetivos do mercado:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>RSI (força relativa)</li>
                <li>MACD (momentum)</li>
                <li>EMAs (tendência)</li>
                <li>Volume (liquidez)</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>QE - Quociente Emocional</CardTitle>
              <CardDescription>Sentimento e condições de mercado</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>Aspectos qualitativos e de sentimento:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Confiança no momentum</li>
                <li>Conforto com volatilidade</li>
                <li>Apetite ao risco</li>
                <li>Sentimento geral do mercado</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default About;

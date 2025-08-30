import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { 
  ArrowLeft, 
  BookOpen, 
  Lightbulb, 
  AlertTriangle,
  CheckCircle,
  Info,
  TrendingUp,
  Brain
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { StockData, Screen } from '../App';

interface PerformanceScreenProps {
  stockData: StockData;
  onNavigate: (screen: Screen) => void;
}

export function PerformanceScreen({ stockData, onNavigate }: PerformanceScreenProps) {
  const formatCurrency = (value: number) => `$${value.toFixed(2)}`;
  
  // Calculate error distributions
  const rfErrors = stockData.predictions.randomForest.map(p => 
    Math.abs(p.predicted - p.actual)
  );
  const lrErrors = stockData.predictions.linearRegression.map(p => 
    Math.abs(p.predicted - p.actual)
  );

  // Create histogram data for error distribution
  const createHistogramData = (errors: number[], label: string, color: string) => {
    const bins = 5;
    const maxError = Math.max(...errors);
    const binSize = maxError / bins;
    
    const histogram = Array.from({ length: bins }, (_, i) => ({
      range: `$${(i * binSize).toFixed(0)}-${((i + 1) * binSize).toFixed(0)}`,
      count: 0,
      model: label,
      color
    }));

    errors.forEach(error => {
      const binIndex = Math.min(Math.floor(error / binSize), bins - 1);
      histogram[binIndex].count++;
    });

    return histogram;
  };

  const rfHistogram = createHistogramData(rfErrors, 'Random Forest', 'hsl(var(--chart-2))');
  const lrHistogram = createHistogramData(lrErrors, 'Linear Regression', 'hsl(var(--chart-3))');

  // Combine for side-by-side comparison
  const combinedHistogram = rfHistogram.map((rf, index) => ({
    range: rf.range,
    'Random Forest': rf.count,
    'Linear Regression': lrHistogram[index].count
  }));

  // Performance trends over time
  const performanceTrends = stockData.predictions.randomForest.map((rf, index) => {
    const lr = stockData.predictions.linearRegression[index];
    return {
      date: rf.date,
      rfError: Math.abs(rf.predicted - rf.actual),
      lrError: Math.abs(lr.predicted - lr.actual),
      rfAccuracy: Math.max(0, 100 - (Math.abs(rf.predicted - rf.actual) / rf.actual) * 100),
      lrAccuracy: Math.max(0, 100 - (Math.abs(lr.predicted - lr.actual) / lr.actual) * 100)
    };
  });

  const rfMetrics = stockData.modelMetrics.randomForest;
  const lrMetrics = stockData.modelMetrics.linearRegression;
  const bestModel = rfMetrics.accuracy > lrMetrics.accuracy ? 'Random Forest' : 'Linear Regression';

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => onNavigate('dashboard')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Performance Analysis</h1>
            <p className="text-muted-foreground">Error analysis and model explanations</p>
          </div>
        </div>
      </div>

      {/* Recommendation Card */}
      <Alert className="border-primary/20 bg-primary/5">
        <Lightbulb className="h-4 w-4" />
        <AlertDescription className="ml-2">
          <strong>Recommendation:</strong> Based on the analysis, <strong>{bestModel}</strong> is the better 
          choice for {stockData.symbol} with {bestModel === 'Random Forest' ? rfMetrics.accuracy.toFixed(1) : lrMetrics.accuracy.toFixed(1)}% 
          accuracy. {bestModel === 'Random Forest' 
            ? 'Random Forest handles complex patterns better but may be harder to interpret.' 
            : 'Linear Regression is simpler and more interpretable but may miss complex patterns.'
          }
        </AlertDescription>
      </Alert>

      {/* Error Distribution Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Prediction Error Distribution</CardTitle>
          <CardDescription>
            How often each model makes errors of different sizes (lower is better)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={combinedHistogram}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="Random Forest" 
                  fill="hsl(var(--chart-2))" 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="Linear Regression" 
                  fill="hsl(var(--chart-3))" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Performance Over Time */}
      <Card>
        <CardHeader>
          <CardTitle>Prediction Accuracy Over Time</CardTitle>
          <CardDescription>
            How model accuracy varies across different time periods
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value: number) => [`${value.toFixed(1)}%`, '']}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="rfAccuracy" 
                  stroke="hsl(var(--chart-2))" 
                  strokeWidth={2}
                  name="Random Forest Accuracy"
                />
                <Line 
                  type="monotone" 
                  dataKey="lrAccuracy" 
                  stroke="hsl(var(--chart-3))" 
                  strokeWidth={2}
                  name="Linear Regression Accuracy"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Educational Explanations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Random Forest Explanation */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-chart-2 rounded-full flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div>
                <CardTitle>Random Forest Explained</CardTitle>
                <CardDescription>How this model works</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Multiple Decision Trees</p>
                  <p className="text-sm text-muted-foreground">
                    Creates many decision trees and averages their predictions
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Reduces Overfitting</p>
                  <p className="text-sm text-muted-foreground">
                    By averaging many trees, it's less likely to memorize noise
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Handles Complex Patterns</p>
                  <p className="text-sm text-muted-foreground">
                    Can capture non-linear relationships in stock data
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
                <div>
                  <p className="font-medium">Less Interpretable</p>
                  <p className="text-sm text-muted-foreground">
                    Harder to understand exactly why it made a prediction
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t">
              <Badge variant="default" className="mb-2">Current Performance</Badge>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Accuracy:</span>
                  <span>{rfMetrics.accuracy.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>RMSE:</span>
                  <span>{formatCurrency(rfMetrics.rmse)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Linear Regression Explanation */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-chart-3 rounded-full flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <div>
                <CardTitle>Linear Regression Explained</CardTitle>
                <CardDescription>How this model works</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Fits a Trend Line</p>
                  <p className="text-sm text-muted-foreground">
                    Finds the best straight line through historical data points
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Easy to Interpret</p>
                  <p className="text-sm text-muted-foreground">
                    You can clearly see how each factor affects the prediction
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Fast & Simple</p>
                  <p className="text-sm text-muted-foreground">
                    Quick to compute and easy to understand
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
                <div>
                  <p className="font-medium">Assumes Linear Relationships</p>
                  <p className="text-sm text-muted-foreground">
                    May miss complex, non-linear patterns in stock behavior
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t">
              <Badge variant="default" className="mb-2">Current Performance</Badge>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Accuracy:</span>
                  <span>{lrMetrics.accuracy.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>RMSE:</span>
                  <span>{formatCurrency(lrMetrics.rmse)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Insights */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5" />
            <CardTitle>Key Learning Points</CardTitle>
          </div>
          <CardDescription>
            Important insights for stock prediction beginners
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium">No Model is Perfect</p>
                  <p className="text-sm text-muted-foreground">
                    Stock markets are inherently unpredictable. Even the best models have limitations.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium">Direction vs Price</p>
                  <p className="text-sm text-muted-foreground">
                    Sometimes predicting if a stock will go up or down is more reliable than predicting exact prices.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium">Model Selection Matters</p>
                  <p className="text-sm text-muted-foreground">
                    Different models work better for different stocks and market conditions.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium">Combine with Analysis</p>
                  <p className="text-sm text-muted-foreground">
                    ML predictions work best when combined with fundamental and technical analysis.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
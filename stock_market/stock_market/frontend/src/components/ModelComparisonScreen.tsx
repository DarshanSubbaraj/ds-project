import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, 
  Trophy, 
  TrendingUp, 
  Target, 
  Zap,
  Activity
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { StockData, Screen } from '../App';

interface ModelComparisonScreenProps {
  stockData: StockData;
  onNavigate: (screen: Screen) => void;
}

export function ModelComparisonScreen({ stockData, onNavigate }: ModelComparisonScreenProps) {
  const formatCurrency = (value: number) => `$${value.toFixed(2)}`;
  
  // Combine predictions data for comparison
  const combinedData = stockData.predictions.randomForest.map((rfItem, index) => {
    const lrItem = stockData.predictions.linearRegression[index];
    return {
      date: rfItem.date,
      actual: rfItem.actual,
      randomForest: rfItem.predicted,
      linearRegression: lrItem.predicted,
      rfError: Math.abs(rfItem.predicted - rfItem.actual),
      lrError: Math.abs(lrItem.predicted - lrItem.actual),
    };
  });

  // Determine which model performed better
  const rfMetrics = stockData.modelMetrics.randomForest;
  const lrMetrics = stockData.modelMetrics.linearRegression;
  const rfBetter = rfMetrics.accuracy > lrMetrics.accuracy;

  // Calculate average errors for bar chart
  const avgErrors = [
    {
      model: 'Random Forest',
      avgError: combinedData.reduce((sum, item) => sum + item.rfError, 0) / combinedData.length,
      accuracy: rfMetrics.accuracy
    },
    {
      model: 'Linear Regression', 
      avgError: combinedData.reduce((sum, item) => sum + item.lrError, 0) / combinedData.length,
      accuracy: lrMetrics.accuracy
    }
  ];

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => onNavigate('dashboard')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Model Comparison</h1>
            <p className="text-muted-foreground">Random Forest vs Linear Regression</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onNavigate('performance')}>
            <Activity className="w-4 h-4 mr-2" />
            Performance Analysis
          </Button>
        </div>
      </div>

      {/* Winner Announcement */}
      <Card className="border-2 border-primary/20 bg-primary/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Trophy className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-lg">
                {rfBetter ? 'Random Forest' : 'Linear Regression'} Performed Better
              </CardTitle>
              <CardDescription>
                {rfBetter 
                  ? `Random Forest achieved ${rfMetrics.accuracy.toFixed(1)}% accuracy vs ${lrMetrics.accuracy.toFixed(1)}%`
                  : `Linear Regression achieved ${lrMetrics.accuracy.toFixed(1)}% accuracy vs ${rfMetrics.accuracy.toFixed(1)}%`
                }
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Side-by-Side Model Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Random Forest Card */}
        <Card className={`${rfBetter ? 'ring-2 ring-primary/30' : ''}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-chart-2 rounded-full flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <CardTitle>Random Forest</CardTitle>
              </div>
              {rfBetter && <Badge>Best</Badge>}
            </div>
            <CardDescription>
              Ensemble model using multiple decision trees
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Accuracy
                </span>
                <Badge variant={rfBetter ? 'default' : 'secondary'}>
                  {rfMetrics.accuracy.toFixed(1)}%
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>RMSE</span>
                <span className="font-medium">{formatCurrency(rfMetrics.rmse)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Direction Accuracy
                </span>
                <Badge variant={rfMetrics.directionalAccuracy > lrMetrics.directionalAccuracy ? 'default' : 'secondary'}>
                  {rfMetrics.directionalAccuracy.toFixed(1)}%
                </Badge>
              </div>
            </div>
            
            <div className="pt-2 border-t">
              <h4 className="font-medium mb-2">Strengths:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Handles non-linear patterns well</li>
                <li>• Reduces overfitting risk</li>
                <li>• Robust to outliers</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Linear Regression Card */}
        <Card className={`${!rfBetter ? 'ring-2 ring-primary/30' : ''}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-chart-3 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <CardTitle>Linear Regression</CardTitle>
              </div>
              {!rfBetter && <Badge>Best</Badge>}
            </div>
            <CardDescription>
              Simple linear model fitting trend lines
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Accuracy
                </span>
                <Badge variant={!rfBetter ? 'default' : 'secondary'}>
                  {lrMetrics.accuracy.toFixed(1)}%
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>RMSE</span>
                <span className="font-medium">{formatCurrency(lrMetrics.rmse)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Direction Accuracy
                </span>
                <Badge variant={lrMetrics.directionalAccuracy > rfMetrics.directionalAccuracy ? 'default' : 'secondary'}>
                  {lrMetrics.directionalAccuracy.toFixed(1)}%
                </Badge>
              </div>
            </div>
            
            <div className="pt-2 border-t">
              <h4 className="font-medium mb-2">Strengths:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Fast and simple to compute</li>
                <li>• Easy to interpret</li>
                <li>• Good for linear trends</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Prediction Comparison Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Predicted vs Actual Prices</CardTitle>
          <CardDescription>
            Visual comparison of both models' predictions against actual stock prices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={combinedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value: number) => [formatCurrency(value), '']}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="hsl(var(--chart-1))" 
                  strokeWidth={3}
                  name="Actual Price"
                />
                <Line 
                  type="monotone" 
                  dataKey="randomForest" 
                  stroke="hsl(var(--chart-2))" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Random Forest"
                />
                <Line 
                  type="monotone" 
                  dataKey="linearRegression" 
                  stroke="hsl(var(--chart-3))" 
                  strokeWidth={2}
                  strokeDasharray="10 5"
                  name="Linear Regression"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Error Comparison Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Average Prediction Error</CardTitle>
          <CardDescription>
            Lower values indicate better prediction accuracy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={avgErrors}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="model" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Avg Error']}
                />
                <Bar 
                  dataKey="avgError" 
                  fill="hsl(var(--chart-4))" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Metrics Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Performance Metrics</CardTitle>
          <CardDescription>
            Comprehensive comparison of model performance indicators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Metric</th>
                  <th className="text-center p-3">Random Forest</th>
                  <th className="text-center p-3">Linear Regression</th>
                  <th className="text-center p-3">Winner</th>
                </tr>
              </thead>
              <tbody className="space-y-2">
                <tr className="border-b">
                  <td className="p-3 font-medium">Overall Accuracy</td>
                  <td className="text-center p-3">
                    <Badge variant={rfMetrics.accuracy > lrMetrics.accuracy ? 'default' : 'secondary'}>
                      {rfMetrics.accuracy.toFixed(1)}%
                    </Badge>
                  </td>
                  <td className="text-center p-3">
                    <Badge variant={lrMetrics.accuracy > rfMetrics.accuracy ? 'default' : 'secondary'}>
                      {lrMetrics.accuracy.toFixed(1)}%
                    </Badge>
                  </td>
                  <td className="text-center p-3">
                    {rfMetrics.accuracy > lrMetrics.accuracy ? '🏆 RF' : '🏆 LR'}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">RMSE (Lower is Better)</td>
                  <td className="text-center p-3">{formatCurrency(rfMetrics.rmse)}</td>
                  <td className="text-center p-3">{formatCurrency(lrMetrics.rmse)}</td>
                  <td className="text-center p-3">
                    {rfMetrics.rmse < lrMetrics.rmse ? '🏆 RF' : '🏆 LR'}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Direction Accuracy</td>
                  <td className="text-center p-3">
                    <Badge variant={rfMetrics.directionalAccuracy > lrMetrics.directionalAccuracy ? 'default' : 'secondary'}>
                      {rfMetrics.directionalAccuracy.toFixed(1)}%
                    </Badge>
                  </td>
                  <td className="text-center p-3">
                    <Badge variant={lrMetrics.directionalAccuracy > rfMetrics.directionalAccuracy ? 'default' : 'secondary'}>
                      {lrMetrics.directionalAccuracy.toFixed(1)}%
                    </Badge>
                  </td>
                  <td className="text-center p-3">
                    {rfMetrics.directionalAccuracy > lrMetrics.directionalAccuracy ? '🏆 RF' : '🏆 LR'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
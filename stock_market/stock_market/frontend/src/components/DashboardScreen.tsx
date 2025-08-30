import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  GitCompare, 
  Settings, 
  Activity,
  DollarSign,
  Volume2
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { StockData, Screen } from '../App';

interface DashboardScreenProps {
  stockData: StockData;
  onNavigate: (screen: Screen) => void;
}

export function DashboardScreen({ stockData, onNavigate }: DashboardScreenProps) {
  const [activeTab, setActiveTab] = useState('trends');

  const formatCurrency = (value: number) => `$${value.toFixed(2)}`;
  const formatVolume = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  };

  const latestData = stockData.historical[stockData.historical.length - 1];

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => onNavigate('input')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">{stockData.symbol} Dashboard</h1>
            <p className="text-muted-foreground">Stock analysis and predictions</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onNavigate('comparison')}>
            <GitCompare className="w-4 h-4 mr-2" />
            Compare Models
          </Button>
          <Button variant="outline" size="sm" onClick={() => onNavigate('performance')}>
            <Activity className="w-4 h-4 mr-2" />
            Performance
          </Button>
          <Button variant="outline" size="sm" onClick={() => onNavigate('settings')}>
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Price</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stockData.currentPrice)}</div>
            <p className={`text-xs flex items-center gap-1 ${stockData.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stockData.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {formatCurrency(Math.abs(stockData.change))} ({Math.abs(stockData.changePercent).toFixed(2)}%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(latestData.high)}</div>
            <p className="text-xs text-muted-foreground">Today's high</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(latestData.low)}</div>
            <p className="text-xs text-muted-foreground">Today's low</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Volume</CardTitle>
            <Volume2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatVolume(latestData.volume)}</div>
            <p className="text-xs text-muted-foreground">Shares traded</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="trends">Price Trends</TabsTrigger>
          <TabsTrigger value="indicators">Indicators</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historical Price Chart</CardTitle>
              <CardDescription>
                Stock price movement over the selected period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stockData.historical}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      formatter={(value: number) => [formatCurrency(value), 'Price']}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="close" 
                      stroke="hsl(var(--chart-1))" 
                      strokeWidth={2}
                      name="Close Price"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="indicators" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Technical Indicators</CardTitle>
              <CardDescription>
                Moving averages and trend analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stockData.historical}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      formatter={(value: number) => [formatCurrency(value), '']}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="close" 
                      stroke="hsl(var(--chart-1))" 
                      strokeWidth={2}
                      name="Close Price"
                      dot={false}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="ma5" 
                      stroke="hsl(var(--chart-2))" 
                      strokeWidth={1}
                      strokeDasharray="5 5"
                      name="5-day MA"
                      dot={false}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="ma10" 
                      stroke="hsl(var(--chart-3))" 
                      strokeWidth={1}
                      strokeDasharray="5 5"
                      name="10-day MA"
                      dot={false}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="ma20" 
                      stroke="hsl(var(--chart-4))" 
                      strokeWidth={1}
                      strokeDasharray="5 5"
                      name="20-day MA"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">5-Day MA</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold">{formatCurrency(latestData.ma5)}</div>
                <Badge variant={latestData.close > latestData.ma5 ? 'default' : 'secondary'}>
                  {latestData.close > latestData.ma5 ? 'Above' : 'Below'}
                </Badge>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">10-Day MA</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold">{formatCurrency(latestData.ma10)}</div>
                <Badge variant={latestData.close > latestData.ma10 ? 'default' : 'secondary'}>
                  {latestData.close > latestData.ma10 ? 'Above' : 'Below'}
                </Badge>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">20-Day MA</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold">{formatCurrency(latestData.ma20)}</div>
                <Badge variant={latestData.close > latestData.ma20 ? 'default' : 'secondary'}>
                  {latestData.close > latestData.ma20 ? 'Above' : 'Below'}
                </Badge>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>ML Model Predictions</CardTitle>
              <CardDescription>
                Random Forest vs Linear Regression predictions for recent days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stockData.predictions.randomForest}>
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
                      dataKey="predicted" 
                      stroke="hsl(var(--chart-2))" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Random Forest"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Random Forest Model</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Accuracy:</span>
                  <Badge>{stockData.modelMetrics.randomForest.accuracy.toFixed(1)}%</Badge>
                </div>
                <div className="flex justify-between">
                  <span>RMSE:</span>
                  <span>{formatCurrency(stockData.modelMetrics.randomForest.rmse)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Direction:</span>
                  <Badge>{stockData.modelMetrics.randomForest.directionalAccuracy.toFixed(1)}%</Badge>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Linear Regression Model</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Accuracy:</span>
                  <Badge variant="secondary">{stockData.modelMetrics.linearRegression.accuracy.toFixed(1)}%</Badge>
                </div>
                <div className="flex justify-between">
                  <span>RMSE:</span>
                  <span>{formatCurrency(stockData.modelMetrics.linearRegression.rmse)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Direction:</span>
                  <Badge variant="secondary">{stockData.modelMetrics.linearRegression.directionalAccuracy.toFixed(1)}%</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Stock Info Table */}
      <Card>
        <CardHeader>
          <CardTitle>Stock Information</CardTitle>
          <CardDescription>Latest trading session data</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Metric</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Open</TableCell>
                <TableCell>{formatCurrency(latestData.open)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>High</TableCell>
                <TableCell>{formatCurrency(latestData.high)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Low</TableCell>
                <TableCell>{formatCurrency(latestData.low)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Close</TableCell>
                <TableCell>{formatCurrency(latestData.close)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Volume</TableCell>
                <TableCell>{latestData.volume.toLocaleString()}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { TrendingUp, BarChart3 } from 'lucide-react';
import { StockData } from '../App';

interface StockInputScreenProps {
  onDataFetch: (data: StockData) => void;
}

// API configuration with fallback
const API_URLS = [
  'http://127.0.0.1:8001',
  'http://localhost:8001', 
  'http://127.0.0.1:8000',
  'http://localhost:8000'
];

// Fetch real stock data from backend with URL fallback
const fetchStockData = async (symbol: string, dateRange: string): Promise<StockData> => {
  let lastError = null;
  
  for (const baseUrl of API_URLS) {
    try {
      console.log(`Trying API at: ${baseUrl}`);
      
      const response = await fetch(`${baseUrl}/api/stock/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symbol: symbol,
          date_range: dateRange
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP ${response.status}: Failed to fetch stock data`);
      }

      console.log(`✅ Successfully connected to API at: ${baseUrl}`);
      return response.json();
      
    } catch (error) {
      console.log(`❌ Failed to connect to ${baseUrl}:`, error);
      lastError = error;
      continue;
    }
  }
  
  throw lastError || new Error('Failed to connect to any backend server');
};

export function StockInputScreen({ onDataFetch }: StockInputScreenProps) {
  const [symbol, setSymbol] = useState('');
  const [dateRange, setDateRange] = useState('3months');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const popularStocks = ['AAPL', 'TSLA', 'GOOGL', 'MSFT', 'AMZN', 'NVDA'];

  const handleFetch = async () => {
    if (!symbol.trim()) {
      setError('Please enter a stock symbol');
      return;
    }

    if (symbol.length > 5) {
      setError('Invalid stock symbol');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const stockData = await fetchStockData(symbol, dateRange);
      onDataFetch(stockData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch stock data. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSelect = (stockSymbol: string) => {
    setSymbol(stockSymbol);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-primary-foreground" />
          </div>
          <CardTitle>Stock Prediction Dashboard</CardTitle>
          <CardDescription>
            Enter a stock symbol to analyze historical data and view ML predictions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="symbol">Stock Symbol</Label>
            <Input
              id="symbol"
              placeholder="e.g., AAPL, TSLA"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              className="uppercase"
              maxLength={5}
            />
          </div>

          <div className="space-y-2">
            <Label>Popular Stocks</Label>
            <div className="flex flex-wrap gap-2">
              {popularStocks.map((stock) => (
                <Button
                  key={stock}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickSelect(stock)}
                  className="text-xs"
                >
                  {stock}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Date Range</Label>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1month">1 Month</SelectItem>
                <SelectItem value="3months">3 Months</SelectItem>
                <SelectItem value="1year">1 Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button 
            onClick={handleFetch} 
            disabled={loading || !symbol.trim()}
            className="w-full"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Fetching Data...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Analyze Stock
              </div>
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            <p>Educational tool using real stock data from Yahoo Finance</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
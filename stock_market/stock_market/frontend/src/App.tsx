import React, { useState } from 'react';
import { StockInputScreen } from './components/StockInputScreen';
import { DashboardScreen } from './components/DashboardScreen';
import { ModelComparisonScreen } from './components/ModelComparisonScreen';
import { PerformanceScreen } from './components/PerformanceScreen';
import { SettingsScreen } from './components/SettingsScreen';

export type Screen = 'input' | 'dashboard' | 'comparison' | 'performance' | 'settings';

export interface StockData {
  symbol: string;
  dateRange: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  historical: Array<{
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    ma5: number;
    ma10: number;
    ma20: number;
  }>;
  predictions: {
    randomForest: Array<{ date: string; predicted: number; actual: number }>;
    linearRegression: Array<{ date: string; predicted: number; actual: number }>;
  };
  modelMetrics: {
    randomForest: { accuracy: number; rmse: number; directionalAccuracy: number };
    linearRegression: { accuracy: number; rmse: number; directionalAccuracy: number };
  };
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('input');
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const handleStockDataFetch = (data: StockData) => {
    setStockData(data);
    setCurrentScreen('dashboard');
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="bg-background text-foreground min-h-screen">
        {currentScreen === 'input' && (
          <StockInputScreen onDataFetch={handleStockDataFetch} />
        )}
        {currentScreen === 'dashboard' && stockData && (
          <DashboardScreen 
            stockData={stockData} 
            onNavigate={setCurrentScreen}
          />
        )}
        {currentScreen === 'comparison' && stockData && (
          <ModelComparisonScreen 
            stockData={stockData} 
            onNavigate={setCurrentScreen}
          />
        )}
        {currentScreen === 'performance' && stockData && (
          <PerformanceScreen 
            stockData={stockData} 
            onNavigate={setCurrentScreen}
          />
        )}
        {currentScreen === 'settings' && (
          <SettingsScreen 
            theme={theme}
            onThemeChange={setTheme}
            onNavigate={setCurrentScreen}
          />
        )}
      </div>
    </div>
  );
}
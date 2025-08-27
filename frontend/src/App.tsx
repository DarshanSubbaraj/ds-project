import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');
  const [selectedKeyword, setSelectedKeyword] = useState<string>('');

  const handleAnalyze = (keyword: string) => {
    setSelectedKeyword(keyword);
    setCurrentView('dashboard');
  };

  const handleBack = () => {
    setCurrentView('landing');
    setSelectedKeyword('');
  };

  return (
    <div className="size-full">
      {currentView === 'landing' ? (
        <LandingPage onAnalyze={handleAnalyze} />
      ) : (
        <Dashboard keyword={selectedKeyword} onBack={handleBack} />
      )}
    </div>
  );
}
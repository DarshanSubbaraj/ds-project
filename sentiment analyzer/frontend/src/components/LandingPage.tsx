import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Search } from 'lucide-react';

interface LandingPageProps {
  onAnalyze: (keyword: string) => void;
}

export function LandingPage({ onAnalyze }: LandingPageProps) {
  const [keyword, setKeyword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      onAnalyze(keyword.trim());
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl tracking-tight text-foreground">
            AI-Powered Social Media
            <br />
            <span className="text-primary">Sentiment Analysis</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            Analyze public sentiment around any keyword or hashtag across social media platforms in real-time.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative max-w-md mx-auto group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              type="text"
              placeholder="Enter keyword or #hashtag"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="pl-10 h-12 text-center bg-card border-border focus:border-primary transition-colors"
            />
          </div>
          
          <Button 
            type="submit" 
            size="lg"
            className="px-8 h-12 bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={!keyword.trim()}
          >
            Analyze Sentiment
          </Button>
        </form>

        <div className="pt-8 text-xs text-muted-foreground">
          Try: "artificial intelligence", "#sustainability", "remote work"
        </div>
      </div>
    </div>
  );
}
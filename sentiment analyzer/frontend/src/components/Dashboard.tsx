import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { ArrowLeft, Download, RefreshCw } from 'lucide-react';
import { SentimentCard } from './SentimentCard';
import { SentimentChart } from './SentimentChart';
import { PostsTable } from './PostsTable';

interface DashboardProps {
  keyword: string;
  onBack: () => void;
}

interface SentimentData {
  positive: { percentage: number; change: number };
  neutral: { percentage: number; change: number };
  negative: { percentage: number; change: number };
}

interface Post {
  id: string;
  content: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
  platform: string;
  engagement: { likes: number; comments: number; shares: number };
  timestamp: string;
}

export function Dashboard({ keyword, onBack }: DashboardProps) {
  const [sentimentData, setSentimentData] = useState<SentimentData>({
    positive: { percentage: 0, change: 0 },
    neutral: { percentage: 0, change: 0 },
    negative: { percentage: 0, change: 0 }
  });
  const [topPositivePosts, setTopPositivePosts] = useState<Post[]>([]);
  const [topNegativePosts, setTopNegativePosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSentimentData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Call your backend API
      const response = await fetch(`http://localhost:8000/quick-analyze?keyword=${encodeURIComponent(keyword)}&limit=30`);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Update sentiment data
      setSentimentData({
        positive: { 
          percentage: data.sentiment_summary?.positive?.percentage || 0, 
          change: data.sentiment_summary?.positive?.change || 0 
        },
        neutral: { 
          percentage: data.sentiment_summary?.neutral?.percentage || 0, 
          change: data.sentiment_summary?.neutral?.change || 0 
        },
        negative: { 
          percentage: data.sentiment_summary?.negative?.percentage || 0, 
          change: data.sentiment_summary?.negative?.change || 0 
        }
      });
      
      // Update posts data
      const positive = (data.sample_positive || []).map((post: any, index: number) => ({
        id: `pos_${index}`,
        content: post.content || `Positive sentiment about ${keyword}`,
        sentiment: 'positive' as const,
        score: post.score || 85,
        platform: post.platform || 'Twitter',
        engagement: post.engagement || { likes: 100, comments: 10, shares: 5 },
        timestamp: post.timestamp || `${index + 1}h ago`
      }));
      
      const negative = (data.sample_negative || []).map((post: any, index: number) => ({
        id: `neg_${index}`,
        content: post.content || `Negative sentiment about ${keyword}`,
        sentiment: 'negative' as const,
        score: post.score || -65,
        platform: post.platform || 'Twitter',
        engagement: post.engagement || { likes: 50, comments: 5, shares: 2 },
        timestamp: post.timestamp || `${index + 2}h ago`
      }));
      
      setTopPositivePosts(positive);
      setTopNegativePosts(negative);
      
    } catch (err) {
      console.error('Error fetching sentiment data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (keyword) {
      fetchSentimentData();
    }
  }, [keyword]);

  const trendData = [
    { date: 'Jan 1', positive: sentimentData.positive.percentage, neutral: sentimentData.neutral.percentage, negative: sentimentData.negative.percentage },
    { date: 'Jan 2', positive: sentimentData.positive.percentage + 2, neutral: sentimentData.neutral.percentage - 2, negative: sentimentData.negative.percentage },
    { date: 'Jan 3', positive: sentimentData.positive.percentage - 1, neutral: sentimentData.neutral.percentage + 1, negative: sentimentData.negative.percentage },
    { date: 'Jan 4', positive: sentimentData.positive.percentage + 1, neutral: sentimentData.neutral.percentage - 1, negative: sentimentData.negative.percentage },
    { date: 'Jan 5', positive: sentimentData.positive.percentage, neutral: sentimentData.neutral.percentage, negative: sentimentData.negative.percentage },
    { date: 'Jan 6', positive: sentimentData.positive.percentage + 3, neutral: sentimentData.neutral.percentage - 3, negative: sentimentData.negative.percentage },
    { date: 'Jan 7', positive: sentimentData.positive.percentage, neutral: sentimentData.neutral.percentage, negative: sentimentData.negative.percentage }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center space-y-4">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Analyzing sentiment for "{keyword}"...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-red-500">
            <p className="text-lg font-medium">Error loading sentiment data</p>
            <p className="text-sm">{error}</p>
          </div>
          <div className="space-x-2">
            <Button onClick={fetchSentimentData}>Retry</Button>
            <Button variant="outline" onClick={onBack}>Go Back</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={onBack} className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            <div>
              <h1 className="text-2xl tracking-tight">Sentiment Analysis</h1>
              <p className="text-muted-foreground">Keyword: <span className="font-medium">{keyword}</span></p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              className="flex items-center space-x-2"
              onClick={fetchSentimentData}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
          </div>
        </div>

        {/* Sentiment Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SentimentCard 
            type="positive" 
            percentage={sentimentData.positive.percentage}
            change={sentimentData.positive.change}
          />
          <SentimentCard 
            type="neutral" 
            percentage={sentimentData.neutral.percentage}
            change={sentimentData.neutral.change}
          />
          <SentimentCard 
            type="negative" 
            percentage={sentimentData.negative.percentage}
            change={sentimentData.negative.change}
          />
        </div>

        {/* Sentiment Trend Chart */}
        <SentimentChart data={trendData} />

        {/* Posts Tables */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <PostsTable posts={topPositivePosts} title="Top Positive Posts" />
          <PostsTable posts={topNegativePosts} title="Top Negative Posts" />
        </div>
      </div>
    </div>
  );
}
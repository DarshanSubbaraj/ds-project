import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface SentimentCardProps {
  type: 'positive' | 'neutral' | 'negative';
  percentage: number;
  change: number;
}

export function SentimentCard({ type, percentage, change }: SentimentCardProps) {
  const config = {
    positive: {
      title: 'Positive',
      icon: TrendingUp,
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200',
      accentColor: 'text-green-600'
    },
    neutral: {
      title: 'Neutral', 
      icon: Minus,
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
      borderColor: 'border-yellow-200',
      accentColor: 'text-yellow-600'
    },
    negative: {
      title: 'Negative',
      icon: TrendingDown,
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      borderColor: 'border-red-200',
      accentColor: 'text-red-600'
    }
  };

  const { title, icon: Icon, bgColor, textColor, borderColor, accentColor } = config[type];

  return (
    <Card className={`${bgColor} ${borderColor} border-2`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className={`text-sm font-medium ${textColor}`}>
          {title}
        </CardTitle>
        <Icon className={`h-4 w-4 ${accentColor}`} />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${textColor}`}>
          {percentage}%
        </div>
        <p className={`text-xs ${accentColor} mt-1`}>
          {change > 0 ? '+' : ''}{change}% from last period
        </p>
      </CardContent>
    </Card>
  );
}
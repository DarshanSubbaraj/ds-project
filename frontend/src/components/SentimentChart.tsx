import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface SentimentChartProps {
  data: Array<{
    date: string;
    positive: number;
    neutral: number;
    negative: number;
  }>;
}

export function SentimentChart({ data }: SentimentChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sentiment Trend Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickMargin={8}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickMargin={8}
                domain={[0, 100]}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="positive" 
                stroke="#16a34a" 
                strokeWidth={2}
                name="Positive"
                dot={{ r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="neutral" 
                stroke="#ca8a04" 
                strokeWidth={2}
                name="Neutral"
                dot={{ r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="negative" 
                stroke="#dc2626" 
                strokeWidth={2}
                name="Negative"
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
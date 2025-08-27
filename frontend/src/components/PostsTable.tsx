import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Heart, MessageCircle, Repeat2 } from 'lucide-react';

interface Post {
  id: string;
  content: string;
  sentiment: 'positive' | 'negative';
  score: number;
  platform: string;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
  timestamp: string;
}

interface PostsTableProps {
  posts: Post[];
  title: string;
}

export function PostsTable({ posts, title }: PostsTableProps) {
  const getSentimentBadge = (sentiment: 'positive' | 'negative', score: number) => {
    if (sentiment === 'positive') {
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          +{score}
        </Badge>
      );
    }
    return (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
        {score}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Post Content</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Sentiment</TableHead>
              <TableHead>Engagement</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="max-w-md">
                  <p className="truncate">{post.content}</p>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{post.platform}</Badge>
                </TableCell>
                <TableCell>
                  {getSentimentBadge(post.sentiment, post.score)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Heart className="h-3 w-3" />
                      <span>{post.engagement.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="h-3 w-3" />
                      <span>{post.engagement.comments}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Repeat2 className="h-3 w-3" />
                      <span>{post.engagement.shares}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {post.timestamp}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
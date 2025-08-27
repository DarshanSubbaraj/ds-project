import json
import asyncio
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import redis.asyncio as redis
from loguru import logger

from app.core.config import settings
from app.services.twitter_client import twitter_client
from app.services.sentiment_analyzer import sentiment_analyzer


class DataProcessor:
    def __init__(self):
        self.redis_client = None
        # Redis will be initialized when needed
    
    async def _initialize_redis(self):
        """Initialize Redis connection (optional)"""
        if not settings.redis_url or settings.redis_url.strip() == "":
            logger.info("Redis URL not configured - caching disabled")
            self.redis_client = None
            return
            
        try:
            self.redis_client = redis.from_url(
                settings.redis_url,
                encoding="utf-8",
                decode_responses=True
            )
            # Test connection
            await self.redis_client.ping()
            logger.info("Redis connection established - caching enabled")
        except Exception as e:
            logger.warning(f"Failed to connect to Redis (caching disabled): {e}")
            self.redis_client = None
    
    async def get_cached_analysis(self, keyword: str) -> Optional[Dict[str, Any]]:
        """Get cached sentiment analysis results"""
        if not self.redis_client:
            return None
        
        try:
            cache_key = f"sentiment_analysis:{keyword.lower()}"
            cached_data = await self.redis_client.get(cache_key)
            if cached_data:
                return json.loads(cached_data)
        except Exception as e:
            logger.error(f"Error getting cached analysis: {e}")
        
        return None
    
    async def cache_analysis(self, keyword: str, analysis_data: Dict[str, Any], ttl: int = 900):
        """Cache sentiment analysis results (15 minutes TTL by default)"""
        if not self.redis_client:
            return
        
        try:
            cache_key = f"sentiment_analysis:{keyword.lower()}"
            await self.redis_client.setex(
                cache_key, 
                ttl, 
                json.dumps(analysis_data, default=str)
            )
        except Exception as e:
            logger.error(f"Error caching analysis: {e}")
    
    async def process_keyword_analysis(
        self,
        keyword: str,
        max_tweets: int = 100,
        include_retweets: bool = False,
        force_refresh: bool = False
    ) -> Dict[str, Any]:
        """Process complete keyword analysis - simplified without caching issues"""
        
        logger.info(f"Processing fresh analysis for keyword: {keyword}")
        
        try:
            # Always fetch fresh tweets from Twitter API
            tweets_data = await twitter_client.search_tweets(
                keyword=keyword,
                max_results=max_tweets,
                include_retweets=include_retweets
            )
            
            if not tweets_data:
                logger.warning(f"No tweets found for keyword: {keyword}")
                return self._create_empty_analysis(keyword)
            
            # Analyze sentiment for all tweets
            tweet_texts = [tweet['text'] for tweet in tweets_data]
            sentiment_results = await sentiment_analyzer.analyze_batch(tweet_texts)
            
            # Combine tweet data with sentiment results
            processed_tweets = []
            for i, (tweet_data, sentiment_result) in enumerate(zip(tweets_data, sentiment_results)):
                tweet_with_sentiment = {
                    **tweet_data,
                    'sentiment_label': sentiment_result['label'],
                    'sentiment_score': sentiment_result['score'],
                    'sentiment_confidence': sentiment_result['confidence']
                }
                processed_tweets.append(tweet_with_sentiment)
            
            # Generate analysis results
            analysis_result = await self._generate_analysis_results(keyword, processed_tweets)
            
            logger.info(f"Completed analysis for keyword: {keyword} with {len(processed_tweets)} tweets")
            return analysis_result
            
        except Exception as e:
            logger.error(f"Error processing keyword analysis: {e}")
            return self._create_empty_analysis(keyword, error=str(e))
    
    async def _store_tweets_in_db(self, tweets: List[Dict[str, Any]]):
        """Store processed tweets in database - disabled in simple mode"""
        # Database storage disabled in simple mode
        logger.info(f"Database storage disabled - processed {len(tweets)} tweets in memory only")
        pass
    
    async def _generate_analysis_results(self, keyword: str, tweets: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Generate comprehensive analysis results"""
        
        # Calculate sentiment statistics
        sentiment_stats = sentiment_analyzer.get_sentiment_statistics(tweets)
        
        # Sort tweets by sentiment score for top posts
        sorted_tweets = sorted(tweets, key=lambda x: x['sentiment_score'])
        
        # Get top positive and negative posts
        top_positive = [t for t in sorted_tweets if t['sentiment_label'] == 'positive'][-5:]
        top_negative = [t for t in sorted_tweets if t['sentiment_label'] == 'negative'][:5]
        
        # Reverse positive to get highest scores first
        top_positive.reverse()
        
        # Generate trend data (simplified - could be enhanced with historical data)
        trend_data = await self._generate_trend_data(keyword)
        
        # Format response
        analysis_result = {
            'keyword': keyword,
            'total_tweets': len(tweets),
            'sentiment_summary': {
                'positive': {
                    'percentage': sentiment_stats['positive_percentage'],
                    'change': 5.2  # Mock change - would calculate from historical data
                },
                'neutral': {
                    'percentage': sentiment_stats['neutral_percentage'],
                    'change': -1.8
                },
                'negative': {
                    'percentage': sentiment_stats['negative_percentage'],
                    'change': -3.4
                }
            },
            'trend_data': trend_data,
            'top_positive_posts': [self._format_tweet_for_frontend(t) for t in top_positive],
            'top_negative_posts': [self._format_tweet_for_frontend(t) for t in top_negative],
            'analysis_timestamp': datetime.utcnow(),
            'statistics': sentiment_stats
        }
        
        # Database storage disabled in simple mode
        
        return analysis_result
    
    async def _generate_trend_data(self, keyword: str) -> List[Dict[str, Any]]:
        """Generate trend data (mock data for now - would use historical analysis)"""
        # This is simplified mock data - in a real implementation, 
        # you'd query historical sentiment analysis data
        trend_data = [
            {'date': 'Day 1', 'positive': 65, 'neutral': 25, 'negative': 10},
            {'date': 'Day 2', 'positive': 70, 'neutral': 20, 'negative': 10},
            {'date': 'Day 3', 'positive': 68, 'neutral': 22, 'negative': 10},
            {'date': 'Day 4', 'positive': 72, 'neutral': 18, 'negative': 10},
            {'date': 'Day 5', 'positive': 69, 'neutral': 21, 'negative': 10},
            {'date': 'Day 6', 'positive': 75, 'neutral': 15, 'negative': 10},
            {'date': 'Day 7', 'positive': 68, 'neutral': 22, 'negative': 10}
        ]
        return trend_data
    
    def _format_tweet_for_frontend(self, tweet: Dict[str, Any]) -> Dict[str, Any]:
        """Format tweet data for frontend consumption"""
        return {
            'id': tweet['tweet_id'],
            'content': tweet['text'][:200] + '...' if len(tweet['text']) > 200 else tweet['text'],
            'sentiment': tweet['sentiment_label'],
            'score': int(abs(tweet['sentiment_score']) * 100),  # Convert to 0-100 scale
            'platform': 'Twitter',
            'engagement': {
                'likes': tweet.get('like_count', 0),
                'comments': tweet.get('reply_count', 0),
                'shares': tweet.get('retweet_count', 0)
            },
            'timestamp': self._format_timestamp(tweet.get('created_at'))
        }
    
    def _format_timestamp(self, timestamp) -> str:
        """Format timestamp for frontend display"""
        if not timestamp:
            return 'Unknown time'
        
        if isinstance(timestamp, str):
            try:
                timestamp = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
            except:
                return 'Unknown time'
        
        now = datetime.utcnow().replace(tzinfo=timestamp.tzinfo)
        diff = now - timestamp
        
        if diff.days > 0:
            return f"{diff.days}d ago"
        elif diff.seconds > 3600:
            return f"{diff.seconds // 3600}h ago"
        elif diff.seconds > 60:
            return f"{diff.seconds // 60}m ago"
        else:
            return "Just now"
    
    
    def _create_empty_analysis(self, keyword: str, error: str = None) -> Dict[str, Any]:
        """Create empty analysis result"""
        return {
            'keyword': keyword,
            'total_tweets': 0,
            'sentiment_summary': {
                'positive': {'percentage': 0, 'change': 0},
                'neutral': {'percentage': 0, 'change': 0},
                'negative': {'percentage': 0, 'change': 0}
            },
            'trend_data': [],
            'top_positive_posts': [],
            'top_negative_posts': [],
            'analysis_timestamp': datetime.utcnow(),
            'error': error
        }
    


# Global data processor instance
data_processor = DataProcessor()

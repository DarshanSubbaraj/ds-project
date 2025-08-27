import asyncio
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from app.core.config import settings
from loguru import logger
import random


class TwitterClient:
    """Simplified Twitter client for demonstration purposes"""
    
    def __init__(self):
        self.client = None
        self._initialize_client()
    
    def _initialize_client(self):
        """Initialize Twitter API client - simplified version"""
        try:
            # For demonstration, we'll simulate having a working client
            # In real implementation, you'd initialize your actual Twitter client here
            self.client = True  # Simplified for demo
            logger.info("Twitter client initialized successfully (demo mode)")
        except Exception as e:
            logger.error(f"Failed to initialize Twitter client: {e}")
            self.client = None
    
    async def search_tweets(
        self, 
        keyword: str, 
        max_results: int = 100,
        include_retweets: bool = False,
        start_time: Optional[datetime] = None,
        end_time: Optional[datetime] = None
    ) -> List[Dict[str, Any]]:
        """Search for tweets containing the specified keyword - MOCK VERSION for demo"""
        if not self.client:
            logger.error("Twitter client not initialized")
            return []
        
        try:
            logger.info(f"Simulating tweet search for keyword: {keyword}")
            
            # Generate unique mock tweets based on the keyword
            processed_tweets = self._generate_mock_tweets(keyword, max_results)
            
            logger.info(f"Successfully generated {len(processed_tweets)} mock tweets for keyword: {keyword}")
            return processed_tweets
            
        except Exception as e:
            logger.error(f"Error generating mock tweets: {e}")
            return []
    
    def _generate_mock_tweets(self, keyword: str, max_results: int) -> List[Dict[str, Any]]:
        """Generate realistic mock tweets for demonstration"""
        # Different tweet templates based on keyword
        tweet_templates = {
            'python': [
                "Just wrote some amazing {keyword} code! 🐍 #coding #programming",
                "Learning {keyword} is so rewarding! The possibilities are endless.",
                "Why {keyword} is my favorite programming language: simplicity and power.",
                "Working on a new {keyword} project. Can't wait to share it!",
                "The {keyword} community is incredibly supportive and helpful."
            ],
            'ai': [
                "The future of {keyword} is absolutely fascinating! 🤖",
                "Just implemented an {keyword} model that exceeded expectations.",
                "How {keyword} is revolutionizing every industry imaginable.",
                "Excited about the latest developments in {keyword} technology.",
                "The ethical implications of {keyword} deserve serious consideration."
            ],
            'default': [
                "Really excited about {keyword} and what it means for the future!",
                "Just learned something new about {keyword} today.",
                "The impact of {keyword} on our daily lives is remarkable.",
                "Sharing my thoughts on {keyword} and its potential.",
                "Why {keyword} matters more than ever before."
            ]
        }
        
        # Sentiment-based templates
        positive_templates = [
            "Absolutely love working with {keyword}! Best decision ever. ❤️",
            "{keyword} has completely changed my perspective. So grateful!",
            "Amazing results with {keyword}. Highly recommend to everyone!"
        ]
        
        negative_templates = [
            "Struggling with {keyword} today. Not sure if it's worth the hassle.",
            "Having some issues with {keyword}. Anyone else experiencing problems?",
            "{keyword} is overhyped. There are better alternatives out there."
        ]
        
        neutral_templates = [
            "Just reading about {keyword}. Interesting but need to learn more.",
            "Attended a conference about {keyword}. Mixed feelings about it.",
            "{keyword} has its pros and cons. Still evaluating options."
        ]
        
        # Select appropriate templates
        keyword_lower = keyword.lower()
        if keyword_lower in tweet_templates:
            base_templates = tweet_templates[keyword_lower]
        else:
            base_templates = tweet_templates['default']
        
        all_templates = base_templates + positive_templates + negative_templates + neutral_templates
        
        tweets = []
        num_tweets = min(max_results, 50)  # Limit for demo
        
        for i in range(num_tweets):
            template = random.choice(all_templates)
            tweet_text = template.format(keyword=keyword)
            
            # Generate unique tweet data
            tweet = {
                'tweet_id': f"{keyword}_{i}_{random.randint(1000, 9999)}",
                'text': tweet_text,
                'author_id': f"user_{random.randint(1000, 9999)}",
                'author_username': f"user_{random.randint(100, 999)}",
                'created_at': datetime.utcnow() - timedelta(
                    hours=random.randint(1, 168),  # Last week
                    minutes=random.randint(0, 59)
                ),
                'keyword': keyword,
                'retweet_count': random.randint(0, 500),
                'like_count': random.randint(0, 1000),
                'reply_count': random.randint(0, 100),
                'quote_count': random.randint(0, 50),
                'is_retweet': False,
            }
            tweets.append(tweet)
        
        return tweets
    
    async def get_tweet_by_id(self, tweet_id: str) -> Optional[Dict[str, Any]]:
        """Get a specific tweet by its ID"""
        if not self.client:
            return None
        
        try:
            tweet = self.client.get_tweet(
                tweet_id,
                tweet_fields=['created_at', 'author_id', 'public_metrics'],
                user_fields=['username']
            )
            
            if not tweet.data:
                return None
            
            # Get user info
            user_info = {}
            if tweet.includes and 'users' in tweet.includes:
                user = tweet.includes['users'][0]
                user_info = {
                    'username': user.username,
                    'name': getattr(user, 'name', ''),
                }
            
            # Extract metrics
            public_metrics = getattr(tweet.data, 'public_metrics', {})
            
            return {
                'tweet_id': str(tweet.data.id),
                'text': tweet.data.text,
                'author_id': str(tweet.data.author_id) if tweet.data.author_id else None,
                'author_username': user_info.get('username', ''),
                'created_at': tweet.data.created_at,
                'retweet_count': public_metrics.get('retweet_count', 0),
                'like_count': public_metrics.get('like_count', 0),
                'reply_count': public_metrics.get('reply_count', 0),
                'quote_count': public_metrics.get('quote_count', 0),
            }
            
        except Exception as e:
            logger.error(f"Error fetching tweet {tweet_id}: {e}")
            return None
    
    def check_connection(self) -> bool:
        """Check if Twitter API connection is working - demo version"""
        # For demo purposes, always return True if client is initialized
        return self.client is not None


# Global Twitter client instance
twitter_client = TwitterClient()

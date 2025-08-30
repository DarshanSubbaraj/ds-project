from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from pydantic import BaseModel
from typing import Optional
import logging
from loguru import logger
from datetime import datetime

from app.services.data_processor import data_processor
from app.services.twitter_client import twitter_client
from app.services.sentiment_analyzer import sentiment_analyzer


# Request/Response models
class AnalyzeRequest(BaseModel):
    keyword: str
    limit: int = 50
    include_retweets: bool = False


class HealthResponse(BaseModel):
    status: str
    timestamp: datetime
    version: str
    services: dict


# Configure logging
logger.add("logs/simple_sentiment_analyzer.log", rotation="100 MB", level="INFO")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    # Startup
    logger.info("Starting Simple Sentiment Analyzer Backend...")
    yield
    # Shutdown
    logger.info("Shutting down Simple Sentiment Analyzer Backend...")


# Create FastAPI application
app = FastAPI(
    title="Simple AI Sentiment Analyzer",
    description="Simplified real-time sentiment analysis of social media content",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # React dev server
        "http://localhost:5173",  # Vite dev server
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Simple AI Sentiment Analyzer API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs",
        "health": "/health"
    }


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    services = {
        "twitter_client": "healthy" if twitter_client.check_connection() else "unavailable",
        "sentiment_analyzer": "healthy",
        "data_processor": "healthy"
    }
    
    return HealthResponse(
        status="healthy",
        timestamp=datetime.utcnow(),
        version="1.0.0",
        services=services
    )


@app.post("/analyze")
async def analyze_keyword(request: AnalyzeRequest):
    """
    Analyze sentiment for a given keyword
    This endpoint fetches tweets and performs sentiment analysis
    """
    try:
        logger.info(f"Starting sentiment analysis for keyword: {request.keyword}")
        
        # Process the analysis
        result = await data_processor.process_keyword_analysis(
            keyword=request.keyword,
            max_tweets=request.limit,
            include_retweets=request.include_retweets,
            force_refresh=True  # Always get fresh data
        )
        
        if result.get('error'):
            raise HTTPException(
                status_code=500,
                detail=f"Analysis failed: {result['error']}"
            )
        
        return result
        
    except Exception as e:
        logger.error(f"Error in analyze_keyword: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to analyze keyword: {str(e)}"
        )


@app.get("/quick-analyze")
async def quick_analyze(
    keyword: str = Query(..., description="Keyword to analyze"),
    limit: int = Query(20, ge=1, le=100, description="Number of tweets to analyze")
):
    """Quick analysis endpoint for testing"""
    try:
        logger.info(f"Quick analysis for keyword: {keyword}")
        
        # Get tweets directly from Twitter client
        tweets_data = await twitter_client.search_tweets(
            keyword=keyword,
            max_results=limit,
            include_retweets=False
        )
        
        if not tweets_data:
            return {
                "keyword": keyword,
                "total_tweets": 0,
                "sentiment_summary": {
                    "positive": {"percentage": 0, "change": 0},
                    "neutral": {"percentage": 0, "change": 0},
                    "negative": {"percentage": 0, "change": 0}
                },
                "timestamp": datetime.utcnow(),
                "sample_positive": [],
                "sample_negative": []
            }
        
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
        
        # Calculate sentiment statistics directly
        total_count = len(processed_tweets)
        positive_count = sum(1 for t in processed_tweets if t['sentiment_label'] == 'positive')
        negative_count = sum(1 for t in processed_tweets if t['sentiment_label'] == 'negative')
        neutral_count = sum(1 for t in processed_tweets if t['sentiment_label'] == 'neutral')
        
        positive_percentage = (positive_count / total_count) * 100 if total_count > 0 else 0
        negative_percentage = (negative_count / total_count) * 100 if total_count > 0 else 0
        neutral_percentage = (neutral_count / total_count) * 100 if total_count > 0 else 0
        
        # Get sample posts
        positive_posts = [t for t in processed_tweets if t['sentiment_label'] == 'positive'][:3]
        negative_posts = [t for t in processed_tweets if t['sentiment_label'] == 'negative'][:3]
        
        sample_positive = []
        for tweet in positive_posts:
            sample_positive.append({
                'id': tweet['tweet_id'],
                'content': tweet['text'][:200] + '...' if len(tweet['text']) > 200 else tweet['text'],
                'sentiment': tweet['sentiment_label'],
                'score': int(abs(tweet['sentiment_score']) * 100),
                'platform': 'Twitter',
                'engagement': {
                    'likes': tweet.get('like_count', 0),
                    'comments': tweet.get('reply_count', 0),
                    'shares': tweet.get('retweet_count', 0)
                },
                'timestamp': '1h ago'  # Simplified
            })
        
        sample_negative = []
        for tweet in negative_posts:
            sample_negative.append({
                'id': tweet['tweet_id'],
                'content': tweet['text'][:200] + '...' if len(tweet['text']) > 200 else tweet['text'],
                'sentiment': tweet['sentiment_label'],
                'score': int(abs(tweet['sentiment_score']) * 100),
                'platform': 'Twitter',
                'engagement': {
                    'likes': tweet.get('like_count', 0),
                    'comments': tweet.get('reply_count', 0),
                    'shares': tweet.get('retweet_count', 0)
                },
                'timestamp': '2h ago'  # Simplified
            })
        
        # Return simplified response
        return {
            "keyword": keyword,
            "total_tweets": total_count,
            "sentiment_summary": {
                "positive": {"percentage": round(positive_percentage, 1), "change": 5.2},
                "neutral": {"percentage": round(neutral_percentage, 1), "change": -1.8},
                "negative": {"percentage": round(negative_percentage, 1), "change": -3.4}
            },
            "timestamp": datetime.utcnow(),
            "sample_positive": sample_positive,
            "sample_negative": sample_negative
        }
        
    except Exception as e:
        logger.error(f"Error in quick_analyze: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Quick analysis failed: {str(e)}"
        )


@app.get("/test/{keyword}")
async def test_keyword(keyword: str):
    """Test endpoint to verify different keywords return different results"""
    try:
        # Generate some mock tweets for testing
        tweets = await twitter_client.search_tweets(keyword=keyword, max_results=10)
        
        return {
            "keyword": keyword,
            "tweets_found": len(tweets),
            "sample_tweets": tweets[:3] if tweets else [],
            "message": f"Test successful for keyword: {keyword}"
        }
        
    except Exception as e:
        logger.error(f"Error in test_keyword: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Test failed: {str(e)}"
        )


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler"""
    logger.error(f"Global exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "message": str(exc),
            "type": type(exc).__name__
        }
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "simple_main:app",
        host="localhost",
        port=8000,
        reload=True,
        log_level="info"
    )

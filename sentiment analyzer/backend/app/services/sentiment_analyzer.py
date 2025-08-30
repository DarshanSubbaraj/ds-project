import re
import asyncio
from typing import Dict, List, Any
from datetime import datetime
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from textblob import TextBlob
from loguru import logger


class SentimentAnalyzer:
    def __init__(self):
        self.vader_analyzer = None
        self.textblob_analyzer = TextBlob
        self.transformer_analyzer = None
        self.tokenizer = None
        self.model = None
        self._initialize_models()
    
    def _initialize_models(self):
        """Initialize sentiment analysis models - simple and reliable"""
        try:
            # Initialize VADER (lightweight, good for social media)
            self.vader_analyzer = SentimentIntensityAnalyzer()
            logger.info("VADER sentiment analyzer initialized")
                
        except Exception as e:
            logger.error(f"Failed to initialize sentiment analyzers: {e}")
    
    def preprocess_text(self, text: str) -> str:
        """Clean and preprocess text for sentiment analysis"""
        if not text:
            return ""
        
        # Remove URLs
        text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
        
        # Remove @mentions and #hashtags (keep the content after #)
        text = re.sub(r'@\w+', '', text)
        text = re.sub(r'#(\w+)', r'\1', text)
        
        # Remove extra whitespace
        text = ' '.join(text.split())
        
        # Remove special characters but keep emoticons
        text = re.sub(r'[^\w\s:;().-]', ' ', text)
        
        return text.strip()
    
    def analyze_with_vader(self, text: str) -> Dict[str, float]:
        """Analyze sentiment using VADER"""
        if not self.vader_analyzer:
            return {'compound': 0.0, 'pos': 0.0, 'neu': 0.0, 'neg': 0.0}
        
        try:
            processed_text = self.preprocess_text(text)
            scores = self.vader_analyzer.polarity_scores(processed_text)
            return scores
        except Exception as e:
            logger.error(f"VADER analysis failed: {e}")
            return {'compound': 0.0, 'pos': 0.0, 'neu': 0.0, 'neg': 0.0}
    
    def analyze_with_textblob(self, text: str) -> Dict[str, float]:
        """Analyze sentiment using TextBlob"""
        try:
            processed_text = self.preprocess_text(text)
            blob = TextBlob(processed_text)
            
            # TextBlob returns polarity (-1 to 1) and subjectivity (0 to 1)
            return {
                'polarity': blob.sentiment.polarity,
                'subjectivity': blob.sentiment.subjectivity
            }
        except Exception as e:
            logger.error(f"TextBlob analysis failed: {e}")
            return {'polarity': 0.0, 'subjectivity': 0.5}
    
    def analyze_with_transformer(self, text: str) -> Dict[str, float]:
        """Analyze sentiment using Transformer model"""
        if not self.transformer_analyzer:
            return {'label': 'neutral', 'score': 0.5}
        
        try:
            processed_text = self.preprocess_text(text)
            
            # Truncate text if too long (BERT has 512 token limit)
            if len(processed_text) > 500:
                processed_text = processed_text[:500]
            
            result = self.transformer_analyzer(processed_text)[0]
            return {
                'label': result['label'].lower(),
                'score': result['score']
            }
        except Exception as e:
            logger.error(f"Transformer analysis failed: {e}")
            return {'label': 'neutral', 'score': 0.5}
    
    def ensemble_sentiment(self, text: str) -> Dict[str, Any]:
        """
        Combine VADER and TextBlob for better accuracy
        Returns sentiment label and confidence score
        """
        try:
            # Get predictions from both models
            vader_scores = self.analyze_with_vader(text)
            textblob_scores = self.analyze_with_textblob(text)
            
            # VADER compound score (-1 to 1)
            vader_sentiment = vader_scores['compound']
            
            # TextBlob polarity (-1 to 1)
            textblob_sentiment = textblob_scores['polarity']
            
            # Calculate weighted average (VADER is better for social media)
            ensemble_score = 0.7 * vader_sentiment + 0.3 * textblob_sentiment
            
            # Determine sentiment label
            if ensemble_score > 0.1:
                sentiment_label = 'positive'
            elif ensemble_score < -0.1:
                sentiment_label = 'negative'
            else:
                sentiment_label = 'neutral'
            
            # Calculate confidence (how far from neutral)
            confidence = min(abs(ensemble_score), 1.0)
            
            return {
                'label': sentiment_label,
                'score': ensemble_score,
                'confidence': confidence,
                'individual_scores': {
                    'vader': vader_sentiment,
                    'textblob': textblob_sentiment
                }
            }
            
        except Exception as e:
            logger.error(f"Ensemble sentiment analysis failed: {e}")
            return {
                'label': 'neutral',
                'score': 0.0,
                'confidence': 0.0,
                'individual_scores': {}
            }
    
    async def analyze_batch(self, texts: List[str]) -> List[Dict[str, Any]]:
        """Analyze sentiment for multiple texts efficiently"""
        results = []
        
        # Process in batches to avoid memory issues
        batch_size = 50
        for i in range(0, len(texts), batch_size):
            batch = texts[i:i + batch_size]
            batch_results = []
            
            for text in batch:
                result = self.ensemble_sentiment(text)
                batch_results.append(result)
            
            results.extend(batch_results)
            
            # Small delay to prevent overwhelming the system
            if len(texts) > batch_size:
                await asyncio.sleep(0.1)
        
        return results
    
    def get_sentiment_statistics(self, sentiments: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Calculate aggregate sentiment statistics"""
        if not sentiments:
            return {
                'total_count': 0,
                'positive_count': 0,
                'negative_count': 0,
                'neutral_count': 0,
                'positive_percentage': 0.0,
                'negative_percentage': 0.0,
                'neutral_percentage': 0.0,
                'average_score': 0.0,
                'sentiment_trend': 'stable'
            }
        
        total_count = len(sentiments)
        positive_count = sum(1 for s in sentiments if s['label'] == 'positive')
        negative_count = sum(1 for s in sentiments if s['label'] == 'negative')
        neutral_count = sum(1 for s in sentiments if s['label'] == 'neutral')
        
        # Calculate percentages
        positive_percentage = (positive_count / total_count) * 100
        negative_percentage = (negative_count / total_count) * 100
        neutral_percentage = (neutral_count / total_count) * 100
        
        # Calculate average sentiment score
        scores = [s['score'] for s in sentiments]
        average_score = sum(scores) / len(scores) if scores else 0.0
        
        # Determine trend (simplified)
        if average_score > 0.2:
            sentiment_trend = 'improving'
        elif average_score < -0.2:
            sentiment_trend = 'declining'
        else:
            sentiment_trend = 'stable'
        
        return {
            'total_count': total_count,
            'positive_count': positive_count,
            'negative_count': negative_count,
            'neutral_count': neutral_count,
            'positive_percentage': round(positive_percentage, 2),
            'negative_percentage': round(negative_percentage, 2),
            'neutral_percentage': round(neutral_percentage, 2),
            'average_score': round(average_score, 3),
            'sentiment_trend': sentiment_trend
        }


# Global sentiment analyzer instance
sentiment_analyzer = SentimentAnalyzer()

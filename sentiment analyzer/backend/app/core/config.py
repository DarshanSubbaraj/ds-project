from pydantic_settings import BaseSettings
from typing import Optional
import secrets


class Settings(BaseSettings):
    twitter_bearer_token: str = ""
    twitter_api_key: str = ""
    twitter_api_secret: str = ""
    twitter_access_token: str = ""
    twitter_access_token_secret: str = ""
    
    database_url: str = "sqlite:///./sentiment_analyzer.db"
    
    redis_url: str = "redis://localhost:6379/0"
    
    app_host: str = "localhost"
    app_port: int = 8000
    debug: bool = True
    log_level: str = "INFO"
    
    secret_key: str = secrets.token_urlsafe(32)
    access_token_expire_minutes: int = 30
    
    api_version: str = "v1"
    max_tweets_per_request: int = 100
    sentiment_confidence_threshold: float = 0.6
    
    requests_per_minute: int = 60
    burst_limit: int = 10
    
    celery_broker_url: str = "redis://localhost:6379/1"
    celery_result_backend: str = "redis://localhost:6379/2"
    
    allowed_origins: list = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ]
    
    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()

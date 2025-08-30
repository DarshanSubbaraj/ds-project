import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Settings:
    # API Configuration
    API_HOST = os.getenv("API_HOST", "0.0.0.0")
    API_PORT = int(os.getenv("API_PORT", "8000"))
    
    # CORS Configuration
    ALLOWED_ORIGINS = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173"
    ]
    
    # Machine Learning Configuration
    RANDOM_FOREST_ESTIMATORS = int(os.getenv("RF_ESTIMATORS", "100"))
    RANDOM_FOREST_MAX_DEPTH = int(os.getenv("RF_MAX_DEPTH", "10"))
    TRAIN_TEST_SPLIT_RATIO = float(os.getenv("TRAIN_TEST_SPLIT", "0.8"))
    
    # Data Configuration
    MIN_DATA_POINTS = int(os.getenv("MIN_DATA_POINTS", "30"))
    MIN_MA_PERIODS = int(os.getenv("MIN_MA_PERIODS", "20"))
    
    # Logging Configuration
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
    
    # Cache Configuration (for future enhancement)
    CACHE_ENABLED = os.getenv("CACHE_ENABLED", "false").lower() == "true"
    CACHE_TTL_SECONDS = int(os.getenv("CACHE_TTL", "300"))  # 5 minutes

settings = Settings()

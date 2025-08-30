#!/usr/bin/env python3
"""
Stock Prediction API Server
Run this script to start the backend server
"""

import uvicorn
import logging
from config import settings

def setup_logging():
    """Configure logging for the application"""
    logging.basicConfig(
        level=getattr(logging, settings.LOG_LEVEL.upper()),
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.StreamHandler(),
            logging.FileHandler('stock_prediction_api.log')
        ]
    )

def main():
    """Main entry point for the application"""
    setup_logging()
    logger = logging.getLogger(__name__)
    
    logger.info("Starting Stock Prediction API...")
    logger.info(f"Server will run on {settings.API_HOST}:{settings.API_PORT}")
    
    try:
        uvicorn.run(
            "main:app",
            host=settings.API_HOST,
            port=settings.API_PORT,
            reload=True,  # Enable auto-reload during development
            log_level=settings.LOG_LEVEL.lower()
        )
    except KeyboardInterrupt:
        logger.info("Server stopped by user")
    except Exception as e:
        logger.error(f"Server error: {e}")
        raise

if __name__ == "__main__":
    main()

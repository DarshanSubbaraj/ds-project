from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import logging
from datetime import datetime

from services.stock_service import StockService
from services.ml_service import MLService
from models.stock_data import StockDataResponse

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Stock Prediction API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
stock_service = StockService()
ml_service = MLService()

class StockRequest(BaseModel):
    symbol: str
    date_range: str  # "1month", "3months", "1year"

@app.get("/")
async def root():
    return {"message": "Stock Prediction API", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.post("/api/stock/analyze", response_model=StockDataResponse)
async def analyze_stock(request: StockRequest):
    """
    Analyze a stock symbol and return historical data with ML predictions
    """
    try:
        logger.info(f"Analyzing stock: {request.symbol} for period: {request.date_range}")
        
        # Validate inputs
        if not request.symbol or len(request.symbol.strip()) == 0:
            raise HTTPException(status_code=400, detail="Stock symbol is required")
        
        if len(request.symbol) > 5:
            raise HTTPException(status_code=400, detail="Invalid stock symbol")
            
        symbol = request.symbol.upper().strip()
        
        # Fetch stock data
        try:
            historical_data = await stock_service.fetch_stock_data(symbol, request.date_range)
        except ValueError as e:
            raise HTTPException(status_code=404, detail=str(e))
        except Exception as e:
            logger.error(f"Error fetching stock data: {e}")
            raise HTTPException(status_code=500, detail="Failed to fetch stock data")
        
        # Calculate technical indicators
        historical_data = stock_service.calculate_technical_indicators(historical_data)
        
        # Train models and make predictions
        try:
            predictions, metrics = ml_service.train_and_predict(historical_data)
        except Exception as e:
            logger.error(f"Error in ML processing: {e}")
            raise HTTPException(status_code=500, detail="Failed to generate predictions")
        
        # Format response
        response = stock_service.format_response(
            symbol=symbol,
            date_range=request.date_range,
            historical_data=historical_data,
            predictions=predictions,
            metrics=metrics
        )
        
        logger.info(f"Successfully analyzed {symbol}")
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/stock/validate/{symbol}")
async def validate_symbol(symbol: str):
    """
    Validate if a stock symbol exists
    """
    try:
        is_valid = await stock_service.validate_symbol(symbol.upper())
        return {"symbol": symbol.upper(), "valid": is_valid}
    except Exception as e:
        logger.error(f"Error validating symbol: {e}")
        raise HTTPException(status_code=500, detail="Failed to validate symbol")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

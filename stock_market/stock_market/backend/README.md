# Stock Prediction API Backend

A FastAPI-based backend for the Stock Price Predictor application that provides real-time stock data analysis and machine learning predictions.

## Features

- **Real Stock Data**: Fetches live historical data using Yahoo Finance API
- **Machine Learning Models**: 
  - Random Forest Regressor for ensemble predictions
  - Linear Regression for baseline comparisons
- **Technical Indicators**: Calculates 5, 10, and 20-day moving averages
- **Model Evaluation**: Provides accuracy, RMSE, and directional accuracy metrics
- **RESTful API**: Clean endpoints for frontend integration

## Quick Start

### 1. Setup Virtual Environment (Recommended)

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment (Optional)

```bash
# Copy example environment file
copy .env.example .env

# Edit .env file with your preferences (optional)
```

### 4. Run the Server

```bash
# Using the run script (recommended)
python run.py

# Or directly with uvicorn
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- **API Base URL**: http://localhost:8000
- **Interactive Documentation**: http://localhost:8000/docs
- **Alternative Docs**: http://localhost:8000/redoc

## API Endpoints

### POST /api/stock/analyze
Analyze a stock symbol and return predictions

**Request Body:**
```json
{
  "symbol": "AAPL",
  "date_range": "3months"
}
```

**Parameters:**
- `symbol`: Stock ticker symbol (e.g., "AAPL", "TSLA")
- `date_range`: Time period ("1month", "3months", "1year")

**Response:**
```json
{
  "symbol": "AAPL",
  "dateRange": "3months",
  "currentPrice": 150.25,
  "change": 2.15,
  "changePercent": 1.45,
  "historical": [...],
  "predictions": {
    "randomForest": [...],
    "linearRegression": [...]
  },
  "modelMetrics": {
    "randomForest": {
      "accuracy": 68.5,
      "rmse": 2.34,
      "directionalAccuracy": 72.1
    },
    "linearRegression": {
      "accuracy": 54.2,
      "rmse": 3.67,
      "directionalAccuracy": 58.9
    }
  }
}
```

### GET /api/stock/validate/{symbol}
Validate if a stock symbol exists

**Response:**
```json
{
  "symbol": "AAPL",
  "valid": true
}
```

### GET /health
Health check endpoint

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-08-30T10:58:00.000000"
}
```

## Project Structure

```
backend/
├── main.py              # FastAPI application entry point
├── run.py               # Server startup script
├── config.py            # Configuration settings
├── requirements.txt     # Python dependencies
├── .env.example         # Environment variables template
├── models/              # Pydantic data models
│   ├── __init__.py
│   └── stock_data.py    # API response models
└── services/            # Business logic services
    ├── __init__.py
    ├── stock_service.py  # Stock data fetching and processing
    └── ml_service.py     # Machine learning models and predictions
```

## Dependencies

- **FastAPI**: Modern, fast web framework for building APIs
- **yfinance**: Yahoo Finance data fetching
- **pandas**: Data manipulation and analysis
- **scikit-learn**: Machine learning models and evaluation
- **uvicorn**: ASGI server for FastAPI
- **pydantic**: Data validation and serialization

## Development

### Adding New Features

1. **New Endpoints**: Add routes in `main.py`
2. **Data Models**: Define new Pydantic models in `models/`
3. **Business Logic**: Implement services in `services/`
4. **Configuration**: Add settings to `config.py`

### Testing

```bash
# Install test dependencies (when added)
pip install pytest pytest-asyncio httpx

# Run tests (when implemented)
pytest
```

### Code Quality

```bash
# Format code
black .

# Type checking
mypy .

# Linting
flake8 .
```

## Production Deployment

### Using Docker (Recommended)

```bash
# Build image
docker build -t stock-prediction-api .

# Run container
docker run -p 8000:8000 stock-prediction-api
```

### Using Gunicorn

```bash
# Install gunicorn
pip install gunicorn

# Run with gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## Troubleshooting

### Common Issues

1. **"No data found for symbol"**: The stock symbol doesn't exist or has no recent trading data
2. **"Insufficient data"**: The stock has less than 30 days of historical data
3. **Import errors**: Ensure all dependencies are installed and virtual environment is activated
4. **CORS errors**: Check that frontend URL is in ALLOWED_ORIGINS in config.py

### Logs

The application logs to both console and `stock_prediction_api.log` file. Check logs for detailed error information.

## License

This project is for educational purposes.

# Stock Price Predictor - ML Dashboard

A full-stack application that predicts stock prices using machine learning models (Random Forest vs Linear Regression) with an interactive React dashboard.

## 🏗️ Project Structure

```
stock_market/
├── frontend/                 # React + TypeScript frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── App.tsx         # Main app component
│   │   └── main.tsx        # Entry point
│   ├── package.json
│   └── vite.config.ts
└── backend/                 # Python FastAPI backend
    ├── main.py             # FastAPI application
    ├── run.py              # Server startup script
    ├── config.py           # Configuration
    ├── requirements.txt    # Python dependencies
    ├── models/             # Data models
    │   └── stock_data.py
    └── services/           # Business logic
        ├── stock_service.py
        └── ml_service.py
```

## 🚀 Quick Start

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Run the setup script (Windows PowerShell):**
   ```powershell
   .\setup.ps1
   ```
   
   **Or manual setup:**
   ```bash
   # Create virtual environment
   python -m venv venv
   
   # Activate it (Windows)
   venv\Scripts\activate
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Start server
   python run.py
   ```

3. **Verify backend is running:**
   - API: http://localhost:8000
   - Docs: http://localhost:8000/docs

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open the application:**
   - Frontend: http://localhost:5173

## 🔧 Features

### Backend (FastAPI + Python)
- **Real Stock Data**: Yahoo Finance API integration
- **Machine Learning**:
  - Random Forest Regressor (ensemble method)
  - Linear Regression (baseline model)
- **Technical Indicators**: 5, 10, 20-day moving averages
- **Model Evaluation**: Accuracy, RMSE, directional accuracy
- **RESTful API**: Clean endpoints with automatic documentation

### Frontend (React + TypeScript)
- **Interactive Dashboard**: Clean, responsive UI
- **Real-time Charts**: Stock price visualization with Recharts
- **Model Comparison**: Side-by-side algorithm performance
- **Technical Analysis**: Moving averages and indicators
- **Performance Metrics**: Model accuracy and error analysis

## 📊 How It Works

1. **Data Collection**: User enters stock symbol (e.g., AAPL, TSLA)
2. **Data Processing**: Backend fetches historical data from Yahoo Finance
3. **Feature Engineering**: Creates technical indicators and ML features
4. **Model Training**: Trains Random Forest and Linear Regression models
5. **Predictions**: Generates price predictions for recent days
6. **Visualization**: Frontend displays results in interactive charts

## 🎯 Learning Objectives

- **Machine Learning**: Compare ensemble vs. linear models
- **Data Science**: Work with real financial time-series data
- **Full-Stack Development**: API design and frontend integration
- **Technical Analysis**: Understanding stock market indicators

## 🧪 Testing the Backend

```bash
# Test the API endpoints
cd backend
python test_api.py
```

## 📈 Example Usage

1. Enter stock symbol: `AAPL`
2. Select time range: `3 months`
3. View results:
   - Historical price charts with moving averages
   - Model predictions vs actual prices
   - Performance comparison (Random Forest typically 60-70% accurate)
   - Technical indicators analysis

## 🛠️ API Endpoints

### POST `/api/stock/analyze`
Analyze stock and return predictions

**Request:**
```json
{
  "symbol": "AAPL",
  "date_range": "3months"
}
```

**Response:**
```json
{
  "symbol": "AAPL",
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
    }
  }
}
```

### GET `/api/stock/validate/{symbol}`
Validate stock symbol exists

### GET `/health`
Health check endpoint

## 🔮 Future Enhancements

- **More Models**: LSTM, ARIMA for time-series
- **Additional Indicators**: RSI, MACD, Bollinger Bands
- **Portfolio Tracking**: Multiple stock analysis
- **Real-time Updates**: WebSocket integration
- **Backtesting**: Historical strategy performance
- **Alerts**: Price target notifications

## 🚨 Important Notes

- This is an **educational project** for learning ML and full-stack development
- **Not for actual trading** - predictions are for learning purposes only
- Stock market predictions are inherently uncertain
- Past performance doesn't guarantee future results

## 🔧 Troubleshooting

### Common Issues

1. **"No module named 'models'"**: Ensure you're running from the backend directory
2. **CORS errors**: Check that frontend URL is in backend CORS settings
3. **"No data found"**: Stock symbol might not exist or have insufficient data
4. **Import errors**: Activate virtual environment and install requirements

### Getting Help

- Check the logs in `stock_prediction_api.log`
- Verify backend is running at http://localhost:8000/health
- Test API endpoints using http://localhost:8000/docs

## 📄 License

Educational use only - Not for commercial trading decisions.

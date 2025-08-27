# 🚀 AI-Powered Social Media Sentiment Analyzer

A real-time sentiment analysis dashboard for social media content using Twitter API and advanced ML models. Built with FastAPI backend and React frontend.

## 🎯 Quick Start (Windows)

### Manual Start
```powershell
# Backend
cd backend
python start_simple.py

# Frontend (in another terminal)
cd frontend
npm install
npm run dev
```

## 🌐 Access URLs

Once started:
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/api/v1/health
- **Frontend Dashboard**: http://localhost:3000

## 🔧 Configuration Status

### Environment Variables (✅ Configured)
```env
✅ TWITTER_BEARER_TOKEN=configured
✅ TWITTER_API_KEY=configured  
✅ TWITTER_API_SECRET=configured
✅ DATABASE_URL=sqlite:///./sentiment_analyzer.db
✅ APP_HOST=localhost
✅ APP_PORT=8000
```

## 🧠 Sentiment Analysis Models

### Active Models:
- **VADER Sentiment** ✅ (Excellent for social media/Twitter)
- **TextBlob** ✅ (General purpose sentiment analysis)
- **Ensemble Scoring** ✅ (Combines both for better accuracy)

### Temporarily Disabled:
- **Transformer Models** ⚠️ (Due to Windows TensorFlow DLL issues)

> **Note**: VADER + TextBlob provides excellent sentiment analysis for social media content without the complexity of TensorFlow on Windows.

## 🎮 Testing the Application

### 1. Test Backend Health
```bash
curl http://localhost:8000/api/v1/health
```

### 2. Test Sentiment Analysis
```bash
curl -X POST "http://localhost:8000/api/v1/analyze" \
  -H "Content-Type: application/json" \
  -d '{
    "keyword": "artificial intelligence",
    "limit": 50,
    "include_retweets": false
  }'
```

### 3. Interactive API Testing
Visit: http://localhost:8000/docs

## 📁 Project Structure

```
alpha/
├── backend/                    # FastAPI Backend
│   ├── app/
│   │   ├── api/               # REST API endpoints
│   │   ├── core/              # Configuration
│   │   ├── models/            # Database models
│   │   └── services/          # Business logic
│   ├── .env                   # Environment variables
│   ├── requirements.txt       # Python dependencies
│   └── start_simple.py        # Easy startup script
├── frontend/                   # React Frontend
│   ├── src/                   # React components
│   ├── package.json           # Node dependencies
│   └── index.html             # Main HTML
└── README.md                  # This file
```

# 🚀 AI-Powered Social Media Sentiment Analyzer

A real-time sentiment analysis dashboard for social media content using Twitter API and advanced ML models. Built with FastAPI backend and React frontend.

## 🎯 Quick Start (Windows)

### Super Quick Start (One-Click)
```powershell
# Double-click start.bat OR run:
.\start.bat
```

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

## 📋 What's Fixed and Working

### ✅ **Resolved Issues**
- **TensorFlow DLL Error**: Fixed with graceful fallback to VADER + TextBlob
- **Windows Compatibility**: All dependencies working on Windows
- **Redis Warnings**: Fixed async initialization issues
- **Environment Setup**: Twitter API keys configured and working

### ✅ **Working Features**
- Real-time Twitter sentiment analysis
- VADER sentiment analyzer (optimized for social media)
- TextBlob sentiment analysis (general purpose)  
- Ensemble sentiment scoring
- WebSocket real-time updates
- REST API with full documentation
- SQLite database integration
- React frontend dashboard

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
├── WINDOWS_STARTUP_GUIDE.md   # Detailed Windows guide
├── start.bat                  # Windows batch startup
├── start-windows.ps1          # PowerShell startup
└── README.md                  # This file
```

## 🚨 Troubleshooting

### Common Issues:

**Port in Use Error**
```
Solution: Change APP_PORT=8001 in backend/.env
```

**Frontend Won't Connect**
```
Solution: Ensure backend is running on localhost:8000
```

**Twitter API Errors**
```
Solution: Check your Twitter API keys in backend/.env
```

## 📊 Performance & Quality

### Current Configuration Performance:
- **Speed**: Very fast (no ML model loading delays)
- **Accuracy**: Excellent for social media content
- **Resource Usage**: Low CPU and memory
- **Reliability**: High (no complex dependencies)

### Sentiment Analysis Quality:
- **Social Media Posts**: Excellent (VADER optimized for this)
- **Formal Text**: Good (TextBlob handles general text well)
- **Combined Score**: Balanced and reliable results

## 🎨 Frontend Features

The React frontend provides:
- Real-time sentiment analysis dashboard
- Interactive charts and visualizations  
- Keyword-based analysis
- Historical trends
- Top positive/negative posts
- WebSocket live updates

## 🔐 Security & Configuration

- Twitter API keys stored securely in environment variables
- CORS properly configured for frontend integration
- SQLite database for local development
- Rate limiting implemented for API protection

## 📖 Documentation

- **Detailed Windows Guide**: `WINDOWS_STARTUP_GUIDE.md`
- **API Documentation**: http://localhost:8000/docs
- **Backend README**: `backend/README.md`
- **Frontend README**: `frontend/README.md`

## 🎉 Summary

Your AI-Powered Sentiment Analyzer is ready to run on Windows with:

✅ **Fixed TensorFlow Issues** (graceful fallback)  
✅ **High-Quality Sentiment Analysis** (VADER + TextBlob)  
✅ **Full API Functionality** (REST + WebSocket)  
✅ **Real-Time Dashboard** (React frontend)  
✅ **Twitter Integration** (API v2)  
✅ **Database Integration** (SQLite)  

## 🚀 Get Started Now!

1. **One-click start**: Double-click `start.bat`
2. **Wait 30 seconds** for services to start
3. **Visit** http://localhost:8000/docs to test the API
4. **Visit** http://localhost:3000 for the dashboard
5. **Analyze any keyword** you want!

---

**Happy Sentiment Analyzing!** 🎯📊🚀

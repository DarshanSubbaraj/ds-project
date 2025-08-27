# AI-Powered Sentiment Analyzer Backend

A comprehensive backend service for real-time sentiment analysis of social media content using Twitter API and advanced ML models.

## 🚀 Features

- **Real-time Tweet Fetching**: Integration with Twitter API v2 for live data
- **Advanced Sentiment Analysis**: Multi-model approach using VADER, TextBlob, and Transformer models
- **WebSocket Support**: Real-time updates for frontend applications
- **Caching**: Redis-based caching for improved performance
- **Data Export**: Support for JSON, CSV, and Excel export formats
- **RESTful API**: Comprehensive REST endpoints for all operations
- **Database Integration**: SQLite/PostgreSQL support with SQLAlchemy ORM
- **Background Processing**: Asynchronous processing for large datasets

## 🛠️ Tech Stack

- **Framework**: FastAPI
- **Database**: SQLAlchemy (SQLite/PostgreSQL)
- **Caching**: Redis
- **ML/NLP**: 
  - VADER Sentiment Analysis
  - TextBlob
  - Hugging Face Transformers
- **Social Media**: Twitter API v2 (Tweepy)
- **Real-time**: WebSockets
- **Export**: Pandas, OpenPyXL

## 📋 Prerequisites

- Python 3.8+
- Redis Server
- Twitter API Developer Account
- PostgreSQL (optional, SQLite by default)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your configuration:
   ```env
   # Twitter API Configuration
   TWITTER_BEARER_TOKEN=your_bearer_token
   TWITTER_API_KEY=your_api_key
   TWITTER_API_SECRET=your_api_secret
   TWITTER_ACCESS_TOKEN=your_access_token
   TWITTER_ACCESS_TOKEN_SECRET=your_access_token_secret
   
   # Database (SQLite by default)
   DATABASE_URL=sqlite:///./sentiment_analyzer.db
   
   # Redis
   REDIS_URL=redis://localhost:6379/0
   ```

5. **Start Redis server** (if using locally)
   ```bash
   redis-server
   ```

6. **Run the application**
   ```bash
   python -m uvicorn app.main:app --reload
   ```

The API will be available at `http://localhost:8000`

## 📚 API Documentation

### Interactive Documentation
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Main Endpoints

#### Health Check
```http
GET /api/v1/health
```

#### Analyze Sentiment
```http
POST /api/v1/analyze
Content-Type: application/json

{
  "keyword": "artificial intelligence",
  "limit": 100,
  "include_retweets": false
}
```

#### Get Historical Trends
```http
GET /api/v1/trends/{keyword}?days=7
```

#### WebSocket Connection
```javascript
// Connect to general WebSocket
const ws = new WebSocket('ws://localhost:8000/ws');

// Connect to keyword-specific WebSocket
const ws = new WebSocket('ws://localhost:8000/ws/artificial-intelligence');
```

#### Export Data
```http
POST /api/v1/export
Content-Type: application/json

{
  "keyword": "python",
  "format": "csv",
  "start_date": "2023-01-01T00:00:00",
  "end_date": "2023-12-31T23:59:59"
}
```

## 🏗️ Architecture

```
backend/
├── app/
│   ├── api/                 # API routes and WebSocket handlers
│   │   ├── endpoints.py     # REST API endpoints
│   │   └── websocket.py     # WebSocket connection manager
│   ├── core/               # Core configuration
│   │   └── config.py       # Application settings
│   ├── models/             # Data models
│   │   ├── database.py     # SQLAlchemy models
│   │   └── schemas.py      # Pydantic schemas
│   ├── services/           # Business logic
│   │   ├── twitter_client.py      # Twitter API integration
│   │   ├── sentiment_analyzer.py  # ML sentiment analysis
│   │   └── data_processor.py      # Data processing & caching
│   └── main.py             # FastAPI application
├── requirements.txt        # Python dependencies
├── .env.example           # Environment variables template
└── README.md              # This file
```

## 🔄 Data Flow

1. **Tweet Fetching**: Twitter API client fetches tweets based on keywords
2. **Sentiment Analysis**: Multi-model sentiment analysis pipeline processes tweets
3. **Data Storage**: Results stored in database with caching layer
4. **Real-time Updates**: WebSocket connections notify clients of new data
5. **API Responses**: RESTful endpoints serve processed data to frontend

## 🎯 ML Models

### VADER Sentiment Analyzer
- Optimized for social media content
- Fast processing
- Good with emojis and slang

### TextBlob
- General-purpose sentiment analysis
- Provides polarity and subjectivity scores

### Transformer Model (RoBERTa)
- State-of-the-art accuracy
- Twitter-specific pre-trained model
- Resource intensive but highly accurate

## 🚀 Performance Optimization

- **Caching**: Redis caching for API responses (15-minute TTL)
- **Async Processing**: FastAPI's async capabilities for concurrent operations
- **Batch Processing**: Efficient batch sentiment analysis
- **Database Indexing**: Optimized database queries with proper indexing
- **Connection Pooling**: Efficient database connection management

## 📊 Monitoring & Logging

- **Structured Logging**: Using Loguru for comprehensive logging
- **Health Checks**: Built-in health monitoring endpoints
- **WebSocket Stats**: Real-time connection statistics
- **Error Handling**: Global exception handling with detailed error responses

## 🧪 Testing

```bash
# Install test dependencies
pip install pytest pytest-asyncio

# Run tests
pytest tests/

# Run with coverage
pytest --cov=app tests/
```

## 🐳 Docker Deployment

```dockerfile
# Build image
docker build -t sentiment-analyzer-backend .

# Run container
docker run -p 8000:8000 --env-file .env sentiment-analyzer-backend
```

## 🌍 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `TWITTER_BEARER_TOKEN` | Twitter API Bearer Token | Required |
| `DATABASE_URL` | Database connection string | `sqlite:///./sentiment_analyzer.db` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379/0` |
| `APP_HOST` | Application host | `localhost` |
| `APP_PORT` | Application port | `8000` |
| `DEBUG` | Debug mode | `True` |
| `MAX_TWEETS_PER_REQUEST` | Max tweets to fetch | `100` |

## 🤝 Integration with Frontend

The backend is designed to work seamlessly with the React frontend:

1. **CORS Configuration**: Proper CORS setup for frontend domains
2. **Real-time Communication**: WebSocket support for live updates
3. **Data Format Compatibility**: API responses match frontend expectations
4. **Error Handling**: Consistent error response format

## 📝 API Usage Examples

### Python Client Example
```python
import requests
import websocket
import json

# Analyze sentiment
response = requests.post('http://localhost:8000/api/v1/analyze', 
    json={'keyword': 'python programming', 'limit': 50})
data = response.json()

# WebSocket connection
def on_message(ws, message):
    data = json.loads(message)
    print(f"Received: {data}")

ws = websocket.WebSocketApp("ws://localhost:8000/ws",
                          on_message=on_message)
ws.run_forever()
```

### JavaScript/Frontend Example
```javascript
// Analyze sentiment
fetch('http://localhost:8000/api/v1/analyze', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    keyword: 'machine learning',
    limit: 100
  })
})
.then(response => response.json())
.then(data => console.log(data));

// WebSocket connection
const ws = new WebSocket('ws://localhost:8000/ws/machine-learning');
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Real-time update:', data);
};
```

## 🛠️ Development

### Running in Development Mode
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Database Migrations
```bash
# Auto-generate migration
alembic revision --autogenerate -m "Description"

# Apply migrations
alembic upgrade head
```

## 🚨 Troubleshooting

### Common Issues

1. **Twitter API Rate Limits**
   - Solution: Implement proper rate limiting and caching
   - Use wait_on_rate_limit=True in Tweepy client

2. **Redis Connection Issues**
   - Check if Redis server is running
   - Verify Redis URL in environment variables

3. **Memory Issues with Large Datasets**
   - Implement batch processing
   - Increase server memory or use pagination

4. **Transformer Model Loading**
   - First run may take time to download model
   - Requires sufficient disk space and memory

## 📈 Scaling Considerations

- **Horizontal Scaling**: Use multiple worker processes
- **Database**: Switch to PostgreSQL for production
- **Caching**: Use Redis Cluster for high availability
- **Load Balancing**: Use nginx or similar for load balancing
- **Background Tasks**: Implement Celery for heavy processing

## 🔐 Security

- API key management through environment variables
- Rate limiting to prevent abuse
- Input validation and sanitization
- CORS configuration for secure frontend integration

## 📄 License

This project is part of an ML/Data Science educational project.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📞 Support

For support and questions, please refer to the project documentation or create an issue in the repository.

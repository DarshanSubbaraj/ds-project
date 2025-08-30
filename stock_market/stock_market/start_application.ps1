# Stock Price Predictor Application Startup Script
# This script starts both the backend and frontend servers

Write-Host "🚀 Starting Stock Price Predictor Application..." -ForegroundColor Green
Write-Host ""

# Check if Node.js is available
try {
    $nodeVersion = & "C:\Program Files\nodejs\node.exe" --version 2>$null
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Check if Python virtual environment exists
$backendPath = "C:\Darshan Subbaraj\PROJECT\stock_market\backend"
$frontendPath = "C:\Darshan Subbaraj\PROJECT\stock_market\frontend"

if (-not (Test-Path "$backendPath\venv\Scripts\python.exe")) {
    Write-Host "❌ Backend virtual environment not found." -ForegroundColor Red
    Write-Host "Please run setup from the backend directory first." -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Backend virtual environment found" -ForegroundColor Green

# Start Backend Server
Write-Host "🔧 Starting Backend Server (Port 8001)..." -ForegroundColor Yellow
$backendJob = Start-Process powershell -ArgumentList "-Command", "cd '$backendPath'; & .\venv\Scripts\python.exe -m uvicorn simple_main:app --host 127.0.0.1 --port 8001; Read-Host 'Backend stopped. Press Enter to close'" -PassThru

# Wait for backend to start
Start-Sleep -Seconds 3

# Test backend
try {
    $healthCheck = Invoke-RestMethod -Uri "http://127.0.0.1:8001/health" -TimeoutSec 5
    Write-Host "✅ Backend server is running successfully!" -ForegroundColor Green
    Write-Host "   Health status: $($healthCheck.status)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Backend server failed to start" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Gray
    exit 1
}

# Start Frontend Server  
Write-Host "🎨 Starting Frontend Server (Port 5173)..." -ForegroundColor Yellow
$frontendJob = Start-Process powershell -ArgumentList "-Command", "cd '$frontendPath'; & 'C:\Program Files\nodejs\npm.cmd' run dev; Read-Host 'Frontend stopped. Press Enter to close'" -PassThru

# Wait for frontend to start
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "🎉 Application Started Successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Access your application:" -ForegroundColor Cyan
Write-Host "   Frontend Dashboard: http://localhost:5173" -ForegroundColor White
Write-Host "   Backend API: http://127.0.0.1:8001" -ForegroundColor White
Write-Host "   API Documentation: http://127.0.0.1:8001/docs" -ForegroundColor White
Write-Host ""
Write-Host "💡 Features available:" -ForegroundColor Cyan
Write-Host "   • Real-time stock analysis with ML predictions" -ForegroundColor White
Write-Host "   • Random Forest vs Linear Regression comparison" -ForegroundColor White  
Write-Host "   • Interactive charts and technical indicators" -ForegroundColor White
Write-Host "   • Model performance metrics" -ForegroundColor White
Write-Host ""
Write-Host "🔍 Try these stocks: AAPL, TSLA, GOOGL, MSFT, AMZN, NVDA" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Enter to stop both servers and exit..."
Read-Host

# Stop servers
Write-Host "🛑 Stopping servers..." -ForegroundColor Yellow
if ($backendJob -and !$backendJob.HasExited) {
    Stop-Process -Id $backendJob.Id -Force -ErrorAction SilentlyContinue
}
if ($frontendJob -and !$frontendJob.HasExited) {
    Stop-Process -Id $frontendJob.Id -Force -ErrorAction SilentlyContinue
}

Write-Host "✅ Application stopped successfully!" -ForegroundColor Green

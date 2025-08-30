# Stock Prediction API Backend Setup Script
# Run this script to set up the development environment

Write-Host "Setting up Stock Prediction API Backend..." -ForegroundColor Green

# Check if Python is installed
try {
    $pythonVersion = python --version 2>&1
    Write-Host "Found: $pythonVersion" -ForegroundColor Yellow
} catch {
    Write-Host "Error: Python is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Python 3.8+ from https://python.org" -ForegroundColor Red
    exit 1
}

# Create virtual environment
Write-Host "Creating virtual environment..." -ForegroundColor Yellow
python -m venv venv

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& .\venv\Scripts\Activate.ps1

# Upgrade pip
Write-Host "Upgrading pip..." -ForegroundColor Yellow
python -m pip install --upgrade pip

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt

# Copy environment file if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host "Creating .env file from template..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
}

Write-Host ""
Write-Host "Setup complete! 🎉" -ForegroundColor Green
Write-Host ""
Write-Host "To start the server:" -ForegroundColor Cyan
Write-Host "1. Activate virtual environment: .\venv\Scripts\Activate.ps1" -ForegroundColor White
Write-Host "2. Run the server: python run.py" -ForegroundColor White
Write-Host ""
Write-Host "API will be available at:" -ForegroundColor Cyan
Write-Host "- Base URL: http://localhost:8000" -ForegroundColor White
Write-Host "- Docs: http://localhost:8000/docs" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to start the server now..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Start the server
Write-Host "Starting server..." -ForegroundColor Green
python run.py

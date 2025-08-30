from pydantic import BaseModel
from typing import List
from datetime import date

class HistoricalDataPoint(BaseModel):
    date: str
    open: float
    high: float
    low: float
    close: float
    volume: int
    ma5: float
    ma10: float
    ma20: float

class PredictionPoint(BaseModel):
    date: str
    predicted: float
    actual: float

class ModelPredictions(BaseModel):
    randomForest: List[PredictionPoint]
    linearRegression: List[PredictionPoint]

class ModelMetric(BaseModel):
    accuracy: float
    rmse: float
    directionalAccuracy: float

class ModelMetrics(BaseModel):
    randomForest: ModelMetric
    linearRegression: ModelMetric

class StockDataResponse(BaseModel):
    symbol: str
    dateRange: str
    currentPrice: float
    change: float
    changePercent: float
    historical: List[HistoricalDataPoint]
    predictions: ModelPredictions
    modelMetrics: ModelMetrics

    class Config:
        json_encoders = {
            date: lambda v: v.isoformat()
        }

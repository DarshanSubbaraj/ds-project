import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error
from sklearn.preprocessing import StandardScaler
from datetime import datetime, timedelta
from typing import Dict, List, Tuple, Any
import logging

logger = logging.getLogger(__name__)

class MLService:
    def __init__(self):
        self.scaler = StandardScaler()
        self.rf_model = RandomForestRegressor(
            n_estimators=100,
            max_depth=10,
            random_state=42,
            n_jobs=-1
        )
        self.lr_model = LinearRegression()
    
    def prepare_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Create features for machine learning models
        """
        try:
            # Make a copy to avoid modifying original data
            features_df = df.copy()
            
            # Price-based features
            features_df['price_change'] = features_df['Close'].pct_change()
            features_df['high_low_ratio'] = features_df['High'] / features_df['Low']
            features_df['volume_change'] = features_df['Volume'].pct_change()
            
            # Moving average ratios
            features_df['price_ma5_ratio'] = features_df['Close'] / features_df['ma5']
            features_df['price_ma10_ratio'] = features_df['Close'] / features_df['ma10']
            features_df['price_ma20_ratio'] = features_df['Close'] / features_df['ma20']
            
            # Volatility (rolling standard deviation)
            features_df['volatility_5'] = features_df['Close'].rolling(window=5).std()
            features_df['volatility_10'] = features_df['Close'].rolling(window=10).std()
            
            # Lag features (previous day values)
            features_df['prev_close'] = features_df['Close'].shift(1)
            features_df['prev_volume'] = features_df['Volume'].shift(1)
            features_df['prev_change'] = features_df['price_change'].shift(1)
            
            # Target variable (next day's close price)
            features_df['target'] = features_df['Close'].shift(-1)
            
            # Drop rows with NaN values
            features_df = features_df.dropna()
            
            logger.info(f"Created features dataset with {len(features_df)} samples")
            return features_df
            
        except Exception as e:
            logger.error(f"Error preparing features: {e}")
            raise
    
    def train_and_predict(self, historical_data: pd.DataFrame) -> Tuple[Dict[str, List[Dict[str, Any]]], Dict[str, Dict[str, float]]]:
        """
        Train both models and generate predictions
        """
        try:
            # Prepare features
            features_df = self.prepare_features(historical_data)
            
            if len(features_df) < 30:
                raise ValueError("Insufficient data for model training. Need at least 30 samples.")
            
            # Define feature columns
            feature_columns = [
                'Open', 'High', 'Low', 'Volume', 'ma5', 'ma10', 'ma20',
                'price_change', 'high_low_ratio', 'volume_change',
                'price_ma5_ratio', 'price_ma10_ratio', 'price_ma20_ratio',
                'volatility_5', 'volatility_10', 'prev_close', 'prev_volume', 'prev_change'
            ]
            
            # Prepare training data
            X = features_df[feature_columns].values
            y = features_df['target'].values
            
            # Use last 20% for testing, rest for training
            split_index = int(len(X) * 0.8)
            X_train, X_test = X[:split_index], X[split_index:]
            y_train, y_test = y[:split_index], y[split_index:]
            
            # Scale features
            X_train_scaled = self.scaler.fit_transform(X_train)
            X_test_scaled = self.scaler.transform(X_test)
            
            # Train models
            logger.info("Training Random Forest model...")
            self.rf_model.fit(X_train_scaled, y_train)
            
            logger.info("Training Linear Regression model...")
            self.lr_model.fit(X_train_scaled, y_train)
            
            # Make predictions
            rf_predictions = self.rf_model.predict(X_test_scaled)
            lr_predictions = self.lr_model.predict(X_test_scaled)
            
            # Get test dates
            test_dates = features_df.iloc[split_index:]['Date'].dt.strftime('%Y-%m-%d').tolist()
            
            # Format predictions
            predictions = {
                'random_forest': [
                    {
                        'date': date,
                        'predicted': float(pred),
                        'actual': float(actual)
                    }
                    for date, pred, actual in zip(test_dates, rf_predictions, y_test)
                ],
                'linear_regression': [
                    {
                        'date': date,
                        'predicted': float(pred),
                        'actual': float(actual)
                    }
                    for date, pred, actual in zip(test_dates, lr_predictions, y_test)
                ]
            }
            
            # Calculate metrics
            metrics = {
                'random_forest': self._calculate_metrics(rf_predictions, y_test),
                'linear_regression': self._calculate_metrics(lr_predictions, y_test)
            }
            
            logger.info("Successfully completed model training and prediction")
            return predictions, metrics
            
        except Exception as e:
            logger.error(f"Error in ML processing: {e}")
            raise
    
    def _calculate_metrics(self, predictions: np.ndarray, actual: np.ndarray) -> Dict[str, float]:
        """
        Calculate model performance metrics
        """
        try:
            # RMSE
            rmse = np.sqrt(mean_squared_error(actual, predictions))
            
            # Accuracy as percentage (100 - normalized RMSE)
            mean_actual = np.mean(actual)
            normalized_rmse = rmse / mean_actual if mean_actual != 0 else 1
            accuracy = max(0, 100 - (normalized_rmse * 100))
            
            # Directional accuracy
            if len(predictions) > 1:
                actual_direction = np.diff(actual) > 0
                predicted_direction = np.diff(predictions) > 0
                directional_accuracy = np.mean(actual_direction == predicted_direction) * 100
            else:
                directional_accuracy = 50.0  # Default for single prediction
            
            return {
                'accuracy': float(accuracy),
                'rmse': float(rmse),
                'directionalAccuracy': float(directional_accuracy)
            }
            
        except Exception as e:
            logger.error(f"Error calculating metrics: {e}")
            return {
                'accuracy': 0.0,
                'rmse': float('inf'),
                'directionalAccuracy': 50.0
            }

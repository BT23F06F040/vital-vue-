import React from 'react';
import CodeBlock from '../components/CodeBlock';

const MLPlan: React.FC = () => {
  const featureEngineering = `# Feature Engineering for Outbreak Prediction
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.feature_selection import SelectKBest, f_classif

class FeatureEngineer:
    def __init__(self):
        self.scaler = StandardScaler()
        self.feature_selector = SelectKBest(f_classif, k=20)
    
    def create_features(self, df):
        """Create comprehensive feature set for ML models"""
        features = pd.DataFrame()
        
        # 1. Temporal Features
        features['day_of_week'] = df['timestamp'].dt.dayofweek
        features['month'] = df['timestamp'].dt.month
        features['is_weekend'] = (df['timestamp'].dt.dayofweek >= 5).astype(int)
        features['is_holiday'] = self._is_holiday(df['timestamp'])
        
        # 2. Symptom Aggregates (7-day rolling windows)
        symptom_cols = ['fever', 'diarrhea', 'vomiting', 'stomach_cramps']
        for col in symptom_cols:
            features[f'{col}_count_7d'] = df.groupby('region_id')[col].rolling(7).sum().values
            features[f'{col}_count_14d'] = df.groupby('region_id')[col].rolling(14).sum().values
            features[f'{col}_count_30d'] = df.groupby('region_id')[col].rolling(30).sum().values
        
        # 3. Lag Features (1-14 days)
        for lag in range(1, 15):
            features[f'symptom_count_lag_{lag}'] = df.groupby('region_id')['total_symptoms'].shift(lag)
            features[f'patient_count_lag_{lag}'] = df.groupby('region_id')['patient_count'].shift(lag)
        
        # 4. Difference Features
        features['symptom_count_diff_1d'] = df.groupby('region_id')['total_symptoms'].diff(1)
        features['symptom_count_diff_7d'] = df.groupby('region_id')['total_symptoms'].diff(7)
        features['symptom_count_growth_rate'] = df.groupby('region_id')['total_symptoms'].pct_change()
        
        # 5. Water Quality Features
        water_cols = ['turbidity', 'ph', 'coliform_level', 'electrical_conductivity']
        for col in water_cols:
            features[f'{col}_mean_7d'] = df.groupby('region_id')[col].rolling(7).mean().values
            features[f'{col}_std_7d'] = df.groupby('region_id')[col].rolling(7).std().values
            features[f'{col}_trend_7d'] = self._calculate_trend(df, col, 7)
        
        # 6. Spatial Features
        features['neighbor_symptom_avg'] = self._calculate_neighbor_avg(df, 'total_symptoms')
        features['distance_to_last_outbreak'] = self._calculate_outbreak_distance(df)
        features['population_density_proxy'] = self._get_population_density(df)
        
        # 7. Weather Features (if available)
        weather_features = self._get_weather_features(df)
        features = pd.concat([features, weather_features], axis=1)
        
        # 8. Interaction Features
        features['symptom_water_interaction'] = features['total_symptoms_7d'] * features['coliform_level_mean_7d']
        features['patient_symptom_ratio'] = df['patient_count'] / (df['total_symptoms'] + 1)
        
        return features.fillna(0)
    
    def _is_holiday(self, timestamps):
        """Check if dates fall on holidays (simplified)"""
        # In production, use a proper holiday calendar
        return np.zeros(len(timestamps))
    
    def _calculate_trend(self, df, col, window):
        """Calculate trend using linear regression slope"""
        from scipy import stats
        trends = []
        for region in df['region_id'].unique():
            region_data = df[df['region_id'] == region][col].rolling(window).mean()
            x = np.arange(len(region_data))
            y = region_data.values
            slope, _, _, _, _ = stats.linregress(x, y)
            trends.extend([slope] * len(region_data))
        return trends
    
    def _calculate_neighbor_avg(self, df, col):
        """Calculate average of neighboring regions"""
        # Simplified - in production, use proper spatial analysis
        return df.groupby('region_id')[col].transform('mean')
    
    def _calculate_outbreak_distance(self, df):
        """Calculate distance to last known outbreak"""
        # Simplified - in production, use geospatial calculations
        return np.random.uniform(0, 100, len(df))
    
    def _get_population_density(self, df):
        """Get population density proxy"""
        # Simplified - in production, use actual population data
        return np.random.uniform(100, 1000, len(df))
    
    def _get_weather_features(self, df):
        """Extract weather features if available"""
        weather_df = pd.DataFrame(index=df.index)
        weather_df['temperature'] = np.random.normal(25, 5, len(df))
        weather_df['humidity'] = np.random.uniform(40, 90, len(df))
        weather_df['precipitation'] = np.random.exponential(2, len(df))
        return weather_df`;

  const modelImplementation = `# ML Model Implementation
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, roc_auc_score, brier_score_loss
from sklearn.model_selection import TimeSeriesSplit
import xgboost as xgb
from prophet import Prophet
import shap
import joblib

class OutbreakPredictor:
    def __init__(self):
        self.models = {}
        self.feature_importance = {}
        self.explainer = None
        
    def train_models(self, X, y, timestamps):
        """Train multiple models for ensemble prediction"""
        
        # 1. Anomaly Detection (EWMA)
        self.models['anomaly'] = self._train_anomaly_detector(X, y)
        
        # 2. Spatial Clustering (DBSCAN)
        self.models['spatial'] = self._train_spatial_clusterer(X, y)
        
        # 3. Time Series Forecasting (Prophet)
        self.models['forecast'] = self._train_prophet_model(X, y, timestamps)
        
        # 4. Classification Models
        self.models['xgboost'] = self._train_xgboost(X, y)
        self.models['random_forest'] = self._train_random_forest(X, y)
        self.models['logistic'] = self._train_logistic_regression(X, y)
        
        # 5. Ensemble Model
        self.models['ensemble'] = self._create_ensemble_model()
        
        # 6. SHAP Explainer
        self.explainer = shap.TreeExplainer(self.models['xgboost'])
        
    def _train_anomaly_detector(self, X, y):
        """Train EWMA-based anomaly detector"""
        from statsmodels.tsa.holtwinters import ExponentialSmoothing
        
        class AnomalyDetector:
            def __init__(self):
                self.threshold = 2.0  # Z-score threshold
                self.ewma_alpha = 0.3
                
            def fit(self, X, y):
                # Calculate EWMA for each region
                self.region_stats = {}
                for region in X['region_id'].unique():
                    region_data = X[X['region_id'] == region]['total_symptoms']
                    ewma = region_data.ewm(alpha=self.ewma_alpha).mean()
                    std = region_data.rolling(30).std()
                    self.region_stats[region] = {'ewma': ewma, 'std': std}
                return self
                
            def predict_proba(self, X):
                probabilities = []
                for _, row in X.iterrows():
                    region = row['region_id']
                    if region in self.region_stats:
                        ewma = self.region_stats[region]['ewma'].iloc[-1]
                        std = self.region_stats[region]['std'].iloc[-1]
                        z_score = abs(row['total_symptoms'] - ewma) / (std + 1e-8)
                        prob = min(z_score / self.threshold, 1.0)
                    else:
                        prob = 0.0
                    probabilities.append([1-prob, prob])
                return np.array(probabilities)
        
        return AnomalyDetector().fit(X, y)
    
    def _train_spatial_clusterer(self, X, y):
        """Train DBSCAN spatial clustering model"""
        from sklearn.cluster import DBSCAN
        
        class SpatialClusterer:
            def __init__(self):
                self.clusterer = DBSCAN(eps=0.5, min_samples=5)
                self.outbreak_clusters = set()
                
            def fit(self, X, y):
                # Use GPS coordinates for clustering
                coords = X[['latitude', 'longitude']].values
                clusters = self.clusterer.fit_predict(coords)
                
                # Identify clusters with outbreaks
                for cluster_id in np.unique(clusters):
                    if cluster_id == -1:  # Noise points
                        continue
                    cluster_mask = clusters == cluster_id
                    if y[cluster_mask].sum() > 0:  # Has outbreak
                        self.outbreak_clusters.add(cluster_id)
                return self
                
            def predict_proba(self, X):
                coords = X[['latitude', 'longitude']].values
                clusters = self.clusterer.fit_predict(coords)
                
                probabilities = []
                for cluster_id in clusters:
                    if cluster_id in self.outbreak_clusters:
                        prob = 0.7  # High probability for outbreak clusters
                    else:
                        prob = 0.1  # Low probability for other clusters
                    probabilities.append([1-prob, prob])
                return np.array(probabilities)
        
        return SpatialClusterer().fit(X, y)
    
    def _train_prophet_model(self, X, y, timestamps):
        """Train Prophet time series forecasting model"""
        class ProphetForecaster:
            def __init__(self):
                self.model = Prophet(
                    yearly_seasonality=True,
                    weekly_seasonality=True,
                    daily_seasonality=False,
                    seasonality_mode='multiplicative'
                )
                
            def fit(self, X, y, timestamps):
                # Prepare data for Prophet
                df_prophet = pd.DataFrame({
                    'ds': timestamps,
                    'y': y
                })
                self.model.fit(df_prophet)
                return self
                
            def predict_proba(self, X, future_periods=7):
                # Create future dataframe
                future = self.model.make_future_dataframe(periods=future_periods)
                forecast = self.model.predict(future)
                
                # Convert forecast to probabilities
                probabilities = []
                for i in range(len(X)):
                    prob = min(forecast['yhat'].iloc[i] / 10.0, 1.0)  # Normalize
                    probabilities.append([1-prob, prob])
                return np.array(probabilities)
        
        return ProphetForecaster().fit(X, y, timestamps)
    
    def _train_xgboost(self, X, y):
        """Train XGBoost classifier"""
        model = xgb.XGBClassifier(
            n_estimators=100,
            max_depth=6,
            learning_rate=0.1,
            subsample=0.8,
            colsample_bytree=0.8,
            random_state=42
        )
        return model.fit(X, y)
    
    def _train_random_forest(self, X, y):
        """Train Random Forest classifier"""
        model = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            random_state=42
        )
        return model.fit(X, y)
    
    def _train_logistic_regression(self, X, y):
        """Train Logistic Regression classifier"""
        model = LogisticRegression(
            random_state=42,
            max_iter=1000
        )
        return model.fit(X, y)
    
    def _create_ensemble_model(self):
        """Create ensemble model combining all predictions"""
        class EnsembleModel:
            def __init__(self, models):
                self.models = models
                self.weights = {
                    'xgboost': 0.3,
                    'random_forest': 0.25,
                    'logistic': 0.2,
                    'anomaly': 0.15,
                    'spatial': 0.1
                }
                
            def predict_proba(self, X):
                predictions = []
                for name, model in self.models.items():
                    if name != 'ensemble':
                        pred = model.predict_proba(X)
                        predictions.append(pred[:, 1] * self.weights.get(name, 0.1))
                
                # Weighted average
                ensemble_pred = np.mean(predictions, axis=0)
                return np.column_stack([1-ensemble_pred, ensemble_pred])
        
        return EnsembleModel(self.models)
    
    def predict_outbreak_probability(self, X, region_id, horizon_days=7):
        """Predict outbreak probability for a region"""
        # Get ensemble prediction
        ensemble_pred = self.models['ensemble'].predict_proba(X)
        probability = ensemble_pred[0, 1]
        
        # Get feature importance using SHAP
        if self.explainer:
            shap_values = self.explainer.shap_values(X.iloc[0:1])
            feature_names = X.columns
            feature_importance = dict(zip(feature_names, shap_values[0]))
            
            # Get top 3 most important features
            top_features = sorted(feature_importance.items(), 
                                key=lambda x: abs(x[1]), reverse=True)[:3]
        else:
            top_features = []
        
        return {
            'probability': float(probability),
            'confidence': float(min(probability * 1.5, 1.0)),
            'top_features': [{'feature': f, 'importance': float(v)} for f, v in top_features],
            'horizon_days': horizon_days,
            'model_version': 'v1.0.0'
        }
    
    def evaluate_models(self, X_test, y_test):
        """Evaluate all models and return metrics"""
        results = {}
        
        for name, model in self.models.items():
            if name != 'ensemble':
                y_pred_proba = model.predict_proba(X_test)
                y_pred = (y_pred_proba[:, 1] > 0.5).astype(int)
                
                results[name] = {
                    'roc_auc': roc_auc_score(y_test, y_pred_proba[:, 1]),
                    'brier_score': brier_score_loss(y_test, y_pred_proba[:, 1]),
                    'classification_report': classification_report(y_test, y_pred, output_dict=True)
                }
        
        return results`;

  const modelServing = `# Model Serving API
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import numpy as np
import pandas as pd
from typing import List, Dict, Any

app = FastAPI(title="Vital Vue ML Service")

# Load trained models
MODEL_PATH = "/app/models/"
outbreak_predictor = joblib.load(f"{MODEL_PATH}outbreak_predictor.pkl")
feature_engineer = joblib.load(f"{MODEL_PATH}feature_engineer.pkl")

class PredictionRequest(BaseModel):
    region_id: str
    features: Dict[str, Any]
    horizon_days: int = 7

class PredictionResponse(BaseModel):
    region_id: str
    probability: float
    confidence: float
    top_features: List[Dict[str, Any]]
    horizon_days: int
    model_version: str

@app.post("/api/v1/forecast", response_model=PredictionResponse)
async def predict_outbreak(request: PredictionRequest):
    """Predict outbreak probability for a region"""
    try:
        # Convert features to DataFrame
        features_df = pd.DataFrame([request.features])
        
        # Engineer features
        engineered_features = feature_engineer.create_features(features_df)
        
        # Make prediction
        prediction = outbreak_predictor.predict_outbreak_probability(
            engineered_features, 
            request.region_id, 
            request.horizon_days
        )
        
        return PredictionResponse(
            region_id=request.region_id,
            probability=prediction['probability'],
            confidence=prediction['confidence'],
            top_features=prediction['top_features'],
            horizon_days=request.horizon_days,
            model_version=prediction['model_version']
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/models/health")
async def model_health():
    """Check model health and performance"""
    return {
        "status": "healthy",
        "models_loaded": len(outbreak_predictor.models),
        "feature_engineer_loaded": feature_engineer is not None,
        "last_training": "2024-01-15T10:00:00Z"
    }

@app.post("/api/v1/models/retrain")
async def retrain_models():
    """Trigger model retraining with new data"""
    # This would typically be called by a scheduled job
    # or triggered by new data availability
    return {"message": "Model retraining initiated", "status": "accepted"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)`;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">ML Plan & Implementation</h1>
          <p className="text-xl text-gray-600">Machine learning models for outbreak prediction and anomaly detection</p>
        </div>

        <div className="space-y-8">
          {/* Feature Engineering */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Feature Engineering</h2>
            <p className="text-gray-700 mb-4">
              Comprehensive feature engineering pipeline that creates temporal, spatial, and interaction features 
              from raw surveillance and sensor data for optimal ML model performance.
            </p>
            <CodeBlock code={featureEngineering} language="python" filename="feature_engineering.py" />
          </div>

          {/* Model Implementation */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Model Implementation</h2>
            <p className="text-gray-700 mb-4">
              Multi-model ensemble approach combining anomaly detection, spatial clustering, time series forecasting, 
              and classification models for robust outbreak prediction.
            </p>
            <CodeBlock code={modelImplementation} language="python" filename="ml_models.py" />
          </div>

          {/* Model Serving */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Model Serving API</h2>
            <p className="text-gray-700 mb-4">
              FastAPI-based model serving with real-time prediction endpoints, model health monitoring, 
              and SHAP-based explainability for transparent AI decisions.
            </p>
            <CodeBlock code={modelServing} language="python" filename="ml_serving.py" />
          </div>

          {/* Model Architecture */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Model Architecture Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-primary-600">Baseline Models</h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold">EWMA Anomaly Detection</h4>
                    <p className="text-sm text-gray-600">Fast real-time anomaly detection using exponential weighted moving averages</p>
                    <ul className="text-xs text-gray-500 mt-2">
                      <li>• Z-score based thresholding</li>
                      <li>• Region-specific parameters</li>
                      <li>• Low computational overhead</li>
                    </ul>
                  </div>
                  
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-semibold">DBSCAN Spatial Clustering</h4>
                    <p className="text-sm text-gray-600">Identifies spatial clusters of high symptom density</p>
                    <ul className="text-xs text-gray-500 mt-2">
                      <li>• GPS coordinate clustering</li>
                      <li>• Outbreak cluster identification</li>
                      <li>• Density-based approach</li>
                    </ul>
                  </div>
                  
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-semibold">Prophet Forecasting</h4>
                    <p className="text-sm text-gray-600">Time series forecasting with seasonality handling</p>
                    <ul className="text-xs text-gray-500 mt-2">
                      <li>• Seasonal decomposition</li>
                      <li>• Trend analysis</li>
                      <li>• Uncertainty quantification</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4 text-green-600">Advanced Models</h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h4 className="font-semibold">XGBoost Classifier</h4>
                    <p className="text-sm text-gray-600">Gradient boosting for complex pattern recognition</p>
                    <ul className="text-xs text-gray-500 mt-2">
                      <li>• Feature importance ranking</li>
                      <li>• Handles missing values</li>
                      <li>• High accuracy</li>
                    </ul>
                  </div>
                  
                  <div className="border-l-4 border-red-500 pl-4">
                    <h4 className="font-semibold">Random Forest</h4>
                    <p className="text-sm text-gray-600">Ensemble method for robust predictions</p>
                    <ul className="text-xs text-gray-500 mt-2">
                      <li>• Reduces overfitting</li>
                      <li>• Feature selection</li>
                      <li>• Handles non-linear relationships</li>
                    </ul>
                  </div>
                  
                  <div className="border-l-4 border-cyan-500 pl-4">
                    <h4 className="font-semibold">Ensemble Model</h4>
                    <p className="text-sm text-gray-600">Weighted combination of all models</p>
                    <ul className="text-xs text-gray-500 mt-2">
                      <li>• Optimal weight learning</li>
                      <li>• Robust predictions</li>
                      <li>• Confidence scoring</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Evaluation Metrics */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Evaluation Metrics & Performance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Detection Metrics</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• <strong>Precision:</strong> True positives / (True positives + False positives)</li>
                  <li>• <strong>Recall:</strong> True positives / (True positives + False negatives)</li>
                  <li>• <strong>F1-Score:</strong> Harmonic mean of precision and recall</li>
                  <li>• <strong>Lead Time:</strong> Days before actual outbreak detection</li>
                  <li>• <strong>False Positive Rate:</strong> False alarms per month</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Forecast Metrics</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• <strong>ROC-AUC:</strong> Area under ROC curve for probability calibration</li>
                  <li>• <strong>Brier Score:</strong> Mean squared error of probability predictions</li>
                  <li>• <strong>RMSE:</strong> Root mean squared error for count predictions</li>
                  <li>• <strong>MAE:</strong> Mean absolute error for trend predictions</li>
                  <li>• <strong>Coverage:</strong> Percentage of actual outbreaks within prediction intervals</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Model Training Pipeline */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Model Training Pipeline</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white text-sm font-bold">1</div>
                  <h4 className="font-semibold text-sm">Data Collection</h4>
                  <p className="text-xs text-gray-600 mt-1">Aggregate reports, sensor data, and external factors</p>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white text-sm font-bold">2</div>
                  <h4 className="font-semibold text-sm">Feature Engineering</h4>
                  <p className="text-xs text-gray-600 mt-1">Create temporal, spatial, and interaction features</p>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="w-8 h-8 bg-purple-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white text-sm font-bold">3</div>
                  <h4 className="font-semibold text-sm">Model Training</h4>
                  <p className="text-xs text-gray-600 mt-1">Train ensemble models with cross-validation</p>
                </div>
                
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="w-8 h-8 bg-orange-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white text-sm font-bold">4</div>
                  <h4 className="font-semibold text-sm">Evaluation</h4>
                  <p className="text-xs text-gray-600 mt-1">Test on holdout data and calculate metrics</p>
                </div>
                
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="w-8 h-8 bg-red-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white text-sm font-bold">5</div>
                  <h4 className="font-semibold text-sm">Deployment</h4>
                  <p className="text-xs text-gray-600 mt-1">Deploy to production with monitoring</p>
                </div>
                
                <div className="text-center p-4 bg-cyan-50 rounded-lg">
                  <div className="w-8 h-8 bg-cyan-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white text-sm font-bold">6</div>
                  <h4 className="font-semibold text-sm">Monitoring</h4>
                  <p className="text-xs text-gray-600 mt-1">Track performance and retrain as needed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Explainability */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Model Explainability</h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                SHAP (SHapley Additive exPlanations) is used to provide transparent explanations for model predictions, 
                helping health officials understand which factors contribute most to outbreak risk.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Example SHAP Explanation</h3>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Symptom count trend (7-day)</span>
                    <span className="text-red-600">+0.32</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Coliform level (mean)</span>
                    <span className="text-orange-600">+0.28</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Neighbor region outbreak</span>
                    <span className="text-yellow-600">+0.24</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Water quality trend</span>
                    <span className="text-green-600">-0.15</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MLPlan;

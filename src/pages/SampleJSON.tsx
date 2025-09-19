import React from 'react';
import CodeBlock from '../components/CodeBlock';
import DownloadButton from '../components/DownloadButton';

const SampleJSON: React.FC = () => {
  const reportJSON = `{
  "reporter_id": "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456",
  "region_id": "region_001",
  "gps_latitude": 12.9716,
  "gps_longitude": 77.5946,
  "language": "en",
  "symptoms": [
    "fever",
    "diarrhea",
    "vomiting",
    "stomach_cramps"
  ],
  "patient_count": 3,
  "photos": [
    "https://minio.vitalvue.org/reports/photo_001.jpg",
    "https://minio.vitalvue.org/reports/photo_002.jpg"
  ],
  "water_observed_flag": true,
  "voice_note_url": "https://minio.vitalvue.org/audio/voice_001.mp3",
  "water_test_result": {
    "turbidity": 4.2,
    "ph": 6.8,
    "electrical_conductivity": 1250.5,
    "coliform_level": 150.0,
    "tested_at": "2024-01-15T10:30:00Z"
  },
  "additional_notes": "Patients reported drinking water from village well. Water appears cloudy.",
  "timestamp": "2024-01-15T10:45:00Z",
  "device_info": {
    "device_id": "device_12345",
    "app_version": "1.0.0",
    "os_version": "Android 13",
    "battery_level": 85
  }
}`;

  const sensorJSON = `{
  "sensor_id": "sensor_001",
  "timestamp": "2024-01-15T10:30:00Z",
  "latitude": 12.9716,
  "longitude": 77.5946,
  "parameters": {
    "turbidity": 4.2,
    "ph": 6.8,
    "electrical_conductivity": 1250.5,
    "coliform_level": 150.0,
    "battery_level": 78.5,
    "temperature": 28.3,
    "dissolved_oxygen": 6.2,
    "total_dissolved_solids": 850.0
  },
  "device_info": {
    "firmware_version": "2.1.3",
    "calibration_date": "2024-01-01T00:00:00Z",
    "last_maintenance": "2024-01-10T00:00:00Z"
  },
  "quality_flags": {
    "turbidity_ok": false,
    "ph_ok": true,
    "ec_ok": true,
    "coliform_ok": false,
    "battery_low": false
  },
  "raw_data": {
    "adc_readings": {
      "turbidity_adc": 1024,
      "ph_adc": 512,
      "ec_adc": 768
    },
    "sensor_status": "active",
    "error_codes": []
  }
}`;

  const alertJSON = `{
  "id": "alert_001",
  "title": "High Coliform Level Detected",
  "description": "Water quality sensor detected coliform level of 150 CFU/100ml, exceeding safe threshold of 100 CFU/100ml",
  "priority": "high",
  "region_id": "region_001",
  "alert_type": "threshold",
  "rule_id": "rule_coliform_001",
  "status": "active",
  "metadata": {
    "sensor_id": "sensor_001",
    "threshold_value": 100.0,
    "actual_value": 150.0,
    "location": {
      "latitude": 12.9716,
      "longitude": 77.5946,
      "name": "Village Well #1"
    },
    "recommended_actions": [
      "Test water source immediately",
      "Notify health officials",
      "Consider temporary water restrictions"
    ]
  },
  "created_at": "2024-01-15T10:35:00Z"
}`;

  const forecastJSON = `{
  "region_id": "region_001",
  "horizon_days": 7,
  "probability": 0.73,
  "confidence": 0.85,
  "top_features": [
    {
      "feature": "symptom_count_7d_avg",
      "importance": 0.32,
      "value": 2.4,
      "description": "Average daily symptom reports over 7 days"
    },
    {
      "feature": "coliform_level_trend",
      "importance": 0.28,
      "value": 1.8,
      "description": "Rising trend in coliform levels"
    },
    {
      "feature": "neighbor_region_outbreak",
      "importance": 0.24,
      "value": 1.0,
      "description": "Recent outbreak in neighboring region"
    }
  ],
  "risk_factors": [
    "High coliform levels in water sources",
    "Increasing symptom reports",
    "Recent outbreak in nearby region",
    "Seasonal risk period (monsoon)"
  ],
  "recommendations": [
    "Increase water quality monitoring frequency",
    "Prepare emergency response protocols",
    "Alert community health workers",
    "Consider preventive measures"
  ],
  "generated_at": "2024-01-15T11:00:00Z",
  "model_version": "v1.2.0"
}`;

  const chatbotJSON = `{
  "message": "What are the symptoms of waterborne diseases?",
  "language": "en",
  "user_id": "user_12345",
  "session_id": "session_67890",
  "response": {
    "text": "Common symptoms of waterborne diseases include diarrhea, vomiting, stomach cramps, fever, and nausea. If you experience these symptoms, especially after drinking water from an unknown source, please report to your local health worker immediately.",
    "confidence": 0.92,
    "intent": "symptom_query",
    "entities": [
      {
        "entity": "disease_type",
        "value": "waterborne",
        "confidence": 0.95
      }
    ],
    "suggestions": [
      "How to prevent waterborne diseases?",
      "What should I do if I have these symptoms?",
      "Where can I get clean water?"
    ],
    "attachments": [
      {
        "type": "image",
        "url": "https://minio.vitalvue.org/health-cards/waterborne-symptoms.svg",
        "title": "Waterborne Disease Symptoms"
      }
    ]
  },
  "timestamp": "2024-01-15T11:15:00Z"
}`;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Sample JSON Payloads</h1>
          <p className="text-xl text-gray-600">Real-world examples of API request/response data</p>
        </div>

        <div className="space-y-8">
          {/* Health Report JSON */}
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Health Report JSON</h2>
              <DownloadButton
                filename="report-sample.json"
                content={reportJSON}
                mimeType="application/json"
                className="btn-primary"
              />
            </div>
            <p className="text-gray-700 mb-4">
              Example of a health surveillance report submitted by an ASHA worker, including symptoms, 
              patient count, photos, GPS location, and water quality test results.
            </p>
            <CodeBlock code={reportJSON} language="json" filename="report-sample.json" />
          </div>

          {/* Sensor Reading JSON */}
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Sensor Reading JSON</h2>
              <DownloadButton
                filename="sensor-sample.json"
                content={sensorJSON}
                mimeType="application/json"
                className="btn-primary"
              />
            </div>
            <p className="text-gray-700 mb-4">
              Example of IoT sensor data from a water quality monitoring device, including 
              various water quality parameters and device status information.
            </p>
            <CodeBlock code={sensorJSON} language="json" filename="sensor-sample.json" />
          </div>

          {/* Alert JSON */}
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Alert JSON</h2>
              <DownloadButton
                filename="alert-sample.json"
                content={alertJSON}
                mimeType="application/json"
                className="btn-primary"
              />
            </div>
            <p className="text-gray-700 mb-4">
              Example of a system alert triggered by threshold-based rules, including 
              priority, metadata, and recommended actions.
            </p>
            <CodeBlock code={alertJSON} language="json" filename="alert-sample.json" />
          </div>

          {/* Forecast JSON */}
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">ML Forecast JSON</h2>
              <DownloadButton
                filename="forecast-sample.json"
                content={forecastJSON}
                mimeType="application/json"
                className="btn-primary"
              />
            </div>
            <p className="text-gray-700 mb-4">
              Example of ML-powered outbreak prediction with feature importance analysis, 
              risk factors, and actionable recommendations.
            </p>
            <CodeBlock code={forecastJSON} language="json" filename="forecast-sample.json" />
          </div>

          {/* Chatbot JSON */}
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Chatbot Response JSON</h2>
              <DownloadButton
                filename="chatbot-sample.json"
                content={chatbotJSON}
                mimeType="application/json"
                className="btn-primary"
              />
            </div>
            <p className="text-gray-700 mb-4">
              Example of AI chatbot response with intent recognition, entity extraction, 
              confidence scoring, and suggested follow-up questions.
            </p>
            <CodeBlock code={chatbotJSON} language="json" filename="chatbot-sample.json" />
          </div>
        </div>

        <div className="card mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Data Structure Notes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Privacy & Security</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Reporter IDs are SHA-256 hashed</li>
                <li>• GPS coordinates are rounded to 4 decimal places</li>
                <li>• No personally identifiable information stored</li>
                <li>• All timestamps are in UTC</li>
                <li>• Device IDs are anonymized</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Data Validation</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Required fields are enforced</li>
                <li>• Numeric ranges are validated</li>
                <li>• Enum values are checked</li>
                <li>• JSON schema validation</li>
                <li>• File size limits enforced</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SampleJSON;

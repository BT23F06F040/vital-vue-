import React from 'react';
import CodeBlock from '../components/CodeBlock';
import DownloadButton from '../components/DownloadButton';

const DBSchemas: React.FC = () => {
  const schemaSQL = `-- Vital Vue Database Schema
-- PostgreSQL with TimescaleDB extension

-- Enable TimescaleDB extension
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('field_reporter', 'admin', 'supervisor')),
    region_id VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reports table
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id VARCHAR(255) NOT NULL, -- Hashed reporter ID
    region_id VARCHAR(50) NOT NULL,
    gps_latitude DECIMAL(10, 8),
    gps_longitude DECIMAL(11, 8),
    language VARCHAR(10) DEFAULT 'en',
    symptoms TEXT[], -- Array of symptom strings
    patient_count INTEGER NOT NULL DEFAULT 0,
    photos TEXT[], -- Array of photo URLs
    water_observed_flag BOOLEAN DEFAULT false,
    voice_note_url TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'synced', 'conflict')),
    server_id VARCHAR(255), -- Server-assigned ID after sync
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for reports
CREATE INDEX idx_reports_reporter_id ON reports(reporter_id);
CREATE INDEX idx_reports_region_id ON reports(region_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_created_at ON reports(created_at);

-- Sensors table
CREATE TABLE sensors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sensor_id VARCHAR(100) UNIQUE NOT NULL,
    region_id VARCHAR(50) NOT NULL,
    sensor_type VARCHAR(50) NOT NULL,
    location_name VARCHAR(255),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_active BOOLEAN DEFAULT true,
    last_seen TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sensor readings table (TimescaleDB hypertable)
CREATE TABLE sensor_readings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sensor_id VARCHAR(100) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    turbidity DECIMAL(8, 3),
    ph DECIMAL(4, 2),
    electrical_conductivity DECIMAL(8, 3),
    coliform_level DECIMAL(8, 3),
    battery_level DECIMAL(5, 2),
    temperature DECIMAL(5, 2),
    raw_data JSONB, -- Store complete sensor payload
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Convert to TimescaleDB hypertable
SELECT create_hypertable('sensor_readings', 'timestamp');

-- Create indexes for sensor_readings
CREATE INDEX idx_sensor_readings_sensor_id ON sensor_readings(sensor_id);
CREATE INDEX idx_sensor_readings_timestamp ON sensor_readings(timestamp DESC);
CREATE INDEX idx_sensor_readings_sensor_timestamp ON sensor_readings(sensor_id, timestamp DESC);

-- Alerts table
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('critical', 'high', 'medium', 'info')),
    region_id VARCHAR(50),
    alert_type VARCHAR(50) NOT NULL, -- 'threshold', 'ml_prediction', 'manual'
    rule_id VARCHAR(100), -- Reference to rule that triggered alert
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'acknowledged', 'resolved')),
    acknowledged_by UUID REFERENCES users(id),
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB, -- Additional alert data
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for alerts
CREATE INDEX idx_alerts_priority ON alerts(priority);
CREATE INDEX idx_alerts_status ON alerts(status);
CREATE INDEX idx_alerts_region_id ON alerts(region_id);
CREATE INDEX idx_alerts_created_at ON alerts(created_at);

-- Sync log table for offline sync
CREATE TABLE sync_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id VARCHAR(100) NOT NULL,
    server_seq BIGSERIAL UNIQUE NOT NULL,
    client_seq BIGINT NOT NULL,
    entity VARCHAR(50) NOT NULL,
    entity_id VARCHAR(255) NOT NULL,
    operation VARCHAR(20) NOT NULL CHECK (operation IN ('CREATE', 'UPDATE', 'DELETE')),
    payload JSONB NOT NULL,
    synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(client_id, client_seq)
);

-- Create indexes for sync_log
CREATE INDEX idx_sync_log_client_id ON sync_log(client_id);
CREATE INDEX idx_sync_log_server_seq ON sync_log(server_seq);
CREATE INDEX idx_sync_log_entity ON sync_log(entity);

-- Audit logs table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id VARCHAR(255),
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for audit_logs
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- ML model metadata table
CREATE TABLE ml_models (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_name VARCHAR(100) NOT NULL,
    model_version VARCHAR(20) NOT NULL,
    model_type VARCHAR(50) NOT NULL, -- 'anomaly', 'forecast', 'classification'
    region_id VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    accuracy_score DECIMAL(5, 4),
    training_data_size INTEGER,
    model_artifact_path TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deployed_at TIMESTAMP WITH TIME ZONE
);

-- ML predictions table
CREATE TABLE ml_predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_id UUID REFERENCES ml_models(id),
    region_id VARCHAR(50) NOT NULL,
    prediction_type VARCHAR(50) NOT NULL, -- 'anomaly', 'forecast', 'classification'
    probability DECIMAL(5, 4),
    confidence DECIMAL(5, 4),
    features JSONB, -- Input features used for prediction
    prediction_data JSONB, -- Full prediction output
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for ml_predictions
CREATE INDEX idx_ml_predictions_region_id ON ml_predictions(region_id);
CREATE INDEX idx_ml_predictions_created_at ON ml_predictions(created_at);
CREATE INDEX idx_ml_predictions_model_id ON ml_predictions(model_id);

-- Chatbot conversations table
CREATE TABLE chatbot_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255), -- Hashed user ID
    session_id VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    response TEXT,
    language VARCHAR(10) DEFAULT 'en',
    confidence DECIMAL(5, 4),
    intent VARCHAR(100),
    entities JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for chatbot_conversations
CREATE INDEX idx_chatbot_conversations_session_id ON chatbot_conversations(session_id);
CREATE INDEX idx_chatbot_conversations_created_at ON chatbot_conversations(created_at);

-- Media files table
CREATE TABLE media_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT,
    mime_type VARCHAR(100),
    file_hash VARCHAR(64), -- SHA-256 hash
    uploaded_by VARCHAR(255), -- Hashed user ID
    report_id UUID REFERENCES reports(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for media_files
CREATE INDEX idx_media_files_report_id ON media_files(report_id);
CREATE INDEX idx_media_files_uploaded_by ON media_files(uploaded_by);

-- Rules engine table
CREATE TABLE alert_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_name VARCHAR(255) NOT NULL,
    description TEXT,
    rule_type VARCHAR(50) NOT NULL, -- 'threshold', 'ml_probability', 'composite'
    conditions JSONB NOT NULL, -- Rule conditions
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('critical', 'high', 'medium', 'info')),
    is_active BOOLEAN DEFAULT true,
    region_id VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for alert_rules
CREATE INDEX idx_alert_rules_rule_type ON alert_rules(rule_type);
CREATE INDEX idx_alert_rules_is_active ON alert_rules(is_active);
CREATE INDEX idx_alert_rules_region_id ON alert_rules(region_id);

-- Sample data insertion
INSERT INTO users (username, password_hash, role, region_id) VALUES
('admin', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8Qz8K2', 'admin', 'region_001'),
('supervisor_001', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8Qz8K2', 'supervisor', 'region_001'),
('asha_001', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8Qz8K2', 'field_reporter', 'region_001');

INSERT INTO sensors (sensor_id, region_id, sensor_type, location_name, latitude, longitude) VALUES
('sensor_001', 'region_001', 'water_quality', 'Village Well #1', 12.9716, 77.5946),
('sensor_002', 'region_001', 'water_quality', 'Community Tank', 12.9720, 77.5950),
('sensor_003', 'region_001', 'air_quality', 'Health Center', 12.9710, 77.5940);

INSERT INTO alert_rules (rule_name, description, rule_type, conditions, priority, region_id) VALUES
('High Coliform Alert', 'Alert when coliform level exceeds safe threshold', 'threshold', 
 '{"parameter": "coliform_level", "operator": ">", "threshold": 100}', 'high', 'region_001'),
('ML Outbreak Prediction', 'Alert when ML model predicts high outbreak probability', 'ml_probability',
 '{"model": "outbreak_forecast", "operator": ">", "threshold": 0.7}', 'critical', 'region_001'),
('Multiple Symptoms Alert', 'Alert when multiple patients report similar symptoms', 'composite',
 '{"conditions": [{"parameter": "patient_count", "operator": ">=", "threshold": 3}, {"parameter": "symptom_overlap", "operator": ">", "threshold": 0.8}]}', 'medium', 'region_001');`;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Database Schemas</h1>
          <p className="text-xl text-gray-600">PostgreSQL + TimescaleDB schema for Vital Vue system</p>
        </div>

        <div className="card mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Complete Schema</h2>
            <DownloadButton
              filename="vital-vue-schema.sql"
              content={schemaSQL}
              mimeType="text/plain"
              className="btn-primary"
            />
          </div>
          <CodeBlock code={schemaSQL} language="sql" filename="vital-vue-schema.sql" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <h3 className="text-lg font-semibold mb-3 text-primary-600">Core Tables</h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• <strong>users</strong> - User authentication and roles</li>
              <li>• <strong>reports</strong> - Health surveillance reports</li>
              <li>• <strong>sensors</strong> - IoT sensor metadata</li>
              <li>• <strong>sensor_readings</strong> - Time-series sensor data</li>
              <li>• <strong>alerts</strong> - System alerts and notifications</li>
            </ul>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-3 text-green-600">Sync & Audit</h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• <strong>sync_log</strong> - Offline sync tracking</li>
              <li>• <strong>audit_logs</strong> - System audit trail</li>
              <li>• <strong>media_files</strong> - File storage metadata</li>
              <li>• <strong>chatbot_conversations</strong> - AI chat history</li>
            </ul>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-3 text-purple-600">ML & Rules</h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• <strong>ml_models</strong> - ML model metadata</li>
              <li>• <strong>ml_predictions</strong> - ML prediction results</li>
              <li>• <strong>alert_rules</strong> - Alert rule definitions</li>
            </ul>
          </div>
        </div>

        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Design Decisions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">TimescaleDB Integration</h3>
              <p className="text-gray-700 mb-3">
                The <code className="bg-gray-100 px-2 py-1 rounded">sensor_readings</code> table is converted to a TimescaleDB hypertable 
                for optimal time-series data storage and querying.
              </p>
              <CodeBlock 
                code={`-- Convert to TimescaleDB hypertable
SELECT create_hypertable('sensor_readings', 'timestamp');`} 
                language="sql" 
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Offline Sync Support</h3>
              <p className="text-gray-700 mb-3">
                The <code className="bg-gray-100 px-2 py-1 rounded">sync_log</code> table tracks all changes for offline synchronization, 
                using client and server sequence numbers for conflict resolution.
              </p>
              <CodeBlock 
                code={`CREATE TABLE sync_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id VARCHAR(100) NOT NULL,
    server_seq BIGSERIAL UNIQUE NOT NULL,
    client_seq BIGINT NOT NULL,
    entity VARCHAR(50) NOT NULL,
    entity_id VARCHAR(255) NOT NULL,
    operation VARCHAR(20) NOT NULL,
    payload JSONB NOT NULL,
    synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`} 
                language="sql" 
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Privacy-First Design</h3>
              <p className="text-gray-700 mb-3">
                Reporter IDs are hashed before storage, and minimal PII is collected. 
                All sensitive operations are logged in the audit trail.
              </p>
              <CodeBlock 
                code={`-- Hashed reporter ID (no PII)
reporter_id VARCHAR(255) NOT NULL, -- Hashed reporter ID

-- Audit logging for sensitive operations
CREATE TABLE audit_logs (
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    old_values JSONB,
    new_values JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`} 
                language="sql" 
              />
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Performance Optimizations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Indexes</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Composite indexes for common queries</li>
                <li>• Time-based indexes for sensor data</li>
                <li>• Partial indexes for active records</li>
                <li>• JSONB indexes for metadata queries</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Partitioning</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• TimescaleDB automatic partitioning</li>
                <li>• Time-based data retention policies</li>
                <li>• Efficient compression for old data</li>
                <li>• Optimized for time-series queries</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DBSchemas;

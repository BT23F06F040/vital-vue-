import React from 'react';
import CodeBlock from '../components/CodeBlock';
import DownloadButton from '../components/DownloadButton';

const DockerCompose: React.FC = () => {
  const dockerComposeYaml = `version: '3.8'

services:
  # Database Services
  postgres:
    image: postgres:15
    container_name: vitalvue_postgres
    environment:
      POSTGRES_DB: vitalvue
      POSTGRES_USER: vitalvue
      POSTGRES_PASSWORD: vitalvue_password
      POSTGRES_INITDB_ARGS: "--encoding=UTF-8 --lc-collate=C --lc-ctype=C"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init-scripts:/docker-entrypoint-initdb.d
    ports:
      - "5432:5432"
    networks:
      - vitalvue_network
    restart: unless-stopped

  # TimescaleDB Extension
  timescaledb:
    image: timescale/timescaledb:latest-pg15
    container_name: vitalvue_timescaledb
    environment:
      POSTGRES_DB: vitalvue
      POSTGRES_USER: vitalvue
      POSTGRES_PASSWORD: vitalvue_password
    volumes:
      - timescaledb_data:/var/lib/postgresql/data
      - ./init-scripts:/docker-entrypoint-initdb.d
    ports:
      - "5433:5432"
    networks:
      - vitalvue_network
    restart: unless-stopped

  # Redis for Caching and Queues
  redis:
    image: redis:7-alpine
    container_name: vitalvue_redis
    command: redis-server --appendonly yes --requirepass redis_password
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    networks:
      - vitalvue_network
    restart: unless-stopped

  # MinIO Object Storage
  minio:
    image: minio/minio:latest
    container_name: vitalvue_minio
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin_password
      MINIO_DEFAULT_BUCKETS: vitalvue-reports,vitalvue-media,vitalvue-backups
    volumes:
      - minio_data:/data
    ports:
      - "9000:9000"  # API
      - "9001:9001"  # Console
    networks:
      - vitalvue_network
    restart: unless-stopped

  # MQTT Broker
  mosquitto:
    image: eclipse-mosquitto:2.0
    container_name: vitalvue_mosquitto
    volumes:
      - ./mosquitto/config:/mosquitto/config
      - ./mosquitto/data:/mosquitto/data
      - ./mosquitto/log:/mosquitto/log
    ports:
      - "1883:1883"   # MQTT
      - "9001:9001"   # WebSocket
    networks:
      - vitalvue_network
    restart: unless-stopped

  # Main FastAPI Application
  fastapi:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: vitalvue_fastapi
    environment:
      - DATABASE_URL=postgresql://vitalvue:vitalvue_password@postgres:5432/vitalvue
      - REDIS_URL=redis://:redis_password@redis:6379/0
      - MINIO_ENDPOINT=minio:9000
      - MINIO_ACCESS_KEY=minioadmin
      - MINIO_SECRET_KEY=minioadmin_password
      - MQTT_BROKER=mosquitto
      - MQTT_PORT=1883
      - JWT_SECRET_KEY=your_jwt_secret_key_here
      - ENVIRONMENT=production
    volumes:
      - ./backend:/app
      - ./logs:/app/logs
    ports:
      - "8000:8000"
    depends_on:
      - postgres
      - redis
      - minio
      - mosquitto
    networks:
      - vitalvue_network
    restart: unless-stopped

  # ML Service
  ml_service:
    build:
      context: ./ml-service
      dockerfile: Dockerfile
    container_name: vitalvue_ml
    environment:
      - DATABASE_URL=postgresql://vitalvue:vitalvue_password@postgres:5432/vitalvue
      - REDIS_URL=redis://:redis_password@redis:6379/1
      - MODEL_PATH=/app/models
    volumes:
      - ./ml-service:/app
      - ml_models:/app/models
    ports:
      - "8001:8001"
    depends_on:
      - postgres
      - redis
    networks:
      - vitalvue_network
    restart: unless-stopped

  # Rasa Chatbot
  rasa:
    build:
      context: ./rasa
      dockerfile: Dockerfile
    container_name: vitalvue_rasa
    environment:
      - RASA_ENDPOINT=http://rasa:5005
      - REDIS_URL=redis://:redis_password@redis:6379/2
    volumes:
      - ./rasa:/app
      - rasa_models:/app/models
    ports:
      - "5005:5005"
    depends_on:
      - redis
    networks:
      - vitalvue_network
    restart: unless-stopped

  # Background Worker
  worker:
    build:
      context: ./worker
      dockerfile: Dockerfile
    container_name: vitalvue_worker
    environment:
      - DATABASE_URL=postgresql://vitalvue:vitalvue_password@postgres:5432/vitalvue
      - REDIS_URL=redis://:redis_password@redis:6379/0
      - MINIO_ENDPOINT=minio:9000
      - MINIO_ACCESS_KEY=minioadmin
      - MINIO_SECRET_KEY=minioadmin_password
    volumes:
      - ./worker:/app
      - ./logs:/app/logs
    depends_on:
      - postgres
      - redis
      - minio
    networks:
      - vitalvue_network
    restart: unless-stopped

  # MQTT Consumer
  mqtt_consumer:
    build:
      context: ./mqtt-consumer
      dockerfile: Dockerfile
    container_name: vitalvue_mqtt_consumer
    environment:
      - DATABASE_URL=postgresql://vitalvue:vitalvue_password@postgres:5432/vitalvue
      - REDIS_URL=redis://:redis_password@redis:6379/0
      - MQTT_BROKER=mosquitto
      - MQTT_PORT=1883
    volumes:
      - ./mqtt-consumer:/app
      - ./logs:/app/logs
    depends_on:
      - postgres
      - redis
      - mosquitto
    networks:
      - vitalvue_network
    restart: unless-stopped

  # Monitoring Stack
  prometheus:
    image: prom/prometheus:latest
    container_name: vitalvue_prometheus
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    ports:
      - "9090:9090"
    networks:
      - vitalvue_network
    restart: unless-stopped

  grafana:
    image: grafana/grafana:latest
    container_name: vitalvue_grafana
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin_password
    volumes:
      - grafana_data:/var/lib/grafana
      - ./monitoring/grafana/dashboards:/etc/grafana/provisioning/dashboards
      - ./monitoring/grafana/datasources:/etc/grafana/provisioning/datasources
    ports:
      - "3000:3000"
    depends_on:
      - prometheus
    networks:
      - vitalvue_network
    restart: unless-stopped

  loki:
    image: grafana/loki:latest
    container_name: vitalvue_loki
    volumes:
      - ./monitoring/loki.yml:/etc/loki/local-config.yaml
      - loki_data:/loki
    ports:
      - "3100:3100"
    networks:
      - vitalvue_network
    restart: unless-stopped

  # Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: vitalvue_nginx
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - fastapi
      - grafana
    networks:
      - vitalvue_network
    restart: unless-stopped

volumes:
  postgres_data:
  timescaledb_data:
  redis_data:
  minio_data:
  ml_models:
  rasa_models:
  prometheus_data:
  grafana_data:
  loki_data:

networks:
  vitalvue_network:
    driver: bridge`;

  const initScript = `-- Database initialization script
-- Enable TimescaleDB extension
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Create database user and grant permissions
CREATE USER vitalvue WITH PASSWORD 'vitalvue_password';
GRANT ALL PRIVILEGES ON DATABASE vitalvue TO vitalvue;

-- Create tables (see schema.sql for complete schema)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('field_reporter', 'admin', 'supervisor')),
    region_id VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create TimescaleDB hypertable for sensor readings
CREATE TABLE IF NOT EXISTS sensor_readings (
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
    raw_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Convert to hypertable
SELECT create_hypertable('sensor_readings', 'timestamp', if_not_exists => TRUE);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_sensor_readings_sensor_id ON sensor_readings(sensor_id);
CREATE INDEX IF NOT EXISTS idx_sensor_readings_timestamp ON sensor_readings(timestamp DESC);

-- Insert sample data
INSERT INTO users (username, password_hash, role, region_id) VALUES
('admin', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8Qz8K2', 'admin', 'region_001'),
('supervisor_001', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8Qz8K2', 'supervisor', 'region_001'),
('asha_001', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8Qz8K2', 'field_reporter', 'region_001')
ON CONFLICT (username) DO NOTHING;`;

  const nginxConfig = `# Nginx configuration for reverse proxy
events {
    worker_connections 1024;
}

http {
    upstream fastapi {
        server fastapi:8000;
    }
    
    upstream grafana {
        server grafana:3000;
    }
    
    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;
    
    server {
        listen 80;
        server_name vitalvue.local;
        
        # Redirect HTTP to HTTPS
        return 301 https://$server_name$request_uri;
    }
    
    server {
        listen 443 ssl http2;
        server_name vitalvue.local;
        
        # SSL configuration
        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
        ssl_prefer_server_ciphers off;
        
        # Security headers
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
        
        # API routes
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://fastapi;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
        
        # Authentication endpoints
        location /api/v1/auth/ {
            limit_req zone=login burst=5 nodelay;
            proxy_pass http://fastapi;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
        
        # Grafana monitoring
        location /monitoring/ {
            proxy_pass http://grafana/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
        
        # Static files
        location /static/ {
            alias /app/static/;
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
        
        # Health check
        location /health {
            access_log off;
            return 200 "healthy\\n";
            add_header Content-Type text/plain;
        }
    }
}`;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Docker Compose Setup</h1>
          <p className="text-xl text-gray-600">Complete containerized deployment with monitoring and security</p>
        </div>

        <div className="space-y-8">
          {/* Docker Compose */}
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Docker Compose Configuration</h2>
              <DownloadButton
                filename="docker-compose.yml"
                content={dockerComposeYaml}
                mimeType="application/x-yaml"
                className="btn-primary"
              />
            </div>
            <p className="text-gray-700 mb-4">
              Complete Docker Compose setup with all services including database, cache, object storage, 
              MQTT broker, API services, ML service, chatbot, and monitoring stack.
            </p>
            <CodeBlock code={dockerComposeYaml} language="yaml" filename="docker-compose.yml" />
          </div>

          {/* Database Init Script */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Database Initialization</h2>
            <p className="text-gray-700 mb-4">
              SQL script for database setup including TimescaleDB extension, table creation, 
              and sample data insertion.
            </p>
            <CodeBlock code={initScript} language="sql" filename="init-db.sql" />
          </div>

          {/* Nginx Configuration */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Nginx Reverse Proxy</h2>
            <p className="text-gray-700 mb-4">
              Nginx configuration for reverse proxy, SSL termination, rate limiting, 
              and security headers.
            </p>
            <CodeBlock code={nginxConfig} language="nginx" filename="nginx.conf" />
          </div>

          {/* Service Overview */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Service Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 text-blue-600">Core Services</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• <strong>PostgreSQL:</strong> Main database (port 5432)</li>
                  <li>• <strong>TimescaleDB:</strong> Time-series data (port 5433)</li>
                  <li>• <strong>Redis:</strong> Cache & queues (port 6379)</li>
                  <li>• <strong>MinIO:</strong> Object storage (port 9000)</li>
                  <li>• <strong>Mosquitto:</strong> MQTT broker (port 1883)</li>
                </ul>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 text-green-600">Application Services</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• <strong>FastAPI:</strong> Main API (port 8000)</li>
                  <li>• <strong>ML Service:</strong> ML predictions (port 8001)</li>
                  <li>• <strong>Rasa:</strong> Chatbot (port 5005)</li>
                  <li>• <strong>Worker:</strong> Background jobs</li>
                  <li>• <strong>MQTT Consumer:</strong> IoT data processing</li>
                </ul>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 text-purple-600">Monitoring & Proxy</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• <strong>Prometheus:</strong> Metrics (port 9090)</li>
                  <li>• <strong>Grafana:</strong> Dashboards (port 3000)</li>
                  <li>• <strong>Loki:</strong> Log aggregation (port 3100)</li>
                  <li>• <strong>Nginx:</strong> Reverse proxy (port 80/443)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Deployment Instructions */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Deployment Instructions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Prerequisites</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Docker Engine 20.10+ and Docker Compose 2.0+</li>
                  <li>• At least 4GB RAM and 20GB disk space</li>
                  <li>• Open ports: 80, 443, 8000, 3000, 5432, 6379</li>
                  <li>• SSL certificates for HTTPS (Let's Encrypt recommended)</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Quick Start</h3>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg">
                  <pre className="text-sm">
{`# Clone the repository
git clone https://github.com/vitalvue/vitalvue.git
cd vitalvue

# Copy environment file
cp .env.example .env

# Edit configuration
nano .env

# Start all services
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f fastapi

# Stop services
docker-compose down`}
                  </pre>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Production Deployment</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Use production environment variables</li>
                  <li>• Set up proper SSL certificates</li>
                  <li>• Configure firewall rules</li>
                  <li>• Set up automated backups</li>
                  <li>• Monitor resource usage</li>
                  <li>• Configure log rotation</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Environment Variables */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Environment Configuration</h2>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg">
              <pre className="text-sm">
{`# Database Configuration
DATABASE_URL=postgresql://vitalvue:vitalvue_password@postgres:5432/vitalvue
REDIS_URL=redis://:redis_password@redis:6379/0

# Object Storage
MINIO_ENDPOINT=minio:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin_password

# MQTT Configuration
MQTT_BROKER=mosquitto
MQTT_PORT=1883

# Security
JWT_SECRET_KEY=your_jwt_secret_key_here
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=60

# External Services
FCM_SERVER_KEY=your_fcm_server_key
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# Monitoring
PROMETHEUS_ENDPOINT=http://prometheus:9090
GRAFANA_ENDPOINT=http://grafana:3000

# Environment
ENVIRONMENT=production
DEBUG=false
LOG_LEVEL=INFO`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DockerCompose;

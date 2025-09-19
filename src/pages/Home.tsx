import React from 'react';
import { Link } from 'react-router-dom';
import ArchitectureDiagram from '../components/ArchitectureDiagram';
import DownloadButton from '../components/DownloadButton';

const Home: React.FC = () => {
  const openAPIContent = `openapi: 3.0.0
info:
  title: Vital Vue API
  version: 1.0.0
  description: Mobile-first Public Health Surveillance API
paths:
  /api/v1/auth/login:
    post:
      summary: User authentication
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                username:
                  type: string
                password:
                  type: string
      responses:
        '200':
          description: Authentication successful
          content:
            application/json:
              schema:
                type: object
                properties:
                  access_token:
                    type: string
                  token_type:
                    type: string
                    example: bearer`;

  const dockerComposeContent = `version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: vitalvue
      POSTGRES_USER: vitalvue
      POSTGRES_PASSWORD: vitalvue
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  minio:
    image: minio/minio
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    ports:
      - "9000:9000"
      - "9001:9001"
    volumes:
      - minio_data:/data

volumes:
  postgres_data:
  minio_data:`;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <img src="/sih-logo.svg" alt="SIH" className="w-6 h-6 rounded-full bg-white" />
            <span className="text-sm font-medium">SIH 2025 Project</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Vital Vue
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-100">
            Mobile-first Public Health Surveillance
          </p>
          <p className="text-lg mb-8 text-primary-200 max-w-3xl mx-auto">
            Offline-first field reporting, IoT water sensors, ML alerts; fully open-source stack
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/solution" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
              View Implementation Plan
            </Link>
            <DownloadButton
              filename="openapi.yml"
              content={openAPIContent}
              mimeType="application/x-yaml"
              className="btn-secondary bg-white/20 text-white hover:bg-white/30"
            />
            <DownloadButton
              filename="docker-compose.yml"
              content={dockerComposeContent}
              mimeType="application/x-yaml"
              className="btn-secondary bg-white/20 text-white hover:bg-white/30"
            />
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="card text-center">
              <div className="w-12 h-12 bg-health-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-health-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Offline-first Field App</h3>
              <p className="text-sm text-gray-600">Works without internet, syncs when connected</p>
            </div>
            
            <div className="card text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">MQTT Sensor Ingestion</h3>
              <p className="text-sm text-gray-600">Real-time water quality monitoring</p>
            </div>
            
            <div className="card text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">ML Alerts</h3>
              <p className="text-sm text-gray-600">AI-powered outbreak prediction</p>
            </div>
            
            <div className="card text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Rasa Chatbot</h3>
              <p className="text-sm text-gray-600">Multi-language health assistant</p>
            </div>
            
            <div className="card text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Self-hostable Stack</h3>
              <p className="text-sm text-gray-600">Complete open-source solution</p>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Preview */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">System Architecture</h2>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <ArchitectureDiagram />
          </div>
          <div className="text-center mt-6">
            <Link to="/solution" className="btn-primary">
              View Detailed Architecture
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Get Started</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/mvp-roadmap" className="card hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Start Pilot Checklist</h3>
              <p className="text-sm text-gray-600">Step-by-step pilot deployment guide</p>
            </Link>
            
            <Link to="/tech-stack" className="card hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Tech Stack Details</h3>
              <p className="text-sm text-gray-600">Complete technology choices and rationale</p>
            </Link>
            
            <Link to="/openapi" className="card hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">API Documentation</h3>
              <p className="text-sm text-gray-600">OpenAPI specification and examples</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

import React from 'react';
import ArchitectureDiagram from '../components/ArchitectureDiagram';

const Solution: React.FC = () => {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Solution Architecture</h1>
          <p className="text-xl text-gray-600">Comprehensive mobile-first public health surveillance system</p>
        </div>

        {/* Architecture Diagram */}
        <div className="card mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">System Architecture</h2>
          <ArchitectureDiagram />
        </div>

        {/* Architecture Rationale */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Architecture Rationale</h2>
          <p className="text-gray-700 mb-4">
            The Vital Vue architecture is designed around the core principle of offline-first operation 
            with intelligent synchronization, ensuring reliable data collection even in areas with 
            poor connectivity. The system leverages a microservices approach to provide scalability, 
            maintainability, and the ability to deploy components independently.
          </p>
          <p className="text-gray-700 mb-4">
            Key architectural decisions address the constraints of rural deployment:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li><strong>Mobile-first design:</strong> React + Tailwind ensures optimal performance on low-end devices</li>
            <li><strong>Offline capability:</strong> SQLite local storage with conflict resolution for reliable data collection</li>
            <li><strong>Sensor integration:</strong> MQTT-based IoT ingestion for real-time environmental monitoring</li>
            <li><strong>AI-powered insights:</strong> ML microservice for anomaly detection and outbreak prediction</li>
            <li><strong>Multi-channel alerts:</strong> FCM, Telegram, and email integration for immediate notification</li>
            <li><strong>Self-hostable stack:</strong> Complete Docker Compose setup for local deployment</li>
          </ul>
        </div>

        {/* Data Flow */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Data Flow</h2>
          <div className="space-y-6">
            <div className="border-l-4 border-primary-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">Field Data Collection</h3>
              <p className="text-gray-700">
                ASHA workers collect symptom reports, photos, and sensor data using the mobile app. 
                Data is stored locally in SQLite and queued for synchronization when connectivity is available.
              </p>
            </div>
            
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">IoT Sensor Integration</h3>
              <p className="text-gray-700">
                Water quality sensors publish readings via MQTT to Mosquitto broker. 
                The MQTT consumer processes and stores time-series data in TimescaleDB for analysis.
              </p>
            </div>
            
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">AI Processing</h3>
              <p className="text-gray-700">
                ML service analyzes aggregated data to detect anomalies and predict outbreak probability. 
                Results are stored and used to trigger alerts through the rules engine.
              </p>
            </div>
            
            <div className="border-l-4 border-orange-500 pl-4">
              <h3 className="font-semibold text-lg mb-2">Alert Distribution</h3>
              <p className="text-gray-700">
                When thresholds are exceeded or ML predictions indicate high risk, 
                alerts are sent via FCM, Telegram, and email to relevant stakeholders.
              </p>
            </div>
          </div>
        </div>

        {/* Key Components */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Components</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2 text-primary-600">Mobile App</h3>
              <p className="text-sm text-gray-600 mb-3">React + Tailwind CSS</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Offline-first data collection</li>
                <li>• Photo and voice note capture</li>
                <li>• BLE sensor integration</li>
                <li>• Multi-language support</li>
              </ul>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2 text-green-600">Backend API</h3>
              <p className="text-sm text-gray-600 mb-3">FastAPI + Python</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• RESTful API endpoints</li>
                <li>• JWT authentication</li>
                <li>• Data validation</li>
                <li>• Rate limiting</li>
              </ul>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2 text-purple-600">Database</h3>
              <p className="text-sm text-gray-600 mb-3">PostgreSQL + TimescaleDB</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Relational data storage</li>
                <li>• Time-series optimization</li>
                <li>• Data integrity</li>
                <li>• Backup and recovery</li>
              </ul>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2 text-blue-600">Object Storage</h3>
              <p className="text-sm text-gray-600 mb-3">MinIO</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Photo and media storage</li>
                <li>• Pre-signed URLs</li>
                <li>• S3-compatible API</li>
                <li>• Local deployment</li>
              </ul>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2 text-red-600">Message Queue</h3>
              <p className="text-sm text-gray-600 mb-3">Redis + RQ</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Background job processing</li>
                <li>• ML model inference</li>
                <li>• Alert distribution</li>
                <li>• Task scheduling</li>
              </ul>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2 text-cyan-600">MQTT Broker</h3>
              <p className="text-sm text-gray-600 mb-3">Eclipse Mosquitto</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• IoT sensor communication</li>
                <li>• Real-time data ingestion</li>
                <li>• Device authentication</li>
                <li>• Message persistence</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Solution Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-3 text-gray-800">For Field Workers</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Works offline in remote areas</li>
                <li>Intuitive mobile interface</li>
                <li>Voice and photo capture</li>
                <li>Multi-language support</li>
                <li>Real-time data validation</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-3 text-gray-800">For Health Officials</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Real-time dashboards and alerts</li>
                <li>AI-powered outbreak prediction</li>
                <li>Comprehensive data analytics</li>
                <li>Multi-channel notifications</li>
                <li>Historical trend analysis</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Solution;

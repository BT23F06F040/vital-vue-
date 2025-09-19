import React from 'react';

const ArchitectureDiagram: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <svg viewBox="0 0 800 600" className="w-full h-auto">
        {/* Background */}
        <rect width="800" height="600" fill="#f8fafc" />
        
        {/* Mobile App */}
        <rect x="50" y="50" width="120" height="80" fill="#3b82f6" rx="8" />
        <text x="110" y="95" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
          Mobile App
        </text>
        <text x="110" y="110" textAnchor="middle" fill="white" fontSize="10">
          React + Tailwind
        </text>
        
        {/* Sync API */}
        <rect x="250" y="50" width="120" height="80" fill="#10b981" rx="8" />
        <text x="310" y="95" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
          Sync API
        </text>
        <text x="310" y="110" textAnchor="middle" fill="white" fontSize="10">
          FastAPI
        </text>
        
        {/* Database */}
        <rect x="450" y="50" width="120" height="80" fill="#8b5cf6" rx="8" />
        <text x="510" y="95" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
          Database
        </text>
        <text x="510" y="110" textAnchor="middle" fill="white" fontSize="10">
          PostgreSQL + TimescaleDB
        </text>
        
        {/* MinIO */}
        <rect x="50" y="200" width="120" height="80" fill="#f59e0b" rx="8" />
        <text x="110" y="245" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
          MinIO
        </text>
        <text x="110" y="260" textAnchor="middle" fill="white" fontSize="10">
          Object Storage
        </text>
        
        {/* Redis + Queue */}
        <rect x="250" y="200" width="120" height="80" fill="#ef4444" rx="8" />
        <text x="310" y="245" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
          Redis + RQ
        </text>
        <text x="310" y="260" textAnchor="middle" fill="white" fontSize="10">
          Background Jobs
        </text>
        
        {/* MQTT Broker */}
        <rect x="450" y="200" width="120" height="80" fill="#06b6d4" rx="8" />
        <text x="510" y="245" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
          Mosquitto
        </text>
        <text x="510" y="260" textAnchor="middle" fill="white" fontSize="10">
          MQTT Broker
        </text>
        
        {/* ML Service */}
        <rect x="50" y="350" width="120" height="80" fill="#ec4899" rx="8" />
        <text x="110" y="395" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
          ML Service
        </text>
        <text x="110" y="410" textAnchor="middle" fill="white" fontSize="10">
          Anomaly Detection
        </text>
        
        {/* Rasa Chatbot */}
        <rect x="250" y="350" width="120" height="80" fill="#84cc16" rx="8" />
        <text x="310" y="395" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
          Rasa Chatbot
        </text>
        <text x="310" y="410" textAnchor="middle" fill="white" fontSize="10">
          AI Assistant
        </text>
        
        {/* Monitoring */}
        <rect x="450" y="350" width="120" height="80" fill="#6b7280" rx="8" />
        <text x="510" y="395" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
          Monitoring
        </text>
        <text x="510" y="410" textAnchor="middle" fill="white" fontSize="10">
          Prometheus + Grafana
        </text>
        
        {/* IoT Sensors */}
        <rect x="650" y="200" width="100" height="60" fill="#14b8a6" rx="8" />
        <text x="700" y="230" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">
          IoT Sensors
        </text>
        
        {/* Alert Channels */}
        <rect x="650" y="350" width="100" height="60" fill="#f97316" rx="8" />
        <text x="700" y="380" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">
          FCM + Telegram
        </text>
        
        {/* Arrows */}
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#374151" />
          </marker>
        </defs>
        
        {/* Mobile to Sync API */}
        <line x1="170" y1="90" x2="250" y2="90" stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead)" />
        
        {/* Sync API to Database */}
        <line x1="370" y1="90" x2="450" y2="90" stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead)" />
        
        {/* Sync API to MinIO */}
        <line x1="310" y1="130" x2="110" y2="200" stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead)" />
        
        {/* Sync API to Redis */}
        <line x1="310" y1="130" x2="310" y2="200" stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead)" />
        
        {/* MQTT to Redis */}
        <line x1="450" y1="240" x2="370" y2="240" stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead)" />
        
        {/* IoT to MQTT */}
        <line x1="650" y1="230" x2="570" y2="230" stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead)" />
        
        {/* Redis to ML */}
        <line x1="310" y1="280" x2="110" y2="350" stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead)" />
        
        {/* Database to ML */}
        <line x1="510" y1="130" x2="170" y2="350" stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead)" />
        
        {/* ML to Alerts */}
        <line x1="170" y1="430" x2="700" y2="380" stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead)" />
      </svg>
    </div>
  );
};

export default ArchitectureDiagram;

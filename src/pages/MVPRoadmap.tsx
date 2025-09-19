import React from 'react';

const MVPRoadmap: React.FC = () => {
  const sprints = [
    {
      id: 1,
      title: "Foundation & Mobile App",
      duration: "2 weeks",
      status: "completed",
      description: "Basic mobile app with offline capability and core API infrastructure",
      tasks: [
        "Set up React + Tailwind mobile app structure",
        "Implement offline-first data collection",
        "Create FastAPI backend with authentication",
        "Set up PostgreSQL database with basic schema",
        "Implement Docker Compose development environment",
        "Create basic report submission form",
        "Add offline data storage with SQLite",
        "Implement basic sync mechanism"
      ],
      acceptance: [
        "Mobile app can save reports offline",
        "Reports sync to server when connected",
        "Basic authentication works",
        "Docker environment runs successfully"
      ],
      deliverables: [
        "Working mobile app (APK/IPA)",
        "FastAPI backend with core endpoints",
        "Database schema and migrations",
        "Docker Compose setup"
      ]
    },
    {
      id: 2,
      title: "Media & Storage + Admin Interface",
      duration: "2 weeks",
      status: "completed",
      description: "Add media handling, object storage, and basic admin interface",
      tasks: [
        "Integrate MinIO for object storage",
        "Implement photo and voice note capture",
        "Add pre-signed URL generation for uploads",
        "Create admin web interface for report viewing",
        "Implement basic map view for reports",
        "Add report filtering and search",
        "Create user management interface",
        "Implement basic dashboard"
      ],
      acceptance: [
        "Photos and voice notes can be uploaded",
        "Admin can view all reports in web interface",
        "Map view shows report locations",
        "Media files are properly stored and retrievable"
      ],
      deliverables: [
        "Media upload functionality",
        "Admin web interface",
        "MinIO integration",
        "Basic reporting dashboard"
      ]
    },
    {
      id: 3,
      title: "Sensors & MQTT Integration",
      duration: "2 weeks",
      status: "in_progress",
      description: "Add IoT sensor integration and MQTT data ingestion",
      tasks: [
        "Set up Mosquitto MQTT broker",
        "Create MQTT consumer service",
        "Implement TimescaleDB for time-series data",
        "Add BLE water kit integration",
        "Create sensor data visualization",
        "Implement sensor health monitoring",
        "Add sensor data to reports",
        "Create sensor management interface"
      ],
      acceptance: [
        "MQTT messages are received and processed",
        "Sensor data is stored in TimescaleDB",
        "BLE water kit can be paired and read",
        "Sensor readings appear in admin interface"
      ],
      deliverables: [
        "MQTT consumer service",
        "TimescaleDB integration",
        "BLE water kit app",
        "Sensor data dashboard"
      ]
    },
    {
      id: 4,
      title: "Alerts & Rules Engine",
      duration: "2 weeks",
      status: "pending",
      description: "Implement intelligent alerting system with multi-channel notifications",
      tasks: [
        "Create rules engine for alert generation",
        "Implement FCM push notifications",
        "Add Telegram bot integration",
        "Create email notification system",
        "Implement alert management interface",
        "Add alert acknowledgment workflow",
        "Create alert escalation procedures",
        "Implement alert suppression and filtering"
      ],
      acceptance: [
        "Alerts are generated based on rules",
        "Notifications are sent via FCM, Telegram, and email",
        "Admin can manage and acknowledge alerts",
        "Alert escalation works properly"
      ],
      deliverables: [
        "Rules engine implementation",
        "Multi-channel notification system",
        "Alert management interface",
        "Notification templates"
      ]
    },
    {
      id: 5,
      title: "Offline Sync & Conflict Resolution",
      duration: "2 weeks",
      status: "pending",
      description: "Enhance offline capabilities with robust sync and conflict handling",
      tasks: [
        "Implement advanced sync algorithms",
        "Add conflict detection and resolution",
        "Create sync status monitoring",
        "Implement retry mechanisms with exponential backoff",
        "Add sync conflict resolution interface",
        "Implement data integrity checks",
        "Add sync performance optimization",
        "Create sync analytics dashboard"
      ],
      acceptance: [
        "Sync works reliably in poor network conditions",
        "Conflicts are detected and resolved",
        "Sync status is visible to users",
        "Data integrity is maintained"
      ],
      deliverables: [
        "Robust sync mechanism",
        "Conflict resolution system",
        "Sync monitoring dashboard",
        "Performance optimizations"
      ]
    },
    {
      id: 6,
      title: "ML & Chatbot + Pilot Preparation",
      duration: "2 weeks",
      status: "pending",
      description: "Add AI capabilities and prepare for pilot deployment",
      tasks: [
        "Implement ML anomaly detection",
        "Create outbreak prediction models",
        "Add Rasa chatbot integration",
        "Implement multi-language support",
        "Create pilot deployment checklist",
        "Prepare training materials",
        "Set up monitoring and logging",
        "Create user documentation"
      ],
      acceptance: [
        "ML models provide outbreak predictions",
        "Chatbot answers health questions",
        "Multi-language support works",
        "Pilot deployment is ready"
      ],
      deliverables: [
        "ML prediction service",
        "Rasa chatbot",
        "Pilot deployment guide",
        "Training materials"
      ]
    }
  ];

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">MVP Development Roadmap</h1>
          <p className="text-xl text-gray-600">6-sprint development plan for Vital Vue MVP</p>
        </div>

        <div className="space-y-8">
          {/* Sprint Overview */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Sprint Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sprints.map((sprint) => (
                <div key={sprint.id} className={`border rounded-lg p-4 ${
                  sprint.status === 'completed' ? 'border-green-200 bg-green-50' :
                  sprint.status === 'in_progress' ? 'border-blue-200 bg-blue-50' :
                  'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg">Sprint {sprint.id}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      sprint.status === 'completed' ? 'bg-green-100 text-green-800' :
                      sprint.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {sprint.status === 'completed' ? '✓ Completed' :
                       sprint.status === 'in_progress' ? '🔄 In Progress' :
                       '⏳ Pending'}
                    </span>
                  </div>
                  <h4 className="font-medium text-gray-800 mb-2">{sprint.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{sprint.description}</p>
                  <div className="text-xs text-gray-500">
                    <strong>Duration:</strong> {sprint.duration}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Sprint Information */}
          {sprints.map((sprint) => (
            <div key={sprint.id} className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Sprint {sprint.id}: {sprint.title}
                </h2>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    sprint.status === 'completed' ? 'bg-green-100 text-green-800' :
                    sprint.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {sprint.status === 'completed' ? 'Completed' :
                     sprint.status === 'in_progress' ? 'In Progress' :
                     'Pending'}
                  </span>
                  <span className="text-sm text-gray-500">{sprint.duration}</span>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">{sprint.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Key Tasks</h3>
                  <ul className="space-y-2">
                    {sprint.tasks.map((task, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-sm text-gray-700">{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Acceptance Criteria</h3>
                  <ul className="space-y-2">
                    {sprint.acceptance.map((criteria, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-sm text-gray-700">{criteria}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Deliverables</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sprint.deliverables.map((deliverable, index) => (
                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                      <span className="text-sm text-gray-700">{deliverable}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Timeline Visualization */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Development Timeline</h2>
            <div className="space-y-4">
              {sprints.map((sprint, index) => (
                <div key={sprint.id} className="flex items-center">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-sm font-semibold text-primary-600">{sprint.id}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-800">{sprint.title}</h3>
                      <span className="text-sm text-gray-500">{sprint.duration}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className={`h-2 rounded-full ${
                        sprint.status === 'completed' ? 'bg-green-500' :
                        sprint.status === 'in_progress' ? 'bg-blue-500' :
                        'bg-gray-300'
                      }`} style={{ width: sprint.status === 'completed' ? '100%' : 
                                      sprint.status === 'in_progress' ? '60%' : '0%' }}>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Success Metrics */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Success Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-2">12 weeks</div>
                <div className="text-sm text-blue-800">Total Development Time</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-2">6 sprints</div>
                <div className="text-sm text-green-800">Iterative Development</div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 mb-2">MVP Ready</div>
                <div className="text-sm text-purple-800">Pilot Deployment</div>
              </div>
            </div>
          </div>

          {/* Risk Mitigation */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Risk Mitigation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-red-600">Technical Risks</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• <strong>Offline Sync Complexity:</strong> Start with simple sync, iterate</li>
                  <li>• <strong>ML Model Performance:</strong> Use proven algorithms initially</li>
                  <li>• <strong>Mobile App Stability:</strong> Extensive testing on low-end devices</li>
                  <li>• <strong>Data Integrity:</strong> Implement comprehensive validation</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3 text-orange-600">Project Risks</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• <strong>Scope Creep:</strong> Strict sprint boundaries</li>
                  <li>• <strong>Resource Constraints:</strong> Prioritize core features</li>
                  <li>• <strong>User Adoption:</strong> Early user feedback integration</li>
                  <li>• <strong>Deployment Issues:</strong> Staged rollout approach</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MVPRoadmap;

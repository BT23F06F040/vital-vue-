import React from 'react';

const PilotChecklist: React.FC = () => {
  const checklistItems = [
    {
      category: "Pre-Deployment Setup",
      items: [
        {
          task: "Server Infrastructure Setup",
          description: "Deploy Docker Compose stack on production server",
          checklist: [
            "Install Docker and Docker Compose",
            "Configure SSL certificates (Let's Encrypt)",
            "Set up firewall rules (ports 80, 443, 8000)",
            "Configure domain name and DNS",
            "Set up automated backups",
            "Install monitoring tools (Prometheus, Grafana)"
          ]
        },
        {
          task: "Database Initialization",
          description: "Set up and configure databases with sample data",
          checklist: [
            "Create PostgreSQL database with TimescaleDB extension",
            "Run database migration scripts",
            "Insert sample users and regions",
            "Configure database backups",
            "Set up database monitoring",
            "Test database performance"
          ]
        },
        {
          task: "Mobile App Configuration",
          description: "Prepare mobile app for pilot deployment",
          checklist: [
            "Build production APK/IPA files",
            "Configure API endpoints for production",
            "Set up FCM for push notifications",
            "Test app on various Android/iOS versions",
            "Prepare app distribution (Google Play/App Store)",
            "Create user installation guide"
          ]
        }
      ]
    },
    {
      category: "User Training & Onboarding",
      items: [
        {
          task: "ASHA Worker Training",
          description: "Train 3-5 ASHA workers on app usage",
          checklist: [
            "Schedule 2-hour training sessions",
            "Prepare training materials (videos, guides)",
            "Demonstrate offline data collection",
            "Practice photo and voice note capture",
            "Explain sync process and troubleshooting",
            "Test with real scenarios"
          ]
        },
        {
          task: "Health Official Training",
          description: "Train supervisors on admin interface",
          checklist: [
            "Schedule 1-hour admin training session",
            "Demonstrate report viewing and filtering",
            "Show alert management interface",
            "Explain escalation procedures",
            "Practice user management",
            "Test notification systems"
          ]
        },
        {
          task: "Documentation Preparation",
          description: "Create comprehensive user documentation",
          checklist: [
            "Write user manual for field workers",
            "Create admin guide for supervisors",
            "Prepare troubleshooting guide",
            "Create video tutorials",
            "Translate materials to local languages",
            "Print quick reference cards"
          ]
        }
      ]
    },
    {
      category: "IoT Sensor Deployment",
      items: [
        {
          task: "Water Quality Sensor Setup",
          description: "Deploy and configure 5 water quality sensors",
          checklist: [
            "Identify sensor placement locations",
            "Install sensors at water sources",
            "Configure MQTT connectivity",
            "Test data transmission",
            "Calibrate sensors for local conditions",
            "Set up sensor health monitoring"
          ]
        },
        {
          task: "BLE Water Kit Distribution",
          description: "Distribute and configure BLE water testing kits",
          checklist: [
            "Prepare 10 BLE water testing kits",
            "Charge and test all devices",
            "Pair kits with mobile apps",
            "Train users on kit operation",
            "Test data collection workflow",
            "Create kit maintenance schedule"
          ]
        },
        {
          task: "MQTT Infrastructure",
          description: "Set up MQTT broker and data processing",
          checklist: [
            "Deploy Mosquitto MQTT broker",
            "Configure device authentication",
            "Set up MQTT consumer service",
            "Test data ingestion pipeline",
            "Configure data validation",
            "Set up error handling and retry logic"
          ]
        }
      ]
    },
    {
      category: "Communication Setup",
      items: [
        {
          task: "Telegram Bot Configuration",
          description: "Set up Telegram bot for region notifications",
          checklist: [
            "Create Telegram bot and get API token",
            "Set up region-specific group chats",
            "Configure bot commands and responses",
            "Test message delivery",
            "Add bot to all relevant groups",
            "Train users on bot usage"
          ]
        },
        {
          task: "FCM Push Notifications",
          description: "Configure Firebase Cloud Messaging",
          checklist: [
            "Set up Firebase project",
            "Configure FCM server key",
            "Test push notification delivery",
            "Set up notification templates",
            "Configure topic subscriptions",
            "Test notification on various devices"
          ]
        },
        {
          task: "Email Notification Setup",
          description: "Configure email notifications for critical alerts",
          checklist: [
            "Set up SMTP server configuration",
            "Create email templates",
            "Configure recipient lists",
            "Test email delivery",
            "Set up email monitoring",
            "Create email unsubscribe mechanism"
          ]
        }
      ]
    },
    {
      category: "Monitoring & Support",
      items: [
        {
          task: "System Monitoring",
          description: "Set up comprehensive monitoring and alerting",
          checklist: [
            "Configure Prometheus metrics collection",
            "Set up Grafana dashboards",
            "Configure Loki log aggregation",
            "Set up alert rules for critical issues",
            "Test monitoring system functionality",
            "Create monitoring runbooks"
          ]
        },
        {
          task: "Support Infrastructure",
          description: "Establish support channels and procedures",
          checklist: [
            "Set up support phone number",
            "Create support email address",
            "Establish escalation procedures",
            "Train support staff",
            "Create issue tracking system",
            "Set up remote support tools"
          ]
        },
        {
          task: "Data Backup & Recovery",
          description: "Implement data protection measures",
          checklist: [
            "Set up automated database backups",
            "Configure MinIO backup to external storage",
            "Test backup restoration procedures",
            "Set up disaster recovery plan",
            "Document recovery procedures",
            "Test backup integrity"
          ]
        }
      ]
    },
    {
      category: "Pilot Execution",
      items: [
        {
          task: "4-Week Pilot Run",
          description: "Execute pilot program with monitoring and feedback",
          checklist: [
            "Launch pilot with 3-5 ASHA workers",
            "Monitor system performance daily",
            "Collect user feedback weekly",
            "Track key metrics (reports, sync success, alerts)",
            "Address issues promptly",
            "Document lessons learned"
          ]
        },
        {
          task: "Data Collection & Analysis",
          description: "Collect and analyze pilot data for improvements",
          checklist: [
            "Track report submission rates",
            "Monitor sync success rates",
            "Analyze alert accuracy",
            "Collect user satisfaction feedback",
            "Measure system performance metrics",
            "Identify improvement opportunities"
          ]
        },
        {
          task: "Pilot Evaluation",
          description: "Evaluate pilot success and plan next steps",
          checklist: [
            "Conduct user interviews",
            "Analyze system performance data",
            "Evaluate alert effectiveness",
            "Assess user adoption rates",
            "Identify technical issues",
            "Create improvement roadmap"
          ]
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Pilot Deployment Checklist</h1>
          <p className="text-xl text-gray-600">Comprehensive guide for successful pilot deployment</p>
        </div>

        <div className="space-y-8">
          {checklistItems.map((category, categoryIndex) => (
            <div key={categoryIndex} className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{category.category}</h2>
              
              <div className="space-y-6">
                {category.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.task}</h3>
                        <p className="text-gray-600 text-sm">{item.description}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">0/{item.checklist.length}</span>
                        <div className="w-16 h-2 bg-gray-200 rounded-full">
                          <div className="w-0 h-2 bg-green-500 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {item.checklist.map((checklistItem, checklistIndex) => (
                        <label key={checklistIndex} className="flex items-start cursor-pointer">
                          <input
                            type="checkbox"
                            className="mt-1 mr-3 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">{checklistItem}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Pilot Timeline */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Pilot Timeline</h2>
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-4">1</div>
                <div>
                  <h3 className="font-semibold text-blue-800">Week 1: Setup & Training</h3>
                  <p className="text-sm text-blue-600">Infrastructure deployment, user training, sensor installation</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-green-50 rounded-lg">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mr-4">2</div>
                <div>
                  <h3 className="font-semibold text-green-800">Week 2-3: Active Pilot</h3>
                  <p className="text-sm text-green-600">Daily data collection, monitoring, issue resolution</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-purple-50 rounded-lg">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-4">3</div>
                <div>
                  <h3 className="font-semibold text-purple-800">Week 4: Evaluation</h3>
                  <p className="text-sm text-purple-600">Data analysis, user feedback, improvement planning</p>
                </div>
              </div>
            </div>
          </div>

          {/* Success Metrics */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Success Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-2">≥80%</div>
                <div className="text-sm text-blue-800">Sync Success Rate</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-2">≥50</div>
                <div className="text-sm text-green-800">Reports per Week</div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 mb-2">≥90%</div>
                <div className="text-sm text-purple-800">User Satisfaction</div>
              </div>
              
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600 mb-2">≤5min</div>
                <div className="text-sm text-orange-800">Average Response Time</div>
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
                  <li>• <strong>Network Issues:</strong> Offline-first design, retry mechanisms</li>
                  <li>• <strong>Device Failures:</strong> Backup devices, quick replacement</li>
                  <li>• <strong>Data Loss:</strong> Regular backups, data validation</li>
                  <li>• <strong>Sync Conflicts:</strong> Conflict resolution, manual override</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3 text-orange-600">User Adoption Risks</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• <strong>Training Gaps:</strong> Comprehensive training, follow-up support</li>
                  <li>• <strong>Language Barriers:</strong> Multi-language support, local trainers</li>
                  <li>• <strong>Technical Literacy:</strong> Simple UI, extensive testing</li>
                  <li>• <strong>Motivation:</strong> Clear benefits, recognition programs</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Support Contacts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-blue-800 mb-2">Technical Support</h3>
                <p className="text-sm text-blue-600">+91-9876543210</p>
                <p className="text-xs text-blue-500">24/7 during pilot</p>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-green-800 mb-2">Email Support</h3>
                <p className="text-sm text-green-600">support@vitalvue.org</p>
                <p className="text-xs text-green-500">Response within 2 hours</p>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-purple-800 mb-2">Telegram Support</h3>
                <p className="text-sm text-purple-600">@VitalVueSupport</p>
                <p className="text-xs text-purple-500">Real-time chat support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PilotChecklist;

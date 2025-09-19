import React from 'react';

const ProblemStatement: React.FC = () => {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Problem Statement</h1>
          <p className="text-xl text-gray-600">Addressing critical gaps in public health surveillance</p>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="card mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Disease Surveillance Gaps</h2>
            <p className="text-gray-700 mb-4">
              Current public health surveillance systems face significant challenges in rural and remote areas, 
              particularly in developing regions where infrastructure is limited and connectivity is unreliable. 
              Traditional paper-based reporting systems are slow, error-prone, and lack real-time visibility 
              into emerging health threats.
            </p>
            <p className="text-gray-700 mb-4">
              Key challenges include:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>Delayed reporting due to manual processes and poor connectivity</li>
              <li>Lack of real-time data aggregation and analysis capabilities</li>
              <li>Limited integration with environmental monitoring systems</li>
              <li>Insufficient early warning mechanisms for disease outbreaks</li>
              <li>High cost of deployment and maintenance in resource-constrained settings</li>
            </ul>
          </div>

          <div className="card mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Target Users</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-health-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-health-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg mb-2">ASHA / Community Volunteers</h3>
                <p className="text-sm text-gray-600">
                  Frontline health workers who need offline-capable tools for data collection 
                  and reporting in remote areas with limited connectivity.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg mb-2">Health Officials (Supervisors)</h3>
                <p className="text-sm text-gray-600">
                  District and regional health administrators who need real-time dashboards, 
                  alert systems, and data analytics for informed decision-making.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg mb-2">Citizens</h3>
                <p className="text-sm text-gray-600">
                  Community members who need access to health information, 
                  reporting capabilities, and AI-powered health assistance.
                </p>
              </div>
            </div>
          </div>

          <div className="card mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Constraints</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-3 text-gray-800">Technical Constraints</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Mobile-only interface (no desktop access)</li>
                  <li>Intermittent internet connectivity</li>
                  <li>Limited device storage and processing power</li>
                  <li>Battery life optimization requirements</li>
                  <li>Multi-language support (English + local languages)</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-3 text-gray-800">Operational Constraints</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Free and open-source technology stack</li>
                  <li>Minimal personally identifiable information (PII)</li>
                  <li>Local deployment capability</li>
                  <li>Low-cost sensor integration</li>
                  <li>Pilot deployment in one district initially</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Solution Requirements</h2>
            <p className="text-gray-700 mb-4">
              The Vital Vue system must address these challenges through a comprehensive, 
              mobile-first approach that combines offline-capable data collection, 
              real-time sensor integration, and AI-powered analytics.
            </p>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-3 text-gray-800">Core Requirements</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Offline-first mobile application for field data collection</li>
                <li>IoT sensor integration for water quality monitoring</li>
                <li>Machine learning algorithms for outbreak prediction</li>
                <li>Multi-channel alert system (FCM, Telegram, Email)</li>
                <li>AI-powered chatbot for health information and guidance</li>
                <li>Self-hostable, open-source infrastructure</li>
                <li>Comprehensive monitoring and logging capabilities</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemStatement;

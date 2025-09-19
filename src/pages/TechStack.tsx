import React from 'react';

const TechStack: React.FC = () => {
  const technologies = [
    {
      category: 'Mobile UI',
      primary: 'React + Tailwind (mobile-first)',
      primaryRationale: 'Fast development, excellent mobile performance, large ecosystem',
      alternative: 'Flutter (single binary mobile)',
      alternativeRationale: 'Better for native mobile apps, single codebase'
    },
    {
      category: 'Backend API',
      primary: 'FastAPI (Python)',
      primaryRationale: 'High performance, automatic OpenAPI docs, type safety',
      alternative: 'Node.js + Express',
      alternativeRationale: 'JavaScript ecosystem, real-time capabilities'
    },
    {
      category: 'Database',
      primary: 'PostgreSQL + TimescaleDB',
      primaryRationale: 'ACID compliance, time-series optimization, mature ecosystem',
      alternative: 'Postgres time-series tables or InfluxDB',
      alternativeRationale: 'Simpler setup, specialized time-series DB'
    },
    {
      category: 'Object Storage',
      primary: 'MinIO',
      primaryRationale: 'S3-compatible, self-hostable, local deployment',
      alternative: 'Local disk for pilot',
      alternativeRationale: 'Simpler setup, no additional service'
    },
    {
      category: 'MQTT',
      primary: 'Eclipse Mosquitto',
      primaryRationale: 'Lightweight, reliable, open-source, good documentation',
      alternative: 'EMQX Community',
      alternativeRationale: 'More features, better scalability'
    },
    {
      category: 'Queue',
      primary: 'Redis + RQ',
      primaryRationale: 'Simple Python integration, reliable job processing',
      alternative: 'Celery + Redis',
      alternativeRationale: 'More features, better monitoring'
    },
    {
      category: 'ML Libraries',
      primary: 'scikit-learn, XGBoost, Prophet',
      primaryRationale: 'Mature libraries, good performance, easy deployment',
      alternative: 'PyTorch for advanced models',
      alternativeRationale: 'More powerful, better for deep learning'
    },
    {
      category: 'Chatbot',
      primary: 'Rasa Open Source',
      primaryRationale: 'Conversational AI, multi-language, self-hostable',
      alternative: 'Rule-based fallback',
      alternativeRationale: 'Simpler, no ML dependencies'
    },
    {
      category: 'ASR/TTS',
      primary: 'Vosk / Whisper (server), Coqui TTS',
      primaryRationale: 'Offline capable, open-source, good accuracy',
      alternative: 'Google Cloud Speech API',
      alternativeRationale: 'Better accuracy, cloud-based'
    },
    {
      category: 'Monitoring',
      primary: 'Prometheus + Grafana + Loki',
      primaryRationale: 'Complete observability stack, open-source',
      alternative: 'DataDog / New Relic',
      alternativeRationale: 'Managed service, better UX'
    },
    {
      category: 'CI/CD',
      primary: 'GitHub Actions',
      primaryRationale: 'Integrated with GitHub, free for public repos',
      alternative: 'GitLab CI/CD',
      alternativeRationale: 'More features, self-hostable'
    },
    {
      category: 'Containerization',
      primary: 'Docker + Docker Compose',
      primaryRationale: 'Industry standard, easy deployment, reproducible',
      alternative: 'Kubernetes',
      alternativeRationale: 'Better orchestration, production-ready'
    },
    {
      category: 'TLS/SSL',
      primary: "Let's Encrypt",
      primaryRationale: 'Free certificates, automatic renewal, widely supported',
      alternative: 'Self-signed certificates',
      alternativeRationale: 'No external dependencies, internal use'
    }
  ];

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Technology Stack</h1>
          <p className="text-xl text-gray-600">Carefully selected technologies for optimal performance and maintainability</p>
        </div>

        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Technology Choices & Rationale</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-800">Component</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-800">Primary Choice</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-800">Rationale</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-800">Alternative</th>
                </tr>
              </thead>
              <tbody>
                {technologies.map((tech, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 font-medium text-gray-900">{tech.category}</td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-primary-600">{tech.primary}</div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-700">{tech.primaryRationale}</td>
                    <td className="py-4 px-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-600">{tech.alternative}</div>
                        <div className="text-xs text-gray-500 mt-1">{tech.alternativeRationale}</div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Primary Stack Benefits</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-gray-700">All technologies are open-source and self-hostable</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-gray-700">Optimized for mobile-first, offline-capable operation</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-gray-700">Mature, well-documented technologies with large communities</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-gray-700">Low resource requirements suitable for rural deployment</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-gray-700">Comprehensive monitoring and logging capabilities</span>
              </li>
            </ul>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Deployment Considerations</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-gray-700">Docker Compose for easy local deployment</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-gray-700">Minimal external dependencies for offline operation</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-gray-700">Scalable architecture for future expansion</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-gray-700">Cost-effective for resource-constrained environments</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-gray-700">Easy maintenance and updates</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Technology Integration</h2>
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-gray-700 mb-4">
              The selected technology stack is designed to work seamlessly together, with each component 
              chosen for its specific strengths while maintaining compatibility and ease of integration.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Performance</h3>
                <p className="text-sm text-gray-600">Optimized for speed and efficiency</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Reliability</h3>
                <p className="text-sm text-gray-600">Proven technologies with strong track records</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Maintainability</h3>
                <p className="text-sm text-gray-600">Easy to maintain and extend</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechStack;

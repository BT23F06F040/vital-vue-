import React from 'react';

const Security: React.FC = () => {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Security & Privacy</h1>
          <p className="text-xl text-gray-600">Comprehensive security measures and privacy protection</p>
        </div>

        <div className="space-y-8">
          {/* Security Checklist */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Checklist</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-primary-600">Transport Security</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span>TLS 1.3 encryption for all communications</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span>Let's Encrypt certificates with auto-renewal</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span>HSTS headers for secure connections</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span>Certificate pinning for mobile apps</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4 text-green-600">Authentication & Authorization</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span>JWT tokens with short expiration (1 hour)</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span>Refresh tokens for session management</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span>Role-based access control (RBAC)</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span>Multi-factor authentication for admins</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4 text-purple-600">Data Protection</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span>SHA-256 hashing for reporter IDs</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span>Minimal PII collection and storage</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span>Encryption at rest (AES-256)</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span>Data anonymization for analytics</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4 text-orange-600">Device Security</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span>Certificate-based IoT device authentication</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span>Token rotation for field devices</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span>HMAC signatures for data integrity</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span>Secure device provisioning</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Privacy Measures */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Privacy Protection</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Data Minimization</h3>
                <p className="text-gray-700 mb-4">
                  We collect only the minimum data necessary for public health surveillance while 
                  protecting individual privacy through technical and administrative measures.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">What We Collect</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Hashed reporter identifiers</li>
                      <li>• Symptom reports (anonymized)</li>
                      <li>• GPS coordinates (rounded to 100m)</li>
                      <li>• Water quality sensor data</li>
                      <li>• Device identifiers (anonymized)</li>
                    </ul>
                  </div>
                  
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-2">What We Don't Collect</h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      <li>• Names or personal identifiers</li>
                      <li>• Phone numbers or addresses</li>
                      <li>• Medical records or history</li>
                      <li>• Biometric information</li>
                      <li>• Financial information</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Consent Management</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700 mb-3">
                    Users must explicitly consent to data collection through a clear, 
                    multi-language consent screen before using the application.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <span>Clear explanation of data usage</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <span>Option to withdraw consent anytime</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <span>Language selection for consent</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <span>Regular consent renewal prompts</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Audit & Compliance */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Audit & Compliance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Audit Logging</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• All data access and modifications logged</li>
                  <li>• User actions tracked with timestamps</li>
                  <li>• System events and errors recorded</li>
                  <li>• Immutable audit trail maintained</li>
                  <li>• Regular audit log analysis</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Compliance Standards</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• GDPR principles for data protection</li>
                  <li>• Local health data regulations</li>
                  <li>• Open source security best practices</li>
                  <li>• Regular security assessments</li>
                  <li>• Incident response procedures</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Security Architecture */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Architecture</h2>
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Defense in Depth</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-sm mb-2">Network Security</h4>
                    <p className="text-xs text-gray-600">Firewalls, VPNs, network segmentation</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-sm mb-2">Application Security</h4>
                    <p className="text-xs text-gray-600">Input validation, authentication, authorization</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-sm mb-2">Data Security</h4>
                    <p className="text-xs text-gray-600">Encryption, access controls, backup</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Incident Response */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Incident Response Plan</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="font-semibold text-red-800 mb-2">Detection & Analysis</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Automated monitoring and alerting</li>
                  <li>• Security event correlation</li>
                  <li>• Threat intelligence integration</li>
                  <li>• Incident classification and prioritization</li>
                </ul>
              </div>
              
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibold text-orange-800 mb-2">Containment & Eradication</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Immediate threat isolation</li>
                  <li>• System quarantine procedures</li>
                  <li>• Malware removal and patching</li>
                  <li>• Evidence preservation</li>
                </ul>
              </div>
              
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-green-800 mb-2">Recovery & Lessons Learned</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• System restoration procedures</li>
                  <li>• Data integrity verification</li>
                  <li>• Post-incident analysis</li>
                  <li>• Security improvement implementation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Security;

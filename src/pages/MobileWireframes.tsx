import React from 'react';

const MobileWireframes: React.FC = () => {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Mobile Wireframes</h1>
          <p className="text-xl text-gray-600">Mobile-first UI design for field workers and administrators</p>
        </div>

        {/* Field App Wireframes */}
        <div className="card mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Field App (ASHA Workers)</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Login Screen */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-primary-600">1. Login / Consent Screen</h3>
              <div className="bg-gray-50 rounded-lg p-4 text-sm">
                <div className="mb-4">
                  <div className="bg-white rounded-lg p-3 mb-2">
                    <div className="text-center mb-4">
                      <div className="w-16 h-16 bg-primary-100 rounded-full mx-auto mb-2"></div>
                      <h4 className="font-semibold">Vital Vue</h4>
                    </div>
                    <div className="space-y-3">
                      <input className="w-full p-2 border rounded" placeholder="Phone (optional)" />
                      <select className="w-full p-2 border rounded">
                        <option>English</option>
                        <option>हिन्दी</option>
                        <option>తెలుగు</option>
                      </select>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span className="text-xs">I consent to data collection</span>
                      </label>
                      <button className="w-full bg-primary-600 text-white p-2 rounded">Continue</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Home Screen */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-green-600">2. Home / Nearby Hotspots</h3>
              <div className="bg-gray-50 rounded-lg p-4 text-sm">
                <div className="mb-4">
                  <div className="bg-white rounded-lg p-3 mb-2">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold">Nearby Reports</h4>
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">3 alerts</span>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center p-2 bg-yellow-50 rounded">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                        <div className="flex-1">
                          <div className="font-medium text-xs">High fever cases</div>
                          <div className="text-xs text-gray-500">500m away</div>
                        </div>
                      </div>
                      <div className="flex items-center p-2 bg-yellow-50 rounded">
                        <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                        <div className="flex-1">
                          <div className="font-medium text-xs">Water quality alert</div>
                          <div className="text-xs text-gray-500">1.2km away</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-100 rounded h-20 mb-3 flex items-center justify-center">
                      <span className="text-xs text-gray-500">Map View</span>
                    </div>
                    <button className="w-full bg-green-600 text-white p-2 rounded flex items-center justify-center">
                      <span className="mr-2">+</span> New Report
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* New Report Form */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-purple-600">3. New Report Form</h3>
              <div className="bg-gray-50 rounded-lg p-4 text-sm">
                <div className="mb-4">
                  <div className="bg-white rounded-lg p-3 mb-2">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold">Health Report</h4>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">Draft</span>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium mb-1">Symptoms (select all)</label>
                        <div className="space-y-1">
                          <label className="flex items-center"><input type="checkbox" className="mr-2" /> Fever</label>
                          <label className="flex items-center"><input type="checkbox" className="mr-2" /> Diarrhea</label>
                          <label className="flex items-center"><input type="checkbox" className="mr-2" /> Vomiting</label>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Patient Count</label>
                        <input type="number" className="w-full p-2 border rounded" placeholder="0" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Photos</label>
                        <div className="flex space-x-2">
                          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">📷</div>
                          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">+</div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Voice Note</label>
                        <button className="w-full p-2 border rounded flex items-center justify-center">
                          🎤 Record
                        </button>
                      </div>
                      <div className="flex space-x-2">
                        <button className="flex-1 bg-gray-200 p-2 rounded">Save Offline</button>
                        <button className="flex-1 bg-primary-600 text-white p-2 rounded">Submit</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* BLE Water Kit */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-blue-600">4. BLE Water Kit Pairing</h3>
              <div className="bg-gray-50 rounded-lg p-4 text-sm">
                <div className="mb-4">
                  <div className="bg-white rounded-lg p-3 mb-2">
                    <div className="text-center mb-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                        🔬
                      </div>
                      <h4 className="font-semibold">Water Quality Test</h4>
                    </div>
                    <div className="space-y-3">
                      <div className="text-center">
                        <div className="w-8 h-8 bg-blue-500 rounded-full mx-auto mb-2 animate-pulse"></div>
                        <p className="text-xs">Scanning for devices...</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-gray-100 rounded">
                          <span className="text-xs">Water Kit #001</span>
                          <button className="text-xs bg-blue-600 text-white px-2 py-1 rounded">Pair</button>
                        </div>
                      </div>
                      <div className="bg-green-50 p-3 rounded">
                        <div className="text-xs font-medium text-green-800 mb-1">Test Results</div>
                        <div className="text-xs space-y-1">
                          <div>pH: 6.8</div>
                          <div>Coliform: 150 CFU/100ml</div>
                          <div>Status: ⚠️ Unsafe</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sync Status */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-orange-600">5. Offline Sync Status</h3>
              <div className="bg-gray-50 rounded-lg p-4 text-sm">
                <div className="mb-4">
                  <div className="bg-white rounded-lg p-3 mb-2">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold">Sync Status</h4>
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Offline</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs">Queued Reports</span>
                        <span className="text-xs font-medium">3</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs">Last Sync</span>
                        <span className="text-xs text-gray-500">2 hours ago</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                          <span className="text-xs">Report #001</span>
                          <span className="text-xs text-yellow-600">Pending</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                          <span className="text-xs">Report #002</span>
                          <span className="text-xs text-yellow-600">Pending</span>
                        </div>
                      </div>
                      <button className="w-full bg-orange-600 text-white p-2 rounded">Manual Sync</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Report History */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-red-600">6. Report History</h3>
              <div className="bg-gray-50 rounded-lg p-4 text-sm">
                <div className="mb-4">
                  <div className="bg-white rounded-lg p-3 mb-2">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold">My Reports</h4>
                      <select className="text-xs border rounded px-2 py-1">
                        <option>All</option>
                        <option>Synced</option>
                        <option>Pending</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                        <div>
                          <div className="text-xs font-medium">Fever cases - Village A</div>
                          <div className="text-xs text-gray-500">2 hours ago</div>
                        </div>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Synced</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                        <div>
                          <div className="text-xs font-medium">Water quality - Well #1</div>
                          <div className="text-xs text-gray-500">4 hours ago</div>
                        </div>
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Pending</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                        <div>
                          <div className="text-xs font-medium">Diarrhea outbreak</div>
                          <div className="text-xs text-gray-500">1 day ago</div>
                        </div>
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Conflict</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Admin App Wireframes */}
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Admin App (Health Officials)</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Admin Login */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-primary-600">1. Admin Login & Region</h3>
              <div className="bg-gray-50 rounded-lg p-4 text-sm">
                <div className="mb-4">
                  <div className="bg-white rounded-lg p-3 mb-2">
                    <div className="text-center mb-4">
                      <div className="w-16 h-16 bg-primary-100 rounded-full mx-auto mb-2"></div>
                      <h4 className="font-semibold">Admin Portal</h4>
                    </div>
                    <div className="space-y-3">
                      <input className="w-full p-2 border rounded" placeholder="Username" />
                      <input className="w-full p-2 border rounded" placeholder="Password" type="password" />
                      <select className="w-full p-2 border rounded">
                        <option>Select Region</option>
                        <option>District A</option>
                        <option>District B</option>
                      </select>
                      <button className="w-full bg-primary-600 text-white p-2 rounded">Login</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hotspot Map */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-green-600">2. Hotspot Map</h3>
              <div className="bg-gray-50 rounded-lg p-4 text-sm">
                <div className="mb-4">
                  <div className="bg-white rounded-lg p-3 mb-2">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold">Disease Hotspots</h4>
                      <select className="text-xs border rounded px-2 py-1">
                        <option>Last 7 days</option>
                        <option>Last 30 days</option>
                      </select>
                    </div>
                    <div className="bg-gray-100 rounded h-32 mb-3 flex items-center justify-center relative">
                      <span className="text-xs text-gray-500">Map with heatmap overlay</span>
                      <div className="absolute top-2 left-2 bg-red-500 w-3 h-3 rounded-full"></div>
                      <div className="absolute top-8 right-4 bg-orange-500 w-3 h-3 rounded-full"></div>
                      <div className="absolute bottom-4 left-8 bg-yellow-500 w-3 h-3 rounded-full"></div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center text-xs">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                        <span>High risk (5+ cases)</span>
                      </div>
                      <div className="flex items-center text-xs">
                        <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                        <span>Medium risk (2-4 cases)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Alert Inbox */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-purple-600">3. Alert Inbox</h3>
              <div className="bg-gray-50 rounded-lg p-4 text-sm">
                <div className="mb-4">
                  <div className="bg-white rounded-lg p-3 mb-2">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold">Alerts</h4>
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">5 new</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                        <div>
                          <div className="text-xs font-medium text-red-800">Critical: Outbreak Alert</div>
                          <div className="text-xs text-gray-500">Village A - 2 hours ago</div>
                        </div>
                        <button className="text-xs bg-red-600 text-white px-2 py-1 rounded">Ack</button>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-orange-50 rounded">
                        <div>
                          <div className="text-xs font-medium text-orange-800">High: Water Quality</div>
                          <div className="text-xs text-gray-500">Well #1 - 4 hours ago</div>
                        </div>
                        <button className="text-xs bg-orange-600 text-white px-2 py-1 rounded">Ack</button>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                        <div>
                          <div className="text-xs font-medium text-yellow-800">Medium: Sensor Offline</div>
                          <div className="text-xs text-gray-500">Sensor #003 - 1 day ago</div>
                        </div>
                        <button className="text-xs bg-yellow-600 text-white px-2 py-1 rounded">Ack</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Report Detail */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-blue-600">4. Report Detail View</h3>
              <div className="bg-gray-50 rounded-lg p-4 text-sm">
                <div className="mb-4">
                  <div className="bg-white rounded-lg p-3 mb-2">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold">Report #001</h4>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Synced</span>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs font-medium mb-1">Location</div>
                        <div className="text-xs text-gray-600">Village A, District B</div>
                      </div>
                      <div>
                        <div className="text-xs font-medium mb-1">Symptoms</div>
                        <div className="flex flex-wrap gap-1">
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Fever</span>
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Diarrhea</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-medium mb-1">Photos</div>
                        <div className="flex space-x-2">
                          <div className="w-12 h-12 bg-gray-200 rounded"></div>
                          <div className="w-12 h-12 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="flex-1 bg-blue-600 text-white p-2 rounded text-xs">Assign Task</button>
                        <button className="flex-1 bg-gray-200 p-2 rounded text-xs">View History</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Intervention Tracker */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-orange-600">5. Intervention Tracker</h3>
              <div className="bg-gray-50 rounded-lg p-4 text-sm">
                <div className="mb-4">
                  <div className="bg-white rounded-lg p-3 mb-2">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold">Active Tasks</h4>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">3 active</span>
                    </div>
                    <div className="space-y-2">
                      <div className="p-2 bg-yellow-50 rounded">
                        <div className="text-xs font-medium">Water Testing - Village A</div>
                        <div className="text-xs text-gray-500">Assigned to: Health Worker #1</div>
                        <div className="text-xs text-yellow-600">In Progress</div>
                      </div>
                      <div className="p-2 bg-green-50 rounded">
                        <div className="text-xs font-medium">Health Education - Village B</div>
                        <div className="text-xs text-gray-500">Assigned to: ASHA #2</div>
                        <div className="text-xs text-green-600">Completed</div>
                      </div>
                      <div className="p-2 bg-red-50 rounded">
                        <div className="text-xs font-medium">Emergency Response - Village C</div>
                        <div className="text-xs text-gray-500">Assigned to: Medical Team</div>
                        <div className="text-xs text-red-600">Overdue</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ML Dashboard */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-red-600">6. ML Dashboard</h3>
              <div className="bg-gray-50 rounded-lg p-4 text-sm">
                <div className="mb-4">
                  <div className="bg-white rounded-lg p-3 mb-2">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold">Outbreak Forecast</h4>
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">High Risk</span>
                    </div>
                    <div className="space-y-3">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">73%</div>
                        <div className="text-xs text-gray-500">Outbreak Probability</div>
                      </div>
                      <div>
                        <div className="text-xs font-medium mb-1">Top Risk Factors</div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Symptom count trend</span>
                            <span className="text-red-600">+32%</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span>Water quality</span>
                            <span className="text-orange-600">Poor</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-100 rounded h-16 flex items-center justify-center">
                        <span className="text-xs text-gray-500">Time Series Chart</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileWireframes;

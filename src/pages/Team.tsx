import React from 'react';

const team = [
  { name: 'Project Lead', role: 'Architecture & Backend', photo: '', bio: 'FastAPI, Postgres, DevOps' },
  { name: 'Mobile Lead', role: 'Flutter & Offline', photo: '', bio: 'Flutter, BLE, SQLite' },
  { name: 'Data/ML', role: 'Analytics & Forecasting', photo: '', bio: 'scikit-learn, XGBoost, Prophet' },
  { name: 'IoT/Edge', role: 'Sensors & MQTT', photo: '', bio: 'Mosquitto, TimescaleDB' },
  { name: 'UX & Content', role: 'Design & Localization', photo: '', bio: 'Wireframes, Multilingual' },
];

const Team: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Team</h1>
        <p className="text-gray-600">Member profiles with roles</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {team.map((m) => (
          <div key={m.name} className="bg-white rounded-lg shadow p-6 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
              {/* Placeholder avatar */}
              {m.name.split(' ').map((x) => x[0]).join('').slice(0, 2)}
            </div>
            <div>
              <div className="font-semibold">{m.name}</div>
              <div className="text-primary-600 text-sm">{m.role}</div>
              <div className="text-gray-600 text-sm mt-1">{m.bio}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;



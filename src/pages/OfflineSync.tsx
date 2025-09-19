import React from 'react';
import CodeBlock from '../components/CodeBlock';

const OfflineSync: React.FC = () => {
  const sqliteSchema = `-- SQLite schema for offline mobile app
CREATE TABLE reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    server_id TEXT, -- Server-assigned ID after sync
    reporter_id TEXT NOT NULL,
    region_id TEXT NOT NULL,
    gps_latitude REAL,
    gps_longitude REAL,
    language TEXT DEFAULT 'en',
    symptoms TEXT, -- JSON array as string
    patient_count INTEGER DEFAULT 0,
    photos TEXT, -- JSON array as string
    water_observed_flag INTEGER DEFAULT 0,
    voice_note_url TEXT,
    status TEXT DEFAULT 'pending', -- pending, synced, conflict
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sensor_readings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    server_id TEXT,
    sensor_id TEXT NOT NULL,
    timestamp DATETIME NOT NULL,
    latitude REAL,
    longitude REAL,
    turbidity REAL,
    ph REAL,
    electrical_conductivity REAL,
    coliform_level REAL,
    battery_level REAL,
    raw_data TEXT, -- JSON as string
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Change log for sync tracking
CREATE TABLE change_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_seq INTEGER UNIQUE NOT NULL, -- Monotonic client sequence
    entity TEXT NOT NULL, -- 'reports', 'sensor_readings'
    entity_id INTEGER NOT NULL, -- Local entity ID
    operation TEXT NOT NULL, -- 'CREATE', 'UPDATE', 'DELETE'
    payload TEXT NOT NULL, -- JSON payload
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    synced_server_seq INTEGER -- Server sequence after sync
);

-- Indexes for performance
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_change_log_client_seq ON change_log(client_seq);
CREATE INDEX idx_change_log_synced ON change_log(synced_server_seq);`;

  const syncFlow = `// Offline Sync Implementation Flow

// 1. Client prepares sync batch
async function prepareSyncBatch() {
    const unsyncedChanges = await db.query(
        'SELECT * FROM change_log WHERE synced_server_seq IS NULL ORDER BY client_seq'
    );
    
    return {
        client_id: deviceId,
        last_server_seq: lastKnownServerSeq,
        changes: unsyncedChanges
    };
}

// 2. Send sync request to server
async function syncWithServer() {
    const syncData = await prepareSyncBatch();
    
    const response = await fetch('/api/v1/sync', {
        method: 'POST',
        headers: {
            'Authorization': \`Bearer \${accessToken}\`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(syncData)
    });
    
    const result = await response.json();
    return result;
}

// 3. Process server response
async function processSyncResponse(response) {
    const { server_seq, applied_changes, conflicts } = response;
    
    // Update change_log with server sequences
    for (const change of applied_changes) {
        await db.query(
            'UPDATE change_log SET synced_server_seq = ? WHERE client_seq = ?',
            [change.server_seq, change.client_seq]
        );
        
        // Update local entity with server ID
        if (change.server_id) {
            await db.query(
                \`UPDATE \${change.entity} SET server_id = ? WHERE id = ?\`,
                [change.server_id, change.entity_id]
            );
        }
    }
    
    // Handle conflicts
    if (conflicts.length > 0) {
        await handleConflicts(conflicts);
    }
    
    // Update last known server sequence
    await updateLastServerSeq(server_seq);
}

// 4. Conflict resolution
async function handleConflicts(conflicts) {
    for (const conflict of conflicts) {
        // Mark as conflict for manual resolution
        await db.query(
            'UPDATE change_log SET status = "conflict" WHERE client_seq = ?',
            [conflict.client_seq]
        );
        
        // Store conflict details
        await db.query(
            'INSERT INTO conflict_queue (client_seq, server_value, client_value) VALUES (?, ?, ?)',
            [conflict.client_seq, JSON.stringify(conflict.server_value), JSON.stringify(conflict.client_value)]
        );
    }
}`;

  const mediaUpload = `// Media upload with pre-signed URLs

// 1. Request pre-signed upload URL
async function requestMediaUpload(file) {
    const response = await fetch('/api/v1/media/request-upload', {
        method: 'POST',
        headers: {
            'Authorization': \`Bearer \${accessToken}\`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            filename: file.name,
            content_type: file.type,
            file_size: file.size
        })
    });
    
    const { upload_url, file_url } = await response.json();
    return { upload_url, file_url };
}

// 2. Upload file to MinIO
async function uploadToMinIO(file, uploadUrl) {
    const response = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
            'Content-Type': file.type
        }
    });
    
    if (!response.ok) {
        throw new Error('Upload failed');
    }
}

// 3. Complete media upload flow
async function uploadMedia(file) {
    try {
        // Get pre-signed URL
        const { upload_url, file_url } = await requestMediaUpload(file);
        
        // Upload to MinIO
        await uploadToMinIO(file, upload_url);
        
        // Return the final file URL
        return file_url;
    } catch (error) {
        console.error('Media upload failed:', error);
        throw error;
    }
}`;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Offline Sync Design</h1>
          <p className="text-xl text-gray-600">Robust offline-first data synchronization for unreliable connectivity</p>
        </div>

        <div className="space-y-8">
          {/* Local Database Schema */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Local SQLite Schema</h2>
            <p className="text-gray-700 mb-4">
              The mobile app uses SQLite for local storage with a change log table to track all modifications 
              for synchronization when connectivity is available.
            </p>
            <CodeBlock code={sqliteSchema} language="sql" filename="mobile-schema.sql" />
          </div>

          {/* Sync Flow */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Synchronization Flow</h2>
            <p className="text-gray-700 mb-4">
              The sync process uses client and server sequence numbers to ensure data consistency 
              and handle conflicts gracefully.
            </p>
            <CodeBlock code={syncFlow} language="javascript" filename="sync-flow.js" />
          </div>

          {/* Media Upload */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Media Upload with Pre-signed URLs</h2>
            <p className="text-gray-700 mb-4">
              Photos and voice notes are uploaded using pre-signed MinIO URLs to ensure secure 
              and efficient file transfer.
            </p>
            <CodeBlock code={mediaUpload} language="javascript" filename="media-upload.js" />
          </div>

          {/* Sync Process Details */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Sync Process Details</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800">1. Change Tracking</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Every local change is logged in the <code className="bg-gray-100 px-2 py-1 rounded">change_log</code> table</li>
                  <li>Client sequence numbers are monotonic and unique per device</li>
                  <li>Changes include entity type, operation, and complete payload</li>
                  <li>Server sequence numbers are assigned during sync</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800">2. Sync Request</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Client batches unsynced changes in chronological order</li>
                  <li>Includes <code className="bg-gray-100 px-2 py-1 rounded">last_server_seq</code> to get server updates</li>
                  <li>Server validates and applies changes atomically</li>
                  <li>Returns mapping of client_seq to server_seq</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800">3. Conflict Resolution</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Default strategy: "server wins" for automatic resolution</li>
                  <li>Critical conflicts are flagged for manual review</li>
                  <li>Conflicts are queued in admin interface</li>
                  <li>Client is notified of resolution status</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800">4. Sync Frequency</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Background sync when connectivity is detected</li>
                  <li>Manual sync option for immediate synchronization</li>
                  <li>Exponential backoff for failed sync attempts</li>
                  <li>Retry queue for failed changes</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Error Handling */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Error Handling & Recovery</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Network Errors</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Automatic retry with exponential backoff</li>
                  <li>• Queue changes for later sync</li>
                  <li>• Show sync status to user</li>
                  <li>• Manual retry option</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Data Conflicts</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Flag conflicts for manual resolution</li>
                  <li>• Preserve both versions</li>
                  <li>• Admin interface for conflict resolution</li>
                  <li>• Notify users of conflicts</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Storage Issues</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Monitor local storage usage</li>
                  <li>• Clean up old synced data</li>
                  <li>• Compress media files</li>
                  <li>• Alert user of low storage</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Authentication</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Refresh tokens automatically</li>
                  <li>• Re-authenticate on token expiry</li>
                  <li>• Queue changes during auth issues</li>
                  <li>• Graceful degradation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfflineSync;

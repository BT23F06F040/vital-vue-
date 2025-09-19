import React from 'react';
import CodeBlock from '../components/CodeBlock';
import DownloadButton from '../components/DownloadButton';

const OpenAPI: React.FC = () => {
  const openAPISpec = `openapi: 3.0.0
info:
  title: Vital Vue API
  version: 1.0.0
  description: Mobile-first Public Health Surveillance API
  contact:
    name: Vital Vue Team
    email: team@vitalvue.org
  license:
    name: MIT
    url: https://opensource.org/licenses/MIT

servers:
  - url: https://api.vitalvue.org/v1
    description: Production server
  - url: http://localhost:8000/v1
    description: Development server

security:
  - bearerAuth: []

paths:
  /auth/login:
    post:
      summary: User authentication
      description: Authenticate user and return JWT token
      tags: [Authentication]
      security: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [username, password]
              properties:
                username:
                  type: string
                  example: "asha_worker_001"
                password:
                  type: string
                  example: "secure_password"
                device_id:
                  type: string
                  example: "device_12345"
      responses:
        '200':
          description: Authentication successful
          content:
            application/json:
              schema:
                type: object
                properties:
                  access_token:
                    type: string
                    example: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
                  token_type:
                    type: string
                    example: "bearer"
                  expires_in:
                    type: integer
                    example: 3600
                  user:
                    $ref: '#/components/schemas/User'
        '401':
          description: Invalid credentials
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /reports:
    post:
      summary: Create new health report
      description: Submit a new health surveillance report
      tags: [Reports]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ReportCreate'
      responses:
        '201':
          description: Report created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Report'
        '400':
          description: Invalid report data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

    get:
      summary: List health reports
      description: Retrieve paginated list of health reports
      tags: [Reports]
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: limit
          in: query
          schema:
            type: integer
            default: 20
        - name: region_id
          in: query
          schema:
            type: string
        - name: status
          in: query
          schema:
            type: string
            enum: [pending, synced, conflict]
      responses:
        '200':
          description: List of reports
          content:
            application/json:
              schema:
                type: object
                properties:
                  reports:
                    type: array
                    items:
                      $ref: '#/components/schemas/Report'
                  total:
                    type: integer
                  page:
                    type: integer
                  limit:
                    type: integer

  /reports/{report_id}:
    get:
      summary: Get report details
      description: Retrieve detailed information about a specific report
      tags: [Reports]
      parameters:
        - name: report_id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Report details
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Report'
        '404':
          description: Report not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /sync:
    post:
      summary: Synchronize offline data
      description: Sync offline data from mobile device to server
      tags: [Sync]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [client_id, changes]
              properties:
                client_id:
                  type: string
                  example: "device_12345"
                last_server_seq:
                  type: integer
                  example: 1000
                changes:
                  type: array
                  items:
                    $ref: '#/components/schemas/ChangeLog'
      responses:
        '200':
          description: Sync successful
          content:
            application/json:
              schema:
                type: object
                properties:
                  server_seq:
                    type: integer
                  applied_changes:
                    type: array
                    items:
                      type: object
                      properties:
                        client_seq:
                          type: integer
                        server_seq:
                          type: integer
                        conflict:
                          type: boolean
                  conflicts:
                    type: array
                    items:
                      $ref: '#/components/schemas/Conflict'

  /sensors:
    post:
      summary: Submit sensor reading
      description: Submit sensor data from IoT devices
      tags: [Sensors]
      security: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/SensorReading'
      responses:
        '201':
          description: Sensor reading recorded
          content:
            application/json:
              schema:
                type: object
                properties:
                  id:
                    type: string
                  timestamp:
                    type: string
                    format: date-time

  /sensors/{sensor_id}/latest:
    get:
      summary: Get latest sensor reading
      description: Retrieve the most recent reading from a specific sensor
      tags: [Sensors]
      parameters:
        - name: sensor_id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Latest sensor reading
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/SensorReading'
        '404':
          description: Sensor not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /alerts:
    get:
      summary: List alerts
      description: Retrieve system alerts and notifications
      tags: [Alerts]
      parameters:
        - name: priority
          in: query
          schema:
            type: string
            enum: [critical, high, medium, info]
        - name: region_id
          in: query
          schema:
            type: string
        - name: status
          in: query
          schema:
            type: string
            enum: [active, acknowledged, resolved]
      responses:
        '200':
          description: List of alerts
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Alert'

  /alerts/{alert_id}/ack:
    post:
      summary: Acknowledge alert
      description: Acknowledge an alert to mark it as reviewed
      tags: [Alerts]
      parameters:
        - name: alert_id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Alert acknowledged
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Alert'

  /forecast:
    get:
      summary: Get outbreak forecast
      description: Retrieve ML-powered outbreak probability forecast
      tags: [ML]
      parameters:
        - name: region_id
          in: query
          schema:
            type: string
        - name: horizon
          in: query
          schema:
            type: integer
            default: 7
            minimum: 1
            maximum: 30
      responses:
        '200':
          description: Forecast data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Forecast'

  /chatbot/message:
    post:
      summary: Send message to chatbot
      description: Send a message to the AI chatbot for health information
      tags: [Chatbot]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [message, language]
              properties:
                message:
                  type: string
                  example: "What are the symptoms of waterborne diseases?"
                language:
                  type: string
                  example: "en"
                user_id:
                  type: string
                  example: "user_12345"
      responses:
        '200':
          description: Chatbot response
          content:
            application/json:
              schema:
                type: object
                properties:
                  response:
                    type: string
                  confidence:
                    type: number
                    minimum: 0
                    maximum: 1
                  suggestions:
                    type: array
                    items:
                      type: string

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  schemas:
    User:
      type: object
      properties:
        id:
          type: string
        username:
          type: string
        role:
          type: string
          enum: [field_reporter, admin, supervisor]
        region_id:
          type: string
        created_at:
          type: string
          format: date-time

    Report:
      type: object
      properties:
        id:
          type: string
        reporter_id:
          type: string
        region_id:
          type: string
        gps_lat:
          type: number
          format: float
        gps_lon:
          type: number
          format: float
        language:
          type: string
        symptoms:
          type: array
          items:
            type: string
        patient_count:
          type: integer
        photos:
          type: array
          items:
            type: string
        water_observed_flag:
          type: boolean
        timestamp:
          type: string
          format: date-time
        status:
          type: string
          enum: [pending, synced, conflict]
        created_at:
          type: string
          format: date-time
        updated_at:
          type: string
          format: date-time

    ReportCreate:
      type: object
      required: [reporter_id, region_id, gps_lat, gps_lon, language, symptoms, patient_count]
      properties:
        reporter_id:
          type: string
        region_id:
          type: string
        gps_lat:
          type: number
          format: float
        gps_lon:
          type: number
          format: float
        language:
          type: string
        symptoms:
          type: array
          items:
            type: string
        patient_count:
          type: integer
        photos:
          type: array
          items:
            type: string
        water_observed_flag:
          type: boolean
          default: false

    SensorReading:
      type: object
      properties:
        sensor_id:
          type: string
        timestamp:
          type: string
          format: date-time
        latitude:
          type: number
          format: float
        longitude:
          type: number
          format: float
        parameters:
          type: object
          properties:
            turbidity:
              type: number
              format: float
            ph:
              type: number
              format: float
            electrical_conductivity:
              type: number
              format: float
            coliform_level:
              type: number
              format: float
            battery_level:
              type: number
              format: float

    Alert:
      type: object
      properties:
        id:
          type: string
        title:
          type: string
        description:
          type: string
        priority:
          type: string
          enum: [critical, high, medium, info]
        region_id:
          type: string
        status:
          type: string
          enum: [active, acknowledged, resolved]
        created_at:
          type: string
          format: date-time
        acknowledged_at:
          type: string
          format: date-time
        resolved_at:
          type: string
          format: date-time

    Forecast:
      type: object
      properties:
        region_id:
          type: string
        horizon_days:
          type: integer
        probability:
          type: number
          format: float
          minimum: 0
          maximum: 1
        confidence:
          type: number
          format: float
          minimum: 0
          maximum: 1
        top_features:
          type: array
          items:
            type: object
            properties:
              feature:
                type: string
              importance:
                type: number
                format: float
        generated_at:
          type: string
          format: date-time

    ChangeLog:
      type: object
      properties:
        client_seq:
          type: integer
        entity:
          type: string
        entity_id:
          type: string
        operation:
          type: string
          enum: [CREATE, UPDATE, DELETE]
        payload:
          type: object
        timestamp:
          type: string
          format: date-time

    Conflict:
      type: object
      properties:
        client_seq:
          type: integer
        entity:
          type: string
        entity_id:
          type: string
        server_value:
          type: object
        client_value:
          type: object
        resolution:
          type: string
          enum: [server_wins, client_wins, manual]

    Error:
      type: object
      properties:
        error:
          type: string
        message:
          type: string
        details:
          type: object`;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">OpenAPI Specification</h1>
          <p className="text-xl text-gray-600">Complete API documentation for Vital Vue system</p>
        </div>

        <div className="card mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">API Specification</h2>
            <DownloadButton
              filename="vital-vue-api.yaml"
              content={openAPISpec}
              mimeType="application/x-yaml"
              className="btn-primary"
            />
          </div>
          <CodeBlock code={openAPISpec} language="yaml" filename="vital-vue-api.yaml" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <h3 className="text-lg font-semibold mb-3 text-primary-600">Authentication</h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• JWT Bearer token authentication</li>
              <li>• Role-based access control (RBAC)</li>
              <li>• Device ID tracking</li>
              <li>• Token refresh mechanism</li>
            </ul>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-3 text-green-600">Reports</h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• Create health surveillance reports</li>
              <li>• List and filter reports</li>
              <li>• Get detailed report information</li>
              <li>• Offline sync support</li>
            </ul>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-3 text-purple-600">Sensors</h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• Submit IoT sensor readings</li>
              <li>• Retrieve latest sensor data</li>
              <li>• Time-series data support</li>
              <li>• Device authentication</li>
            </ul>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-3 text-red-600">Alerts</h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• List system alerts</li>
              <li>• Acknowledge alerts</li>
              <li>• Priority-based filtering</li>
              <li>• Status tracking</li>
            </ul>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-3 text-blue-600">ML Forecast</h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• Outbreak probability prediction</li>
              <li>• Feature importance analysis</li>
              <li>• Configurable forecast horizon</li>
              <li>• Confidence scoring</li>
            </ul>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-3 text-orange-600">Chatbot</h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• AI-powered health assistance</li>
              <li>• Multi-language support</li>
              <li>• Confidence scoring</li>
              <li>• Response suggestions</li>
            </ul>
          </div>
        </div>

        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">API Usage Examples</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Authentication</h3>
              <CodeBlock 
                code={`curl -X POST "https://api.vitalvue.org/v1/auth/login" \\
  -H "Content-Type: application/json" \\
  -d '{
    "username": "asha_worker_001",
    "password": "secure_password",
    "device_id": "device_12345"
  }'`} 
                language="bash" 
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Create Report</h3>
              <CodeBlock 
                code={`curl -X POST "https://api.vitalvue.org/v1/reports" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "reporter_id": "hashed_reporter_123",
    "region_id": "region_001",
    "gps_lat": 12.9716,
    "gps_lon": 77.5946,
    "language": "en",
    "symptoms": ["fever", "diarrhea", "vomiting"],
    "patient_count": 3,
    "water_observed_flag": true
  }'`} 
                language="bash" 
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Get Forecast</h3>
              <CodeBlock 
                code={`curl -X GET "https://api.vitalvue.org/v1/forecast?region_id=region_001&horizon=7" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"`} 
                language="bash" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenAPI;

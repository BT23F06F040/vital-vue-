import React from 'react';
import CodeBlock from '../components/CodeBlock';

const IoTIngestion: React.FC = () => {
  const mqttConsumer = `# MQTT Consumer Service
import paho.mqtt.client as mqtt
import json
import logging
from datetime import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import SensorReading
import redis
import rq

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MQTTConsumer:
    def __init__(self, broker_host, broker_port, db_url, redis_url):
        self.broker_host = broker_host
        self.broker_port = broker_port
        self.db_url = db_url
        self.redis_url = redis_url
        
        # Database connection
        self.engine = create_engine(db_url)
        Session = sessionmaker(bind=self.engine)
        self.db_session = Session()
        
        # Redis connection
        self.redis_client = redis.from_url(redis_url)
        self.queue = rq.Queue('ml_processing', connection=self.redis_client)
        
        # MQTT client
        self.client = mqtt.Client()
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        self.client.on_disconnect = self.on_disconnect
        
    def on_connect(self, client, userdata, flags, rc):
        if rc == 0:
            logger.info("Connected to MQTT broker")
            # Subscribe to sensor topics
            client.subscribe("sensors/+/+/reading")
            client.subscribe("sensors/+/+/heartbeat")
        else:
            logger.error(f"Failed to connect to MQTT broker: {rc}")
    
    def on_message(self, client, userdata, msg):
        try:
            topic_parts = msg.topic.split('/')
            region_id = topic_parts[1]
            sensor_id = topic_parts[2]
            message_type = topic_parts[3]
            
            payload = json.loads(msg.payload.decode())
            
            if message_type == 'reading':
                self.process_sensor_reading(region_id, sensor_id, payload)
            elif message_type == 'heartbeat':
                self.process_heartbeat(region_id, sensor_id, payload)
                
        except Exception as e:
            logger.error(f"Error processing message: {e}")
    
    def process_sensor_reading(self, region_id, sensor_id, payload):
        """Process sensor reading and store in database"""
        try:
            # Validate payload
            required_fields = ['timestamp', 'parameters']
            if not all(field in payload for field in required_fields):
                logger.warning(f"Invalid payload from sensor {sensor_id}")
                return
            
            # Create sensor reading record
            reading = SensorReading(
                sensor_id=sensor_id,
                region_id=region_id,
                timestamp=datetime.fromisoformat(payload['timestamp']),
                latitude=payload.get('latitude'),
                longitude=payload.get('longitude'),
                turbidity=payload['parameters'].get('turbidity'),
                ph=payload['parameters'].get('ph'),
                electrical_conductivity=payload['parameters'].get('electrical_conductivity'),
                coliform_level=payload['parameters'].get('coliform_level'),
                battery_level=payload['parameters'].get('battery_level'),
                temperature=payload['parameters'].get('temperature'),
                raw_data=payload
            )
            
            # Save to database
            self.db_session.add(reading)
            self.db_session.commit()
            
            logger.info(f"Stored reading from sensor {sensor_id}")
            
            # Queue for ML processing
            self.queue.enqueue('ml_tasks.process_sensor_data', reading.id)
            
            # Publish internal event for downstream processing
            self.publish_internal_event('sensor_reading', {
                'sensor_id': sensor_id,
                'region_id': region_id,
                'reading_id': reading.id,
                'timestamp': payload['timestamp']
            })
            
        except Exception as e:
            logger.error(f"Error processing sensor reading: {e}")
            self.db_session.rollback()
    
    def process_heartbeat(self, region_id, sensor_id, payload):
        """Process sensor heartbeat for health monitoring"""
        try:
            # Update sensor last_seen timestamp
            sensor = self.db_session.query(Sensor).filter_by(sensor_id=sensor_id).first()
            if sensor:
                sensor.last_seen = datetime.utcnow()
                self.db_session.commit()
            
            # Check if sensor is healthy
            self.check_sensor_health(sensor_id, payload)
            
        except Exception as e:
            logger.error(f"Error processing heartbeat: {e}")
    
    def check_sensor_health(self, sensor_id, payload):
        """Check sensor health and generate alerts if needed"""
        battery_level = payload.get('battery_level', 100)
        signal_strength = payload.get('signal_strength', 0)
        
        # Check battery level
        if battery_level < 20:
            self.create_alert({
                'title': f'Low Battery Alert - {sensor_id}',
                'description': f'Sensor {sensor_id} battery level is {battery_level}%',
                'priority': 'medium',
                'sensor_id': sensor_id,
                'alert_type': 'sensor_health'
            })
        
        # Check signal strength
        if signal_strength < -80:
            self.create_alert({
                'title': f'Weak Signal Alert - {sensor_id}',
                'description': f'Sensor {sensor_id} has weak signal strength: {signal_strength} dBm',
                'priority': 'low',
                'sensor_id': sensor_id,
                'alert_type': 'sensor_health'
            })
    
    def publish_internal_event(self, event_type, data):
        """Publish internal event for downstream processing"""
        event = {
            'type': event_type,
            'data': data,
            'timestamp': datetime.utcnow().isoformat()
        }
        
        self.redis_client.publish('internal_events', json.dumps(event))
    
    def create_alert(self, alert_data):
        """Create alert in the system"""
        # This would typically call the alert service
        logger.info(f"Creating alert: {alert_data['title']}")
    
    def on_disconnect(self, client, userdata, rc):
        logger.info("Disconnected from MQTT broker")
    
    def start(self):
        """Start the MQTT consumer"""
        try:
            self.client.connect(self.broker_host, self.broker_port, 60)
            self.client.loop_forever()
        except Exception as e:
            logger.error(f"Error starting MQTT consumer: {e}")

if __name__ == "__main__":
    consumer = MQTTConsumer(
        broker_host="localhost",
        broker_port=1883,
        db_url="postgresql://user:pass@localhost/vitalvue",
        redis_url="redis://localhost:6379"
    )
    consumer.start()`;

  const bleIntegration = `// BLE Water Kit Integration (React Native)
import { BleManager } from 'react-native-ble-plx';

class WaterKitManager {
    constructor() {
        this.bleManager = new BleManager();
        this.connectedDevice = null;
    }
    
    async scanForWaterKits() {
        try {
            const devices = await this.bleManager.startDeviceScan(
                ['0000180A-0000-1000-8000-00805F9B34FB'], // Water quality service UUID
                { allowDuplicates: false },
                (error, device) => {
                    if (error) {
                        console.error('BLE scan error:', error);
                        return;
                    }
                    
                    if (device) {
                        console.log('Found water kit:', device.name);
                        this.onDeviceFound(device);
                    }
                }
            );
            
            // Stop scanning after 10 seconds
            setTimeout(() => {
                this.bleManager.stopDeviceScan();
            }, 10000);
            
        } catch (error) {
            console.error('Failed to start BLE scan:', error);
        }
    }
    
    async connectToDevice(device) {
        try {
            this.connectedDevice = await device.connect();
            await this.connectedDevice.discoverAllServicesAndCharacteristics();
            
            console.log('Connected to water kit:', device.name);
            return true;
        } catch (error) {
            console.error('Failed to connect to device:', error);
            return false;
        }
    }
    
    async readWaterQualityData() {
        if (!this.connectedDevice) {
            throw new Error('No device connected');
        }
        
        try {
            // Read from water quality characteristic
            const characteristic = await this.connectedDevice.readCharacteristicForService(
                '0000180A-0000-1000-8000-00805F9B34FB',
                '00002A6E-0000-1000-8000-00805F9B34FB'
            );
            
            const data = characteristic.value;
            const jsonString = Buffer.from(data, 'base64').toString('utf8');
            const waterQualityData = JSON.parse(jsonString);
            
            // Validate data integrity using HMAC
            if (!this.validateDataIntegrity(waterQualityData)) {
                throw new Error('Data integrity check failed');
            }
            
            return waterQualityData;
        } catch (error) {
            console.error('Failed to read water quality data:', error);
            throw error;
        }
    }
    
    validateDataIntegrity(data) {
        // Verify HMAC signature to prevent spoofing
        const crypto = require('crypto');
        const hmac = crypto.createHmac('sha256', this.getDeviceSecret(data.device_id));
        hmac.update(JSON.stringify(data.parameters));
        
        const expectedSignature = hmac.digest('hex');
        return data.signature === expectedSignature;
    }
    
    getDeviceSecret(deviceId) {
        // In production, this would be stored securely
        return process.env.WATER_KIT_SECRET || 'default_secret';
    }
    
    async saveWaterQualityData(data) {
        try {
            // Save to local SQLite database
            const reading = {
                sensor_id: data.device_id,
                timestamp: new Date().toISOString(),
                latitude: data.location?.latitude,
                longitude: data.location?.longitude,
                parameters: data.parameters,
                device_info: data.device_info,
                quality_flags: this.generateQualityFlags(data.parameters)
            };
            
            // Store in local database
            await this.storeLocalReading(reading);
            
            // Add to sync queue
            await this.addToSyncQueue('sensor_readings', reading);
            
            console.log('Water quality data saved:', reading);
            return reading;
        } catch (error) {
            console.error('Failed to save water quality data:', error);
            throw error;
        }
    }
    
    generateQualityFlags(parameters) {
        return {
            turbidity_ok: parameters.turbidity < 5.0,
            ph_ok: parameters.ph >= 6.5 && parameters.ph <= 8.5,
            ec_ok: parameters.electrical_conductivity < 2000,
            coliform_ok: parameters.coliform_level < 100,
            battery_low: parameters.battery_level < 20
        };
    }
    
    async disconnect() {
        if (this.connectedDevice) {
            await this.connectedDevice.disconnect();
            this.connectedDevice = null;
        }
    }
}

export default WaterKitManager;`;

  const deviceAuth = `# Device Authentication for IoT Sensors

# 1. Certificate-based Authentication (Fixed Probes)
import ssl
import paho.mqtt.client as mqtt
from cryptography import x509
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa
import datetime

class CertificateAuth:
    def __init__(self, cert_path, key_path, ca_path):
        self.cert_path = cert_path
        self.key_path = key_path
        self.ca_path = ca_path
    
    def create_mqtt_client(self):
        client = mqtt.Client()
        
        # Configure SSL context
        context = ssl.create_default_context(ssl.Purpose.SERVER_AUTH)
        context.load_cert_chain(self.cert_path, self.key_path)
        context.load_verify_locations(self.ca_path)
        
        # Set SSL context
        client.tls_set_context(context)
        
        return client
    
    def generate_device_certificate(self, device_id, validity_days=365):
        """Generate device certificate for new sensor"""
        # Generate private key
        private_key = rsa.generate_private_key(
            public_exponent=65537,
            key_size=2048
        )
        
        # Create certificate
        subject = x509.Name([
            x509.NameAttribute(x509.NameOID.COMMON_NAME, device_id),
            x509.NameAttribute(x509.NameOID.ORGANIZATION_NAME, "VitalVue"),
            x509.NameAttribute(x509.NameOID.ORGANIZATIONAL_UNIT_NAME, "IoT-Sensors")
        ])
        
        cert = x509.CertificateBuilder().subject_name(
            subject
        ).issuer_name(
            subject  # Self-signed for simplicity
        ).public_key(
            private_key.public_key()
        ).serial_number(
            x509.random_serial_number()
        ).not_valid_before(
            datetime.datetime.utcnow()
        ).not_valid_after(
            datetime.datetime.utcnow() + datetime.timedelta(days=validity_days)
        ).add_extension(
            x509.SubjectAlternativeName([
                x509.DNSName(device_id + ".vitalvue.local")
            ]),
            critical=False
        ).sign(private_key, hashes.SHA256())
        
        return cert, private_key

# 2. Token-based Authentication (Field Kits)
import jwt
import secrets
from datetime import datetime, timedelta

class TokenAuth:
    def __init__(self, secret_key):
        self.secret_key = secret_key
    
    def generate_device_token(self, device_id, region_id, expires_hours=24):
        """Generate JWT token for device authentication"""
        payload = {
            'device_id': device_id,
            'region_id': region_id,
            'device_type': 'water_kit',
            'iat': datetime.utcnow(),
            'exp': datetime.utcnow() + timedelta(hours=expires_hours)
        }
        
        token = jwt.encode(payload, self.secret_key, algorithm='HS256')
        return token
    
    def validate_device_token(self, token):
        """Validate device token"""
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=['HS256'])
            return payload
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None

# 3. MQTT Topic Structure
TOPIC_STRUCTURE = {
    'sensor_readings': 'sensors/{region_id}/{sensor_id}/reading',
    'heartbeat': 'sensors/{region_id}/{sensor_id}/heartbeat',
    'status': 'sensors/{region_id}/{sensor_id}/status',
    'commands': 'sensors/{region_id}/{sensor_id}/command',
    'alerts': 'sensors/{region_id}/{sensor_id}/alert'
}

# 4. Message Format
SENSOR_MESSAGE_FORMAT = {
    'device_id': 'string',
    'timestamp': 'ISO8601',
    'location': {
        'latitude': 'float',
        'longitude': 'float'
    },
    'parameters': {
        'turbidity': 'float',
        'ph': 'float',
        'electrical_conductivity': 'float',
        'coliform_level': 'float',
        'battery_level': 'float',
        'temperature': 'float'
    },
    'device_info': {
        'firmware_version': 'string',
        'signal_strength': 'int',
        'uptime': 'int'
    },
    'signature': 'string'  # HMAC signature for data integrity
}`;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">IoT Ingestion & BLE Integration</h1>
          <p className="text-xl text-gray-600">Real-time sensor data collection and water quality monitoring</p>
        </div>

        <div className="space-y-8">
          {/* MQTT Consumer */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">MQTT Consumer Service</h2>
            <p className="text-gray-700 mb-4">
              Python service that subscribes to MQTT topics, processes sensor data, and stores it in TimescaleDB 
              for time-series analysis and ML processing.
            </p>
            <CodeBlock code={mqttConsumer} language="python" filename="mqtt_consumer.py" />
          </div>

          {/* BLE Integration */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">BLE Water Kit Integration</h2>
            <p className="text-gray-700 mb-4">
              React Native implementation for pairing with BLE water quality testing kits, 
              reading sensor data, and validating data integrity using HMAC signatures.
            </p>
            <CodeBlock code={bleIntegration} language="javascript" filename="water-kit-manager.js" />
          </div>

          {/* Device Authentication */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Device Authentication</h2>
            <p className="text-gray-700 mb-4">
              Secure authentication mechanisms for IoT devices including certificate-based auth for fixed probes 
              and token-based auth for field kits.
            </p>
            <CodeBlock code={deviceAuth} language="python" filename="device_auth.py" />
          </div>

          {/* Data Flow Diagram */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Data Flow Architecture</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-primary-600">Fixed Probes</h3>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>• Certificate-based MQTT authentication</li>
                    <li>• Continuous data transmission</li>
                    <li>• Heartbeat monitoring for health checks</li>
                    <li>• Automatic reconnection on network issues</li>
                    <li>• Data validation and integrity checks</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-green-600">Field Kits (BLE)</h3>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>• Short-range Bluetooth pairing</li>
                    <li>• On-demand water quality testing</li>
                    <li>• HMAC signature validation</li>
                    <li>• Offline data storage and sync</li>
                    <li>• Battery level monitoring</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">MQTT Topic Structure</h3>
                <div className="space-y-2 text-sm font-mono">
                  <div>
                    <span className="text-blue-600">sensors/</span>
                    <span className="text-green-600">{'{region_id}'}</span>
                    <span className="text-blue-600">/</span>
                    <span className="text-purple-600">{'{sensor_id}'}</span>
                    <span className="text-blue-600">/reading</span>
                  </div>
                  <div>
                    <span className="text-blue-600">sensors/</span>
                    <span className="text-green-600">{'{region_id}'}</span>
                    <span className="text-blue-600">/</span>
                    <span className="text-purple-600">{'{sensor_id}'}</span>
                    <span className="text-blue-600">/heartbeat</span>
                  </div>
                  <div>
                    <span className="text-blue-600">sensors/</span>
                    <span className="text-green-600">{'{region_id}'}</span>
                    <span className="text-blue-600">/</span>
                    <span className="text-purple-600">{'{sensor_id}'}</span>
                    <span className="text-blue-600">/status</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Health Monitoring */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Device Health Monitoring</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-red-600">Battery Monitoring</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>
                    • Low battery alerts (<span dangerouslySetInnerHTML={{ __html: "&lt;" }} /> 20%)
                  </li>
                  <li>
                    • Critical battery alerts (<span dangerouslySetInnerHTML={{ __html: "&lt;" }} /> 5%)
                  </li>
                  <li>• Battery level trends</li>
                  <li>• Replacement scheduling</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3 text-orange-600">Signal Quality</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Signal strength monitoring</li>
                  <li>• Connection stability tracking</li>
                  <li>• Network quality alerts</li>
                  <li>• Antenna positioning guidance</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3 text-blue-600">Data Quality</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Sensor calibration status</li>
                  <li>• Data validation checks</li>
                  <li>• Anomaly detection</li>
                  <li>• Maintenance reminders</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Security Considerations */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Considerations</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Data Integrity</h3>
                <p className="text-gray-700 text-sm">
                  All sensor data is signed with HMAC to prevent tampering. Certificates are used for 
                  device authentication, and tokens are rotated regularly for field kits.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Network Security</h3>
                <p className="text-gray-700 text-sm">
                  MQTT connections use TLS encryption. Device certificates are managed through a 
                  PKI infrastructure, and access control is enforced at the broker level.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Device Management</h3>
                <p className="text-gray-700 text-sm">
                  Device provisioning includes secure key generation, certificate installation, 
                  and initial configuration. Remote device management capabilities allow for 
                  firmware updates and configuration changes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IoTIngestion;

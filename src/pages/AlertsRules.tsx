import React from 'react';
import CodeBlock from '../components/CodeBlock';

const AlertsRules: React.FC = () => {
  const rulesEngine = `# Rules Engine Implementation
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
import json
import logging
from enum import Enum

logger = logging.getLogger(__name__)

class AlertPriority(Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    INFO = "info"

class AlertType(Enum):
    THRESHOLD = "threshold"
    ML_PREDICTION = "ml_probability"
    COMPOSITE = "composite"
    MANUAL = "manual"

class RuleEngine:
    def __init__(self, db_connection, notification_service):
        self.db = db_connection
        self.notification_service = notification_service
        self.active_rules = {}
        self.load_active_rules()
    
    def load_active_rules(self):
        """Load active rules from database"""
        rules = self.db.query("""
            SELECT id, rule_name, rule_type, conditions, priority, region_id
            FROM alert_rules 
            WHERE is_active = true
        """)
        
        for rule in rules:
            self.active_rules[rule['id']] = {
                'name': rule['rule_name'],
                'type': rule['rule_type'],
                'conditions': json.loads(rule['conditions']),
                'priority': AlertPriority(rule['priority']),
                'region_id': rule['region_id']
            }
    
    def evaluate_rules(self, data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Evaluate all active rules against incoming data"""
        triggered_alerts = []
        
        for rule_id, rule in self.active_rules.items():
            try:
                if self._evaluate_rule(rule, data):
                    alert = self._create_alert(rule_id, rule, data)
                    triggered_alerts.append(alert)
                    
                    # Send notifications
                    self._send_notifications(alert)
                    
            except Exception as e:
                logger.error(f"Error evaluating rule {rule_id}: {e}")
        
        return triggered_alerts
    
    def _evaluate_rule(self, rule: Dict[str, Any], data: Dict[str, Any]) -> bool:
        """Evaluate a single rule against data"""
        rule_type = rule['type']
        
        if rule_type == AlertType.THRESHOLD.value:
            return self._evaluate_threshold_rule(rule['conditions'], data)
        elif rule_type == AlertType.ML_PREDICTION.value:
            return self._evaluate_ml_rule(rule['conditions'], data)
        elif rule_type == AlertType.COMPOSITE.value:
            return self._evaluate_composite_rule(rule['conditions'], data)
        else:
            return False
    
    def _evaluate_threshold_rule(self, conditions: Dict[str, Any], data: Dict[str, Any]) -> bool:
        """Evaluate threshold-based rules"""
        parameter = conditions['parameter']
        operator = conditions['operator']
        threshold = conditions['threshold']
        
        if parameter not in data:
            return False
        
        value = data[parameter]
        
        if operator == '>':
            return value > threshold
        elif operator == '>=':
            return value >= threshold
        elif operator == '<':
            return value < threshold
        elif operator == '<=':
            return value <= threshold
        elif operator == '==':
            return value == threshold
        elif operator == '!=':
            return value != threshold
        else:
            return False
    
    def _evaluate_ml_rule(self, conditions: Dict[str, Any], data: Dict[str, Any]) -> bool:
        """Evaluate ML prediction-based rules"""
        model = conditions['model']
        operator = conditions['operator']
        threshold = conditions['threshold']
        
        # Get ML prediction from data
        prediction_key = f"{model}_probability"
        if prediction_key not in data:
            return False
        
        probability = data[prediction_key]
        
        if operator == '>':
            return probability > threshold
        elif operator == '>=':
            return probability >= threshold
        else:
            return False
    
    def _evaluate_composite_rule(self, conditions: Dict[str, Any], data: Dict[str, Any]) -> bool:
        """Evaluate composite rules with AND/OR logic"""
        logic_operator = conditions.get('logic', 'AND')
        sub_conditions = conditions['conditions']
        
        results = []
        for condition in sub_conditions:
            if condition['type'] == 'threshold':
                result = self._evaluate_threshold_rule(condition, data)
            elif condition['type'] == 'ml_probability':
                result = self._evaluate_ml_rule(condition, data)
            else:
                result = False
            results.append(result)
        
        if logic_operator == 'AND':
            return all(results)
        elif logic_operator == 'OR':
            return any(results)
        else:
            return False
    
    def _create_alert(self, rule_id: str, rule: Dict[str, Any], data: Dict[str, Any]) -> Dict[str, Any]:
        """Create alert record"""
        alert_data = {
            'rule_id': rule_id,
            'title': self._generate_alert_title(rule, data),
            'description': self._generate_alert_description(rule, data),
            'priority': rule['priority'].value,
            'region_id': rule['region_id'],
            'alert_type': rule['type'],
            'metadata': {
                'triggered_data': data,
                'rule_conditions': rule['conditions'],
                'triggered_at': datetime.utcnow().isoformat()
            }
        }
        
        # Save to database
        alert_id = self.db.insert_alert(alert_data)
        alert_data['id'] = alert_id
        
        return alert_data
    
    def _generate_alert_title(self, rule: Dict[str, Any], data: Dict[str, Any]) -> str:
        """Generate alert title based on rule and data"""
        rule_name = rule['name']
        region_id = rule['region_id']
        
        if rule['type'] == AlertType.THRESHOLD.value:
            parameter = rule['conditions']['parameter']
            value = data.get(parameter, 'N/A')
            return f"{rule_name}: {parameter} = {value}"
        elif rule['type'] == AlertType.ML_PREDICTION.value:
            probability = data.get('outbreak_probability', 0)
            return f"ML Alert: {rule_name} (Probability: {probability:.2%})"
        else:
            return f"Alert: {rule_name}"
    
    def _generate_alert_description(self, rule: Dict[str, Any], data: Dict[str, Any]) -> str:
        """Generate detailed alert description"""
        description = f"Rule '{rule['name']}' triggered in region {rule['region_id']}.\\n"
        
        if rule['type'] == AlertType.THRESHOLD.value:
            conditions = rule['conditions']
            description += f"Parameter: {conditions['parameter']}\\n"
            description += f"Value: {data.get(conditions['parameter'], 'N/A')}\\n"
            description += f"Threshold: {conditions['threshold']}\\n"
            description += f"Operator: {conditions['operator']}"
        
        elif rule['type'] == AlertType.ML_PREDICTION.value:
            conditions = rule['conditions']
            probability = data.get('outbreak_probability', 0)
            description += f"Model: {conditions['model']}\\n"
            description += f"Probability: {probability:.2%}\\n"
            description += f"Threshold: {conditions['threshold']:.2%}"
        
        return description
    
    def _send_notifications(self, alert: Dict[str, Any]):
        """Send notifications through multiple channels"""
        try:
            # FCM Push Notification
            self.notification_service.send_fcm_notification(alert)
            
            # Telegram Notification
            self.notification_service.send_telegram_notification(alert)
            
            # Email Notification (for critical alerts)
            if alert['priority'] == AlertPriority.CRITICAL.value:
                self.notification_service.send_email_notification(alert)
            
            logger.info(f"Notifications sent for alert {alert['id']}")
            
        except Exception as e:
            logger.error(f"Failed to send notifications for alert {alert['id']}: {e}")

class NotificationService:
    def __init__(self, fcm_service, telegram_service, email_service):
        self.fcm = fcm_service
        self.telegram = telegram_service
        self.email = email_service
    
    def send_fcm_notification(self, alert: Dict[str, Any]):
        """Send FCM push notification"""
        message = {
            'title': alert['title'],
            'body': alert['description'],
            'data': {
                'alert_id': alert['id'],
                'priority': alert['priority'],
                'region_id': alert['region_id']
            }
        }
        
        # Send to all devices in the region
        self.fcm.send_to_topic(f"region_{alert['region_id']}", message)
    
    def send_telegram_notification(self, alert: Dict[str, Any]):
        """Send Telegram notification to region group"""
        priority_emoji = {
            'critical': '🚨',
            'high': '⚠️',
            'medium': '🔔',
            'info': 'ℹ️'
        }
        
        emoji = priority_emoji.get(alert['priority'], '🔔')
        message = f"{emoji} *{alert['title']}*\\n\\n{alert['description']}"
        
        self.telegram.send_to_group(f"region_{alert['region_id']}", message)
    
    def send_email_notification(self, alert: Dict[str, Any]):
        """Send email notification for critical alerts"""
        subject = f"[CRITICAL] {alert['title']}"
        body = f"""
        Alert Details:
        Title: {alert['title']}
        Description: {alert['description']}
        Priority: {alert['priority']}
        Region: {alert['region_id']}
        Time: {datetime.utcnow().isoformat()}
        """
        
        self.email.send_to_health_officials(subject, body)`;

  const alertLifecycle = `# Alert Lifecycle Management
from enum import Enum
from datetime import datetime
from typing import Optional

class AlertStatus(Enum):
    ACTIVE = "active"
    ACKNOWLEDGED = "acknowledged"
    RESOLVED = "resolved"
    SUPPRESSED = "suppressed"

class AlertLifecycleManager:
    def __init__(self, db_connection):
        self.db = db_connection
    
    def acknowledge_alert(self, alert_id: str, user_id: str, notes: Optional[str] = None) -> bool:
        """Acknowledge an alert"""
        try:
            # Update alert status
            self.db.execute("""
                UPDATE alerts 
                SET status = %s, acknowledged_by = %s, acknowledged_at = %s
                WHERE id = %s
            """, [AlertStatus.ACKNOWLEDGED.value, user_id, datetime.utcnow(), alert_id])
            
            # Log acknowledgment
            self._log_alert_action(alert_id, 'acknowledged', user_id, notes)
            
            return True
        except Exception as e:
            logger.error(f"Failed to acknowledge alert {alert_id}: {e}")
            return False
    
    def resolve_alert(self, alert_id: str, user_id: str, resolution_notes: str) -> bool:
        """Resolve an alert"""
        try:
            # Update alert status
            self.db.execute("""
                UPDATE alerts 
                SET status = %s, resolved_at = %s
                WHERE id = %s
            """, [AlertStatus.RESOLVED.value, datetime.utcnow(), alert_id])
            
            # Log resolution
            self._log_alert_action(alert_id, 'resolved', user_id, resolution_notes)
            
            return True
        except Exception as e:
            logger.error(f"Failed to resolve alert {alert_id}: {e}")
            return False
    
    def suppress_alert(self, alert_id: str, user_id: str, suppression_duration: int, reason: str) -> bool:
        """Suppress an alert for a specified duration"""
        try:
            suppress_until = datetime.utcnow() + timedelta(hours=suppression_duration)
            
            # Update alert status
            self.db.execute("""
                UPDATE alerts 
                SET status = %s, suppressed_until = %s
                WHERE id = %s
            """, [AlertStatus.SUPPRESSED.value, suppress_until, alert_id])
            
            # Log suppression
            self._log_alert_action(alert_id, 'suppressed', user_id, f"Duration: {suppression_duration}h, Reason: {reason}")
            
            return True
        except Exception as e:
            logger.error(f"Failed to suppress alert {alert_id}: {e}")
            return False
    
    def _log_alert_action(self, alert_id: str, action: str, user_id: str, notes: Optional[str] = None):
        """Log alert action for audit trail"""
        self.db.execute("""
            INSERT INTO alert_actions (alert_id, action, user_id, notes, timestamp)
            VALUES (%s, %s, %s, %s, %s)
        """, [alert_id, action, user_id, notes, datetime.utcnow()])`;

  const sampleRules = `# Sample Alert Rules Configuration
{
  "rules": [
    {
      "id": "rule_001",
      "name": "High Coliform Level Alert",
      "description": "Alert when water coliform level exceeds safe threshold",
      "rule_type": "threshold",
      "conditions": {
        "parameter": "coliform_level",
        "operator": ">",
        "threshold": 100.0
      },
      "priority": "high",
      "region_id": "region_001",
      "is_active": true,
      "notification_channels": ["fcm", "telegram", "email"]
    },
    {
      "id": "rule_002",
      "name": "ML Outbreak Prediction",
      "description": "Alert when ML model predicts high outbreak probability",
      "rule_type": "ml_probability",
      "conditions": {
        "model": "outbreak_forecast",
        "operator": ">=",
        "threshold": 0.7
      },
      "priority": "critical",
      "region_id": "region_001",
      "is_active": true,
      "notification_channels": ["fcm", "telegram", "email"]
    },
    {
      "id": "rule_003",
      "name": "Multiple Symptoms Alert",
      "description": "Alert when multiple patients report similar symptoms",
      "rule_type": "composite",
      "conditions": {
        "logic": "AND",
        "conditions": [
          {
            "type": "threshold",
            "parameter": "patient_count",
            "operator": ">=",
            "threshold": 3
          },
          {
            "type": "threshold",
            "parameter": "symptom_overlap_ratio",
            "operator": ">",
            "threshold": 0.8
          }
        ]
      },
      "priority": "medium",
      "region_id": "region_001",
      "is_active": true,
      "notification_channels": ["fcm", "telegram"]
    },
    {
      "id": "rule_004",
      "name": "Sensor Offline Alert",
      "description": "Alert when sensor hasn't reported for extended period",
      "rule_type": "threshold",
      "conditions": {
        "parameter": "hours_since_last_reading",
        "operator": ">",
        "threshold": 24
      },
      "priority": "medium",
      "region_id": "region_001",
      "is_active": true,
      "notification_channels": ["fcm", "telegram"]
    },
    {
      "id": "rule_005",
      "name": "Low Battery Alert",
      "description": "Alert when sensor battery level is low",
      "rule_type": "threshold",
      "conditions": {
        "parameter": "battery_level",
        "operator": "<",
        "threshold": 20.0
      },
      "priority": "low",
      "region_id": "region_001",
      "is_active": true,
      "notification_channels": ["fcm"]
    }
  ]
}`;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Alerts & Rules Engine</h1>
          <p className="text-xl text-gray-600">Intelligent alerting system with multi-channel notifications</p>
        </div>

        <div className="space-y-8">
          {/* Rules Engine */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Rules Engine Implementation</h2>
            <p className="text-gray-700 mb-4">
              Flexible rules engine supporting threshold-based, ML prediction-based, and composite rules 
              with real-time evaluation and multi-channel notification delivery.
            </p>
            <CodeBlock code={rulesEngine} language="python" filename="rules_engine.py" />
          </div>

          {/* Alert Lifecycle */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Alert Lifecycle Management</h2>
            <p className="text-gray-700 mb-4">
              Complete alert lifecycle management from creation to resolution, including acknowledgment, 
              suppression, and audit logging for compliance and tracking.
            </p>
            <CodeBlock code={alertLifecycle} language="python" filename="alert_lifecycle.py" />
          </div>

          {/* Sample Rules */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Sample Alert Rules</h2>
            <p className="text-gray-700 mb-4">
              Pre-configured alert rules covering water quality, outbreak prediction, sensor health, 
              and composite conditions for comprehensive monitoring.
            </p>
            <CodeBlock code={sampleRules} language="json" filename="alert_rules.json" />
          </div>

          {/* Rule Types */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Rule Types & Capabilities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-primary-600">Threshold Rules</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• <strong>Water Quality:</strong> Coliform levels, pH, turbidity thresholds</li>
                  <li>• <strong>Symptom Counts:</strong> Patient count and symptom frequency limits</li>
                  <li>• <strong>Device Health:</strong> Battery levels, signal strength monitoring</li>
                  <li>• <strong>Operational:</strong> Sync failures, data quality issues</li>
                </ul>
                
                <div className="mt-4 p-3 bg-gray-50 rounded">
                  <h4 className="font-semibold text-sm mb-2">Example:</h4>
                  <code className="text-xs">
                    IF coliform_level &gt; 100 CFU/100ml<br/>
                    THEN create HIGH priority alert
                  </code>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4 text-green-600">ML Prediction Rules</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• <strong>Outbreak Probability:</strong> ML model confidence thresholds</li>
                  <li>• <strong>Anomaly Detection:</strong> Statistical anomaly scoring</li>
                  <li>• <strong>Risk Assessment:</strong> Multi-factor risk evaluation</li>
                  <li>• <strong>Trend Analysis:</strong> Pattern recognition alerts</li>
                </ul>
                
                <div className="mt-4 p-3 bg-gray-50 rounded">
                  <h4 className="font-semibold text-sm mb-2">Example:</h4>
                  <code className="text-xs">
                    IF outbreak_probability &gt;= 0.7<br/>
                    THEN create CRITICAL priority alert
                  </code>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4 text-purple-600">Composite Rules</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• <strong>AND Logic:</strong> Multiple conditions must be true</li>
                  <li>• <strong>OR Logic:</strong> Any condition can trigger alert</li>
                  <li>• <strong>Nested Conditions:</strong> Complex rule hierarchies</li>
                  <li>• <strong>Time Windows:</strong> Conditions within time frames</li>
                </ul>
                
                <div className="mt-4 p-3 bg-gray-50 rounded">
                  <h4 className="font-semibold text-sm mb-2">Example:</h4>
                  <code className="text-xs">
                    IF patient_count &gt;= 3 AND<br/>
                    symptom_overlap &gt; 0.8<br/>
                    THEN create MEDIUM priority alert
                  </code>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4 text-orange-600">Manual Rules</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• <strong>Admin Triggers:</strong> Manual alert creation</li>
                  <li>• <strong>Escalation:</strong> Automatic escalation rules</li>
                  <li>• <strong>Suppression:</strong> Temporary alert suppression</li>
                  <li>• <strong>Custom Logic:</strong> User-defined conditions</li>
                </ul>
                
                <div className="mt-4 p-3 bg-gray-50 rounded">
                  <h4 className="font-semibold text-sm mb-2">Example:</h4>
                  <code className="text-xs">
                    IF manual_escalation = true<br/>
                    THEN escalate to supervisor
                  </code>
                </div>
              </div>
            </div>
          </div>

          {/* Notification Channels */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Notification Channels</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 text-blue-600">FCM Push Notifications</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Real-time mobile notifications</li>
                  <li>• Region-based topic subscriptions</li>
                  <li>• Rich media support</li>
                  <li>• Offline message queuing</li>
                  <li>• Delivery confirmation</li>
                </ul>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 text-green-600">Telegram Bot</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Group-based notifications</li>
                  <li>• Rich text formatting</li>
                  <li>• Interactive buttons</li>
                  <li>• File attachments</li>
                  <li>• Message threading</li>
                </ul>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 text-purple-600">Email Notifications</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Critical alert emails</li>
                  <li>• HTML formatted content</li>
                  <li>• Attachment support</li>
                  <li>• Delivery receipts</li>
                  <li>• Unsubscribe options</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Alert Priorities */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Alert Priority System</h2>
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-red-50 rounded-lg">
                <div className="w-4 h-4 bg-red-500 rounded-full mr-4"></div>
                <div>
                  <h3 className="font-semibold text-red-800">Critical</h3>
                  <p className="text-sm text-red-700">Immediate action required - outbreak detected, system failure</p>
                  <p className="text-xs text-red-600 mt-1">All channels, immediate delivery, escalation enabled</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-orange-50 rounded-lg">
                <div className="w-4 h-4 bg-orange-500 rounded-full mr-4"></div>
                <div>
                  <h3 className="font-semibold text-orange-800">High</h3>
                  <p className="text-sm text-orange-700">Urgent attention needed - water quality issues, high risk</p>
                  <p className="text-xs text-orange-600 mt-1">FCM + Telegram, 5-minute delay, supervisor notification</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-yellow-50 rounded-lg">
                <div className="w-4 h-4 bg-yellow-500 rounded-full mr-4"></div>
                <div>
                  <h3 className="font-semibold text-yellow-800">Medium</h3>
                  <p className="text-sm text-yellow-700">Important but not urgent - multiple symptoms, device issues</p>
                  <p className="text-xs text-yellow-600 mt-1">FCM + Telegram, 15-minute delay, standard workflow</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                <div className="w-4 h-4 bg-blue-500 rounded-full mr-4"></div>
                <div>
                  <h3 className="font-semibold text-blue-800">Info</h3>
                  <p className="text-sm text-blue-700">Informational - routine updates, status changes</p>
                  <p className="text-xs text-blue-600 mt-1">FCM only, 30-minute delay, no escalation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertsRules;

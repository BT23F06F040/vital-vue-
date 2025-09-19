import React from 'react';
import CodeBlock from '../components/CodeBlock';

const Chatbot: React.FC = () => {
  const rasaConfig = `# Rasa Configuration
version: "3.6"

intents:
  - symptom_query
  - hygiene_tip
  - nearest_facility
  - report_status
  - escalate
  - water_quality
  - outbreak_info
  - prevention_tips
  - emergency_help

entities:
  - symptom
  - location
  - severity
  - language

responses:
  utter_greet:
  - text: "Hello! I'm your health assistant. How can I help you today?"
  
  utter_symptom_info:
  - text: "Common waterborne disease symptoms include diarrhea, vomiting, fever, and stomach cramps. If you experience these, please report to your local health worker immediately."
  - image: "https://minio.vitalvue.org/health-cards/waterborne-symptoms.svg"
  
  utter_hygiene_tips:
  - text: "Here are important hygiene tips:"
  - text: "1. Always boil water before drinking"
  - text: "2. Wash hands with soap before eating"
  - text: "3. Use clean containers for water storage"
  - image: "https://minio.vitalvue.org/health-cards/hygiene-tips.svg"
  
  utter_nearest_facility:
  - text: "The nearest health facility is {facility_name}, located {distance} away."
  - text: "Address: {facility_address}"
  - text: "Contact: {facility_phone}"
  
  utter_escalate:
  - text: "I'm connecting you with a human health worker. Please wait while I transfer your request."
  - text: "Your request has been escalated. A health worker will contact you soon."

stories:
- story: symptom query
  steps:
  - intent: symptom_query
  - action: utter_symptom_info
  - intent: escalate
  - action: utter_escalate

- story: hygiene tips
  steps:
  - intent: hygiene_tip
  - action: utter_hygiene_tips

- story: facility location
  steps:
  - intent: nearest_facility
  - action: action_find_facility
  - action: utter_nearest_facility

- story: report status
  steps:
  - intent: report_status
  - action: action_check_report_status
  - action: utter_report_status

actions:
- action_find_facility
- action_check_report_status
- action_escalate_to_human`;

  const rasaActions = `# Rasa Custom Actions
from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet
import requests
import json

class ActionFindFacility(Action):
    def name(self) -> Text:
        return "action_find_facility"
    
    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        # Get user location from tracker
        location = tracker.get_slot("location")
        
        if not location:
            dispatcher.utter_message("I need your location to find the nearest health facility. Please share your location.")
            return []
        
        # Call health facility API
        try:
            response = requests.get(f"https://api.vitalvue.org/v1/facilities/nearest?location={location}")
            facility_data = response.json()
            
            # Set slots with facility information
            return [
                SlotSet("facility_name", facility_data.get("name")),
                SlotSet("facility_address", facility_data.get("address")),
                SlotSet("facility_phone", facility_data.get("phone")),
                SlotSet("distance", facility_data.get("distance"))
            ]
        except Exception as e:
            dispatcher.utter_message("Sorry, I couldn't find nearby health facilities. Please try again later.")
            return []

class ActionCheckReportStatus(Action):
    def name(self) -> Text:
        return "action_check_report_status"
    
    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        # Get user ID from tracker
        user_id = tracker.sender_id
        
        try:
            # Call report status API
            response = requests.get(f"https://api.vitalvue.org/v1/reports/status?user_id={user_id}")
            report_data = response.json()
            
            if report_data.get("reports"):
                status_message = f"You have {len(report_data['reports'])} reports:"
                for report in report_data["reports"][:3]:  # Show last 3 reports
                    status_message += f"\\n- Report #{report['id']}: {report['status']}"
                dispatcher.utter_message(status_message)
            else:
                dispatcher.utter_message("You don't have any reports yet.")
                
        except Exception as e:
            dispatcher.utter_message("Sorry, I couldn't check your report status. Please try again later.")
        
        return []

class ActionEscalateToHuman(Action):
    def name(self) -> Text:
        return "action_escalate_to_human"
    
    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        # Get conversation context
        user_id = tracker.sender_id
        conversation_history = tracker.events
        
        # Create escalation request
        escalation_data = {
            "user_id": user_id,
            "reason": "User requested human assistance",
            "conversation_summary": self._summarize_conversation(conversation_history),
            "priority": "medium",
            "language": tracker.get_slot("language") or "en"
        }
        
        try:
            # Send escalation request to admin system
            response = requests.post("https://api.vitalvue.org/v1/escalations", json=escalation_data)
            
            if response.status_code == 200:
                dispatcher.utter_message("Your request has been escalated to a human health worker. They will contact you soon.")
            else:
                dispatcher.utter_message("I'm having trouble connecting you with a human worker. Please try again later.")
                
        except Exception as e:
            dispatcher.utter_message("Sorry, I couldn't escalate your request. Please try again later.")
        
        return []
    
    def _summarize_conversation(self, events):
        """Summarize conversation for human review"""
        summary = []
        for event in events[-10:]:  # Last 10 events
            if event.get("event") == "user":
                summary.append(f"User: {event.get('text', '')}")
            elif event.get("event") == "bot":
                summary.append(f"Bot: {event.get('text', '')}")
        return "\\n".join(summary)`;

  const asrTtsIntegration = `# ASR/TTS Integration
import speech_recognition as sr
import pyttsx3
import requests
import json
from typing import Optional, Dict, Any

class VoiceInterface:
    def __init__(self, rasa_endpoint: str, tts_engine: str = "coqui"):
        self.rasa_endpoint = rasa_endpoint
        self.tts_engine = tts_engine
        self.recognizer = sr.Recognizer()
        self.microphone = sr.Microphone()
        
        # Initialize TTS engine
        if tts_engine == "coqui":
            self.tts = self._init_coqui_tts()
        else:
            self.tts = pyttsx3.init()
    
    def _init_coqui_tts(self):
        """Initialize Coqui TTS for high-quality voice synthesis"""
        try:
            from TTS.api import TTS
            return TTS("tts_models/multilingual/multi-dataset/xtts_v2")
        except ImportError:
            print("Coqui TTS not available, falling back to pyttsx3")
            return pyttsx3.init()
    
    def listen_and_process(self, language: str = "en") -> Optional[str]:
        """Listen to user voice input and process through Rasa"""
        try:
            with self.microphone as source:
                print("Listening...")
                audio = self.recognizer.listen(source, timeout=5, phrase_time_limit=10)
            
            # Convert speech to text
            text = self.recognizer.recognize_google(audio, language=language)
            print(f"Recognized: {text}")
            
            # Send to Rasa for processing
            response = self._send_to_rasa(text, language)
            
            # Convert response to speech
            if response:
                self._speak_response(response)
                return response
                
        except sr.WaitTimeoutError:
            print("No speech detected")
        except sr.UnknownValueError:
            print("Could not understand audio")
        except sr.RequestError as e:
            print(f"Speech recognition error: {e}")
        except Exception as e:
            print(f"Error processing voice input: {e}")
        
        return None
    
    def _send_to_rasa(self, text: str, language: str) -> Optional[str]:
        """Send text to Rasa and get response"""
        try:
            payload = {
                "sender": "voice_user",
                "message": text,
                "metadata": {
                    "language": language,
                    "input_type": "voice"
                }
            }
            
            response = requests.post(
                f"{self.rasa_endpoint}/webhooks/rest/webhook",
                json=payload,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if data:
                    return data[0].get("text", "")
            
        except Exception as e:
            print(f"Error sending to Rasa: {e}")
        
        return None
    
    def _speak_response(self, text: str):
        """Convert text response to speech"""
        try:
            if self.tts_engine == "coqui":
                # Use Coqui TTS for high-quality synthesis
                self.tts.tts_to_file(text=text, file_path="temp_response.wav")
                # Play the audio file
                import pygame
                pygame.mixer.init()
                pygame.mixer.music.load("temp_response.wav")
                pygame.mixer.music.play()
            else:
                # Use pyttsx3 for basic TTS
                self.tts.say(text)
                self.tts.runAndWait()
                
        except Exception as e:
            print(f"Error with TTS: {e}")
    
    def process_text_message(self, text: str, language: str = "en") -> Optional[str]:
        """Process text message through Rasa (for non-voice interactions)"""
        return self._send_to_rasa(text, language)

# Multi-language support
class MultiLanguageChatbot:
    def __init__(self, rasa_endpoint: str):
        self.rasa_endpoint = rasa_endpoint
        self.supported_languages = {
            "en": "English",
            "hi": "Hindi", 
            "te": "Telugu",
            "ta": "Tamil",
            "bn": "Bengali",
            "mr": "Marathi"
        }
    
    def detect_language(self, text: str) -> str:
        """Simple language detection (in production, use proper language detection)"""
        # This is a simplified version - in production, use langdetect or similar
        if any(char in text for char in "अआइईउऊएऐओऔ"):
            return "hi"  # Hindi
        elif any(char in text for char in "అఆఇఈఉఊఎఏఐఒఓఔ"):
            return "te"  # Telugu
        else:
            return "en"  # Default to English
    
    def get_response(self, text: str, user_id: str) -> Dict[str, Any]:
        """Get chatbot response with language detection"""
        language = self.detect_language(text)
        
        payload = {
            "sender": user_id,
            "message": text,
            "metadata": {
                "language": language,
                "input_type": "text"
            }
        }
        
        try:
            response = requests.post(
                f"{self.rasa_endpoint}/webhooks/rest/webhook",
                json=payload,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                return {
                    "response": data[0].get("text", "") if data else "Sorry, I didn't understand that.",
                    "language": language,
                    "confidence": 0.8,  # In production, get from Rasa
                    "suggestions": self._generate_suggestions(language)
                }
            
        except Exception as e:
            print(f"Error getting response: {e}")
        
        return {
            "response": "Sorry, I'm having trouble processing your request. Please try again.",
            "language": language,
            "confidence": 0.0,
            "suggestions": []
        }
    
    def _generate_suggestions(self, language: str) -> List[str]:
        """Generate contextual suggestions based on language"""
        suggestions = {
            "en": [
                "What are the symptoms of waterborne diseases?",
                "How can I prevent water contamination?",
                "Where is the nearest health facility?",
                "How do I report a health issue?"
            ],
            "hi": [
                "जलजनित रोगों के लक्षण क्या हैं?",
                "पानी के दूषित होने से कैसे बचें?",
                "निकटतम स्वास्थ्य सुविधा कहाँ है?",
                "स्वास्थ्य समस्या की रिपोर्ट कैसे करें?"
            ],
            "te": [
                "నీటి వ్యాధుల లక్షణాలు ఏమిటి?",
                "నీటి కలుషితాన్ని ఎలా నివారించాలి?",
                "సమీప ఆరోగ్య సౌకర్యం ఎక్కడ ఉంది?",
                "ఆరోగ్య సమస్యను ఎలా నివేదించాలి?"
            ]
        }
        
        return suggestions.get(language, suggestions["en"])`;

  const trainingData = `# Rasa Training Data
## intent:symptom_query
- What are the symptoms of waterborne diseases?
- I have [fever](symptom) and [diarrhea](symptom)
- What should I do if I have [stomach cramps](symptom)?
- I'm feeling sick with [vomiting](symptom)
- What are the signs of water contamination?
- I have [fever](symptom) and [nausea](symptom)

## intent:hygiene_tip
- How can I prevent waterborne diseases?
- What hygiene practices should I follow?
- How to keep water clean?
- Tips for safe water storage
- How to wash hands properly?
- Water purification methods

## intent:nearest_facility
- Where is the nearest health center?
- Find health facility near me
- I need to see a doctor
- Where can I get medical help?
- Nearest hospital location
- Health worker contact

## intent:report_status
- Check my report status
- What happened to my health report?
- Is my report processed?
- Report submission status
- My complaint status

## intent:escalate
- I want to talk to a human
- Connect me to a health worker
- I need human assistance
- This is urgent
- I want to speak to someone
- Transfer me to supervisor

## intent:water_quality
- Is the water safe to drink?
- Water quality in my area
- How to test water quality?
- Water contamination report
- Is tap water safe?

## intent:outbreak_info
- Any disease outbreaks in my area?
- Current health alerts
- Disease outbreak status
- Health warnings
- Public health updates

## intent:prevention_tips
- How to prevent diseases?
- Health prevention measures
- Disease prevention tips
- Stay healthy advice
- Preventive healthcare

## intent:emergency_help
- This is an emergency
- I need immediate help
- Urgent medical assistance
- Emergency health situation
- Call ambulance

## synonym:fever
- high temperature
- temperature
- hot
- burning up

## synonym:diarrhea
- loose motions
- stomach upset
- bowel problems

## synonym:vomiting
- throwing up
- nausea
- sick

## synonym:stomach cramps
- stomach pain
- abdominal pain
- belly ache

## lookup:location
data/locations.txt

## lookup:symptom
data/symptoms.txt`;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Chatbot System</h1>
          <p className="text-xl text-gray-600">Multi-language conversational AI for health assistance</p>
        </div>

        <div className="space-y-8">
          {/* Rasa Configuration */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Rasa Configuration</h2>
            <p className="text-gray-700 mb-4">
              Complete Rasa NLU and Core configuration for intent recognition, entity extraction, 
              and dialogue management with multi-language support.
            </p>
            <CodeBlock code={rasaConfig} language="yaml" filename="rasa_config.yml" />
          </div>

          {/* Custom Actions */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Custom Actions</h2>
            <p className="text-gray-700 mb-4">
              Python custom actions for facility lookup, report status checking, and human escalation 
              with API integration and conversation summarization.
            </p>
            <CodeBlock code={rasaActions} language="python" filename="rasa_actions.py" />
          </div>

          {/* ASR/TTS Integration */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Voice Interface (ASR/TTS)</h2>
            <p className="text-gray-700 mb-4">
              Speech recognition and text-to-speech integration using Google Speech API, 
              Coqui TTS, and pyttsx3 for voice-enabled health assistance.
            </p>
            <CodeBlock code={asrTtsIntegration} language="python" filename="voice_interface.py" />
          </div>

          {/* Training Data */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Training Data</h2>
            <p className="text-gray-700 mb-4">
              Comprehensive training data covering health-related intents, entities, and synonyms 
              for accurate natural language understanding.
            </p>
            <CodeBlock code={trainingData} language="yaml" filename="training_data.yml" />
          </div>

          {/* Chatbot Features */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Chatbot Capabilities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-primary-600">Core Intents</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• <strong>Symptom Query:</strong> Information about waterborne disease symptoms</li>
                  <li>• <strong>Hygiene Tips:</strong> Preventive health practices and guidelines</li>
                  <li>• <strong>Facility Location:</strong> Find nearest health centers and workers</li>
                  <li>• <strong>Report Status:</strong> Check status of submitted health reports</li>
                  <li>• <strong>Emergency Help:</strong> Urgent medical assistance requests</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4 text-green-600">Advanced Features</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• <strong>Multi-language Support:</strong> English, Hindi, Telugu, Tamil, Bengali</li>
                  <li>• <strong>Voice Interface:</strong> Speech-to-text and text-to-speech</li>
                  <li>• <strong>Context Awareness:</strong> Maintains conversation context</li>
                  <li>• <strong>Human Escalation:</strong> Seamless handoff to human workers</li>
                  <li>• <strong>Rich Responses:</strong> Images, links, and interactive elements</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Language Support */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Multi-language Support</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 text-blue-600">English</h3>
                <p className="text-sm text-gray-600 mb-2">Primary language for technical users</p>
                <div className="text-xs space-y-1">
                  <div>• Complete intent coverage</div>
                  <div>• Full entity recognition</div>
                  <div>• Rich response templates</div>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 text-green-600">Hindi</h3>
                <p className="text-sm text-gray-600 mb-2">Widely spoken regional language</p>
                <div className="text-xs space-y-1">
                  <div>• Devanagari script support</div>
                  <div>• Cultural context awareness</div>
                  <div>• Local health terminology</div>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 text-purple-600">Telugu</h3>
                <p className="text-sm text-gray-600 mb-2">Southern regional language</p>
                <div className="text-xs space-y-1">
                  <div>• Telugu script recognition</div>
                  <div>• Regional health practices</div>
                  <div>• Local facility integration</div>
                </div>
              </div>
            </div>
          </div>

          {/* Response Examples */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Response Examples</h2>
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold mb-2 text-gray-800">Symptom Query Response</h3>
                <div className="text-sm space-y-2">
                  <div className="flex">
                    <span className="font-medium text-blue-600 mr-2">User:</span>
                    <span>I have fever and diarrhea</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium text-green-600 mr-2">Bot:</span>
                    <span>Common symptoms of waterborne diseases include diarrhea, vomiting, fever, and stomach cramps. If you experience these, please report to your local health worker immediately.</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium text-green-600 mr-2">Bot:</span>
                    <span>[Shows symptoms infographic]</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold mb-2 text-gray-800">Hygiene Tips Response</h3>
                <div className="text-sm space-y-2">
                  <div className="flex">
                    <span className="font-medium text-blue-600 mr-2">User:</span>
                    <span>How can I prevent waterborne diseases?</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium text-green-600 mr-2">Bot:</span>
                    <span>Here are important hygiene tips:</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium text-green-600 mr-2">Bot:</span>
                    <span>1. Always boil water before drinking</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium text-green-600 mr-2">Bot:</span>
                    <span>2. Wash hands with soap before eating</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium text-green-600 mr-2">Bot:</span>
                    <span>3. Use clean containers for water storage</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium text-green-600 mr-2">Bot:</span>
                    <span>[Shows hygiene tips infographic]</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Integration Points */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">System Integration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800">API Endpoints</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• <code>POST /api/v1/chatbot/message</code> - Send message to chatbot</li>
                  <li>• <code>GET /api/v1/chatbot/suggestions</code> - Get contextual suggestions</li>
                  <li>• <code>POST /api/v1/chatbot/escalate</code> - Escalate to human worker</li>
                  <li>• <code>GET /api/v1/chatbot/history</code> - Get conversation history</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800">External Services</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• <strong>Google Speech API:</strong> Speech recognition</li>
                  <li>• <strong>Coqui TTS:</strong> High-quality text-to-speech</li>
                  <li>• <strong>Health Facility API:</strong> Location services</li>
                  <li>• <strong>Report Status API:</strong> Data integration</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;

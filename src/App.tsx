import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import Team from './pages/Team';
import Prototype from './pages/Prototype';
import Contact from './pages/Contact';
import MLPlan from './pages/MLPlan';
import AlertsRules from './pages/AlertsRules';
import Chatbot from './pages/Chatbot';
import Security from './pages/Security';
import DockerCompose from './pages/DockerCompose';
import CIPlan from './pages/CIPlan';
import MVPRoadmap from './pages/MVPRoadmap';
import PilotChecklist from './pages/PilotChecklist';
import ProblemStatement from './pages/ProblemStatement';
import Solution from './pages/Solution';
import TechStack from './pages/TechStack';
import OpenAPI from './pages/OpenAPI';
import DBSchemas from './pages/DBSchemas';
import SampleJSON from './pages/SampleJSON';
import MobileWireframes from './pages/MobileWireframes';
import OfflineSync from './pages/OfflineSync';
import IoTIngestion from './pages/IoTIngestion';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="pb-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/problem" element={<ProblemStatement />} />
          <Route path="/solution" element={<Solution />} />
          <Route path="/team" element={<Team />} />
          <Route path="/prototype" element={<Prototype />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/tech-stack" element={<TechStack />} />
          <Route path="/openapi" element={<OpenAPI />} />
          <Route path="/db-schemas" element={<DBSchemas />} />
          <Route path="/sample-json" element={<SampleJSON />} />
          <Route path="/wireframes" element={<MobileWireframes />} />
          <Route path="/offline-sync" element={<OfflineSync />} />
          <Route path="/iot-ingestion" element={<IoTIngestion />} />
          <Route path="/ml-plan" element={<MLPlan />} />
          <Route path="/alerts-rules" element={<AlertsRules />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/security" element={<Security />} />
          <Route path="/docker-compose" element={<DockerCompose />} />
          <Route path="/ci-plan" element={<CIPlan />} />
          <Route path="/mvp-roadmap" element={<MVPRoadmap />} />
          <Route path="/pilot-checklist" element={<PilotChecklist />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;

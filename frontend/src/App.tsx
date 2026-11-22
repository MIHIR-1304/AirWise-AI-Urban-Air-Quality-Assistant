import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { AuthModal } from './components/common/AuthModal';

import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { AiAssistantPage } from './pages/AiAssistantPage';
import { DailyRoutinePage } from './pages/DailyRoutinePage';
import { IndoorGuidePage } from './pages/IndoorGuidePage';
import { SustainabilityPage } from './pages/SustainabilityPage';
import { MapPage } from './pages/MapPage';
import { ProfilePage } from './pages/ProfilePage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <LocationProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-[#F7F7F2] text-[#20221F] selection:bg-[#C5F36B] selection:text-[#20221F]">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/assistant" element={<AiAssistantPage />} />
                <Route path="/routine" element={<DailyRoutinePage />} />
                <Route path="/indoor" element={<IndoorGuidePage />} />
                <Route path="/sustainability" element={<SustainabilityPage />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Routes>
            </main>
            <Footer />
            <AuthModal />
          </div>
        </Router>
      </LocationProvider>
    </AuthProvider>
  );
};

export default App;

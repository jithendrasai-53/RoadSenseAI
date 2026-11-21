import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import InspectorPage from './pages/InspectorPage';
import ResultsPage from './pages/ResultsPage';
import PipelinePage from './pages/PipelinePage';
import AnalyticsPage from './pages/AnalyticsPage';
import AboutPage from './pages/AboutPage';
import { fetchSystemStatus, detectDamage } from './services/api';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [systemStatus, setSystemStatus] = useState(null);
  const [latestInspection, setLatestInspection] = useState(null);

  // Load system status on application mount
  useEffect(() => {
    let isMounted = true;
    fetchSystemStatus().then((status) => {
      if (isMounted) setSystemStatus(status);
    });

    // Also auto-warm initial benchmark sample so the Results and Inspector pages have immediate data
    detectDamage({ sample_id: 'sample_d40_pothole', confidence: 0.25, mode: 'demo' })
      .then((initialRes) => {
        if (isMounted && !latestInspection) {
          setLatestInspection(initialRes);
        }
      })
      .catch((e) => console.log("Initial sample warm-up notice:", e.message));

    return () => { isMounted = false; };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#080B0A] text-gray-100 font-sans selection:bg-[#76B900]/30 selection:text-[#76B900]">
      
      {/* Top Engineering Navbar */}
      <Navbar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        systemStatus={systemStatus} 
      />

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activePage === 'home' && (
          <HomePage 
            setActivePage={setActivePage} 
            systemStatus={systemStatus} 
          />
        )}

        {activePage === 'inspector' && (
          <InspectorPage 
            setActivePage={setActivePage}
            latestInspection={latestInspection}
            setLatestInspection={setLatestInspection}
            systemStatus={systemStatus}
          />
        )}

        {activePage === 'results' && (
          <ResultsPage 
            latestInspection={latestInspection}
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'pipeline' && (
          <PipelinePage 
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'analytics' && (
          <AnalyticsPage 
            systemStatus={systemStatus}
          />
        )}

        {activePage === 'about' && (
          <AboutPage />
        )}
      </main>

      {/* Engineering Footer */}
      <Footer setActivePage={setActivePage} />

    </div>
  );
}

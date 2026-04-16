import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProblemsPage from './pages/ProblemsPage';
import CrushFinderPage from './pages/CrushFinderPage';
import ForumPage from './pages/ForumPage';
import ChatPage from './pages/ChatPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import ConsentBanner from './components/ConsentBanner';

function App() {
  const [showConsentBanner, setShowConsentBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('uir-gdpr-consent');
    if (!consent) {
      setShowConsentBanner(true);
    }
  }, []);

  const handleAcceptConsent = () => {
    localStorage.setItem('uir-gdpr-consent', 'accepted');
    localStorage.setItem('uir-gdpr-consent-date', new Date().toISOString());
    setShowConsentBanner(false);
  };

  const handleDeclineConsent = () => {
    localStorage.setItem('uir-gdpr-consent', 'declined');
    localStorage.setItem('uir-gdpr-consent-date', new Date().toISOString());
    setShowConsentBanner(false);
  };

  return (
    <Router>
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/problems" element={<ProblemsPage />} />
            <Route path="/crush-finder" element={<CrushFinderPage />} />
            <Route path="/forum" element={<ForumPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
        {showConsentBanner && (
          <ConsentBanner
            onAccept={handleAcceptConsent}
            onDecline={handleDeclineConsent}
          />
        )}
      </div>
    </Router>
  );
}

export default App;

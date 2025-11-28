import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDarkMode } from './hooks/useDarkMode';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import { suiService, type Network } from './services/suiService';
import { initializeTokenLogos } from './utils/tokenLogos';

function App() {
  useDarkMode(); // Initialize dark mode
  const [network, setNetwork] = useState<Network>('mainnet');

  // Initialize token logos on app mount
  useEffect(() => {
    initializeTokenLogos();
  }, []);

  // Update suiService when network changes
  useEffect(() => {
    suiService.setNetwork(network);
  }, [network]);

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <Header network={network} onNetworkChange={setNetwork} />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home network={network} />} />
          <Route path="/about" element={<About network={network} onNetworkChange={setNetwork} />} />
          <Route path="/privacy" element={<PrivacyPolicy network={network} onNetworkChange={setNetwork} />} />
          <Route path="/terms" element={<TermsOfService network={network} onNetworkChange={setNetwork} />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;

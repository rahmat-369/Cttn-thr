import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { useThrData } from './lib/store';
import { WelcomeModal, TransactionModal } from './components/SharedUI';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import About from './pages/About';

const AppRoutes = ({ openModal }: { openModal: any }) => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Dashboard openModal={openModal} />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </AnimatePresence>
  );
};

export default function App() {
  const { data, updateData } = useThrData();
  const [modal, setModal] = useState<'masuk' | 'keluar' | null>(null);

  return (
    <Router>
      <div className="min-h-screen bg-cream font-inter relative flex flex-col">
        {/* Global Navbar */}
        <nav className="p-4 md:px-8 bg-deepGreen text-whiteSoft flex justify-between items-center shadow-lg sticky top-0 z-40">
          <h1 className="font-playfair font-bold text-xl tracking-wider">THR Tracker</h1>
          <Menu className="w-6 h-6 cursor-pointer text-gold hover:text-whiteSoft transition-colors" />
        </nav>

        {/* Content Route */}
        <div className="flex-1 relative z-10">
          <AppRoutes openModal={setModal} />
        </div>

        {/* Footer Pattern */}
        <div className="fixed bottom-0 w-full h-16 bg-deepGreen opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: 'radial-gradient(circle at 10px 10px, #C49A2B 2px, transparent 0)', backgroundSize: '30px 30px' }}></div>

        {/* Modals Manager */}
        {!data.settings.welcomeDismissed && <WelcomeModal onClose={() => updateData({ settings: { ...data.settings, welcomeDismissed: true } })} />}
        {modal && <TransactionModal type={modal} onClose={() => setModal(null)} data={data} updateData={updateData} />}
      </div>
    </Router>
  );
}

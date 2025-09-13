import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Header } from './components/Layout/Header';
import { Home } from './pages/Home';
import { Browse } from './pages/Browse';
import { OfferDetails } from './pages/OfferDetails';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Wallet } from './pages/Wallet';
import { CreateOffer } from './pages/CreateOffer';
import { Trades } from './pages/Trades';
import { Help } from './pages/Help';
import { Profile } from './pages/Profile';
import { Notifications } from './pages/Notifications';

function App() {

  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-gray-900 text-white">
          <Header />
          
          <main className="min-h-screen">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/browse" element={<Browse />} />
                <Route path="/offer/:id" element={<OfferDetails />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/wallet" element={<Wallet />} />
                <Route path="/create-offer" element={<CreateOffer />} />
                <Route path="/trades" element={<Trades />} />
                <Route path="/help" element={<Help />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/notifications" element={<Notifications />} />
              </Routes>
          </main>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
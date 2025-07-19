import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Components
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Layout from './components/Layout';
import Payment from './components/Payment';
import Education from './components/Education';
import AdminPanel from './components/AdminPanel';
import AccessRestricted from './components/AccessRestricted';
import PartnerRegistration from './components/PartnerRegistration';
import CustomerRegistration from './components/CustomerRegistration';
// import AdminPayment from './components/AdminPayment'; // Şu an kullanılmıyor
import Welcome from './components/Welcome';

// Context
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="payment" element={<Payment />} />
              <Route path="education" element={<Education />} />
              <Route path="partner-registration" element={<PartnerRegistration />} />
              <Route path="customer-registration" element={<CustomerRegistration />} />
              <Route path="admin/*" element={<AdminPanel />} />
              
              {/* Restricted Pages */}
              <Route path="kariyerim" element={<AccessRestricted pageName="Kariyerim" icon="📈" />} />
              <Route path="satislarim" element={<AccessRestricted pageName="Satışlarım" icon="💰" />} />
              <Route path="franchise-agi" element={<AccessRestricted pageName="Franchise Ağı Yapısı" icon="🌐" />} />
              <Route path="memnun-musteri-takip" element={<AccessRestricted pageName="Memnun Müşteri Takip Paneli" icon="😊" />} />
              <Route path="sponsorluk-takip" element={<AccessRestricted pageName="Sponsorluk Takip Paneli" icon="👥" />} />
              <Route path="takim-takip" element={<AccessRestricted pageName="Takım Takip Paneli" icon="👨‍👩‍👧‍👦" />} />
              <Route path="liderlik-baskanlik-takip" element={<AccessRestricted pageName="Liderlik ve Başkanlık Takip Paneli" icon="👑" />} />
              <Route path="kar-paylasimi-promosyon" element={<AccessRestricted pageName="Kar Paylaşımı Promosyonu" icon="🎁" />} />
              <Route path="global-seyahat-promosyonu" element={<AccessRestricted pageName="Global Seyahat Promosyonu" icon="✈️" />} />
              <Route path="bilgi-bankasi" element={<AccessRestricted pageName="Bilgi Bankası" icon="📚" />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
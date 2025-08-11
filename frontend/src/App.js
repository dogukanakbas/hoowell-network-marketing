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
import CareerTracker from './components/CareerTracker';
import CustomerSatisfactionTracker from './components/CustomerSatisfactionTracker';
import SponsorshipTracker from './components/SponsorshipTracker';
import SalesTracker from './components/SalesTracker';
import FranchiseNetwork from './components/FranchiseNetwork';
import KarPaylasimi from './components/KarPaylasimi';
import DopingPromosyonu from './components/DopingPromosyonu';
import GlobalSeyahat from './components/GlobalSeyahat';
import TeamTracker from './components/TeamTracker';
import LeadershipPanel from './components/LeadershipPanel';
import MuhasebeTakipPaneli from './components/MuhasebeTakipPaneli';
import KisiselYonetim from './components/KisiselYonetim';
// import AdminPayment from './components/AdminPayment'; // Şu an kullanılmıyor
import Welcome from './components/Welcome';
import HoowellDiscover from './components/HoowellDiscover';

// Legal Pages
import PrivacyPolicy from './components/legal/PrivacyPolicy';
import TermsOfService from './components/legal/TermsOfService';
import RefundPolicy from './components/legal/RefundPolicy';
import KVKKPolicy from './components/legal/KVKKPolicy';
import AboutUs from './components/legal/AboutUs';
import ContactUs from './components/legal/ContactUs';
import Products from './components/legal/Products';
import ShippingInfo from './components/legal/ShippingInfo';
import CookiePolicy from './components/legal/CookiePolicy';

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
            <Route path="/discover" element={<HoowellDiscover />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="payment" element={<Payment />} />
              <Route path="education" element={<Education />} />
              <Route path="partner-registration" element={<PartnerRegistration />} />
              <Route path="customer-registration" element={<CustomerRegistration />} />
              <Route path="admin/*" element={<AdminPanel />} />
              
              {/* Restricted Pages */}
              <Route path="kariyerim" element={<CareerTracker />} />
              <Route path="satislarim" element={<SalesTracker />} />
              <Route path="franchise-agi" element={<FranchiseNetwork />} />
              <Route path="memnun-musteri-takip" element={<CustomerSatisfactionTracker />} />
              <Route path="sponsorluk-takip" element={<SponsorshipTracker />} />
              <Route path="takim-takip" element={<TeamTracker />} />
              <Route path="liderlik-baskanlik-takip" element={<LeadershipPanel />} />
              <Route path="kar-paylasimi-promosyon" element={<KarPaylasimi />} />
              <Route path="doping-promosyonu" element={<DopingPromosyonu />} />
              <Route path="global-seyahat-promosyonu" element={<GlobalSeyahat />} />
              <Route path="muhasebe-takip-paneli" element={<MuhasebeTakipPaneli />} />
              <Route path="bilgi-bankasi" element={<AccessRestricted pageName="Bilgi Bankası" icon="📚" />} />
              <Route path="kisisel-yonetim" element={<KisiselYonetim />} />
              
              {/* Legal Pages */}
              <Route path="privacy" element={<PrivacyPolicy />} />
              <Route path="terms" element={<TermsOfService />} />
              <Route path="refund" element={<RefundPolicy />} />
              <Route path="kvkk" element={<KVKKPolicy />} />
              <Route path="about" element={<AboutUs />} />
              <Route path="contact" element={<ContactUs />} />
              <Route path="products" element={<Products />} />
              <Route path="shipping" element={<ShippingInfo />} />
              <Route path="cookies" element={<CookiePolicy />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
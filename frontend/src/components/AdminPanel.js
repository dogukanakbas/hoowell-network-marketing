import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import QuestionManager from './QuestionManager';
import AdminPayment from './AdminPayment';
import AdminSystemSettings from './AdminSystemSettings';
import AdminCompanyManagement from './AdminCompanyManagement';
import AdminMonthlySales from './AdminMonthlySales';
import AdminPaymentDetails from './AdminPaymentDetails';
import AdminCareerManagement from './AdminCareerManagement';
import AdminQuestionManagement from './AdminQuestionManagement';
import axios from 'axios';

const AdminPanel = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (user.role !== 'admin') {
    return <div>Bu sayfaya erişim yetkiniz bulunmamaktadır.</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <Link 
            to="/admin/system-settings" 
            className={`btn ${location.pathname === '/admin/system-settings' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Sistem Ayarları
          </Link>
          <Link 
            to="/admin/company-management" 
            className={`btn ${location.pathname === '/admin/company-management' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Şirket Yönetimi
          </Link>
          <Link 
            to="/admin/monthly-sales" 
            className={`btn ${location.pathname === '/admin/monthly-sales' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Aylık Satışlar
          </Link>
          <Link 
            to="/admin/payment-details" 
            className={`btn ${location.pathname === '/admin/payment-details' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Ödeme Detayları
          </Link>
          <Link 
            to="/admin/career-management" 
            className={`btn ${location.pathname === '/admin/career-management' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Kariyer Yönetimi
          </Link>
          <Link 
            to="/admin/question-management" 
            className={`btn ${location.pathname === '/admin/question-management' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Soru Yönetimi
          </Link>
        </div>
      </div>

      <Routes>
        <Route path="users" element={<UserManagement />} />
        <Route path="payments" element={<PaymentApprovals />} />
        <Route path="settings" element={<SystemSettings />} />
        <Route path="questions" element={<QuestionManager />} />
        <Route path="payment" element={<AdminPayment />} />
        <Route path="system-settings" element={<AdminSystemSettings />} />
        <Route path="company-management" element={<AdminCompanyManagement />} />
        <Route path="monthly-sales" element={<AdminMonthlySales />} />
        <Route path="payment-details" element={<AdminPaymentDetails />} />
        <Route path="career-management" element={<AdminCareerManagement />} />
        <Route path="question-management" element={<AdminQuestionManagement />} />
        <Route index element={<AdminDashboard />} />
      </Routes>
    </div>
  );
};

const AdminDashboard = () => {
  return (
    <div className="dashboard-card">
      <h3>Admin Panel</h3>
      <p>Yönetim paneline hoş geldiniz. Sol menüden istediğiniz bölüme geçebilirsiniz.</p>
    </div>
  );
};

// Türkiye İl ve İlçe verileri
const turkeyData = {
  "İstanbul": ["Adalar", "Arnavutköy", "Ataşehir", "Avcılar", "Bağcılar", "Bahçelievler", "Bakırköy", "Başakşehir", "Bayrampaşa", "Beşiktaş", "Beykoz", "Beylikdüzü", "Beyoğlu", "Büyükçekmece", "Çatalca", "Çekmeköy", "Esenler", "Esenyurt", "Eyüpsultan", "Fatih", "Gaziosmanpaşa", "Güngören", "Kadıköy", "Kağıthane", "Kartal", "Küçükçekmece", "Maltepe", "Pendik", "Sancaktepe", "Sarıyer", "Silivri", "Sultanbeyli", "Sultangazi", "Şile", "Şişli", "Tuzla", "Ümraniye", "Üsküdar", "Zeytinburnu"],
  "Ankara": ["Akyurt", "Altındağ", "Ayaş", "Bala", "Beypazarı", "Çamlıdere", "Çankaya", "Çubuk", "Elmadağ", "Etimesgut", "Evren", "Gölbaşı", "Güdül", "Haymana", "Kalecik", "Kazan", "Keçiören", "Kızılcahamam", "Mamak", "Nallıhan", "Polatlı", "Pursaklar", "Sincan", "Şereflikoçhisar", "Yenimahalle"],
  "İzmir": ["Aliağa", "Balçova", "Bayındır", "Bayraklı", "Bergama", "Beydağ", "Bornova", "Buca", "Çeşme", "Çiğli", "Dikili", "Foça", "Gaziemir", "Güzelbahçe", "Karabağlar", "Karaburun", "Karşıyaka", "Kemalpaşa", "Kınık", "Kiraz", "Konak", "Menderes", "Menemen", "Narlıdere", "Ödemiş", "Seferihisar", "Selçuk", "Tire", "Torbalı", "Urla"],
  "Bursa": ["Büyükorhan", "Gemlik", "Gürsu", "Harmancık", "İnegöl", "İznik", "Karacabey", "Keles", "Kestel", "Mudanya", "Mustafakemalpaşa", "Nilüfer", "Orhaneli", "Orhangazi", "Osmangazi", "Yenişehir", "Yıldırım"],
  "Adana": ["Aladağ", "Ceyhan", "Çukurova", "Feke", "İmamoğlu", "Karaisalı", "Karataş", "Kozan", "Pozantı", "Saimbeyli", "Sarıçam", "Seyhan", "Tufanbeyli", "Yumurtalık", "Yüreğir"],
  "Antalya": ["Akseki", "Aksu", "Alanya", "Demre", "Döşemealtı", "Elmalı", "Finike", "Gazipaşa", "Gündoğmuş", "İbradı", "Kaş", "Kemer", "Kepez", "Konyaaltı", "Korkuteli", "Kumluca", "Manavgat", "Muratpaşa", "Serik"]
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [registrationType, setRegistrationType] = useState('individual');
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    tc_no: '',
    phone: '',
    city: '',
    district: '',
    address: '',
    company_name: '',
    tax_office: '',
    tax_no: '',
    authorized_first_name: '',
    authorized_last_name: '',
    sponsor_id: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      // Yeni kayıt sistemi için veri hazırlama
      const userData = {
        registration_type: registrationType,
        ...newUser,
        full_address: `${newUser.address}, ${newUser.district}/${newUser.city}`,
        total_amount: 4800,
        contract1_accepted: true,
        contract2_accepted: true,
        contracts_accepted: true
      };

      const response = await axios.post('/api/partner/register-new', userData);
      setMessage(`✅ Kullanıcı başarıyla oluşturuldu!
📋 Sponsor ID: ${response.data.sponsor_id}
🔑 Şifre: ${response.data.password}
📧 Email: ${response.data.email}`);
      
      // Form sıfırlama
      setNewUser({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        tc_no: '',
        phone: '',
        city: '',
        district: '',
        address: '',
        company_name: '',
        tax_office: '',
        tax_no: '',
        authorized_first_name: '',
        authorized_last_name: '',
        sponsor_id: ''
      });
      setRegistrationType('individual');
      setShowAddForm(false);
      fetchUsers();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Kullanıcı oluşturulamadı');
    }
  };

  return (
    <div>
      <div className="dashboard-card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3>Kullanıcı Yönetimi</h3>
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? 'İptal' : 'Yeni Kullanıcı Ekle'}
          </button>
        </div>

        {message && (
          <div style={{ 
            padding: '10px', 
            borderRadius: '5px', 
            marginBottom: '20px',
            backgroundColor: message.includes('oluşturuldu') ? '#d4edda' : '#f8d7da',
            color: message.includes('oluşturuldu') ? '#155724' : '#721c24'
          }}>
            {message}
          </div>
        )}

        {showAddForm && (
          <form onSubmit={handleAddUser} style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '10px' }}>
            <h4>Yeni İş Ortağı Ekle</h4>
            
            {/* Kayıt Türü Seçimi */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Kayıt Türü</label>
              <div style={{ display: 'flex', gap: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="registrationType"
                    value="individual"
                    checked={registrationType === 'individual'}
                    onChange={(e) => setRegistrationType(e.target.value)}
                    style={{ marginRight: '8px' }}
                  />
                  👤 Bireysel Kayıt
                </label>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="registrationType"
                    value="corporate"
                    checked={registrationType === 'corporate'}
                    onChange={(e) => setRegistrationType(e.target.value)}
                    style={{ marginRight: '8px' }}
                  />
                  🏢 Kurumsal Kayıt
                </label>
              </div>
            </div>

            {registrationType === 'individual' ? (
              <div>
                <h5 style={{ marginBottom: '15px', color: '#0e2323' }}>Bireysel Bilgiler</h5>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                  <div className="form-group">
                    <label>İsim *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newUser.first_name}
                      onChange={(e) => setNewUser({...newUser, first_name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Soyad *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newUser.last_name}
                      onChange={(e) => setNewUser({...newUser, last_name: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                  <div className="form-group">
                    <label>TC Kimlik No *</label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength="11"
                      value={newUser.tc_no}
                      onChange={(e) => setNewUser({...newUser, tc_no: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>E-mail *</label>
                    <input
                      type="email"
                      className="form-control"
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="form-group" style={{ marginBottom: '15px' }}>
                  <label>Telefon *</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                    required
                  />
                </div>
              </div>
            ) : (
              <div>
                <h5 style={{ marginBottom: '15px', color: '#0e2323' }}>Kurumsal Bilgiler</h5>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                  <div className="form-group">
                    <label>Şirket İsmi *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newUser.company_name}
                      onChange={(e) => setNewUser({...newUser, company_name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Vergi Dairesi *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newUser.tax_office}
                      onChange={(e) => setNewUser({...newUser, tax_office: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                  <div className="form-group">
                    <label>Vergi Numarası *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newUser.tax_no}
                      onChange={(e) => setNewUser({...newUser, tax_no: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>E-mail *</label>
                    <input
                      type="email"
                      className="form-control"
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                  <div className="form-group">
                    <label>Sorumlu Kişi Adı *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newUser.authorized_first_name}
                      onChange={(e) => setNewUser({...newUser, authorized_first_name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Sorumlu Kişi Soyadı *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newUser.authorized_last_name}
                      onChange={(e) => setNewUser({...newUser, authorized_last_name: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="form-group" style={{ marginBottom: '15px' }}>
                  <label>Telefon *</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                    required
                  />
                </div>
              </div>
            )}

            {/* Adres Bilgileri */}
            <h5 style={{ marginBottom: '15px', color: '#0e2323', marginTop: '20px' }}>Adres Bilgileri</h5>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div className="form-group">
                <label>İl *</label>
                <select
                  className="form-control"
                  value={newUser.city}
                  onChange={(e) => setNewUser({...newUser, city: e.target.value, district: ''})}
                  required
                >
                  <option value="">İl Seçin</option>
                  {Object.keys(turkeyData).map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>İlçe *</label>
                <select
                  className="form-control"
                  value={newUser.district}
                  onChange={(e) => setNewUser({...newUser, district: e.target.value})}
                  disabled={!newUser.city}
                  required
                >
                  <option value="">İlçe Seçin</option>
                  {newUser.city && turkeyData[newUser.city]?.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label>Adres Detayı *</label>
              <textarea
                className="form-control"
                rows="3"
                value={newUser.address}
                onChange={(e) => setNewUser({...newUser, address: e.target.value})}
                placeholder="Mahalle, sokak, bina no, daire no vb. detayları yazın..."
                required
              />
            </div>

            {/* Opsiyonel Alanlar */}
            <h5 style={{ marginBottom: '15px', color: '#0e2323', marginTop: '20px' }}>Opsiyonel Bilgiler</h5>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
              <div className="form-group">
                <label>Kullanıcı Adı (Otomatik oluşturulacak)</label>
                <input
                  type="text"
                  className="form-control"
                  value={newUser.username}
                  onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                  placeholder="Boş bırakılırsa otomatik oluşturulur"
                />
              </div>
              <div className="form-group">
                <label>Sponsor ID (Opsiyonel)</label>
                <input
                  type="text"
                  className="form-control"
                  value={newUser.sponsor_id}
                  onChange={(e) => setNewUser({...newUser, sponsor_id: e.target.value})}
                  placeholder="Referans sponsor ID"
                />
              </div>
            </div>

            <div style={{ 
              padding: '15px', 
              backgroundColor: '#e3f2fd', 
              borderRadius: '8px', 
              marginBottom: '20px',
              fontSize: '14px',
              color: '#1565c0'
            }}>
              <strong>💡 Bilgi:</strong> Kullanıcı oluşturulduktan sonra otomatik olarak:
              <ul style={{ marginTop: '8px', marginBottom: '0' }}>
                <li>Franchise Satış Paketi (4.800 ₺) atanacak</li>
                <li>Sözleşmeler otomatik onaylanacak</li>
                <li>Rastgele şifre oluşturulacak</li>
                <li>Email ile bilgilendirme yapılacak</li>
              </ul>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
              İş Ortağı Oluştur
            </button>
          </form>
        )}
      </div>

      <div className="dashboard-card">
        <h3>Kullanıcı Listesi</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Sponsor ID</th>
              <th>Ad Soyad</th>
              <th>Kullanıcı Adı</th>
              <th>E-posta</th>
              <th>Kariyer</th>
              <th>KKP</th>
              <th>Sponsor</th>
              <th>Durum</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.sponsor_id || 'Atanmamış'}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '30px',
                      height: '30px',
                      backgroundColor: (user.career_level?.toLowerCase() === 'bronze' || user.career_level?.toLowerCase() === 'silver') ? 'transparent' : 'var(--accent-gold)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      color: '#0e2323',
                      border: '1px solid #ddd',
                      overflow: 'hidden',
                      flexShrink: 0
                    }}>
                      {user.career_level?.toLowerCase() === 'bronze' ? (
                        <img 
                          src="/images/products/bronze_logo.jpeg" 
                          alt="Bronze Logo"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: '50%'
                          }}
                        />
                      ) : user.career_level?.toLowerCase() === 'silver' ? (
                        <img 
                          src="/images/products/silver_logo.jpeg" 
                          alt="Silver Logo"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: '50%'
                          }}
                        />
                      ) : user.career_level?.toLowerCase() === 'gold' ? (
                        <img 
                          src="/images/products/gold_logo.jpeg" 
                          alt="Gold Logo"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: '50%'
                          }}
                        />
                      ) : user.career_level?.toLowerCase() === 'star_leader' ? (
                        <img 
                          src="/images/products/starlider_logo.jpeg" 
                          alt="Star Leader Logo"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: '50%'
                          }}
                        />
                      ) : user.career_level?.toLowerCase() === 'super_star_leader' ? (
                        <img 
                          src="/images/products/superstar_logo.jpeg" 
                          alt="Super Star Leader Logo"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: '50%'
                          }}
                        />
                      ) : user.career_level?.toLowerCase() === 'presidents_team' ? (
                        <img 
                          src="/images/products/baskanlar_logo.jpeg" 
                          alt="Başkanlar Logo"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: '50%'
                          }}
                        />
                      ) : (
                        user.first_name?.charAt(0)?.toUpperCase() + user.last_name?.charAt(0)?.toUpperCase() || '?'
                      )}
                    </div>
                    <span>{user.first_name} {user.last_name}</span>
                  </div>
                </td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.career_level?.toUpperCase()}</td>
                <td>{user.total_kkp}</td>
                <td>
                  {user.sponsor_first_name ? 
                    `${user.sponsor_first_name} ${user.sponsor_last_name}` : 
                    '-'
                  }
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                    {user.payment_confirmed && (
                      <span className="status-badge status-approved">Ödeme OK</span>
                    )}
                    {user.education_completed && (
                      <span className="status-badge status-approved">Eğitim OK</span>
                    )}
                    {user.backoffice_access && (
                      <span className="status-badge status-approved">Backoffice</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const PaymentApprovals = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await axios.get('/api/admin/payments');
      setPayments(response.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const approvePayment = async (paymentId) => {
    try {
      await axios.put(`/api/admin/payments/${paymentId}/approve`);
      alert('Ödeme onaylandı');
      fetchPayments();
    } catch (error) {
      console.error('Error approving payment:', error);
      alert('Ödeme onaylanırken hata oluştu');
    }
  };

  const rejectPayment = async (paymentId) => {
    if (window.confirm('Bu ödemeyi reddetmek istediğinizden emin misiniz? Kullanıcının eğitim erişimi engellenecektir.')) {
      try {
        await axios.put(`/api/admin/payments/${paymentId}/reject`);
        alert('Ödeme reddedildi, kullanıcı bloklandı');
        fetchPayments();
      } catch (error) {
        console.error('Error rejecting payment:', error);
        alert('Ödeme reddedilirken hata oluştu');
      }
    }
  };

  return (
    <div className="dashboard-card">
      <h3>Ödeme Onayları</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Tarih</th>
            <th>Kullanıcı</th>
            <th>Tür</th>
            <th>Tutar</th>
            <th>Dekont</th>
            <th>Durum</th>
            <th>İşlem</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td>{new Date(payment.created_at).toLocaleDateString('tr-TR')}</td>
              <td>{payment.first_name} {payment.last_name}</td>
              <td>{payment.payment_type === 'education' ? 'Eğitim' : 'Cihaz'}</td>
              <td>₺{payment.total_amount?.toLocaleString()}</td>
              <td>
                {payment.receipt_path && (
                  <a href={`http://localhost:5001/${payment.receipt_path}`} target="_blank" rel="noopener noreferrer">
                    Dekont Görüntüle
                  </a>
                )}
              </td>
              <td>
                <span className={`status-badge status-${payment.status}`}>
                  {payment.status === 'pending' ? 'Bekliyor' : 
                   payment.status === 'approved' ? 'Onaylandı' : 
                   payment.status === 'rejected' ? 'Reddedildi' : payment.status}
                </span>
              </td>
              <td>
                {payment.status === 'pending' && (
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button 
                      className="btn btn-success"
                      style={{ fontSize: '12px', padding: '5px 10px' }}
                      onClick={() => approvePayment(payment.id)}
                    >
                      Onayla
                    </button>
                    <button 
                      className="btn btn-danger"
                      style={{ fontSize: '12px', padding: '5px 10px' }}
                      onClick={() => rejectPayment(payment.id)}
                    >
                      Reddet
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const SystemSettings = () => {
  const [settings, setSettings] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get('/api/settings');
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/api/admin/settings', settings);
      setMessage('Ayarlar başarıyla güncellendi');
    } catch (error) {
      setMessage('Ayarlar güncellenirken hata oluştu');
    }
  };

  const handleChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="dashboard-card">
      <h3>Sistem Ayarları</h3>
      
      {message && (
        <div style={{ 
          padding: '10px', 
          borderRadius: '5px', 
          marginBottom: '20px',
          backgroundColor: message.includes('başarıyla') ? '#d4edda' : '#f8d7da',
          color: message.includes('başarıyla') ? '#155724' : '#721c24'
        }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSave}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <h4>Döviz ve Fiyat Ayarları</h4>
            <div className="form-group">
              <label>USD/TRY Kuru</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                value={settings.usd_to_try_rate || ''}
                onChange={(e) => handleChange('usd_to_try_rate', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>KDV Oranı (%)</label>
              <input
                type="number"
                className="form-control"
                value={settings.vat_rate || ''}
                onChange={(e) => handleChange('vat_rate', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Eğitim Fiyatı (USD)</label>
              <input
                type="number"
                className="form-control"
                value={settings.education_price_usd || ''}
                onChange={(e) => handleChange('education_price_usd', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Cihaz Fiyatı (USD)</label>
              <input
                type="number"
                className="form-control"
                value={settings.device_price_usd || ''}
                onChange={(e) => handleChange('device_price_usd', e.target.value)}
              />
            </div>
          </div>

          <div>
            <h4>Kariyer Gereksinimleri (KKP)</h4>
            <div className="form-group">
              <label>Silver İş Ortağı</label>
              <input
                type="number"
                className="form-control"
                value={settings.silver_kkp_required || ''}
                onChange={(e) => handleChange('silver_kkp_required', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Gold İş Ortağı</label>
              <input
                type="number"
                className="form-control"
                value={settings.gold_kkp_required || ''}
                onChange={(e) => handleChange('gold_kkp_required', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Star Lider</label>
              <input
                type="number"
                className="form-control"
                value={settings.star_leader_kkp_required || ''}
                onChange={(e) => handleChange('star_leader_kkp_required', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Süper Star Lider</label>
              <input
                type="number"
                className="form-control"
                value={settings.super_star_leader_kkp_required || ''}
                onChange={(e) => handleChange('super_star_leader_kkp_required', e.target.value)}
              />
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ marginTop: '20px' }}>
          Ayarları Kaydet
        </button>
      </form>
    </div>
  );
};

export default AdminPanel;
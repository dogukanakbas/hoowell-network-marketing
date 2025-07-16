import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import QuestionManager from './QuestionManager';
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
            to="/admin/users" 
            className={`btn ${location.pathname === '/admin/users' ? 'btn-primary' : 'btn'}`}
            style={{ backgroundColor: location.pathname !== '/admin/users' ? '#6c757d' : '', color: 'white' }}
          >
            Kullanıcı Yönetimi
          </Link>
          <Link 
            to="/admin/payments" 
            className={`btn ${location.pathname === '/admin/payments' ? 'btn-primary' : 'btn'}`}
            style={{ backgroundColor: location.pathname !== '/admin/payments' ? '#6c757d' : '', color: 'white' }}
          >
            Ödeme Onayları
          </Link>
          <Link 
            to="/admin/settings" 
            className={`btn ${location.pathname === '/admin/settings' ? 'btn-primary' : 'btn'}`}
            style={{ backgroundColor: location.pathname !== '/admin/settings' ? '#6c757d' : '', color: 'white' }}
          >
            Sistem Ayarları
          </Link>
          <Link 
            to="/admin/questions" 
            className={`btn ${location.pathname === '/admin/questions' ? 'btn-primary' : 'btn'}`}
            style={{ backgroundColor: location.pathname !== '/admin/questions' ? '#6c757d' : '', color: 'white' }}
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

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
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
      const response = await axios.post('/api/admin/users', newUser);
      setMessage(`Kullanıcı oluşturuldu. Şifre: ${response.data.password}`);
      setNewUser({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        phone: '',
        sponsor_id: ''
      });
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="form-group">
                <label>Kullanıcı Adı</label>
                <input
                  type="text"
                  className="form-control"
                  value={newUser.username}
                  onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>E-posta</label>
                <input
                  type="email"
                  className="form-control"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Ad</label>
                <input
                  type="text"
                  className="form-control"
                  value={newUser.first_name}
                  onChange={(e) => setNewUser({...newUser, first_name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Soyad</label>
                <input
                  type="text"
                  className="form-control"
                  value={newUser.last_name}
                  onChange={(e) => setNewUser({...newUser, last_name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Telefon</label>
                <input
                  type="text"
                  className="form-control"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Sponsor ID (Opsiyonel)</label>
                <input
                  type="number"
                  className="form-control"
                  value={newUser.sponsor_id}
                  onChange={(e) => setNewUser({...newUser, sponsor_id: e.target.value})}
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              Kullanıcı Oluştur
            </button>
          </form>
        )}
      </div>

      <div className="dashboard-card">
        <h3>Kullanıcı Listesi</h3>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
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
                <td>{user.id}</td>
                <td>{user.first_name} {user.last_name}</td>
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
      fetchPayments();
    } catch (error) {
      console.error('Error approving payment:', error);
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
                  <a href={`http://localhost:5000/${payment.receipt_path}`} target="_blank" rel="noopener noreferrer">
                    Dekont Görüntüle
                  </a>
                )}
              </td>
              <td>
                <span className={`status-badge status-${payment.status}`}>
                  {payment.status === 'pending' ? 'Bekliyor' : 
                   payment.status === 'approved' ? 'Onaylandı' : 'Reddedildi'}
                </span>
              </td>
              <td>
                {payment.status === 'pending' && (
                  <button 
                    className="btn btn-primary"
                    style={{ fontSize: '12px', padding: '5px 10px' }}
                    onClick={() => approvePayment(payment.id)}
                  >
                    Onayla
                  </button>
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
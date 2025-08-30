import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const KisiselYonetim = () => {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'password', 'settings', 'notifications'
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  // Form state'leri
  const [profileForm, setProfileForm] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    nickname: user?.nickname || '',
    email: user?.email || '',
    phone: user?.phone || '',
    country_code: user?.country_code || '+90',
    city: user?.city || '',
    district: user?.district || '',
    full_address: user?.full_address || ''
  });

  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const [settingsForm, setSettingsForm] = useState({
    email_notifications: true,
    sms_notifications: false,
    marketing_emails: true,
    system_notifications: true
  });

  // Ülke kodları listesi
  const countryCodes = [
    { code: '+90', name: 'Türkiye', flag: '🇹🇷' },
    { code: '+1', name: 'ABD/Kanada', flag: '🇺🇸' },
    { code: '+44', name: 'İngiltere', flag: '🇬🇧' },
    { code: '+49', name: 'Almanya', flag: '🇩🇪' },
    { code: '+33', name: 'Fransa', flag: '🇫🇷' },
    { code: '+39', name: 'İtalya', flag: '🇮🇹' },
    { code: '+34', name: 'İspanya', flag: '🇪🇸' },
    { code: '+31', name: 'Hollanda', flag: '🇳🇱' },
    { code: '+32', name: 'Belçika', flag: '🇧🇪' },
    { code: '+41', name: 'İsviçre', flag: '🇨🇭' }
  ];

  // Türkiye il listesi (kısaltılmış)
  const turkeyData = {
    "İstanbul": ["Kadıköy", "Beşiktaş", "Şişli", "Beyoğlu", "Fatih"],
    "Ankara": ["Çankaya", "Keçiören", "Yenimahalle", "Mamak", "Altındağ"],
    "İzmir": ["Konak", "Karşıyaka", "Bornova", "Buca", "Bayraklı"],
    "Bursa": ["Osmangazi", "Nilüfer", "Yıldırım", "Mudanya", "Gemlik"],
    "Antalya": ["Muratpaşa", "Kepez", "Konyaaltı", "Aksu", "Döşemealtı"]
  };

  useEffect(() => {
    if (user) {
      setProfileForm({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        nickname: user.nickname || '',
        email: user.email || '',
        phone: user.phone || '',
        country_code: user.country_code || '+90',
        city: user.city || '',
        district: user.district || '',
        full_address: user.full_address || ''
      });
    }
  }, [user]);

  // Profil güncelleme
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setErrors({});

    try {
      const response = await axios.put('/api/user/profile', profileForm, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        setMessage('✅ Profil bilgileri başarıyla güncellendi!');
        await refreshUser();
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setMessage('❌ Profil güncellenirken hata oluştu: ' + (error.response?.data?.message || 'Bilinmeyen hata'));
    } finally {
      setLoading(false);
    }
  };

  // Takma ad güncelleme
  const handleNicknameUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setErrors({});

    try {
      const response = await axios.put('/api/user/nickname', { nickname: profileForm.nickname }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        setMessage('✅ Takma ad başarıyla güncellendi!');
        await refreshUser();
      }
    } catch (error) {
      console.error('Nickname update error:', error);
      setMessage('❌ Takma ad güncellenirken hata oluştu: ' + (error.response?.data?.message || 'Bilinmeyen hata'));
    } finally {
      setLoading(false);
    }
  };

  // Şifre değiştirme
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setErrors({});

    // Şifre doğrulama
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setErrors({ confirm_password: 'Şifreler eşleşmiyor' });
      setLoading(false);
      return;
    }

    if (passwordForm.new_password.length < 6) {
      setErrors({ new_password: 'Şifre en az 6 karakter olmalıdır' });
      setLoading(false);
      return;
    }

    try {
      const response = await axios.put('/api/user/password', {
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        setMessage('✅ Şifre başarıyla değiştirildi!');
        setPasswordForm({
          current_password: '',
          new_password: '',
          confirm_password: ''
        });
      }
    } catch (error) {
      console.error('Password change error:', error);
      setMessage('❌ Şifre değiştirilirken hata oluştu: ' + (error.response?.data?.message || 'Bilinmeyen hata'));
    } finally {
      setLoading(false);
    }
  };

  // Ayarları kaydetme
  const handleSettingsUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.put('/api/user/settings', settingsForm, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        setMessage('✅ Ayarlar başarıyla kaydedildi!');
      }
    } catch (error) {
      console.error('Settings update error:', error);
      setMessage('❌ Ayarlar kaydedilirken hata oluştu: ' + (error.response?.data?.message || 'Bilinmeyen hata'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f2324',
      padding: '20px',
      margin: '0 -20px'
    }}>
      {/* HOOWELL Logo - Sağ Üst */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        zIndex: 10
      }}>
        <img
          src="/hoowell-logo.png"
          alt="HOOWELL Logo"
          style={{
            width: '90px',
            height: '50px',
            objectFit: 'contain'
          }}
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      </div>

      {/* Ana Başlık */}
      <div style={{
        textAlign: 'center',
        marginBottom: '30px',
        paddingTop: '20px'
      }}>
        <h1 style={{
          color: '#FFD700',
          fontSize: '36px',
          fontWeight: 'bold',
          margin: '0',
          textShadow: '3px 3px 6px rgba(0,0,0,0.7)',
          letterSpacing: '2px'
        }}>
          KİŞİSEL YÖNETİM
        </h1>
      </div>

      {/* Tab Menüsü */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        marginBottom: '30px',
        flexWrap: 'wrap'
      }}>
        {[
          { key: 'profile', label: '👤 Profil', icon: '👤' },
          { key: 'password', label: '🔒 Şifre', icon: '🔒' },
          { key: 'settings', label: '⚙️ Ayarlar', icon: '⚙️' },
          { key: 'notifications', label: '🔔 Bildirimler', icon: '🔔' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              setMessage('');
              setErrors({});
            }}
            style={{
              backgroundColor: activeTab === tab.key ? '#FFD700' : 'rgba(255,255,255,0.1)',
              color: activeTab === tab.key ? '#0e2323' : '#FFD700',
              border: '2px solid #FFD700',
              borderRadius: '15px',
              padding: '12px 20px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              minWidth: '120px'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Mesaj Alanı */}
      {message && (
        <div style={{
          maxWidth: '800px',
          margin: '0 auto 20px',
          padding: '15px',
          borderRadius: '10px',
          backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da',
          color: message.includes('✅') ? '#155724' : '#721c24',
          textAlign: 'center',
          fontWeight: 'bold'
        }}>
          {message}
        </div>
      )}

      {/* Ana İçerik Container */}
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        padding: '30px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        border: '3px solid #FFD700'
      }}>

        {/* Profil Sekmesi */}
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileUpdate}>
            {/* Profil Avatar */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: user.career_level?.toLowerCase() === 'bronze' ? 'transparent' : 'var(--accent-gold)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#0e2323',
                border: '3px solid #FFD700',
                overflow: 'hidden',
                boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)'
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
                  user.first_name?.charAt(0)?.toUpperCase() + user.last_name?.charAt(0)?.toUpperCase() || '👤'
                )}
              </div>
            </div>

            <h3 style={{
              color: '#0e2323',
              fontSize: '24px',
              fontWeight: 'bold',
              marginBottom: '25px',
              textAlign: 'center',
              borderBottom: '2px solid #FFD700',
              paddingBottom: '10px'
            }}>
              👤 PROFİL BİLGİLERİ
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#0e2323' }}>
                  Ad *
                </label>
                <input
                  type="text"
                  value={profileForm.first_name}
                  onChange={(e) => setProfileForm({ ...profileForm, first_name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#0e2323' }}>
                  Soyad *
                </label>
                <input
                  type="text"
                  value={profileForm.last_name}
                  onChange={(e) => setProfileForm({ ...profileForm, last_name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                  required
                />
              </div>
            </div>

            {/* Takma Ad Bölümü */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#0e2323' }}>
                🏷️ Takma Ad
              </label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                <input
                  type="text"
                  value={profileForm.nickname}
                  onChange={(e) => setProfileForm({ ...profileForm, nickname: e.target.value })}
                  placeholder="Takma adınızı girin (3-50 karakter)"
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: '2px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                  minLength="3"
                  maxLength="50"
                />
                <button
                  type="button"
                  onClick={handleNicknameUpdate}
                  disabled={loading || !profileForm.nickname || profileForm.nickname.length < 3}
                  style={{
                    padding: '12px 20px',
                    backgroundColor: loading || !profileForm.nickname || profileForm.nickname.length < 3 ? '#ccc' : '#FFD700',
                    color: '#0e2323',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: loading || !profileForm.nickname || profileForm.nickname.length < 3 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {loading ? '⏳ Güncelleniyor...' : '💾 Kaydet'}
                </button>
              </div>
              <small style={{ color: '#666', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                Takma adınız benzersiz olmalıdır ve diğer kullanıcılar tarafından görülecektir.
              </small>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#0e2323' }}>
                E-posta *
              </label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
                required
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#0e2323' }}>
                Telefon *
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <select
                  value={profileForm.country_code}
                  onChange={(e) => setProfileForm({ ...profileForm, country_code: e.target.value })}
                  style={{
                    width: '120px',
                    padding: '12px',
                    border: '2px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                >
                  {countryCodes.map(country => (
                    <option key={country.code} value={country.code}>
                      {country.flag} {country.code}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  placeholder="5XX XXX XX XX"
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: '2px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#0e2323' }}>
                  İl
                </label>
                <select
                  value={profileForm.city}
                  onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value, district: '' })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                >
                  <option value="">İl Seçin</option>
                  {Object.keys(turkeyData).map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#0e2323' }}>
                  İlçe
                </label>
                <select
                  value={profileForm.district}
                  onChange={(e) => setProfileForm({ ...profileForm, district: e.target.value })}
                  disabled={!profileForm.city}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '14px',
                    opacity: !profileForm.city ? 0.5 : 1
                  }}
                >
                  <option value="">İlçe Seçin</option>
                  {profileForm.city && turkeyData[profileForm.city]?.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#0e2323' }}>
                Adres
              </label>
              <textarea
                value={profileForm.full_address}
                onChange={(e) => setProfileForm({ ...profileForm, full_address: e.target.value })}
                rows="3"
                placeholder="Detaylı adres bilgisi..."
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '15px',
                backgroundColor: loading ? '#ccc' : '#FFD700',
                color: '#0e2323',
                border: 'none',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s'
              }}
            >
              {loading ? 'Güncelleniyor...' : 'Profili Güncelle'}
            </button>
          </form>
        )}

        {/* Şifre Sekmesi */}
        {activeTab === 'password' && (
          <form onSubmit={handlePasswordChange}>
            <h3 style={{
              color: '#0e2323',
              fontSize: '24px',
              fontWeight: 'bold',
              marginBottom: '25px',
              textAlign: 'center',
              borderBottom: '2px solid #FFD700',
              paddingBottom: '10px'
            }}>
              🔒 ŞİFRE DEĞİŞTİRME
            </h3>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#0e2323' }}>
                Mevcut Şifre *
              </label>
              <input
                type="password"
                value={passwordForm.current_password}
                onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
                required
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#0e2323' }}>
                Yeni Şifre *
              </label>
              <input
                type="password"
                value={passwordForm.new_password}
                onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: errors.new_password ? '2px solid #dc3545' : '2px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
                required
                minLength="6"
              />
              {errors.new_password && (
                <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px' }}>
                  {errors.new_password}
                </div>
              )}
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#0e2323' }}>
                Yeni Şifre Tekrar *
              </label>
              <input
                type="password"
                value={passwordForm.confirm_password}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: errors.confirm_password ? '2px solid #dc3545' : '2px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
                required
              />
              {errors.confirm_password && (
                <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px' }}>
                  {errors.confirm_password}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '15px',
                backgroundColor: loading ? '#ccc' : '#FFD700',
                color: '#0e2323',
                border: 'none',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s'
              }}
            >
              {loading ? 'Değiştiriliyor...' : 'Şifreyi Değiştir'}
            </button>
          </form>
        )}

        {/* Ayarlar Sekmesi */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSettingsUpdate}>
            <h3 style={{
              color: '#0e2323',
              fontSize: '24px',
              fontWeight: 'bold',
              marginBottom: '25px',
              textAlign: 'center',
              borderBottom: '2px solid #FFD700',
              paddingBottom: '10px'
            }}>
              ⚙️ BİLDİRİM AYARLARI
            </h3>

            <div style={{ marginBottom: '20px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '15px',
                backgroundColor: '#f8f9fa',
                borderRadius: '10px',
                marginBottom: '15px'
              }}>
                <div>
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>E-posta Bildirimleri</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Komisyon ödemeleri ve önemli güncellemeler</div>
                </div>
                <label style={{ position: 'relative', display: 'inline-block', width: '60px', height: '34px' }}>
                  <input
                    type="checkbox"
                    checked={settingsForm.email_notifications}
                    onChange={(e) => setSettingsForm({ ...settingsForm, email_notifications: e.target.checked })}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{
                    position: 'absolute',
                    cursor: 'pointer',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: settingsForm.email_notifications ? '#FFD700' : '#ccc',
                    transition: '0.4s',
                    borderRadius: '34px'
                  }}>
                    <span style={{
                      position: 'absolute',
                      content: '',
                      height: '26px',
                      width: '26px',
                      left: settingsForm.email_notifications ? '30px' : '4px',
                      bottom: '4px',
                      backgroundColor: 'white',
                      transition: '0.4s',
                      borderRadius: '50%'
                    }} />
                  </span>
                </label>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '15px',
                backgroundColor: '#f8f9fa',
                borderRadius: '10px',
                marginBottom: '15px'
              }}>
                <div>
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>SMS Bildirimleri</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Acil durumlar ve önemli hatırlatmalar</div>
                </div>
                <label style={{ position: 'relative', display: 'inline-block', width: '60px', height: '34px' }}>
                  <input
                    type="checkbox"
                    checked={settingsForm.sms_notifications}
                    onChange={(e) => setSettingsForm({ ...settingsForm, sms_notifications: e.target.checked })}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{
                    position: 'absolute',
                    cursor: 'pointer',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: settingsForm.sms_notifications ? '#FFD700' : '#ccc',
                    transition: '0.4s',
                    borderRadius: '34px'
                  }}>
                    <span style={{
                      position: 'absolute',
                      content: '',
                      height: '26px',
                      width: '26px',
                      left: settingsForm.sms_notifications ? '30px' : '4px',
                      bottom: '4px',
                      backgroundColor: 'white',
                      transition: '0.4s',
                      borderRadius: '50%'
                    }} />
                  </span>
                </label>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '15px',
                backgroundColor: '#f8f9fa',
                borderRadius: '10px',
                marginBottom: '15px'
              }}>
                <div>
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Pazarlama E-postaları</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Yeni ürünler ve promosyonlar</div>
                </div>
                <label style={{ position: 'relative', display: 'inline-block', width: '60px', height: '34px' }}>
                  <input
                    type="checkbox"
                    checked={settingsForm.marketing_emails}
                    onChange={(e) => setSettingsForm({ ...settingsForm, marketing_emails: e.target.checked })}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{
                    position: 'absolute',
                    cursor: 'pointer',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: settingsForm.marketing_emails ? '#FFD700' : '#ccc',
                    transition: '0.4s',
                    borderRadius: '34px'
                  }}>
                    <span style={{
                      position: 'absolute',
                      content: '',
                      height: '26px',
                      width: '26px',
                      left: settingsForm.marketing_emails ? '30px' : '4px',
                      bottom: '4px',
                      backgroundColor: 'white',
                      transition: '0.4s',
                      borderRadius: '50%'
                    }} />
                  </span>
                </label>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '15px',
                backgroundColor: '#f8f9fa',
                borderRadius: '10px',
                marginBottom: '25px'
              }}>
                <div>
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Sistem Bildirimleri</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Sistem güncellemeleri ve bakım bildirimleri</div>
                </div>
                <label style={{ position: 'relative', display: 'inline-block', width: '60px', height: '34px' }}>
                  <input
                    type="checkbox"
                    checked={settingsForm.system_notifications}
                    onChange={(e) => setSettingsForm({ ...settingsForm, system_notifications: e.target.checked })}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{
                    position: 'absolute',
                    cursor: 'pointer',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: settingsForm.system_notifications ? '#FFD700' : '#ccc',
                    transition: '0.4s',
                    borderRadius: '34px'
                  }}>
                    <span style={{
                      position: 'absolute',
                      content: '',
                      height: '26px',
                      width: '26px',
                      left: settingsForm.system_notifications ? '30px' : '4px',
                      bottom: '4px',
                      backgroundColor: 'white',
                      transition: '0.4s',
                      borderRadius: '50%'
                    }} />
                  </span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '15px',
                backgroundColor: loading ? '#ccc' : '#FFD700',
                color: '#0e2323',
                border: 'none',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s'
              }}
            >
              {loading ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
            </button>
          </form>
        )}

        {/* Bildirimler Sekmesi */}
        {activeTab === 'notifications' && (
          <div>
            <h3 style={{
              color: '#0e2323',
              fontSize: '24px',
              fontWeight: 'bold',
              marginBottom: '25px',
              textAlign: 'center',
              borderBottom: '2px solid #FFD700',
              paddingBottom: '10px'
            }}>
              🔔 SON BİLDİRİMLER
            </h3>

            <div style={{ marginBottom: '20px' }}>
              {[
                { id: 1, type: 'success', title: 'Komisyon Ödemesi', message: 'Ocak ayı komisyon ödemesi hesabınıza yatırıldı.', date: '2025-01-08', time: '14:30' },
                { id: 2, type: 'info', title: 'Profil Güncelleme', message: 'Profil bilgilerinizi güncellemek için tıklayın.', date: '2025-01-07', time: '09:15' },
                { id: 3, type: 'warning', title: 'Eğitim Hatırlatması', message: 'Yeni eğitim modülü yayınlandı.', date: '2025-01-06', time: '16:45' },
                { id: 4, type: 'info', title: 'Sistem Güncellemesi', message: 'Sistem bakımı tamamlandı.', date: '2025-01-05', time: '11:20' }
              ].map((notification) => (
                <div key={notification.id} style={{
                  padding: '15px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '10px',
                  marginBottom: '15px',
                  borderLeft: `4px solid ${notification.type === 'success' ? '#28a745' :
                    notification.type === 'warning' ? '#ffc107' :
                      notification.type === 'error' ? '#dc3545' : '#17a2b8'
                    }`
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '8px'
                  }}>
                    <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                      {notification.type === 'success' && '✅ '}
                      {notification.type === 'warning' && '⚠️ '}
                      {notification.type === 'error' && '❌ '}
                      {notification.type === 'info' && 'ℹ️ '}
                      {notification.title}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {notification.date} {notification.time}
                    </div>
                  </div>
                  <div style={{ fontSize: '14px', color: '#333' }}>
                    {notification.message}
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              textAlign: 'center',
              padding: '20px',
              backgroundColor: '#f8f9fa',
              borderRadius: '10px',
              color: '#666'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>📭</div>
              <div>Tüm bildirimler gösteriliyor</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KisiselYonetim;
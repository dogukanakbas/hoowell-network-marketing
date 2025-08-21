import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password);

    if (result.success) {
      navigate(result.redirectPath || '/');
    } else {
      setError(result.message);
    }

    setLoading(false);
  };



  const handleDiscoverHoowell = () => {
    navigate('/discover');
  };

  return (
    <div className="login-main-container">
      <div className="login-grid">

        {/* Sol Yarı - HOOWELL Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0f2324 0%, #0f2324 100%)',
          padding: '60px'
        }}>
          {/* HOOWELL Logo - Büyük ve Sola Hizalı */}
          <div style={{
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            marginLeft: '40px'
          }}>
            <img
              src="/hoowell-logo.png"
              alt="HOOWELL Logo"
              style={{
                width: '500px',
                height: 'auto',
                marginBottom: '40px',
                filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))',
                transition: 'all 0.3s ease'
              }}
            />
            
            
          </div>
        </div>

        {/* Sağ Yarı - İş Ortağı Girişi (Büyütülmüş) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0f2324 0%, #0f2324 100%)',
          padding: '40px'
        }}>
          <div className="login-card" style={{
            width: '100%',
            maxWidth: '500px',
            padding: '50px',
            borderRadius: '20px',
            boxShadow: '0 15px 35px rgba(0,0,0,0.3)',
            border: '3px solid #FFD700'
          }}>
            <div style={{
              textAlign: 'center',
              marginBottom: '40px'
            }}>
              <div style={{
                color: '#FFD700',
                fontSize: '48px',
                fontWeight: 'bold',
                marginBottom: '8px',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                letterSpacing: '2px'
              }}>
                İŞ ORTAĞI
              </div>
              <div style={{
                color: '#FFD700',
                fontSize: '48px',
                fontWeight: 'bold',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                letterSpacing: '2px'
              }}>
                GİRİŞİ
              </div>
            </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{
                color: '#ff6b6b',
                backgroundColor: 'rgba(255, 107, 107, 0.1)',
                padding: '10px',
                borderRadius: '8px',
                marginBottom: '20px',
                fontSize: '14px',
                textAlign: 'center'
              }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                color: '#FFD700',
                fontSize: '12px',
                marginBottom: '8px',
                display: 'block',
                textAlign: 'left',
                fontWeight: 'bold'
              }}>
                İŞ ORTAĞI ID NUMARASI
              </label>
              <input
                type="text"
                placeholder="P_____-___-____"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="login-input"
              />
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={{
                color: '#FFD700',
                fontSize: '12px',
                marginBottom: '8px',
                display: 'block',
                textAlign: 'left',
                fontWeight: 'bold'
              }}>
                ŞİFRE
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="login-input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="login-button"
            >
              {loading ? 'GİRİŞ YAPILIYOR...' : 'GİRİŞ YAP'}
            </button>
          </form>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
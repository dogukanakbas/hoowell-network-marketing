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
        
        {/* Sol Kart - HOOWELL Dünyasını Keşfedin */}
        <div 
          onClick={handleDiscoverHoowell}
          className="login-card login-card-clickable"
          style={{ textAlign: 'center' }}
        >
          <div style={{
            color: '#FFD700',
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '20px',
            letterSpacing: '1px'
          }}>
            HOOWELL
          </div>
          
          <div style={{
            color: '#FFD700',
            fontSize: '20px',
            fontWeight: 'bold',
            marginBottom: '10px'
          }}>
            DÜNYASINI
          </div>
          
          <div style={{
            color: '#FFD700',
            fontSize: '18px',
            fontWeight: 'bold'
          }}>
            KEŞFEDİN
          </div>
          
          <div style={{
            color: '#FFD700',
            fontSize: '12px',
            marginTop: '10px',
            opacity: 0.8
          }}>
            (HERKESE AÇIK)
          </div>
        </div>

        {/* Orta - HOOWELL Logo */}
        <div style={{
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '500px'
        }}>
          {/* Logo */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '30px'
          }}>
            <img 
              src="/hoowell-logo.png" 
              alt="HOOWELL Logo"
              className="login-logo-responsive"
              style={{
                objectFit: 'contain',
                transition: 'all 0.3s ease'
              }}
            />
          </div>
        </div>

        {/* Sağ Kart - İş Ortağı Girişi */}
        <div className="login-card">
          <div style={{
            textAlign: 'center',
            marginBottom: '30px'
          }}>
            <div style={{
              color: '#FFD700',
              fontSize: '20px',
              fontWeight: 'bold',
              marginBottom: '5px'
            }}>
              İŞ ORTAĞI
            </div>
            <div style={{
              color: '#FFD700',
              fontSize: '20px',
              fontWeight: 'bold'
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
  );
};

export default Login;
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password);
    
    if (result.success) {
      // AuthContext'ten gelen yönlendirme path'ini kullan
      navigate(result.redirectPath || '/');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <img 
            src="/hoowell-logo.png" 
            alt="HOOWELL Logo"
            style={{
              width: '200px',
              height: '100px',
              objectFit: 'contain'
            }}
          />
        </div>
        <p className="login-subtitle">INNOVATE YOUR LIFE</p>
        
        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{ 
              color: '#721c24', 
              backgroundColor: '#f8d7da', 
              padding: '10px', 
              borderRadius: '5px', 
              marginBottom: '20px' 
            }}>
              {error}
            </div>
          )}
          
          <div className="form-group">
            <label>Kullanıcı Adı / E-posta / Partner ID</label>
            <input
              type="text"
              className="form-control"
              placeholder="Kullanıcı adı, e-posta veya Partner ID (örn: P2025000001)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <small style={{ color: '#666', fontSize: '12px', marginTop: '5px', display: 'block' }}>
              Partner ID ile giriş yapabilirsiniz (örn: P2025000000)
            </small>
          </div>
          
          <div className="form-group">
            <label>Şifre</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
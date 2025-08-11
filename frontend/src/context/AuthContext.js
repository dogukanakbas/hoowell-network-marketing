import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Set axios default base URL based on environment
  axios.defaults.baseURL = process.env.NODE_ENV === 'production' 
    ? window.location.origin 
    : 'http://localhost:5001';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get('/api/auth/me');
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await axios.post('/api/auth/login', {
        username,
        password
      });

      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      
      // Giriş sonrası yönlendirme mantığı
      let redirectPath = '/';
      if (user.role === 'partner' && !user.education_completed) {
        // Eğer kullanıcının education_deadline'ı varsa (yeni kullanıcı), Welcome sayfasına yönlendir
        if (user.education_deadline) {
          // Welcome sayfası daha önce gösterildi mi kontrol et
          const welcomeShown = localStorage.getItem(`welcome_shown_${user.id}`);
          if (!welcomeShown) {
            redirectPath = '/welcome';
          } else {
            redirectPath = '/education';
          }
        } else {
          redirectPath = '/education';
        }
      } else if (user.role === 'partner' && user.education_completed) {
        redirectPath = '/';
      } else if (user.role === 'admin') {
        redirectPath = '/';
      }
      
      return { success: true, redirectPath };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Giriş başarısız'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    // Hemen login sayfasına yönlendir
    window.location.href = '/login';
  };

  const refreshUser = async () => {
    try {
      const response = await axios.get('/api/auth/me');
      setUser(response.data);
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  const value = {
    user,
    login,
    logout,
    loading,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
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

  // Session timeout settings (2 hours of inactivity)
  const SESSION_TIMEOUT = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
  const sessionTimerRef = React.useRef(null);
  const warningTimerRef = React.useRef(null);

  // Initial setup effect
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }

    // Add axios interceptor for token expiration
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        // Eğer user state'i null ise (çıkış yapılmışsa) interceptor'ı tetikleme
        if (!user) {
          return Promise.reject(error);
        }
        
        if (error.response?.status === 401 || error.response?.status === 400) {
          // Token expired or invalid
          if (error.response?.data?.message?.includes('token') || 
              error.response?.data?.message?.includes('Invalid token') ||
              error.response?.data?.message?.includes('Access denied')) {
            alert('🔒 Oturumunuzun süresi doldu. Tekrar giriş yapmanız gerekiyor.');
            logout();
          }
        }
        return Promise.reject(error);
      }
    );

    // Cleanup
    return () => {
      axios.interceptors.response.eject(interceptor);
      clearTimeout(sessionTimerRef.current);
      clearTimeout(warningTimerRef.current);
    };
  }, []);

  // Activity listeners effect - separate from user effect
  useEffect(() => {
    if (!user) return;

    // Start session timer when user is available
    startSessionTimer();

    // Add activity listeners
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click', 'focus'];
    
    const resetTimer = () => {
      console.log('User activity detected, resetting session timer');
      startSessionTimer();
    };

    activityEvents.forEach(event => {
      document.addEventListener(event, resetTimer, true);
    });

    // Cleanup activity listeners
    return () => {
      activityEvents.forEach(event => {
        document.removeEventListener(event, resetTimer, true);
      });
    };
  }, [user]);

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
      
      // Session timer will be started automatically when user state is set
      
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

  const logout = React.useCallback(() => {
    // Clear session timers
    if (sessionTimerRef.current) {
      clearTimeout(sessionTimerRef.current);
      sessionTimerRef.current = null;
    }
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
      warningTimerRef.current = null;
    }
    
    console.log('User logged out, timers cleared');
    
    // Önce user state'ini temizle (interceptor'ın tetiklenmemesi için)
    setUser(null);
    
    // Sonra token'ı temizle
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    
    // Kısa bir gecikme ile yönlendirme (state güncellemesinin tamamlanması için)
    setTimeout(() => {
      window.location.href = '/login';
    }, 100);
  }, []);

  const refreshUser = async () => {
    try {
      const response = await axios.get('/api/auth/me');
      setUser(response.data);
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  // Session timeout functions
  const startSessionTimer = React.useCallback(() => {
    // Clear existing timers
    if (sessionTimerRef.current) {
      clearTimeout(sessionTimerRef.current);
      sessionTimerRef.current = null;
    }
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
      warningTimerRef.current = null;
    }

    console.log('Session timer started/reset');

    // Set warning timer (5 minutes before logout)
    warningTimerRef.current = setTimeout(() => {
      if (user) {
        const shouldContinue = window.confirm(
          '⚠️ Oturumunuz 5 dakika içinde sona erecek!\n\n' +
          'Devam etmek için "Tamam"a tıklayın.\n' +
          'Çıkış yapmak için "İptal"e tıklayın.'
        );
        
        if (shouldContinue) {
          startSessionTimer(); // Reset timer
        } else {
          logout();
        }
      }
    }, SESSION_TIMEOUT - 5 * 60 * 1000); // 5 minutes before timeout

    // Set logout timer
    sessionTimerRef.current = setTimeout(() => {
      if (user) {
        alert('🔒 Güvenlik nedeniyle oturumunuz sonlandırıldı.\n\nTekrar giriş yapmanız gerekiyor.');
        logout();
      }
    }, SESSION_TIMEOUT);
  }, [user]);

  const resetSessionTimer = React.useCallback(() => {
    if (user) {
      startSessionTimer();
    }
  }, [user, startSessionTimer]);

  // Debug session info (development only)
  const getSessionInfo = React.useCallback(() => {
    return {
      hasUser: !!user,
      hasSessionTimer: !!sessionTimerRef.current,
      hasWarningTimer: !!warningTimerRef.current,
      sessionTimeout: SESSION_TIMEOUT / 1000 / 60 // minutes
    };
  }, [user]);

  const value = {
    user,
    login,
    logout,
    loading,
    refreshUser,
    resetSessionTimer,
    getSessionInfo
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
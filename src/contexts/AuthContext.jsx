import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext(null);

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

  useEffect(() => {
    try {
      // Verificar se há usuário salvo no localStorage
      const savedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (savedUser && token && savedUser !== 'undefined' && token !== 'undefined') {
        setUser(JSON.parse(savedUser));
      } else {
        // Limpar dados inválidos
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
      // Limpar localStorage se houver erro
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData, token) => {
    console.log('AuthContext.login chamado com:', { userData, token }); // Debug
    if (userData && token) {
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
      setUser(userData);
      console.log('User setado no state:', userData); // Debug
    } else {
      console.error('Login falhou: userData ou token ausentes'); // Debug
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateUser = (userData) => {
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    }
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const getToken = () => {
    return localStorage.getItem('token');
  };

  const value = {
    user,
    login,
    logout,
    updateUser,
    isAuthenticated,
    getToken,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

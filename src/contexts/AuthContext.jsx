import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { storage } from '../utils/storage';
import authService from '../services/authService';

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

  /**
   * Logout - revoga token no servidor, limpa dados e redireciona
   */
  const logout = async () => {
    await authService.logout();
    setUser(null);
    window.location.href = '/login';
  };

  /**
   * Carregar usuário do localStorage ao iniciar
   */
  useEffect(() => {
    try {
      const savedUser = storage.getUser();
      const token = storage.getAccessToken();
      
      if (savedUser && token) {
        setUser(savedUser);
      } else {
        // Limpar dados inválidos
        storage.clear();
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
      storage.clear();
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Login - salva tokens e usuário
   */
  const login = (userData, token, refreshToken) => {
    if (userData && token) {
      storage.setUser(userData);
      storage.setTokens(token, refreshToken);
      setUser(userData);
    } else {
      console.error('Login falhou: userData ou token ausentes');
    }
  };

  /**
   * Atualizar dados do usuário
   */
  const updateUser = (userData) => {
    if (userData) {
      storage.setUser(userData);
      setUser(userData);
    }
  };

  /**
   * Verificar se está autenticado
   */
  const isAuthenticated = () => {
    return !!user && !!storage.getAccessToken();
  };

  /**
   * Pegar token atual
   */
  const getToken = () => {
    return storage.getAccessToken();
  };

  /**
   * Pegar refresh token
   */
  const getRefreshToken = () => {
    return storage.getRefreshToken();
  };

  const value = {
    user,
    login,
    logout,
    updateUser,
    isAuthenticated,
    getToken,
    getRefreshToken,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

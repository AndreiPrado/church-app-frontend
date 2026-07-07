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
   * Logout - revoga cookies no servidor e limpa dados locais
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
      if (savedUser) {
        setUser(savedUser);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
      storage.clear();
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Login - salva usuário localmente (tokens ficam nos cookies httpOnly)
   */
  const login = (userData) => {
    if (userData) {
      storage.setUser(userData);
      setUser(userData);
    } else {
      console.error('Login falhou: userData ausente');
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
    return !!user;
  };

  const value = {
    user,
    login,
    logout,
    updateUser,
    isAuthenticated,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

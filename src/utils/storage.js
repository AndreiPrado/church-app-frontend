/**
 * Gerenciamento centralizado de tokens e dados do usuário
 */

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'token',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user'
};

export const storage = {
  /**
   * Salvar tokens após login/refresh
   */
  setTokens(accessToken, refreshToken) {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  },

  /**
   * Pegar access token
   */
  getAccessToken() {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  /**
   * Pegar refresh token
   */
  getRefreshToken() {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  },

  /**
   * Salvar dados do usuário
   */
  setUser(user) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  /**
   * Pegar dados do usuário
   */
  getUser() {
    try {
      const user = localStorage.getItem(STORAGE_KEYS.USER);
      return user && user !== 'undefined' ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Erro ao parsear usuário:', error);
      return null;
    }
  },

  /**
   * Limpar tudo (logout)
   */
  clear() {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  /**
   * Verificar se está logado
   */
  isAuthenticated() {
    return !!this.getAccessToken();
  }
};

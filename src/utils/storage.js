/**
 * Gerenciamento centralizado de dados do usuário
 * Tokens JWT agora são gerenciados via cookies httpOnly pelo servidor
 */

const STORAGE_KEYS = {
  USER: 'user'
};

export const storage = {
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
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  /**
   * Verificar se está logado (baseado em dados do usuário no localStorage)
   */
  isAuthenticated() {
    return !!this.getUser();
  }
};

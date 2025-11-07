/**
 * Cliente HTTP centralizado com auto-refresh de tokens
 * Simula interceptors do Axios usando fetch nativo
 */

import { storage } from '../utils/storage';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Controle de renovação para evitar múltiplas requisições simultâneas
let isRefreshing = false;
let failedQueue = [];

/**
 * Processa fila de requisições pendentes após renovação
 */
const processQueue = (error, token = null) => {
  failedQueue.forEach(promise => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  
  failedQueue = [];
};

/**
 * Tenta renovar o token usando refresh token
 */
const refreshAccessToken = async () => {
  const refreshToken = storage.getRefreshToken();
  
  if (!refreshToken) {
    throw new Error('Refresh token não encontrado');
  }

  const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-refresh-token': refreshToken
    },
    credentials: 'include' // Importante: envia/recebe cookies
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Falha ao renovar token');
  }

  const data = await response.json();
  return data.data; // { token, refreshToken, member }
};

/**
 * Cliente HTTP principal com auto-refresh
 */
class ApiClient {
  /**
   * Faz requisição HTTP com tratamento automático de token
   */
  async request(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    
    // Preparar headers
    const headers = {
      ...options.headers
    };

    // Adicionar Content-Type apenas se não for requisição de blob
    if (options.responseType !== 'blob' && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    // Adicionar token de autenticação se disponível
    const token = storage.getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Fazer requisição
    const config = {
      ...options,
      headers,
      credentials: 'include' // Importante: envia/recebe cookies
    };

    let response = await fetch(url, config);

    // Se receber 401, tentar renovar token
    if (response.status === 401 && !options._retry) {
      // Se já está renovando, adiciona na fila
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(newToken => {
            config.headers['Authorization'] = `Bearer ${newToken}`;
            return fetch(url, { ...config, _retry: true });
          })
          .then(response => this.handleResponse(response, options))
          .catch(error => {
            throw error;
          });
      }

      // Marca que está renovando
      config._retry = true;
      isRefreshing = true;

      try {
        console.log('Token expirado, renovando automaticamente...');
        
        // Renovar token
        const refreshData = await refreshAccessToken();
        
        // Salvar novos tokens
        storage.setTokens(refreshData.token, refreshData.refreshToken);
        storage.setUser(refreshData.member);
        
        // Atualizar header e processar fila
        config.headers['Authorization'] = `Bearer ${refreshData.token}`;
        processQueue(null, refreshData.token);
        
        console.log('Token renovado com sucesso');
        
        // Repetir requisição original
        response = await fetch(url, config);
        
      } catch (error) {
        // Falha na renovação - fazer logout
        console.error('Erro ao renovar token:', error);
        processQueue(error, null);
        storage.clear();
        
        // Redirecionar para login
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        
        throw error;
      } finally {
        isRefreshing = false;
      }
    }

    return this.handleResponse(response, options);
  }

  /**
   * Trata resposta da API
   */
  async handleResponse(response, options = {}) {
    const contentType = response.headers.get('content-type');
    
    // Se responseType for 'blob', retornar como Blob (compatível com axios)
    if (options.responseType === 'blob') {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const blob = await response.blob();
      
      // Retornar no formato axios-like { data: blob, status, headers }
      return {
        data: blob,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      };
    }
    
    // Se não for JSON, retorna resposta crua
    if (!contentType || !contentType.includes('application/json')) {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response;
    }

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.detail || data.error || data.message || 'Erro na requisição');
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  }

  /**
   * Métodos HTTP
   */
  async get(endpoint, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'GET'
    });
  }

  async post(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body)
    });
  }

  async patch(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body)
    });
  }

  async put(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body)
    });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'DELETE'
    });
  }
}

// Exportar instância única
const api = new ApiClient();
export default api;

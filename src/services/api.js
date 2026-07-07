/**
 * Cliente HTTP centralizado com auto-refresh de tokens
 * Tokens JWT são gerenciados via cookies httpOnly — sem acesso via JS
 */

import { storage } from '../utils/storage';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Controle de renovação para evitar múltiplas requisições simultâneas
let isRefreshing = false;
let failedQueue = [];

/**
 * Processa fila de requisições pendentes após renovação
 */
const processQueue = (error) => {
  failedQueue.forEach(promise => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });

  failedQueue = [];
};

/**
 * Tenta renovar o token usando o cookie refresh_token httpOnly
 */
const refreshAccessToken = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
    method: 'POST',
    credentials: 'include' // envia/recebe cookies httpOnly automaticamente
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Falha ao renovar token');
  }

  const data = await response.json();
  // Atualizar dados do usuário em localStorage (tokens ficam nos cookies)
  if (data.data?.member) {
    storage.setUser(data.data.member);
  }
};

/**
 * Cliente HTTP principal com auto-refresh
 */
class ApiClient {
  /**
   * Faz requisição HTTP com tratamento automático de token expirado
   */
  async request(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

    // Preparar headers
    const headers = {
      ...options.headers
    };

    // Adicionar Content-Type apenas se:
    // 1. Não for requisição de blob
    // 2. Não for FormData (FormData precisa do boundary automático do browser)
    // 3. Content-Type não estiver definido
    const isFormData = options.body instanceof FormData;
    if (options.responseType !== 'blob' && !isFormData && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    // Fazer requisição — cookies httpOnly são enviados automaticamente pelo browser
    const config = {
      ...options,
      headers,
      credentials: 'include'
    };

    let response = await fetch(url, config);

    // Se receber 401, tentar renovar token via cookie
    if (response.status === 401 && !options._retry) {
      // Se já está renovando, adiciona na fila
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => fetch(url, { ...config, _retry: true }))
          .then(res => this.handleResponse(res, options))
          .catch(error => { throw error; });
      }

      config._retry = true;
      isRefreshing = true;

      try {
        await refreshAccessToken();
        processQueue(null);

        // Repetir requisição original — novo access_token já está no cookie
        response = await fetch(url, config);

      } catch (error) {
        // Falha na renovação - fazer logout
        console.error('Erro ao renovar token:', error);
        processQueue(error);
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
      // Adicionar estrutura response para compatibilidade com axios
      error.response = {
        status: response.status,
        statusText: response.statusText,
        data: data,
        headers: Object.fromEntries(response.headers.entries())
      };
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
      // Não fazer JSON.stringify se for FormData
      body: body instanceof FormData ? body : JSON.stringify(body)
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

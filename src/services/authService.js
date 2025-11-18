/**
 * Serviço de Autenticação
 * Usa o cliente API centralizado com auto-refresh automático
 */

import api from './api';
import { storage } from '../utils/storage';

const API_BASE_URL = import.meta.env.VITE_API_URL;

class AuthService {
  /**
   * Login com email e senha
   */
  async login(email, password) {
    // Login não precisa de token, usa fetch direto
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Importante: recebe cookie de fingerprint
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || errorData.message || 'Erro ao fazer login');
    }

    return await response.json();
  }

  /**
   * Buscar membros (com auto-refresh de token)
   */
  async getMembers(status = null, search = null) {
    const params = new URLSearchParams();
    
    if (status) params.append('status', status);
    if (search) params.append('search', search);
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    const result = await api.get(`/api/members${queryString}`);
    
    return result.data || [];
  }

  /**
   * Buscar membro por ID
   */
  async getMemberById(id) {
    const result = await api.get(`/api/members/${id}`);
    return result.data;
  }

  /**
   * Aprovar membro
   */
  async approveMember(id, roleId) {
    const result = await api.patch(`/api/members/${id}/approve`, { roleId });
    return result.data;
  }

  /**
   * Rejeitar membro (atualiza status para inativo)
   */
  async rejectMember(id) {
    const result = await api.patch(`/api/members/${id}`, { status: 'inativo' });
    return result.data;
  }

  /**
   * Aprovar múltiplos membros
   */
  async approveMembersBatch(ids, roleId) {
    const promises = ids.map(id => this.approveMember(id, roleId));
    
    try {
      const results = await Promise.all(promises);
      return {
        success: true,
        count: results.length,
        data: results
      };
    } catch (error) {
      throw new Error(error.message || 'Erro ao aprovar membros em lote');
    }
  }

  /**
   * Buscar estatísticas de membros
   */
  async getStatistics() {
    const result = await api.get('/api/members/stats');
    return result.data;
  }

  /**
   * Obter foto de membro de forma autenticada
   */
  async getMemberPhoto(memberId) {
    try {
      const response = await api.get(`/api/members/photo/${memberId}`, {
        responseType: 'blob' // Importante: receber como blob
      });
      
      if (!response.data || !(response.data instanceof Blob)) {
        console.warn(`Foto não disponível para membro ${memberId}`);
        return null;
      }
      
      // Criar URL temporária para a imagem
      return URL.createObjectURL(response.data);
    } catch (error) {
      // Se não conseguir carregar a foto, retornar null (silencioso)
      console.debug(`Foto não carregada para membro ${memberId}:`, error.message);
      return null;
    }
  }

  /**
   * Atualizar membro
   */
  async updateMember(id, data) {
    const result = await api.patch(`/api/members/${id}`, data);
    return result.data;
  }

  /**
   * Buscar roles/papéis
   */
  async getRoles() {
    const result = await api.get('/api/roles');
    return result.data || [];
  }

  /**
   * Renovar token manualmente (geralmente não é necessário)
   * O cliente API já faz isso automaticamente
   */
  async refreshToken(refreshToken) {
    const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-refresh-token': refreshToken,
      },
      credentials: 'include'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || errorData.detail || 'Erro ao renovar token');
    }

    const result = await response.json();
    return result.data;
  }

  /**
   * Upload de foto do membro
   */
  async uploadMemberPhoto(memberId, formData) {
    // Não definir Content-Type manualmente - deixar o browser adicionar o boundary automaticamente
    const response = await api.post(`/api/members/${memberId}/photo`, formData);
    // api.post já retorna o JSON parseado: { success: true, data: { photoUrl: "..." } }
    return response;
  }

  /**
   * Logout
   */
  logout() {
    storage.clear();
  }
}

export default new AuthService();

/**
 * Serviço de Membros
 * Cadastro público de membros (não requer autenticação)
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class MemberService {
  /**
   * Criar novo membro (endpoint público)
   * Aceita JSON (sem foto) ou FormData (com foto)
   */
  async createMember(payload) {
    const isFormData = payload instanceof FormData;
    
    const response = await fetch(`${API_BASE_URL}/api/members`, {
      method: "POST",
      headers: isFormData ? {} : { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: isFormData ? payload : JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || errorData.message || errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }
}

export default new MemberService();

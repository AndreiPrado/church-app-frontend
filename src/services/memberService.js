/**
 * Serviço de Membros
 * Cadastro público de membros (não requer autenticação)
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class MemberService {
  /**
   * Criar novo membro (endpoint público)
   */
  async createMember(payload) {
    const response = await fetch(`${API_BASE_URL}/api/members`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Importante: para receber cookies se necessário
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || errorData.message || errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }
}

export default new MemberService();

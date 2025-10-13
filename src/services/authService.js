const API_BASE_URL = import.meta.env.VITE_API_URL;

class AuthService {
  async login(email, password) {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || errorData.message || 'Erro ao fazer login');
    }

    return await response.json();
  }

  async getMembers(token, status = null, search = null) {
    let url = `${API_BASE_URL}/api/members/`;
    const params = new URLSearchParams();
    
    if (status) params.append('status', status);
    if (search) params.append('search', search);
    
    if (params.toString()) url += `?${params.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || errorData.message || 'Erro ao buscar membros');
    }

    const result = await response.json();
    // API retorna { success: true, data: [...], count: number }
    return result.data || [];
  }

  async getMemberById(id, token) {
    const response = await fetch(`${API_BASE_URL}/api/members/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || errorData.message || 'Erro ao buscar membro');
    }

    const result = await response.json();
    // API retorna { success: true, data: { ...member } }
    return result.data;
  }

  async approveMember(id, roleId, token) {
    // API requer roleId no body
    const response = await fetch(`${API_BASE_URL}/api/members/${id}/approve`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ roleId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || errorData.message || 'Erro ao aprovar membro');
    }

    const result = await response.json();
    return result.data;
  }

  async rejectMember(id, token) {
    // API não tem endpoint específico de reject, usa update com status
    const response = await fetch(`${API_BASE_URL}/api/members/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ status: 'inativo' }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || errorData.message || 'Erro ao rejeitar membro');
    }

    const result = await response.json();
    return result.data;
  }

  async approveMembersBatch(ids, roleId, token) {
    // API não tem endpoint de batch, fazer aprovações individuais
    const promises = ids.map(id => this.approveMember(id, roleId, token));
    
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

  async getStatistics(token) {
    // API usa /api/members/stats (não /statistics)
    const response = await fetch(`${API_BASE_URL}/api/members/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || errorData.message || 'Erro ao buscar estatísticas');
    }

    const result = await response.json();
    // API retorna { success: true, data: { total, active, baptized, byGender, byAge } }
    return result.data;
  }

  async updateMember(id, data, token) {
    // API usa PATCH (não PUT)
    const response = await fetch(`${API_BASE_URL}/api/members/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || errorData.message || 'Erro ao atualizar membro');
    }

    const result = await response.json();
    // API retorna { success: true, data: { ...member } }
    return result.data;
  }

  async getRoles(token) {
    const response = await fetch(`${API_BASE_URL}/api/roles`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || errorData.error || 'Erro ao buscar roles');
    }

    const result = await response.json();
    return result.data || [];
  }
}

export default new AuthService();

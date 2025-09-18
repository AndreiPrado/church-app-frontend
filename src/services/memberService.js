const API_BASE_URL = 'https://church-app-backend-production.up.railway.app/api';

class MemberService {
  async createMember(payload) {
    try {
      const response = await fetch(`${API_BASE_URL}/members/`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }
}

export default new MemberService();

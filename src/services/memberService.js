const API_BASE_URL = import.meta.env.VITE_API_URL
class MemberService {
  async createMember(payload) {
    const response = await fetch(`${API_BASE_URL}/api/members/`, {
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
  }
}

export default new MemberService();

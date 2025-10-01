const API_BASE_URL = import.meta.env.VITE_API_URL;

class CepService {
  async getCep(cep) {
    // Remove caracteres não numéricos
    const cleanCep = cep.replace(/\D/g, '');

    if (cleanCep.length !== 8) {
      throw new Error('CEP inválido. Deve conter 8 dígitos.');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/utils/cep/${cleanCep}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('CEP não encontrado.');
        }
        throw new Error('Erro ao buscar CEP. Tente novamente.');
      }

      const result = await response.json();
      
      // Mapeia o retorno da API para o formato esperado
      if (result.success && result.data) {
        return {
          cep: result.data.cep,
          logradouro: result.data.street || '',
          complemento: result.data.complement || '',
          bairro: result.data.neighborhood || '',
          localidade: result.data.city || '',
          uf: result.data.state || '',
          ibge: result.data.ibge || '',
          ddd: result.data.ddd || ''
        };
      }
      
      throw new Error('CEP não encontrado.');
    } catch (error) {
      if (error.message.includes('CEP')) {
        throw error;
      }
      throw new Error('Erro de conexão. Verifique sua internet.');
    }
  }
}

export default new CepService();

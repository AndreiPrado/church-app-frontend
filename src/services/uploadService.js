const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const uploadService = {
  /**
   * Faz upload de foto de perfil para o R2 Storage
   * @param {File} file - Arquivo de imagem
   * @param {string} fullName - Nome completo do usuário
   * @returns {Promise<{url: string, key: string}>}
   */
  async uploadProfilePhoto(file, fullName) {
    try {
      // Validação local
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];

      if (file.size > maxSize) {
        throw new Error(`Arquivo muito grande. Tamanho máximo: 5MB. Tamanho atual: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      }

      if (!allowedTypes.includes(file.type.toLowerCase())) {
        throw new Error(`Tipo de arquivo não permitido. Use: JPEG, PNG, WEBP ou HEIC. Tipo recebido: ${file.type}`);
      }

      // Validar fullName antes de enviar
      const nameToSend = fullName && fullName.trim() !== '' ? fullName.trim() : 'Usuario';
      
      console.log('uploadService - fullName recebido:', fullName);
      console.log('uploadService - nameToSend:', nameToSend);

      // Criar FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fullName', nameToSend);

      // Upload
      const response = await fetch(`${API_URL}/api/upload/profile-photo`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao fazer upload da foto');
      }

      const result = await response.json();
      return result.data; // { url, key }
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  },

  /**
   * Deleta foto de perfil do R2 Storage
   * @param {string} url - URL da foto a ser deletada
   * @returns {Promise<void>}
   */
  async deleteProfilePhoto(url) {
    try {
      const response = await fetch(`${API_URL}/upload/profile-photo`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao deletar foto');
      }

      return await response.json();
    } catch (error) {
      console.error('Delete error:', error);
      throw error;
    }
  },
};

export default uploadService;

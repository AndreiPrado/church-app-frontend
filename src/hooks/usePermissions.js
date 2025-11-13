import { useAuth } from '../contexts/AuthContext';

/**
 * Hook para verificar permissões do usuário
 */
export const usePermissions = () => {
  const { user } = useAuth();

  /**
   * Verifica se o usuário tem uma permissão específica
   * @param {string} permission - Nome da permissão (ex: 'members.read')
   * @returns {boolean}
   */
  const hasPermission = (permission) => {
    if (!user || !user.permissions) return false;
    
    // Otimização: admin.full garante todas as permissões
    if (user.permissions.includes('admin.full')) return true;
    
    return user.permissions.includes(permission);
  };

  /**
   * Verifica se o usuário tem pelo menos uma das permissões fornecidas
   * @param {string[]} permissions - Array de nomes de permissões
   * @returns {boolean}
   */
  const hasAnyPermission = (permissions) => {
    if (!user || !user.permissions) return false;
    
    // Otimização: admin.full garante todas as permissões
    if (user.permissions.includes('admin.full')) return true;
    
    return permissions.some(permission => user.permissions.includes(permission));
  };

  /**
   * Verifica se o usuário tem todas as permissões fornecidas
   * @param {string[]} permissions - Array de nomes de permissões
   * @returns {boolean}
   */
  const hasAllPermissions = (permissions) => {
    if (!user || !user.permissions) return false;
    
    // Otimização: admin.full garante todas as permissões
    if (user.permissions.includes('admin.full')) return true;
    
    return permissions.every(permission => user.permissions.includes(permission));
  };

  /**
   * Verifica se o usuário é admin (tem permissão admin.full)
   * @returns {boolean}
   */
  const isAdmin = () => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes('admin.full');
  };

  /**
   * Retorna todas as permissões do usuário
   * @returns {string[]}
   */
  const getPermissions = () => {
    return user?.permissions || [];
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isAdmin,
    getPermissions,
    permissions: user?.permissions || []
  };
};

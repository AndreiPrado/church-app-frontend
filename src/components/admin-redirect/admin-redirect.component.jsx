import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../loading-spinner/loading-spinner.component';

/**
 * Componente que redireciona usuários baseado em suas permissões:
 * - Membros comuns: /admin/profile
 * - Admins/Líderes: /admin/dashboard
 */
const AdminRedirect = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading || !user) return;

    // Verificar se tem permissões administrativas
    const userPermissions = user.permissions || [];
    const hasAdminPermissions = userPermissions.some(permission => 
      ['admin.full', 'members.read', 'reports.view'].includes(permission)
    );

    if (hasAdminPermissions) {
      // Usuário com permissões administrativas -> Dashboard
      navigate('/admin/dashboard', { replace: true });
    } else {
      // Membro comum -> Perfil
      navigate('/admin/profile', { replace: true });
    }
  }, [user, loading, navigate]);

  // Mostrar loading enquanto determina o redirecionamento
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '50vh' 
    }}>
      <LoadingSpinner message="Redirecionando..." />
    </div>
  );
};

export default AdminRedirect;

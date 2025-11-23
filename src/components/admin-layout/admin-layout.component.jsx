import "./admin-layout.component.scss";
import { useState, useMemo, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { usePermissions } from "../../hooks/usePermissions";
import authService from "../../services/authService";
import PropTypes from "prop-types";
import {
  ChartBarIcon,
  UsersIcon,
  UserCheckIcon,
  UserCircleIcon,
  SignOutIcon,
  ListIcon,
  XIcon,
  HouseIcon
} from "@phosphor-icons/react";
import logoWithoutBackground from '../../assets/logo-without-background.png';

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { hasAnyPermission } = usePermissions();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userPhotoUrl, setUserPhotoUrl] = useState(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Carregar foto do usuário (sempre tenta carregar se tiver user.id)
  useEffect(() => {
    const loadUserPhoto = async () => {
      if (user?.id) {
        try {
          const blob = await authService.getMemberPhoto(user.id);
          if (blob) {
            const blobUrl = URL.createObjectURL(blob);
            setUserPhotoUrl(blobUrl);
          }
        } catch (err) {
          console.error('Erro ao carregar foto do usuário:', err);
        }
      }
    };

    loadUserPhoto();
  }, [user?.id]);

  // Cleanup separado para revogar blob URL
  useEffect(() => {
    return () => {
      if (userPhotoUrl) {
        URL.revokeObjectURL(userPhotoUrl);
      }
    };
  }, [userPhotoUrl]);

  // Definir todos os itens do menu com suas permissões requeridas
  const allMenuItems = [
    {
      path: "/admin/dashboard",
      icon: ChartBarIcon,
      label: "Dashboard",
      requiredPermissions: ['reports.view', 'admin.full'] // Precisa de pelo menos uma dessas
    },
    {
      path: "/admin/members",
      icon: UsersIcon,
      label: "Membros",
      requiredPermissions: ['admin.full'] // Apenas admins
    },
    {
      path: "/admin/approvals",
      icon: UserCheckIcon,
      label: "Aprovações",
      requiredPermissions: ['members.update', 'members.create', 'admin.full']
    },
    {
      path: "/admin/profile",
      icon: UserCircleIcon,
      label: "Minha Conta",
      requiredPermissions: [] // Todos podem acessar
    },
  ];

  // Filtrar itens do menu baseado nas permissões do usuário
  const menuItems = useMemo(() => {
    return allMenuItems.filter(item => {
      // Se não precisa de permissões, mostrar para todos
      if (item.requiredPermissions.length === 0) return true;

      // Verificar se tem pelo menos uma das permissões necessárias
      return hasAnyPermission(item.requiredPermissions);
    });
  }, [user, hasAnyPermission]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <img src={logoWithoutBackground} alt="Zele Church" />
          <h2>Admin</h2>
          <button
            className="close-sidebar"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Fechar menu"
          >
            <XIcon size={24} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setIsSidebarOpen(false)}
            >
              <item.icon size={24} weight="duotone" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          {/* User info em destaque no topo */}
          <div className="user-info">
            <div className="user-avatar-wrapper">
              {userPhotoUrl ? (
                <img
                  src={userPhotoUrl}
                  alt={user?.fullName}
                  className="user-avatar"
                />
              ) : (
                <UserCircleIcon size={48} weight="fill" />
              )}
            </div>
            <div className="user-details">
              <span className="user-name">{user?.fullName || user?.name}</span>
              <span className="user-email">{user?.email}</span>
            </div>
          </div>

          {/* Ações */}
          <div className="footer-actions">
            <button onClick={() => navigate("/home")} className="back-to-site">
              <HouseIcon size={18} />
              Ir para o Site
            </button>
            <button onClick={handleLogout} className="logout-button">
              <SignOutIcon size={18} />
              Sair
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="admin-main">
        {/* Mobile Header */}
        <header className="admin-header-mobile">
          <button
            className="menu-toggle"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Abrir menu"
          >
            <ListIcon size={28} />
          </button>
          <img src={logoWithoutBackground} alt="Zele Church" className="mobile-logo" />
          <div className="header-actions">
            {userPhotoUrl ? (
              <img src={userPhotoUrl} alt={user?.fullName} className="user-avatar-mobile" />
            ) : (
              <UserCircleIcon size={36} weight="fill" />
            )}
          </div>
        </header>

        {/* Content */}
        <main className="admin-content">
          {children}
        </main>
      </div>

      {/* Overlay para mobile */}
      {isSidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}

AdminLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

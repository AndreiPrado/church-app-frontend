import "./admin-layout.component.scss";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import PropTypes from "prop-types";
import {
  ChartBar,
  Users,
  UserCheck,
  UserCircle,
  SignOut,
  List,
  X,
  House
} from "@phosphor-icons/react";
import logoWithoutBackground from '../../assets/logo-without-background.png';

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    { path: "/admin/dashboard", icon: ChartBar, label: "Dashboard" },
    { path: "/admin/members", icon: Users, label: "Membros" },
    { path: "/admin/approvals", icon: UserCheck, label: "Aprovações" },
    { path: "/admin/profile", icon: UserCircle, label: "Minha Conta" },
  ];

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
            <X size={24} />
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
          <button onClick={() => navigate("/home")} className="back-to-site">
            <House size={20} />
            Ir para o Site
          </button>
          <div className="user-info">
            <UserCircle size={32} weight="fill" />
            <div className="user-details">
              <span className="user-name">{user?.fullName || user?.name}</span>
              <span className="user-email">{user?.email}</span>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-button">
            <SignOut size={20} />
            Sair
          </button>
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
            <List size={28} />
          </button>
          <img src={logoWithoutBackground} alt="Zele Church" className="mobile-logo" />
          <div className="header-actions">
            <UserCircle size={32} weight="fill" />
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

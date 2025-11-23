import "./members-list.component.scss";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import authService from "../../services/authService";
import AdminLayout from "../admin-layout/admin-layout.component";
import LoadingSpinner from "../loading-spinner/loading-spinner.component";
import AccessDenied from "../access-denied/access-denied.component";
import MemberPhoto from "../member-photo/member-photo.component";
import MemberEditDrawer from "../member-edit-drawer/member-edit-drawer.component";
import {
  Users,
  MagnifyingGlass,
  Funnel,
  UserCircle,
  Phone,
  EnvelopeSimple,
  CalendarBlank,
  CheckCircle,
  XCircle,
  Clock,
  GridFour,
  ListBullets,
  IdentificationCard,
  ArrowClockwise,
  ArrowsDownUp,
  Eraser
} from "@phosphor-icons/react";

export default function MembersList() {
  const [searchParams] = useSearchParams();
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [baptizedFilter, setBaptizedFilter] = useState("all"); // 'all', 'true', 'false'
  const [sortBy, setSortBy] = useState('name'); // 'name', 'createdAt', 'updatedAt'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' ou 'desc'
  const [viewMode, setViewMode] = useState('cards'); // 'cards' ou 'list'
  const [selectedMember, setSelectedMember] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const loadMembers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // authService.getMembers já usa o token internamente via api.get
      const data = await authService.getMembers();
      setMembers(data);
      setFilteredMembers(data);
    } catch (err) {
      // Capturar erro 403 (sem permissão) e outros erros
      const errorData = err.response?.data;
      const statusCode = err.response?.status;
      
      setError({
        message: errorData?.error || errorData?.detail || err.message || "Erro ao carregar membros",
        detail: errorData?.detail,
        statusCode: statusCode,
        isAccessDenied: statusCode === 403
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  // Fechar modal de filtros ao redimensionar para desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && showFilters) {
        setShowFilters(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [showFilters]);

  // Bloquear scroll quando modal de filtros estiver aberto (apenas mobile)
  useEffect(() => {
    if (window.innerWidth <= 768) {
      if (showFilters) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }
    }

    return () => {
      if (window.innerWidth <= 768) {
        document.body.style.overflow = 'unset';
      }
    };
  }, [showFilters]);

  // Aplicar filtros vindos dos query params
  useEffect(() => {
    const status = searchParams.get('status');
    const baptized = searchParams.get('baptized');

    if (status) {
      setStatusFilter(status);
    }

    if (baptized) {
      setBaptizedFilter(baptized);
    }
  }, [searchParams]);

  useEffect(() => {
    filterMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, statusFilter, baptizedFilter, sortBy, sortOrder, members]);

  const filterMembers = () => {
    let filtered = [...members];

    // Filtro por status
    if (statusFilter !== "all") {
      filtered = filtered.filter(member => member.status === statusFilter);
    }

    // Filtro por batizado
    if (baptizedFilter !== "all") {
      const isBaptized = baptizedFilter === "true";
      filtered = filtered.filter(member => member.baptized === isBaptized);
    }

    // Filtro por busca
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(member =>
        member.fullName?.toLowerCase().includes(search) ||
        member.email?.toLowerCase().includes(search) ||
        member.cpf?.includes(search) ||
        member.phone?.includes(search)
      );
    }

    // Ordenação
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'name':
          // Ordem alfabética por nome
          comparison = (a.fullName || '').localeCompare(b.fullName || '', 'pt-BR');
          break;

        case 'createdAt': {
          // Por data de criação
          const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
          const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
          comparison = dateA - dateB;
          break;
        }

        case 'updatedAt': {
          // Por data de atualização
          const updatedA = a.updatedAt ? new Date(a.updatedAt) : new Date(0);
          const updatedB = b.updatedAt ? new Date(b.updatedAt) : new Date(0);
          comparison = updatedA - updatedB;
          break;
        }

        default:
          return 0;
      }

      // Aplicar ordem (asc ou desc)
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredMembers(filtered);
  };

  const handleMemberClick = (member) => {
    setSelectedMember(member);
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setSelectedMember(null);
  };

  const handleMemberSave = (updatedMember) => {
    // Atualizar a lista de membros com o membro atualizado
    setMembers(prev => prev.map(m => m.id === updatedMember.id ? updatedMember : m));
    loadMembers(); // Recarregar lista completa
  };

  const handleClearFilters = () => {
    setStatusFilter('all');
    setBaptizedFilter('all');
    setSortBy('name');
    setSortOrder('asc');
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "ativo":
        return <CheckCircle size={20} weight="fill" />;
      case "visitante":
        return <UserCircle size={20} weight="fill" />;
      case "pendente":
        return <Clock size={20} weight="fill" />;
      case "inativo":
        return <XCircle size={20} weight="fill" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "ativo":
        return "Ativo";
      case "visitante":
        return "Visitante";
      case "pendente":
        return "Pendente";
      case "inativo":
        return "Inativo";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <LoadingSpinner message="Carregando membros..." />
      </AdminLayout>
    );
  }

  if (error) {
    // Se é erro de permissão (403), mostrar página de acesso negado
    if (error.isAccessDenied) {
      return (
        <AdminLayout>
          <AccessDenied message={error.message} detail={error.detail} />
        </AdminLayout>
      );
    }

    // Outros erros
    return (
      <AdminLayout>
        <div className="members-list-error">
          <p>{error.message}</p>
          <button onClick={loadMembers}>
            <ArrowClockwise size={20} weight="bold" />
            Tentar novamente
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="members-list">
        <div className="members-header">
          <div className="header-title">
            <Users size={32} weight="duotone" />
            <div>
              <h1>Membros</h1>
              <p>{filteredMembers.length} de {members.length} membros</p>
            </div>
          </div>

          <div className="view-controls">
            <button
              className={`view-btn ${viewMode === 'cards' ? 'active' : ''}`}
              onClick={() => setViewMode('cards')}
            >
              <GridFour size={20} weight="duotone" />
              Cards
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <ListBullets size={20} weight="duotone" />
              Lista
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="members-filters">
          {/* Busca sempre visível */}
          <div className="search-box">
            <MagnifyingGlass size={20} />
            <input
              type="text"
              placeholder="Buscar por nome, email, CPF ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Botão de filtro (mobile) */}
          <button className="filter-toggle-btn" onClick={() => setShowFilters(!showFilters)}>
            <Funnel size={20} weight={showFilters ? "fill" : "regular"} />
            Filtros
            {(statusFilter !== 'all' || baptizedFilter !== 'all' || sortBy !== 'name') && (
              <span className="filter-badge"></span>
            )}
          </button>

          {/* Filtros desktop / Modal mobile */}
          <div className={`filters-container ${showFilters ? 'show' : ''}`}>
            <div className="filters-header">
              <h3>Filtros</h3>
              <button className="close-filters" onClick={() => setShowFilters(false)}>
                ×
              </button>
            </div>

            <div className="filters-content">
              {/* Botão Limpar Filtros */}
              {(statusFilter !== 'all' || baptizedFilter !== 'all' || sortBy !== 'name') && (
                <button className="clear-filters-btn" onClick={handleClearFilters}>
                  <Eraser size={18} weight="bold" />
                  Limpar Filtros
                </button>
              )}
              
              <div className="filter-box">
                <Funnel size={20} />
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="all">Todos os status</option>
                  <option value="ativo">Ativos</option>
                  <option value="visitante">Visitantes</option>
                  <option value="pendente">Pendentes</option>
                  <option value="inativo">Inativos</option>
                </select>
              </div>

              <div className="filter-box">
                <Funnel size={20} />
                <select value={baptizedFilter} onChange={(e) => setBaptizedFilter(e.target.value)}>
                  <option value="all">Batismo</option>
                  <option value="true">Batizados</option>
                  <option value="false">Não batizados</option>
                </select>
              </div>

              <div className="sort-controls">
                <div className="filter-box">
                  <ArrowsDownUp size={20} />
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="name">Ordenar por Nome</option>
                    <option value="createdAt">Data de Cadastro</option>
                    <option value="updatedAt">Última Edição</option>
                  </select>
                </div>
                <button 
                  className="sort-order-btn"
                  onClick={toggleSortOrder}
                  title={sortOrder === 'asc' ? 'Ordem Crescente' : 'Ordem Decrescente'}
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                  <span className="sort-order-label">
                    {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Overlay para mobile */}
          {showFilters && <div className="filters-overlay" onClick={() => setShowFilters(false)}></div>}
        </div>

        {/* Lista de Membros */}
        {filteredMembers.length === 0 ? (
          <div className="no-members">
            <Users size={64} weight="duotone" />
            <p>Nenhum membro encontrado</p>
          </div>
        ) : viewMode === 'cards' ? (
          <div className="members-grid">
            {filteredMembers.map((member) => (
              <div key={member.id} className="member-card" onClick={() => handleMemberClick(member)}>
                <div className="member-card-header">
                  <div className="member-avatar">
                    <MemberPhoto
                      memberId={member.id}
                      memberName={member.fullName}
                      size={48}
                      fallbackIcon={UserCircle}
                      hasPhotoUrl={!!member.photoUrl}
                    />
                  </div>
                  <div className="member-basic-info">
                    <div className="member-name-row">
                      <h3>{member.fullName}</h3>
                      <span className="member-number">#{member.memberNumber}</span>
                    </div>
                    <span className={`member-status ${member.status}`}>
                      {getStatusIcon(member.status)}
                      {getStatusLabel(member.status)}
                    </span>
                  </div>
                </div>

                <div className="member-card-body">
                  <div className="info-item">
                    <EnvelopeSimple size={18} weight="duotone" />
                    <span>{member.email}</span>
                  </div>
                  <div className="info-item">
                    <Phone size={18} weight="duotone" />
                    <span>{member.phone}</span>
                  </div>
                  {member.cpf && (
                    <div className="info-item">
                      <IdentificationCard size={18} weight="duotone" />
                      <span>{member.cpf}</span>
                    </div>
                  )}
                  {member.birthDate && (
                    <div className="info-item">
                      <CalendarBlank size={18} weight="duotone" />
                      <span>
                        {new Date(member.birthDate).toLocaleDateString('pt-BR')} ({member.age} anos)
                      </span>
                    </div>
                  )}
                </div>

                <div className="member-card-footer">
                  <div className="member-details">
                    <span className="detail-item">
                      <strong>Gênero:</strong> {member.gender}
                    </span>
                    {member.baptized ? (
                      <span className="detail-item baptized">
                        <CheckCircle size={16} weight="fill" />
                        Batizado
                      </span>
                    ) : (
                      <span className="detail-item not-baptized">
                        <XCircle size={16} weight="fill" />
                        Não batizado
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="members-list-view">
            {filteredMembers.map((member) => (
              <div key={member.id} className="member-list-item" onClick={() => handleMemberClick(member)}>
                <div className="list-avatar">
                  <MemberPhoto
                    memberId={member.id}
                    memberName={member.fullName}
                    size={40}
                    fallbackIcon={UserCircle}
                    hasPhotoUrl={!!member.photoUrl}
                  />
                </div>

                <div className="list-main-info">
                  <div className="list-name-section">
                    <h4>{member.fullName}</h4>
                    <span className="list-member-number">#{member.memberNumber}</span>
                  </div>
                  <div className="list-contact-info">
                    <span className="list-email">
                      <EnvelopeSimple size={14} weight="duotone" />
                      {member.email}
                    </span>
                    <span className="list-separator">•</span>
                    <span className="list-phone">
                      <Phone size={14} weight="duotone" />
                      {member.phone}
                    </span>
                  </div>
                </div>

                <div className="list-meta-info">
                  <div className="list-badges-row">
                    <span className={`list-status ${member.status}`}>
                      {getStatusIcon(member.status)}
                      {getStatusLabel(member.status)}
                    </span>
                    {member.baptized ? (
                      <span className="list-baptized">
                        <CheckCircle size={12} weight="fill" />
                        Batizado
                      </span>
                    ) : (
                      <span className="list-not-baptized">
                        <XCircle size={12} weight="fill" />
                        Não batizado
                      </span>
                    )}
                  </div>
                  <div className="list-extra-info">
                    {member.birthDate && (
                      <span className="list-age">{member.age} anos</span>
                    )}
                    <span className="list-separator">•</span>
                    <span className="list-gender">{member.gender}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Drawer de Edição */}
        <MemberEditDrawer
          member={selectedMember}
          isOpen={isDrawerOpen}
          onClose={handleDrawerClose}
          onSave={handleMemberSave}
        />
      </div>
    </AdminLayout>
  );
}

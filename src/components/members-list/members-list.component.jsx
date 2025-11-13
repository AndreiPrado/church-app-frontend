import "./members-list.component.scss";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import authService from "../../services/authService";
import AdminLayout from "../admin-layout/admin-layout.component";
import LoadingSpinner from "../loading-spinner/loading-spinner.component";
import AccessDenied from "../access-denied/access-denied.component";
import MemberPhoto from "../member-photo/member-photo.component";
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
  ArrowClockwise
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
  const [viewMode, setViewMode] = useState('cards'); // 'cards' ou 'list'

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
      setError({
        message: err.response?.data?.friendlyMessage || err.response?.data?.error || err.message || "Erro ao carregar membros",
        statusCode: err.response?.status,
        isAccessDenied: err.response?.status === 403
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

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
  }, [searchTerm, statusFilter, baptizedFilter, members]);

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

    setFilteredMembers(filtered);
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
          <AccessDenied message={error.message} />
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
          <div className="search-box">
            <MagnifyingGlass size={20} />
            <input
              type="text"
              placeholder="Buscar por nome, email, CPF ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

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
              <div key={member.id} className="member-card">
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
              <div key={member.id} className="member-list-item">
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
      </div>
    </AdminLayout>
  );
}

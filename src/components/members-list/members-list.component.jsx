import "./members-list.component.scss";
import { useState, useEffect, useCallback } from "react";
import authService from "../../services/authService";
import AdminLayout from "../admin-layout/admin-layout.component";
import LoadingSpinner from "../loading-spinner/loading-spinner.component";
import MemberPhoto from "../member-photo/member-photo.component";
import {
  Users,
  MagnifyingGlass,
  Funnel,
  UserCircle,
  Phone,
  EnvelopeSimple,
  MapPin,
  CalendarBlank,
  CheckCircle,
  XCircle,
  Clock
} from "@phosphor-icons/react";

export default function MembersList() {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadMembers = useCallback(async () => {
    try {
      setLoading(true);
      // authService.getMembers já usa o token internamente via api.get
      const data = await authService.getMembers();
      setMembers(data);
      setFilteredMembers(data);
    } catch (err) {
      setError(err.message || "Erro ao carregar membros");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  useEffect(() => {
    filterMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, statusFilter, members]);

  const filterMembers = () => {
    let filtered = [...members];

    // Filtro por status
    if (statusFilter !== "all") {
      filtered = filtered.filter(member => member.status === statusFilter);
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
    return (
      <AdminLayout>
        <div className="members-error">
          <p>{error}</p>
          <button onClick={loadMembers}>Tentar novamente</button>
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
        </div>

        {/* Lista de Membros */}
        <div className="members-grid">
          {filteredMembers.length === 0 ? (
            <div className="no-members">
              <Users size={64} weight="duotone" />
              <p>Nenhum membro encontrado</p>
            </div>
          ) : (
            filteredMembers.map((member) => (
              <div key={member.id} className="member-card">
                <div className="member-card-header">
                  <div className="member-avatar">
                    <MemberPhoto 
                      memberId={member.id}
                      memberName={member.fullName}
                      size={48}
                      fallbackIcon={UserCircle}
                    />
                  </div>
                  <div className="member-basic-info">
                    <h3>{member.fullName}</h3>
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
                  <div className="info-item">
                    <MapPin size={18} weight="duotone" />
                    <span>{member.city} - {member.state}</span>
                  </div>
                  <div className="info-item">
                    <CalendarBlank size={18} weight="duotone" />
                    <span>
                      Cadastrado em {new Date(member.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>

                <div className="member-card-footer">
                  <div className="member-details">
                    <span className="detail-item">
                      <strong>Gênero:</strong> {member.gender}
                    </span>
                    <span className="detail-item">
                      <strong>Estado Civil:</strong> {member.maritalStatus}
                    </span>
                    {member.baptized && (
                      <span className="detail-item baptized">
                        <CheckCircle size={16} weight="fill" />
                        Batizado
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

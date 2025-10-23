import "./approvals.component.scss";
import { useState, useEffect, useCallback } from "react";
import authService from "../../services/authService";
import AdminLayout from "../admin-layout/admin-layout.component";
import LoadingSpinner from "../loading-spinner/loading-spinner.component";
import FloatingAlert from "../floating-alert/floating-alert.component";
import MemberPhoto from "../member-photo/member-photo.component";
import {
  UserCheck,
  CheckCircle,
  XCircle,
  UserCircle,
  Phone,
  EnvelopeSimple,
  MapPin,
  CalendarBlank,
  IdentificationCard,
  GridFour,
  ListBullets
} from "@phosphor-icons/react";

export default function Approvals() {
  const [pendingMembers, setPendingMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [alert, setAlert] = useState({ isVisible: false, message: '', type: '' });
  const [viewMode, setViewMode] = useState('cards'); // 'cards' ou 'list'

  const loadPendingMembers = useCallback(async () => {
    try {
      setLoading(true);
      
      // Buscar roles e membros pendentes em paralelo
      const [rolesData, membersData] = await Promise.all([
        authService.getRoles(),
        authService.getMembers('pendente') // Filtrar por status na API
      ]);
      
      setRoles(rolesData);
      setPendingMembers(membersData);
      
      // Selecionar primeira role por padrão
      if (rolesData.length > 0 && !selectedRole) {
        setSelectedRole(rolesData[0].id);
      }
    } catch (err) {
      setError(err.message || "Erro ao carregar membros pendentes");
    } finally {
      setLoading(false);
    }
  }, [selectedRole]);

  useEffect(() => {
    loadPendingMembers();
  }, [loadPendingMembers]);

  const handleSelectMember = (memberId) => {
    setSelectedMembers(prev => {
      if (prev.includes(memberId)) {
        return prev.filter(id => id !== memberId);
      } else {
        return [...prev, memberId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedMembers.length === pendingMembers.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(pendingMembers.map(m => m.id));
    }
  };

  const handleApproveSingle = async (memberId) => {
    if (!selectedRole) {
      setAlert({
        isVisible: true,
        message: 'Selecione uma role antes de aprovar',
        type: 'error'
      });
      return;
    }

    try {
      setIsProcessing(true);
      await authService.approveMember(memberId, selectedRole);
      
      setAlert({
        isVisible: true,
        message: 'Membro aprovado com sucesso!',
        type: 'success'
      });

      setPendingMembers(prev => prev.filter(m => m.id !== memberId));
    } catch (err) {
      setAlert({
        isVisible: true,
        message: err.message || 'Erro ao aprovar membro',
        type: 'error'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectSingle = async (memberId) => {
    try {
      setIsProcessing(true);
      await authService.rejectMember(memberId);
      
      setAlert({
        isVisible: true,
        message: 'Membro rejeitado',
        type: 'success'
      });

      setPendingMembers(prev => prev.filter(m => m.id !== memberId));
    } catch (err) {
      setAlert({
        isVisible: true,
        message: err.message || 'Erro ao rejeitar membro',
        type: 'error'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApproveBatch = async () => {
    if (selectedMembers.length === 0) {
      setAlert({
        isVisible: true,
        message: 'Selecione pelo menos um membro',
        type: 'error'
      });
      return;
    }

    if (!selectedRole) {
      setAlert({
        isVisible: true,
        message: 'Selecione uma role antes de aprovar',
        type: 'error'
      });
      return;
    }

    try {
      setIsProcessing(true);
      await authService.approveMembersBatch(selectedMembers, selectedRole);
      
      setAlert({
        isVisible: true,
        message: `${selectedMembers.length} membro(s) aprovado(s) com sucesso!`,
        type: 'success'
      });

      setPendingMembers(prev => prev.filter(m => !selectedMembers.includes(m.id)));
      setSelectedMembers([]);
    } catch (err) {
      setAlert({
        isVisible: true,
        message: err.message || 'Erro ao aprovar membros em lote',
        type: 'error'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <LoadingSpinner message="Carregando aprovações..." />
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="approvals-error">
          <p>{error}</p>
          <button onClick={loadPendingMembers}>Tentar novamente</button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {isProcessing && <LoadingSpinner message="Processando..." />}
      
      <div className="approvals">
        <div className="approvals-header">
          <div className="header-title">
            <UserCheck size={32} weight="duotone" />
            <div>
              <h1>Aprovações</h1>
              <p>{pendingMembers.length} cadastro(s) aguardando aprovação</p>
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

          {pendingMembers.length > 0 && (
            <div className="bulk-actions">
              <div className="role-selector">
                <label htmlFor="role-select">Role:</label>
                <select 
                  id="role-select"
                  value={selectedRole} 
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="role-select"
                >
                  <option value="">Selecione uma role</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>
                      {role.name} - {role.description}
                    </option>
                  ))}
                </select>
              </div>
              <button 
                className="select-all-btn"
                onClick={handleSelectAll}
              >
                {selectedMembers.length === pendingMembers.length ? 'Desselecionar Todos' : 'Selecionar Todos'}
              </button>
              {selectedMembers.length > 0 && (
                <button 
                  className="approve-batch-btn"
                  onClick={handleApproveBatch}
                  disabled={!selectedRole}
                >
                  <CheckCircle size={20} weight="fill" />
                  Aprovar {selectedMembers.length} Selecionado(s)
                </button>
              )}
            </div>
          )}
        </div>

        {/* Lista de Membros Pendentes */}
        <div className={`approvals-list ${viewMode === 'list' ? 'list-view' : 'cards-view'}`}>
          {pendingMembers.length === 0 ? (
            <div className="no-approvals">
              <UserCheck size={64} weight="duotone" />
              <p>Nenhum cadastro pendente de aprovação</p>
            </div>
          ) : (
            pendingMembers.map((member) => (
              <div key={member.id} className="approval-card">
                <div className="approval-card-header">
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(member.id)}
                    onChange={() => handleSelectMember(member.id)}
                    className="member-checkbox"
                  />
                  <div className="member-avatar">
                    <MemberPhoto 
                      memberId={member.id}
                      memberName={member.fullName}
                      size={64}
                      fallbackIcon={UserCircle}
                    />
                  </div>
                  <div className="member-basic-info">
                    <h3>{member.fullName}</h3>
                    <span className="member-date">
                      Cadastrado em {new Date(member.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>

                <div className="approval-card-body">
                  <div className="info-section">
                    <h4>Informações de Contato</h4>
                    <div className="info-grid">
                      <div className="info-item">
                        <EnvelopeSimple size={18} weight="duotone" />
                        <span>{member.email}</span>
                      </div>
                      <div className="info-item">
                        <Phone size={18} weight="duotone" />
                        <span>{member.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="info-section">
                    <h4>Dados Pessoais</h4>
                    <div className="info-grid">
                      <div className="info-item">
                        <IdentificationCard size={18} weight="duotone" />
                        <span>CPF: {member.cpf}</span>
                      </div>
                      <div className="info-item">
                        <CalendarBlank size={18} weight="duotone" />
                        <span>Nascimento: {member.birthDate}</span>
                      </div>
                      <div className="info-item">
                        <span><strong>Gênero:</strong> {member.gender}</span>
                      </div>
                      <div className="info-item">
                        <span><strong>Estado Civil:</strong> {member.maritalStatus}</span>
                      </div>
                      {member.baptized && (
                        <div className="info-item baptized">
                          <CheckCircle size={16} weight="fill" />
                          <span>Batizado{member.baptismDate && ` em ${member.baptismDate}`}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="info-section">
                    <h4>Endereço</h4>
                    <div className="info-grid">
                      <div className="info-item">
                        <MapPin size={18} weight="duotone" />
                        <span>{member.address}, {member.city} - {member.state}</span>
                      </div>
                      {member.addressComplement && (
                        <div className="info-item">
                          <span>Complemento: {member.addressComplement}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="approval-card-footer">
                  <button
                    className="reject-btn"
                    onClick={() => handleRejectSingle(member.id)}
                  >
                    <XCircle size={20} weight="fill" />
                    Rejeitar
                  </button>
                  <button
                    className="approve-btn"
                    onClick={() => handleApproveSingle(member.id)}
                  >
                    <CheckCircle size={20} weight="fill" />
                    Aprovar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <FloatingAlert
        message={alert.message}
        type={alert.type}
        isVisible={alert.isVisible}
        onClose={() => setAlert({ isVisible: false, message: '', type: '' })}
        duration={5000}
      />
    </AdminLayout>
  );
}

import "./approvals.component.scss";
import { useState, useEffect, useCallback } from "react";
import authService from "../../services/authService";
import AdminLayout from "../admin-layout/admin-layout.component";
import LoadingSpinner from "../loading-spinner/loading-spinner.component";
import FloatingAlert from "../floating-alert/floating-alert.component";
import MemberPhoto from "../member-photo/member-photo.component";
import AccessDenied from "../access-denied/access-denied.component";
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
  ListBullets,
  ArrowClockwise
} from "@phosphor-icons/react";

export default function Approvals() {
  const [pendingMembers, setPendingMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [alert, setAlert] = useState({ isVisible: false, message: '', type: '' });
  const [viewMode, setViewMode] = useState('cards'); // 'cards' ou 'list'

  // Helper para formatar datas de forma segura
  const formatDate = (dateString) => {
    if (!dateString) return 'Data não disponível';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Data inválida';
      return date.toLocaleDateString('pt-BR');
    } catch {
      return 'Data inválida';
    }
  };

  const loadPendingMembers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
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
      // Capturar erro 403 (sem permissão) e outros erros
      setError({
        message: err.response?.data?.friendlyMessage || err.response?.data?.error || err.message || "Erro ao carregar membros pendentes",
        statusCode: err.response?.status,
        isAccessDenied: err.response?.status === 403
      });
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
        <div className="approvals-error">
          <p>{error.message}</p>
          <button onClick={loadPendingMembers}>
            <ArrowClockwise size={20} weight="bold" />
            Tentar novamente
          </button>
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
        {pendingMembers.length === 0 ? (
          <div className="no-approvals">
            <UserCheck size={64} weight="duotone" />
            <p>Nenhum cadastro pendente de aprovação</p>
          </div>
        ) : viewMode === 'cards' ? (
          <div className="approvals-list cards-view">
            {pendingMembers.map((member) => (
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
                      hasPhotoUrl={!!member.photoUrl}
                    />
                  </div>
                  <div className="member-basic-info">
                    <h3>{member.fullName}</h3>
                    <span className="member-date">
                      Cadastrado em {formatDate(member.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="approval-card-body">
                  <div className="info-section">
                    <h4>Informações de Contato</h4>
                    <div className="info-grid">
                      <div className="info-item">
                        <EnvelopeSimple size={18} weight="duotone" />
                        <span>{member.email || 'Email não informado'}</span>
                      </div>
                      <div className="info-item">
                        <Phone size={18} weight="duotone" />
                        <span>{member.phone || 'Telefone não informado'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="info-section">
                    <h4>Dados Pessoais</h4>
                    <div className="info-grid">
                      {member.cpf && (
                        <div className="info-item">
                          <IdentificationCard size={18} weight="duotone" />
                          <span>CPF: {member.cpf}</span>
                        </div>
                      )}
                      {member.birthDate && (
                        <div className="info-item">
                          <CalendarBlank size={18} weight="duotone" />
                          <span>Nascimento: {formatDate(member.birthDate)}</span>
                        </div>
                      )}
                      {member.gender && (
                        <div className="info-item">
                          <span><strong>Gênero:</strong> {member.gender}</span>
                        </div>
                      )}
                      {member.maritalStatus && (
                        <div className="info-item">
                          <span><strong>Estado Civil:</strong> {member.maritalStatus}</span>
                        </div>
                      )}
                      {member.profession && (
                        <div className="info-item">
                          <span><strong>Profissão:</strong> {member.profession}</span>
                        </div>
                      )}
                      {member.baptized && (
                        <div className="info-item baptized">
                          <CheckCircle size={16} weight="fill" />
                          <span>Batizado{member.baptismDate && ` em ${formatDate(member.baptismDate)}`}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {(member.address || member.city || member.state || member.zipCode) && (
                    <div className="info-section">
                      <h4>Endereço</h4>
                      <div className="info-grid">
                        {(member.address || member.city || member.state) && (
                          <div className="info-item">
                            <MapPin size={18} weight="duotone" />
                            <span>
                              {member.address || 'Endereço não informado'}
                              {member.city && `, ${member.city}`}
                              {member.state && ` - ${member.state}`}
                            </span>
                          </div>
                        )}
                        {member.zipCode && (
                          <div className="info-item">
                            <span><strong>CEP:</strong> {member.zipCode}</span>
                          </div>
                        )}
                        {member.addressComplement && (
                          <div className="info-item">
                            <span><strong>Complemento:</strong> {member.addressComplement}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
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
            ))}
          </div>
        ) : (
          <div className="approvals-table-container">
            <table className="approvals-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectedMembers.length === pendingMembers.length && pendingMembers.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>Foto</th>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Telefone</th>
                  <th>CPF</th>
                  <th>Cidade/UF</th>
                  <th>Batizado</th>
                  <th>Cadastro</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {pendingMembers.map((member) => (
                  <tr key={member.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedMembers.includes(member.id)}
                        onChange={() => handleSelectMember(member.id)}
                      />
                    </td>
                    <td>
                      <div className="table-avatar">
                        <MemberPhoto 
                          memberId={member.id}
                          memberName={member.fullName}
                          size={32}
                          fallbackIcon={UserCircle}
                          hasPhotoUrl={!!member.photoUrl}
                        />
                      </div>
                    </td>
                    <td>
                      <strong>{member.fullName}</strong>
                    </td>
                    <td>{member.email || '-'}</td>
                    <td>{member.phone || '-'}</td>
                    <td>{member.cpf || '-'}</td>
                    <td>
                      {member.city && member.state 
                        ? `${member.city} - ${member.state}` 
                        : member.city || member.state || '-'
                      }
                    </td>
                    <td className="baptized-cell">
                      {member.baptized ? (
                        <CheckCircle size={18} weight="fill" className="baptized-icon" />
                      ) : (
                        <XCircle size={18} weight="fill" className="not-baptized-icon" />
                      )}
                    </td>
                    <td>
                      {formatDate(member.createdAt)}
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="table-reject-btn"
                          onClick={() => handleRejectSingle(member.id)}
                          title="Rejeitar"
                        >
                          <XCircle size={18} weight="fill" />
                        </button>
                        <button
                          className="table-approve-btn"
                          onClick={() => handleApproveSingle(member.id)}
                          title="Aprovar"
                        >
                          <CheckCircle size={18} weight="fill" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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

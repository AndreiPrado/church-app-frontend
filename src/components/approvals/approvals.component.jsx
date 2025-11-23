import "./approvals.component.scss";
import { useState, useEffect, useCallback } from "react";
import authService from "../../services/authService";
import AdminLayout from "../admin-layout/admin-layout.component";
import LoadingSpinner from "../loading-spinner/loading-spinner.component";
import FloatingAlert from "../floating-alert/floating-alert.component";
import MemberPhoto from "../member-photo/member-photo.component";
import AccessDenied from "../access-denied/access-denied.component";
import ConfirmationModal from "../confirmation-modal/confirmation-modal.component";
import {
  UserCheckIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserCircleIcon,
  PhoneIcon,
  EnvelopeSimpleIcon,
  MapPinIcon,
  CalendarBlankIcon,
  IdentificationCardIcon,
  GridFourIcon,
  ListBulletsIcon,
  ArrowClockwiseIcon,
  MagnifyingGlassIcon,
  WarningIcon
} from "@phosphor-icons/react";

export default function Approvals() {
  const [pendingMembers, setPendingMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [alert, setAlert] = useState({ isVisible: false, message: '', type: '' });
  const [viewMode, setViewMode] = useState('cards'); // 'cards' ou 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, member: null, action: null });

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

  // Verificar se o membro tem dados completos para aprovação
  const hasCompleteData = (member) => {
    const hasEmail = member.email && member.email.trim() !== '';
    const hasPhone = member.phone && member.phone.trim() !== '';
    return hasEmail && hasPhone;
  };

  // Obter campos faltantes
  const getMissingFields = (member) => {
    const missing = [];
    if (!member.email || member.email.trim() === '') {
      missing.push('email');
    }
    if (!member.phone || member.phone.trim() === '') {
      missing.push('phone');
    }
    return missing;
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
      setFilteredMembers(membersData);

      // Selecionar role "membro" por padrão
      if (rolesData.length > 0 && !selectedRole) {
        const membroRole = rolesData.find(role =>
          role.name.toLowerCase() === 'membro'
        );
        if (membroRole) {
          setSelectedRole(membroRole.id);
        } else {
          setSelectedRole(rolesData[0].id); // Fallback para primeira role
        }
      }
    } catch (err) {
      // Capturar erro 403 (sem permissão) e outros erros
      const errorData = err.response?.data;
      const statusCode = err.response?.status;

      setError({
        message: errorData?.error || errorData?.detail || err.message || "Erro ao carregar membros pendentes",
        detail: errorData?.detail,
        statusCode: statusCode,
        isAccessDenied: statusCode === 403
      });
    } finally {
      setLoading(false);
    }
  }, [selectedRole]);

  // Filtrar membros por busca
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredMembers(pendingMembers);
      return;
    }

    const filtered = pendingMembers.filter(member =>
      member.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone?.includes(searchTerm) ||
      member.memberNumber?.toString().includes(searchTerm)
    );

    setFilteredMembers(filtered);
  }, [searchTerm, pendingMembers]);

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

  const handleApproveSingle = (memberId) => {
    if (!selectedRole) {
      setAlert({
        isVisible: true,
        message: 'Selecione uma role antes de aprovar',
        type: 'error'
      });
      return;
    }

    const member = pendingMembers.find(m => m.id === memberId);
    const role = roles.find(r => r.id === selectedRole);

    setConfirmModal({
      isOpen: true,
      member,
      role,
      action: 'approve'
    });
  };

  const confirmApproveSingle = async () => {
    const { member } = confirmModal;

    try {
      setConfirmModal({ isOpen: false, member: null, action: null });
      setIsProcessing(true);
      await authService.approveMember(member.id, selectedRole);

      setAlert({
        isVisible: true,
        message: 'Membro aprovado com sucesso!',
        type: 'success'
      });

      setPendingMembers(prev => prev.filter(m => m.id !== member.id));
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

  const handleApproveBatch = () => {
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

    const role = roles.find(r => r.id === selectedRole);
    setConfirmModal({
      isOpen: true,
      member: null,
      role,
      action: 'approveBatch',
      count: selectedMembers.length
    });
  };

  const confirmApproveBatch = async () => {
    try {
      setConfirmModal({ isOpen: false, member: null, action: null });
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
          <AccessDenied message={error.message} detail={error.detail} />
        </AdminLayout>
      );
    }

    // Outros erros
    return (
      <AdminLayout>
        <div className="approvals-error">
          <p>{error.message}</p>
          <button onClick={loadPendingMembers}>
            <ArrowClockwiseIcon size={20} weight="bold" />
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
        {/* Header */}
        <div className="approvals-header">
          <div className="header-title">
            <UserCheckIcon size={32} weight="duotone" />
            <div>
              <h1>Aprovações</h1>
              <p>{filteredMembers.length} de {pendingMembers.length} cadastro(s)</p>
            </div>
          </div>

          <div className="view-controls">
            <button
              className={`view-btn ${viewMode === 'cards' ? 'active' : ''}`}
              onClick={() => setViewMode('cards')}
            >
              <GridFourIcon size={20} weight="duotone" />
              Cards
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <ListBulletsIcon size={20} weight="duotone" />
              Lista
            </button>
          </div>
        </div>

        {/* Filtros e Controles */}
        {pendingMembers.length > 0 && (
          <div className="approvals-filters">
            {/* Campo de Busca */}
            <div className="search-box">
              <MagnifyingGlassIcon size={20} weight="bold" />
              <input
                type="text"
                placeholder="Buscar por nome, email, telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className="clear-search"
                  onClick={() => setSearchTerm('')}
                  title="Limpar busca"
                >
                  <XCircleIcon size={18} weight="fill" />
                </button>
              )}
            </div>

            {/* Seletor de Role e Ações em Lote */}
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
                  <CheckCircleIcon size={20} weight="fill" />
                  Aprovar {selectedMembers.length} Selecionado(s)
                </button>
              )}
            </div>
          </div>
        )}

        {/* Lista de Membros Pendentes */}
        {filteredMembers.length === 0 && searchTerm ? (
          <div className="no-approvals">
            <MagnifyingGlassIcon size={64} weight="duotone" />
            <p>Nenhum resultado encontrado para &quot;{searchTerm}&quot;</p>
            <button onClick={() => setSearchTerm('')} className="clear-search-btn">
              Limpar busca
            </button>
          </div>
        ) : pendingMembers.length === 0 ? (
          <div className="no-approvals">
            <UserCheckIcon size={64} weight="duotone" />
            <p>Nenhum cadastro pendente de aprovação</p>
          </div>
        ) : viewMode === 'cards' ? (
          <div className="approvals-list cards-view">
            {filteredMembers.map((member) => (
              <div key={member.id} className={`approval-card ${!hasCompleteData(member) ? 'incomplete-data' : ''}`}>
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
                      fallbackIcon={UserCircleIcon}
                      hasPhotoUrl={!!member.photoUrl}
                    />
                  </div>
                  <div className="member-basic-info">
                    <div className="member-name-row">
                      <h3>{member.fullName}</h3>
                      <span className="member-number">Nº {member.memberNumber}</span>
                    </div>
                    <span className="member-date">
                      Cadastrado em {formatDate(member.createdAt)}
                    </span>
                    {!hasCompleteData(member) && (
                      <span className="incomplete-badge">
                        <WarningIcon size={16} weight="fill" />
                        Dados incompletos
                      </span>
                    )}
                  </div>
                </div>

                <div className="approval-card-body">
                  <div className="info-section">
                    <h4>Informações de Contato</h4>
                    <div className="info-grid">
                      <div className={`info-item ${getMissingFields(member).includes('email') ? 'missing-field' : ''}`}>
                        <EnvelopeSimpleIcon size={18} weight="duotone" />
                        <div className="info-content">
                          <span>{member.email || 'Email não informado'}</span>
                          {getMissingFields(member).includes('email') && (
                            <span className="field-warning">
                              <WarningIcon size={14} weight="fill" />
                              Este campo é obrigatório para aprovação
                            </span>
                          )}
                        </div>
                      </div>
                      <div className={`info-item ${getMissingFields(member).includes('phone') ? 'missing-field' : ''}`}>
                        <PhoneIcon size={18} weight="duotone" />
                        <div className="info-content">
                          <span>{member.phone || 'Telefone não informado'}</span>
                          {getMissingFields(member).includes('phone') && (
                            <span className="field-warning">
                              <WarningIcon size={14} weight="fill" />
                              Este campo é obrigatório para aprovação
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="info-section">
                    <h4>Dados Pessoais</h4>
                    <div className="info-grid">
                      {member.cpf && (
                        <div className="info-item">
                          <IdentificationCardIcon size={18} weight="duotone" />
                          <span>CPF: {member.cpf}</span>
                        </div>
                      )}
                      {member.birthDate && (
                        <div className="info-item">
                          <CalendarBlankIcon size={18} weight="duotone" />
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
                          <CheckCircleIcon size={16} weight="fill" />
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
                            <MapPinIcon size={18} weight="duotone" />
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
                    <XCircleIcon size={20} weight="fill" />
                    Rejeitar
                  </button>
                  <button
                    className="approve-btn"
                    onClick={() => handleApproveSingle(member.id)}
                    disabled={!hasCompleteData(member)}
                    title={!hasCompleteData(member) ? 'Complete email e telefone para aprovar' : 'Aprovar membro'}
                  >
                    <CheckCircleIcon size={20} weight="fill" />
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
                  <th>Nº Membro</th>
                  <th>Email</th>
                  <th>Telefone</th>
                  <th>Batizado</th>
                  <th>Cadastro</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr key={member.id} className={!hasCompleteData(member) ? 'incomplete-data' : ''}>
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
                          fallbackIcon={UserCircleIcon}
                          hasPhotoUrl={!!member.photoUrl}
                        />
                      </div>
                    </td>
                    <td>
                      <div className="table-name-cell">
                        <strong>{member.fullName}</strong>
                        {!hasCompleteData(member) && (
                          <span className="incomplete-badge-small">
                            <WarningIcon size={14} weight="fill" />
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="table-member-number">{member.memberNumber}</span>
                    </td>
                    <td className={getMissingFields(member).includes('email') ? 'missing-field' : ''}>
                      {member.email || (
                        <span className="missing-value">
                          <WarningIcon size={14} weight="fill" />
                          Obrigatório
                        </span>
                      )}
                    </td>
                    <td className={getMissingFields(member).includes('phone') ? 'missing-field' : ''}>
                      {member.phone || (
                        <span className="missing-value">
                          <WarningIcon size={14} weight="fill" />
                          Obrigatório
                        </span>
                      )}
                    </td>
                    <td className="baptized-cell">
                      {member.baptized ? (
                        <CheckCircleIcon size={18} weight="fill" className="baptized-icon" />
                      ) : (
                        <XCircleIcon size={18} weight="fill" className="not-baptized-icon" />
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
                          <XCircleIcon size={18} weight="fill" />
                        </button>
                        <button
                          className="table-approve-btn"
                          onClick={() => handleApproveSingle(member.id)}
                          disabled={!hasCompleteData(member)}
                          title={!hasCompleteData(member) ? 'Complete email e telefone para aprovar' : 'Aprovar'}
                        >
                          <CheckCircleIcon size={18} weight="fill" />
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

      {/* Modal de Confirmação */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.action === 'approveBatch' ? 'Confirmar Aprovação em Lote' : 'Confirmar Aprovação'}
        message={
          confirmModal.action === 'approveBatch' ? (
            <div>
              <p>Você está prestes a aprovar <strong>{confirmModal.count} membro(s)</strong> com a role:</p>
              <p className="highlight">{confirmModal.role?.name} - {confirmModal.role?.description}</p>
              <p>Deseja continuar?</p>
            </div>
          ) : (
            <div>
              <p>Você está atribuindo a role <span className="highlight">{confirmModal.role?.name}</span> para:</p>
              <p><strong>{confirmModal.member?.fullName}</strong></p>
              <p>Deseja confirmar esta ação?</p>
            </div>
          )
        }
        confirmText="Confirmar"
        cancelText="Cancelar"
        confirmType="primary"
        onConfirm={confirmModal.action === 'approveBatch' ? confirmApproveBatch : confirmApproveSingle}
        onCancel={() => setConfirmModal({ isOpen: false, member: null, action: null })}
      />
    </AdminLayout>
  );
}

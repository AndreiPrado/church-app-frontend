import "./profile.component.scss";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import authService from "../../services/authService";
import AdminLayout from "../admin-layout/admin-layout.component";
import LoadingSpinner from "../loading-spinner/loading-spinner.component";
import FloatingAlert from "../floating-alert/floating-alert.component";
import {
  UserCircleIcon,
  PhoneIcon,
  EnvelopeSimpleIcon,
  MapPinIcon,
  CalendarBlankIcon,
  IdentificationCardIcon,
  PencilSimpleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowRightIcon
} from "@phosphor-icons/react";

export default function Profile() {
  const { user, getToken, updateUser } = useAuth();
  const navigate = useNavigate();
  const [memberData, setMemberData] = useState(null);
  const [memberRole, setMemberRole] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [alert, setAlert] = useState({ isVisible: false, message: '', type: '' });
  const [editData, setEditData] = useState({});

  const loadMemberData = useCallback(async () => {
    try {
      setLoading(true);
      const token = getToken();
      const data = await authService.getMemberById(user.id, token);
      setMemberData(data);
      setEditData(data);

      // Carregar foto do membro (sempre tenta se tiver ID)
      try {
        const blob = await authService.getMemberPhoto(user.id);
        if (blob) {
          const blobUrl = URL.createObjectURL(blob);
          setPhotoUrl(blobUrl);
        }
      } catch (photoErr) {
        console.warn('Não foi possível carregar foto:', photoErr);
        setPhotoUrl(null);
      }

      // Buscar dados da role se houver roleId
      if (data.roleId) {
        try {
          const roles = await authService.getRoles(token);
          const role = roles.find(r => r.id === data.roleId);
          if (role) {
            setMemberRole(role);
          }
        } catch (roleErr) {
          console.warn('Não foi possível carregar role:', roleErr);
        }
      }
    } catch (err) {
      setAlert({
        isVisible: true,
        message: err.message || "Erro ao carregar dados",
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  }, [user.id, getToken]);

  useEffect(() => {
    loadMemberData();
  }, [loadMemberData]);

  // Cleanup: revogar blob URL quando componente desmontar
  useEffect(() => {
    return () => {
      if (photoUrl) {
        URL.revokeObjectURL(photoUrl);
      }
    };
  }, [photoUrl]); // photoUrl só causa cleanup, não reload

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const token = getToken();

      console.log('💾 Profile - Enviando dados para salvar:', editData);
      console.log('🔍 Profile - Profissão sendo enviada:', editData.profession);

      const updatedData = await authService.updateMember(user.id, editData, token);

      console.log('✅ Profile - Dados atualizados recebidos:', updatedData);
      console.log('🔍 Profile - Profissão recebida:', updatedData.profession);
      console.log('📊 Profile - Comparação:', {
        enviada: editData.profession,
        recebida: updatedData.profession,
        igual: editData.profession === updatedData.profession
      });

      setMemberData(updatedData);
      updateUser(updatedData);
      setIsEditing(false);

      setAlert({
        isVisible: true,
        message: 'Dados atualizados com sucesso!',
        type: 'success'
      });
    } catch (err) {
      console.error('❌ Profile - Erro ao salvar:', err);
      setAlert({
        isVisible: true,
        message: err.message || 'Erro ao atualizar dados',
        type: 'error'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData(memberData);
    setIsEditing(false);
  };

  // Formatar data para padrão brasileiro (dd/mm/aaaa)
  const formatDateBR = (dateString) => {
    if (!dateString) return '-';
    try {
      // Se a data está no formato ISO (YYYY-MM-DD), extrair os componentes diretamente
      // para evitar problemas com fuso horário
      if (typeof dateString === 'string' && dateString.match(/^\d{4}-\d{2}-\d{2}/)) {
        const [year, month, day] = dateString.split('T')[0].split('-');
        return `${day}/${month}/${year}`;
      }

      // Fallback para outros formatos
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <LoadingSpinner message="Carregando perfil..." />
      </AdminLayout>
    );
  }

  if (!memberData) {
    return (
      <AdminLayout>
        <div className="profile-error">
          <p>Erro ao carregar dados do perfil</p>
          <button onClick={loadMemberData}>Tentar novamente</button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {isSaving && <LoadingSpinner message="Salvando..." />}

      <div className="profile">
        <div className="profile-header">
          <div className="header-title">
            <UserCircleIcon size={32} weight="duotone" />
            <div>
              <h1>Minha Conta</h1>
              <p>Gerencie suas informações pessoais</p>
            </div>
          </div>

          {!isEditing ? (
            <button className="edit-btn" onClick={() => setIsEditing(true)}>
              <PencilSimpleIcon size={20} weight="bold" />
              Editar
            </button>
          ) : (
            <div className="edit-actions">
              <button className="cancel-btn" onClick={handleCancel}>
                <XCircleIcon size={20} weight="fill" />
                Cancelar
              </button>
              <button className="save-btn" onClick={handleSave}>
                <CheckCircleIcon size={20} weight="fill" />
                Salvar
              </button>
            </div>
          )}
        </div>

        <div className="profile-content">
          {/* Foto e Status */}
          <div className="profile-card">
            <div className="profile-avatar-section">
              <div className="profile-avatar">
                {photoUrl ? (
                  <img src={photoUrl} alt={memberData.fullName} />
                ) : (
                  <UserCircleIcon size={120} weight="duotone" />
                )}
              </div>
              <div className="profile-info">
                <h2>{memberData.fullName}</h2>
                <span className={`profile-status ${memberData.status}`}>
                  {memberData.status === 'ativo' && <CheckCircleIcon size={18} weight="fill" />}
                  {memberData.status === 'ativo' ? 'Membro Ativo' :
                    memberData.status === 'pendente' ? 'Cadastro Pendente' : 'Cadastro Rejeitado'}
                </span>
                {memberRole && (
                  <span className="member-role">
                    <strong>{memberRole.name}</strong> {memberRole.description && `• ${memberRole.description}`}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Informações de Contato */}
          <div className="profile-card">
            <h3 className="section-title">
              <EnvelopeSimpleIcon size={24} weight="duotone" />
              Informações de Contato
            </h3>
            <div className="info-grid">
              <div className="info-field">
                <label>E-mail</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={editData.email || ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="info-value">
                    <EnvelopeSimpleIcon size={18} weight="duotone" />
                    <span>{memberData.email}</span>
                  </div>
                )}
              </div>

              <div className="info-field">
                <label>Telefone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={editData.phone || ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="info-value">
                    <PhoneIcon size={18} weight="duotone" />
                    <span>{memberData.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Dados Pessoais */}
          <div className="profile-card">
            <h3 className="section-title">
              <IdentificationCardIcon size={24} weight="duotone" />
              Dados Pessoais
            </h3>
            <div className="info-grid">
              <div className="info-field">
                <label>CPF</label>
                <div className="info-value">
                  <IdentificationCardIcon size={18} weight="duotone" />
                  <span>{memberData.cpf}</span>
                </div>
              </div>

              <div className="info-field">
                <label>Data de Nascimento</label>
                <div className="info-value">
                  <CalendarBlankIcon size={18} weight="duotone" />
                  <span>{formatDateBR(memberData.birthDate)}</span>
                </div>
              </div>

              <div className="info-field">
                <label>Gênero</label>
                <div className="info-value">
                  <span>{memberData.gender}</span>
                </div>
              </div>

              <div className="info-field">
                <label>Estado Civil</label>
                {isEditing ? (
                  <select
                    name="maritalStatus"
                    value={editData.maritalStatus || ''}
                    onChange={handleInputChange}
                  >
                    <option value="Solteiro(a)">Solteiro(a)</option>
                    <option value="Casado(a)">Casado(a)</option>
                    <option value="Divorciado(a)">Divorciado(a)</option>
                    <option value="Viúvo(a)">Viúvo(a)</option>
                  </select>
                ) : (
                  <div className="info-value">
                    <span>{memberData.maritalStatus}</span>
                  </div>
                )}
              </div>

              {memberData.profession && (
                <div className="info-field">
                  <label>Profissão</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="profession"
                      value={editData.profession || ''}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <div className="info-value">
                      <span>{memberData.profession}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="info-field">
                <label>Batizado</label>
                <div className="info-value">
                  {memberData.baptized ? (
                    <>
                      <CheckCircleIcon size={18} weight="fill" className="baptized-icon" />
                      <span>Sim{memberData.baptismDate && ` - ${formatDateBR(memberData.baptismDate)}`}</span>
                    </>
                  ) : (
                    <span>Não</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="profile-card">
            <h3 className="section-title">
              <MapPinIcon size={24} weight="duotone" />
              Endereço
            </h3>
            <div className="info-grid">
              <div className="info-field full-width">
                <label>Endereço Completo</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    value={editData.address || ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="info-value">
                    <MapPinIcon size={18} weight="duotone" />
                    <span>{memberData.address}</span>
                  </div>
                )}
              </div>

              {memberData.addressComplement && (
                <div className="info-field full-width">
                  <label>Complemento</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="addressComplement"
                      value={editData.addressComplement || ''}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <div className="info-value">
                      <span>{memberData.addressComplement}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="info-field">
                <label>Cidade</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="city"
                    value={editData.city || ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="info-value">
                    <span>{memberData.city}</span>
                  </div>
                )}
              </div>

              <div className="info-field">
                <label>Estado</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="state"
                    value={editData.state || ''}
                    onChange={handleInputChange}
                    maxLength="2"
                  />
                ) : (
                  <div className="info-value">
                    <span>{memberData.state}</span>
                  </div>
                )}
              </div>

              <div className="info-field">
                <label>CEP</label>
                <div className="info-value">
                  <span>{memberData.zipCode}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Seção da Carteirinha Digital */}
          <div className="profile-card">
            <div className="card-header-section">
              <h3 className="section-title">
                <IdentificationCardIcon size={24} weight="duotone" />
                Carteirinha Digital
              </h3>
            </div>

            <div className="card-access-section">
              <p className="card-description">
                Acesse sua carteirinha digital de membro da igreja.
                Você pode visualizá-la, fazer download em PDF ou compartilhá-la.
              </p>
              <button
                className="access-card-btn"
                onClick={() => navigate('/admin/carteirinha')}
              >
                <IdentificationCardIcon size={24} weight="duotone" />
                <span>Acessar Minha Carteirinha</span>
                <ArrowRightIcon size={20} weight="bold" />
              </button>
            </div>
          </div>
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

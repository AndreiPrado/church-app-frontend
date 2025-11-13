import "./member-edit-drawer.component.scss";
import { useState, useEffect } from "react";
import { X, User, Phone, EnvelopeSimple, MapPin, Calendar, IdentificationCard, Camera, CheckCircle, XCircle } from "@phosphor-icons/react";
import authService from "../../services/authService";
import PropTypes from "prop-types";

export default function MemberEditDrawer({ member, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    cpf: "",
    birthDate: "",
    gender: "",
    maritalStatus: "",
    profession: "",
    address: "",
    addressComplement: "",
    city: "",
    state: "",
    zipCode: "",
    joinDate: "",
    status: "",
    baptized: false,
    baptismDate: ""
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Bloquear scroll da página quando drawer estiver aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup ao desmontar
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (member && isOpen) {
      // Carregar detalhes completos do membro
      const loadMemberDetails = async () => {
        try {
          setLoading(true);
          const memberDetails = await authService.getMemberById(member.id);
          console.log('Member details loaded:', memberDetails); // Debug
          
          setFormData({
            fullName: memberDetails.fullName || "",
            email: memberDetails.email || "",
            phone: memberDetails.phone || "",
            cpf: memberDetails.cpf || "",
            birthDate: memberDetails.birthDate ? memberDetails.birthDate.split('T')[0] : "",
            gender: memberDetails.gender || "",
            maritalStatus: memberDetails.maritalStatus || "",
            profession: memberDetails.profession || "",
            address: memberDetails.address || "",
            addressComplement: memberDetails.addressComplement || "",
            city: memberDetails.city || "",
            state: memberDetails.state || "",
            zipCode: memberDetails.zipCode || "",
            joinDate: memberDetails.joinDate ? memberDetails.joinDate.split('T')[0] : "",
            status: memberDetails.status || "",
            baptized: memberDetails.baptized || false,
            baptismDate: memberDetails.baptismDate ? memberDetails.baptismDate.split('T')[0] : ""
          });
          
          // Carregar foto existente
          if (memberDetails.photoUrl) {
            try {
              const photoUrl = await authService.getMemberPhoto(memberDetails.id);
              if (photoUrl) {
                setPhotoPreview(photoUrl);
              } else {
                setPhotoPreview(null);
              }
            } catch (err) {
              console.error('Erro ao carregar foto:', err);
              setPhotoPreview(null);
            }
          } else {
            setPhotoPreview(null);
          }
        } catch (err) {
          console.error('Erro ao carregar detalhes do membro:', err);
          setError('Erro ao carregar dados do membro');
        } finally {
          setLoading(false);
        }
      };
      
      // Limpar mensagens
      setError(null);
      setSuccessMessage(null);
      setPhotoFile(null);
      
      loadMemberDetails();
    }
  }, [member, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validação dos campos obrigatórios
    if (!formData.fullName || !formData.fullName.trim()) {
      setError('Nome completo é obrigatório');
      return;
    }
    
    if (!formData.email || !formData.email.trim()) {
      setError('Email é obrigatório');
      return;
    }
    
    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Email inválido');
      return;
    }
    
    if (!formData.phone || !formData.phone.trim()) {
      setError('Telefone é obrigatório');
      return;
    }
    
    // Validação: pendente não pode mudar para ativo
    if (member.status === 'pendente' && formData.status === 'ativo') {
      setError('Membros pendentes não podem ser ativados manualmente. Eles devem completar o primeiro acesso.');
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Preparar dados para envio
      const dataToSend = {
        ...formData,
        // Garantir formato correto de datas (YYYY-MM-DD)
        birthDate: formData.birthDate || null,
        joinDate: formData.joinDate || null,
      };
      
      // Remover baptismDate se não estiver preenchido ou se não estiver batizado
      if (!formData.baptized || !formData.baptismDate) {
        delete dataToSend.baptismDate;
      }
      
      // Remover joinDate do envio (não é editável)
      delete dataToSend.joinDate;

      // Atualizar dados do membro
      const updatedMember = await authService.updateMember(member.id, dataToSend);

      // Se houver nova foto, fazer upload
      if (photoFile) {
        const formDataPhoto = new FormData();
        formDataPhoto.append('photo', photoFile);
        await authService.uploadMemberPhoto(member.id, formDataPhoto);
      }

      setSuccessMessage('Membro atualizado com sucesso!');
      
      // Aguardar um pouco para mostrar a mensagem
      setTimeout(() => {
        onSave(updatedMember);
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Erro ao atualizar membro");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={`drawer-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <div className={`member-edit-drawer ${isOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <h2>Editar Membro</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} weight="bold" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="drawer-content" noValidate>
          {/* Seção de Foto */}
          <div className="photo-section">
            <div className="photo-preview">
              {photoPreview ? (
                <img src={photoPreview} alt={formData.fullName} />
              ) : (
                <User size={40} weight="duotone" />
              )}
            </div>
            <label className="photo-upload-btn">
              <Camera size={16} weight="duotone" />
              Alterar Foto
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          {/* Informações Pessoais */}
          <div className="form-section">
            <h3>Informações Pessoais</h3>
            
            <div className="form-group">
              <label>
                <User size={18} weight="duotone" />
                Nome Completo *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  <IdentificationCard size={18} weight="duotone" />
                  CPF
                </label>
                <input
                  type="text"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  placeholder="000.000.000-00"
                />
              </div>

              <div className="form-group">
                <label>
                  <Calendar size={18} weight="duotone" />
                  Data de Nascimento
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  <EnvelopeSimple size={18} weight="duotone" />
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  <Phone size={18} weight="duotone" />
                  Telefone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Gênero</label>
                <select name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="">Selecione</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                </select>
              </div>

              <div className="form-group">
                <label>Estado Civil</label>
                <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange}>
                  <option value="">Selecione</option>
                  <option value="Solteiro">Solteiro(a)</option>
                  <option value="Casado">Casado(a)</option>
                  <option value="Divorciado">Divorciado(a)</option>
                  <option value="Viúvo">Viúvo(a)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Profissão</label>
              <input
                type="text"
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                placeholder="Ex: Engenheiro, Professor"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  <Calendar size={18} weight="duotone" />
                  Data de Cadastro
                </label>
                <input
                  type="date"
                  name="joinDate"
                  value={formData.joinDate}
                  disabled
                  title="Data de cadastro não pode ser alterada"
                />
              </div>

              <div className="form-group">
                <label>Status</label>
                <select name="status" value={formData.status} onChange={handleChange}>
                  {member.status !== 'pendente' && <option value="ativo">Ativo</option>}
                  <option value="visitante">Visitante</option>
                  <option value="pendente">Pendente</option>
                  <option value="inativo">Inativo</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group checkbox-wrapper">
                <label>Batizado</label>
                <div className="checkbox-input">
                  <input
                    type="checkbox"
                    name="baptized"
                    checked={formData.baptized}
                    onChange={handleChange}
                  />
                  <span>Membro batizado</span>
                </div>
              </div>

              {formData.baptized && (
                <div className="form-group">
                  <label>
                    <Calendar size={18} weight="duotone" />
                    Data do Batismo
                  </label>
                  <input
                    type="date"
                    name="baptismDate"
                    value={formData.baptismDate}
                    onChange={handleChange}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Endereço */}
          <div className="form-section">
            <h3>
              <MapPin size={20} weight="duotone" />
              Endereço
            </h3>
            
            <div className="form-group">
              <label>Logradouro</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Rua, Av, etc"
              />
            </div>

            <div className="form-group">
              <label>Complemento</label>
              <input
                type="text"
                name="addressComplement"
                value={formData.addressComplement}
                onChange={handleChange}
                placeholder="Apto, Bloco, etc"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Cidade</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Estado</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="UF"
                  maxLength="2"
                />
              </div>

              <div className="form-group">
                <label>CEP</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  placeholder="00000-000"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="error-message">
              <XCircle size={20} weight="fill" />
              {error}
            </div>
          )}

          {successMessage && (
            <div className="success-message">
              <CheckCircle size={20} weight="fill" />
              {successMessage}
            </div>
          )}

          <div className="drawer-footer">
            <button type="button" onClick={onClose} className="btn-cancel" disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

MemberEditDrawer.propTypes = {
  member: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired
};

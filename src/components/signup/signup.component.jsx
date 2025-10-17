import "./signup.component.scss";
import Navbar from "../navbar/navbar.component.jsx";
import maritalStatusOptions from "../../constants/maritalStatusOptions.js";
import { IMaskInput } from "react-imask";

import React, { useState, useEffect } from "react";
import { ArrowCircleLeft, ArrowCircleRight } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import signupVideo from "../../assets/signup.mp4";
import PhotoUpload from "../photo-upload/photo-upload.component.jsx";
import FloatingAlert from "../floating-alert/floating-alert.component.jsx";
import LoadingSpinner from "../loading-spinner/loading-spinner.component.jsx";
import memberService from "../../services/memberService.js";
import cepService from "../../services/cepService.js";
import { validateCPF, validateRequired, validateEmail, validatePhone, validateCEP, validateDate } from "../../utils/validators.js";

export default function SignUp() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formError, setFormError] = useState(false);
  const [alert, setAlert] = useState({ isVisible: false, message: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    cpf: "",
    birthDate: "",
    gender: "",
    maritalStatus: "",
    profession: "",
    baptized: "",
    baptismDate: "",
    zipCode: "",
    address: "",
    number: "",
    addressComplement: "",
    city: "",
    state: "",
    phone: "",
    email: "",
    photoUrl: null,
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [fadingOutErrors, setFadingOutErrors] = useState({});
  const [loadingCep, setLoadingCep] = useState(false);
  const [lastFetchedCep, setLastFetchedCep] = useState('');
  const formRef = React.useRef(null);
  const REQUIRED_FIELDS_MESSAGE = 'Preencha todos os campos obrigatórios corretamente antes de avançar.';

  // Monitora os erros e limpa o alerta quando não houver mais erros
  useEffect(() => {
    if (Object.keys(fieldErrors).length === 0 && formError) {
      setFormError(false);
    }
  }, [fieldErrors, formError]);

  // Scroll para o topo e foca no primeiro campo quando muda de step
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Aguarda scroll completar e foca no primeiro campo do step
    const timer = setTimeout(() => {
      const firstFieldIds = ['fullName', 'zipCode', 'phone'];
      const firstFieldId = firstFieldIds[currentStep];
      
      if (firstFieldId) {
        const firstField = document.getElementById(firstFieldId);
        if (firstField) {
          firstField.focus();
        }
      }
    }, 300); // Aguarda animação de scroll (smooth)

    return () => clearTimeout(timer);
  }, [currentStep]);

  // Função para remover erro com animação
  const removeErrorWithAnimation = (fieldName) => {
    // Marca o erro como "saindo" (fading out)
    setFadingOutErrors((prev) => ({ ...prev, [fieldName]: true }));

    // Aguarda a animação completar antes de remover do estado
    setTimeout(() => {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
      setFadingOutErrors((prev) => {
        const newFading = { ...prev };
        delete newFading[fieldName];
        return newFading;
      });
    }, 300); // Duração da animação
  };

  // Função auxiliar para renderizar mensagem de erro
  const renderErrorMessage = (fieldName) => {
    if (!fieldErrors[fieldName]) return null;
    return (
      <span className={`error-message ${fadingOutErrors[fieldName] ? 'fade-out' : ''}`}>
        {fieldErrors[fieldName]}
      </span>
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpa erro do campo ao digitar com animação
    if (fieldErrors[name]) {
      removeErrorWithAnimation(name);
    }
  };

  // Validação de campo individual
  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'fullName':
        if (!validateRequired(value)) error = 'Por favor, informe seu nome completo.';
        break;

      case 'cpf':
        if (!validateRequired(value)) {
          error = 'Precisamos do seu CPF para continuar.';
        } else if (!validateCPF(value)) {
          error = 'Esse CPF não parece válido. Pode verificar novamente?';
        }
        break;

      case 'birthDate':
        if (!validateRequired(value)) {
          error = 'Informe sua data de nascimento, por favor.';
        } else if (!validateDate(value)) {
          error = 'Ops! Essa data não parece válida.';
        }
        break;

      case 'email':
        if (!validateRequired(value)) {
          error = 'Digite seu e-mail para podermos entrar em contato.';
        } else if (!validateEmail(value)) {
          error = 'Esse e-mail não parece correto. Pode revisar?';
        }
        break;

      case 'phone':
        if (!validateRequired(value)) {
          error = 'Informe um telefone para contato.';
        } else if (!validatePhone(value)) {
          error = 'Esse número não parece válido. Pode conferir?';
        }
        break;

      case 'zipCode':
        if (!validateRequired(value)) {
          error = 'Informe o CEP para localizarmos seu endereço.';
        } else if (!validateCEP(value)) {
          error = 'Esse CEP não parece válido. Pode verificar?';
        }
        break;

      case 'gender':
        if (!validateRequired(value)) error = 'Selecione seu gênero, por favor.';
        break;

      case 'maritalStatus':
        if (!validateRequired(value)) error = 'Informe seu estado civil, por favor.';
        break;

      case 'baptized':
        if (!validateRequired(value)) error = 'Por favor, informe se você já foi batizado(a).';
        break;

      case 'address':
        if (!validateRequired(value)) error = 'Informe o endereço onde você mora.';
        break;

      case 'number':
        if (!validateRequired(value)) error = 'Informe o número do endereço.';
        break;

      case 'city':
        if (!validateRequired(value)) error = 'Informe a cidade em que você mora.';
        break;

      case 'state':
        if (!validateRequired(value)) error = 'Selecione o estado onde você mora.';
        break;
    }

    return error;
  };

  // Validação ao sair do campo
  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);

    if (error) {
      setFieldErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  // Busca CEP automaticamente
  const handleCepChange = async (value) => {
    setFormData((prev) => ({ ...prev, zipCode: value }));

    // Limpa erro do CEP ao digitar com animação
    if (fieldErrors.zipCode) {
      removeErrorWithAnimation('zipCode');
    }

    // Busca CEP quando completo (8 dígitos)
    const cleanCep = value.replace(/\D/g, '');
    if (cleanCep.length === 8 && cleanCep !== lastFetchedCep) {
      setLoadingCep(true);
      setLastFetchedCep(cleanCep);
      try {
        const data = await cepService.getCep(cleanCep);

        // Preenche campos de endereço
        setFormData((prev) => ({
          ...prev,
          address: data.logradouro || '',
          addressComplement: data.complemento || prev.addressComplement,
          city: data.localidade || '',
          state: data.uf || '',
        }));

        // Limpa possíveis erros dos campos preenchidos com animação
        if (fieldErrors.address) removeErrorWithAnimation('address');
        if (fieldErrors.city) removeErrorWithAnimation('city');
        if (fieldErrors.state) removeErrorWithAnimation('state');

        // Foca no campo de número para o usuário digitar
        setTimeout(() => {
          const numberInput = document.getElementById('number');
          if (numberInput) {
            numberInput.focus();
          }
        }, 100);
      } catch (error) {
        setFieldErrors((prev) => ({ ...prev, zipCode: error.message }));
      } finally {
        setLoadingCep(false);
      }
    }
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  // Função para converter data de DD/MM/YYYY para YYYY-MM-DD
  const convertDateToISO = (dateString) => {
    if (!dateString || dateString.length !== 10) return dateString;
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Valida todos os campos obrigatórios antes de enviar
    let isValid = true;
    const newErrors = {};
    const requiredFields = ['fullName', 'cpf', 'birthDate', 'gender', 'maritalStatus', 'baptized', 'zipCode', 'address', 'number', 'city', 'state', 'phone', 'email'];

    requiredFields.forEach((fieldName) => {
      const value = formData[fieldName];
      const error = validateField(fieldName, value);

      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    if (!isValid) {
      setFieldErrors(newErrors);
      setFormError(true);
      return;
    }

    try {
      const payload = {};
      setFormError(false);
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== "") {
          if (key === "cpf" || key === "phone" || key === "zipCode") {
            payload[key] = value.replace(/\D/g, "");
          } else if (key === "baptized") {
            payload[key] = value === "true";
          } else if (key === "birthDate") {
            // Converter data de nascimento para formato ISO (YYYY-MM-DD)
            payload[key] = convertDateToISO(value);
          } else if (key === "address") {
            // Junta endereço + número separado por vírgula
            payload[key] = `${value}, ${formData.number}`;
          } else if (key !== "photo" && key !== "number") {
            // Pula o campo 'number' pois já foi incluído no address
            payload[key] = value;
          }
        }
      });

      if (formData.photo instanceof File) {
        const base64Photo = await convertFileToBase64(formData.photo);
        payload.photoUrl = base64Photo;
      }

      payload.status = "pendente";

      setIsLoading(true);

      await memberService.createMember(payload);

      setIsLoading(false);

      // Redirecionar para tela de sucesso
      navigate("/signup/success");
    } catch (error) {
      setIsLoading(false);
      setAlert({
        isVisible: true,
        message: error.message,
        type: "error"
      });
    }
  };

  const steps = [
    // Etapa 1: Dados Pessoais
    <>
      <div className="form-group">
        <label htmlFor="fullName">Nome completo <span className="required">*</span></label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          placeholder="Digite seu nome"
          value={formData.fullName}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className={fieldErrors.fullName ? 'error' : ''}
          required
        />
        {renderErrorMessage('fullName')}
      </div>

      <div className="form-group">
        <label htmlFor="cpf">CPF <span className="required">*</span></label>
        <IMaskInput
          mask="000.000.000-00"
          id="cpf"
          name="cpf"
          placeholder="000.000.000-00"
          value={formData.cpf}
          onAccept={(value) => {
            setFormData((prev) => ({ ...prev, cpf: value }));
            // Limpa erro ao digitar com animação
            if (fieldErrors.cpf) {
              removeErrorWithAnimation('cpf');
            }
          }}
          onBlur={(e) => handleBlur(e)}
          className={fieldErrors.cpf ? 'error' : ''}
          required
        />
        {renderErrorMessage('cpf')}
      </div>

      <div className="form-group">
        <label htmlFor="birthDate">Data de nascimento <span className="required">*</span></label>
        <IMaskInput
          mask={"00/00/0000"}
          definitions={{
            '#': /[0-9]/
          }}
          overwrite
          id="birthDate"
          name="birthDate"
          value={formData.birthDate}
          onAccept={(value) => {
            handleInputChange({ target: { name: 'birthDate', value } });
          }}
          onBlur={(e) => handleBlur(e)}
          placeholder="00/00/0000"
          className={fieldErrors.birthDate ? 'error date-input' : 'date-input'}
          required
        />
        {renderErrorMessage('birthDate')}
      </div>

      <div className="form-group">
        <label>Gênero <span className="required">*</span></label>
        <div className="radio-group">
          <label><input type="radio" name="gender" value="Masculino"
            checked={formData.gender === "Masculino"} onChange={handleInputChange} required /> Masculino</label>
          <label><input type="radio" name="gender" value="Feminino"
            checked={formData.gender === "Feminino"} onChange={handleInputChange} required /> Feminino</label>
        </div>
        {renderErrorMessage('gender')}
      </div>

      <div className="form-group">
        <label htmlFor="maritalStatus">Estado civil <span className="required">*</span></label>
        <select
          id="maritalStatus"
          name="maritalStatus"
          value={formData.maritalStatus}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className={fieldErrors.maritalStatus ? 'error' : ''}
          required
        >
          <option value="">Selecione</option>
          {maritalStatusOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        {renderErrorMessage('maritalStatus')}
      </div>

      <div className="form-group">
        <label htmlFor="profession">Profissão</label>
        <input
          type="text"
          id="profession"
          name="profession"
          placeholder="Digite sua profissão"
          value={formData.profession}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-group">
        <label>Batizado (a)? <span className="required">*</span></label>
        <div className="radio-group">
          <label><input type="radio" name="baptized" value="true"
            checked={formData.baptized === "true"} onChange={handleInputChange} required /> Sim</label>
          <label><input type="radio" name="baptized" value="false"
            checked={formData.baptized === "false"} onChange={handleInputChange} required /> Não</label>
        </div>
        {renderErrorMessage('baptized')}
      </div>

      {formData.baptized === "true" && (
        <div className="form-group">
          <label htmlFor="baptismDate">Data de batismo</label>
          <IMaskInput
            mask={"00/00/0000"}
            definitions={{
              '#': /[0-9]/
            }}
            overwrite
            id="baptismDate"
            name="baptismDate"
            value={formData.baptismDate}
            onAccept={(value) => {
              handleInputChange({ target: { name: 'baptismDate', value } });
            }}
            placeholder="00/00/0000"
            className="date-input"
          />
        </div>
      )}
    </>,

    // Etapa 2: Endereço
    <>
      <div className="form-group">
        <label htmlFor="zipCode">CEP <span className="required">*</span></label>
        <IMaskInput
          mask="00000-000"
          id="zipCode"
          name="zipCode"
          placeholder="00000-000"
          value={formData.zipCode}
          onAccept={handleCepChange}
          onBlur={(e) => handleBlur(e)}
          className={fieldErrors.zipCode ? 'error' : ''}
          required
        />
        {loadingCep && <span className="loading-indicator">🔍 Buscando CEP...</span>}
        {renderErrorMessage('zipCode')}
      </div>

      <div className="form-group">
        <label htmlFor="address">Endereço <span className="required">*</span></label>
        <input
          type="text"
          id="address"
          name="address"
          placeholder="Rua, Avenida..."
          value={formData.address}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className={fieldErrors.address ? 'error' : ''}
          required
        />
        {renderErrorMessage('address')}
      </div>

      <div className="form-group">
        <label htmlFor="number">Número <span className="required">*</span></label>
        <input
          type="text"
          id="number"
          name="number"
          placeholder="Digite o número"
          value={formData.number}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className={fieldErrors.number ? 'error' : ''}
          required
        />
        {renderErrorMessage('number')}
      </div>

      <div className="form-group">
        <label htmlFor="addressComplement">Complemento</label>
        <input
          type="text"
          id="addressComplement"
          name="addressComplement"
          placeholder="Apto, bloco, etc. (opcional)"
          value={formData.addressComplement}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="city">Cidade <span className="required">*</span></label>
        <input
          type="text"
          id="city"
          name="city"
          placeholder="Digite sua cidade"
          value={formData.city}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className={fieldErrors.city ? 'error' : ''}
          required
        />
        {renderErrorMessage('city')}
      </div>

      <div className="form-group">
        <label htmlFor="state">Estado <span className="required">*</span></label>
        <input
          type="text"
          id="state"
          name="state"
          placeholder="Digite seu estado"
          value={formData.state}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className={fieldErrors.state ? 'error' : ''}
          required
        />
        {renderErrorMessage('state')}
      </div>
    </>,

    // Etapa 3: Contato
    <>
      <div className="form-group">
        <label htmlFor="phone">Celular <span className="required">*</span></label>
        <IMaskInput
          mask="(00) 00000-0000"
          id="phone"
          name="phone"
          placeholder="(00) 00000-0000"
          value={formData.phone}
          onAccept={(value) => {
            setFormData((prev) => ({ ...prev, phone: value }));
            // Limpa erro ao digitar com animação
            if (fieldErrors.phone) {
              removeErrorWithAnimation('phone');
            }
          }}
          onBlur={(e) => handleBlur(e)}
          className={fieldErrors.phone ? 'error' : ''}
          required
        />
        {renderErrorMessage('phone')}
      </div>

      <div className="form-group">
        <label htmlFor="email">E-mail <span className="required">*</span></label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="exemplo@email.com"
          value={formData.email}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className={fieldErrors.email ? 'error' : ''}
          required
        />
        {renderErrorMessage('email')}
      </div>

      <PhotoUpload onPhotoChange={(file) => setFormData((prev) => ({ ...prev, photo: file }))} />
    </>,
  ];

  return (
    <div className="signup">
      {isLoading && <LoadingSpinner message="Cadastrando membro..." />}
      
      <Navbar />
      <video className="background-video" autoPlay muted loop playsInline disablePictureInPicture controls={false}>
        <source src={signupVideo} type="video/mp4" />
      </video>

      <div className="signup-form">
        <div className="progress-bar-container">
          <div className="progress-bar-bg">
            <div className="progress-bar-fg" style={{ width: ((currentStep + 1) / steps.length) * 100 + "%" }} />
          </div>
          <div className="progress-labels">
            <span className={currentStep === 0 ? "active" : ""}>Dados Pessoais</span>
            <span className={currentStep === 1 ? "active" : ""}>Endereço</span>
            <span className={currentStep === 2 ? "active" : ""}>Contato</span>
          </div>
        </div>

        <h2>Cadastro de Membro</h2>

        <form ref={formRef} onSubmit={handleSubmit} noValidate>
          {steps[currentStep]}
          {formError && (
            <div className="form-error">{REQUIRED_FIELDS_MESSAGE}</div>
          )}

          <div className="button-container">
            <div style={{ flex: 1, display: "flex", justifyContent: "flex-start" }}>
              {currentStep > 0 && (
                <button type="button" onClick={() => { 
                  setFormError(false); 
                  setCurrentStep(currentStep - 1);
                }}
                  aria-label="Voltar" className="arrow-nav-btn">
                  <ArrowCircleLeft size={36} weight="fill" color="#2d4263" />
                </button>
              )}
            </div>

            <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
              {currentStep < steps.length - 1 ? (
                <button type="button" onClick={() => {
                  // Validar todos os campos da etapa atual
                  let isValid = true;
                  const newErrors = {};

                  // Lista de campos obrigatórios por etapa
                  const requiredFieldsByStep = [
                    ['fullName', 'cpf', 'birthDate', 'gender', 'maritalStatus', 'baptized'], // Etapa 1
                    ['zipCode', 'address', 'number', 'city', 'state'], // Etapa 2
                    ['phone', 'email'], // Etapa 3
                  ];

                  const currentFields = requiredFieldsByStep[currentStep];

                  // Valida cada campo obrigatório da etapa atual
                  currentFields.forEach((fieldName) => {
                    const value = formData[fieldName];
                    const error = validateField(fieldName, value);

                    if (error) {
                      newErrors[fieldName] = error;
                      isValid = false;
                    }
                  });

                  if (!isValid) {
                    setFieldErrors(newErrors);
                    setFormError(true);
                  } else {
                    setFieldErrors({});
                    setFormError(false);
                    setCurrentStep(currentStep + 1);
                  }
                }} aria-label="Próximo" className="arrow-nav-btn">
                  <ArrowCircleRight size={36} weight="fill" color="#2d4263" />
                </button>
              ) : (
                <button type="button" onClick={handleSubmit}>Cadastrar</button>
              )}
            </div>
          </div>
        </form>
      </div>

      <FloatingAlert
        message={alert.message}
        type={alert.type}
        isVisible={alert.isVisible}
        onClose={() => setAlert({ isVisible: false, message: '', type: '' })}
        duration={5000}
      />
    </div>
  );
}
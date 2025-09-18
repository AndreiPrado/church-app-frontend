import "./signup.component.scss";
import Navbar from "../navbar/navbar.component.jsx";
import maritalStatusOptions from "../../constants/maritalStatusOptions.js";
import { IMaskInput } from "react-imask";

import React, { useState } from "react";
import { ArrowCircleLeft, ArrowCircleRight } from "phosphor-react";
import { useNavigate } from "react-router-dom";
import signupVideo from "../../assets/signup.mp4";

export default function signUp() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formError, setFormError] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    cpf: '',
    rg: '',
    birthDate: '',
    gender: '',
    maritalStatus: '',
    phone: '',
    profession: '',
    baptized: '',
    baptismDate: '',
    zipCode: '',
    address: '',
    city: '',
    state: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const formRef = React.useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação específica para a última etapa
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setFormError(true);
      alert('Preencha todos os campos obrigatórios: e-mail, senha e confirmação de senha.');
      return;
    }

    // Verificar se as senhas coincidem
    if (formData.password !== formData.confirmPassword) {
      setFormError(true);
      alert('As senhas não coincidem. Verifique e tente novamente.');
      return;
    }

    try {
      const payload = {
        ...formData,
        baptized: formData.baptized === 'true',
        birthDate: formData.birthDate,
        baptismDate: formData.baptismDate || null,
        cpf: formData.cpf.replace(/\D/g, ''),
        rg: formData.rg.replace(/\D/g, ''),
        phone: formData.phone.replace(/\D/g, ''),
        zipCode: formData.zipCode.replace(/\D/g, ''),
        status: 'ativo'
      };
      delete payload.confirmPassword;

      console.log(payload);
      const response = await fetch('https://church-app-backend-production.up.railway.app/api/members/', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert('Cadastro realizado com sucesso!');
        // Reset form
        setFormData({
          fullName: '', cpf: '', rg: '', birthDate: '', gender: '', maritalStatus: '',
          phone: '', profession: '', baptized: '', baptismDate: '', zipCode: '',
          address: '', city: '', state: '', email: '', password: '', confirmPassword: ''
        });
        navigate('/home');
      } else {
        const errorData = await response.json();
        alert('Erro no cadastro: ' + (errorData.error || 'Tente novamente'));
      }
    } catch (error) {
      alert('Erro no cadastro: ' + error.message);
    }
  };

  // Campos divididos em sessões
  const steps = [
    // Sessão 1: Dados Pessoais e Contato
    <>
      <div className="form-group">
        <label htmlFor="fullName">Nome completo<span className="required">*</span></label>
        <input type="text" id="fullName" name="fullName" placeholder="Digite seu nome" value={formData.fullName} onChange={handleInputChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="cpf">CPF<span className="required">*</span></label>
        <IMaskInput
          mask="000.000.000-00"
          type="text"
          id="cpf"
          name="cpf"
          placeholder="000.000.000-00"
          value={formData.cpf}
          onAccept={(value) => setFormData(prev => ({ ...prev, cpf: value }))}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="rg">RG<span className="required">*</span></label>
        <IMaskInput
          mask="00.000.000-0"
          type="text"
          id="rg"
          name="rg"
          placeholder="00.000.000-0"
          value={formData.rg}
          onAccept={(value) => setFormData(prev => ({ ...prev, rg: value }))}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="birthDate">Data de nascimento<span className="required">*</span></label>
        <input
          type="date"
          id="birthDate"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Gênero<span className="required">*</span></label>
        <div className="radio-group">
          <label><input type="radio" name="gender" value="Masculino" checked={formData.gender === 'Masculino'} onChange={handleInputChange} required /> Masculino</label>
          <label><input type="radio" name="gender" value="Feminino" checked={formData.gender === 'Feminino'} onChange={handleInputChange} required /> Feminino</label>
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="maritalStatus">Estado civil<span className="required">*</span></label>
        <select id="maritalStatus" name="maritalStatus" value={formData.maritalStatus} onChange={handleInputChange} required>
          <option value="">Selecione</option>
          {maritalStatusOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="phone">Celular<span className="required">*</span></label>
        <IMaskInput
          mask="(00) 00000-0000"
          type="text"
          id="phone"
          name="phone"
          placeholder="(00) 00000-0000"
          value={formData.phone}
          onAccept={(value) => setFormData(prev => ({ ...prev, phone: value }))}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="profession">Profissão</label>
        <input type="text" id="profession" name="profession" placeholder="Digite sua profissão" value={formData.profession} onChange={handleInputChange} />
      </div>
    </>,
    // Sessão 2: Dados de Igreja/Endereço
    <>
      <div className="form-group radio-group">
        <label>Batizado?<span className="required">*</span></label>
        <label><input type="radio" name="baptized" value="true" checked={formData.baptized === 'true'} onChange={handleInputChange} required /> Sim</label>
        <label><input type="radio" name="baptized" value="false" checked={formData.baptized === 'false'} onChange={handleInputChange} required /> Não</label>
      </div>
      <div className="form-group">
        <label htmlFor="baptismDate">Data de batismo</label>
        <input
          type="date"
          id="baptismDate"
          name="baptismDate"
          value={formData.baptismDate}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="zipCode">CEP<span className="required">*</span></label>
        <IMaskInput
          mask="00000-000"
          type="text"
          id="zipCode"
          name="zipCode"
          placeholder="00000-000"
          value={formData.zipCode}
          onAccept={(value) => setFormData(prev => ({ ...prev, zipCode: value }))}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="address">Endereço<span className="required">*</span></label>
        <input type="text" id="address" name="address" placeholder="Digite seu endereço" value={formData.address} onChange={handleInputChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="city">Cidade<span className="required">*</span></label>
        <input type="text" id="city" name="city" placeholder="Digite sua cidade" value={formData.city} onChange={handleInputChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="state">Estado<span className="required">*</span></label>
        <input type="text" id="state" name="state" placeholder="Digite seu estado" value={formData.state} onChange={handleInputChange} required />
      </div>
    </>,
    // Sessão 4: Credenciais de Acesso
    <>
      <div className="form-group">
        <label htmlFor="email">E-mail<span className="required">*</span></label>
        <input type="email" id="email" name="email" placeholder="exemplo@email.com" value={formData.email} onChange={handleInputChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="password">Senha<span className="required">*</span></label>
        <input type="password" id="password" name="password" placeholder="Digite sua senha" value={formData.password} onChange={handleInputChange} minLength={import.meta.env.REACT_APP_MIN_PASSWORD_LENGTH} required />
      </div>
      <div className="form-group">
        <label htmlFor="confirmPassword">Confirmar Senha<span className="required">*</span></label>
        <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirme sua senha" value={formData.confirmPassword} onChange={handleInputChange} minLength={import.meta.env.REACT_APP_MIN_PASSWORD_LENGTH} required />
      </div>
    </>
  ];

  return (
    <div className="signup">
      <Navbar />
      <video
        className="background-video"
        autoPlay
        muted
        loop
        playsInline
        disablePictureInPicture
        controls={false}
      >
        <source src={signupVideo} type="video/mp4" />
      </video>
      <div className="signup-form">

        <div className="progress-bar-container">
          <div className="progress-bar-bg">
            <div className="progress-bar-fg" style={{ width: ((currentStep + 1) / steps.length) * 100 + '%' }}></div>
          </div>
          <div className="progress-labels">
            <span className={currentStep === 0 ? 'active' : ''}>Dados Pessoais</span>
            <span className={currentStep === 1 ? 'active' : ''}>Endereço</span>
            <span className={currentStep === 2 ? 'active' : ''}>Acesso</span>
          </div>
        </div>
        <h2>Cadastro de Membro</h2>
        <form ref={formRef} onSubmit={handleSubmit} noValidate>
          {steps[currentStep]}
          {formError && (
            <div className="form-error">Preencha todos os campos obrigatórios corretamente antes de avançar.</div>
          )}
          <div className='button-container'>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setFormError(false);
                    setCurrentStep(currentStep - 1);
                  }}
                  aria-label="Voltar"
                  className="arrow-nav-btn"
                >
                  <ArrowCircleLeft size={36} weight="fill" color="#2d4263" />
                </button>
              )}
            </div>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
              {currentStep < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    const form = formRef.current;
                    const currentStepInputs = form.querySelectorAll('input[required], select[required]');
                    let isValid = true;

                    currentStepInputs.forEach(input => {
                      if (!input.checkValidity()) {
                        isValid = false;
                        input.reportValidity();
                      }
                    });

                    if (isValid) {
                      setFormError(false);
                      setCurrentStep(currentStep + 1);
                    } else {
                      setFormError(true);
                    }
                  }}
                  aria-label="Próximo"
                  className="arrow-nav-btn"
                >
                  <ArrowCircleRight size={36} weight="fill" color="#2d4263" />
                </button>
              ) : (
                <button type="submit">Cadastrar</button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
import "./signup.component.scss";
import Navbar from "../navbar/navbar.component.jsx";
import maritalStatusOptions from "../../constants/maritalStatusOptions.js";
import { IMaskInput } from "react-imask";

import React, { useState } from "react";
import { ArrowCircleLeft, ArrowCircleRight } from "phosphor-react";
import { useNavigate } from "react-router-dom";
import signupVideo from "../../assets/signup.mp4";
import PhotoUpload from "../photo-upload/photo-upload.component.jsx";
import FloatingAlert from "../floating-alert/floating-alert.component.jsx";
import memberService from "../../services/memberService.js";

export default function SignUp() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formError, setFormError] = useState(false);
  const [alert, setAlert] = useState({ isVisible: false, message: '', type: '' }); 
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
    city: "",
    state: "",
    phone: "",
    email: "",
    photoURL: null,
  });
  const formRef = React.useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {};
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== "") {
          if (key === "cpf" || key === "phone" || key === "zipCode") {
            payload[key] = value.replace(/\D/g, "");
          } else if (key === "baptized") {
            payload[key] = value === "true";
          } else if (key !== "photo") {
            payload[key] = value;
          }
        }
      });

      if (formData.photo instanceof File) {
        const base64Photo = await convertFileToBase64(formData.photo);
        payload.photoURL = base64Photo;
      }

      payload.status = "ativo";

      await memberService.createMember(payload);
      
      setAlert({ 
        isVisible: true, 
        message: "Cadastro realizado com sucesso!", 
        type: "success" 
      });
      
      setTimeout(() => {
        navigate("/home");
      }, 2000);
    } catch (error) {
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
        <label htmlFor="fullName">Nome completo<span className="required"> *</span></label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          placeholder="Digite seu nome"
          value={formData.fullName}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="cpf">CPF<span className="required"> *</span></label>
        <IMaskInput
          mask="000.000.000-00"
          id="cpf"
          name="cpf"
          placeholder="000.000.000-00"
          value={formData.cpf}
          onAccept={(value) => setFormData((prev) => ({ ...prev, cpf: value }))}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="birthDate">Data de nascimento<span className="required"> *</span></label>
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
          placeholder="00/00/0000"
          className="date-input"
          required
        /> 
      </div>

      <div className="form-group">
        <label>Gênero<span className="required"> *</span></label>
        <div className="radio-group">
          <label><input type="radio" name="gender" value="Masculino"
            checked={formData.gender === "Masculino"} onChange={handleInputChange} required /> Masculino</label>
          <label><input type="radio" name="gender" value="Feminino"
            checked={formData.gender === "Feminino"} onChange={handleInputChange} required /> Feminino</label>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="maritalStatus">Estado civil<span className="required"> *</span></label>
        <select id="maritalStatus" name="maritalStatus" value={formData.maritalStatus}
          onChange={handleInputChange} required>
          <option value="">Selecione</option>
          {maritalStatusOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
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
        <label>Batizado?<span className="required"> *</span></label>
        <div className="radio-group">
          <label><input type="radio" name="baptized" value="true"
            checked={formData.baptized === "true"} onChange={handleInputChange} required /> Sim</label>
          <label><input type="radio" name="baptized" value="false"
            checked={formData.baptized === "false"} onChange={handleInputChange} required /> Não</label>
        </div>
      </div>

      {formData.baptized === "true" && (
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
      )}
    </>,

    // Etapa 2: Endereço
    <>
      <div className="form-group">
        <label htmlFor="zipCode">CEP<span className="required"> *</span></label>
        <IMaskInput
          mask="00000-000"
          id="zipCode"
          name="zipCode"
          placeholder="00000-000"
          value={formData.zipCode}
          onAccept={(value) => setFormData((prev) => ({ ...prev, zipCode: value }))}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="address">Endereço<span className="required"> *</span></label>
        <input
          type="text"
          id="address"
          name="address"
          placeholder="Digite seu endereço"
          value={formData.address}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="city">Cidade<span className="required"> *</span></label>
        <input
          type="text"
          id="city"
          name="city"
          placeholder="Digite sua cidade"
          value={formData.city}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="state">Estado<span className="required"> *</span></label>
        <input
          type="text"
          id="state"
          name="state"
          placeholder="Digite seu estado"
          value={formData.state}
          onChange={handleInputChange}
          required
        />
      </div>
    </>,

    // Etapa 3: Contato
    <>
      <div className="form-group">
        <label htmlFor="phone">Celular<span className="required"> *</span></label>
        <IMaskInput
          mask="(00) 00000-0000"
          id="phone"
          name="phone"
          placeholder="(00) 00000-0000"
          value={formData.phone}
          onAccept={(value) => setFormData((prev) => ({ ...prev, phone: value }))}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">E-mail<span className="required"> *</span></label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="exemplo@email.com"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </div>

      <PhotoUpload onPhotoChange={(file) => setFormData((prev) => ({ ...prev, photo: file }))} />
    </>,
  ];

  return (
    <div className="signup">
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
            <div className="form-error">Preencha todos os campos obrigatórios corretamente antes de avançar.</div>
          )}

          <div className="button-container">
            <div style={{ flex: 1, display: "flex", justifyContent: "flex-start" }}>
              {currentStep > 0 && (
                <button type="button" onClick={() => { setFormError(false); setCurrentStep(currentStep - 1); }}
                  aria-label="Voltar" className="arrow-nav-btn">
                  <ArrowCircleLeft size={36} weight="fill" color="#2d4263" />
                </button>
              )}
            </div>

            <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
              {currentStep < steps.length - 1 ? (
                <button type="button" onClick={() => {
                  const form = formRef.current;
                  const currentStepInputs = form.querySelectorAll("input[required], select[required]");
                  let isValid = true;
                  currentStepInputs.forEach((input) => {
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
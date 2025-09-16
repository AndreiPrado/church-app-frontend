"use client";

import { useState, useRef, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { IMaskInput } from "react-imask";
import { ArrowCircleLeft, ArrowCircleRight } from "phosphor-react";
import Navbar from "@/components/features/navbar/Navbar";
import maritalStatusOptions, { MaritalStatusOption } from "@/constants/maritalStatusOptions";
import styles from "./SingUp.module.scss";

interface FormData {
  fullName: string;
  cpf: string;
  rg: string;
  birthDate: string;
  gender: string;
  maritalStatus: string;
  phone: string;
  profession: string;
  baptized: string;
  baptismDate: string;
  zipCode: string;
  address: string;
  city: string;
  state: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SingUp() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formError, setFormError] = useState(false);
  const [formData, setFormData] = useState<FormData>({
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
  
  const formRef = useRef<HTMLFormElement>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
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
        cpf: formData.cpf.replace(/\\D/g, ''),
        rg: formData.rg.replace(/\\D/g, ''),
        phone: formData.phone.replace(/\\D/g, ''),
        zipCode: formData.zipCode.replace(/\\D/g, ''),
        status: 'ativo'
      };
      
      // Remover campo de confirmação da senha antes de enviar
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...finalPayload } = payload;

      console.log(finalPayload);
      const response = await fetch('https://church-app-backend-production.up.railway.app/api/members/', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalPayload)
      });

      if (response.ok) {
        alert('Cadastro realizado com sucesso!');
        // Reset form
        setFormData({
          fullName: '', cpf: '', rg: '', birthDate: '', gender: '', maritalStatus: '',
          phone: '', profession: '', baptized: '', baptismDate: '', zipCode: '',
          address: '', city: '', state: '', email: '', password: '', confirmPassword: ''
        });
        router.push('/home');
      } else {
        const errorData = await response.json();
        alert('Erro no cadastro: ' + (errorData.error || 'Tente novamente'));
      }
    } catch (error) {
      alert('Erro no cadastro: ' + (error as Error).message);
    }
  };

  // Campos divididos em sessões
  const steps = [
    // Sessão 1: Dados Pessoais e Contato
    <>
      <div className={styles.formGroup}>
        <label htmlFor="fullName">Nome completo<span className={styles.required}>*</span></label>
        <input type="text" id="fullName" name="fullName" placeholder="Digite seu nome" value={formData.fullName} onChange={handleInputChange} required />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="cpf">CPF<span className={styles.required}>*</span></label>
        <IMaskInput
          mask="000.000.000-00"
          type="text"
          id="cpf"
          name="cpf"
          placeholder="000.000.000-00"
          value={formData.cpf}
          onAccept={(value: string) => setFormData(prev => ({ ...prev, cpf: value }))}
          required
          className={styles.input}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="rg">RG<span className={styles.required}>*</span></label>
        <IMaskInput
          mask="00.000.000-0"
          type="text"
          id="rg"
          name="rg"
          placeholder="00.000.000-0"
          value={formData.rg}
          onAccept={(value: string) => setFormData(prev => ({ ...prev, rg: value }))}
          required
          className={styles.input}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="birthDate">Data de nascimento<span className={styles.required}>*</span></label>
        <input
          type="date"
          id="birthDate"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label>Gênero<span className={styles.required}>*</span></label>
        <div className={styles.radioGroup}>
          <label><input type="radio" name="gender" value="Masculino" checked={formData.gender === 'Masculino'} onChange={handleInputChange} required /> Masculino</label>
          <label><input type="radio" name="gender" value="Feminino" checked={formData.gender === 'Feminino'} onChange={handleInputChange} required /> Feminino</label>
        </div>
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="maritalStatus">Estado civil<span className={styles.required}>*</span></label>
        <select id="maritalStatus" name="maritalStatus" value={formData.maritalStatus} onChange={handleInputChange} required>
          <option value="">Selecione</option>
          {maritalStatusOptions.map((option: MaritalStatusOption) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="phone">Celular<span className={styles.required}>*</span></label>
        <IMaskInput
          mask="(00) 00000-0000"
          type="text"
          id="phone"
          name="phone"
          placeholder="(00) 00000-0000"
          value={formData.phone}
          onAccept={(value: string) => setFormData(prev => ({ ...prev, phone: value }))}
          required
          className={styles.input}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="profession">Profissão</label>
        <input type="text" id="profession" name="profession" placeholder="Digite sua profissão" value={formData.profession} onChange={handleInputChange} />
      </div>
    </>,
    // Sessão 2: Dados de Igreja/Endereço
    <>
      <div className={`${styles.formGroup} ${styles.radioGroup}`}>
        <label>Batizado?<span className={styles.required}>*</span></label>
        <label><input type="radio" name="baptized" value="true" checked={formData.baptized === 'true'} onChange={handleInputChange} required /> Sim</label>
        <label><input type="radio" name="baptized" value="false" checked={formData.baptized === 'false'} onChange={handleInputChange} required /> Não</label>
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="baptismDate">Data de batismo</label>
        <input
          type="date"
          id="baptismDate"
          name="baptismDate"
          value={formData.baptismDate}
          onChange={handleInputChange}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="zipCode">CEP<span className={styles.required}>*</span></label>
        <IMaskInput
          mask="00000-000"
          type="text"
          id="zipCode"
          name="zipCode"
          placeholder="00000-000"
          value={formData.zipCode}
          onAccept={(value: string) => setFormData(prev => ({ ...prev, zipCode: value }))}
          required
          className={styles.input}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="address">Endereço<span className={styles.required}>*</span></label>
        <input type="text" id="address" name="address" placeholder="Digite seu endereço" value={formData.address} onChange={handleInputChange} required />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="city">Cidade<span className={styles.required}>*</span></label>
        <input type="text" id="city" name="city" placeholder="Digite sua cidade" value={formData.city} onChange={handleInputChange} required />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="state">Estado<span className={styles.required}>*</span></label>
        <input type="text" id="state" name="state" placeholder="Digite seu estado" value={formData.state} onChange={handleInputChange} required />
      </div>
    </>,
    // Sessão 3: Credenciais de Acesso
    <>
      <div className={styles.formGroup}>
        <label htmlFor="email">E-mail<span className={styles.required}>*</span></label>
        <input type="email" id="email" name="email" placeholder="exemplo@email.com" value={formData.email} onChange={handleInputChange} required />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="password">Senha<span className={styles.required}>*</span></label>
        <input type="password" id="password" name="password" placeholder="Digite sua senha" value={formData.password} onChange={handleInputChange} minLength={6} required />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="confirmPassword">Confirmar Senha<span className={styles.required}>*</span></label>
        <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirme sua senha" value={formData.confirmPassword} onChange={handleInputChange} minLength={6} required />
      </div>
    </>
  ];

  return (
    <div className={styles.singup}>
      <Navbar />
      <video
        className={styles.backgroundVideo}
        autoPlay
        muted
        loop
        playsInline
        disablePictureInPicture
        controls={false}
      >
        <source src="/assets/singup.mp4" type="video/mp4" />
      </video>
      <div className={styles.signupForm}>
        <div className={styles.progressBarContainer}>
          <div className={styles.progressBarBg}>
            <div 
              className={styles.progressBarFg} 
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
          <div className={styles.progressLabels}>
            <span className={currentStep === 0 ? styles.active : ''}>Dados Pessoais</span>
            <span className={currentStep === 1 ? styles.active : ''}>Endereço</span>
            <span className={currentStep === 2 ? styles.active : ''}>Acesso</span>
          </div>
        </div>
        <h2>Cadastro de Membro</h2>
        <form ref={formRef} onSubmit={handleSubmit} noValidate>
          {steps[currentStep]}
          {formError && (
            <div className={styles.formError}>
              Preencha todos os campos obrigatórios corretamente antes de avançar.
            </div>
          )}
          <div className={styles.buttonContainer}>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setFormError(false);
                    setCurrentStep(currentStep - 1);
                  }}
                  aria-label="Voltar"
                  className={styles.arrowNavBtn}
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
                    if (!form) return;
                    
                    const currentStepInputs = form.querySelectorAll('input[required], select[required]');
                    let isValid = true;

                    currentStepInputs.forEach(input => {
                      if (!(input as HTMLInputElement).checkValidity()) {
                        isValid = false;
                        (input as HTMLInputElement).reportValidity();
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
                  className={styles.arrowNavBtn}
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

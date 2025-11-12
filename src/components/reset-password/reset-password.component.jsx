import "./reset-password.component.scss";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LockKey, Eye, EyeSlash, CheckCircle } from "@phosphor-icons/react";
import LoadingSpinner from "../loading-spinner/loading-spinner.component";
import FloatingAlert from "../floating-alert/floating-alert.component";
import logoWithoutBackground from '../../assets/logo-without-background.png';
import api from "../../services/api";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [fadingOutErrors, setFadingOutErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ isVisible: false, message: '', type: '' });
  const [passwordStrength, setPasswordStrength] = useState({ strength: 0, message: '' });

  // Verificar se o token foi fornecido
  useEffect(() => {
    if (!token) {
      setAlert({
        isVisible: true,
        message: 'Link inválido. Token não fornecido.',
        type: 'error'
      });
    }
  }, [token]);

  // Função para calcular força da senha
  const calculatePasswordStrength = (password) => {
    if (!password) return { strength: 0, message: '' };

    let strength = 0;
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    if (checks.length) strength += 20;
    if (checks.uppercase) strength += 20;
    if (checks.lowercase) strength += 20;
    if (checks.number) strength += 20;
    if (checks.special) strength += 20;

    let message = '';
    if (strength <= 40) message = 'Fraca';
    else if (strength <= 60) message = 'Média';
    else if (strength <= 80) message = 'Boa';
    else message = 'Forte';

    return { strength, message };
  };

  // Função para remover erro com animação
  const removeErrorWithAnimation = (fieldName) => {
    setFadingOutErrors((prev) => ({ ...prev, [fieldName]: true }));
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
    }, 300);
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

  // Validação de campo individual
  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'password':
        if (!value) {
          error = 'Digite uma senha para continuar.';
        } else if (value.length < 6) {
          error = 'A senha deve ter no mínimo 6 caracteres.';
        }
        break;

      case 'confirmPassword':
        if (!value) {
          error = 'Confirme sua senha.';
        } else if (value !== formData.password) {
          error = 'As senhas não coincidem.';
        }
        break;
    }

    return error;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Atualizar força da senha
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    // Limpa erro do campo ao digitar com animação
    if (fieldErrors[name]) {
      removeErrorWithAnimation(name);
    }

    // Revalidar confirmação de senha se a senha principal mudar
    if (name === 'password' && formData.confirmPassword) {
      const confirmError = validateField('confirmPassword', formData.confirmPassword);
      if (confirmError) {
        setFieldErrors((prev) => ({ ...prev, confirmPassword: confirmError }));
      } else {
        removeErrorWithAnimation('confirmPassword');
      }
    }
  };

  // Validação ao sair do campo
  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);

    if (error) {
      setFieldErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setAlert({
        isVisible: true,
        message: 'Token inválido. Por favor, solicite um novo link.',
        type: 'error'
      });
      return;
    }

    // Validar todos os campos
    const newErrors = {};

    const passwordError = validateField('password', formData.password);
    const confirmPasswordError = validateField('confirmPassword', formData.confirmPassword);

    if (passwordError) newErrors.password = passwordError;
    if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError;

    setFieldErrors(newErrors);

    // Se houver erros, não submeter
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      setIsLoading(true);

      // Chamar API para resetar senha
      await api.post('/api/auth/reset-password', {
        token,
        password: formData.password
      });

      setAlert({
        isVisible: true,
        message: 'Senha criada com sucesso! Redirecionando para o login...',
        type: 'success'
      });

      // Redirecionar para login após 2 segundos
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 2000);

    } catch (err) {
      console.error('Reset password error:', err);
      setIsLoading(false);
      
      // Pegar mensagem amigável do backend (detail)
      let errorMessage = 'Erro ao criar senha. Tente novamente.';
      
      if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      }

      setAlert({
        isVisible: true,
        message: errorMessage,
        type: 'error'
      });
    }
  };

  return (
    <div className="reset-password-page">
      {isLoading && <LoadingSpinner message="Criando sua senha..." />}

      <div className="reset-password-container">
        <div className="reset-password-header">
          <img src={logoWithoutBackground} alt="Zele Church" className="reset-password-logo" />
          <h1>Criar Senha</h1>
          <p>Defina sua senha para acessar a plataforma</p>
        </div>

        <form onSubmit={handleSubmit} className="reset-password-form" noValidate>
          <div className="form-group">
            <label htmlFor="password">Nova Senha</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Digite sua senha"
                value={formData.password}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={fieldErrors.password ? 'error' : ''}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {renderErrorMessage('password')}
            
            {/* Indicador de força da senha */}
            {formData.password && !fieldErrors.password && (
              <div className="password-strength">
                <div className="strength-bar">
                  <div 
                    className={`strength-fill strength-${passwordStrength.message.toLowerCase()}`}
                    style={{ width: `${passwordStrength.strength}%` }}
                  ></div>
                </div>
                <span className={`strength-text strength-${passwordStrength.message.toLowerCase()}`}>
                  Senha {passwordStrength.message}
                </span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Senha</label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Digite a senha novamente"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={fieldErrors.confirmPassword ? 'error' : ''}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showConfirmPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {renderErrorMessage('confirmPassword')}
            
            {/* Indicador de senhas iguais */}
            {formData.confirmPassword && formData.password === formData.confirmPassword && (
              <span className="success-message">
                <CheckCircle size={16} weight="fill" /> As senhas coincidem
              </span>
            )}
          </div>

          <button type="submit" className="reset-password-button" disabled={isLoading || !token}>
            <LockKey size={20} weight="bold" />
            {isLoading ? 'Criando senha...' : 'Criar Senha'}
          </button>
        </form>

        <FloatingAlert
          message={alert.message}
          type={alert.type}
          isVisible={alert.isVisible}
          onClose={() => setAlert({ isVisible: false, message: '', type: '' })}
          duration={5000}
        />

        <div className="reset-password-footer">
          <button
            type="button"
            className="back-home"
            onClick={() => navigate("/login")}
          >
            ← Voltar para Login
          </button>
        </div>
      </div>
    </div>
  );
}

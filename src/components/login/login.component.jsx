import "./login.component.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import authService from "../../services/authService";
import { SignInIcon, EyeIcon, EyeSlashIcon } from "@phosphor-icons/react";
import LoadingSpinner from "../loading-spinner/loading-spinner.component";
import FloatingAlert from "../floating-alert/floating-alert.component";
import logoWithoutBackground from '../../assets/logo-without-background.png';
import { validateEmail, validateRequired } from "../../utils/validators";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [fadingOutErrors, setFadingOutErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ isVisible: false, message: '', type: '' });

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
      case 'email':
        if (!validateRequired(value)) {
          error = 'Digite seu e-mail para acessar o painel.';
        } else if (!validateEmail(value)) {
          error = 'Esse e-mail não parece correto. Pode revisar?';
        }
        break;

      case 'password':
        if (!validateRequired(value)) {
          error = 'Digite sua senha para continuar.';
        } else if (value.length < 6) {
          error = 'A senha deve ter no mínimo 6 caracteres.';
        }
        break;
    }

    return error;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Limpa erro do campo ao digitar com animação
    if (fieldErrors[name]) {
      removeErrorWithAnimation(name);
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

    // Validar todos os campos obrigatórios
    const newErrors = {};

    const emailError = validateField('email', formData.email);
    const passwordError = validateField('password', formData.password);

    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;

    setFieldErrors(newErrors);

    // Se houver erros, não submeter
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      setIsLoading(true);
      console.log('Tentando login com:', formData.email); // Debug

      const response = await authService.login(formData.email, formData.password);

      console.log('Login response completa:', response); // Debug

      // A API retorna { success: true, data: { member, token, refreshToken } }
      const userData = response.data?.member;
      const token = response.data?.token;
      const refreshToken = response.data?.refreshToken;


      // Verificar se temos os dados necessários
      if (!userData || !token) {
        throw new Error('Resposta da API inválida - user ou token não encontrados');
      }

      login(userData, token, refreshToken);

      console.log('Login function chamada, redirecionando...'); // Debug
      console.log('Permissões do usuário:', userData.permissions); // Debug

      setAlert({
        isVisible: true,
        message: 'Login realizado com sucesso! Redirecionando...',
        type: 'success'
      });

      // Redirecionar baseado nas permissões
      // Se tem permissão admin.full, vai para dashboard
      // Caso contrário, vai para perfil
      const isAdmin = userData.permissions?.includes('admin.full');
      const redirectPath = isAdmin ? "/admin/dashboard" : "/admin/profile";

      console.log('É admin?', isAdmin, '- Redirecionando para:', redirectPath); // Debug

      navigate(redirectPath, { replace: true });

    } catch (err) {
      console.error('Login error completo:', err); // Debug
      setIsLoading(false);

      // Pegar mensagem amigável do backend (detail)
      let errorMessage = "Erro ao fazer login. Verifique suas credenciais.";

      if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setAlert({
        isVisible: true,
        message: errorMessage,
        type: 'error'
      });
    }
  };

  return (
    <div className="login-page">
      {isLoading && <LoadingSpinner message="Autenticando..." />}

      <div className="login-container">
        <div className="login-header">
          <img src={logoWithoutBackground} alt="Zele Church" className="login-logo" />
          <h1>Área Administrativa</h1>
          <p>Faça login para acessar o painel</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={fieldErrors.email ? 'error' : ''}
            />
            {renderErrorMessage('email')}
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
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
                {showPassword ? <EyeSlashIcon size={20} /> : <EyeIcon size={20} />}
              </button>
            </div>
            {renderErrorMessage('password')}
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            <SignInIcon size={20} weight="bold" />
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <FloatingAlert
          message={alert.message}
          type={alert.type}
          isVisible={alert.isVisible}
          onClose={() => setAlert({ isVisible: false, message: '', type: '' })}
          duration={5000}
        />

        <div className="login-footer">
          <button
            type="button"
            className="back-home"
            onClick={() => navigate("/home")}
          >
            ← Voltar para Home
          </button>
        </div>
      </div>
    </div>
  );
}

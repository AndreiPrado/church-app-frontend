import "./signup-success.component.scss";
import { useNavigate } from "react-router-dom";
import { CheckCircleIcon, HouseIcon, InstagramLogoIcon, FacebookLogoIcon } from "@phosphor-icons/react";
import logoWithoutBackground from '../../assets/logo-without-background.png';

export default function SignupSuccess() {
  const navigate = useNavigate();

  return (
    <div className="signup-success">
      <div className="success-content">
        <div className="success-icon">
          <CheckCircleIcon size={100} weight="fill" />
        </div>

        <h1>Seu cadastro foi recebido!</h1>

        <div className="success-message">
          <p>
            Seu cadastro está sendo analisado e em breve você receberá um retorno.
          </p>
          <p className="highlight-text">
            Você não chegou aqui por acaso... Deus está conduzindo seus passos.
          </p>
          <p className="cta-text">
            Conheça mais sobre nós ou siga nossas redes sociais!
          </p>
        </div>

        <div className="success-actions">
          <button
            className="icon-btn"
            onClick={() => navigate("/home")}
            aria-label="Voltar para Home"
            title="Voltar para Home"
          >
            <HouseIcon size={32} weight="fill" />
          </button>
          <a
            href="https://www.instagram.com/zelechurch"
            target="_blank"
            rel="noopener noreferrer"
            className="icon-btn icon-btn-instagram"
            aria-label="Instagram"
            title="Siga no Instagram"
          >
            <InstagramLogoIcon size={32} weight="fill" />
          </a>
          <a
            href="https://www.facebook.com/zelechurch"
            target="_blank"
            rel="noopener noreferrer"
            className="icon-btn icon-btn-facebook"
            aria-label="Facebook"
            title="Siga no Facebook"
          >
            <FacebookLogoIcon size={32} weight="fill" />
          </a>
        </div>

        <div className="welcome-footer">
          <img src={logoWithoutBackground} alt="Zele Church" />
          <p>Sinta-se em casa. Essa família também é sua!</p>
        </div>
      </div>
    </div>
  );
}

import "./access-denied.component.scss";
import { useNavigate } from "react-router-dom";
import { Lock, ArrowLeft, House } from "@phosphor-icons/react";
import PropTypes from "prop-types";

export default function AccessDenied({ message, detail, showBackButton = true }) {
  const navigate = useNavigate();

  const defaultMessage = "Ops! Parece que você não tem permissão para acessar esta página.";
  const displayMessage = message || defaultMessage;
  const displayDetail = detail || "Entre em contato com seu líder ou administrador do sistema.";

  return (
    <div className="access-denied">
      <div className="access-denied-content">
        <div className="access-denied-icon">
          <Lock size={70} weight="duotone" />
        </div>

        <h1>Acesso Negado</h1>

        <p className="access-denied-message">{displayMessage}</p>

        <p className="access-denied-tip">
          {displayDetail}
        </p>

        <div className="access-denied-actions">
          {showBackButton && (
            <button
              onClick={() => navigate(-1)}
              className="btn-secondary"
            >
              <ArrowLeft size={20} />
              Voltar
            </button>
          )}

          <button
            onClick={() => navigate("/admin/profile")}
            className="btn-primary"
          >
            <House size={20} />
            Ir para Minha Conta
          </button>
        </div>
      </div>
    </div>
  );
}

AccessDenied.propTypes = {
  message: PropTypes.string,
  detail: PropTypes.string,
  showBackButton: PropTypes.bool,
};

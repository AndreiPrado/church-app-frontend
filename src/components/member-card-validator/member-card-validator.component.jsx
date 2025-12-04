import "./member-card-validator.component.scss";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircleIcon, XCircleIcon, WarningIcon, ArrowLeftIcon } from "@phosphor-icons/react";
import LoadingSpinner from "../loading-spinner/loading-spinner.component";
import authService from "../../services/authService";

/**
 * Componente para validar carteirinha de membro via QR Code
 */
export default function MemberCardValidator() {
  const { memberId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [validationResult, setValidationResult] = useState(null);
  const [error, setError] = useState(null);

  const validateMember = async () => {
    try {
      setLoading(true);
      setError(null);

      // Chamar API de validação
      const result = await authService.validateMemberCard(memberId);
      
      setValidationResult(result);
    } catch (err) {
      console.error('Erro ao validar carteirinha:', err);
      setError(err.message || 'Erro ao validar carteirinha');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    validateMember();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memberId]);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      if (typeof dateString === 'string' && dateString.match(/^\d{4}-\d{2}-\d{2}/)) {
        const [year, month, day] = dateString.split('T')[0].split('-');
        return `${day}/${month}/${year}`;
      }
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="validator-page">
        <LoadingSpinner message="Validando carteirinha..." />
      </div>
    );
  }

  return (
    <div className="validator-page">
      <div className="validator-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeftIcon size={20} />
          Voltar
        </button>

        {error ? (
          <div className="validation-result error">
            <div className="result-icon">
              <XCircleIcon size={80} weight="fill" />
            </div>
            <h1>Erro na Validação</h1>
            <p className="result-message">{error}</p>
            <button className="retry-button" onClick={validateMember}>
              Tentar Novamente
            </button>
          </div>
        ) : validationResult?.valid ? (
          <div className="validation-result success">
            <div className="result-icon">
              <CheckCircleIcon size={80} weight="fill" />
            </div>
            <h1>Carteirinha Válida</h1>
            
            <div className="member-details">
              <div className="detail-row">
                <span className="detail-label">Nome:</span>
                <span className="detail-value">{validationResult.memberName}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Status:</span>
                <span className={`status-badge ${validationResult.status?.toLowerCase()}`}>
                  {validationResult.status}
                </span>
              </div>

              {validationResult.memberNumber && (
                <div className="detail-row">
                  <span className="detail-label">Nº Membro:</span>
                  <span className="detail-value">{validationResult.memberNumber}</span>
                </div>
              )}

              {validationResult.joinedAt && (
                <div className="detail-row">
                  <span className="detail-label">Membro desde:</span>
                  <span className="detail-value">{formatDate(validationResult.joinedAt)}</span>
                </div>
              )}

              {validationResult.expiresAt && (
                <div className="detail-row">
                  <span className="detail-label">Validade:</span>
                  <span className="detail-value">{formatDate(validationResult.expiresAt)}</span>
                </div>
              )}
            </div>

            <div className="validation-info">
              <p>✓ Esta carteirinha é autêntica e está ativa</p>
              <p className="validation-time">
                Validado em: {new Date().toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
        ) : (
          <div className="validation-result invalid">
            <div className="result-icon">
              <WarningIcon size={80} weight="fill" />
            </div>
            <h1>Carteirinha Inválida</h1>
            <p className="result-message">
              {validationResult?.message || 'Esta carteirinha não é válida ou está expirada.'}
            </p>
            
            {validationResult?.reason && (
              <div className="invalid-reason">
                <strong>Motivo:</strong> {validationResult.reason}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

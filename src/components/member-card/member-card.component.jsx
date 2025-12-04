import "./member-card.component.scss";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { QRCodeSVG } from "qrcode.react";
import { DownloadIcon, PrinterIcon, FlipHorizontalIcon } from "@phosphor-icons/react";
import { generateMemberCardPDF } from "../../utils/generateMemberCardPDF";
import zeleIcon from '../../assets/zele_icon.png';

/**
 * Componente de Carteirinha Digital de Membro
 * 
 * @param {Object} props
 * @param {string} props.name - Nome completo do membro
 * @param {string} props.memberId - ID único do membro
 * @param {string} props.memberNumber - Número de identificação do membro
 * @param {string} props.status - Status do membro (ativo, pendente, inativo)
 * @param {string} props.joinedAt - Data de entrada na igreja
 * @param {string} props.expiresAt - Data de expiração da carteirinha
 * @param {string} props.photoUrl - URL da foto do membro
 * @param {string} props.churchName - Nome da igreja
 * @param {string} props.churchLogoUrl - URL do logo da igreja
 * @param {string} props.validationUrl - URL base para validação (opcional)
 */
export default function MemberCard({
  name,
  memberId,
  memberNumber,
  status = "ativo",
  joinedAt,
  expiresAt,
  photoUrl,
  churchName,
  churchLogoUrl,
  validationUrl = `${window.location.origin}/validar-membro`
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  useEffect(() => {
    // Gerar URL do QR Code
    setQrCodeUrl(`${validationUrl}/${memberId}`);
  }, [memberId, validationUrl]);

  // Formatar data para padrão brasileiro
  const formatDate = (dateString) => {
    if (!dateString) return "-";
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

  const getStatusColor = () => {
    switch (status?.toLowerCase()) {
      case 'ativo': return 'status-active';
      case 'pendente': return 'status-pending';
      case 'inativo': return 'status-inactive';
      default: return 'status-active';
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const pdfBlob = await generateMemberCardPDF({
        name,
        memberId,
        memberNumber,
        status,
        joinedAt,
        expiresAt,
        photoUrl,
        churchName,
        churchLogoUrl,
        qrCodeUrl
      });

      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `carteirinha-${memberNumber || memberId.substring(0, 8)}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF da carteirinha');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getInitials = (fullName) => {
    if (!fullName) return '?';
    const names = fullName.trim().split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <div className="member-card-container">
      {/* Ações */}
      <div className="member-card-actions">
        <button onClick={() => setIsFlipped(!isFlipped)} className="action-btn flip-btn">
          <FlipHorizontalIcon size={20} weight="bold" />
          {isFlipped ? 'Ver Frente' : 'Ver Verso'}
        </button>
        <button onClick={handleDownloadPDF} className="action-btn download-btn">
          <DownloadIcon size={20} weight="bold" />
          Baixar PDF
        </button>
        <button onClick={handlePrint} className="action-btn print-btn">
          <PrinterIcon size={20} weight="bold" />
          Imprimir
        </button>
      </div>

      {/* Cartão com Flip 3D */}
      <div className={`card-flip-container ${isFlipped ? 'flipped' : ''}`}>
        {/* FRENTE DO CARTÃO */}
        <div className="member-card card-front">
          {/* Ícone Zele no topo direito */}
          <div className="zele-icon-container">
            <img src={zeleIcon} alt="Zele Church" className="zele-icon" />
          </div>

          {/* Foto Grande à Esquerda e Embaixo */}
          <div className="photo-section">
            {/* Nome da Igreja embaixo da foto */}
            <div className="church-name-top">
              <h3>ZELE CHURCH</h3>
            </div>

            {photoUrl ? (
              <img src={photoUrl} alt={name} className="member-photo-large" />
            ) : (
              <div className="member-photo-placeholder-large">
                {getInitials(name)}
              </div>
            )}
          </div>
        </div>

        {/* VERSO DO CARTÃO */}
        <div className="member-card card-back">
          {/* Header com Nome */}
          <div className="card-back-header">
            <h2 className="member-name-back">{name}</h2>
            <div className="member-number-back">
              <span className="label">Nº Membro:</span>
              <span className="value">{memberNumber || memberId.substring(0, 8).toUpperCase()}</span>
            </div>
          </div>

          {/* Informações do Membro */}
          <div className="member-details-back">
            <div className="detail-row">
              <span className="detail-label">Status:</span>
              <span className={`status-badge-back ${getStatusColor()}`}>
                {status?.toUpperCase()}
              </span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Membro desde:</span>
              <span className="detail-value">{formatDate(joinedAt)}</span>
            </div>

            {expiresAt && (
              <div className="detail-row">
                <span className="detail-label">Validade:</span>
                <span className="detail-value">{formatDate(expiresAt)}</span>
              </div>
            )}
          </div>

          {/* QR Code */}
          <div className="qr-section-back">
            <div className="qr-code-wrapper-back">
              <QRCodeSVG
                value={qrCodeUrl}
                size={100}
                level="H"
                includeMargin={true}
                bgColor="#ffffff"
                fgColor="#000000"
              />
            </div>
            <p className="qr-text">Escaneie para validar</p>
          </div>

          {/* Footer */}
          <div className="card-back-footer">
            <p className="footer-text">Carteirinha pessoal e intransferível</p>
            <p className="footer-id">ID: {memberId.substring(0, 16)}...</p>
          </div>
        </div>
      </div>

      {/* Versão para Impressão (ambos os lados) */}
      <div className="print-only">
        <div className="print-page">
          <div className="member-card card-front">
            <div className="zele-icon-container">
              <img src={zeleIcon} alt="Zele Church" className="zele-icon" />
            </div>
            <div className="photo-section">
              {photoUrl ? (
                <img src={photoUrl} alt={name} className="member-photo-large" />
              ) : (
                <div className="member-photo-placeholder-large">
                  {getInitials(name)}
                </div>
              )}
              <div className="church-name-bottom">
                <h3>ZELE CHURCH</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="print-page page-break">
          <div className="member-card card-back">
            <div className="card-back-header">
              <h2 className="member-name-back">{name}</h2>
              <div className="member-number-back">
                <span className="label">Nº Membro:</span>
                <span className="value">{memberNumber || memberId.substring(0, 8).toUpperCase()}</span>
              </div>
            </div>

            <div className="member-details-back">
              <div className="detail-row">
                <span className="detail-label">Status:</span>
                <span className={`status-badge-back ${getStatusColor()}`}>
                  {status?.toUpperCase()}
                </span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Membro desde:</span>
                <span className="detail-value">{formatDate(joinedAt)}</span>
              </div>

              {expiresAt && (
                <div className="detail-row">
                  <span className="detail-label">Validade:</span>
                  <span className="detail-value">{formatDate(expiresAt)}</span>
                </div>
              )}
            </div>

            <div className="qr-section-back">
              <div className="qr-code-wrapper-back">
                <QRCodeSVG
                  value={qrCodeUrl}
                  size={100}
                  level="H"
                  includeMargin={true}
                  bgColor="#ffffff"
                  fgColor="#000000"
                />
              </div>
              <p className="qr-text">Escaneie para validar</p>
            </div>

            <div className="card-back-footer">
              <p className="footer-text">Carteirinha pessoal e intransferível</p>
              <p className="footer-id">ID: {memberId.substring(0, 16)}...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

MemberCard.propTypes = {
  name: PropTypes.string.isRequired,
  memberId: PropTypes.string.isRequired,
  memberNumber: PropTypes.string,
  status: PropTypes.oneOf(['ativo', 'pendente', 'inativo']),
  joinedAt: PropTypes.string.isRequired,
  expiresAt: PropTypes.string,
  photoUrl: PropTypes.string,
  churchName: PropTypes.string.isRequired,
  churchLogoUrl: PropTypes.string,
  validationUrl: PropTypes.string
};

import PropTypes from 'prop-types';
import { Warning, X } from '@phosphor-icons/react';
import './confirmation-modal.component.scss';

/**
 * Modal de confirmação reutilizável
 */
const ConfirmationModal = ({ 
  isOpen, 
  title, 
  message, 
  confirmText = 'Confirmar', 
  cancelText = 'Cancelar',
  confirmType = 'primary', // 'primary', 'danger', 'warning'
  onConfirm, 
  onCancel 
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div className="confirmation-modal-overlay" onClick={handleBackdropClick}>
      <div className="confirmation-modal">
        <button className="close-button" onClick={onCancel}>
          <X size={24} />
        </button>

        <div className="modal-icon">
          <Warning size={48} weight="duotone" />
        </div>

        <h2 className="modal-title">{title}</h2>
        
        {typeof message === 'string' ? (
          <p className="modal-message">{message}</p>
        ) : (
          <div className="modal-message">{message}</div>
        )}

        <div className="modal-actions">
          <button 
            className="btn-cancel" 
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button 
            className={`btn-confirm btn-${confirmType}`} 
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

ConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  confirmType: PropTypes.oneOf(['primary', 'danger', 'warning']),
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ConfirmationModal;

import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'phosphor-react';
import './floating-alert.component.scss';

const FloatingAlert = ({ message, type, isVisible, onClose, duration = 5000 }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration]);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => {
      onClose();
    }, 300); 
  };

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={24} weight="fill" />;
      case 'error':
        return <XCircle size={24} weight="fill" />;
      default:
        return null;
    }
  };

  return (
    <div className={`floating-alert ${type} ${show ? 'show' : ''}`}>
      <div className="alert-content">
        <div className="alert-icon">
          {getIcon()}
        </div>
        <div className="alert-message">
          {message}
        </div>
        <button className="alert-close" onClick={handleClose}>
          <X size={20} weight="bold" />
        </button>
      </div>
    </div>
  );
};

export default FloatingAlert;

import { useState } from 'react';
import PropTypes from 'prop-types';
import { XIcon, NavigationArrowIcon } from '@phosphor-icons/react';
import './navigation-modal.component.scss';

const NavigationModal = ({ isOpen, onClose, address }) => {
  const [selectedApp, setSelectedApp] = useState(null);

  if (!isOpen) return null;

  const openNavigation = (app) => {
    let url = '';
    const encodedAddress = encodeURIComponent(address);

    switch (app) {
      case 'waze':
        url = `https://waze.com/ul?q=${encodedAddress}`;
        break;
      case 'google':
        url = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
        break;
      case 'apple':
        url = `https://maps.apple.com/?q=${encodedAddress}`;
        break;
      default:
        return;
    }

    window.open(url, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className="navigation-modal-overlay" onClick={onClose}>
      <div className="navigation-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="navigation-modal-close" onClick={onClose}>
          <XIcon size={24} weight="bold" />
        </button>
        
        <div className="navigation-modal-header">
          <NavigationArrowIcon size={48} weight="duotone" />
          <h3>Escolha seu app de navegação</h3>
          <p className="navigation-address">{address}</p>
        </div>

        <div className="navigation-apps">
          <button
            className={`navigation-app ${selectedApp === 'google' ? 'selected' : ''}`}
            onClick={() => openNavigation('google')}
            onMouseEnter={() => setSelectedApp('google')}
            onMouseLeave={() => setSelectedApp(null)}
          >
            <div className="navigation-app-icon google">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 9.5C17.1 9.5 11.5 15.1 11.5 22C11.5 30.5 18.8 38.5 24 38.5C29.2 38.5 36.5 30.5 36.5 22C36.5 15.1 30.9 9.5 24 9.5Z" fill="#4285F4"/>
                <path d="M24 15C21.2 15 19 17.2 19 20C19 22.8 21.2 25 24 25C26.8 25 29 22.8 29 20C29 17.2 26.8 15 24 15Z" fill="#EA4335"/>
              </svg>
            </div>
            <span>Google Maps</span>
          </button>

          <button
            className={`navigation-app ${selectedApp === 'waze' ? 'selected' : ''}`}
            onClick={() => openNavigation('waze')}
            onMouseEnter={() => setSelectedApp('waze')}
            onMouseLeave={() => setSelectedApp(null)}
          >
            <div className="navigation-app-icon waze">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="24" cy="24" r="15" fill="#00D4FF"/>
                <circle cx="20" cy="22" r="2" fill="#fff"/>
                <circle cx="28" cy="22" r="2" fill="#fff"/>
                <path d="M18 28C18 28 20 30 24 30C28 30 30 28 30 28" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span>Waze</span>
          </button>

          <button
            className={`navigation-app ${selectedApp === 'apple' ? 'selected' : ''}`}
            onClick={() => openNavigation('apple')}
            onMouseEnter={() => setSelectedApp('apple')}
            onMouseLeave={() => setSelectedApp(null)}
          >
            <div className="navigation-app-icon apple">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 38C31.732 38 38 31.732 38 24C38 16.268 31.732 10 24 10C16.268 10 10 16.268 10 24C10 31.732 16.268 38 24 38Z" fill="#007AFF"/>
                <path d="M24 14L20 24L24 28L28 24L24 14Z" fill="#fff"/>
                <circle cx="24" cy="30" r="1.5" fill="#fff"/>
              </svg>
            </div>
            <span>Apple Maps</span>
          </button>
        </div>
      </div>
    </div>
  );
};

NavigationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  address: PropTypes.string.isRequired,
};

export default NavigationModal;

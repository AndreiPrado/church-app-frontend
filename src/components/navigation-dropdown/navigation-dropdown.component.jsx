import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import googleMapsIcon from '../../assets/icons/google.svg';
import wazeIcon from '../../assets/icons/waze.svg';
import appleMapsIcon from '../../assets/icons/maps.svg';
import './navigation-dropdown.component.scss';

const NavigationDropdown = ({ isOpen, onClose, address }) => {
  const dropdownRef = useRef(null);
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

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
    <>
      <div className="navigation-dropdown-backdrop" onClick={onClose} />
      <div
        ref={dropdownRef}
        className="navigation-dropdown"
      >
        <div className="navigation-dropdown-header">
          <span>Abrir em:</span>
        </div>

        <div className="navigation-apps">
          <button
            className={`navigation-app ${selectedApp === 'google' ? 'selected' : ''}`}
            onClick={() => openNavigation('google')}
            onMouseEnter={() => setSelectedApp('google')}
            onMouseLeave={() => setSelectedApp(null)}
          >
            <div className="navigation-app-icon google">
              <img src={googleMapsIcon} alt="Google Maps" />
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
              <img src={wazeIcon} alt="Waze" />
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
              <img src={appleMapsIcon} alt="Apple Maps" />
            </div>
            <span>Apple Maps</span>
          </button>
        </div>
      </div>
    </>
  );
};

NavigationDropdown.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  address: PropTypes.string.isRequired,
};

export default NavigationDropdown;

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { UserCircle } from '@phosphor-icons/react';
import authService from '../../services/authService';
import './member-photo.component.scss';

export default function MemberPhoto({ 
  memberId, 
  memberName = 'Membro', 
  size = 64, 
  className = '', 
  fallbackIcon = UserCircle,
  showName = false 
}) {
  const [photoUrl, setPhotoUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const FallbackIcon = fallbackIcon;

  useEffect(() => {
    if (!memberId) {
      setIsLoading(false);
      setHasError(true);
      return;
    }

    const loadPhoto = async () => {
      try {
        setIsLoading(true);
        setHasError(false);
        
        const url = await authService.getMemberPhoto(memberId);
        
        if (url) {
          setPhotoUrl(url);
        } else {
          setHasError(true);
        }
      } catch (error) {
        console.error('Erro ao carregar foto do membro:', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadPhoto();

    // Cleanup: revogar URL temporária quando componente for desmontado
    return () => {
      if (photoUrl) {
        URL.revokeObjectURL(photoUrl);
      }
    };
  }, [memberId, photoUrl]);

  const containerStyle = {
    width: size,
    height: size,
    minWidth: size,
    minHeight: size
  };

  return (
    <div className={`member-photo-container ${className}`}>
      <div className="member-photo" style={containerStyle}>
        {isLoading ? (
          <div className="photo-loading">
            <div className="loading-spinner" style={{ width: size * 0.3, height: size * 0.3 }} />
          </div>
        ) : hasError || !photoUrl ? (
          <FallbackIcon size={size * 0.8} weight="duotone" className="photo-fallback" />
        ) : (
          <img 
            src={photoUrl} 
            alt={memberName}
            className="photo-image"
            onError={() => setHasError(true)}
          />
        )}
      </div>
      {showName && (
        <span className="member-name" style={{ fontSize: size * 0.15 }}>
          {memberName}
        </span>
      )}
    </div>
  );
}

MemberPhoto.propTypes = {
  memberId: PropTypes.string.isRequired,
  memberName: PropTypes.string,
  size: PropTypes.number,
  className: PropTypes.string,
  fallbackIcon: PropTypes.elementType,
  showName: PropTypes.bool
};

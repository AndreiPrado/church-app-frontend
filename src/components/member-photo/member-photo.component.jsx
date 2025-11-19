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
  showName = false,
  hasPhotoUrl = true // Nova prop: indica se o membro tem foto cadastrada
}) {
  const [photoUrl, setPhotoUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(hasPhotoUrl); // Só carrega se houver foto
  const [hasError, setHasError] = useState(false);

  const FallbackIcon = fallbackIcon;

  useEffect(() => {
    // Se não tem memberId OU não tem photoUrl, não faz requisição
    if (!memberId || !hasPhotoUrl) {
      setIsLoading(false);
      setHasError(!hasPhotoUrl); // Marca erro se não tem foto (mostra fallback)
      return;
    }

    let isMounted = true;
    let currentUrl = null;

    const loadPhoto = async () => {
      try {
        setIsLoading(true);
        setHasError(false);
        
        // authService.getMemberPhoto retorna um Blob, não uma URL
        const blob = await authService.getMemberPhoto(memberId);
        
        if (isMounted) {
          if (blob) {
            // Criar blob URL a partir do blob
            const blobUrl = URL.createObjectURL(blob);
            currentUrl = blobUrl;
            setPhotoUrl(blobUrl);
          } else {
            setHasError(true);
          }
        } else if (blob) {
          // Se o componente foi desmontado antes da foto carregar, criar URL só para revogar
          const blobUrl = URL.createObjectURL(blob);
          URL.revokeObjectURL(blobUrl);
        }
      } catch (error) {
        console.error('Erro ao carregar foto do membro:', error);
        if (isMounted) {
          setHasError(true);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadPhoto();

    // Cleanup: revogar URL temporária quando componente for desmontado ou memberId mudar
    return () => {
      isMounted = false;
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }
    };
  }, [memberId, hasPhotoUrl]);

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
  showName: PropTypes.bool,
  hasPhotoUrl: PropTypes.bool
};
